# Backend API Documentation

Express.js + TypeScript backend for Hubbard Inn event management platform.

## 🎯 Overview

This API provides:
- Event management endpoints
- Ticket purchasing and validation
- VIP section reservations with deposits
- Promoter affiliate tracking
- Stripe payment processing
- QR code generation and validation
- Role-based access control

---

## 🚀 Quick Start

### Development

```bash
# From root directory
pnpm dev:api

# Or from this directory
pnpm dev
```

Server starts at: **http://localhost:4000**

### Production Build

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
src/
├── db/
│   ├── schema/           # Drizzle ORM schemas
│   │   ├── users.ts
│   │   ├── events.ts
│   │   ├── tickets.ts
│   │   ├── sections.ts
│   │   └── promoters.ts
│   └── db.ts             # Database connection
├── routes/
│   ├── admin.ts          # Admin endpoints
│   ├── customer.ts       # Customer endpoints
│   ├── promoter.ts       # Promoter endpoints
│   └── payments.ts       # Stripe integration
├── middleware/
│   ├── auth.ts           # Authentication
│   └── rbac.ts           # Role-based access control
├── services/
│   ├── stripe.ts         # Stripe payment service
│   └── qr-code.ts        # QR generation/validation
├── utils/                # Helper functions
└── server.ts             # Express app entry point
```

---

## 🔐 Authentication

All endpoints (except public event listing) require authentication via Stack Auth.

### Request Headers

```
Authorization: Bearer <stack_auth_token>
```

### Roles

- **admin**: Full system access
- **customer**: Purchase tickets, reserve sections
- **promoter**: Generate affiliate links, view analytics

---

## 📡 API Endpoints

### Health Check

#### `GET /health`

Check API status.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-16T12:00:00.000Z",
  "environment": "development"
}
```

---

## 👨‍💼 Admin Routes

**Base**: `/api/admin`
**Auth**: Required (admin role)

### Create Event

#### `POST /api/admin/events`

**Body**:
```json
{
  "title": "Friday Night Party",
  "description": "Join us for an unforgettable night",
  "eventDate": "2025-02-01T21:00:00Z",
  "startTime": "21:00",
  "endTime": "02:00",
  "venueId": "uuid",
  "floorNumber": "2",
  "totalCapacity": 300,
  "ageRestriction": "21+",
  "coverPrice": 2000,
  "presaleEnabled": true,
  "affiliateCommissionEnabled": true,
  "affiliateCommissionAmount": 500
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Friday Night Party",
    ...
  }
}
```

### Update Event

#### `PUT /api/admin/events/:id`

Update event details.

### Cancel Event

#### `DELETE /api/admin/events/:id`

Cancel an event (soft delete).

### Get Analytics

#### `GET /api/admin/analytics`

Dashboard metrics.

**Response**:
```json
{
  "success": true,
  "data": {
    "totalRevenue": 125000,
    "ticketsSold": 450,
    "upcomingEvents": 5,
    "activePromoters": 12
  }
}
```

### Create Promoter

#### `POST /api/admin/promoters`

Create promoter account.

**Body**:
```json
{
  "userId": "stack_auth_user_id",
  "commissionRate": 10
}
```

### List Promoters

#### `GET /api/admin/promoters`

Get all promoters with status.

### Update Promoter Status

#### `PUT /api/admin/promoters/:id/status`

Approve/suspend promoter.

**Body**:
```json
{
  "status": "active"
}
```

### Validate Ticket QR

#### `POST /api/admin/tickets/validate`

Validate QR code at entry.

**Body**:
```json
{
  "qrData": "{...encrypted ticket data...}"
}
```

**Response**:
```json
{
  "valid": true,
  "message": "Ticket validated successfully",
  "ticketId": "uuid"
}
```

---

## 👥 Customer Routes

**Base**: `/api/customer`

### List Events (Public)

#### `GET /api/customer/events`

**Query Params**:
- `date` (optional): Filter by date
- `floor` (optional): Filter by floor (1, 2, 3)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Friday Night Party",
      "eventDate": "2025-02-01T21:00:00Z",
      "coverPrice": 2000,
      "availableTickets": 250
    }
  ]
}
```

### Get Event Details (Public)

#### `GET /api/customer/events/:id`

Detailed event information.

### Purchase Tickets (Auth Required)

#### `POST /api/customer/tickets/purchase`

**Body**:
```json
{
  "eventId": "uuid",
  "quantity": 2,
  "promoterCode": "PROMO2024" // Optional
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "ticketIds": ["uuid1", "uuid2"],
    "totalCost": 4000,
    "paymentIntentId": "pi_...",
    "clientSecret": "pi_...secret..."
  }
}
```

### Get My Tickets (Auth Required)

#### `GET /api/customer/tickets/my-tickets`

User's ticket list with QR codes.

### Get Ticket QR Code (Auth Required)

#### `GET /api/customer/tickets/:id/qr`

Generate QR code for ticket.

**Response**:
```json
{
  "success": true,
  "data": {
    "ticketId": "uuid",
    "qrCodeDataUrl": "data:image/png;base64,..."
  }
}
```

### Reserve VIP Section (Auth Required)

#### `POST /api/customer/sections/reserve`

**Body**:
```json
{
  "sectionId": "uuid",
  "bottlesSelected": [
    { "name": "Grey Goose", "price": 30000, "quantity": 2 }
  ],
  "guestCount": 8,
  "specialRequests": "Corner table preferred"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "reservationId": "uuid",
    "totalCost": 60000,
    "depositAmount": 50000,
    "balanceDue": 10000,
    "paymentIntentId": "pi_..."
  }
}
```

### Get Available Sections (Public)

#### `GET /api/customer/sections/:eventId`

List available sections for event.

### Get Loyalty Points (Auth Required)

#### `GET /api/customer/profile/loyalty`

User's loyalty program status.

---

## 🎯 Promoter Routes

**Base**: `/api/promoter`
**Auth**: Required (promoter role)

### Get Available Events

#### `GET /api/promoter/events/available`

Events available for promotion.

### Generate Affiliate Link

#### `POST /api/promoter/links/generate`

**Body**:
```json
{
  "eventId": "uuid",
  "customUrl": "my-event-2025" // Optional
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "linkId": "uuid",
    "uniqueCode": "PROMO2024ABC",
    "url": "https://tickets.hubbardinn.com/events/uuid?ref=PROMO2024ABC"
  }
}
```

### Get My Links

#### `GET /api/promoter/links`

All promoter's affiliate links.

### Get Link Analytics

#### `GET /api/promoter/links/:id/analytics`

Track link performance.

**Response**:
```json
{
  "success": true,
  "data": {
    "linkId": "uuid",
    "clicks": 450,
    "conversions": 28,
    "revenue": 56000,
    "commission": 5600,
    "conversionRate": 6.2
  }
}
```

### Get Earnings Dashboard

#### `GET /api/promoter/dashboard/earnings`

**Response**:
```json
{
  "success": true,
  "data": {
    "totalEarnings": 12500,
    "currentMonthEarnings": 3400,
    "pendingEarnings": 800,
    "lifetimeRevenue": 125000
  }
}
```

### Get Statistics

#### `GET /api/promoter/dashboard/stats`

Performance statistics.

### Get Notifications

#### `GET /api/promoter/notifications`

Conversion alerts and updates.

---

## 💳 Payment Routes

**Base**: `/api/payments`

### Create Stripe Checkout (Auth Required)

#### `POST /api/payments/stripe/checkout`

Create Stripe PaymentIntent.

**Body**:
```json
{
  "amount": 4000,
  "eventId": "uuid",
  "ticketCount": 2,
  "promoterCode": "PROMO2024"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_...secret...",
    "paymentIntentId": "pi_..."
  }
}
```

### Stripe Webhook

#### `POST /api/payments/stripe/webhook`

Handle Stripe webhook events.

**Headers**:
```
stripe-signature: t=...
```

### Process Section Deposit (Auth Required)

#### `POST /api/payments/deposits/section`

Process VIP section deposit payment.

### Check Payment Status (Auth Required)

#### `GET /api/payments/status/:paymentId`

Check payment status.

---

## 🗄️ Database Schemas

### User Profiles

```typescript
{
  id: uuid,
  userId: string,        // Stack Auth ID
  role: 'admin' | 'customer' | 'promoter',
  phone?: string,
  loyaltyPoints?: number,
  promoterStatus?: 'pending' | 'active' | 'suspended',
  commissionRate?: number,
  totalEarnings?: number
}
```

### Events

```typescript
{
  id: uuid,
  title: string,
  description?: string,
  eventDate: timestamp,
  floorNumber: '1' | '2' | '3',
  totalCapacity: number,
  coverPrice: number,      // In cents
  status: 'draft' | 'published' | 'sold_out' | 'cancelled'
}
```

### Tickets

```typescript
{
  id: uuid,
  eventId: uuid,
  customerId: string,
  promoterId?: string,
  qrCode: string,
  pricePaid: number,
  affiliateCommissionEarned: number,
  isScanned: boolean
}
```

See `src/db/schema/` for complete schemas.

---

## 🔒 Security

### Authentication Flow

1. Client sends Stack Auth token in `Authorization` header
2. Middleware validates token with Stack Auth
3. User profile fetched from database
4. Role verified for endpoint access

### QR Code Security

- **Time-based**: TOTP with 30-second validity
- **One-time use**: Marked as scanned after validation
- **Replay protection**: 5-minute max QR age

### Payment Security

- **Stripe SCA**: Strong Customer Authentication enabled
- **Webhook verification**: Signature validation
- **Idempotency**: Keys prevent duplicate payments

---

## 🧪 Testing

### Test with curl

```bash
# Health check
curl http://localhost:4000/health

# Get events (public)
curl http://localhost:4000/api/customer/events

# Create event (requires auth)
curl -X POST http://localhost:4000/api/admin/events \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event",...}'
```

### Stripe Test Mode

Use test card: `4242 4242 4242 4242`

---

## 📊 Monitoring

### Logs

All requests logged to console in development.

### Error Handling

```json
{
  "error": "Error type",
  "message": "Human-readable message"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
- `501`: Not Implemented (endpoints in progress)

---

## 🚀 Deployment

### Environment Variables

```bash
DATABASE_URL=
STACK_SECRET_SERVER_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CORS_ORIGIN=
PORT=4000
NODE_ENV=production
```

### Build

```bash
pnpm build
```

### Start

```bash
pnpm start
```

---

## 🛠️ Development Notes

### Adding New Routes

1. Create route file in `src/routes/`
2. Import in `server.ts`
3. Add authentication middleware
4. Update this documentation

### Database Migrations

```bash
# Make schema changes
# Generate migration
pnpm db:generate

# Apply to database
pnpm db:migrate
```

### Testing Stripe Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks
stripe listen --forward-to localhost:4000/api/payments/stripe/webhook
```

---

For deployment guide, see [`/DEPLOYMENT.md`](../../DEPLOYMENT.md)
