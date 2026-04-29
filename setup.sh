#!/bin/bash
# ─── Sauzule Diet App — First-Time Setup ─────────────────────────────────────
set -e

echo ""
echo "  ███████╗ █████╗ ██╗   ██╗███████╗██╗   ██╗██╗     ███████╗"
echo "  ██╔════╝██╔══██╗██║   ██║╚════██║██║   ██║██║     ██╔════╝"
echo "  ███████╗███████║██║   ██║    ██╔╝██║   ██║██║     █████╗  "
echo "  ╚════██║██╔══██║██║   ██║   ██╔╝ ██║   ██║██║     ██╔══╝  "
echo "  ███████║██║  ██║╚██████╔╝   ██║  ╚██████╔╝███████╗███████╗"
echo "  ╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═════╝ ╚══════╝╚══════╝"
echo ""
echo "  Premium Nutrition Coaching Platform — Setup Script"
echo "  Deploying to: Netlify"
echo ""

# 1. Install dependencies
echo "→ Installing dependencies..."
npm install

# 2. Check for .env
if [ ! -f .env ]; then
  cp .env.example .env
  echo "→ Created .env from .env.example"
  echo ""
  echo "  ⚠️  STOP — Edit .env before continuing:"
  echo "     DATABASE_URL        → from neon.tech (free)"
  echo "     NEXTAUTH_SECRET     → run: openssl rand -base64 32"
  echo "     NEXTAUTH_URL        → your Netlify URL (e.g. https://app.sauzule.com)"
  echo "     STRIPE_SECRET_KEY   → from Stripe Dashboard"
  echo "     STRIPE_WEBHOOK_SECRET → from Stripe → Webhooks"
  echo "     ANTHROPIC_API_KEY   → from console.anthropic.com"
  echo "     CRON_SECRET         → any random string"
  echo ""
  read -p "  Press Enter after editing .env to continue..."
fi

# 3. Generate Prisma client
echo "→ Generating Prisma client..."
npx prisma generate

# 4. Push database schema to Neon (or your PostgreSQL)
echo "→ Pushing database schema..."
npx prisma db push

# 5. Seed initial coach account + supplement stacks
echo "→ Seeding initial data..."
npx tsx prisma/seed.ts

echo ""
echo "✓ Local setup complete!"
echo ""
echo "  Run locally:  npm run dev  →  http://localhost:3000"
echo ""
echo "  Default login:"
echo "  Email:    patrick@sauzule.com"
echo "  Password: Sauzule2024!"
echo ""
echo "  Next step — Deploy to Netlify:"
echo "  1. Push this folder to a GitHub repo"
echo "  2. Go to netlify.com → Add new site → Import from GitHub"
echo "  3. Build command: npm run build"
echo "  4. Publish directory: .next"
echo "  5. Add all .env variables in Netlify → Site Settings → Environment Variables"
echo "  6. Add Stripe webhook pointing to: https://YOUR-SITE.netlify.app/api/stripe/webhook"
echo ""
