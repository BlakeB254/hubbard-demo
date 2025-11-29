'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@hubbard-inn/shared/components';
import { FLOORS } from '@hubbard-inn/shared/lib';
import type { EventFloor } from '@hubbard-inn/shared/types';
import { cn } from '@hubbard-inn/shared/utils';

interface EventFiltersProps {
  currentFloor?: EventFloor;
}

/**
 * Event Filters - Client Component
 * Uses URL search params for filter state
 */
export function EventFilters({ currentFloor }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFloorChange = (floor: EventFloor | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (floor) {
      params.set('floor', floor);
    } else {
      params.delete('floor');
    }

    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-phi-2">
      <Button
        variant={!currentFloor ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFloorChange(null)}
      >
        All Venues
      </Button>
      {(Object.entries(FLOORS) as [EventFloor, { label: string }][]).map(
        ([key, { label }]) => (
          <Button
            key={key}
            variant={currentFloor === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFloorChange(key)}
          >
            {label}
          </Button>
        )
      )}
    </div>
  );
}
