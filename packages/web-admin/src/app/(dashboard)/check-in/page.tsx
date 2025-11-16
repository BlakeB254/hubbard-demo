'use client';

import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { QRScanner } from '@/components/admin/organisms/QRScanner';
import { Card, CardContent } from '@/components/admin/atoms/Card';
import { Badge } from '@/components/admin/atoms/Badge';
import { api } from '@/lib/api';

interface ValidationResult {
  valid: boolean;
  message: string;
  ticketId?: string;
  eventName?: string;
  holderName?: string;
  alreadyScanned?: boolean;
}

export default function CheckInPage() {
  const user = useUser({ or: 'redirect' });
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleScan = async (qrData: string) => {
    try {
      setIsValidating(true);
      setValidationResult(null);

      const result = await api.post<ValidationResult>('/api/admin/tickets/validate', {
        qrData,
      });

      setValidationResult(result.data || { valid: false, message: 'Validation failed' });

      if (result.data?.valid && !result.data?.alreadyScanned) {
        // Mark as scanned
        await api.post(`/api/admin/tickets/${result.data.ticketId}/scan`, {});
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        message: error instanceof Error ? error.message : 'Validation failed',
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="p-phi-6">
      <div className="mb-phi-6">
        <h1 className="text-3xl font-bold">Ticket Check-In</h1>
        <p className="text-muted-foreground mt-phi-2">
          Scan QR codes to validate and check-in tickets
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <QRScanner onScan={handleScan} />

        {isValidating && (
          <Card className="mt-phi-5">
            <CardContent className="p-phi-5 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-phi-3">Validating ticket...</p>
            </CardContent>
          </Card>
        )}

        {validationResult && !isValidating && (
          <Card
            className={`mt-phi-5 ${
              validationResult.valid
                ? 'border-green-500 bg-green-50 dark:bg-green-950'
                : 'border-red-500 bg-red-50 dark:bg-red-950'
            }`}
          >
            <CardContent className="p-phi-5">
              <div className="flex items-start justify-between mb-phi-3">
                <h3 className="text-xl font-semibold">
                  {validationResult.valid ? 'Valid Ticket' : 'Invalid Ticket'}
                </h3>
                <Badge variant={validationResult.valid ? 'success' : 'error'}>
                  {validationResult.valid ? 'VALID' : 'INVALID'}
                </Badge>
              </div>

              <p className="text-sm mb-phi-3">{validationResult.message}</p>

              {validationResult.valid && (
                <div className="space-y-phi-2 text-sm">
                  {validationResult.eventName && (
                    <p>
                      <span className="font-medium">Event:</span>{' '}
                      {validationResult.eventName}
                    </p>
                  )}
                  {validationResult.holderName && (
                    <p>
                      <span className="font-medium">Ticket Holder:</span>{' '}
                      {validationResult.holderName}
                    </p>
                  )}
                  {validationResult.alreadyScanned && (
                    <Badge variant="warning">Already Scanned</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
