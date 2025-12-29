/**
 * Optimistic State Manager
 * Manages optimistic updates with automatic rollback on failure
 */

import { OptimisticUpdate } from '@/types/realtime';
import { getSocketClient } from './socket-client';

export type OnConfirmCallback<T> = (data: T) => void;
export type OnRevertCallback = () => void;

export class OptimisticStateManager {
  private pendingUpdates: Map<string, OptimisticUpdate> = new Map();
  private defaultTTL = 30000; // 30 seconds

  /**
   * Apply optimistic update
   */
  public applyUpdate<T = any>(
    type: string,
    data: T,
    txId?: string
  ): OptimisticUpdate<T> {
    const id = this.generateId();
    const update: OptimisticUpdate<T> = {
      id,
      type,
      data,
      status: 'pending',
      timestamp: Date.now(),
      expiresAt: Date.now() + this.defaultTTL,
      relatedTxId: txId,
    };

    this.pendingUpdates.set(id, update);

    // Auto-expire if not confirmed
    setTimeout(() => {
      if (this.pendingUpdates.get(id)?.status === 'pending') {
        this.revertUpdate(id);
      }
    }, this.defaultTTL);

    return update;
  }

  /**
   * Confirm optimistic update
   */
  public confirmUpdate(id: string): boolean {
    const update = this.pendingUpdates.get(id);
    if (!update) return false;

    update.status = 'confirmed';
    // Keep confirmed updates for a short time for reference
    setTimeout(() => {
      this.pendingUpdates.delete(id);
    }, 5000);

    return true;
  }

  /**
   * Revert optimistic update
   */
  public revertUpdate(id: string): boolean {
    const update = this.pendingUpdates.get(id);
    if (!update) return false;

    update.status = 'reverted';
    this.pendingUpdates.delete(id);
    return true;
  }

  /**
   * Get pending update by ID
   */
  public getUpdate(id: string): OptimisticUpdate | undefined {
    return this.pendingUpdates.get(id);
  }

  /**
   * Get all pending updates
   */
  public getPendingUpdates(): OptimisticUpdate[] {
    return Array.from(this.pendingUpdates.values()).filter(
      (update) => update.status === 'pending'
    );
  }

  /**
   * Get updates by type
   */
  public getUpdatesByType(type: string): OptimisticUpdate[] {
    return Array.from(this.pendingUpdates.values()).filter(
      (update) => update.type === type && update.status === 'pending'
    );
  }

  /**
   * Find update by transaction ID
   */
  public findByTxId(txId: string): OptimisticUpdate | undefined {
    return Array.from(this.pendingUpdates.values()).find(
      (update) => update.relatedTxId === txId
    );
  }

  /**
   * Execute with optimistic update
   */
  public async executeWithOptimistic<T, R = any>(
    type: string,
    optimisticData: T,
    operation: () => Promise<R>,
    onConfirm?: OnConfirmCallback<T>,
    onRevert?: OnRevertCallback
  ): Promise<{ success: boolean; result?: R; error?: Error }> {
    // Apply optimistic update immediately
    const update = this.applyUpdate(type, optimisticData);

    try {
      // Execute actual operation
      const result = await operation();

      // Extract txId if available
      const txId = (result as any)?.txid || (result as any)?.txId;
      if (txId) {
        update.relatedTxId = txId;
      }

      // Wait for confirmation via WebSocket if txId is available
      if (txId) {
        await this.waitForConfirmation(txId, update.id);
      } else {
        // If no txId, confirm immediately
        this.confirmUpdate(update.id);
      }

      onConfirm?.(optimisticData);
      return { success: true, result };
    } catch (error) {
      // Revert optimistic update on error
      this.revertUpdate(update.id);
      onRevert?.();
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(
    txId: string,
    updateId: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const socketClient = getSocketClient();
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Confirmation timeout'));
      }, this.defaultTTL);

      const cleanup = socketClient.onEvent((event) => {
        if (event.txHash === txId) {
          clearTimeout(timeout);
          cleanup();

          if (event.success) {
            this.confirmUpdate(updateId);
            resolve();
          } else {
            this.revertUpdate(updateId);
            reject(new Error('Transaction failed'));
          }
        }
      });
    });
  }

  /**
   * Clear expired updates
   */
  public clearExpired(): number {
    const now = Date.now();
    let cleared = 0;

    this.pendingUpdates.forEach((update, id) => {
      if (update.expiresAt < now && update.status === 'pending') {
        this.revertUpdate(id);
        cleared++;
      }
    });

    return cleared;
  }

  /**
   * Clear all updates
   */
  public clearAll(): void {
    this.pendingUpdates.clear();
  }

  /**
   * Get statistics
   */
  public getStats() {
    const all = Array.from(this.pendingUpdates.values());
    return {
      total: all.length,
      pending: all.filter((u) => u.status === 'pending').length,
      confirmed: all.filter((u) => u.status === 'confirmed').length,
      reverted: all.filter((u) => u.status === 'reverted').length,
      byType: this.groupByType(all),
    };
  }

  /**
   * Group updates by type
   */
  private groupByType(updates: OptimisticUpdate[]): Record<string, number> {
    return updates.reduce((acc, update) => {
      acc[update.type] = (acc[update.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Generate unique update ID
   */
  private generateId(): string {
    return `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
let optimisticStateManager: OptimisticStateManager | null = null;

/**
 * Get or create optimistic state manager
 */
export function getOptimisticStateManager(): OptimisticStateManager {
  if (!optimisticStateManager) {
    optimisticStateManager = new OptimisticStateManager();
  }
  return optimisticStateManager;
}
