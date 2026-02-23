# /ak-test - Test Command

> **Command:** `/ak-test [description]` | **Shortcut:** `/ak-t`
> **Agent:** Test Runner | **Skills:** test-engineer, test-engineer-backend

## Mission
ทดสอบระบบด้วย Jest (backend) + Vitest (frontend) + Playwright (E2E)
Auto-fix loop: test → find error → fix → retest until pass

## Testing Stack
- **Backend Unit/Integration**: Jest + ts-jest + jest-mock-extended (`apps/api/`)
- **Frontend Unit**: Vitest + @testing-library/react (`apps/web/`)
- **E2E**: Playwright
- **API Smoke**: Fastify inject (via Jest)
- **Build**: TypeScript check + ESLint + Fastify build + Next.js build

## Framework Selection
| Scope | Framework | Run Command |
|-------|-----------|-------------|
| `apps/api/` | Jest | `npx jest --runInBand` |
| `apps/web/` | Vitest | `npx vitest run` |
| E2E | Playwright | `npx playwright test` |
| All / unspecified | Both + E2E | Run all sequentially |

## Auto-Fix Loop
```
1. Determine scope from $ARGUMENTS
2. Run tests (Jest for api, Vitest for web)
3. Find failures
4. Analyze root cause
5. Fix the code (not the test)
6. Re-run failing framework only
7. Repeat until ALL pass
8. Run build verification (both apps)
```

## Coverage Targets
| Layer | Target |
|-------|--------|
| Services (Jest) | 80%+ |
| Controllers (Jest) | 70%+ |
| Middleware (Jest) | 75%+ |
| Utilities | 90%+ |
| UI Components (Vitest) | 60%+ |

## Critical Rules
1. Fix the CODE not the test (unless test is wrong)
2. Auto-fix loop until ALL pass
3. Build verification after code changes
4. Never skip TypeScript errors
5. Use correct framework per scope (Jest for api, Vitest for web)

$ARGUMENTS คือสิ่งที่ต้องการทดสอบ (ถ้าไม่ระบุ = ทดสอบทั้งหมด)