import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEventById } from '@/lib/api';
import { EventDetails } from '@/components/customer/organisms/EventDetails';
import { TicketPurchase } from '@/components/customer/organisms/TicketPurchase';
import { Skeleton } from '@hubbard-inn/shared/components';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Next.js 16: Generate metadata dynamically
 */
export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: event.name,
    description: event.description,
    openGraph: {
      title: event.name,
      description: event.description,
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  };
}

/**
 * Next.js 16: Async params with proper await
 */
export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Event Header */}
      <section
        className="relative h-[40vh] min-h-[300px] bg-cover bg-center"
        style={{
          backgroundImage: event.imageUrl
            ? `url(${event.imageUrl})`
            : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-phi-4 pb-phi-5 w-full">
            <h1 className="font-heading text-4xl md:text-5xl text-white mb-phi-2">
              {event.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Event Content */}
      <section className="max-w-7xl mx-auto px-phi-4 py-phi-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-phi-5">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <EventDetails event={event} />
          </div>

          {/* Ticket Purchase */}
          <div className="lg:col-span-1">
            <Suspense fallback={<TicketPurchaseSkeleton />}>
              <TicketPurchase event={event} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}

function TicketPurchaseSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-phi-4 space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
