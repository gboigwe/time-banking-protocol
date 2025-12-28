/**
 * Batch Transaction Support for Stacks.js v8+
 * Execute multiple transactions sequentially or in parallel
 */

import {
  StacksTransaction,
  broadcastTransaction,
  TxBroadcastResult,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';

export interface BatchTransactionResult {
  txId: string;
  success: boolean;
  transaction: StacksTransaction;
  result?: TxBroadcastResult;
  error?: Error;
}

export interface BatchExecutionOptions {
  network: StacksNetwork;
  sequential?: boolean;
  stopOnError?: boolean;
  delayBetween?: number; // milliseconds
}

/**
 * Batch Transaction Manager
 * Handles execution of multiple transactions with various strategies
 */
export class BatchTransactionManager {
  private transactions: StacksTransaction[] = [];
  private results: BatchTransactionResult[] = [];

  /**
   * Add a transaction to the batch
   */
  add(transaction: StacksTransaction): this {
    this.transactions.push(transaction);
    return this;
  }

  /**
   * Add multiple transactions to the batch
   */
  addMultiple(transactions: StacksTransaction[]): this {
    this.transactions.push(...transactions);
    return this;
  }

  /**
   * Execute all transactions sequentially
   */
  async executeSequential(options: BatchExecutionOptions): Promise<BatchTransactionResult[]> {
    this.results = [];

    for (const transaction of this.transactions) {
      try {
        // Add delay if specified
        if (options.delayBetween && this.results.length > 0) {
          await this.delay(options.delayBetween);
        }

        const result = await broadcastTransaction({
          transaction,
          network: options.network,
        });

        this.results.push({
          txId: result.txid,
          success: !result.error,
          transaction,
          result,
        });

        // Stop on error if configured
        if (options.stopOnError && result.error) {
          break;
        }
      } catch (error) {
        this.results.push({
          txId: '',
          success: false,
          transaction,
          error: error instanceof Error ? error : new Error('Unknown error'),
        });

        if (options.stopOnError) {
          break;
        }
      }
    }

    return this.results;
  }

  /**
   * Execute all transactions in parallel
   */
  async executeParallel(options: BatchExecutionOptions): Promise<BatchTransactionResult[]> {
    this.results = [];

    const promises = this.transactions.map(async (transaction) => {
      try {
        const result = await broadcastTransaction({
          transaction,
          network: options.network,
        });

        return {
          txId: result.txid,
          success: !result.error,
          transaction,
          result,
        };
      } catch (error) {
        return {
          txId: '',
          success: false,
          transaction,
          error: error instanceof Error ? error : new Error('Unknown error'),
        };
      }
    });

    this.results = await Promise.all(promises);
    return this.results;
  }

  /**
   * Execute with chosen strategy
   */
  async execute(options: BatchExecutionOptions): Promise<BatchTransactionResult[]> {
    if (options.sequential) {
      return this.executeSequential(options);
    } else {
      return this.executeParallel(options);
    }
  }

  /**
   * Get all results
   */
  getResults(): BatchTransactionResult[] {
    return this.results;
  }

  /**
   * Get successful transactions
   */
  getSuccessful(): BatchTransactionResult[] {
    return this.results.filter((r) => r.success);
  }

  /**
   * Get failed transactions
   */
  getFailed(): BatchTransactionResult[] {
    return this.results.filter((r) => !r.success);
  }

  /**
   * Clear all transactions
   */
  clear(): this {
    this.transactions = [];
    this.results = [];
    return this;
  }

  /**
   * Get transaction count
   */
  count(): number {
    return this.transactions.length;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Helper function to create a batch transaction manager
 */
export function createBatchManager(): BatchTransactionManager {
  return new BatchTransactionManager();
}
