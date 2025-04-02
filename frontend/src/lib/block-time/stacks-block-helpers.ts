// stacks-block-helpers.ts — Stacks-specific block time helpers
import { BLOCK_TIME_SECONDS, BLOCKS_PER_DAY } from './duration-helpers';

/** Stacks average block time in minutes */
export const AVG_BLOCK_TIME_MINUTES = BLOCK_TIME_SECONDS / 60;

/** Stacks testnet genesis block height */
export const TESTNET_GENESIS_BLOCK = 1;

/** Number of Stacks blocks in a Bitcoin difficulty adjustment period */
export const BLOCKS_PER_DIFFICULTY_PERIOD = 2016;

/** Check if a block height is a halving block (every 210,000 BTC blocks ~ proportional) */
export function isHalvingBlock(blockHeight: number): boolean {
  return blockHeight > 0 && blockHeight % 210000 === 0;
}

/** Get the next halving block height from current block */
export function getNextHalvingBlock(currentBlock: number): number {
  const period = 210000;
  return (Math.floor(currentBlock / period) + 1) * period;
}

/** Estimate blocks until next halving */
export function blocksUntilNextHalving(currentBlock: number): number {
  return getNextHalvingBlock(currentBlock) - currentBlock;
}

/** Get cycle number for a given block (Stacks uses 2100-block cycles) */
export function getStacksCycleNumber(blockHeight: number): number {
  return Math.floor(blockHeight / 2100);
}
