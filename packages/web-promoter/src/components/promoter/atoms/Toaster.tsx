'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { useToastStore } from '@/hooks/use-toast';
import type { ToastType } from '@/hooks/use-toast';

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
};

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
};

const toastIconColors: Record<ToastType, string> = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  warning: 'text-yellow-600',
};

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <ToastPrimitive.Root
          key={toast.id}
          className={`
            ${toastStyles[toast.type]}
            fixed bottom-phi-5 right-phi-5
            w-96 max-w-[calc(100vw-2rem)]
            p-phi-4
            border rounded-lg shadow-lg
            flex items-start gap-phi-3
            data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
            data-[swipe=cancel]:translate-x-0
            data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[swipe=end]:animate-out
            data-[state=closed]:fade-out-80
            data-[state=closed]:slide-out-to-right-full
            data-[state=open]:slide-in-from-bottom-full
            data-[state=open]:sm:slide-in-from-bottom-full
            z-50
          `}
          onOpenChange={(open) => {
            if (!open) removeToast(toast.id);
          }}
        >
          <div className={`${toastIconColors[toast.type]} flex-shrink-0 mt-0.5`}>
            {toastIcons[toast.type]}
          </div>

          <div className="flex-1 min-w-0">
            <ToastPrimitive.Title className="font-semibold mb-phi-1">
              {toast.title}
            </ToastPrimitive.Title>
            {toast.description && (
              <ToastPrimitive.Description className="text-sm opacity-90">
                {toast.description}
              </ToastPrimitive.Description>
            )}
          </div>

          <ToastPrimitive.Close
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
}
