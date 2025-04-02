// skill-validators.ts — validation logic for skill-related data
import type { SkillMetadata, SkillLevel } from './skill-types';
import { SKILL_LEVELS } from './skill-types';

/** Maximum name length for a skill */
export const MAX_SKILL_NAME_LENGTH = 64;

/** Maximum description length for a skill */
export const MAX_SKILL_DESCRIPTION_LENGTH = 256;

/** Maximum number of tags per skill */
export const MAX_SKILL_TAGS = 10;

/** Validate that a skill level is valid */
export function validateSkillLevel(level: number): string | null {
  if (!SKILL_LEVELS.includes(level as SkillLevel)) {
    return `Skill level must be one of: ${SKILL_LEVELS.join(', ')}`;
  }
  return null;
}

/** Validate that min level <= max level */
export function validateSkillLevelRange(minLevel: SkillLevel, maxLevel: SkillLevel): string | null {
  if (minLevel > maxLevel) {
    return 'Minimum level cannot exceed maximum level';
  }
  return null;
}
