// accounts-client.ts — Hiro API accounts endpoint client
import { HttpClient } from './http-client';

/** Account balance response */
export interface AccountBalanceResponse {
  stx: { balance: string; total_sent: string; total_received: string };
  fungible_tokens: Record<string, { balance: string }>;
  non_fungible_tokens: Record<string, { count: string }>;
}
