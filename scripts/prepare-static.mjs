import { cpSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
// app.html is the source template; index.html is always the static release.
renameSync(resolve(output, 'app.html'), resolve(output, 'index.html'));
const html = readFileSync(resolve(output, 'index.html'), 'utf8')
  .replace(/\r/g, '')
  // Vite writes module tags even for an IIFE bundle. Classic deferred scripts
  // and ordinary stylesheets can load from file:// without CORS restrictions.
  .replace(/<script type="module" crossorigin /g, '<script defer ')
  .replace(/<link rel="stylesheet" crossorigin /g, '<link rel="stylesheet" ');
if (html.includes('/src/') || !html.includes('./js/app.js') || !html.includes('./css/style.css')) {
  throw new Error('Build did not produce a static entry point');
}
if (html.includes('type="module"') || html.includes('crossorigin')) {
  throw new Error('Static release must support direct local file opening');
}
writeFileSync(resolve(root, 'index.html'), html);
writeFileSync(resolve(output, 'index.html'), html);
for (const folder of ['assets', 'css', 'js', 'screenshots', 'brand', 'platforms']) {
  rmSync(resolve(root, folder), { recursive: true, force: true });
  cpSync(resolve(output, folder), resolve(root, folder), { recursive: true });
}
writeFileSync(resolve(root, '.nojekyll'), '');
writeFileSync(resolve(output, '.nojekyll'), '');
// Installers are uploaded separately. Never clear an existing Windows folder.
mkdirSync(resolve(root, 'windows'), { recursive: true });
mkdirSync(resolve(output, 'windows'), { recursive: true });
console.log('Static release prepared in the repository root and dist/.');
