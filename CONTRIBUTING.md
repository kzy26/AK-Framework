# Contributing to AK Framework

Thank you for your interest in contributing to AK Framework!

## How to Contribute

### Reporting Issues

- Open an issue on GitHub with a clear title and description
- Include steps to reproduce the problem
- Mention which Claude model and Claude Code version you're using

### Adding or Improving Agents

1. Agent definitions live in `.claude/agents/`
2. Each agent has a corresponding command in `.claude/commands/`
3. Skills that support agents are in `.claude/skills/`

### Adding Commands

1. Create a new command file: `.claude/commands/ak-<name>.md`
2. Register it in `CLAUDE.md` under the Command Recognition section
3. Test with Claude Code: `/ak-<name>`

### Improving Skills

1. Skills live in `.claude/skills/<skill-name>/SKILL.md`
2. Each skill provides domain knowledge to agents
3. Update the skills mapping in `CLAUDE.md` if adding new skills

## Guidelines

- Keep agent/skill definitions clear and focused
- Test your changes with Claude Code before submitting
- Follow conventional commit messages
- Write in English for code and configuration
- Documentation can be in Thai or English

## Structure Overview

```
.claude/
├── commands/    # User-facing slash commands
├── agents/      # Sub-agent definitions (used by Task tool)
├── skills/      # Domain knowledge for agents
└── memory/      # Auto-managed context (don't edit templates)
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test with Claude Code
5. Submit a pull request with a clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
