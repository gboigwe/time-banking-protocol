// Governance Page - Governance Contract Integration
// Clarity 4 with proposal timelock and voting periods

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useWallet } from '@/contexts/WalletContext';
import { useGovernance } from '@/hooks/useContracts';
import Link from 'next/link';

const Governance: React.FC = () => {
  const { isConnected, address } = useWallet();
  const {
    isLoading,
    error,
    createProposal,
    castVote,
    executeProposal,
    loadGovernanceStats,
  } = useGovernance();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [governanceStats, setGovernanceStats] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proposalType, setProposalType] = useState('parameter-change');

  const proposalTypes = [
    { value: 'parameter-change', label: 'Parameter Change' },
    { value: 'feature-addition', label: 'Feature Addition' },
    { value: 'emergency-action', label: 'Emergency Action' },
    { value: 'treasury-allocation', label: 'Treasury Allocation' },
  ];

  useEffect(() => {
    if (isConnected && address) {
      loadStats();
    }
  }, [isConnected, address]);

  const loadStats = async () => {
    const stats = await loadGovernanceStats();
    setGovernanceStats(stats);
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createProposal(title, description, proposalType);

    if (result.success) {
      alert(`Proposal created successfully! TX: ${result.txId}`);
      setShowCreateModal(false);
      resetForm();
      loadStats();
    } else {
      alert(`Failed to create proposal: ${result.error}`);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProposalType('parameter-change');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-neutral-600 mb-8">
            Please connect your wallet to participate in governance
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Governance</h1>
          <p className="text-neutral-600 mt-1">
            Create and vote on proposals with Clarity 4 timelock mechanism
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Proposal</span>
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="card hover-lift"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Proposals</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {governanceStats?.totalProposals || 0}
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
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card hover-lift"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Passed</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {governanceStats?.totalPassedProposals || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-secondary-700" />
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
                <p className="text-sm font-medium text-neutral-600">Active Voters</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {governanceStats?.totalActiveVoters || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
                <HandThumbUpIcon className="w-6 h-6 text-accent-700" />
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
                <p className="text-sm font-medium text-neutral-600">Voting Period</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {(governanceStats?.votingPeriod || 0) / 144} days
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning-50 flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-warning-700" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Proposal Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">Create Proposal</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateProposal} className="space-y-4">
                <div>
                  <label className="label">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                    placeholder="Proposal title..."
                    required
                  />
                </div>

                <div>
                  <label className="label">Proposal Type</label>
                  <select
                    value={proposalType}
                    onChange={(e) => setProposalType(e.target.value)}
                    className="input"
                    required
                  >
                    {proposalTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input"
                    rows={4}
                    placeholder="Describe your proposal in detail..."
                    required
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex-1"
                  >
                    {isLoading ? 'Creating...' : 'Create Proposal'}
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-error-50 text-error-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Governance;
