/**
 * Hooks barrel export
 * Re-exports all React hooks for Stacks blockchain integration
 */

// Wallet & auth
export { useWallet } from './useWallet';
export type { UseWalletResult } from './useWallet';

export { useMessageSigning } from './useMessageSigning';
export type { UseMessageSigningResult, MessageSigningState } from './useMessageSigning';

// Network
export { useNetwork } from './useNetwork';
export type { UseNetworkResult, NetworkState, UseNetworkOptions } from './useNetwork';

// Balances
export { useBalance } from './useBalance';
export type { UseBalanceResult, BalanceState, UseBalanceOptions } from './useBalance';

export { useTimeBankBalance } from './useTimeBankBalance';
export type {
  UseTimeBankBalanceResult,
  TimeBankBalanceState,
  UseTimeBankBalanceOptions,
} from './useTimeBankBalance';

// Price
export { usePrice } from './usePrice';
export type { UsePriceResult, PriceState, UsePriceOptions } from './usePrice';

export { useStxPrice } from './useStxPrice';
export type { StxPriceDisplay } from './useStxPrice';

// Nonce
export { useNonce } from './useNonce';
export type { UseNonceResult, NonceState } from './useNonce';

// Fees
export { useFees } from './useFees';
export type { UseFeesResult, FeesState } from './useFees';

// Transaction history
export { useTxHistory } from './useTxHistory';
export type {
  UseTxHistoryResult,
  TxHistoryState,
  UseTxHistoryOptions,
} from './useTxHistory';

// Events
export { useEvents } from './useEvents';
export type { UseEventsResult, EventsState, UseEventsOptions } from './useEvents';

// Contract queries
export { useReadOnly } from './useReadOnly';
export type {
  UseReadOnlyResult,
  UseReadOnlyState,
  UseReadOnlyOptions,
} from './useReadOnly';

export { useContractVersion } from './useContractVersion';
export type {
  UseContractVersionResult,
  ContractVersionState,
  ContractInfo,
} from './useContractVersion';

// Existing hooks (re-exported for convenience)
export { useContracts } from './useContracts';
export { useTimeBankCore } from './useTimeBankCore';
export { useExchangeManager } from './useExchangeManager';
export { useSkillRegistry } from './useSkillRegistry';
export { useTransactionTracker } from './useTransactionTracker';
export { useRealtimeEvents } from './useRealtimeEvents';
export { useChainhookEvents } from './useChainhookEvents';
