/**
 * Promoter-specific API calls
 * Handles all endpoints related to promoter functionality
 */

import { apiGet, apiPost, apiPatch, ApiError } from './api';
import {
  mockStats,
  mockEvents,
  mockLinks,
  mockLinkAnalytics,
  mockEarningsData,
  mockRecentConversions,
} from './mock-data';
import type {
  PromoterDashboardStats,
  Event,
  PromoterLink,
  Analytics,
  EarningsData,
} from '@hubbard-inn/shared';

// Feature flag to use mock data when backend is not ready
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/**
 * Get dashboard stats with real-time data
 */
export async function getDashboardStats(): Promise<PromoterDashboardStats> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStats;
  }

  try {
    const response = await apiGet<PromoterDashboardStats>('/api/promoter/dashboard/stats');
    return response.data!;
  } catch (error) {
    if (error instanceof ApiError && error.status === 501) {
      // Backend not implemented, use mock data
      return mockStats;
    }
    throw error;
  }
}

/**
 * Get available events for promotion
 */
export async function getAvailableEvents(): Promise<Event[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEvents;
  }

  try {
    const response = await apiGet<Event[]>('/api/promoter/events/available');
    return response.data!;
  } catch (error) {
    if (error instanceof ApiError && error.status === 501) {
      return mockEvents;
    }
    throw error;
  }
}

/**
 * Generate a new affiliate link for an event
 */
export async function generateAffiliateLink(
  eventId: string,
  customCode?: string
): Promise<PromoterLink> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate mock link
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const code = customCode || `PROMO${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newLink: PromoterLink = {
      id: `link_${Date.now()}`,
      promoterId: 'promoter_1',
      eventId,
      uniqueCode: code,
      url: `https://hubbardinn.com/events/${eventId}?promo=${code}`,
      clicks: 0,
      conversions: 0,
      revenueGenerated: 0,
      commission: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: event.eventDate,
    };

    // Add to mock data for this session
    mockLinks.push(newLink);

    return newLink;
  }

  try {
    const response = await apiPost<PromoterLink>('/api/promoter/links/generate', {
      eventId,
      customCode,
    });
    return response.data!;
  } catch (error) {
    if (error instanceof ApiError && error.status === 501) {
      // Fallback to mock implementation
      const event = mockEvents.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');

      const code = customCode || `PROMO${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      return {
        id: `link_${Date.now()}`,
        promoterId: 'promoter_1',
        eventId,
        uniqueCode: code,
        url: `https://hubbardinn.com/events/${eventId}?promo=${code}`,
        clicks: 0,
        conversions: 0,
        revenueGenerated: 0,
        commission: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: event.eventDate,
      };
    }
    throw error;
  }
}

/**
 * Get all promoter links
 */
export async function getMyLinks(): Promise<PromoterLink[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return mockLinks;
  }

  try {
    const response = await apiGet<PromoterLink[]>('/api/promoter/links');
    return response.data!;
  } catch (error) {
    if (error instanceof ApiError && error.status === 501) {
      return mockLinks;
    }
    throw error;
  }
}

/**
 * Get detailed analytics for a specific link
 */
export async function getLinkAnalytics(linkId: string): Promise<ReturnType<typeof mockLinkAnalytics>> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockLinkAnalytics(linkId);
  }

  try {
    const response = await apiGet<ReturnType<typeof mockLinkAnalytics>>(
      `/api/promoter/links/${linkId}/analytics`
    );
    return response.data!;
  } catch (error) {
    if (error instanceof ApiError && error.status === 501) {
      return mockLinkAnalytics(linkId);
    }
    throw error;
  }
}

/**
 * Get earnings data and history
 */
export async function getEarnings(): Promise<EarningsData> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEarningsData;
  }

  try {
    const response = await apiGet<EarningsData>('/api/promoter/dashboard/earnings');
    return response.data!;
  } catch (error) {
    if (error instanceof ApiError && error.status === 501) {
      return mockEarningsData;
    }
    throw error;
  }
}

/**
 * Toggle link active status
 */
export async function toggleLinkStatus(linkId: string, isActive: boolean): Promise<PromoterLink> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));

    const link = mockLinks.find(l => l.id === linkId);
    if (!link) {
      throw new Error('Link not found');
    }

    link.isActive = isActive;
    return link;
  }

  try {
    const response = await apiPatch<PromoterLink>(`/api/promoter/links/${linkId}`, {
      isActive,
    });
    return response.data!;
  } catch (error) {
    if (error instanceof ApiError && error.status === 501) {
      const link = mockLinks.find(l => l.id === linkId);
      if (!link) throw new Error('Link not found');
      link.isActive = isActive;
      return link;
    }
    throw error;
  }
}

/**
 * Get recent conversions for dashboard
 */
export async function getRecentConversions() {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockRecentConversions;
  }

  try {
    const response = await apiGet('/api/promoter/dashboard/recent-conversions');
    return response.data!;
  } catch (error) {
    if (error instanceof ApiError && error.status === 501) {
      return mockRecentConversions;
    }
    throw error;
  }
}
