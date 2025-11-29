import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AnalyticsDashboard, AnalyticsSkeleton } from '@/components/admin/organisms/AnalyticsDashboard';
import { getAnalytics } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Analytics',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-phi-5">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary-dark">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Performance metrics and insights
        </p>
      </div>

      {/* Analytics Dashboard */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}

async function AnalyticsContent() {
  const analytics = await getAnalytics();
  return <AnalyticsDashboard data={analytics} />;
}
