#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "→ Pulling latest..."
git pull

echo "→ Installing dependencies..."
npm ci

echo "→ Building..."
npm run build

echo "→ Copying static assets into standalone..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

echo "→ Reloading PM2..."
pm2 reload blackhornets || pm2 start ecosystem.config.js

echo "✓ Deploy done."
