import type { Metadata } from 'next';
import { QRScanner } from '@/components/admin/organisms/QRScanner';

export const metadata: Metadata = {
  title: 'Check-In',
};

export default function CheckInPage() {
  return (
    <div className="space-y-phi-5">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary-dark">Check-In</h1>
        <p className="text-muted-foreground mt-1">
          Scan tickets for event entry
        </p>
      </div>

      {/* QR Scanner */}
      <QRScanner />
    </div>
  );
}
