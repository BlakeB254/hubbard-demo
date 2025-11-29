import Link from 'next/link';
import { Button } from '@hubbard-inn/shared/components';
import { ArrowRight, Ticket, Wine, Star } from 'lucide-react';

/**
 * Hero Section - Server Component
 * No client-side interactivity needed
 */
export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-phi-4 py-phi-7 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white mb-phi-4 animate-fade-in">
            Experience Chicago&apos;s
            <span className="block text-accent mt-2">Premier Nightlife</span>
          </h1>

          <p className="text-white/90 text-lg md:text-xl mb-phi-6 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Discover unforgettable events, secure VIP bottle service,
            and create memories that last a lifetime at Hubbard Inn.
          </p>

          <div className="flex flex-col sm:flex-row gap-phi-3 justify-center animate-slide-up">
            <Link href="/events">
              <Button size="xl" variant="accent" className="w-full sm:w-auto">
                Browse Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/orders/lookup">
              <Button size="xl" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                Find My Tickets
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="mt-phi-7 flex flex-wrap justify-center gap-phi-3">
            <FeaturePill icon={<Ticket className="w-4 h-4" />} text="Easy Booking" />
            <FeaturePill icon={<Wine className="w-4 h-4" />} text="VIP Bottle Service" />
            <FeaturePill icon={<Star className="w-4 h-4" />} text="Premium Events" />
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="var(--color-background)"
          />
        </svg>
      </div>
    </section>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-phi-3 py-phi-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
      {icon}
      <span>{text}</span>
    </div>
  );
}
