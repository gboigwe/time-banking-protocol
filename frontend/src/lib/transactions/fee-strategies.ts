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

/** FEE_TIER_19 */
export const FEE_TIER_19 = 247;

/** FEE_TIER_20 */
export const FEE_TIER_20 = 260;

/** FEE_TIER_21 */
export const FEE_TIER_21 = 273;

/** FEE_TIER_22 */
export const FEE_TIER_22 = 286;

/** FEE_TIER_23 */
export const FEE_TIER_23 = 299;

/** FEE_TIER_24 */
export const FEE_TIER_24 = 312;

/** FEE_TIER_25 */
export const FEE_TIER_25 = 325;

/** FEE_TIER_26 */
export const FEE_TIER_26 = 338;

/** FEE_TIER_27 */
export const FEE_TIER_27 = 351;

/** FEE_TIER_28 */
export const FEE_TIER_28 = 364;

/** FEE_TIER_29 */
export const FEE_TIER_29 = 377;

/** FEE_TIER_30 */
export const FEE_TIER_30 = 390;

/** FEE_TIER_31 */
export const FEE_TIER_31 = 403;

/** FEE_TIER_32 */
export const FEE_TIER_32 = 416;

/** FEE_TIER_33 */
export const FEE_TIER_33 = 429;

/** FEE_TIER_34 */
export const FEE_TIER_34 = 442;

/** FEE_TIER_35 */
export const FEE_TIER_35 = 455;

/** FEE_TIER_36 */
export const FEE_TIER_36 = 468;

/** FEE_TIER_37 */
export const FEE_TIER_37 = 481;

/** FEE_TIER_38 */
export const FEE_TIER_38 = 494;

/** FEE_TIER_39 */
export const FEE_TIER_39 = 507;

/** FEE_TIER_40 */
export const FEE_TIER_40 = 520;

/** FEE_TIER_41 */
export const FEE_TIER_41 = 533;

/** FEE_TIER_42 */
export const FEE_TIER_42 = 546;

/** FEE_TIER_43 */
export const FEE_TIER_43 = 559;
