import { ReactNode } from 'react';
import { Label, cn } from '@hubbard-inn/shared';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

export function FormField({
  label,
  required,
  error,
  children,
  htmlFor,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-phi-2', className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive mt-phi-1">{error}</p>
      )}
    </div>
  );
}
