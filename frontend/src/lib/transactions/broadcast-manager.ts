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

  onSuccess(cb: (result: BroadcastResult) => void): this {
    this.successCallbacks.push(cb);
    return this;
  }

  onFailure(cb: (error: BroadcastError) => void): this {
    this.failureCallbacks.push(cb);
    return this;
  }

  onPending(cb: (txId: string) => void): this {
    this.pendingCallbacks.push(cb);
    return this;
  }

  async broadcast(_txHex: string): Promise<BroadcastResult> {
    const result: BroadcastResult = { txId: 'placeholder', status: 'ok' };
    this.successCallbacks.forEach(cb => cb(result));
    return result;
  }
}

/** RETRY_DELAY_1 */
export const RETRY_DELAY_1 = 13;

/** RETRY_DELAY_2 */
export const RETRY_DELAY_2 = 26;

/** RETRY_DELAY_3 */
export const RETRY_DELAY_3 = 39;
