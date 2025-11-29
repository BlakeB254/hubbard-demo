import type { Metadata } from 'next';
import { Navigation } from '@/components/promoter/organisms/Navigation';

export const metadata: Metadata = {
  title: {
    default: 'Promoter Portal',
    template: '%s | Promoter Portal',
  },
  description: 'Earn commissions by promoting events at Hubbard Inn',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PromoterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}
