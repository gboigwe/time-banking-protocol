// block-time-hooks-types.ts — TypeScript types for block-time React hooks

/** State shape for useBlockTime hook */
export interface BlockTimeState {
  /** Current chain tip block height */
  currentBlock: number | null;
  /** Whether block height is loading */
  isLoading: boolean;
