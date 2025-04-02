// error-constants.ts — All error codes from 17 Clarity v4 contracts as typed constants

/** Base error type for all contract errors */
export interface ContractErrorCode {
  code: number;
  name: string;
  contract: string;
  description: string;
}

// ---- time-bank-core errors ----
export const ERR_NOT_REGISTERED = 100;
export const ERR_ALREADY_REGISTERED = 101;
export const ERR_INSUFFICIENT_HOURS = 102;
export const ERR_INVALID_HOURS = 103;
export const ERR_TRANSFER_FAILED = 104;
export const ERR_UNAUTHORIZED = 105;
export const ERR_CONTRACT_PAUSED = 106;

// ---- exchange-manager errors ----
export const ERR_EXCHANGE_NOT_FOUND = 200;
export const ERR_EXCHANGE_NOT_PENDING = 201;
export const ERR_EXCHANGE_EXPIRED = 202;
export const ERR_EXCHANGE_NOT_ACTIVE = 203;
export const ERR_SELF_EXCHANGE = 204;
export const ERR_EXCHANGE_LIMIT_REACHED = 205;

// ---- skill-registry errors ----
export const ERR_SKILL_NOT_FOUND = 300;
export const ERR_SKILL_ALREADY_EXISTS = 301;
export const ERR_SKILL_NOT_OFFERED = 302;
export const ERR_SKILL_INACTIVE = 303;
export const ERR_INVALID_SKILL_LEVEL = 304;

// ---- escrow-manager errors ----
export const ERR_ESCROW_NOT_FOUND = 400;
export const ERR_ESCROW_ALREADY_RELEASED = 401;
export const ERR_ESCROW_NOT_MATURED = 402;
export const ERR_INVALID_GUARDIAN = 403;

// ---- governance errors ----
export const ERR_PROPOSAL_NOT_FOUND = 500;
export const ERR_ALREADY_VOTED = 501;
export const ERR_VOTING_CLOSED = 502;
export const ERR_QUORUM_NOT_REACHED = 503;
export const ERR_PROPOSAL_NOT_PASSED = 504;
export const ERR_PROPOSAL_ALREADY_EXECUTED = 505;

// ---- reputation-system errors ----
export const ERR_CANNOT_RATE_SELF = 600;
export const ERR_RATING_ALREADY_SUBMITTED = 601;
export const ERR_INVALID_RATING = 602;
export const ERR_EXCHANGE_NOT_COMPLETED = 603;

// ---- dispute-arbitration errors ----
export const ERR_DISPUTE_NOT_FOUND = 700;
export const ERR_DISPUTE_ALREADY_RESOLVED = 701;
export const ERR_NOT_ARBITRATOR = 702;
export const ERR_DISPUTE_PERIOD_EXPIRED = 703;

// ---- time-token-ft errors ----
export const ERR_INSUFFICIENT_BALANCE = 800;
export const ERR_INVALID_AMOUNT = 801;
export const ERR_MINT_LIMIT_REACHED = 802;

// ---- multi-sig-wallet errors ----
export const ERR_NOT_SIGNER = 900;
export const ERR_ALREADY_SIGNED = 901;
export const ERR_INSUFFICIENT_SIGNATURES = 902;
export const ERR_TX_ALREADY_EXECUTED = 903;

// ---- insurance-pool errors ----
export const ERR_POOL_INSUFFICIENT_FUNDS = 1000;
export const ERR_CLAIM_NOT_FOUND = 1001;
export const ERR_CLAIM_ALREADY_PROCESSED = 1002;

// ---- analytics-tracker errors ----
export const ERR_TRACKER_NOT_AUTHORIZED = 1100;
export const ERR_METRIC_NOT_FOUND = 1101;

// ---- rewards-distributor errors ----
export const ERR_REWARD_ALREADY_CLAIMED = 1200;
export const ERR_REWARD_NOT_AVAILABLE = 1201;
export const ERR_REWARD_POOL_EMPTY = 1202;

// ---- skill-certification-nft errors ----
export const ERR_NFT_NOT_FOUND = 1300;
export const ERR_NFT_NOT_TRANSFERABLE = 1301;
export const ERR_CERT_ALREADY_ISSUED = 1302;

// ---- referral-program errors ----
export const ERR_REFERRAL_NOT_FOUND = 1400;
export const ERR_REFERRAL_ALREADY_USED = 1401;
export const ERR_SELF_REFERRAL = 1402;

// ---- automation-scheduler errors ----
export const ERR_JOB_NOT_FOUND = 1500;
export const ERR_JOB_NOT_DUE = 1501;
export const ERR_JOB_ALREADY_RUNNING = 1502;

// ---- emergency-controls errors ----
export const ERR_ALREADY_PAUSED = 1600;
export const ERR_NOT_PAUSED = 1601;
export const ERR_EMERGENCY_COOLDOWN = 1602;

// ---- skill-matching-engine errors ----
export const ERR_NO_MATCH_FOUND = 1700;
export const ERR_MATCH_LIMIT_REACHED = 1701;

/** Map of error code to readable message */
export const ERROR_MESSAGES: Record<number, string> = {
  [ERR_NOT_REGISTERED]: 'Participant not registered',
  [ERR_ALREADY_REGISTERED]: 'Participant already registered',
  [ERR_INSUFFICIENT_HOURS]: 'Insufficient time hours for this operation',
  [ERR_INVALID_HOURS]: 'Invalid hours value provided',
  [ERR_TRANSFER_FAILED]: 'Hours transfer failed',
  [ERR_UNAUTHORIZED]: 'Unauthorized operation',
  [ERR_CONTRACT_PAUSED]: 'Contract is currently paused',
  [ERR_EXCHANGE_NOT_FOUND]: 'Exchange record not found',
  [ERR_EXCHANGE_NOT_PENDING]: 'Exchange is not in pending state',
  [ERR_EXCHANGE_EXPIRED]: 'Exchange has expired',
  [ERR_EXCHANGE_NOT_ACTIVE]: 'Exchange is not active',
  [ERR_SELF_EXCHANGE]: 'Cannot create exchange with yourself',
  [ERR_EXCHANGE_LIMIT_REACHED]: 'Exchange limit has been reached',
  [ERR_SKILL_NOT_FOUND]: 'Skill not found in registry',
  [ERR_SKILL_ALREADY_EXISTS]: 'Skill already exists',
  [ERR_SKILL_NOT_OFFERED]: 'Skill not offered by participant',
  [ERR_SKILL_INACTIVE]: 'Skill is inactive',
  [ERR_INVALID_SKILL_LEVEL]: 'Invalid skill level',
  [ERR_ESCROW_NOT_FOUND]: 'Escrow not found',
  [ERR_ESCROW_ALREADY_RELEASED]: 'Escrow already released',
  [ERR_ESCROW_NOT_MATURED]: 'Escrow period not yet matured',
  [ERR_INVALID_GUARDIAN]: 'Invalid guardian address',
  [ERR_PROPOSAL_NOT_FOUND]: 'Governance proposal not found',
  [ERR_ALREADY_VOTED]: 'Already voted on this proposal',
  [ERR_VOTING_CLOSED]: 'Voting period has closed',
  [ERR_QUORUM_NOT_REACHED]: 'Quorum not reached for proposal',
  [ERR_PROPOSAL_NOT_PASSED]: 'Proposal did not pass',
  [ERR_PROPOSAL_ALREADY_EXECUTED]: 'Proposal already executed',
  [ERR_CANNOT_RATE_SELF]: 'Cannot rate yourself',
  [ERR_RATING_ALREADY_SUBMITTED]: 'Rating already submitted for this exchange',
  [ERR_INVALID_RATING]: 'Invalid rating value',
  [ERR_EXCHANGE_NOT_COMPLETED]: 'Exchange not completed yet',
  [ERR_DISPUTE_NOT_FOUND]: 'Dispute not found',
  [ERR_DISPUTE_ALREADY_RESOLVED]: 'Dispute already resolved',
  [ERR_NOT_ARBITRATOR]: 'Not authorized as arbitrator',
  [ERR_DISPUTE_PERIOD_EXPIRED]: 'Dispute period has expired',
};

/** Get human-readable error message from code */
export function getErrorMessage(code: number): string {
  return ERROR_MESSAGES[code] ?? `Unknown error code: ${code}`;
}

/** Check if a number is a known error code */
export function isKnownError(code: number): boolean {
  return code in ERROR_MESSAGES;
}
