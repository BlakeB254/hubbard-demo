import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-phi-3 font-[\'Montserrat\',sans-serif] text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
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
        sm: 'h-[2.125rem] px-phi-3 py-phi-2 text-xs',
        md: 'h-[2.75rem] px-phi-4 py-phi-3 text-sm',
        lg: 'h-[3.5rem] px-phi-5 py-phi-4 text-base',
        icon: 'h-[2.75rem] w-[2.75rem]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
