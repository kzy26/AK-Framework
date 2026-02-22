# Project Architecture

> Semantic overview of project structure for AI context loading
> **Update:** After any structural changes (new pages, routes, modules, services)

---

## Project Type
Monorepo with Turborepo

## Entry Points

| Type | Path | Purpose |
|------|------|---------|
| Frontend | `apps/web/` | Next.js App Router |
| Backend | `apps/api/` | Fastify REST API |
| Database | `packages/db/` | Prisma + PostgreSQL |
| Cache | `packages/cache/` | Redis utilities |
| Shared | `packages/shared/` | Shared types & utils |

---

## Core Modules

### `apps/web/` - Next.js Frontend

| Route | File | Description |
|-------|------|-------------|
| (none yet) | - | - |

### `apps/api/` - Fastify Backend

| Route | File | Description |
|-------|------|-------------|
| (none yet) | - | - |

### `packages/db/` - Database

| Model | Purpose | Key Relations |
|-------|---------|---------------|
| (none yet) | - | - |

---

## Data Flow Pattern

```
User Action → Next.js Page → API Call (fetch/axios)
    → Fastify Route → Controller → Service → Prisma → PostgreSQL
    → Response → React State (Zustand) → UI Update

Caching: Service Layer → Check Redis → Miss? → Query DB → Cache Result
```

---

## External Services

| Service | Purpose | Config Location |
|---------|---------|-----------------|
| PostgreSQL | Primary database | `packages/db/prisma/` |
| Redis | Caching & sessions | `packages/cache/` |
| DigitalOcean | Hosting | `infrastructure/` |

---

## Notes

- Architecture tracking enabled
- Monorepo managed by Turborepo

---
*Last updated: template*
