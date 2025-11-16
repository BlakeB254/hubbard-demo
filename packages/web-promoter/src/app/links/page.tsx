'use client';

import { useUser } from '@stackframe/stack';
import { usePromoterLinks } from '@/hooks/use-promoter-links';
import { useAvailableEvents } from '@/hooks/use-available-events';
import { LinkCard } from '@/components/promoter/molecules/LinkCard';
import { Skeleton } from '@/components/promoter/atoms/Skeleton';
import { Button } from '@/components/promoter/atoms/Button';
import { Link as LinkIcon } from 'lucide-react';

export default function LinksPage() {
  const user = useUser({ or: 'redirect' });
  const { links, isLoading, error, refresh } = usePromoterLinks();
  const { events } = useAvailableEvents();

  // Create a map of event IDs to event titles
  const eventMap = new Map(events.map((e) => [e.id, e.title]));

  if (isLoading) {
    return (
      <div className="space-y-phi-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-phi-7">
        <p className="text-red-600 mb-phi-4">Failed to load links</p>
        <Button onClick={refresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-phi-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-phi-2">My Affiliate Links</h1>
          <p className="text-muted-foreground">
            {links.length} active {links.length === 1 ? 'link' : 'links'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          Refresh
        </Button>
      </div>

      {/* Links Grid */}
      {links.length === 0 ? (
        <div className="text-center py-phi-7 bg-card border border-border rounded-lg">
          <LinkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-phi-3" />
          <p className="text-muted-foreground mb-phi-2">No affiliate links yet</p>
          <p className="text-sm text-muted-foreground mb-phi-4">
            Generate your first link from the Events page to start earning commissions
          </p>
          <Button asChild>
            <a href="/events">Browse Events</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              eventTitle={eventMap.get(link.eventId) || 'Unknown Event'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
