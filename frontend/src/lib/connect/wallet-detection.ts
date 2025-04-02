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

/** Check if Xverse wallet is installed */
export function isXverseInstalled(): boolean {
  return typeof window !== 'undefined' && !!(window as Record<string, unknown>)['XverseProviders'];
}

/** Get wallet download URL */
export function getWalletDownloadUrl(wallet: WalletType): string {
  const urls: Record<WalletType, string> = {
    [WalletType.Leather]: 'https://leather.io/install-extension',
    [WalletType.Xverse]: 'https://www.xverse.app/download',
    [WalletType.Unknown]: 'https://stacks.co/wallets',
  };
  return urls[wallet];
}

/** Get wallet display name */
export function getWalletName(wallet: WalletType): string {
  const names: Record<WalletType, string> = {
    [WalletType.Leather]: 'Leather',
    [WalletType.Xverse]: 'Xverse',
    [WalletType.Unknown]: 'Unknown Wallet',
  };
  return names[wallet];
}

/** Get wallet icon URL */
export function getWalletIcon(wallet: WalletType): string {
  const icons: Record<WalletType, string> = {
    [WalletType.Leather]: '/icons/leather.svg',
    [WalletType.Xverse]: '/icons/xverse.svg',
    [WalletType.Unknown]: '/icons/wallet.svg',
  };
  return icons[wallet];
}
