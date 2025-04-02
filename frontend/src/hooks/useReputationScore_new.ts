// useReputationScore_new.ts — useReputationScore React hook for time-banking UI
import { useState, useCallback, useEffect } from 'react';

/** State interface for useReputationScore */
export interface useReputationScoreState {
  score: unknown;
  tier: unknown;
  badges: unknown;
  history: unknown;
  isLoading: unknown;
