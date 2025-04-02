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
