// wallet.types.ts — wallet and authentication types

/** WalletProvider wallet type */
export interface WalletProvider {
  type: string;
  address?: string;
}

/** ConnectedWallet wallet type */
export interface ConnectedWallet {
  type: string;
  address?: string;
}

/** WalletSession wallet type */
export interface WalletSession {
  type: string;
  address?: string;
}

/** AuthProfile wallet type */
export interface AuthProfile {
  type: string;
  address?: string;
}
