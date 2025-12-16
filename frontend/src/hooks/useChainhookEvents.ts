import { useState, useEffect, useCallback, useRef } from 'react';

export interface ChainhookEvent {
  type: string;
  txHash: string;
  sender: string;
  blockHeight: number;
  timestamp: number;
  success: boolean;
  topic?: string;
  value?: any;
  amount?: string;
  recipient?: string;
  asset?: string;
  receivedAt: number;
}

interface UseChainhookEventsOptions {
  pollInterval?: number; // milliseconds, default 5000 (5 seconds)
  limit?: number; // number of events to fetch, default 50
  enabled?: boolean; // enable/disable polling, default true
}

interface UseChainhookEventsReturn {
  events: ChainhookEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  latestEvent: ChainhookEvent | null;
}

export function useChainhookEvents(
  options: UseChainhookEventsOptions = {}
): UseChainhookEventsReturn {
  const {
    pollInterval = 5000,
    limit = 50,
    enabled = true,
  } = options;

  const [events, setEvents] = useState<ChainhookEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestEvent, setLatestEvent] = useState<ChainhookEvent | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/recent?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
        setError(null);

        // Update latest event if there are new events
        if (data.events.length > 0 && data.events[0] !== latestEvent) {
          setLatestEvent(data.events[0]);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching chainhook events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  }, [limit, latestEvent]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchEvents();

    // Set up polling
    intervalRef.current = setInterval(fetchEvents, pollInterval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, pollInterval, fetchEvents]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    latestEvent,
  };
}

// Helper function to filter events by contract
export function filterEventsByContract(
  events: ChainhookEvent[],
  contractName: string
): ChainhookEvent[] {
  return events.filter(event =>
    event.txHash && contractName // Simple filter, can be enhanced
  );
}

// Helper function to filter events by type
export function filterEventsByType(
  events: ChainhookEvent[],
  eventType: string
): ChainhookEvent[] {
  return events.filter(event => event.type === eventType);
}

// Helper function to filter events by topic (for print_event)
export function filterEventsByTopic(
  events: ChainhookEvent[],
  topic: string
): ChainhookEvent[] {
  return events.filter(event => event.topic === topic);
}
