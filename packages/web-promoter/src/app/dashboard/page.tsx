import { Suspense } from 'react';
import type { Metadata } from 'next';
import { StatsOverview, StatsOverviewSkeleton } from '@/components/promoter/organisms/StatsOverview';
import { RecentConversions, RecentConversionsSkeleton } from '@/components/promoter/organisms/RecentConversions';
import { getPromoterStats, getRecentConversions } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-phi-4 py-phi-5 space-y-phi-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary-dark">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your performance and earnings
        </p>
      </div>

      {/* Stats Overview */}
      <Suspense fallback={<StatsOverviewSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Recent Conversions */}
      <div>
        <h2 className="font-heading text-xl text-primary-dark mb-phi-4">
          Recent Conversions
        </h2>
        <Suspense fallback={<RecentConversionsSkeleton />}>
          <DashboardConversions />
        </Suspense>
      </div>
    </div>
  );
}

async function DashboardStats() {
  const stats = await getPromoterStats();
  return <StatsOverview stats={stats} />;
}

async function DashboardConversions() {
  const conversions = await getRecentConversions(10);
  return <RecentConversions conversions={conversions} />;
}
