// exchange-status-helpers.ts — helpers for ServiceStatus transitions
import { ServiceStatus } from './time-record-types';

/** Check if an exchange can be accepted */
export function canAcceptExchange(status: ServiceStatus): boolean {
  return status === ServiceStatus.Pending;
}

/** Check if an exchange can be completed */
export function canCompleteExchange(status: ServiceStatus): boolean {
  return status === ServiceStatus.Active;
}

/** Check if an exchange can be cancelled */
export function canCancelExchange(status: ServiceStatus): boolean {
  return status === ServiceStatus.Pending || status === ServiceStatus.Active;
}
