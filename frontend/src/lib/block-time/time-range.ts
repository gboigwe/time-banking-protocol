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
