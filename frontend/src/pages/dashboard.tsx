import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import { useWallet } from '@/contexts/WalletContext';
import { TimeExchange } from '@/types';
import Link from 'next/link';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { isConnected } = useWallet();
  const [recentExchanges, setRecentExchanges] = useState<TimeExchange[]>([]);

  useEffect(() => {
    if (isConnected) {
      // Load recent exchanges - for now using mock data
      setRecentExchanges([
        {
          id: 1,
          provider: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          receiver: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
          skill: 'Web Development',
          hours: 2,
          status: 'completed',
          createdAt: Date.now() - 86400000,
          completedAt: Date.now() - 3600000,
        },
        {
          id: 2,
          provider: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
          receiver: state.user?.principal || '',
          skill: 'Graphic Design',
          hours: 3,
          status: 'active',
          createdAt: Date.now() - 43200000,
        },
      ]);
    }
  }, [isConnected, state.user]);

  const quickStats = [
    {
      label: 'Time Balance',
      value: `${state.user?.user.timeBalance || 0} hrs`,
      icon: ClockIcon,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-700',
    },
    {
      label: 'Hours Given',
      value: state.user?.user.totalHoursGiven || 0,
      icon: ArrowTrendingUpIcon,
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50',
      textColor: 'text-accent-700',
    },
    {
      label: 'Hours Received',
      value: state.user?.user.totalHoursReceived || 0,
      icon: CurrencyDollarIcon,
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50',
      textColor: 'text-secondary-700',
    },
    {
      label: 'Reputation',
      value: state.user?.user.reputationScore || 0,
      icon: TrophyIcon,
      color: 'from-warning-500 to-warning-600',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-700',
    },
  ];

  const quickActions = [
    {
      title: 'Create Exchange',
      description: 'Offer your skills to others',
      icon: PlusIcon,
      href: '/exchanges/create',
      color: 'from-primary-500 to-primary-600',
    },
    {
      title: 'Browse Skills',
      description: 'Find experts to help you',
      icon: EyeIcon,
      href: '/marketplace',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      title: 'Manage Skills',
      description: 'Update your skill portfolio',
      icon: SparklesIcon,
      href: '/skills',
      color: 'from-accent-500 to-accent-600',
    },
    {
      title: 'View Analytics',
      description: 'Track your progress',
      icon: ChartBarIcon,
      href: '/analytics',
      color: 'from-warning-500 to-warning-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'active':
        return 'badge-primary';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircleIcon;
      case 'active':
        return ClockIcon;
      case 'pending':
        return CalendarIcon;
      case 'cancelled':
        return XCircleIcon;
      default:
        return ClockIcon;
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
            Please connect your wallet to access your dashboard
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
          <h1 className="text-3xl font-bold text-neutral-900">
            Welcome back, {state.user?.displayName || 'User'}!
          </h1>
          <p className="text-neutral-600 mt-1">
            Here's what's happening with your time banking activities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-neutral-500">
            <UserGroupIcon className="w-4 h-4" />
            <span>2.5K+ active users</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="card hover-lift"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-neutral-900">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-neutral-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Exchanges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="card"
      >
        <div className="card-header flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Recent Exchanges</h2>
          <Link href="/exchanges" className="btn-ghost btn-sm">
            View All
          </Link>
        </div>
        <div className="card-body">
          {recentExchanges.length > 0 ? (
            <div className="space-y-4">
              {recentExchanges.map((exchange) => {
                const StatusIcon = getStatusIcon(exchange.status);
                return (
                  <div
                    key={exchange.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                        <StatusIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{exchange.skill}</p>
                        <p className="text-sm text-neutral-600">
                          {exchange.hours} hour{exchange.hours > 1 ? 's' : ''} • 
                          {exchange.provider === state.user?.principal ? ' Providing' : ' Receiving'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`badge ${getStatusColor(exchange.status)}`}>
                        {exchange.status}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {new Date(exchange.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">No recent exchanges</p>
              <p className="text-sm text-neutral-500 mt-1">
                Start by creating your first exchange!
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-neutral-900">Activity Feed</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary-50">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Exchange completed successfully
                </p>
                <p className="text-xs text-neutral-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent-50">
              <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  New skill verification received
                </p>
                <p className="text-xs text-neutral-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary-50">
              <div className="w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center">
                <PlusIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Account created and verified
                </p>
                <p className="text-xs text-neutral-600">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
