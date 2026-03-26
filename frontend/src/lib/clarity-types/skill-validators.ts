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

/** Validate skill name length and content */
export function validateSkillName(name: string): string | null {
  if (!name || name.trim().length === 0) return 'Skill name is required';
  if (name.length > MAX_SKILL_NAME_LENGTH) {
    return `Skill name cannot exceed ${MAX_SKILL_NAME_LENGTH} characters`;
  }
  return null;
}

/** Validate skill tags count */
export function validateSkillTags(tags: string[]): string | null {
  if (tags.length > MAX_SKILL_TAGS) {
    return `Cannot have more than ${MAX_SKILL_TAGS} tags per skill`;
  }
  return null;
}

/** Validate a complete SkillMetadata object */
export function validateSkillMetadata(skill: Partial<SkillMetadata>): string[] {
  const errors: string[] = [];
  const nameErr = skill.name ? validateSkillName(skill.name) : 'Name is required';
  if (nameErr) errors.push(nameErr);
  if (skill.minLevel && skill.maxLevel) {
    const rangeErr = validateSkillLevelRange(skill.minLevel, skill.maxLevel);
    if (rangeErr) errors.push(rangeErr);
  }
  if (skill.tags) {
    const tagsErr = validateSkillTags(skill.tags);
    if (tagsErr) errors.push(tagsErr);
  }
  return errors;
}
