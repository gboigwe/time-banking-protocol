/**
 * useNetwork - React hook for Stacks network status and switching
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StacksNetworkClient,
  NetworkInfo,
  SupportedNetwork,
  createNetworkClient,
} from '../lib/stacks-network-client';

export interface NetworkState {
  network: SupportedNetwork;
  isLoading: boolean;
  error: string | null;
  info: NetworkInfo | null;
  primaryEndpoint: string;
  isHealthy: boolean;
}

export interface UseNetworkOptions {
  network?: SupportedNetwork;
  pollIntervalMs?: number;
  autoRefresh?: boolean;
}

export interface UseNetworkResult extends NetworkState {
  switchNetwork: (network: SupportedNetwork) => void;
  refresh: () => Promise<void>;
  client: StacksNetworkClient;
}

export function useNetwork(options: UseNetworkOptions = {}): UseNetworkResult {
  const {
    network: initialNetwork = 'testnet',
    pollIntervalMs = 60_000,
    autoRefresh = true,
  } = options;

  const [network, setNetwork] = useState<SupportedNetwork>(initialNetwork);
  const [state, setState] = useState<Omit<NetworkState, 'network'>>({
    isLoading: false,
    error: null,
    info: null,
    primaryEndpoint: '',
    isHealthy: true,
  });

  const clientRef = useRef<StacksNetworkClient>(createNetworkClient(network));

  useEffect(() => {
    clientRef.current = createNetworkClient(network);
    setState(s => ({
      ...s,
      primaryEndpoint: clientRef.current.getPrimaryEndpoint(),
    }));
    refresh();
  }, [network]);

  const refresh = useCallback(async () => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const info = await clientRef.current.fetchNetworkInfo();
      setState({
        isLoading: false,
        error: null,
        info,
        primaryEndpoint: clientRef.current.getPrimaryEndpoint(),
        isHealthy: true,
      });
    } catch (e) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Network fetch failed',
        isHealthy: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(timer);
  }, [autoRefresh, pollIntervalMs, refresh]);

  const switchNetwork = useCallback((next: SupportedNetwork) => {
    setNetwork(next);
  }, []);

  return {
    network,
    ...state,
    switchNetwork,
    refresh,
    client: clientRef.current,
  };
}
