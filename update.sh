#!/bin/bash
# Update deployment script - Use this for future updates

echo "🔄 Updating JilHub..."

cd /www/wwwroot/jilhub || exit

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

# Restart with PM2
echo "♻️ Restarting application..."
pm2 restart jilhub

echo "✅ Update complete!"
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs jilhub"
