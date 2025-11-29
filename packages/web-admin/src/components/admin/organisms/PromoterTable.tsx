import type { UserProfile } from '@hubbard-inn/shared/types';
import { Badge, Button, Card, CardContent, Skeleton } from '@hubbard-inn/shared/components';
import { formatPrice, formatDate } from '@hubbard-inn/shared/utils';
import { PROMOTER_STATUSES } from '@hubbard-inn/shared/lib';
import { Check, X } from 'lucide-react';

interface PromoterTableProps {
  promoters: UserProfile[];
}

export function PromoterTable({ promoters }: PromoterTableProps) {
  if (promoters.length === 0) {
    return (
      <Card>
        <CardContent className="py-phi-6 text-center">
          <p className="text-muted-foreground">No promoters found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-border bg-muted/50">
            <tr className="text-left text-sm text-muted-foreground">
              <th className="p-phi-3 font-medium">Promoter</th>
              <th className="p-phi-3 font-medium">Joined</th>
              <th className="p-phi-3 font-medium">Commission</th>
              <th className="p-phi-3 font-medium">Earnings</th>
              <th className="p-phi-3 font-medium">Status</th>
              <th className="p-phi-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoters.map((promoter) => {
              const statusInfo = PROMOTER_STATUSES[promoter.promoterStatus || 'pending'];

              return (
                <tr key={promoter.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-phi-3">
                    <div>
                      <span className="font-medium block">{promoter.name}</span>
                      <span className="text-sm text-muted-foreground">{promoter.email}</span>
                    </div>
                  </td>
                  <td className="p-phi-3 text-muted-foreground">
                    {formatDate(promoter.createdAt)}
                  </td>
                  <td className="p-phi-3">
                    {promoter.commissionRate || 10}%
                  </td>
                  <td className="p-phi-3 font-medium">
                    {formatPrice((promoter.totalEarnings || 0) * 100)}
                  </td>
                  <td className="p-phi-3">
                    <Badge variant={statusInfo.color as 'default' | 'secondary' | 'destructive' | 'accent' | 'success' | 'muted'}>
                      {statusInfo.label}
                    </Badge>
                  </td>
                  <td className="p-phi-3">
                    {promoter.promoterStatus === 'pending' && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-success">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function PromoterTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-phi-4 space-y-phi-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-phi-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
