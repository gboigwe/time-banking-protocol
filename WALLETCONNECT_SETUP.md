# WalletConnect (Reown) Integration Guide

This guide explains how to set up and use WalletConnect functionality in the TimeBank application.

## Overview

TimeBank now supports two wallet connection methods:

1. **Browser Wallets** - Traditional Stacks wallet extensions (Hiro, Xverse, Leather)
2. **WalletConnect** - Mobile wallets and 600+ other wallets via WalletConnect protocol (now Reown)

## Prerequisites

Before using WalletConnect, you need to obtain a Project ID from Reown (WalletConnect):

### Getting Your WalletConnect Project ID

1. Visit [Reown Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Click "Create New Project"
4. Enter your project details:
   - **Project Name**: TimeBank (or your preferred name)
   - **Project Homepage**: Your application URL
5. Copy the **Project ID** from the project dashboard

## Setup Instructions

### 1. Install Dependencies

The WalletConnect dependencies are already installed in this project:

```bash
cd frontend
npm install
```

Installed packages:
- `@walletconnect/sign-client` - Core WalletConnect client
- `@walletconnect/utils` - Utility functions
- `@walletconnect/types` - TypeScript type definitions
- `@walletconnect/encoding` - Encoding utilities
- `@walletconnect/qrcode-modal` - QR code modal for connection

### 2. Configure Environment Variables

1. Open `frontend/.env.local` file
2. Add your WalletConnect Project ID:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

Example:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 3. Start the Development Server

```bash
cd frontend
npm run dev
```

## How It Works

### Architecture

The WalletConnect integration is implemented across several key files:

#### 1. **Core Integration** (`frontend/src/lib/stacks.ts`)

Contains the main WalletConnect logic:

- `initializeWalletConnect()` - Initializes the WalletConnect client
- `connectViaWalletConnect()` - Establishes a connection and shows QR code
- `getWalletConnectAddress()` - Retrieves the connected wallet address
- `disconnectWalletConnect()` - Disconnects the WalletConnect session
- `isWalletConnectConnected()` - Checks connection status

#### 2. **State Management** (`frontend/src/contexts/WalletContext.tsx`)

Manages wallet state for both connection types:

- `connectWithWalletConnect()` - Method to connect via WalletConnect
- `connectionType` - Tracks whether using 'traditional' or 'walletconnect'
- `refreshConnection()` - Updates connection state for both methods

#### 3. **User Interface** (`frontend/src/components/Header.tsx`)

Provides the wallet selection modal:

- Shows two connection options: Browser Wallet and WalletConnect
- Displays connection type badge in user profile
- Handles both connection flows

### Connection Flow

#### Traditional Browser Wallet Flow:

1. User clicks "Connect Wallet"
2. Modal shows with two options
3. User selects "Browser Wallet"
4. Stacks Connect modal appears with Hiro/Xverse options
5. User approves in browser extension
6. Page reloads and user is connected

#### WalletConnect Flow:

1. User clicks "Connect Wallet"
2. Modal shows with two options
3. User selects "WalletConnect"
4. QR code modal appears
5. User scans QR code with mobile wallet (or desktop wallet)
6. User approves connection in their wallet
7. Session is established and user is connected

## Supported Methods

The WalletConnect integration supports the following Stacks blockchain methods:

- `stacks_signMessage` - Sign arbitrary messages
- `stacks_stxTransfer` - Transfer STX tokens
- `stacks_contractCall` - Call smart contract functions
- `stacks_contractDeploy` - Deploy smart contracts

## Testing

### Testing with Mobile Wallets

1. Ensure your mobile device is on the same network (or use a public URL)
2. Click "Connect Wallet" → "WalletConnect"
3. Open a Stacks-compatible mobile wallet (e.g., Xverse Mobile)
4. Scan the QR code
5. Approve the connection

### Testing with Desktop Wallets

Some desktop wallets also support WalletConnect:

1. Install a WalletConnect-compatible Stacks wallet
2. Click "Connect Wallet" → "WalletConnect"
3. Copy the URI or scan the QR code
4. Approve in your wallet application

## Network Configuration

The integration automatically detects the network configuration from your environment:

- **Testnet**: `stacks:2147483648`
- **Mainnet**: `stacks:1`

The chain ID is determined by `NEXT_PUBLIC_STACKS_NETWORK` environment variable.

## Troubleshooting

### "WalletConnect Project ID is required" Error

**Cause**: Missing or invalid Project ID in environment variables

**Solution**:
1. Verify `.env.local` exists in the `frontend` directory
2. Ensure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
3. Restart the development server after adding the variable

### QR Code Modal Not Appearing

**Cause**: WalletConnect client initialization failed

**Solution**:
1. Check browser console for errors
2. Verify internet connection (needs to connect to WalletConnect relay)
3. Check that the Project ID is valid

### Connection Timing Out

**Cause**: User didn't approve in time or network issues

**Solution**:
1. Try connecting again
2. Ensure wallet app supports WalletConnect v2
3. Check network connectivity on both devices

### Address Not Detected After Connection

**Cause**: Session established but namespace parsing failed

**Solution**:
1. Check that the wallet approved the correct chain (stacks:1 or stacks:2147483648)
2. Verify the wallet supports Stacks blockchain
3. Try disconnecting and reconnecting

## Code Examples

### Connecting via WalletConnect

```typescript
import { connectViaWalletConnect } from '@/lib/stacks';

const handleConnect = async () => {
  try {
    const session = await connectViaWalletConnect();
    console.log('Connected!', session);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};
```

### Getting Connected Address

```typescript
import { getWalletConnectAddress, getUserAddress } from '@/lib/stacks';

// This function checks WalletConnect first, then falls back to traditional wallet
const address = getUserAddress();

// Or get WalletConnect address specifically
const wcAddress = getWalletConnectAddress();
```

### Disconnecting

```typescript
import { disconnectWallet } from '@/lib/stacks';

// Handles both WalletConnect and traditional wallet disconnection
await disconnectWallet();
```

## Security Considerations

1. **Project ID**: Your Project ID is public and safe to commit to version control
2. **Session Data**: WalletConnect sessions are stored in memory only
3. **Relay Server**: All communication goes through WalletConnect's secure relay
4. **Encryption**: All data is end-to-end encrypted between dApp and wallet

## Migration from Stacks Connect Only

If you're updating from a version that only supported browser wallets:

1. All existing browser wallet functionality remains unchanged
2. WalletConnect is an additional option, not a replacement
3. Users can choose their preferred connection method
4. The `getUserAddress()` function works with both connection types

## Resources

- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Reown (WalletConnect) Website](https://reown.com/)
- [Stacks Blockchain WalletConnect Guide](https://docs.xverse.app/wallet-connect/web/webapp)
- [Get Project ID](https://cloud.walletconnect.com/)

## Support

For issues or questions:

1. Check the [WalletConnect documentation](https://docs.walletconnect.com/)
2. Review the [Stacks integration guide](https://docs.xverse.app/wallet-connect)
3. Open an issue in the TimeBank repository

## What's Next?

Future enhancements could include:

- [ ] Persistent session storage (survive page refreshes)
- [ ] Support for additional WalletConnect methods
- [ ] Multi-account support
- [ ] Session event listeners (disconnect, chain change, etc.)
- [ ] Mobile app deep linking
