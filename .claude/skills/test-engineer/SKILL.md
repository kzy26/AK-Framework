# Test Engineer Skill

> Testing Strategy & Quality Assurance Patterns

## Capability

This skill provides knowledge of:
- Testing pyramid and strategy
- Vitest configuration and patterns
- React Testing Library best practices
- Playwright E2E testing patterns
- Fastify API testing with inject
- Auto-fix loop methodology

## Testing Pyramid

```
        /  E2E  \        <- Few, slow, high confidence
       / Integr. \       <- Medium amount
      /   Unit    \      <- Many, fast, focused
```

### Test Distribution
```
Unit Tests     : 70% - Fast, isolated, single function/component
Integration    : 20% - API routes, service + DB interaction
E2E Tests      : 10% - Critical user flows only
```

## Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "tests/"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## Test Patterns

### Service Test (Unit)
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest"

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("create", () => {
    it("should create user with valid data", async () => {
      // Arrange
      const input = { name: "Test", email: "test@example.com" }

      // Act
      const result = await service.create(input)

      // Assert
      expect(result).toMatchObject(input)
      expect(result.id).toBeDefined()
    })

    it("should throw on duplicate email", async () => {
      await expect(service.create(duplicateData))
        .rejects.toThrow("Email already exists")
    })
  })
})
```

### API Route Test (Integration)
```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { buildApp } from "../src/app"
import { FastifyInstance } from "fastify"

describe("Users API", () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("GET /api/v1/users", () => {
    it("should return paginated list", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/v1/users?page=1&limit=10",
      })

      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.payload)
      expect(body.success).toBe(true)
      expect(Array.isArray(body.data)).toBe(true)
    })

    it("should require authentication", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/v1/users",
      })

      expect(res.statusCode).toBe(401)
    })
  })
})
```

### Component Test
```typescript
import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { LoginForm } from "@/components/auth/login-form"

describe("LoginForm", () => {
  it("should render email and password fields", () => {
    render(<LoginForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/email/i)).toBeDefined()
    expect(screen.getByLabelText(/password/i)).toBeDefined()
  })

  it("should show validation errors for empty fields", async () => {
    render(<LoginForm onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    expect(await screen.findByText(/email is required/i)).toBeDefined()
  })

  it("should call onSubmit with form data", async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      })
    })
  })
})
```

### E2E Test (Playwright)
```typescript
import { test, expect } from "@playwright/test"

test.describe("Login Flow", () => {
  test("should login and redirect to dashboard", async ({ page }) => {
    await page.goto("/login")

    // Fill form
    await page.fill("[name=email]", "admin@example.com")
    await page.fill("[name=password]", "password123")
    await page.click("button[type=submit]")

    // Verify redirect
    await expect(page).toHaveURL("/dashboard")
    await expect(page.locator("h1")).toContainText("Dashboard")
  })

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login")

    await page.fill("[name=email]", "wrong@example.com")
    await page.fill("[name=password]", "wrong")
    await page.click("button[type=submit]")

    await expect(page.locator("[role=alert]")).toBeVisible()
  })
})
```

## Auto-Fix Loop

```
STEP 1: Run tests -> npx vitest run
STEP 2: If failures:
  a. Read error output
  b. Identify: Is code wrong or test wrong?
  c. Fix the source (prefer fixing code over test)
  d. Go to STEP 1
STEP 3: If all pass:
  a. Run TypeScript check -> npx tsc --noEmit
  b. Run build -> npm run build
  c. If build fails -> fix and go to STEP 1
  d. All green -> Done
```

## Coverage Targets

| Module | Target | Justification |
|--------|--------|---------------|
| Services | 80%+ | Core business logic |
| Controllers | 70%+ | Request handling |
| Utilities | 90%+ | Pure functions, easy to test |
| Components | 60%+ | Interaction testing |
| E2E | Critical paths | Login, checkout, CRUD |

## Best Practices

```
1. Test behavior, not implementation
2. One assertion focus per test (but multiple asserts OK)
3. Use descriptive test names (should... when... given...)
4. Mock external dependencies (DB, Redis, APIs)
5. Don't test third-party code
6. Keep tests fast (< 100ms per unit test)
7. Use factories for test data
8. Clean up after each test
```
