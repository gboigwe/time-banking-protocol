// time-record-validators.ts — validation logic for TimeRecord data
import type { TimeRecord } from './time-record-types';
import { toHoursUnit } from './time-record-types';

/** Minimum allowed hours for an exchange */
export const MIN_EXCHANGE_HOURS = toHoursUnit(0.25);

/** Maximum allowed hours for a single exchange */
export const MAX_EXCHANGE_HOURS = toHoursUnit(100);

/** Maximum length for exchange description */
export const MAX_DESCRIPTION_LENGTH = 500;

/** Validate hours amount is in acceptable range */
export function validateHours(hours: number): string | null {
  if (hours < MIN_EXCHANGE_HOURS) {
    return `Hours must be at least ${MIN_EXCHANGE_HOURS}`;
  }
  if (hours > MAX_EXCHANGE_HOURS) {
    return `Hours cannot exceed ${MAX_EXCHANGE_HOURS}`;
  }
  return null;
}

/** Validate provider and requester are not the same */
export function validateNotSelfExchange(provider: string, requester: string): string | null {
  if (provider === requester) {
    return 'Provider and requester cannot be the same address';
  }
  return null;
}
