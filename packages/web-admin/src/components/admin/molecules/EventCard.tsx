import { Event, Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@hubbard-inn/shared';
import { format } from 'date-fns';

export interface EventCardProps {
  event: Event;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
}

export function EventCard({ event, onEdit, onView }: EventCardProps) {
  const getStatusVariant = (status: Event['status']) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'sold_out':
        return 'error';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <Badge variant={getStatusVariant(event.status)}>
            {event.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-phi-2 text-sm">
          <p className="text-muted-foreground">
            {format(new Date(event.eventDate), 'PPP')} at {event.startTime}
          </p>
          <p className="text-muted-foreground">Floor {event.floorNumber}</p>
          <p className="text-muted-foreground">
            Capacity: {event.totalCapacity}
          </p>
          <p className="font-semibold">
            ${(event.coverPrice / 100).toFixed(2)}
          </p>
        </div>

        <div className="flex gap-phi-2 mt-phi-4">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(event.id)}
            >
              View
            </Button>
          )}
          {onEdit && (
            <Button size="sm" onClick={() => onEdit(event.id)}>
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
