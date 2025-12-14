// React Hook for Exchange Manager Contract
// Clarity 4 with stacks-block-time scheduling

import { useState } from 'react';
import {
  createExchange,
  acceptExchange,
  confirmCompletion,
  cancelExchange,
  submitReview,
  getExchangeDetails,
  getExchangeStats,
  isExchangeActive,
  isExchangeCompleted,
  validateTimeRange,
} from '@/lib/contracts/exchangeManager';
import { ServiceExchange, ExchangeStats } from '@/types/contracts';

export const useExchangeManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateExchange = async (
    provider: string,
    skillName: string,
    hoursRequested: number,
    scheduledStart: number,
    scheduledEnd: number
  ) => {
    setIsLoading(true);
    setError(null);

    // Validate time range before creating
    if (!validateTimeRange(scheduledStart, scheduledEnd)) {
      setError('Invalid time range. Check start/end times and duration.');
      setIsLoading(false);
      return { success: false, error: 'Invalid time range' };
    }

    try {
      const result = await createExchange(
        provider,
        skillName,
        hoursRequested,
        scheduledStart,
        scheduledEnd
      );

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to create exchange');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create exchange';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptExchange = async (exchangeId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await acceptExchange(exchangeId);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to accept exchange');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to accept exchange';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCompletion = async (exchangeId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await confirmCompletion(exchangeId);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to confirm completion');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to confirm completion';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelExchange = async (exchangeId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await cancelExchange(exchangeId);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to cancel exchange');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to cancel exchange';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (
    exchangeId: number,
    rating: number,
    comment: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await submitReview(exchangeId, rating, comment);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to submit review');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to submit review';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const loadExchangeDetails = async (
    exchangeId: number
  ): Promise<ServiceExchange | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const exchange = await getExchangeDetails(exchangeId);
      return exchange;
    } catch (err: any) {
      setError(err.message || 'Failed to load exchange details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadExchangeStats = async (): Promise<ExchangeStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = await getExchangeStats();
      return stats;
    } catch (err: any) {
      setError(err.message || 'Failed to load exchange stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkExchangeActive = async (exchangeId: number): Promise<boolean> => {
    try {
      return await isExchangeActive(exchangeId);
    } catch (err: any) {
      setError(err.message || 'Failed to check exchange status');
      return false;
    }
  };

  const checkExchangeCompleted = async (exchangeId: number): Promise<boolean> => {
    try {
      return await isExchangeCompleted(exchangeId);
    } catch (err: any) {
      setError(err.message || 'Failed to check exchange completion');
      return false;
    }
  };

  return {
    isLoading,
    error,
    createExchange: handleCreateExchange,
    acceptExchange: handleAcceptExchange,
    confirmCompletion: handleConfirmCompletion,
    cancelExchange: handleCancelExchange,
    submitReview: handleSubmitReview,
    loadExchangeDetails,
    loadExchangeStats,
    checkExchangeActive,
    checkExchangeCompleted,
    validateTimeRange,
  };
};
