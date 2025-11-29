'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Link2, DollarSign, Menu, X } from 'lucide-react';
import { cn } from '@hubbard-inn/shared/utils';
import { Button } from '@hubbard-inn/shared/components';
import { useState } from 'react';

const navItems = [
  { href: '/promoter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/promoter/events', icon: Calendar, label: 'Events' },
  { href: '/promoter/links', icon: Link2, label: 'My Links' },
  { href: '/promoter/earnings', icon: DollarSign, label: 'Earnings' },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-primary-dark text-white z-50">
      <div className="max-w-7xl mx-auto px-phi-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/promoter/dashboard" className="font-heading text-xl">
          Hubbard Inn <span className="text-accent">Promoter</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-phi-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/promoter/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-phi-3 py-phi-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-primary-dark border-t border-white/10">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/promoter/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-phi-4 py-phi-3 border-b border-white/5',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
