import { cn } from '@/lib/utils';

export interface PriceTagProps {
  amount: number;
  currency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({
  amount,
  currency = 'USD',
  className,
  size = 'md',
}: PriceTagProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
  };

  return (
    <span className={cn('font-medium text-foreground', sizeClasses[size], className)}>
      {formattedPrice}
    </span>
  );
}
