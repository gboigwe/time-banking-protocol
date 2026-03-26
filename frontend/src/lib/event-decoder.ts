/**
 * Event Decoder for Time-Banking Protocol
 * Decodes Clarity print events emitted by time-banking contracts into typed objects
 */

import { hexToCV, cvToValue, ClarityType } from '@stacks/transactions';

export type TimeBankEventType =
  | 'user-registered'
  | 'credits-transferred'
  | 'credits-minted'
  | 'user-deactivated'
  | 'user-reactivated'
  | 'exchange-created'
  | 'exchange-accepted'
  | 'exchange-started'
  | 'exchange-completed'
  | 'exchange-cancelled'
  | 'review-submitted'
  | 'escrow-created'
  | 'escrow-released'
  | 'dispute-opened'
  | 'dispute-resolved'
  | 'schedule-created'
  | 'tokens-staked'
  | 'exchange-recorded'
  | 'proposal-created'
  | 'vote-cast'
  | 'proposal-executed'
  | 'reputation-updated'
  | 'badge-awarded'
  | 'skill-registered'
  | 'skill-verified'
  | 'certification-issued'
  | 'reward-claimed'
  | 'referral-used'
  | 'unknown';

export interface BaseTimeBankEvent {
  event: TimeBankEventType;
  timestamp?: number;
  txId?: string;
  contractId?: string;
  blockHeight?: number;
}

export interface UserRegisteredEvent extends BaseTimeBankEvent {
  event: 'user-registered';
  user: string;
  initialCredits: number;
}

export interface CreditsTransferredEvent extends BaseTimeBankEvent {
  event: 'credits-transferred';
  from: string;
  to: string;
  amount: number;
}

export interface ExchangeCreatedEvent extends BaseTimeBankEvent {
  event: 'exchange-created';
  exchangeId: number;
  requester: string;
  provider: string;
}

export interface ExchangeCompletedEvent extends BaseTimeBankEvent {
  event: 'exchange-completed';
  exchangeId: number;
  credits: number;
}

export interface EscrowCreatedEvent extends BaseTimeBankEvent {
  event: 'escrow-created';
  escrowId: number;
  depositor: string;
  amount: number;
}

export interface TokensStakedEvent extends BaseTimeBankEvent {
  event: 'tokens-staked';
  staker: string;
  amount: number;
  stakedAt: number;
}

export interface ScheduleCreatedEvent extends BaseTimeBankEvent {
  event: 'schedule-created';
  scheduleId: number;
  owner: string;
  recipient: string;
  interval: number;
  nextExecution: number;
  createdAt: number;
}

export type DecodedTimeBankEvent =
  | UserRegisteredEvent
  | CreditsTransferredEvent
  | ExchangeCreatedEvent
  | ExchangeCompletedEvent
  | EscrowCreatedEvent
  | TokensStakedEvent
  | ScheduleCreatedEvent
  | BaseTimeBankEvent;

export interface RawContractEvent {
  event_type: string;
  tx_id: string;
  contract_log?: {
    contract_id: string;
    topic: string;
    value: { hex: string; repr: string };
  };
  block_height?: number;
}

export class EventDecoder {
  decodeEvent(raw: RawContractEvent): DecodedTimeBankEvent | null {
    if (raw.event_type !== 'smart_contract_log' || !raw.contract_log) return null;
    try {
      const cv = hexToCV(raw.contract_log.value.hex);
      const value = cvToValue(cv, true);
      if (!value || typeof value !== 'object') return null;
      const eventType = (value.event as string) as TimeBankEventType;

      const base: BaseTimeBankEvent = {
        event: eventType ?? 'unknown',
        timestamp: value.timestamp ? Number(value.timestamp) : undefined,
        txId: raw.tx_id,
        contractId: raw.contract_log.contract_id,
        blockHeight: raw.block_height,
      };

      return this.enrichEvent(base, value);
    } catch {
      return null;
    }
  }

  decodeEvents(raws: RawContractEvent[]): DecodedTimeBankEvent[] {
    return raws.flatMap(r => {
      const decoded = this.decodeEvent(r);
      return decoded ? [decoded] : [];
    });
  }

  filterByType<T extends DecodedTimeBankEvent>(
    events: DecodedTimeBankEvent[],
    type: TimeBankEventType
  ): T[] {
    return events.filter(e => e.event === type) as T[];
  }

  private enrichEvent(base: BaseTimeBankEvent, value: Record<string, unknown>): DecodedTimeBankEvent {
    switch (base.event) {
      case 'user-registered':
        return {
          ...base,
          event: 'user-registered',
          user: String(value.user ?? ''),
          initialCredits: Number(value['initial-credits'] ?? value.initialCredits ?? 0),
        } as UserRegisteredEvent;

      case 'credits-transferred':
        return {
          ...base,
          event: 'credits-transferred',
          from: String(value.from ?? ''),
          to: String(value.to ?? ''),
          amount: Number(value.amount ?? 0),
        } as CreditsTransferredEvent;

      case 'exchange-created':
        return {
          ...base,
          event: 'exchange-created',
          exchangeId: Number(value['exchange-id'] ?? value.exchangeId ?? 0),
          requester: String(value.requester ?? ''),
          provider: String(value.provider ?? ''),
        } as ExchangeCreatedEvent;

      case 'exchange-completed':
        return {
          ...base,
          event: 'exchange-completed',
          exchangeId: Number(value['exchange-id'] ?? value.exchangeId ?? 0),
          credits: Number(value.credits ?? 0),
        } as ExchangeCompletedEvent;

      case 'escrow-created':
        return {
          ...base,
          event: 'escrow-created',
          escrowId: Number(value['escrow-id'] ?? value.escrowId ?? 0),
          depositor: String(value.depositor ?? ''),
          amount: Number(value.amount ?? 0),
        } as EscrowCreatedEvent;

      case 'tokens-staked':
        return {
          ...base,
          event: 'tokens-staked',
          staker: String(value.staker ?? ''),
          amount: Number(value.amount ?? 0),
          stakedAt: Number(value['staked-at'] ?? value.stakedAt ?? 0),
        } as TokensStakedEvent;

      case 'schedule-created':
        return {
          ...base,
          event: 'schedule-created',
          scheduleId: Number(value['schedule-id'] ?? value.scheduleId ?? 0),
          owner: String(value.owner ?? ''),
          recipient: String(value.recipient ?? ''),
          interval: Number(value.interval ?? 0),
          nextExecution: Number(value['next-execution'] ?? value.nextExecution ?? 0),
          createdAt: Number(value['created-at'] ?? value.createdAt ?? 0),
        } as ScheduleCreatedEvent;

      default:
        return base;
    }
  }
}

export function createEventDecoder(): EventDecoder {
  return new EventDecoder();
}
