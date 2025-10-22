# Quick Deployment Commands for aaPanel

## First Time Deployment

### 1. Upload project to server (via Git or FTP)
```bash
cd /www/wwwroot
git clone <your-repo-url> jilhub
cd jilhub
```

### 2. Setup environment
```bash
cp .env.production .env
nano .env  # Edit with your production settings
```

### 3. Generate a secure NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
Copy the output and update NEXTAUTH_SECRET in .env

### 4. Run deployment
```bash
chmod +x deploy.sh
./deploy.sh
```

### 5. Configure Nginx in aaPanel

**Via aaPanel Web Interface:**
1. Website → Add Site → Enter your domain
2. Site Settings → Reverse Proxy → Add:
   - Target URL: `http://127.0.0.1:3000`
3. SSL → Let's Encrypt → Apply

**Or manually add to Nginx config:**
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

## Future Updates

```bash
cd /www/wwwroot/jilhub
git pull
npm install
npm run build
pm2 restart jilhub
```

## Useful PM2 Commands

```bash
pm2 status              # Check app status
pm2 logs jilhub         # View logs
pm2 restart jilhub      # Restart app
pm2 stop jilhub         # Stop app
pm2 delete jilhub       # Remove from PM2
pm2 monit               # Monitor resources
```

## Troubleshooting

### Check if app is running
```bash
pm2 list
curl http://localhost:3000
```

### View error logs
```bash
pm2 logs jilhub --err
tail -f /www/wwwlog/yourdomain.com.error.log
```

### Test Nginx config
```bash
nginx -t
```

### Restart Nginx
```bash
systemctl restart nginx
# or via aaPanel
/etc/init.d/nginx restart
```

## File Upload Issues

If uploads aren't working:
```bash
cd /www/wwwroot/jilhub
mkdir -p public/uploads
chmod -R 755 public/uploads
chown -R www:www public/uploads
```

## Database Issues

Test database connection:
```bash
cd /www/wwwroot/jilhub
npx prisma db push
```
