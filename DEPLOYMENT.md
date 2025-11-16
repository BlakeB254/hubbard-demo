# Deployment Guide - Hubbard Inn Demo

This guide covers deploying the Hubbard Inn Demo platform to Cloudflare Pages (frontend) and your preferred backend hosting.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Frontend Deployment (Cloudflare Pages)](#frontend-deployment-cloudflare-pages)
- [Backend Deployment](#backend-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

1. **Cloudflare Account** with Pages enabled
2. **Wrangler CLI** installed globally:
   ```bash
   npm install -g wrangler
   ```
3. **Authenticated with Cloudflare**:
   ```bash
   wrangler login
   ```
4. **Neon Database** created and migrated
5. **Stack Auth (Neon Auth)** configured
6. **Stripe Account** with API keys

---

## Frontend Deployment (Cloudflare Pages)

Each portal (Admin, Customer, Promoter) deploys independently to Cloudflare Pages.

### Admin Portal

```bash
# Build the admin portal
cd packages/web-admin
pnpm build

# Deploy to Cloudflare Pages
wrangler pages deploy out --project-name hubbard-inn-admin
```

**Custom Domain**: `admin.hubbardinn.com`

### Customer Portal

```bash
# Build the customer portal
cd packages/web-customer
pnpm build

# Deploy to Cloudflare Pages
wrangler pages deploy out --project-name hubbard-inn-customer
```

**Custom Domains**:
- `www.hubbardinn.com` (primary)
- `tickets.hubbardinn.com` (alternate)

### Promoter Portal

```bash
# Build the promoter portal
cd packages/web-promoter
pnpm build

# Deploy to Cloudflare Pages
wrangler pages deploy out --project-name hubbard-inn-promoter
```

**Custom Domain**: `promoters.hubbardinn.com`

---

## Automated Deployment (GitHub Actions)

### One-Command Deploy All Portals

From the root directory:

```bash
pnpm deploy:admin
pnpm deploy:customer
pnpm deploy:promoter
```

### CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build:admin
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy packages/web-admin/out --project-name hubbard-inn-admin

  deploy-customer:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build:customer
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy packages/web-customer/out --project-name hubbard-inn-customer

  deploy-promoter:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build:promoter
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy packages/web-promoter/out --project-name hubbard-inn-promoter
```

---

## Backend Deployment

The Express.js API can be deployed to several platforms:

### Option 1: Cloudflare Workers (Recommended)

Convert Express to Hono (Cloudflare Workers-compatible):

```bash
cd packages/api
# Follow Cloudflare Workers migration guide
wrangler deploy
```

### Option 2: Railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: Render.com

1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `cd packages/api && pnpm install && pnpm build`
4. Set start command: `cd packages/api && pnpm start`
5. Add environment variables

### Option 4: DigitalOcean App Platform

1. Connect GitHub repository
2. Select `packages/api` as source directory
3. Configure build and run commands
4. Add environment variables

---

## Environment Variables

### Cloudflare Pages Environment Variables

Set via Cloudflare Dashboard → Pages → Project → Settings → Environment Variables

#### Admin Portal (`hubbard-inn-admin`)

```
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
NEXT_PUBLIC_API_URL=https://api.hubbardinn.com
```

#### Customer Portal (`hubbard-inn-customer`)

```
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_API_URL=https://api.hubbardinn.com
```

#### Promoter Portal (`hubbard-inn-promoter`)

```
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
NEXT_PUBLIC_API_URL=https://api.hubbardinn.com
```

### Backend API Environment Variables

```
DATABASE_URL=postgres://...@ep-xxx.region.aws.neon.tech/neondb
STACK_SECRET_SERVER_KEY=your_secret_key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CORS_ORIGIN=https://admin.hubbardinn.com,https://www.hubbardinn.com,https://promoters.hubbardinn.com
PORT=4000
NODE_ENV=production
```

---

## Post-Deployment

### 1. Configure Custom Domains

In Cloudflare Pages Dashboard:
1. Go to each project → Custom domains
2. Add domain (e.g., `admin.hubbardinn.com`)
3. Cloudflare will auto-configure DNS

### 2. Set up Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://api.hubbardinn.com/api/payments/stripe/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Run Database Migrations

```bash
# From root directory
pnpm db:migrate
```

### 4. Enable Neon Auth

1. Go to Neon Console → Auth
2. Enable Neon Auth for your project
3. Copy credentials to environment variables
4. Configure OAuth providers (Google, Facebook, etc.)

### 5. Test Deployments

- **Admin**: https://admin.hubbardinn.com
- **Customer**: https://www.hubbardinn.com
- **Promoter**: https://promoters.hubbardinn.com
- **API Health**: https://api.hubbardinn.com/health

---

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
pnpm clean
pnpm install
pnpm build
```

### Environment Variable Issues

- Ensure all `NEXT_PUBLIC_` variables are set for static export
- Verify Cloudflare Pages environment variables are set
- Check API URL is accessible from frontend

### CORS Errors

- Verify `CORS_ORIGIN` includes all frontend domains
- Ensure HTTPS is used in production

### Database Connection

- Check DATABASE_URL format
- Verify Neon database is not paused
- Test connection with `pnpm db:studio`

---

## Monitoring & Logs

### Cloudflare Pages Logs

View deployment logs:
```bash
wrangler pages deployment list --project-name hubbard-inn-admin
wrangler pages deployment tail
```

### Backend Logs

Depends on hosting platform:
- Railway: `railway logs`
- Render: View in dashboard
- Cloudflare Workers: `wrangler tail`

---

## Rollback

### Cloudflare Pages

```bash
# List deployments
wrangler pages deployment list --project-name hubbard-inn-admin

# Rollback to specific deployment
wrangler pages deployment promote <deployment-id> --project-name hubbard-inn-admin
```

---

## Security Checklist

- [ ] All API keys stored in environment variables (not code)
- [ ] HTTPS enabled for all domains
- [ ] CORS configured with specific origins
- [ ] Rate limiting enabled on API
- [ ] Stripe webhooks use signature verification
- [ ] Database connection uses SSL
- [ ] Stack Auth configured with production OAuth
- [ ] Helmet.js security headers enabled

---

## Performance Optimization

1. **Enable Cloudflare CDN** for static assets
2. **Configure caching** for Next.js pages
3. **Use Cloudflare Images** for event photos
4. **Enable Brotli compression**
5. **Monitor with Cloudflare Analytics**

---

For additional help, see:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Neon Database Deployment](https://neon.tech/docs/guides/vercel)
