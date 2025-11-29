import { format, parseISO, isAfter, isBefore, addDays, differenceInDays } from 'date-fns';

/**
 * Format a date string for display
 */
export function formatDate(dateString: string, formatStr = 'MMM d, yyyy'): string {
  return format(parseISO(dateString), formatStr);
}

/**
 * Format a time string for display
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours ?? '0', 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Format date and time together
 */
export function formatDateTime(dateString: string, timeString: string): string {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`;
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  return isAfter(parseISO(dateString), new Date());
}

/**
 * Check if a date is in the past
 */
export function isPastDate(dateString: string): boolean {
  return isBefore(parseISO(dateString), new Date());
}

/**
 * Get days until event
 */
export function getDaysUntil(dateString: string): number {
  return differenceInDays(parseISO(dateString), new Date());
}

/**
 * Get relative time string (e.g., "in 3 days", "tomorrow")
 */
export function getRelativeTime(dateString: string): string {
  const days = getDaysUntil(dateString);

  if (days < 0) return 'Past event';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} days`;
  if (days < 14) return 'Next week';
  return formatDate(dateString);
}

export { addDays, parseISO };
