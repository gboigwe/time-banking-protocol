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

/** ContractResponse response from Hiro API */
export interface ContractResponse {
  result: unknown;
  error?: string;
  status: number;
}

/** BlockResponse response from Hiro API */
export interface BlockResponse {
  result: unknown;
  error?: string;
  status: number;
}

/** NFTResponse response from Hiro API */
export interface NFTResponse {
  result: unknown;
  error?: string;
  status: number;
}

/** FTResponse response from Hiro API */
export interface FTResponse {
  result: unknown;
  error?: string;
  status: number;
}
