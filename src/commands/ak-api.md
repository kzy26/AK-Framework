# /ak-api - API Builder Command

> **Command:** `/ak-api [description]` | **Shortcut:** `/ak-a`
> **Agent:** API Builder | **Skill:** api-architecture

## Mission

สร้าง Fastify REST API พร้อม TypeBox validation
Pattern: Route → Controller → Service → Repository

## Tech Stack
- Fastify + TypeBox schema validation
- fastify-jwt for authentication
- @fastify/rate-limit, @fastify/cors
- Prisma for database access
- Pino for structured logging

## Route Pattern
```typescript
// routes/[resource].ts
import { FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { schema: { querystring: ListQuerySchema, response: { 200: ListResponseSchema } } }, controller.list);
  fastify.get('/:id', { schema: { params: IdParamSchema } }, controller.getById);
  fastify.post('/', { schema: { body: CreateSchema } }, controller.create);
  fastify.put('/:id', { schema: { params: IdParamSchema, body: UpdateSchema } }, controller.update);
  fastify.delete('/:id', { schema: { params: IdParamSchema } }, controller.delete);
};
```

## File Patterns
```
routes/[resource].ts              # Route definitions
controllers/[resource].controller.ts  # Request handlers
services/[resource].service.ts    # Business logic
schemas/[resource].schema.ts      # TypeBox schemas
middleware/auth.ts                # JWT auth
middleware/rate-limit.ts          # Rate limiting
plugins/prisma.ts                 # Prisma plugin
plugins/redis.ts                  # Redis plugin
```

## Critical Rules
1. TypeBox validation on ALL routes
2. JWT auth middleware on protected routes
3. Proper error handling with Fastify error handler
4. Pagination on list endpoints (cursor or offset)
5. Consistent response format: `{ data, meta, error }`

$ARGUMENTS คือ API ที่ต้องการสร้าง
