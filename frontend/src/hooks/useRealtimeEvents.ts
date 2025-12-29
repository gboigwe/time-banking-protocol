/**
 * useRealtimeEvents Hook
 * React hook for subscribing to blockchain events via WebSocket
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocketClient } from '@/lib/realtime/socket-client';
import { ChainhookEvent, ConnectionStatus, Subscription } from '@/types/realtime';

export interface UseRealtimeEventsOptions {
  subscriptions?: Subscription[];
  autoConnect?: boolean;
  maxEvents?: number;
  onEvent?: (event: ChainhookEvent) => void;
  onError?: (error: Error) => void;
}

export interface UseRealtimeEventsResult {
  events: ChainhookEvent[];
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  error: Error | null;
  subscribe: (subscription: Subscription) => void;
  unsubscribe: (room: string) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  clearEvents: () => void;
}

/**
 * Hook for managing real-time event subscriptions
 */
export function useRealtimeEvents(
  options: UseRealtimeEventsOptions = {}
): UseRealtimeEventsResult {
  const {
    subscriptions = [],
    autoConnect = true,
    maxEvents = 100,
    onEvent,
    onError,
  } = options;

  const [events, setEvents] = useState<ChainhookEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED
  );
  const [error, setError] = useState<Error | null>(null);
  const socketClient = useRef(getSocketClient());
  const isInitialized = useRef(false);

  /**
   * Handle new event
   */
  const handleEvent = useCallback(
    (event: ChainhookEvent) => {
      setEvents((prev) => {
        const updated = [event, ...prev];
        return updated.slice(0, maxEvents);
      });
      onEvent?.(event);
    },
    [maxEvents, onEvent]
  );

  /**
   * Handle status change
   */
  const handleStatusChange = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);
  }, []);

  /**
   * Handle error
   */
  const handleError = useCallback(
    (err: Error) => {
      setError(err);
      onError?.(err);
    },
    [onError]
  );

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(async () => {
    try {
      await socketClient.current.connect();

      // Set up event handlers
      const cleanupEvent = socketClient.current.onEvent(handleEvent);
      const cleanupStatus = socketClient.current.onStatusChange(handleStatusChange);
      const cleanupError = socketClient.current.onError(handleError);

      // Store cleanup functions
      return () => {
        cleanupEvent();
        cleanupStatus();
        cleanupError();
      };
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Connection failed'));
      throw err;
    }
  }, [handleEvent, handleStatusChange, handleError]);

  /**
   * Disconnect from server
   */
  const disconnect = useCallback(() => {
    socketClient.current.disconnect();
  }, []);

  /**
   * Subscribe to events
   */
  const subscribe = useCallback((subscription: Subscription) => {
    switch (subscription.type) {
      case 'contract':
        if (subscription.contractId) {
          socketClient.current.subscribeToContract(subscription.contractId);
        }
        break;
      case 'user':
        if (subscription.address) {
          socketClient.current.subscribeToUser(subscription.address);
        }
        break;
      case 'event-type':
        if (subscription.eventTypes && subscription.eventTypes.length > 0) {
          subscription.eventTypes.forEach((eventType) => {
            socketClient.current.subscribeToEventType(eventType);
          });
        }
        break;
    }
  }, []);

  /**
   * Unsubscribe from events
   */
  const unsubscribe = useCallback((room: string) => {
    socketClient.current.unsubscribe(room);
  }, []);

  /**
   * Clear event history
   */
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  /**
   * Initialize connection and subscriptions
   */
  useEffect(() => {
    if (!isInitialized.current && autoConnect) {
      isInitialized.current = true;

      connect().then((cleanup) => {
        // Subscribe to initial subscriptions
        subscriptions.forEach((sub) => subscribe(sub));

        // Cleanup on unmount
        return () => {
          cleanup?.();
          disconnect();
        };
      });
    }

    return () => {
      if (isInitialized.current) {
        disconnect();
        isInitialized.current = false;
      }
    };
  }, [autoConnect, connect, disconnect, subscribe, subscriptions]);

  return {
    events,
    isConnected: connectionStatus === ConnectionStatus.CONNECTED,
    connectionStatus,
    error,
    subscribe,
    unsubscribe,
    connect,
    disconnect,
    clearEvents,
  };
}

/**
 * Hook for subscribing to contract events
 */
export function useContractEvents(contractId: string, maxEvents = 50) {
  return useRealtimeEvents({
    subscriptions: [{ type: 'contract', contractId }],
    maxEvents,
  });
}

/**
 * Hook for subscribing to user events
 */
export function useUserEvents(address: string, maxEvents = 50) {
  return useRealtimeEvents({
    subscriptions: [{ type: 'user', address }],
    maxEvents,
  });
}

/**
 * Hook for subscribing to specific event types
 */
export function useEventType(eventTypes: string[], maxEvents = 50) {
  return useRealtimeEvents({
    subscriptions: [{ type: 'event-type', eventTypes }],
    maxEvents,
  });
}
