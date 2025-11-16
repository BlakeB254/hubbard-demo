'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/admin/atoms/Button';
import { Badge } from '@/components/admin/atoms/Badge';
import { Card, CardContent } from '@/components/admin/atoms/Card';

interface Promoter {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  ticketsSold: number;
  revenue: number;
  commissionRate: number;
}

export default function PromotersPage() {
  const user = useUser({ or: 'redirect' });
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    setPromoters([]);
    setIsLoading(false);
  }, []);

  const getStatusVariant = (status: Promoter['status']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-phi-6">
      <div className="flex justify-between items-center mb-phi-5">
        <div>
          <h1 className="text-3xl font-bold">Promoters</h1>
          <p className="text-muted-foreground mt-phi-2">
            Manage promoter accounts and commissions
          </p>
        </div>
        <Button>Invite Promoter</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-phi-7">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : promoters.length === 0 ? (
        <Card>
          <CardContent className="p-phi-6 text-center">
            <p className="text-muted-foreground">No promoters found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left p-phi-3 font-semibold text-sm">Name</th>
                  <th className="text-left p-phi-3 font-semibold text-sm">Email</th>
                  <th className="text-left p-phi-3 font-semibold text-sm">Status</th>
                  <th className="text-left p-phi-3 font-semibold text-sm">
                    Tickets Sold
                  </th>
                  <th className="text-left p-phi-3 font-semibold text-sm">Revenue</th>
                  <th className="text-left p-phi-3 font-semibold text-sm">
                    Commission
                  </th>
                  <th className="text-left p-phi-3 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promoters.map((promoter) => (
                  <tr
                    key={promoter.id}
                    className="border-t border-border hover:bg-muted/50"
                  >
                    <td className="p-phi-3 font-medium">{promoter.name}</td>
                    <td className="p-phi-3 text-sm">{promoter.email}</td>
                    <td className="p-phi-3">
                      <Badge variant={getStatusVariant(promoter.status)}>
                        {promoter.status}
                      </Badge>
                    </td>
                    <td className="p-phi-3 text-sm">{promoter.ticketsSold}</td>
                    <td className="p-phi-3 text-sm">
                      ${(promoter.revenue / 100).toFixed(2)}
                    </td>
                    <td className="p-phi-3 text-sm">{promoter.commissionRate}%</td>
                    <td className="p-phi-3">
                      <div className="flex gap-phi-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
