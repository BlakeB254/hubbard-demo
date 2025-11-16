'use client';

import { useUser } from '@stackframe/stack';
import { useRealtimeStats } from '@/hooks/use-realtime-stats';
import { StatsGrid } from '@/components/promoter/molecules/StatsGrid';
import { RecentConversions } from '@/components/promoter/organisms/RecentConversions';
import { AnalyticsChart } from '@/components/promoter/molecules/AnalyticsChart';
import { Button } from '@/components/promoter/atoms/Button';
import { Skeleton } from '@/components/promoter/atoms/Skeleton';
import Link from 'next/link';
import { RefreshCw, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const user = useUser({ or: 'redirect' });
  const { stats, recentConversions, isLoading, error, refresh } = useRealtimeStats();

  if (isLoading) {
    return (
      <div className="space-y-phi-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-phi-7">
        <p className="text-red-600 mb-phi-4">Failed to load dashboard data</p>
        <Button onClick={refresh}>Try Again</Button>
      </div>
    );
  }

  // Generate mock chart data for last 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString(),
      clicks: Math.floor(Math.random() * 50) + 10,
      conversions: Math.floor(Math.random() * 5),
    };
  });

  return (
    <div className="space-y-phi-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-phi-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || 'Promoter'}!
          </p>
        </div>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-phi-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Performance Chart */}
      <div className="bg-card border border-border rounded-lg p-phi-5">
        <div className="flex items-center justify-between mb-phi-4">
          <div>
            <h2 className="text-xl font-semibold mb-phi-1">Performance Overview</h2>
            <p className="text-sm text-muted-foreground">
              Clicks and conversions over the last 30 days
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <AnalyticsChart data={chartData} type="both" />
      </div>

      {/* Recent Conversions */}
      <RecentConversions conversions={recentConversions} />

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-phi-5">
        <h2 className="text-xl font-semibold mb-phi-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-phi-4">
          <Link href="/events">
            <div className="p-phi-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
              <h3 className="font-semibold mb-phi-2">Browse Events</h3>
              <p className="text-sm text-muted-foreground mb-phi-3">
                Find upcoming events to promote and generate affiliate links
              </p>
              <Button variant="outline" size="sm">
                View Events →
              </Button>
            </div>
          </Link>

          <Link href="/links">
            <div className="p-phi-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
              <h3 className="font-semibold mb-phi-2">Manage Links</h3>
              <p className="text-sm text-muted-foreground mb-phi-3">
                View and manage all your affiliate links and their performance
              </p>
              <Button variant="outline" size="sm">
                View Links →
              </Button>
            </div>
          </Link>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="flex items-center justify-center gap-phi-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Real-time updates every 30 seconds</span>
      </div>
    </div>
  );
}
