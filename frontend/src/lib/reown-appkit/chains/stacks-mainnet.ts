/**
 * Stacks Mainnet Chain Configuration
 * Chain ID: stacks:1
 */

import type { StacksChain } from '../types';

export const stacksMainnet: StacksChain = {
  id: 'stacks:1',
  name: 'Stacks',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Stacks',
    symbol: 'STX',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://api.mainnet.hiro.so'],
      webSocket: ['wss://api.mainnet.hiro.so'],
    },
    public: {
      http: ['https://api.mainnet.hiro.so'],
      webSocket: ['wss://api.mainnet.hiro.so'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Stacks Explorer',
      url: 'https://explorer.hiro.so',
    },
  },
  testnet: false,
};

export default stacksMainnet;
