'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/customer/organisms/Hero';
import { FeaturesSection } from '@/components/customer/organisms/FeaturesSection';
import { EventGrid } from '@/components/customer/organisms/EventGrid';
import { Button } from '@/components/customer/atoms/Button';
import Link from 'next/link';
import type { Event } from '@hubbard-inn/shared/types';

export default function CustomerHomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcomingEvents();
  }, []);

  const loadUpcomingEvents = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/customer/events`);

      if (response.ok) {
        const data = await response.json();
        // Show only first 6 events on homepage
        setUpcomingEvents(data.data?.slice(0, 6) || []);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <Hero />

      {/* Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-phi-4 py-phi-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-phi-6 gap-phi-3">
          <div>
            <h2 className="font-['Prata',serif] text-3xl md:text-4xl font-normal text-primary-dark mb-phi-2">
              Upcoming Events
            </h2>
            <p className="font-['Montserrat',sans-serif] text-base text-muted-foreground">
              Browse our latest events and reserve your spot
            </p>
          </div>
          {!loading && upcomingEvents.length > 0 && (
            <Link href="/events">
              <Button variant="outline" size="md" className="whitespace-nowrap">
                View All Events
              </Button>
            </Link>
          )}
        </div>

        <EventGrid
          events={upcomingEvents}
          loading={loading}
          emptyMessage="No upcoming events at this time. Check back soon!"
        />
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Newsletter Signup */}
      <section className="max-w-4xl mx-auto px-phi-4 py-phi-7">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary rounded-phi-5 p-phi-6 md:p-phi-7 text-center border-2 border-accent/30 shadow-2xl">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="font-['Prata',serif] text-2xl md:text-3xl font-normal text-white mb-phi-3">
              Stay in the Loop
            </h2>
            <p className="font-['Montserrat',sans-serif] text-white/90 mb-phi-5 max-w-2xl mx-auto leading-relaxed">
              Be the first to know about new events, special offers, and exclusive VIP experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-phi-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-[2.75rem] rounded-phi-3 border-2 border-white/30 bg-white/10 backdrop-blur-sm px-phi-4 py-phi-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <Button variant="accent" size="md" className="min-h-[44px] whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
