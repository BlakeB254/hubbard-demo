import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md px-phi-2 py-phi-1 text-xs font-medium',
          variant === 'default' && 'bg-secondary text-secondary-foreground',
          variant === 'success' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
          variant === 'warning' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100',
          variant === 'error' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
          variant === 'info' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100',
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
