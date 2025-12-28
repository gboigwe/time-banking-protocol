/**
 * Transaction Queue Manager for Stacks.js v8+
 * Manages transaction ordering and execution
 */

import {
  StacksTransaction,
  broadcastTransaction,
  TxBroadcastResult,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';

export interface QueuedTransaction {
  id: string;
  transaction: StacksTransaction;
  priority: number;
  metadata?: Record<string, unknown>;
  addedAt: number;
}

export interface QueueResult {
  id: string;
  success: boolean;
  txId?: string;
  result?: TxBroadcastResult;
  error?: Error;
}

export interface QueueConfig {
  network: StacksNetwork;
  maxConcurrent?: number;
  delayBetween?: number;
  onProgress?: (completed: number, total: number) => void;
}

/**
 * Transaction Queue Manager
 * FIFO queue with priority support
 */
export class TransactionQueueManager {
  private queue: QueuedTransaction[] = [];
  private processing = false;
  private results: QueueResult[] = [];
  private config: QueueConfig;
  private currentlyProcessing = 0;

  constructor(config: QueueConfig) {
    this.config = {
      maxConcurrent: 1,
      delayBetween: 0,
      ...config,
    };
  }

  /**
   * Add transaction to queue
   */
  enqueue(
    transaction: StacksTransaction,
    priority = 0,
    metadata?: Record<string, unknown>
  ): string {
    const id = this.generateId();
    const queued: QueuedTransaction = {
      id,
      transaction,
      priority,
      metadata,
      addedAt: Date.now(),
    };

    // Insert based on priority (higher priority first)
    const insertIndex = this.queue.findIndex((t) => t.priority < priority);
    if (insertIndex === -1) {
      this.queue.push(queued);
    } else {
      this.queue.splice(insertIndex, 0, queued);
    }

    return id;
  }

  /**
   * Remove transaction from queue
   */
  dequeue(id: string): boolean {
    const index = this.queue.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.queue.splice(index, 1);
    return true;
  }

  /**
   * Process all queued transactions
   */
  async processQueue(): Promise<QueueResult[]> {
    if (this.processing) {
      throw new Error('Queue is already processing');
    }

    this.processing = true;
    this.results = [];
    const total = this.queue.length;
    let completed = 0;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.config.maxConcurrent!);
      this.currentlyProcessing = batch.length;

      const promises = batch.map(async (queued) => {
        try {
          const result = await broadcastTransaction({
            transaction: queued.transaction,
            network: this.config.network,
          });

          const queueResult: QueueResult = {
            id: queued.id,
            success: !result.error,
            txId: result.txid,
            result,
          };

          this.results.push(queueResult);
          completed++;
          this.config.onProgress?.(completed, total);

          return queueResult;
        } catch (error) {
          const queueResult: QueueResult = {
            id: queued.id,
            success: false,
            error: error instanceof Error ? error : new Error('Unknown error'),
          };

          this.results.push(queueResult);
          completed++;
          this.config.onProgress?.(completed, total);

          return queueResult;
        }
      });

      await Promise.all(promises);

      // Add delay between batches
      if (this.queue.length > 0 && this.config.delayBetween) {
        await this.delay(this.config.delayBetween);
      }

      this.currentlyProcessing = 0;
    }

    this.processing = false;
    return this.results;
  }

  /**
   * Clear the queue
   */
  clear(): void {
    this.queue = [];
    this.results = [];
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queueSize: this.queue.length,
      processing: this.processing,
      currentlyProcessing: this.currentlyProcessing,
      completed: this.results.length,
    };
  }

  /**
   * Get all results
   */
  getResults(): QueueResult[] {
    return this.results;
  }

  /**
   * Get successful results
   */
  getSuccessful(): QueueResult[] {
    return this.results.filter((r) => r.success);
  }

  /**
   * Get failed results
   */
  getFailed(): QueueResult[] {
    return this.results.filter((r) => !r.success);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Helper function to create a transaction queue
 */
export function createTransactionQueue(
  config: QueueConfig
): TransactionQueueManager {
  return new TransactionQueueManager(config);
}
