'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@hubbard-inn/shared';

export interface QRScannerProps {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [manualInput, setManualInput] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan Ticket QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-phi-5">
        {/* Camera scanner would go here */}
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">
            Camera QR scanner would appear here
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-phi-2 text-muted-foreground">
              Or enter manually
            </span>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="flex gap-phi-3">
          <Input
            placeholder="Enter ticket code"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Validate</Button>
        </form>
      </CardContent>
    </Card>
  );
}
