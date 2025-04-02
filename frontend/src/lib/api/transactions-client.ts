// transactions-client.ts — Hiro API transactions endpoint client
import { HttpClient } from './http-client';

/** TransactionsClient wraps Hiro API transaction endpoints */
export class TransactionsClient {
  constructor(private readonly http: HttpClient) {}
