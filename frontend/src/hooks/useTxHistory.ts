/**
 * useTxHistory - React hook for account transaction history
 */

import { useState, useEffect, useCallback } from 'react';
import type { HiroApiClient, TransactionListItem } from '../lib/hiro-api-client';

export interface TxHistoryState {
  transactions: TransactionListItem[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface UseTxHistoryOptions {
  limit?: number;
  pollIntervalMs?: number;
  autoRefresh?: boolean;
  filterType?: string;
}

export interface UseTxHistoryResult extends TxHistoryState {
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  getTransaction: (txId: string) => TransactionListItem | undefined;
}

export function useTxHistory(
  address: string | null | undefined,
  apiClient: HiroApiClient,
  options: UseTxHistoryOptions = {}
): UseTxHistoryResult {
  const { limit = 20, pollIntervalMs = 30_000, autoRefresh = false, filterType } = options;

  const [offset, setOffset] = useState(0);
  const [state, setState] = useState<TxHistoryState>({
    transactions: [],
    total: 0,
    hasMore: false,
    isLoading: false,
    isLoadingMore: false,
    error: null,
    lastUpdated: null,
  });

  const refresh = useCallback(async () => {
    if (!address) return;
    setState(s => ({ ...s, isLoading: true, error: null }));
    setOffset(0);
    try {
      const response = await apiClient.getAccountTransactions(address, {
        limit,
        offset: 0,
        unanchored: true,
      });
      let txs = response.results;
      if (filterType) {
        txs = txs.filter(tx => tx.tx_type === filterType);
      }
      setState({
        transactions: txs,
        total: response.total,
        hasMore: response.total > limit,
        isLoading: false,
        isLoadingMore: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (e) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Transaction history fetch failed',
      }));
    }
  }, [address, apiClient, limit, filterType]);

  const loadMore = useCallback(async () => {
    if (!address || state.isLoadingMore || !state.hasMore) return;
    const nextOffset = offset + limit;
    setState(s => ({ ...s, isLoadingMore: true }));
    try {
      const response = await apiClient.getAccountTransactions(address, {
        limit,
        offset: nextOffset,
        unanchored: true,
      });
      let newTxs = response.results;
      if (filterType) {
        newTxs = newTxs.filter(tx => tx.tx_type === filterType);
      }
      setState(s => ({
        ...s,
        transactions: [...s.transactions, ...newTxs],
        hasMore: s.transactions.length + newTxs.length < response.total,
        isLoadingMore: false,
        lastUpdated: Date.now(),
      }));
      setOffset(nextOffset);
    } catch (e) {
      setState(s => ({
        ...s,
        isLoadingMore: false,
        error: e instanceof Error ? e.message : 'Load more failed',
      }));
    }
  }, [address, apiClient, limit, offset, state.isLoadingMore, state.hasMore, filterType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh || !address) return;
    const timer = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(timer);
  }, [autoRefresh, address, pollIntervalMs, refresh]);

  const getTransaction = useCallback(
    (txId: string) => state.transactions.find(tx => tx.tx_id === txId),
    [state.transactions]
  );

  return { ...state, refresh, loadMore, getTransaction };
}
