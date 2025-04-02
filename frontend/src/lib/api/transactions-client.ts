// transactions-client.ts — Hiro API transactions endpoint client
import { HttpClient } from './http-client';

/** TransactionsClient wraps Hiro API transaction endpoints */
export class TransactionsClient {
  constructor(private readonly http: HttpClient) {}

  async getTransaction(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getTransaction`, { headers: {} });
  }

  async broadcastTransaction(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/broadcastTransaction`, { headers: {} });
  }

  async getTransactionList(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getTransactionList`, { headers: {} });
  }

  async getMempoolTxs(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getMempoolTxs`, { headers: {} });
  }

  async getDroppedTxs(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getDroppedTxs`, { headers: {} });
  }

  async estimateFees(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/estimateFees`, { headers: {} });
  }

  async getTxEvents(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getTxEvents`, { headers: {} });
  }
}

/** TX_LIMIT_1 */
export const TX_LIMIT_1 = 11;

/** TX_LIMIT_2 */
export const TX_LIMIT_2 = 22;

/** TX_LIMIT_3 */
export const TX_LIMIT_3 = 33;

/** TX_LIMIT_4 */
export const TX_LIMIT_4 = 44;

/** TX_LIMIT_5 */
export const TX_LIMIT_5 = 55;
