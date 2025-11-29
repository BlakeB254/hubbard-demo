import { Suspense } from 'react';
import type { Metadata } from 'next';
import { StatsGrid, StatsGridSkeleton } from '@/components/admin/organisms/StatsGrid';
import { RecentEvents, RecentEventsSkeleton } from '@/components/admin/organisms/RecentEvents';
import { getAdminStats, getRecentEvents } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <div className="space-y-phi-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary-dark">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your event management system
        </p>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Recent Events */}
      <div>
        <h2 className="font-heading text-xl text-primary-dark mb-phi-4">
          Recent Events
        </h2>
        <Suspense fallback={<RecentEventsSkeleton />}>
          <DashboardRecentEvents />
        </Suspense>
      </div>
    </div>
  );
}

async function DashboardStats() {
  const stats = await getAdminStats();
  return <StatsGrid stats={stats} />;
}

async function DashboardRecentEvents() {
  const events = await getRecentEvents(5);
  return <RecentEvents events={events} />;
}
