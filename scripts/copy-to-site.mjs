/* Copies the built game (dist/) into the portfolio site's "play" folder, ready to upload.
 * (It's called play, not cosmic-castaways, so it can't be mistaken for this project folder: only the
 * built files belong on the web server, never the project with its src and node_modules.)
 *   npm run build:site        (or: node scripts/copy-to-site.mjs [folder])
 * The folder is emptied first, then every file is listed with its size in bytes, to check against
 * the server after uploading. */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const out = process.argv[2] || 'C:/Dev/websites/mysite/play';

if (!existsSync(join(dist, 'castaways.js'))) {
  console.error('dist/castaways.js is missing: run "npm run build" first.');
  process.exit(1);
}
if (basename(out) !== 'play') {
  console.error('The target folder must be called "play" (it is emptied first): ' + out);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(dist, out, { recursive: true });

function list(dir, prefix = '') {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { list(full, prefix + name + '/'); }
    else { console.log('  ' + (prefix + name).padEnd(40) + String(statSync(full).size).padStart(9) + ' bytes'); }
  }
}
console.log('Game written to ' + out + ':');
list(out);
