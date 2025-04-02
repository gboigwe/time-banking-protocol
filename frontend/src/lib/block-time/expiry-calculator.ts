// expiry-calculator.ts — calculate expiry blocks for time-based exchanges
import { blocksToHours, blocksToMinutes, blocksToDays } from './duration-helpers';

/**
 * Calculate the expiry block for an exchange
 * @param startBlock - block height when exchange starts
 * @param durationBlocks - how many blocks the exchange lasts
 * @returns block height at which exchange expires
 */
export function calculateExpiryBlock(startBlock: number, durationBlocks: number): number {
  return startBlock + durationBlocks;
}

/**
 * Check if an exchange is expired
 * @param endBlock - block height when exchange expires
 * @param currentBlock - current chain tip
 * @returns true if exchange is expired
 */
export function isExchangeExpired(endBlock: number, currentBlock: number): boolean {
  return currentBlock >= endBlock;
}

/**
 * Get remaining blocks until expiry
 * @param endBlock - block height when exchange expires
 * @param currentBlock - current chain tip
 * @returns remaining blocks (0 if already expired)
 */
export function getRemainingBlocks(endBlock: number, currentBlock: number): number {
  return Math.max(0, endBlock - currentBlock);
}
