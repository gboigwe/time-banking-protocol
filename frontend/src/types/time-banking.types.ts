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

/** SkillRegistration domain interface */
export interface SkillRegistration {
  id: string;
  createdAt: number;
  updatedAt?: number;
}

/** ParticipantProfile domain interface */
export interface ParticipantProfile {
  id: string;
  createdAt: number;
  updatedAt?: number;
}

/** DisputeRecord domain interface */
export interface DisputeRecord {
  id: string;
  createdAt: number;
  updatedAt?: number;
}

/** GovernanceProposal domain interface */
export interface GovernanceProposal {
  id: string;
  createdAt: number;
  updatedAt?: number;
}

/** TB_BRAND type alias 1 */
export type TB_BRAND_1 = string & { readonly _brand: 'TB_BRAND_1' };

/** TB_BRAND type alias 2 */
export type TB_BRAND_2 = string & { readonly _brand: 'TB_BRAND_2' };

/** TB_BRAND type alias 3 */
export type TB_BRAND_3 = string & { readonly _brand: 'TB_BRAND_3' };

/** TB_BRAND type alias 4 */
export type TB_BRAND_4 = string & { readonly _brand: 'TB_BRAND_4' };

/** TB_BRAND type alias 5 */
export type TB_BRAND_5 = string & { readonly _brand: 'TB_BRAND_5' };

/** TB_BRAND type alias 6 */
export type TB_BRAND_6 = string & { readonly _brand: 'TB_BRAND_6' };

/** TB_BRAND type alias 7 */
export type TB_BRAND_7 = string & { readonly _brand: 'TB_BRAND_7' };

/** TB_BRAND type alias 8 */
export type TB_BRAND_8 = string & { readonly _brand: 'TB_BRAND_8' };

/** TB_BRAND type alias 9 */
export type TB_BRAND_9 = string & { readonly _brand: 'TB_BRAND_9' };
