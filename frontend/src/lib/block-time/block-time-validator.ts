// block-time-validator.ts — validate block height values

/** Minimum reasonable block height (genesis) */
export const MIN_BLOCK_HEIGHT = 1;

/** Maximum reasonable block height (future ~100 years) */
export const MAX_BLOCK_HEIGHT = 1_000_000_000;

/** Current approximate Stacks mainnet block height (as of early 2026) */
export const APPROX_CURRENT_BLOCK = 200_000;
