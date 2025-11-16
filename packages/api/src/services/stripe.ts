import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Make Stripe optional for development
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const isStripeConfigured = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key';

/**
 * Stripe Service
 * Handles all Stripe payment operations
 */
const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

/**
 * Create Payment Intent for Ticket Purchase
 */
const createTicketPaymentIntent = async (
  amount: number,
  metadata: {
    eventId: string;
    customerId: string;
    promoterId?: string;
    ticketCount: number;
  }
): Promise<Stripe.PaymentIntent> => {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    payment_method_types: ['card'],
    metadata,
  });
};

/**
 * Create Payment Intent for Section Deposit
 */
const createDepositPaymentIntent = async (
  totalAmount: number,
  depositAmount: number,
  metadata: {
    sectionId: string;
    eventId: string;
    customerId: string;
    reservationId: string;
  }
): Promise<Stripe.PaymentIntent> => {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  return await stripe.paymentIntents.create({
    amount: Math.round(depositAmount * 100), // Deposit in cents
    currency: 'usd',
    payment_method_types: ['card'],
    setup_future_usage: 'off_session', // Save for balance payment
    metadata: {
      ...metadata,
      totalAmount: totalAmount.toString(),
      depositAmount: depositAmount.toString(),
      remainingAmount: (totalAmount - depositAmount).toString(),
      paymentType: 'deposit',
    },
  });
};

/**
 * Create Payment Intent for Balance Payment
 */
const createBalancePaymentIntent = async (
  balanceAmount: number,
  customerId: string,
  paymentMethodId: string,
  metadata: {
    sectionId: string;
    eventId: string;
    reservationId: string;
  }
): Promise<Stripe.PaymentIntent> => {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  return await stripe.paymentIntents.create({
    amount: Math.round(balanceAmount * 100),
    currency: 'usd',
    customer: customerId,
    payment_method: paymentMethodId,
    off_session: true,
    confirm: true,
    metadata: {
      ...metadata,
      paymentType: 'balance',
    },
  });
};

/**
 * Verify Webhook Signature
 */
const constructWebhookEvent = (
  payload: string | Buffer,
  signature: string
): Stripe.Event => {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
};

/**
 * Refund Payment
 */
const refundPayment = async (
  paymentIntentId: string,
  reason?: Stripe.RefundCreateParams.Reason
): Promise<Stripe.Refund> => {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    reason: reason || 'requested_by_customer',
  });
};

// Export service object for imports like: import { stripeService } from './stripe'
export const stripeService = {
  stripe,
  createTicketPaymentIntent,
  createDepositPaymentIntent,
  createBalancePaymentIntent,
  constructWebhookEvent,
  refundPayment,
};

// Also export individual functions for convenience
export { stripe, createTicketPaymentIntent, createDepositPaymentIntent, createBalancePaymentIntent, constructWebhookEvent, refundPayment };
