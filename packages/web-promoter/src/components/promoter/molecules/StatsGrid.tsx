import { StatCard } from '../atoms/StatCard';
import { formatCurrency } from '@hubbard-inn/shared';
import type { PromoterDashboardStats } from '@hubbard-inn/shared';
import { MousePointerClick, ShoppingCart, DollarSign, Sparkles } from 'lucide-react';

export interface StatsGridProps {
  stats: PromoterDashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-4">
      <StatCard
        label="Total Clicks"
        value={stats.totalClicks.toLocaleString()}
        icon={<MousePointerClick className="w-5 h-5" />}
      />

      <StatCard
        label="Conversions"
        value={stats.totalConversions.toLocaleString()}
        icon={<ShoppingCart className="w-5 h-5" />}
      />

      <StatCard
        label="Revenue Generated"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign className="w-5 h-5" />}
      />

      <StatCard
        label="Total Earnings"
        value={formatCurrency(stats.totalEarnings)}
        icon={<Sparkles className="w-5 h-5" />}
        highlighted
      />
    </div>
  );
}
