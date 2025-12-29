import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useRealtimeEvents,
  useContractEvents,
  useUserEvents,
} from './useRealtimeEvents';
import { createMockChainhookEvent } from '@/test/utils';
import { ConnectionStatus } from '@/types/realtime';

// Mock socket client
const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
const mockSubscribeToContract = vi.fn();
const mockSubscribeToUser = vi.fn();
const mockSubscribeToEventType = vi.fn();
const mockUnsubscribe = vi.fn();
const mockGetStatus = vi.fn();

let eventCallbacks: Array<(event: any) => void> = [];
let statusCallbacks: Array<(status: ConnectionStatus) => void> = [];

const mockOnEvent = vi.fn((callback) => {
  eventCallbacks.push(callback);
  return () => {
    eventCallbacks = eventCallbacks.filter((cb) => cb !== callback);
  };
});

const mockOnStatusChange = vi.fn((callback) => {
  statusCallbacks.push(callback);
  return () => {
    statusCallbacks = statusCallbacks.filter((cb) => cb !== callback);
  };
});

vi.mock('@/lib/realtime/socket-client', () => ({
  getSocketClient: () => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    subscribeToContract: mockSubscribeToContract,
    subscribeToUser: mockSubscribeToUser,
    subscribeToEventType: mockSubscribeToEventType,
    unsubscribe: mockUnsubscribe,
    onEvent: mockOnEvent,
    onStatusChange: mockOnStatusChange,
    getStatus: mockGetStatus,
  }),
}));

describe('useRealtimeEvents Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eventCallbacks = [];
    statusCallbacks = [];
    mockGetStatus.mockReturnValue(ConnectionStatus.DISCONNECTED);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty events array', () => {
      const { result } = renderHook(() => useRealtimeEvents());

      expect(result.current.events).toEqual([]);
      expect(result.current.isConnected).toBe(false);
    });

    it('should auto-connect if enabled', () => {
      renderHook(() => useRealtimeEvents({ autoConnect: true }));

      expect(mockConnect).toHaveBeenCalled();
    });

    it('should not auto-connect if disabled', () => {
      renderHook(() => useRealtimeEvents({ autoConnect: false }));

      expect(mockConnect).not.toHaveBeenCalled();
    });

    it('should register status change listener on mount', () => {
      renderHook(() => useRealtimeEvents());

      expect(mockOnStatusChange).toHaveBeenCalled();
    });

    it('should register event listener on mount', () => {
      renderHook(() => useRealtimeEvents());

      expect(mockOnEvent).toHaveBeenCalled();
    });

    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() =>
        useRealtimeEvents({ autoConnect: true })
      );

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('Connection Status', () => {
    it('should update connection status when status changes', async () => {
      mockGetStatus.mockReturnValue(ConnectionStatus.CONNECTED);

      const { result } = renderHook(() => useRealtimeEvents());

      // Simulate status change
      act(() => {
        statusCallbacks.forEach((cb) => cb(ConnectionStatus.CONNECTED));
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });
    });

    it('should reflect disconnected state', async () => {
      const { result } = renderHook(() => useRealtimeEvents());

      act(() => {
        statusCallbacks.forEach((cb) => cb(ConnectionStatus.DISCONNECTED));
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
        expect(result.current.connectionStatus).toBe(
          ConnectionStatus.DISCONNECTED
        );
      });
    });

    it('should handle reconnecting state', async () => {
      const { result } = renderHook(() => useRealtimeEvents());

      act(() => {
        statusCallbacks.forEach((cb) => cb(ConnectionStatus.RECONNECTING));
      });

      await waitFor(() => {
        expect(result.current.connectionStatus).toBe(
          ConnectionStatus.RECONNECTING
        );
      });
    });
  });

  describe('Event Handling', () => {
    it('should receive and store events', async () => {
      const { result } = renderHook(() => useRealtimeEvents());

      const mockEvent = createMockChainhookEvent();

      act(() => {
        eventCallbacks.forEach((cb) => cb(mockEvent));
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(1);
        expect(result.current.events[0]).toEqual(mockEvent);
      });
    });

    it('should respect maxEvents limit', async () => {
      const maxEvents = 5;
      const { result } = renderHook(() =>
        useRealtimeEvents({ maxEvents })
      );

      // Send more events than max
      for (let i = 0; i < 10; i++) {
        act(() => {
          eventCallbacks.forEach((cb) =>
            cb(createMockChainhookEvent({ txHash: `0x${i}` }))
          );
        });
      }

      await waitFor(() => {
        expect(result.current.events.length).toBe(maxEvents);
      });
    });

    it('should keep newest events when exceeding maxEvents', async () => {
      const { result } = renderHook(() =>
        useRealtimeEvents({ maxEvents: 2 })
      );

      const event1 = createMockChainhookEvent({ txHash: '0x1' });
      const event2 = createMockChainhookEvent({ txHash: '0x2' });
      const event3 = createMockChainhookEvent({ txHash: '0x3' });

      act(() => {
        eventCallbacks.forEach((cb) => {
          cb(event1);
          cb(event2);
          cb(event3);
        });
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(2);
        expect(result.current.events[0]).toEqual(event3);
        expect(result.current.events[1]).toEqual(event2);
      });
    });

    it('should call onEvent callback when provided', async () => {
      const onEventCallback = vi.fn();
      renderHook(() => useRealtimeEvents({ onEvent: onEventCallback }));

      const mockEvent = createMockChainhookEvent();

      act(() => {
        eventCallbacks.forEach((cb) => cb(mockEvent));
      });

      await waitFor(() => {
        expect(onEventCallback).toHaveBeenCalledWith(mockEvent);
      });
    });
  });

  describe('Subscriptions', () => {
    it('should subscribe to contract', () => {
      const { result } = renderHook(() => useRealtimeEvents());

      act(() => {
        result.current.subscribe({
          type: 'contract',
          contractId: 'ST1.contract',
        });
      });

      expect(mockSubscribeToContract).toHaveBeenCalledWith('ST1.contract');
    });

    it('should subscribe to user address', () => {
      const { result } = renderHook(() => useRealtimeEvents());

      act(() => {
        result.current.subscribe({
          type: 'user',
          address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        });
      });

      expect(mockSubscribeToUser).toHaveBeenCalledWith(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      );
    });

    it('should subscribe to event type', () => {
      const { result } = renderHook(() => useRealtimeEvents());

      act(() => {
        result.current.subscribe({
          type: 'event-type',
          eventType: 'print_event',
        });
      });

      expect(mockSubscribeToEventType).toHaveBeenCalledWith('print_event');
    });

    it('should unsubscribe', () => {
      const { result } = renderHook(() => useRealtimeEvents());

      act(() => {
        result.current.unsubscribe('subscription-1');
      });

      expect(mockUnsubscribe).toHaveBeenCalledWith('subscription-1');
    });

    it('should unsubscribe all on unmount', () => {
      const { result, unmount } = renderHook(() => useRealtimeEvents());

      act(() => {
        result.current.subscribe({
          type: 'contract',
          contractId: 'ST1.contract',
        });
      });

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', () => {
      mockConnect.mockImplementation(() => {
        throw new Error('Connection failed');
      });

      expect(() => {
        renderHook(() => useRealtimeEvents({ autoConnect: true }));
      }).not.toThrow();
    });
  });

  describe('clearEvents()', () => {
    it('should clear all events', async () => {
      const { result } = renderHook(() => useRealtimeEvents());

      // Add some events
      act(() => {
        eventCallbacks.forEach((cb) => {
          cb(createMockChainhookEvent({ txHash: '0x1' }));
          cb(createMockChainhookEvent({ txHash: '0x2' }));
        });
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(2);
      });

      act(() => {
        result.current.clearEvents();
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(0);
      });
    });
  });
});

describe('useContractEvents Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eventCallbacks = [];
    statusCallbacks = [];
  });

  it('should auto-subscribe to contract on mount', () => {
    const contractId = 'ST1.time-banking';

    renderHook(() => useContractEvents(contractId));

    expect(mockSubscribeToContract).toHaveBeenCalledWith(contractId);
  });

  it('should filter events for specific contract', async () => {
    const contractId = 'ST1.time-banking';
    const { result } = renderHook(() => useContractEvents(contractId));

    const matchingEvent = createMockChainhookEvent({ contractId });
    const nonMatchingEvent = createMockChainhookEvent({
      contractId: 'ST2.other-contract',
    });

    act(() => {
      eventCallbacks.forEach((cb) => {
        cb(matchingEvent);
        cb(nonMatchingEvent);
      });
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
      expect(result.current.events[0].contractId).toBe(contractId);
    });
  });

  it('should resubscribe when contractId changes', () => {
    const { rerender } = renderHook(
      ({ contractId }) => useContractEvents(contractId),
      {
        initialProps: { contractId: 'ST1.contract1' },
      }
    );

    expect(mockSubscribeToContract).toHaveBeenCalledWith('ST1.contract1');

    rerender({ contractId: 'ST2.contract2' });

    expect(mockSubscribeToContract).toHaveBeenCalledWith('ST2.contract2');
  });
});

describe('useUserEvents Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eventCallbacks = [];
    statusCallbacks = [];
  });

  it('should auto-subscribe to user address on mount', () => {
    const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

    renderHook(() => useUserEvents(address));

    expect(mockSubscribeToUser).toHaveBeenCalledWith(address);
  });

  it('should filter events for specific user', async () => {
    const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const { result } = renderHook(() => useUserEvents(address));

    const matchingEvent = createMockChainhookEvent({
      affectedAddresses: [address],
    });
    const nonMatchingEvent = createMockChainhookEvent({
      affectedAddresses: ['ST2DIFFERENT'],
    });

    act(() => {
      eventCallbacks.forEach((cb) => {
        cb(matchingEvent);
        cb(nonMatchingEvent);
      });
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
      expect(result.current.events[0].affectedAddresses).toContain(address);
    });
  });

  it('should handle null address gracefully', () => {
    expect(() => {
      renderHook(() => useUserEvents(null));
    }).not.toThrow();

    expect(mockSubscribeToUser).not.toHaveBeenCalled();
  });

  it('should resubscribe when address changes', () => {
    const { rerender } = renderHook(
      ({ address }) => useUserEvents(address),
      {
        initialProps: { address: 'ST1ADDR1' },
      }
    );

    expect(mockSubscribeToUser).toHaveBeenCalledWith('ST1ADDR1');

    rerender({ address: 'ST2ADDR2' });

    expect(mockSubscribeToUser).toHaveBeenCalledWith('ST2ADDR2');
  });
});
