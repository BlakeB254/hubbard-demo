/**
 * Capacity calculation utilities
 */

export type CapacityStatus = 'available' | 'filling' | 'almost_full' | 'sold_out';

/**
 * Calculate capacity percentage
 * @param sold - Number of tickets sold
 * @param total - Total capacity
 * @returns Percentage sold (0-100)
 */
export function getCapacityPercentage(sold: number, total: number): number {
  return Math.round((sold / total) * 100);
}

/**
 * Get capacity status based on percentage sold
 * @param sold - Number of tickets sold
 * @param total - Total capacity
 * @returns Status indicator
 */
export function getCapacityStatus(sold: number, total: number): CapacityStatus {
  const percentage = getCapacityPercentage(sold, total);

  if (percentage >= 100) return 'sold_out';
  if (percentage >= 90) return 'almost_full';
  if (percentage >= 70) return 'filling';
  return 'available';
}

/**
 * Get human-readable capacity label
 * @param sold - Number of tickets sold
 * @param total - Total capacity
 * @returns Label describing capacity status
 */
export function getCapacityLabel(sold: number, total: number): string {
  const status = getCapacityStatus(sold, total);

  switch (status) {
    case 'sold_out':
      return 'Sold Out';
    case 'almost_full':
      return 'Almost Full';
    case 'filling':
      return 'Filling Fast';
    case 'available':
      return `${total - sold} tickets left`;
  }
}
