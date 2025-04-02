// skill-types.ts — Clarity v4 skill-related type definitions

/** SkillLevel represents a uint in range 1–5 from Clarity contract */
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

/** CertificationStatus mirrors optional in Clarity contract */
export type CertificationStatus = 'none' | 'pending' | 'verified' | 'revoked';

/** SkillCategory tuple from skill-registry contract */
export interface SkillCategory {
  /** Unique category identifier */
  categoryId: number;
  /** Human-readable category name */
  name: string;
  /** Category description */
  description: string;
  /** Whether this category is active */
  isActive: boolean;
}

/** SkillMetadata tuple from skill-registry contract */
export interface SkillMetadata {
  /** Skill identifier */
  skillId: number;
  /** Skill name */
  name: string;
  /** Category this skill belongs to */
  categoryId: number;
  /** Minimum level required */
  minLevel: SkillLevel;
