'use client';

import { useEffect, useState } from 'react';
import QRCodeLib from 'qrcode';

export interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 256, className }: QRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!value) {
      setError('No value provided');
      return;
    }

    QRCodeLib.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
        setError('');
      })
      .catch((err) => {
        console.error('QR Code generation error:', err);
        setError('Failed to generate QR code');
      });
  }, [value, size]);

  if (error) {
    return (
      <div className={className} style={{ width: size, height: size }}>
        <div className="flex items-center justify-center h-full bg-muted rounded-phi-3">
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!qrDataUrl) {
    return (
      <div className={className} style={{ width: size, height: size }}>
        <div className="flex items-center justify-center h-full bg-muted rounded-phi-3 animate-pulse">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt="QR Code"
      className={className}
      width={size}
      height={size}
    />
  );
}
