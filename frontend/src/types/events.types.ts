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
