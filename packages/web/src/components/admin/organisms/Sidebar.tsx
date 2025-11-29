'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, QrCode, Users, BarChart3, LogOut } from 'lucide-react';
import { cn } from '@hubbard-inn/shared/utils';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
  { href: '/admin/check-in', icon: QrCode, label: 'Check-In' },
  { href: '/admin/promoters', icon: Users, label: 'Promoters' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary-dark text-white flex flex-col">
      {/* Logo */}
      <div className="p-phi-5 border-b border-white/10">
        <h1 className="font-heading text-xl text-white">Hubbard Inn</h1>
        <p className="text-white/60 text-sm">Admin Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-phi-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-phi-3 py-phi-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-phi-3 border-t border-white/10">
        <button
          className="flex items-center gap-3 w-full px-phi-3 py-phi-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
