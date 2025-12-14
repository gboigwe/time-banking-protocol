// Skills Page - Skill Registry Contract Integration
// Clarity 4 with contract-hash? verification

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useWallet } from '@/contexts/WalletContext';
import { useSkillRegistry } from '@/hooks/useSkillRegistry';
import { SkillCategory } from '@/types/contracts';
import Link from 'next/link';

const Skills: React.FC = () => {
  const { isConnected, address } = useWallet();
  const {
    isLoading,
    error,
    registerSkill,
    verifySkill,
    loadSkillDetails,
    loadSkillStats,
  } = useSkillRegistry();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [skillStats, setSkillStats] = useState<any>(null);

  // Form states
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('technology');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState(1);
  const [endorsement, setEndorsement] = useState('');

  const categories: SkillCategory[] = [
    'technology',
    'education',
    'healthcare',
    'creative',
    'professional',
    'trades',
    'domestic',
    'community',
  ];

  useEffect(() => {
    if (isConnected && address) {
      loadStats();
    }
  }, [isConnected, address]);

  const loadStats = async () => {
    const stats = await loadSkillStats();
    setSkillStats(stats);
  };

  const handleRegisterSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await registerSkill(skillName, category, description, hourlyRate);

    if (result.success) {
      alert(`Skill registered successfully! TX: ${result.txId}`);
      setShowRegisterModal(false);
      resetForm();
      loadStats();
    } else {
      alert(`Failed to register skill: ${result.error}`);
    }
  };

  const handleVerifySkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSkill) return;

    const result = await verifySkill(address || '', selectedSkill, endorsement);

    if (result.success) {
      alert(`Skill verified successfully! TX: ${result.txId}`);
      setShowVerifyModal(false);
      setEndorsement('');
    } else {
      alert(`Failed to verify skill: ${result.error}`);
    }
  };

  const resetForm = () => {
    setSkillName('');
    setCategory('technology');
    setDescription('');
    setHourlyRate(1);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-neutral-600 mb-8">
            Please connect your wallet to manage your skills
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
          <h1 className="text-3xl font-bold text-neutral-900">Your Skills</h1>
          <p className="text-neutral-600 mt-1">
            Manage and verify your skills using Clarity 4 contract-hash? verification
          </p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Register Skill</span>
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
                <p className="text-sm font-medium text-neutral-600">Total Skills</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {skillStats?.totalSkills || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-primary-700" />
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
                <p className="text-sm font-medium text-neutral-600">Verified Skills</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {skillStats?.verifiedSkills || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center">
                <CheckBadgeIcon className="w-6 h-6 text-secondary-700" />
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
                <p className="text-sm font-medium text-neutral-600">Verifications</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {skillStats?.totalVerifications || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-accent-700" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Register Skill Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRegisterModal(false)}
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
                <h2 className="text-2xl font-bold text-neutral-900">Register Skill</h2>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleRegisterSkill} className="space-y-4">
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
                  <label className="label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SkillCategory)}
                    className="input"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                    rows={3}
                    placeholder="Describe your skill and experience..."
                    required
                  />
                </div>

                <div>
                  <label className="label">Hourly Rate (Time Credits)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="input"
                    min={1}
                    required
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex-1"
                  >
                    {isLoading ? 'Registering...' : 'Register'}
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

export default Skills;
