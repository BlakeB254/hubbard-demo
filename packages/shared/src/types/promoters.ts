/**
 * Promoter-related types shared across portals
 */

export interface PromoterLink {
  id: string;
  promoterId: string;
  eventId: string;
  uniqueCode: string;
  customUrl?: string;
  clicks: number;
  conversions: number;
  revenueGenerated: number; // In cents
  isActive: boolean;
  expiresAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Analytics {
  id: string;
  promoterLinkId: string;
  eventId: string;
  eventType: 'click' | 'purchase' | 'conversion';
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  ticketId?: string;
  revenue?: number; // In cents
  commission?: number; // In cents
  occurredAt: Date | string;
}

export interface CreatePromoterLinkInput {
  eventId: string;
  customUrl?: string;
}

export interface PromoterDashboardStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number; // In cents
  totalEarnings: number; // In cents
  activeLinks: number;
  conversionRate: number; // Percentage
}

export interface LinkPerformance {
  linkId: string;
  eventTitle: string;
  uniqueCode: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  conversionRate: number;
}
