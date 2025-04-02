// useGovernanceProposals_new.ts — useGovernanceProposals React hook for time-banking UI
import { useState, useCallback, useEffect } from 'react';

/** State interface for useGovernanceProposals */
export interface useGovernanceProposalsState {
  proposals: unknown;
  votingPower: unknown;
  isLoading: unknown;
  error: unknown;
  vote: unknown;
  getProposal: unknown;
