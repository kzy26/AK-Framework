# Plan Orchestrator Skill

> Strategic Planning & Multi-Agent Coordination

## Capability

This skill enables the Plan Orchestrator agent to:
- Analyze complex requirements and break them into phases
- Design optimal execution strategies with agent delegation
- Coordinate parallel agent execution
- Track progress and manage phase transitions

## Planning Protocol

### Step 1: Analyze Request
```
- Read user request or PRD
- Identify core features vs nice-to-have
- Detect business type and standard requirements
- Check memory for existing context
```

### Step 2: Design Phases
```
- Group related tasks into phases
- Each phase produces visible, testable output
- UI First in every phase
- Maximum 3-4 agents per phase
- Minimize cross-phase dependencies
```

### Step 3: Assign Agents
```
For each phase:
1. UI Builder -> Pages, components (FIRST)
2. API Builder -> Routes, controllers (after UI)
3. DB Architect -> Schema, migrations (parallel with API)
4. Cache Engineer -> Redis strategy (after API)
5. Design Reviewer -> Polish UI (last)
6. Test Runner -> Verify (final)
```

### Step 4: Estimate & Present
```
- Each phase: brief description + agent assignments
- Total phases count
- Ask user to confirm or adjust
```

## Agent Roster

| Agent | Model | Use When |
|-------|-------|----------|
| Plan Orchestrator | Opus 4.6 | Planning, complex decisions |
| UI Builder | Sonnet 4.6 | Creating pages, components |
| API Builder | Sonnet 4.6 | Creating Fastify routes |
| DB Architect | Opus 4.6 | Schema design, optimization |
| Cache Engineer | Sonnet 4.6 | Redis caching patterns |
| Design Reviewer | Sonnet 4.6 | UX/UI polish |
| Test Runner | Sonnet 4.6 | Testing, bug fixing |
| DevOps Engineer | Sonnet 4.6 | Docker, deployment |

## Parallel Execution Rules

### Can Run in Parallel:
- API Builder + DB Architect (after UI is done)
- Test Runner + Design Reviewer
- Multiple UI pages (independent pages)

### Must Run Sequential:
- UI Builder ALWAYS before other agents in same phase
- DB migrations before API routes that depend on them
- Testing after all code is written

## Phase Template

```markdown
**Phase {N}: {Name}**
Agents:
- UI Builder -> {task list}
- API Builder -> {task list}
- DB Architect -> {task list}

Output:
- {expected deliverables}
```