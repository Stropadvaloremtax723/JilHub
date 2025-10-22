#!/bin/bash
# Quick Deployment Script for aaPanel
# Run this script on your server after uploading the project

echo "🚀 Starting JilHub Deployment..."

# Set project directory
PROJECT_DIR="/www/wwwroot/jilhub"

# Navigate to project directory
cd $PROJECT_DIR || exit

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

# Set proper permissions for uploads
echo "🔐 Setting permissions..."
mkdir -p public/uploads
chmod -R 755 public/uploads
chown -R www:www public/uploads

# Start with PM2
echo "🎯 Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save

echo "✅ Deployment complete!"
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs jilhub"
