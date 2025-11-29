import { Card, CardContent, Skeleton } from '@hubbard-inn/shared/components';
import { formatPrice, formatNumber, formatPercent } from '@hubbard-inn/shared/utils';
import { MousePointer, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import type { PromoterStats } from '@/lib/api';

interface StatsOverviewProps {
  stats: PromoterStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const items = [
    {
      label: 'Total Clicks',
      value: formatNumber(stats.totalClicks),
      icon: MousePointer,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Conversions',
      value: formatNumber(stats.totalConversions),
      icon: ShoppingCart,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Conversion Rate',
      value: formatPercent(stats.conversionRate),
      icon: TrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-phi-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-phi-4">
            <div className="flex items-center gap-phi-3">
              <div className={`p-3 rounded-lg ${item.bgColor}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatsOverviewSkeleton() {
  return (
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
  );
}
