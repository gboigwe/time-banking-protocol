/**
 * Complete Usage Example for Reown AppKit Stacks Adapter
 * This file demonstrates all features of the adapter
 */

import React from 'react';
import {
  AppKitStacksProvider,
  createAppKitConfig,
  useAppKitStacks,
  formatStacksAddress,
  createTransactionBuilder,
} from '../index';
import { uintCV, stringAsciiCV } from '@stacks/transactions';

// ============================================================================
// CONFIGURATION
// ============================================================================

const appKitConfig = createAppKitConfig({
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  appName: 'Time Banking Protocol',
  appIcon: '/icon.svg',
  chains: ['mainnet', 'testnet'],
  wallets: ['xverse', 'leather', 'hiro'],
});

// ============================================================================
// WALLET CONNECTION COMPONENT
// ============================================================================

function WalletConnectionExample() {
  const {
    account,
    address,
    isConnected,
    isConnecting,
    chain,
    connect,
    disconnect,
    switchChain,
    error,
  } = useAppKitStacks();

  const handleConnect = async (walletId: 'xverse' | 'leather' | 'hiro') => {
    try {
      await connect(walletId);
      console.log('✅ Connected successfully');
    } catch (err) {
      console.error('❌ Connection failed:', err);
    }
  };

  const handleNetworkSwitch = async () => {
    try {
      const newChainId = chain?.network === 'mainnet'
        ? 'stacks:2147483648' // testnet
        : 'stacks:1'; // mainnet

      await switchChain(newChainId);
      console.log('✅ Network switched');
    } catch (err) {
      console.error('❌ Network switch failed:', err);
    }
  };

  if (error) {
    return (
      <div className="error-banner">
        <p>⚠️ Error: {error.message}</p>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Connecting wallet...</p>
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className="wallet-connected">
        <div className="account-info">
          <h3>Account Connected</h3>
          <p><strong>Address:</strong> {formatStacksAddress(account.address)}</p>
          <p><strong>Full Address:</strong> {account.address}</p>
          <p><strong>Network:</strong> {account.network}</p>
          <p><strong>Chain ID:</strong> {chain?.id}</p>
        </div>

        <div className="actions">
          <button onClick={handleNetworkSwitch} className="btn-secondary">
            Switch to {chain?.network === 'mainnet' ? 'Testnet' : 'Mainnet'}
          </button>
          <button onClick={disconnect} className="btn-danger">
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-select">
      <h3>Connect Your Wallet</h3>
      <div className="wallet-options">
        <button
          onClick={() => handleConnect('xverse')}
          className="wallet-btn"
        >
          <img src="/wallets/xverse.svg" alt="Xverse" />
          <div>
            <h4>Xverse</h4>
            <p>Browser & Mobile (WalletConnect)</p>
          </div>
        </button>

        <button
          onClick={() => handleConnect('leather')}
          className="wallet-btn"
        >
          <img src="/wallets/leather.svg" alt="Leather" />
          <div>
            <h4>Leather</h4>
            <p>Browser & Mobile (WalletConnect)</p>
          </div>
        </button>

        <button
          onClick={() => handleConnect('hiro')}
          className="wallet-btn"
        >
          <img src="/wallets/hiro.svg" alt="Hiro" />
          <div>
            <h4>Hiro Wallet</h4>
            <p>Browser Extension Only</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// TRANSACTION EXAMPLE COMPONENT
// ============================================================================

function TransactionExample() {
  const { account, isConnected } = useAppKitStacks();
  const [txId, setTxId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleContractCall = async () => {
    if (!account) return;

    try {
      setLoading(true);

      const builder = createTransactionBuilder();
      const tx = await builder
        .contractCall(
          'SP3BXJENEWVNCFYGJF75DFS478H1BZJXNZPT84EAD',
          'time-bank-core',
          'register-user',
          []
        )
        .setNetwork(account.network)
        .build(account.publicKey);

      // Transaction would be broadcast here
      console.log('Transaction built:', tx);
      setTxId('0x123...'); // Mock tx ID

    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenTransfer = async () => {
    if (!account) return;

    try {
      setLoading(true);

      const builder = createTransactionBuilder();
      const tx = await builder
        .tokenTransfer(
          'SP2ABC123...',
          '1000000', // 1 STX (in microSTX)
          'Payment for service'
        )
        .setNetwork(account.network)
        .build(account.publicKey);

      console.log('Transfer built:', tx);
      setTxId('0x456...'); // Mock tx ID

    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <p>Please connect your wallet to send transactions</p>;
  }

  return (
    <div className="transaction-panel">
      <h3>Transaction Examples</h3>

      {txId && (
        <div className="success-message">
          ✅ Transaction submitted: {txId}
        </div>
      )}

      <div className="transaction-buttons">
        <button
          onClick={handleContractCall}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Processing...' : 'Call Contract'}
        </button>

        <button
          onClick={handleTokenTransfer}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Processing...' : 'Send STX'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function AppKitStacksExample() {
  return (
    <AppKitStacksProvider config={appKitConfig}>
      <div className="app-container">
        <header>
          <h1>🔗 Reown AppKit Stacks Adapter Demo</h1>
          <p>Complete example of Stacks blockchain integration with Reown AppKit</p>
        </header>

        <main>
          <section className="card">
            <WalletConnectionExample />
          </section>

          <section className="card">
            <TransactionExample />
          </section>
        </main>

        <footer>
          <p>Built with ❤️ for the Stacks ecosystem</p>
        </footer>
      </div>
    </AppKitStacksProvider>
  );
}

export default AppKitStacksExample;

// ============================================================================
// STYLES (Optional - for demo purposes)
// ============================================================================

const styles = `
  .app-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .wallet-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .wallet-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wallet-btn:hover {
    border-color: #4f46e5;
    transform: translateY(-2px);
  }

  .btn-primary {
    background: #4f46e5;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn-secondary {
    background: #6b7280;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn-danger {
    background: #ef4444;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .loading-state {
    text-align: center;
    padding: 2rem;
  }

  .spinner {
    border: 3px solid #f3f4f6;
    border-top: 3px solid #4f46e5;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
