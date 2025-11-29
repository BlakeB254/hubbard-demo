import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LinkAnalytics, LinkAnalyticsSkeleton } from '@/components/promoter/organisms/LinkAnalytics';
import { getLinkById } from '@/lib/api';

interface LinkPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LinkPageProps): Promise<Metadata> {
  const { id } = await params;
  const link = await getLinkById(id);

  if (!link) {
    return { title: 'Link Not Found' };
  }

  return {
    title: `Link Analytics - ${link.code}`,
  };
}

export default async function LinkPage({ params }: LinkPageProps) {
  const { id } = await params;
  const link = await getLinkById(id);

  if (!link) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-phi-4 py-phi-5 space-y-phi-5">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary-dark">
          Link Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Performance for <span className="font-mono">{link.code}</span>
        </p>
      </div>

      {/* Analytics */}
      <Suspense fallback={<LinkAnalyticsSkeleton />}>
        <LinkAnalytics link={link} />
      </Suspense>
    </div>
  );
}
