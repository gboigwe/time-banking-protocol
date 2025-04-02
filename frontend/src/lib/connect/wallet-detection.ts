// wallet-detection.ts — detect installed Stacks wallets

/** WalletType enum */
export enum WalletType {
  Leather = 'leather',
  Xverse = 'xverse',
  Unknown = 'unknown',
}

/** Detect installed wallet */
export function detectWallet(): WalletType {
  if (typeof window === 'undefined') return WalletType.Unknown;
  if ((window as Record<string, unknown>)['LeatherProvider']) return WalletType.Leather;
  if ((window as Record<string, unknown>)['XverseProviders']) return WalletType.Xverse;
  return WalletType.Unknown;
}

/** Check if Leather wallet is installed */
export function isLeatherInstalled(): boolean {
  return typeof window !== 'undefined' && !!(window as Record<string, unknown>)['LeatherProvider'];
}
