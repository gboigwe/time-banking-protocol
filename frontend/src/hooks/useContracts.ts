// Centralized Hook for All Clarity 4 Contracts
// Time Banking Protocol - Complete Integration

import { useState } from 'react';
import {
  getUserReputation,
  endorseUser,
  getReputationStats,
} from '@/lib/contracts/reputationSystem';
import {
  createEscrow,
  releaseEscrow,
  raiseDispute,
  getEscrowDetails,
  getEscrowStats,
} from '@/lib/contracts/escrowManager';
import {
  createProposal,
  castVote,
  executeProposal,
  getProposal,
  getGovernanceStats,
} from '@/lib/contracts/governance';
import {
  claimReward,
  contributeToPool,
  getPeriodInfo,
  getUserReward,
  getRewardsStats,
} from '@/lib/contracts/rewardsDistributor';
import {
  UserReputation,
  ReputationStats,
  CreditEscrow,
  EscrowStats,
  GovernanceProposal,
  GovernanceStats,
  RewardPeriod,
  UserReward,
  RewardsStats,
} from '@/types/contracts';

export const useReputation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEndorseUser = async (
    endorsedUser: string,
    category: string,
    message: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await endorseUser(endorsedUser, category, message);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to endorse user');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to endorse user';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserReputation = async (
    userAddress: string
  ): Promise<UserReputation | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const reputation = await getUserReputation(userAddress);
      return reputation;
    } catch (err: any) {
      setError(err.message || 'Failed to load reputation');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadReputationStats = async (): Promise<ReputationStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = await getReputationStats();
      return stats;
    } catch (err: any) {
      setError(err.message || 'Failed to load reputation stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    endorseUser: handleEndorseUser,
    loadUserReputation,
    loadReputationStats,
  };
};

export const useEscrow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateEscrow = async (
    beneficiary: string,
    amount: number,
    duration: number,
    exchangeId?: number
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createEscrow(beneficiary, amount, duration, exchangeId);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to create escrow');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create escrow';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleReleaseEscrow = async (escrowId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await releaseEscrow(escrowId);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to release escrow');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to release escrow';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleRaiseDispute = async (escrowId: number, reason: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await raiseDispute(escrowId, reason);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to raise dispute');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to raise dispute';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const loadEscrowDetails = async (
    escrowId: number
  ): Promise<CreditEscrow | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const escrow = await getEscrowDetails(escrowId);
      return escrow;
    } catch (err: any) {
      setError(err.message || 'Failed to load escrow details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadEscrowStats = async (): Promise<EscrowStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = await getEscrowStats();
      return stats;
    } catch (err: any) {
      setError(err.message || 'Failed to load escrow stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createEscrow: handleCreateEscrow,
    releaseEscrow: handleReleaseEscrow,
    raiseDispute: handleRaiseDispute,
    loadEscrowDetails,
    loadEscrowStats,
  };
};

export const useGovernance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProposal = async (
    title: string,
    description: string,
    proposalType: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createProposal(title, description, proposalType);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to create proposal');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create proposal';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleCastVote = async (proposalId: number, vote: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await castVote(proposalId, vote);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to cast vote');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to cast vote';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteProposal = async (proposalId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await executeProposal(proposalId);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to execute proposal');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to execute proposal';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const loadProposal = async (
    proposalId: number
  ): Promise<GovernanceProposal | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const proposal = await getProposal(proposalId);
      return proposal;
    } catch (err: any) {
      setError(err.message || 'Failed to load proposal');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadGovernanceStats = async (): Promise<GovernanceStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = await getGovernanceStats();
      return stats;
    } catch (err: any) {
      setError(err.message || 'Failed to load governance stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createProposal: handleCreateProposal,
    castVote: handleCastVote,
    executeProposal: handleExecuteProposal,
    loadProposal,
    loadGovernanceStats,
  };
};

export const useRewards = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaimReward = async (periodId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await claimReward(periodId);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to claim reward');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to claim reward';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleContributeToPool = async (amount: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await contributeToPool(amount);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to contribute to pool');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to contribute to pool';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const loadPeriodInfo = async (
    periodId: number
  ): Promise<RewardPeriod | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const period = await getPeriodInfo(periodId);
      return period;
    } catch (err: any) {
      setError(err.message || 'Failed to load period info');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserReward = async (
    userAddress: string,
    periodId: number
  ): Promise<UserReward | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const reward = await getUserReward(userAddress, periodId);
      return reward;
    } catch (err: any) {
      setError(err.message || 'Failed to load user reward');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadRewardsStats = async (): Promise<RewardsStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = await getRewardsStats();
      return stats;
    } catch (err: any) {
      setError(err.message || 'Failed to load rewards stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    claimReward: handleClaimReward,
    contributeToPool: handleContributeToPool,
    loadPeriodInfo,
    loadUserReward,
    loadRewardsStats,
  };
};
