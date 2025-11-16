'use client';

import { useUser } from '@stackframe/stack';
import { StatsCard } from '@/components/admin/molecules/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/atoms/Card';
import { DollarSign, TrendingUp, Users, Ticket } from 'lucide-react';

export default function AnalyticsPage() {
  const user = useUser({ or: 'redirect' });

  return (
    <div className="p-phi-6">
      <div className="mb-phi-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-phi-2">
          Performance metrics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-4 mb-phi-6">
        <StatsCard
          title="Total Revenue"
          value="$45,230"
          trend="up"
          change={12.5}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="Last 30 days"
        />
        <StatsCard
          title="Tickets Sold"
          value="1,234"
          trend="up"
          change={8.3}
          icon={<Ticket className="w-5 h-5" />}
          subtitle="Last 30 days"
        />
        <StatsCard
          title="Conversion Rate"
          value="68%"
          trend="up"
          change={3.2}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Last 30 days"
        />
        <StatsCard
          title="Active Promoters"
          value="23"
          trend="neutral"
          change={0}
          icon={<Users className="w-5 h-5" />}
          subtitle="Currently active"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5 mb-phi-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Revenue chart would appear here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Promoters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Top promoters leaderboard would appear here
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Event performance comparison would appear here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
