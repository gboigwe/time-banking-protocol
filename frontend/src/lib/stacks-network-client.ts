/**
 * Stacks Network Client
 * Multi-network client with automatic failover and health checks
 */

import { StacksMainnet, StacksTestnet, StacksMocknet } from '@stacks/network';

export type SupportedNetwork = 'mainnet' | 'testnet' | 'devnet' | 'mocknet';

export interface NetworkEndpoint {
  url: string;
  priority: number;
  healthy: boolean;
  lastChecked: number;
  latencyMs?: number;
}

export interface NetworkClientConfig {
  network: SupportedNetwork;
  endpoints?: string[];
  healthCheckIntervalMs?: number;
  timeoutMs?: number;
  retries?: number;
}

export interface NetworkInfo {
  network: SupportedNetwork;
  chainId: number;
  burnBlockHeight: number;
  stacksTipHeight: number;
  serverVersion: string;
}

const DEFAULT_ENDPOINTS: Record<SupportedNetwork, string[]> = {
  mainnet: [
    'https://api.hiro.so',
    'https://stacks-node-api.mainnet.stacks.co',
  ],
  testnet: [
    'https://api.testnet.hiro.so',
    'https://stacks-node-api.testnet.stacks.co',
  ],
  devnet: ['http://localhost:3999'],
  mocknet: ['http://localhost:3999'],
};

const CHAIN_IDS: Record<SupportedNetwork, number> = {
  mainnet: 1,
  testnet: 2147483648,
  devnet: 2147483648,
  mocknet: 2147483648,
};

export class StacksNetworkClient {
  private config: Required<NetworkClientConfig>;
  private endpoints: NetworkEndpoint[];
  private healthCheckTimer?: ReturnType<typeof setInterval>;

  constructor(config: NetworkClientConfig) {
    this.config = {
      network: config.network,
      endpoints: config.endpoints ?? DEFAULT_ENDPOINTS[config.network],
      healthCheckIntervalMs: config.healthCheckIntervalMs ?? 60_000,
      timeoutMs: config.timeoutMs ?? 10_000,
      retries: config.retries ?? 3,
    };

    this.endpoints = this.config.endpoints.map((url, i) => ({
      url,
      priority: i,
      healthy: true,
      lastChecked: 0,
    }));
  }

  getStacksNetwork() {
    switch (this.config.network) {
      case 'mainnet':
        return new StacksMainnet({ url: this.getPrimaryEndpoint() });
      case 'testnet':
        return new StacksTestnet({ url: this.getPrimaryEndpoint() });
      default:
        return new StacksMocknet({ url: this.getPrimaryEndpoint() });
    }
  }

  getPrimaryEndpoint(): string {
    const healthy = this.endpoints
      .filter(e => e.healthy)
      .sort((a, b) => (a.latencyMs ?? Infinity) - (b.latencyMs ?? Infinity));

    return (healthy[0] ?? this.endpoints[0]).url;
  }

  getChainId(): number {
    return CHAIN_IDS[this.config.network];
  }

  getNetwork(): SupportedNetwork {
    return this.config.network;
  }

  async fetchNetworkInfo(): Promise<NetworkInfo> {
    const url = this.getPrimaryEndpoint();
    const response = await this.fetchWithTimeout(`${url}/v2/info`);
    if (!response.ok) throw new Error(`Network info fetch failed: ${response.status}`);
    const data = await response.json();
    return {
      network: this.config.network,
      chainId: data.network_id ?? CHAIN_IDS[this.config.network],
      burnBlockHeight: data.burn_block_height ?? 0,
      stacksTipHeight: data.stacks_tip_height ?? 0,
      serverVersion: data.server_version ?? 'unknown',
    };
  }

  async checkEndpointHealth(endpoint: NetworkEndpoint): Promise<boolean> {
    try {
      const start = Date.now();
      const response = await this.fetchWithTimeout(`${endpoint.url}/v2/info`, 5_000);
      endpoint.latencyMs = Date.now() - start;
      endpoint.healthy = response.ok;
      endpoint.lastChecked = Date.now();
      return response.ok;
    } catch {
      endpoint.healthy = false;
      endpoint.lastChecked = Date.now();
      return false;
    }
  }

  startHealthChecks(): void {
    this.healthCheckTimer = setInterval(async () => {
      await Promise.all(this.endpoints.map(e => this.checkEndpointHealth(e)));
    }, this.config.healthCheckIntervalMs);
  }

  stopHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
  }

  getEndpointStatus(): NetworkEndpoint[] {
    return [...this.endpoints];
  }

  private async fetchWithTimeout(url: string, timeoutMs?: number): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      timeoutMs ?? this.config.timeoutMs
    );
    try {
      return await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }
}

export function createNetworkClient(
  network: SupportedNetwork,
  options?: Partial<NetworkClientConfig>
): StacksNetworkClient {
  return new StacksNetworkClient({ network, ...options });
}
