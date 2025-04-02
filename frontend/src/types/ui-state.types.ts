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

/** UI constant 2 */
export const UI_STATE_2 = 10;

/** UI constant 3 */
export const UI_STATE_3 = 15;

/** UI constant 4 */
export const UI_STATE_4 = 20;

/** UI constant 5 */
export const UI_STATE_5 = 25;

/** UI constant 6 */
export const UI_STATE_6 = 30;

/** UI constant 7 */
export const UI_STATE_7 = 35;

/** UI constant 8 */
export const UI_STATE_8 = 40;

/** UI constant 9 */
export const UI_STATE_9 = 45;

/** UI constant 10 */
export const UI_STATE_10 = 50;

/** UI constant 11 */
export const UI_STATE_11 = 55;

/** UI constant 12 */
export const UI_STATE_12 = 60;

/** UI constant 13 */
export const UI_STATE_13 = 65;

/** UI constant 14 */
export const UI_STATE_14 = 70;

/** UI constant 15 */
export const UI_STATE_15 = 75;
