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
