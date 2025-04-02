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

/** Retrieve a cached block timestamp */
export function getCachedBlockTime(blockHeight: number): number | null {
  const entry = blockTimeCache.get(blockHeight);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    blockTimeCache.delete(blockHeight);
    return null;
  }
  return entry.timestamp;
}

/** Clear all cached block timestamps */
export function clearBlockTimeCache(): void {
  blockTimeCache.clear();
}

/** Get count of entries in cache */
export function getBlockTimeCacheSize(): number {
  return blockTimeCache.size;
}
