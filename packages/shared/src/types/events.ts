/**
 * Event-related types shared across portals
 */

export type EventStatus = 'draft' | 'published' | 'sold_out' | 'cancelled' | 'completed';
export type AgeRestriction = 'none' | '18+' | '21+';
export type FloorNumber = '1' | '2' | '3';

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: Date | string;
  startTime: string;
  endTime?: string;
  venueId: string;
  floorNumber: FloorNumber;
  totalCapacity: number;
  capacity?: number; // Alias for totalCapacity (for compatibility)
  ticketsSold?: number; // Number of tickets sold (optional, computed)
  ageRestriction: AgeRestriction;
  coverPrice: number; // In cents
  presaleEnabled: boolean;
  doorSalesEnabled: boolean;
  presaleEndTime?: Date | string;
  affiliateCommissionEnabled: boolean;
  affiliateCommissionAmount: number; // In cents
  status: EventStatus;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  eventDate: Date | string;
  startTime: string;
  endTime?: string;
  venueId: string;
  floorNumber: FloorNumber;
  totalCapacity: number;
  ageRestriction?: AgeRestriction;
  coverPrice: number;
  presaleEnabled?: boolean;
  doorSalesEnabled?: boolean;
  presaleEndTime?: Date | string;
  affiliateCommissionEnabled?: boolean;
  affiliateCommissionAmount?: number;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
}
