import React, { createContext, useContext, useEffect, useState } from 'react';
import { userSession, getUserAddress, connectWallet, disconnectWallet } from '@/lib/stacks';
import { WalletState } from '@/types';

interface WalletContextType extends WalletState {
  connect: () => void;
  disconnect: () => void;
  refreshConnection: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isLoading: true,
    address: undefined,
    userData: undefined,
    error: undefined,
  });

  const refreshConnection = () => {
    setWalletState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const isConnected = userSession.isUserSignedIn();
      const address = getUserAddress();
      const userData = isConnected ? userSession.loadUserData() : undefined;

      setWalletState({
        isConnected,
        address: address || undefined,
        userData,
        isLoading: false,
        error: undefined,
      });
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWalletState({
        isConnected: false,
        address: undefined,
        userData: undefined,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const connect = () => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: undefined }));
    try {
      // Check if Stacks wallet is available
      if (typeof window !== 'undefined' && !window.StacksProvider) {
        throw new Error('No Stacks wallet detected. Please install Hiro Wallet or Xverse.');
      }
      connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to connect Stacks wallet',
      }));
    }
  };

  const disconnect = () => {
    setWalletState(prev => ({ ...prev, isLoading: true }));
    try {
      disconnectWallet();
      setWalletState({
        isConnected: false,
        address: undefined,
        userData: undefined,
        isLoading: false,
        error: undefined,
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to disconnect wallet',
      }));
    }
  };

  useEffect(() => {
    refreshConnection();
  }, []);

  const value: WalletContextType = {
    ...walletState,
    connect,
    disconnect,
    refreshConnection,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
