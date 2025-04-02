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

/**
 * Check if two BlockRanges overlap
 * @param a - first range
 * @param b - second range
 * @returns true if ranges overlap
 */
export function blockRangesOverlap(a: BlockRange, b: BlockRange): boolean {
  return a.startBlock < b.endBlock && b.startBlock < a.endBlock;
}

/**
 * Merge two overlapping BlockRanges
 * @param a - first range
 * @param b - second range
 * @returns merged range spanning both
 */
export function mergeBlockRanges(a: BlockRange, b: BlockRange): BlockRange {
  return {
    startBlock: Math.min(a.startBlock, b.startBlock),
    endBlock: Math.max(a.endBlock, b.endBlock),
  };
}

/**
 * Get the block count of a range
 * @param range - block range
 * @returns number of blocks in range
 */
export function blockRangeSize(range: BlockRange): number {
  return Math.max(0, range.endBlock - range.startBlock);
}

/**
 * Check if a date is within a TimeRange
 * @param date - date to check
 * @param range - time range
 * @returns true if date is in range
 */
export function isInTimeRange(date: Date, range: TimeRange): boolean {
  return date >= range.startTime && date < range.endTime;
}

/**
 * Create a BlockRange from start block and duration
 * @param startBlock - starting block height
 * @param durationBlocks - duration in blocks
 * @returns BlockRange
 */
export function createBlockRange(startBlock: number, durationBlocks: number): BlockRange {
  return { startBlock, endBlock: startBlock + durationBlocks };
}
