'use client';

import { Event, Badge, Button, cn } from '@hubbard-inn/shared';
import { format } from 'date-fns';

export interface EventTableProps {
  events: Event[];
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function EventTable({ events, onEdit, onView, onCancel }: EventTableProps) {
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

  if (events.length === 0) {
    return (
      <div className="border border-border rounded-lg p-phi-6 text-center">
        <p className="text-muted-foreground">No events found</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-phi-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-border rounded-lg p-phi-4 bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-phi-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-phi-1">
                    {event.description}
                  </p>
                )}
              </div>
              <Badge variant={getStatusVariant(event.status)} className="ml-phi-2">
                {event.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-phi-3 text-sm mb-phi-4">
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{format(new Date(event.eventDate), 'MMM d, yyyy')}</p>
                <p className="text-xs text-muted-foreground">{event.startTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Floor</p>
                <p className="font-medium">Floor {event.floorNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Capacity</p>
                <p className="font-medium">{event.totalCapacity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-medium">${(event.coverPrice / 100).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-phi-2">
              {onView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(event.id)}
                  className="flex-1"
                >
                  View
                </Button>
              )}
              {onEdit && event.status !== 'cancelled' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEdit(event.id)}
                  className="flex-1"
                >
                  Edit
                </Button>
              )}
              {onCancel && event.status === 'published' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive flex-1"
                  onClick={() => onCancel(event.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left p-phi-3 font-semibold text-sm">Event</th>
                <th className="text-left p-phi-3 font-semibold text-sm">Date</th>
                <th className="text-left p-phi-3 font-semibold text-sm">Floor</th>
                <th className="text-left p-phi-3 font-semibold text-sm">Capacity</th>
                <th className="text-left p-phi-3 font-semibold text-sm">Price</th>
                <th className="text-left p-phi-3 font-semibold text-sm">Status</th>
                <th className="text-left p-phi-3 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="p-phi-3">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-phi-3 text-sm">
                    <div>
                      <p>{format(new Date(event.eventDate), 'MMM d, yyyy')}</p>
                      <p className="text-muted-foreground">{event.startTime}</p>
                    </div>
                  </td>
                  <td className="p-phi-3 text-sm">Floor {event.floorNumber}</td>
                  <td className="p-phi-3 text-sm">{event.totalCapacity}</td>
                  <td className="p-phi-3 text-sm font-medium">
                    ${(event.coverPrice / 100).toFixed(2)}
                  </td>
                  <td className="p-phi-3">
                    <Badge variant={getStatusVariant(event.status)}>
                      {event.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-phi-3">
                    <div className="flex gap-phi-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(event.id)}
                        >
                          View
                        </Button>
                      )}
                      {onEdit && event.status !== 'cancelled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(event.id)}
                        >
                          Edit
                        </Button>
                      )}
                      {onCancel && event.status === 'published' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onCancel(event.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
