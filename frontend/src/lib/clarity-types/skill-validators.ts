// skill-validators.ts — validation logic for skill-related data
import type { SkillMetadata, SkillLevel } from './skill-types';
import { SKILL_LEVELS } from './skill-types';

/** Maximum name length for a skill */
export const MAX_SKILL_NAME_LENGTH = 64;

/** Maximum description length for a skill */
export const MAX_SKILL_DESCRIPTION_LENGTH = 256;

/** Maximum number of tags per skill */
export const MAX_SKILL_TAGS = 10;
