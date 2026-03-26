/**
 * useFees - React hook for transaction fee estimation
 */

import { useState, useCallback, useRef } from 'react';
import {
  FeeEstimator,
  FeeEstimate,
  FeeLevel,
  createFeeEstimator,
} from '../lib/fee-estimator';
import type { StacksNetworkClient } from '../lib/stacks-network-client';

export interface FeesState {
  estimate: FeeEstimate | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseFeesResult extends FeesState {
  estimateFee: (transactionSize?: number) => Promise<FeeEstimate>;
  estimateContractCallFee: (
    contractAddress: string,
    contractName: string,
    functionName: string
  ) => Promise<FeeEstimate>;
  getFeeAtLevel: (level: FeeLevel) => bigint;
  clearCache: () => void;
  estimator: FeeEstimator;
}

export function useFees(
  networkClient: StacksNetworkClient,
  externalEstimator?: FeeEstimator
): UseFeesResult {
  const estimatorRef = useRef<FeeEstimator>(
    externalEstimator ?? createFeeEstimator(networkClient)
  );

  const [state, setState] = useState<FeesState>({
    estimate: null,
    isLoading: false,
    error: null,
  });

  const estimateFee = useCallback(async (transactionSize?: number): Promise<FeeEstimate> => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const estimate = await estimatorRef.current.estimateFee({
        transactionSize,
      });
      setState({ estimate, isLoading: false, error: null });
      return estimate;
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Fee estimation failed';
      setState(s => ({ ...s, isLoading: false, error }));
      throw e;
    }
  }, []);

  const estimateContractCallFee = useCallback(
    async (
      contractAddress: string,
      contractName: string,
      functionName: string
    ): Promise<FeeEstimate> => {
      setState(s => ({ ...s, isLoading: true, error: null }));
      try {
        const estimate = await estimatorRef.current.estimateContractCallFee(
          contractAddress,
          contractName,
          functionName
        );
        setState({ estimate, isLoading: false, error: null });
        return estimate;
      } catch (e) {
        const error = e instanceof Error ? e.message : 'Fee estimation failed';
        setState(s => ({ ...s, isLoading: false, error }));
        throw e;
      }
    },
    []
  );

  const getFeeAtLevel = useCallback(
    (level: FeeLevel): bigint => {
      if (!state.estimate) return BigInt(5000);
      return estimatorRef.current.getFeeAtLevel(state.estimate, level);
    },
    [state.estimate]
  );

  const clearCache = useCallback(() => {
    estimatorRef.current.clearCache();
  }, []);

  return {
    ...state,
    estimateFee,
    estimateContractCallFee,
    getFeeAtLevel,
    clearCache,
    estimator: estimatorRef.current,
  };
}
