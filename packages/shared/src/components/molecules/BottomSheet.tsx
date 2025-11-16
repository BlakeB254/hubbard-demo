import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface BottomSheetProps {
  /**
   * Controls whether the bottom sheet is open or closed
   */
  open: boolean;
  /**
   * Callback when the bottom sheet should close
   */
  onClose: () => void;
  /**
   * Content to display in the bottom sheet
   */
  children: ReactNode;
  /**
   * Title displayed at the top of the sheet
   */
  title?: string;
  /**
   * Optional description below the title
   */
  description?: string;
  /**
   * Whether the sheet can be dismissed by clicking backdrop or swiping down
   * @default true
   */
  dismissible?: boolean;
  /**
   * Height of the sheet
   * @default 'auto'
   */
  height?: 'auto' | 'half' | 'full';
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * BottomSheet - Mobile-optimized drawer that slides up from bottom
 *
 * Features:
 * - Swipe down to dismiss
 * - Backdrop tap to close
 * - Smooth spring animations
 * - Handles safe area insets
 * - Prevents body scroll when open
 *
 * @example
 * ```tsx
 * <BottomSheet
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Checkout"
 *   height="auto"
 * >
 *   <CheckoutForm />
 * </BottomSheet>
 * ```
 */
export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      onClose,
      children,
      title,
      description,
      dismissible = true,
      height = 'auto',
      className,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [startY, setStartY] = useState(0);

    // Prevent body scroll when sheet is open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = '';
        };
      }
    }, [open]);

    // Handle touch start for swipe gesture
    const handleTouchStart = (e: React.TouchEvent) => {
      if (!dismissible) return;
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
    };

    // Handle touch move for swipe gesture
    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging || !dismissible) return;

      const currentY = e.touches[0].clientY;
      const offset = currentY - startY;

      // Only allow downward swipes
      if (offset > 0) {
        setDragOffset(offset);
      }
    };

    // Handle touch end - close if swiped down enough
    const handleTouchEnd = () => {
      if (!isDragging || !dismissible) return;

      setIsDragging(false);

      // Close if dragged down more than 100px
      if (dragOffset > 100) {
        onClose();
      }

      setDragOffset(0);
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && dismissible) {
        onClose();
      }
    };

    if (!open) return null;

    const heightClasses = {
      auto: 'max-h-[90vh]',
      half: 'h-[50vh]',
      full: 'h-[100vh]',
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 bg-black/50 z-40 transition-opacity',
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Bottom Sheet */}
        <div
          ref={ref}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'bg-background rounded-t-phi-4 shadow-2xl',
            'transform transition-transform duration-300 ease-out',
            heightClasses[height],
            'flex flex-col',
            open ? 'translate-y-0' : 'translate-y-full',
            className
          )}
          style={{
            transform: `translateY(${isDragging ? dragOffset : 0}px)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'bottom-sheet-title' : undefined}
          aria-describedby={description ? 'bottom-sheet-description' : undefined}
        >
          {/* Drag Handle */}
          {dismissible && (
            <div className="flex justify-center py-phi-3">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
          )}

          {/* Header */}
          {(title || description) && (
            <div className="px-phi-5 pb-phi-3 border-b border-border">
              {title && (
                <h2
                  id="bottom-sheet-title"
                  className="text-xl font-semibold text-foreground"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="bottom-sheet-description"
                  className="text-sm text-muted-foreground mt-phi-1"
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-phi-5 py-phi-4">
            {children}
          </div>

          {/* Safe area padding for iOS */}
          <div className="pb-[env(safe-area-inset-bottom)]" />
        </div>
      </>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';
