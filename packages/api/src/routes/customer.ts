import { Router } from 'express';
import { eq, and, gte, sql } from 'drizzle-orm';
import { authenticateRequest, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/db.js';
import { events } from '../db/schema/events.js';
import { tickets } from '../db/schema/tickets.js';
import { sections, sectionReservations } from '../db/schema/sections.js';
import { guestOrders } from '../db/schema/guest-orders.js';
import { promoterLinks, analytics } from '../db/schema/promoters.js';
import { userProfiles } from '../db/schema/users.js';
import { QRCodeService } from '../services/qr-code.js';
import { stripeService } from '../services/stripe.js';
import { generateOrderNumber, calculateCommission } from '../utils/helpers.js';
import {
  eventQuerySchema,
  ticketPurchaseSchema,
  orderLookupSchema,
  sectionReservationSchema,
  validateRequestBody,
} from '../utils/validation.js';
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  AppError,
} from '../utils/errors.js';
import { stackServerApp } from '../config/stack.js';

const router = Router();

/**
 * Customer Routes
 * Public routes for browsing, authenticated routes for purchasing
 */

// ====================
// Event Discovery (Public)
// ====================

/**
 * GET /api/customer/events
 * List upcoming published events with optional filters
 */
router.get('/events', async (req, res) => {
  try {
    const validation = validateRequestBody(eventQuerySchema, req.query);
    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: validation.error.errors,
      });
    }

    const { status, floorNumber, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [
      status ? eq(events.status, status) : eq(events.status, 'published'),
      floorNumber ? eq(events.floorNumber, floorNumber) : undefined,
      gte(events.eventDate, new Date()), // Only future events
    ].filter(Boolean);

    // Fetch events
    const eventsList = await db
      .select()
      .from(events)
      .where(and(...conditions))
      .orderBy(events.eventDate)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(events)
      .where(and(...conditions));

    res.json({
      events: eventsList,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
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

/**
 * GET /api/customer/events/:id
 * Get detailed information about a specific event
 */
router.get('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!event) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Event not found',
      });
    }

    // Calculate tickets available
    const [{ sold }] = await db
      .select({ sold: sql<number>`count(*)::int` })
      .from(tickets)
      .where(
        and(
          eq(tickets.eventId, id),
          eq(tickets.status, 'valid')
        )
      );

    const ticketsAvailable = event.totalCapacity - (sold || 0);

    res.json({
      ...event,
      ticketsSold: sold || 0,
      ticketsAvailable,
    });
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch event details',
    });
  }
});

// ====================
// Ticket Purchase (Guest or Authenticated)
// ====================

/**
 * POST /api/customer/tickets/purchase
 * Purchase tickets for an event
 * Supports both authenticated users and guest checkout
 */
router.post('/tickets/purchase', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    // Validate request body
    const validation = validateRequestBody(ticketPurchaseSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: validation.error.errors,
      });
    }

    const { eventId, quantity, promoterCode, guestInfo } = validation.data;

    // Check if user is authenticated or if guest info is provided
    const userId = req.user?.id;
    if (!userId && !guestInfo?.email) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Email required for guest checkout',
      });
    }

    // Fetch event details
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (event.status !== 'published') {
      throw new ConflictError('Event is not available for ticket sales');
    }

    // Check ticket availability
    const [{ sold }] = await db
      .select({ sold: sql<number>`count(*)::int` })
      .from(tickets)
      .where(
        and(
          eq(tickets.eventId, eventId),
          eq(tickets.status, 'valid')
        )
      );

    const availableTickets = event.totalCapacity - (sold || 0);
    if (availableTickets < quantity) {
      throw new ConflictError(`Only ${availableTickets} tickets available`);
    }

    // Validate promoter code if provided
    let promoterLink = null;
    let promoterId = null;
    if (promoterCode) {
      const [link] = await db
        .select()
        .from(promoterLinks)
        .where(
          and(
            eq(promoterLinks.uniqueCode, promoterCode),
            eq(promoterLinks.eventId, eventId),
            eq(promoterLinks.isActive, true)
          )
        )
        .limit(1);

      if (link) {
        promoterLink = link;
        promoterId = link.promoterId;
      }
    }

    // Calculate pricing
    const ticketPrice = event.coverPrice;
    const totalCost = ticketPrice * quantity;
    const commissionPerTicket = promoterLink
      ? calculateCommission(ticketPrice, event.affiliateCommissionAmount || 0)
      : 0;

    // Create Stripe payment intent
    const paymentIntent = await stripeService.createTicketPaymentIntent({
      amount: totalCost,
      customerEmail: guestInfo?.email || req.user?.email || '',
      metadata: {
        eventId,
        customerId: userId || 'guest',
        guestEmail: guestInfo?.email || '',
        quantity: quantity.toString(),
        promoterCode: promoterCode || '',
        promoterId: promoterId || '',
      },
    });

    // Create guest order if no user ID
    let guestOrderId = null;
    if (!userId && guestInfo) {
      const [guestOrder] = await db
        .insert(guestOrders)
        .values({
          orderNumber: generateOrderNumber(),
          guestEmail: guestInfo.email,
          guestName: guestInfo.name,
          guestPhone: guestInfo.phone,
          totalAmount: totalCost,
          stripePaymentIntentId: paymentIntent.id,
        })
        .returning();

      guestOrderId = guestOrder.id;
    }

    // Create tickets in a transaction
    await db.transaction(async (tx) => {
      // Create tickets
      const ticketData = Array.from({ length: quantity }, () => ({
        eventId,
        customerId: userId || null,
        guestOrderId: guestOrderId,
        promoterId: promoterId,
        purchaseType: 'presale' as const,
        pricePaid: ticketPrice,
        affiliateCommissionEarned: commissionPerTicket,
        stripePaymentIntentId: paymentIntent.id,
        qrCode: '', // Will be updated after QR generation
        qrSecret: '', // Will be updated after QR generation
      }));

      const createdTickets = await tx.insert(tickets).values(ticketData).returning();

      // Generate QR codes for each ticket
      for (const ticket of createdTickets) {
        const { qrCodeDataUrl, qrSecret } = await QRCodeService.generateTicketQR(
          ticket.id,
          userId || guestOrderId || ''
        );

        await tx
          .update(tickets)
          .set({ qrCode: qrCodeDataUrl, qrSecret })
          .where(eq(tickets.id, ticket.id));
      }

      // Update promoter link stats if used
      if (promoterLink) {
        await tx
          .update(promoterLinks)
          .set({
            conversions: sql`${promoterLinks.conversions} + ${quantity}`,
            revenueGenerated: sql`${promoterLinks.revenueGenerated} + ${totalCost}`,
          })
          .where(eq(promoterLinks.id, promoterLink.id));

        // Update promoter earnings
        const totalCommission = commissionPerTicket * quantity;
        await tx
          .update(userProfiles)
          .set({
            totalEarnings: sql`${userProfiles.totalEarnings} + ${totalCommission}`,
          })
          .where(eq(userProfiles.userId, promoterId!));

        // Create analytics records
        for (const ticket of createdTickets) {
          await tx.insert(analytics).values({
            promoterLinkId: promoterLink.id,
            eventId,
            eventType: 'conversion',
            ticketId: ticket.id,
            revenue: ticketPrice,
            commission: commissionPerTicket,
          });
        }
      }
    });

    res.json({
      message: 'Tickets created successfully',
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      totalCost,
      quantity,
      ...(guestOrderId && { orderNumber: (await db.select().from(guestOrders).where(eq(guestOrders.id, guestOrderId)).limit(1))[0]?.orderNumber }),
    });
  } catch (error) {
    console.error('Error purchasing tickets:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to process ticket purchase',
    });
  }
});

/**
 * GET /api/customer/tickets/my-tickets
 * Get all tickets for the authenticated user
 */
router.get('/tickets/my-tickets', authenticateRequest, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const userTickets = await db
      .select({
        ticket: tickets,
        event: events,
      })
      .from(tickets)
      .innerJoin(events, eq(tickets.eventId, events.id))
      .where(eq(tickets.customerId, userId))
      .orderBy(tickets.createdAt);

    res.json({ tickets: userTickets });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch tickets',
    });
  }
});

/**
 * GET /api/customer/orders/lookup
 * Lookup guest order by email and order number
 */
router.get('/orders/lookup', async (req, res) => {
  try {
    const validation = validateRequestBody(orderLookupSchema, req.query);
    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: validation.error.errors,
      });
    }

    const { email, orderNumber } = validation.data;

    const [order] = await db
      .select()
      .from(guestOrders)
      .where(
        and(
          eq(guestOrders.guestEmail, email),
          eq(guestOrders.orderNumber, orderNumber)
        )
      )
      .limit(1);

    if (!order) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Order not found',
      });
    }

    // Fetch tickets for this order
    const orderTickets = await db
      .select({
        ticket: tickets,
        event: events,
      })
      .from(tickets)
      .innerJoin(events, eq(tickets.eventId, events.id))
      .where(eq(tickets.guestOrderId, order.id));

    res.json({
      order,
      tickets: orderTickets,
    });
  } catch (error) {
    console.error('Error looking up order:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to lookup order',
    });
  }
});

/**
 * GET /api/customer/tickets/:id/qr
 * Get QR code for a specific ticket
 */
router.get('/tickets/:id/qr', authenticateRequest, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [ticket] = await db
      .select()
      .from(tickets)
      .where(
        and(
          eq(tickets.id, id),
          eq(tickets.customerId, userId)
        )
      )
      .limit(1);

    if (!ticket) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Ticket not found',
      });
    }

    res.json({
      qrCode: ticket.qrCode,
      ticketId: ticket.id,
      status: ticket.status,
      isScanned: ticket.isScanned,
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch QR code',
    });
  }
});

// ====================
// Section/Bottle Service (Guest or Authenticated)
// ====================

/**
 * GET /api/customer/sections/:eventId
 * Get available sections for an event
 */
router.get('/sections/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    // Verify event exists
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Event not found',
      });
    }

    // Fetch sections for this event
    const eventSections = await db
      .select()
      .from(sections)
      .where(eq(sections.eventId, eventId));

    res.json({ sections: eventSections });
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch sections',
    });
  }
});

/**
 * POST /api/customer/sections/reserve
 * Reserve a VIP section for bottle service
 * Supports both authenticated users and guest reservations
 */
router.post('/sections/reserve', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const validation = validateRequestBody(sectionReservationSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: validation.error.errors,
      });
    }

    const { eventId, sectionId, bottlesSelected, guestCount, specialRequests, guestInfo } = validation.data;

    const userId = req.user?.id;
    if (!userId && !guestInfo?.email) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Email required for guest reservations',
      });
    }

    // Verify section is available
    const [section] = await db
      .select()
      .from(sections)
      .where(
        and(
          eq(sections.id, sectionId),
          eq(sections.eventId, eventId),
          eq(sections.status, 'available')
        )
      )
      .limit(1);

    if (!section) {
      throw new NotFoundError('Section not available');
    }

    // Calculate total cost
    const totalCost = bottlesSelected.reduce((sum, bottle) => sum + bottle.price * bottle.quantity, 0);

    if (totalCost < section.bottleMinimum) {
      throw new BadRequestError(`Total must meet bottle minimum of ${section.bottleMinimum / 100}`);
    }

    // Create deposit payment intent
    const depositAmount = section.depositRequired ? section.depositAmount : 0;
    const paymentIntent = await stripeService.createDepositPaymentIntent({
      depositAmount,
      totalAmount: totalCost,
      customerEmail: guestInfo?.email || req.user?.email || '',
      metadata: {
        sectionId,
        eventId,
        customerId: userId || 'guest',
        guestEmail: guestInfo?.email || '',
      },
    });

    // Create guest order if no user ID
    let guestOrderId = null;
    if (!userId && guestInfo) {
      const [guestOrder] = await db
        .insert(guestOrders)
        .values({
          orderNumber: generateOrderNumber(),
          guestEmail: guestInfo.email,
          guestName: guestInfo.name,
          guestPhone: guestInfo.phone,
          totalAmount: totalCost,
          stripePaymentIntentId: paymentIntent.id,
        })
        .returning();

      guestOrderId = guestOrder.id;
    }

    // Create reservation
    await db.transaction(async (tx) => {
      await tx.insert(sectionReservations).values({
        sectionId,
        customerId: userId || null,
        guestOrderId,
        guestEmail: guestInfo?.email,
        guestName: guestInfo?.name,
        guestPhone: guestInfo?.phone,
        bottlesSelected,
        totalCost,
        depositPaid: 0,
        balanceDue: totalCost,
        depositPaymentIntentId: paymentIntent.id,
        guestCount,
        specialRequests,
      });

      // Update section status
      await tx
        .update(sections)
        .set({ status: 'reserved' })
        .where(eq(sections.id, sectionId));
    });

    res.json({
      message: 'Section reserved successfully',
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      depositAmount,
      totalCost,
      ...(guestOrderId && { orderNumber: (await db.select().from(guestOrders).where(eq(guestOrders.id, guestOrderId)).limit(1))[0]?.orderNumber }),
    });
  } catch (error) {
    console.error('Error reserving section:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to reserve section',
    });
  }
});

/**
 * GET /api/customer/profile/loyalty
 * Get loyalty points for authenticated user
 */
router.get('/profile/loyalty', authenticateRequest, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (!profile) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User profile not found',
      });
    }

    res.json({
      loyaltyPoints: profile.loyaltyPoints,
      userId: profile.userId,
    });
  } catch (error) {
    console.error('Error fetching loyalty points:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch loyalty points',
    });
  }
});

export { router as customerRoutes };
