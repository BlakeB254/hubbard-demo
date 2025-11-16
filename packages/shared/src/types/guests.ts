/**
 * Guest order types for non-authenticated users
 */

import type { Ticket } from './tickets';

export interface GuestOrder {
  id: string;
  orderNumber: string;
  guestEmail: string;
  guestName?: string;
  guestPhone?: string;
  createdAt: Date | string;
}

export interface GuestTicket extends Ticket {
  guestOrderId: string;
  guestEmail: string;
}

export interface GuestOrderLookup {
  email: string;
  orderNumber: string;
}
