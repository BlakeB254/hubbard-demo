import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/promoter/atoms/Toaster';
import '@hubbard-inn/shared/styles';

export const metadata: Metadata = {
  title: 'Hubbard Inn - Promoter Dashboard',
  description: 'Track affiliate links and earnings for Hubbard Inn events',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#304B3C', // Hubbard Inn Forest Green
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
