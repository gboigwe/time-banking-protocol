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
