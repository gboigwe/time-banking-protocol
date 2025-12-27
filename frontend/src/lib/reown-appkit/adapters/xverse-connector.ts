/**
 * Xverse Wallet Connector for Reown AppKit
 * Supports Xverse browser extension and mobile wallet via WalletConnect
 */

import { showConnect, disconnect as stacksDisconnect } from '@stacks/connect';
import { userSession } from '@/lib/stacks';
import type {
  StacksConnector,
  StacksAccount,
  StacksAdapterError,
  StacksErrorCode,
} from '../types';

export class XverseConnector implements StacksConnector {
  id = 'xverse';
  name = 'Xverse';
  ready = typeof window !== 'undefined';

  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();
  private currentAccount: StacksAccount | null = null;

  constructor(private config?: { walletConnectProjectId?: string }) {}

  async connect(): Promise<StacksAccount> {
    return new Promise((resolve, reject) => {
      showConnect({
        appDetails: {
          name: 'Time Banking Protocol',
          icon: typeof window !== 'undefined' ? `${window.location.origin}/icon.svg` : '/icon.svg',
        },
        walletConnectProjectId: this.config?.walletConnectProjectId,
        userSession,
        onFinish: async () => {
          try {
            const account = await this.getAccount();
            if (account) {
              this.currentAccount = account;
              this.emit('connect', { address: account.address, network: account.network });
              resolve(account);
            } else {
              reject(this.createError('Failed to get account after connection', 4900));
            }
          } catch (error) {
            reject(error);
          }
        },
        onCancel: () => {
          reject(this.createError('User rejected the connection', 4001));
        },
      });
    });
  }

  async disconnect(): Promise<void> {
    if (userSession.isUserSignedIn()) {
      userSession.signUserOut();
    }

    this.currentAccount = null;
    this.emit('disconnect');
  }

  async getAccount(): Promise<StacksAccount | null> {
    if (!userSession.isUserSignedIn()) {
      return null;
    }

    const userData = userSession.loadUserData();
    const network = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';
    const address = network === 'mainnet'
      ? userData.profile.stxAddress.mainnet
      : userData.profile.stxAddress.testnet;

    return {
      address,
      publicKey: userData.appPrivateKey, // Note: This is app private key, adapt as needed
      network,
    };
  }

  async switchNetwork(network: 'mainnet' | 'testnet'): Promise<void> {
    // Network switching requires disconnecting and reconnecting
    // as Stacks Connect doesn't support runtime network switching
    console.warn('Network switching requires reconnection');
    await this.disconnect();
    throw this.createError('Please reconnect wallet to switch networks', 4200);
  }

  async signTransaction(transaction: any): Promise<string> {
    if (!this.currentAccount) {
      throw this.createError('Wallet not connected', 4100);
    }

    // Transaction signing is handled by @stacks/connect's contract call methods
    throw this.createError('Use contract call methods from @stacks/connect', 4200);
  }

  async signMessage(message: string): Promise<string> {
    if (!this.currentAccount) {
      throw this.createError('Wallet not connected', 4100);
    }

    // Message signing would require @stacks/connect's signMessage if available
    throw this.createError('Message signing not yet implemented', 4200);
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (...args: any[]) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(...args));
    }
  }

  private createError(message: string, code: StacksErrorCode): Error {
    const error = new Error(message) as any;
    error.code = code;
    error.name = 'StacksAdapterError';
    return error;
  }
}

export default XverseConnector;
