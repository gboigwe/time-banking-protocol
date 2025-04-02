// fee-strategies.ts — transaction fee estimation strategies

/** Fee strategy interface */
export interface FeeStrategy {
  estimateFee(): bigint;
}

/** Minimum fee strategy */
export class MinFeeStrategy implements FeeStrategy {
  estimateFee(): bigint { return 180n; }
}

/** Average fee strategy */
export class AverageFeeStrategy implements FeeStrategy {
  estimateFee(): bigint { return 500n; }
}

/** High priority fee strategy */
export class HighPriorityFeeStrategy implements FeeStrategy {
  estimateFee(): bigint { return 1500n; }
}

/** Custom fee strategy with configurable amount */
export class CustomFeeStrategy implements FeeStrategy {
  constructor(private readonly fee: bigint) {}
  estimateFee(): bigint { return this.fee; }
}

/** Estimate fee using a given strategy */
export function estimateFee(strategy: FeeStrategy): bigint {
  return strategy.estimateFee();
}

/** FEE_TIER_1 */
export const FEE_TIER_1 = 13;
