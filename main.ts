/**
 * main.ts - Bundles the Wok & Ember cooking game and screenshots into the output directory
 * and generates the canonical dossier.json required by make.fun.
 */

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = __dirname;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

console.log(`[main.ts] Output directory: ${outputDir}`);

// Ensure output directory exists
mkdirSync(outputDir, { recursive: true });

// Copy game directory
const srcGame = join(repoRoot, 'game');
const destGame = join(outputDir, 'game');
if (existsSync(srcGame)) {
  console.log('[main.ts] Copying game/ to output...');
  cpSync(srcGame, destGame, { recursive: true });
} else {
  console.error('[main.ts] Error: game/ directory not found!');
  process.exit(1);
}

// Copy screenshots directory if present (tolerate missing)
const srcScreenshots = join(repoRoot, 'screenshots');
const destScreenshots = join(outputDir, 'screenshots');
if (existsSync(srcScreenshots)) {
  console.log('[main.ts] Copying screenshots/ to output...');
  cpSync(srcScreenshots, destScreenshots, { recursive: true });
} else {
  console.log('[main.ts] screenshots/ directory not present; skipping.');
}

// Build dossier
console.log('[main.ts] Building dossier.json...');
const dossierJson = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

const dossierPath = join(outputDir, 'dossier.json');
writeFileSync(dossierPath, dossierJson);
console.log(`[main.ts] Successfully wrote dossier.json (${dossierJson.length} bytes) to ${dossierPath}`);
