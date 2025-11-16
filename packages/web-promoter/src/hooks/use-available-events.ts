'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAvailableEvents } from '@/services/promoter-api';
import type { Event } from '@hubbard-inn/shared';

export function useAvailableEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await getAvailableEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    refresh: fetchEvents,
  };
}
