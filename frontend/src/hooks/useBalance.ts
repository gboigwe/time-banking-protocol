/**
 * useBalance - React hook for Stacks account balance
 */

import { useState, useEffect, useCallback } from 'react';
import { HiroApiClient } from '../lib/hiro-api-client';
import type { AccountBalance } from '../lib/hiro-api-client';

export interface BalanceState {
  stxBalance: bigint;
  lockedStxBalance: bigint;
  fungibleTokens: Record<string, bigint>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface UseBalanceOptions {
  pollIntervalMs?: number;
  autoRefresh?: boolean;
}

export interface UseBalanceResult extends BalanceState {
  refresh: () => Promise<void>;
  getTokenBalance: (tokenId: string) => bigint;
}

const INITIAL_STATE: BalanceState = {
  stxBalance: BigInt(0),
  lockedStxBalance: BigInt(0),
  fungibleTokens: {},
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export function useBalance(
  address: string | null | undefined,
  apiClient: HiroApiClient,
  options: UseBalanceOptions = {}
): UseBalanceResult {
  const { pollIntervalMs = 30_000, autoRefresh = true } = options;
  const [state, setState] = useState<BalanceState>(INITIAL_STATE);

  const refresh = useCallback(async () => {
    if (!address) {
      setState(INITIAL_STATE);
      return;
    }

    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const balance = await apiClient.getAccountBalance(address);
      setState({
        stxBalance: BigInt(balance.stx.balance),
        lockedStxBalance: BigInt(balance.stx.locked),
        fungibleTokens: Object.fromEntries(
          Object.entries(balance.fungible_tokens).map(([k, v]) => [k, BigInt(v.balance)])
        ),
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
  }, [address, apiClient]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh || !address) return;
    const timer = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(timer);
  }, [autoRefresh, address, pollIntervalMs, refresh]);

  const getTokenBalance = useCallback(
    (tokenId: string): bigint => state.fungibleTokens[tokenId] ?? BigInt(0),
    [state.fungibleTokens]
  );

  return { ...state, refresh, getTokenBalance };
}
