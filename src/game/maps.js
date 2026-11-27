/* The areas on planet Kirra. Chapter 1: Bloomhaven, the Crimson Wilds, the Whisperwood (a jungle east of
   the Wilds) and the Jelly Jam (islands of purple alien plants floating below the Wilds' cliffs).
   Chapter 2, reached by the COMET's short hops: the Venom Mire, the Jade Lagoon and the Withered Deep
   (past the Whisperwood). A map's 'swaps' change its ground once a flag is set; 'need' is the opposite
   of 'flag' (only there once it's set); a prop's 'alt' is what it becomes after a flag.
   Ground letters are explained in src/art/tiles.js (TILE). Props, people, pick-ups and triggers are
   listed per map; a prop's x, y is the top-left tile of its solid footprint, and a prop or person
   with a flag disappears once that flag is set. */
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
    { id: 't-bg', art: 'turtle', pal: 'green', x: 4, y: 16, dir: 'right', talk: 'turtle', wander: true },
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
  m.line(26, 26, 26, 12, ':'); m.line(26, 12, 43, 12, ':');   // east, through the ridge, to the Whisperwood
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
    { t: 'sign', x: 37, y: 11, text: 'EAST: the WHISPERWOOD.\nThe old jungle, where the veil between worlds is thin.' },
    { t: 'sign', x: 29, y: 4, text: 'JELLY EXPRESS\nDown to the JELLY JAM, where the river falls into the sky!' },
    { t: 'thorns', x: 42, y: 12, id: 'thorns', talk: 'thorns', flag: 'thorns-cleared' },
  ],
  npcs: [
    { id: 'medic', art: 'bloom', pal: 'mint', x: 5, y: 9, dir: 'down', talk: 'medic' },
    { id: 'scout', art: 'bloom', pal: 'sky', x: 25, y: 9, dir: 'down', talk: 'scout', wander: true },
    { id: 'alpha', art: 'thornback', x: 13, y: 21, dir: 'left', big: true, talk: 'alpha', flag: 'alpha-beaten' },
    { id: 'rustclaw', art: 'rustclaw', x: 38, y: 25, dir: 'left', big: true, talk: 'rustclaw', flag: 'rustclaw-beaten' },
    { id: 'ferry', art: 'jelly', pal: 'gold', x: 27, y: 3, dir: 'down', talk: 'ferryDown', hover: true },
    { id: 'cody', art: 'cody', x: 14, y: 9, dir: 'down', talk: 'cody', flag: 'cody-wilds', sleep: true },
    { id: 't-wg', art: 'turtle', pal: 'green', x: 18, y: 17, dir: 'left', talk: 'turtle', wander: true },
    { id: 't-wy', art: 'turtle', pal: 'yellow', x: 31, y: 24, dir: 'down', talk: 'turtle', wander: true },
  ],
  warps: [
    { x: 0, y: 11, to: 'bloomhaven', tx: 28, ty: 11, dir: 'left' },
    { x: 43, y: 12, to: 'jungle', tx: 1, ty: 12, dir: 'right' },
  ],
  triggers: [
    { id: 'wilds-intro', x: 2, y: 11, w: 1, h: 1, script: 'wildsIntro' },
    { id: 'alpha-zone', x: 10, y: 18, w: 7, h: 2, script: 'alphaZone' },
    { id: 'thorns-cleared', x: 40, y: 11, w: 2, h: 3, script: 'thorns' },
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

/* only where the ground is already c0: a blob of c (ferns in a glade, sprouts on an island) */
function patch(m, cx, cy, rx, ry, c0, c, seed) {
  for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
    const dx = (x - cx) / rx, dy = (y - cy) / ry;
    if (m.get(x, y) === c0 && dx * dx + dy * dy <= 1 + (hash(x, y, seed) - 0.5) * 0.7) m.set(x, y, c);
  }
}

/* ---------- the Whisperwood: glades in a jungle of giant trees, a stream, and the Veil Gate ---------- */
function buildJungle() {
  const W = 40, H = 30, m = grid(W, H, 'T');
  m.blob(5.5, 12.5, 5, 4, 'j', 0.3, 70);       // the way in, from the Wilds
  m.blob(16, 14, 6.5, 5, 'j', 0.3, 71);        // the fern glade
  m.blob(32, 5.5, 6, 3.6, 'j', 0.25, 72);      // the ruins round the Veil Gate
  m.blob(13, 24.5, 7.5, 3.4, 'j', 0.3, 73);    // the south glade
  m.blob(32, 19, 5.5, 4.6, 'j', 0.3, 74);      // the east glade
  m.blob(32, 26.5, 4.5, 2.2, 'j', 0.3, 75);    // a hidden corner
  const trail = (x0, y0, x1, y1) => { m.line(x0, y0, x1, y1, 'j'); m.line(x0, y0 + 1, x1, y1 + 1, 'j'); };
  trail(0, 12, 11, 12); trail(19, 10, 29, 8); trail(21, 16, 28, 17); trail(14, 18, 14, 22); trail(18, 25, 29, 26); trail(32, 9, 32, 15);
  m.blob(32, 4.5, 4.5, 2.2, 'r', 0.2, 76);
  patch(m, 16, 14.5, 3.6, 2.6, 'j', 'f', 80); patch(m, 10, 25, 3.4, 1.6, 'j', 'f', 81); patch(m, 33.5, 20.5, 2.6, 2.4, 'j', 'f', 82);
  patch(m, 17, 25, 2, 1.2, 'j', 'f', 83); patch(m, 5, 10.5, 1.6, 1, 'j', 'f', 84);
  for (let y = 0; y < H; y++) for (const x of [24, 25]) m.set(x, y, hash(x, y, 90) < 0.2 ? 'a' : '~');
  for (const y of [9, 17, 26]) { m.set(22, y, 'j'); m.set(23, y, 'j'); m.set(24, y, '='); m.set(25, y, '='); m.set(26, y, 'j'); m.set(27, y, 'j'); }
  m.set(0, 12, 'j'); m.set(0, 13, 'T');
  trail(36, 19, 37, 19); m.line(37, 19, 39, 19, 'j');   // east, into the Withered Deep (Chapter 2)
  return m.rows();
}
const JUNGLE_ROWS = buildJungle();

export const JUNGLE = {
  id: 'jungle', name: 'The Whisperwood', music: 'pl:jungle',
  rows: JUNGLE_ROWS,
  props: [
    { t: 'veilgate', x: 30, y: 3, id: 'veilgate', talk: 'gate' },
    { t: 'pillar', x: 28, y: 5 }, { t: 'pillar', x: 36, y: 5 },
    { t: 'bigtree', x: 7, y: 14 }, { t: 'bigtree', x: 19, y: 11 }, { t: 'bigtree', x: 34, y: 17 }, { t: 'bigtree', x: 10, y: 27 },
    { t: 'glowflower', x: 2, y: 11 }, { t: 'glowflower', x: 11, y: 16 }, { t: 'glowflower', x: 22, y: 15 }, { t: 'glowflower', x: 27, y: 7 },
    { t: 'glowflower', x: 37, y: 7 }, { t: 'glowflower', x: 30, y: 19 }, { t: 'glowflower', x: 15, y: 27 },
    { t: 'crystal3', x: 5, y: 15 }, { t: 'crystal2', x: 36, y: 22 }, { t: 'crystal3', x: 12, y: 23 },
    { t: 'shroom', x: 16, y: 22 },
    { t: 'sign', x: 3, y: 14, text: 'THE WHISPERWOOD\nThe LIGHT KEEPER lives by the old gate, over the stream to the north-east.' },
    { t: 'deadvines', x: 38, y: 19, id: 'vines', talk: 'vines', flag: 'deep-healed' },
  ],
  npcs: [
    { id: 'lumen', art: 'lumen', x: 34, y: 4, dir: 'down', talk: 'lumen', hover: true },
    { id: 'cody', art: 'cody', x: 15, y: 24, dir: 'down', talk: 'cody', flag: 'cody-wood' },
    { id: 't-jg', art: 'turtle', pal: 'green', x: 9, y: 11, dir: 'right', talk: 'turtle', wander: true },
    { id: 't-jp', art: 'turtle', pal: 'purple', x: 33, y: 27, dir: 'left', talk: 'turtle', wander: true },
  ],
  warps: [{ x: 0, y: 12, to: 'wilds', tx: 42, ty: 12, dir: 'left' }, { x: 39, y: 19, to: 'deep', tx: 1, ty: 13, dir: 'right' }],
  triggers: [{ id: 'jungle-intro', x: 2, y: 11, w: 2, h: 3, script: 'jungleIntro' }],
  jewels: [
    { id: 'j-1', x: 3, y: 9, kind: 'gold' }, { id: 'j-2', x: 8, y: 15, kind: 'emerald' }, { id: 'j-3', x: 12, y: 10, kind: 'gold' },
    { id: 'j-4', x: 21, y: 13, kind: 'ruby' }, { id: 'j-5', x: 29, y: 4, kind: 'sapphire' }, { id: 'j-6', x: 37, y: 6, kind: 'gold' },
    { id: 'j-7', x: 30, y: 8, kind: 'emerald' }, { id: 'j-8', x: 36, y: 16, kind: 'gold' }, { id: 'j-9', x: 28, y: 21, kind: 'ruby' },
    { id: 'j-10', x: 37, y: 19, kind: 'emerald' }, { id: 'j-11', x: 8, y: 23, kind: 'gold' }, { id: 'j-12', x: 19, y: 25, kind: 'sapphire' },
    { id: 'j-13', x: 35, y: 27, kind: 'gold' }, { id: 'j-14', x: 31, y: 28, kind: 'diamond' },
  ],
  encounters: [
    { species: 'lumoth', min: 4, max: 6, weight: 4 },
    { species: 'jadehop', min: 4, max: 7, weight: 3 },
    { species: 'vinesnap', min: 5, max: 7, weight: 3 },
    { species: 'mosshell', min: 5, max: 8, weight: 2 },
    { species: 'ghoul', min: 6, max: 8, weight: 1 },
  ],
};

/* ---------- the Jelly Jam: islands of purple alien plants floating in the sky (the map id stays 'groove') ---------- */
function buildGroove() {
  const W = 36, H = 28, m = grid(W, H, 'Y');
  m.blob(5.5, 14, 4.2, 3.6, 'q', 0.25, 60);     // where the jelly ferry drops you
  m.blob(18, 13.5, 6.8, 5.2, 'q', 0.2, 61);     // jelly town, round DJ JIGGLE's boombox
  m.blob(18.5, 4, 5.5, 2.6, 'q', 0.25, 62);     // the lantern-tree wood
  m.blob(16, 23.5, 5.5, 2.6, 'q', 0.25, 63);    // the south island
  m.blob(30, 13, 3.8, 3.4, 'q', 0.25, 64);      // a little island to the east
  for (let x = 9; x <= 12; x++) m.set(x, 14, 'c');
  for (let y = 7; y <= 8; y++) m.set(18, y, 'c');
  for (let y = 19; y <= 21; y++) m.set(17, y, 'c');
  for (let x = 25; x <= 26; x++) m.set(x, 13, 'c');
  patch(m, 18.5, 3.5, 3.2, 1.3, 'q', 'u', 65); patch(m, 15, 23.5, 3, 1.3, 'q', 'u', 66); patch(m, 31, 14, 1.8, 1.4, 'q', 'u', 67);
  return m.rows();
}
const GROOVE_ROWS = buildGroove();

export const GROOVE = {
  id: 'groove', name: 'The Jelly Jam', music: 'pl:groove',
  boombox: true,                                   // the boombox in the corner of the screen pumps to the beat
  dancefloor: { x: 14, y: 13, w: 8, h: 3 },        // squares that light up on the beat
  rows: GROOVE_ROWS,
  props: [
    { t: 'boombox', x: 17, y: 11, id: 'boombox', text: "DJ JIGGLE's boombox. The bass makes your teeth buzz!" },
    { t: 'speaker', x: 15, y: 11 }, { t: 'speaker', x: 21, y: 11 },
    { t: 'lanterntree', x: 14, y: 4 }, { t: 'orbplant2', x: 22, y: 4 }, { t: 'spiralfern', x: 23, y: 4 }, { t: 'gshroom2', x: 19, y: 2 },
    { t: 'orbplant', x: 12, y: 15 }, { t: 'tendril', x: 13, y: 15 }, { t: 'lanterntree', x: 22, y: 16 },
    { t: 'spiralfern', x: 3, y: 12 }, { t: 'orbplant2', x: 4, y: 12 },
    { t: 'gshroom', x: 19, y: 23 }, { t: 'orbplant3', x: 31, y: 11 }, { t: 'tendril', x: 32, y: 11 },
    { t: 'bulbs', x: 6, y: 16 }, { t: 'bulbs', x: 24, y: 12 }, { t: 'tendril', x: 13, y: 22 }, { t: 'bulbs', x: 33, y: 13 }, { t: 'minishroom', x: 21, y: 6 },
    { t: 'crystal2', x: 8, y: 12 }, { t: 'crystal2', x: 28, y: 15 },
    { t: 'sign', x: 5, y: 12, text: 'THE JELLY JAM\nFeel the beat! JELLY TOWN is east, over the leaf bridge.' },
  ],
  npcs: [
    { id: 'ferryUp', art: 'jelly', pal: 'gold', x: 0, y: 14, dir: 'down', talk: 'ferryUp', hover: true },
    { id: 'dj', art: 'jelly', pal: 'violet', dj: true, x: 20, y: 12, dir: 'down', talk: 'dj', hover: true },
    { id: 'bloop', art: 'jelly', pal: 'pink', x: 14, y: 16, dir: 'down', talk: 'j1', hover: true, wander: true },
    { id: 'wobble', art: 'jelly', pal: 'cyan', x: 22, y: 14, dir: 'down', talk: 'j2', hover: true, wander: true },
    { id: 'squish', art: 'jelly', pal: 'mint', x: 12, y: 12, dir: 'down', talk: 'j3', hover: true, wander: true },
    { id: 'plink', art: 'jelly', pal: 'gold', x: 19, y: 17, dir: 'down', talk: 'j4', hover: true, wander: true },
    { id: 'gloop', art: 'jelly', pal: 'cyan', x: 19, y: 5, dir: 'down', talk: 'j5', hover: true },
    { id: 'hum', art: 'jelly', pal: 'pink', x: 28, y: 12, dir: 'down', talk: 'j6', hover: true },
    { id: 'cody', art: 'cody', x: 16, y: 16, dir: 'down', talk: 'cody', flag: 'cody-jam' },
    { id: 't-gp', art: 'turtle', pal: 'purple', x: 15, y: 24, dir: 'right', talk: 'turtle', wander: true },
  ],
  warps: [],
  triggers: [],
  jewels: [
    { id: 'g-1', x: 2, y: 15, kind: 'gold' }, { id: 'g-2', x: 7, y: 16, kind: 'sapphire' }, { id: 'g-3', x: 16, y: 3, kind: 'gold' },
    { id: 'g-4', x: 23, y: 3, kind: 'ruby' }, { id: 'g-5', x: 13, y: 10, kind: 'gold' }, { id: 'g-6', x: 21, y: 18, kind: 'emerald' },
    { id: 'g-7', x: 14, y: 25, kind: 'gold' }, { id: 'g-8', x: 21, y: 24, kind: 'sapphire' }, { id: 'g-9', x: 32, y: 15, kind: 'diamond' },
    { id: 'g-10', x: 34, y: 12, kind: 'ruby' },
  ],
  encounters: [
    { species: 'bopjelly', min: 3, max: 6, weight: 4 },
    { species: 'shroomboom', min: 4, max: 7, weight: 3 },
  ],
};

/* ================= Chapter 2: the COMET's short hops across Kirra ================= */

/* ---------- the Venom Mire: a swamp of dead trees and thick yellow-green ooze. The WARP COIL is across the
   widest river, where the old plank bridge has fallen in (Cody's staff fills the gap) ---------- */
function buildMire() {
  const W = 40, H = 30, m = grid(W, H, 'D');
  m.blob(6, 14.5, 5, 4.6, 'm', 0.25, 110);     // the landing, where the COMET touches down
  m.blob(18, 8.5, 6.5, 4.6, 'm', 0.3, 111);    // the north glade
  m.blob(17, 21, 7.5, 4.4, 'm', 0.3, 112);     // the south glade
  m.blob(22, 15, 3.6, 2.6, 'm', 0.2, 113);     // the old landing stage by the big river
  m.blob(35.5, 15, 3.6, 6.5, 'm', 0.25, 114);  // the far bank
  const path = (x0, y0, x1, y1) => { m.line(x0, y0, x1, y1, 'm'); m.line(x0, y0 + 1, x1, y1 + 1, 'm'); };
  path(9, 14, 16, 12); path(16, 12, 18, 18); path(18, 14, 26, 14); path(6, 18, 12, 21);
  // a narrow ooze stream down the west, with a little plank bridge
  for (let y = 0; y < H; y++) for (const x of [11, 12]) m.set(x + (y > 20 ? 1 : 0), y, 'z');
  m.set(11, 14, 'k'); m.set(12, 14, 'k'); m.set(11, 15, 'k'); m.set(12, 15, 'k');
  m.set(13, 21, 'k'); m.set(12, 21, 'k');
  // the big river of ooze, five wide, and the narrow bridge across it, broken in the middle
  for (let y = 0; y < H; y++) for (let x = 27; x <= 31; x++) m.set(x, y, 'z');
  m.set(27, 15, 'k'); m.set(28, 15, 'k'); m.set(31, 15, 'k');                              // (29, 15) and (30, 15): the gap
  m.set(26, 15, 'm'); m.set(26, 14, 'm'); m.set(32, 15, 'm');
  // ooze pools in the glades
  m.blob(20, 6.5, 1.8, 1.1, 'z', 0.2, 115); m.blob(13.5, 23, 1.6, 1, 'z', 0.2, 116);
  // reeds, where the snakes hide
  patch(m, 18, 8.5, 3.4, 2, 'm', 'v', 120); patch(m, 18, 22, 4, 1.8, 'm', 'v', 121); patch(m, 4, 17, 1.8, 1.2, 'm', 'v', 122);
  patch(m, 36, 12, 1.6, 2, 'm', 'v', 123);
  return m.rows();
}
const MIRE_ROWS = buildMire();

export const MIRE = {
  id: 'mire', name: 'The Venom Mire', music: 'mire',
  rows: MIRE_ROWS,
  swaps: [{ flag: 'staff-bridge', tiles: [[29, 15, 'K'], [30, 15, 'K']] }],   // Cody's staff, across the gap
  props: [
    { t: 'ship', x: 3, y: 11, id: 'comet', talk: 'ship' },
    { t: 'sign', x: 8, y: 16, text: 'THE VENOM MIRE\nMind the ooze. Mind the snakes. Mind your step on the old bridge (east).' },
    { t: 'sign', x: 24, y: 14, text: 'DANGER! BRIDGE OUT!\nSomething big lives in the ooze. Something with FANGS.' },
    { t: 'deadtree', x: 14, y: 6 }, { t: 'deadtree', x: 19, y: 18 }, { t: 'deadtree', x: 2, y: 13 }, { t: 'deadtree', x: 36, y: 10 },
    { t: 'stump', x: 9, y: 11 }, { t: 'stump', x: 23, y: 9 }, { t: 'stump', x: 34, y: 20 },
    { t: 'log', x: 15, y: 18 }, { t: 'log', x: 20, y: 23 },
    { t: 'minishroom', x: 9, y: 16 }, { t: 'minishroom', x: 22, y: 5 }, { t: 'minishroom', x: 37, y: 17 },
  ],
  npcs: [
    { id: 'oozefang', art: 'oozefang', x: 34, y: 15, dir: 'left', big: true, talk: 'oozefangTalk', flag: 'oozefang-beaten' },
    { id: 't-mg', art: 'turtle', pal: 'green', x: 7, y: 19, dir: 'right', talk: 'turtle', wander: true },
    { id: 't-mp', art: 'turtle', pal: 'purple', x: 21, y: 21, dir: 'left', talk: 'turtle', wander: true },
    { id: 't-my', art: 'turtle', pal: 'yellow', x: 37, y: 18, dir: 'down', talk: 'turtle', wander: true },
  ],
  warps: [],
  triggers: [
    { id: 'mire-intro', x: 3, y: 13, w: 5, h: 3, script: 'mireIntro' },
    { id: 'staff-bridge', x: 26, y: 14, w: 2, h: 2, script: 'mireGap' },
    { id: 'snake-1', x: 28, y: 15, w: 1, h: 1, script: 'snake1' },
    { id: 'snake-2', x: 30, y: 15, w: 1, h: 1, script: 'snake2' },
    { id: 'oozefang-beaten', x: 31, y: 15, w: 2, h: 1, script: 'oozefang' },
  ],
  jewels: [
    { id: 'm-1', x: 4, y: 16, kind: 'gold' }, { id: 'm-2', x: 8, y: 17, kind: 'emerald' }, { id: 'm-3', x: 15, y: 8, kind: 'gold' },
    { id: 'm-4', x: 21, y: 10, kind: 'ruby' }, { id: 'm-5', x: 24, y: 8, kind: 'gold' }, { id: 'm-6', x: 14, y: 20, kind: 'sapphire' },
    { id: 'm-7', x: 23, y: 22, kind: 'gold' }, { id: 'm-8', x: 16, y: 25, kind: 'emerald' }, { id: 'm-9', x: 23, y: 16, kind: 'diamond' },
    { id: 'm-10', x: 36, y: 13, kind: 'ruby' }, { id: 'm-11', x: 34, y: 18, kind: 'gold' }, { id: 'm-12', x: 37, y: 21, kind: 'diamond' },
  ],
  encounters: [
    { species: 'hissling', min: 8, max: 10, weight: 4 },
    { species: 'spitviper', min: 9, max: 11, weight: 3 },
    { species: 'glorp', min: 8, max: 10, weight: 2 },
    { species: 'jadehop', min: 8, max: 10, weight: 1 },
  ],
};

/* ---------- the Jade Lagoon: a beach, clear water, and the Dragon King's palace on its island ---------- */
function buildLagoon() {
  const W = 36, H = 28, m = grid(W, H, 'l');
  m.blob(7, 21.5, 7.5, 5, 's', 0.25, 130);                                                  // the beach
  m.blob(25.5, 9.5, 11, 9, 's', 0.12, 131);                                                 // the palace island
  m.rect(19, 2, 14, 12, 'W'); m.rect(20, 3, 12, 10, 'J');                                  // the palace walls and courtyard
  m.set(25, 13, 'J');                                                                       // the gate
  for (let x = 13; x <= 21; x++) m.set(x, 20, 'h');                                        // the red bridge from the beach...
  for (let y = 18; y <= 19; y++) m.set(21, y, 'h');                                        // ...turning up to the island
  m.blob(5, 12.5, 1.6, 1.2, 's', 0.1, 132);                                                 // a tiny islet, over stepping stones
  m.set(4, 14, 'O'); m.set(4, 15, 'O'); m.set(4, 16, 'O');
  return m.rows();
}
const LAGOON_ROWS = buildLagoon();

export const LAGOON = {
  id: 'lagoon', name: 'The Jade Lagoon', music: 'lagoon',
  rows: LAGOON_ROWS,
  props: [
    { t: 'ship', x: 2, y: 19, id: 'comet', talk: 'ship' },
    { t: 'sign', x: 10, y: 19, text: "THE JADE LAGOON\nPalace of the DRAGON KING. Visitors: bow. Cats: GO AWAY." },
    { t: 'palm', x: 1, y: 23 }, { t: 'palm', x: 12, y: 23 }, { t: 'palm', x: 8, y: 17 }, { t: 'palm', x: 17, y: 12 }, { t: 'palm', x: 34, y: 11 },
    { t: 'coral', x: 4, y: 24 }, { t: 'coral', x: 10, y: 25 }, { t: 'coral', x: 32, y: 16 }, { t: 'coral', x: 6, y: 12 },
    { t: 'palacegate', x: 24, y: 11, px: 0, py: 8 },
    { t: 'throne', x: 24, y: 4 },
    { t: 'gong', x: 21, y: 5, id: 'gong', talk: 'gong' },
    { t: 'treasure', x: 29, y: 5, id: 'treasure', talk: 'treasure', alt: { flag: 'king-beaten', t: 'treasure2' } },
    { t: 'jadepillar', x: 20, y: 9 }, { t: 'jadepillar', x: 31, y: 9 }, { t: 'jadepillar', x: 20, y: 12 }, { t: 'jadepillar', x: 31, y: 12 },
    { t: 'stonelantern', x: 23, y: 11 }, { t: 'stonelantern', x: 27, y: 11 },
  ],
  npcs: [
    { id: 'king', art: 'dragonKing', x: 24, y: 7, dir: 'down', big: true, talk: 'king' },
    { id: 'crab1', art: 'crab', pal: 'red', x: 24, y: 15, dir: 'down', talk: 'crab' },
    { id: 'crab2', art: 'crab', pal: 'coral', x: 26, y: 15, dir: 'down', talk: 'crab2' },
    { id: 'cody', art: 'cody', x: 22, y: 8, dir: 'right', talk: 'cody', flag: 'cody-lagoon-gone', need: 'mire-done' },
    { id: 'white', art: 'whiteDragon', x: 28, y: 8, dir: 'left', big: true, talk: 'white', need: 'gong', flag: 'deep-healed' },
    { id: 't-lg', art: 'turtle', pal: 'green', x: 6, y: 22, dir: 'right', talk: 'turtle', wander: true },
    { id: 't-ly', art: 'turtle', pal: 'yellow', x: 29, y: 16, dir: 'left', talk: 'turtle', wander: true },
  ],
  warps: [],
  triggers: [
    { id: 'lagoon-intro', x: 3, y: 21, w: 4, h: 2, script: 'lagoonIntro' },
    { id: 'palace-scene', x: 24, y: 11, w: 3, h: 2, script: 'palace' },
  ],
  jewels: [
    { id: 'l-1', x: 3, y: 22, kind: 'gold' }, { id: 'l-2', x: 9, y: 24, kind: 'sapphire' }, { id: 'l-3', x: 13, y: 21, kind: 'gold' },
    { id: 'l-4', x: 22, y: 16, kind: 'emerald' }, { id: 'l-5', x: 34, y: 14, kind: 'gold' }, { id: 'l-6', x: 17, y: 9, kind: 'ruby' },
    { id: 'l-7', x: 21, y: 11, kind: 'gold' }, { id: 'l-8', x: 30, y: 11, kind: 'diamond' }, { id: 'l-9', x: 5, y: 12, kind: 'diamond' },
  ],
};

/* ---------- the Withered Deep: the jungle beyond the Whisperwood, drained grey by the Black Dragon.
   When he's beaten, its colour floods back (the grey ground swaps for the living Whisperwood's) ---------- */
function buildDeep() {
  const W = 36, H = 26, m = grid(W, H, 'G');
  m.blob(5, 13, 4.5, 3.6, 'g', 0.3, 140);       // the way in, from the Whisperwood
  m.blob(14.5, 11.5, 6, 4.6, 'g', 0.3, 141);    // the grey glade
  m.blob(16, 21, 6.5, 3, 'g', 0.3, 142);        // the south hollow
  m.blob(30, 12.5, 5.2, 6.2, 'g', 0.25, 143);   // the lair, round the great dead tree
  const trail = (x0, y0, x1, y1) => { m.line(x0, y0, x1, y1, 'g'); m.line(x0, y0 + 1, x1, y1 + 1, 'g'); };
  trail(0, 13, 9, 13); trail(19, 12, 25, 12); trail(15, 15, 15, 19);
  for (let y = 0; y < H; y++) for (const x of [22, 23]) m.set(x, y, 'M');               // a stream, grey and still
  m.set(22, 12, 'Q'); m.set(23, 12, 'Q'); m.set(22, 13, 'Q'); m.set(23, 13, 'Q');
  patch(m, 14, 11, 3.6, 2.4, 'g', 'F', 150); patch(m, 16, 21.5, 3.6, 1.4, 'g', 'F', 151); patch(m, 33, 17, 1.6, 1.4, 'g', 'F', 152);
  return m.rows();
}
const DEEP_ROWS = buildDeep();

export const DEEP = {
  id: 'deep', name: 'The Withered Deep', music: 'deep',
  rows: DEEP_ROWS,
  swaps: [{ flag: 'deep-healed', letters: { g: 'j', G: 'T', F: 'f', M: '~', Q: '=' } }],
  healed: { flag: 'deep-healed', name: 'The Deep', music: 'pl:jungle', encounters: [
    { species: 'lumoth', min: 11, max: 13, weight: 3 }, { species: 'jadehop', min: 11, max: 13, weight: 3 },
    { species: 'vinesnap', min: 12, max: 14, weight: 2 }, { species: 'mosshell', min: 12, max: 14, weight: 2 },
  ] },
  props: [
    { t: 'deadvines', x: 1, y: 13, id: 'vines', talk: 'vines', flag: 'deep-healed' },
    { t: 'lairtree', x: 28, y: 8, alt: { flag: 'deep-healed', t: 'lairtree2' } },
    { t: 'greytree', x: 3, y: 10, alt: { flag: 'deep-healed', t: 'bigtree' } }, { t: 'greytree', x: 15, y: 8, alt: { flag: 'deep-healed', t: 'bigtree' } },
    { t: 'greytree', x: 12, y: 22, alt: { flag: 'deep-healed', t: 'bigtree' } }, { t: 'greytree', x: 33, y: 14, alt: { flag: 'deep-healed', t: 'bigtree' } },
    { t: 'greyflower', x: 7, y: 15, alt: { flag: 'deep-healed', t: 'glowflower' } }, { t: 'greyflower', x: 11, y: 9, alt: { flag: 'deep-healed', t: 'glowflower' } },
    { t: 'greyflower', x: 20, y: 20, alt: { flag: 'deep-healed', t: 'glowflower' } }, { t: 'greyflower', x: 26, y: 15, alt: { flag: 'deep-healed', t: 'glowflower' } },
    { t: 'greyflower', x: 34, y: 9, alt: { flag: 'deep-healed', t: 'glowflower' } },
  ],
  npcs: [
    { id: 'black', art: 'blackDragon', x: 29, y: 11, dir: 'down', big: true, talk: 'blackTalk', alt: { flag: 'black-beaten', art: 'blackDragonCalm' } },
    { id: 'whiteDeep', art: 'whiteDragon', x: 6, y: 11, dir: 'right', big: true, flip: true, talk: 'whiteDeep' },
    { id: 't-dg', art: 'turtle', pal: 'green', x: 14, y: 19, dir: 'right', talk: 'turtle', wander: true, need: 'deep-healed' },
  ],
  warps: [{ x: 0, y: 13, to: 'jungle', tx: 38, ty: 19, dir: 'left' }],
  triggers: [
    { id: 'deep-intro', x: 3, y: 12, w: 4, h: 3, script: 'deepIntro' },
    { id: 'black-beaten', x: 27, y: 13, w: 6, h: 2, script: 'blackScene' },
  ],
  jewels: [
    { id: 'd-1', x: 8, y: 11, kind: 'gold' }, { id: 'd-2', x: 12, y: 14, kind: 'emerald' }, { id: 'd-3', x: 18, y: 10, kind: 'gold' },
    { id: 'd-4', x: 20, y: 22, kind: 'sapphire' }, { id: 'd-5', x: 13, y: 20, kind: 'gold' }, { id: 'd-6', x: 26, y: 10, kind: 'ruby' },
    { id: 'd-7', x: 33, y: 16, kind: 'diamond' }, { id: 'd-8', x: 31, y: 17, kind: 'gold' },
  ],
  encounters: [
    { species: 'witherwisp', min: 11, max: 13, weight: 4 },
    { species: 'ghoul', min: 11, max: 13, weight: 2 },
    { species: 'vinesnap', min: 11, max: 13, weight: 2 },
    { species: 'lumoth', min: 11, max: 12, weight: 1 },
  ],
};

export const MAPS = { bloomhaven: BLOOMHAVEN, wilds: WILDS, jungle: JUNGLE, groove: GROOVE, mire: MIRE, lagoon: LAGOON, deep: DEEP };
