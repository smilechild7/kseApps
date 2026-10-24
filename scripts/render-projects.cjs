// Run after editing projects-data.js. Also refreshes CSS/JS cache versions.
// Use --check to detect stale generated cards or asset versions.
const fs = require('node:fs');
const path = require('node:path');
const { PROJECTS_DATA, PROJECT_RENDER_ORDER } = require('../assets/projects-data.js');
const { renderCard } = require('../assets/projects-render.js');
const projects = new Map(PROJECTS_DATA.map(project => [project.id, project]));
let stale = false;
for (const [context, file] of [['home', 'index.html'], ['projects', 'projects/index.html']]) {
  const target = path.join(__dirname, '..', file);
  const original = fs.readFileSync(target, 'utf8');
  const markup = PROJECT_RENDER_ORDER[context].map(id => renderCard(projects.get(id))).join('\n');
  const block = `<!-- projects:start ${context} -->\n${markup}\n<!-- projects:end ${context} -->`;
  const pattern = new RegExp(`<!-- projects:start ${context} -->[\\s\\S]*?<!-- projects:end ${context} -->`);
  const output = pattern.test(original)
    ? original.replace(pattern, () => block)
    : original.replace(`<div class="card-grid" data-project-list="${context}"></div>`, `<div class="card-grid" data-project-list="${context}">\n${block}\n</div>`);
  if (output === original && !pattern.test(original)) throw new Error(`Project container not found in ${file}`);
  if (output !== original) {
    stale = true;
    if (!process.argv.includes('--check')) fs.writeFileSync(target, output);
  }
}
if (process.argv.includes('--check') && stale) {
  console.error('Project cards are stale. Run node scripts/render-projects.cjs.');
  process.exitCode = 1;
} else console.log(process.argv.includes('--check') ? 'Static project cards are up to date.' : 'Static project cards generated.');
require('./version-assets.cjs').syncAssetVersions(process.argv.includes('--check'));
