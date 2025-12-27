/**
 * React Hook for Reown AppKit Stacks Adapter
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import type { StacksAccount, StacksChain } from '../types';
import { StacksAdapterContext } from '../providers/AppKitStacksProvider';

export interface UseAppKitStacksReturn {
  // Connection state
  account: StacksAccount | null;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chain: StacksChain | null;

  // Actions
  connect: (walletId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;

  // Errors
  error: Error | null;
}

export function useAppKitStacks(): UseAppKitStacksReturn {
  const adapter = useContext(StacksAdapterContext);

  const [account, setAccount] = useState<StacksAccount | null>(null);
  const [chain, setChain] = useState<StacksChain | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize state from adapter
  useEffect(() => {
    if (!adapter) return;

    setAccount(adapter.getAccount());
    setChain(adapter.getChain());

    // Listen to adapter events
    const handleConnect = (newAccount: StacksAccount) => {
      setAccount(newAccount);
      setIsConnecting(false);
      setError(null);
    };

    const handleDisconnect = () => {
      setAccount(null);
      setIsConnecting(false);
    };

    const handleChainChanged = () => {
      setChain(adapter.getChain());
    };

    adapter.on('connect', handleConnect);
    adapter.on('disconnect', handleDisconnect);
    adapter.on('chainChanged', handleChainChanged);

    return () => {
      adapter.off('connect', handleConnect);
      adapter.off('disconnect', handleDisconnect);
      adapter.off('chainChanged', handleChainChanged);
    };
  }, [adapter]);

  const connect = useCallback(
    async (walletId: string) => {
      if (!adapter) {
        setError(new Error('Adapter not initialized'));
        return;
      }

      try {
        setIsConnecting(true);
        setError(null);
        await adapter.connect(walletId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Connection failed'));
        setIsConnecting(false);
      }
    },
    [adapter]
  );

  const disconnect = useCallback(async () => {
    if (!adapter) return;

    try {
      setError(null);
      await adapter.disconnect();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Disconnection failed'));
    }
  }, [adapter]);

  const switchChain = useCallback(
    async (chainId: string) => {
      if (!adapter) {
        setError(new Error('Adapter not initialized'));
        return;
      }

      try {
        setError(null);
        await adapter.switchChain(chainId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Chain switch failed'));
      }
    },
    [adapter]
  );

  return {
    account,
    address: account?.address || null,
    isConnected: !!account,
    isConnecting,
    chain,
    connect,
    disconnect,
    switchChain,
    error,
  };
}

export default useAppKitStacks;
