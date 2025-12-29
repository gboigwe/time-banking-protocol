/**
 * useOfflineSync Hook
 * React hook for managing offline operations and sync
 */

import { useState, useEffect, useCallback } from 'react';
import { getOfflineQueue } from '@/lib/realtime/offline-queue';
import { OfflineQueueItem, SyncStatus } from '@/types/realtime';

export interface UseOfflineSyncResult {
  isOnline: boolean;
  isSyncing: boolean;
  queuedItems: number;
  lastSync: number | null;
  enqueue: (type: OfflineQueueItem['type'], data: any, priority?: number) => Promise<string>;
  processQueue: () => Promise<number>;
  clearQueue: () => Promise<void>;
  getStats: () => Promise<any>;
  syncStatus: SyncStatus;
}

/**
 * Hook for offline synchronization
 */
export function useOfflineSync(): UseOfflineSyncResult {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [queuedItems, setQueuedItems] = useState(0);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const offlineQueue = getOfflineQueue();

  /**
   * Update queue count
   */
  const updateQueueCount = useCallback(async () => {
    const stats = await offlineQueue.getStats();
    setQueuedItems(stats.total);
  }, [offlineQueue]);

  /**
   * Enqueue item for offline processing
   */
  const enqueue = useCallback(
    async (type: OfflineQueueItem['type'], data: any, priority = 5) => {
      const id = await offlineQueue.enqueue(type, data, priority);
      await updateQueueCount();
      return id;
    },
    [offlineQueue, updateQueueCount]
  );

  /**
   * Process offline queue
   */
  const processQueue = useCallback(async () => {
    if (!isOnline) {
      console.warn('[useOfflineSync] Cannot sync while offline');
      return 0;
    }

    setIsSyncing(true);
    try {
      const processed = await offlineQueue.processQueue();
      setLastSync(Date.now());
      await updateQueueCount();
      return processed;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, offlineQueue, updateQueueCount]);

  /**
   * Clear offline queue
   */
  const clearQueue = useCallback(async () => {
    await offlineQueue.clear();
    await updateQueueCount();
  }, [offlineQueue, updateQueueCount]);

  /**
   * Get queue statistics
   */
  const getStats = useCallback(async () => {
    return offlineQueue.getStats();
  }, [offlineQueue]);

  /**
   * Handle online/offline status
   */
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming online
      processQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [processQueue]);

  /**
   * Initialize offline queue
   */
  useEffect(() => {
    offlineQueue.init().then(() => {
      updateQueueCount();
    });
  }, [offlineQueue, updateQueueCount]);

  /**
   * Periodic sync check
   */
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      if (queuedItems > 0 && !isSyncing) {
        processQueue();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isOnline, queuedItems, isSyncing, processQueue]);

  const syncStatus: SyncStatus = {
    isOnline,
    isSyncing,
    lastSync: lastSync || 0,
    pendingUpdates: 0,
    queuedItems,
    conflicts: 0,
  };

  return {
    isOnline,
    isSyncing,
    queuedItems,
    lastSync,
    enqueue,
    processQueue,
    clearQueue,
    getStats,
    syncStatus,
  };
}
