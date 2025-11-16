# Quick Start Guide

Get the Hubbard Inn Demo up and running in under 10 minutes.

## ⚡ Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] pnpm 9+ installed (`npm install -g pnpm`)
- [ ] Neon account created ([console.neon.tech](https://console.neon.tech/))
- [ ] Stripe test account ([stripe.com](https://stripe.com/))

---

## 🚀 5-Minute Setup

### 1. Install Dependencies (1 minute)

```bash
cd hubbard-inn-demo
pnpm install
```

### 2. Create Neon Database (2 minutes)

1. Go to [Neon Console](https://console.neon.tech/)
2. Click **"New Project"**
3. Name: `hubbard-inn-demo`
4. Copy connection string

### 3. Configure Environment (1 minute)

Create `.env` in root:

```bash
DATABASE_URL="<paste-your-neon-connection-string>"
```

### 4. Enable Neon Auth (1 minute)

1. In Neon Console → **Auth** tab
2. Click **"Enable Neon Auth"**
3. Copy credentials to `.env`:

```bash
NEXT_PUBLIC_STACK_PROJECT_ID="proj_xxx"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="pk_xxx"
STACK_SECRET_SERVER_KEY="sk_xxx"
```

### 5. Run Migrations (30 seconds)

```bash
pnpm db:generate
pnpm db:migrate
```

### 6. Start Everything (30 seconds)

```bash
pnpm dev:all
```

**Done!** 🎉

---

## 🌐 Access Your Portals

- **Admin**: http://localhost:3000
- **Customer**: http://localhost:3001
- **Promoter**: http://localhost:3002
- **API**: http://localhost:4000/health

---

## 🔧 Optional: Add Stripe

For payment testing:

1. Get test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Add to `.env`:

```bash
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
```

---

## 📝 Next Steps

### Initialize Stack Auth in Portals

```bash
# Admin
cd packages/web-admin
npx @stackframe/init-stack . --no-browser

# Customer
cd packages/web-customer
npx @stackframe/init-stack . --no-browser

# Promoter
cd packages/web-promoter
npx @stackframe/init-stack . --no-browser
```

### Add Portal-Specific Features

Each portal README has a section for your custom prompts:

1. **Admin Portal**: `packages/web-admin/README.md`
2. **Customer Portal**: `packages/web-customer/README.md`
3. **Promoter Portal**: `packages/web-promoter/README.md`

Look for the section:
```markdown
## 📝 Portal-Specific Features
<!--
  ✨ ADD YOUR PORTAL-SPECIFIC PROMPTS HERE ✨
-->
```

### View Database

```bash
pnpm db:studio
```

Opens Drizzle Studio at http://localhost:4983

---

## 🐛 Common Issues

### pnpm not found

```bash
npm install -g pnpm
```

### Database connection failed

- Check `DATABASE_URL` format includes `?sslmode=require`
- Verify Neon project is not paused

### Port already in use

```bash
# Kill processes
pkill -f "next dev"
pkill -f "tsx watch"

# Or change ports in package.json
```

---

## 📚 Full Documentation

- [Root README.md](./README.md) - Complete platform overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide
- [STACK_AUTH_SETUP.md](./STACK_AUTH_SETUP.md) - Authentication setup
- [packages/api/README.md](./packages/api/README.md) - API documentation

---

## 🎯 What's Included

### ✅ Backend
- Express.js API with hot reload
- Drizzle ORM with Neon PostgreSQL
- Complete database schemas
- Stripe payment integration
- QR code generation/validation
- RBAC middleware

### ✅ Frontend Portals
- Admin: Event management dashboard
- Customer: Mobile-optimized ticketing
- Promoter: Affiliate analytics

### ✅ Development Tools
- pnpm monorepo setup
- TypeScript strict mode
- Shared types package
- Hot reload on all services
- Atomic design structure
- Golden ratio spacing

### ✅ Deployment Ready
- Cloudflare Pages configuration
- Static export optimized
- Environment variable templates
- Comprehensive documentation

---

Need help? Check the main [README.md](./README.md) or create an issue.
