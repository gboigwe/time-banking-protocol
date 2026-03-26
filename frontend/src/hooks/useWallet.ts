/**
 * useWallet - React hook for wallet authentication state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  WalletAuth,
  AuthState,
  createWalletAuth,
  WalletAuthConfig,
} from '../lib/wallet-auth';

export interface UseWalletResult extends AuthState {
  connect: () => Promise<void>;
  disconnect: () => void;
  getAddress: () => string | null;
  getAddressForNetwork: () => string | null;
  auth: WalletAuth;
}

export function useWallet(
  config: WalletAuthConfig,
  externalAuth?: WalletAuth
): UseWalletResult {
  const authRef = useRef<WalletAuth>(externalAuth ?? createWalletAuth(config));

  const [state, setState] = useState<AuthState>(() => authRef.current.getState());

  useEffect(() => {
    const off = authRef.current.onStateChange(setState);
    // Sync in case state changed between creation and effect
    setState(authRef.current.getState());
    return off;
  }, []);

  const connect = useCallback(async () => {
    await authRef.current.connect();
  }, []);

  const disconnect = useCallback(() => {
    authRef.current.disconnect();
  }, []);

  const getAddress = useCallback(() => authRef.current.getAddress(), []);

  const getAddressForNetwork = useCallback(
    () => authRef.current.getAddressForNetwork(),
    []
  );

  return {
    ...state,
    connect,
    disconnect,
    getAddress,
    getAddressForNetwork,
    auth: authRef.current,
  };
}
