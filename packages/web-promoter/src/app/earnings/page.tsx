'use client';

import { useUser } from '@stackframe/stack';
import { useEarnings } from '@/hooks/use-earnings';
import { StatCard } from '@/components/promoter/atoms/StatCard';
import { Skeleton } from '@/components/promoter/atoms/Skeleton';
import { Button } from '@/components/promoter/atoms/Button';
import { Badge } from '@/components/promoter/atoms/Badge';
import { formatCurrency, formatDate } from '@hubbard-inn/shared';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function EarningsPage() {
  const user = useUser({ or: 'redirect' });
  const { earnings, isLoading, error, refresh } = useEarnings();

  if (isLoading) {
    return (
      <div className="space-y-phi-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !earnings) {
    return (
      <div className="text-center py-phi-7">
        <p className="text-red-600 mb-phi-4">Failed to load earnings data</p>
        <Button onClick={refresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-phi-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-phi-2">Earnings</h1>
        <p className="text-muted-foreground">Track your commissions and payout history</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-4">
        <StatCard
          label="Total Lifetime Earnings"
          value={formatCurrency(earnings.totalEarnings)}
          icon={<DollarSign className="w-5 h-5" />}
          highlighted
        />
        <StatCard
          label="This Month"
          value={formatCurrency(earnings.currentMonth)}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          label="Pending Payout"
          value={formatCurrency(earnings.pending)}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-card border border-border rounded-lg p-phi-5">
        <h2 className="text-xl font-semibold mb-phi-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={earnings.monthlyEarnings}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => {
                const [year, month] = value.split('-');
                return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                  month: 'short',
                });
              }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 100).toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Earnings']}
              labelFormatter={(label) => {
                const [year, month] = label.split('-');
                return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                });
              }}
            />
            <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Earnings History */}
      <div className="bg-card border border-border rounded-lg p-phi-5">
        <h2 className="text-xl font-semibold mb-phi-4">Earnings History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Date</th>
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Event</th>
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Tickets Sold</th>
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Revenue</th>
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Commission</th>
                <th className="text-left py-phi-3 px-phi-2 text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {earnings.history.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-phi-3 px-phi-2 text-sm">{formatDate(item.date)}</td>
                  <td className="py-phi-3 px-phi-2 text-sm font-medium">{item.eventTitle}</td>
                  <td className="py-phi-3 px-phi-2 text-sm">{item.ticketsSold}</td>
                  <td className="py-phi-3 px-phi-2 text-sm">{formatCurrency(item.revenue)}</td>
                  <td className="py-phi-3 px-phi-2 text-sm font-semibold text-primary">
                    {formatCurrency(item.commission)}
                  </td>
                  <td className="py-phi-3 px-phi-2">
                    <Badge variant={item.status}>
                      {item.status === 'paid' && <CheckCircle className="w-3 h-3 mr-phi-1 inline" />}
                      {item.status === 'pending' && <Clock className="w-3 h-3 mr-phi-1 inline" />}
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Info */}
      <div className="bg-accent/10 border border-accent rounded-lg p-phi-5">
        <h3 className="font-semibold mb-phi-2">Payout Information</h3>
        <ul className="list-disc list-inside space-y-phi-2 text-sm">
          <li>Payouts are processed monthly on the 1st of each month</li>
          <li>Minimum payout threshold is $50.00</li>
          <li>Commissions are paid 30 days after the event date</li>
          <li>All payments are made via direct deposit</li>
        </ul>
      </div>
    </div>
  );
}
