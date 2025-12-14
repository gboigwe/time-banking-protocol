// Stacks API Helper Functions
// Wrapper around @stacks/transactions for contract interactions

import {
  makeContractCall as makeStacksContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  ClarityValue,
  fetchCallReadOnlyFunction,
  cvToValue,
  PostCondition,
} from '@stacks/transactions';
import { userSession } from './stacks';
import { getStacksNetwork, TX_CONFIG } from './contractConfig';
import { TransactionStatus } from '@/types/contracts';

// ============================================
// CONTRACT CALL FUNCTIONS
// ============================================

export interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions?: PostCondition[];
  anchorMode?: AnchorMode;
  postConditionMode?: PostConditionMode;
  fee?: number;
}

export interface ContractCallResponse {
  txId?: string;
  error?: string;
}

/**
 * Make a contract call (write operation)
 */
export const makeContractCall = async (
  params: ContractCallParams
): Promise<ContractCallResponse> => {
  try {
    if (!userSession.isUserSignedIn()) {
      throw new Error('Wallet not connected');
    }

    const userData = userSession.loadUserData();
    if (!userData.appPrivateKey) {
      throw new Error('Private key not available');
    }

    const network = getStacksNetwork();

    const txOptions = {
      contractAddress: params.contractAddress,
      contractName: params.contractName,
      functionName: params.functionName,
      functionArgs: params.functionArgs,
      senderKey: userData.appPrivateKey,
      network,
      anchorMode: params.anchorMode || AnchorMode.Any,
      postConditionMode: params.postConditionMode || PostConditionMode.Allow,
      postConditions: params.postConditions || [],
      fee: params.fee || TX_CONFIG.defaultFee,
    };

    const transaction = await makeStacksContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction({ transaction, network });

    if (broadcastResponse.error) {
      throw new Error(broadcastResponse.error);
    }

    return {
      txId: broadcastResponse.txid,
    };
  } catch (error: any) {
    console.error('Contract call error:', error);
    return {
      error: error.message || 'Failed to make contract call',
    };
  }
};

// ============================================
// READ-ONLY FUNCTIONS
// ============================================

export interface ReadOnlyFunctionParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  senderAddress?: string;
}

/**
 * Call a read-only contract function
 */
export const callReadOnlyFunction = async (
  params: ReadOnlyFunctionParams
): Promise<ClarityValue> => {
  try {
    const network = getStacksNetwork();
    let senderAddress = params.senderAddress;

    if (!senderAddress && userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const networkType = network.isMainnet() ? 'mainnet' : 'testnet';
      senderAddress = userData.profile.stxAddress[networkType];
    }

    if (!senderAddress) {
      senderAddress = params.contractAddress;
    }

    const result = await fetchCallReadOnlyFunction({
      contractAddress: params.contractAddress,
      contractName: params.contractName,
      functionName: params.functionName,
      functionArgs: params.functionArgs,
      senderAddress,
      network,
    });

    return result;
  } catch (error) {
    console.error('Read-only function call error:', error);
    throw error;
  }
};

// ============================================
// TRANSACTION STATUS
// ============================================

/**
 * Wait for a transaction to be confirmed
 */
export const waitForTransaction = async (
  txId: string,
  timeout: number = TX_CONFIG.confirmationTimeout
): Promise<TransactionStatus> => {
  const network = getStacksNetwork();
  const apiUrl = network.isMainnet()
    ? 'https://api.hiro.so'
    : 'https://api.testnet.hiro.so';

  const startTime = Date.now();
  let attempts = 0;

  while (Date.now() - startTime < timeout && attempts < TX_CONFIG.maxRetries) {
    try {
      const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
      const tx = await response.json();

      if (tx.tx_status === 'success') {
        return {
          txId,
          status: 'success',
          blockHeight: tx.block_height,
          timestamp: tx.burn_block_time,
        };
      } else if (
        tx.tx_status === 'abort_by_post_condition' ||
        tx.tx_status === 'abort_by_response'
      ) {
        return {
          txId,
          status: 'failed',
        };
      }

      await new Promise((resolve) => setTimeout(resolve, TX_CONFIG.pollInterval));
      attempts++;
    } catch (error) {
      console.error('Error checking transaction status:', error);
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, TX_CONFIG.pollInterval));
    }
  }

  return {
    txId,
    status: 'pending',
  };
};

/**
 * Get transaction status
 */
export const getTransactionStatus = async (
  txId: string
): Promise<TransactionStatus> => {
  try {
    const network = getStacksNetwork();
    const apiUrl = network.isMainnet()
      ? 'https://api.hiro.so'
      : 'https://api.testnet.hiro.so';

    const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
    const tx = await response.json();

    let status: 'pending' | 'success' | 'failed' = 'pending';

    if (tx.tx_status === 'success') {
      status = 'success';
    } else if (
      tx.tx_status === 'abort_by_post_condition' ||
      tx.tx_status === 'abort_by_response'
    ) {
      status = 'failed';
    }

    return {
      txId,
      status,
      blockHeight: tx.block_height,
      timestamp: tx.burn_block_time,
    };
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return {
      txId,
      status: 'pending',
    };
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert Clarity value to JSON-serializable value
 */
export const clarityValueToJSON = (clarityValue: ClarityValue): any => {
  return cvToValue(clarityValue);
};

/**
 * Get account STX balance
 */
export const getAccountBalance = async (address: string): Promise<number> => {
  try {
    const network = getStacksNetwork();
    const apiUrl = network.isMainnet()
      ? 'https://api.hiro.so'
      : 'https://api.testnet.hiro.so';

    const response = await fetch(`${apiUrl}/extended/v1/address/${address}/balances`);
    const data = await response.json();

    return parseInt(data.stx.balance);
  } catch (error) {
    console.error('Error fetching account balance:', error);
    return 0;
  }
};

/**
 * Get account nonce
 */
export const getAccountNonce = async (address: string): Promise<number> => {
  try {
    const network = getStacksNetwork();
    const apiUrl = network.isMainnet()
      ? 'https://api.hiro.so'
      : 'https://api.testnet.hiro.so';

    const response = await fetch(`${apiUrl}/extended/v1/address/${address}/nonces`);
    const data = await response.json();

    return parseInt(data.possible_next_nonce);
  } catch (error) {
    console.error('Error fetching account nonce:', error);
    return 0;
  }
};
