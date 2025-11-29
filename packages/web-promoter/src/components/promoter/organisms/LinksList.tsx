'use client';

import Link from 'next/link';
import type { PromoterLink } from '@hubbard-inn/shared/types';
import { Card, CardContent, Button, Badge, Skeleton, EmptyState } from '@hubbard-inn/shared/components';
import { formatNumber, formatPrice } from '@hubbard-inn/shared/utils';
import { Link2, Copy, ExternalLink, BarChart2 } from 'lucide-react';

interface LinksListProps {
  links: PromoterLink[];
}

export function LinksList({ links }: LinksListProps) {
  if (links.length === 0) {
    return (
      <EmptyState
        icon={<Link2 className="w-12 h-12" />}
        title="No Links Yet"
        description="Create links from the Events page to start promoting"
        action={
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-phi-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}

function LinkCard({ link }: { link: PromoterLink }) {
  const conversionRate = link.clicks > 0
    ? ((link.conversions / link.clicks) * 100).toFixed(1)
    : '0';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link.url);
  };

  return (
    <Card>
      <CardContent className="p-phi-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-phi-4">
          {/* Link Info */}
          <div className="flex-1">
            <div className="flex items-center gap-phi-2 mb-phi-2">
              <span className="font-mono text-lg font-semibold text-primary">
                {link.code}
              </span>
              {!link.isActive && (
                <Badge variant="muted">Inactive</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-md">
              {link.url}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-phi-5 text-center">
            <div>
              <p className="text-2xl font-bold">{formatNumber(link.clicks)}</p>
              <p className="text-xs text-muted-foreground">Clicks</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatNumber(link.conversions)}</p>
              <p className="text-xs text-muted-foreground">Sales</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{conversionRate}%</p>
              <p className="text-xs text-muted-foreground">Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">
                {formatPrice(link.revenue)}
              </p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-phi-2">
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
            </Button>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <Link href={`/links/${link.id}`}>
              <Button variant="default" size="icon">
                <BarChart2 className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LinksListSkeleton() {
  return (
    <div className="space-y-phi-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-phi-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-center gap-phi-4">
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
