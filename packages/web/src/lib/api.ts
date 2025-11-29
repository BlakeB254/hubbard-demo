import type { Event, EventFilters, PromoterLink, PromoterEarnings } from '@hubbard-inn/shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Customer API - Server-side data fetching with caching
 */

export async function getUpcomingEvents(limit = 6): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/api/customer/events?limit=${limit}`, {
      next: {
        revalidate: 60,
        tags: ['events'],
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

export async function getAllEvents(filters?: EventFilters): Promise<Event[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.floor) params.set('floor', filters.floor);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status) params.set('status', filters.status);

    const url = `${API_URL}/api/customer/events${params.toString() ? `?${params}` : ''}`;

    const response = await fetch(url, {
      next: {
        revalidate: 30,
        tags: ['events'],
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const response = await fetch(`${API_URL}/api/customer/events/${id}`, {
      next: {
        revalidate: 30,
        tags: ['events', `event-${id}`],
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch event');
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

/**
 * Client-side API calls (for mutations)
 */
export async function purchaseTickets(payload: {
  eventId: string;
  quantity: number;
  type: 'presale' | 'door';
  affiliateCode?: string;
}) {
  const response = await fetch(`${API_URL}/api/customer/tickets/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to purchase tickets');
  }

  return response.json();
}

export async function createPaymentIntent(amount: number, metadata?: Record<string, string>) {
  const response = await fetch(`${API_URL}/api/payments/intent/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, metadata }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
}

export async function lookupOrder(orderNumber: string) {
  const response = await fetch(`${API_URL}/api/customer/orders/${orderNumber}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to lookup order');
  }

  return response.json();
}

/**
 * Admin API calls
 */
export interface AdminStats {
  totalRevenue: number;
  ticketsSold: number;
  activeEvents: number;
  activePromoters: number;
}

export interface AnalyticsData {
  revenue: { date: string; amount: number }[];
  tickets: { date: string; count: number }[];
  topEvents: { name: string; tickets: number; revenue: number }[];
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      next: { revalidate: 60, tags: ['admin-stats'] },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return data.data || { totalRevenue: 0, ticketsSold: 0, activeEvents: 0, activePromoters: 0 };
  } catch {
    return { totalRevenue: 0, ticketsSold: 0, activeEvents: 0, activePromoters: 0 };
  }
}

export async function getRecentEvents(limit = 5): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/api/admin/events?limit=${limit}&sort=createdAt:desc`, {
      next: { revalidate: 30, tags: ['events'] },
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getAdminEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/api/admin/events`, {
      next: { revalidate: 30, tags: ['admin-events'] },
    });

    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const response = await fetch(`${API_URL}/api/admin/analytics`, {
      next: { revalidate: 300, tags: ['analytics'] },
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    const data = await response.json();
    return data.data || { revenue: [], tickets: [], topEvents: [] };
  } catch {
    return { revenue: [], tickets: [], topEvents: [] };
  }
}

export async function getPromoters() {
  try {
    const response = await fetch(`${API_URL}/api/admin/promoters`, {
      next: { revalidate: 60, tags: ['promoters'] },
    });

    if (!response.ok) throw new Error('Failed to fetch promoters');
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

/**
 * Promoter API calls
 */
export interface PromoterStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  pendingPayout: number;
  conversionRate: number;
}

export interface Conversion {
  id: string;
  eventName: string;
  ticketCount: number;
  commission: number;
  createdAt: string;
}

export async function getPromoterStats(): Promise<PromoterStats> {
  try {
    const response = await fetch(`${API_URL}/api/promoter/stats`, {
      next: { revalidate: 60, tags: ['promoter-stats'] },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return data.data || {
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      pendingPayout: 0,
      conversionRate: 0,
    };
  } catch {
    return {
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      pendingPayout: 0,
      conversionRate: 0,
    };
  }
}

export async function getRecentConversions(limit = 10): Promise<Conversion[]> {
  try {
    const response = await fetch(`${API_URL}/api/promoter/conversions?limit=${limit}`, {
      next: { revalidate: 30, tags: ['conversions'] },
    });
    if (!response.ok) throw new Error('Failed to fetch conversions');
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getAvailableEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/api/promoter/events`, {
      next: { revalidate: 60, tags: ['events'] },
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getPromoterLinks(): Promise<PromoterLink[]> {
  try {
    const response = await fetch(`${API_URL}/api/promoter/links`, {
      next: { revalidate: 30, tags: ['links'] },
    });
    if (!response.ok) throw new Error('Failed to fetch links');
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getLinkById(id: string): Promise<PromoterLink | null> {
  try {
    const response = await fetch(`${API_URL}/api/promoter/links/${id}`, {
      next: { revalidate: 30, tags: ['links', `link-${id}`] },
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch link');
    }
    const data = await response.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export async function getPromoterEarnings(): Promise<PromoterEarnings> {
  try {
    const response = await fetch(`${API_URL}/api/promoter/earnings`, {
      next: { revalidate: 60, tags: ['earnings'] },
    });
    if (!response.ok) throw new Error('Failed to fetch earnings');
    const data = await response.json();
    return data.data || { totalEarnings: 0, pendingPayout: 0, byEvent: [] };
  } catch {
    return { totalEarnings: 0, pendingPayout: 0, byEvent: [] };
  }
}
