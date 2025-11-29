'use client';

import { useState } from 'react';
import { Button, Input } from '@hubbard-inn/shared/components';

/**
 * Newsletter Section - Client Component
 * Requires client-side interactivity for form handling
 */
export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus('success');
    setEmail('');
  };

  return (
    <section className="max-w-4xl mx-auto px-phi-4 py-phi-7">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary rounded-phi-5 p-phi-6 md:p-phi-7 text-center border-2 border-accent/30 shadow-2xl">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative">
          <h2 className="font-heading text-2xl md:text-3xl font-normal text-white mb-phi-3">
            Stay in the Loop
          </h2>
          <p className="text-white/90 mb-phi-5 max-w-2xl mx-auto leading-relaxed">
            Be the first to know about new events, special offers, and exclusive VIP experiences
          </p>

          {status === 'success' ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-phi-3 p-phi-4 max-w-md mx-auto">
              <p className="text-white font-medium">Thanks for subscribing!</p>
              <p className="text-white/80 text-sm mt-1">
                You&apos;ll receive updates about upcoming events.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-phi-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:ring-accent"
              />
              <Button
                type="submit"
                variant="accent"
                size="md"
                loading={status === 'loading'}
                className="whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
