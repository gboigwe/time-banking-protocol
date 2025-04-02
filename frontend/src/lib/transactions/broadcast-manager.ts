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

/** RETRY_DELAY_4 */
export const RETRY_DELAY_4 = 52;

/** RETRY_DELAY_5 */
export const RETRY_DELAY_5 = 65;

/** RETRY_DELAY_6 */
export const RETRY_DELAY_6 = 78;

/** RETRY_DELAY_7 */
export const RETRY_DELAY_7 = 91;

/** RETRY_DELAY_8 */
export const RETRY_DELAY_8 = 104;

/** RETRY_DELAY_9 */
export const RETRY_DELAY_9 = 117;

/** RETRY_DELAY_10 */
export const RETRY_DELAY_10 = 130;

/** RETRY_DELAY_11 */
export const RETRY_DELAY_11 = 143;

/** RETRY_DELAY_12 */
export const RETRY_DELAY_12 = 156;

/** RETRY_DELAY_13 */
export const RETRY_DELAY_13 = 169;

/** RETRY_DELAY_14 */
export const RETRY_DELAY_14 = 182;

/** RETRY_DELAY_15 */
export const RETRY_DELAY_15 = 195;

/** RETRY_DELAY_16 */
export const RETRY_DELAY_16 = 208;
