// useTimeToken_new.ts — useTimeToken React hook for time-banking UI
import { useState, useCallback, useEffect } from 'react';

/** State interface for useTimeToken */
export interface useTimeTokenState {
  balance: unknown;
  allowance: unknown;
  isLoading: unknown;
  error: unknown;
