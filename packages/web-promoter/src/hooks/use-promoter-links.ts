'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMyLinks, generateAffiliateLink, toggleLinkStatus } from '@/services/promoter-api';
import type { PromoterLink } from '@hubbard-inn/shared';

export function usePromoterLinks() {
  const [links, setLinks] = useState<PromoterLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      setError(null);
      const data = await getMyLinks();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch links'));
      console.error('Error fetching links:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const generateLink = useCallback(
    async (eventId: string, customCode?: string) => {
      try {
        const newLink = await generateAffiliateLink(eventId, customCode);
        setLinks((prev) => [newLink, ...prev]);
        return newLink;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to generate link');
      }
    },
    []
  );

  const toggleStatus = useCallback(async (linkId: string, isActive: boolean) => {
    try {
      const updatedLink = await toggleLinkStatus(linkId, isActive);
      setLinks((prev) =>
        prev.map((link) => (link.id === linkId ? updatedLink : link))
      );
      return updatedLink;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to toggle link status');
    }
  }, []);

  return {
    links,
    isLoading,
    error,
    refresh: fetchLinks,
    generateLink,
    toggleStatus,
  };
}
