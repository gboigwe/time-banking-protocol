// Time Bank Core Contract Integration
// Clarity 4 contract with stacks-block-time timestamps

import {
  standardPrincipalCV,
  uintCV,
  ClarityValue,
  cvToValue,
} from '@stacks/transactions';
import {
  TimeBankUser,
  ProtocolStats,
  ContractCallResult,
} from '@/types/contracts';
import {
  getContractIdentifier,
  getContractAddress,
  CONTRACT_NAMES,
  FUNCTION_NAMES,
} from '../contractConfig';
import { callReadOnlyFunction, makeContractCall } from '../stacksApi';

const contractName = 'timeBankCore';

// ============================================
// WRITE FUNCTIONS
// ============================================

export const registerUser = async (): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.timeBankCore.registerUser,
      functionArgs: [],
      postConditions: [],
    });

    return {
      success: true,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to register user',
    };
  }
};

export const transferCredits = async (
  recipient: string,
  amount: number
): Promise<ContractCallResult<void>> => {
  try {
    const functionArgs: ClarityValue[] = [
      standardPrincipalCV(recipient),
      uintCV(amount),
    ];

    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.timeBankCore.transferCredits,
      functionArgs,
      postConditions: [],
    });

    return {
      success: true,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to transfer credits',
    };
  }
};

export const deactivateUser = async (): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.timeBankCore.deactivateUser,
      functionArgs: [],
      postConditions: [],
    });

    return {
      success: true,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to deactivate user',
    };
  }
};

export const reactivateUser = async (): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.timeBankCore.reactivateUser,
      functionArgs: [],
      postConditions: [],
    });

    return {
      success: true,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to reactivate user',
    };
  }
};

// ============================================
// READ-ONLY FUNCTIONS
// ============================================

export const getUserInfo = async (userAddress: string): Promise<TimeBankUser | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.timeBankCore.getUserInfo,
      functionArgs: [standardPrincipalCV(userAddress)],
    });

    if (!result || result.type === 'none') {
      return null;
    }

    const value = cvToValue(result);

    return {
      principal: userAddress,
      joinedAt: parseInt(value.value['joined-at'].value),
      totalHoursGiven: parseInt(value.value['total-hours-given'].value),
      totalHoursReceived: parseInt(value.value['total-hours-received'].value),
      reputationScore: parseInt(value.value['reputation-score'].value),
      isActive: value.value['is-active'].value,
      lastActivity: parseInt(value.value['last-activity'].value),
      timeBalance: 0, // Fetched separately
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

export const getUserBalance = async (userAddress: string): Promise<number> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.timeBankCore.getUserBalance,
      functionArgs: [standardPrincipalCV(userAddress)],
    });

    const value = cvToValue(result);
    return parseInt(value.value);
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return 0;
  }
};

export const isUserActive = async (userAddress: string): Promise<boolean> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.timeBankCore.isUserActive,
      functionArgs: [standardPrincipalCV(userAddress)],
    });

    const value = cvToValue(result);
    return value.value;
  } catch (error) {
    console.error('Error checking if user is active:', error);
    return false;
  }
};

export const getProtocolStats = async (): Promise<ProtocolStats | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.timeBankCore.getProtocolStats,
      functionArgs: [],
    });

    const value = cvToValue(result);

    return {
      totalUsers: parseInt(value.value['total-users'].value),
      totalActiveUsers: parseInt(value.value['total-active-users'].value),
      totalCreditsIssued: parseInt(value.value['total-credits-issued'].value),
      totalCreditsCirculating: parseInt(value.value['total-credits-circulating'].value),
      protocolPaused: value.value['protocol-paused'].value,
    };
  } catch (error) {
    console.error('Error fetching protocol stats:', error);
    return null;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const getUserWithBalance = async (
  userAddress: string
): Promise<TimeBankUser | null> => {
  try {
    const [userInfo, balance] = await Promise.all([
      getUserInfo(userAddress),
      getUserBalance(userAddress),
    ]);

    if (!userInfo) {
      return null;
    }

    return {
      ...userInfo,
      timeBalance: balance,
    };
  } catch (error) {
    console.error('Error fetching user with balance:', error);
    return null;
  }
};
