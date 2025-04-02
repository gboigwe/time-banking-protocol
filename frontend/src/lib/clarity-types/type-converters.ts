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

/** Convert Clarity tuple response to typed SkillMetadata */
export function clarityToSkillMetadata(tuple: Record<string, unknown>): SkillMetadata {
  return {
    skillId: Number(tuple['skill-id'] ?? 0),
    name: String(tuple['name'] ?? ''),
    categoryId: Number(tuple['category-id'] ?? 0),
    minLevel: (Number(tuple['min-level'] ?? 1)) as 1 | 2 | 3 | 4 | 5,
    maxLevel: (Number(tuple['max-level'] ?? 5)) as 1 | 2 | 3 | 4 | 5,
    requiresCertification: Boolean(tuple['requires-certification'] ?? false),
    tags: Array.isArray(tuple['tags']) ? tuple['tags'].map(String) : [],
  };
}

/** Convert Clarity tuple to typed ParticipantProfile */
export function clarityToParticipantProfile(tuple: Record<string, unknown>): ParticipantProfile {
  const balance = (tuple['balance'] as Record<string, unknown>) ?? {};
  return {
    address: String(tuple['address'] ?? ''),
    displayName: String(tuple['display-name'] ?? ''),
    bio: String(tuple['bio'] ?? ''),
    status: Number(tuple['status'] ?? 0) as 0 | 1 | 2 | 3,
    balance: {
      earned: Number(balance['earned'] ?? 0),
      spent: Number(balance['spent'] ?? 0),
      net: Number(balance['net'] ?? 0),
      escrowed: Number(balance['escrowed'] ?? 0),
    },
    reputation: tuple['reputation'] != null ? Number(tuple['reputation']) : null,
    registeredAt: Number(tuple['registered-at'] ?? 0),
    completedExchanges: Number(tuple['completed-exchanges'] ?? 0),
    offeredSkills: Array.isArray(tuple['offered-skills'])
      ? tuple['offered-skills'].map(Number)
      : [],
  };
}
