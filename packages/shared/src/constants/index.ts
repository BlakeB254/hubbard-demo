/**
 * Application constants
 */

import type { FloorNumber } from '../types/events';

/**
 * Floor capacities for the venue
 */
export const FLOOR_CAPACITIES: Record<FloorNumber, number> = {
  '1': 150,
  '2': 150,
  '3': 250,
} as const;

/**
 * Maximum section deposit in cents ($500)
 */
export const MAX_SECTION_DEPOSIT = 50000;

/**
 * Valid ticket statuses
 */
export const TICKET_STATUSES = ['valid', 'used', 'refunded', 'cancelled'] as const;

/**
 * Valid age restrictions
 */
export const AGE_RESTRICTIONS = ['none', '18+', '21+'] as const;

/**
 * Valid event statuses
 */
export const EVENT_STATUSES = ['draft', 'published', 'sold_out', 'cancelled', 'completed'] as const;

/**
 * Valid promoter statuses
 */
export const PROMOTER_STATUSES = ['pending', 'active', 'suspended', 'banned'] as const;
