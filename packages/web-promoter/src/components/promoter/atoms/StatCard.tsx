import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: React.ReactNode;
  highlighted?: boolean;
}

export function StatCard({ label, value, trend, icon, highlighted }: StatCardProps) {
  return (
    <div
      className={`
        bg-card border rounded-lg p-phi-4
        ${highlighted ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
      `}
    >
      <div className="flex items-start justify-between mb-phi-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>

      <p
        className={`
          text-3xl font-bold mb-phi-1
          ${highlighted ? 'text-primary' : ''}
        `}
      >
        {value}
      </p>

      {trend && (
        <div
          className={`
            flex items-center gap-phi-1 text-sm
            ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}
          `}
        >
          {trend.direction === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  );
}
