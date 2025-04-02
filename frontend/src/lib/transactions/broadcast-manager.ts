// broadcast-manager.ts — transaction broadcasting with retry logic

/** Broadcast result type */
export interface BroadcastResult {
  txId: string;
  status: 'ok' | 'error';
  error?: string;
}

/** Broadcast error class */
export class BroadcastError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly txId?: string
  ) {
    super(message);
    this.name = 'BroadcastError';
  }
}

/** BroadcastManager handles tx broadcast with retry */
export class BroadcastManager {
  private successCallbacks: Array<(result: BroadcastResult) => void> = [];
  private failureCallbacks: Array<(error: BroadcastError) => void> = [];
  private pendingCallbacks: Array<(txId: string) => void> = [];
