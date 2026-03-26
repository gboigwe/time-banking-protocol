/**
 * useStxPrice - Simplified hook for STX price display
 */

import { useState, useEffect, useCallback } from 'react';
import { StxPriceOracle, createPriceOracle } from '../lib/stx-price-oracle';

export interface StxPriceDisplay {
  usd: string;
  change24h: string;
  isPositive: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useStxPrice(oracle?: StxPriceOracle): StxPriceDisplay {
  const [oracleInstance] = useState(() => oracle ?? createPriceOracle());
  const [state, setState] = useState<StxPriceDisplay>({
    usd: '–',
    change24h: '–',
    isPositive: true,
    isLoading: true,
    error: null,
  });

  const fetchPrice = useCallback(async () => {
    try {
      const price = await oracleInstance.getPrice();
      const change = price.change24hPercent ?? 0;
      setState({
        usd: price.usd > 0 ? `$${price.usd.toFixed(4)}` : '–',
        change24h: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
        isPositive: change >= 0,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Price unavailable',
      }));
    }
  }, [oracleInstance]);

  useEffect(() => {
    fetchPrice();
    const timer = setInterval(fetchPrice, 60_000);
    return () => clearInterval(timer);
  }, [fetchPrice]);

  return state;
}
