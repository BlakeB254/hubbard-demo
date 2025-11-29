import type { Event, UserProfile } from '@hubbard-inn/shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

export async function getAllEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/api/admin/events`, {
      next: { revalidate: 30, tags: ['events'] },
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getPromoters(): Promise<UserProfile[]> {
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
