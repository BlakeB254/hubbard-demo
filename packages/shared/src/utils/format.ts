/**
 * Formatting utilities
 */

/**
 * Format cents to dollar string
 * @param cents - Amount in cents
 * @returns Formatted dollar string (e.g., "$20.00")
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Format date to readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time to readable string
 * @param time - Time string in HH:MM format
 * @returns Formatted time string (e.g., "9:00 PM")
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format currency to short form (e.g., $1.5k for $1,500)
 * @param cents - Amount in cents
 * @returns Formatted currency string with k suffix if >= 1000
 */
export function formatCurrencyShort(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`;
  }
  return formatCurrency(cents);
}

/**
 * Parse currency string to cents
 * @param value - Currency string (e.g., "$20.00" or "20")
 * @returns Amount in cents
 */
export function parseCurrency(value: string): number {
  // Remove $ and commas, convert to cents
  const cleaned = value.replace(/[$,]/g, '');
  return Math.round(parseFloat(cleaned) * 100);
}
