export type UserRole = 'admin' | 'customer' | 'promoter';
export type PromoterStatus = 'pending' | 'approved' | 'suspended' | 'rejected';

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  // Customer fields
  loyaltyPoints?: number;
  preferences?: CustomerPreferences;
  // Promoter fields
  promoterStatus?: PromoterStatus;
  commissionRate?: number;
  totalEarnings?: number;
  payoutDetails?: PayoutDetails;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPreferences {
  preferredFloor?: string;
  newsletter: boolean;
  smsNotifications: boolean;
}

export interface PayoutDetails {
  method: 'bank' | 'paypal' | 'venmo';
  accountDetails: string;
}

export interface CreateUserProfileInput {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateUserProfileInput {
  name?: string;
  phone?: string;
  preferences?: CustomerPreferences;
  payoutDetails?: PayoutDetails;
}
