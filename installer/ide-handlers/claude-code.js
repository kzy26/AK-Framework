/**
 * AK Framework - Claude Code IDE Handler
 * Copies CLAUDE.md and settings to target project
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Setup Claude Code configuration
 * - Copy CLAUDE.md template to project root
 * - Copy settings.local.json if available
 */
export async function setupClaudeCode(targetDir, srcDir) {
  // Copy CLAUDE.md
  const claudeMdSource = path.join(srcDir, 'templates', 'CLAUDE.md');
  const claudeMdTarget = path.join(targetDir, 'CLAUDE.md');

  if (fs.existsSync(claudeMdSource)) {
    await fs.copy(claudeMdSource, claudeMdTarget, { overwrite: true });
  }

  // Copy settings.local.json (only if not existing)
  const settingsSource = path.join(srcDir, 'templates', 'settings.local.json');
  const settingsTarget = path.join(targetDir, '.claude', 'settings.local.json');

  if (fs.existsSync(settingsSource) && !fs.existsSync(settingsTarget)) {
    await fs.copy(settingsSource, settingsTarget);
  }
}
