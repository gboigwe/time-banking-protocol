// useDisputeStatus_new.ts — useDisputeStatus React hook for time-banking UI
import { useState, useCallback, useEffect } from 'react';

/** State interface for useDisputeStatus */
export interface useDisputeStatusState {
  dispute: unknown;
  isLoading: unknown;
  error: unknown;
  votingStatus: unknown;
  evidenceCount: unknown;
  resolution: unknown;
}

/** useDisputeStatus hook implementation */
export function useDisputeStatus() {
  const [state, setState] = useState<Partial<useDisputeStatusState>>({});
  
  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
