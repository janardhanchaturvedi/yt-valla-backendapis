#!/bin/bash
set -e

APP_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Starting deployment..."
echo "📁 Project directory: $APP_DIR"

cd "$APP_DIR"

# -----------------------------
# Pull FIRST
# -----------------------------
echo "🔄 Pulling latest code"
git pull origin main

# -----------------------------
# Load NVM (if needed for other tools)
# -----------------------------
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "⚠️  NVM not found at $NVM_DIR (Proceeding, assuming bun is in PATH)"
fi

# -----------------------------
# Install Dependencies & Setup
# -----------------------------
echo "📦 Installing dependencies"
bun install

echo "🔄 Generating Prisma Client"
bun run db:generate

echo "🏗️ Running Database Migrations"
bun run db:migrate

# -----------------------------
# Reload PM2
# -----------------------------
echo "♻️ Reloading PM2 (zero-downtime)"
# Using startOrReload to handle both first-time start and updates
pm2 startOrReload app.yml

echo "💾 Saving PM2 process list"
pm2 save

echo "✅ Deployment finished successfully!"
