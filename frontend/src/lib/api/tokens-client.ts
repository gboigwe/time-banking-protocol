// tokens-client.ts — Hiro API tokens endpoint client
import { HttpClient } from './http-client';

export class TokensClient {
  constructor(private readonly http: HttpClient) {}
