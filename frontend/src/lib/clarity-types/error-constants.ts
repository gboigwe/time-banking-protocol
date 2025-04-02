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
