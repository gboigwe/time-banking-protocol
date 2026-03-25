/**
 * useNonce - React hook for Stacks account nonce management
 */

import { useState, useCallback, useRef } from 'react';
import { NonceManager, createNonceManager } from '../lib/nonce-manager';
import type { ManagedNonce } from '../lib/nonce-manager';
import type { StacksNetworkClient } from '../lib/stacks-network-client';

export interface NonceState {
  nonce: number | null;
  pendingCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface UseNonceResult extends NonceState {
  getNextNonce: () => Promise<ManagedNonce>;
  confirmTransaction: (nonce: number) => void;
  rejectTransaction: (nonce: number) => void;
  resetNonce: () => void;
  peekNextNonce: () => Promise<number>;
  manager: NonceManager;
}

export function useNonce(
  address: string | null | undefined,
  networkClient: StacksNetworkClient
): UseNonceResult {
  const managerRef = useRef<NonceManager>(createNonceManager(networkClient));

  const [state, setState] = useState<NonceState>({
    nonce: null,
    pendingCount: 0,
    isLoading: false,
    error: null,
  });

  const getNextNonce = useCallback(async (): Promise<ManagedNonce> => {
    if (!address) throw new Error('No address provided');
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const managed = await managerRef.current.getNextNonce(address);
      setState({
        nonce: managed.nonce,
        pendingCount: managerRef.current.getPendingCount(address),
        isLoading: false,
        error: null,
      });
      return managed;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Nonce fetch failed';
      setState(s => ({ ...s, isLoading: false, error: msg }));
      throw e;
    }
  }, [address]);

  const confirmTransaction = useCallback(
    (nonce: number) => {
      if (!address) return;
      managerRef.current.confirmTransaction(address, nonce);
      setState(s => ({
        ...s,
        pendingCount: managerRef.current.getPendingCount(address),
      }));
    },
    [address]
  );

  const rejectTransaction = useCallback(
    (nonce: number) => {
      if (!address) return;
      managerRef.current.rejectTransaction(address, nonce);
      setState(s => ({
        ...s,
        pendingCount: managerRef.current.getPendingCount(address),
      }));
    },
    [address]
  );

  const resetNonce = useCallback(() => {
    if (!address) return;
    managerRef.current.resetNonce(address);
    setState({ nonce: null, pendingCount: 0, isLoading: false, error: null });
  }, [address]);

  const peekNextNonce = useCallback(async (): Promise<number> => {
    if (!address) return 0;
    return managerRef.current.peekNextNonce(address);
  }, [address]);

  return {
    ...state,
    getNextNonce,
    confirmTransaction,
    rejectTransaction,
    resetNonce,
    peekNextNonce,
    manager: managerRef.current,
  };
}
