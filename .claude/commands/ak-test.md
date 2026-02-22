# /ak-test - Test Command

> **Command:** `/ak-test [description]` | **Shortcut:** `/ak-t`
> **Agent:** Test Runner | **Skill:** test-engineer

## Mission
ทดสอบระบบด้วย Vitest (unit) + Playwright (E2E)
Auto-fix loop: test → find error → fix → retest until pass

## Testing Stack
- **Unit**: Vitest + @testing-library/react
- **E2E**: Playwright
- **API**: Vitest + supertest (Fastify inject)
- **Build**: TypeScript check + ESLint + Next.js build

## Auto-Fix Loop
```
1. Run tests
2. Find failures
3. Analyze root cause
4. Fix the code (not the test)
5. Re-run tests
6. Repeat until ALL pass
7. Run build verification
```

## Coverage Targets
| Layer | Target |
|-------|--------|
| Services | 80%+ |
| Controllers | 70%+ |
| Utilities | 90%+ |
| UI Components | 60%+ |

## Critical Rules
1. Fix the CODE not the test (unless test is wrong)
2. Auto-fix loop until ALL pass
3. Build verification after code changes
4. Never skip TypeScript errors

$ARGUMENTS คือสิ่งที่ต้องการทดสอบ (ถ้าไม่ระบุ = ทดสอบทั้งหมด)
