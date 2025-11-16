'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEarnings } from '@/services/promoter-api';
import type { EarningsData } from '@hubbard-inn/shared';

export function useEarnings() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEarnings = useCallback(async () => {
    try {
      setError(null);
      const data = await getEarnings();
      setEarnings(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch earnings'));
      console.error('Error fetching earnings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return {
    earnings,
    isLoading,
    error,
    refresh: fetchEarnings,
  };
}
