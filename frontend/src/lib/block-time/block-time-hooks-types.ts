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
