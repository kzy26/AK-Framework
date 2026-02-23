# Security Engineer Skill

> Application Security & Vulnerability Prevention

## Capability

This skill provides knowledge of:
- OWASP Top 10 prevention
- Authentication & authorization patterns
- Input validation and sanitization
- Secure API design
- Environment variable management
- Security headers and CORS

## OWASP Top 10 Prevention

### 1. Injection (SQL, NoSQL, Command)
```
Prevention:
- Use Prisma ORM (parameterized queries by default)
- Never concatenate user input into queries
- Validate all input with TypeBox schemas
- Use prepared statements for raw queries
```

### 2. Broken Authentication
```
Prevention:
- Hash passwords with bcrypt (cost factor 12+)
- Implement rate limiting on login endpoints
- Use secure session tokens (JWT with short expiry)
- Enforce strong password policy
- Implement account lockout after failed attempts
```

### 3. Sensitive Data Exposure
```
Prevention:
- HTTPS everywhere (SSL/TLS)
- Never log sensitive data (passwords, tokens, PII)
- Encrypt sensitive data at rest
- Use environment variables for secrets
- Never commit .env files to git
```

### 4. XML External Entities (XXE)
```
Prevention:
- Use JSON for API communication (not XML)
- Disable XML external entity processing if XML needed
```

### 5. Broken Access Control
```
Prevention:
- Implement role-based access control (RBAC)
- Validate permissions on every request
- Use middleware for auth checks
- Never trust client-side role checks alone
- Implement resource ownership verification
```

### 6. Security Misconfiguration
```
Prevention:
- Remove default credentials
- Disable unnecessary features/routes
- Set proper security headers
- Keep dependencies updated
- Don't expose stack traces in production
```

### 7. Cross-Site Scripting (XSS)
```
Prevention:
- React auto-escapes by default (use it!)
- Never use dangerouslySetInnerHTML with user input
- Sanitize HTML if rich text needed (DOMPurify)
- Content Security Policy headers
- HttpOnly cookies for tokens
```

### 8. Insecure Deserialization
```
Prevention:
- Validate all input schemas (TypeBox)
- Don't deserialize untrusted data
- Use type-safe parsers (Zod, TypeBox)
```

### 9. Using Components with Known Vulnerabilities
```
Prevention:
- Regular npm audit
- Keep dependencies updated
- Use lockfile (package-lock.json)
- Review dependency changes in PRs
```

### 10. Insufficient Logging & Monitoring
```
Prevention:
- Log authentication events (login, logout, failed attempts)
- Log authorization failures
- Log input validation failures
- Implement audit trail for sensitive operations
- Monitor for anomalous patterns
```

## Authentication Patterns

### JWT Token Strategy
```typescript
// Token pair: Access + Refresh
Access Token:
  - Short-lived (15 min)
  - Stored in memory (not localStorage)
  - Sent via Authorization header

Refresh Token:
  - Long-lived (7 days)
  - Stored in HttpOnly cookie
  - Used to get new access token
  - Rotate on use (one-time use)
```

### Password Hashing
```typescript
import bcrypt from "bcrypt"

const SALT_ROUNDS = 12

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

### Rate Limiting
```typescript
// Fastify rate limit plugin
app.register(import("@fastify/rate-limit"), {
  max: 100,          // requests
  timeWindow: "1m",  // per minute
  keyGenerator: (req) => req.ip,
})

// Stricter for auth endpoints
app.register(import("@fastify/rate-limit"), {
  max: 5,
  timeWindow: "15m",
  keyGenerator: (req) => req.ip,
  routePrefix: "/api/v1/auth",
})
```

## Security Headers

```typescript
// Fastify helmet plugin
app.register(import("@fastify/helmet"), {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
})
```

## CORS Configuration

```typescript
app.register(import("@fastify/cors"), {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  maxAge: 86400,
})
```

## Input Validation

```
Rules:
1. Validate ALL input (body, query, params, headers)
2. Use TypeBox schemas for Fastify routes
3. Use Zod schemas for frontend forms
4. Sanitize strings (trim, escape HTML if needed)
5. Validate file uploads (type, size, name)
6. Reject unexpected fields (additionalProperties: false)
```

## Environment Security

```
.env.example (commit this - no secrets):
  DATABASE_URL=postgresql://user:password@localhost:5432/dbname
  REDIS_URL=redis://localhost:6379
  JWT_SECRET=change-me-in-production
  NEXTAUTH_SECRET=change-me-in-production

.env (NEVER commit):
  DATABASE_URL=postgresql://realuser:realpass@host:5432/realdb
  JWT_SECRET=actual-long-random-string

.gitignore:
  .env
  .env.local
  .env.production
  *.key
  *.pem
```

## Security Checklist

```
[ ] Passwords hashed with bcrypt (12+ rounds)
[ ] JWT tokens with short expiry
[ ] Rate limiting on auth endpoints
[ ] Input validation on all endpoints
[ ] CORS configured properly
[ ] Security headers set (helmet)
[ ] HTTPS enforced
[ ] No secrets in code or git
[ ] SQL injection prevented (use ORM)
[ ] XSS prevented (React escaping + CSP)
[ ] CSRF protection (SameSite cookies)
[ ] File upload validation
[ ] Error messages don't leak internals
[ ] Audit logging for sensitive operations
[ ] Dependencies regularly updated
```
