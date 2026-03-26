// contract-call-builder.ts — fluent builder for contract call transactions
import type { ContractCallTxParams, AnchorMode } from './transaction-types';

/** Fluent builder for contract call transactions */
export class ContractCallBuilder {
  private params: Partial<ContractCallTxParams> = {};

  withContractId(address: string, name: string): this {
    this.params.contractAddress = address;
    this.params.contractName = name;
    return this;
  }

  withFunction(name: string): this {
    this.params.functionName = name;
    return this;
  }

  withArgs(args: unknown[]): this {
    this.params.functionArgs = args;
    return this;
  }

  withFee(fee: bigint): this {
    this.params.fee = fee;
    return this;
  }

  withNonce(nonce: number): this {
    this.params.nonce = nonce;
    return this;
  }

  withPostConditions(conditions: unknown[]): this {
    this.params.postConditions = conditions;
    return this;
  }

  withAnchorMode(mode: AnchorMode): this {
    this.params.anchorMode = mode;
    return this;
  }

  build(): ContractCallTxParams {
    if (!this.params.contractAddress) throw new Error('contractAddress is required');
    if (!this.params.contractName) throw new Error('contractName is required');
    if (!this.params.functionName) throw new Error('functionName is required');
    return {
      contractAddress: this.params.contractAddress,
      contractName: this.params.contractName,
      functionName: this.params.functionName,
      functionArgs: this.params.functionArgs ?? [],
      fee: this.params.fee,
      nonce: this.params.nonce,
      anchorMode: this.params.anchorMode ?? 'any',
      postConditions: this.params.postConditions ?? [],
    };
  }
}
