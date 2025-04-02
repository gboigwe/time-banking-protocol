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

/**
 * Check if a block height is a reasonable on-chain value
 * @param blockHeight - value to check
 * @returns true if block height appears reasonable
 */
export function isReasonableBlockHeight(blockHeight: number): boolean {
  return validateBlockHeight(blockHeight) === null;
}

/**
 * Validate that start block comes before end block
 * @param startBlock - start of range
 * @param endBlock - end of range
 * @returns error string or null if valid
 */
export function validateBlockRange(startBlock: number, endBlock: number): string | null {
  const startErr = validateBlockHeight(startBlock);
  if (startErr) return `Start block: ${startErr}`;
  const endErr = validateBlockHeight(endBlock);
  if (endErr) return `End block: ${endErr}`;
  if (endBlock <= startBlock) return 'End block must be greater than start block';
  return null;
}

/**
 * Clamp a block height to the valid range
 * @param blockHeight - value to clamp
 * @returns clamped block height
 */
export function clampBlockHeight(blockHeight: number): number {
  return Math.max(MIN_BLOCK_HEIGHT, Math.min(MAX_BLOCK_HEIGHT, Math.round(blockHeight)));
}

/**
 * Ensure a block height is in the future relative to current
 * @param blockHeight - target block
 * @param currentBlock - current tip
 * @param minBlocksInFuture - minimum blocks ahead required
 * @returns error string or null
 */
export function validateFutureBlock(
  blockHeight: number,
  currentBlock: number,
  minBlocksInFuture = 1
): string | null {
  if (blockHeight < currentBlock + minBlocksInFuture) {
    return `Block height must be at least ${minBlocksInFuture} block(s) in the future`;
  }
  return null;
}

/**
 * Validate that a block height is not too far in the future
 * @param blockHeight - target block
 * @param currentBlock - current tip
 * @param maxBlocksAhead - maximum blocks ahead allowed
 * @returns error string or null
 */
export function validateNotTooFarFuture(
  blockHeight: number,
  currentBlock: number,
  maxBlocksAhead = 52560 // ~1 year
): string | null {
  if (blockHeight > currentBlock + maxBlocksAhead) {
    return `Block height is too far in the future (max ${maxBlocksAhead} blocks ahead)`;
  }
  return null;
}
