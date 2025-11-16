# Promoter Portal

Affiliate dashboard for Hubbard Inn event promoters.

## 🎯 Overview

The Promoter Portal provides:
- Affiliate link generation
- Real-time click tracking
- Conversion analytics
- Commission tracking
- Earnings dashboard
- Performance leaderboards
- Notification system

---

## 🚀 Quick Start

### Development

```bash
# From root directory
pnpm dev:promoter

# Or from this directory
pnpm dev
```

Portal runs at: **http://localhost:3002**

### Build for Production

```bash
pnpm build
```

Static output: `out/` directory

---

## 📁 Component Structure

Following atomic design methodology:

```
src/components/promoter/
├── atoms/              # Basic UI elements
│   ├── StatCard.tsx
│   ├── CopyButton.tsx
│   └── Badge.tsx
├── molecules/          # Combined atoms
│   ├── LinkCard.tsx
│   ├── EarningsCard.tsx
│   └── AnalyticsChart.tsx
└── organisms/          # Complex sections
    ├── Dashboard.tsx
    ├── LinkGenerator.tsx
    └── PerformanceTable.tsx
```

---

## 🎨 Design System

### Data Visualization

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export function ConversionChart({ data }: { data: AnalyticsData[] }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="conversions" stroke="var(--color-primary)" />
    </LineChart>
  );
}
```

---

## 🔗 Affiliate Link Generation

### Create Link

```typescript
import { useAuthenticatedAPI } from '@/lib/api';

export function LinkGenerator({ eventId }: { eventId: string }) {
  const { apiCall } = useAuthenticatedAPI();

  const generateLink = async () => {
    const response = await apiCall('/api/promoter/links/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    });

    const { data } = await response.json();
    return data.url; // https://tickets.hubbardinn.com/events/xxx?ref=PROMO2024
  };
}
```

### Share Link

```tsx
export function ShareLink({ url }: { url: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Check out this event!',
        url: url,
      });
    }
  };

  return (
    <div>
      <button onClick={copyToClipboard}>Copy Link</button>
      <button onClick={shareNative}>Share</button>
    </div>
  );
}
```

---

## 📊 Analytics Dashboard

### Real-time Stats

```typescript
interface PromoterStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalEarnings: number;
  conversionRate: number;
}

export function StatsDashboard() {
  const [stats, setStats] = useState<PromoterStats>();

  useEffect(() => {
    // Fetch stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-phi-4">
      <StatCard label="Clicks" value={stats?.totalClicks} />
      <StatCard label="Conversions" value={stats?.totalConversions} />
      <StatCard label="Revenue" value={formatCurrency(stats?.totalRevenue)} />
      <StatCard label="Earnings" value={formatCurrency(stats?.totalEarnings)} />
    </div>
  );
}
```

---

## 🔐 Authentication

### Promoter-Only Access

```tsx
'use client';
import { useUser } from '@stackframe/stack';

export function PromoterComponent() {
  const user = useUser({ or: 'redirect' });

  // Check promoter role
  if (user.role !== 'promoter') {
    return <AccessDenied />;
  }

  return <Dashboard />;
}
```

---

## 🎯 Key Features to Implement

### Link Management
- [ ] Generate link with custom code
- [ ] Link expiration settings
- [ ] Pause/resume links
- [ ] Link performance preview
- [ ] QR code for link

### Analytics
- [ ] Click-through rate charts
- [ ] Conversion funnel visualization
- [ ] Geographic breakdown
- [ ] Device type analytics
- [ ] Time-based trends

### Earnings
- [ ] Current month earnings
- [ ] Lifetime earnings
- [ ] Pending payouts
- [ ] Commission rate display
- [ ] Earnings projections

### Notifications
- [ ] Real-time conversion alerts
- [ ] Daily summary emails
- [ ] Milestone achievements
- [ ] New event opportunities

### Leaderboards
- [ ] Top promoters ranking
- [ ] Event-specific rankings
- [ ] Achievement badges
- [ ] Competition tracking

---

## 🛠️ Development Guidelines

### Real-time Updates

```typescript
// Use polling for real-time data
const useRealtimeStats = (linkId: string) => {
  const [stats, setStats] = useState();

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`/api/promoter/links/${linkId}/analytics`);
      const data = await response.json();
      setStats(data);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [linkId]);

  return stats;
};
```

### Currency Formatting

```typescript
import { formatCurrency } from '@hubbard-inn/shared';

<span>{formatCurrency(earnings)}</span> // $125.00
```

---

## 🚀 Deployment

### Build

```bash
pnpm build
```

### Deploy to Cloudflare Pages

```bash
wrangler pages deploy out --project-name hubbard-inn-promoter
```

**Production URL**: https://promoters.hubbardinn.com

---

## 📋 Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
NEXT_PUBLIC_API_URL=
```

---

## 🧪 Testing

```bash
pnpm test
```

---

## 📝 Portal-Specific Features

<!--
  ✨ ADD YOUR PORTAL-SPECIFIC PROMPTS HERE ✨

  This section is reserved for custom features and implementation details
  specific to the Promoter Portal. Add your detailed requirements below:

  Example:
  - Custom analytics visualizations
  - Specific commission structures
  - Integration requirements
  - Notification preferences
  - UI/UX specifications
  - Gamification features
  - Payout schedules
-->

---

For general platform documentation, see [Root README](../../README.md)
