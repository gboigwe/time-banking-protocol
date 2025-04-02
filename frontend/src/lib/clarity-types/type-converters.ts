// type-converters.ts — convert between Clarity response types and TypeScript types
import type { TimeRecord } from './time-record-types';
import { clarityTupleToTimeRecord } from './time-record-types';
import type { SkillMetadata } from './skill-types';
import type { ParticipantProfile } from './participant-types';

/** Generic Clarity response wrapper */
export interface ClarityResponse<T> {
  type: 'ok' | 'err';
  value: T | number;
}

/** Extract value from ok response or throw */
export function unwrapOk<T>(response: ClarityResponse<T>): T {
  if (response.type === 'err') {
    throw new Error(`Contract returned error: ${response.value}`);
  }
  return response.value as T;
}

/** Extract value from ok response or return null */
export function unwrapOkOrNull<T>(response: ClarityResponse<T>): T | null {
  if (response.type === 'err') return null;
  return response.value as T;
}

/** Check if a Clarity response is ok */
export function isOkResponse<T>(response: ClarityResponse<T>): boolean {
  return response.type === 'ok';
}
