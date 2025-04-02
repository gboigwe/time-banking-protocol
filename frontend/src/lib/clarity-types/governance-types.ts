// governance-types.ts — Clarity v4 governance protocol type definitions

/** QuorumThreshold represents minimum vote percentage (0-100) */
export type QuorumThreshold = number;

/** VotingPeriod in block-time units */
export interface VotingPeriod {
  /** Start block height */
  startBlock: number;
  /** End block height */
  endBlock: number;
}

/** CouncilMember from governance contract */
export interface CouncilMember {
  /** Member address */
  address: string;
  /** Voting power weight */
  weight: number;
  /** Block when membership starts */
  startBlock: number;
  /** Block when membership expires */
  endBlock: number;
  /** Whether member is currently active */
  isActive: boolean;
}

/** VoteRecord from governance contract */
export interface VoteRecord {
  /** Proposal being voted on */
  proposalId: number;
  /** Voter address */
  voter: string;
  /** Vote direction */
  vote: 'for' | 'against' | 'abstain';
