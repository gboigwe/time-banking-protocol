/**
 * Nonce Manager
 * Manages transaction nonces to prevent double-submission and stuck transactions
 */

import type { StacksNetworkClient } from './stacks-network-client';

export interface NonceInfo {
  possible_next_nonce: number;
  detected_missing_nonces: number[];
  last_executed_tx_nonce: number | null;
}

export interface ManagedNonce {
  address: string;
  nonce: number;
  source: 'api' | 'local' | 'incremented';
  fetchedAt: number;
}

const NONCE_CACHE_TTL_MS = 5_000; // 5 seconds

export class NonceManager {
  private client: StacksNetworkClient;
  private localNonces: Map<string, number> = new Map();
  private cachedNonces: Map<string, { info: NonceInfo; expiresAt: number }> = new Map();
  private pendingCounts: Map<string, number> = new Map();

  constructor(client: StacksNetworkClient) {
    this.client = client;
  }

  async getNextNonce(address: string): Promise<ManagedNonce> {
    const localNonce = this.localNonces.get(address);
    if (localNonce !== undefined) {
      const next = localNonce + 1;
      this.localNonces.set(address, next);
      return { address, nonce: next, source: 'incremented', fetchedAt: Date.now() };
    }

    const info = await this.fetchNonceInfo(address);
    const nonce = info.possible_next_nonce;
    this.localNonces.set(address, nonce);
    return { address, nonce, source: 'api', fetchedAt: Date.now() };
  }

  async peekNextNonce(address: string): Promise<number> {
    const local = this.localNonces.get(address);
    if (local !== undefined) return local + 1;
    const info = await this.fetchNonceInfo(address);
    return info.possible_next_nonce;
  }

  confirmTransaction(address: string, nonce: number): void {
    const current = this.localNonces.get(address) ?? -1;
    if (nonce >= current) {
      this.localNonces.set(address, nonce);
    }
    const pending = this.pendingCounts.get(address) ?? 0;
    this.pendingCounts.set(address, Math.max(0, pending - 1));
    // Invalidate cache after confirmation
    this.cachedNonces.delete(address);
  }

  rejectTransaction(address: string, nonce: number): void {
    const current = this.localNonces.get(address);
    if (current === nonce) {
      this.localNonces.set(address, nonce - 1);
    }
    const pending = this.pendingCounts.get(address) ?? 0;
    this.pendingCounts.set(address, Math.max(0, pending - 1));
  }

  resetNonce(address: string): void {
    this.localNonces.delete(address);
    this.cachedNonces.delete(address);
  }

  getPendingCount(address: string): number {
    return this.pendingCounts.get(address) ?? 0;
  }

  async getMissingNonces(address: string): Promise<number[]> {
    const info = await this.fetchNonceInfo(address);
    return info.detected_missing_nonces;
  }

  private async fetchNonceInfo(address: string): Promise<NonceInfo> {
    const cached = this.cachedNonces.get(address);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.info;
    }

    const endpoint = this.client.getPrimaryEndpoint();
    const url = `${endpoint}/v2/accounts/${address}?unanchored=true`;
    const response = await fetch(url);

    if (!response.ok) {
      // Return safe defaults
      return { possible_next_nonce: 0, detected_missing_nonces: [], last_executed_tx_nonce: null };
    }

    const data = await response.json();
    const info: NonceInfo = {
      possible_next_nonce: data.nonce ?? 0,
      detected_missing_nonces: [],
      last_executed_tx_nonce: data.nonce ? data.nonce - 1 : null,
    };

    this.cachedNonces.set(address, {
      info,
      expiresAt: Date.now() + NONCE_CACHE_TTL_MS,
    });

    return info;
  }
}

export function createNonceManager(client: StacksNetworkClient): NonceManager {
  return new NonceManager(client);
}
