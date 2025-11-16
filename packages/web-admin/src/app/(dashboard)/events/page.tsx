'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { Event } from '@hubbard-inn/shared';
import { EventTable } from '@/components/admin/organisms/EventTable';
import { CreateEventDialog } from '@/components/admin/organisms/CreateEventDialog';
import { Button } from '@/components/admin/atoms/Button';
import { api } from '@/lib/api';
import { Plus } from 'lucide-react';

export default function EventsPage() {
  const user = useUser({ or: 'redirect' });
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Event[]>('/api/admin/events');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Failed to load events:', error);
      // For now, use mock data if API fails
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleEdit = (id: string) => {
    console.log('Edit event:', id);
    // TODO: Implement edit functionality
  };

  const handleView = (id: string) => {
    console.log('View event:', id);
    // TODO: Implement view functionality
  };

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this event?')) {
      try {
        await api.patch(`/api/admin/events/${id}`, { status: 'cancelled' });
        loadEvents();
      } catch (error) {
        console.error('Failed to cancel event:', error);
        alert('Failed to cancel event');
      }
    }
  };

  return (
    <div className="p-phi-6">
      <div className="flex justify-between items-center mb-phi-5">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-phi-2">
            Manage events across all floors
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-5 h-5 mr-phi-2" />
          Create Event
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-phi-7">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <EventTable
          events={events}
          onEdit={handleEdit}
          onView={handleView}
          onCancel={handleCancel}
        />
      )}

      <CreateEventDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={loadEvents}
        venueId="default-venue-id"
      />
    </div>
  );
}
