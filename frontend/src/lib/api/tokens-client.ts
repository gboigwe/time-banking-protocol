// tokens-client.ts — Hiro API tokens endpoint client
import { HttpClient } from './http-client';

export class TokensClient {
  constructor(private readonly http: HttpClient) {}

  async getFTInfo(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/metadata/v1/tokens/getFTInfo`);
  }

  async getNFTInfo(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/metadata/v1/tokens/getNFTInfo`);
  }

  async getNFTEvents(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/metadata/v1/tokens/getNFTEvents`);
  }

  async getNFTHoldings(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/metadata/v1/tokens/getNFTHoldings`);
  }

  async getFTHoldings(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/metadata/v1/tokens/getFTHoldings`);
  }

  async getTokenMetadata(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/metadata/v1/tokens/getTokenMetadata`);
  }
}
