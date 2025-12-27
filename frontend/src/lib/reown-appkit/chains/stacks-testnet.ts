/**
 * Stacks Testnet Chain Configuration
 * Chain ID: stacks:2147483648
 */

import type { StacksChain } from '../types';

export const stacksTestnet: StacksChain = {
  id: 'stacks:2147483648',
  name: 'Stacks Testnet',
  network: 'testnet',
  nativeCurrency: {
    name: 'Stacks',
    symbol: 'STX',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://api.testnet.hiro.so'],
      webSocket: ['wss://api.testnet.hiro.so'],
    },
    public: {
      http: ['https://api.testnet.hiro.so'],
      webSocket: ['wss://api.testnet.hiro.so'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Stacks Testnet Explorer',
      url: 'https://explorer.hiro.so?chain=testnet',
    },
  },
  testnet: true,
};

export default stacksTestnet;
