import { pgTable, text, timestamp, uuid, pgEnum, integer } from 'drizzle-orm/pg-core';

/**
 * User Roles Enum
 * - admin: Full system access
 * - customer: Can purchase tickets and reserve sections
 * - promoter: Can create affiliate links and track earnings
 */
export const roleEnum = pgEnum('role', ['admin', 'customer', 'promoter']);

/**
 * Promoter Status Enum
 * - pending: Awaiting approval
 * - active: Approved and can create links
 * - suspended: Temporarily disabled
 * - banned: Permanently disabled
 */
export const promoterStatusEnum = pgEnum('promoter_status', ['pending', 'active', 'suspended', 'banned']);

/**
 * User Profiles Table
 * Extended user information linked to Stack Auth users
 *
 * Note: Stack Auth manages the core user authentication in neon_auth.users_sync
 * This table stores additional application-specific user data
 */
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique(), // References Stack Auth user
  role: roleEnum('role').notNull().default('customer'),

  // Contact Information
  phone: text('phone'),

  // Customer-specific fields
  loyaltyPoints: integer('loyalty_points').default(0),
  preferences: text('preferences'), // JSON string for user preferences

  // Promoter-specific fields
  promoterStatus: promoterStatusEnum('promoter_status'),
  commissionRate: integer('commission_rate').default(10), // Percentage (e.g., 10 = 10%)
  totalEarnings: integer('total_earnings').default(0), // In cents

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

// Type exports
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
