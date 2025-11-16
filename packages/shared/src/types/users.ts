/**
 * User-related types shared across portals
 */

export type UserRole = 'admin' | 'customer' | 'promoter';
export type PromoterStatus = 'pending' | 'active' | 'suspended' | 'banned';

export interface UserProfile {
  id: string;
  userId: string; // Stack Auth user ID
  role: UserRole;
  phone?: string;
  loyaltyPoints?: number;
  preferences?: string; // JSON string
  promoterStatus?: PromoterStatus;
  commissionRate?: number; // Percentage
  totalEarnings?: number; // In cents
  createdAt: Date | string;
  updatedAt: Date | string;
  lastLoginAt?: Date | string;
}

export interface CreateUserProfileInput {
  userId: string;
  role: UserRole;
  phone?: string;
  commissionRate?: number;
}

export interface UpdateUserProfileInput extends Partial<CreateUserProfileInput> {
  promoterStatus?: PromoterStatus;
  loyaltyPoints?: number;
}
