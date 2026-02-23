#!/usr/bin/env node

/**
 * AK Framework - NPX Wrapper
 * Delegates to main CLI with 'install' as default command
 *
 * Usage:
 *   npx ak-framework              # Runs 'install' by default
 *   npx ak-framework install      # Explicit install
 *   npx ak-framework list         # List commands/agents
 *   npx ak-framework status       # Check status
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

// Default to 'install' if no command provided
if (args.length === 0 || (args[0] && args[0].startsWith('-'))) {
  args.unshift('install');
}

const cliPath = join(__dirname, 'ak-cli.js');

const child = spawn('node', [cliPath, ...args], {
  stdio: 'inherit',
  cwd: process.cwd()
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start AK Framework CLI:', err.message);
  process.exit(1);
});
