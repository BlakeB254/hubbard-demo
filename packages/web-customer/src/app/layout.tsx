import type { Metadata, Viewport } from 'next';
import '@hubbard-inn/shared/styles';
import { MobileNavigation } from '@/components/customer/organisms/MobileNavigation';
import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackServerApp, hasStackAuth } from '@/lib/stack';

export const metadata: Metadata = {
  title: {
    default: 'Hubbard Inn - Events & Tickets',
    template: '%s | Hubbard Inn',
  },
  description: 'Premium event tickets and VIP reservations at Chicago\'s premier venue',
  applicationName: 'Hubbard Inn',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hubbard Inn',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
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
        {hasStackAuth && stackServerApp ? (
          <StackProvider app={stackServerApp}>
            <StackTheme>
              {children}
              <MobileNavigation />
            </StackTheme>
          </StackProvider>
        ) : (
          <>
            {children}
            <MobileNavigation />
          </>
        )}
      </body>
    </html>
  );
}
