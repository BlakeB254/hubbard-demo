import type { Event, PromoterLink, PromoterEarnings } from '@hubbard-inn/shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
