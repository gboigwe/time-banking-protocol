// useNetworkHealth_new.ts — useNetworkHealth React hook for time-banking UI
import { useState, useCallback, useEffect } from 'react';

/** State interface for useNetworkHealth */
export interface useNetworkHealthState {
  isConnected: unknown;
  blockHeight: unknown;
  apiLatency: unknown;
  isHealthy: unknown;
  isLoading: unknown;
