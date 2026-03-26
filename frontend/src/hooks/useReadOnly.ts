/**
 * useReadOnly - React hook for calling read-only contract functions
 */

import { useState, useEffect, useCallback, useRef, DependencyList } from 'react';
import { ClarityValue } from '@stacks/transactions';
import {
  ReadOnlyCaller,
  ReadOnlyCallResult,
  createReadOnlyCaller,
} from '../lib/read-only-caller';
import type { StacksNetworkClient } from '../lib/stacks-network-client';

export interface UseReadOnlyOptions {
  skip?: boolean;
  refreshOnMount?: boolean;
  pollIntervalMs?: number;
  deps?: DependencyList;
}

export interface UseReadOnlyState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface UseReadOnlyResult<T> extends UseReadOnlyState<T> {
  refresh: () => Promise<void>;
  caller: ReadOnlyCaller;
}

export function useReadOnly<T = unknown>(
  networkClient: StacksNetworkClient,
  contractAddress: string,
  contractName: string,
  functionName: string,
  functionArgs: ClarityValue[],
  senderAddress: string,
  options: UseReadOnlyOptions = {}
): UseReadOnlyResult<T> {
  const {
    skip = false,
    refreshOnMount = true,
    pollIntervalMs,
    deps = [],
  } = options;

  const callerRef = useRef<ReadOnlyCaller>(createReadOnlyCaller(networkClient));

  const [state, setState] = useState<UseReadOnlyState<T>>({
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const refresh = useCallback(async () => {
    if (skip || !senderAddress || !contractAddress || !contractName) return;

    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await callerRef.current.call<T>({
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        senderAddress,
      });

      if (result.ok) {
        setState({
          data: result.value,
          isLoading: false,
          error: null,
          lastUpdated: Date.now(),
        });
      } else {
        setState(s => ({ ...s, isLoading: false, error: result.error }));
      }
    } catch (e) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Read-only call failed',
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, senderAddress, contractAddress, contractName, functionName, ...deps]);

  useEffect(() => {
    if (refreshOnMount) refresh();
  }, [refresh, refreshOnMount]);

  useEffect(() => {
    if (!pollIntervalMs) return;
    const timer = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(timer);
  }, [refresh, pollIntervalMs]);

  return { ...state, refresh, caller: callerRef.current };
}
