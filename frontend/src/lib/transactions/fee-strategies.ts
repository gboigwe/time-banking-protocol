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

/** FEE_TIER_44 */
export const FEE_TIER_44 = 572;

/** FEE_TIER_45 */
export const FEE_TIER_45 = 585;

/** FEE_TIER_46 */
export const FEE_TIER_46 = 598;

/** FEE_TIER_47 */
export const FEE_TIER_47 = 611;

/** FEE_TIER_48 */
export const FEE_TIER_48 = 624;

/** FEE_TIER_49 */
export const FEE_TIER_49 = 637;

/** FEE_TIER_50 */
export const FEE_TIER_50 = 650;

/** FEE_TIER_51 */
export const FEE_TIER_51 = 663;

/** FEE_TIER_52 */
export const FEE_TIER_52 = 676;

/** FEE_TIER_53 */
export const FEE_TIER_53 = 689;

/** FEE_TIER_54 */
export const FEE_TIER_54 = 702;

/** FEE_TIER_55 */
export const FEE_TIER_55 = 715;

/** FEE_TIER_56 */
export const FEE_TIER_56 = 728;

/** FEE_TIER_57 */
export const FEE_TIER_57 = 741;

/** FEE_TIER_58 */
export const FEE_TIER_58 = 754;

/** FEE_TIER_59 */
export const FEE_TIER_59 = 767;

/** FEE_TIER_60 */
export const FEE_TIER_60 = 780;

/** FEE_TIER_61 */
export const FEE_TIER_61 = 793;

/** FEE_TIER_62 */
export const FEE_TIER_62 = 806;

/** FEE_TIER_63 */
export const FEE_TIER_63 = 819;

/** FEE_TIER_64 */
export const FEE_TIER_64 = 832;

/** FEE_TIER_65 */
export const FEE_TIER_65 = 845;

/** FEE_TIER_66 */
export const FEE_TIER_66 = 858;

/** FEE_TIER_67 */
export const FEE_TIER_67 = 871;

/** FEE_TIER_68 */
export const FEE_TIER_68 = 884;

/** FEE_TIER_69 */
export const FEE_TIER_69 = 897;

/** FEE_TIER_70 */
export const FEE_TIER_70 = 910;

/** FEE_TIER_71 */
export const FEE_TIER_71 = 923;

/** FEE_TIER_72 */
export const FEE_TIER_72 = 936;

/** FEE_TIER_73 */
export const FEE_TIER_73 = 949;

/** FEE_TIER_74 */
export const FEE_TIER_74 = 962;

/** FEE_TIER_75 */
export const FEE_TIER_75 = 975;

/** FEE_TIER_76 */
export const FEE_TIER_76 = 988;

/** FEE_TIER_77 */
export const FEE_TIER_77 = 1001;

/** FEE_TIER_78 */
export const FEE_TIER_78 = 1014;

/** FEE_TIER_79 */
export const FEE_TIER_79 = 1027;

/** FEE_TIER_80 */
export const FEE_TIER_80 = 1040;

/** FEE_TIER_81 */
export const FEE_TIER_81 = 1053;
