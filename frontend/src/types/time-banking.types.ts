// time-banking.types.ts — core domain types for time banking protocol

/** TimeHours domain type */
export type TimeHours = string;

/** SkillLevel domain type */
export type SkillLevel = string;

/** ExchangeStatus domain type */
export type ExchangeStatus = string;

/** ParticipantRole domain type */
export type ParticipantRole = string;

/** ReputationTier domain type */
export type ReputationTier = string;

/** ServiceCategory domain type */
export type ServiceCategory = string;

/** ExchangeDirection domain type */
export type ExchangeDirection = string;

/** DisputeResolution domain type */
export type DisputeResolution = string;

/** TimeExchangeRecord domain interface */
export interface TimeExchangeRecord {
  id: string;
  createdAt: number;
  updatedAt?: number;
}
