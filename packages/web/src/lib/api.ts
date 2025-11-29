import type { Event, EventFilters, PromoterLink, PromoterEarnings } from '@hubbard-inn/shared/types';

/**
 * Mock Data for Demo
 * No backend required - all data is static for demonstration
 */

// Mock Events Data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    name: 'New Year\'s Eve Gala',
    description: 'Ring in the new year with Chicago\'s most exclusive celebration. Premium open bar, live entertainment, and champagne toast at midnight.',
    date: '2025-12-31T21:00:00Z',
    floor: 'rooftop',
    capacity: 500,
    ticketsSold: 342,
    presalePrice: 150,
    doorPrice: 200,
    status: 'on_sale',
    imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800',
    commissionRate: 15,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Latin Night Fiesta',
    description: 'Hot beats, salsa dancing, and tropical cocktails. Featuring DJ Carlos and live percussion.',
    date: '2025-12-14T22:00:00Z',
    floor: 'main',
    capacity: 300,
    ticketsSold: 187,
    presalePrice: 35,
    doorPrice: 50,
    status: 'on_sale',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    commissionRate: 12,
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'VIP Bottle Service Night',
    description: 'Exclusive bottle service experience with premium spirits, dedicated server, and prime seating.',
    date: '2025-12-20T22:00:00Z',
    floor: 'vip',
    capacity: 100,
    ticketsSold: 45,
    presalePrice: 500,
    doorPrice: 600,
    status: 'on_sale',
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800',
    commissionRate: 20,
    createdAt: '2025-01-12T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z',
  },
  {
    id: '4',
    name: 'Hip Hop Takeover',
    description: 'The biggest hip hop party in the city. Three floors of music, celebrity appearances, and VIP experiences.',
    date: '2025-12-21T22:00:00Z',
    floor: 'main',
    capacity: 400,
    ticketsSold: 289,
    presalePrice: 45,
    doorPrice: 60,
    status: 'on_sale',
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
    commissionRate: 12,
    createdAt: '2025-01-08T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
  },
  {
    id: '5',
    name: 'Rooftop Sunset Sessions',
    description: 'Chill vibes with deep house music as the sun sets over the Chicago skyline. Craft cocktails included.',
    date: '2025-12-28T17:00:00Z',
    floor: 'rooftop',
    capacity: 200,
    ticketsSold: 156,
    presalePrice: 75,
    doorPrice: 95,
    status: 'on_sale',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    commissionRate: 15,
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
  },
  {
    id: '6',
    name: 'Throwback Thursday 90s Party',
    description: 'Relive the golden era of music. 90s hip hop, R&B, and pop all night long. Dress code: 90s inspired.',
    date: '2025-12-26T21:00:00Z',
    floor: 'main',
    capacity: 350,
    ticketsSold: 198,
    presalePrice: 25,
    doorPrice: 35,
    status: 'on_sale',
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
    commissionRate: 10,
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z',
  },
];

// Mock Promoter Links
const MOCK_PROMOTER_LINKS: PromoterLink[] = [
  {
    id: '1',
    code: 'PROMO2024',
    eventId: '1',
    promoterId: 'user-1',
    clicks: 1245,
    conversions: 89,
    revenue: 13350,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    code: 'VIPNIGHT',
    eventId: '3',
    promoterId: 'user-1',
    clicks: 567,
    conversions: 23,
    revenue: 11500,
    createdAt: '2025-01-05T00:00:00Z',
  },
  {
    id: '3',
    code: 'HIPHOP50',
    eventId: '4',
    promoterId: 'user-1',
    clicks: 892,
    conversions: 156,
    revenue: 7020,
    createdAt: '2025-01-10T00:00:00Z',
  },
];

/**
 * Customer API - Returns mock data
 */

export async function getUpcomingEvents(limit = 6): Promise<Event[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_EVENTS.slice(0, limit);
}

export async function getAllEvents(filters?: EventFilters): Promise<Event[]> {
  await new Promise(resolve => setTimeout(resolve, 100));

  let events = [...MOCK_EVENTS];

  if (filters?.floor) {
    events = events.filter(e => e.floor === filters.floor);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    events = events.filter(e =>
      e.name.toLowerCase().includes(search) ||
      e.description.toLowerCase().includes(search)
    );
  }

  return events;
}

export async function getEventById(id: string): Promise<Event | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_EVENTS.find(e => e.id === id) || null;
}

/**
 * Client-side API calls (for mutations) - Mock responses
 */
export async function purchaseTickets(payload: {
  eventId: string;
  quantity: number;
  type: 'presale' | 'door';
  affiliateCode?: string;
}) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    orderId: `ORD-${Date.now()}`,
    message: 'Demo mode - no actual purchase made',
  };
}

export async function createPaymentIntent(amount: number, metadata?: Record<string, string>) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    clientSecret: 'demo_secret_' + Date.now(),
    amount,
  };
}

export async function lookupOrder(orderNumber: string) {
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    orderNumber,
    status: 'confirmed',
    event: MOCK_EVENTS[0],
    quantity: 2,
    total: 300,
  };
}

/**
 * Admin API calls - Returns mock data
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
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    totalRevenue: 127850,
    ticketsSold: 1217,
    activeEvents: 6,
    activePromoters: 24,
  };
}

export async function getRecentEvents(limit = 5): Promise<Event[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_EVENTS.slice(0, limit);
}

export async function getAdminEvents(): Promise<Event[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_EVENTS;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    revenue: [
      { date: '2025-01-01', amount: 12500 },
      { date: '2025-01-02', amount: 18200 },
      { date: '2025-01-03', amount: 15800 },
      { date: '2025-01-04', amount: 22100 },
      { date: '2025-01-05', amount: 19400 },
      { date: '2025-01-06', amount: 24600 },
      { date: '2025-01-07', amount: 28900 },
    ],
    tickets: [
      { date: '2025-01-01', count: 89 },
      { date: '2025-01-02', count: 134 },
      { date: '2025-01-03', count: 112 },
      { date: '2025-01-04', count: 167 },
      { date: '2025-01-05', count: 145 },
      { date: '2025-01-06', count: 189 },
      { date: '2025-01-07', count: 213 },
    ],
    topEvents: [
      { name: 'New Year\'s Eve Gala', tickets: 342, revenue: 51300 },
      { name: 'Hip Hop Takeover', tickets: 289, revenue: 13005 },
      { name: 'Throwback Thursday', tickets: 198, revenue: 4950 },
    ],
  };
}

export async function getPromoters() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    { id: '1', name: 'Alex Johnson', email: 'alex@example.com', tier: 'gold', totalEarnings: 15420, activeLinks: 8 },
    { id: '2', name: 'Maria Garcia', email: 'maria@example.com', tier: 'silver', totalEarnings: 8750, activeLinks: 5 },
    { id: '3', name: 'James Wilson', email: 'james@example.com', tier: 'bronze', totalEarnings: 3200, activeLinks: 3 },
    { id: '4', name: 'Sarah Chen', email: 'sarah@example.com', tier: 'silver', totalEarnings: 6890, activeLinks: 4 },
  ];
}

/**
 * Promoter API calls - Returns mock data
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
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    totalClicks: 2704,
    totalConversions: 268,
    totalRevenue: 31870,
    pendingPayout: 4780,
    conversionRate: 9.9,
  };
}

export async function getRecentConversions(limit = 10): Promise<Conversion[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    { id: '1', eventName: 'New Year\'s Eve Gala', ticketCount: 4, commission: 90, createdAt: '2025-01-15T14:32:00Z' },
    { id: '2', eventName: 'Hip Hop Takeover', ticketCount: 2, commission: 10.80, createdAt: '2025-01-15T12:15:00Z' },
    { id: '3', eventName: 'VIP Bottle Service', ticketCount: 1, commission: 100, createdAt: '2025-01-14T22:45:00Z' },
    { id: '4', eventName: 'Latin Night Fiesta', ticketCount: 3, commission: 12.60, createdAt: '2025-01-14T18:20:00Z' },
    { id: '5', eventName: 'Rooftop Sunset', ticketCount: 2, commission: 22.50, createdAt: '2025-01-13T16:00:00Z' },
  ].slice(0, limit);
}

export async function getAvailableEvents(): Promise<Event[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_EVENTS;
}

export async function getPromoterLinks(): Promise<PromoterLink[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_PROMOTER_LINKS;
}

export async function getLinkById(id: string): Promise<PromoterLink | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_PROMOTER_LINKS.find(l => l.id === id) || null;
}

export async function getPromoterEarnings(): Promise<PromoterEarnings> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    totalEarnings: 31870,
    pendingPayout: 4780,
    byEvent: [
      { eventId: '1', eventName: 'New Year\'s Eve Gala', earnings: 13350, conversions: 89 },
      { eventId: '3', eventName: 'VIP Bottle Service', earnings: 11500, conversions: 23 },
      { eventId: '4', eventName: 'Hip Hop Takeover', earnings: 7020, conversions: 156 },
    ],
  };
}
