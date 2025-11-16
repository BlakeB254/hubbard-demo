'use client';

import { use } from 'react';
import { useUser } from '@stackframe/stack';
import { useLinkAnalytics } from '@/hooks/use-link-analytics';
import { usePromoterLinks } from '@/hooks/use-promoter-links';
import { AnalyticsChart } from '@/components/promoter/molecules/AnalyticsChart';
import { ConversionChart } from '@/components/promoter/molecules/ConversionChart';
import { StatCard } from '@/components/promoter/atoms/StatCard';
import { CopyButton } from '@/components/promoter/atoms/CopyButton';
import { ShareButton } from '@/components/promoter/atoms/ShareButton';
import { Skeleton } from '@/components/promoter/atoms/Skeleton';
import { Button } from '@/components/promoter/atoms/Button';
import { formatCurrency, formatDate } from '@hubbard-inn/shared';
import { ArrowLeft, Monitor, Smartphone, Tablet } from 'lucide-react';
import Link from 'next/link';

export default function LinkAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: linkId } = use(params);
  const user = useUser({ or: 'redirect' });
  const { analytics, isLoading, error, refresh } = useLinkAnalytics(linkId);
  const { links } = usePromoterLinks();

  const link = links.find((l) => l.id === linkId);

  if (isLoading) {
    return (
      <div className="space-y-phi-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !analytics || !link) {
    return (
      <div className="text-center py-phi-7">
        <p className="text-red-600 mb-phi-4">Failed to load analytics</p>
        <Button onClick={refresh}>Try Again</Button>
      </div>
    );
  }

  const deviceIcons = {
    Mobile: Smartphone,
    Desktop: Monitor,
    Tablet: Tablet,
  };

  return (
    <div className="space-y-phi-6">
      {/* Back Button */}
      <Link href="/links" className="inline-flex items-center gap-phi-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        Back to My Links
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-phi-2">Link Analytics</h1>
        <p className="text-muted-foreground">Detailed performance metrics for {link.uniqueCode}</p>
      </div>

      {/* Link Actions */}
      <div className="bg-card border border-border rounded-lg p-phi-5">
        <p className="text-sm text-muted-foreground mb-phi-2">Affiliate Link</p>
        <div className="flex items-center gap-phi-2">
          <div className="flex-1 bg-muted px-phi-3 py-phi-2 rounded-md truncate font-mono text-sm">
            {link.url}
          </div>
          <CopyButton text={link.url} />
          <ShareButton title="Event" text="Check out this event!" url={link.url} />
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-4">
        <StatCard label="Total Clicks" value={analytics.totalClicks.toLocaleString()} />
        <StatCard label="Unique Clicks" value={analytics.uniqueClicks.toLocaleString()} />
        <StatCard
          label="Conversion Rate"
          value={`${analytics.conversionRate.toFixed(2)}%`}
          highlighted
        />
        <StatCard
          label="Avg Order Value"
          value={formatCurrency(analytics.avgOrderValue)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
        {/* Clicks Over Time */}
        <div className="bg-card border border-border rounded-lg p-phi-5">
          <h2 className="text-xl font-semibold mb-phi-4">Clicks Over Time</h2>
          <AnalyticsChart data={analytics.clicksOverTime} type="both" />
        </div>

        {/* Conversion Funnel */}
        <div className="bg-card border border-border rounded-lg p-phi-5">
          <h2 className="text-xl font-semibold mb-phi-4">Conversion Funnel</h2>
          <ConversionChart
            data={{
              clicks: analytics.totalClicks,
              conversions: analytics.totalConversions,
            }}
          />
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="bg-card border border-border rounded-lg p-phi-5">
        <h2 className="text-xl font-semibold mb-phi-4">Device Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-4">
          {analytics.deviceBreakdown.map((device: any) => {
            const Icon = deviceIcons[device.device as keyof typeof deviceIcons] || Monitor;
            return (
              <div key={device.device} className="p-phi-4 bg-muted rounded-lg">
                <div className="flex items-center gap-phi-2 mb-phi-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold">{device.device}</h3>
                </div>
                <p className="text-3xl font-bold mb-phi-1">{device.clicks}</p>
                <p className="text-sm text-muted-foreground">{device.percentage}% of total</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Conversions */}
      <div className="bg-card border border-border rounded-lg p-phi-5">
        <h2 className="text-xl font-semibold mb-phi-4">Recent Conversions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Date</th>
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Tickets</th>
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Revenue</th>
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Commission</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentConversions.map((conversion: any, i: number) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-phi-3 px-phi-2 text-sm">{formatDate(conversion.date)}</td>
                  <td className="py-phi-3 px-phi-2 text-sm">{conversion.tickets}</td>
                  <td className="py-phi-3 px-phi-2 text-sm">{formatCurrency(conversion.revenue)}</td>
                  <td className="py-phi-3 px-phi-2 text-sm font-semibold text-primary">
                    {formatCurrency(conversion.commission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
