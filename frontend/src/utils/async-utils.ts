// async-utils.ts — async utility functions

/** Retry an async operation with exponential backoff */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

/** Wrap a promise with a timeout */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}

/** Debounce a function call */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

/** Throttle a function call */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limitMs) {
      lastCall = now;
      fn(...args);
    }
  };
}

/** Memoize a function's results */
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, unknown>();
  return ((...args: unknown[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/** Cancel token for aborting async operations */
export interface CancelToken {
  cancelled: boolean;
  cancel(): void;
}

/** Create a cancel token */
export function createCancelToken(): CancelToken {
  const token: CancelToken = {
    cancelled: false,
    cancel() { this.cancelled = true; },
  };
  return token;
}

/** ASYNC_CONST_1 */
export const ASYNC_CONST_1 = 19;

/** ASYNC_CONST_2 */
export const ASYNC_CONST_2 = 38;

/** ASYNC_CONST_3 */
export const ASYNC_CONST_3 = 57;

/** ASYNC_CONST_4 */
export const ASYNC_CONST_4 = 76;

/** ASYNC_CONST_5 */
export const ASYNC_CONST_5 = 95;

/** ASYNC_CONST_6 */
export const ASYNC_CONST_6 = 114;

/** ASYNC_CONST_7 */
export const ASYNC_CONST_7 = 133;

/** ASYNC_CONST_8 */
export const ASYNC_CONST_8 = 152;

/** ASYNC_CONST_9 */
export const ASYNC_CONST_9 = 171;

/** ASYNC_CONST_10 */
export const ASYNC_CONST_10 = 190;

/** ASYNC_CONST_11 */
export const ASYNC_CONST_11 = 209;

/** ASYNC_CONST_12 */
export const ASYNC_CONST_12 = 228;

/** ASYNC_CONST_13 */
export const ASYNC_CONST_13 = 247;

/** ASYNC_CONST_14 */
export const ASYNC_CONST_14 = 266;

/** ASYNC_CONST_15 */
export const ASYNC_CONST_15 = 285;

/** ASYNC_CONST_16 */
export const ASYNC_CONST_16 = 304;

/** ASYNC_CONST_17 */
export const ASYNC_CONST_17 = 323;

/** ASYNC_CONST_18 */
export const ASYNC_CONST_18 = 342;

/** ASYNC_CONST_19 */
export const ASYNC_CONST_19 = 361;

/** ASYNC_CONST_20 */
export const ASYNC_CONST_20 = 380;

/** ASYNC_CONST_21 */
export const ASYNC_CONST_21 = 399;

/** ASYNC_CONST_22 */
export const ASYNC_CONST_22 = 418;

/** ASYNC_CONST_23 */
export const ASYNC_CONST_23 = 437;

/** ASYNC_CONST_24 */
export const ASYNC_CONST_24 = 456;

/** ASYNC_CONST_25 */
export const ASYNC_CONST_25 = 475;

/** ASYNC_CONST_26 */
export const ASYNC_CONST_26 = 494;

/** ASYNC_CONST_27 */
export const ASYNC_CONST_27 = 513;

/** ASYNC_CONST_28 */
export const ASYNC_CONST_28 = 532;

/** ASYNC_CONST_29 */
export const ASYNC_CONST_29 = 551;

/** ASYNC_CONST_30 */
export const ASYNC_CONST_30 = 570;

/** ASYNC_CONST_31 */
export const ASYNC_CONST_31 = 589;

/** ASYNC_CONST_32 */
export const ASYNC_CONST_32 = 608;

/** ASYNC_CONST_33 */
export const ASYNC_CONST_33 = 627;

/** ASYNC_CONST_34 */
export const ASYNC_CONST_34 = 646;

/** ASYNC_CONST_35 */
export const ASYNC_CONST_35 = 665;

/** ASYNC_CONST_36 */
export const ASYNC_CONST_36 = 684;

/** ASYNC_CONST_37 */
export const ASYNC_CONST_37 = 703;

/** ASYNC_CONST_38 */
export const ASYNC_CONST_38 = 722;

/** ASYNC_CONST_39 */
export const ASYNC_CONST_39 = 741;

/** ASYNC_CONST_40 */
export const ASYNC_CONST_40 = 760;
