'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export interface ConversionChartProps {
  data: {
    clicks: number;
    conversions: number;
  };
}

export function ConversionChart({ data }: ConversionChartProps) {
  const chartData = [
    { name: 'Clicks', value: data.clicks, color: 'hsl(var(--primary))' },
    { name: 'Conversions', value: data.conversions, color: 'hsl(142 76% 36%)' },
  ];

  const conversionRate = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0;

  return (
    <div>
      <div className="mb-phi-4 text-center">
        <p className="text-sm text-muted-foreground mb-phi-2">Conversion Rate</p>
        <p className="text-3xl font-bold">{conversionRate.toFixed(2)}%</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
