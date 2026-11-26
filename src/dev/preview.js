import { spr } from '../engine/pixel.js';
import * as C from '../art/chars.js';
const q = new URLSearchParams(location.search); const S = +(q.get('s') || 4); const F = q.get('f') || '';
const c = document.getElementById('c');
const g = c.getContext('2d');
const items = [];
const add = (label, rows, pal, flip) => { if (!F || label.includes(F)) items.push({ label, rows, pal, flip }); };
for (const k of ['boy', 'girl']) for (const d of ['down', 'up', 'side']) C.KID[k][d].forEach((f, i) => add(k + ' ' + d + i, f, C.KID_PAL[k]));
for (const d of ['down', 'up', 'side']) C.TIGER[d].forEach((f, i) => add('tiger ' + d + i, f, C.TIGER_PAL));
for (const v of ['red', 'blue']) for (const d of ['down', 'up', 'side']) C.DRAGON[d].forEach((f, i) => add(v + ' ' + d + i, f, C.DRAGON_PAL[v]));
for (const d of ['down', 'up', 'side']) C.OCTO[d].forEach((f, i) => add('octo ' + d + i, f, C.OCTO_PALS[i]));
for (const d of ['down', 'up', 'side']) add('sprig ' + d, C.SPRIG[d][0], C.SPRIG_PAL);
for (const [k, p] of Object.entries(C.BLOOM_PALS)) add('bloom ' + k, C.BLOOM.down[0], p);
add('bloom side', C.BLOOM.side[0], C.BLOOM_PALS.mint); add('bloom up', C.BLOOM.up[0], C.BLOOM_PALS.mint);
add('drone', C.DRONE_FR.down[0], C.DRONE_PAL);
// riders
const riders = [];
for (const d of ['down', 'up', 'side']) riders.push({ label: 'enya ' + d, base: C.TIGER[d][0], bpal: C.EMERALD_PAL, top: C.ENYA_TOP[d], tpal: C.ENYA_PAL });
for (const d of ['down', 'up', 'side']) riders.push({ label: 'boy/tiger ' + d, base: C.TIGER[d][0], bpal: C.TIGER_PAL, top: C.KID_TOP.boy[d], tpal: C.KID_PAL.boy });
for (const d of ['down', 'up', 'side']) riders.push({ label: 'girl/dragon ' + d, base: C.DRAGON[d][0], bpal: C.DRAGON_PAL.red, top: C.KID_TOP.girl[d], tpal: C.KID_PAL.girl });
for (const d of ['down', 'up', 'side']) riders.push({ label: 'boy/octo ' + d, base: C.OCTO[d][0], bpal: C.OCTO_PALS[0], top: C.KID_TOP.boy[d], tpal: C.KID_PAL.boy });
if (F) riders.splice(0, riders.length, ...riders.filter((r) => r.label.includes(F)));
const cols = +(q.get('c') || 12), cw = 16 * S + 16, ch = 24 * S + 20;
c.width = cols * cw; c.height = Math.ceil((items.length + riders.length) / cols) * ch + 20;
g.imageSmoothingEnabled = false;
g.fillStyle = '#3a8a5a'; g.fillRect(0, 0, c.width, c.height);
items.forEach((it, i) => {
  const x = (i % cols) * cw + 8, y = Math.floor(i / cols) * ch + 8;
  g.drawImage(spr(it.rows, it.pal, it.flip), x, y + 8 * S, 16 * S, 16 * S);
  g.fillStyle = '#fff'; g.fillText(it.label, x, y + 24 * S + 10);
});
riders.forEach((r, j) => {
  const i = items.length + j, x = (i % cols) * cw + 8, y = Math.floor(i / cols) * ch + 8;
  g.drawImage(spr(r.base, r.bpal), x, y + 8 * S, 16 * S, 16 * S);
  g.drawImage(spr(r.top, r.tpal), x, y + 1 * S, 16 * S, r.top.length * S);
  g.fillStyle = '#fff'; g.fillText(r.label, x, y + 24 * S + 10);
});
