'use client';

import { useEffect, useState } from 'react';
import { EventGrid } from '@/components/customer/organisms/EventGrid';
import { FilterControls, type FilterOptions } from '@/components/customer/molecules/FilterControls';
import type { Event } from '@hubbard-inn/shared/types';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    floor: 'all',
    ageRestriction: 'all',
    status: 'all',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, events]);

  const loadEvents = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/customer/events`);

      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (filters.floor !== 'all') {
      filtered = filtered.filter((event) => event.floorNumber === filters.floor);
    }

    if (filters.ageRestriction !== 'all') {
      filtered = filtered.filter((event) => event.ageRestriction === filters.ageRestriction);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((event) => event.status === filters.status);
    }

    setFilteredEvents(filtered);
  };

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-phi-6 px-phi-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-phi-2">
            All Events
          </h1>
          <p className="text-muted-foreground">
            Browse all upcoming events at Hubbard Inn
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-phi-4 py-phi-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-phi-5">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <FilterControls filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            <div className="mb-phi-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading
                  ? 'Loading events...'
                  : `Showing ${filteredEvents.length} ${filteredEvents.length === 1 ? 'event' : 'events'}`}
              </p>
            </div>

            <EventGrid
              events={filteredEvents}
              loading={loading}
              emptyMessage="No events match your filters. Try adjusting your selection."
            />
          </div>
        </div>
      </div>
    </main>
  );
}
