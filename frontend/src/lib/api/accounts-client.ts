// accounts-client.ts — Hiro API accounts endpoint client
import { HttpClient } from './http-client';

/** Account balance response */
export interface AccountBalanceResponse {
  stx: { balance: string; total_sent: string; total_received: string };
  fungible_tokens: Record<string, { balance: string }>;
  non_fungible_tokens: Record<string, { count: string }>;
}

/** Account nonce response */
export interface AccountNoncesResponse {
  last_executed_tx_nonce: number;
  last_mempool_tx_nonce: number;
  possible_next_nonce: number;
}

/** AccountsClient wraps Hiro API account endpoints */
export class AccountsClient {
  constructor(private readonly http: HttpClient) {}

  async getBalance(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getBalance`;
    return this.http.get(path);
  }

  async getSTXBalance(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getSTXBalance`;
    return this.http.get(path);
  }
