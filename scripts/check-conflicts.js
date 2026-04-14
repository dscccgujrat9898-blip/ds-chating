const fs = require('fs');
const path = require('path');

const root = process.cwd();
const skip = new Set(['.git', 'node_modules', 'dist']);
const patterns = [
  '<' + '<' + '<' + '<' + '<' + '<' + '<',
  '='.repeat(7),
  '>' + '>' + '>' + '>' + '>' + '>' + '>'
];
const hitFiles = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (skip.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full);
      continue;
    }
    if (!e.isFile()) continue;
    const txt = fs.readFileSync(full, 'utf8');
    if (patterns.some((p) => txt.includes(p))) {
      hitFiles.push(path.relative(root, full));
    }
  }
}

walk(root);

if (hitFiles.length > 0) {
  console.error('Conflict markers found in files:');
  hitFiles.forEach((f) => console.error(`- ${f}`));
  process.exit(1);
}

console.log('No conflict markers found.');
