'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateEventInput, FloorNumber, AgeRestriction, Button, Input } from '@hubbard-inn/shared';
import { FormField } from '../molecules/FormField';
import { Select } from '../molecules/Select';
import { api } from '@/lib/api';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  eventDate: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().optional(),
  floorNumber: z.enum(['1', '2', '3'] as const),
  totalCapacity: z.coerce.number().positive('Capacity must be positive'),
  ageRestriction: z.enum(['none', '18+', '21+'] as const),
  coverPrice: z.coerce.number().positive('Price must be positive'),
  presaleEnabled: z.boolean().optional().default(true),
  doorSalesEnabled: z.boolean().optional().default(true),
  affiliateCommissionEnabled: z.boolean().optional().default(false),
  affiliateCommissionAmount: z.coerce.number().optional().default(0),
});

type EventFormData = z.infer<typeof eventSchema>;

export interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  venueId: string;
}

export function CreateEventDialog({
  open,
  onClose,
  onSuccess,
  venueId,
}: CreateEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      floorNumber: '1' as const,
      totalCapacity: 0,
      ageRestriction: 'none' as const,
      coverPrice: 0,
      presaleEnabled: true,
      doorSalesEnabled: true,
      affiliateCommissionEnabled: false,
      affiliateCommissionAmount: 0,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsLoading(true);

      // Convert price from dollars to cents
      const eventData: CreateEventInput = {
        ...data,
        venueId,
        coverPrice: Math.round(data.coverPrice * 100),
        affiliateCommissionAmount: data.affiliateCommissionEnabled
          ? Math.round((data.affiliateCommissionAmount || 0) * 100)
          : 0,
      };

      await api.post('/api/admin/events', eventData);

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-phi-4">
      <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-phi-5 border-b border-border">
          <h2 className="text-2xl font-bold">Create New Event</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-phi-5 space-y-phi-4">
          <FormField
            label="Event Title"
            required
            error={errors.title?.message}
            htmlFor="title"
          >
            <Input id="title" {...register('title')} error={errors.title?.message} />
          </FormField>

          <FormField label="Description" htmlFor="description">
            <Input id="description" {...register('description')} />
          </FormField>

          <div className="grid grid-cols-2 gap-phi-4">
            <FormField
              label="Event Date"
              required
              error={errors.eventDate?.message}
              htmlFor="eventDate"
            >
              <Input
                id="eventDate"
                type="date"
                {...register('eventDate')}
                error={errors.eventDate?.message}
              />
            </FormField>

            <FormField
              label="Start Time"
              required
              error={errors.startTime?.message}
              htmlFor="startTime"
            >
              <Input
                id="startTime"
                type="time"
                {...register('startTime')}
                error={errors.startTime?.message}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-phi-4">
            <FormField
              label="Floor Number"
              required
              error={errors.floorNumber?.message}
              htmlFor="floorNumber"
            >
              <Select
                id="floorNumber"
                {...register('floorNumber')}
                options={[
                  { value: '1', label: 'Floor 1' },
                  { value: '2', label: 'Floor 2' },
                  { value: '3', label: 'Floor 3' },
                ]}
                error={!!errors.floorNumber}
              />
            </FormField>

            <FormField
              label="Total Capacity"
              required
              error={errors.totalCapacity?.message}
              htmlFor="totalCapacity"
            >
              <Input
                id="totalCapacity"
                type="number"
                {...register('totalCapacity')}
                error={errors.totalCapacity?.message}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-phi-4">
            <FormField
              label="Age Restriction"
              required
              error={errors.ageRestriction?.message}
              htmlFor="ageRestriction"
            >
              <Select
                id="ageRestriction"
                {...register('ageRestriction')}
                options={[
                  { value: 'none', label: 'No Restriction' },
                  { value: '18+', label: '18+' },
                  { value: '21+', label: '21+' },
                ]}
                error={!!errors.ageRestriction}
              />
            </FormField>

            <FormField
              label="Cover Price ($)"
              required
              error={errors.coverPrice?.message}
              htmlFor="coverPrice"
            >
              <Input
                id="coverPrice"
                type="number"
                step="0.01"
                {...register('coverPrice')}
                error={errors.coverPrice?.message}
              />
            </FormField>
          </div>

          <div className="flex gap-phi-5 pt-phi-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
