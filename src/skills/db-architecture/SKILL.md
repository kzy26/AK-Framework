# DB Architecture Skill

> Prisma + PostgreSQL Database Design Patterns

## Capability

This skill provides knowledge of:
- Prisma schema design conventions
- PostgreSQL optimization techniques
- Migration strategies
- Query patterns and performance
- Data modeling for business applications

## Schema Design Principles

### 1. Standard Fields (Every Model)
```prisma
model Example {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@map("examples")
}
```

### 2. Naming Convention
```
Model name  : PascalCase singular (User, OrderItem)
Field name  : camelCase (firstName, userId)
Table name  : snake_case plural via @@map("users")
Column name : snake_case via @map("first_name")
Enum name   : PascalCase (UserRole, OrderStatus)
Enum values : UPPER_SNAKE (ADMIN, IN_PROGRESS)
```

### 3. ID Strategy
```
Primary Key : cuid() - collision-safe, sortable
External ID : UUID v4 for public-facing IDs
Slug        : Unique string for URL-friendly identifiers
```

## Common Schema Patterns

### User + Auth
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  passwordHash  String?   @map("password_hash")
  role          UserRole  @default(USER)
  status        Status    @default(ACTIVE)
  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  sessions      Session[]

  @@index([email])
  @@index([role, status])
  @@map("users")
}

enum UserRole {
  ADMIN
  MANAGER
  USER
}

enum Status {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

### Audit Trail
```prisma
model AuditLog {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  action     String   // CREATE, UPDATE, DELETE
  entity     String   // User, Order, Product
  entityId   String   @map("entity_id")
  oldData    Json?    @map("old_data")
  newData    Json?    @map("new_data")
  ipAddress  String?  @map("ip_address")
  createdAt  DateTime @default(now()) @map("created_at")

  user       User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

### File Upload
```prisma
model FileUpload {
  id          String   @id @default(cuid())
  filename    String
  originalName String  @map("original_name")
  mimeType    String   @map("mime_type")
  size        Int
  url         String
  uploadedBy  String   @map("uploaded_by")
  createdAt   DateTime @default(now()) @map("created_at")

  user        User     @relation(fields: [uploadedBy], references: [id])

  @@index([uploadedBy])
  @@map("file_uploads")
}
```

## Index Strategy

### Always Index:
```
1. Foreign keys (@relation fields)
2. Fields used in WHERE clauses
3. Fields used in ORDER BY
4. Unique constraints
5. Composite indexes for common multi-field queries
```

### Index Types:
```prisma
// Single field
@@index([status])

// Composite (order matters - most selective first)
@@index([status, createdAt])

// Unique
@@unique([email])

// Composite unique
@@unique([organizationId, slug])
```

## Query Optimization

### N+1 Prevention
```typescript
// BAD: N+1 queries
const users = await prisma.user.findMany()
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } })
}

// GOOD: Include relations
const users = await prisma.user.findMany({
  include: { posts: true }
})

// BETTER: Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    posts: {
      select: { id: true, title: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    },
  },
})
```

### Pagination Pattern
```typescript
async function paginate<T>(
  model: any,
  params: { page: number; limit: number; where?: any; orderBy?: any }
) {
  const { page, limit, where, orderBy } = params
  const [data, total] = await Promise.all([
    model.findMany({
      where: { ...where, deletedAt: null },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: orderBy || { createdAt: "desc" },
    }),
    model.count({ where: { ...where, deletedAt: null } }),
  ])

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
```

## Migration Best Practices

```
1. One migration per logical change
2. Never modify existing migration files
3. Test migration on staging before production
4. Always have a rollback plan
5. Backup database before destructive migrations
6. Use prisma migrate deploy (not dev) in production
```

## Seed Data Pattern

```typescript
async function seed() {
  // 1. Create required enums/lookup data first
  // 2. Create admin user
  // 3. Create sample data with realistic Thai data
  // 4. Log completion

  console.log("Seeding complete")
}
```
