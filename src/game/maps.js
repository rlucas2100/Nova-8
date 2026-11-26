/* The two areas of Chapter 1 on planet Kirra.
   Ground letters are explained in src/art/tiles.js (TILE). Props, people, pick-ups and triggers are
   listed per map; a prop's x, y is the top-left tile of its solid footprint. */
import { hash } from '../engine/pixel.js';

/* ---------- Bloomhaven: the garden city where you crash ---------- */
const BLOOM_ROWS = [
  '########################~a####',
  '#,,,,,,,,#,*,,,,,,,,,*,,~~,,,#',
  '#,,xxxx,,#,,,,,,,,,,,,,,~a,,,#',
  '#,xx,,,x,#,,,,,,,,,,,,,,~~,*,#',
  '#,xx,,,x,#,,,,,,,,,,,,,,a~,,,#',
  '#,,x,,xx,#,,,,,:,,,,,,,,~~,,,#',
  '#,,,:,,,,#,,,,,:,,,,,,,,~a,,,#',
  '#,,,::::::::::::,,,,,,,,~~,,,#',
  '#,,,,,,,,____________,,,~~,,,#',
  '#,*,,,,,,____________,,,a~,*,#',
  '#,,,,,,,,____________,,,~~,,,#',
  '#,,,,,,,,____________:::==::::',
  '#,,,,,,,,____________,,,~a,,,#',
  '#,,*,,,,,____________,,,~~,,,#',
  '#,,,,,,,,____________,,,a~,,,#',
  '#,,,,,,,,,,,,,,,,,,,,,,,~~,,,#',
  '#,,,*,,,,,,,,,*,,,,,,,*,~a,,,#',
  '#,,,,,,,,,,,,,,,,,,,,,,,~~,,,#',
  '#,,,,,,,,,,,,,,,,,,,,,,,~~,*,#',
  '#,,,,,,,,,,,,,,,,,,,,,,,a~,,,#',
  '#,,,,,,,,,,,,,,,,,,,,,,,~~,,,#',
  '########################~~####',
];

export const BLOOMHAVEN = {
  id: 'bloomhaven', name: 'Bloomhaven', music: 'pl:town',
  rows: BLOOM_ROWS,
  props: [
    { t: 'ship', x: 3, y: 3, id: 'comet', talk: 'ship' },
    { t: 'sign', x: 7, y: 6, text: 'CRASH SITE\nThe COMET, your star-skiff. It has seen better days.' },
    { t: 'podTiger', x: 12, y: 3, id: 'pod-tiger', talk: 'pod' },
    { t: 'podDragon', x: 15, y: 3, id: 'pod-dragon', talk: 'pod' },
    { t: 'podOcto', x: 18, y: 3, id: 'pod-octo', talk: 'pod' },
    { t: 'tree', x: 10, y: 1 }, { t: 'tree', x: 22, y: 1 }, { t: 'frond', x: 11, y: 5 }, { t: 'frond', x: 20, y: 5 },
    { t: 'bush', x: 13, y: 5 }, { t: 'bush', x: 17, y: 5 },
    { t: 'fountain', x: 14, y: 10, talk: 'fountain' },
    { t: 'stall', x: 17, y: 8, talk: 'shop' },
    { t: 'lamp', x: 9, y: 8 }, { t: 'lamp', x: 20, y: 14 }, { t: 'lamp', x: 9, y: 14 },
    { t: 'sign', x: 22, y: 10, text: 'EAST: THE CRIMSON WILDS\nWild creatures roam the glowgrass. Travel with a companion!' },
    { t: 'sign', x: 12, y: 8, text: 'BLOOMHAVEN\nGarden city of planet Kirra. Please do not eat the flowers.' },
    { t: 'dome', x: 2, y: 9 }, { t: 'tree', x: 6, y: 9 }, { t: 'tree', x: 1, y: 12 }, { t: 'bush', x: 7, y: 12 },
    { t: 'tower', x: 1, y: 19 }, { t: 'tower2', x: 5, y: 19 }, { t: 'spire', x: 10, y: 19 }, { t: 'tower3', x: 15, y: 19 },
    { t: 'dome', x: 19, y: 19 }, { t: 'tree', x: 13, y: 18 }, { t: 'frond', x: 9, y: 16 }, { t: 'bush', x: 22, y: 17 },
    { t: 'tree', x: 1, y: 1 }, { t: 'bush', x: 8, y: 1 },
    { t: 'frond', x: 28, y: 1 }, { t: 'tree', x: 27, y: 7 }, { t: 'frond', x: 28, y: 15 }, { t: 'tree', x: 26, y: 19 },
  ],
  npcs: [
    { id: 'sprig', art: 'sprig', x: 15, y: 5, dir: 'down', talk: 'sprig' },
    { id: 'drone', art: 'drone', x: 23, y: 11, dir: 'left', talk: 'drone', hover: true },
    { id: 'fern', art: 'bloom', pal: 'mint', x: 6, y: 11, dir: 'down', talk: 'b1', wander: true },
    { id: 'bud', art: 'bloom', pal: 'lilac', x: 11, y: 13, dir: 'right', talk: 'b2', wander: true },
    { id: 'sol', art: 'bloom', pal: 'sun', x: 19, y: 12, dir: 'left', talk: 'b3', wander: true },
    { id: 'skye', art: 'bloom', pal: 'sky', x: 13, y: 16, dir: 'down', talk: 'b4', wander: true },
    { id: 'reef', art: 'bloom', pal: 'coral', x: 27, y: 4, dir: 'left', talk: 'b5' },
  ],
  warps: [{ x: 29, y: 11, to: 'wilds', tx: 1, ty: 11, dir: 'right' }],
  jewels: [
    { id: 'b-1', x: 2, y: 16, kind: 'gold' }, { id: 'b-2', x: 27, y: 18, kind: 'emerald' }, { id: 'b-3', x: 21, y: 2, kind: 'gold' },
  ],
};

/* ---------- the Crimson Wilds: built from shapes ---------- */
function grid(w, h, ch) {
  const g = Array.from({ length: h }, () => new Array(w).fill(ch));
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < w && y < h) g[y][x] = c; };
  return {
    g, w, h, set,
    get: (x, y) => (x >= 0 && y >= 0 && x < w && y < h ? g[y][x] : '^'),
    rect(x, y, rw, rh, c) { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) set(x + i, y + j, c); },
    blob(cx, cy, rx, ry, c, rough = 0.25, seed = 1) {
      for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1 + (hash(x, y, seed) - 0.5) * rough * 2) set(x, y, c);
      }
    },
    line(x0, y0, x1, y1, c) {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (let i = 0; i <= n; i++) set(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), c);
    },
    rows() { return g.map((r) => r.join('')); },
  };
}

function buildWilds() {
  const W = 44, H = 32, m = grid(W, H, '.');
  // the sky beyond the northern cliff edge, ragged
  m.rect(0, 0, W, 3, ' ');
  for (let x = 0; x < W; x++) if (hash(x, 3, 7) < 0.45) m.set(x, 3, ' ');
  for (let x = 0; x < W; x++) if (m.get(x, 3) === ' ' && hash(x, 4, 8) < 0.25) m.set(x, 4, ' ');
  // rock walls round the other sides
  for (let y = 3; y < H; y++) { m.set(0, y, '^'); m.set(W - 1, y, '^'); if (hash(1, y, 3) < 0.5) m.set(1, y, '^'); if (hash(W - 2, y, 4) < 0.5) m.set(W - 2, y, '^'); }
  for (let x = 0; x < W; x++) { m.set(x, H - 1, '^'); if (hash(x, H - 2, 5) < 0.45) m.set(x, H - 2, '^'); }
  // the way back to Bloomhaven
  m.set(0, 11, '.'); m.set(1, 11, '.'); m.set(1, 10, '.'); m.set(1, 12, '.');
  // blooms and sand scattered over the soil
  for (let y = 4; y < H - 2; y++) for (let x = 2; x < W - 2; x++) if (m.get(x, y) === '.' && hash(x, y, 11) < 0.05) m.set(x, y, '+');
  // glowgrass meadows (wild creatures hide in them)
  const meadows = [[8, 7, 3, 2.2], [16, 10, 3, 2], [5, 20, 2.6, 3], [16, 27, 3.2, 1.8], [30, 8, 3.4, 2.2], [33, 16, 3, 2], [28, 26, 2.5, 2.2], [39, 8, 2, 2.5]];
  meadows.forEach(([cx, cy, rx, ry], i) => m.blob(cx, cy, rx, ry, '"', 0.3, 20 + i));
  // a rocky ridge across the west with one gap (x 10..12), and a ridge in the east
  for (let x = 1; x < 20; x++) if (x < 10 || x > 12) { m.set(x, 13, '^'); m.set(x, 14, '^'); if (hash(x, 12, 9) < 0.3) m.set(x, 12, '^'); }
  for (let y = 9; y < 21; y++) if (y !== 12 && y !== 13) { m.set(34, y, '^'); m.set(35, y, '^'); }
  // the river: from the south up to the cliff edge, where it pours off into the sky
  for (let y = 0; y < H; y++) for (let x = 21; x <= 23; x++) m.set(x, y, y < 3 || m.get(x, y) === ' ' ? 'w' : (hash(x, y, 12) < 0.18 ? 'a' : '~'));
  for (let y = 0; y < 5; y++) for (let x = 21; x <= 23; x++) if (m.get(x, y) === ' ') m.set(x, y, 'w');
  // the island in the middle of the river, with stepping stones from the west bank
  for (let y = 13; y <= 18; y++) for (let x = 19; x <= 25; x++) m.set(x, y, hash(x, y, 13) < 0.25 ? 'a' : '~');
  for (let y = 14; y <= 17; y++) for (let x = 21; x <= 23; x++) m.set(x, y, '.');
  m.set(22, 14, '+'); m.set(21, 17, '+');
  m.set(19, 15, 'o'); m.set(20, 15, 'o');
  // the bridge to the east
  for (let x = 21; x <= 23; x++) m.set(x, 26, '=');
  // Rustclaw's nest: a crater of scrap in the south-east, walled except to the west
  m.blob(38.5, 25, 4.6, 3.6, '^', 0.15, 40);
  m.blob(38.5, 25, 3.4, 2.4, 'n', 0.1, 41);
  m.rect(33, 25, 3, 1, 'n'); m.set(34, 24, 'n');
  // trails
  m.line(1, 11, 11, 11, ':'); m.line(11, 11, 11, 25, ':'); m.line(11, 16, 18, 16, ':'); m.set(18, 15, ':');
  m.line(11, 25, 20, 25, ':'); m.set(20, 26, ':');
  m.line(24, 26, 32, 26, ':'); m.line(32, 26, 33, 25, ':');
  m.line(26, 26, 26, 12, ':'); m.line(26, 12, 37, 12, ':');
  return m.rows();
}
const WILDS_ROWS = buildWilds();

export const WILDS = {
  id: 'wilds', name: 'Crimson Wilds', music: 'pl:wilds',
  zones: [{ x: 31, y: 20, w: 12, h: 11, music: 'nest' }],   // near Rustclaw's nest the music turns tense
  rows: WILDS_ROWS,
  props: [
    { t: 'planet', x: 6, y: 0, px: 8, py: 2 }, { t: 'moon', x: 33, y: 0, px: 4, py: 6 },
    { t: 'shroom', x: 3, y: 6 }, { t: 'shroom', x: 13, y: 5 }, { t: 'shroom', x: 26, y: 5 }, { t: 'shroom', x: 37, y: 5 },
    { t: 'shroom', x: 7, y: 26 }, { t: 'shroom', x: 27, y: 19 }, { t: 'shroom', x: 40, y: 15 },
    { t: 'crystal', x: 18, y: 6 }, { t: 'crystal2', x: 4, y: 9 }, { t: 'crystal3', x: 14, y: 18 }, { t: 'crystal', x: 8, y: 23 },
    { t: 'crystal2', x: 30, y: 21 }, { t: 'crystal', x: 41, y: 10 }, { t: 'crystal3', x: 26, y: 29 }, { t: 'crystal2', x: 19, y: 21 },
    { t: 'rock', x: 9, y: 4 }, { t: 'rock', x: 16, y: 21 }, { t: 'rock', x: 29, y: 13 }, { t: 'rock', x: 38, y: 19 },
    { t: 'boulder', x: 14, y: 23 }, { t: 'boulder', x: 2, y: 27 }, { t: 'boulder', x: 30, y: 4 }, { t: 'boulder', x: 37, y: 13 },
    { t: 'scrap', x: 36, y: 26 }, { t: 'scrap', x: 39, y: 27 }, { t: 'rock', x: 33, y: 27 },
    { t: 'sign', x: 2, y: 10, text: 'THE CRIMSON WILDS\nWEST: Bloomhaven.  Stay out of the glowgrass if your companion is tired!' },
    { t: 'sign', x: 25, y: 25, text: 'SOUTH-EAST: the scrap nest.\nSomething big has been dragging metal in there...' },
  ],
  npcs: [
    { id: 'medic', art: 'bloom', pal: 'mint', x: 5, y: 9, dir: 'down', talk: 'medic' },
    { id: 'scout', art: 'bloom', pal: 'sky', x: 25, y: 9, dir: 'down', talk: 'scout', wander: true },
    { id: 'alpha', art: 'thornback', x: 13, y: 21, dir: 'left', big: true, talk: 'alpha', flag: 'alpha-beaten' },
    { id: 'rustclaw', art: 'rustclaw', x: 38, y: 25, dir: 'left', big: true, talk: 'rustclaw', flag: 'rustclaw-beaten' },
  ],
  warps: [{ x: 0, y: 11, to: 'bloomhaven', tx: 28, ty: 11, dir: 'left' }],
  triggers: [
    { id: 'wilds-intro', x: 2, y: 11, w: 1, h: 1, script: 'wildsIntro' },
    { id: 'alpha-zone', x: 10, y: 18, w: 7, h: 2, script: 'alphaZone' },
  ],
  parts: [{ id: 'navcore', x: 22, y: 15 }],
  jewels: [
    { id: 'w-1', x: 6, y: 5, kind: 'gold' }, { id: 'w-2', x: 15, y: 7, kind: 'ruby' }, { id: 'w-3', x: 19, y: 4, kind: 'gold' },
    { id: 'w-4', x: 8, y: 9, kind: 'emerald' }, { id: 'w-5', x: 2, y: 16, kind: 'sapphire' }, { id: 'w-6', x: 6, y: 18, kind: 'gold' },
    { id: 'w-7', x: 3, y: 24, kind: 'diamond' }, { id: 'w-8', x: 9, y: 29, kind: 'gold' }, { id: 'w-9', x: 18, y: 29, kind: 'ruby' },
    { id: 'w-10', x: 15, y: 17, kind: 'gold' }, { id: 'w-11', x: 23, y: 16, kind: 'sapphire' }, { id: 'w-12', x: 26, y: 8, kind: 'emerald' },
    { id: 'w-13', x: 32, y: 6, kind: 'gold' }, { id: 'w-14', x: 40, y: 6, kind: 'diamond' }, { id: 'w-15', x: 37, y: 10, kind: 'ruby' },
    { id: 'w-16', x: 31, y: 17, kind: 'gold' }, { id: 'w-17', x: 28, y: 15, kind: 'sapphire' }, { id: 'w-18', x: 40, y: 18, kind: 'emerald' },
    { id: 'w-19', x: 27, y: 23, kind: 'gold' }, { id: 'w-20', x: 30, y: 29, kind: 'emerald' }, { id: 'w-21', x: 25, y: 20, kind: 'ruby' },
    { id: 'w-22', x: 12, y: 3, kind: 'sapphire' }, { id: 'w-23', x: 41, y: 28, kind: 'diamond' }, { id: 'w-24', x: 17, y: 12, kind: 'gold' },
  ],
  encounters: [
    { species: 'glorp', min: 2, max: 4, weight: 4 },
    { species: 'sporelet', min: 2, max: 5, weight: 3 },
    { species: 'flitterfin', min: 3, max: 5, weight: 3 },
    { species: 'crystabug', min: 3, max: 6, weight: 2 },
    { species: 'thornback', min: 4, max: 6, weight: 1 },
  ],
};

export const MAPS = { bloomhaven: BLOOMHAVEN, wilds: WILDS };
