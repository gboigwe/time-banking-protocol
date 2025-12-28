/**
 * Transaction Tracker Hook for Stacks.js v8+
 * React hook for tracking transaction status
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getNetwork } from '@/lib/stacks';
import {
  TransactionTracker,
  TrackedTransaction,
  TransactionStatus,
  createTransactionTracker,
} from '@/lib/transaction-tracker';

export interface UseTransactionTrackerResult {
  track: (txId: string, metadata?: Record<string, unknown>) => void;
  untrack: (txId: string) => void;
  getStatus: (txId: string) => TrackedTransaction | undefined;
  waitFor: (txId: string) => Promise<TrackedTransaction>;
  tracked: TrackedTransaction[];
  pending: TrackedTransaction[];
  completed: TrackedTransaction[];
  clearCompleted: () => void;
}

/**
 * Hook for tracking transaction status
 */
export function useTransactionTracker(): UseTransactionTrackerResult {
  const [tracked, setTracked] = useState<TrackedTransaction[]>([]);
  const trackerRef = useRef<TransactionTracker | null>(null);

  // Initialize tracker
  useEffect(() => {
    const network = getNetwork();
    trackerRef.current = createTransactionTracker({
      network,
      pollInterval: 3000,
      maxAttempts: 20,
      onStatusChange: (tx) => {
        setTracked((prev) => {
          const index = prev.findIndex((t) => t.txId === tx.txId);
          if (index === -1) {
            return [...prev, tx];
          }
          const updated = [...prev];
          updated[index] = tx;
          return updated;
        });
      },
    });

    return () => {
      trackerRef.current?.destroy();
    };
  }, []);

  const track = useCallback(
    (txId: string, metadata?: Record<string, unknown>) => {
      trackerRef.current?.track(txId, metadata);
      const status = trackerRef.current?.getStatus(txId);
      if (status) {
        setTracked((prev) => {
          const exists = prev.some((t) => t.txId === txId);
          return exists ? prev : [...prev, status];
        });
      }
    },
    []
  );

  const untrack = useCallback((txId: string) => {
    trackerRef.current?.untrack(txId);
    setTracked((prev) => prev.filter((t) => t.txId !== txId));
  }, []);

  const getStatus = useCallback((txId: string) => {
    return trackerRef.current?.getStatus(txId);
  }, []);

  const waitFor = useCallback(async (txId: string) => {
    if (!trackerRef.current) {
      throw new Error('Tracker not initialized');
    }
    return trackerRef.current.waitForCompletion(txId);
  }, []);

  const clearCompleted = useCallback(() => {
    trackerRef.current?.clearCompleted();
    setTracked((prev) =>
      prev.filter((tx) => tx.status === TransactionStatus.PENDING)
    );
  }, []);

  const pending = tracked.filter(
    (tx) => tx.status === TransactionStatus.PENDING
  );

  const completed = tracked.filter(
    (tx) =>
      tx.status === TransactionStatus.SUCCESS ||
      tx.status === TransactionStatus.FAILED ||
      tx.status === TransactionStatus.ABORT_BY_POST_CONDITION ||
      tx.status === TransactionStatus.ABORT_BY_RESPONSE
  );

  return {
    track,
    untrack,
    getStatus,
    waitFor,
    tracked,
    pending,
    completed,
    clearCompleted,
  };
}

/**
 * Hook for tracking a single transaction
 */
export function useTransaction(txId?: string) {
  const [transaction, setTransaction] = useState<TrackedTransaction | null>(
    null
  );
  const [isTracking, setIsTracking] = useState(false);

  const tracker = useTransactionTracker();

  useEffect(() => {
    if (txId && !isTracking) {
      setIsTracking(true);
      tracker.track(txId);
    }
  }, [txId, isTracking, tracker]);

  useEffect(() => {
    if (txId) {
      const status = tracker.getStatus(txId);
      if (status) {
        setTransaction(status);
      }
    }
  }, [txId, tracker, tracker.tracked]);

  const reset = useCallback(() => {
    if (txId) {
      tracker.untrack(txId);
      setTransaction(null);
      setIsTracking(false);
    }
  }, [txId, tracker]);

  return {
    transaction,
    isPending: transaction?.status === TransactionStatus.PENDING,
    isSuccess: transaction?.status === TransactionStatus.SUCCESS,
    isFailed:
      transaction?.status === TransactionStatus.FAILED ||
      transaction?.status === TransactionStatus.ABORT_BY_POST_CONDITION ||
      transaction?.status === TransactionStatus.ABORT_BY_RESPONSE,
    reset,
  };
}
