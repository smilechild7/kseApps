// Run after CSS/JS edits so cached assets cannot outlive the matching HTML.
// node scripts/version-assets.cjs [--check]
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');

function syncAssetVersions(check = false) {
  const versions = new Map();
  const changed = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { visit(file); continue; }
      if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
      const original = fs.readFileSync(file, 'utf8');
      const output = original.replace(
        /(<(?:link|script)\b[^>]*\b(?:href|src)=["'])(\/assets\/[^"'?#]+\.(?:css|js))(?:\?v=[\w.-]+)?(["'])/g,
        (_, prefix, asset, quote) => {
          if (!versions.has(asset)) {
            const contents = fs.readFileSync(path.join(root, asset));
            versions.set(asset, createHash('sha256').update(contents).digest('hex').slice(0, 12));
          }
          return `${prefix}${asset}?v=${versions.get(asset)}${quote}`;
        }
      );
      if (output === original) continue;
      changed.push(path.relative(root, file));
      if (!check) fs.writeFileSync(file, output);
    }
  }
  visit(root);
  if (check && changed.length) throw new Error(`Asset versions are stale in ${changed.join(', ')}. Run node scripts/version-assets.cjs.`);
  return changed;
}

module.exports = { syncAssetVersions };
if (require.main === module) {
  const changed = syncAssetVersions(process.argv.includes('--check'));
  console.log(changed.length ? `Updated asset versions in ${changed.length} pages.` : 'Asset versions are up to date.');
}
