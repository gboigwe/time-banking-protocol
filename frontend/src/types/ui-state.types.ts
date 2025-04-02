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

/** PaginationState UI type */
export interface PaginationState {
  active: boolean;
  data?: unknown;
}

/** FilterState UI type */
export interface FilterState {
  active: boolean;
  data?: unknown;
}

/** SortState UI type */
export interface SortState {
  active: boolean;
  data?: unknown;
}

/** ModalState UI type */
export interface ModalState {
  active: boolean;
  data?: unknown;
}

/** ToastState UI type */
export interface ToastState {
  active: boolean;
  data?: unknown;
}

/** UI constant 1 */
export const UI_STATE_1 = 5;
