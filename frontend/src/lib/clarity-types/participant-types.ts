// participant-types.ts — Clarity v4 participant profile type definitions

/** ParticipantStatus maps to Clarity uint status codes */
export enum ParticipantStatus {
  Unregistered = 0,
  Active = 1,
  Suspended = 2,
  Banned = 3,
}

/** ReputationScore maps to optional<uint> in Clarity */
export type ReputationScore = number | null;
