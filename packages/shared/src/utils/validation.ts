import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Please enter a valid email address');

/**
 * Phone validation schema (US format)
 */
export const phoneSchema = z.string().regex(
  /^(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
  'Please enter a valid phone number'
).optional();

/**
 * Event creation schema
 */
export const createEventSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  floor: z.enum(['main', 'rooftop', 'private']),
  presalePrice: z.number().min(0),
  doorPrice: z.number().min(0),
  capacity: z.number().min(1),
  ageRestriction: z.enum(['none', '18+', '21+']),
  salesMode: z.enum(['presale', 'door', 'both']),
  affiliateCommission: z.number().min(0).max(100).optional(),
  imageUrl: z.string().url().optional(),
});

/**
 * Ticket purchase schema
 */
export const purchaseTicketSchema = z.object({
  eventId: z.string().uuid(),
  quantity: z.number().min(1).max(10),
  type: z.enum(['presale', 'door']),
  affiliateCode: z.string().optional(),
});

/**
 * Guest checkout schema
 */
export const guestCheckoutSchema = purchaseTicketSchema.extend({
  email: emailSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: phoneSchema,
});

/**
 * Promoter link creation schema
 */
export const createPromoterLinkSchema = z.object({
  eventId: z.string().uuid(),
  customCode: z.string().min(4).max(20).regex(/^[A-Z0-9]+$/i).optional(),
  expiresAt: z.string().datetime().optional(),
});
