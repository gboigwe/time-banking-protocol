/**
 * Fee Estimator
 * Estimates transaction fees for Stacks contract calls and token transfers
 */

import type { StacksNetworkClient } from './stacks-network-client';

export interface FeeEstimate {
  low: bigint;
  medium: bigint;
  high: bigint;
  recommended: bigint;
  estimatedAt: number;
}

export interface FeeEstimateRequest {
  transactionSize?: number;
  estimatedLen?: number;
  transactionPayload?: string;
}

export type FeeLevel = 'low' | 'medium' | 'high' | 'recommended';

const FEE_CACHE_TTL_MS = 30_000; // 30 seconds

interface CachedFee {
  estimate: FeeEstimate;
  expiresAt: number;
}

export class FeeEstimator {
  private client: StacksNetworkClient;
  private cache: Map<string, CachedFee> = new Map();
  private fallbackFees: FeeEstimate = {
    low: BigInt(1000),
    medium: BigInt(5000),
    high: BigInt(15000),
    recommended: BigInt(5000),
    estimatedAt: 0,
  };

  constructor(client: StacksNetworkClient) {
    this.client = client;
  }

  async estimateFee(request: FeeEstimateRequest = {}): Promise<FeeEstimate> {
    const cacheKey = JSON.stringify(request);
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.estimate;
    }

    try {
      const endpoint = this.client.getPrimaryEndpoint();
      const response = await fetch(`${endpoint}/v2/fees/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_payload: request.transactionPayload ?? '',
          estimated_len: request.estimatedLen ?? request.transactionSize ?? 300,
        }),
      });

      if (!response.ok) {
        return this.applyNetworkMultiplier(this.fallbackFees);
      }

      const data = await response.json();
      const estimate = this.parseApiResponse(data);
      this.cache.set(cacheKey, {
        estimate,
        expiresAt: Date.now() + FEE_CACHE_TTL_MS,
      });
      return estimate;
    } catch {
      return this.applyNetworkMultiplier(this.fallbackFees);
    }
  }

  async estimateContractCallFee(
    contractAddress: string,
    contractName: string,
    functionName: string
  ): Promise<FeeEstimate> {
    // contract calls are typically larger than token transfers
    return this.estimateFee({ estimatedLen: 350 });
  }

  async estimateTokenTransferFee(): Promise<FeeEstimate> {
    return this.estimateFee({ estimatedLen: 200 });
  }

  getFeeAtLevel(estimate: FeeEstimate, level: FeeLevel): bigint {
    return estimate[level];
  }

  clearCache(): void {
    this.cache.clear();
  }

  private parseApiResponse(data: any): FeeEstimate {
    const estimations: number[] = data?.estimations ?? [];
    if (estimations.length >= 3) {
      const [low, medium, high] = estimations.sort((a, b) => a - b);
      return {
        low: BigInt(Math.floor(low)),
        medium: BigInt(Math.floor(medium)),
        high: BigInt(Math.floor(high)),
        recommended: BigInt(Math.floor(medium)),
        estimatedAt: Date.now(),
      };
    }

    const fee = data?.fee ?? data?.cost ?? 5000;
    return {
      low: BigInt(Math.floor(fee * 0.5)),
      medium: BigInt(Math.floor(fee)),
      high: BigInt(Math.floor(fee * 2)),
      recommended: BigInt(Math.floor(fee)),
      estimatedAt: Date.now(),
    };
  }

  private applyNetworkMultiplier(base: FeeEstimate): FeeEstimate {
    const network = this.client.getNetwork();
    const multiplier = network === 'mainnet' ? 1 : 1;
    return {
      low: base.low * BigInt(multiplier),
      medium: base.medium * BigInt(multiplier),
      high: base.high * BigInt(multiplier),
      recommended: base.recommended * BigInt(multiplier),
      estimatedAt: Date.now(),
    };
  }
}

export function createFeeEstimator(client: StacksNetworkClient): FeeEstimator {
  return new FeeEstimator(client);
}
