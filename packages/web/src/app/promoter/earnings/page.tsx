import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EarningsOverview, EarningsOverviewSkeleton } from '@/components/promoter/organisms/EarningsOverview';
import { getPromoterEarnings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Earnings',
};

export default function EarningsPage() {
  return (
    <div className="max-w-7xl mx-auto px-phi-4 py-phi-5 space-y-phi-5">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary-dark">Earnings</h1>
        <p className="text-muted-foreground mt-1">
          Track your commission earnings
        </p>
      </div>

      {/* Earnings Overview */}
      <Suspense fallback={<EarningsOverviewSkeleton />}>
        <EarningsContent />
      </Suspense>
    </div>
  );
}

async function EarningsContent() {
  const earnings = await getPromoterEarnings();
  return <EarningsOverview earnings={earnings} />;
}
