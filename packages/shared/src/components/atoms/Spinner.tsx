import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Spinner variants
 */
const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-solid border-current border-t-transparent',
  {
    variants: {
      size: {
        xs: 'h-3 w-3 border-2',
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-[3px]',
        xl: 'h-12 w-12 border-4',
      },
      variant: {
        default: 'text-primary',
        white: 'text-white',
        inherit: 'text-current',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Label for screen readers
   */
  label?: string;
}

/**
 * Spinner - Loading indicator
 *
 * Features:
 * - Multiple sizes (xs, sm, md, lg, xl)
 * - Color variants (default, white, inherit)
 * - Accessible with aria-label
 * - Smooth animation
 *
 * @example
 * ```tsx
 * <Spinner size="md" variant="default" label="Loading..." />
 * ```
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = 'Loading...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ size, variant }), className)}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
