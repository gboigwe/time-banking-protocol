// transaction-types.ts — TypeScript interfaces for Stacks transactions

/** Transaction anchor mode */
export type AnchorMode = 'onChainOnly' | 'offChainOnly' | 'any';

/** Contract call transaction parameters */
export interface ContractCallTxParams {
  contractAddress: string;
  contractName: string;
