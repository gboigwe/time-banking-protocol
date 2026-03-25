/**
 * Hiro API Client
 * Typed client for the Hiro Stacks Blockchain API
 */

import type { StacksNetworkClient } from './stacks-network-client';

export interface HiroApiConfig {
  apiKey?: string;
  rateLimitRpm?: number;
}

export interface AccountBalance {
  stx: {
    balance: string;
    total_sent: string;
    total_received: string;
    locked: string;
    unlock_height: number;
    burnchain_lock_height: number;
    burnchain_unlock_height: number;
  };
  fungible_tokens: Record<string, { balance: string; total_sent: string; total_received: string }>;
  non_fungible_tokens: Record<string, { count: string; total_sent: string; total_received: string }>;
}

export interface TransactionListItem {
  tx_id: string;
  tx_type: string;
  tx_status: string;
  block_height?: number;
  burn_block_time?: number;
  sender_address: string;
  fee_rate: string;
  nonce: number;
}

export interface TransactionListResponse {
  limit: number;
  offset: number;
  total: number;
  results: TransactionListItem[];
}

export interface SmartContractEvent {
  event_index: number;
  event_type: string;
  tx_id: string;
  contract_log?: {
    contract_id: string;
    topic: string;
    value: { hex: string; repr: string };
  };
}

export interface SmartContractEventsResponse {
  limit: number;
  offset: number;
  results: SmartContractEvent[];
}

export interface BlockInfo {
  hash: string;
  height: number;
  burn_block_time: number;
  burn_block_time_iso: string;
  txs: string[];
}

export class HiroApiClient {
  private networkClient: StacksNetworkClient;
  private config: Required<HiroApiConfig>;
  private requestQueue: number[] = [];

  constructor(networkClient: StacksNetworkClient, config: HiroApiConfig = {}) {
    this.networkClient = networkClient;
    this.config = {
      apiKey: config.apiKey ?? '',
      rateLimitRpm: config.rateLimitRpm ?? 50,
    };
  }

  async getAccountBalance(address: string): Promise<AccountBalance> {
    const data = await this.get<AccountBalance>(`/v2/accounts/${address}?unanchored=true`);
    return data;
  }

  async getAccountStxBalance(address: string): Promise<bigint> {
    const balance = await this.getAccountBalance(address);
    return BigInt(balance.stx.balance);
  }

  async getAccountTransactions(
    address: string,
    options: { limit?: number; offset?: number; unanchored?: boolean } = {}
  ): Promise<TransactionListResponse> {
    const params = new URLSearchParams({
      limit: String(options.limit ?? 20),
      offset: String(options.offset ?? 0),
      unanchored: String(options.unanchored ?? true),
    });
    return this.get<TransactionListResponse>(`/extended/v1/address/${address}/transactions?${params}`);
  }

  async getTransaction(txId: string): Promise<TransactionListItem> {
    return this.get<TransactionListItem>(`/extended/v1/tx/${txId}`);
  }

  async getSmartContractEvents(
    contractId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<SmartContractEventsResponse> {
    const params = new URLSearchParams({
      limit: String(options.limit ?? 20),
      offset: String(options.offset ?? 0),
    });
    return this.get<SmartContractEventsResponse>(
      `/extended/v1/contract/${contractId}/events?${params}`
    );
  }

  async getLatestBlock(): Promise<BlockInfo> {
    const response = await this.get<{ results: BlockInfo[] }>('/extended/v1/block?limit=1');
    if (!response.results?.[0]) throw new Error('No blocks found');
    return response.results[0];
  }

  async getBlockByHeight(height: number): Promise<BlockInfo> {
    return this.get<BlockInfo>(`/extended/v1/block/by_height/${height}`);
  }

  async callReadOnlyFunction(
    contractAddress: string,
    contractName: string,
    functionName: string,
    args: string[],
    senderAddress: string
  ): Promise<{ okay: boolean; result: string }> {
    return this.post<{ okay: boolean; result: string }>(
      `/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      { sender: senderAddress, arguments: args }
    );
  }

  private buildHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (this.config.apiKey) {
      (headers as Record<string, string>)['x-api-key'] = this.config.apiKey;
    }
    return headers;
  }

  private async get<T>(path: string): Promise<T> {
    const url = `${this.networkClient.getPrimaryEndpoint()}${path}`;
    const response = await fetch(url, { headers: this.buildHeaders() });
    if (!response.ok) {
      throw new Error(`Hiro API GET ${path} failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const url = `${this.networkClient.getPrimaryEndpoint()}${path}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Hiro API POST ${path} failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  }
}

export function createHiroApiClient(
  networkClient: StacksNetworkClient,
  config?: HiroApiConfig
): HiroApiClient {
  return new HiroApiClient(networkClient, config);
}
