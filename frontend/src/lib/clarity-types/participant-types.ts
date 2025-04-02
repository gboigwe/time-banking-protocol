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
  /** Current status */
  status: ParticipantStatus;
  /** Time balance */
  balance: TimeBalance;
  /** Reputation score (null if not yet rated) */
  reputation: ReputationScore;
  /** Block height when registered */
  registeredAt: number;
  /** Total completed exchanges */
  completedExchanges: number;
  /** List of skill IDs this participant offers */
  offeredSkills: number[];
}

/** Type guard for ParticipantProfile */
export function isParticipantProfile(value: unknown): value is ParticipantProfile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'address' in value &&
    'status' in value &&
    'balance' in value
  );
}

/** Compute net balance from a TimeBalance */
export function computeNetBalance(balance: TimeBalance): number {
  return balance.earned - balance.spent - balance.escrowed;
}

/** Check if a participant is active */
export function isActiveParticipant(profile: ParticipantProfile): boolean {
  return profile.status === ParticipantStatus.Active;
}
