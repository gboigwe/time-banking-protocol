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
