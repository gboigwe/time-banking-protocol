// conversion-helpers.ts — unit conversion utilities

/** Micro-tokens per hour (1,000,000 micro-tokens = 1 hour) */
export const MICRO_TOKENS_PER_HOUR = 1_000_000n;

/** Convert hours to micro-tokens */
export function hoursToMicroTokens(hours: number): bigint {
  return BigInt(Math.round(hours * 1_000_000));
}
