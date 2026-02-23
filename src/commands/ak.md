# /ak - Smart Orchestrator

> **Command:** `/ak [anything]`
> **Role:** Intelligent Multi-Agent Orchestration with Full Visibility

## Core Concept

**Type anything → AI plans intelligently → Multi-Agent execution → Production result**

```
/ak สร้างระบบจัดการ merchant
/ak เพิ่มหน้า dashboard พร้อม chart
/ak fix error ใน login page
```

## Available Sub-Agents

| ID | Agent | File | Specialty |
|----|-------|------|-----------|
| `plan` | 🧠 Plan Orchestrator | `plan-orchestrator.md` | Analysis, Planning |
| `ui` | 🖼️ UI Builder | `ui-builder.md` | Next.js Pages, Components |
| `api` | ⚙️ API Builder | `api-builder.md` | Fastify Routes, Controllers |
| `db` | 🗄️ DB Architect | `db-architect.md` | Prisma Schema, Migrations |
| `cache` | 🔴 Cache Engineer | `cache-engineer.md` | Redis Caching |
| `design` | ✨ Design Reviewer | `design-reviewer.md` | UX/UI Polish |
| `test` | 🧪 Test Runner | `test-runner.md` | Vitest + Playwright |
| `devops` | 🚀 DevOps Engineer | `devops-engineer.md` | DigitalOcean Deploy |

## Orchestration Engine

```
┌─────────────────────────────────────────────────┐
│  PHASE 1: MEMORY & CONTEXT                       │
│  Read .claude/memory/ (7 files)                  │
│                                                   │
│  PHASE 2: INTELLIGENT ANALYSIS                    │
│  Decompose request → Map to agents               │
│  Determine parallel/sequential strategy           │
│                                                   │
│  PHASE 3: WORKFLOW PLAN (MUST SHOW!)              │
│  Task breakdown with agent assignments            │
│                                                   │
│  PHASE 4: MULTI-AGENT EXECUTION                   │
│  Execute via Task tool → Status updates           │
│                                                   │
│  PHASE 5: DELIVERY & MEMORY                       │
│  Final verification → Update memory               │
└─────────────────────────────────────────────────┘
```

## Agent Selection (MUST SHOW!)

```markdown
## 🔍 Analysis

**Request:** "{user_request}"

| Detected Need | Best Agent | Confidence |
|---------------|------------|------------|
| Create pages | 🖼️ UI Builder | 95% |
| API endpoints | ⚙️ API Builder | 90% |
| DB schema | 🗄️ DB Architect | 95% |

### Execution Strategy
[Phase 1] 🗄️ DB + ⚙️ API  ← PARALLEL
[Phase 2] 🖼️ UI            ← SEQUENTIAL
[Phase 3] ✨ Design + 🧪 Test ← PARALLEL
```

## Memory Protocol (7 Files - MANDATORY)

Read ALL before work, update relevant after:
```
.claude/memory/
├── active.md, summary.md, decisions.md
├── changelog.md, agents-log.md
├── architecture.md, components.md
```

## Response Format (MANDATORY)

```markdown
## 🤖 Agent Execution Summary

| Phase | Agent(s) | Task | Status |
|-------|----------|------|--------|
| 1 | 🗄️ DB + ⚙️ API | Schema + Routes | ✅ Done |
| 2 | 🖼️ UI | Dashboard Page | ✅ Done |
| 3 | ✨ Design + 🧪 Test | Polish + Verify | ✅ Done |

## ✅ Files Created
## 👉 Next Steps
## 💾 Memory Updated ✅
```

## Critical Rules

1. **ALWAYS show Workflow Plan** before executing
2. **ALWAYS show Agent Status** during execution
3. **ALWAYS end with test** verification
4. **Parallel when possible** - DB + API can run together
5. **Quality gate** before each handoff
6. **Memory protocol** - read before, update after

$ARGUMENTS คือคำขอจากผู้ใช้ ให้วิเคราะห์และดำเนินการตาม workflow
