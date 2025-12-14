// Clarity 4 Contract Type Definitions for Time Banking Protocol
// All contracts use stacks-block-time for Unix timestamp operations

// ============================================
// TIME-BANK-CORE CONTRACT TYPES
// ============================================

export interface TimeBankUser {
  principal: string;
  joinedAt: number; // stacks-block-time timestamp
  totalHoursGiven: number;
  totalHoursReceived: number;
  reputationScore: number;
  isActive: boolean;
  lastActivity: number; // stacks-block-time timestamp
  timeBalance: number;
}

export interface ProtocolStats {
  totalUsers: number;
  totalActiveUsers: number;
  totalCreditsIssued: number;
  totalCreditsCirculating: number;
  protocolPaused: boolean;
}

// ============================================
// SKILL-REGISTRY CONTRACT TYPES
// ============================================

export interface RegisteredSkill {
  skillId: number;
  owner: string;
  skillName: string;
  category: 'technical' | 'creative' | 'educational' | 'practical' | 'professional';
  description: string;
  hourlyRate: number;
  verified: boolean;
  verificationCount: number;
  registeredAt: number; // stacks-block-time timestamp
  lastVerifiedAt?: number; // stacks-block-time timestamp
}

export interface SkillVerification {
  verifier: string;
  skillOwner: string;
  skillId: number;
  endorsement: string;
  verifiedAt: number; // stacks-block-time timestamp
  treasuryContract?: string;
}

export interface SkillTemplate {
  templateName: string;
  templateHash: string; // contract-hash? result
  creator: string;
  approvedAt: number; // stacks-block-time timestamp
}

export interface SkillBadge {
  badgeId: number;
  recipient: string;
  badgeName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  awardedAt: number; // stacks-block-time timestamp
  awardedBy: string;
}

export interface RegistryStats {
  totalSkills: number;
  totalVerifications: number;
  totalBadges: number;
  nextSkillId: number;
  nextBadgeId: number;
}

// ============================================
// EXCHANGE-MANAGER CONTRACT TYPES
// ============================================

export interface ServiceExchange {
  exchangeId: number;
  requester: string;
  provider: string;
  skillName: string;
  hoursRequested: number;
  scheduledStart: number; // stacks-block-time timestamp
  scheduledEnd: number; // stacks-block-time timestamp
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: number; // stacks-block-time timestamp
  acceptedAt?: number; // stacks-block-time timestamp
  completedAt?: number; // stacks-block-time timestamp
  requesterConfirmed: boolean;
  providerConfirmed: boolean;
}

export interface ExchangeReview {
  reviewer: string;
  exchangeId: number;
  rating: number; // 1-5
  comment: string;
  reviewedAt: number; // stacks-block-time timestamp
}

export interface ExchangeStats {
  totalExchanges: number;
  completedExchanges: number;
  cancelledExchanges: number;
  activeExchanges: number;
  totalHoursExchanged: number;
}

// ============================================
// REPUTATION-SYSTEM CONTRACT TYPES
// ============================================

export interface UserReputation {
  user: string;
  totalScore: number;
  positiveEndorsements: number;
  negativeFlags: number;
  completedExchanges: number;
  averageRating: number;
  lastUpdated: number; // stacks-block-time timestamp
  lastDecayApplied: number; // stacks-block-time timestamp for time-weighted decay
}

export interface CategoryReputation {
  user: string;
  category: string;
  score: number;
  lastUpdated: number; // stacks-block-time timestamp
}

export interface Endorsement {
  endorsementId: number;
  endorser: string;
  endorsed: string;
  category: string;
  message: string;
  createdAt: number; // stacks-block-time timestamp
}

export interface ReputationBadge {
  badgeId: number;
  recipient: string;
  badgeName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  awardedAt: number; // stacks-block-time timestamp
}

export interface ReputationStats {
  totalEndorsements: number;
  totalBadgesAwarded: number;
  averageReputationScore: number;
  nextEndorsementId: number;
  nextBadgeId: number;
}

// ============================================
// ESCROW-MANAGER CONTRACT TYPES
// ============================================

export interface CreditEscrow {
  escrowId: number;
  depositor: string;
  beneficiary: string;
  amount: number;
  createdAt: number; // stacks-block-time timestamp
  expiresAt: number; // stacks-block-time timestamp (time-locked)
  released: boolean;
  refunded: boolean;
  releasedAt?: number; // stacks-block-time timestamp
  refundedAt?: number; // stacks-block-time timestamp
  exchangeId?: number;
  disputed: boolean;
  disputeReason?: string;
}

export interface EscrowDispute {
  escrowId: number;
  raisedBy: string;
  reason: string;
  raisedAt: number; // stacks-block-time timestamp
  resolved: boolean;
  resolvedAt?: number; // stacks-block-time timestamp
  resolution?: boolean; // true = release to beneficiary, false = refund
  mediator?: string;
}

export interface EscrowStats {
  totalEscrows: number;
  activeEscrows: number;
  releasedEscrows: number;
  refundedEscrows: number;
  disputedEscrows: number;
  totalAmountEscrowed: number;
}

// ============================================
// GOVERNANCE CONTRACT TYPES
// ============================================

export interface GovernanceProposal {
  proposalId: number;
  proposer: string;
  title: string;
  description: string;
  proposalType: 'parameter-change' | 'protocol-upgrade' | 'treasury' | 'general';
  createdAt: number; // stacks-block-time timestamp
  votingEndsAt: number; // stacks-block-time timestamp
  executionAvailableAt: number; // stacks-block-time timestamp (with timelock)
  yesVotes: number;
  noVotes: number;
  totalVoters: number;
  state: 'active' | 'passed' | 'failed' | 'executed' | 'cancelled';
  executedAt?: number; // stacks-block-time timestamp
}

export interface ProposalVote {
  proposalId: number;
  voter: string;
  vote: boolean; // true = yes, false = no
  weight: number;
  votedAt: number; // stacks-block-time timestamp
}

export interface VotingPower {
  user: string;
  power: number;
}

export interface GovernanceStats {
  totalProposals: number;
  totalPassedProposals: number;
  totalActiveVoters: number;
  nextProposalId: number;
  governanceEnabled: boolean;
  votingPeriod: number;
  timelockPeriod: number;
  quorumPercentage: number;
}

// ============================================
// REWARDS-DISTRIBUTOR CONTRACT TYPES
// ============================================

export interface RewardPeriod {
  periodId: number;
  startTime: number; // stacks-block-time timestamp
  endTime: number; // stacks-block-time timestamp
  totalPool: number;
  distributedAmount: number;
  totalParticipants: number;
  isFinalized: boolean;
}

export interface UserReward {
  user: string;
  periodId: number;
  activityScore: number;
  rewardTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  calculatedReward: number;
  claimed: boolean;
  claimedAt?: number; // stacks-block-time timestamp
}

export interface LifetimeRewards {
  user: string;
  totalClaimed: number;
  totalPeriods: number;
  highestTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lastClaim: number; // stacks-block-time timestamp
}

export interface PoolContribution {
  contributor: string;
  periodId: number;
  amount: number;
}

export interface RewardsStats {
  currentPeriodId: number;
  totalRewardPool: number;
  totalDistributed: number;
  rewardsEnabled: boolean;
  rewardPeriod: number; // 30 days in seconds
  minActivityScore: number;
  baseRewardAmount: number;
}

// ============================================
// SHARED TYPES
// ============================================

export interface ContractCallResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  txId?: string;
}

export interface TransactionStatus {
  txId: string;
  status: 'pending' | 'success' | 'failed';
  blockHeight?: number;
  timestamp?: number;
}

export interface NetworkConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  apiUrl: string;
  contractAddress: string;
}

export interface ContractConfig {
  timeBankCore: string;
  skillRegistry: string;
  exchangeManager: string;
  reputationSystem: string;
  escrowManager: string;
  governance: string;
  rewardsDistributor: string;
}

export interface ClarityValue {
  type: string;
  value: any;
}

// ============================================
// ENUMS
// ============================================

export enum SkillCategory {
  TECHNICAL = 'technical',
  CREATIVE = 'creative',
  EDUCATIONAL = 'educational',
  PRACTICAL = 'practical',
  PROFESSIONAL = 'professional',
}

export enum ExchangeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProposalState {
  ACTIVE = 'active',
  PASSED = 'passed',
  FAILED = 'failed',
  EXECUTED = 'executed',
  CANCELLED = 'cancelled',
}

export enum BadgeTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

// ============================================
// ERROR CODES (matching contract error codes)
// ============================================

export enum TimeBankErrorCode {
  UNAUTHORIZED = 1001,
  NOT_FOUND = 1002,
  ALREADY_EXISTS = 1003,
  INVALID_PARAMS = 1004,
  PROTOCOL_PAUSED = 1005,
  ALREADY_REGISTERED = 1006,
  NOT_REGISTERED = 1007,
  INVALID_AMOUNT = 1008,
  INVALID_RECIPIENT = 1009,
  INSUFFICIENT_CREDITS = 1010,
  SELF_TRANSFER = 1011,
  USER_INACTIVE = 1012,
}

export enum SkillRegistryErrorCode {
  UNAUTHORIZED = 2001,
  NOT_FOUND = 2002,
  ALREADY_EXISTS = 2003,
  INVALID_PARAMS = 2004,
  SKILL_NOT_VERIFIED = 2005,
  INSUFFICIENT_REPUTATION = 2006,
  SELF_VERIFY = 2007,
}

export enum ExchangeManagerErrorCode {
  UNAUTHORIZED = 4001,
  NOT_FOUND = 4002,
  ALREADY_EXISTS = 4003,
  INVALID_PARAMS = 4004,
  INVALID_STATUS = 4005,
  TIME_CONFLICT = 4006,
  ALREADY_CONFIRMED = 4007,
  ALREADY_ACCEPTED = 4008,
  ALREADY_COMPLETED = 4009,
  NOT_COMPLETED = 4010,
}

export enum ReputationErrorCode {
  UNAUTHORIZED = 5001,
  NOT_FOUND = 5002,
  INVALID_PARAMS = 5003,
  ALREADY_INITIALIZED = 5006,
  SELF_ENDORSE = 5007,
  ALREADY_ENDORSED = 5008,
}

export enum EscrowErrorCode {
  UNAUTHORIZED = 3001,
  NOT_FOUND = 3002,
  INVALID_PARAMS = 3003,
  EXPIRED = 3009,
  INSUFFICIENT_CREDITS = 3010,
  ALREADY_RELEASED = 3011,
  ALREADY_REFUNDED = 3012,
}

export enum GovernanceErrorCode {
  UNAUTHORIZED = 6001,
  NOT_FOUND = 6002,
  INVALID_PARAMS = 6003,
  ALREADY_VOTED = 6004,
  VOTING_CLOSED = 6005,
  PROPOSAL_ACTIVE = 6006,
  QUORUM_NOT_MET = 6007,
  INSUFFICIENT_REPUTATION = 6008,
  TIMELOCK_ACTIVE = 6009,
}

export enum RewardsErrorCode {
  UNAUTHORIZED = 7001,
  NOT_FOUND = 7002,
  INVALID_PARAMS = 7003,
  ALREADY_CLAIMED = 7004,
  REWARD_PERIOD_ACTIVE = 7005,
  INSUFFICIENT_POOL = 7006,
  NOT_ELIGIBLE = 7007,
}
