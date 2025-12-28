/**
 * Transaction Status Tracker for Stacks.js v8+
 * Real-time transaction monitoring and status updates
 */

import { StacksNetwork } from '@stacks/network';

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  ABORT_BY_POST_CONDITION = 'abort_by_post_condition',
  ABORT_BY_RESPONSE = 'abort_by_response',
}

export interface TrackedTransaction {
  txId: string;
  status: TransactionStatus;
  startedAt: number;
  completedAt?: number;
  blockHeight?: number;
  blockHash?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface TransactionTrackerConfig {
  network: StacksNetwork;
  pollInterval?: number;
  maxAttempts?: number;
  onStatusChange?: (tx: TrackedTransaction) => void;
}

/**
 * Transaction Tracker
 * Monitors transaction status with polling
 */
export class TransactionTracker {
  private config: Required<TransactionTrackerConfig>;
  private trackedTxs: Map<string, TrackedTransaction> = new Map();
  private pollTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: TransactionTrackerConfig) {
    this.config = {
      pollInterval: 3000,
      maxAttempts: 20,
      onStatusChange: () => {},
      ...config,
    };
  }

  /**
   * Start tracking a transaction
   */
  track(txId: string, metadata?: Record<string, unknown>): void {
    if (this.trackedTxs.has(txId)) {
      return;
    }

    const tx: TrackedTransaction = {
      txId,
      status: TransactionStatus.PENDING,
      startedAt: Date.now(),
      metadata,
    };

    this.trackedTxs.set(txId, tx);
    this.startPolling(txId);
  }

  /**
   * Stop tracking a transaction
   */
  untrack(txId: string): void {
    this.stopPolling(txId);
    this.trackedTxs.delete(txId);
  }

  /**
   * Get transaction status
   */
  getStatus(txId: string): TrackedTransaction | undefined {
    return this.trackedTxs.get(txId);
  }

  /**
   * Get all tracked transactions
   */
  getAllTracked(): TrackedTransaction[] {
    return Array.from(this.trackedTxs.values());
  }

  /**
   * Get pending transactions
   */
  getPending(): TrackedTransaction[] {
    return this.getAllTracked().filter(
      (tx) => tx.status === TransactionStatus.PENDING
    );
  }

  /**
   * Get completed transactions
   */
  getCompleted(): TrackedTransaction[] {
    return this.getAllTracked().filter(
      (tx) =>
        tx.status === TransactionStatus.SUCCESS ||
        tx.status === TransactionStatus.FAILED ||
        tx.status === TransactionStatus.ABORT_BY_POST_CONDITION ||
        tx.status === TransactionStatus.ABORT_BY_RESPONSE
    );
  }

  /**
   * Clear all completed transactions
   */
  clearCompleted(): void {
    const completed = this.getCompleted();
    completed.forEach((tx) => this.untrack(tx.txId));
  }

  /**
   * Wait for transaction to complete
   */
  async waitForCompletion(txId: string): Promise<TrackedTransaction> {
    return new Promise((resolve, reject) => {
      const checkStatus = () => {
        const tx = this.trackedTxs.get(txId);
        if (!tx) {
          reject(new Error('Transaction not tracked'));
          return;
        }

        if (tx.status !== TransactionStatus.PENDING) {
          resolve(tx);
        } else {
          setTimeout(checkStatus, 1000);
        }
      };

      checkStatus();
    });
  }

  /**
   * Start polling for transaction status
   */
  private startPolling(txId: string): void {
    let attempts = 0;

    const poll = async () => {
      attempts++;

      try {
        const status = await this.checkTransactionStatus(txId);
        const tx = this.trackedTxs.get(txId);

        if (!tx) {
          this.stopPolling(txId);
          return;
        }

        const updated: TrackedTransaction = {
          ...tx,
          status: status.status,
          blockHeight: status.blockHeight,
          blockHash: status.blockHash,
          error: status.error,
        };

        if (status.status !== TransactionStatus.PENDING) {
          updated.completedAt = Date.now();
          this.stopPolling(txId);
        }

        this.trackedTxs.set(txId, updated);
        this.config.onStatusChange(updated);

        if (
          status.status === TransactionStatus.PENDING &&
          attempts < this.config.maxAttempts
        ) {
          const timer = setTimeout(poll, this.config.pollInterval);
          this.pollTimers.set(txId, timer);
        } else if (attempts >= this.config.maxAttempts) {
          this.stopPolling(txId);
        }
      } catch (error) {
        console.error(`Error polling transaction ${txId}:`, error);
        if (attempts < this.config.maxAttempts) {
          const timer = setTimeout(poll, this.config.pollInterval);
          this.pollTimers.set(txId, timer);
        }
      }
    };

    poll();
  }

  /**
   * Stop polling for transaction status
   */
  private stopPolling(txId: string): void {
    const timer = this.pollTimers.get(txId);
    if (timer) {
      clearTimeout(timer);
      this.pollTimers.delete(txId);
    }
  }

  /**
   * Check transaction status via API
   */
  private async checkTransactionStatus(txId: string): Promise<{
    status: TransactionStatus;
    blockHeight?: number;
    blockHash?: string;
    error?: string;
  }> {
    const apiUrl = this.config.network.coreApiUrl.replace('/v2', '');
    const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch transaction status: ${response.statusText}`);
    }

    const data = await response.json();

    let status: TransactionStatus;
    switch (data.tx_status) {
      case 'success':
        status = TransactionStatus.SUCCESS;
        break;
      case 'abort_by_post_condition':
        status = TransactionStatus.ABORT_BY_POST_CONDITION;
        break;
      case 'abort_by_response':
        status = TransactionStatus.ABORT_BY_RESPONSE;
        break;
      case 'pending':
      default:
        status = TransactionStatus.PENDING;
        break;
    }

    return {
      status,
      blockHeight: data.block_height,
      blockHash: data.block_hash,
      error: data.tx_result?.repr,
    };
  }

  /**
   * Cleanup all timers
   */
  destroy(): void {
    this.pollTimers.forEach((timer) => clearTimeout(timer));
    this.pollTimers.clear();
    this.trackedTxs.clear();
  }
}

/**
 * Helper function to create a transaction tracker
 */
export function createTransactionTracker(
  config: TransactionTrackerConfig
): TransactionTracker {
  return new TransactionTracker(config);
}
