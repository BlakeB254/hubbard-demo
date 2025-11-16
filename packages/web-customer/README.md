# Customer Portal

Public-facing ticketing and event discovery portal for Hubbard Inn.

## 🎯 Overview

The Customer Portal provides:
- Event browsing and discovery
- Mobile-optimized ticket purchasing
- Apple Pay / Google Pay integration
- Digital ticket QR codes
- VIP section reservations
- Loyalty program tracking
- Order history

---

## 🚀 Quick Start

### Development

```bash
# From root directory
pnpm dev:customer

# Or from this directory
pnpm dev
```

Portal runs at: **http://localhost:3001**

### Build for Production

```bash
pnpm build
```

Static output: `out/` directory

---

## 📁 Component Structure

Following atomic design methodology:

```
src/components/customer/
├── atoms/              # Basic UI elements
│   ├── TicketButton.tsx
│   ├── PriceTag.tsx
│   └── QRCode.tsx
├── molecules/          # Combined atoms
│   ├── EventCard.tsx
│   ├── TicketCard.tsx
│   └── PaymentForm.tsx
└── organisms/          # Complex sections
    ├── EventGrid.tsx
    ├── CheckoutFlow.tsx
    └── SectionSelector.tsx
```

---

## 🎨 Design System

### Mobile-First Design

All components optimized for mobile:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

### Touch-Optimized

Minimum 44x44px touch targets:

```tsx
<button className="min-h-[44px] min-w-[44px] p-phi-3">
  Tap Me
</button>
```

---

## 💳 Stripe Integration

### Payment Element Setup

```typescript
'use client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, ExpressCheckoutElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {/* Apple Pay / Google Pay */}
      <ExpressCheckoutElement />

      {/* Standard card payment */}
      <PaymentElement />
    </Elements>
  );
}
```

### Mobile Payments

Apple Pay and Google Pay automatically enabled on supported devices.

---

## 📱 QR Code Display

### Generate and Display Tickets

```typescript
import { QRCodeSVG } from 'qrcode.react';

export function TicketQR({ ticketData }: { ticketData: string }) {
  return (
    <div className="bg-white p-phi-4 rounded-lg">
      <QRCodeSVG
        value={ticketData}
        size={300}
        level="H"
        includeMargin={true}
      />
    </div>
  );
}
```

### Offline Access

Tickets stored in browser for offline viewing:

```typescript
// Save to localStorage
localStorage.setItem(`ticket-${ticketId}`, JSON.stringify(ticketData));
```

---

## 🔐 Authentication

### **IMPORTANT: Guest Checkout Enabled**

Authentication is **completely optional** for all customer actions:
- ✅ View events (guest)
- ✅ Join presale lists (guest)
- ✅ Purchase tickets (guest)
- ✅ Reserve VIP sections (guest)

Users can optionally sign in to:
- Save order history
- Track loyalty points
- Manage saved payment methods
- View past tickets

### Guest Purchase Flow

```tsx
'use client';
import { useUser } from '@stackframe/stack';

export function PurchaseButton({ eventId }: { eventId: string }) {
  const user = useUser(); // Don't auto-redirect - allow guests

  return (
    <div>
      <BuyTicketsButton eventId={eventId} asGuest={!user} />

      {!user && (
        <p className="text-sm text-muted-foreground mt-2">
          Optional: <button onClick={signIn}>Sign in</button> to save order history
        </p>
      )}
    </div>
  );
}
```

### Guest Order Tracking

Guests receive order confirmation via email with:
- Order number
- Ticket QR codes
- Access link to view tickets (no account required)

```typescript
// Guest order lookup by email + order number
const guestOrder = await getOrderByEmail(email, orderNumber);
```

---

## 🎯 Key Features to Implement

### Event Discovery
- [ ] Event grid with filters (date, floor, genre)
- [ ] Search functionality
- [ ] Event detail pages
- [ ] Countdown timers
- [ ] Capacity indicators

### Ticket Purchasing
- [ ] Quantity selector
- [ ] Promoter code input
- [ ] Payment flow (Stripe)
- [ ] Order confirmation
- [ ] Receipt email

### Digital Tickets
- [ ] QR code generation
- [ ] Ticket wallet view
- [ ] Pass to Apple Wallet
- [ ] Share ticket feature

### VIP Section Booking
- [ ] Interactive floor plan
- [ ] Bottle menu selection
- [ ] Deposit payment
- [ ] Reservation confirmation
- [ ] Special requests form

### User Profile
- [ ] Order history
- [ ] Loyalty points display
- [ ] Saved payment methods
- [ ] Preferences

---

## 🛠️ Development Guidelines

### Mobile Optimization

```tsx
// Good - Mobile-first
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Bad - Desktop-first
<div className="text-lg md:text-base sm:text-sm">
  Don't do this
</div>
```

### Performance

```tsx
// Lazy load images
import Image from 'next/image';

<Image
  src="/event-hero.jpg"
  alt="Event"
  width={1200}
  height={600}
  loading="lazy"
/>
```

### PWA Features

Install prompt for mobile users:

```typescript
// Add to home screen prompt
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
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
wrangler pages deploy out --project-name hubbard-inn-customer
```

**Production URLs**:
- https://www.hubbardinn.com
- https://tickets.hubbardinn.com

---

## 📋 Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_API_URL=
```

---

## 🧪 Testing

### Test Stripe Payments

Use test card: `4242 4242 4242 4242`

```bash
pnpm test
```

---

## 📝 Portal-Specific Features

<!--
  ✨ ADD YOUR PORTAL-SPECIFIC PROMPTS HERE ✨

  This section is reserved for custom features and implementation details
  specific to the Customer Portal. Add your detailed requirements below:

  Example:
  - Custom event filtering logic
  - Specific payment flows
  - Integration requirements
  - Mobile-specific features
  - UI/UX specifications
  - User journey flows
-->

---

For general platform documentation, see [Root README](../../README.md)
