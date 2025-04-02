// contract-call-builder.ts — fluent builder for contract call transactions
import type { ContractCallTxParams, AnchorMode } from './transaction-types';

/** Fluent builder for contract call transactions */
export class ContractCallBuilder {
  private params: Partial<ContractCallTxParams> = {};
