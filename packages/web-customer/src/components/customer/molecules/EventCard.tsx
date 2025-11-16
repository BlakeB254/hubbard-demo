import Link from 'next/link';
import { format } from 'date-fns';
import { Badge, Button } from '@hubbard-inn/shared';
import { PriceTag } from '../atoms/PriceTag';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Event } from '@hubbard-inn/shared/types';

export interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.eventDate);
  const ageRestrictionBadge = {
    none: null,
    '18+': { variant: 'default' as const, text: '18+' },
    '21+': { variant: 'warning' as const, text: '21+' },
  }[event.ageRestriction];

  const statusBadge = {
    draft: { variant: 'outline' as const, text: 'Draft' },
    published: { variant: 'success' as const, text: 'On Sale' },
    sold_out: { variant: 'destructive' as const, text: 'Sold Out' },
    cancelled: { variant: 'destructive' as const, text: 'Cancelled' },
    completed: { variant: 'secondary' as const, text: 'Completed' },
  }[event.status];

  const isSoldOut = event.status === 'sold_out';
  const isCancelled = event.status === 'cancelled';
  const isAvailable = event.status === 'published' && !isSoldOut && !isCancelled;

  return (
    <div className="bg-card rounded-phi-4 border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Event Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="absolute top-phi-3 right-phi-3 flex gap-phi-2">
          <Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
          {ageRestrictionBadge && (
            <Badge variant={ageRestrictionBadge.variant}>{ageRestrictionBadge.text}</Badge>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="p-phi-4">
        <h3 className="text-lg font-semibold text-foreground mb-phi-2 line-clamp-2">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-muted-foreground mb-phi-3 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-phi-2 mb-phi-4">
          <div className="flex items-center gap-phi-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {format(eventDate, 'PPP')} at {event.startTime}
            </span>
          </div>

          <div className="flex items-center gap-phi-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Floor {event.floorNumber}</span>
          </div>

          <div className="flex items-center gap-phi-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Capacity: {event.totalCapacity}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {event.coverPrice > 0 ? (
              <PriceTag amount={event.coverPrice} size="lg" />
            ) : (
              <span className="text-lg font-semibold text-foreground">Free</span>
            )}
          </div>

          <Link href={`/events/${event.id}`}>
            <Button
              variant={isAvailable ? 'primary' : 'outline'}
              size="md"
              disabled={!isAvailable}
            >
              {isSoldOut ? 'Sold Out' : isCancelled ? 'Cancelled' : 'View Details'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
