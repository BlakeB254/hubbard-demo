import { pgTable, text, timestamp, uuid, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { events } from './events.js';
import { userProfiles } from './users.js';

/**
 * Purchase Type Enum
 */
export const purchaseTypeEnum = pgEnum('purchase_type', ['presale', 'door']);

/**
 * Ticket Status Enum
 */
export const ticketStatusEnum = pgEnum('ticket_status', [
  'valid',      // Active and unused
  'used',       // Scanned and entry granted
  'refunded',   // Refunded to customer
  'cancelled',  // Cancelled by admin
]);

/**
 * Tickets Table
 * Individual ticket records for event entry
 */
export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Relationships
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  customerId: text('customer_id').notNull(), // Stack Auth user ID
  promoterId: text('promoter_id'), // Nullable - only if purchased via affiliate link

  // Purchase Information
  purchaseType: purchaseTypeEnum('purchase_type').notNull(),
  pricePaid: integer('price_paid').notNull(), // In cents
  affiliateCommissionEarned: integer('affiliate_commission_earned').default(0), // In cents

  // QR Code & Validation
  qrCode: text('qr_code').notNull().unique(),
  qrSecret: text('qr_secret').notNull(), // TOTP secret for time-based validation
  status: ticketStatusEnum('status').default('valid').notNull(),

  // Entry Tracking
  isScanned: boolean('is_scanned').default(false),
  scannedAt: timestamp('scanned_at', { withTimezone: true }),
  scannedBy: text('scanned_by'), // Admin user ID who scanned

  // Payment Metadata
  stripePaymentIntentId: text('stripe_payment_intent_id'),

  // Timestamps
  purchasedAt: timestamp('purchased_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
