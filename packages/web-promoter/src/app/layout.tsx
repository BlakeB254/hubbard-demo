import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hubbard Inn - Promoter Dashboard',
  description: 'Track affiliate links and earnings for Hubbard Inn events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
