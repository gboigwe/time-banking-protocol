// contract-call.types.ts — contract call result types

/** ContractCallResult contract call type */
export interface ContractCallResult {
  success: boolean;
  txId?: string;
  result?: unknown;
  error?: string;
}

/** ReadOnlyResult contract call type */
export interface ReadOnlyResult {
  success: boolean;
  txId?: string;
  result?: unknown;
  error?: string;
}
