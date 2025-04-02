// StacksAuthContext.tsx — React context for Stacks wallet authentication
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

/** Auth state shape */
export interface StacksAuthState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  network: 'mainnet' | 'testnet';
  error: string | null;
}

/** Auth action types */
export type StacksAuthAction =
  | { type: 'CONNECT_START' }
  | { type: 'CONNECT_SUCCESS'; address: string }
  | { type: 'CONNECT_FAILED'; error: string }
  | { type: 'DISCONNECT' }
  | { type: 'SET_NETWORK'; network: 'mainnet' | 'testnet' };
