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

  async getNonces(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getNonces`;
    return this.http.get(path);
  }

  async getTransactions(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getTransactions`;
    return this.http.get(path);
  }

  async getAssets(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getAssets`;
    return this.http.get(path);
  }

  async getInboundTransactions(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getInboundTransactions`;
    return this.http.get(path);
  }

  async getAccountInfo(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getAccountInfo`;
    return this.http.get(path);
  }
}

/** ACCOUNT_LIMIT_1 */
export const ACCOUNT_LIMIT_1 = 11;

/** ACCOUNT_LIMIT_2 */
export const ACCOUNT_LIMIT_2 = 22;

/** ACCOUNT_LIMIT_3 */
export const ACCOUNT_LIMIT_3 = 33;

/** ACCOUNT_LIMIT_4 */
export const ACCOUNT_LIMIT_4 = 44;

/** ACCOUNT_LIMIT_5 */
export const ACCOUNT_LIMIT_5 = 55;

/** ACCOUNT_LIMIT_6 */
export const ACCOUNT_LIMIT_6 = 66;

/** ACCOUNT_LIMIT_7 */
export const ACCOUNT_LIMIT_7 = 77;

/** ACCOUNT_LIMIT_8 */
export const ACCOUNT_LIMIT_8 = 88;

/** ACCOUNT_LIMIT_9 */
export const ACCOUNT_LIMIT_9 = 99;

/** ACCOUNT_LIMIT_10 */
export const ACCOUNT_LIMIT_10 = 110;

/** ACCOUNT_LIMIT_11 */
export const ACCOUNT_LIMIT_11 = 121;

/** ACCOUNT_LIMIT_12 */
export const ACCOUNT_LIMIT_12 = 132;

/** ACCOUNT_LIMIT_13 */
export const ACCOUNT_LIMIT_13 = 143;

/** ACCOUNT_LIMIT_14 */
export const ACCOUNT_LIMIT_14 = 154;

/** ACCOUNT_LIMIT_15 */
export const ACCOUNT_LIMIT_15 = 165;

/** ACCOUNT_LIMIT_16 */
export const ACCOUNT_LIMIT_16 = 176;

/** ACCOUNT_LIMIT_17 */
export const ACCOUNT_LIMIT_17 = 187;

/** ACCOUNT_LIMIT_18 */
export const ACCOUNT_LIMIT_18 = 198;

/** ACCOUNT_LIMIT_19 */
export const ACCOUNT_LIMIT_19 = 209;

/** ACCOUNT_LIMIT_20 */
export const ACCOUNT_LIMIT_20 = 220;

/** ACCOUNT_LIMIT_21 */
export const ACCOUNT_LIMIT_21 = 231;

/** ACCOUNT_LIMIT_22 */
export const ACCOUNT_LIMIT_22 = 242;

/** ACCOUNT_LIMIT_23 */
export const ACCOUNT_LIMIT_23 = 253;

/** ACCOUNT_LIMIT_24 */
export const ACCOUNT_LIMIT_24 = 264;

/** ACCOUNT_LIMIT_25 */
export const ACCOUNT_LIMIT_25 = 275;

/** ACCOUNT_LIMIT_26 */
export const ACCOUNT_LIMIT_26 = 286;

/** ACCOUNT_LIMIT_27 */
export const ACCOUNT_LIMIT_27 = 297;

/** ACCOUNT_LIMIT_28 */
export const ACCOUNT_LIMIT_28 = 308;

/** ACCOUNT_LIMIT_29 */
export const ACCOUNT_LIMIT_29 = 319;
