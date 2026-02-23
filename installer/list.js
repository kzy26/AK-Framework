/**
 * AK Framework - List Command
 * Shows all available commands, agents, and skills
 */

import chalk from 'chalk';

export async function list() {
  // Commands
  console.log(chalk.cyan.bold('  📋 Commands\n'));
  console.log(chalk.gray('  ─────────────────────────────────────────────────────────'));

  const commands = [
    { cmd: '/ak',        short: '-',       desc: 'Smart command - AI picks the right agent', icon: '🧠' },
    { cmd: '/ak-plan',   short: '/ak-p',   desc: 'Plan & analyze project architecture',     icon: '📋' },
    { cmd: '/ak-vibe',   short: '/ak-v',   desc: 'Create entire project from description',  icon: '🎨' },
    { cmd: '/ak-ui',     short: '/ak-u',   desc: 'Build UI - Pages, Components, Layouts',   icon: '🖼️' },
    { cmd: '/ak-api',    short: '/ak-a',   desc: 'Build API - Routes, Controllers',         icon: '⚙️' },
    { cmd: '/ak-db',     short: '/ak-d',   desc: 'Database - Prisma schema, migrations',    icon: '🗄️' },
    { cmd: '/ak-cache',  short: '/ak-c',   desc: 'Cache - Redis caching strategies',        icon: '🔴' },
    { cmd: '/ak-design', short: '/ak-ds',  desc: 'Polish design - Professional UX/UI',      icon: '✨' },
    { cmd: '/ak-test',   short: '/ak-t',   desc: 'Test - Jest (backend) + Vitest (frontend) + auto-fix', icon: '🧪' },
    { cmd: '/ak-fix',    short: '/ak-f',   desc: 'Debug - Systematic bug fixing',           icon: '🔧' },
    { cmd: '/ak-ship',   short: '/ak-s',   desc: 'Deploy - DigitalOcean deployment',        icon: '🚀' },
    { cmd: '/ak-help',   short: '/ak-h',   desc: 'Show all commands',                       icon: '❓' },
  ];

  for (const c of commands) {
    console.log(
      `  ${c.icon} ${chalk.green(c.cmd.padEnd(14))} ${chalk.gray(c.short.padEnd(10))} ${chalk.white(c.desc)}`
    );
  }

  // Agents
  console.log(chalk.gray('\n  ─────────────────────────────────────────────────────────'));
  console.log(chalk.cyan.bold('\n  🤖 8 Sub-Agents\n'));

  const agents = [
    { name: 'Plan Orchestrator', model: 'Opus 4.6',  desc: 'Analyze, plan, coordinate' },
    { name: 'UI Builder',        model: 'Sonnet 4.6', desc: 'Next.js pages, components, layouts' },
    { name: 'API Builder',       model: 'Sonnet 4.6', desc: 'Fastify routes, controllers, services' },
    { name: 'DB Architect',      model: 'Opus 4.6',  desc: 'Prisma schema, migrations, queries' },
    { name: 'Cache Engineer',    model: 'Sonnet 4.6', desc: 'Redis caching, invalidation' },
    { name: 'Design Reviewer',   model: 'Sonnet 4.6', desc: 'UX/UI polish, animation, accessibility' },
    { name: 'Test Runner',       model: 'Sonnet 4.6', desc: 'Jest (backend), Vitest (frontend), Playwright (E2E)' },
    { name: 'DevOps Engineer',   model: 'Sonnet 4.6', desc: 'Docker, DigitalOcean, CI/CD' },
  ];

  for (const a of agents) {
    console.log(
      `  • ${chalk.yellow(a.name.padEnd(22))} ${chalk.magenta(a.model.padEnd(12))} ${chalk.white(a.desc)}`
    );
  }

  // Skills
  console.log(chalk.gray('\n  ─────────────────────────────────────────────────────────'));
  console.log(chalk.cyan.bold('\n  📚 11 Skills\n'));

  const skills = [
    { name: 'plan-orchestrator',    desc: 'Planning methodology & orchestration' },
    { name: 'ux-design-system',     desc: 'Design tokens, components, patterns' },
    { name: 'api-architecture',     desc: 'RESTful design, Fastify patterns' },
    { name: 'db-architecture',      desc: 'Prisma patterns, migrations' },
    { name: 'cache-strategy',       desc: 'Redis patterns, TTL strategies' },
    { name: 'test-engineer',        desc: 'Vitest, Playwright (frontend testing)' },
    { name: 'test-engineer-backend', desc: 'Jest, ts-jest (backend testing)' },
    { name: 'security-engineer',    desc: 'Auth, validation, security patterns' },
    { name: 'business-context',     desc: 'Business logic frameworks' },
    { name: 'memory-system',        desc: 'Memory protocol enforcement' },
    { name: 'devops-pipeline',      desc: 'Docker, CI/CD, deployment' },
  ];

  for (const s of skills) {
    console.log(
      `  • ${chalk.magenta(s.name.padEnd(24))} ${chalk.white(s.desc)}`
    );
  }

  // Tech Stack
  console.log(chalk.gray('\n  ─────────────────────────────────────────────────────────'));
  console.log(chalk.cyan.bold('\n  🛠️  Default Tech Stack\n'));
  console.log(chalk.white('  Node.js | Fastify | Next.js | Prisma + PostgreSQL'));
  console.log(chalk.white('  Redis | Tailwind + shadcn/ui | Zustand | TypeScript'));
  console.log(chalk.white('  Jest (backend) | Vitest (frontend) | DigitalOcean'));

  console.log('');
}
