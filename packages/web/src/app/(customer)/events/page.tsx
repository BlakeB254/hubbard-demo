import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EventGrid, EventGridSkeleton } from '@/components/customer/organisms/EventGrid';
import { EventFilters } from '@/components/customer/molecules/EventFilters';
import { getAllEvents } from '@/lib/api';
import type { EventFloor } from '@hubbard-inn/shared/types';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Browse all upcoming events at Hubbard Inn',
};

interface EventsPageProps {
  searchParams: Promise<{
    floor?: EventFloor;
    search?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;

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

      {/* Filters and Events */}
      <section className="max-w-7xl mx-auto px-phi-4 py-phi-5">
        <EventFilters currentFloor={params.floor} />

        <div className="mt-phi-5">
          <Suspense
            key={`${params.floor}-${params.search}`}
            fallback={<EventGridSkeleton count={9} />}
          >
            <EventsList floor={params.floor} search={params.search} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function EventsList({
  floor,
  search,
}: {
  floor?: EventFloor;
  search?: string;
}) {
  const events = await getAllEvents({ floor, search });

  return (
    <EventGrid
      events={events}
      emptyMessage={
        floor || search
          ? 'No events match your filters. Try adjusting your search.'
          : 'No upcoming events at this time.'
      }
    />
  );
}
