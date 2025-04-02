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

/** FEE_TIER_2 */
export const FEE_TIER_2 = 26;

/** FEE_TIER_3 */
export const FEE_TIER_3 = 39;

/** FEE_TIER_4 */
export const FEE_TIER_4 = 52;

/** FEE_TIER_5 */
export const FEE_TIER_5 = 65;

/** FEE_TIER_6 */
export const FEE_TIER_6 = 78;

/** FEE_TIER_7 */
export const FEE_TIER_7 = 91;

/** FEE_TIER_8 */
export const FEE_TIER_8 = 104;

/** FEE_TIER_9 */
export const FEE_TIER_9 = 117;

/** FEE_TIER_10 */
export const FEE_TIER_10 = 130;

/** FEE_TIER_11 */
export const FEE_TIER_11 = 143;

/** FEE_TIER_12 */
export const FEE_TIER_12 = 156;

/** FEE_TIER_13 */
export const FEE_TIER_13 = 169;

/** FEE_TIER_14 */
export const FEE_TIER_14 = 182;

/** FEE_TIER_15 */
export const FEE_TIER_15 = 195;

/** FEE_TIER_16 */
export const FEE_TIER_16 = 208;

/** FEE_TIER_17 */
export const FEE_TIER_17 = 221;

/** FEE_TIER_18 */
export const FEE_TIER_18 = 234;
