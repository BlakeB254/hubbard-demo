import { forwardRef, useEffect, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export interface DrawerProps {
  /**
   * Controls whether the drawer is open or closed
   */
  open: boolean;
  /**
   * Callback when the drawer should close
   */
  onClose: () => void;
  /**
   * Content to display in the drawer
   */
  children: ReactNode;
  /**
   * Title displayed at the top of the drawer
   */
  title?: string;
  /**
   * Side from which the drawer slides in
   * @default 'left'
   */
  side?: 'left' | 'right';
  /**
   * Width of the drawer
   * @default 'md' (320px)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Whether the drawer can be dismissed by clicking backdrop or pressing Esc
   * @default true
   */
  dismissible?: boolean;
  /**
   * Whether to show close button
   * @default true
   */
  showClose?: boolean;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Drawer - Side navigation panel that slides in from left or right
 *
 * Features:
 * - Slides in from left or right
 * - Backdrop overlay
 * - Keyboard navigation (Esc to close)
 * - Focus trapping
 * - Prevents body scroll when open
 *
 * @example
 * ```tsx
 * <Drawer
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Navigation"
 *   side="left"
 *   size="md"
 * >
 *   <nav>...</nav>
 * </Drawer>
 * ```
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      children,
      title,
      side = 'left',
      size = 'md',
      dismissible = true,
      showClose = true,
      className,
    },
    ref
  ) => {
    // Prevent body scroll when drawer is open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = '';
        };
      }
    }, [open]);

    // Handle keyboard events
    useEffect(() => {
      if (!open || !dismissible) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, dismissible, onClose]);

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && dismissible) {
        onClose();
      }
    };

    if (!open) return null;

    const sizeClasses = {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-[32rem]',
      full: 'w-full',
    };

    const slideClasses = {
      left: open ? 'translate-x-0' : '-translate-x-full',
      right: open ? 'translate-x-0' : 'translate-x-full',
    };

    const positionClasses = {
      left: 'left-0',
      right: 'right-0',
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          ref={ref}
          className={cn(
            'fixed top-0 bottom-0 z-50',
            'bg-background shadow-2xl',
            'transform transition-transform duration-300 ease-out',
            positionClasses[side],
            sizeClasses[size],
            slideClasses[side],
            'flex flex-col',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-phi-5 py-phi-4 border-b border-border">
            {title && (
              <h2
                id="drawer-title"
                className="text-xl font-semibold text-foreground"
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className={cn(
                  'p-phi-2 rounded-md',
                  'hover:bg-muted transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  !title && 'ml-auto'
                )}
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-phi-5 py-phi-4">
            {children}
          </div>
        </div>
      </>
    );
  }
);

Drawer.displayName = 'Drawer';
