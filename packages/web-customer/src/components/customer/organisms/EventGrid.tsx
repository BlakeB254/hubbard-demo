import type { Event } from '@hubbard-inn/shared/types';
import { EventCard } from '../molecules/EventCard';
import { EmptyState, Skeleton } from '@hubbard-inn/shared/components';
import { Calendar } from 'lucide-react';

interface EventGridProps {
  events: Event[];
  emptyMessage?: string;
}

/**
 * Event Grid - Server Component
 * Renders a grid of event cards
 */
export function EventGrid({ events, emptyMessage }: EventGridProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="w-12 h-12" />}
        title="No Events Found"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

/**
 * Event Grid Skeleton for loading state
 */
export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-lg border border-border overflow-hidden"
        >
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-phi-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
