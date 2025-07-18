import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  StarIcon,
  UserIcon,
  CheckBadgeIcon,
  MapPinIcon,
  FunnelIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { UserProfile, SearchFilters, FilterOptions } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { useWallet } from '@/contexts/WalletContext';
import { formatPrincipal } from '@/lib/stacks';

const Marketplace: React.FC = () => {
  const { state } = useApp();
  const { isConnected } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'hours' | 'reputation'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [providers, setProviders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const skillCategories = [
    'Web Development',
    'Graphic Design',
    'Writing',
    'Marketing',
    'Programming',
    'Photography',
    'Teaching',
    'Consulting',
    'Data Analysis',
    'Translation',
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Available Now' },
    { value: 'busy', label: 'Busy This Week' },
    { value: 'offline', label: 'Offline' },
  ];

  useEffect(() => {
    // Simulate loading providers data
    const loadProviders = async () => {
      setLoading(true);
      
      // Mock data - in a real app, this would come from the blockchain
      const mockProviders: UserProfile[] = [
        {
          principal: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          displayName: 'Alice Johnson',
          bio: 'Full-stack developer with 5+ years experience in React and Node.js',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=alice',
          skills: [
            { skill: 'Web Development', verified: true, verifiedBy: 'expert1', rating: 5 },
            { skill: 'React', verified: true, verifiedBy: 'expert2', rating: 4 },
          ],
          user: {
            principal: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
            joinedAt: Date.now() - 2592000000,
            totalHoursGiven: 45,
            totalHoursReceived: 38,
            reputationScore: 94,
            isActive: true,
            timeBalance: 15,
          },
        },
        {
          principal: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
          displayName: 'Bob Smith',
          bio: 'Creative designer specializing in brand identity and user experience',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=bob',
          skills: [
            { skill: 'Graphic Design', verified: true, verifiedBy: 'expert3', rating: 5 },
            { skill: 'Photography', verified: false, rating: 3 },
          ],
          user: {
            principal: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
            joinedAt: Date.now() - 1296000000,
            totalHoursGiven: 32,
            totalHoursReceived: 28,
            reputationScore: 87,
            isActive: true,
            timeBalance: 8,
          },
        },
        {
          principal: 'ST3A5HQKQM3T3BV1MCZ45S6Q729V8355BQ0W0NP2V',
          displayName: 'Carol Davis',
          bio: 'Technical writer and content strategist with expertise in blockchain',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=carol',
          skills: [
            { skill: 'Writing', verified: true, verifiedBy: 'expert4', rating: 5 },
            { skill: 'Marketing', verified: true, verifiedBy: 'expert5', rating: 4 },
          ],
          user: {
            principal: 'ST3A5HQKQM3T3BV1MCZ45S6Q729V8355BQ0W0NP2V',
            joinedAt: Date.now() - 3888000000,
            totalHoursGiven: 67,
            totalHoursReceived: 52,
            reputationScore: 96,
            isActive: true,
            timeBalance: 22,
          },
        },
      ];

      // Filter providers based on search and filters
      let filteredProviders = mockProviders;

      if (searchQuery) {
        filteredProviders = filteredProviders.filter(provider =>
          provider.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.skills.some(skill => skill.skill.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      if (filters.skill) {
        filteredProviders = filteredProviders.filter(provider =>
          provider.skills.some(skill => skill.skill === filters.skill)
        );
      }

      if (filters.minRating) {
        filteredProviders = filteredProviders.filter(provider =>
          provider.user.reputationScore >= filters.minRating!
        );
      }

      // Sort providers
      filteredProviders.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.user.reputationScore - a.user.reputationScore;
          case 'hours':
            return b.user.totalHoursGiven - a.user.totalHoursGiven;
          case 'reputation':
            return b.user.reputationScore - a.user.reputationScore;
          case 'recent':
          default:
            return b.user.joinedAt - a.user.joinedAt;
        }
      });

      setProviders(filteredProviders);
      setLoading(false);
    };

    loadProviders();
  }, [searchQuery, filters, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in useEffect
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setSortBy('recent');
  };

  const getAvatarUrl = (seed: string) => {
    return `https://api.dicebear.com/7.x/avatars/svg?seed=${seed}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Marketplace</h1>
          <p className="text-neutral-600 mt-1">
            Discover skilled professionals and find the expertise you need
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <span className="text-sm text-neutral-500">
            {providers.length} provider{providers.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="card"
      >
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search skills, names, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </form>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-neutral-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input w-auto"
              >
                <option value="recent">Recent</option>
                <option value="rating">Rating</option>
                <option value="hours">Hours Given</option>
                <option value="reputation">Reputation</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center space-x-2"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-neutral-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Skill Filter */}
                <div>
                  <label className="label">Skill Category</label>
                  <select
                    value={filters.skill || ''}
                    onChange={(e) => setFilters({ ...filters, skill: e.target.value || undefined })}
                    className="input"
                  >
                    <option value="">All Skills</option>
                    {skillCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="label">Minimum Rating</label>
                  <select
                    value={filters.minRating || ''}
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
                    className="input"
                  >
                    <option value="">Any Rating</option>
                    <option value="90">90+ (Excellent)</option>
                    <option value="80">80+ (Great)</option>
                    <option value="70">70+ (Good)</option>
                    <option value="60">60+ (Fair)</option>
                  </select>
                </div>

                {/* Hours Filter */}
                <div>
                  <label className="label">Maximum Hours</label>
                  <select
                    value={filters.maxHours || ''}
                    onChange={(e) => setFilters({ ...filters, maxHours: e.target.value ? Number(e.target.value) : undefined })}
                    className="input"
                  >
                    <option value="">Any Duration</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="4">4 hours</option>
                    <option value="8">8 hours</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={clearFilters}
                  className="btn-ghost text-sm"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn-primary btn-sm"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Providers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card">
              <div className="card-body animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-200 rounded"></div>
                  <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.principal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card hover-lift"
            >
              <div className="card-body">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center overflow-hidden">
                      {provider.avatar ? (
                        <img
                          src={provider.avatar}
                          alt={provider.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 flex items-center space-x-1">
                        <span>{provider.displayName}</span>
                        {provider.skills.some(skill => skill.verified) && (
                          <CheckBadgeIcon className="w-4 h-4 text-primary-500" />
                        )}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {formatPrincipal(provider.principal)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-warning-500 fill-current" />
                    <span className="text-sm font-medium text-neutral-700">
                      {provider.user.reputationScore}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                  {provider.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className={`badge ${skill.verified ? 'badge-primary' : 'badge-neutral'} text-xs`}
                    >
                      {skill.skill}
                      {skill.verified && (
                        <CheckBadgeIcon className="w-3 h-3 ml-1" />
                      )}
                    </span>
                  ))}
                  {provider.skills.length > 3 && (
                    <span className="badge badge-neutral text-xs">
                      +{provider.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{provider.user.totalHoursGiven} hrs given</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {Math.floor((Date.now() - provider.user.joinedAt) / 86400000)} days
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    className="btn-primary flex-1"
                    disabled={!isConnected}
                  >
                    Request Service
                  </button>
                  <button className="btn-outline flex items-center justify-center w-10 h-10">
                    <ChartBarIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && providers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center py-12"
        >
          <MagnifyingGlassIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No providers found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your search criteria or clearing filters
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Marketplace;
