import Link from 'next/link';
import type { Event } from '@hubbard-inn/shared/types';
import { Badge, Button, Card, CardContent, Skeleton } from '@hubbard-inn/shared/components';
import { formatDate, formatPrice } from '@hubbard-inn/shared/utils';
import { EVENT_STATUSES } from '@hubbard-inn/shared/lib';
import { ArrowRight } from 'lucide-react';

interface RecentEventsProps {
  events: Event[];
}

export function RecentEvents({ events }: RecentEventsProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-phi-6 text-center">
          <p className="text-muted-foreground">No events yet</p>
          <Link href="/events">
            <Button variant="outline" size="sm" className="mt-phi-3">
              Create Event
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left text-sm text-muted-foreground">
              <th className="p-phi-3 font-medium">Event</th>
              <th className="p-phi-3 font-medium">Date</th>
              <th className="p-phi-3 font-medium">Tickets</th>
              <th className="p-phi-3 font-medium">Revenue</th>
              <th className="p-phi-3 font-medium">Status</th>
              <th className="p-phi-3"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const statusInfo = EVENT_STATUSES[event.status];
              const revenue = event.ticketsSold * event.presalePrice;

              return (
                <tr key={event.id} className="border-b border-border last:border-0">
                  <td className="p-phi-3">
                    <span className="font-medium">{event.name}</span>
                  </td>
                  <td className="p-phi-3 text-muted-foreground">
                    {formatDate(event.date)}
                  </td>
                  <td className="p-phi-3">
                    {event.ticketsSold} / {event.capacity}
                  </td>
                  <td className="p-phi-3 font-medium">
                    {formatPrice(revenue * 100)}
                  </td>
                  <td className="p-phi-3">
                    <Badge variant={statusInfo.color as 'default' | 'secondary' | 'destructive' | 'accent' | 'success' | 'muted'}>
                      {statusInfo.label}
                    </Badge>
                  </td>
                  <td className="p-phi-3">
                    <Link href={`/events/${event.id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
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

export function RecentEventsSkeleton() {
  return (
    <Card>
      <CardContent className="p-phi-4 space-y-phi-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-phi-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
