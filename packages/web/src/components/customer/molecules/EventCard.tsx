import Link from 'next/link';
import type { Event } from '@hubbard-inn/shared/types';
import { Badge, Button, Card, CardContent } from '@hubbard-inn/shared/components';
import { formatDate, formatTime, formatPrice, getRelativeTime } from '@hubbard-inn/shared/utils';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { FLOORS, AGE_RESTRICTIONS } from '@hubbard-inn/shared/lib';

interface EventCardProps {
  event: Event;
}

/**
 * Event Card - Server Component
 */
export function EventCard({ event }: EventCardProps) {
  const floorInfo = FLOORS[event.floor];
  const ageInfo = AGE_RESTRICTIONS[event.ageRestriction];
  const relativeTime = getRelativeTime(event.date);
  const isSoldOut = event.status === 'sold_out';

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary to-secondary overflow-hidden">
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isSoldOut && (
            <Badge variant="destructive">Sold Out</Badge>
          )}
          {event.ageRestriction !== 'none' && (
            <Badge variant="secondary">{ageInfo.label}</Badge>
          )}
        </div>

        {/* Relative Time */}
        <div className="absolute top-3 right-3">
          <Badge variant="default" className="bg-black/50 backdrop-blur-sm">
            {relativeTime}
          </Badge>
        </div>
      </div>

      <CardContent className="p-phi-4">
        {/* Title */}
        <h3 className="font-heading text-xl text-primary-dark mb-phi-2 line-clamp-2">
          {event.name}
        </h3>

        {/* Details */}
        <div className="space-y-2 text-sm text-muted-foreground mb-phi-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{floorInfo.label}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-phi-2 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <p className="text-lg font-semibold text-primary">
              {formatPrice(event.presalePrice * 100)}
            </p>
          </div>
          <Link href={`/events/${event.id}`}>
            <Button
              variant={isSoldOut ? 'secondary' : 'default'}
              size="sm"
              disabled={isSoldOut}
            >
              {isSoldOut ? 'Sold Out' : 'Get Tickets'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
