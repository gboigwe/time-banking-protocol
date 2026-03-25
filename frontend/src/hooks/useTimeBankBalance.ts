/**
 * useTimeBankBalance - Hook for querying time credit balance from on-chain contract
 */

import { useState, useEffect, useCallback } from 'react';
import { uintCV } from '@stacks/transactions';
import type { ReadOnlyCaller } from '../lib/read-only-caller';

export interface TimeBankBalanceState {
  credits: bigint;
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface UseTimeBankBalanceOptions {
  pollIntervalMs?: number;
  autoRefresh?: boolean;
}

export interface UseTimeBankBalanceResult extends TimeBankBalanceState {
  refresh: () => Promise<void>;
  canAfford: (amount: bigint) => boolean;
}

export function useTimeBankBalance(
  userAddress: string | null | undefined,
  contractAddress: string,
  contractName: string,
  caller: ReadOnlyCaller,
  options: UseTimeBankBalanceOptions = {}
): UseTimeBankBalanceResult {
  const { pollIntervalMs = 30_000, autoRefresh = true } = options;

  const [state, setState] = useState<TimeBankBalanceState>({
    credits: BigInt(0),
    isActive: false,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const refresh = useCallback(async () => {
    if (!userAddress) return;
    setState(s => ({ ...s, isLoading: true, error: null }));

    try {
      const [balanceResult, activeResult] = await Promise.all([
        caller.call<{ value: number }>({
          contractAddress,
          contractName,
          functionName: 'get-user-balance',
          functionArgs: [],
          senderAddress: userAddress,
        }),
        caller.call<boolean>({
          contractAddress,
          contractName,
          functionName: 'is-user-active',
          functionArgs: [],
          senderAddress: userAddress,
        }),
      ]);

      const credits =
        balanceResult.ok
          ? BigInt(
              typeof balanceResult.value === 'object'
                ? (balanceResult.value as any)?.value ?? 0
                : Number(balanceResult.value)
            )
          : BigInt(0);

      const isActive = activeResult.ok
        ? Boolean(
            typeof activeResult.value === 'object'
              ? (activeResult.value as any)?.value
              : activeResult.value
          )
        : false;

      setState({
        credits,
        isActive,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (e) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Balance fetch failed',
      }));
    }
  }, [userAddress, contractAddress, contractName, caller]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh || !userAddress) return;
    const timer = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(timer);
  }, [autoRefresh, userAddress, pollIntervalMs, refresh]);

  const canAfford = useCallback(
    (amount: bigint): boolean => state.credits >= amount,
    [state.credits]
  );

  return { ...state, refresh, canAfford };
}
