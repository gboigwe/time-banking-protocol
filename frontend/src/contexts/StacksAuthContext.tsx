// StacksAuthContext.tsx — React context for Stacks wallet authentication
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

/** Auth state shape */
export interface StacksAuthState {
