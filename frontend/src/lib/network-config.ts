/**
 * Network Configuration Manager for Stacks.js v8+
 * Centralized network configuration and management
 */

import {
  StacksNetwork,
  StacksMainnet,
  StacksTestnet,
  StacksMocknet,
} from '@stacks/network';

export type NetworkType = 'mainnet' | 'testnet' | 'mocknet';

export interface NetworkConfig {
  type: NetworkType;
  network: StacksNetwork;
  apiUrl: string;
  explorerUrl: string;
}

/**
 * Network Configuration Manager
 * Manages network switching and configuration
 */
export class NetworkConfigManager {
  private currentNetwork: NetworkType;
  private customNetworks: Map<string, StacksNetwork> = new Map();

  constructor(initialNetwork?: NetworkType) {
    this.currentNetwork = initialNetwork || this.detectNetwork();
  }

  /**
   * Detect network from environment
   */
  private detectNetwork(): NetworkType {
    const envNetwork = process.env.NEXT_PUBLIC_STACKS_NETWORK;
    if (envNetwork === 'mainnet') return 'mainnet';
    if (envNetwork === 'mocknet') return 'mocknet';
    return 'testnet';
  }

  /**
   * Get current network configuration
   */
  getConfig(): NetworkConfig {
    const network = this.getNetwork();
    return {
      type: this.currentNetwork,
      network,
      apiUrl: network.coreApiUrl,
      explorerUrl: this.getExplorerUrl(),
    };
  }

  /**
   * Get network instance
   */
  getNetwork(): StacksNetwork {
    switch (this.currentNetwork) {
      case 'mainnet':
        return new StacksMainnet();
      case 'mocknet':
        return new StacksMocknet();
      case 'testnet':
      default:
        return new StacksTestnet();
    }
  }

  /**
   * Get network type
   */
  getNetworkType(): NetworkType {
    return this.currentNetwork;
  }

  /**
   * Switch to a different network
   */
  switchNetwork(network: NetworkType): void {
    this.currentNetwork = network;
  }

  /**
   * Add custom network
   */
  addCustomNetwork(name: string, network: StacksNetwork): void {
    this.customNetworks.set(name, network);
  }

  /**
   * Get custom network
   */
  getCustomNetwork(name: string): StacksNetwork | undefined {
    return this.customNetworks.get(name);
  }

  /**
   * Check if network is mainnet
   */
  isMainnet(): boolean {
    return this.currentNetwork === 'mainnet';
  }

  /**
   * Check if network is testnet
   */
  isTestnet(): boolean {
    return this.currentNetwork === 'testnet';
  }

  /**
   * Check if network is mocknet
   */
  isMocknet(): boolean {
    return this.currentNetwork === 'mocknet';
  }

  /**
   * Get explorer URL for current network
   */
  getExplorerUrl(): string {
    switch (this.currentNetwork) {
      case 'mainnet':
        return 'https://explorer.hiro.so';
      case 'testnet':
        return 'https://explorer.hiro.so/?chain=testnet';
      case 'mocknet':
        return 'http://localhost:8000';
      default:
        return 'https://explorer.hiro.so';
    }
  }

  /**
   * Get transaction URL in explorer
   */
  getTxUrl(txId: string): string {
    return `${this.getExplorerUrl()}/txid/${txId}`;
  }

  /**
   * Get address URL in explorer
   */
  getAddressUrl(address: string): string {
    return `${this.getExplorerUrl()}/address/${address}`;
  }

  /**
   * Get contract URL in explorer
   */
  getContractUrl(contractId: string): string {
    return `${this.getExplorerUrl()}/txid/${contractId}`;
  }

  /**
   * Get API base URL
   */
  getApiUrl(): string {
    return this.getNetwork().coreApiUrl.replace('/v2', '');
  }

  /**
   * Check if transaction ID is valid format
   */
  isValidTxId(txId: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(txId);
  }

  /**
   * Check if address is valid format
   */
  isValidAddress(address: string): boolean {
    // Standard principal (starts with SP or SM)
    // Contract principal (contains a period)
    return /^(SP|SM)[0-9A-Z]{38,41}(\.[a-z][a-z0-9-]*)?$/i.test(address);
  }
}

/**
 * Singleton instance for global network configuration
 */
let globalNetworkManager: NetworkConfigManager | null = null;

/**
 * Get or create global network manager
 */
export function getNetworkManager(): NetworkConfigManager {
  if (!globalNetworkManager) {
    globalNetworkManager = new NetworkConfigManager();
  }
  return globalNetworkManager;
}

/**
 * Create a new network manager instance
 */
export function createNetworkManager(
  initialNetwork?: NetworkType
): NetworkConfigManager {
  return new NetworkConfigManager(initialNetwork);
}

/**
 * Network presets for common configurations
 */
export const NetworkPresets = {
  mainnet: {
    type: 'mainnet' as NetworkType,
    network: new StacksMainnet(),
    apiUrl: 'https://api.mainnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so',
  },
  testnet: {
    type: 'testnet' as NetworkType,
    network: new StacksTestnet(),
    apiUrl: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so/?chain=testnet',
  },
  mocknet: {
    type: 'mocknet' as NetworkType,
    network: new StacksMocknet(),
    apiUrl: 'http://localhost:3999',
    explorerUrl: 'http://localhost:8000',
  },
};

/**
 * Utility functions
 */
export const NetworkUtils = {
  /**
   * Get network from string
   */
  fromString(str: string): NetworkType {
    const normalized = str.toLowerCase();
    if (normalized === 'mainnet') return 'mainnet';
    if (normalized === 'mocknet') return 'mocknet';
    return 'testnet';
  },

  /**
   * Format microSTX to STX
   */
  microToSTX(micro: bigint | number): number {
    const amount = typeof micro === 'bigint' ? Number(micro) : micro;
    return amount / 1_000_000;
  },

  /**
   * Format STX to microSTX
   */
  stxToMicro(stx: number): bigint {
    return BigInt(Math.floor(stx * 1_000_000));
  },
};
