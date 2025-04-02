// governance-validators.ts — validation for governance proposals and votes
import type { ProposalTuple, VoteRecord } from './governance-types';

/** Minimum voting period in blocks (~1 day at ~144 blocks/day) */
export const MIN_VOTING_PERIOD_BLOCKS = 144;

/** Maximum voting period in blocks (~30 days) */
export const MAX_VOTING_PERIOD_BLOCKS = 4320;

/** Minimum quorum threshold percentage */
export const MIN_QUORUM_THRESHOLD = 10;
