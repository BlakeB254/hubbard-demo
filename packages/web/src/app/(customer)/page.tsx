import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@hubbard-inn/shared/components';
import { Hero } from '@/components/customer/organisms/Hero';
import { PortalsSection } from '@/components/customer/organisms/PortalsSection';
import { FeaturesSection } from '@/components/customer/organisms/FeaturesSection';
import { EventGrid, EventGridSkeleton } from '@/components/customer/organisms/EventGrid';
import { NewsletterSection } from '@/components/customer/organisms/NewsletterSection';
import { getUpcomingEvents } from '@/lib/api';

/**
 * Landing Page - Server Component
 * Explains the SaaS platform and links to all portals
 */
export default async function HomePage() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <Hero />

      {/* Portals Section - Links to all three portals */}
      <PortalsSection />

      {/* Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-phi-4 py-phi-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-phi-6 gap-phi-3">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-normal text-primary-dark mb-phi-2">
              Upcoming Events
            </h2>
            <p className="font-body text-base text-muted-foreground">
              Browse our latest events and reserve your spot
            </p>
          </div>
          <Link href="/events">
            <Button variant="outline" size="md" className="whitespace-nowrap">
              View All Events
            </Button>
          </Link>
        </div>

        <Suspense fallback={<EventGridSkeleton count={6} />}>
          <UpcomingEvents />
        </Suspense>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}

async function UpcomingEvents() {
  const events = await getUpcomingEvents(6);

  return (
    <EventGrid
      events={events}
      emptyMessage="No upcoming events at this time. Check back soon!"
    />
  );
}
