import { Ticket, Wine, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Ticket,
    title: 'Easy Ticketing',
    description: 'Purchase tickets instantly with our seamless checkout process. Mobile tickets delivered straight to your phone.',
  },
  {
    icon: Wine,
    title: 'VIP Bottle Service',
    description: 'Reserve premium sections with exclusive bottle service packages for an unforgettable experience.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'All transactions are protected with industry-leading security. Your information is always safe.',
  },
  {
    icon: Zap,
    title: 'Instant Confirmation',
    description: 'Receive your tickets immediately via email and SMS. No waiting, no hassle.',
  },
];

/**
 * Features Section - Server Component
 */
export function FeaturesSection() {
  return (
    <section className="bg-background-alt py-phi-7">
      <div className="max-w-7xl mx-auto px-phi-4">
        <div className="text-center mb-phi-6">
          <h2 className="font-heading text-3xl md:text-4xl font-normal text-primary-dark mb-phi-2">
            Why Choose Hubbard Inn
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We make your night out effortless with premium service and seamless booking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-lg p-phi-5 text-center border border-border transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-phi-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl text-primary-dark mb-phi-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
