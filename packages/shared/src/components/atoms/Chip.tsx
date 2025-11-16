import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

/**
 * Chip variants
 */
const chipVariants = cva(
  'inline-flex items-center gap-phi-1 rounded-full px-phi-3 py-phi-1 text-xs font-medium transition-all',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        primary: 'bg-primary/10 text-primary hover:bg-primary/20',
        success: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-100',
        warning: 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100',
        error: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-100',
        outline: 'border border-input bg-transparent hover:bg-accent',
      },
      size: {
        sm: 'text-xs px-phi-2 py-0.5',
        md: 'text-xs px-phi-3 py-phi-1',
        lg: 'text-sm px-phi-4 py-phi-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ChipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof chipVariants> {
  /**
   * Label text
   */
  label: string;
  /**
   * Callback when chip is removed (shows X button)
   */
  onRemove?: () => void;
  /**
   * Whether the chip is clickable
   */
  clickable?: boolean;
  /**
   * Icon to display before label
   */
  icon?: React.ReactNode;
}

/**
 * Chip - Compact element for filters, tags, selections
 *
 * Features:
 * - Multiple variants (default, primary, success, warning, error, outline)
 * - Removable with X button
 * - Optional icon
 * - Clickable option
 * - Multiple sizes
 *
 * @example
 * ```tsx
 * <Chip
 *   label="Floor 1"
 *   variant="primary"
 *   onRemove={() => removeFilter('floor')}
 * />
 * ```
 */
export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      label,
      onRemove,
      clickable,
      icon,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = clickable || onClick;

    return (
      <div
        ref={ref}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.(e as any);
          }
        }}
        className={cn(
          chipVariants({ variant, size }),
          isInteractive && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{label}</span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              'flex-shrink-0 rounded-full',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'transition-colors',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current'
            )}
            aria-label={`Remove ${label}`}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = 'Chip';
