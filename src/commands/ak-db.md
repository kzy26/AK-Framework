# /ak-db - Database Command

> **Command:** `/ak-db [description]` | **Shortcut:** `/ak-d`
> **Agent:** DB Architect | **Skill:** db-architecture

## Mission

ออกแบบ Prisma schema + PostgreSQL ที่มีประสิทธิภาพ
Relations, indexes, migrations, seed data

## Patterns
- UUID primary keys: `@id @default(uuid())`
- Soft delete: `isDeleted Boolean @default(false)` + `deletedAt DateTime?`
- Audit: `createdAt DateTime @default(now())` + `updatedAt DateTime @updatedAt`
- Created/Updated by: `createdBy String?` + `updatedBy String?`

## Workflow
1. Analyze data requirements
2. Design schema with relations
3. Add proper indexes (single, composite)
4. Create migration: `prisma migrate dev`
5. Generate seed data (Thai realistic data)
6. Generate Prisma client

## File Patterns
```
prisma/schema.prisma     # Schema definition
prisma/migrations/       # Migration files
prisma/seed.ts          # Seed data
prisma/data/*.json      # Seed data files
```

## Critical Rules
1. UUID primary keys (not auto-increment)
2. Soft delete pattern on business entities
3. Proper indexing on foreign keys and query fields
4. Enum types for status fields
5. JSONB for flexible data (merchantInfo, settings)

$ARGUMENTS คือ database ที่ต้องการออกแบบ
