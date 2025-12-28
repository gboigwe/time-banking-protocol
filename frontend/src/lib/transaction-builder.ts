/**
 * Modern Transaction Builder for Stacks.js v8+
 * Provides chainable, type-safe transaction construction
 */

import {
  makeContractCall,
  makeSTXTokenTransfer,
  PostCondition,
  StacksTransaction,
  AnchorMode,
  broadcastTransaction,
  TxBroadcastResult,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { ClarityValue } from '@stacks/transactions';

export interface TransactionConfig {
  network: StacksNetwork;
  anchorMode?: AnchorMode;
  fee?: bigint;
  nonce?: bigint;
  postConditions?: PostCondition[];
}

export interface ContractCallConfig extends TransactionConfig {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  senderKey: string;
}

export interface STXTransferConfig extends TransactionConfig {
  recipient: string;
  amount: bigint;
  memo?: string;
  senderKey: string;
}

/**
 * Modern Transaction Builder with v8 APIs
 */
export class TransactionBuilder {
  private config: Partial<TransactionConfig> = {
    anchorMode: AnchorMode.Any,
  };

  /**
   * Set the network for the transaction
   */
  setNetwork(network: StacksNetwork): this {
    this.config.network = network;
    return this;
  }

  /**
   * Set anchor mode
   */
  setAnchorMode(mode: AnchorMode): this {
    this.config.anchorMode = mode;
    return this;
  }

  /**
   * Set transaction fee
   */
  setFee(fee: bigint): this {
    this.config.fee = fee;
    return this;
  }

  /**
   * Set nonce
   */
  setNonce(nonce: bigint): this {
    this.config.nonce = nonce;
    return this;
  }

  /**
   * Add post-conditions
   */
  setPostConditions(postConditions: PostCondition[]): this {
    this.config.postConditions = postConditions;
    return this;
  }

  /**
   * Build a contract call transaction
   */
  async buildContractCall(params: Omit<ContractCallConfig, keyof TransactionConfig>): Promise<StacksTransaction> {
    if (!this.config.network) {
      throw new Error('Network must be set before building transaction');
    }

    return makeContractCall({
      ...params,
      network: this.config.network,
      anchorMode: this.config.anchorMode || AnchorMode.Any,
      fee: this.config.fee,
      nonce: this.config.nonce,
      postConditions: this.config.postConditions || [],
    });
  }

  /**
   * Build an STX transfer transaction
   */
  async buildSTXTransfer(params: Omit<STXTransferConfig, keyof TransactionConfig>): Promise<StacksTransaction> {
    if (!this.config.network) {
      throw new Error('Network must be set before building transaction');
    }

    return makeSTXTokenTransfer({
      ...params,
      network: this.config.network,
      anchorMode: this.config.anchorMode || AnchorMode.Any,
      fee: this.config.fee,
      nonce: this.config.nonce,
      postConditions: this.config.postConditions || [],
    });
  }

  /**
   * Build and broadcast a contract call transaction
   */
  async executeContractCall(params: Omit<ContractCallConfig, keyof TransactionConfig>): Promise<TxBroadcastResult> {
    const transaction = await this.buildContractCall(params);
    return broadcastTransaction({ transaction, network: this.config.network! });
  }

  /**
   * Build and broadcast an STX transfer
   */
  async executeSTXTransfer(params: Omit<STXTransferConfig, keyof TransactionConfig>): Promise<TxBroadcastResult> {
    const transaction = await this.buildSTXTransfer(params);
    return broadcastTransaction({ transaction, network: this.config.network! });
  }

  /**
   * Reset builder to default state
   */
  reset(): this {
    this.config = {
      anchorMode: AnchorMode.Any,
    };
    return this;
  }
}

/**
 * Helper function to create a new transaction builder
 */
export function createTransactionBuilder(): TransactionBuilder {
  return new TransactionBuilder();
}
