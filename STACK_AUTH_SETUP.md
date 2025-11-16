# Stack Auth (Neon Auth) Setup Guide

Complete guide to setting up authentication for the Hubbard Inn Demo platform.

## 📋 Overview

Stack Auth provides:
- User authentication (email, OAuth)
- Role-based access control
- User management
- Session handling
- Automatic sync with Neon database

---

## 🚀 Quick Setup

### 1. Enable Neon Auth

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project: `hubbard-inn-demo`
3. Navigate to **Auth** tab
4. Click **"Enable Neon Auth"**
5. Copy the credentials displayed

### 2. Set Environment Variables

Add to root `.env` and all portal `.env` files:

```bash
# Stack Auth Credentials
NEXT_PUBLIC_STACK_PROJECT_ID="proj_xxxxxxxxxxxxx"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="pk_xxxxxxxxxxxxx"
STACK_SECRET_SERVER_KEY="sk_xxxxxxxxxxxxx"
```

### 3. Initialize Stack Auth in Each Portal

#### Admin Portal

```bash
cd packages/web-admin
npx @stackframe/init-stack . --no-browser
```

This creates:
- `src/stack.ts` - Server configuration
- `app/handler/[...stack]/page.tsx` - Auth routes
- Updates `app/layout.tsx` with providers

#### Customer Portal

```bash
cd packages/web-customer
npx @stackframe/init-stack . --no-browser
```

#### Promoter Portal

```bash
cd packages/web-promoter
npx @stackframe/init-stack . --no-browser
```

---

## 🔧 Configuration

### Configure OAuth Providers (Optional)

1. Go to [Stack Auth Dashboard](https://app.stack-auth.com/)
2. Select your project
3. Navigate to **Authentication** → **OAuth**
4. Configure providers:
   - **Google**: Add OAuth client ID and secret
   - **Facebook**: Add app ID and secret
   - **Apple**: Configure Sign in with Apple

### Configure Email Settings

1. In Stack Auth Dashboard → **Email**
2. Set up SMTP (or use Stack's default)
3. Customize email templates:
   - Welcome email
   - Password reset
   - Email verification

### Configure Allowed Domains

1. In Stack Auth Dashboard → **Settings**
2. Add allowed domains:
   - `http://localhost:3000` (admin dev)
   - `http://localhost:3001` (customer dev)
   - `http://localhost:3002` (promoter dev)
   - `https://admin.hubbardinn.com` (admin prod)
   - `https://www.hubbardinn.com` (customer prod)
   - `https://promoters.hubbardinn.com` (promoter prod)

---

## 💻 Implementation

### Server Components

Use `stackServerApp` in Server Components and API routes:

```typescript
// src/stack.ts (created by init-stack)
import { StackServerApp } from '@stackframe/stack';

export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    home: '/',
    afterSignIn: '/dashboard',
    afterSignOut: '/',
  },
});
```

```typescript
// Server Component
import { stackServerApp } from '@/stack';

export default async function DashboardPage() {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  return <div>Welcome, {user.displayName}</div>;
}
```

### Client Components

Use `useUser` hook in Client Components:

```typescript
'use client';
import { useUser } from '@stackframe/stack';

export function UserProfile() {
  const user = useUser({ or: 'redirect' });

  return <div>Hello, {user.displayName}</div>;
}
```

### API Routes (Backend)

Update `packages/api/src/middleware/auth.ts`:

```typescript
import { StackServerApp } from '@stackframe/stack';

const stackServerApp = new StackServerApp({
  // Use same credentials as frontend
});

export const authenticateRequest = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = await stackServerApp.getUser({ accessToken: token });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 👥 User Roles

### Role Assignment

After user signs up, assign role in database:

```typescript
import { db } from './db/db';
import { userProfiles } from './db/schema';

async function createUserProfile(userId: string, role: 'admin' | 'customer' | 'promoter') {
  await db.insert(userProfiles).values({
    userId,
    role,
    loyaltyPoints: role === 'customer' ? 0 : undefined,
    promoterStatus: role === 'promoter' ? 'pending' : undefined,
    commissionRate: role === 'promoter' ? 10 : undefined,
  });
}
```

### Role-Based Routing

```typescript
// Middleware example
import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from './stack';

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/handler/sign-in', request.url));
  }

  // Check role for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const profile = await getUserProfile(user.id);
    if (profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
```

---

## 🔒 Security Best Practices

### 1. Never Expose Secret Keys

```bash
# ❌ Bad - Don't use STACK_SECRET_SERVER_KEY in frontend
NEXT_PUBLIC_STACK_SECRET_KEY=sk_xxx

# ✅ Good - Only use in backend
STACK_SECRET_SERVER_KEY=sk_xxx
```

### 2. Validate Tokens Server-Side

Always verify tokens on the backend, never trust client-side validation alone.

### 3. Use HTTPS in Production

Stack Auth requires HTTPS for OAuth providers.

### 4. Implement Rate Limiting

Protect auth endpoints from brute force attacks.

---

## 🧪 Testing Authentication

### Test User Creation

```bash
# Sign up at:
http://localhost:3000/handler/sign-up

# Or use Stack Auth Dashboard to create test users
```

### Test Role Assignment

```typescript
// Create admin user
await createUserProfile('user-id-123', 'admin');

// Create customer
await createUserProfile('user-id-456', 'customer');

// Create promoter
await createUserProfile('user-id-789', 'promoter');
```

### Test Protected Routes

```bash
# Should redirect to sign-in
curl http://localhost:4000/api/admin/events

# Should work with token
curl http://localhost:4000/api/admin/events \
  -H "Authorization: Bearer <token>"
```

---

## 🎯 User Flows

### Admin Sign-In Flow

1. Visit `admin.hubbardinn.com`
2. Click "Sign In"
3. Enter credentials or use OAuth
4. Verify role is `admin`
5. Redirect to admin dashboard

### Customer Purchase Flow

1. Browse events (no auth required)
2. Click "Buy Tickets"
3. Prompted to sign in/sign up
4. Complete purchase
5. View tickets in profile

### Promoter Application Flow

1. Sign up as customer
2. Apply for promoter access
3. Admin reviews and approves
4. Role updated to `promoter`
5. Access promoter dashboard

---

## 🔄 User Sync with Database

Stack Auth automatically syncs users to `neon_auth.users_sync` table.

Reference this table for user relationships:

```typescript
import { userProfiles } from './db/schema';

// Link user profile to Stack Auth user
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // References neon_auth.users_sync.id
  role: roleEnum('role').notNull(),
  // ... other fields
});
```

---

## 📊 Monitoring

### View Users

Stack Auth Dashboard → **Users** tab shows:
- Total users
- Sign-up trends
- OAuth provider usage
- User activity

### Database Sync

Check `neon_auth.users_sync` in Drizzle Studio:

```bash
pnpm db:studio
```

---

## 🚨 Troubleshooting

### "Unauthorized" errors

1. Check token is being sent in `Authorization` header
2. Verify `STACK_SECRET_SERVER_KEY` is set on backend
3. Ensure user exists in database

### OAuth not working

1. Verify OAuth credentials in Stack Auth Dashboard
2. Check allowed domains include your URL
3. Ensure HTTPS is used (required for production)

### Users not syncing to database

1. Check DATABASE_URL is correct
2. Verify Neon Auth is enabled
3. Run migrations: `pnpm db:migrate`

---

## 📚 Additional Resources

- [Stack Auth Documentation](https://docs.stack-auth.com/)
- [Neon Auth Guide](https://neon.tech/docs/guides/neon-auth)
- [Stack Auth Examples](https://github.com/stack-auth/stack/tree/main/examples)

---

For deployment authentication setup, see [DEPLOYMENT.md](./DEPLOYMENT.md)
