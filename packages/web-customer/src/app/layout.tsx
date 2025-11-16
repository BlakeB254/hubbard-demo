import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hubbard Inn - Events & Tickets',
  description: 'Purchase tickets and reserve VIP sections for events at Hubbard Inn',
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
