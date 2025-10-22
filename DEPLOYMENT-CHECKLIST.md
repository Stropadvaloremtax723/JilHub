# ✅ JilHub aaPanel Deployment Checklist

## 🎯 Quick Summary
Your Next.js app is now **build-ready** and configured for aaPanel deployment!

---

## 📋 Pre-Deployment Checklist

### On Your Local Machine:
- [x] Fix build errors (authOptions export issue) ✅
- [ ] Commit and push code to GitHub/Git repository
- [ ] Verify `.env.production` has correct values

### On Your Server (aaPanel):
- [ ] Install aaPanel extensions (PM2, Nginx, SSL)
- [ ] Upload/clone project to server
- [ ] Configure environment variables
- [ ] Build and start application
- [ ] Set up reverse proxy
- [ ] Enable SSL certificate

---

## 🚀 Step-by-Step Deployment

### **1. Push Your Code** (On Local Machine)
```powershell
git add .
git commit -m "Prepare for production deployment"
git push origin master
```

### **2. Install aaPanel Apps**
Login to aaPanel → **App Store** → Install:
- ✅ **PM2 Manager** (Node.js runtime)
- ✅ **Nginx** (Web server)
- ✅ **SSL** (Optional but recommended)

### **3. Deploy on Server** (SSH to your server)

#### Clone your repository:
```bash
cd /www/wwwroot
git clone https://github.com/YOUR_USERNAME/JilHub.git jilhub
cd jilhub
```

#### Set up environment:
```bash
# Create production .env
cp .env.production .env

# Generate secure secret
openssl rand -base64 32

# Edit .env with nano
nano .env
```

**Update these in .env:**
```bash
NEXTAUTH_SECRET="paste-the-generated-secret-here"
NEXTAUTH_URL="https://yourdomain.com"  # or http://yourip:3000 for testing
```

#### Run deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

**Or manually:**
```bash
npm install
npx prisma generate
npm run build
pm2 start ecosystem.config.js
pm2 save
```

### **4. Configure Nginx Reverse Proxy**

**Via aaPanel Dashboard:**
1. Website → **Add Site**
   - Domain: `yourdomain.com` (or your IP)
   - Root: `/www/wwwroot/jilhub`
   
2. Site Settings → **Reverse Proxy** → Add:
   - Proxy Name: `jilhub`
   - Target URL: `http://127.0.0.1:3000`
   - Send Domain: `$host`

**Or Edit Nginx Config Manually:**
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### **5. Set File Permissions**
```bash
chmod -R 755 /www/wwwroot/jilhub
chmod -R 755 /www/wwwroot/jilhub/public/uploads
chown -R www:www /www/wwwroot/jilhub
```

### **6. Enable SSL (Recommended)**
aaPanel Dashboard:
1. Website → Your Site → **Settings**
2. **SSL** Tab → Let's Encrypt
3. Enter email → **Apply**
4. Enable **Force HTTPS** ✅

### **7. Verify Deployment**
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs jilhub

# Test locally
curl http://localhost:3000

# Check if Nginx is running
systemctl status nginx
```

---

## 🔄 Future Updates

When you make changes to your app:

```bash
cd /www/wwwroot/jilhub
git pull
npm install
npm run build
pm2 restart jilhub
```

Or use the update script:
```bash
./update.sh
```

---

## 🛠️ Troubleshooting

### App won't start
```bash
pm2 logs jilhub --err
pm2 restart jilhub
```

### Port 3000 already in use
```bash
netstat -tlnp | grep 3000
pm2 delete jilhub
pm2 start ecosystem.config.js
```

### 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check Nginx logs
tail -f /www/wwwlog/yourdomain.com.error.log

# Restart everything
pm2 restart jilhub
systemctl restart nginx
```

### Database connection error
```bash
# Test Prisma connection
cd /www/wwwroot/jilhub
npx prisma db push

# Check .env file
cat .env | grep DATABASE_URL
```

### Upload directory issues
```bash
mkdir -p /www/wwwroot/jilhub/public/uploads
chmod -R 755 /www/wwwroot/jilhub/public/uploads
chown -R www:www /www/wwwroot/jilhub/public/uploads
```

---

## 📊 Useful Commands

### PM2 Commands
```bash
pm2 list                # List all apps
pm2 status              # Show status
pm2 logs jilhub         # View logs
pm2 restart jilhub      # Restart app
pm2 stop jilhub         # Stop app
pm2 delete jilhub       # Remove from PM2
pm2 monit               # Monitor CPU/Memory
```

### Nginx Commands
```bash
nginx -t                      # Test config
systemctl restart nginx       # Restart Nginx
systemctl status nginx        # Check status
```

### System Monitoring
```bash
df -h                   # Check disk space
free -h                 # Check memory
top                     # Check CPU usage
```

---

## 🔒 Security Recommendations

✅ **Must Do:**
- [ ] Use strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Enable HTTPS/SSL certificate
- [ ] Set proper file permissions (755/644)
- [ ] Keep MongoDB credentials secure
- [ ] Use firewall to block direct access to port 3000

✅ **Good Practices:**
- [ ] Regular backups of database and uploads
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Monitor logs regularly
- [ ] Set up monitoring/alerts
- [ ] Use environment variables for all secrets

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `ecosystem.config.js` | PM2 process configuration |
| `.env.production` | Production environment template |
| `deploy.sh` | Initial deployment script |
| `update.sh` | Update/redeploy script |
| `DEPLOYMENT.md` | Full deployment guide |
| `lib/auth.ts` | NextAuth configuration (fixed) |

---

## 🎉 Your App is Ready!

After deployment, access your app at:
- **HTTP:** `http://yourdomain.com` or `http://your-ip`
- **HTTPS:** `https://yourdomain.com` (after SSL setup)

**Admin Login:** `https://yourdomain.com/admin/login`

---

## 📞 Support & Documentation

- **PM2:** https://pm2.keymetrics.io/docs/
- **Next.js:** https://nextjs.org/docs
- **Nginx:** https://nginx.org/en/docs/
- **aaPanel:** https://www.aapanel.com/reference.html

**Need Help?** Check:
1. PM2 logs: `pm2 logs jilhub`
2. Nginx logs: `/www/wwwlog/yourdomain.com.error.log`
3. System logs: `journalctl -xe`
