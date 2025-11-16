import { Router } from 'express';
import { eq, and, sql, desc, gte, lte, between } from 'drizzle-orm';
import { requireRole } from '../middleware/rbac.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/db.js';
import { events } from '../db/schema/events.js';
import { tickets } from '../db/schema/tickets.js';
import { userProfiles } from '../db/schema/users.js';
import { promoterLinks, analytics } from '../db/schema/promoters.js';
import { QRCodeService } from '../services/qr-code.js';
import {
  createEventSchema,
  updateEventSchema,
  createPromoterSchema,
  updatePromoterStatusSchema,
  validateQRSchema,
  analyticsQuerySchema,
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
 * Admin Routes
 * All routes require 'admin' role
 */

// ====================
// Event Management
// ====================

/**
 * POST /api/admin/events
 * Create a new event
 */
router.post('/events', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const validation = validateRequestBody(createEventSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid event data',
        details: validation.error.errors,
      });
    }

    const eventData = validation.data;
    const adminUserId = req.user!.id;

    // Create event
    const [event] = await db
      .insert(events)
      .values({
        ...eventData,
        createdBy: adminUserId,
        status: 'draft',
      })
      .returning();

    res.status(201).json({
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to create event',
    });
  }
});

/**
 * PUT /api/admin/events/:id
 * Update an existing event
 */
router.put('/events/:id', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const validation = validateRequestBody(updateEventSchema, req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid event data',
        details: validation.error.errors,
      });
    }

    const updateData = validation.data;

    // Check if event exists
    const [existingEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!existingEvent) {
      throw new NotFoundError('Event not found');
    }

    // Prevent updating certain fields if event is already published and has tickets sold
    if (existingEvent.status === 'published' && updateData.totalCapacity) {
      const [{ sold }] = await db
        .select({ sold: sql<number>`count(*)::int` })
        .from(tickets)
        .where(
          and(
            eq(tickets.eventId, id),
            eq(tickets.status, 'valid')
          )
        );

      if (sold > 0 && updateData.totalCapacity < sold) {
        throw new ConflictError('Cannot reduce capacity below tickets already sold');
      }
    }

    // Update event
    const [updatedEvent] = await db
      .update(events)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to update event',
    });
  }
});

/**
 * DELETE /api/admin/events/:id
 * Cancel an event (soft delete)
 */
router.delete('/events/:id', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const [existingEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!existingEvent) {
      throw new NotFoundError('Event not found');
    }

    // Update event status to cancelled
    await db
      .update(events)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(events.id, id));

    // TODO: Send refund notifications to ticket holders
    // TODO: Process refunds via Stripe

    res.json({
      message: 'Event cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling event:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to cancel event',
    });
  }
});

/**
 * GET /api/admin/events
 * List all events with analytics
 */
router.get('/events', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Fetch events with ticket counts
    const eventsList = await db
      .select({
        event: events,
        ticketsSold: sql<number>`count(${tickets.id})::int`,
        totalRevenue: sql<number>`coalesce(sum(${tickets.pricePaid}), 0)::int`,
      })
      .from(events)
      .leftJoin(tickets, and(
        eq(tickets.eventId, events.id),
        eq(tickets.status, 'valid')
      ))
      .groupBy(events.id)
      .orderBy(desc(events.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(events);

    res.json({
      events: eventsList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch events',
    });
  }
});

// ====================
// Analytics Dashboard
// ====================

/**
 * GET /api/admin/analytics
 * Get dashboard analytics with optional filters
 */
router.get('/analytics', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const validation = validateRequestBody(analyticsQuerySchema, req.query);
    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: validation.error.errors,
      });
    }

    const { startDate, endDate, eventId, promoterId } = validation.data;

    // Build conditions for date filtering
    const dateConditions = [];
    if (startDate) {
      dateConditions.push(gte(tickets.createdAt, new Date(startDate)));
    }
    if (endDate) {
      dateConditions.push(lte(tickets.createdAt, new Date(endDate)));
    }
    if (eventId) {
      dateConditions.push(eq(tickets.eventId, eventId));
    }
    if (promoterId) {
      dateConditions.push(eq(tickets.promoterId, promoterId));
    }

    // Overall statistics
    const [overallStats] = await db
      .select({
        totalTicketsSold: sql<number>`count(*)::int`,
        totalRevenue: sql<number>`coalesce(sum(${tickets.pricePaid}), 0)::int`,
        totalCommissions: sql<number>`coalesce(sum(${tickets.affiliateCommissionEarned}), 0)::int`,
      })
      .from(tickets)
      .where(
        and(
          eq(tickets.status, 'valid'),
          ...(dateConditions.length > 0 ? dateConditions : [])
        )
      );

    // Event-wise breakdown
    const eventBreakdown = await db
      .select({
        eventId: events.id,
        eventTitle: events.title,
        eventDate: events.eventDate,
        ticketsSold: sql<number>`count(${tickets.id})::int`,
        revenue: sql<number>`coalesce(sum(${tickets.pricePaid}), 0)::int`,
        capacity: events.totalCapacity,
      })
      .from(events)
      .leftJoin(tickets, and(
        eq(tickets.eventId, events.id),
        eq(tickets.status, 'valid'),
        ...(dateConditions.length > 0 ? dateConditions : [])
      ))
      .groupBy(events.id, events.title, events.eventDate, events.totalCapacity)
      .orderBy(desc(events.eventDate))
      .limit(10);

    // Top promoters
    const topPromoters = await db
      .select({
        promoterId: userProfiles.userId,
        promoterName: userProfiles.userId, // In real app, you'd join with user details
        ticketsSold: sql<number>`count(${tickets.id})::int`,
        revenue: sql<number>`coalesce(sum(${tickets.pricePaid}), 0)::int`,
        commissions: sql<number>`coalesce(sum(${tickets.affiliateCommissionEarned}), 0)::int`,
      })
      .from(userProfiles)
      .innerJoin(tickets, eq(tickets.promoterId, userProfiles.userId))
      .where(
        and(
          eq(userProfiles.role, 'promoter'),
          eq(tickets.status, 'valid'),
          ...(dateConditions.length > 0 ? dateConditions : [])
        )
      )
      .groupBy(userProfiles.userId)
      .orderBy(desc(sql`count(${tickets.id})`))
      .limit(10);

    res.json({
      overallStats,
      eventBreakdown,
      topPromoters,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch analytics',
    });
  }
});

// ====================
// Promoter Management
// ====================

/**
 * POST /api/admin/promoters
 * Create a new promoter account
 */
router.post('/promoters', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const validation = validateRequestBody(createPromoterSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid promoter data',
        details: validation.error.errors,
      });
    }

    const { userId, email, name, phone, commissionRate } = validation.data;

    // Check if user already has a profile
    const [existingProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (existingProfile) {
      throw new ConflictError('User already has a profile');
    }

    // Create promoter profile
    const [promoterProfile] = await db
      .insert(userProfiles)
      .values({
        userId,
        role: 'promoter',
        phone,
        promoterStatus: 'active',
        commissionRate,
      })
      .returning();

    res.status(201).json({
      message: 'Promoter account created successfully',
      promoter: promoterProfile,
    });
  } catch (error) {
    console.error('Error creating promoter:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to create promoter account',
    });
  }
});

/**
 * GET /api/admin/promoters
 * List all promoters with optional status filter
 */
router.get('/promoters', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [
      eq(userProfiles.role, 'promoter'),
      ...(status ? [eq(userProfiles.promoterStatus, status as string)] : []),
    ];

    // Fetch promoters
    const promoters = await db
      .select()
      .from(userProfiles)
      .where(and(...conditions))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userProfiles)
      .where(and(...conditions));

    res.json({
      promoters,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching promoters:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch promoters',
    });
  }
});

/**
 * PUT /api/admin/promoters/:id/status
 * Update promoter status (approve/suspend/ban)
 */
router.put('/promoters/:id/status', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const validation = validateRequestBody(updatePromoterStatusSchema, req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid status data',
        details: validation.error.errors,
      });
    }

    const { status } = validation.data;

    // Check if promoter exists
    const [promoter] = await db
      .select()
      .from(userProfiles)
      .where(
        and(
          eq(userProfiles.userId, id),
          eq(userProfiles.role, 'promoter')
        )
      )
      .limit(1);

    if (!promoter) {
      throw new NotFoundError('Promoter not found');
    }

    // Update status
    const [updatedPromoter] = await db
      .update(userProfiles)
      .set({
        promoterStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, id))
      .returning();

    // If suspended or banned, deactivate all their links
    if (status === 'suspended' || status === 'banned') {
      await db
        .update(promoterLinks)
        .set({ isActive: false })
        .where(eq(promoterLinks.promoterId, id));
    }

    res.json({
      message: 'Promoter status updated successfully',
      promoter: updatedPromoter,
    });
  } catch (error) {
    console.error('Error updating promoter status:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to update promoter status',
    });
  }
});

// ====================
// QR Code Validation (for check-in)
// ====================

/**
 * POST /api/admin/tickets/validate
 * Validate QR code at event entry
 */
router.post('/tickets/validate', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const validation = validateRequestBody(validateQRSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid QR data',
        details: validation.error.errors,
      });
    }

    const { ticketId, qrData } = validation.data;
    const adminUserId = req.user!.id;

    // Validate the QR code
    const validationResult = await QRCodeService.validateTicketQR(ticketId, qrData);

    if (!validationResult.valid) {
      return res.status(400).json({
        error: 'INVALID_QR',
        message: validationResult.error || 'Invalid QR code',
      });
    }

    // Mark ticket as scanned
    await QRCodeService.markTicketAsScanned(ticketId, adminUserId);

    // Fetch updated ticket details
    const [ticket] = await db
      .select({
        ticket: tickets,
        event: events,
      })
      .from(tickets)
      .innerJoin(events, eq(tickets.eventId, events.id))
      .where(eq(tickets.id, ticketId))
      .limit(1);

    res.json({
      message: 'Ticket validated successfully',
      valid: true,
      ticket: ticket.ticket,
      event: ticket.event,
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to validate QR code',
    });
  }
});

export { router as adminRoutes };
