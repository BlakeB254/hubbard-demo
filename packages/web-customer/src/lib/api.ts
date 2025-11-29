import type { Event, EventFilters } from '@hubbard-inn/shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Next.js 16: Server-side data fetching with caching
 * Using 'use cache' pattern for optimal performance
 */

export async function getUpcomingEvents(limit = 6): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/api/customer/events?limit=${limit}`, {
      next: {
        revalidate: 60, // Revalidate every 60 seconds
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
