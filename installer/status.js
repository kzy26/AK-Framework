/**
 * AK Framework - Status Command
 * Check installation status in project directory
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Count files recursively
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

export async function status(options = {}) {
  const targetDir = path.resolve(options.dir || '.');

  console.log(chalk.bold('  Checking: ') + chalk.cyan(targetDir));
  console.log('');

  let issues = 0;

  // Check CLAUDE.md
  console.log(chalk.bold('  Core Files:'));
  console.log(chalk.gray('  ─────────────────────────────────────'));

  if (fs.existsSync(path.join(targetDir, 'CLAUDE.md'))) {
    console.log(`  ${chalk.green('✓')} CLAUDE.md`);
  } else {
    console.log(`  ${chalk.red('✗')} CLAUDE.md`);
    issues++;
  }

  // Check .claude directories
  const dirs = ['commands', 'agents', 'skills', 'memory'];
  for (const dir of dirs) {
    const dirPath = path.join(targetDir, '.claude', dir);
    if (fs.existsSync(dirPath)) {
      const count = countFiles(dirPath);
      console.log(`  ${chalk.green('✓')} .claude/${dir}/ (${count} files)`);
    } else {
      console.log(`  ${chalk.red('✗')} .claude/${dir}/`);
      issues++;
    }
  }

  // Check agents
  console.log('');
  console.log(chalk.bold('  Agents:'));
  console.log(chalk.gray('  ─────────────────────────────────────'));

  const agents = [
    'plan-orchestrator',
    'ui-builder',
    'api-builder',
    'db-architect',
    'cache-engineer',
    'design-reviewer',
    'test-runner',
    'devops-engineer'
  ];

  for (const agent of agents) {
    const agentPath = path.join(targetDir, '.claude', 'agents', `${agent}.md`);
    if (fs.existsSync(agentPath)) {
      console.log(`  ${chalk.green('✓')} ${agent}`);
    } else {
      console.log(`  ${chalk.red('✗')} ${agent}`);
      issues++;
    }
  }

  // Check memory files
  console.log('');
  console.log(chalk.bold('  Memory:'));
  console.log(chalk.gray('  ─────────────────────────────────────'));

  const memoryFiles = [
    'active.md',
    'summary.md',
    'decisions.md',
    'architecture.md',
    'components.md',
    'changelog.md',
    'agents-log.md'
  ];

  for (const file of memoryFiles) {
    const filePath = path.join(targetDir, '.claude', 'memory', file);
    if (fs.existsSync(filePath)) {
      console.log(`  ${chalk.green('✓')} ${file}`);
    } else {
      console.log(`  ${chalk.yellow('~')} ${file} (will be created on first run)`);
    }
  }

  // Check skills
  console.log('');
  console.log(chalk.bold('  Skills:'));
  console.log(chalk.gray('  ─────────────────────────────────────'));

  const skills = [
    'plan-orchestrator',
    'ux-design-system',
    'api-architecture',
    'db-architecture',
    'cache-strategy',
    'test-engineer',
    'test-engineer-backend',
    'security-engineer',
    'business-context',
    'memory-system',
    'devops-pipeline'
  ];

  for (const skill of skills) {
    const skillPath = path.join(targetDir, '.claude', 'skills', skill, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      console.log(`  ${chalk.green('✓')} ${skill}`);
    } else {
      console.log(`  ${chalk.red('✗')} ${skill}`);
      issues++;
    }
  }

  // Check manifest
  console.log('');
  console.log(chalk.bold('  Manifest:'));
  console.log(chalk.gray('  ─────────────────────────────────────'));

  const manifestPath = path.join(targetDir, '.ak', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = await fs.readJson(manifestPath);
    console.log(`  ${chalk.green('✓')} Version: ${manifest.version}`);
    console.log(`  ${chalk.green('✓')} Installed: ${manifest.installedAt}`);
    console.log(`  ${chalk.green('✓')} IDE: ${manifest.ide}`);
  } else {
    console.log(`  ${chalk.yellow('~')} No manifest (installed via legacy method?)`);
  }

  // Summary
  console.log('');
  console.log(chalk.gray('  ─────────────────────────────────────'));

  if (issues === 0) {
    console.log(chalk.green.bold('\n  ✓ AK Framework is properly installed!\n'));
  } else {
    console.log(chalk.yellow.bold(`\n  ⚠ ${issues} issue(s) found.`));
    console.log(chalk.gray('  Run: npx ak-framework install\n'));
  }
}
