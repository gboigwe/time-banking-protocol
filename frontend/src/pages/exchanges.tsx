// Exchanges Page - Exchange Manager Contract Integration
// Clarity 4 with stacks-block-time scheduling

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useWallet } from '@/contexts/WalletContext';
import { useExchangeManager } from '@/hooks/useExchangeManager';
import Link from 'next/link';

const Exchanges: React.FC = () => {
  const { isConnected, address } = useWallet();
  const {
    isLoading,
    error,
    createExchange,
    acceptExchange,
    confirmCompletion,
    cancelExchange,
    loadExchangeStats,
    validateTimeRange,
  } = useExchangeManager();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [exchangeStats, setExchangeStats] = useState<any>(null);

  // Form states
  const [provider, setProvider] = useState('');
  const [skillName, setSkillName] = useState('');
  const [hoursRequested, setHoursRequested] = useState(1);
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');

  useEffect(() => {
    if (isConnected && address) {
      loadStats();
    }
  }, [isConnected, address]);

  const loadStats = async () => {
    const stats = await loadExchangeStats();
    setExchangeStats(stats);
  };

  const handleCreateExchange = async (e: React.FormEvent) => {
    e.preventDefault();

    const startTimestamp = Math.floor(new Date(scheduledStart).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(scheduledEnd).getTime() / 1000);

    if (!validateTimeRange(startTimestamp, endTimestamp)) {
      alert('Invalid time range. Please check start/end times and duration (1-24 hours).');
      return;
    }

    const result = await createExchange(
      provider,
      skillName,
      hoursRequested,
      startTimestamp,
      endTimestamp
    );

    if (result.success) {
      alert(`Exchange created successfully! TX: ${result.txId}`);
      setShowCreateModal(false);
      resetForm();
      loadStats();
    } else {
      alert(`Failed to create exchange: ${result.error}`);
    }
  };

  const resetForm = () => {
    setProvider('');
    setSkillName('');
    setHoursRequested(1);
    setScheduledStart('');
    setScheduledEnd('');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-neutral-600 mb-8">
            Please connect your wallet to manage exchanges
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
          <h1 className="text-3xl font-bold text-neutral-900">Service Exchanges</h1>
          <p className="text-neutral-600 mt-1">
            Create and manage service exchanges with stacks-block-time scheduling
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Exchange</span>
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
                <p className="text-sm font-medium text-neutral-600">Total Exchanges</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {exchangeStats?.totalExchanges || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <ArrowPathIcon className="w-6 h-6 text-primary-700" />
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
                <p className="text-sm font-medium text-neutral-600">Completed</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {exchangeStats?.completedExchanges || 0}
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
                <p className="text-sm font-medium text-neutral-600">Active</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {exchangeStats?.activeExchanges || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-accent-700" />
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
                <p className="text-sm font-medium text-neutral-600">Total Hours</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {exchangeStats?.totalHoursExchanged || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning-50 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-warning-700" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Exchange Modal */}
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
                <h2 className="text-2xl font-bold text-neutral-900">Create Exchange</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateExchange} className="space-y-4">
                <div>
                  <label className="label">Provider Address</label>
                  <input
                    type="text"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="input"
                    placeholder="SP..."
                    required
                  />
                </div>

                <div>
                  <label className="label">Skill Name</label>
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="input"
                    placeholder="e.g., Web Development"
                    required
                  />
                </div>

                <div>
                  <label className="label">Hours Requested</label>
                  <input
                    type="number"
                    value={hoursRequested}
                    onChange={(e) => setHoursRequested(Number(e.target.value))}
                    className="input"
                    min={1}
                    max={24}
                    required
                  />
                </div>

                <div>
                  <label className="label">Scheduled Start</label>
                  <input
                    type="datetime-local"
                    value={scheduledStart}
                    onChange={(e) => setScheduledStart(e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Scheduled End</label>
                  <input
                    type="datetime-local"
                    value={scheduledEnd}
                    onChange={(e) => setScheduledEnd(e.target.value)}
                    className="input"
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
                    {isLoading ? 'Creating...' : 'Create Exchange'}
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

export default Exchanges;
