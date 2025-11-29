'use client';

import { useState } from 'react';
import type { Event } from '@hubbard-inn/shared/types';
import { Card, CardContent, Button, Badge, Skeleton, EmptyState } from '@hubbard-inn/shared/components';
import { formatDate, formatPrice } from '@hubbard-inn/shared/utils';
import { FLOORS, AGE_RESTRICTIONS } from '@hubbard-inn/shared/lib';
import { Calendar, Link2, Check, Copy } from 'lucide-react';

interface AvailableEventsProps {
  events: Event[];
}

export function AvailableEvents({ events }: AvailableEventsProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="w-12 h-12" />}
        title="No Events Available"
        description="Check back later for new events to promote"
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

function EventCard({ event }: { event: Event }) {
  const [creating, setCreating] = useState(false);
  const [linkCreated, setLinkCreated] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const floorInfo = FLOORS[event.floor];
  const ageInfo = AGE_RESTRICTIONS[event.ageRestriction];

  const handleCreateLink = async () => {
    setCreating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLinkUrl(`https://hubbardinn.com/e/${event.id}?ref=PROMO123`);
    setLinkCreated(true);
    setCreating(false);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(linkUrl);
  };

  return (
    <Card>
      <div className="h-32 bg-gradient-to-br from-primary to-secondary relative">
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="bg-black/50">
            {event.affiliateCommission}% commission
          </Badge>
        </div>
      </div>
      <CardContent className="p-phi-4">
        <h3 className="font-heading text-lg text-primary-dark mb-phi-2 line-clamp-1">
          {event.name}
        </h3>
        <div className="space-y-1 text-sm text-muted-foreground mb-phi-3">
          <p>{formatDate(event.date)} - {floorInfo.label}</p>
          <p>From {formatPrice(event.presalePrice * 100)}</p>
          {event.ageRestriction !== 'none' && (
            <Badge variant="outline" className="text-xs">
              {ageInfo.label}
            </Badge>
          )}
        </div>

        {linkCreated ? (
          <div className="space-y-phi-2">
            <div className="flex items-center gap-phi-2 p-phi-2 bg-muted rounded-lg">
              <input
                type="text"
                value={linkUrl}
                readOnly
                className="flex-1 bg-transparent text-sm truncate outline-none"
              />
              <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-phi-2 text-success text-sm">
              <Check className="w-4 h-4" />
              <span>Link created!</span>
            </div>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={handleCreateLink}
            loading={creating}
          >
            <Link2 className="w-4 h-4 mr-2" />
            Create Link
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function AvailableEventsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="h-32 w-full rounded-none" />
          <CardContent className="p-phi-4 space-y-phi-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
