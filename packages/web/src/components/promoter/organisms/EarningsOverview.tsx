import type { PromoterEarnings } from '@hubbard-inn/shared/types';
import { Card, CardContent, CardHeader, CardTitle, Badge, Skeleton, EmptyState } from '@hubbard-inn/shared/components';
import { formatPrice, formatNumber } from '@hubbard-inn/shared/utils';
import { DollarSign, Clock, Calendar } from 'lucide-react';

interface EarningsOverviewProps {
  earnings: PromoterEarnings;
}

export function EarningsOverview({ earnings }: EarningsOverviewProps) {
  return (
    <div className="space-y-phi-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-4">
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-phi-5">
            <div className="flex items-center gap-phi-3">
              <div className="p-3 rounded-full bg-success/20">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold text-success">
                  {formatPrice(earnings.totalEarnings)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-phi-5">
            <div className="flex items-center gap-phi-3">
              <div className="p-3 rounded-full bg-accent/20">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
                <p className="text-3xl font-bold text-accent">
                  {formatPrice(earnings.pendingPayout)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {earnings.lastPayout && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-phi-5">
              <div className="flex items-center gap-phi-3">
                <div className="p-3 rounded-full bg-primary/20">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Payout</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(earnings.lastPayout.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {earnings.lastPayout.date}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Earnings by Event */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings by Event</CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.byEvent.length === 0 ? (
            <EmptyState
              icon={<DollarSign className="w-12 h-12" />}
              title="No Earnings Yet"
              description="Start promoting events to earn commissions"
            />
          ) : (
            <div className="space-y-phi-3">
              {earnings.byEvent.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-phi-4 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{event.eventName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(event.conversions)} sales - {formatPrice(event.revenue)} revenue
                    </p>
                  </div>
                  <Badge variant="success" className="text-base px-3 py-1">
                    {formatPrice(event.commission)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function EarningsOverviewSkeleton() {
  return (
    <div className="space-y-phi-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-phi-5">
              <div className="flex items-center gap-phi-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-phi-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
