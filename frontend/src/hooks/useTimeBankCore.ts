// React Hook for Time Bank Core Contract
// Clarity 4 with stacks-block-time timestamps

import { useState, useEffect } from 'react';
import { getUserAddress } from '@/lib/stacksApi';
import {
  registerUser,
  getUserInfo,
  getTimeBankStats,
} from '@/lib/contracts/timeBankCore';
import { TimeBankUser, TimeBankStats } from '@/types/contracts';

export const useTimeBankCore = () => {
  const [user, setUser] = useState<TimeBankUser | null>(null);
  const [stats, setStats] = useState<TimeBankStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userAddress = getUserAddress();

  useEffect(() => {
    if (userAddress) {
      loadUserInfo();
    }
  }, [userAddress]);

  const loadUserInfo = async () => {
    if (!userAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const userInfo = await getUserInfo(userAddress);
      setUser(userInfo);
    } catch (err: any) {
      setError(err.message || 'Failed to load user info');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const statsData = await getTimeBankStats();
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await registerUser();

      if (result.success) {
        await loadUserInfo();
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Registration failed');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to register user';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    stats,
    isLoading,
    error,
    loadUserInfo,
    loadStats,
    registerUser: handleRegisterUser,
  };
};
