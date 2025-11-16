import { Router, Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { authenticateRequest, AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/db.js';
import { tickets } from '../db/schema/tickets.js';
import { guestOrders } from '../db/schema/guest-orders.js';
import { sectionReservations, sections } from '../db/schema/sections.js';
import { stripeService } from '../services/stripe.js';
import { NotFoundError, AppError } from '../utils/errors.js';

const router = Router();

/**
 * Payment Routes
 * Stripe integration for ticket and section purchases
 */

// ====================
// Stripe Webhook Handler
// ====================

/**
 * POST /api/payments/stripe/webhook
 * Handle Stripe webhook events
 * IMPORTANT: This endpoint must NOT use authentication middleware
 */
router.post('/stripe/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Missing stripe-signature header',
      });
    }

    // Construct and verify webhook event
    const event = stripeService.constructWebhookEvent(
      req.body,
      signature as string
    );

    console.log(`Received Stripe webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await handlePaymentFailure(paymentIntent);
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        await handlePaymentCanceled(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);

    if (error instanceof Error && error.message.includes('signature')) {
      return res.status(400).json({
        error: 'INVALID_SIGNATURE',
        message: 'Invalid webhook signature',
      });
    }

    res.status(500).json({
      error: 'WEBHOOK_ERROR',
      message: 'Failed to process webhook',
    });
  }
});

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: any) {
  const { id: paymentIntentId, metadata } = paymentIntent;

  console.log('Processing successful payment:', paymentIntentId);

  // Check if this is a ticket purchase or section reservation
  if (metadata.eventId && !metadata.sectionId) {
    // Ticket purchase - tickets are already created, just need to update status
    // In this implementation, tickets are created optimistically
    // You could also create them here after payment confirmation
    await db
      .update(tickets)
      .set({ status: 'valid' })
      .where(eq(tickets.stripePaymentIntentId, paymentIntentId));

    console.log(`Tickets confirmed for payment ${paymentIntentId}`);
  } else if (metadata.sectionId) {
    // Section reservation - update deposit payment status
    await db
      .update(sectionReservations)
      .set({
        depositPaid: paymentIntent.amount,
        status: 'confirmed',
        updatedAt: new Date(),
      })
      .where(eq(sectionReservations.depositPaymentIntentId, paymentIntentId));

    console.log(`Section deposit confirmed for payment ${paymentIntentId}`);
  }

  // Update guest order if applicable
  if (metadata.guestEmail) {
    await db
      .update(guestOrders)
      .set({ updatedAt: new Date() })
      .where(eq(guestOrders.stripePaymentIntentId, paymentIntentId));
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent: any) {
  const { id: paymentIntentId, metadata } = paymentIntent;

  console.log('Processing failed payment:', paymentIntentId);

  // Mark tickets as cancelled if payment failed
  if (metadata.eventId && !metadata.sectionId) {
    await db
      .update(tickets)
      .set({ status: 'cancelled' })
      .where(eq(tickets.stripePaymentIntentId, paymentIntentId));

    console.log(`Tickets cancelled due to payment failure ${paymentIntentId}`);
  } else if (metadata.sectionId) {
    // Cancel section reservation
    await db.transaction(async (tx) => {
      // Update reservation status
      await tx
        .update(sectionReservations)
        .set({
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(sectionReservations.depositPaymentIntentId, paymentIntentId));

      // Free up the section
      await tx
        .update(sections)
        .set({ status: 'available' })
        .where(eq(sections.id, metadata.sectionId));
    });

    console.log(`Section reservation cancelled due to payment failure ${paymentIntentId}`);
  }
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(paymentIntent: any) {
  // Same handling as failed payment
  await handlePaymentFailure(paymentIntent);
}

// ====================
// Payment Status
// ====================

/**
 * GET /api/payments/status/:paymentId
 * Check the status of a payment
 */
router.get('/status/:paymentId', async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripeService.stripe.paymentIntents.retrieve(paymentId);

    // Get associated tickets or reservations
    const ticketsData = await db
      .select()
      .from(tickets)
      .where(eq(tickets.stripePaymentIntentId, paymentId));

    const reservationsData = await db
      .select()
      .from(sectionReservations)
      .where(eq(sectionReservations.depositPaymentIntentId, paymentId));

    res.json({
      paymentId,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: paymentIntent.created,
      tickets: ticketsData,
      reservations: reservationsData,
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to check payment status',
    });
  }
});

// ====================
// Create Checkout Session (Alternative to direct PaymentIntent)
// ====================

/**
 * POST /api/payments/stripe/checkout
 * Create a Stripe Checkout Session for ticket purchase
 * This is an alternative approach to PaymentIntents for a hosted checkout page
 */
router.post('/stripe/checkout', authenticateRequest, async (req: AuthenticatedRequest, res) => {
  try {
    const { eventId, quantity, successUrl, cancelUrl } = req.body;

    if (!eventId || !quantity) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'eventId and quantity are required',
      });
    }

    // This would create a Stripe Checkout Session
    // For now, we're using PaymentIntents in the customer routes
    // This is here as a placeholder for hosted checkout page implementation

    res.status(501).json({
      message: 'Checkout session creation not implemented - use PaymentIntent flow instead',
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to create checkout session',
    });
  }
});

// ====================
// Process Section Balance Payment
// ====================

/**
 * POST /api/payments/deposits/section
 * Process the remaining balance payment for a section reservation
 */
router.post('/deposits/section', authenticateRequest, async (req: AuthenticatedRequest, res) => {
  try {
    const { reservationId } = req.body;
    const userId = req.user!.id;

    if (!reservationId) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'reservationId is required',
      });
    }

    // Fetch reservation and verify ownership
    const [reservation] = await db
      .select()
      .from(sectionReservations)
      .where(
        and(
          eq(sectionReservations.id, reservationId),
          eq(sectionReservations.customerId, userId)
        )
      )
      .limit(1);

    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    if (reservation.status !== 'confirmed') {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Reservation must be confirmed before paying balance',
      });
    }

    if (reservation.balancePaidAt) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Balance already paid',
      });
    }

    // Create payment intent for balance
    const balanceAmount = reservation.balanceDue;
    const paymentIntent = await stripeService.createBalancePaymentIntent({
      amount: balanceAmount,
      customerEmail: req.user!.email,
      customerId: reservation.depositPaymentIntentId || '', // Use saved payment method
      metadata: {
        reservationId: reservation.id,
        sectionId: reservation.sectionId,
      },
    });

    // Update reservation with balance payment intent
    await db
      .update(sectionReservations)
      .set({
        balancePaymentIntentId: paymentIntent.id,
        updatedAt: new Date(),
      })
      .where(eq(sectionReservations.id, reservationId));

    res.json({
      message: 'Balance payment initiated',
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: balanceAmount,
    });
  } catch (error) {
    console.error('Error processing balance payment:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to process balance payment',
    });
  }
});

export { router as paymentRoutes };
