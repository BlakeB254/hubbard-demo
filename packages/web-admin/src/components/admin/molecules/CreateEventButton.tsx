'use client';

import { Button } from '@hubbard-inn/shared/components';
import { Plus } from 'lucide-react';

export function CreateEventButton() {
  return (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      Create Event
    </Button>
  );
}
