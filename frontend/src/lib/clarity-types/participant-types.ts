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

/** TimeBalance represents a participant's time balance map value */
export interface TimeBalance {
  /** Hours earned from providing services */
  earned: number;
  /** Hours spent on receiving services */
  spent: number;
  /** Net balance: earned minus spent */
  net: number;
  /** Hours currently in escrow */
  escrowed: number;
}

/** ParticipantProfile tuple from time-bank-core contract */
export interface ParticipantProfile {
  /** Stacks address of participant */
  address: string;
  /** Display name */
  displayName: string;
  /** Bio description */
  bio: string;
