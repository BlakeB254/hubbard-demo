export type TicketStatus = 'valid' | 'used' | 'refunded' | 'cancelled';
export type TicketType = 'presale' | 'door';

export interface Ticket {
  id: string;
  eventId: string;
  userId?: string;
  guestOrderId?: string;
  status: TicketStatus;
  type: TicketType;
  price: number;
  qrCode: string;
  totpSecret: string;
  affiliateLinkId?: string;
  stripePaymentId?: string;
  purchasedAt: string;
  usedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseTicketInput {
  eventId: string;
  quantity: number;
  type: TicketType;
  affiliateCode?: string;
}

export interface GuestTicketPurchase extends PurchaseTicketInput {
  email: string;
  name: string;
  phone?: string;
}

export interface TicketValidationResult {
  valid: boolean;
  ticket?: Ticket;
  event?: {
    id: string;
    name: string;
    date: string;
  };
  message: string;
}
