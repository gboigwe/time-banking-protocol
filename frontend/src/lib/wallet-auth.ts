/**
 * Wallet Authentication
 * Handles Stacks wallet connection, session management and user data
 */

import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import type { SupportedNetwork } from './stacks-network-client';

export interface WalletAuthConfig {
  appName: string;
  appIconUrl?: string;
  network: SupportedNetwork;
  redirectUrl?: string;
}

export interface ConnectedWallet {
  address: string;
  publicKey?: string;
  profile?: {
    name?: string;
    avatarUrl?: string;
    description?: string;
  };
  decentralizedId?: string;
  connectedAt: number;
}

export interface AuthState {
  isConnected: boolean;
  isConnecting: boolean;
  wallet: ConnectedWallet | null;
  error?: string;
}

type AuthStateListener = (state: AuthState) => void;

export class WalletAuth {
  private config: WalletAuthConfig;
  private appConfig: AppConfig;
  private userSession: UserSession;
  private state: AuthState = {
    isConnected: false,
    isConnecting: false,
    wallet: null,
  };
  private listeners: AuthStateListener[] = [];

  constructor(config: WalletAuthConfig) {
    this.config = config;
    this.appConfig = new AppConfig(['store_write', 'publish_data'], config.redirectUrl);
    this.userSession = new UserSession({ appConfig: this.appConfig });
    this.initFromSession();
  }

  async connect(options?: { onFinish?: () => void; onCancel?: () => void }): Promise<void> {
    this.setState({ ...this.state, isConnecting: true, error: undefined });

    return new Promise((resolve, reject) => {
      showConnect({
        appDetails: {
          name: this.config.appName,
          icon: this.config.appIconUrl ?? `${window.location.origin}/icon.png`,
        },
        userSession: this.userSession,
        onFinish: () => {
          this.initFromSession();
          options?.onFinish?.();
          resolve();
        },
        onCancel: () => {
          this.setState({ ...this.state, isConnecting: false });
          options?.onCancel?.();
          resolve();
        },
      });
    });
  }

  disconnect(): void {
    if (this.userSession.isUserSignedIn()) {
      this.userSession.signUserOut();
    }
    this.setState({
      isConnected: false,
      isConnecting: false,
      wallet: null,
    });
  }

  getAddress(): string | null {
    return this.state.wallet?.address ?? null;
  }

  getTestnetAddress(): string | null {
    if (!this.userSession.isUserSignedIn()) return null;
    try {
      const userData = this.userSession.loadUserData();
      return userData?.profile?.stxAddress?.testnet ?? null;
    } catch {
      return null;
    }
  }

  getMainnetAddress(): string | null {
    if (!this.userSession.isUserSignedIn()) return null;
    try {
      const userData = this.userSession.loadUserData();
      return userData?.profile?.stxAddress?.mainnet ?? null;
    } catch {
      return null;
    }
  }

  getAddressForNetwork(): string | null {
    return this.config.network === 'mainnet'
      ? this.getMainnetAddress()
      : this.getTestnetAddress();
  }

  isConnected(): boolean {
    return this.state.isConnected;
  }

  getState(): AuthState {
    return { ...this.state };
  }

  getUserSession(): UserSession {
    return this.userSession;
  }

  onStateChange(listener: AuthStateListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private initFromSession(): void {
    try {
      if (this.userSession.isSignInPending()) {
        this.userSession.handlePendingSignIn().then(() => this.loadWalletFromSession());
        return;
      }
      if (this.userSession.isUserSignedIn()) {
        this.loadWalletFromSession();
        return;
      }
    } catch {
      // ignore
    }
    this.setState({ isConnected: false, isConnecting: false, wallet: null });
  }

  private loadWalletFromSession(): void {
    try {
      const userData = this.userSession.loadUserData();
      const address =
        this.config.network === 'mainnet'
          ? (userData?.profile?.stxAddress?.mainnet ?? '')
          : (userData?.profile?.stxAddress?.testnet ?? '');

      const wallet: ConnectedWallet = {
        address,
        publicKey: userData?.appPrivateKey,
        profile: {
          name: userData?.profile?.name ?? undefined,
          avatarUrl: userData?.profile?.image?.[0]?.contentUrl ?? undefined,
          description: userData?.profile?.description ?? undefined,
        },
        decentralizedId: userData?.decentralizedID ?? undefined,
        connectedAt: Date.now(),
      };
      this.setState({ isConnected: true, isConnecting: false, wallet });
    } catch {
      this.setState({ isConnected: false, isConnecting: false, wallet: null });
    }
  }

  private setState(newState: AuthState): void {
    this.state = newState;
    this.listeners.forEach(l => l({ ...newState }));
  }
}

export function createWalletAuth(config: WalletAuthConfig): WalletAuth {
  return new WalletAuth(config);
}
