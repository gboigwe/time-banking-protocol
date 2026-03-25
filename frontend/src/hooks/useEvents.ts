/**
 * useEvents - React hook for decoded time-banking contract events
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { HiroApiClient, RawContractEvent } from '../lib/hiro-api-client';
import {
  EventDecoder,
  DecodedTimeBankEvent,
  TimeBankEventType,
  createEventDecoder,
} from '../lib/event-decoder';

export interface EventsState {
  events: DecodedTimeBankEvent[];
  rawEvents: RawContractEvent[];
  total: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface UseEventsOptions {
  limit?: number;
  pollIntervalMs?: number;
  autoRefresh?: boolean;
  eventTypes?: TimeBankEventType[];
  decoder?: EventDecoder;
}

export interface UseEventsResult extends EventsState {
  refresh: () => Promise<void>;
  filterByType: <T extends DecodedTimeBankEvent>(type: TimeBankEventType) => T[];
  clearEvents: () => void;
}

export function useEvents(
  contractId: string | null | undefined,
  apiClient: HiroApiClient,
  options: UseEventsOptions = {}
): UseEventsResult {
  const {
    limit = 50,
    pollIntervalMs = 15_000,
    autoRefresh = true,
    eventTypes,
    decoder: externalDecoder,
  } = options;

  const decoderRef = useRef<EventDecoder>(externalDecoder ?? createEventDecoder());
  const seenTxIds = useRef<Set<string>>(new Set());

  const [state, setState] = useState<EventsState>({
    events: [],
    rawEvents: [],
    total: 0,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const refresh = useCallback(async () => {
    if (!contractId) return;
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const response = await apiClient.getSmartContractEvents(contractId, { limit });
      const rawEvents = response.results as unknown as RawContractEvent[];
      const decoded = decoderRef.current.decodeEvents(rawEvents);

      const filtered = eventTypes
        ? decoded.filter(e => eventTypes.includes(e.event))
        : decoded;

      setState(s => {
        // Merge new events deduplicating by txId
        const newRaw = rawEvents.filter(r => !seenTxIds.current.has(r.tx_id));
        newRaw.forEach(r => seenTxIds.current.add(r.tx_id));

        const newDecoded = decoderRef.current
          .decodeEvents(newRaw)
          .filter(e => !eventTypes || eventTypes.includes(e.event));

        const mergedEvents = [...newDecoded, ...s.events].slice(0, 500); // cap at 500
        const mergedRaw = [...newRaw, ...s.rawEvents].slice(0, 500);

        return {
          events: mergedEvents,
          rawEvents: mergedRaw,
          total: response.limit + s.total,
          isLoading: false,
          error: null,
          lastUpdated: Date.now(),
        };
      });
    } catch (e) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Events fetch failed',
      }));
    }
  }, [contractId, apiClient, limit, eventTypes]);

  useEffect(() => {
    seenTxIds.current.clear();
    setState({
      events: [],
      rawEvents: [],
      total: 0,
      isLoading: false,
      error: null,
      lastUpdated: null,
    });
    refresh();
  }, [contractId, refresh]);

  useEffect(() => {
    if (!autoRefresh || !contractId) return;
    const timer = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(timer);
  }, [autoRefresh, contractId, pollIntervalMs, refresh]);

  const filterByType = useCallback(
    <T extends DecodedTimeBankEvent>(type: TimeBankEventType): T[] =>
      decoderRef.current.filterByType<T>(state.events, type),
    [state.events]
  );

  const clearEvents = useCallback(() => {
    seenTxIds.current.clear();
    setState({
      events: [],
      rawEvents: [],
      total: 0,
      isLoading: false,
      error: null,
      lastUpdated: null,
    });
  }, []);

  return { ...state, refresh, filterByType, clearEvents };
}
