// transaction-types.ts — TypeScript interfaces for Stacks transactions

/** Transaction anchor mode */
export type AnchorMode = 'onChainOnly' | 'offChainOnly' | 'any';

/** Contract call transaction parameters */
export interface ContractCallTxParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: unknown[];
  fee?: bigint;
  nonce?: number;
  anchorMode?: AnchorMode;
  postConditions?: unknown[];
}

/** STX transfer transaction parameters */
export interface STXTransferTxParams {
  recipient: string;
  amount: bigint;
  memo?: string;
  fee?: bigint;
  nonce?: number;
  anchorMode?: AnchorMode;
}

/** Transaction options shared by all tx types */
export interface TxOptions {
  sponsored?: boolean;
  sponsorNonce?: number;
  senderKey?: string;
}

/** Transaction result status */
export type TxStatus = 'success' | 'abort_by_response' | 'abort_by_post_condition' | 'pending';

/** Transaction result */
export interface TxResult {
  txId: string;
  status: TxStatus;
  blockHeight?: number;
  fee: bigint;
}
