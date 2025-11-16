'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/customer/atoms/Badge';
import { PriceTag } from '@/components/customer/atoms/PriceTag';
import { Button } from '@/components/customer/atoms/Button';
import { Input } from '@/components/customer/atoms/Input';
import { GuestCheckoutForm } from '@/components/customer/molecules/GuestCheckoutForm';
import type { Event } from '@hubbard-inn/shared/types';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [promoterCode, setPromoterCode] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/customer/events/${eventId}`);

      if (response.ok) {
        const data = await response.json();
        setEvent(data.data);
      }
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!event) return;

    setShowCheckout(true);
    // In a real implementation, you would create the payment intent here
    // For now, we'll use a placeholder
    setClientSecret('placeholder_client_secret');
  };

  if (loading) {
    return (
      <main className="min-h-screen pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-phi-4 py-phi-6">
          <div className="animate-pulse space-y-phi-5">
            <div className="h-64 bg-muted rounded-phi-4" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="space-y-phi-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-phi-2">Event Not Found</h1>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  const eventDate = new Date(event.eventDate);
  const isAvailable = event.status === 'published';
  const isSoldOut = event.status === 'sold_out';
  const totalAmount = event.coverPrice * quantity;

  const statusBadge = {
    draft: { variant: 'outline' as const, text: 'Draft' },
    published: { variant: 'success' as const, text: 'On Sale' },
    sold_out: { variant: 'destructive' as const, text: 'Sold Out' },
    cancelled: { variant: 'destructive' as const, text: 'Cancelled' },
    completed: { variant: 'secondary' as const, text: 'Completed' },
  }[event.status];

  const ageRestrictionBadge = {
    none: null,
    '18+': { variant: 'default' as const, text: '18+' },
    '21+': { variant: 'warning' as const, text: '21+' },
  }[event.ageRestriction];

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Event Hero */}
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-phi-4 pb-phi-5">
            <div className="flex gap-phi-2 mb-phi-3">
              <Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
              {ageRestrictionBadge && (
                <Badge variant={ageRestrictionBadge.variant}>{ageRestrictionBadge.text}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-phi-4 py-phi-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-phi-6">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-phi-5">
            {/* Description */}
            {event.description && (
              <section className="bg-card border border-border rounded-phi-4 p-phi-5">
                <h2 className="text-xl font-semibold text-foreground mb-phi-3">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </section>
            )}

            {/* Event Info */}
            <section className="bg-card border border-border rounded-phi-4 p-phi-5">
              <h2 className="text-xl font-semibold text-foreground mb-phi-4">Event Details</h2>
              <div className="space-y-phi-3">
                <div className="flex items-center gap-phi-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(eventDate, 'PPPP')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-phi-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-phi-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">Hubbard Inn - Floor {event.floorNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-phi-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">{event.totalCapacity} guests</p>
                  </div>
                </div>

                {event.coverPrice > 0 && (
                  <div className="flex items-center gap-phi-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cover Price</p>
                      <PriceTag amount={event.coverPrice} size="md" />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Checkout Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-phi-4 bg-card border border-border rounded-phi-4 p-phi-5 space-y-phi-4">
              {!showCheckout ? (
                <>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-phi-2">Get Tickets</h3>
                    {event.coverPrice > 0 ? (
                      <div className="flex items-baseline gap-phi-2">
                        <PriceTag amount={event.coverPrice} size="lg" />
                        <span className="text-sm text-muted-foreground">per ticket</span>
                      </div>
                    ) : (
                      <p className="text-lg font-semibold text-foreground">Free Entry</p>
                    )}
                  </div>

                  {isAvailable && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-phi-2">
                          Quantity
                        </label>
                        <div className="flex items-center gap-phi-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {event.affiliateCommissionEnabled && (
                        <Input
                          label="Promoter Code (optional)"
                          placeholder="Enter code"
                          value={promoterCode}
                          onChange={(e) => setPromoterCode(e.target.value)}
                        />
                      )}

                      <div className="pt-phi-3 border-t border-border">
                        <div className="flex items-center justify-between mb-phi-3">
                          <span className="text-sm text-muted-foreground">Total</span>
                          <PriceTag amount={totalAmount} size="lg" />
                        </div>

                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full min-h-[44px]"
                          onClick={handleProceedToCheckout}
                        >
                          Proceed to Checkout
                        </Button>

                        <p className="text-xs text-center text-muted-foreground mt-phi-3">
                          No account required - checkout as guest
                        </p>
                      </div>
                    </>
                  )}

                  {isSoldOut && (
                    <div className="bg-destructive/10 text-destructive p-phi-4 rounded-phi-3 text-center">
                      <p className="font-semibold">Sold Out</p>
                      <p className="text-sm mt-phi-1">This event is no longer available</p>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-sm text-primary hover:underline mb-phi-4"
                  >
                    ← Back to event details
                  </button>

                  <h3 className="text-xl font-semibold text-foreground mb-phi-4">Checkout</h3>

                  <GuestCheckoutForm
                    eventId={eventId}
                    quantity={quantity}
                    totalAmount={totalAmount}
                    clientSecret={clientSecret}
                    onSuccess={(orderNumber) => {
                      // Redirect to success page
                      window.location.href = `/orders/${orderNumber}`;
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
