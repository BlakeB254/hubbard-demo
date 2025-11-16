'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/customer/atoms/Input';
import { Button } from '@/components/customer/atoms/Button';
import { TicketCard, type TicketData } from '@/components/customer/molecules/TicketCard';

interface OrderData {
  orderNumber: string;
  guestEmail: string;
  guestName?: string;
  tickets: TicketData[];
  totalAmount: number;
  createdAt: string;
}

export default function OrderLookupPage() {
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !orderNumber) {
      setError('Please enter both email and order number');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(
        `${API_URL}/api/customer/orders/lookup?email=${encodeURIComponent(email)}&orderNumber=${encodeURIComponent(orderNumber)}`
      );

      if (response.ok) {
        const data = await response.json();
        setOrder(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Order not found');
      }
    } catch (err) {
      console.error('Failed to lookup order:', err);
      setError('Failed to find order. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-phi-6 px-phi-4">
        <div className="max-w-4xl mx-auto text-center">
          <Search className="w-12 h-12 mx-auto mb-phi-3 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-phi-2">
            Find Your Order
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your email and order number to view your tickets
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-phi-4 py-phi-6">
        {/* Lookup Form */}
        <div className="bg-card border border-border rounded-phi-4 p-phi-5 mb-phi-6">
          <form onSubmit={handleLookup} className="space-y-phi-4">
            <Input
              type="email"
              label="Email Address *"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="text"
              label="Order Number *"
              placeholder="HI-2025-001234"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />

            {error && (
              <div className="bg-destructive/10 text-destructive p-phi-3 rounded-phi-3 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full min-h-[44px]"
              disabled={loading || !email || !orderNumber}
            >
              {loading ? 'Searching...' : 'Find My Order'}
            </Button>
          </form>

          <div className="mt-phi-4 pt-phi-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Your order number can be found in the confirmation email sent after purchase
            </p>
          </div>
        </div>

        {/* Order Results */}
        {order && (
          <div className="space-y-phi-5">
            {/* Order Info */}
            <div className="bg-card border border-border rounded-phi-4 p-phi-5">
              <div className="flex items-center justify-between mb-phi-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-phi-1">Order Number</p>
                  <p className="font-mono font-semibold text-foreground">{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-phi-1">Email</p>
                  <p className="font-medium text-foreground">{order.guestEmail}</p>
                </div>
              </div>
              {order.guestName && (
                <div className="pt-phi-3 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-phi-1">Name</p>
                  <p className="font-medium text-foreground">{order.guestName}</p>
                </div>
              )}
            </div>

            {/* Tickets */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-phi-4">
                Your Tickets ({order.tickets.length})
              </h2>
              <div className="space-y-phi-4">
                {order.tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} showQR={true} />
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-muted/50 rounded-phi-4 p-phi-5">
              <h3 className="text-lg font-semibold text-foreground mb-phi-3">Need Help?</h3>
              <div className="space-y-phi-2 text-sm text-muted-foreground">
                <p>• Save the confirmation email for easy access to your tickets</p>
                <p>• Show the QR code at the venue entrance for quick entry</p>
                <p>• Add tickets to Apple Wallet for offline access</p>
                <p>• Contact support if you have any issues with your order</p>
              </div>
            </div>
          </div>
        )}

        {/* No Account Required Message */}
        {!order && !loading && (
          <div className="bg-primary/10 border border-primary/20 rounded-phi-4 p-phi-5 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-phi-2">
              No Account Required
            </h3>
            <p className="text-sm text-muted-foreground">
              All orders are accessible using just your email and order number.
              You can always come back to this page to view your tickets.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
