'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download, Mail } from 'lucide-react';
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

export default function OrderSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params?.orderNumber as string;
  const email = searchParams?.get('email') || '';

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (orderNumber && email) {
      loadOrder();
    } else {
      setError('Missing order information');
      setLoading(false);
    }
  }, [orderNumber, email]);

  const loadOrder = async () => {
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
      console.error('Failed to load order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-phi-3" />
          <p className="text-muted-foreground">Loading your order...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-phi-4">
          <div className="bg-destructive/10 text-destructive p-phi-5 rounded-phi-4 mb-phi-4">
            <p className="font-semibold mb-phi-2">Order Not Found</p>
            <p className="text-sm">{error || 'Unable to retrieve order details'}</p>
          </div>
          <Link href="/orders/lookup">
            <Button variant="primary" size="md">
              Try Order Lookup
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 py-phi-6 px-phi-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-phi-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-phi-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground mb-phi-3">
            Your tickets have been sent to{' '}
            <span className="font-medium text-foreground">{order.guestEmail}</span>
          </p>
          <div className="inline-flex items-center gap-phi-2 bg-background px-phi-4 py-phi-2 rounded-phi-3 border border-border">
            <span className="text-sm text-muted-foreground">Order Number:</span>
            <span className="font-mono font-semibold text-foreground">{order.orderNumber}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-phi-4 py-phi-6">
        {/* Important Info */}
        <div className="bg-primary/10 border border-primary/20 rounded-phi-4 p-phi-4 mb-phi-6">
          <div className="flex items-start gap-phi-3">
            <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-phi-1">Check your email</p>
              <p className="text-sm text-muted-foreground">
                A confirmation email with your tickets and QR codes has been sent to {order.guestEmail}.
                Save the email or add tickets to your Apple Wallet for easy access at the venue.
              </p>
            </div>
          </div>
        </div>

        {/* Your Tickets */}
        <div className="mb-phi-6">
          <h2 className="text-2xl font-bold text-foreground mb-phi-4">Your Tickets</h2>
          <div className="space-y-phi-4">
            {order.tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} showQR={true} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card border border-border rounded-phi-4 p-phi-5">
          <h3 className="text-lg font-semibold text-foreground mb-phi-4">What's Next?</h3>
          <div className="space-y-phi-3">
            <Button variant="outline" size="md" className="w-full justify-start min-h-[44px]">
              <Download className="w-5 h-5 mr-phi-2" />
              Add to Apple Wallet
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Present your QR code at the venue entrance for quick entry
            </p>

            <div className="pt-phi-3 border-t border-border">
              <p className="text-sm text-muted-foreground mb-phi-3">
                Want to view your order later?
              </p>
              <Link href="/orders/lookup">
                <Button variant="ghost" size="sm" className="w-full">
                  Order Lookup
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Optional Account Creation */}
        <div className="mt-phi-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-phi-4 p-phi-5 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-phi-2">
            Create an Account to Save Your Orders
          </h3>
          <p className="text-sm text-muted-foreground mb-phi-4">
            Track your order history, earn loyalty rewards, and get faster checkout next time
          </p>
          <Button variant="primary" size="md" className="min-h-[44px]">
            Create Free Account
          </Button>
        </div>
      </div>
    </main>
  );
}
