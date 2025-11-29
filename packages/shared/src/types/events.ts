export type EventStatus = 'draft' | 'published' | 'sold_out' | 'cancelled' | 'completed';
export type EventFloor = 'main' | 'rooftop' | 'private';
export type AgeRestriction = 'none' | '18+' | '21+';
export type SalesMode = 'presale' | 'door' | 'both';

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  floor: EventFloor;
  status: EventStatus;
  imageUrl?: string;
  presalePrice: number;
  doorPrice: number;
  capacity: number;
  ticketsSold: number;
  ageRestriction: AgeRestriction;
  salesMode: SalesMode;
  affiliateCommission: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  floor: EventFloor;
  presalePrice: number;
  doorPrice: number;
  capacity: number;
  ageRestriction: AgeRestriction;
  salesMode: SalesMode;
  affiliateCommission?: number;
  imageUrl?: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
}

export interface EventFilters {
  floor?: EventFloor;
  status?: EventStatus;
  date?: string;
  search?: string;
}
