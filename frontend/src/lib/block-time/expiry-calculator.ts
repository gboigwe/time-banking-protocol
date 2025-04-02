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

/**
 * Format remaining blocks as human-readable string
 * @param remainingBlocks - number of blocks remaining
 * @returns formatted string like "2 hours 30 minutes"
 */
export function formatTimeRemaining(remainingBlocks: number): string {
  if (remainingBlocks <= 0) return 'Expired';
  const totalMinutes = Math.round(blocksToMinutes(remainingBlocks));
  if (totalMinutes < 60) return `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}`;
  const hours = Math.floor(blocksToHours(remainingBlocks));
  const remainingMinutes = totalMinutes % 60;
  if (hours < 24) {
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  const days = Math.floor(blocksToDays(remainingBlocks));
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days} day${days !== 1 ? 's' : ''}`;
}

/**
 * Get percentage of time elapsed in a block range
 * @param startBlock - start of range
 * @param endBlock - end of range
 * @param currentBlock - current position
 * @returns percentage elapsed (0-100)
 */
export function getProgressPercent(
  startBlock: number,
  endBlock: number,
  currentBlock: number
): number {
  if (endBlock <= startBlock) return 100;
  const total = endBlock - startBlock;
  const elapsed = Math.min(currentBlock - startBlock, total);
  return Math.max(0, Math.round((elapsed / total) * 100));
}

/**
 * Determine urgency level based on remaining blocks
 * @param remainingBlocks - blocks until expiry
 * @returns 'critical' | 'warning' | 'normal'
 */
export function getExpiryUrgency(remainingBlocks: number): 'critical' | 'warning' | 'normal' {
  if (remainingBlocks <= 6) return 'critical';   // < 1 hour
  if (remainingBlocks <= 144) return 'warning';  // < 1 day
  return 'normal';
}

/**
 * Calculate multiple possible expiry options
 * @param startBlock - start block
 * @returns array of {label, durationBlocks, expiryBlock} options
 */
export function getExpiryOptions(startBlock: number): Array<{
  label: string;
  durationBlocks: number;
  expiryBlock: number;
}> {
  const options = [
    { label: '1 day', durationBlocks: 144 },
    { label: '3 days', durationBlocks: 432 },
    { label: '1 week', durationBlocks: 1008 },
    { label: '2 weeks', durationBlocks: 2016 },
    { label: '1 month', durationBlocks: 4320 },
  ];
  return options.map(opt => ({
    ...opt,
    expiryBlock: calculateExpiryBlock(startBlock, opt.durationBlocks),
  }));
}

/**
 * Create a countdown ticker value from remaining blocks
 * @param remainingBlocks - blocks until expiry
 * @returns object with days, hours, minutes components
 */
export function blockCountdown(remainingBlocks: number): {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
} {
  if (remainingBlocks <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }
  const totalMinutes = Math.floor((remainingBlocks * 10 * 60) / 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes, isExpired: false };
}

/**
 * Check if something expires within a given number of blocks
 * @param expiryBlock - block when thing expires
 * @param currentBlock - current chain tip
 * @param withinBlocks - threshold to check
 * @returns true if expiry is within threshold
 */
export function expiresWithin(
  expiryBlock: number,
  currentBlock: number,
  withinBlocks: number
): boolean {
  const remaining = getRemainingBlocks(expiryBlock, currentBlock);
  return remaining > 0 && remaining <= withinBlocks;
}

/** Standard expiry duration 1: 144 blocks */
export const EXPIRY_DURATION_1 = 144;

/** Standard expiry duration 2: 288 blocks */
export const EXPIRY_DURATION_2 = 288;

/** Standard expiry duration 3: 432 blocks */
export const EXPIRY_DURATION_3 = 432;

/** Standard expiry duration 4: 576 blocks */
export const EXPIRY_DURATION_4 = 576;

/** Standard expiry duration 5: 720 blocks */
export const EXPIRY_DURATION_5 = 720;

/** Standard expiry duration 6: 864 blocks */
export const EXPIRY_DURATION_6 = 864;

/** Standard expiry duration 7: 1008 blocks */
export const EXPIRY_DURATION_7 = 1008;

/** Standard expiry duration 8: 1152 blocks */
export const EXPIRY_DURATION_8 = 1152;

/** Standard expiry duration 9: 1296 blocks */
export const EXPIRY_DURATION_9 = 1296;

/** Standard expiry duration 10: 1440 blocks */
export const EXPIRY_DURATION_10 = 1440;

/** Standard expiry duration 11: 1584 blocks */
export const EXPIRY_DURATION_11 = 1584;

/** Standard expiry duration 12: 1728 blocks */
export const EXPIRY_DURATION_12 = 1728;

/** Standard expiry duration 13: 1872 blocks */
export const EXPIRY_DURATION_13 = 1872;

/** Standard expiry duration 14: 2016 blocks */
export const EXPIRY_DURATION_14 = 2016;

/** Standard expiry duration 15: 2160 blocks */
export const EXPIRY_DURATION_15 = 2160;

/** Standard expiry duration 16: 2304 blocks */
export const EXPIRY_DURATION_16 = 2304;

/** Standard expiry duration 17: 2448 blocks */
export const EXPIRY_DURATION_17 = 2448;

/** Standard expiry duration 18: 2592 blocks */
export const EXPIRY_DURATION_18 = 2592;

/** Standard expiry duration 19: 2736 blocks */
export const EXPIRY_DURATION_19 = 2736;

/** Standard expiry duration 20: 2880 blocks */
export const EXPIRY_DURATION_20 = 2880;

/** Standard expiry duration 21: 3024 blocks */
export const EXPIRY_DURATION_21 = 3024;

/** Standard expiry duration 22: 3168 blocks */
export const EXPIRY_DURATION_22 = 3168;

/** Standard expiry duration 23: 3312 blocks */
export const EXPIRY_DURATION_23 = 3312;
