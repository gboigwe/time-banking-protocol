// Reputation System Contract Integration
// Clarity 4 contract with time-weighted decay

import {
  standardPrincipalCV,
  intCV,
  uintCV,
  stringAsciiCV,
  ClarityValue,
  cvToValue,
} from '@stacks/transactions';
import {
  UserReputation,
  CategoryReputation,
  Endorsement,
  ReputationStats,
  ContractCallResult,
} from '@/types/contracts';
import {
  getContractAddress,
  CONTRACT_NAMES,
  FUNCTION_NAMES,
} from '../contractConfig';
import { callReadOnlyFunction, makeContractCall } from '../stacksApi';

const contractName = 'reputationSystem';

export const initializeReputation = async (
  userAddress: string
): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.reputationSystem.initializeReputation,
      functionArgs: [standardPrincipalCV(userAddress)],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const endorseUser = async (
  endorsedUser: string,
  category: string,
  message: string
): Promise<ContractCallResult<number>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.reputationSystem.endorseUser,
      functionArgs: [
        standardPrincipalCV(endorsedUser),
        stringAsciiCV(category),
        stringAsciiCV(message),
      ],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getUserReputation = async (
  userAddress: string
): Promise<UserReputation | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.reputationSystem.getUserReputation,
      functionArgs: [standardPrincipalCV(userAddress)],
    });

    if (!result || result.type === 'none') return null;

    const value = cvToValue(result);
    return {
      user: userAddress,
      totalScore: parseInt(value.value['total-score'].value),
      positiveEndorsements: parseInt(value.value['positive-endorsements'].value),
      negativeFlags: parseInt(value.value['negative-flags'].value),
      completedExchanges: parseInt(value.value['completed-exchanges'].value),
      averageRating: parseInt(value.value['average-rating'].value),
      lastUpdated: parseInt(value.value['last-updated'].value),
      lastDecayApplied: parseInt(value.value['last-decay-applied'].value),
    };
  } catch (error) {
    console.error('Error fetching user reputation:', error);
    return null;
  }
};

export const getReputationStats = async (): Promise<ReputationStats | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.reputationSystem.getReputationStats,
      functionArgs: [],
    });

    const value = cvToValue(result);
    return {
      totalEndorsements: parseInt(value.value['total-endorsements'].value),
      totalBadgesAwarded: parseInt(value.value['total-badges-awarded'].value),
      averageReputationScore: parseInt(value.value['average-reputation-score'].value),
      nextEndorsementId: parseInt(value.value['next-endorsement-id'].value),
      nextBadgeId: parseInt(value.value['next-badge-id'].value),
    };
  } catch (error) {
    console.error('Error fetching reputation stats:', error);
    return null;
  }
};
