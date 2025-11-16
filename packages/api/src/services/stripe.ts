import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

/**
 * Stripe Service
 * Handles all Stripe payment operations
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

/**
 * Create Payment Intent for Ticket Purchase
 */
export const createTicketPaymentIntent = async (
  amount: number,
  metadata: {
    eventId: string;
    customerId: string;
    promoterId?: string;
    ticketCount: number;
  }
): Promise<Stripe.PaymentIntent> => {
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
export const createDepositPaymentIntent = async (
  totalAmount: number,
  depositAmount: number,
  metadata: {
    sectionId: string;
    eventId: string;
    customerId: string;
    reservationId: string;
  }
): Promise<Stripe.PaymentIntent> => {
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
export const createBalancePaymentIntent = async (
  balanceAmount: number,
  customerId: string,
  paymentMethodId: string,
  metadata: {
    sectionId: string;
    eventId: string;
    reservationId: string;
  }
): Promise<Stripe.PaymentIntent> => {
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
export const constructWebhookEvent = (
  payload: string | Buffer,
  signature: string
): Stripe.Event => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
};

/**
 * Refund Payment
 */
export const refundPayment = async (
  paymentIntentId: string,
  reason?: Stripe.RefundCreateParams.Reason
): Promise<Stripe.Refund> => {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    reason: reason || 'requested_by_customer',
  });
};
