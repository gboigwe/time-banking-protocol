// Rewards Distributor Contract Integration
// Clarity 4 contract with periodic reward cycles

import {
  standardPrincipalCV,
  uintCV,
  ClarityValue,
  cvToValue,
} from '@stacks/transactions';
import {
  RewardPeriod,
  UserReward,
  RewardsStats,
  ContractCallResult,
} from '@/types/contracts';
import {
  getContractAddress,
  CONTRACT_NAMES,
  FUNCTION_NAMES,
} from '../contractConfig';
import { callReadOnlyFunction, makeContractCall } from '../stacksApi';

const contractName = 'rewardsDistributor';

export const claimReward = async (
  periodId: number
): Promise<ContractCallResult<number>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.rewardsDistributor.claimReward,
      functionArgs: [uintCV(periodId)],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const contributeToPool = async (
  amount: number
): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.rewardsDistributor.contributeToPool,
      functionArgs: [uintCV(amount)],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPeriodInfo = async (
  periodId: number
): Promise<RewardPeriod | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.rewardsDistributor.getPeriodInfo,
      functionArgs: [uintCV(periodId)],
    });

    if (!result || result.type === 'none') return null;

    const value = cvToValue(result);
    return {
      periodId,
      startTime: parseInt(value.value['start-time'].value),
      endTime: parseInt(value.value['end-time'].value),
      totalPool: parseInt(value.value['total-pool'].value),
      distributedAmount: parseInt(value.value['distributed-amount'].value),
      totalParticipants: parseInt(value.value['total-participants'].value),
      isFinalized: value.value['is-finalized'].value,
    };
  } catch (error) {
    console.error('Error fetching period info:', error);
    return null;
  }
};

export const getUserReward = async (
  userAddress: string,
  periodId: number
): Promise<UserReward | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.rewardsDistributor.getUserReward,
      functionArgs: [standardPrincipalCV(userAddress), uintCV(periodId)],
    });

    if (!result || result.type === 'none') return null;

    const value = cvToValue(result);
    return {
      user: userAddress,
      periodId,
      activityScore: parseInt(value.value['activity-score'].value),
      rewardTier: value.value['reward-tier'].value,
      calculatedReward: parseInt(value.value['calculated-reward'].value),
      claimed: value.value.claimed.value,
      claimedAt: value.value['claimed-at'].value
        ? parseInt(value.value['claimed-at'].value.value)
        : undefined,
    };
  } catch (error) {
    console.error('Error fetching user reward:', error);
    return null;
  }
};

export const getRewardsStats = async (): Promise<RewardsStats | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.rewardsDistributor.getRewardsStats,
      functionArgs: [],
    });

    const value = cvToValue(result);
    return {
      currentPeriodId: parseInt(value.value['current-period-id'].value),
      totalRewardPool: parseInt(value.value['total-reward-pool'].value),
      totalDistributed: parseInt(value.value['total-distributed'].value),
      rewardsEnabled: value.value['rewards-enabled'].value,
      rewardPeriod: parseInt(value.value['reward-period'].value),
      minActivityScore: parseInt(value.value['min-activity-score'].value),
      baseRewardAmount: parseInt(value.value['base-reward-amount'].value),
    };
  } catch (error) {
    console.error('Error fetching rewards stats:', error);
    return null;
  }
};
