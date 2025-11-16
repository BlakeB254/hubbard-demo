import type { Metadata, Viewport } from 'next';
import '@hubbard-inn/shared/styles';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Hubbard Inn Admin',
  description: 'Event management and ticketing administration',
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
