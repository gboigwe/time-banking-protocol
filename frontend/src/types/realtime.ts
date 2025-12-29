/**
 * Type Definitions for Real-Time Synchronization
 * Chainhooks, WebSockets, and Event Streaming
 */

/**
 * Chainhook Event from Stacks Blockchain
 */
export interface ChainhookEvent {
  txHash: string;
  blockHeight: number;
  blockHash: string;
  contractId: string;
  eventType: string;
  eventTopic?: string;
  value: any;
  affectedAddresses: string[];
  success: boolean;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Chainhook Payload (from webhook)
 */
export interface ChainhookPayload {
  apply: Array<{
    block_identifier: {
      index: number;
      hash: string;
    };
    parent_block_identifier: {
      index: number;
      hash: string;
    };
    timestamp: number;
    transactions: Array<{
      transaction_identifier: {
        hash: string;
      };
      metadata: {
        sender: string;
        success: boolean;
        receipt: {
          events: Array<{
            type: string;
            data: any;
          }>;
        };
        contract_calls_stack?: Array<{
          contract_identifier: string;
          function_name: string;
          function_args: any[];
        }>;
      };
    }>;
  }>;
  rollback?: Array<{
    block_identifier: {
      index: number;
      hash: string;
    };
  }>;
}

/**
 * Subscription types
 */
export type SubscriptionType = 'contract' | 'user' | 'event-type';

export interface Subscription {
  type: SubscriptionType;
  id?: string;
  address?: string;
  contractId?: string;
  eventTypes?: string[];
}

/**
 * WebSocket message types
 */
export interface WebSocketMessage {
  type: 'event' | 'subscription' | 'status' | 'error';
  payload: any;
  timestamp: number;
}

/**
 * Connection status
 */
export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * Optimistic update state
 */
export interface OptimisticUpdate<T = any> {
  id: string;
  type: string;
  data: T;
  status: 'pending' | 'confirmed' | 'reverted';
  timestamp: number;
  expiresAt: number;
  relatedTxId?: string;
}

/**
 * Conflict between local and remote state
 */
export interface StateConflict {
  key: string;
  localValue: any;
  remoteValue: any;
  timestamp: number;
  source: 'local' | 'remote';
}

/**
 * Conflict resolution strategy
 */
export type ConflictStrategy = 'remote-wins' | 'local-wins' | 'manual' | 'merge';

/**
 * Offline queue item
 */
export interface OfflineQueueItem {
  id: string;
  type: 'transaction' | 'state-update' | 'subscription';
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
  priority: number;
}

/**
 * Sync status
 */
export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: number;
  pendingUpdates: number;
  queuedItems: number;
  conflicts: number;
}
