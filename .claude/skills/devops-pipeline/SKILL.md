# DevOps Pipeline Skill

> Docker, CI/CD, DigitalOcean Deployment Patterns

## Capability

This skill provides knowledge of:
- Docker multi-stage build optimization
- docker-compose service orchestration
- Nginx reverse proxy configuration
- SSL certificate management
- GitHub Actions CI/CD pipelines
- DigitalOcean Droplet deployment

## Docker Best Practices

### Multi-Stage Build
```
Stage 1: deps     - Install dependencies only (cached)
Stage 2: builder  - Build the application
Stage 3: runner   - Production image (minimal)
```

### Optimization
```
- Use alpine base images
- Copy package*.json before source (layer caching)
- Use .dockerignore to exclude node_modules, .git, etc.
- Don't run as root (USER node)
- Set NODE_ENV=production in runner stage
- Use COPY --from=builder for selective copy
```

### .dockerignore
```
node_modules
.git
.env
*.md
.vscode
.claude
infrastructure
tests
e2e
```

## Docker Compose Patterns

### Service Dependencies
```yaml
services:
  api:
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
```

### Health Checks
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Environment Variables
```
- Never hardcode secrets in docker-compose
- Use .env file for local development
- Use environment variables or secrets manager for production
- Document all required env vars in .env.example
```

## Nginx Configuration

### Key Settings
```nginx
worker_processes auto;

http {
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript;

    # Proxy settings
    proxy_connect_timeout 60s;
    proxy_read_timeout 60s;
    proxy_send_timeout 60s;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
}
```

### SSL Setup
```
1. Install certbot
2. Run: certbot certonly --webroot -w /var/www/certbot -d example.com
3. Auto-renewal cron: 0 0 1 * * certbot renew --quiet
```

## GitHub Actions CI/CD

### CI Pipeline (Every Push)
```
Steps:
1. Checkout code
2. Setup Node.js
3. Install dependencies (npm ci)
4. TypeScript check (tsc --noEmit)
5. Lint (eslint)
6. Unit tests (vitest)
7. Build (api + web)
```

### CD Pipeline (Push to Main)
```
Steps:
1. Run CI pipeline first
2. SSH into DigitalOcean server
3. Pull latest code
4. Build Docker images
5. Stop old containers
6. Start new containers
7. Run database migrations
8. Health check
9. Notify on failure
```

## DigitalOcean Setup

### Initial Server Setup
```
1. Create Droplet (Ubuntu 22.04, 2GB+ RAM)
2. SSH key authentication
3. Create non-root user
4. Install Docker + docker-compose
5. Install Nginx (optional, can use Docker nginx)
6. Setup firewall (ufw: 22, 80, 443)
7. Setup swap (2GB)
```

### Required Environment Variables
```
# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/dbname
DB_NAME=appname
DB_USER=appuser
DB_PASSWORD=secure_password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=secure_password

# App
NODE_ENV=production
API_URL=https://api.example.com
NEXT_PUBLIC_API_URL=https://api.example.com

# Auth
JWT_SECRET=long_random_string
NEXTAUTH_SECRET=long_random_string
NEXTAUTH_URL=https://example.com

# SSL
DOMAIN=example.com
```

## Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Build images
docker compose build --no-cache

# Run migrations
docker compose run --rm api npx prisma migrate deploy

# Restart services
docker compose up -d

# Health check
sleep 10
curl -f http://localhost:3001/health || exit 1

echo "Deployment complete!"
```

## Backup Script

```bash
#!/bin/bash
# backup.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backups

# Database backup
docker compose exec -T postgres pg_dump -U $DB_USER $DB_NAME > \
  $BACKUP_DIR/db_${TIMESTAMP}.sql

# Keep last 7 days
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete

echo "Backup complete: db_${TIMESTAMP}.sql"
```

## Monitoring

```
Essential checks:
- Health endpoint responds (GET /health)
- CPU and memory usage normal
- Disk space sufficient
- SSL certificate not expiring
- Database connections not exhausted
- Redis memory within limits
- Error rate in logs
```
