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

/** Get start block of a Stacks reward cycle */
export function getCycleStartBlock(cycleNumber: number): number {
  return cycleNumber * 2100;
}

/** Get end block of a Stacks reward cycle */
export function getCycleEndBlock(cycleNumber: number): number {
  return (cycleNumber + 1) * 2100 - 1;
}

/** Get blocks remaining in the current Stacks cycle */
export function blocksRemainingInCycle(currentBlock: number): number {
  const cycleNum = getStacksCycleNumber(currentBlock);
  return getCycleEndBlock(cycleNum) - currentBlock;
}

/** Check if block is at the start of a new cycle */
export function isNewCycleStart(blockHeight: number): boolean {
  return blockHeight > 0 && blockHeight % 2100 === 0;
}

/** Get days until end of current cycle */
export function daysRemainingInCycle(currentBlock: number): number {
  const blocksLeft = blocksRemainingInCycle(currentBlock);
  return blocksLeft / BLOCKS_PER_DAY;
}

// Additional block utility 1 — block sequence helper 1
export const BLOCK_SEQUENCE_CONST_1 = 100;

// Additional block utility 2 — block sequence helper 2
export const BLOCK_SEQUENCE_CONST_2 = 200;

// Additional block utility 3 — block sequence helper 3
export const BLOCK_SEQUENCE_CONST_3 = 300;

// Additional block utility 4 — block sequence helper 4
export const BLOCK_SEQUENCE_CONST_4 = 400;

// Additional block utility 5 — block sequence helper 5
export const BLOCK_SEQUENCE_CONST_5 = 500;

// Additional block utility 6 — block sequence helper 6
export const BLOCK_SEQUENCE_CONST_6 = 600;

// Additional block utility 7 — block sequence helper 7
export const BLOCK_SEQUENCE_CONST_7 = 700;

// Additional block utility 8 — block sequence helper 8
export const BLOCK_SEQUENCE_CONST_8 = 800;

// Additional block utility 9 — block sequence helper 9
export const BLOCK_SEQUENCE_CONST_9 = 900;

// Additional block utility 10 — block sequence helper 10
export const BLOCK_SEQUENCE_CONST_10 = 1000;

// Additional block utility 11 — block sequence helper 11
export const BLOCK_SEQUENCE_CONST_11 = 1100;

// Additional block utility 12 — block sequence helper 12
export const BLOCK_SEQUENCE_CONST_12 = 1200;

// Additional block utility 13 — block sequence helper 13
export const BLOCK_SEQUENCE_CONST_13 = 1300;

// Additional block utility 14 — block sequence helper 14
export const BLOCK_SEQUENCE_CONST_14 = 1400;

// Additional block utility 15 — block sequence helper 15
export const BLOCK_SEQUENCE_CONST_15 = 1500;

// Additional block utility 16 — block sequence helper 16
export const BLOCK_SEQUENCE_CONST_16 = 1600;

// Additional block utility 17 — block sequence helper 17
export const BLOCK_SEQUENCE_CONST_17 = 1700;
