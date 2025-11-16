# Test Accounts Documentation

This document contains all test account credentials for the Hubbard Inn Demo platform across all three user contexts.

## Quick Start

### Creating Test Accounts

Test accounts must be created through the Stack Auth authentication system. Follow these steps:

1. **Start the development servers:**
   ```bash
   pnpm dev
   ```

2. **Create accounts via Stack Auth:**
   - Visit each app (web-customer, web-admin, web-promoter)
   - Use the sign-up flow to create accounts with the credentials below
   - Stack Auth will handle user authentication and storage

3. **Assign roles:**
   - User roles (admin, customer, promoter) are managed in the `user_profiles` table
   - Roles can be assigned via the admin dashboard or directly in the database

**Note:** User authentication is managed by Stack Auth, not by local database tables. The `user_profiles` table only stores additional application-specific user data linked to Stack Auth users.

---

## Test Account Credentials

### 1. Admin Account

**Purpose:** Event management, ticket scanning, analytics
**App:** `web-admin` (http://localhost:3001)

```
Email:    admin@hubbardinn.test
Password: Admin123!
Name:     Test Administrator
Role:     admin
```

**Access:**
- ✅ Create/edit/delete events
- ✅ Scan tickets (QR code validation)
- ✅ View analytics dashboard
- ✅ Manage promoters
- ✅ Configure venue settings

**Test Flows:**
1. Login to admin portal
2. View dashboard with stats
3. Create new event (multi-step form)
4. Edit existing event details
5. Scan mock QR code for ticket validation
6. View analytics and reports

---

### 2. Customer Account

**Purpose:** Browse events, purchase tickets, view orders
**App:** `web-customer` (http://localhost:3000)

```
Email:    customer@hubbardinn.test
Password: Customer123!
Name:     Test Customer
Role:     customer
```

**Access:**
- ✅ Browse all published events
- ✅ Filter events by floor, age restriction, status
- ✅ View event details
- ✅ Purchase tickets (guest or authenticated)
- ✅ View order history
- ✅ Display QR codes for entry

**Test Flows:**
1. Browse homepage and event listings
2. Use filters (mobile and desktop)
3. View event details
4. Add tickets to cart
5. Complete checkout (with test Stripe data)
6. View tickets in profile
7. Display QR code for entry

---

### 3. Promoter Account

**Purpose:** Generate affiliate links, track conversions, view earnings
**App:** `web-promoter` (http://localhost:3002)

```
Email:    promoter@hubbardinn.test
Password: Promoter123!
Name:     Test Promoter
Role:     promoter
```

**Access:**
- ✅ View dashboard with earnings summary
- ✅ Generate affiliate links for events
- ✅ Copy/share promo codes
- ✅ View analytics (clicks, conversions, revenue)
- ✅ Track commission earnings
- ✅ View conversion charts

**Test Flows:**
1. Login to promoter dashboard
2. View earnings overview
3. Browse available events
4. Generate new affiliate link
5. Copy promo code
6. Share link via social media
7. View analytics and conversion rates

---

## Demo Mode / Quick Login

All three apps support "Demo Mode" for quick testing without entering credentials.

### Enabling Demo Mode

On each app's login page, look for the "Demo Mode" button:

**web-customer:**
```tsx
// packages/web-customer/src/app/auth/demo-login.tsx
<button onClick={() => loginAsDemo('customer')}>
  Quick Login as Customer
</button>
```

**web-admin:**
```tsx
// packages/web-admin/src/app/auth/demo-login.tsx
<button onClick={() => loginAsDemo('admin')}>
  Quick Login as Admin
</button>
```

**web-promoter:**
```tsx
// packages/web-promoter/src/app/auth/demo-login.tsx
<button onClick={() => loginAsDemo('promoter')}>
  Quick Login as Promoter
</button>
```

---

## Creating Test Events

To create sample events for testing:

1. **Login as Admin** using the admin test account
2. **Navigate to Events** in the admin dashboard
3. **Create events** with diverse properties:
   - Different floors (1, 2, 3)
   - Various age restrictions (none, 18+, 21+)
   - Multiple statuses (draft, published, sold_out)
   - Different price points
   - Mix of affiliate-enabled and disabled events

**Suggested Test Events:**
- Friday night DJ event (Floor 3, 21+, $25)
- Saturday rooftop social (Floor 2, 18+, $15)
- VIP bottle service (Floor 1, 21+, free entry)
- All-ages throwback night (Floor 1, all ages, $10)
- Draft private party (Floor 2, 21+, $30)

---

## Testing Different User Flows

### Guest Checkout Flow (No Account)
1. Go to web-customer app
2. Browse events without logging in
3. Click "Buy Tickets" on any event
4. Complete checkout as guest
5. Enter email for order confirmation
6. Use order lookup to retrieve tickets

### Authenticated Customer Flow
1. Login with customer test account
2. Browse and purchase tickets
3. View order history in profile
4. Display QR codes for entry

### Admin Event Management
1. Login with admin test account
2. Create new event using multi-step form
3. Upload event image (optional)
4. Set pricing and capacity
5. Enable affiliate commission
6. Publish event

### Promoter Affiliate Flow
1. Login with promoter test account
2. View available events
3. Generate affiliate link
4. Copy promo code
5. Share on social media
6. Track clicks and conversions

---

## Stripe Test Cards

For testing payment flows, use these Stripe test cards:

**Successful Payment:**
```
Card Number: 4242 4242 4242 4242
Expiry:      Any future date
CVC:         Any 3 digits
ZIP:         Any 5 digits
```

**Declined Payment:**
```
Card Number: 4000 0000 0000 0002
```

**3D Secure Required:**
```
Card Number: 4000 0025 0000 3155
```

More test cards: https://stripe.com/docs/testing

---

## Environment Variables

Ensure these are set in each app's `.env.local`:

### web-customer
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...
```

### web-admin
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...
```

### web-promoter
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### api
```env
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your-secret-key
```

---

## Troubleshooting

### Test accounts not working?
1. Check if database is running
2. Verify `.env` files are configured
3. Check Stack Auth is properly set up
4. Ensure accounts were created through Stack Auth UI

### Events not showing up?
1. Check event status (only "published" events show for customers)
2. Verify event date is in the future
3. Check filter settings aren't excluding events

### Promoter links not generating?
1. Verify event has `affiliateCommissionEnabled: true`
2. Check promoter status is "active"
3. Ensure event is published

### QR codes not scanning?
1. Verify ticket status is "valid" (not "used")
2. Check QR code format matches expected pattern
3. Ensure camera permissions are granted

---

## Security Notes

⚠️ **IMPORTANT:** These test accounts are for development/demo purposes only.

- ❌ Never use these credentials in production
- ❌ Never commit real passwords to version control
- ✅ Use strong, unique passwords in production
- ✅ Enable 2FA for production admin accounts
- ✅ Rotate all secrets before deploying

---

## API Endpoints for Testing

### Authentication
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me
```

### Customer Endpoints
```
GET    /api/customer/events
GET    /api/customer/events/:id
POST   /api/customer/tickets/purchase
GET    /api/customer/tickets
GET    /api/customer/orders
```

### Admin Endpoints
```
POST   /api/admin/events
PUT    /api/admin/events/:id
DELETE /api/admin/events/:id
POST   /api/admin/tickets/validate
GET    /api/admin/analytics
```

### Promoter Endpoints
```
GET    /api/promoter/events
POST   /api/promoter/links
GET    /api/promoter/links
GET    /api/promoter/analytics
GET    /api/promoter/earnings
```

---

## Additional Resources

- [Stack Auth Documentation](https://docs.stack-auth.com/)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Neon Database Docs](https://neon.tech/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)

---

**Last Updated:** 2025-01-16
**Version:** 1.0.0
