import { cpSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
// app.html is the source template; index.html is always the static release.
renameSync(resolve(output, 'app.html'), resolve(output, 'index.html'));
const html = readFileSync(resolve(output, 'index.html'), 'utf8').replace(/\r/g, '');
if (html.includes('/src/') || !html.includes('./assets/')) {
  throw new Error('Build did not produce a static entry point');
}
writeFileSync(resolve(root, 'index.html'), html);
writeFileSync(resolve(output, 'index.html'), html);
for (const folder of ['assets', 'screenshots', 'brand', 'platforms']) {
  rmSync(resolve(root, folder), { recursive: true, force: true });
  cpSync(resolve(output, folder), resolve(root, folder), { recursive: true });
}
writeFileSync(resolve(root, '.nojekyll'), '');
writeFileSync(resolve(output, '.nojekyll'), '');
console.log('Static release prepared in the repository root and dist/.');
