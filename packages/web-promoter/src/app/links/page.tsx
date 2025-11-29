import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LinksList, LinksListSkeleton } from '@/components/promoter/organisms/LinksList';
import { getPromoterLinks } from '@/lib/api';

export const metadata: Metadata = {
  title: 'My Links',
};

export default function LinksPage() {
  return (
    <div className="max-w-7xl mx-auto px-phi-4 py-phi-5 space-y-phi-5">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary-dark">My Links</h1>
        <p className="text-muted-foreground mt-1">
          Manage your promotional links
        </p>
      </div>

      {/* Links List */}
      <Suspense fallback={<LinksListSkeleton />}>
        <PromoterLinksList />
      </Suspense>
    </div>
  );
}

async function PromoterLinksList() {
  const links = await getPromoterLinks();
  return <LinksList links={links} />;
}
