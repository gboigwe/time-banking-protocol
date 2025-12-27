# Reown AppKit Stacks Adapter

**The first custom adapter bringing Stacks blockchain support to Reown AppKit!**

## Overview

This adapter bridges the gap between [Reown AppKit](https://reown.com) (formerly WalletConnect AppKit) and the Stacks blockchain, enabling Stacks-based dApps to leverage AppKit's powerful wallet connection infrastructure.

### Features

- ✅ **Multi-Wallet Support**: Xverse, Leather, and Hiro wallets
- ✅ **WalletConnect Integration**: Mobile wallet support via QR code
- ✅ **Network Switching**: Seamless mainnet/testnet switching
- ✅ **TypeScript First**: Full type safety and autocomplete
- ✅ **React Hooks**: Modern React integration
- ✅ **RPC Methods**: Complete Stacks RPC support
- ✅ **Transaction Building**: Simplified transaction construction

## Installation

```bash
npm install @timebank/reown-appkit-stacks
# or
yarn add @timebank/reown-appkit-stacks
```

## Quick Start

### 1. Setup Provider

Wrap your app with the `AppKitStacksProvider`:

```tsx
import { AppKitStacksProvider, createAppKitConfig } from '@/lib/reown-appkit';

const config = createAppKitConfig({
  projectId: 'YOUR_REOWN_PROJECT_ID',
  appName: 'My Stacks App',
  appIcon: '/icon.svg',
  chains: ['mainnet', 'testnet'],
  wallets: ['xverse', 'leather', 'hiro'],
});

function App() {
  return (
    <AppKitStacksProvider config={config}>
      <YourApp />
    </AppKitStacksProvider>
  );
}
```

### 2. Use the Hook

Connect wallets and interact with Stacks:

```tsx
import { useAppKitStacks } from '@/lib/reown-appkit';

function WalletButton() {
  const { account, isConnected, connect, disconnect } = useAppKitStacks();

  if (isConnected) {
    return (
      <div>
        <p>Connected: {account?.address}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => connect('xverse')}>
        Connect Xverse
      </button>
      <button onClick={() => connect('leather')}>
        Connect Leather
      </button>
    </div>
  );
}
```

## API Reference

### `createAppKitConfig(options)`

Creates configuration for the Stacks adapter.

**Options:**
```typescript
{
  projectId?: string;          // Reown Project ID (for WalletConnect)
  appName: string;             // Your app name
  appIcon?: string;            // Your app icon URL
  chains?: ('mainnet' | 'testnet')[]; // Supported chains
  wallets?: ('xverse' | 'leather' | 'hiro')[]; // Supported wallets
}
```

### `useAppKitStacks()`

React hook for wallet interactions.

**Returns:**
```typescript
{
  // State
  account: StacksAccount | null;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chain: StacksChain | null;
  error: Error | null;

  // Actions
  connect: (walletId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
}
```

### `StacksAdapter`

Core adapter class for advanced usage.

```typescript
import { StacksAdapter } from '@/lib/reown-appkit';

const adapter = new StacksAdapter(config);

// Connect wallet
await adapter.connect('xverse');

// Get account
const account = adapter.getAccount();

// Get provider
const provider = adapter.getProvider();

// RPC call
const response = await provider.request({
  method: 'stx_getBalance',
  params: [address],
});

// Switch network
await adapter.switchChain('stacks:1'); // mainnet
await adapter.switchChain('stacks:2147483648'); // testnet
```

## Supported Wallets

| Wallet | Browser | Mobile | WalletConnect |
|--------|---------|--------|---------------|
| **Xverse** | ✅ | ✅ | ✅ |
| **Leather** | ✅ | ✅ | ✅ |
| **Hiro** | ✅ | ❌ | ❌ |

## RPC Methods

Supported Stacks RPC methods:

- `stx_getAccounts` - Get connected accounts
- `stx_getAddresses` - Get account addresses and public keys
- `stx_getBalance` - Get STX balance
- `stx_getNetwork` - Get current network
- `stx_transferStx` - Transfer STX tokens
- `stx_callContract` - Call smart contract function
- `stx_signMessage` - Sign arbitrary message
- More coming soon...

## Transaction Building

Simplified transaction construction:

```typescript
import { createTransactionBuilder } from '@/lib/reown-appkit';

const builder = createTransactionBuilder();

// Contract call
const tx = await builder
  .contractCall(
    'SP2ABC...',
    'my-contract',
    'my-function',
    [stringCV('hello')]
  )
  .setNetwork('mainnet')
  .build(senderKey);

// Token transfer
const tx = await builder
  .tokenTransfer('SP2XYZ...', '1000000', 'Payment')
  .setNetwork('testnet')
  .build(senderKey);
```

## Address Utilities

```typescript
import {
  validateStacksAddress,
  formatStacksAddress,
  isContractAddress,
  getNetworkFromAddress
} from '@/lib/reown-appkit';

// Validate
const isValid = validateStacksAddress('SP2ABC...');

// Format for display
const short = formatStacksAddress('SP2ABC...', 4); // "SP2A...C123"

// Check if contract
const isCo = isContractAddress('SP2ABC.my-contract');

// Get network
const network = getNetworkFromAddress('SP2ABC...'); // 'mainnet'
const network = getNetworkFromAddress('ST2ABC...'); // 'testnet'
```

## Examples

### Complete App Example

```tsx
import React from 'react';
import {
  AppKitStacksProvider,
  createAppKitConfig,
  useAppKitStacks
} from '@/lib/reown-appkit';

// 1. Create config
const config = createAppKitConfig({
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  appName: 'Time Banking',
  chains: ['mainnet', 'testnet'],
  wallets: ['xverse', 'leather', 'hiro'],
});

// 2. Wallet component
function WalletConnect() {
  const {
    account,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    error,
  } = useAppKitStacks();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isConnecting) {
    return <div>Connecting...</div>;
  }

  if (isConnected && account) {
    return (
      <div>
        <p>Address: {account.address}</p>
        <p>Network: {account.network}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      <h3>Connect Wallet</h3>
      <button onClick={() => connect('xverse')}>
        Xverse (Mobile & Desktop)
      </button>
      <button onClick={() => connect('leather')}>
        Leather (Mobile & Desktop)
      </button>
      <button onClick={() => connect('hiro')}>
        Hiro (Desktop Only)
      </button>
    </div>
  );
}

// 3. App with provider
function App() {
  return (
    <AppKitStacksProvider config={config}>
      <WalletConnect />
    </AppKitStacksProvider>
  );
}

export default App;
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Reown AppKit UI Layer           │
│  (Future: AppKit modal integration)     │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Stacks Adapter (This Package)      │
│  ┌────────────────────────────────────┐ │
│  │  StacksAdapter (Core)              │ │
│  ├────────────────────────────────────┤ │
│  │  Connectors:                       │ │
│  │  - XverseConnector                 │ │
│  │  - LeatherConnector                │ │
│  │  - HiroConnector                   │ │
│  ├────────────────────────────────────┤ │
│  │  RPC Handler                       │ │
│  │  Transaction Builder               │ │
│  │  Address Utilities                 │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│          @stacks/connect                │
│       (Stacks Wallet Integration)       │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│            Stacks Blockchain            │
└─────────────────────────────────────────┘
```

## Contributing

This adapter is open-source and contributions are welcome!

### Development Setup

```bash
git clone <repo>
cd frontend/src/lib/reown-appkit
npm install
npm run dev
```

### Testing

```bash
npm run test
```

## Roadmap

- [ ] AppKit modal UI integration
- [ ] More RPC methods (contract deploy, structured messages)
- [ ] Account abstraction support
- [ ] Hardware wallet support (Ledger)
- [ ] Enhanced transaction building (batch operations)
- [ ] Sponsored transactions
- [ ] Multi-sig support
- [ ] Contract interaction helpers

## License

MIT License - see LICENSE file

## Support

- **GitHub Issues**: [Report bugs](https://github.com/your-repo/issues)
- **Discord**: Join our community
- **Documentation**: Full docs at [link]

## Acknowledgments

Built for the Stacks ecosystem with ❤️ by the Time Banking Protocol team.

Special thanks to:
- Reown team for AppKit
- Hiro team for Stacks tooling
- Xverse, Leather, and Hiro wallet teams

---

**Made with 🔥 for the Stacks Community**
