import Link from 'next/link';
import { Button } from '@hubbard-inn/shared';
import { Calendar, Ticket } from 'lucide-react';

export interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function Hero({
  title = 'Experience Hubbard Inn',
  subtitle = 'Premium events and VIP experiences across three floors of entertainment',
  ctaText = 'View Events',
  ctaHref = '/events',
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary text-primary-foreground py-phi-7 px-phi-4">
      {/* Decorative accent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-phi-5">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-phi-4 border border-white/20">
              <Ticket className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Title - Using Prata font */}
        <h1 className="font-['Prata',serif] text-4xl md:text-5xl lg:text-6xl font-normal mb-phi-4 tracking-wide text-white drop-shadow-md">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="font-['Montserrat',sans-serif] text-base md:text-lg text-white/90 mb-phi-6 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-phi-3 justify-center items-center mb-phi-6">
          <Link href={ctaHref}>
            <Button
              variant="primary"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 min-h-[44px] font-semibold shadow-lg hover:shadow-xl transition-all uppercase tracking-wide"
            >
              <Calendar className="w-5 h-5 mr-phi-2" />
              {ctaText}
            </Button>
          </Link>
          <Link href="/orders/lookup">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/60 min-h-[44px] font-semibold transition-all uppercase tracking-wide"
            >
              <Ticket className="w-5 h-5 mr-phi-2" />
              Find My Tickets
            </Button>
          </Link>
        </div>

        {/* Stats - Enhanced with better styling */}
        <div className="grid grid-cols-3 gap-phi-4 max-w-2xl mx-auto">
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg py-phi-3 border border-white/10">
            <div className="font-['Prata',serif] text-3xl md:text-4xl font-normal text-white">3</div>
            <div className="font-['Montserrat',sans-serif] text-xs md:text-sm text-white/80 mt-phi-1 uppercase tracking-wider">Floors</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg py-phi-3 border border-white/10">
            <div className="font-['Prata',serif] text-3xl md:text-4xl font-normal text-white">500+</div>
            <div className="font-['Montserrat',sans-serif] text-xs md:text-sm text-white/80 mt-phi-1 uppercase tracking-wider">Capacity</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg py-phi-3 border border-white/10">
            <div className="font-['Prata',serif] text-3xl md:text-4xl font-normal text-white">VIP</div>
            <div className="font-['Montserrat',sans-serif] text-xs md:text-sm text-white/80 mt-phi-1 uppercase tracking-wider">Sections</div>
          </div>
        </div>
      </div>
    </section>
  );
}
