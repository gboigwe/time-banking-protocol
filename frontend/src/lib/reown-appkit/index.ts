/**
 * Reown AppKit Stacks Adapter
 * Complete integration package for using Stacks blockchain with Reown AppKit
 *
 * @package @timebank/reown-appkit-stacks
 * @author Time Banking Protocol Team
 * @license MIT
 */

// Core Adapter
export { StacksAdapter } from './adapters/stacks-adapter';

// Wallet Connectors
export { XverseConnector } from './adapters/xverse-connector';
export { LeatherConnector } from './adapters/leather-connector';
export { HiroConnector } from './adapters/hiro-connector';

// Chains
export { stacksMainnet } from './chains/stacks-mainnet';
export { stacksTestnet } from './chains/stacks-testnet';

// Configuration
export { createAppKitConfig } from './config/appkit-config';

// React Hooks
export { useAppKitStacks } from './hooks/useAppKitStacks';

// React Provider
export { AppKitStacksProvider, StacksAdapterContext } from './providers/AppKitStacksProvider';

// Utilities
export * from './utils/address-utils';
export { StacksTransactionBuilder, createTransactionBuilder } from './utils/transaction-builder';
export { StacksRPCHandler } from './utils/rpc-handler';

// Types
export type {
  StacksChain,
  StacksWallet,
  StacksConnector,
  StacksAccount,
  StacksTransactionRequest,
  StacksTransactionResponse,
  StacksRPCMethod,
  StacksRPCRequest,
  StacksRPCResponse,
  StacksProvider,
  StacksAdapterConfig,
  StacksEvent,
  StacksEventPayload,
  StacksStorage,
} from './types';
export { StacksErrorCode, StacksAdapterError } from './types';

// Version
export const VERSION = '1.0.0';

// Default export
export default StacksAdapter;
