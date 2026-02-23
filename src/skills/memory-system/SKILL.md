# Memory System Skill

> Persistent Context Management Across Sessions

## Capability

This skill manages the 7-file memory system that enables:
- Session continuity (resume where you left off)
- Decision tracking (why choices were made)
- Architecture awareness (project structure)
- Progress tracking (what's done, what's next)
- Agent coordination logging

## Memory Files (7 Files)

### 1. active.md (Current Task)
```markdown
# Active Task

## Current Work
[What is being worked on right now]

## Status
[in-progress / blocked / waiting-for-user]

## Next Steps
1. [Step 1]
2. [Step 2]

## Blockers
[Any blockers or questions]
```
**Update:** Every task start/end

### 2. summary.md (Project Overview)
```markdown
# Project Summary

## Project: [Name]
- **Version:** [version]
- **Stack:** [tech stack summary]
- **Status:** [development phase]

## Features Completed
- [Feature 1]
- [Feature 2]

## Features In Progress
- [Feature 3]

## Features Planned
- [Feature 4]
```
**Update:** When features are completed

### 3. decisions.md (Key Decisions)
```markdown
# Key Decisions

| Date | Decision | Reason | Impact |
|------|----------|--------|--------|
| 2024-01-15 | Use Fastify over Express | Performance, TypeBox | API layer |
| 2024-01-15 | PostgreSQL over MySQL | JSONB, full-text search | Database |
```
**Update:** When any technical/architectural decision is made

### 4. architecture.md (Project Structure)
```markdown
# Architecture

## Project Structure
[Directory tree of key files]

## Data Flow
[How data flows through the system]

## Key Patterns
[Patterns used in this project]
```
**Update:** When structure changes significantly

### 5. components.md (Component Registry)
```markdown
# Component Registry

## Pages
| Path | Component | Status |
|------|-----------|--------|
| /dashboard | DashboardPage | Done |

## Components
| Name | Location | Used By |
|------|----------|---------|

## API Endpoints
| Method | Path | Controller | Status |
|--------|------|------------|--------|

## Database Models
| Model | Fields | Relations |
|-------|--------|-----------|
```
**Update:** When components/endpoints/models are created

### 6. changelog.md (Session Changes)
```markdown
# Changelog

## Session: [date]
### Added
- [new feature/file]

### Changed
- [modification]

### Fixed
- [bug fix]
```
**Update:** At the end of every work session

### 7. agents-log.md (Agent Activity)
```markdown
# Agent Activity Log

## Session: [date]
| Time | Agent | Task | Result |
|------|-------|------|--------|
| 10:00 | Plan Orchestrator | Analyze requirements | Plan created |
| 10:05 | UI Builder | Create dashboard | 3 files created |
```
**Update:** When agents are spawned or complete work

## Memory Protocol

### On Session Start
```
1. Check if .claude/memory/ exists
2. Read active.md + summary.md + decisions.md + architecture.md
3. Acknowledge context to user
4. Continue from where last session ended
```

### During Work
```
1. Update active.md when starting new task
2. Log agent activity in agents-log.md
3. Record decisions in decisions.md
4. Track new components in components.md
```

### On Session End
```
1. Update active.md with next steps
2. Update changelog.md with session changes
3. Update summary.md if features completed
4. Confirm: "Memory saved"
```

## Token Budget

```
Target: ~2000 tokens total for memory load
- active.md: ~300 tokens
- summary.md: ~400 tokens
- decisions.md: ~300 tokens
- architecture.md: ~500 tokens
- components.md: ~300 tokens
- changelog.md: ~100 tokens (latest session only)
- agents-log.md: ~100 tokens (latest session only)
```

### Archival Rule
```
When any file exceeds 50 lines:
1. Move old content to .claude/memory/archive/
2. Keep only recent/relevant entries in main file
3. Archive file name: {filename}-{date}.md
```
