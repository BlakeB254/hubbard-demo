import type { Metadata, Viewport } from 'next';
import { Prata, Montserrat } from 'next/font/google';
import '@hubbard-inn/shared/styles';
import { Navigation } from '@/components/promoter/organisms/Navigation';

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

export const metadata: Metadata = {
  title: {
    default: 'Hubbard Inn Promoter',
    template: '%s | Promoter Portal',
  },
  description: 'Earn commissions by promoting events at Hubbard Inn',
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#304B3C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${prata.variable} ${montserrat.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
