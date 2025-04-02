// contracts-client.ts — Hiro API contracts endpoint client
import { HttpClient } from './http-client';

export class ContractsClient {
  constructor(private readonly http: HttpClient) {}
