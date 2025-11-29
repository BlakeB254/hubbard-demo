export interface PromoterLink {
  id: string;
  promoterId: string;
  eventId: string;
  code: string;
  url: string;
  clicks: number;
  conversions: number;
  revenue: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromoterAnalytics {
  id: string;
  linkId: string;
  eventType: 'click' | 'purchase' | 'conversion';
  visitorIp?: string;
  userAgent?: string;
  referrer?: string;
  ticketId?: string;
  commission?: number;
  createdAt: string;
}

export interface PromoterEarnings {
  totalEarnings: number;
  pendingPayout: number;
  lastPayout?: {
    amount: number;
    date: string;
  };
  byEvent: EventEarnings[];
}

export interface EventEarnings {
  eventId: string;
  eventName: string;
  conversions: number;
  revenue: number;
  commission: number;
}

export interface CreatePromoterLinkInput {
  eventId: string;
  customCode?: string;
  expiresAt?: string;
}

export interface LinkPerformance {
  clicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  commission: number;
  clicksByDay: DailyStats[];
  conversionsByDay: DailyStats[];
}

export interface DailyStats {
  date: string;
  count: number;
}
