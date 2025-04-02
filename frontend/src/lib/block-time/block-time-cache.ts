// block-time-cache.ts — simple cache for block height to timestamp mappings

/** Cached entry for a block height lookup */
export interface BlockTimeCacheEntry {
  /** Block height */
  blockHeight: number;
  /** Timestamp when this block was mined */
  timestamp: number;
  /** When this cache entry was created (local time) */
  cachedAt: number;
}

/** Cache TTL in milliseconds (5 minutes) */
export const CACHE_TTL_MS = 5 * 60 * 1000;
