// contracts-client.ts — Hiro API contracts endpoint client
import { HttpClient } from './http-client';

export class ContractsClient {
  constructor(private readonly http: HttpClient) {}

  async getInfo(address: string, name: string): Promise<unknown> {
    return this.http.get(`/extended/v1/contract/${address}.${name}/getInfo`);
  }
