// time-record-validators.ts — validation logic for TimeRecord data
import type { TimeRecord } from './time-record-types';
import { toHoursUnit } from './time-record-types';

/** Minimum allowed hours for an exchange */
export const MIN_EXCHANGE_HOURS = toHoursUnit(0.25);

/** Maximum allowed hours for a single exchange */
export const MAX_EXCHANGE_HOURS = toHoursUnit(100);

/** Maximum length for exchange description */
export const MAX_DESCRIPTION_LENGTH = 500;
