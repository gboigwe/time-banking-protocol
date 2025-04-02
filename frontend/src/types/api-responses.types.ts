// api-responses.types.ts — typed responses for Hiro API endpoints

/** STXBalanceResponse response from Hiro API */
export interface STXBalanceResponse {
  result: unknown;
  error?: string;
  status: number;
}

/** AccountInfoResponse response from Hiro API */
export interface AccountInfoResponse {
  result: unknown;
  error?: string;
  status: number;
}

/** TransactionResponse response from Hiro API */
export interface TransactionResponse {
  result: unknown;
  error?: string;
  status: number;
}
