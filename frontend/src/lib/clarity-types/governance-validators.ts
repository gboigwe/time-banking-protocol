// governance-validators.ts — validation for governance proposals and votes
import type { ProposalTuple, VoteRecord } from './governance-types';

/** Minimum voting period in blocks (~1 day at ~144 blocks/day) */
export const MIN_VOTING_PERIOD_BLOCKS = 144;

/** Maximum voting period in blocks (~30 days) */
export const MAX_VOTING_PERIOD_BLOCKS = 4320;

/** Minimum quorum threshold percentage */
export const MIN_QUORUM_THRESHOLD = 10;

/** Maximum quorum threshold percentage */
export const MAX_QUORUM_THRESHOLD = 100;

/** Maximum title length for proposal */
export const MAX_PROPOSAL_TITLE_LENGTH = 128;

/** Maximum description length for proposal */
export const MAX_PROPOSAL_DESCRIPTION_LENGTH = 2048;

/** Validate proposal title */
export function validateProposalTitle(title: string): string | null {
  if (!title || title.trim().length === 0) return 'Title is required';
  if (title.length > MAX_PROPOSAL_TITLE_LENGTH) {
    return `Title cannot exceed ${MAX_PROPOSAL_TITLE_LENGTH} characters`;
  }
  return null;
}

/** Validate quorum threshold is in valid range */
export function validateQuorumThreshold(quorum: number): string | null {
  if (quorum < MIN_QUORUM_THRESHOLD || quorum > MAX_QUORUM_THRESHOLD) {
    return `Quorum must be between ${MIN_QUORUM_THRESHOLD} and ${MAX_QUORUM_THRESHOLD}`;
  }
  return null;
}
