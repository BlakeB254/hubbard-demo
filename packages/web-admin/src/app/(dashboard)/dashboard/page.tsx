'use client';

import { useUser } from '@stackframe/stack';
import { StatsCard } from '@/components/admin/molecules/StatsCard';
import {
  DollarSign,
  Ticket,
  Calendar,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const user = useUser({ or: 'redirect' });

  // Mock data for now
  const stats = {
    totalRevenue: 45230,
    ticketsSold: 1234,
    upcomingEvents: 8,
    activePromoters: 23,
  };

  return (
    <div className="p-phi-6">
      <div className="mb-phi-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-phi-2">
          Welcome back, {user?.displayName || 'Admin'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-4 mb-phi-6">
        <StatsCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 100).toLocaleString()}`}
          trend="up"
          change={12.5}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard
          title="Tickets Sold"
          value={stats.ticketsSold}
          trend="up"
          change={8.3}
          icon={<Ticket className="w-5 h-5" />}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatsCard
          title="Active Promoters"
          value={stats.activePromoters}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
        <div className="border border-border rounded-lg p-phi-5">
          <h2 className="text-xl font-semibold mb-phi-4">Recent Activity</h2>
          <p className="text-muted-foreground">Recent activity feed would appear here</p>
        </div>

        <div className="border border-border rounded-lg p-phi-5">
          <h2 className="text-xl font-semibold mb-phi-4">Upcoming Events</h2>
          <p className="text-muted-foreground">Upcoming events list would appear here</p>
        </div>
      </div>
    </div>
  );
}
