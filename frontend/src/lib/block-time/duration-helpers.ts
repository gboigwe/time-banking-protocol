// duration-helpers.ts — block time duration conversion helpers

/** Average Stacks blocks mined per hour */
export const BLOCKS_PER_HOUR = 6;

/** Average Stacks blocks mined per day */
export const BLOCKS_PER_DAY = BLOCKS_PER_HOUR * 24;

/** Average Stacks blocks mined per week */
export const BLOCKS_PER_WEEK = BLOCKS_PER_DAY * 7;

/** Average Stacks blocks mined per month (30 days) */
export const BLOCKS_PER_MONTH = BLOCKS_PER_DAY * 30;

/** Average Stacks blocks mined per year */
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365;

/** Average block time in seconds */
export const BLOCK_TIME_SECONDS = 10 * 60;

/**
 * Convert number of blocks to approximate hours
 * @param blocks - number of Stacks blocks
 * @returns approximate hours
 */
export function blocksToHours(blocks: number): number {
  return blocks / BLOCKS_PER_HOUR;
}

/**
 * Convert hours to approximate block count
 * @param hours - number of hours
 * @returns approximate block count
 */
export function hoursToBlocks(hours: number): number {
  return Math.ceil(hours * BLOCKS_PER_HOUR);
}

/**
 * Convert days to approximate block count
 * @param days - number of days
 * @returns approximate block count
 */
export function daysToBlocks(days: number): number {
  return Math.ceil(days * BLOCKS_PER_DAY);
}

/**
 * Convert blocks to approximate days
 * @param blocks - number of Stacks blocks
 * @returns approximate days
 */
export function blocksToDays(blocks: number): number {
  return blocks / BLOCKS_PER_DAY;
}

/**
 * Convert weeks to approximate block count
 * @param weeks - number of weeks
 * @returns approximate block count
 */
export function weeksToBlocks(weeks: number): number {
  return Math.ceil(weeks * BLOCKS_PER_WEEK);
}

/**
 * Convert blocks to approximate weeks
 * @param blocks - number of Stacks blocks
 * @returns approximate weeks
 */
export function blocksToWeeks(blocks: number): number {
  return blocks / BLOCKS_PER_WEEK;
}

/**
 * Convert months to approximate block count
 * @param months - number of months (30 days each)
 * @returns approximate block count
 */
export function monthsToBlocks(months: number): number {
  return Math.ceil(months * BLOCKS_PER_MONTH);
}

/**
 * Convert blocks to approximate months
 * @param blocks - number of Stacks blocks
 * @returns approximate months
 */
export function blocksToMonths(blocks: number): number {
  return blocks / BLOCKS_PER_MONTH;
}

/**
 * Convert blocks to approximate minutes
 * @param blocks - number of Stacks blocks
 * @returns approximate minutes
 */
export function blocksToMinutes(blocks: number): number {
  return (blocks * BLOCK_TIME_SECONDS) / 60;
}
