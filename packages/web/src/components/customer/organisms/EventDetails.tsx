import type { Event } from '@hubbard-inn/shared/types';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@hubbard-inn/shared/components';
import { formatDate, formatTime, formatPrice } from '@hubbard-inn/shared/utils';
import { Calendar, Clock, MapPin, Users, Info } from 'lucide-react';
import { FLOORS, AGE_RESTRICTIONS, EVENT_STATUSES } from '@hubbard-inn/shared/lib';

interface EventDetailsProps {
  event: Event;
}

/**
 * Event Details - Server Component
 */
export function EventDetails({ event }: EventDetailsProps) {
  const floorInfo = FLOORS[event.floor];
  const ageInfo = AGE_RESTRICTIONS[event.ageRestriction];
  const statusInfo = EVENT_STATUSES[event.status];
  const ticketsRemaining = event.capacity - event.ticketsSold;
  const percentSold = Math.round((event.ticketsSold / event.capacity) * 100);

  return (
    <div className="space-y-phi-5">
      {/* Event Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Event Details</CardTitle>
            <Badge variant={statusInfo.color as 'default' | 'secondary' | 'destructive' | 'accent' | 'success' | 'muted'}>
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-phi-4">
          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-phi-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(event.date, 'EEEE, MMMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Venue & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-phi-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Venue</p>
                <p className="font-medium">{floorInfo.label}</p>
                <p className="text-sm text-muted-foreground">{floorInfo.description}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age Restriction</p>
                <p className="font-medium">{ageInfo.label}</p>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-medium">{ticketsRemaining} tickets remaining</p>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${percentSold}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {percentSold}% sold
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card>
        <CardHeader>
          <CardTitle>About This Event</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </CardContent>
      </Card>

      {/* Pricing Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-phi-4">
            <div className="p-phi-3 rounded-lg bg-background-alt">
              <p className="text-sm text-muted-foreground">Presale</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(event.presalePrice * 100)}
              </p>
            </div>
            <div className="p-phi-3 rounded-lg bg-background-alt">
              <p className="text-sm text-muted-foreground">At Door</p>
              <p className="text-2xl font-bold text-foreground">
                {formatPrice(event.doorPrice * 100)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
