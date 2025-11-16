# Guest Checkout Implementation Guide

The Hubbard Inn Demo supports **full guest checkout** - no account required for any customer action.

## 🎯 Guest Capabilities

Guests can:
- ✅ Browse all events
- ✅ Join presale waiting lists
- ✅ Purchase tickets
- ✅ Reserve VIP sections
- ✅ Receive QR codes via email
- ✅ Access tickets via order lookup

---

## 🔧 Implementation

### Database Schema Updates

#### Guest Orders Table

Add to `packages/api/src/db/schema/tickets.ts`:

```typescript
export const guestOrders = pgTable('guest_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').notNull().unique(), // e.g., "HI-2025-001234"
  guestEmail: text('guest_email').notNull(),
  guestName: text('guest_name'),
  guestPhone: text('guest_phone'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

#### Update Tickets Schema

Modify `customerId` to be nullable:

```typescript
export const tickets = pgTable('tickets', {
  // ... other fields
  customerId: text('customer_id'), // Nullable for guest purchases
  guestOrderId: uuid('guest_order_id').references(() => guestOrders.id),
  guestEmail: text('guest_email'), // For guest tickets
  // ... other fields
});
```

---

## 📡 API Endpoints

### Purchase Tickets (Guest or Authenticated)

#### `POST /api/customer/tickets/purchase`

**No authentication required**

**Body (Guest)**:
```json
{
  "eventId": "uuid",
  "quantity": 2,
  "promoterCode": "PROMO2024",
  "guestInfo": {
    "email": "guest@example.com",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

**Body (Authenticated User)**:
```json
{
  "eventId": "uuid",
  "quantity": 2,
  "promoterCode": "PROMO2024"
  // guestInfo omitted - use authenticated user's email
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "orderNumber": "HI-2025-001234",
    "ticketIds": ["uuid1", "uuid2"],
    "totalCost": 4000,
    "paymentIntentId": "pi_...",
    "clientSecret": "pi_...secret...",
    "guestAccessUrl": "https://tickets.hubbardinn.com/orders/HI-2025-001234?email=guest@example.com"
  }
}
```

### Guest Order Lookup

#### `GET /api/customer/orders/lookup`

**No authentication required**

**Query Params**:
- `email`: Guest email address
- `orderNumber`: Order number from confirmation

**Response**:
```json
{
  "success": true,
  "data": {
    "orderNumber": "HI-2025-001234",
    "tickets": [
      {
        "id": "uuid1",
        "eventTitle": "Friday Night Party",
        "eventDate": "2025-02-01T21:00:00Z",
        "qrCode": "data:image/png;base64,...",
        "status": "valid"
      }
    ]
  }
}
```

---

## 💳 Stripe Guest Checkout

### Payment Intent with Guest Email

```typescript
// packages/api/src/services/stripe.ts
export const createGuestTicketPayment = async (
  amount: number,
  guestEmail: string,
  metadata: any
) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    payment_method_types: ['card'],
    receipt_email: guestEmail, // Send receipt to guest
    metadata: {
      ...metadata,
      isGuest: 'true',
      guestEmail,
    },
  });
};
```

### Frontend Stripe Integration

```typescript
// packages/web-customer/src/components/customer/organisms/CheckoutForm.tsx
import { PaymentElement, ExpressCheckoutElement } from '@stripe/react-stripe-js';

export function GuestCheckoutForm({ onSuccess }: { onSuccess: (orderNumber: string) => void }) {
  const [guestEmail, setGuestEmail] = useState('');

  return (
    <form onSubmit={handleSubmit}>
      {/* Guest Email (Required) */}
      <input
        type="email"
        placeholder="Email for order confirmation"
        value={guestEmail}
        onChange={(e) => setGuestEmail(e.target.value)}
        required
      />

      {/* Optional: Guest Name & Phone */}
      <input type="text" placeholder="Name (optional)" />
      <input type="tel" placeholder="Phone (optional)" />

      {/* Apple Pay / Google Pay */}
      <ExpressCheckoutElement />

      {/* Card Payment */}
      <PaymentElement />

      <button type="submit">Complete Purchase</button>
    </form>
  );
}
```

---

## 📧 Email Confirmations

### Guest Order Confirmation

Send immediately after successful payment:

**Subject**: Your Hubbard Inn Tickets - Order #HI-2025-001234

**Body**:
```
Hi [Guest Name],

Thanks for your purchase! Your tickets are ready.

Order Details:
- Order Number: HI-2025-001234
- Event: Friday Night Party
- Date: February 1, 2025 at 9:00 PM
- Tickets: 2

View Your Tickets:
https://tickets.hubbardinn.com/orders/HI-2025-001234?email=guest@example.com

Save this email! You'll need it to access your tickets.

[View Tickets Button]

Questions? Reply to this email.
```

### Pre-Event Reminder

Send 24 hours before event:

```
Your event is tomorrow!

Don't forget your tickets:
https://tickets.hubbardinn.com/orders/HI-2025-001234?email=guest@example.com
```

---

## 🎫 Ticket Access for Guests

### Access URL Pattern

```
https://tickets.hubbardinn.com/orders/{ORDER_NUMBER}?email={EMAIL}
```

Example:
```
https://tickets.hubbardinn.com/orders/HI-2025-001234?email=guest@example.com
```

### Order Lookup Page

```typescript
// packages/web-customer/src/app/orders/[orderNumber]/page.tsx
export default async function GuestOrderPage({
  params,
  searchParams,
}: {
  params: { orderNumber: string };
  searchParams: { email: string };
}) {
  const order = await lookupGuestOrder(params.orderNumber, searchParams.email);

  if (!order) {
    return <OrderNotFound />;
  }

  return (
    <div>
      <h1>Your Tickets</h1>
      {order.tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
```

---

## 🔒 Security Considerations

### Email Verification

1. **Rate Limiting**: Limit order lookup attempts per IP
2. **Email Validation**: Verify email format before lookup
3. **Case Insensitive**: Normalize emails to lowercase

```typescript
const normalizedEmail = email.toLowerCase().trim();
```

### Order Number Generation

Use secure random generation:

```typescript
import crypto from 'crypto';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `HI-${timestamp}-${random}`;
}
```

### Access Control

- Only show tickets for matching email + order number combination
- Expire lookup links after event completion (optional)
- Log access attempts for fraud detection

---

## 📱 Mobile Optimization

### Add to Wallet

Allow guests to add tickets to Apple Wallet / Google Pay without account:

```typescript
export function AddToWalletButton({ ticketId, guestEmail }: { ticketId: string; guestEmail: string }) {
  const handleAddToWallet = async () => {
    const passUrl = await generateWalletPass(ticketId, guestEmail);
    window.location.href = passUrl;
  };

  return <button onClick={handleAddToWallet}>Add to Apple Wallet</button>;
}
```

---

## 🎯 Guest Presale Lists

### Join Presale (No Auth Required)

```typescript
// packages/api/src/db/schema/presale.ts
export const presaleList = pgTable('presale_list', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id),
  email: text('email').notNull(),
  name: text('name'),
  notified: boolean('notified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

**API Endpoint**:
```typescript
router.post('/events/:id/presale', async (req, res) => {
  const { email, name } = req.body;

  await db.insert(presaleList).values({
    eventId: req.params.id,
    email,
    name,
  });

  res.json({ success: true, message: 'Added to presale list' });
});
```

---

## 🔄 Account Creation from Guest Order

Allow guests to convert to account later:

### "Create Account" Prompt

After guest checkout:

```tsx
<div className="mt-4 p-4 bg-accent/10 rounded-lg">
  <h3>Want to save your order history?</h3>
  <p>Create an account to track all your tickets and earn loyalty points.</p>
  <button onClick={() => createAccountFromOrder(orderNumber, email)}>
    Create Account
  </button>
</div>
```

### Link Guest Orders to New Account

```typescript
async function linkGuestOrdersToAccount(email: string, userId: string) {
  // Find all guest orders with this email
  const guestOrders = await db
    .select()
    .from(tickets)
    .where(and(
      eq(tickets.guestEmail, email),
      isNull(tickets.customerId)
    ));

  // Link to new user account
  await db
    .update(tickets)
    .set({ customerId: userId, guestEmail: null })
    .where(eq(tickets.guestEmail, email));
}
```

---

## 📊 Analytics

Track guest vs. authenticated purchases:

```typescript
const metrics = {
  guestPurchases: count(where(tickets, isNull(tickets.customerId))),
  authenticatedPurchases: count(where(tickets, isNotNull(tickets.customerId))),
  guestConversionRate: (guestSignups / guestOrders) * 100,
};
```

---

## ✅ Implementation Checklist

- [ ] Add `guest_orders` table to schema
- [ ] Make `customerId` nullable in `tickets` table
- [ ] Update purchase endpoint to support guest checkout
- [ ] Implement order number generation
- [ ] Create guest order lookup endpoint
- [ ] Add guest order lookup page
- [ ] Configure Stripe receipt emails for guests
- [ ] Implement email confirmation system
- [ ] Add rate limiting to lookup endpoint
- [ ] Create "Add to Wallet" for guests
- [ ] Implement presale list (no auth required)
- [ ] Add account creation from guest order
- [ ] Test guest checkout flow end-to-end

---

For general authentication setup, see [STACK_AUTH_SETUP.md](./STACK_AUTH_SETUP.md)
