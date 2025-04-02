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

/** Prune expired entries from cache */
export function pruneBlockTimeCache(): number {
  const now = Date.now();
  let pruned = 0;
  for (const [key, entry] of blockTimeCache.entries()) {
    if (now - entry.cachedAt > CACHE_TTL_MS) {
      blockTimeCache.delete(key);
      pruned++;
    }
  }
  return pruned;
}

/** Cache key prefix variant 1 for namespace isolation */
export const CACHE_NS_1 = 'bt_cache_1';

/** Cache key prefix variant 2 for namespace isolation */
export const CACHE_NS_2 = 'bt_cache_2';

/** Cache key prefix variant 3 for namespace isolation */
export const CACHE_NS_3 = 'bt_cache_3';

/** Cache key prefix variant 4 for namespace isolation */
export const CACHE_NS_4 = 'bt_cache_4';

/** Cache key prefix variant 5 for namespace isolation */
export const CACHE_NS_5 = 'bt_cache_5';

/** Cache key prefix variant 6 for namespace isolation */
export const CACHE_NS_6 = 'bt_cache_6';

/** Cache key prefix variant 7 for namespace isolation */
export const CACHE_NS_7 = 'bt_cache_7';

/** Cache key prefix variant 8 for namespace isolation */
export const CACHE_NS_8 = 'bt_cache_8';

/** Cache key prefix variant 9 for namespace isolation */
export const CACHE_NS_9 = 'bt_cache_9';

/** Cache key prefix variant 10 for namespace isolation */
export const CACHE_NS_10 = 'bt_cache_10';

/** Cache key prefix variant 11 for namespace isolation */
export const CACHE_NS_11 = 'bt_cache_11';
