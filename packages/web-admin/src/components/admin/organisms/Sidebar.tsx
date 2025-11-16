'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@hubbard-inn/shared';
import { Drawer } from '@hubbard-inn/shared';
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  BarChart3,
  Settings,
  Menu,
} from 'lucide-react';
import { UserButton } from '@stackframe/stack';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Promoters', href: '/promoters', icon: Users },
  { name: 'Check-In', href: '/check-in', icon: QrCode },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="p-phi-5 border-b border-border">
        <h1 className="text-xl font-bold">Hubbard Inn</h1>
        <p className="text-sm text-muted-foreground">Admin Portal</p>
      </div>

      <nav className="flex-1 p-phi-3">
        <ul className="space-y-phi-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-phi-3 px-phi-3 py-phi-2 rounded-md',
                    'transition-colors text-sm font-medium',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-phi-4 border-t border-border">
        <UserButton />
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className={cn(
          'lg:hidden fixed top-phi-4 left-phi-4 z-30',
          'p-phi-2 rounded-md bg-card border border-border shadow-md',
          'hover:bg-muted transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        side="left"
        size="md"
        className="lg:hidden"
      >
        <SidebarContent
          pathname={pathname}
          onNavigate={() => setMobileMenuOpen(false)}
        />
      </Drawer>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card min-h-screen flex-col">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
