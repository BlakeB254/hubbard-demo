'use client';

import { useState } from 'react';
import type { Event } from '@hubbard-inn/shared/types';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hubbard-inn/shared/components';
import { formatPrice } from '@hubbard-inn/shared/utils';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface TicketPurchaseProps {
  event: Event;
}

/**
 * Ticket Purchase - Client Component
 * Requires client-side interactivity for quantity and checkout
 */
export function TicketPurchase({ event }: TicketPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState('');

  const ticketsRemaining = event.capacity - event.ticketsSold;
  const isSoldOut = event.status === 'sold_out' || ticketsRemaining <= 0;
  const price = event.salesMode === 'door' ? event.doorPrice : event.presalePrice;
  const totalPrice = price * quantity;
  const maxQuantity = Math.min(10, ticketsRemaining);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newValue = prev + delta;
      if (newValue < 1) return 1;
      if (newValue > maxQuantity) return maxQuantity;
      return newValue;
    });
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // TODO: Implement Stripe checkout
      console.log('Purchasing tickets:', {
        eventId: event.id,
        quantity,
        affiliateCode,
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('Checkout flow would open here');
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isSoldOut) {
    return (
      <Card>
        <CardContent className="py-phi-5 text-center">
          <div className="text-2xl mb-2">Sold Out</div>
          <p className="text-muted-foreground">
            This event is sold out. Check back for future events!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-phi-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Get Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-phi-4">
        {/* Price Display */}
        <div className="text-center p-phi-3 bg-background-alt rounded-lg">
          <p className="text-sm text-muted-foreground">Price per ticket</p>
          <p className="text-3xl font-bold text-primary">
            {formatPrice(price * 100)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {event.salesMode === 'door' ? 'Door price' : 'Presale price'}
          </p>
        </div>

        {/* Quantity Selector */}
        <div>
          <Label className="mb-2 block">Quantity</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="flex-1 text-center text-xl font-semibold">
              {quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= maxQuantity}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {ticketsRemaining} tickets remaining
          </p>
        </div>

        {/* Affiliate Code */}
        <div>
          <Label htmlFor="affiliate" className="mb-2 block">
            Promo Code (optional)
          </Label>
          <Input
            id="affiliate"
            placeholder="Enter code"
            value={affiliateCode}
            onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
          />
        </div>

        {/* Total and Checkout */}
        <div className="border-t border-border pt-phi-4">
          <div className="flex justify-between items-center mb-phi-3">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(totalPrice * 100)}
            </span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handlePurchase}
            loading={loading}
          >
            Checkout
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-phi-2">
            Secure checkout powered by Stripe
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
