import { pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';
import { events } from './events';
import { userProfiles } from './users';

/**
 * Promoter Links Table
 * Unique affiliate tracking links for promoters
 */
export const promoterLinks = pgTable('promoter_links', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Relationships
  promoterId: text('promoter_id').notNull(), // Stack Auth user ID
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),

  // Link Information
  uniqueCode: text('unique_code').notNull().unique(), // e.g., "PROMO2024ABC"
  customUrl: text('custom_url'), // Optional custom slug

  // Tracking Metrics
  clicks: integer('clicks').default(0),
  conversions: integer('conversions').default(0), // Completed purchases
  revenueGenerated: integer('revenue_generated').default(0), // In cents

  // Settings
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at', { withTimezone: true }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Analytics Table
 * Detailed tracking of promoter link performance
 */
export const analytics = pgTable('analytics', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Relationships
  promoterLinkId: uuid('promoter_link_id')
    .notNull()
    .references(() => promoterLinks.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),

  // Event Metadata
  eventType: text('event_type').notNull(), // 'click' | 'purchase' | 'conversion'

  // Visitor Information (anonymous)
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),

  // Conversion Data (if applicable)
  ticketId: uuid('ticket_id'), // Reference to ticket if conversion
  revenue: integer('revenue'), // In cents, if conversion
  commission: integer('commission'), // In cents, if conversion

  // Timestamps
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports
export type PromoterLink = typeof promoterLinks.$inferSelect;
export type NewPromoterLink = typeof promoterLinks.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;
export type NewAnalytics = typeof analytics.$inferInsert;
