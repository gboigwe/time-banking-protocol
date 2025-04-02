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
