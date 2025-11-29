import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AvailableEvents, AvailableEventsSkeleton } from '@/components/promoter/organisms/AvailableEvents';
import { getAvailableEvents } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Events',
};

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-phi-4 py-phi-5 space-y-phi-5">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary-dark">Events</h1>
        <p className="text-muted-foreground mt-1">
          Browse events and create promotional links
        </p>
      </div>

      {/* Available Events */}
      <Suspense fallback={<AvailableEventsSkeleton />}>
        <EventsList />
      </Suspense>
    </div>
  );
}

async function EventsList() {
  const events = await getAvailableEvents();
  return <AvailableEvents events={events} />;
}
