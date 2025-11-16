'use client';

import { UserButton } from '@stackframe/stack';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Link as LinkIcon, DollarSign } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/links', label: 'My Links', icon: LinkIcon },
  { href: '/earnings', label: 'Earnings', icon: DollarSign },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-phi-5">
        <div className="flex items-center justify-between h-[55px]">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-phi-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Hubbard Inn</h1>
              <p className="text-xs text-muted-foreground">Promoter Dashboard</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-phi-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-phi-2 px-phi-4 py-phi-2 rounded-md transition-colors
                    ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-phi-3">
            <UserButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-phi-3 flex gap-phi-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-phi-2 px-phi-3 py-phi-2 rounded-md whitespace-nowrap transition-colors
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
