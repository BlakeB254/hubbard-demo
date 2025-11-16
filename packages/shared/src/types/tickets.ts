/**
 * Ticket-related types shared across portals
 */

export type PurchaseType = 'presale' | 'door';
export type TicketStatus = 'valid' | 'used' | 'refunded' | 'cancelled';

export interface Ticket {
  id: string;
  eventId: string;
  customerId: string;
  promoterId?: string;
  purchaseType: PurchaseType;
  pricePaid: number; // In cents
  affiliateCommissionEarned: number; // In cents
  qrCode: string;
  status: TicketStatus;
  isScanned: boolean;
  scannedAt?: Date | string;
  scannedBy?: string;
  stripePaymentIntentId?: string;
  purchasedAt: Date | string;
  createdAt: Date | string;
}

export interface PurchaseTicketInput {
  eventId: string;
  quantity: number;
  promoterCode?: string;
}

export interface TicketWithEvent extends Ticket {
  event: {
    id: string;
    title: string;
    eventDate: Date | string;
    startTime: string;
    venueId: string;
    floorNumber: string;
  };
}

export interface QRValidationResult {
  valid: boolean;
  message: string;
  ticketId?: string;
}
