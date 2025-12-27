/**
 * Transaction Builder Utility for Stacks
 */

import {
  makeContractCall,
  makeSTXTokenTransfer,
  AnchorMode,
  PostConditionMode,
  type ClarityValue,
} from '@stacks/transactions';
import type { StacksTransactionRequest } from '../types';

export class StacksTransactionBuilder {
  private request: Partial<StacksTransactionRequest> = {};

  contractCall(
    contractAddress: string,
    contractName: string,
    functionName: string,
    functionArgs: ClarityValue[]
  ): this {
    this.request = {
      type: 'contract-call',
      contractAddress,
      contractName,
      functionName,
      functionArgs,
    };
    return this;
  }

  tokenTransfer(recipient: string, amount: string, memo?: string): this {
    this.request = {
      type: 'token-transfer',
      recipient,
      amount,
      memo,
    };
    return this;
  }

  setPostConditions(postConditions: any[]): this {
    this.request.postConditions = postConditions;
    return this;
  }

  setNetwork(network: 'mainnet' | 'testnet'): this {
    this.request.network = network;
    return this;
  }

  async build(senderKey: string) {
    const network = this.request.network || 'testnet';

    if (this.request.type === 'contract-call') {
      return makeContractCall({
        contractAddress: this.request.contractAddress!,
        contractName: this.request.contractName!,
        functionName: this.request.functionName!,
        functionArgs: this.request.functionArgs!,
        senderKey,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        postConditions: this.request.postConditions || [],
      });
    }

    if (this.request.type === 'token-transfer') {
      return makeSTXTokenTransfer({
        recipient: this.request.recipient!,
        amount: BigInt(this.request.amount!),
        senderKey,
        network,
        memo: this.request.memo,
        anchorMode: AnchorMode.Any,
      });
    }

    throw new Error(`Unsupported transaction type: ${this.request.type}`);
  }

  getRequest(): StacksTransactionRequest {
    if (!this.request.type || !this.request.network) {
      throw new Error('Transaction not fully configured');
    }
    return this.request as StacksTransactionRequest;
  }
}

export function createTransactionBuilder(): StacksTransactionBuilder {
  return new StacksTransactionBuilder();
}

export default StacksTransactionBuilder;
