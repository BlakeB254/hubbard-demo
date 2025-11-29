import type { Metadata, Viewport } from 'next';
import { Prata, Montserrat } from 'next/font/google';
import '@hubbard-inn/shared/styles';
import { MobileNavigation } from '@/components/customer/organisms/MobileNavigation';

// Next.js 16: Optimize fonts at build time
const prata = Prata({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

// Next.js 16: Metadata API for SEO
export const metadata: Metadata = {
  title: {
    default: 'Hubbard Inn - Events & Tickets',
    template: '%s | Hubbard Inn',
  },
  description: "Premium event tickets and VIP reservations at Chicago's premier venue",
  applicationName: 'Hubbard Inn',
  keywords: ['events', 'tickets', 'Chicago', 'nightlife', 'VIP', 'bottle service'],
  authors: [{ name: 'Hubbard Inn' }],
  creator: 'Hubbard Inn',
  publisher: 'Hubbard Inn',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hubbardinn.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Hubbard Inn',
    title: 'Hubbard Inn - Events & Tickets',
    description: "Premium event tickets and VIP reservations at Chicago's premier venue",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hubbard Inn',
    description: "Premium event tickets and VIP reservations at Chicago's premier venue",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#304B3C',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${prata.variable} ${montserrat.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
        <MobileNavigation />
      </body>
    </html>
  );
}
