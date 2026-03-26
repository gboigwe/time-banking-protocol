// blocks-client.ts — Hiro API blocks endpoint client
import { HttpClient } from './http-client';

export class BlocksClient {
  constructor(private readonly http: HttpClient) {}

  async getLatestBlock(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/extended/v1/block/getLatestBlock`);
  }

  async getBlockByHeight(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/extended/v1/block/getBlockByHeight`);
  }

  async getBlockByHash(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/extended/v1/block/getBlockByHash`);
  }

  async getBlockTransactions(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/extended/v1/block/getBlockTransactions`);
  }

  async getBurnBlock(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/extended/v1/block/getBurnBlock`);
  }

  async getBlockList(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/extended/v1/block/getBlockList`);
  }
}
