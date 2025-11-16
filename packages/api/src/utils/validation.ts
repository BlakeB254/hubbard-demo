import { z } from 'zod';

/**
 * Common validation schemas
 */
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number').min(10);
export const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * Event validation schemas
 */
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  eventDate: z.string().datetime('Invalid date format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)').optional(),
  floorNumber: z.enum(['1', '2', '3'], { errorMap: () => ({ message: 'Floor must be 1, 2, or 3' }) }),
  totalCapacity: z.number().int().positive().max(500, 'Capacity cannot exceed 500'),
  ageRestriction: z.enum(['none', '18+', '21+']).default('21+'),
  coverPrice: z.number().int().positive('Cover price must be positive'),
  presaleEnabled: z.boolean().default(true),
  presaleEndTime: z.string().datetime().optional(),
  doorSalesEnabled: z.boolean().default(true),
  affiliateCommissionEnabled: z.boolean().default(true),
  affiliateCommissionAmount: z.number().int().positive().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const eventQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'sold_out', 'cancelled', 'completed']).optional(),
  floorNumber: z.enum(['1', '2', '3']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
});

/**
 * Ticket purchase validation schemas
 */
export const guestInfoSchema = z.object({
  email: emailSchema,
  name: z.string().min(1, 'Name is required').max(100),
  phone: phoneSchema.optional(),
});

export const ticketPurchaseSchema = z.object({
  eventId: uuidSchema,
  quantity: z.number().int().positive().max(10, 'Maximum 10 tickets per purchase'),
  promoterCode: z.string().length(8).optional(),
  guestInfo: guestInfoSchema.optional(),
});

/**
 * Order lookup validation schema
 */
export const orderLookupSchema = z.object({
  email: emailSchema,
  orderNumber: z.string().regex(/^ORD-\d{8}-[A-F0-9]{6}$/, 'Invalid order number format'),
});

/**
 * Section reservation validation schemas
 */
export const bottleSelectionSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const sectionReservationSchema = z.object({
  eventId: uuidSchema,
  sectionId: uuidSchema,
  bottlesSelected: z.array(bottleSelectionSchema).min(1, 'At least one bottle must be selected'),
  guestCount: z.number().int().positive().max(50, 'Guest count cannot exceed 50'),
  specialRequests: z.string().max(500).optional(),
  guestInfo: guestInfoSchema.optional(),
});

/**
 * Promoter validation schemas
 */
export const createPromoterSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  email: emailSchema,
  name: z.string().min(1, 'Name is required').max(100),
  phone: phoneSchema.optional(),
  commissionRate: z.number().min(0).max(100, 'Commission rate must be between 0 and 100'),
});

export const updatePromoterStatusSchema = z.object({
  status: z.enum(['pending', 'active', 'suspended', 'banned']),
});

/**
 * Promoter link validation schemas
 */
export const generateLinkSchema = z.object({
  eventId: uuidSchema,
  customUrl: z.string().regex(/^[a-z0-9-]+$/, 'URL must contain only lowercase letters, numbers, and hyphens').optional(),
});

/**
 * QR code validation schema
 */
export const validateQRSchema = z.object({
  ticketId: uuidSchema,
  qrData: z.string().min(1, 'QR data is required'),
});

/**
 * Payment validation schemas
 */
export const stripeCheckoutSchema = z.object({
  amount: z.number().int().positive(),
  metadata: z.record(z.string()).optional(),
});

/**
 * Analytics query schema
 */
export const analyticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  eventId: uuidSchema.optional(),
  promoterId: z.string().optional(),
});

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
});

/**
 * Helper function to validate request body
 */
export function validateRequestBody<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
