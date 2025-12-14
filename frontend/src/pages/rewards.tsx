// Rewards Page - Rewards Distributor Contract Integration
// Clarity 4 with periodic reward cycles using stacks-block-time

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GiftIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { useWallet } from '@/contexts/WalletContext';
import { useRewards } from '@/hooks/useContracts';
import Link from 'next/link';

const Rewards: React.FC = () => {
  const { isConnected, address } = useWallet();
  const {
    isLoading,
    error,
    claimReward,
    contributeToPool,
    loadPeriodInfo,
    loadUserReward,
    loadRewardsStats,
  } = useRewards();

  const [rewardsStats, setRewardsStats] = useState<any>(null);
  const [currentPeriod, setCurrentPeriod] = useState<any>(null);
  const [userReward, setUserReward] = useState<any>(null);
  const [contributeAmount, setContributeAmount] = useState(10);

  useEffect(() => {
    if (isConnected && address) {
      loadStats();
    }
  }, [isConnected, address]);

  const loadStats = async () => {
    const stats = await loadRewardsStats();
    setRewardsStats(stats);

    if (stats?.currentPeriodId) {
      const period = await loadPeriodInfo(stats.currentPeriodId);
      setCurrentPeriod(period);

      const reward = await loadUserReward(address || '', stats.currentPeriodId);
      setUserReward(reward);
    }
  };

  const handleClaimReward = async () => {
    if (!rewardsStats?.currentPeriodId) return;

    const result = await claimReward(rewardsStats.currentPeriodId);

    if (result.success) {
      alert(`Reward claimed successfully! TX: ${result.txId}`);
      loadStats();
    } else {
      alert(`Failed to claim reward: ${result.error}`);
    }
  };

  const handleContribute = async () => {
    const result = await contributeToPool(contributeAmount);

    if (result.success) {
      alert(`Contributed ${contributeAmount} credits successfully! TX: ${result.txId}`);
      loadStats();
    } else {
      alert(`Failed to contribute: ${result.error}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-neutral-600 mb-8">
            Please connect your wallet to view rewards
          </p>
          <Link href="/" className="btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-neutral-900">Rewards</h1>
        <p className="text-neutral-600 mt-1">
          Earn and claim rewards from periodic distribution cycles
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="card hover-lift"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Reward Pool</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {rewardsStats?.totalRewardPool || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-primary-700" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card hover-lift"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Distributed</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {rewardsStats?.totalDistributed || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center">
                <GiftIcon className="w-6 h-6 text-secondary-700" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card hover-lift"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Your Reward</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {userReward?.calculatedReward || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-accent-700" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Claim Rewards Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-neutral-900">Claim Your Rewards</h2>
        </div>
        <div className="card-body">
          {userReward && !userReward.claimed ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-neutral-600">Available Reward</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {userReward.calculatedReward} credits
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600">Reward Tier</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {userReward.rewardTier}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClaimReward}
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Claiming...' : 'Claim Reward'}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircleIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">
                {userReward?.claimed
                  ? 'You have already claimed your reward for this period'
                  : 'No rewards available to claim'}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Contribute to Pool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-neutral-900">Contribute to Reward Pool</h2>
        </div>
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={contributeAmount}
              onChange={(e) => setContributeAmount(Number(e.target.value))}
              className="input flex-1"
              min={1}
              placeholder="Amount to contribute"
            />
            <button
              onClick={handleContribute}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Contributing...' : 'Contribute'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-error-50 text-error-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Rewards;
