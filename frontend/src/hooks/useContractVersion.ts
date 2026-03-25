/**
 * useContractVersion - React hook to query on-chain contract versions
 */

import { useState, useEffect, useCallback } from 'react';
import type { ReadOnlyCaller } from '../lib/read-only-caller';

export interface ContractVersionState {
  versions: Record<string, string | null>;
  isLoading: boolean;
  error: string | null;
}

export interface ContractInfo {
  contractAddress: string;
  contractName: string;
  label?: string;
}

export interface UseContractVersionResult extends ContractVersionState {
  refresh: () => Promise<void>;
  getVersion: (contractId: string) => string | null;
}

export function useContractVersion(
  contracts: ContractInfo[],
  callerAddress: string,
  caller: ReadOnlyCaller
): UseContractVersionResult {
  const [state, setState] = useState<ContractVersionState>({
    versions: {},
    isLoading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!callerAddress || contracts.length === 0) return;
    setState(s => ({ ...s, isLoading: true, error: null }));

    try {
      const results = await Promise.allSettled(
        contracts.map(c =>
          caller.getContractVersion(c.contractAddress, c.contractName, callerAddress)
        )
      );

      const versions: Record<string, string | null> = {};
      contracts.forEach((c, i) => {
        const contractId = `${c.contractAddress}.${c.contractName}`;
        const result = results[i];
        versions[contractId] =
          result.status === 'fulfilled' ? result.value : null;
      });

      setState({ versions, isLoading: false, error: null });
    } catch (e) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Version fetch failed',
      }));
    }
  }, [contracts, callerAddress, caller]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getVersion = useCallback(
    (contractId: string): string | null => state.versions[contractId] ?? null,
    [state.versions]
  );

  return { ...state, refresh, getVersion };
}
