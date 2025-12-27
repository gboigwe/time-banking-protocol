/**
 * React Context Provider for Reown AppKit Stacks Adapter
 */

import React, { createContext, useEffect, useState } from 'react';
import { StacksAdapter } from '../adapters/stacks-adapter';
import type { StacksAdapterConfig } from '../types';

export const StacksAdapterContext = createContext<StacksAdapter | null>(null);

export interface AppKitStacksProviderProps {
  config: StacksAdapterConfig;
  children: React.ReactNode;
}

export function AppKitStacksProvider({
  config,
  children,
}: AppKitStacksProviderProps) {
  const [adapter, setAdapter] = useState<StacksAdapter | null>(null);

  useEffect(() => {
    // Initialize adapter
    const stacksAdapter = new StacksAdapter(config);
    setAdapter(stacksAdapter);

    // Cleanup on unmount
    return () => {
      stacksAdapter.disconnect().catch(console.error);
    };
  }, []); // Empty deps - only initialize once

  if (!adapter) {
    return null; // Or a loading component
  }

  return (
    <StacksAdapterContext.Provider value={adapter}>
      {children}
    </StacksAdapterContext.Provider>
  );
}

export default AppKitStacksProvider;
