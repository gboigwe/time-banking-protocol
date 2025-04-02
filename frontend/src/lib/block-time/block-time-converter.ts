// block-time-converter.ts — convert between block heights and wall-clock time
import { BLOCK_TIME_SECONDS } from './duration-helpers';

/** Known Stacks mainnet genesis block timestamp (approximate) */
export const STACKS_GENESIS_BLOCK_TIME = new Date('2021-01-14T00:00:00Z').getTime();
