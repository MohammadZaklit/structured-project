import * as fs from 'fs';
import * as path from 'path';

const LIB_PATH = 'projects/my-lib/src';
const PREFIX_CONFIG = 'projects/my-lib/ui-prefix.json';

const config = JSON.parse(fs.readFileSync(PREFIX_CONFIG, 'utf8'));

const oldPrefix = process.argv[2];
const newPrefix = config.prefix;

if (!oldPrefix || !newPrefix) {
  console.error('Usage: ts-node update-prefix.ts <old-prefix>');
  process.exit(1);
}

function walk(dir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      walk(filepath);
    } else if (/\.(ts|html|scss)$/.test(file)) {
      updateFile(filepath);
    }
  }
}

function updateFile(filepath: string) {
  const content = fs.readFileSync(filepath, 'utf8');

  // Update selectors and string tokens
  let updated = content.replace(new RegExp(`${oldPrefix}-`, 'g'), `${newPrefix}-`);

  // Update class names (e.g. UiButtonComponent -> NxButtonComponent)
  updated = updated.replace(new RegExp(oldPrefix, 'ig'), (match) => {
    const value = match === oldPrefix ? newPrefix : capitalizeFirst(newPrefix);
    return value;
  });

  if (updated !== content) {
    fs.writeFileSync(filepath, updated);
    console.log(`✔ Updated: ${filepath}`);
  }
}

function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

walk(LIB_PATH);

console.log(
  `\nPrefix migration complete:\n${oldPrefix} → ${newPrefix}\nOnly affected ${LIB_PATH}\n`,
);
