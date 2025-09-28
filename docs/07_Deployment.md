# 07_Deployment.md

## Tổng quan
Hướng dẫn deploy Expense Manager App lên các môi trường khác nhau, bao gồm development, staging và production.

---

## Môi trường Deployment

### Development Environment
- **Mục đích**: Phát triển và test local
- **Database**: SQLite (file-based)
- **Port**: Backend (3000), Frontend (5173)
- **Domain**: localhost

### Staging Environment  
- **Mục đích**: Test integration trước khi deploy production
- **Database**: PostgreSQL (cloud hoặc VPS)
- **Port**: Backend (3000), Frontend (80/443)
- **Domain**: staging.expense-manager.com

### Production Environment
- **Mục đích**: Môi trường live cho end users
- **Database**: PostgreSQL (managed service)
- **Port**: Backend (3000), Frontend (80/443)
- **Domain**: expense-manager.com

---

## Prerequisites

### System Requirements
- **Node.js**: v18+ 
- **npm**: v9+
- **Database**: PostgreSQL 13+ (staging/production)
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+

### Required Tools
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

---

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/expense_manager"
# SQLite for development
# DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=production

# CORS
CORS_ORIGIN="https://expense-manager.com"

# Logging
LOG_LEVEL="info"
LOG_FILE="/var/log/expense-manager/app.log"
```

### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL="https://api.expense-manager.com"
VITE_API_TIMEOUT="10000"

# App Configuration
VITE_APP_NAME="Expense Manager"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_ANALYTICS="true"
VITE_ENABLE_DEBUG="false"
```

---

## Database Setup

### PostgreSQL Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE expense_manager;
CREATE USER expense_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE expense_manager TO expense_user;
\q
```

### Database Migration
```bash
# Install dependencies
cd apps/backend
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed data (optional)
npx prisma db seed
```

---

## Backend Deployment

### Method 1: Direct Deployment
```bash
# Clone repository
git clone https://github.com/your-org/expense-manager.git
cd expense-manager

# Install dependencies
cd apps/backend
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start dist/main.js --name "expense-manager-api"
pm2 save
pm2 startup
```

### Method 2: Docker Deployment
```dockerfile
# Dockerfile for backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/backend ./apps/backend

# Build application
WORKDIR /app/apps/backend
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
```

```bash
# Build and run Docker container
docker build -t expense-manager-api .
docker run -d \
  --name expense-manager-api \
  -p 3000:3000 \
  --env-file .env \
  expense-manager-api
```

---

## Frontend Deployment

### Build Production
```bash
cd apps/frontend

# Install dependencies
npm ci

# Build for production
npm run build

# The build files will be in dist/ folder
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/expense-manager
server {
    listen 80;
    server_name expense-manager.com www.expense-manager.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name expense-manager.com www.expense-manager.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/expense-manager.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/expense-manager.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Frontend
    location / {
        root /var/www/expense-manager/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API Proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Deploy Frontend
```bash
# Copy build files to web server
sudo cp -r dist/* /var/www/expense-manager/

# Set permissions
sudo chown -R www-data:www-data /var/www/expense-manager/
sudo chmod -R 755 /var/www/expense-manager/

# Enable site
sudo ln -s /etc/nginx/sites-available/expense-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## SSL Certificate Setup

### Let's Encrypt (Free SSL)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d expense-manager.com -d www.expense-manager.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Monitoring & Logging

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs expense-manager-api

# Restart application
pm2 restart expense-manager-api

# Stop application
pm2 stop expense-manager-api
```

### Log Management
```bash
# Create log directory
sudo mkdir -p /var/log/expense-manager
sudo chown -R $USER:$USER /var/log/expense-manager

# Log rotation
sudo nano /etc/logrotate.d/expense-manager
```

```bash
# /etc/logrotate.d/expense-manager
/var/log/expense-manager/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## Health Checks

### Application Health Check
```bash
# Health check script
#!/bin/bash
# health-check.sh

API_URL="http://localhost:3000/health"
FRONTEND_URL="http://localhost"

# Check backend
if curl -f -s $API_URL > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is down"
    exit 1
fi

# Check frontend
if curl -f -s $FRONTEND_URL > /dev/null; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is down"
    exit 1
fi

echo "✅ All services are healthy"
```

### Automated Health Monitoring
```bash
# Add to crontab
crontab -e
# Check every 5 minutes
*/5 * * * * /path/to/health-check.sh || echo "Health check failed at $(date)" | mail -s "Expense Manager Alert" admin@company.com
```

---

## Backup & Recovery

### Database Backup
```bash
# Backup script
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/var/backups/expense-manager"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="expense_manager"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U expense_user $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### Application Backup
```bash
# Backup application files
tar -czf /var/backups/expense-manager/app_$(date +%Y%m%d).tar.gz /var/www/expense-manager/
```

---

## Security Checklist

### Server Security
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Regular security updates
- [ ] Fail2ban installed
- [ ] SSL certificate valid
- [ ] Database access restricted

### Application Security
- [ ] Environment variables secured
- [ ] JWT secrets strong and unique
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] Rate limiting implemented
- [ ] Security headers added

### Database Security
- [ ] Database user with minimal privileges
- [ ] Connection encrypted (SSL)
- [ ] Regular backups encrypted
- [ ] Access logs enabled
- [ ] Database firewall configured

---

## Troubleshooting

### Common Issues

**1. Application won't start**
```bash
# Check logs
pm2 logs expense-manager-api

# Check port availability
netstat -tulpn | grep :3000

# Check environment variables
pm2 show expense-manager-api
```

**2. Database connection failed**
```bash
# Test database connection
psql -h localhost -U expense_user -d expense_manager

# Check database status
sudo systemctl status postgresql

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

**3. Frontend not loading**
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx configuration
sudo nginx -t

# Check file permissions
ls -la /var/www/expense-manager/
```

**4. SSL certificate issues**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/expense-manager.com/cert.pem -text -noout
```

---

## Rollback Procedure

### Quick Rollback
```bash
# Stop current application
pm2 stop expense-manager-api

# Restore previous version
git checkout previous-stable-tag

# Rebuild and restart
npm run build
pm2 start dist/main.js --name "expense-manager-api"
```

### Database Rollback
```bash
# Restore database from backup
pg_restore -h localhost -U expense_user -d expense_manager /var/backups/expense-manager/backup_YYYYMMDD.sql.gz
```

---

## Performance Optimization

### Backend Optimization
- Enable gzip compression
- Implement Redis caching
- Database query optimization
- Connection pooling
- Load balancing

### Frontend Optimization
- Enable gzip compression
- Implement CDN
- Image optimization
- Code splitting
- Lazy loading

### Monitoring Tools
- PM2 monitoring
- Nginx access logs
- Database performance monitoring
- Application performance monitoring (APM)

---

## Maintenance Schedule

### Daily
- [ ] Check application health
- [ ] Review error logs
- [ ] Monitor disk space
- [ ] Check backup status

### Weekly
- [ ] Review performance metrics
- [ ] Update security patches
- [ ] Clean old log files
- [ ] Test backup restoration

### Monthly
- [ ] Security audit
- [ ] Performance review
- [ ] Update dependencies
- [ ] Disaster recovery test
