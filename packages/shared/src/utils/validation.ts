/**
 * Validation utilities
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate order number format (HI-YYYY-XXXXXX)
 * @param orderNumber - Order number to validate
 * @returns True if order number format is valid
 */
export function isValidOrderNumber(orderNumber: string): boolean {
  return /^HI-\d{4}-[A-Z0-9]{6}$/.test(orderNumber);
}

/**
 * Validate promo code format (8 alphanumeric characters)
 * @param code - Promo code to validate
 * @returns True if promo code format is valid
 */
export function isValidPromoCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}
