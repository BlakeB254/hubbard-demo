export type SectionStatus = 'available' | 'reserved' | 'occupied' | 'blocked';
export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Section {
  id: string;
  eventId: string;
  name: string;
  capacity: number;
  minimumSpend: number;
  depositAmount: number;
  status: SectionStatus;
  floorPlanPosition?: FloorPlanPosition;
  createdAt: string;
  updatedAt: string;
}

export interface FloorPlanPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SectionReservation {
  id: string;
  sectionId: string;
  eventId: string;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: ReservationStatus;
  depositPaid: number;
  balanceDue: number;
  totalAmount: number;
  bottles?: BottleSelection[];
  stripeDepositPaymentId?: string;
  stripeBalancePaymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BottleSelection {
  name: string;
  price: number;
  quantity: number;
}

export interface CreateReservationInput {
  sectionId: string;
  eventId: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  bottles?: BottleSelection[];
  notes?: string;
}
