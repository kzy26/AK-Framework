# Backend Test Engineer Skill

> Jest Testing Strategy for Fastify API Backend

## Capability

This skill provides knowledge of:
- Jest configuration for TypeScript Fastify projects
- ts-jest transformer setup and TypeScript integration
- Service unit testing patterns (isolated with mocks)
- Route/controller integration testing with Fastify inject
- Prisma client mocking strategy (jest-mock-extended)
- Redis client mocking strategy (manual mock / ioredis-mock)
- JWT/Auth mocking for authenticated endpoints
- Test data factories with realistic Thai data
- Auto-fix loop methodology adapted for Jest

> **Note:** For frontend testing (Next.js / React components), see `test-engineer` skill.

## Dependencies

```json
// apps/api/package.json devDependencies
{
  "jest": "^29.x",
  "ts-jest": "^29.x",
  "@types/jest": "^29.x",
  "jest-mock-extended": "^3.x"
}
```

## Jest Configuration

### jest.config.ts (apps/api/)
```typescript
import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@packages/(.*)$": "<rootDir>/../../packages/$1/src",
  },
  setupFilesAfterSetup: ["<rootDir>/tests/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/types/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
  clearMocks: true,
  restoreMocks: true,
}

export default config
```

### tsconfig.test.json (apps/api/)
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["jest", "node"]
  },
  "include": ["tests/**/*.ts", "src/**/*.ts"]
}
```

### Package Scripts (apps/api/package.json)
```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --runInBand",
    "test:ci": "jest --ci --coverage --runInBand"
  }
}
```

## File Organization

```
apps/api/
├── jest.config.ts
├── tsconfig.test.json
├── tests/
│   ├── setup.ts                    # Global Jest setup (Prisma/Redis mocks)
│   ├── helpers/
│   │   ├── auth.helper.ts         # Token generation helpers
│   │   └── app.helper.ts         # buildApp wrapper for tests
│   ├── factories/
│   │   ├── user.factory.ts        # Test data factories
│   │   └── product.factory.ts
│   ├── services/
│   │   ├── user.service.test.ts
│   │   ├── auth.service.test.ts
│   │   └── product.service.test.ts
│   ├── routes/
│   │   ├── users.test.ts
│   │   ├── auth.test.ts
│   │   └── products.test.ts
│   ├── controllers/
│   │   └── user.controller.test.ts
│   └── middleware/
│       ├── auth.middleware.test.ts
│       └── rate-limit.middleware.test.ts
```

## Test Setup

### Global Setup (tests/setup.ts)
```typescript
import { PrismaClient } from "@prisma/client"
import { mockDeep, DeepMockProxy } from "jest-mock-extended"

// Global Prisma mock
jest.mock("@packages/db", () => ({
  prisma: mockDeep<PrismaClient>(),
}))

// Global Redis mock
jest.mock("@packages/cache", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    pipeline: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
  },
}))

// Increase timeout for integration tests
jest.setTimeout(10000)
```

### App Helper (tests/helpers/app.helper.ts)
```typescript
import { FastifyInstance } from "fastify"
import { buildApp } from "../../src/app"

let app: FastifyInstance | null = null

export async function getTestApp(): Promise<FastifyInstance> {
  if (!app) {
    app = await buildApp({ testing: true })
    await app.ready()
  }
  return app
}

export async function closeTestApp(): Promise<void> {
  if (app) {
    await app.close()
    app = null
  }
}
```

### Auth Helper (tests/helpers/auth.helper.ts)
```typescript
import jwt from "jsonwebtoken"

const TEST_SECRET = "test-jwt-secret"

export function createAuthToken(
  userId: string,
  role: string = "user"
): string {
  return jwt.sign({ sub: userId, role }, TEST_SECRET, {
    expiresIn: "1h",
  })
}

export function createAdminToken(): string {
  return createAuthToken("admin-uuid", "admin")
}
```

## Test Patterns

### Service Unit Test
```typescript
// tests/services/user.service.test.ts
import { UserService } from "../../src/services/user.service"
import { prisma } from "@packages/db"
import { PrismaClient } from "@prisma/client"
import { DeepMockProxy } from "jest-mock-extended"

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

describe("UserService", () => {
  let service: UserService

  beforeEach(() => {
    service = new UserService()
  })

  describe("create", () => {
    it("should create user with valid data", async () => {
      // Arrange
      const input = { name: "สมชาย ใจดี", email: "somchai@example.com" }
      prismaMock.user.create.mockResolvedValue({
        id: "cuid-test-1",
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })

      // Act
      const result = await service.create(input)

      // Assert
      expect(result.name).toBe(input.name)
      expect(result.email).toBe(input.email)
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining(input),
      })
    })

    it("should throw on duplicate email", async () => {
      const input = { name: "มานี รักเรียน", email: "existing@example.com" }
      prismaMock.user.create.mockRejectedValue(
        new Error("Unique constraint failed on the fields: (`email`)")
      )

      await expect(service.create(input)).rejects.toThrow()
    })
  })

  describe("findById", () => {
    it("should return user when found", async () => {
      const mockUser = {
        id: "cuid-test-1",
        name: "วิชัย มั่งมี",
        email: "wichai@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
      prismaMock.user.findFirst.mockResolvedValue(mockUser)

      const result = await service.findById("cuid-test-1")

      expect(result).toEqual(mockUser)
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { id: "cuid-test-1", deletedAt: null },
      })
    })

    it("should return null when not found", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null)

      const result = await service.findById("non-existent")

      expect(result).toBeNull()
    })
  })
})
```

### Route Integration Test (Fastify inject)
```typescript
// tests/routes/users.test.ts
import { FastifyInstance } from "fastify"
import { getTestApp, closeTestApp } from "../helpers/app.helper"
import { createAuthToken, createAdminToken } from "../helpers/auth.helper"

describe("Users API", () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  describe("GET /api/v1/users", () => {
    it("should return paginated users", async () => {
      const token = createAdminToken()
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/users?page=1&limit=10",
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.payload)
      expect(body.success).toBe(true)
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.meta.page).toBe(1)
    })

    it("should return 401 without authentication", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/users",
      })

      expect(response.statusCode).toBe(401)
    })

    it("should return 403 for non-admin users", async () => {
      const token = createAuthToken("user-uuid", "user")
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/users",
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      expect(response.statusCode).toBe(403)
    })
  })

  describe("POST /api/v1/users", () => {
    it("should create user with valid data", async () => {
      const token = createAdminToken()
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        payload: {
          name: "สุภาพร รุ่งเรือง",
          email: "supaporn@example.com",
          password: "SecurePass123!",
        },
      })

      expect(response.statusCode).toBe(201)
      const body = JSON.parse(response.payload)
      expect(body.success).toBe(true)
      expect(body.data.name).toBe("สุภาพร รุ่งเรือง")
    })

    it("should return 400 for invalid data", async () => {
      const token = createAdminToken()
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        payload: {
          name: "",
          email: "not-an-email",
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })
})
```

### Controller Unit Test
```typescript
// tests/controllers/user.controller.test.ts
import { UserController } from "../../src/controllers/user.controller"
import { UserService } from "../../src/services/user.service"

jest.mock("../../src/services/user.service")

describe("UserController", () => {
  let controller: UserController
  let mockService: jest.Mocked<UserService>

  beforeEach(() => {
    mockService = new UserService() as jest.Mocked<UserService>
    controller = new UserController(mockService)
  })

  describe("list", () => {
    it("should return formatted paginated response", async () => {
      const mockUsers = [
        { id: "1", name: "สมชาย ใจดี", email: "somchai@example.com" },
        { id: "2", name: "มานะ สุขสันต์", email: "mana@example.com" },
      ]
      mockService.findAll.mockResolvedValue({
        data: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
      })

      const result = await controller.list({ page: 1, limit: 10 })

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.meta.total).toBe(2)
    })
  })
})
```

### Middleware Test
```typescript
// tests/middleware/auth.middleware.test.ts
import { FastifyInstance } from "fastify"
import { getTestApp, closeTestApp } from "../helpers/app.helper"
import { createAuthToken } from "../helpers/auth.helper"

describe("Auth Middleware", () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it("should reject requests without token", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/protected-route",
    })

    expect(response.statusCode).toBe(401)
    const body = JSON.parse(response.payload)
    expect(body.error).toBe("Unauthorized")
  })

  it("should reject expired tokens", async () => {
    const expiredToken = "expired.jwt.token"
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/protected-route",
      headers: {
        authorization: `Bearer ${expiredToken}`,
      },
    })

    expect(response.statusCode).toBe(401)
  })

  it("should accept valid tokens and set user context", async () => {
    const token = createAuthToken("user-uuid-1", "admin")
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/protected-route",
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).not.toBe(401)
  })
})
```

## Mocking Patterns

### Prisma Mock (jest-mock-extended)

Deep mock with full type safety:
```typescript
import { PrismaClient } from "@prisma/client"
import { mockDeep, DeepMockProxy } from "jest-mock-extended"

// In setup.ts - module-level mock
jest.mock("@packages/db", () => ({
  prisma: mockDeep<PrismaClient>(),
}))

// In test file - get typed reference
import { prisma } from "@packages/db"
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

// Per-test configuration
prismaMock.user.findMany.mockResolvedValue([...])
prismaMock.user.create.mockResolvedValue({...})
prismaMock.user.update.mockResolvedValue({...})

// Verify calls
expect(prismaMock.user.create).toHaveBeenCalledWith({
  data: expect.objectContaining({ email: "test@example.com" }),
})

// Transaction mock
prismaMock.$transaction.mockImplementation(async (fn) => {
  return fn(prismaMock)
})
```

### Redis Mock (Manual)

Simple manual mock for common operations:
```typescript
// In setup.ts
jest.mock("@packages/cache", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn().mockResolvedValue([]),
    exists: jest.fn().mockResolvedValue(0),
    expire: jest.fn(),
    ttl: jest.fn(),
    pipeline: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
  },
}))

// In test file
import { redis } from "@packages/cache"

const redisMock = redis as jest.Mocked<typeof redis>

// Per-test configuration
redisMock.get.mockResolvedValue(JSON.stringify({ id: "1", name: "cached" }))
redisMock.set.mockResolvedValue("OK")

// Verify cache was set
expect(redisMock.setex).toHaveBeenCalledWith(
  "app:user:cuid-1",
  3600,
  expect.any(String)
)
```

## Test Data Factories

```typescript
// tests/factories/user.factory.ts
import { User } from "@prisma/client"

let counter = 0

export function createTestUser(overrides?: Partial<User>): User {
  counter++
  return {
    id: `test-uuid-${counter}`,
    name: "สมชาย ใจดี",
    email: `somchai${counter}@example.com`,
    password: "$2b$10$hashedpassword",
    role: "user",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
    ...overrides,
  }
}

export function createTestUsers(count: number): User[] {
  const names = [
    { name: "สมชาย ใจดี", email: "somchai" },
    { name: "มานี รักเรียน", email: "manee" },
    { name: "วิชัย มั่งมี", email: "wichai" },
    { name: "สุภาพร รุ่งเรือง", email: "supaporn" },
    { name: "มานะ สุขสันต์", email: "mana" },
  ]

  return Array.from({ length: count }, (_, i) =>
    createTestUser({
      name: names[i % names.length].name,
      email: `${names[i % names.length].email}${i}@example.com`,
    })
  )
}
```

```typescript
// tests/factories/product.factory.ts
import { Product } from "@prisma/client"

let counter = 0

export function createTestProduct(overrides?: Partial<Product>): Product {
  counter++
  return {
    id: `product-uuid-${counter}`,
    name: `สินค้าทดสอบ ${counter}`,
    description: "รายละเอียดสินค้าทดสอบ",
    price: 1500,
    stock: 100,
    categoryId: "category-uuid-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
    ...overrides,
  }
}
```

## Auto-Fix Loop (Jest)

```
STEP 1: Run tests -> npx jest --runInBand
STEP 2: If failures:
  a. Read error output carefully
  b. Identify: Is code wrong or test wrong?
     - Code wrong: test expects correct behavior but code returns wrong result
     - Test wrong: test expectations don't match updated requirements
  c. Fix the source (ALWAYS prefer fixing code over test)
  d. Go to STEP 1
STEP 3: If all pass:
  a. Run TypeScript check -> npx tsc --noEmit
  b. Run build -> npm run build -w apps/api
  c. If build fails -> fix and go to STEP 1
  d. All green -> Done
```

## Coverage Targets

| Module | Target | Justification |
|--------|--------|---------------|
| Services | 80%+ | Core business logic |
| Controllers | 70%+ | Request handling |
| Middleware | 75%+ | Auth & validation are critical |
| Utilities | 90%+ | Pure functions, easy to test |
| Routes (integration) | Critical paths | Smoke test each endpoint |

## Best Practices

```
1. Use --runInBand for integration tests (shared Fastify instance)
2. Always close Fastify app in afterAll
3. Use jest.mock at module level, configure per-test with mockResolvedValue
4. Prefer mockResolvedValue/mockRejectedValue over mockImplementation
5. Use test data factories for consistent Thai mock data
6. Group tests by layer: tests/services/, tests/routes/, tests/middleware/
7. Name files: [module].test.ts
8. Keep unit tests fast (< 50ms each)
9. Use AAA pattern: Arrange, Act, Assert
10. Mock external dependencies only (DB, Redis, APIs) - never mock the unit under test
11. Clean up resources in afterAll/afterEach
12. Use descriptive test names: should... when... given...
```