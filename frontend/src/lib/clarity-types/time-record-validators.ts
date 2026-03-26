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

/** Validate exchange description length */
export function validateDescription(description?: string): string | null {
  if (description && description.length > MAX_DESCRIPTION_LENGTH) {
    return `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  return null;
}

/** Validate a complete TimeRecord for submission */
export function validateTimeRecord(record: Partial<TimeRecord>): string[] {
  const errors: string[] = [];
  if (!record.provider) errors.push('Provider address is required');
  if (!record.requester) errors.push('Requester address is required');
  const hoursError = record.hours != null ? validateHours(record.hours) : 'Hours is required';
  if (hoursError) errors.push(hoursError);
  const selfError = record.provider && record.requester
    ? validateNotSelfExchange(record.provider, record.requester) : null;
  if (selfError) errors.push(selfError);
  const descError = validateDescription(record.description);
  if (descError) errors.push(descError);
  return errors;
}

/** Check if a TimeRecord is valid for submission */
export function isValidTimeRecord(record: Partial<TimeRecord>): boolean {
  return validateTimeRecord(record).length === 0;
}
