import { Navigation } from '@/components/promoter/organisms/Navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-[calc(100vh-55px)] bg-background">
        <div className="max-w-7xl mx-auto px-phi-5 py-phi-6">
          {children}
        </div>
      </main>
    </>
  );
}
