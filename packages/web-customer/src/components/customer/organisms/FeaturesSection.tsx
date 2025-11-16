import { Sparkles, Shield, Smartphone, Calendar } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Easy Booking',
    description: 'Browse and book tickets for events across all three floors in seconds',
  },
  {
    icon: Smartphone,
    title: 'Digital Tickets',
    description: 'Get QR code tickets instantly sent to your email - no account required',
  },
  {
    icon: Sparkles,
    title: 'VIP Experience',
    description: 'Reserve bottle service sections and get the premium treatment',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Safe and secure checkout powered by Stripe with Apple Pay and Google Pay',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-phi-7 px-phi-4 bg-gradient-to-b from-background-alt to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-phi-6">
          <h2 className="font-['Prata',serif] text-3xl md:text-4xl font-normal text-primary-dark mb-phi-3">
            Why Choose Hubbard Inn
          </h2>
          <p className="font-['Montserrat',sans-serif] text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for an unforgettable night out
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-card border-2 border-border rounded-phi-4 p-phi-5 text-center hover:border-accent hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:from-primary/30 group-hover:to-accent/30 mb-phi-4 transition-all">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-['Montserrat',sans-serif] text-lg font-semibold text-primary-dark mb-phi-2">
                  {feature.title}
                </h3>
                <p className="font-['Montserrat',sans-serif] text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
