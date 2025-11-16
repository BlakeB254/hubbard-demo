'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js';
import { Input, Button } from '@hubbard-inn/shared';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface CheckoutFormProps {
  eventId: string;
  quantity: number;
  totalAmount: number;
  onSuccess?: (orderNumber: string) => void;
}

function CheckoutForm({ eventId, quantity, totalAmount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Submit form to validate
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Validation failed');
        setProcessing(false);
        return;
      }

      // Create payment intent
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/customer/tickets/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          quantity,
          guestInfo: {
            email: guestEmail,
            name: guestName,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }

      const { data } = await response.json();

      // Confirm payment with Stripe
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${data.orderNumber}?email=${encodeURIComponent(guestEmail)}`,
          receipt_email: guestEmail,
        },
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
      } else {
        onSuccess?.(data.orderNumber);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const handleExpressCheckout = async (event: any) => {
    try {
      setProcessing(true);
      setError(null);

      // Create payment intent
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/customer/tickets/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          quantity,
          guestInfo: {
            email: event.billingDetails?.email || '',
            name: event.billingDetails?.name || '',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }

      const { data } = await response.json();

      if (stripe) {
        const { error: paymentError } = await stripe.confirmPayment({
          clientSecret: data.clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/orders/${data.orderNumber}?email=${encodeURIComponent(event.billingDetails?.email || '')}`,
          },
        });

        if (paymentError) {
          setError(paymentError.message || 'Payment failed');
          event.paymentFailed({ reason: 'fail' });
        } else {
          onSuccess?.(data.orderNumber);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      event.paymentFailed({ reason: 'fail' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-phi-4">
      {/* Express Checkout (Apple Pay / Google Pay) */}
      <div className="mb-phi-4">
        <ExpressCheckoutElement
          options={{
            buttonType: {
              applePay: 'buy',
              googlePay: 'buy',
            },
          }}
          onConfirm={handleExpressCheckout}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-phi-3 text-muted-foreground">
            Or pay with card
          </span>
        </div>
      </div>

      {/* Guest Information */}
      <Input
        type="email"
        label="Email for order confirmation *"
        value={guestEmail}
        onChange={(e) => setGuestEmail(e.target.value)}
        required
        placeholder="your@email.com"
      />

      <Input
        type="text"
        label="Name (optional)"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="Your name"
      />

      {/* Payment Element */}
      <div className="border border-border rounded-phi-3 p-phi-3">
        <PaymentElement />
      </div>

      {/* Optional Account Creation Message */}
      <div className="bg-muted/50 p-phi-3 rounded-phi-3 text-sm text-muted-foreground">
        <p className="flex items-start gap-phi-2">
          <span>✨</span>
          <span>Optional: Create an account after purchase to save your order history and earn rewards</span>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-phi-3 rounded-phi-3 text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!stripe || processing || !guestEmail}
      >
        {processing ? 'Processing...' : `Complete Purchase - $${(totalAmount / 100).toFixed(2)}`}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By completing this purchase, you agree to our terms and conditions
      </p>
    </form>
  );
}

export interface GuestCheckoutFormProps {
  eventId: string;
  quantity: number;
  totalAmount: number;
  clientSecret?: string;
  onSuccess?: (orderNumber: string) => void;
}

export function GuestCheckoutForm({
  eventId,
  quantity,
  totalAmount,
  clientSecret,
  onSuccess,
}: GuestCheckoutFormProps) {
  if (!clientSecret) {
    return (
      <div className="text-center p-phi-5">
        <p className="text-muted-foreground">Loading payment form...</p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#6366f1',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        eventId={eventId}
        quantity={quantity}
        totalAmount={totalAmount}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}
