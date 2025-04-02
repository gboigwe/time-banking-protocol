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
