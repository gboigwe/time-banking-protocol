// error-helpers.ts — error handling utilities

/** Base Stacks error class */
export class StacksError extends Error {
  constructor(message: string, public readonly code?: number) {
    super(message);
    this.name = 'StacksError';
  }
}
