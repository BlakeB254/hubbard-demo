'use client';

import { EventCard } from '../molecules/EventCard';
import type { Event } from '@hubbard-inn/shared/types';

export interface EventGridProps {
  events: Event[];
  loading?: boolean;
  emptyMessage?: string;
}

export function EventGrid({
  events,
  loading = false,
  emptyMessage = 'No events found',
}: EventGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-card rounded-phi-4 border border-border overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-muted" />
            <div className="p-phi-4 space-y-phi-3">
              <div className="h-6 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="space-y-phi-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-phi-7">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
        <p className="text-muted-foreground text-sm mt-phi-2">
          Try adjusting your filters or check back soon for new events
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-5">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
