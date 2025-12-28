/**
 * Typed Error Handling for Stacks.js v8+
 * Comprehensive error types and handlers
 */

import { TxBroadcastResult } from '@stacks/transactions';

/**
 * Error types for Stacks transactions
 */
export enum StacksErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  BROADCAST_ERROR = 'BROADCAST_ERROR',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  NONCE_ERROR = 'NONCE_ERROR',
  POST_CONDITION_FAILED = 'POST_CONDITION_FAILED',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Base Stacks error class
 */
export class StacksError extends Error {
  readonly type: StacksErrorType;
  readonly originalError?: Error;
  readonly txId?: string;
  readonly details?: Record<string, unknown>;

  constructor(
    type: StacksErrorType,
    message: string,
    originalError?: Error,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'StacksError';
    this.type = type;
    this.originalError = originalError;
    this.details = details;
    Object.setPrototypeOf(this, StacksError.prototype);
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends StacksError {
  constructor(message: string, originalError?: Error) {
    super(StacksErrorType.NETWORK_ERROR, message, originalError);
    this.name = 'NetworkError';
  }
}

/**
 * Transaction broadcast errors
 */
export class BroadcastError extends StacksError {
  constructor(message: string, txId?: string, originalError?: Error) {
    super(StacksErrorType.BROADCAST_ERROR, message, originalError);
    this.name = 'BroadcastError';
    this.txId = txId;
  }
}

/**
 * Insufficient funds errors
 */
export class InsufficientFundsError extends StacksError {
  constructor(required: string, available: string) {
    super(
      StacksErrorType.INSUFFICIENT_FUNDS,
      `Insufficient funds: required ${required}, available ${available}`,
      undefined,
      { required, available }
    );
    this.name = 'InsufficientFundsError';
  }
}

/**
 * Post-condition failure errors
 */
export class PostConditionError extends StacksError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(StacksErrorType.POST_CONDITION_FAILED, message, undefined, details);
    this.name = 'PostConditionError';
  }
}

/**
 * Error parser for Stacks responses
 */
export class ErrorParser {
  /**
   * Parse TxBroadcastResult error
   */
  static parseBroadcastError(result: TxBroadcastResult): StacksError | null {
    if (!result.error) return null;

    const errorMsg = result.error.toLowerCase();

    // Check for insufficient funds
    if (errorMsg.includes('insufficient') || errorMsg.includes('not enough')) {
      return new InsufficientFundsError('unknown', 'unknown');
    }

    // Check for nonce errors
    if (errorMsg.includes('nonce')) {
      return new StacksError(
        StacksErrorType.NONCE_ERROR,
        result.error,
        undefined,
        { txid: result.txid }
      );
    }

    // Check for post-condition errors
    if (errorMsg.includes('post condition') || errorMsg.includes('postcondition')) {
      return new PostConditionError(result.error);
    }

    // Generic broadcast error
    return new BroadcastError(result.error, result.txid);
  }

  /**
   * Parse general error
   */
  static parseError(error: unknown): StacksError {
    if (error instanceof StacksError) {
      return error;
    }

    if (error instanceof Error) {
      // Check error message for specific types
      const msg = error.message.toLowerCase();

      if (msg.includes('network') || msg.includes('connection')) {
        return new NetworkError(error.message, error);
      }

      if (msg.includes('unauthorized') || msg.includes('permission')) {
        return new StacksError(
          StacksErrorType.UNAUTHORIZED,
          error.message,
          error
        );
      }

      return new StacksError(
        StacksErrorType.UNKNOWN_ERROR,
        error.message,
        error
      );
    }

    return new StacksError(
      StacksErrorType.UNKNOWN_ERROR,
      'An unknown error occurred',
      undefined,
      { originalError: error }
    );
  }
}

/**
 * Error handler with retry logic
 */
export class ErrorHandler {
  /**
   * Handle error with user-friendly message
   */
  static getUserMessage(error: StacksError): string {
    switch (error.type) {
      case StacksErrorType.NETWORK_ERROR:
        return 'Network connection failed. Please check your internet connection.';
      case StacksErrorType.INSUFFICIENT_FUNDS:
        return 'Insufficient funds to complete this transaction.';
      case StacksErrorType.NONCE_ERROR:
        return 'Transaction nonce conflict. Please try again.';
      case StacksErrorType.POST_CONDITION_FAILED:
        return 'Transaction security check failed. This transaction may not be safe.';
      case StacksErrorType.UNAUTHORIZED:
        return 'You are not authorized to perform this action.';
      case StacksErrorType.CONTRACT_ERROR:
        return 'Smart contract execution failed.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Determine if error is retryable
   */
  static isRetryable(error: StacksError): boolean {
    return [
      StacksErrorType.NETWORK_ERROR,
      StacksErrorType.NONCE_ERROR,
    ].includes(error.type);
  }

  /**
   * Get retry delay in milliseconds
   */
  static getRetryDelay(attemptNumber: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    return Math.min(1000 * Math.pow(2, attemptNumber), 30000);
  }
}

/**
 * Retry wrapper for transaction operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: StacksError | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = ErrorParser.parseError(error);

      if (!ErrorHandler.isRetryable(lastError) || attempt === maxRetries - 1) {
        throw lastError;
      }

      // Wait before retrying
      const delay = ErrorHandler.getRetryDelay(attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new StacksError(
    StacksErrorType.UNKNOWN_ERROR,
    'Operation failed after retries'
  );
}
