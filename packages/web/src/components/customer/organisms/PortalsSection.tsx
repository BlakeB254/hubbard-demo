import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hubbard-inn/shared/components';
import {
  User,
  Shield,
  TrendingUp,
  ArrowRight,
  Ticket,
  Calendar,
  QrCode,
  BarChart3,
  Link2,
  DollarSign
} from 'lucide-react';

interface PortalCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features: { icon: React.ReactNode; text: string }[];
  loginUrl: string;
  credentials: { label: string; email: string }[];
  gradient: string;
  iconBg: string;
}

function PortalCard({
  title,
  subtitle,
  description,
  icon,
  features,
  loginUrl,
  credentials,
  gradient,
  iconBg,
}: PortalCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-shadow">
      {/* Gradient top bar */}
      <div className={`h-2 ${gradient}`} />

      <CardHeader className="pb-phi-2">
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center mb-phi-3`}>
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl font-heading">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>

      <CardContent className="space-y-phi-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>

        {/* Features */}
        <div className="space-y-phi-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span className="text-primary">{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Demo credentials */}
        <div className="pt-phi-3 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-phi-2">
            Demo Credentials (password: demo123)
          </p>
          <div className="space-y-1">
            {credentials.map((cred, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="font-medium text-foreground">{cred.label}:</span>
                <code className="text-muted-foreground bg-muted px-1 rounded">
                  {cred.email}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link href={loginUrl} className="block">
          <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
            Access {title}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function PortalsSection() {
  const portals: PortalCardProps[] = [
    {
      title: 'Customer Portal',
      subtitle: 'For Event Attendees',
      description: 'Browse upcoming events, purchase tickets, reserve VIP sections, and manage your bookings all in one place.',
      icon: <User className="w-7 h-7 text-blue-600" />,
      iconBg: 'bg-blue-100',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      features: [
        { icon: <Ticket className="w-4 h-4" />, text: 'Purchase tickets online' },
        { icon: <QrCode className="w-4 h-4" />, text: 'Mobile QR code tickets' },
        { icon: <Calendar className="w-4 h-4" />, text: 'View event details' },
      ],
      loginUrl: '/login',
      credentials: [
        { label: 'Customer', email: 'customer@demo.hubbardinn.com' },
        { label: 'VIP', email: 'vip@demo.hubbardinn.com' },
      ],
    },
    {
      title: 'Admin Portal',
      subtitle: 'For Venue Staff',
      description: 'Full control over event management, ticket validation, promoter management, and comprehensive analytics.',
      icon: <Shield className="w-7 h-7 text-violet-600" />,
      iconBg: 'bg-violet-100',
      gradient: 'bg-gradient-to-r from-violet-500 to-violet-600',
      features: [
        { icon: <Calendar className="w-4 h-4" />, text: 'Create & manage events' },
        { icon: <QrCode className="w-4 h-4" />, text: 'QR code check-in scanner' },
        { icon: <BarChart3 className="w-4 h-4" />, text: 'Revenue analytics' },
      ],
      loginUrl: '/admin/login',
      credentials: [
        { label: 'Admin', email: 'admin@demo.hubbardinn.com' },
        { label: 'Manager', email: 'manager@demo.hubbardinn.com' },
      ],
    },
    {
      title: 'Promoter Portal',
      subtitle: 'For Affiliates',
      description: 'Generate unique tracking links, monitor click-through rates, track conversions, and manage your earnings.',
      icon: <TrendingUp className="w-7 h-7 text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      features: [
        { icon: <Link2 className="w-4 h-4" />, text: 'Generate affiliate links' },
        { icon: <BarChart3 className="w-4 h-4" />, text: 'Track conversions' },
        { icon: <DollarSign className="w-4 h-4" />, text: 'View commission earnings' },
      ],
      loginUrl: '/promoter/login',
      credentials: [
        { label: 'Silver', email: 'promoter@demo.hubbardinn.com' },
        { label: 'Gold', email: 'toppromoter@demo.hubbardinn.com' },
      ],
    },
  ];

  return (
    <section id="portals" className="py-phi-8 bg-muted/30">
      <div className="max-w-7xl mx-auto px-phi-4">
        {/* Section Header */}
        <div className="text-center mb-phi-7">
          <h2 className="font-heading text-3xl md:text-4xl text-primary-dark mb-phi-3">
            Three Powerful Portals
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each user type has a dedicated experience optimized for their needs.
            Click any portal below to explore with demo credentials.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-5">
          {portals.map((portal) => (
            <PortalCard key={portal.title} {...portal} />
          ))}
        </div>

        {/* Tech Stack Note */}
        <div className="mt-phi-7 text-center">
          <p className="text-sm text-muted-foreground">
            Built with <span className="font-semibold">Next.js 16</span>,
            <span className="font-semibold"> React 19</span>,
            <span className="font-semibold"> Tailwind CSS 4</span>, and
            <span className="font-semibold"> Turbopack</span>
          </p>
        </div>
      </div>
    </section>
  );
}
