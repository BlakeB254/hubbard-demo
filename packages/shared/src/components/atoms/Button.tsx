import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Button variants using class-variance-authority
 * Follows Hubbard Inn design system with golden ratio spacing
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-md hover:shadow-lg',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg',
        outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground',
        ghost: 'hover:bg-primary/10 hover:text-primary',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md',
      },
      size: {
        sm: 'h-9 px-phi-3 py-phi-2 text-sm',
        md: 'h-11 px-phi-4 py-phi-3',
        lg: 'h-13 px-phi-5 py-phi-4 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, renders the component as a Slot for composition
   */
  asChild?: boolean;
  /**
   * If true, shows a loading spinner and disables the button
   */
  isLoading?: boolean;
}

/**
 * Unified Button component
 * Combines best features from all app implementations:
 * - class-variance-authority for variant management
 * - Radix Slot for composition (asChild)
 * - Loading state support
 * - Golden ratio spacing
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="mr-phi-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
