// conversion-helpers.ts — unit conversion utilities

/** Micro-tokens per hour (1,000,000 micro-tokens = 1 hour) */
export const MICRO_TOKENS_PER_HOUR = 1_000_000n;

/** Convert hours to micro-tokens */
export function hoursToMicroTokens(hours: number): bigint {
  return BigInt(Math.round(hours * 1_000_000));
}

/** Convert micro-tokens to hours */
export function microTokensToHours(microTokens: bigint): number {
  return Number(microTokens) / 1_000_000;
}

/** Micro-STX per STX */
export const MICRO_STX_PER_STX = 1_000_000n;

/** Convert STX to micro-STX */
export function STXtoMicroSTX(stx: number): bigint {
  return BigInt(Math.round(stx * 1_000_000));
}

/** Convert micro-STX to STX */
export function microSTXtoSTX(microSTX: bigint): number {
  return Number(microSTX) / 1_000_000;
}

/** Convert block time to hours (using 10 min avg block time) */
export function blockTimeToHours(blocks: number): number {
  return (blocks * 10) / 60;
}

/** Convert hours to approximate block count */
export function hoursToBlockTime(hours: number): number {
  return Math.ceil((hours * 60) / 10);
}

/** CONV_CONST_1 */
export const CONV_CONST_1 = 19;

/** CONV_CONST_2 */
export const CONV_CONST_2 = 38;

/** CONV_CONST_3 */
export const CONV_CONST_3 = 57;

/** CONV_CONST_4 */
export const CONV_CONST_4 = 76;

/** CONV_CONST_5 */
export const CONV_CONST_5 = 95;

/** CONV_CONST_6 */
export const CONV_CONST_6 = 114;

/** CONV_CONST_7 */
export const CONV_CONST_7 = 133;

/** CONV_CONST_8 */
export const CONV_CONST_8 = 152;

/** CONV_CONST_9 */
export const CONV_CONST_9 = 171;

/** CONV_CONST_10 */
export const CONV_CONST_10 = 190;

/** CONV_CONST_11 */
export const CONV_CONST_11 = 209;

/** CONV_CONST_12 */
export const CONV_CONST_12 = 228;

/** CONV_CONST_13 */
export const CONV_CONST_13 = 247;

/** CONV_CONST_14 */
export const CONV_CONST_14 = 266;

/** CONV_CONST_15 */
export const CONV_CONST_15 = 285;

/** CONV_CONST_16 */
export const CONV_CONST_16 = 304;

/** CONV_CONST_17 */
export const CONV_CONST_17 = 323;

/** CONV_CONST_18 */
export const CONV_CONST_18 = 342;

/** CONV_CONST_19 */
export const CONV_CONST_19 = 361;

/** CONV_CONST_20 */
export const CONV_CONST_20 = 380;

/** CONV_CONST_21 */
export const CONV_CONST_21 = 399;

/** CONV_CONST_22 */
export const CONV_CONST_22 = 418;

/** CONV_CONST_23 */
export const CONV_CONST_23 = 437;

/** CONV_CONST_24 */
export const CONV_CONST_24 = 456;

/** CONV_CONST_25 */
export const CONV_CONST_25 = 475;

/** CONV_CONST_26 */
export const CONV_CONST_26 = 494;

/** CONV_CONST_27 */
export const CONV_CONST_27 = 513;

/** CONV_CONST_28 */
export const CONV_CONST_28 = 532;

/** CONV_CONST_29 */
export const CONV_CONST_29 = 551;

/** CONV_CONST_30 */
export const CONV_CONST_30 = 570;

/** CONV_CONST_31 */
export const CONV_CONST_31 = 589;

/** CONV_CONST_32 */
export const CONV_CONST_32 = 608;

/** CONV_CONST_33 */
export const CONV_CONST_33 = 627;

/** CONV_CONST_34 */
export const CONV_CONST_34 = 646;

/** CONV_CONST_35 */
export const CONV_CONST_35 = 665;

/** CONV_CONST_36 */
export const CONV_CONST_36 = 684;

/** CONV_CONST_37 */
export const CONV_CONST_37 = 703;

/** CONV_CONST_38 */
export const CONV_CONST_38 = 722;

/** CONV_CONST_39 */
export const CONV_CONST_39 = 741;

/** CONV_CONST_40 */
export const CONV_CONST_40 = 760;

/** CONV_CONST_41 */
export const CONV_CONST_41 = 779;

/** CONV_CONST_42 */
export const CONV_CONST_42 = 798;

/** CONV_CONST_43 */
export const CONV_CONST_43 = 817;

/** CONV_CONST_44 */
export const CONV_CONST_44 = 836;

/** CONV_CONST_45 */
export const CONV_CONST_45 = 855;

/** CONV_CONST_46 */
export const CONV_CONST_46 = 874;

/** CONV_CONST_47 */
export const CONV_CONST_47 = 893;
