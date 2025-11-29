import type { PromoterLink } from '@hubbard-inn/shared/types';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@hubbard-inn/shared/components';
import { formatNumber, formatPrice, formatPercent } from '@hubbard-inn/shared/utils';
import { MousePointer, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

interface LinkAnalyticsProps {
  link: PromoterLink;
}

export function LinkAnalytics({ link }: LinkAnalyticsProps) {
  const conversionRate = link.clicks > 0
    ? (link.conversions / link.clicks) * 100
    : 0;

  return (
    <div className="space-y-phi-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-phi-4">
        <StatCard
          label="Total Clicks"
          value={formatNumber(link.clicks)}
          icon={MousePointer}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          label="Conversions"
          value={formatNumber(link.conversions)}
          icon={ShoppingCart}
          color="text-accent"
          bgColor="bg-accent/10"
        />
        <StatCard
          label="Revenue Generated"
          value={formatPrice(link.revenue)}
          icon={DollarSign}
          color="text-success"
          bgColor="bg-success/10"
        />
        <StatCard
          label="Conversion Rate"
          value={formatPercent(conversionRate)}
          icon={TrendingUp}
          color="text-secondary"
          bgColor="bg-secondary/10"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Chart visualization</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Chart visualization</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link Details */}
      <Card>
        <CardHeader>
          <CardTitle>Link Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-phi-4">
            <div>
              <p className="text-sm text-muted-foreground">Link Code</p>
              <p className="font-mono font-semibold">{link.code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold">
                {link.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">URL</p>
              <p className="font-mono text-sm break-all">{link.url}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="p-phi-4">
        <div className="flex items-center gap-phi-3">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LinkAnalyticsSkeleton() {
  return (
    <div className="space-y-phi-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-phi-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-phi-4">
              <div className="flex items-center gap-phi-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
