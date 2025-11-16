import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/50',
        'bg-gradient-to-r from-muted/50 via-muted to-muted/50',
        'bg-[length:200%_100%]',
        className
      )}
      {...props}
    />
  );
}
