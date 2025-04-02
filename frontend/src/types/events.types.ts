// events.types.ts — on-chain event types from all 17 contracts

/** ExchangeCreated on-chain event */
export interface ExchangeCreatedEvent {
  type: 'ExchangeCreated';
  txId: string;
  blockHeight: number;
  contractId: string;
  data: Record<string, unknown>;
}
