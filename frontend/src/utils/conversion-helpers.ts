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
