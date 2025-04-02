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
