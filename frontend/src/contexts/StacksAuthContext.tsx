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

const initialState: StacksAuthState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  network: 'mainnet',
  error: null,
};

function stacksAuthReducer(state: StacksAuthState, action: StacksAuthAction): StacksAuthState {
  switch (action.type) {
    case 'CONNECT_START':
      return { ...state, isConnecting: true, error: null };
    case 'CONNECT_SUCCESS':
      return { ...state, isConnecting: false, isConnected: true, address: action.address, error: null };
    case 'CONNECT_FAILED':
      return { ...state, isConnecting: false, error: action.error };
    case 'DISCONNECT':
      return { ...initialState, network: state.network };
    case 'SET_NETWORK':
      return { ...state, network: action.network };
    default:
      return state;
  }
}
