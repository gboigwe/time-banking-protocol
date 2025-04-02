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
