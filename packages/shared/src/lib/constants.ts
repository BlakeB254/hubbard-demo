/**
 * Application constants
 */

export const APP_NAME = 'Hubbard Inn';
export const APP_DESCRIPTION = "Premium event tickets and VIP reservations at Chicago's premier venue";

export const FLOORS = {
  main: { label: 'Main Floor', description: 'Classic European-inspired atmosphere' },
  rooftop: { label: 'Rooftop', description: 'Open-air venue with city views' },
  private: { label: 'Private Room', description: 'Exclusive space for special events' },
} as const;

export const AGE_RESTRICTIONS = {
  none: { label: 'All Ages', description: 'Open to all guests' },
  '18+': { label: '18+', description: 'Must be 18 years or older' },
  '21+': { label: '21+', description: 'Must be 21 years or older' },
} as const;

export const EVENT_STATUSES = {
  draft: { label: 'Draft', color: 'secondary' },
  published: { label: 'Published', color: 'success' },
  sold_out: { label: 'Sold Out', color: 'accent' },
  cancelled: { label: 'Cancelled', color: 'destructive' },
  completed: { label: 'Completed', color: 'muted' },
} as const;

export const TICKET_STATUSES = {
  valid: { label: 'Valid', color: 'success' },
  used: { label: 'Used', color: 'muted' },
  refunded: { label: 'Refunded', color: 'accent' },
  cancelled: { label: 'Cancelled', color: 'destructive' },
} as const;

export const PROMOTER_STATUSES = {
  pending: { label: 'Pending', color: 'accent' },
  approved: { label: 'Approved', color: 'success' },
  suspended: { label: 'Suspended', color: 'destructive' },
  rejected: { label: 'Rejected', color: 'muted' },
} as const;

export const ROUTES = {
  // Customer routes
  home: '/',
  events: '/events',
  event: (id: string) => `/events/${id}`,
  profile: '/profile',
  orderLookup: '/orders/lookup',
  order: (orderNumber: string) => `/orders/${orderNumber}`,

  // Admin routes
  dashboard: '/dashboard',
  adminEvents: '/events',
  checkIn: '/check-in',
  promoters: '/promoters',
  analytics: '/analytics',

  // Promoter routes
  promoterDashboard: '/dashboard',
  promoterEvents: '/events',
  links: '/links',
  linkDetails: (id: string) => `/links/${id}`,
  earnings: '/earnings',
} as const;
