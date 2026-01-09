#!/bin/bash
# Clever Cloud build hook
# This script runs on Clever Cloud's Linux environment

set -e

echo "🔧 Setting up environment for Clever Cloud..."

# On Clever Cloud, POSTGRESQL_ADDON_URI is automatically injected
# We need to set DATABASE_URL from it for Prisma
if [ -n "$POSTGRESQL_ADDON_URI" ]; then
  export DATABASE_URL="$POSTGRESQL_ADDON_URI"
  echo "✓ DATABASE_URL set from POSTGRESQL_ADDON_URI"
fi

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "🏗️ Building Next.js application..."
npx next build

echo "✅ Build completed successfully!"
