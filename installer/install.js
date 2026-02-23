/**
 * AK Framework - Install Command
 * Copies framework files to target project directory
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function dirname(p) {
  return path.dirname(p);
}

// Resolve src/ directory (framework source files)
const srcDir = path.join(__dirname, '..', 'src');

/**
 * Count files recursively in a directory
 */
function countFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      count++;
    } else if (stat.isDirectory()) {
      count += countFiles(fullPath);
    }
  }
  return count;
}

/**
 * Install a component (directory) with spinner
 */
async function installComponent(name, source, target) {
  const spinner = ora(`Installing ${name}...`).start();

  try {
    if (!fs.existsSync(source)) {
      spinner.warn(`${name}: source not found, skipping`);
      return 0;
    }

    await fs.copy(source, target, { overwrite: true });
    const count = countFiles(target);
    spinner.succeed(`${name}: ${chalk.green(count)} files installed`);
    return count;
  } catch (err) {
    spinner.fail(`${name}: ${err.message}`);
    return 0;
  }
}

/**
 * Install memory templates (only if not existing)
 */
async function installMemory(source, target) {
  const spinner = ora('Installing memory templates...').start();

  try {
    await fs.ensureDir(target);
    await fs.ensureDir(path.join(target, 'archive'));

    const memoryFiles = [
      'active.md',
      'summary.md',
      'decisions.md',
      'architecture.md',
      'components.md',
      'changelog.md',
      'agents-log.md'
    ];

    let installed = 0;
    let skipped = 0;

    for (const file of memoryFiles) {
      const targetFile = path.join(target, file);
      const sourceFile = path.join(source, file);

      if (fs.existsSync(targetFile)) {
        skipped++;
      } else if (fs.existsSync(sourceFile)) {
        await fs.copy(sourceFile, targetFile);
        installed++;
      }
    }

    if (skipped > 0) {
      spinner.succeed(`Memory: ${chalk.green(installed)} new, ${chalk.yellow(skipped)} preserved`);
    } else {
      spinner.succeed(`Memory: ${chalk.green(installed)} templates installed`);
    }
  } catch (err) {
    spinner.fail(`Memory: ${err.message}`);
  }
}

/**
 * Setup IDE-specific configuration
 */
async function setupIDE(targetDir) {
  const spinner = ora('Setting up Claude Code...').start();

  try {
    const { setupClaudeCode } = await import('./ide-handlers/claude-code.js');
    await setupClaudeCode(targetDir, srcDir);
    spinner.succeed('Claude Code configured');
  } catch (err) {
    spinner.fail(`Claude Code setup: ${err.message}`);
  }
}

/**
 * Setup .gitignore
 */
async function setupGitignore(targetDir) {
  const gitignorePath = path.join(targetDir, '.gitignore');

  if (fs.existsSync(gitignorePath)) {
    const content = await fs.readFile(gitignorePath, 'utf-8');
    if (!content.includes('.claude/memory/archive/')) {
      await fs.appendFile(gitignorePath, '\n# AK Framework - Memory archive\n.claude/memory/archive/\n');
    }
  } else {
    // Copy default .gitignore from src/templates if exists
    const templateGitignore = path.join(srcDir, 'templates', '.gitignore');
    if (fs.existsSync(templateGitignore)) {
      await fs.copy(templateGitignore, gitignorePath);
    } else {
      await fs.writeFile(gitignorePath, [
        '# Dependencies',
        'node_modules/',
        '',
        '# Environment',
        '.env',
        '.env.local',
        '.env.*.local',
        '',
        '# Build output',
        'dist/',
        'build/',
        '.next/',
        '.turbo/',
        '',
        '# IDE',
        '.vscode/',
        '.idea/',
        '',
        '# OS',
        '.DS_Store',
        '',
        '# AK Framework - Memory archive',
        '.claude/memory/archive/',
        ''
      ].join('\n'));
    }
  }
}

/**
 * Write installation manifest
 */
async function writeManifest(targetDir) {
  const pkg = JSON.parse(
    await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf-8')
  );

  const manifest = {
    framework: 'ak-framework',
    version: pkg.version,
    installedAt: new Date().toISOString(),
    ide: 'claude-code'
  };

  const manifestDir = path.join(targetDir, '.ak');
  await fs.ensureDir(manifestDir);
  await fs.writeJson(path.join(manifestDir, 'manifest.json'), manifest, { spaces: 2 });
}

/**
 * Main install function
 */
export async function install(options = {}) {
  const targetDir = path.resolve(options.dir || '.');

  console.log(chalk.bold('  Target: ') + chalk.cyan(targetDir));
  console.log('');

  // Check if src directory exists
  if (!fs.existsSync(srcDir)) {
    console.log(chalk.red('  Error: Framework source files not found.'));
    console.log(chalk.gray('  Expected: ' + srcDir));
    process.exit(1);
  }

  // Check prerequisites
  const prereqs = checkPrerequisites();
  if (!prereqs) {
    process.exit(1);
  }

  // Interactive mode (unless --quick)
  if (!options.quick) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `Install AK Framework into ${targetDir}?`,
        default: true
      }
    ]);

    if (!answers.proceed) {
      console.log(chalk.yellow('\n  Installation cancelled.'));
      return;
    }
  }

  // Check existing installation
  const claudeDir = path.join(targetDir, '.claude');
  const claudeMd = path.join(targetDir, 'CLAUDE.md');

  if (fs.existsSync(claudeDir) && fs.existsSync(claudeMd)) {
    if (!options.quick) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'AK Framework already detected. What would you like to do?',
          choices: [
            { name: 'Update (keeps memory files)', value: 'update' },
            { name: 'Fresh install (overwrites everything)', value: 'fresh' },
            { name: 'Cancel', value: 'cancel' }
          ]
        }
      ]);

      if (action === 'cancel') {
        console.log(chalk.yellow('\n  Installation cancelled.'));
        return;
      }

      // For fresh install, clear existing .claude (except memory)
      if (action === 'fresh') {
        for (const dir of ['commands', 'agents', 'skills']) {
          await fs.remove(path.join(claudeDir, dir));
        }
      }
    }
  }

  console.log('');
  console.log(chalk.bold('  Installing components:'));
  console.log(chalk.gray('  ─────────────────────────────────────'));

  // Ensure target .claude directory
  await fs.ensureDir(path.join(targetDir, '.claude'));

  // Install components
  await installComponent(
    'Commands',
    path.join(srcDir, 'commands'),
    path.join(targetDir, '.claude', 'commands')
  );

  await installComponent(
    'Agents',
    path.join(srcDir, 'agents'),
    path.join(targetDir, '.claude', 'agents')
  );

  await installComponent(
    'Skills',
    path.join(srcDir, 'skills'),
    path.join(targetDir, '.claude', 'skills')
  );

  // Install memory (preserves existing)
  await installMemory(
    path.join(srcDir, 'memory'),
    path.join(targetDir, '.claude', 'memory')
  );

  // Setup Claude Code IDE
  await setupIDE(targetDir);

  // Setup .gitignore
  await setupGitignore(targetDir);

  // Write manifest
  await writeManifest(targetDir);

  // Summary
  console.log('');
  console.log(chalk.gray('  ─────────────────────────────────────'));
  console.log(chalk.green.bold('\n  ✓ AK Framework installed successfully!\n'));

  console.log(chalk.bold('  Next steps:'));
  console.log(chalk.gray('  ─────────────────────────────────────'));
  console.log(`  1. ${chalk.cyan('claude .')}             Open Claude Code`);
  console.log(`  2. ${chalk.cyan('/ak-help')}             See all commands`);
  console.log(`  3. ${chalk.cyan('/ak-vibe <project>')}   Start building!`);
  console.log('');
  console.log(chalk.gray('  Examples:'));
  console.log(chalk.gray('  /ak-vibe payment management system'));
  console.log(chalk.gray('  /ak-ui dashboard page with charts'));
  console.log(chalk.gray('  /ak-api CRUD for products'));
  console.log('');
}

/**
 * Check prerequisites
 */
function checkPrerequisites() {
  console.log(chalk.bold('  Checking prerequisites:'));
  console.log(chalk.gray('  ─────────────────────────────────────'));

  let ok = true;

  // Check Node.js version
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (major >= 18) {
    console.log(`  ${chalk.green('✓')} Node.js ${nodeVersion}`);
  } else {
    console.log(`  ${chalk.red('✗')} Node.js ${nodeVersion} (need >= 18)`);
    ok = false;
  }

  // Check Git
  try {
    execSync('git --version', { stdio: 'pipe' });
    console.log(`  ${chalk.green('✓')} Git`);
  } catch {
    console.log(`  ${chalk.yellow('~')} Git not found (recommended)`);
  }

  console.log('');
  return ok;
}
