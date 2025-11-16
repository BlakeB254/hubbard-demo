import { formatDate, formatCurrency } from '@hubbard-inn/shared';
import { ShoppingCart, Calendar } from 'lucide-react';

export interface Conversion {
  id: string;
  linkId: string;
  eventTitle: string;
  amount: number;
  commission: number;
  timestamp: string;
  tickets: number;
}

export interface RecentConversionsProps {
  conversions: Conversion[];
}

export function RecentConversions({ conversions }: RecentConversionsProps) {
  if (conversions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-phi-5">
        <h2 className="text-xl font-semibold mb-phi-4">Recent Conversions</h2>
        <div className="text-center py-phi-6">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-phi-3" />
          <p className="text-muted-foreground">No conversions yet</p>
          <p className="text-sm text-muted-foreground mt-phi-2">
            Start sharing your affiliate links to earn commissions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-phi-5">
      <h2 className="text-xl font-semibold mb-phi-4">Recent Conversions</h2>

      <div className="space-y-phi-3">
        {conversions.map((conversion) => (
          <div
            key={conversion.id}
            className="flex items-center justify-between p-phi-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-semibold mb-phi-1">{conversion.eventTitle}</h3>
              <div className="flex items-center gap-phi-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-phi-1">
                  <ShoppingCart className="w-3 h-3" />
                  <span>{conversion.tickets} ticket{conversion.tickets > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-phi-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(conversion.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-phi-1">Commission</p>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(conversion.commission)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {conversions.length >= 5 && (
        <div className="mt-phi-4 pt-phi-4 border-t border-border">
          <a
            href="/earnings"
            className="block text-center text-sm text-primary hover:underline"
          >
            View all conversions →
          </a>
        </div>
      )}
    </div>
  );
}
