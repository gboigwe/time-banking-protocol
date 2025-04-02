// useDisputeStatus_new.ts — useDisputeStatus React hook for time-banking UI
import { useState, useCallback, useEffect } from 'react';

/** State interface for useDisputeStatus */
export interface useDisputeStatusState {
  dispute: unknown;
  isLoading: unknown;
