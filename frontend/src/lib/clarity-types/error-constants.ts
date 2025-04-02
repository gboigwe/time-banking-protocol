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
