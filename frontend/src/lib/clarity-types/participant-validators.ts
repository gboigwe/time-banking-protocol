// participant-validators.ts — validation for participant profiles
import type { ParticipantProfile } from './participant-types';

/** Maximum display name length */
export const MAX_DISPLAY_NAME_LENGTH = 64;

/** Maximum bio length */
export const MAX_BIO_LENGTH = 512;

/** Maximum number of offered skills per participant */
export const MAX_OFFERED_SKILLS = 20;

/** Validate display name */
export function validateDisplayName(name: string): string | null {
  if (!name || name.trim().length === 0) return 'Display name is required';
  if (name.length > MAX_DISPLAY_NAME_LENGTH) {
    return `Display name cannot exceed ${MAX_DISPLAY_NAME_LENGTH} characters`;
  }
  return null;
}

/** Validate bio */
export function validateBio(bio: string): string | null {
  if (bio.length > MAX_BIO_LENGTH) {
    return `Bio cannot exceed ${MAX_BIO_LENGTH} characters`;
  }
  return null;
}

/** Validate offered skills list */
export function validateOfferedSkills(skillIds: number[]): string | null {
  if (skillIds.length > MAX_OFFERED_SKILLS) {
    return `Cannot offer more than ${MAX_OFFERED_SKILLS} skills`;
  }
  const unique = new Set(skillIds);
  if (unique.size !== skillIds.length) {
    return 'Duplicate skill IDs are not allowed';
  }
  return null;
}

/** Validate a complete ParticipantProfile for registration */
export function validateParticipantRegistration(profile: Partial<ParticipantProfile>): string[] {
  const errors: string[] = [];
  if (!profile.address) errors.push('Address is required');
  const nameErr = profile.displayName
    ? validateDisplayName(profile.displayName) : 'Display name is required';
  if (nameErr) errors.push(nameErr);
  if (profile.bio) {
    const bioErr = validateBio(profile.bio);
    if (bioErr) errors.push(bioErr);
  }
  if (profile.offeredSkills) {
    const skillsErr = validateOfferedSkills(profile.offeredSkills);
    if (skillsErr) errors.push(skillsErr);
  }
  return errors;
}
