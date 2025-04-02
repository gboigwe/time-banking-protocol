// governance-validators.ts — validation for governance proposals and votes
import type { ProposalTuple, VoteRecord } from './governance-types';

/** Minimum voting period in blocks (~1 day at ~144 blocks/day) */
export const MIN_VOTING_PERIOD_BLOCKS = 144;
