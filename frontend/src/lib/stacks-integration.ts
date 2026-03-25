/**
 * Stacks Integration - Main entry point
 * Re-exports all integration modules for convenient consumption
 */

// Network
export {
  StacksNetworkClient,
  createNetworkClient,
  type SupportedNetwork,
  type NetworkEndpoint,
  type NetworkClientConfig,
  type NetworkInfo,
} from './stacks-network-client';

// Fee estimation
export {
  FeeEstimator,
  createFeeEstimator,
  type FeeEstimate,
  type FeeEstimateRequest,
  type FeeLevel,
} from './fee-estimator';

// Nonce management
export {
  NonceManager,
  createNonceManager,
  type NonceInfo,
  type ManagedNonce,
} from './nonce-manager';

// Hiro API
export {
  HiroApiClient,
  createHiroApiClient,
  type HiroApiConfig,
  type AccountBalance,
  type TransactionListItem,
  type TransactionListResponse,
  type SmartContractEvent,
  type SmartContractEventsResponse,
  type BlockInfo,
} from './hiro-api-client';

// STX price
export {
  StxPriceOracle,
  createPriceOracle,
  type PriceData,
  type PriceOracleConfig,
  type PriceSource,
} from './stx-price-oracle';

// Event decoder
export {
  EventDecoder,
  createEventDecoder,
  type TimeBankEventType,
  type DecodedTimeBankEvent,
  type BaseTimeBankEvent,
  type UserRegisteredEvent,
  type CreditsTransferredEvent,
  type ExchangeCreatedEvent,
  type ExchangeCompletedEvent,
  type EscrowCreatedEvent,
  type TokensStakedEvent,
  type ScheduleCreatedEvent,
  type RawContractEvent,
} from './event-decoder';

// Post-conditions
export {
  PostConditionsFactory,
  createPostConditionsFactory,
  type StxTransferPostConditionOptions,
  type FungibleTokenPostConditionOptions,
  type NftPostConditionOptions,
} from './post-conditions-factory';

// Wallet auth
export {
  WalletAuth,
  createWalletAuth,
  type WalletAuthConfig,
  type ConnectedWallet,
  type AuthState,
} from './wallet-auth';

// Message signing
export {
  MessageSigner,
  createMessageSigner,
  type SignedMessage,
  type StructuredSignatureData,
  type SignatureVerifyResult,
  type MessageSigningConfig,
} from './message-signing';

// Read-only caller
export {
  ReadOnlyCaller,
  createReadOnlyCaller,
  type ReadOnlyCallOptions,
  type ReadOnlyCallResult,
} from './read-only-caller';

// Transaction builders
export {
  TimeBankingTxBuilders,
  createTxBuilders,
  type TxBroadcastResult,
} from './transaction-builders';

// Context
export {
  createStacksContext,
  initStacksContext,
  getStacksContext,
  destroyStacksContext,
  type StacksContext,
  type StacksContextConfig,
} from './stacks-context';

// Utilities
export * from './stacks-utils';
export * from './contract-addresses';
