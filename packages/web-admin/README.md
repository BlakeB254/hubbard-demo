# Admin Portal

Administration portal for Hubbard Inn event management platform.

## 🎯 Overview

The Admin Portal provides:
- Event creation and management
- Ticket sales monitoring
- QR code validation for entry
- Promoter account management
- VIP section configuration
- Analytics dashboards
- Real-time capacity tracking

---

## 🚀 Quick Start

### Development

```bash
# From root directory
pnpm dev:admin

# Or from this directory
pnpm dev
```

Portal runs at: **http://localhost:3000**

### Build for Production

```bash
pnpm build
```

Static output: `out/` directory

---

## 📁 Component Structure

Following atomic design methodology:

```
src/components/admin/
├── atoms/              # Basic UI elements
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Label.tsx
├── molecules/          # Combined atoms
│   ├── FormField.tsx
│   ├── EventCard.tsx
│   └── StatsCard.tsx
└── organisms/          # Complex sections
    ├── EventForm.tsx
    ├── AnalyticsDashboard.tsx
    └── PromoterTable.tsx
```

---

## 🎨 Design System

### Golden Ratio Spacing

Use predefined spacing classes:

```tsx
<div className="p-phi-4 mb-phi-3">
  {/* 34px padding, 21px margin-bottom */}
</div>
```

Available: `phi-1` (8px) through `phi-7` (144px)

### Typography

```tsx
<h1>Heading 1</h1>  {/* 55px */}
<h2>Heading 2</h2>  {/* 42px */}
<h3>Heading 3</h3>  {/* 32px */}
<p>Body text</p>    {/* 16px */}
```

### Colors

```tsx
<div className="bg-primary text-primary-foreground">Primary</div>
<div className="bg-secondary text-secondary-foreground">Secondary</div>
<div className="bg-accent text-accent-foreground">Accent</div>
```

---

## 🔐 Authentication

### Stack Auth Integration

```tsx
'use client';
import { useUser } from '@stackframe/stack';

export function AdminComponent() {
  const user = useUser({ or: 'redirect' }); // Auto-redirect if not logged in

  return <div>Welcome, {user.displayName}</div>;
}
```

### Role-Based Access

All admin routes require `admin` role.

---

## 📡 API Integration

### Example: Create Event

```typescript
import { useAuthenticatedAPI } from '@/lib/api';

export function CreateEventForm() {
  const { apiCall } = useAuthenticatedAPI();

  const handleSubmit = async (data: EventInput) => {
    const response = await apiCall('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    // Handle result
  };
}
```

---

## 🎯 Key Features to Implement

### Event Management
- [ ] Event creation form with validation
- [ ] Event calendar view
- [ ] Capacity monitoring
- [ ] Floor selection (1, 2, 3)
- [ ] Cover price and commission settings

### Ticket Management
- [ ] Real-time sales dashboard
- [ ] QR code scanner for check-in
- [ ] Refund processing
- [ ] Ticket status tracking

### Promoter Management
- [ ] Promoter approval workflow
- [ ] Commission rate configuration
- [ ] Performance rankings
- [ ] Payout tracking

### Analytics
- [ ] Revenue charts
- [ ] Conversion funnels
- [ ] Top promoters leaderboard
- [ ] Event performance comparisons

### VIP Sections
- [ ] Floor plan editor
- [ ] Section availability matrix
- [ ] Deposit tracking
- [ ] Bottle inventory management

---

## 🛠️ Development Guidelines

### Adding New Features

1. Create components in appropriate atomic level
2. Use shared types from `@hubbard-inn/shared`
3. Follow naming conventions: `PascalCase` for components
4. Add TypeScript types for all props
5. Keep components under 150 lines

### Example Component

```tsx
// src/components/admin/molecules/EventCard.tsx
import { Event } from '@hubbard-inn/shared';
import { Button } from '../atoms/Button';

interface EventCardProps {
  event: Event;
  onEdit: (id: string) => void;
}

export function EventCard({ event, onEdit }: EventCardProps) {
  return (
    <div className="border rounded-lg p-phi-4">
      <h3 className="font-semibold mb-phi-2">{event.title}</h3>
      <p className="text-muted-foreground">{event.description}</p>
      <Button onClick={() => onEdit(event.id)}>Edit Event</Button>
    </div>
  );
}
```

---

## 🚀 Deployment

### Build

```bash
pnpm build
```

### Deploy to Cloudflare Pages

```bash
wrangler pages deploy out --project-name hubbard-inn-admin
```

**Production URL**: https://admin.hubbardinn.com

---

## 📋 Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=
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
  specific to the Admin Portal. Add your detailed requirements below:

  Example:
  - Custom dashboard widgets
  - Specific report formats
  - Integration requirements
  - UI/UX specifications
  - Business logic rules
-->

---

For general platform documentation, see [Root README](../../README.md)
