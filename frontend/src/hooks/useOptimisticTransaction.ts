/**
 * Optimistic Transaction Hook for Stacks.js v8+
 * Provides optimistic UI updates for better UX
 */

import { useState, useCallback } from 'react';
import {
  StacksTransaction,
  broadcastTransaction,
  TxBroadcastResult,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';

export interface OptimisticState<T> {
  data: T | null;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txId: string | null;
}

export interface OptimisticTransactionConfig<T> {
  network: StacksNetwork;
  onOptimisticUpdate: (data: T) => void;
  onSuccess?: (result: TxBroadcastResult, data: T) => void;
  onError?: (error: Error) => void;
  onRevert?: () => void;
}

/**
 * Hook for optimistic transaction updates
 */
export function useOptimisticTransaction<T>(
  config: OptimisticTransactionConfig<T>
) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: null,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    txId: null,
  });

  const execute = useCallback(
    async (transaction: StacksTransaction, optimisticData: T) => {
      // Set pending state and apply optimistic update
      setState({
        data: optimisticData,
        isPending: true,
        isSuccess: false,
        isError: false,
        error: null,
        txId: null,
      });

      config.onOptimisticUpdate(optimisticData);

      try {
        // Broadcast transaction
        const result = await broadcastTransaction({
          transaction,
          network: config.network,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        // Update to success state
        setState({
          data: optimisticData,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
          txId: result.txid,
        });

        config.onSuccess?.(result, optimisticData);

        return { success: true, result };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');

        // Revert optimistic update
        setState({
          data: null,
          isPending: false,
          isSuccess: false,
          isError: true,
          error: err,
          txId: null,
        });

        config.onRevert?.();
        config.onError?.(err);

        return { success: false, error: err };
      }
    },
    [config]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      txId: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
