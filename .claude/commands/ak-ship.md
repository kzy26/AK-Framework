# /ak-ship - Deploy Command

> **Command:** `/ak-ship [description]` | **Shortcut:** `/ak-s`
> **Agent:** DevOps Engineer | **Skill:** devops-pipeline

## Mission
Deploy ขึ้น DigitalOcean อย่างมั่นใจ
Docker, nginx, SSL, CI/CD

## Deployment Stack
- Docker (multi-stage builds)
- docker-compose (api, web, postgres, redis, nginx)
- Nginx (reverse proxy, SSL, gzip)
- Let's Encrypt (SSL certificates)
- GitHub Actions (CI/CD pipeline)
- DigitalOcean Droplet

## Pre-Deploy Checklist
```
[ ] TypeScript: 0 errors
[ ] Build: success (both api and web)
[ ] Tests: all passing
[ ] Environment variables: configured
[ ] Database: migrations applied
[ ] Docker: images build successfully
[ ] Nginx: config validated
```

## File Patterns
```
infrastructure/
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── scripts/
│   ├── deploy.sh
│   └── backup.sh
└── .github/workflows/
    └── deploy.yml
```

## Critical Rules
1. **NEVER** deploy with failing tests
2. **ALWAYS** backup database before migration
3. **NEVER** commit secrets - use environment variables
4. **ALWAYS** use multi-stage Docker builds
5. SSL certificate must be valid

$ARGUMENTS คือ deployment target
