import { formatDate, formatCurrency, Badge } from '@hubbard-inn/shared';
import type { PromoterLink } from '@hubbard-inn/shared';
import { CopyButton } from '../atoms/CopyButton';
import { ShareButton } from '../atoms/ShareButton';
import { MousePointerClick, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export interface LinkCardProps {
  link: PromoterLink;
  eventTitle: string;
}

export function LinkCard({ link, eventTitle }: LinkCardProps) {
  const conversionRate = link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-phi-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-phi-4">
        <div className="flex-1">
          <div className="flex items-center gap-phi-2 mb-phi-2">
            <h3 className="text-lg font-semibold">{eventTitle}</h3>
            <Badge variant={link.isActive ? 'active' : 'inactive'}>
              {link.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created {formatDate(link.createdAt)}
          </p>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-phi-4">
        <p className="text-sm text-muted-foreground mb-phi-2">Promo Code</p>
        <div className="flex items-center gap-phi-2">
          <code className="flex-1 bg-muted px-phi-3 py-phi-2 rounded-md font-mono text-sm">
            {link.uniqueCode}
          </code>
          <CopyButton text={link.uniqueCode} label="Copy Code" />
        </div>
      </div>

      {/* URL */}
      <div className="mb-phi-4">
        <p className="text-sm text-muted-foreground mb-phi-2">Affiliate Link</p>
        <div className="flex items-center gap-phi-2">
          <div className="flex-1 bg-muted px-phi-3 py-phi-2 rounded-md truncate text-sm">
            {link.url}
          </div>
          <CopyButton text={link.url} label="Copy Link" />
          <ShareButton
            title={eventTitle}
            text={`Check out ${eventTitle}! Get tickets here:`}
            url={link.url}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-phi-3 mb-phi-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-phi-1">
            <MousePointerClick className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-phi-1">Clicks</p>
          <p className="text-lg font-semibold">{link.clicks}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-phi-1">
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-phi-1">Conversions</p>
          <p className="text-lg font-semibold">{link.conversions}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-phi-1">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-phi-1">Revenue</p>
          <p className="text-lg font-semibold">{formatCurrency(link.revenueGenerated)}</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-phi-1">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-phi-1">Earnings</p>
          <p className="text-lg font-semibold text-primary">
            {formatCurrency(link.commission || 0)}
          </p>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="mb-phi-4 p-phi-3 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground mb-phi-1">Conversion Rate</p>
        <p className="text-xl font-semibold">{conversionRate.toFixed(2)}%</p>
      </div>

      {/* Actions */}
      <Link
        href={`/links/${link.id}`}
        className="block w-full text-center py-phi-3 px-phi-4 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        View Detailed Analytics →
      </Link>
    </div>
  );
}
