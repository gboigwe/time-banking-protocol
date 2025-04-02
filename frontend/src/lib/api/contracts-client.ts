// contracts-client.ts — Hiro API contracts endpoint client
import { HttpClient } from './http-client';

export class ContractsClient {
  constructor(private readonly http: HttpClient) {}

  async getInfo(address: string, name: string): Promise<unknown> {
    return this.http.get(`/extended/v1/contract/${address}.${name}/getInfo`);
  }

  async getInterface(address: string, name: string): Promise<unknown> {
    return this.http.get(`/extended/v1/contract/${address}.${name}/getInterface`);
  }

  async getSource(address: string, name: string): Promise<unknown> {
    return this.http.get(`/extended/v1/contract/${address}.${name}/getSource`);
  }

  async getDataMapEntry(address: string, name: string): Promise<unknown> {
    return this.http.get(`/extended/v1/contract/${address}.${name}/getDataMapEntry`);
  }

  async callReadOnly(address: string, name: string): Promise<unknown> {
    return this.http.get(`/extended/v1/contract/${address}.${name}/callReadOnly`);
  }

  async getContractEvents(address: string, name: string): Promise<unknown> {
    return this.http.get(`/extended/v1/contract/${address}.${name}/getContractEvents`);
  }

  async getByTrait(address: string, name: string): Promise<unknown> {
    return this.http.get(`/extended/v1/contract/${address}.${name}/getByTrait`);
  }
}
