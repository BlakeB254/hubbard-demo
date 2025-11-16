/**
 * Payment-related types shared across portals
 */

export interface PaymentIntent {
  id: string;
  amount: number; // In cents
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  clientSecret: string;
}

export interface CreatePaymentIntentInput {
  amount: number; // In cents
  eventId: string;
  ticketCount?: number;
  sectionId?: string;
  promoterCode?: string;
}

export interface StripeCheckoutSession {
  sessionId: string;
  publicKey: string;
  clientSecret: string;
}

export interface PaymentWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      amount: number;
      metadata: Record<string, string>;
    };
  };
}
