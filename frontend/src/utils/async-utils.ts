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
