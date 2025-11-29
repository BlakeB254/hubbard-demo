# Hubbard Inn Demo - Next.js 16

[![GitHub](https://img.shields.io/github/license/BlakeB254/hubbard-demo)](https://github.com/BlakeB254/hubbard-demo)
[![CI](https://github.com/BlakeB254/hubbard-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/BlakeB254/hubbard-demo/actions/workflows/ci.yml)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

A comprehensive event management and ticketing platform rebuilt with **Next.js 16 best practices**. Features three distinct user portals (Admin, Customer, Promoter) built on a unified backend infrastructure.

## What's New in This Version

- **Next.js 16** with Turbopack (stable) for 2-5x faster builds
- **Server Components** by default with proper `'use client'` boundaries
- **Streaming with Suspense** for instant navigation
- **Static Export** configured for Cloudflare Pages deployment
- **Async params/searchParams** following Next.js 16 patterns
- **next/font optimization** with Google Fonts (Prata + Montserrat)
- **Metadata API** for comprehensive SEO
- **Loading/Error boundaries** at every route level

## Features

### Core Functionality
- **Event Management**: Create and manage events across three venue floors
- **Ticket Sales**: Presale and door sales with QR code validation
- **VIP Bottle Service**: Section reservations with deposit payments
- **Affiliate System**: Promoter tracking with commission management
- **Mobile-First**: Optimized for mobile ticket purchasing
- **Secure Payments**: Stripe integration with Apple Pay/Google Pay support

### Technology Stack
- **Frontend**: Next.js 16 + React 19 + Tailwind CSS 4
- **Backend**: Express.js + Node.js
- **Database**: Neon (Serverless PostgreSQL) + Drizzle ORM
- **Authentication**: Stack Auth with RBAC
- **Payments**: Stripe API with mobile optimization
- **Bundler**: Turbopack (stable in Next.js 16)
- **Architecture**: pnpm monorepo

---

## 📁 Project Structure

```
hubbard-inn-demo/
├── packages/
│   ├── web/                # Unified Web App (Port 3000)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (customer)/     # Customer pages at /
│   │   │   │   ├── admin/          # Admin pages at /admin
│   │   │   │   └── promoter/       # Promoter pages at /promoter
│   │   │   ├── components/
│   │   │   │   ├── customer/       # Customer components
│   │   │   │   ├── admin/          # Admin components
│   │   │   │   └── promoter/       # Promoter components
│   │   │   └── lib/
│   │   └── package.json
│   ├── api/                # Express Backend (Port 4000)
│   │   ├── src/
│   │   │   ├── db/schema/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── services/
│   │   └── server.ts
│   └── shared/             # Shared Types & Utils
│       ├── types/
│       └── utils/
├── drizzle/                # Database migrations
├── DEPLOYMENT.md           # Deployment guide
└── README.md
```

### URL Routes

| Route | Portal | Description |
|-------|--------|-------------|
| `/` | Customer | Home page with events |
| `/events` | Customer | Browse all events |
| `/login` | Customer | Customer login |
| `/admin` | Admin | Admin dashboard |
| `/admin/events` | Admin | Manage events |
| `/admin/check-in` | Admin | QR code scanner |
| `/promoter` | Promoter | Promoter dashboard |
| `/promoter/links` | Promoter | Manage affiliate links |
| `/promoter/earnings` | Promoter | View earnings |

---

## 🚀 Quick Start

### ⚡ Automated Setup (Recommended)

**One-Command Startup:**

```bash
./start.sh
```

This automated script will:
- ✓ Check Node.js and pnpm versions
- ✓ Verify environment files exist
- ✓ Install all dependencies (`pnpm install`)
- ✓ Generate and run database migrations
- ✓ Start all 4 services concurrently

**Services will be available at:**
- 🌐 **Unified Web App**: http://localhost:3000
  - Customer: http://localhost:3000/
  - Admin: http://localhost:3000/admin
  - Promoter: http://localhost:3000/promoter
- 🔌 **API Server**: http://localhost:4000

---

### 📋 Manual Setup (Advanced)

If you prefer step-by-step control or encounter issues with the automated script:

#### Prerequisites

- **Node.js** 20+ installed
- **pnpm** 9+ installed (`npm install -g pnpm`)
- **Neon Database** account (free tier available)
- **Stack Auth** (Neon Auth) project
- **Stripe** account (test mode for development)

#### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url> hubbard-inn-demo
cd hubbard-inn-demo

# Install all dependencies
pnpm install
```

#### 2. Configure Environment Variables

##### Root `.env`

Create `.env` in the root directory:

```bash
# Database
DATABASE_URL="postgres://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Stack Auth (Neon Auth)
NEXT_PUBLIC_STACK_PROJECT_ID="your_project_id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your_publishable_key"
STACK_SECRET_SERVER_KEY="your_secret_key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

##### Individual Package `.env` Files

Each package has an `.env.example` file. Copy and configure:

```bash
cp packages/api/.env.example packages/api/.env
cp packages/web-admin/.env.example packages/web-admin/.env
cp packages/web-customer/.env.example packages/web-customer/.env
cp packages/web-promoter/.env.example packages/web-promoter/.env
```

#### 3. Set Up Neon Database

##### Create Neon Project

1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project: "hubbard-inn-demo"
3. Copy connection string to `DATABASE_URL` in `.env`

##### Run Migrations

```bash
# Generate migration files from schemas
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Optional: Open Drizzle Studio to view database
pnpm db:studio
```

#### 4. Configure Stack Auth (Neon Auth)

##### Enable Neon Auth

1. In Neon Console → Navigate to "Auth" tab
2. Click "Enable Neon Auth"
3. Copy credentials to `.env`:
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`

##### Initialize Stack Auth in Portals

```bash
# Admin Portal
cd packages/web-admin
npx @stackframe/init-stack . --no-browser

# Customer Portal
cd packages/web-customer
npx @stackframe/init-stack . --no-browser

# Promoter Portal
cd packages/web-promoter
npx @stackframe/init-stack . --no-browser
```

#### 5. Start Development Servers

##### Option 1: Run All Services Concurrently

```bash
# From root directory
pnpm dev:all
```

This starts:
- **API**: http://localhost:4000
- **Admin Portal**: http://localhost:3000
- **Customer Portal**: http://localhost:3001
- **Promoter Portal**: http://localhost:3002

##### Option 2: Run Services Individually

```bash
# Terminal 1: API Server
pnpm dev:api

# Terminal 2: Admin Portal
pnpm dev:admin

# Terminal 3: Customer Portal
pnpm dev:customer

# Terminal 4: Promoter Portal
pnpm dev:promoter
```

---

## 🔧 Development

### Hot Reload

All services support hot reload out of the box:
- **Frontend portals**: Next.js Fast Refresh
- **Backend API**: tsx watch mode

Just save your files and changes will reflect immediately!

### Atomic Design Structure

All portals follow atomic design methodology:

```
components/{domain}/
├── atoms/          # Basic building blocks (buttons, inputs)
├── molecules/      # Combinations of atoms (form fields, cards)
└── organisms/      # Complex sections (forms, tables, dashboards)
```

### Golden Ratio Spacing

Tailwind CSS is configured with golden ratio spacing:

```css
/* Available spacing classes */
p-phi-1   /* 8px */
p-phi-2   /* 13px */
p-phi-3   /* 21px */
p-phi-4   /* 34px */
p-phi-5   /* 55px */
p-phi-6   /* 89px */
```

### Shared Types

Use shared types across all packages:

```typescript
import { Event, Ticket, UserProfile } from '@hubbard-inn/shared';
```

---

## 🗄️ Database Schema

### Core Tables

- **user_profiles**: Extended user data (roles, loyalty, promoter info)
- **events**: Event details, capacity, pricing, commission settings
- **tickets**: Ticket sales with QR codes and validation
- **sections**: VIP sections for bottle service
- **section_reservations**: Section bookings with deposits
- **promoter_links**: Affiliate tracking codes
- **analytics**: Click and conversion tracking

See `packages/api/src/db/schema/` for detailed schemas.

---

## 🎨 Design System

### Color System

Uses OKLCH for perceptual uniformity:

```css
--color-primary: oklch(0.55 0.22 264);      /* Violet */
--color-secondary: oklch(0.65 0.15 240);    /* Blue */
--color-accent: oklch(0.75 0.18 180);       /* Teal */
```

### Typography

Golden ratio-based type scale:

- Body: 16px
- Subheading: 26px
- Heading: 42px

---

## 📡 API Endpoints

### Admin Routes (`/api/admin`)

- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Cancel event
- `GET /analytics` - Dashboard metrics
- `POST /promoters` - Create promoter
- `POST /tickets/validate` - Validate QR code

### Customer Routes (`/api/customer`)

- `GET /events` - List events (public)
- `POST /tickets/purchase` - Buy tickets
- `GET /tickets/my-tickets` - User's tickets
- `POST /sections/reserve` - Reserve VIP section

### Promoter Routes (`/api/promoter`)

- `POST /links/generate` - Generate affiliate link
- `GET /links/:id/analytics` - Link performance
- `GET /dashboard/earnings` - Earnings summary

See `packages/api/README.md` for full API documentation.

---

## 🚢 Deployment

### Cloudflare Pages (Frontend - Static Export)

This project uses a **unified Next.js app** configured for static HTML export to deploy on Cloudflare Pages. All three portals (Customer, Admin, Promoter) are served from a single deployment.

#### Build Configuration

The unified app uses these settings in `next.config.ts`:

```typescript
{
  output: 'export',        // Static HTML export
  distDir: 'out',          // Output directory
  trailingSlash: true,     // Required for static hosting
  images: { unoptimized: true }  // No Image Optimization API
}
```

#### Cloudflare Pages Setup - Values to Enter

| Setting | Value |
|---------|-------|
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `pnpm install && pnpm --filter @hubbard-inn/shared build && pnpm --filter @hubbard-inn/web build` |
| **Build output directory** | `packages/web/out` |
| **Root directory** | `/` (repository root) |
| **Node.js version** | `20` (set in Environment Variables) |

**Environment Variables (set in Cloudflare dashboard):**

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `20` |
| `NEXT_PUBLIC_API_URL` | `https://api.hubbardinn.com` |

#### Step-by-Step Cloudflare Deployment

1. **Go to Cloudflare Dashboard** → Pages → Create a project
2. **Connect to Git** → Select your repository
3. **Configure build settings:**
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `pnpm install && pnpm --filter @hubbard-inn/shared build && pnpm --filter @hubbard-inn/web build`
   - Build output directory: `packages/web/out`
   - Root directory: `/`
4. **Add environment variables** (NODE_VERSION, NEXT_PUBLIC_API_URL)
5. **Deploy** → Wait for build to complete
6. **Set custom domain** (optional)

**URL Structure** (single domain):
- Customer Portal: `hubbardinn.com/`
- Admin Portal: `hubbardinn.com/admin`
- Promoter Portal: `hubbardinn.com/promoter`

#### Local Build Test

```bash
# Build the unified app locally
pnpm build

# Output is in packages/web/out/
# Serve locally with:
npx serve packages/web/out
```

### Backend API

Deploy to:
- **Cloudflare Workers** (recommended)
- **Railway.app**
- **Render.com**
- **DigitalOcean App Platform**

See `DEPLOYMENT.md` for detailed deployment instructions.

---

## 🔒 Security Features

- **Role-Based Access Control (RBAC)**: Admin, Customer, Promoter roles
- **JWT Authentication**: Via Stack Auth
- **Secure QR Codes**: Time-based TOTP validation
- **Payment Security**: Stripe SCA compliance
- **CORS Protection**: Configured origins only
- **Helmet.js**: Security headers
- **Input Validation**: Zod schemas

---

## 🧪 Testing

### Run Tests

```bash
# API tests
pnpm --filter api test

# Frontend tests
pnpm --filter web-admin test
```

### Stripe Test Mode

Use test credit cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002

---

## 📊 Monitoring

### Development

- **API Health**: http://localhost:4000/health
- **Database**: `pnpm db:studio`
- **Logs**: Check terminal outputs

### Production

- **Cloudflare Analytics**: Built-in for Pages
- **Stripe Dashboard**: Payment tracking
- **Neon Monitoring**: Database performance

---

## 🤝 Contributing

### Adding Features

1. Create feature branch
2. Follow atomic design structure
3. Add types to `packages/shared`
4. Update API routes as needed
5. Test across all portals
6. Submit pull request

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Formatting**: Prettier (auto-format on save)
- **Naming**: camelCase for variables, PascalCase for components

---

## 📚 Additional Resources

### Documentation

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16)
- [Drizzle ORM](https://orm.drizzle.team)
- [Neon Database](https://neon.tech/docs)
- [Stack Auth](https://docs.stack-auth.com)
- [Stripe API](https://stripe.com/docs/api)
- [Tailwind CSS 4](https://tailwindcss.com/docs)

---

## 🐛 Troubleshooting

### pnpm install fails

```bash
# Clear cache
pnpm store prune

# Reinstall
rm -rf node_modules
pnpm install
```

### Database connection errors

- Check `DATABASE_URL` format
- Verify Neon database is not paused
- Ensure SSL is enabled (`?sslmode=require`)

### Hot reload not working

```bash
# Restart dev server
# Kill all processes
pkill -f "next dev"
pkill -f "tsx watch"

# Restart
pnpm dev:all
```

### Build errors

```bash
# Clear Next.js cache
rm -rf packages/web-*/.next

# Rebuild
pnpm build
```

---

## 🔐 Demo Credentials

Each portal has a login page with "Use Credentials" buttons for easy testing. All demo accounts use the password: `demo123`

### Customer Portal (`/login`)

| Role | Email | Access |
|------|-------|--------|
| Customer | `customer@demo.hubbardinn.com` | Regular user access |
| VIP Guest | `vip@demo.hubbardinn.com` | Premium access |

### Admin Portal (`/admin/login`)

| Role | Email | Access |
|------|-------|--------|
| Admin | `admin@demo.hubbardinn.com` | Full access |
| Manager | `manager@demo.hubbardinn.com` | Events only |
| Check-In Staff | `checkin@demo.hubbardinn.com` | Check-in only |

### Promoter Portal (`/promoter/login`)

| Tier | Email | Earnings |
|------|-------|----------|
| New (Starter) | `newpromoter@demo.hubbardinn.com` | $0 |
| Silver | `promoter@demo.hubbardinn.com` | $2,500 |
| Gold | `toppromoter@demo.hubbardinn.com` | $15,000 |

**Note:** Click the credential buttons on each login page to auto-fill the form fields.

---

## 📝 License

This is a demo project for Hubbard Inn event management.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [Drizzle ORM](https://orm.drizzle.team)
- [Neon](https://neon.tech)
- [Stack Auth](https://stack-auth.com)
- [Stripe](https://stripe.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Questions or Issues?** Create an issue in the repository or contact the development team.
