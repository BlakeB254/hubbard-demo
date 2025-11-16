'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLinkAnalytics } from '@/services/promoter-api';

export function useLinkAnalytics(linkId: string) {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!linkId) return;

    try {
      setError(null);
      const data = await getLinkAnalytics(linkId);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [linkId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refresh: fetchAnalytics,
  };
}
