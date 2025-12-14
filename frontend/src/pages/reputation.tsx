// Reputation Page - Reputation System Contract Integration
// Clarity 4 with time-weighted decay

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  StarIcon,
  UserIcon,
  TrophyIcon,
  ChartBarIcon,
  HeartIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';
import { useWallet } from '@/contexts/WalletContext';
import { useReputation } from '@/hooks/useContracts';
import Link from 'next/link';

const Reputation: React.FC = () => {
  const { isConnected, address } = useWallet();
  const {
    isLoading,
    error,
    endorseUser,
    loadUserReputation,
    loadReputationStats,
  } = useReputation();

  const [userReputation, setUserReputation] = useState<any>(null);
  const [reputationStats, setReputationStats] = useState<any>(null);
  const [endorsedUser, setEndorsedUser] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const categories = [
    'technical',
    'communication',
    'reliability',
    'quality',
    'professionalism',
  ];

  useEffect(() => {
    if (isConnected && address) {
      loadStats();
    }
  }, [isConnected, address]);

  const loadStats = async () => {
    const [userRep, stats] = await Promise.all([
      loadUserReputation(address || ''),
      loadReputationStats(),
    ]);
    setUserReputation(userRep);
    setReputationStats(stats);
  };

  const handleEndorseUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await endorseUser(endorsedUser, category, message);

    if (result.success) {
      alert(`User endorsed successfully! TX: ${result.txId}`);
      resetForm();
      loadStats();
    } else {
      alert(`Failed to endorse user: ${result.error}`);
    }
  };

  const resetForm = () => {
    setEndorsedUser('');
    setCategory('');
    setMessage('');
  };

  const getReputationLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-secondary-600' };
    if (score >= 75) return { label: 'Great', color: 'text-primary-600' };
    if (score >= 60) return { label: 'Good', color: 'text-accent-600' };
    if (score >= 40) return { label: 'Fair', color: 'text-warning-600' };
    return { label: 'Needs Improvement', color: 'text-error-600' };
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-neutral-600 mb-8">
            Please connect your wallet to view reputation
          </p>
          <Link href="/" className="btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const repLevel = userReputation ? getReputationLevel(userReputation.totalScore) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-neutral-900">Reputation System</h1>
        <p className="text-neutral-600 mt-1">
          View and manage reputation with time-weighted decay
        </p>
      </motion.div>

      {/* User Reputation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
      >
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Your Reputation Score</p>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-5xl font-bold">{userReputation?.totalScore || 0}</p>
                {repLevel && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                    {repLevel.label}
                  </span>
                )}
              </div>
            </div>
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <TrophyIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card hover-lift"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Endorsements</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {userReputation?.positiveEndorsements || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-secondary-700" />
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
                <p className="text-sm font-medium text-neutral-600">Completed</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {userReputation?.completedExchanges || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-primary-700" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="card hover-lift"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Avg Rating</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {userReputation?.averageRating || 0}/5
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-accent-700" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="card hover-lift"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Flags</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {userReputation?.negativeFlags || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning-50 flex items-center justify-center">
                <FlagIcon className="w-6 h-6 text-warning-700" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Endorse User Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-neutral-900">Endorse a User</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleEndorseUser} className="space-y-4">
            <div>
              <label className="label">User Address</label>
              <input
                type="text"
                value={endorsedUser}
                onChange={(e) => setEndorsedUser(e.target.value)}
                className="input"
                placeholder="SP..."
                required
              />
            </div>

            <div>
              <label className="label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input"
                rows={3}
                placeholder="Write your endorsement message..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Endorsing...' : 'Endorse User'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-error-50 text-error-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </motion.div>

      {/* Platform Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-neutral-900">Platform Statistics</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">
                {reputationStats?.totalEndorsements || 0}
              </p>
              <p className="text-sm text-neutral-600 mt-1">Total Endorsements</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary-600">
                {reputationStats?.totalBadgesAwarded || 0}
              </p>
              <p className="text-sm text-neutral-600 mt-1">Badges Awarded</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-600">
                {reputationStats?.averageReputationScore || 0}
              </p>
              <p className="text-sm text-neutral-600 mt-1">Average Reputation</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reputation;
