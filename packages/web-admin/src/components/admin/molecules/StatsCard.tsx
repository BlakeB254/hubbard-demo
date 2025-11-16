import { ReactNode } from 'react';
import { Card, CardContent, cn } from '@hubbard-inn/shared';

export interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  icon?: ReactNode;
  subtitle?: string;
}

export function StatsCard({
  title,
  value,
  trend,
  change,
  icon,
  subtitle,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-phi-4">
        <div className="flex items-start justify-between mb-phi-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>

        <p className="text-3xl font-bold mb-phi-2">{value}</p>

        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}

        {change !== undefined && trend && (
          <div className="flex items-center gap-phi-1 mt-phi-2">
            <span
              className={cn(
                'text-sm font-medium',
                trend === 'up' && 'text-green-600 dark:text-green-400',
                trend === 'down' && 'text-red-600 dark:text-red-400',
                trend === 'neutral' && 'text-muted-foreground'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'}
              {' '}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
