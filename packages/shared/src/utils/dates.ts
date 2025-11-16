/**
 * Date utilities
 */

import { formatDate, formatTime } from './format';

/**
 * Check if an event date is in the future
 * @param eventDate - Date to check
 * @returns True if date is in the future
 */
export function isUpcoming(eventDate: Date | string): boolean {
  const date = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
  return date > new Date();
}

/**
 * Check if an event date is in the past
 * @param eventDate - Date to check
 * @returns True if date is in the past
 */
export function isPast(eventDate: Date | string): boolean {
  return !isUpcoming(eventDate);
}

/**
 * Calculate days until an event
 * @param eventDate - Event date
 * @returns Number of days until event (negative if past)
 */
export function daysUntil(eventDate: Date | string): number {
  const date = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format event date and time together
 * @param date - Event date
 * @param time - Event time in HH:MM format
 * @returns Formatted date and time string
 */
export function formatEventDateTime(date: Date | string, time: string): string {
  return `${formatDate(date)} at ${formatTime(time)}`;
}
