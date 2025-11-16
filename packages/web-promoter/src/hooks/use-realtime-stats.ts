'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats, getRecentConversions } from '@/services/promoter-api';
import type { PromoterDashboardStats } from '@hubbard-inn/shared';

export function useRealtimeStats(pollingInterval: number = 30000) {
  const [stats, setStats] = useState<PromoterDashboardStats | null>(null);
  const [recentConversions, setRecentConversions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const [statsData, conversionsData] = await Promise.all([
        getDashboardStats(),
        getRecentConversions(),
      ]);

      setStats(statsData);
      setRecentConversions(conversionsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Set up polling interval
    const interval = setInterval(fetchStats, pollingInterval);

    // Refresh when window gains focus
    const handleFocus = () => {
      fetchStats();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchStats, pollingInterval]);

  return {
    stats,
    recentConversions,
    isLoading,
    error,
    refresh: fetchStats,
  };
}
