# API Architecture Skill

> Fastify API Design Patterns & Best Practices

## Capability

This skill provides knowledge of:
- Fastify framework conventions and plugins
- TypeBox validation schema design
- Layered architecture (Route -> Controller -> Service)
- RESTful API design principles
- Error handling patterns
- Authentication & authorization

## Architecture Layers

```
Route Layer     : HTTP routing, schema validation, thin handler
Controller Layer: Request parsing, response formatting
Service Layer   : Business logic, orchestration, caching
Repository Layer: Data access via Prisma (optional, for complex queries)
```

### Responsibility Rules
```
Route      : ONLY define HTTP method + path + schema + handler reference
Controller : ONLY parse request, call service, format response
Service    : ALL business logic, validation, caching, external calls
Repository : ONLY database queries (Prisma)
```

## Fastify Plugin Pattern

```typescript
// plugins/prisma.plugin.ts
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import { PrismaClient } from "@prisma/client"

async function prismaPlugin(app: FastifyInstance) {
  const prisma = new PrismaClient()
  await prisma.$connect()

  app.decorate("prisma", prisma)
  app.addHook("onClose", async () => {
    await prisma.$disconnect()
  })
}

export default fp(prismaPlugin)
```

## TypeBox Schema Patterns

### Pagination Query
```typescript
export const PaginationQuery = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 })),
  search: Type.Optional(Type.String()),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(Type.Enum({ asc: "asc", desc: "desc" })),
})
```

### Standard Response
```typescript
export const SuccessResponse = (dataSchema: TSchema) =>
  Type.Object({
    success: Type.Literal(true),
    data: dataSchema,
  })

export const PaginatedResponse = (dataSchema: TSchema) =>
  Type.Object({
    success: Type.Literal(true),
    data: Type.Array(dataSchema),
    meta: Type.Object({
      page: Type.Integer(),
      limit: Type.Integer(),
      total: Type.Integer(),
      totalPages: Type.Integer(),
    }),
  })

export const ErrorResponse = Type.Object({
  success: Type.Literal(false),
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
    details: Type.Optional(Type.Array(Type.Any())),
  }),
})
```

## Route Registration Pattern

```typescript
// routes/index.ts
import { FastifyInstance } from "fastify"
import { authRoutes } from "./v1/auth.route"
import { userRoutes } from "./v1/users.route"
import { productRoutes } from "./v1/products.route"

export async function registerRoutes(app: FastifyInstance) {
  // API v1
  app.register(authRoutes, { prefix: "/api/v1/auth" })
  app.register(userRoutes, { prefix: "/api/v1/users" })
  app.register(productRoutes, { prefix: "/api/v1/products" })

  // Health check
  app.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }))
}
```

## Error Handling Pattern

```typescript
// utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown[]
  ) {
    super(message)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, "NOT_FOUND", `${resource} not found`)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown[]) {
    super(400, "VALIDATION_ERROR", message, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, "UNAUTHORIZED", message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, "FORBIDDEN", message)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, "CONFLICT", message)
  }
}
```

### Error Handler Middleware
```typescript
// middleware/error-handler.ts
app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    })
  }

  // Fastify validation error
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: error.validation,
      },
    })
  }

  // Unexpected error
  request.log.error(error)
  return reply.status(500).send({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    },
  })
})
```

## Authentication Pattern

```typescript
// middleware/auth.middleware.ts
import { FastifyRequest, FastifyReply } from "fastify"

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const token = req.headers.authorization?.replace("Bearer ", "")
  if (!token) {
    return reply.status(401).send({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Token required" },
    })
  }

  try {
    const payload = await verifyToken(token)
    req.user = payload
  } catch {
    return reply.status(401).send({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid token" },
    })
  }
}

// Usage in routes:
app.addHook("preHandler", authenticate)
```

## CRUD Template

For any resource, the standard CRUD endpoints are:
```
GET    /api/v1/{resource}      -> List (paginated)
POST   /api/v1/{resource}      -> Create
GET    /api/v1/{resource}/:id  -> Get by ID
PUT    /api/v1/{resource}/:id  -> Update
DELETE /api/v1/{resource}/:id  -> Soft delete
```
