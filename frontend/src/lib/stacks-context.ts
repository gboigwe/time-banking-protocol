/**
 * Stacks Integration Context
 * Central registry for all Stacks integration services
 */

import {
  StacksNetworkClient,
  SupportedNetwork,
  createNetworkClient,
} from './stacks-network-client';
import { FeeEstimator, createFeeEstimator } from './fee-estimator';
import { NonceManager, createNonceManager } from './nonce-manager';
import { HiroApiClient, HiroApiConfig, createHiroApiClient } from './hiro-api-client';
import { StxPriceOracle, PriceOracleConfig, createPriceOracle } from './stx-price-oracle';
import { EventDecoder, createEventDecoder } from './event-decoder';
import { PostConditionsFactory, createPostConditionsFactory } from './post-conditions-factory';
import { ReadOnlyCaller, createReadOnlyCaller } from './read-only-caller';
import { WalletAuth, WalletAuthConfig, createWalletAuth } from './wallet-auth';

export interface StacksContextConfig {
  network: SupportedNetwork;
  appName: string;
  appIconUrl?: string;
  hiroApiKey?: string;
  priceOracleConfig?: PriceOracleConfig;
  networkEndpoints?: string[];
}

export interface StacksContext {
  network: SupportedNetwork;
  networkClient: StacksNetworkClient;
  feeEstimator: FeeEstimator;
  nonceManager: NonceManager;
  apiClient: HiroApiClient;
  priceOracle: StxPriceOracle;
  eventDecoder: EventDecoder;
  postConditionsFactory: PostConditionsFactory;
  readOnlyCaller: ReadOnlyCaller;
  walletAuth: WalletAuth;
  switchNetwork: (network: SupportedNetwork) => StacksContext;
}

let _context: StacksContext | null = null;

export function createStacksContext(config: StacksContextConfig): StacksContext {
  const networkClient = createNetworkClient(config.network, {
    endpoints: config.networkEndpoints,
  });

  const walletAuthConfig: WalletAuthConfig = {
    appName: config.appName,
    appIconUrl: config.appIconUrl,
    network: config.network,
  };

  const hiroConfig: HiroApiConfig = {
    apiKey: config.hiroApiKey,
  };

  const context: StacksContext = {
    network: config.network,
    networkClient,
    feeEstimator: createFeeEstimator(networkClient),
    nonceManager: createNonceManager(networkClient),
    apiClient: createHiroApiClient(networkClient, hiroConfig),
    priceOracle: createPriceOracle(config.priceOracleConfig),
    eventDecoder: createEventDecoder(),
    postConditionsFactory: createPostConditionsFactory(),
    readOnlyCaller: createReadOnlyCaller(networkClient),
    walletAuth: createWalletAuth(walletAuthConfig),
    switchNetwork: (network: SupportedNetwork) =>
      createStacksContext({ ...config, network }),
  };

  return context;
}

export function getStacksContext(): StacksContext {
  if (!_context) throw new Error('StacksContext not initialised. Call initStacksContext first.');
  return _context;
}

export function initStacksContext(config: StacksContextConfig): StacksContext {
  _context = createStacksContext(config);
  return _context;
}

export function destroyStacksContext(): void {
  if (_context) {
    _context.networkClient.stopHealthChecks();
    _context = null;
  }
}
