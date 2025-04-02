// events.types.ts — on-chain event types from all 17 contracts

/** ExchangeCreated on-chain event */
export interface ExchangeCreatedEvent {
  type: 'ExchangeCreated';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** ExchangeCompleted on-chain event */
export interface ExchangeCompletedEvent {
  type: 'ExchangeCompleted';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** ExchangeCancelled on-chain event */
export interface ExchangeCancelledEvent {
  type: 'ExchangeCancelled';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** SkillRegistered on-chain event */
export interface SkillRegisteredEvent {
  type: 'SkillRegistered';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** SkillVerified on-chain event */
export interface SkillVerifiedEvent {
  type: 'SkillVerified';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** ParticipantRegistered on-chain event */
export interface ParticipantRegisteredEvent {
  type: 'ParticipantRegistered';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** DisputeOpened on-chain event */
export interface DisputeOpenedEvent {
  type: 'DisputeOpened';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** DisputeResolved on-chain event */
export interface DisputeResolvedEvent {
  type: 'DisputeResolved';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** ProposalCreated on-chain event */
export interface ProposalCreatedEvent {
  type: 'ProposalCreated';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** VoteCast on-chain event */
export interface VoteCastEvent {
  type: 'VoteCast';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** RewardClaimed on-chain event */
export interface RewardClaimedEvent {
  type: 'RewardClaimed';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** EscrowCreated on-chain event */
export interface EscrowCreatedEvent {
  type: 'EscrowCreated';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}

/** EscrowReleased on-chain event */
export interface EscrowReleasedEvent {
  type: 'EscrowReleased';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}
