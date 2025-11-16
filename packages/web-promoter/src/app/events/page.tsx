'use client';

import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { useAvailableEvents } from '@/hooks/use-available-events';
import { usePromoterLinks } from '@/hooks/use-promoter-links';
import { EventCard } from '@/components/promoter/molecules/EventCard';
import { Skeleton } from '@/components/promoter/atoms/Skeleton';
import { Button } from '@/components/promoter/atoms/Button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

export default function EventsPage() {
  const user = useUser({ or: 'redirect' });
  const { events, isLoading, error, refresh } = useAvailableEvents();
  const { generateLink } = usePromoterLinks();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const handleGenerateLink = async (eventId: string) => {
    setGeneratingId(eventId);

    try {
      const newLink = await generateLink(eventId);
      success(
        'Link Generated!',
        `Your affiliate link has been created: ${newLink.uniqueCode}`
      );

      // Copy link to clipboard
      await navigator.clipboard.writeText(newLink.url);
    } catch (err) {
      showError(
        'Failed to generate link',
        err instanceof Error ? err.message : 'Please try again'
      );
    } finally {
      setGeneratingId(null);
    }
  };

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
        <p className="text-red-600 mb-phi-4">Failed to load events</p>
        <Button onClick={refresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-phi-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-phi-2">Available Events</h1>
        <p className="text-muted-foreground">
          Browse upcoming events and generate affiliate links to start earning commissions
        </p>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-phi-7 bg-card border border-border rounded-lg">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-phi-3" />
          <p className="text-muted-foreground mb-phi-2">No events available</p>
          <p className="text-sm text-muted-foreground">
            Check back later for new events to promote
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onGenerateLink={handleGenerateLink}
              isGenerating={generatingId === event.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
