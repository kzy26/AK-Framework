#!/usr/bin/env node

/**
 * AK Framework - CLI
 * "Build Smart, Ship Fast" - AI-Orchestration Driven Development
 *
 * Usage:
 *   npx ak-framework install          # Interactive install
 *   npx ak-framework install --quick  # Quick install (defaults)
 *   npx ak-framework list             # Show commands/agents/skills
 *   npx ak-framework status           # Check installation status
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

// Banner
function showBanner() {
  console.log('');
  console.log(chalk.cyan.bold(`    _    _  __  _____                                            _    `));
  console.log(chalk.cyan.bold(`   / \\  | |/ / |  ___| __ __ _ _ __ ___   _____      _____  _ __| | __`));
  console.log(chalk.cyan.bold(`  / _ \\ | ' /  | |_ | '__/ _\` | '_ \` _ \\ / _ \\ \\ /\\ / / _ \\| '__| |/ /`));
  console.log(chalk.cyan.bold(` / ___ \\| . \\  |  _|| | | (_| | | | | | |  __/\\ V  V / (_) | |  |   < `));
  console.log(chalk.cyan.bold(`/_/   \\_\\_|\\_\\ |_|  |_|  \\__,_|_| |_| |_|\\___| \\_/\\_/ \\___/|_|  |_|\\_\\`));
  console.log('');
  console.log(chalk.bold(`  Build Smart, Ship Fast`) + chalk.gray(` — v${pkg.version}`));
  console.log(chalk.gray(`  AI-Orchestration Driven Development for Claude Code`));
  console.log('');
}

// Program
const program = new Command();

program
  .name('ak-framework')
  .description('AK Framework — AI-Orchestration Driven Development for Claude Code')
  .version(pkg.version);

// Install command
program
  .command('install')
  .description('Install AK Framework into your project')
  .option('-d, --dir <path>', 'Target directory', '.')
  .option('-q, --quick', 'Quick install with defaults (no prompts)')
  .action(async (options) => {
    showBanner();
    const { install } = await import('../installer/install.js');
    await install(options);
  });

// List command
program
  .command('list')
  .description('Show all available commands, agents, and skills')
  .action(async () => {
    showBanner();
    const { list } = await import('../installer/list.js');
    await list();
  });

// Status command
program
  .command('status')
  .description('Check AK Framework installation status')
  .option('-d, --dir <path>', 'Target directory', '.')
  .action(async (options) => {
    showBanner();
    const { status } = await import('../installer/status.js');
    await status(options);
  });

// Default: show help if no command
program.action(() => {
  showBanner();
  program.help();
});

program.parse();
