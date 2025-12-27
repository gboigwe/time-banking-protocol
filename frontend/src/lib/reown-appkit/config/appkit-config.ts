/**
 * AppKit Configuration Helper for Stacks
 */

import type { StacksAdapterConfig, StacksWallet } from '../types';
import { stacksMainnet } from '../chains/stacks-mainnet';
import { stacksTestnet } from '../chains/stacks-testnet';
import { XverseConnector } from '../adapters/xverse-connector';
import { LeatherConnector } from '../adapters/leather-connector';
import { HiroConnector } from '../adapters/hiro-connector';

export interface CreateAppKitConfigOptions {
  projectId?: string;
  appName: string;
  appIcon?: string;
  chains?: ('mainnet' | 'testnet')[];
  wallets?: ('xverse' | 'leather' | 'hiro')[];
}

export function createAppKitConfig(
  options: CreateAppKitConfigOptions
): StacksAdapterConfig {
  const {
    projectId,
    appName,
    appIcon,
    chains = ['testnet'],
    wallets = ['xverse', 'leather', 'hiro'],
  } = options;

  // Configure chains
  const selectedChains = chains.map((chain) => {
    if (chain === 'mainnet') return stacksMainnet;
    return stacksTestnet;
  });

  // Configure wallets
  const selectedWallets: StacksWallet[] = [];

  if (wallets.includes('xverse')) {
    selectedWallets.push({
      id: 'xverse',
      name: 'Xverse',
      icon: '/wallets/xverse.svg',
      downloadUrl: 'https://www.xverse.app/',
      installed: typeof window !== 'undefined',
      connector: new XverseConnector({ walletConnectProjectId: projectId }),
    });
  }

  if (wallets.includes('leather')) {
    selectedWallets.push({
      id: 'leather',
      name: 'Leather',
      icon: '/wallets/leather.svg',
      downloadUrl: 'https://leather.io/',
      installed: typeof window !== 'undefined',
      connector: new LeatherConnector({ walletConnectProjectId: projectId }),
    });
  }

  if (wallets.includes('hiro')) {
    selectedWallets.push({
      id: 'hiro',
      name: 'Hiro Wallet',
      icon: '/wallets/hiro.svg',
      downloadUrl: 'https://wallet.hiro.so/',
      installed: typeof window !== 'undefined',
      connector: new HiroConnector(),
    });
  }

  return {
    chains: selectedChains,
    wallets: selectedWallets,
    projectId,
    appName,
    appIcon,
  };
}

export default createAppKitConfig;
