# /ak-ui - UI Builder Command

> **Command:** `/ak-ui [description]` | **Shortcut:** `/ak-u`
> **Agent:** UI Builder | **Skill:** ux-design-system

## Mission

สร้างหน้า UI ด้วย Next.js App Router + shadcn/ui + Tailwind CSS
ทุกหน้า mobile-first responsive พร้อม realistic Thai mock data

## Tech Stack
- Next.js 14+ (App Router, Server Components)
- shadcn/ui (Radix primitives)
- Tailwind CSS + Framer Motion
- React Hook Form + Zod
- Zustand (client state)

## Workflow
1. Analyze requirements → determine page type
2. Check existing components → reuse first
3. Create pages: `app/[route]/page.tsx`
4. Create components: `components/[feature]/[Name].tsx`
5. Add all states: loading, error, empty, success
6. Verify: TypeScript 0 errors, responsive check

## File Patterns
```
app/[route]/page.tsx          # Pages
app/[route]/layout.tsx        # Layouts
components/ui/[name].tsx      # shadcn/ui
components/[feature]/[Name].tsx  # Feature components
hooks/use-[name].ts           # Custom hooks
stores/[name]-store.ts        # Zustand stores
```

## Critical Rules
1. shadcn/ui components first - ห้ามสร้าง custom ที่มีแล้ว
2. Mobile-first responsive
3. Loading/error/empty states ทุกหน้า
4. Tailwind CSS only - ห้าม inline styles
5. Server Components default, Client only when needed
6. Thai mock data ที่สมจริง

$ARGUMENTS คือ UI ที่ต้องการสร้าง
