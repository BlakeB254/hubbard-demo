import { pgTable, text, timestamp, uuid, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

/**
 * Event Status Enum
 */
export const eventStatusEnum = pgEnum('event_status', [
  'draft',       // Being created, not visible to customers
  'published',   // Live and accepting sales
  'sold_out',    // At capacity
  'cancelled',   // Event cancelled
  'completed',   // Event has passed
]);

/**
 * Age Restriction Enum
 */
export const ageRestrictionEnum = pgEnum('age_restriction', ['none', '18+', '21+']);

/**
 * Floor Number Enum (Hubbard Inn has 3 floors)
 */
export const floorNumberEnum = pgEnum('floor_number', ['1', '2', '3']);

/**
 * Events Table
 * Core event information for ticket sales and management
 */
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Basic Information
  title: text('title').notNull(),
  description: text('description'),

  // Date & Time
  eventDate: timestamp('event_date', { withTimezone: true }).notNull(),
  startTime: text('start_time').notNull(), // Format: "HH:MM" (e.g., "21:00")
  endTime: text('end_time'), // Format: "HH:MM" (e.g., "02:00")

  // Venue Information
  venueId: uuid('venue_id').notNull(), // Future-proof for multiple venues
  floorNumber: floorNumberEnum('floor_number').notNull(),

  // Capacity & Restrictions
  totalCapacity: integer('total_capacity').notNull(),
  ageRestriction: ageRestrictionEnum('age_restriction').default('21+').notNull(),

  // Pricing
  coverPrice: integer('cover_price').notNull(), // In cents (e.g., 2000 = $20.00)

  // Sales Configuration
  presaleEnabled: boolean('presale_enabled').default(true),
  doorSalesEnabled: boolean('door_sales_enabled').default(true),
  presaleEndTime: timestamp('presale_end_time', { withTimezone: true }),

  // Affiliate/Promoter Configuration
  affiliateCommissionEnabled: boolean('affiliate_commission_enabled').default(true),
  affiliateCommissionAmount: integer('affiliate_commission_amount').default(500), // In cents

  // Status & Metadata
  status: eventStatusEnum('status').default('draft').notNull(),
  createdBy: text('created_by').notNull(), // Admin user ID

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
