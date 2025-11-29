import { Card, CardContent, Skeleton, EmptyState } from '@hubbard-inn/shared/components';
import { formatPrice, formatDate } from '@hubbard-inn/shared/utils';
import { ShoppingCart } from 'lucide-react';
import type { Conversion } from '@/lib/api';

interface RecentConversionsProps {
  conversions: Conversion[];
}

export function RecentConversions({ conversions }: RecentConversionsProps) {
  if (conversions.length === 0) {
    return (
      <Card>
        <CardContent className="py-phi-6">
          <EmptyState
            icon={<ShoppingCart className="w-12 h-12" />}
            title="No Conversions Yet"
            description="Share your links to start earning commissions"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {conversions.map((conversion) => (
            <div
              key={conversion.id}
              className="flex items-center justify-between p-phi-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-phi-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">{conversion.eventName}</p>
                  <p className="text-sm text-muted-foreground">
                    {conversion.ticketCount} ticket{conversion.ticketCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-success">
                  +{formatPrice(conversion.commission)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(conversion.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentConversionsSkeleton() {
  return (
    <Card>
      <CardContent className="p-phi-4 space-y-phi-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-phi-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
