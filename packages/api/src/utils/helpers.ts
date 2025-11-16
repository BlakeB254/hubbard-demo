import crypto from 'crypto';

/**
 * Generate a unique order number for guest orders
 * Format: ORD-YYYYMMDD-XXXXXX (where X is random alphanumeric)
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();

  return `ORD-${year}${month}${day}-${randomPart}`;
}

/**
 * Generate a unique 8-character code for promoter links
 * Format: Uppercase alphanumeric (e.g., "A7K9M2X4")
 */
export function generatePromoCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars: 0, O, 1, I
  let code = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

/**
 * Calculate commission amount based on price and rate
 * @param pricePaid Price paid in cents
 * @param commissionRate Commission rate as percentage (e.g., 10 for 10%)
 * @returns Commission amount in cents
 */
export function calculateCommission(pricePaid: number, commissionRate: number): number {
  return Math.round((pricePaid * commissionRate) / 100);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
}

/**
 * Format price from cents to dollars
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Convert dollars to cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Sanitize user input by trimming whitespace
 */
export function sanitizeString(input: string): string {
  return input.trim();
}

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}
