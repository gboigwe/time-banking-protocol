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
