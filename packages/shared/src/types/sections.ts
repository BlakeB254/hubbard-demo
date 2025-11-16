/**
 * Section (Bottle Service) related types shared across portals
 */

export type SectionStatus = 'available' | 'reserved' | 'occupied' | 'blocked';
export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Section {
  id: string;
  eventId: string;
  sectionName: string;
  floorPlanPosition?: { x: number; y: number };
  capacity: number;
  bottleMinimum: number; // In cents
  depositRequired: boolean;
  depositAmount: number; // In cents
  status: SectionStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Bottle {
  name: string;
  price: number; // In cents
  quantity: number;
}

export interface SectionReservation {
  id: string;
  sectionId: string;
  customerId: string;
  bottlesSelected: Bottle[];
  totalCost: number; // In cents
  depositPaid: number; // In cents
  balanceDue: number; // In cents
  balancePaidAt?: Date | string;
  depositPaymentIntentId?: string;
  balancePaymentIntentId?: string;
  status: ReservationStatus;
  specialRequests?: string;
  guestCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateSectionReservationInput {
  sectionId: string;
  bottlesSelected: Bottle[];
  guestCount: number;
  specialRequests?: string;
}
