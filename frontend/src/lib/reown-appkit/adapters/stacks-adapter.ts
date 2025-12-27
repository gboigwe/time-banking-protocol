/**
 * Core Stacks Adapter for Reown AppKit
 * Bridges Stacks blockchain with Reown AppKit ecosystem
 */

import type {
  StacksChain,
  StacksConnector,
  StacksAccount,
  StacksAdapterConfig,
  StacksProvider,
  StacksRPCRequest,
  StacksRPCResponse,
} from '../types';
import { StacksRPCHandler } from '../utils/rpc-handler';
import { XverseConnector } from './xverse-connector';
import { LeatherConnector } from './leather-connector';
import { HiroConnector } from './hiro-connector';

export class StacksAdapter {
  private connectors: Map<string, StacksConnector> = new Map();
  private activeConnector: StacksConnector | null = null;
  private currentAccount: StacksAccount | null = null;
  private currentChain: StacksChain;
  private rpcHandler: StacksRPCHandler;
  private eventListeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  constructor(private config: StacksAdapterConfig) {
    // Set initial chain (default to first chain or mainnet)
    this.currentChain = config.chains[0];

    // Initialize RPC handler
    this.rpcHandler = new StacksRPCHandler(null, this.currentChain.network);

    // Register wallet connectors
    this.registerConnectors();
  }

  private registerConnectors(): void {
    // Xverse (supports WalletConnect)
    const xverse = new XverseConnector({
      walletConnectProjectId: this.config.projectId,
    });
    this.connectors.set('xverse', xverse);

    // Leather (supports WalletConnect)
    const leather = new LeatherConnector({
      walletConnectProjectId: this.config.projectId,
    });
    this.connectors.set('leather', leather);

    // Hiro (browser extension only)
    const hiro = new HiroConnector();
    this.connectors.set('hiro', hiro);
  }

  async connect(walletId: string): Promise<StacksAccount> {
    const connector = this.connectors.get(walletId);

    if (!connector) {
      throw new Error(`Wallet connector not found: ${walletId}`);
    }

    try {
      const account = await connector.connect();

      this.activeConnector = connector;
      this.currentAccount = account;
      this.rpcHandler.updateAccount(account);

      // Subscribe to connector events
      connector.on('disconnect', () => this.handleDisconnect());
      connector.on('accountsChanged', (accounts) =>
        this.handleAccountsChanged(accounts)
      );
      connector.on('chainChanged', (chain) => this.handleChainChanged(chain));

      this.emit('connect', account);

      return account;
    } catch (error) {
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.activeConnector) {
      await this.activeConnector.disconnect();
      this.activeConnector = null;
      this.currentAccount = null;
      this.rpcHandler.updateAccount(null);
      this.emit('disconnect');
    }
  }

  async switchChain(chainId: string): Promise<void> {
    const chain = this.config.chains.find((c) => c.id === chainId);

    if (!chain) {
      throw new Error(`Chain not found: ${chainId}`);
    }

    if (!this.activeConnector) {
      throw new Error('No active connector');
    }

    try {
      await this.activeConnector.switchNetwork(chain.network);
      this.currentChain = chain;
      this.rpcHandler.updateNetwork(chain.network);
      this.emit('chainChanged', { chainId: chain.id });
    } catch (error) {
      throw error;
    }
  }

  getAccount(): StacksAccount | null {
    return this.currentAccount;
  }

  getChain(): StacksChain {
    return this.currentChain;
  }

  getConnector(walletId: string): StacksConnector | undefined {
    return this.connectors.get(walletId);
  }

  getAllConnectors(): StacksConnector[] {
    return Array.from(this.connectors.values());
  }

  getProvider(): StacksProvider {
    const self = this;

    return {
      async request(request: StacksRPCRequest): Promise<StacksRPCResponse> {
        return self.rpcHandler.handle(request);
      },
      on(event: string, callback: (...args: any[]) => void): void {
        self.on(event, callback);
      },
      off(event: string, callback: (...args: any[]) => void): void {
        self.off(event, callback);
      },
      removeAllListeners(): void {
        self.eventListeners.clear();
      },
    };
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (...args: any[]) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(...args));
    }
  }

  private handleDisconnect(): void {
    this.currentAccount = null;
    this.rpcHandler.updateAccount(null);
    this.emit('disconnect');
  }

  private handleAccountsChanged(accounts: any): void {
    if (accounts.accounts && accounts.accounts.length > 0) {
      this.currentAccount = {
        address: accounts.accounts[0],
        publicKey: '',
        network: this.currentChain.network,
      };
      this.rpcHandler.updateAccount(this.currentAccount);
      this.emit('accountsChanged', accounts);
    }
  }

  private handleChainChanged(chain: any): void {
    const newChain = this.config.chains.find((c) => c.id === chain.chainId);
    if (newChain) {
      this.currentChain = newChain;
      this.rpcHandler.updateNetwork(newChain.network);
      this.emit('chainChanged', chain);
    }
  }
}

export default StacksAdapter;
