// error-helpers.ts — error handling utilities

/** Base Stacks error class */
export class StacksError extends Error {
  constructor(message: string, public readonly code?: number) {
    super(message);
    this.name = 'StacksError';
  }
}

/** Contract-specific error class */
export class ContractError extends StacksError {
  constructor(message: string, public readonly contractId: string, code?: number) {
    super(message, code);
    this.name = 'ContractError';
  }
}

/** Wallet-specific error class */
export class WalletError extends StacksError {
  constructor(message: string, public readonly wallet?: string) {
    super(message);
    this.name = 'WalletError';
  }
}

/** Parse a contract error code to message */
export function parseContractError(errorCode: number): string {
  const messages: Record<number, string> = {
    100: 'Not registered',
    101: 'Already registered',
    102: 'Insufficient hours',
    200: 'Exchange not found',
    201: 'Exchange not pending',
  };
  return messages[errorCode] ?? `Contract error: ${errorCode}`;
}
