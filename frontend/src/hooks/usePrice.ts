/**
 * usePrice - React hook for live STX/USD price data
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { StxPriceOracle, PriceData, createPriceOracle } from '../lib/stx-price-oracle';
import type { PriceOracleConfig } from '../lib/stx-price-oracle';

export interface PriceState {
  price: PriceData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface UsePriceOptions extends PriceOracleConfig {
  pollIntervalMs?: number;
  autoRefresh?: boolean;
  oracle?: StxPriceOracle;
}

export interface UsePriceResult extends PriceState {
  refresh: () => Promise<void>;
  convertStxToUsd: (microStx: bigint) => number;
  convertUsdToMicroStx: (usd: number) => bigint;
  oracle: StxPriceOracle;
}

export function usePrice(options: UsePriceOptions = {}): UsePriceResult {
  const { pollIntervalMs = 60_000, autoRefresh = true, oracle: externalOracle, ...oracleConfig } = options;

  const oracleRef = useRef<StxPriceOracle>(externalOracle ?? createPriceOracle(oracleConfig));

  const [state, setState] = useState<PriceState>({
    price: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const refresh = useCallback(async (forceRefresh = false) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const price = await oracleRef.current.getPrice(forceRefresh);
      setState({
        price,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (e) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Price fetch failed',
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => refresh(true), pollIntervalMs);
    return () => clearInterval(timer);
  }, [autoRefresh, pollIntervalMs, refresh]);

  useEffect(() => {
    const off = oracleRef.current.onPriceRefresh(price => {
      setState({
        price,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    });
    return off;
  }, []);

  const convertStxToUsd = useCallback(
    (microStx: bigint): number => {
      const usd = state.price?.usd ?? 0;
      return oracleRef.current.convertStxToUsd(microStx, usd);
    },
    [state.price]
  );

  const convertUsdToMicroStx = useCallback(
    (usd: number): bigint => {
      const priceUsd = state.price?.usd ?? 0;
      return oracleRef.current.convertUsdToStx(usd, priceUsd);
    },
    [state.price]
  );

  return {
    ...state,
    refresh: () => refresh(true),
    convertStxToUsd,
    convertUsdToMicroStx,
    oracle: oracleRef.current,
  };
}
