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
