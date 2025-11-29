import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PromoterTable, PromoterTableSkeleton } from '@/components/admin/organisms/PromoterTable';
import { getPromoters } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Promoters',
};

export default function PromotersPage() {
  return (
    <div className="space-y-phi-5">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary-dark">Promoters</h1>
        <p className="text-muted-foreground mt-1">
          Manage affiliate promoters
        </p>
      </div>

      {/* Promoters Table */}
      <Suspense fallback={<PromoterTableSkeleton />}>
        <PromotersList />
      </Suspense>
    </div>
  );
}

async function PromotersList() {
  const promoters = await getPromoters();
  return <PromoterTable promoters={promoters} />;
}
