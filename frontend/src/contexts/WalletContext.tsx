import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  userSession,
  getUserAddress,
  connectWallet,
  disconnectWallet,
  connectViaWalletConnect,
  isWalletConnectConnected,
  walletConnectSession,
} from '@/lib/stacks';
import { WalletState } from '@/types';

interface WalletContextType extends WalletState {
  connect: () => void;
  connectWithWalletConnect: () => Promise<void>;
  disconnect: () => void;
  refreshConnection: () => void;
  connectionType: 'traditional' | 'walletconnect' | null;
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
  const [connectionType, setConnectionType] = useState<'traditional' | 'walletconnect' | null>(null);

  const refreshConnection = () => {
    setWalletState(prev => ({ ...prev, isLoading: true }));

    try {
      // Check WalletConnect first
      const wcConnected = isWalletConnectConnected();
      const traditionalConnected = userSession.isUserSignedIn();
      const isConnected = wcConnected || traditionalConnected;

      const address = getUserAddress();
      const userData = traditionalConnected ? userSession.loadUserData() : undefined;

      // Determine connection type
      let type: 'traditional' | 'walletconnect' | null = null;
      if (wcConnected) {
        type = 'walletconnect';
      } else if (traditionalConnected) {
        type = 'traditional';
      }
      setConnectionType(type);

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
      setConnectionType(null);
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

  const connectWithWalletConnect = async () => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: undefined }));
    try {
      await connectViaWalletConnect();
      // Session is established, now refresh
      refreshConnection();
    } catch (error) {
      console.error('Error connecting via WalletConnect:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to connect via WalletConnect',
      }));
    }
  };

  const disconnect = async () => {
    setWalletState(prev => ({ ...prev, isLoading: true }));
    try {
      await disconnectWallet();
      setConnectionType(null);
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
    connectWithWalletConnect,
    disconnect,
    refreshConnection,
    connectionType,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
