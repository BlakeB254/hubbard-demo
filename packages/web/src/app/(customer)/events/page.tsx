import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EventGrid, EventGridSkeleton } from '@/components/customer/organisms/EventGrid';
import { getAllEvents } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Browse all upcoming events at Hubbard Inn',
};

export default async function EventsPage() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary to-primary-dark text-white py-phi-6">
        <div className="max-w-7xl mx-auto px-phi-4">
          <h1 className="font-heading text-4xl md:text-5xl font-normal mb-phi-2">
            Upcoming Events
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Discover the best events at Chicago&apos;s premier venue
          </p>
        </div>
      </section>

      {/* Events */}
      <section className="max-w-7xl mx-auto px-phi-4 py-phi-5">
        <Suspense fallback={<EventGridSkeleton count={9} />}>
          <EventsList />
        </Suspense>
      </section>
    </main>
  );
}

async function EventsList() {
  const events = await getAllEvents();

  return (
    <EventGrid
      events={events}
      emptyMessage="No upcoming events at this time."
    />
  );
}
