import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClockIcon,
  AcademicCapIcon,
  UserIcon,
  ChartBarIcon,
  CogIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { state } = useApp();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
    { name: 'My Exchanges', href: '/exchanges', icon: ClockIcon },
    { name: 'Skills', href: '/skills', icon: AcademicCapIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  const bottomNavigation = [
    { name: 'Settings', href: '/settings', icon: CogIcon },
    { name: 'Help', href: '/help', icon: QuestionMarkCircleIcon },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-neutral-200 shadow-sm z-30"
    >
      <div className="flex flex-col h-full">
        {/* User Info */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {state.user?.displayName || 'User'}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {state.user?.principal && 
                  `${state.user.principal.slice(0, 6)}...${state.user.principal.slice(-4)}`
                }
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-primary-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-primary-600" />
                <span className="text-xs text-primary-600">Balance</span>
              </div>
              <p className="text-lg font-bold text-primary-700">
                {state.user?.user.timeBalance || 0}
              </p>
            </div>
            <div className="bg-accent-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-4 h-4 text-accent-600" />
                <span className="text-xs text-accent-600">Rating</span>
              </div>
              <p className="text-lg font-bold text-accent-700">
                {state.user?.user.reputationScore || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive(item.href)
                      ? 'text-primary-600'
                      : 'text-neutral-400 group-hover:text-primary-500'
                  }`}
                />
                <span>{item.name}</span>
                {item.name === 'My Exchanges' && state.exchanges.length > 0 && (
                  <span className="ml-auto bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                    {state.exchanges.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-neutral-200 p-4 space-y-2">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive(item.href)
                      ? 'text-primary-600'
                      : 'text-neutral-400 group-hover:text-primary-500'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Version Info */}
        <div className="p-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-400 text-center">
            TimeBank v{process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
