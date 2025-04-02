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

/** Check if an exchange can be disputed */
export function canDisputeExchange(status: ServiceStatus): boolean {
  return status === ServiceStatus.Active;
}

/** Get allowed next states for an exchange */
export function getAllowedTransitions(status: ServiceStatus): ServiceStatus[] {
  switch (status) {
    case ServiceStatus.Pending:
      return [ServiceStatus.Active, ServiceStatus.Cancelled, ServiceStatus.Expired];
    case ServiceStatus.Active:
      return [ServiceStatus.Completed, ServiceStatus.Disputed, ServiceStatus.Cancelled];
    case ServiceStatus.Disputed:
      return [ServiceStatus.Completed, ServiceStatus.Cancelled];
    default:
      return [];
  }
}

/** Human-readable label for ServiceStatus */
export function getStatusLabel(status: ServiceStatus): string {
  const labels: Record<ServiceStatus, string> = {
    [ServiceStatus.Pending]: 'Pending',
    [ServiceStatus.Active]: 'Active',
    [ServiceStatus.Completed]: 'Completed',
    [ServiceStatus.Cancelled]: 'Cancelled',
    [ServiceStatus.Disputed]: 'Disputed',
    [ServiceStatus.Expired]: 'Expired',
  };
  return labels[status] ?? 'Unknown';
}

/** Color coding for UI display */
export function getStatusColor(status: ServiceStatus): string {
  const colors: Record<ServiceStatus, string> = {
    [ServiceStatus.Pending]: 'yellow',
    [ServiceStatus.Active]: 'blue',
    [ServiceStatus.Completed]: 'green',
    [ServiceStatus.Cancelled]: 'gray',
    [ServiceStatus.Disputed]: 'red',
    [ServiceStatus.Expired]: 'orange',
  };
  return colors[status] ?? 'gray';
}

/** Is the exchange in a terminal state */
export function isTerminalStatus(status: ServiceStatus): boolean {
  return (
    status === ServiceStatus.Completed ||
    status === ServiceStatus.Cancelled ||
    status === ServiceStatus.Expired
  );
}
