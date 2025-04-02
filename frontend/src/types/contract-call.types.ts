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

/** WriteResult contract call type */
export interface WriteResult {
  success: boolean;
  txId?: string;
  result?: unknown;
  error?: string;
}

/** TxStatus contract call type */
export interface TxStatus {
  success: boolean;
  txId?: string;
  result?: unknown;
  error?: string;
}

/** TxConfirmation contract call type */
export interface TxConfirmation {
  success: boolean;
  txId?: string;
  result?: unknown;
  error?: string;
}
