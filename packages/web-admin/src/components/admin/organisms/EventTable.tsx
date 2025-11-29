'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Event } from '@hubbard-inn/shared/types';
import { Badge, Button, Card, CardContent, Skeleton } from '@hubbard-inn/shared/components';
import { formatDate, formatPrice } from '@hubbard-inn/shared/utils';
import { EVENT_STATUSES, FLOORS } from '@hubbard-inn/shared/lib';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';

interface EventTableProps {
  events: Event[];
}

export function EventTable({ events }: EventTableProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-phi-6 text-center">
          <p className="text-muted-foreground">No events found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="border-b border-border bg-muted/50">
            <tr className="text-left text-sm text-muted-foreground">
              <th className="p-phi-3 font-medium">Event</th>
              <th className="p-phi-3 font-medium">Date</th>
              <th className="p-phi-3 font-medium">Venue</th>
              <th className="p-phi-3 font-medium">Capacity</th>
              <th className="p-phi-3 font-medium">Price</th>
              <th className="p-phi-3 font-medium">Status</th>
              <th className="p-phi-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const statusInfo = EVENT_STATUSES[event.status];
              const floorInfo = FLOORS[event.floor];
              const percentSold = Math.round((event.ticketsSold / event.capacity) * 100);

              return (
                <tr key={event.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-phi-3">
                    <div>
                      <span className="font-medium block">{event.name}</span>
                      <span className="text-sm text-muted-foreground truncate block max-w-[200px]">
                        {event.description}
                      </span>
                    </div>
                  </td>
                  <td className="p-phi-3 text-muted-foreground">
                    {formatDate(event.date)}
                  </td>
                  <td className="p-phi-3">
                    {floorInfo.label}
                  </td>
                  <td className="p-phi-3">
                    <div>
                      <span>{event.ticketsSold}/{event.capacity}</span>
                      <div className="w-20 bg-muted rounded-full h-1.5 mt-1">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-phi-3">
                    {formatPrice(event.presalePrice * 100)}
                  </td>
                  <td className="p-phi-3">
                    <Badge variant={statusInfo.color as 'default' | 'secondary' | 'destructive' | 'accent' | 'success' | 'muted'}>
                      {statusInfo.label}
                    </Badge>
                  </td>
                  <td className="p-phi-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
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

export function EventTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-phi-4 space-y-phi-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-phi-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
