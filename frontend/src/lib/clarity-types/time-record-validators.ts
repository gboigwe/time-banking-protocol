// time-record-validators.ts — validation logic for TimeRecord data
import type { TimeRecord } from './time-record-types';
import { toHoursUnit } from './time-record-types';

/** Minimum allowed hours for an exchange */
export const MIN_EXCHANGE_HOURS = toHoursUnit(0.25);
