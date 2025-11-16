import { Router } from 'express';
import { eq, and, sql, desc, gte } from 'drizzle-orm';
import { requireRole } from '../middleware/rbac.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/db.js';
import { events } from '../db/schema/events.js';
import { tickets } from '../db/schema/tickets.js';
import { userProfiles } from '../db/schema/users.js';
import { promoterLinks, analytics } from '../db/schema/promoters.js';
import { generatePromoCode } from '../utils/helpers.js';
import {
  generateLinkSchema,
  validateRequestBody,
} from '../utils/validation.js';
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  AppError,
} from '../utils/errors.js';

const router = Router();

/**
 * Promoter Routes
 * All routes require 'promoter' role
 */

// ====================
// Event Discovery
// ====================

/**
 * GET /api/promoter/events/available
 * Get events available for promotion (published events with affiliate enabled)
 */
router.get('/events/available', requireRole('promoter'), async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Fetch published events with affiliate commission enabled
    const availableEvents = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.status, 'published'),
          eq(events.affiliateCommissionEnabled, true),
          gte(events.eventDate, new Date()) // Only future events
        )
      )
      .orderBy(events.eventDate)
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(events)
      .where(
        and(
          eq(events.status, 'published'),
          eq(events.affiliateCommissionEnabled, true),
          gte(events.eventDate, new Date())
        )
      );

    res.json({
      events: availableEvents,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching available events:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch available events',
    });
  }
});

// ====================
// Affiliate Link Management
// ====================

/**
 * POST /api/promoter/links/generate
 * Generate a unique affiliate link for an event
 */
router.post('/links/generate', requireRole('promoter'), async (req: AuthenticatedRequest, res) => {
  try {
    const validation = validateRequestBody(generateLinkSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid link data',
        details: validation.error.errors,
      });
    }

    const { eventId, customUrl } = validation.data;
    const promoterId = req.user!.id;

    // Verify event exists and has affiliate enabled
    const [event] = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.id, eventId),
          eq(events.affiliateCommissionEnabled, true)
        )
      )
      .limit(1);

    if (!event) {
      throw new NotFoundError('Event not found or affiliate program not enabled');
    }

    // Check if promoter already has a link for this event
    const [existingLink] = await db
      .select()
      .from(promoterLinks)
      .where(
        and(
          eq(promoterLinks.promoterId, promoterId),
          eq(promoterLinks.eventId, eventId)
        )
      )
      .limit(1);

    if (existingLink) {
      throw new ConflictError('You already have an affiliate link for this event');
    }

    // Generate unique promo code
    let uniqueCode = generatePromoCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const [existing] = await db
        .select()
        .from(promoterLinks)
        .where(eq(promoterLinks.uniqueCode, uniqueCode))
        .limit(1);

      if (!existing) break;

      uniqueCode = generatePromoCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate unique promo code');
    }

    // Verify custom URL is unique if provided
    if (customUrl) {
      const [existingCustom] = await db
        .select()
        .from(promoterLinks)
        .where(eq(promoterLinks.customUrl, customUrl))
        .limit(1);

      if (existingCustom) {
        throw new ConflictError('Custom URL already taken');
      }
    }

    // Create promoter link
    const [link] = await db
      .insert(promoterLinks)
      .values({
        promoterId,
        eventId,
        uniqueCode,
        customUrl,
      })
      .returning();

    res.status(201).json({
      message: 'Affiliate link created successfully',
      link: {
        ...link,
        fullUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/events/${eventId}?ref=${uniqueCode}`,
      },
    });
  } catch (error) {
    console.error('Error generating affiliate link:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to generate affiliate link',
    });
  }
});

/**
 * GET /api/promoter/links
 * Get all affiliate links for the authenticated promoter
 */
router.get('/links', requireRole('promoter'), async (req: AuthenticatedRequest, res) => {
  try {
    const promoterId = req.user!.id;

    // Fetch all links with event details and stats
    const links = await db
      .select({
        link: promoterLinks,
        event: events,
      })
      .from(promoterLinks)
      .innerJoin(events, eq(promoterLinks.eventId, events.id))
      .where(eq(promoterLinks.promoterId, promoterId))
      .orderBy(desc(promoterLinks.createdAt));

    // Add full URLs to links
    const linksWithUrls = links.map(({ link, event }) => ({
      ...link,
      event,
      fullUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/events/${event.id}?ref=${link.uniqueCode}`,
    }));

    res.json({
      links: linksWithUrls,
    });
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch affiliate links',
    });
  }
});

/**
 * GET /api/promoter/links/:id/analytics
 * Get detailed analytics for a specific affiliate link
 */
router.get('/links/:id/analytics', requireRole('promoter'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const promoterId = req.user!.id;

    // Fetch link and verify ownership
    const [link] = await db
      .select()
      .from(promoterLinks)
      .where(
        and(
          eq(promoterLinks.id, id),
          eq(promoterLinks.promoterId, promoterId)
        )
      )
      .limit(1);

    if (!link) {
      throw new NotFoundError('Affiliate link not found');
    }

    // Get analytics breakdown by day
    const analyticsData = await db
      .select({
        date: sql<string>`date(${analytics.occurredAt})`,
        clicks: sql<number>`count(case when ${analytics.eventType} = 'click' then 1 end)::int`,
        conversions: sql<number>`count(case when ${analytics.eventType} = 'conversion' then 1 end)::int`,
        revenue: sql<number>`coalesce(sum(case when ${analytics.eventType} = 'conversion' then ${analytics.revenue} else 0 end), 0)::int`,
        commission: sql<number>`coalesce(sum(case when ${analytics.eventType} = 'conversion' then ${analytics.commission} else 0 end), 0)::int`,
      })
      .from(analytics)
      .where(eq(analytics.promoterLinkId, id))
      .groupBy(sql`date(${analytics.occurredAt})`)
      .orderBy(desc(sql`date(${analytics.occurredAt})`))
      .limit(30); // Last 30 days

    // Overall stats
    const overallStats = {
      totalClicks: link.clicks,
      totalConversions: link.conversions,
      totalRevenue: link.revenueGenerated,
      conversionRate: link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(2) : '0',
    };

    res.json({
      link,
      overallStats,
      dailyBreakdown: analyticsData,
    });
  } catch (error) {
    console.error('Error fetching link analytics:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch link analytics',
    });
  }
});

// ====================
// Earnings Dashboard
// ====================

/**
 * GET /api/promoter/dashboard/earnings
 * Get earnings summary for the authenticated promoter
 */
router.get('/dashboard/earnings', requireRole('promoter'), async (req: AuthenticatedRequest, res) => {
  try {
    const promoterId = req.user!.id;

    // Fetch promoter profile
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, promoterId))
      .limit(1);

    if (!profile) {
      throw new NotFoundError('Promoter profile not found');
    }

    // Get earnings breakdown by event
    const eventEarnings = await db
      .select({
        eventId: events.id,
        eventTitle: events.title,
        eventDate: events.eventDate,
        ticketsSold: sql<number>`count(${tickets.id})::int`,
        totalRevenue: sql<number>`coalesce(sum(${tickets.pricePaid}), 0)::int`,
        totalCommission: sql<number>`coalesce(sum(${tickets.affiliateCommissionEarned}), 0)::int`,
      })
      .from(events)
      .innerJoin(tickets, eq(tickets.eventId, events.id))
      .where(
        and(
          eq(tickets.promoterId, promoterId),
          eq(tickets.status, 'valid')
        )
      )
      .groupBy(events.id, events.title, events.eventDate)
      .orderBy(desc(events.eventDate))
      .limit(10);

    // Monthly earnings (last 12 months)
    const monthlyEarnings = await db
      .select({
        month: sql<string>`to_char(${tickets.createdAt}, 'YYYY-MM')`,
        ticketsSold: sql<number>`count(*)::int`,
        commission: sql<number>`coalesce(sum(${tickets.affiliateCommissionEarned}), 0)::int`,
      })
      .from(tickets)
      .where(
        and(
          eq(tickets.promoterId, promoterId),
          eq(tickets.status, 'valid'),
          gte(tickets.createdAt, sql`now() - interval '12 months'`)
        )
      )
      .groupBy(sql`to_char(${tickets.createdAt}, 'YYYY-MM')`)
      .orderBy(desc(sql`to_char(${tickets.createdAt}, 'YYYY-MM')`));

    res.json({
      totalEarnings: profile.totalEarnings,
      commissionRate: profile.commissionRate,
      eventEarnings,
      monthlyEarnings,
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch earnings',
    });
  }
});

/**
 * GET /api/promoter/dashboard/stats
 * Get performance statistics for the authenticated promoter
 */
router.get('/dashboard/stats', requireRole('promoter'), async (req: AuthenticatedRequest, res) => {
  try {
    const promoterId = req.user!.id;

    // Overall statistics
    const [overallStats] = await db
      .select({
        totalLinks: sql<number>`count(distinct ${promoterLinks.id})::int`,
        activeLinks: sql<number>`count(distinct case when ${promoterLinks.isActive} then ${promoterLinks.id} end)::int`,
        totalClicks: sql<number>`coalesce(sum(${promoterLinks.clicks}), 0)::int`,
        totalConversions: sql<number>`coalesce(sum(${promoterLinks.conversions}), 0)::int`,
        totalRevenue: sql<number>`coalesce(sum(${promoterLinks.revenueGenerated}), 0)::int`,
      })
      .from(promoterLinks)
      .where(eq(promoterLinks.promoterId, promoterId));

    // Top performing links
    const topLinks = await db
      .select({
        link: promoterLinks,
        event: events,
      })
      .from(promoterLinks)
      .innerJoin(events, eq(promoterLinks.eventId, events.id))
      .where(eq(promoterLinks.promoterId, promoterId))
      .orderBy(desc(promoterLinks.conversions))
      .limit(5);

    // Calculate conversion rate
    const conversionRate = overallStats.totalClicks > 0
      ? ((overallStats.totalConversions / overallStats.totalClicks) * 100).toFixed(2)
      : '0';

    res.json({
      overallStats: {
        ...overallStats,
        conversionRate,
      },
      topLinks: topLinks.map(({ link, event }) => ({
        ...link,
        event,
        fullUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/events/${event.id}?ref=${link.uniqueCode}`,
      })),
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch statistics',
    });
  }
});

// ====================
// Notifications
// ====================

/**
 * GET /api/promoter/notifications
 * Get recent conversion notifications for the authenticated promoter
 */
router.get('/notifications', requireRole('promoter'), async (req: AuthenticatedRequest, res) => {
  try {
    const promoterId = req.user!.id;
    const { limit = 20 } = req.query;
    const limitNum = parseInt(limit as string);

    // Fetch recent conversion events
    const notifications = await db
      .select({
        analytics: analytics,
        event: events,
        link: promoterLinks,
      })
      .from(analytics)
      .innerJoin(promoterLinks, eq(analytics.promoterLinkId, promoterLinks.id))
      .innerJoin(events, eq(analytics.eventId, events.id))
      .where(
        and(
          eq(promoterLinks.promoterId, promoterId),
          eq(analytics.eventType, 'conversion')
        )
      )
      .orderBy(desc(analytics.occurredAt))
      .limit(limitNum);

    res.json({
      notifications: notifications.map(({ analytics, event, link }) => ({
        id: analytics.id,
        type: 'conversion',
        message: `New ticket sold for ${event.title}`,
        revenue: analytics.revenue,
        commission: analytics.commission,
        linkCode: link.uniqueCode,
        occurredAt: analytics.occurredAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch notifications',
    });
  }
});

export { router as promoterRoutes };
