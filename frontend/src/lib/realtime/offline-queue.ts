/**
 * Offline Queue System
 * Manages operations when offline and syncs when online
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { OfflineQueueItem } from '@/types/realtime';

interface OfflineDB extends DBSchema {
  queue: {
    key: string;
    value: OfflineQueueItem;
    indexes: { 'by-priority': number; 'by-timestamp': number };
  };
}

export class OfflineQueue {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private syncCallbacks: Set<(item: OfflineQueueItem) => Promise<void>> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupOnlineListeners();
    }
  }

  /**
   * Initialize IndexedDB
   */
  public async init(): Promise<void> {
    this.db = await openDB<OfflineDB>('timebank-offline-queue', 1, {
      upgrade(db) {
        const store = db.createObjectStore('queue', { keyPath: 'id' });
        store.createIndex('by-priority', 'priority');
        store.createIndex('by-timestamp', 'timestamp');
      },
    });
  }

  /**
   * Add item to offline queue
   */
  public async enqueue(
    type: OfflineQueueItem['type'],
    data: any,
    priority = 5,
    maxRetries = 3
  ): Promise<string> {
    if (!this.db) await this.init();

    const item: OfflineQueueItem = {
      id: this.generateId(),
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries,
      priority,
    };

    await this.db!.add('queue', item);
    console.log('[Offline Queue] Item added:', item.id);

    // If online, try to sync immediately
    if (this.isOnline) {
      this.processQueue();
    }

    return item.id;
  }

  /**
   * Get all queued items
   */
  public async getAll(): Promise<OfflineQueueItem[]> {
    if (!this.db) await this.init();
    return this.db!.getAll('queue');
  }

  /**
   * Get items by type
   */
  public async getByType(type: OfflineQueueItem['type']): Promise<OfflineQueueItem[]> {
    const all = await this.getAll();
    return all.filter((item) => item.type === type);
  }

  /**
   * Remove item from queue
   */
  public async dequeue(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('queue', id);
    console.log('[Offline Queue] Item removed:', id);
  }

  /**
   * Process queue (sync when online)
   */
  public async processQueue(): Promise<number> {
    if (!this.isOnline || !this.db) return 0;

    const items = await this.db.getAllFromIndex('queue', 'by-priority');
    let processed = 0;

    for (const item of items) {
      try {
        // Call registered sync callbacks
        for (const callback of this.syncCallbacks) {
          await callback(item);
        }

        // Remove from queue on success
        await this.dequeue(item.id);
        processed++;
      } catch (error) {
        console.error('[Offline Queue] Failed to process item:', item.id, error);

        // Increment retry count
        item.retries++;

        if (item.retries >= item.maxRetries) {
          console.error('[Offline Queue] Max retries reached for:', item.id);
          await this.dequeue(item.id);
        } else {
          // Update item with new retry count
          await this.db!.put('queue', item);
        }
      }
    }

    console.log(`[Offline Queue] Processed ${processed} items`);
    return processed;
  }

  /**
   * Register sync callback
   */
  public onSync(callback: (item: OfflineQueueItem) => Promise<void>): () => void {
    this.syncCallbacks.add(callback);
    return () => {
      this.syncCallbacks.delete(callback);
    };
  }

  /**
   * Clear all items
   */
  public async clear(): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.clear('queue');
    console.log('[Offline Queue] Cleared all items');
  }

  /**
   * Get queue statistics
   */
  public async getStats() {
    const items = await this.getAll();
    return {
      total: items.length,
      byType: {
        transaction: items.filter((i) => i.type === 'transaction').length,
        stateUpdate: items.filter((i) => i.type === 'state-update').length,
        subscription: items.filter((i) => i.type === 'subscription').length,
      },
      oldestItem: Math.min(...items.map((i) => i.timestamp), Date.now()),
      newestItem: Math.max(...items.map((i) => i.timestamp), 0),
      totalRetries: items.reduce((sum, i) => sum + i.retries, 0),
    };
  }

  /**
   * Setup online/offline listeners
   */
  private setupOnlineListeners(): void {
    window.addEventListener('online', () => {
      console.log('[Offline Queue] Network online, processing queue');
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      console.log('[Offline Queue] Network offline');
      this.isOnline = false;
    });
  }

  /**
   * Check if online
   */
  public getIsOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
let offlineQueue: OfflineQueue | null = null;

/**
 * Get or create offline queue instance
 */
export function getOfflineQueue(): OfflineQueue {
  if (!offlineQueue) {
    offlineQueue = new OfflineQueue();
  }
  return offlineQueue;
}
