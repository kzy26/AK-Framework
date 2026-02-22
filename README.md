# AK Framework

> **"Build Smart, Ship Fast"** - AI-Orchestration Driven Development for Claude Code

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Compatible-orange.svg)](https://claude.ai/claude-code)
[![Opus 4.6](https://img.shields.io/badge/Opus_4.6-Optimized-purple.svg)](https://anthropic.com)

AK Framework is an AI-orchestration framework for **Claude Code** that transforms natural language commands into production-grade code through an intelligent Multi-Agent system.

Using the **AODD** (AI-Orchestration Driven Development) approach, a solo developer or small team can build enterprise-quality Full-Stack applications.

## Requirements

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (required)
- [Node.js](https://nodejs.org) LTS (recommended)
- [Git](https://git-scm.com)

## Quick Start

### Option 1: Add to Existing Project

```bash
# Clone AK Framework
git clone https://github.com/phai-ak/AK-Framework.git

# Run setup in your project directory
cd your-project
/path/to/AK-Framework/setup.sh init

# Open with Claude Code
claude .

# See all commands
/ak-help
```

### Option 2: Create New Project

```bash
git clone https://github.com/phai-ak/AK-Framework.git
cd AK-Framework

./setup.sh new my-awesome-app
cd my-awesome-app
claude .

# Start building!
/ak-vibe payment management system
```

### Option 3: Manual Copy

```bash
# Copy .claude folder and CLAUDE.md to your project
cp -r AK-Framework/.claude your-project/.claude
cp AK-Framework/CLAUDE.md your-project/CLAUDE.md

cd your-project
claude .
```

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| `/ak` | - | Smart command - AI picks the right agent |
| `/ak-plan` | `/ak-p` | Plan & analyze project architecture |
| `/ak-vibe` | `/ak-v` | Create entire project from description |
| `/ak-ui` | `/ak-u` | Build UI - Pages, Components, Layouts |
| `/ak-api` | `/ak-a` | Build API - Routes, Controllers, Services |
| `/ak-db` | `/ak-d` | Database - Prisma schema, migrations |
| `/ak-cache` | `/ak-c` | Cache - Redis caching strategies |
| `/ak-design` | `/ak-ds` | Polish design - Professional UX/UI |
| `/ak-test` | `/ak-t` | Test - Auto test & fix loop |
| `/ak-fix` | `/ak-f` | Debug - Systematic bug fixing |
| `/ak-ship` | `/ak-s` | Deploy - DigitalOcean deployment |
| `/ak-help` | `/ak-h` | Show all commands |

## How It Works

```
User: /ak-vibe payment management system

Orchestrator (Opus 4.6):
  ├── Plan Orchestrator  → Analyze & create execution plan
  ├── DB Architect       → Design Prisma schema
  ├── API Builder        → Create Fastify API routes
  ├── UI Builder         → Build Next.js pages
  ├── Cache Engineer     → Setup Redis caching
  ├── Design Reviewer    → Polish UX/UI
  ├── Test Runner        → Run tests & auto-fix
  └── Ship ready-to-deploy application!
```

## 8 Sub-Agents

| Agent | Specialty | Model |
|-------|-----------|-------|
| Plan Orchestrator | Analyze, plan, coordinate | Opus 4.6 |
| UI Builder | Next.js pages, components, layouts | Sonnet 4.6 |
| API Builder | Fastify routes, controllers, services | Sonnet 4.6 |
| DB Architect | Prisma schema, migrations, queries | Opus 4.6 |
| Cache Engineer | Redis caching, invalidation | Sonnet 4.6 |
| Design Reviewer | UX/UI polish, animation, accessibility | Sonnet 4.6 |
| Test Runner | Auto test + fix loop | Sonnet 4.6 |
| DevOps Engineer | Docker, DigitalOcean, CI/CD | Sonnet 4.6 |

## Default Tech Stack

> Configurable per project via `CLAUDE.md`

| Category | Technology |
|----------|------------|
| Runtime | Node.js (strict mode) |
| API | Fastify + TypeBox |
| Frontend | Next.js (App Router) |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache | Redis (ioredis) |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Testing | Vitest + Playwright |
| Deploy | DigitalOcean |
| Language | TypeScript (strict) |

## Project Structure

```
your-project/
├── .claude/
│   ├── commands/       # 12 slash commands
│   ├── agents/         # 8 sub-agent definitions
│   ├── skills/         # 10 skill definitions
│   └── memory/         # 7 memory files (auto-managed)
├── CLAUDE.md           # Framework configuration
└── (your project files)
```

## Memory System

AK Framework automatically manages context across sessions:

| File | Purpose |
|------|---------|
| `active.md` | Current task tracking |
| `summary.md` | Project overview |
| `decisions.md` | Key decisions log |
| `architecture.md` | Structure map |
| `components.md` | Component/API registry |
| `changelog.md` | Change history |
| `agents-log.md` | Agent activity log |

## Setup Script

```bash
./setup.sh init      # Add to current project
./setup.sh new       # Create new project
./setup.sh check     # Verify installation
./setup.sh update    # Update framework (keeps memory)
```

## Customization

Edit `CLAUDE.md` in your project to customize:

- **Tech Stack** - Change frameworks, libraries, database
- **Language** - Communication language and UI labels
- **Mock Data** - Realistic data for your locale
- **Project Structure** - Directory conventions
- **Behavior Rules** - What the AI should/shouldn't do

## Examples

```bash
# Build a complete payment system
/ak-vibe payment management with merchant wallet and transactions

# Add a feature
/ak create notification system for new transactions

# Build specific UI
/ak-ui dashboard page with transaction charts and filters

# Design database
/ak-db schema for payment system with wallet and transaction history

# Fix a bug
/ak-fix login page returns 401 after token refresh
```

## Supported IDE

| IDE | Status |
|-----|--------|
| Claude Code (CLI) | Full support - Native Sub-Agents, Slash Commands, Extended Thinking |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Credits

Inspired by [Toh Framework](https://github.com/wasintoh/toh-framework) by Wasin Treesinthuros. Adapted for production Full-Stack development with Claude Opus 4.6 & Sonnet 4.6.

## License

[MIT](LICENSE)

---

**"Build Smart, Ship Fast"**
