// Exchange Manager Contract Integration
// Clarity 4 contract with stacks-block-time scheduling

import {
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  ClarityValue,
  cvToValue,
} from '@stacks/transactions';
import {
  ServiceExchange,
  ExchangeReview,
  ExchangeStats,
  ContractCallResult,
  ExchangeStatus,
} from '@/types/contracts';
import {
  getContractAddress,
  CONTRACT_NAMES,
  FUNCTION_NAMES,
} from '../contractConfig';
import { callReadOnlyFunction, makeContractCall } from '../stacksApi';

const contractName = 'exchangeManager';

// ============================================
// WRITE FUNCTIONS
// ============================================

export const createExchange = async (
  provider: string,
  skillName: string,
  hoursRequested: number,
  scheduledStart: number,
  scheduledEnd: number
): Promise<ContractCallResult<number>> => {
  try {
    const functionArgs: ClarityValue[] = [
      standardPrincipalCV(provider),
      stringAsciiCV(skillName),
      uintCV(hoursRequested),
      uintCV(scheduledStart),
      uintCV(scheduledEnd),
    ];

    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.exchangeManager.createExchange,
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
      error: error.message || 'Failed to create exchange',
    };
  }
};

export const acceptExchange = async (
  exchangeId: number
): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.exchangeManager.acceptExchange,
      functionArgs: [uintCV(exchangeId)],
      postConditions: [],
    });

    return {
      success: true,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to accept exchange',
    };
  }
};

export const confirmCompletion = async (
  exchangeId: number
): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.exchangeManager.confirmCompletion,
      functionArgs: [uintCV(exchangeId)],
      postConditions: [],
    });

    return {
      success: true,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to confirm completion',
    };
  }
};

export const cancelExchange = async (
  exchangeId: number
): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.exchangeManager.cancelExchange,
      functionArgs: [uintCV(exchangeId)],
      postConditions: [],
    });

    return {
      success: true,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to cancel exchange',
    };
  }
};

export const submitReview = async (
  exchangeId: number,
  rating: number,
  comment: string
): Promise<ContractCallResult<void>> => {
  try {
    const functionArgs: ClarityValue[] = [
      uintCV(exchangeId),
      uintCV(rating),
      stringAsciiCV(comment),
    ];

    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.exchangeManager.submitReview,
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
      error: error.message || 'Failed to submit review',
    };
  }
};

// ============================================
// READ-ONLY FUNCTIONS
// ============================================

export const getExchangeDetails = async (
  exchangeId: number
): Promise<ServiceExchange | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.exchangeManager.getExchangeDetails,
      functionArgs: [uintCV(exchangeId)],
    });

    if (!result || result.type === 'none') {
      return null;
    }

    const value = cvToValue(result);

    return {
      exchangeId,
      requester: value.value.requester.value,
      provider: value.value.provider.value,
      skillName: value.value['skill-name'].value,
      hoursRequested: parseInt(value.value['hours-requested'].value),
      scheduledStart: parseInt(value.value['scheduled-start'].value),
      scheduledEnd: parseInt(value.value['scheduled-end'].value),
      status: value.value.status.value as ExchangeStatus,
      createdAt: parseInt(value.value['created-at'].value),
      acceptedAt: value.value['accepted-at'].value
        ? parseInt(value.value['accepted-at'].value.value)
        : undefined,
      completedAt: value.value['completed-at'].value
        ? parseInt(value.value['completed-at'].value.value)
        : undefined,
      requesterConfirmed: value.value['requester-confirmed'].value,
      providerConfirmed: value.value['provider-confirmed'].value,
    };
  } catch (error) {
    console.error('Error fetching exchange details:', error);
    return null;
  }
};

export const isExchangeActive = async (exchangeId: number): Promise<boolean> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.exchangeManager.isExchangeActive,
      functionArgs: [uintCV(exchangeId)],
    });

    const value = cvToValue(result);
    return value.value;
  } catch (error) {
    console.error('Error checking if exchange is active:', error);
    return false;
  }
};

export const isExchangeCompleted = async (exchangeId: number): Promise<boolean> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.exchangeManager.isExchangeCompleted,
      functionArgs: [uintCV(exchangeId)],
    });

    const value = cvToValue(result);
    return value.value;
  } catch (error) {
    console.error('Error checking if exchange is completed:', error);
    return false;
  }
};

export const getExchangeStats = async (): Promise<ExchangeStats | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.exchangeManager.getExchangeStats,
      functionArgs: [],
    });

    const value = cvToValue(result);

    return {
      totalExchanges: parseInt(value.value['total-exchanges'].value),
      completedExchanges: parseInt(value.value['completed-exchanges'].value),
      cancelledExchanges: parseInt(value.value['cancelled-exchanges'].value),
      activeExchanges: parseInt(value.value['active-exchanges'].value),
      totalHoursExchanged: parseInt(value.value['total-hours-exchanged'].value),
    };
  } catch (error) {
    console.error('Error fetching exchange stats:', error);
    return null;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const formatScheduleTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const isTimeConflict = (
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean => {
  return (start1 < end2 && end1 > start2);
};

export const validateTimeRange = (start: number, end: number): boolean => {
  const now = Math.floor(Date.now() / 1000);
  const minDuration = 3600; // 1 hour
  const maxDuration = 86400; // 24 hours
  const duration = end - start;

  return (
    start >= now &&
    end > start &&
    duration >= minDuration &&
    duration <= maxDuration
  );
};
