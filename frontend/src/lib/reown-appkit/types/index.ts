/**
 * Type definitions for Reown AppKit Stacks Adapter
 */

import type { Transaction } from '@stacks/transactions';

// Chain Types
export interface StacksChain {
  id: string;
  name: string;
  network: 'mainnet' | 'testnet';
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
      webSocket?: string[];
    };
    public: {
      http: string[];
      webSocket?: string[];
    };
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  };
  testnet?: boolean;
}

// Wallet Types
export interface StacksWallet {
  id: string;
  name: string;
  icon?: string;
  downloadUrl?: string;
  installed?: boolean;
  connector: StacksConnector;
}

export interface StacksConnector {
  id: string;
  name: string;
  ready: boolean;
  connect(): Promise<StacksAccount>;
  disconnect(): Promise<void>;
  getAccount(): Promise<StacksAccount | null>;
  switchNetwork(network: 'mainnet' | 'testnet'): Promise<void>;
  signTransaction(transaction: Transaction): Promise<string>;
  signMessage(message: string): Promise<string>;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
}

// Account Types
export interface StacksAccount {
  address: string;
  publicKey: string;
  network: 'mainnet' | 'testnet';
}

// Transaction Types
export interface StacksTransactionRequest {
  type: 'contract-call' | 'token-transfer' | 'contract-deploy';
  contractAddress?: string;
  contractName?: string;
  functionName?: string;
  functionArgs?: any[];
  recipient?: string;
  amount?: string;
  memo?: string;
  postConditions?: any[];
  network: 'mainnet' | 'testnet';
}

export interface StacksTransactionResponse {
  txId: string;
  txRaw: string;
}

// RPC Methods
export type StacksRPCMethod =
  | 'stx_getAccounts'
  | 'stx_getAddresses'
  | 'stx_transferStx'
  | 'stx_callContract'
  | 'stx_deployContract'
  | 'stx_signMessage'
  | 'stx_signStructuredMessage'
  | 'stx_getBalance'
  | 'stx_getNetwork';

export interface StacksRPCRequest {
  method: StacksRPCMethod;
  params?: any[];
}

export interface StacksRPCResponse<T = any> {
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

// Provider Types
export interface StacksProvider {
  request(request: StacksRPCRequest): Promise<StacksRPCResponse>;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  removeAllListeners(): void;
}

// Adapter Configuration
export interface StacksAdapterConfig {
  chains: StacksChain[];
  wallets: StacksWallet[];
  projectId?: string;
  appName: string;
  appIcon?: string;
}

// Event Types
export type StacksEvent =
  | 'connect'
  | 'disconnect'
  | 'accountsChanged'
  | 'chainChanged'
  | 'message';

export interface StacksEventPayload {
  connect: { address: string; network: string };
  disconnect: void;
  accountsChanged: { accounts: string[] };
  chainChanged: { chainId: string };
  message: { type: string; data: any };
}

// Error Types
export enum StacksErrorCode {
  USER_REJECTED = 4001,
  UNAUTHORIZED = 4100,
  UNSUPPORTED_METHOD = 4200,
  DISCONNECTED = 4900,
  CHAIN_DISCONNECTED = 4901,
  INTERNAL_ERROR = -32603,
  INVALID_PARAMS = -32602,
  METHOD_NOT_FOUND = -32601,
}

export class StacksAdapterError extends Error {
  code: StacksErrorCode;
  data?: any;

  constructor(message: string, code: StacksErrorCode, data?: any) {
    super(message);
    this.name = 'StacksAdapterError';
    this.code = code;
    this.data = data;
  }
}

// Storage Types
export interface StacksStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
