#!/usr/bin/env node
/**
 * Single source of truth for the color palette is the `@theme` block in
 * `src/global.css`. This script derives `src/components/utilities/colors.ts`
 * from it so runtime consumers (placeholder colors, theme colors, etc.) can
 * never drift from the Tailwind/Uniwind classes.
 *
 *   node scripts/sync-colors.mjs            # regenerate colors.ts
 *   node scripts/sync-colors.mjs --check    # fail if colors.ts is stale (CI)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const cssPath = resolve(root, 'src/global.css');
const colorsPath = resolve(root, 'src/components/utilities/colors.ts');

const css = readFileSync(cssPath, 'utf8');
const themeMatch = css.match(/@theme\s*{([\s\S]*?)}/);

if (!themeMatch) {
  console.error('Could not find an @theme block in src/global.css');
  process.exit(1);
}

const entries = [];
const varRegex = /--color-([a-zA-Z0-9-]+):\s*([^;]+);/g;
let match;
while ((match = varRegex.exec(themeMatch[1])) !== null) {
  entries.push([match[1], match[2].trim()]);
}

const palette = {};
for (const [name, value] of entries) {
  const [head, ...rest] = name.split('-');
  if (rest.length === 0) {
    palette[head] = value;
  } else {
    palette[head] ??= {};
    palette[head][rest.join('-')] = value;
  }
}

function renderObject(obj, indent) {
  const lines = [];
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      lines.push(`${indent}${key}: {`);
      lines.push(renderObject(value, `${indent}  `));
      lines.push(`${indent}},`);
    } else {
      lines.push(`${indent}${key}: '${value}',`);
    }
  }
  return lines.join('\n');
}

const header = `// AUTO-GENERATED from src/global.css — do not edit manually.
// Run 'pnpm sync:colors' to regenerate after changing the @theme tokens.
`;
const output = `${header}const colors = {
${renderObject(palette, '  ')}
} as const;

export default colors;
`;

const check = process.argv.includes('--check');
let existing = null;
try {
  existing = readFileSync(colorsPath, 'utf8');
} catch {
  // colors.ts not generated yet — treated as stale
}

if (existing === output) {
  console.log('src/components/utilities/colors.ts is up to date');
} else if (check) {
  console.error(
    "src/components/utilities/colors.ts is out of sync with src/global.css. Run 'pnpm sync:colors'.",
  );
  process.exit(1);
} else {
  writeFileSync(colorsPath, output);
  console.log('Regenerated src/components/utilities/colors.ts');
}
