'use client';

import { useState } from 'react';
import { Button, Card, CardContent, Input, Label, Badge } from '@hubbard-inn/shared/components';
import { QrCode, CheckCircle, XCircle, Search } from 'lucide-react';

interface ScanResult {
  valid: boolean;
  ticketId?: string;
  eventName?: string;
  guestName?: string;
  message: string;
}

export function QRScanner() {
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleManualLookup = async () => {
    if (!manualCode.trim()) return;

    setScanning(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock result
      setResult({
        valid: true,
        ticketId: manualCode,
        eventName: 'Summer Rooftop Party',
        guestName: 'John Doe',
        message: 'Ticket validated successfully',
      });
    } catch {
      setResult({
        valid: false,
        message: 'Failed to validate ticket',
      });
    } finally {
      setScanning(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setManualCode('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
      {/* Scanner Card */}
      <Card>
        <CardContent className="p-phi-5">
          <div className="flex items-center gap-3 mb-phi-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg">QR Scanner</h3>
              <p className="text-sm text-muted-foreground">
                Scan or enter ticket code
              </p>
            </div>
          </div>

          {/* Camera placeholder */}
          <div className="aspect-square max-w-sm mx-auto bg-muted rounded-lg flex items-center justify-center mb-phi-4">
            <div className="text-center text-muted-foreground">
              <QrCode className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Camera access required</p>
              <p className="text-sm">Use manual lookup below</p>
            </div>
          </div>

          {/* Manual Lookup */}
          <div className="space-y-phi-3">
            <Label htmlFor="ticketCode">Manual Ticket Lookup</Label>
            <div className="flex gap-phi-2">
              <Input
                id="ticketCode"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="Enter ticket code"
                className="flex-1"
              />
              <Button onClick={handleManualLookup} loading={scanning}>
                <Search className="w-4 h-4 mr-2" />
                Lookup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Card */}
      <Card>
        <CardContent className="p-phi-5">
          <h3 className="font-heading text-lg mb-phi-4">Scan Result</h3>

          {!result ? (
            <div className="text-center py-phi-6 text-muted-foreground">
              <QrCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Scan a ticket to see details</p>
            </div>
          ) : (
            <div className="space-y-phi-4">
              {/* Status Banner */}
              <div
                className={`p-phi-4 rounded-lg flex items-center gap-3 ${
                  result.valid
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {result.valid ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
                <div>
                  <p className="font-semibold text-lg">
                    {result.valid ? 'Valid Ticket' : 'Invalid Ticket'}
                  </p>
                  <p className="text-sm opacity-80">{result.message}</p>
                </div>
              </div>

              {/* Ticket Details */}
              {result.valid && (
                <div className="space-y-phi-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Event</span>
                    <span className="font-medium">{result.eventName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Guest</span>
                    <span className="font-medium">{result.guestName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Ticket ID</span>
                    <span className="font-mono text-sm">{result.ticketId}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="success">Checked In</Badge>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-phi-2 pt-phi-3">
                <Button variant="outline" onClick={handleClear} className="flex-1">
                  Clear
                </Button>
                {result.valid && (
                  <Button className="flex-1">
                    Check In Guest
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
