import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

/**
 * Guest Orders Table
 * Tracks orders made by unauthenticated users (guest checkout)
 */
export const guestOrders = pgTable('guest_orders', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Unique order identifier for guest lookup
  orderNumber: text('order_number').notNull().unique(),

  // Guest Information
  guestEmail: text('guest_email').notNull(),
  guestName: text('guest_name'),
  guestPhone: text('guest_phone'),

  // Payment Information
  totalAmount: integer('total_amount').notNull(), // Total in cents
  stripePaymentIntentId: text('stripe_payment_intent_id'),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports
export type GuestOrder = typeof guestOrders.$inferSelect;
export type NewGuestOrder = typeof guestOrders.$inferInsert;
