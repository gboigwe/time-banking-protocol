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
