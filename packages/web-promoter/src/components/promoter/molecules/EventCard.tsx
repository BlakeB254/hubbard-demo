import { formatDate, formatCurrency, Button, Badge } from '@hubbard-inn/shared';
import type { Event } from '@hubbard-inn/shared';
import { Calendar, MapPin, Users, Percent } from 'lucide-react';

export interface EventCardProps {
  event: Event;
  onGenerateLink: (eventId: string) => void;
  isGenerating?: boolean;
}

export function EventCard({ event, onGenerateLink, isGenerating }: EventCardProps) {
  const capacity = event.capacity || event.totalCapacity;
  const ticketsSold = event.ticketsSold || 0;
  const availableTickets = capacity - ticketsSold;
  const percentageSold = (ticketsSold / capacity) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-phi-5 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-phi-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-phi-2">{event.title}</h3>
          <p className="text-sm text-muted-foreground mb-phi-3">{event.description}</p>
        </div>
        <Badge variant={event.status === 'published' ? 'active' : 'inactive'}>
          {event.status}
        </Badge>
      </div>

      <div className="space-y-phi-2 mb-phi-4">
        <div className="flex items-center gap-phi-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{formatDate(event.eventDate)} at {event.startTime}</span>
        </div>

        <div className="flex items-center gap-phi-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>Hubbard Inn - Floor {event.floorNumber}</span>
        </div>

        <div className="flex items-center gap-phi-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>
            {ticketsSold} / {capacity} tickets sold ({percentageSold.toFixed(0)}%)
          </span>
        </div>

        <div className="flex items-center gap-phi-2 text-sm">
          <Percent className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-primary">
            {formatCurrency(event.affiliateCommissionAmount)} commission
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-phi-3 border-t border-border">
        <div>
          <p className="text-sm text-muted-foreground">Ticket Price</p>
          <p className="text-lg font-semibold">{formatCurrency(event.coverPrice)}</p>
        </div>

        <Button
          onClick={() => onGenerateLink(event.id)}
          isLoading={isGenerating}
          disabled={event.status !== 'published' || availableTickets === 0}
        >
          Generate Link
        </Button>
      </div>

      {availableTickets === 0 && (
        <p className="mt-phi-2 text-sm text-red-600">Sold out</p>
      )}
    </div>
  );
}
