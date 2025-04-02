// time-range.ts — block range and time range utilities

/** A range defined by start and end block heights */
export interface BlockRange {
  /** Starting block height (inclusive) */
  startBlock: number;
  /** Ending block height (exclusive) */
  endBlock: number;
}

/** A range defined by start and end wall-clock times */
export interface TimeRange {
  /** Start time */
  startTime: Date;
  /** End time */
  endTime: Date;
}

/**
 * Check if a block height is within a BlockRange
 * @param block - block height to check
 * @param range - range to check against
 * @returns true if block is in range
 */
export function isInBlockRange(block: number, range: BlockRange): boolean {
  return block >= range.startBlock && block < range.endBlock;
}
