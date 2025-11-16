import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          // Variant styles
          variant === 'primary' &&
            'bg-primary text-primary-foreground hover:opacity-90',
          variant === 'secondary' &&
            'bg-secondary text-secondary-foreground hover:opacity-90',
          variant === 'destructive' &&
            'bg-destructive text-destructive-foreground hover:opacity-90',
          variant === 'outline' &&
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          // Size styles (using golden ratio spacing)
          size === 'sm' && 'px-phi-3 py-phi-2 text-sm',
          size === 'md' && 'px-phi-4 py-phi-3',
          size === 'lg' && 'px-phi-5 py-phi-4 text-lg',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
