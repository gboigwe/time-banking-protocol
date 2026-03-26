// time-record-types.ts — Clarity v4 type representations for time exchange records

// HoursUnit branded type
export type HoursUnit = number & { readonly __brand: 'HoursUnit' };

/** Create a HoursUnit value from a raw number */
export function toHoursUnit(value: number): HoursUnit {
  return value as HoursUnit;
}

// ServiceStatus enum mapping Clarity uint values
export enum ServiceStatus {
  Pending = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3,
  Disputed = 4,
  Expired = 5,
}

// ExchangeDirection union type
export type ExchangeDirection = 'offer' | 'request';

// TimeRecord tuple shape representing Clarity tuple from exchange-manager
export interface TimeRecord {
  /** Unique exchange identifier */
  exchangeId: number;
  /** Address of the service provider */
  provider: string;
  /** Address of the service requester */
  requester: string;
  /** Number of hours exchanged */
  hours: HoursUnit;
  /** Skill category identifier */
  skillId: number;
  /** Current status of the service */
  status: ServiceStatus;
  /** Block height when exchange was created */
  createdAt: number;
  /** Block height when exchange expires */
  expiresAt: number;
  /** Direction of the exchange */
  direction: ExchangeDirection;
  /** Optional description of the service */
  description?: string;
}

/**
 * SkillExchange response type returned by read-only contract calls
 * Maps directly to Clarity response<tuple, uint> pattern
 */
export interface SkillExchangeResponse {
  /** Whether the response is ok or err */
  type: 'ok' | 'err';
  /** The exchange record if successful */
  value?: TimeRecord;
  /** Error code if failed */
  error?: number;
}

/** Type guard for TimeRecord */
export function isTimeRecord(value: unknown): value is TimeRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    'exchangeId' in value &&
    'provider' in value &&
    'requester' in value
  );
}

/** Convert raw Clarity tuple to TimeRecord */
export function clarityTupleToTimeRecord(tuple: Record<string, unknown>): TimeRecord {
  return {
    exchangeId: Number(tuple['exchange-id'] ?? 0),
    provider: String(tuple['provider'] ?? ''),
    requester: String(tuple['requester'] ?? ''),
    hours: toHoursUnit(Number(tuple['hours'] ?? 0)),
    skillId: Number(tuple['skill-id'] ?? 0),
    status: Number(tuple['status'] ?? 0) as ServiceStatus,
    createdAt: Number(tuple['created-at'] ?? 0),
    expiresAt: Number(tuple['expires-at'] ?? 0),
    direction: (tuple['direction'] as ExchangeDirection) ?? 'offer',
    description: tuple['description'] ? String(tuple['description']) : undefined,
  };
}

/** Default TimeRecord value for initializing state */
export const DEFAULT_TIME_RECORD: TimeRecord = {
  exchangeId: 0,
  provider: '',
  requester: '',
  hours: toHoursUnit(0),
  skillId: 0,
  status: ServiceStatus.Pending,
  createdAt: 0,
  expiresAt: 0,
  direction: 'offer',
};
