import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Badge variants combining all variants from different apps
 * Follows Hubbard Inn design system with golden ratio spacing
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-md px-phi-2 py-phi-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        // Generic variants
        default: 'bg-secondary text-secondary-foreground',
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input text-foreground',

        // Status variants
        success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100',
        error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
        destructive: 'bg-destructive/10 text-destructive',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100',

        // Domain-specific variants (for promoter/event status)
        active: 'bg-green-100 text-green-700',
        inactive: 'bg-gray-100 text-gray-700',
        expired: 'bg-red-100 text-red-700',
        pending: 'bg-yellow-100 text-yellow-700',
        paid: 'bg-blue-100 text-blue-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Unified Badge component
 * Combines all badge variants from different apps:
 * - Generic variants (default, primary, secondary, outline)
 * - Status variants (success, warning, error, info, destructive)
 * - Domain-specific variants (active, inactive, expired, pending, paid)
 * - Golden ratio spacing
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
