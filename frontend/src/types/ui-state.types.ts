// ui-state.types.ts — UI-specific state types

/** LoadingState UI type */
export interface LoadingState {
  active: boolean;
  data?: unknown;
}

/** ErrorState UI type */
export interface ErrorState {
  active: boolean;
  data?: unknown;
}
