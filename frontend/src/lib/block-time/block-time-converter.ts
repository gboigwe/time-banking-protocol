// block-time-converter.ts — convert between block heights and wall-clock time
import { BLOCK_TIME_SECONDS } from './duration-helpers';

/** Known Stacks mainnet genesis block timestamp (approximate) */
export const STACKS_GENESIS_BLOCK_TIME = new Date('2021-01-14T00:00:00Z').getTime();

/** Known Stacks mainnet genesis block height */
export const STACKS_GENESIS_BLOCK_HEIGHT = 1;

/**
 * Convert a block height to an approximate Date
 * @param blockHeight - Stacks block height
 * @param currentBlockHeight - current chain tip block height
 * @param currentTime - current wall-clock time (defaults to now)
 * @returns approximate Date for the given block height
 */
export function blockHeightToDate(
  blockHeight: number,
  currentBlockHeight: number,
  currentTime: Date = new Date()
): Date {
  const blockDiff = blockHeight - currentBlockHeight;
  const msDiff = blockDiff * BLOCK_TIME_SECONDS * 1000;
  return new Date(currentTime.getTime() + msDiff);
}

/**
 * Convert a Date to an approximate block height
 * @param date - target date
 * @param currentBlockHeight - current chain tip block height
 * @param currentTime - current wall-clock time (defaults to now)
 * @returns approximate block height for the given date
 */
export function dateToBlockHeight(
  date: Date,
  currentBlockHeight: number,
  currentTime: Date = new Date()
): number {
  const msDiff = date.getTime() - currentTime.getTime();
  const blockDiff = Math.round(msDiff / (BLOCK_TIME_SECONDS * 1000));
  return Math.max(1, currentBlockHeight + blockDiff);
}

/**
 * Convert a block height to ISO 8601 string
 * @param blockHeight - Stacks block height
 * @param currentBlockHeight - current chain tip
 * @returns ISO date string
 */
export function blockHeightToISO(blockHeight: number, currentBlockHeight: number): string {
  return blockHeightToDate(blockHeight, currentBlockHeight).toISOString();
}
