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
