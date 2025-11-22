import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  BellIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useWallet } from '@/contexts/WalletContext';
import { useApp } from '@/contexts/AppContext';
import { formatPrincipal } from '@/lib/stacks';

const Header: React.FC = () => {
  const router = useRouter();
  const { isConnected, address, connect, disconnect } = useWallet();
  const { state } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: router.pathname === '/dashboard' },
    { name: 'Marketplace', href: '/marketplace', current: router.pathname === '/marketplace' },
    { name: 'My Exchanges', href: '/exchanges', current: router.pathname === '/exchanges' },
    { name: 'Skills', href: '/skills', current: router.pathname === '/skills' },
  ];

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setIsProfileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl"
            >
              <ClockIcon className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gradient">TimeBank</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isConnected && navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? 'text-primary-600 bg-primary-50 rounded-lg'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                {/* Time Balance */}
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-primary-50 rounded-lg">
                  <ClockIcon className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">
                    {state.user?.user.timeBalance || 0} hrs
                  </span>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button className="relative p-2 text-neutral-600 hover:text-primary-600 transition-colors">
                    <BellIcon className="w-5 h-5" />
                    {state.notifications.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                        {state.notifications.unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {formatPrincipal(address || '')}
                    </span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-50"
                      >
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Settings
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleDisconnect}
                          className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                        >
                          Disconnect
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button
                onClick={handleConnect}
                className="btn-primary"
              >
                Connect Wallet
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-neutral-200 bg-white"
          >
            <div className="px-4 py-3 space-y-2">
              {isConnected && navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    item.current
                      ? 'text-primary-600 bg-primary-50 rounded-lg'
                      : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isConnected && (
                <div className="pt-3 border-t border-neutral-200 mt-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-primary-50 rounded-lg">
                    <ClockIcon className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-700">
                      {state.user?.user.timeBalance || 0} hours available
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
