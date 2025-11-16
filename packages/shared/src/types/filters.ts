/**
 * Filter types for various resources
 */

import type { EventStatus, AgeRestriction, FloorNumber } from './events';

export interface EventFilters {
  startDate?: string;
  endDate?: string;
  floorNumber?: FloorNumber;
  ageRestriction?: AgeRestriction;
  status?: EventStatus[];
  search?: string;
}

export interface PromoterLinkFilters {
  eventId?: string;
  isActive?: boolean;
  minConversions?: number;
}
