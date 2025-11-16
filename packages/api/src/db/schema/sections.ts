import { pgTable, text, timestamp, uuid, integer, boolean, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { events } from './events.js';

/**
 * Section Status Enum
 */
export const sectionStatusEnum = pgEnum('section_status', [
  'available',  // Open for reservation
  'reserved',   // Deposit paid, awaiting event
  'occupied',   // Currently in use at event
  'blocked',    // Blocked by admin (maintenance, etc.)
]);

/**
 * Sections Table
 * VIP sections for bottle service reservations
 */
export const sections = pgTable('sections', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Relationships
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),

  // Section Information
  sectionName: text('section_name').notNull(), // e.g., "VIP 1", "Balcony A"
  floorPlanPosition: jsonb('floor_plan_position'), // { x: number, y: number } for UI
  capacity: integer('capacity').notNull(), // Max people per section

  // Pricing
  bottleMinimum: integer('bottle_minimum').notNull(), // In cents
  depositRequired: boolean('deposit_required').default(true),
  depositAmount: integer('deposit_amount').default(50000), // In cents (default $500)

  // Availability
  status: sectionStatusEnum('status').default('available').notNull(),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Reservation Status Enum
 */
export const reservationStatusEnum = pgEnum('reservation_status', [
  'pending',    // Created but deposit not paid
  'confirmed',  // Deposit paid
  'completed',  // Event finished, balance settled
  'cancelled',  // Cancelled by customer or admin
  'no_show',    // Customer didn't show up
]);

/**
 * Section Reservations Table
 * Bottle service reservations with deposit tracking
 */
export const sectionReservations = pgTable('section_reservations', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Relationships
  sectionId: uuid('section_id')
    .notNull()
    .references(() => sections.id, { onDelete: 'cascade' }),
  customerId: text('customer_id').notNull(), // Stack Auth user ID

  // Bottle Selection
  bottlesSelected: jsonb('bottles_selected').notNull(), // Array of { name: string, price: number, quantity: number }
  totalCost: integer('total_cost').notNull(), // In cents

  // Payment Tracking
  depositPaid: integer('deposit_paid').default(0), // In cents
  balanceDue: integer('balance_due').notNull(), // In cents
  balancePaidAt: timestamp('balance_paid_at', { withTimezone: true }),

  // Payment IDs
  depositPaymentIntentId: text('deposit_payment_intent_id'),
  balancePaymentIntentId: text('balance_payment_intent_id'),

  // Status
  status: reservationStatusEnum('status').default('pending').notNull(),

  // Metadata
  specialRequests: text('special_requests'),
  guestCount: integer('guest_count').notNull(),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports
export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;
export type SectionReservation = typeof sectionReservations.$inferSelect;
export type NewSectionReservation = typeof sectionReservations.$inferInsert;
