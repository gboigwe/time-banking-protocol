import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { StacksNetwork } from '@stacks/network';
import {
  userSession,
  getUserAddress,
  connectWallet,
  disconnectWallet,
  connectViaReown,
  getNetwork,
  getNetworkType,
} from '@/lib/stacks';
import { WalletState } from '@/types';
import { ErrorParser, StacksError } from '@/lib/error-handling';

interface ExtendedWalletState extends WalletState {
  network?: StacksNetwork;
  networkType?: 'mainnet' | 'testnet';
  typedError?: StacksError;
}

interface WalletContextType extends ExtendedWalletState {
  connect: () => void;
  connectWithReown: () => void;
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
  const [walletState, setWalletState] = useState<ExtendedWalletState>({
    isConnected: false,
    isLoading: true,
    address: undefined,
    userData: undefined,
    error: undefined,
    network: undefined,
    networkType: undefined,
    typedError: undefined,
  });

  const refreshConnection = useCallback(() => {
    setWalletState(prev => ({ ...prev, isLoading: true }));

    try {
      const isConnected = userSession.isUserSignedIn();
      const address = getUserAddress();
      const userData = isConnected ? userSession.loadUserData() : undefined;
      const network = getNetwork();
      const networkType = getNetworkType();

      setWalletState({
        isConnected,
        address: address || undefined,
        userData,
        network,
        networkType,
        isLoading: false,
        error: undefined,
        typedError: undefined,
      });
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      const parsedError = ErrorParser.parseError(error);
      setWalletState({
        isConnected: false,
        address: undefined,
        userData: undefined,
        network: undefined,
        networkType: undefined,
        isLoading: false,
        error: parsedError.message,
        typedError: parsedError,
      });
    }
  }, []);

  const connect = useCallback(() => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: undefined, typedError: undefined }));
    try {
      connectWallet({
        onFinish: () => {
          // Connection successful, state will be updated by refresh
          refreshConnection();
        },
        onCancel: () => {
          setWalletState(prev => ({
            ...prev,
            isLoading: false,
            error: undefined,
            typedError: undefined,
          }));
        },
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      const parsedError = ErrorParser.parseError(error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: parsedError.message,
        typedError: parsedError,
      }));
    }
  }, [refreshConnection]);

  const connectWithReown = useCallback(() => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: undefined, typedError: undefined }));
    try {
      connectViaReown({
        onFinish: () => {
          // Connection successful via WalletConnect
          console.log('✅ WalletConnect connection established');
          refreshConnection();
        },
        onCancel: () => {
          console.log('❌ WalletConnect cancelled by user');
          setWalletState(prev => ({
            ...prev,
            isLoading: false,
            error: undefined,
            typedError: undefined,
          }));
        },
      });
    } catch (error) {
      console.error('Error connecting via Reown:', error);
      const parsedError = ErrorParser.parseError(error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: parsedError.message,
        typedError: parsedError,
      }));
    }
  }, [refreshConnection]);

  const disconnect = useCallback(async () => {
    setWalletState(prev => ({ ...prev, isLoading: true }));
    try {
      await disconnectWallet();
      setWalletState({
        isConnected: false,
        address: undefined,
        userData: undefined,
        network: undefined,
        networkType: undefined,
        isLoading: false,
        error: undefined,
        typedError: undefined,
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      const parsedError = ErrorParser.parseError(error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: parsedError.message,
        typedError: parsedError,
      }));
    }
  }, []);

  useEffect(() => {
    refreshConnection();
  }, []);

  const value: WalletContextType = {
    ...walletState,
    connect,
    connectWithReown,
    disconnect,
    refreshConnection,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
