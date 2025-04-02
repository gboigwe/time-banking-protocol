// blocks-client.ts — Hiro API blocks endpoint client
import { HttpClient } from './http-client';

export class BlocksClient {
  constructor(private readonly http: HttpClient) {}
