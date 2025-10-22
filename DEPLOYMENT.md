# JilHub - Deployment Guide for aaPanel

## Prerequisites
- aaPanel installed on your server
- Domain name pointed to your server
- Node.js 18+ (installed via PM2 Manager)
- MongoDB database (already configured)

## Step-by-Step Deployment

### 1. Install Required aaPanel Extensions

1. Login to aaPanel
2. Go to **App Store**
3. Install these apps:
   - **PM2 Manager** (for Node.js apps)
   - **Nginx** (web server)
   - **SSL** (if you want HTTPS - recommended)

### 2. Upload Your Project

**Option A: Using Git (Recommended)**
1. SSH into your server
2. Navigate to your web directory:
   ```bash
   cd /www/wwwroot
   ```
3. Clone your repository:
   ```bash
   git clone <your-repo-url> jilhub
   cd jilhub
   ```

**Option B: Using FTP/SFTP**
1. In aaPanel, go to **Files**
2. Upload your project to `/www/wwwroot/jilhub`

### 3. Install Dependencies

SSH into your server and run:
```bash
cd /www/wwwroot/jilhub
npm install --production=false
```

### 4. Set Up Environment Variables

1. Copy the production environment file:
   ```bash
   cp .env.production .env
   ```

2. Edit the `.env` file with your production settings:
   ```bash
   nano .env
   ```

3. **IMPORTANT**: Update these values:
   - `NEXTAUTH_SECRET`: Generate a random secret (use: `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your domain (e.g., `https://yourdomain.com`)
   - `AD_REDIRECT_URL`: Your actual redirect URL
   - `DATABASE_URL`: Verify it's correct

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Build the Application

```bash
npm run build
```

This will create an optimized production build in `.next` folder.

### 7. Set Up PM2 in aaPanel

1. Go to **App Store** → **PM2 Manager** → **Settings**
2. Click **Add Project**
3. Fill in the details:
   - **Project Name**: jilhub
   - **Project Path**: `/www/wwwroot/jilhub`
   - **Startup File**: `ecosystem.config.js`
   - **Port**: 3000
4. Click **Submit**

**Or via SSH:**
```bash
cd /www/wwwroot/jilhub
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 8. Configure Nginx Reverse Proxy

1. In aaPanel, go to **Website**
2. Click **Add Site**
3. Fill in:
   - **Domain**: yourdomain.com
   - **Root Directory**: `/www/wwwroot/jilhub`
   - **PHP Version**: Pure static (or disable PHP)
4. Click **Submit**

5. After site is created, click **Settings** on your site
6. Go to **Reverse Proxy**
7. Add a reverse proxy:
   - **Proxy Name**: jilhub
   - **Target URL**: `http://127.0.0.1:3000`
   - **Send Domain**: `$host`
8. Click **Submit**

**Or manually edit Nginx config:**
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

### 9. Set Up SSL (HTTPS) - Recommended

1. In aaPanel, click on your site → **Settings**
2. Go to **SSL** tab
3. Choose **Let's Encrypt** (free)
4. Enter your email and click **Apply**
5. Enable **Force HTTPS**

### 10. Configure Upload Directory Permissions

```bash
chmod -R 755 /www/wwwroot/jilhub/public/uploads
chown -R www:www /www/wwwroot/jilhub/public/uploads
```

### 11. Set Up Firewall (if needed)

In aaPanel → **Security**:
- Port 3000: Only allow localhost (127.0.0.1)
- Port 80: Allow all
- Port 443: Allow all

## Post-Deployment

### Check if App is Running
```bash
pm2 status
pm2 logs jilhub
```

### Restart the App
```bash
pm2 restart jilhub
```

### Update the App (Future Deployments)
```bash
cd /www/wwwroot/jilhub
git pull
npm install
npm run build
pm2 restart jilhub
```

## Troubleshooting

### App won't start
- Check logs: `pm2 logs jilhub`
- Check if port 3000 is in use: `netstat -tlnp | grep 3000`
- Verify environment variables: `cat .env`

### 502 Bad Gateway
- Check if PM2 app is running: `pm2 status`
- Check Nginx error logs: `/www/wwwlog/yourdomain.com.error.log`

### Upload not working
- Check directory permissions
- Verify MAX_FILE_SIZE in .env
- Check disk space: `df -h`

### Database connection issues
- Verify DATABASE_URL is correct
- Check if server can connect to MongoDB
- Test connection: `npx prisma db push`

## Performance Optimization

1. **Enable Nginx caching** for static files
2. **Use a CDN** for `public/uploads`
3. **Increase PM2 instances** (in ecosystem.config.js, set instances to number of CPU cores)
4. **Enable Gzip** compression in Nginx

## Security Checklist

- ✅ Change NEXTAUTH_SECRET to a strong random value
- ✅ Use HTTPS (SSL certificate)
- ✅ Set proper file permissions (755 for directories, 644 for files)
- ✅ Keep Node.js and dependencies updated
- ✅ Configure firewall properly
- ✅ Regular backups of uploads and database

## Support

If you encounter issues, check:
- PM2 logs: `pm2 logs jilhub`
- Nginx logs: `/www/wwwlog/yourdomain.com.error.log`
- System logs: `journalctl -xe`
