import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EventTable, EventTableSkeleton } from '@/components/admin/organisms/EventTable';
import { CreateEventButton } from '@/components/admin/molecules/CreateEventButton';
import { getAdminEvents } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Events',
};

export default function EventsPage() {
  return (
    <div className="space-y-phi-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary-dark">Events</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your events
          </p>
        </div>
        <CreateEventButton />
      </div>

      {/* Events Table */}
      <Suspense fallback={<EventTableSkeleton />}>
        <EventsList />
      </Suspense>
    </div>
  );
}

async function EventsList() {
  const events = await getAdminEvents();
  return <EventTable events={events} />;
}
