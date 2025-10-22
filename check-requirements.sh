#!/bin/bash
# Server Requirements Check for JilHub
# Run this on your aaPanel server before deployment

echo "🔍 Checking server requirements for JilHub..."
echo "=============================================="
echo ""

# Check Node.js
echo "📦 Node.js:"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✅ Installed: $NODE_VERSION"
    if [[ "${NODE_VERSION:1:2}" -ge 18 ]]; then
        echo "   ✅ Version OK (>= 18 required)"
    else
        echo "   ⚠️  Version too old (>= 18 required)"
    fi
else
    echo "   ❌ Not installed"
    echo "   💡 Install via aaPanel → App Store → PM2 Manager"
fi
echo ""

# Check npm
echo "📦 npm:"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "   ✅ Installed: $NPM_VERSION"
else
    echo "   ❌ Not installed"
fi
echo ""

# Check PM2
echo "📦 PM2:"
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 -v)
    echo "   ✅ Installed: $PM2_VERSION"
else
    echo "   ❌ Not installed"
    echo "   💡 Install via aaPanel → App Store → PM2 Manager"
fi
echo ""

# Check Nginx
echo "🌐 Nginx:"
if command -v nginx &> /dev/null; then
    NGINX_VERSION=$(nginx -v 2>&1 | cut -d'/' -f2)
    echo "   ✅ Installed: $NGINX_VERSION"
else
    echo "   ❌ Not installed"
    echo "   💡 Install via aaPanel → App Store → Nginx"
fi
echo ""

# Check disk space
echo "💾 Disk Space:"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
DISK_AVAIL=$(df -h / | awk 'NR==2 {print $4}')
echo "   Used: $DISK_USAGE%"
echo "   Available: $DISK_AVAIL"
if [ "$DISK_USAGE" -lt 80 ]; then
    echo "   ✅ Sufficient space"
else
    echo "   ⚠️  Low disk space"
fi
echo ""

# Check memory
echo "💾 Memory:"
MEM_TOTAL=$(free -h | awk 'NR==2 {print $2}')
MEM_USED=$(free -h | awk 'NR==2 {print $3}')
MEM_FREE=$(free -h | awk 'NR==2 {print $4}')
echo "   Total: $MEM_TOTAL"
echo "   Used: $MEM_USED"
echo "   Free: $MEM_FREE"
echo ""

# Check if port 3000 is available
echo "🔌 Port 3000:"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ⚠️  Port 3000 is in use"
    echo "   Running process:"
    lsof -Pi :3000 -sTCP:LISTEN
else
    echo "   ✅ Port 3000 is available"
fi
echo ""

# Check aaPanel
echo "🎛️  aaPanel:"
if [ -d "/www/server" ]; then
    echo "   ✅ aaPanel detected"
    echo "   Path: /www/server"
else
    echo "   ❌ aaPanel not detected"
fi
echo ""

# Summary
echo "=============================================="
echo "📋 Summary:"
echo ""

READY=true

if ! command -v node &> /dev/null || [[ "${NODE_VERSION:1:2}" -lt 18 ]]; then
    echo "❌ Install Node.js 18+ (via PM2 Manager)"
    READY=false
fi

if ! command -v pm2 &> /dev/null; then
    echo "❌ Install PM2 Manager"
    READY=false
fi

if ! command -v nginx &> /dev/null; then
    echo "❌ Install Nginx"
    READY=false
fi

if [ "$DISK_USAGE" -gt 80 ]; then
    echo "⚠️  Free up disk space"
fi

if $READY; then
    echo "✅ Server is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. cd /www/wwwroot"
    echo "2. git clone <your-repo> jilhub"
    echo "3. cd jilhub"
    echo "4. ./deploy.sh"
else
    echo "⚠️  Please install missing requirements first"
fi
echo ""
