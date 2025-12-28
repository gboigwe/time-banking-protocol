/**
 * Stacks.js v8+ Utilities Index
 * Central export point for all v8 utilities and helpers
 */

// Transaction Building
export {
  TransactionBuilder,
  createTransactionBuilder,
  type TransactionConfig,
  type ContractCallConfig,
  type STXTransferConfig,
} from './transaction-builder';

// Batch Transactions
export {
  BatchTransactionManager,
  createBatchManager,
  type BatchTransactionResult,
  type BatchExecutionOptions,
} from './batch-transactions';

// Sponsored Transactions
export {
  SponsoredTransactionManager,
  createSponsorManager,
  quickSponsor,
  type SponsorConfig,
  type SponsorResult,
} from './sponsored-transactions';

// Error Handling
export {
  ErrorParser,
  ErrorHandler,
  StacksError,
  NetworkError,
  BroadcastError,
  InsufficientFundsError,
  PostConditionError,
  withRetry,
  StacksErrorType,
} from './error-handling';

// Post Conditions
export {
  PostConditionBuilder,
  createPostConditionBuilder,
  createSTXTransferCondition,
  createSTXMinTransferCondition,
  createSTXMaxTransferCondition,
  ConditionCodes,
  PostConditionExamples,
} from './post-conditions';

// Transaction Tracking
export {
  TransactionTracker,
  createTransactionTracker,
  TransactionStatus,
  type TrackedTransaction,
  type TransactionTrackerConfig,
} from './transaction-tracker';

// Transaction Queue
export {
  TransactionQueueManager,
  createTransactionQueue,
  type QueuedTransaction,
  type QueueResult,
  type QueueConfig,
} from './transaction-queue';

// Network Configuration
export {
  NetworkConfigManager,
  getNetworkManager,
  createNetworkManager,
  NetworkPresets,
  NetworkUtils,
  type NetworkType,
  type NetworkConfig,
} from './network-config';

// Contract Helpers
export {
  CV,
  ParseCV,
  ContractArgs,
  ClarityTypeGuards,
  ContractUtils,
  ResponseParsers,
} from './contract-helpers';

/**
 * Quick start examples for common v8 patterns
 */
export const StacksV8Examples = {
  /**
   * Build and execute a simple contract call
   */
  simpleContractCall: async () => {
    const { createTransactionBuilder } = await import('./transaction-builder');
    const { getNetwork } = await import('./stacks');
    const { CV } = await import('./contract-helpers');

    const builder = createTransactionBuilder();
    builder.setNetwork(getNetwork());

    // Example contract call
    // await builder.executeContractCall({
    //   contractAddress: 'SP...',
    //   contractName: 'my-contract',
    //   functionName: 'my-function',
    //   functionArgs: [CV.uint(100), CV.ascii('hello')],
    //   senderKey: 'your-private-key',
    // });
  },

  /**
   * Execute multiple transactions in batch
   */
  batchTransactions: async () => {
    const { createBatchManager } = await import('./batch-transactions');
    const { getNetwork } = await import('./stacks');

    const batchManager = createBatchManager();
    // Add transactions with batchManager.add()
    // Execute with batchManager.execute({ network: getNetwork() })
  },

  /**
   * Track transaction status in real-time
   */
  trackTransaction: async (txId: string) => {
    const { createTransactionTracker } = await import('./transaction-tracker');
    const { getNetwork } = await import('./stacks');

    const tracker = createTransactionTracker({
      network: getNetwork(),
      onStatusChange: (tx) => {
        console.log('Transaction status:', tx.status);
      },
    });

    tracker.track(txId);
    const result = await tracker.waitForCompletion(txId);
    return result;
  },

  /**
   * Build post-conditions for safe transactions
   */
  buildPostConditions: () => {
    const { createPostConditionBuilder, ConditionCodes } = require('./post-conditions');

    const builder = createPostConditionBuilder();
    builder.addSTXCondition(
      'SP...',
      ConditionCodes.STX_EQUAL,
      100n * 1000000n
    );

    return builder.build();
  },
};

/**
 * Version information
 */
export const STACKS_V8_VERSION = '8.0.0';
export const MIGRATION_COMPLETED = true;

/**
 * Feature flags for v8 capabilities
 */
export const V8Features = {
  transactionBuilder: true,
  batchTransactions: true,
  sponsoredTransactions: true,
  typedErrors: true,
  postConditionBuilder: true,
  transactionTracking: true,
  networkManager: true,
  contractHelpers: true,
  optimisticUpdates: true,
} as const;
