// block-time-hooks-types.ts — TypeScript types for block-time React hooks

/** State shape for useBlockTime hook */
export interface BlockTimeState {
  /** Current chain tip block height */
  currentBlock: number | null;
  /** Whether block height is loading */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Last time block height was fetched */
  lastUpdated: Date | null;
}

/** State shape for useBlockCountdown hook */
export interface BlockCountdownState {
  /** Remaining blocks until target */
  remainingBlocks: number;
  /** Human-readable time remaining */
  timeRemaining: string;
  /** Whether target has been reached */
  isExpired: boolean;
  /** Progress percentage (0-100) */
  progressPercent: number;
  /** Urgency level based on remaining time */
  urgency: 'critical' | 'warning' | 'normal';
}

/** Config for useBlockCountdown hook */
export interface BlockCountdownConfig {
  /** Target block height */
  targetBlock: number;
  /** Start block for progress calculation */
  startBlock?: number;
  /** Polling interval in milliseconds */
  pollIntervalMs?: number;
}

/** Poll interval option 1: 5000 ms */
export const POLL_INTERVAL_1 = 5000;

/** Poll interval option 2: 10000 ms */
export const POLL_INTERVAL_2 = 10000;

/** Poll interval option 3: 15000 ms */
export const POLL_INTERVAL_3 = 15000;

/** Poll interval option 4: 20000 ms */
export const POLL_INTERVAL_4 = 20000;

/** Poll interval option 5: 25000 ms */
export const POLL_INTERVAL_5 = 25000;

/** Poll interval option 6: 30000 ms */
export const POLL_INTERVAL_6 = 30000;

/** Poll interval option 7: 35000 ms */
export const POLL_INTERVAL_7 = 35000;

/** Poll interval option 8: 40000 ms */
export const POLL_INTERVAL_8 = 40000;

/** Poll interval option 9: 45000 ms */
export const POLL_INTERVAL_9 = 45000;

/** Poll interval option 10: 50000 ms */
export const POLL_INTERVAL_10 = 50000;

/** Poll interval option 11: 55000 ms */
export const POLL_INTERVAL_11 = 55000;

/** Poll interval option 12: 60000 ms */
export const POLL_INTERVAL_12 = 60000;

/** Poll interval option 13: 65000 ms */
export const POLL_INTERVAL_13 = 65000;

/** Poll interval option 14: 70000 ms */
export const POLL_INTERVAL_14 = 70000;

/** Poll interval option 15: 75000 ms */
export const POLL_INTERVAL_15 = 75000;

/** Poll interval option 16: 80000 ms */
export const POLL_INTERVAL_16 = 80000;

/** Poll interval option 17: 85000 ms */
export const POLL_INTERVAL_17 = 85000;

/** Poll interval option 18: 90000 ms */
export const POLL_INTERVAL_18 = 90000;

/** Poll interval option 19: 95000 ms */
export const POLL_INTERVAL_19 = 95000;

/** Poll interval option 20: 100000 ms */
export const POLL_INTERVAL_20 = 100000;

/** Poll interval option 21: 105000 ms */
export const POLL_INTERVAL_21 = 105000;

/** Poll interval option 22: 110000 ms */
export const POLL_INTERVAL_22 = 110000;

/** Poll interval option 23: 115000 ms */
export const POLL_INTERVAL_23 = 115000;

/** Poll interval option 24: 120000 ms */
export const POLL_INTERVAL_24 = 120000;

/** Poll interval option 25: 125000 ms */
export const POLL_INTERVAL_25 = 125000;

/** Poll interval option 26: 130000 ms */
export const POLL_INTERVAL_26 = 130000;

/** Poll interval option 27: 135000 ms */
export const POLL_INTERVAL_27 = 135000;

/** Poll interval option 28: 140000 ms */
export const POLL_INTERVAL_28 = 140000;

/** Poll interval option 29: 145000 ms */
export const POLL_INTERVAL_29 = 145000;

/** Poll interval option 30: 150000 ms */
export const POLL_INTERVAL_30 = 150000;

/** Poll interval option 31: 155000 ms */
export const POLL_INTERVAL_31 = 155000;

/** Poll interval option 32: 160000 ms */
export const POLL_INTERVAL_32 = 160000;

/** Poll interval option 33: 165000 ms */
export const POLL_INTERVAL_33 = 165000;

/** Poll interval option 34: 170000 ms */
export const POLL_INTERVAL_34 = 170000;

/** Poll interval option 35: 175000 ms */
export const POLL_INTERVAL_35 = 175000;

/** Poll interval option 36: 180000 ms */
export const POLL_INTERVAL_36 = 180000;

/** Poll interval option 37: 185000 ms */
export const POLL_INTERVAL_37 = 185000;
