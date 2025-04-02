// stacks-block-helpers.ts — Stacks-specific block time helpers
import { BLOCK_TIME_SECONDS, BLOCKS_PER_DAY } from './duration-helpers';

/** Stacks average block time in minutes */
export const AVG_BLOCK_TIME_MINUTES = BLOCK_TIME_SECONDS / 60;
