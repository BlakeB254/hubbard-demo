import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Icon to display (lucide-react component or custom SVG)
   */
  icon?: ReactNode;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * EmptyState - Display when no content is available
 *
 * Features:
 * - Icon support
 * - Title and description
 * - Optional action button
 * - Responsive layout
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Calendar className="w-12 h-12" />}
 *   title="No events found"
 *   description="Try adjusting your filters or check back later"
 *   action={{
 *     label: "Clear Filters",
 *     onClick: () => clearFilters()
 *   }}
 * />
 * ```
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center',
          'text-center p-phi-6',
          'min-h-[400px]',
          className
        )}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <div className="mb-phi-4 text-muted-foreground opacity-50">
            {icon}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-phi-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground mb-phi-5 max-w-md">
            {description}
          </p>
        )}

        {/* Action Button */}
        {action && (
          <Button
            onClick={action.onClick}
            variant="primary"
            size="md"
          >
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
