// block-time-validator.ts — validate block height values

/** Minimum reasonable block height (genesis) */
export const MIN_BLOCK_HEIGHT = 1;

/** Maximum reasonable block height (future ~100 years) */
export const MAX_BLOCK_HEIGHT = 1_000_000_000;

/** Current approximate Stacks mainnet block height (as of early 2026) */
export const APPROX_CURRENT_BLOCK = 200_000;

/**
 * Validate that a block height is a positive integer
 * @param blockHeight - value to validate
 * @returns error string or null if valid
 */
export function validateBlockHeight(blockHeight: number): string | null {
  if (!Number.isInteger(blockHeight)) return 'Block height must be an integer';
  if (blockHeight < MIN_BLOCK_HEIGHT) return `Block height must be at least ${MIN_BLOCK_HEIGHT}`;
  if (blockHeight > MAX_BLOCK_HEIGHT) return `Block height cannot exceed ${MAX_BLOCK_HEIGHT}`;
  return null;
}
