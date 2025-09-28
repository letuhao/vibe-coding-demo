# 10_Production_Deployment

## Tổng quan
Hướng dẫn deploy ứng dụng Expense Manager lên production environment với Docker, Nginx, và monitoring stack.

## Kiến trúc Production

### 🏗️ **Infrastructure Stack**
- **Application**: Docker containers với PM2
- **Database**: PostgreSQL 15 với connection pooling
- **Cache**: Redis 7 cho session management
- **Reverse Proxy**: Nginx với SSL termination
- **Monitoring**: Prometheus + Grafana + Loki
- **Logging**: Structured logging với Winston

### 🔧 **Services Architecture**
```
Internet → Nginx (SSL) → App Container → Backend API
                    ↓
                Frontend (Static)
                    ↓
            PostgreSQL + Redis
```

## Prerequisites

### 📋 **System Requirements**
- **OS**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **RAM**: Minimum 4GB, Recommended 8GB+
- **CPU**: 2+ cores
- **Storage**: 50GB+ SSD
- **Docker**: 20.10+
- **Docker Compose**: 2.0+

### 🔐 **Security Requirements**
- SSL certificates (Let's Encrypt recommended)
- Firewall configuration
- Regular security updates
- Database encryption at rest

## Environment Setup

### 1. **Environment Variables**

#### Backend (.env.production)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/expense_manager_prod"

# JWT Secrets (Generate strong secrets)
JWT_SECRET="your-super-secure-jwt-secret-key"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key"

# CORS
CORS_ORIGIN="https://your-domain.com"

# Security
BCRYPT_ROUNDS=12
NODE_ENV=production
```

#### Frontend (.env.production)
```bash
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_NAME=Expense Manager
VITE_APP_ENVIRONMENT=production
```

### 2. **SSL Certificates**
```bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
```

## Deployment Process

### 🚀 **Quick Deploy**
```bash
# 1. Clone repository
git clone https://github.com/your-org/expense-manager.git
cd expense-manager

# 2. Setup environment
cp apps/backend/env.production.example .env.production
cp apps/frontend/env.production.example .env.production

# 3. Configure environment variables
nano .env.production

# 4. Deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 🔧 **Manual Deploy**

#### Step 1: Database Setup
```bash
# Start PostgreSQL
docker-compose -f docker-compose.prod.yml up -d postgres

# Wait for database
sleep 30

# Run migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

#### Step 2: Application Deploy
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up --build -d

# Check health
curl http://localhost:3000/health
curl http://localhost:5173
```

#### Step 3: Monitoring Setup
```bash
# Start monitoring stack
docker-compose -f monitoring/docker-compose.monitoring.yml up -d

# Access monitoring
# Grafana: http://your-domain.com:3001 (admin/admin123)
# Prometheus: http://your-domain.com:9090
```

## Monitoring & Observability

### 📊 **Metrics Collection**
- **Application Metrics**: Response time, error rate, throughput
- **System Metrics**: CPU, memory, disk, network
- **Database Metrics**: Connection pool, query performance
- **Custom Metrics**: Business KPIs, user activity

### 📝 **Logging Strategy**
- **Structured Logging**: JSON format với Winston
- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **Log Aggregation**: Loki + Promtail
- **Log Retention**: 30 days

### 🚨 **Alerting Rules**
```yaml
# High Error Rate
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: "High error rate detected"

# High Memory Usage
- alert: HighMemoryUsage
  expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High memory usage detected"
```

## Performance Optimization

### ⚡ **Backend Optimizations**
- **Connection Pooling**: pgBouncer cho PostgreSQL
- **Caching**: Redis cho session và API responses
- **Compression**: Gzip compression cho API responses
- **Rate Limiting**: API rate limiting với Redis

### 🎨 **Frontend Optimizations**
- **Code Splitting**: Lazy loading cho routes
- **Asset Optimization**: Minification, tree shaking
- **CDN**: Static assets qua CDN
- **Caching**: Browser caching cho static assets

### 🗄️ **Database Optimizations**
- **Indexes**: Optimized indexes cho queries
- **Query Optimization**: Slow query analysis
- **Connection Pooling**: pgBouncer configuration
- **Backup Strategy**: Automated daily backups

## Security Hardening

### 🔒 **Application Security**
- **HTTPS Only**: SSL/TLS termination
- **Security Headers**: HSTS, CSP, X-Frame-Options
- **Input Validation**: Comprehensive validation
- **Rate Limiting**: API và authentication rate limiting

### 🛡️ **Infrastructure Security**
- **Firewall**: UFW/iptables configuration
- **Docker Security**: Non-root containers
- **Network Security**: Isolated Docker networks
- **Secrets Management**: Environment variables

### 🔐 **Database Security**
- **Encryption**: Data encryption at rest
- **Access Control**: Role-based access
- **Audit Logging**: Database access logging
- **Backup Encryption**: Encrypted backups

## Backup & Recovery

### 💾 **Backup Strategy**
```bash
# Database backup
docker-compose exec postgres pg_dump -U expense_user expense_manager_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Application backup
tar -czf app_backup_$(date +%Y%m%d_%H%M%S).tar.gz apps/ logs/ uploads/

# Automated backup script
0 2 * * * /path/to/backup_script.sh
```

### 🔄 **Recovery Process**
```bash
# Database recovery
docker-compose exec -T postgres psql -U expense_user -d expense_manager_prod < backup_file.sql

# Application recovery
tar -xzf app_backup_file.tar.gz
docker-compose up --build -d
```

## Maintenance & Updates

### 🔄 **Update Process**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Build new images
docker-compose -f docker-compose.prod.yml build

# 3. Rolling update
docker-compose -f docker-compose.prod.yml up -d --no-deps app

# 4. Run migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# 5. Verify deployment
curl http://localhost:3000/health
```

### 🧹 **Maintenance Tasks**
- **Log Rotation**: Daily log cleanup
- **Database Maintenance**: Weekly VACUUM
- **Security Updates**: Monthly updates
- **Performance Review**: Quarterly analysis

## Troubleshooting

### 🐛 **Common Issues**

#### Database Connection Issues
```bash
# Check database status
docker-compose logs postgres

# Test connection
docker-compose exec app npx prisma db pull
```

#### Application Crashes
```bash
# Check application logs
docker-compose logs app

# Restart application
docker-compose restart app
```

#### Performance Issues
```bash
# Check resource usage
docker stats

# Analyze slow queries
docker-compose exec postgres psql -U expense_user -d expense_manager_prod -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

### 📞 **Support Contacts**
- **Technical Lead**: tech-lead@company.com
- **DevOps Team**: devops@company.com
- **Emergency**: +1-xxx-xxx-xxxx

## Cost Optimization

### 💰 **Resource Optimization**
- **Right-sizing**: Monitor và adjust resource allocation
- **Auto-scaling**: Scale based on metrics
- **Reserved Instances**: Long-term cost savings
- **Spot Instances**: Non-critical workloads

### 📈 **Monitoring Costs**
- **CloudWatch**: AWS monitoring costs
- **Data Transfer**: Monitor bandwidth usage
- **Storage**: Optimize backup retention
- **Compute**: Right-size instances

---

## 📚 **Additional Resources**
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)
