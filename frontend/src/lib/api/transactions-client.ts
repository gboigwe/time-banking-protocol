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
