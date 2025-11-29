import type { Metadata } from 'next';
import { Sidebar } from '@/components/admin/organisms/Sidebar';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin Portal',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-phi-5">
        {children}
      </main>
    </div>
  );
}
