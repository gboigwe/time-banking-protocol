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

/** In-memory cache for block timestamps */
const blockTimeCache = new Map<number, BlockTimeCacheEntry>();

/** Store a block timestamp in cache */
export function cacheBlockTime(blockHeight: number, timestamp: number): void {
  blockTimeCache.set(blockHeight, {
    blockHeight,
    timestamp,
    cachedAt: Date.now(),
  });
}
