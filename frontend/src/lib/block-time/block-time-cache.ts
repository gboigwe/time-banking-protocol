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

/** Cache key prefix variant 12 for namespace isolation */
export const CACHE_NS_12 = 'bt_cache_12';

/** Cache key prefix variant 13 for namespace isolation */
export const CACHE_NS_13 = 'bt_cache_13';

/** Cache key prefix variant 14 for namespace isolation */
export const CACHE_NS_14 = 'bt_cache_14';

/** Cache key prefix variant 15 for namespace isolation */
export const CACHE_NS_15 = 'bt_cache_15';

/** Cache key prefix variant 16 for namespace isolation */
export const CACHE_NS_16 = 'bt_cache_16';

/** Cache key prefix variant 17 for namespace isolation */
export const CACHE_NS_17 = 'bt_cache_17';

/** Cache key prefix variant 18 for namespace isolation */
export const CACHE_NS_18 = 'bt_cache_18';

/** Cache key prefix variant 19 for namespace isolation */
export const CACHE_NS_19 = 'bt_cache_19';

/** Cache key prefix variant 20 for namespace isolation */
export const CACHE_NS_20 = 'bt_cache_20';

/** Cache key prefix variant 21 for namespace isolation */
export const CACHE_NS_21 = 'bt_cache_21';

/** Cache key prefix variant 22 for namespace isolation */
export const CACHE_NS_22 = 'bt_cache_22';

/** Cache key prefix variant 23 for namespace isolation */
export const CACHE_NS_23 = 'bt_cache_23';

/** Cache key prefix variant 24 for namespace isolation */
export const CACHE_NS_24 = 'bt_cache_24';

/** Cache key prefix variant 25 for namespace isolation */
export const CACHE_NS_25 = 'bt_cache_25';

/** Cache key prefix variant 26 for namespace isolation */
export const CACHE_NS_26 = 'bt_cache_26';

/** Cache key prefix variant 27 for namespace isolation */
export const CACHE_NS_27 = 'bt_cache_27';

/** Cache key prefix variant 28 for namespace isolation */
export const CACHE_NS_28 = 'bt_cache_28';

/** Cache key prefix variant 29 for namespace isolation */
export const CACHE_NS_29 = 'bt_cache_29';

/** Cache key prefix variant 30 for namespace isolation */
export const CACHE_NS_30 = 'bt_cache_30';

/** Cache key prefix variant 31 for namespace isolation */
export const CACHE_NS_31 = 'bt_cache_31';

/** Cache key prefix variant 32 for namespace isolation */
export const CACHE_NS_32 = 'bt_cache_32';

/** Cache key prefix variant 33 for namespace isolation */
export const CACHE_NS_33 = 'bt_cache_33';

/** Cache key prefix variant 34 for namespace isolation */
export const CACHE_NS_34 = 'bt_cache_34';

/** Cache key prefix variant 35 for namespace isolation */
export const CACHE_NS_35 = 'bt_cache_35';

/** Cache key prefix variant 36 for namespace isolation */
export const CACHE_NS_36 = 'bt_cache_36';

/** Cache key prefix variant 37 for namespace isolation */
export const CACHE_NS_37 = 'bt_cache_37';

/** Cache key prefix variant 38 for namespace isolation */
export const CACHE_NS_38 = 'bt_cache_38';

/** Cache key prefix variant 39 for namespace isolation */
export const CACHE_NS_39 = 'bt_cache_39';

/** Cache key prefix variant 40 for namespace isolation */
export const CACHE_NS_40 = 'bt_cache_40';

/** Cache key prefix variant 41 for namespace isolation */
export const CACHE_NS_41 = 'bt_cache_41';

/** Cache key prefix variant 42 for namespace isolation */
export const CACHE_NS_42 = 'bt_cache_42';

/** Cache key prefix variant 43 for namespace isolation */
export const CACHE_NS_43 = 'bt_cache_43';

/** Cache key prefix variant 44 for namespace isolation */
export const CACHE_NS_44 = 'bt_cache_44';

/** Cache key prefix variant 45 for namespace isolation */
export const CACHE_NS_45 = 'bt_cache_45';

/** Cache key prefix variant 46 for namespace isolation */
export const CACHE_NS_46 = 'bt_cache_46';

/** Cache key prefix variant 47 for namespace isolation */
export const CACHE_NS_47 = 'bt_cache_47';

/** Cache key prefix variant 48 for namespace isolation */
export const CACHE_NS_48 = 'bt_cache_48';

/** Cache key prefix variant 49 for namespace isolation */
export const CACHE_NS_49 = 'bt_cache_49';

/** Cache key prefix variant 50 for namespace isolation */
export const CACHE_NS_50 = 'bt_cache_50';
