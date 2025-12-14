// Escrow Page - Escrow Manager Contract Integration
// Clarity 4 with time-locked escrow using stacks-block-time

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  LockClosedIcon,
  LockOpenIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useWallet } from '@/contexts/WalletContext';
import { useEscrow } from '@/hooks/useContracts';
import Link from 'next/link';

const Escrow: React.FC = () => {
  const { isConnected, address } = useWallet();
  const {
    isLoading,
    error,
    createEscrow,
    releaseEscrow,
    raiseDispute,
    loadEscrowStats,
  } = useEscrow();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [escrowStats, setEscrowStats] = useState<any>(null);

  // Form states
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState(10);
  const [duration, setDuration] = useState(86400); // 1 day in seconds
  const [exchangeId, setExchangeId] = useState('');

  useEffect(() => {
    if (isConnected && address) {
      loadStats();
    }
  }, [isConnected, address]);

  const loadStats = async () => {
    const stats = await loadEscrowStats();
    setEscrowStats(stats);
  };

  const handleCreateEscrow = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createEscrow(
      beneficiary,
      amount,
      duration,
      exchangeId ? Number(exchangeId) : undefined
    );

    if (result.success) {
      alert(`Escrow created successfully! TX: ${result.txId}`);
      setShowCreateModal(false);
      resetForm();
      loadStats();
    } else {
      alert(`Failed to create escrow: ${result.error}`);
    }
  };

  const resetForm = () => {
    setBeneficiary('');
    setAmount(10);
    setDuration(86400);
    setExchangeId('');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-neutral-600 mb-8">
            Please connect your wallet to manage escrow
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
          <h1 className="text-3xl font-bold text-neutral-900">Escrow Management</h1>
          <p className="text-neutral-600 mt-1">
            Create and manage time-locked escrows with Clarity 4
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Escrow</span>
        </button>
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
                <p className="text-sm font-medium text-neutral-600">Total Escrows</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {escrowStats?.totalEscrows || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <LockClosedIcon className="w-6 h-6 text-primary-700" />
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
                <p className="text-sm font-medium text-neutral-600">Active</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {escrowStats?.activeEscrows || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-secondary-700" />
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
                <p className="text-sm font-medium text-neutral-600">Released</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {escrowStats?.releasedEscrows || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
                <LockOpenIcon className="w-6 h-6 text-accent-700" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Escrow Modal */}
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
                <h2 className="text-2xl font-bold text-neutral-900">Create Escrow</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateEscrow} className="space-y-4">
                <div>
                  <label className="label">Beneficiary Address</label>
                  <input
                    type="text"
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    className="input"
                    placeholder="SP..."
                    required
                  />
                </div>

                <div>
                  <label className="label">Amount (Time Credits)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="input"
                    min={1}
                    required
                  />
                </div>

                <div>
                  <label className="label">Duration (seconds)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="input"
                    min={3600}
                    placeholder="86400 (1 day)"
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Minimum: 3600s (1 hour)
                  </p>
                </div>

                <div>
                  <label className="label">Exchange ID (Optional)</label>
                  <input
                    type="number"
                    value={exchangeId}
                    onChange={(e) => setExchangeId(e.target.value)}
                    className="input"
                    placeholder="Leave empty if not linked to exchange"
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
                    {isLoading ? 'Creating...' : 'Create Escrow'}
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

export default Escrow;
