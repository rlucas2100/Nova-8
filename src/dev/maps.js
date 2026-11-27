import { spr } from '../engine/pixel.js';
import { paintMap, buildProps, TILE } from '../art/tiles.js';
import { MAPS } from '../game/maps.js';
import { BATTLERS } from '../art/battlers.js';
import * as C from '../art/chars.js';
const q = new URLSearchParams(location.search);
const c = document.getElementById('c'), g = c.getContext('2d');
const S = +(q.get('s') || 2);
if (q.get('m') === 'battle') {
  const names = Object.keys(BATTLERS);
  c.width = names.length * 50 * S; c.height = 60 * S;
  g.imageSmoothingEnabled = false; g.fillStyle = '#3c1f7a'; g.fillRect(0, 0, c.width, c.height);
  names.forEach((n, i) => { const b = BATTLERS[n]; const im = spr(b.rows, b.pal); g.drawImage(im, i * 50 * S + 4, 4, im.width * S, im.height * S); g.fillStyle = '#fff'; g.fillText(n, i * 50 * S + 4, 56 * S); });
} else {
  const map = MAPS[q.get('id') || 'bloomhaven'];
  // ?v=1: the finished state (flag swaps applied: Cody's staff bridge, the Deep healed)
  let rows = map.rows;
  if (q.get('v')) for (const s of map.swaps || []) {
    if (s.letters) rows = rows.map((r) => r.replace(/./g, (c) => s.letters[c] || c));
    if (s.tiles) { const gr = rows.map((r) => r.split('')); for (const [x, y, ch] of s.tiles) gr[y][x] = ch; rows = gr.map((r) => r.join('')); }
  }
  const frames = paintMap(rows), props = buildProps();
  c.width = frames[0].width * S; c.height = frames[0].height * S;
  g.imageSmoothingEnabled = false;
  g.drawImage(frames[+(q.get('f') || 0)], 0, 0, c.width, c.height);
  const list = map.props.slice().sort((a, b) => a.y - b.y);
  for (const pr of list) {
    const d = props[q.get('v') && pr.alt ? pr.alt.t : pr.t]; if (!d) { console.error('no prop', pr.t); continue; }
    const im = d.img[0];
    let x, y;
    if (d.deco) { x = pr.x * 16 + (pr.px || 0); y = pr.y * 16 + (pr.py || 0); }
    else { x = pr.x * 16 + (d.w * 16 - im.width) / 2; y = (pr.y + d.h) * 16 - im.height; }
    g.drawImage(im, x * S, y * S, im.width * S, im.height * S);
  }
  for (const n of map.npcs) {
    let im;
    if (n.big) { const b = BATTLERS[n.art === 'thornback' ? 'thornAlpha' : n.art]; im = spr(b.rows, b.pal); g.drawImage(im, (n.x * 16 + 16 - im.width / 2) * S, ((n.y + 1) * 16 - im.height) * S, im.width * S, im.height * S); continue; }
    if (n.art === 'sprig') im = spr(C.SPRIG.down[0], C.SPRIG_PAL);
    else if (n.art === 'drone') im = spr(C.DRONE_FR.down[0], C.DRONE_PAL);
    else if (n.art === 'lumen') im = spr(C.LUMEN, C.LUMEN_PAL);
    else if (n.art === 'jelly') im = spr((n.dj ? C.JELLY_DJ : C.JELLY)[0], C.JELLY_PALS[n.pal]);
    else if (n.art === 'cody') im = spr(C.CODY.down[0], C.CODY_PAL);
    else if (n.art === 'turtle') im = spr(C.TURTLE.side[0], C.TURTLE_PALS[n.pal]);
    else if (n.art === 'crab') im = spr(C.CRAB[0], C.CRAB_PALS[n.pal]);
    else im = spr(C.BLOOM.down[0], C.BLOOM_PALS[n.pal]);
    g.drawImage(im, n.x * 16 * S, (n.y * 16 - 4) * S, 16 * S, 16 * S);
  }
  g.fillStyle = '#ffd23a';
  for (const j of map.jewels || []) { g.fillRect((j.x * 16 + 6) * S, (j.y * 16 + 6) * S, 4 * S, 4 * S); }
  // check: things standing on solid ground or overlapping
  const solid = (x, y) => (TILE[map.rows[y][x]] || {}).solid;
  const taken = new Map();
  for (const pr of map.props) { const d = props[pr.t]; for (let j = 0; j < d.h; j++) for (let i = 0; i < d.w; i++) { const k = (pr.x + i) + ',' + (pr.y + j); if (solid(pr.x + i, pr.y + j)) console.error('prop on solid', pr.t, k); if (taken.has(k)) console.error('overlap', pr.t, taken.get(k), k); taken.set(k, pr.t); } }
  for (const n of map.npcs) { const k = n.x + ',' + n.y; if (solid(n.x, n.y) && !(n.hover && (TILE[map.rows[n.y][n.x]] || {}).void)) console.error('npc on solid', n.id); if (taken.has(k)) console.error('npc on prop', n.id, taken.get(k)); }
  for (const j of map.jewels || []) { const k = j.x + ',' + j.y; if (solid(j.x, j.y)) console.error('jewel on solid', j.id, k); if (taken.has(k)) console.error('jewel on prop', j.id, taken.get(k)); }
}
