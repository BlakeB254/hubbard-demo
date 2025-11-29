import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@hubbard-inn/shared/components';
import { formatPrice, formatNumber } from '@hubbard-inn/shared/utils';
import type { AnalyticsData } from '@/lib/api';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-phi-5">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
              {data.revenue.length > 0 ? (
                <div className="w-full h-full p-phi-4">
                  {/* Simplified bar chart */}
                  <div className="flex items-end justify-between h-full gap-1">
                    {data.revenue.slice(-14).map((item, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary rounded-t transition-all hover:bg-primary-dark"
                        style={{
                          height: `${Math.max(10, (item.amount / Math.max(...data.revenue.map(r => r.amount))) * 100)}%`,
                        }}
                        title={`${item.date}: ${formatPrice(item.amount)}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tickets Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets Sold (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
              {data.tickets.length > 0 ? (
                <div className="w-full h-full p-phi-4">
                  <div className="flex items-end justify-between h-full gap-1">
                    {data.tickets.slice(-14).map((item, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-accent rounded-t transition-all hover:bg-accent/80"
                        style={{
                          height: `${Math.max(10, (item.count / Math.max(...data.tickets.map(t => t.count))) * 100)}%`,
                        }}
                        title={`${item.date}: ${formatNumber(item.count)} tickets`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Events */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Events</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topEvents.length > 0 ? (
            <div className="space-y-phi-3">
              {data.topEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-phi-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-phi-3">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {i + 1}
                    </span>
                    <span className="font-medium">{event.name}</span>
                  </div>
                  <div className="flex items-center gap-phi-5 text-sm">
                    <span className="text-muted-foreground">
                      {formatNumber(event.tickets)} tickets
                    </span>
                    <span className="font-semibold">
                      {formatPrice(event.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-phi-4">
              No event data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-phi-5">
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
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-phi-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
