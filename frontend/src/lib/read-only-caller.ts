/**
 * Read-Only Caller
 * Typed wrappers for calling read-only functions on time-banking contracts
 */

import { fetchCallReadOnlyFunction, cvToValue, hexToCV, ClarityValue } from '@stacks/transactions';
import type { StacksNetworkClient } from './stacks-network-client';

export interface ReadOnlyCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs?: ClarityValue[];
  senderAddress: string;
}

export interface ReadOnlyResult<T> {
  ok: true;
  value: T;
  raw: string;
}

export interface ReadOnlyError {
  ok: false;
  error: string;
  raw?: string;
}

export type ReadOnlyCallResult<T> = ReadOnlyResult<T> | ReadOnlyError;

export class ReadOnlyCaller {
  constructor(private networkClient: StacksNetworkClient) {}

  async call<T = unknown>(options: ReadOnlyCallOptions): Promise<ReadOnlyCallResult<T>> {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: options.contractAddress,
        contractName: options.contractName,
        functionName: options.functionName,
        functionArgs: options.functionArgs ?? [],
        senderAddress: options.senderAddress,
        network: this.networkClient.getStacksNetwork(),
      });

      const value = cvToValue(result, true) as T;
      return { ok: true, value, raw: JSON.stringify(value) };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : 'Read-only call failed',
      };
    }
  }

  async getContractVersion(
    contractAddress: string,
    contractName: string,
    callerAddress: string
  ): Promise<string | null> {
    const result = await this.call<{ value: string }>({
      contractAddress,
      contractName,
      functionName: 'get-contract-version',
      functionArgs: [],
      senderAddress: callerAddress,
    });
    if (!result.ok) return null;
    return typeof result.value === 'string'
      ? result.value
      : (result.value as any)?.value ?? null;
  }

  async getUserBalance(
    contractAddress: string,
    contractName: string,
    userAddress: string,
    callerAddress: string
  ): Promise<bigint> {
    const result = await this.call<number>({
      contractAddress,
      contractName,
      functionName: 'get-user-balance',
      functionArgs: [],
      senderAddress: callerAddress,
    });
    if (!result.ok) return BigInt(0);
    return BigInt(result.value as unknown as number ?? 0);
  }

  async isUserActive(
    contractAddress: string,
    contractName: string,
    userAddress: string,
    callerAddress: string
  ): Promise<boolean> {
    const result = await this.call<boolean>({
      contractAddress,
      contractName,
      functionName: 'is-user-active',
      functionArgs: [],
      senderAddress: callerAddress,
    });
    return result.ok ? Boolean(result.value) : false;
  }

  async isEscrowExpired(
    contractAddress: string,
    contractName: string,
    escrowId: number,
    callerAddress: string
  ): Promise<boolean> {
    const { uintCV } = await import('@stacks/transactions');
    const result = await this.call<boolean>({
      contractAddress,
      contractName,
      functionName: 'is-escrow-expired',
      functionArgs: [uintCV(BigInt(escrowId))],
      senderAddress: callerAddress,
    });
    return result.ok ? Boolean(result.value) : false;
  }
}

export function createReadOnlyCaller(networkClient: StacksNetworkClient): ReadOnlyCaller {
  return new ReadOnlyCaller(networkClient);
}
