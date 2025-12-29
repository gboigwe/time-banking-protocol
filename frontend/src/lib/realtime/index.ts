/**
 * Real-Time Synchronization Module
 * Central export point for all realtime functionality
 */

// Server-side exports
export {
  RealtimeSocketServer,
  initSocketServer,
  getSocketServer,
} from './socket-server';

export {
  ChainhookSocketServer,
  initChainhookSocket,
  getChainhookSocket,
} from './chainhook-socket';

export {
  SubscriptionManager,
  getSubscriptionManager,
  type SubscriptionRecord,
} from './subscription-manager';

export {
  EventStore,
  getEventStore,
} from './event-store';

// Client-side exports
export {
  SocketClient,
  getSocketClient,
  type EventHandler,
  type StatusHandler,
  type ErrorHandler,
} from './socket-client';

export {
  OptimisticStateManager,
  getOptimisticStateManager,
  type OnConfirmCallback,
  type OnRevertCallback,
} from './optimistic-state';

export {
  ConflictResolver,
  getConflictResolver,
} from './conflict-resolver';

export {
  OfflineQueue,
  getOfflineQueue,
} from './offline-queue';

// Type re-exports from types/realtime
export type {
  ChainhookEvent,
  ChainhookPayload,
  Subscription,
  SubscriptionType,
  WebSocketMessage,
  OptimisticUpdate,
  StateConflict,
  ConflictStrategy,
  OfflineQueueItem,
  SyncStatus,
} from '@/types/realtime';

export {
  ConnectionStatus,
} from '@/types/realtime';

/**
 * Version information
 */
export const REALTIME_VERSION = '1.0.0';

/**
 * Feature flags
 */
export const RealtimeFeatures = {
  websockets: true,
  optimisticUpdates: true,
  offlineQueue: true,
  conflictResolution: true,
  eventStore: true,
  subscriptionManager: true,
} as const;

/**
 * Configuration defaults
 */
export const RealtimeConfig = {
  socket: {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  },
  optimistic: {
    defaultTTL: 30000,
  },
  offline: {
    maxRetries: 3,
    syncInterval: 60000,
  },
  eventStore: {
    maxEvents: 100,
    retentionDays: 30,
  },
} as const;
