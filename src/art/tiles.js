/* The world's tiles and props. The ground is painted by code, pixel by pixel, from seeded noise, so
   every tile is a little different but the same on every visit. Each map is painted once into four
   animation frames (rippling water, swaying glowgrass, twinkling stars), then the camera just copies
   from those. Props (towers, domes, the crashed ship...) are drawn into their own canvases. */
import { makeCanvas, hash, painter, spr, shade } from '../engine/pixel.js';
import { INK } from './chars.js';

export const P = {
  ink: INK, white: '#f8f4ff', gold: '#ffd23a', gold2: '#c88a1a', cyan: '#5ff2ff', amber: '#ffb43a',
  soil: '#b4443c', soil2: '#9c3434', soil3: '#cf5e48', soil4: '#7a2430', pebble: '#e8866a',
  vg1: '#2e1658', vg2: '#5a2ca4', vg3: '#8a50e4', vg4: '#c49cff', vtip: '#8ff0ff',
  lawn: '#2a9a80', lawn2: '#1f7d6a', lawn3: '#45b894', lawn4: '#8ae0b8',
  st1: '#5a5280', st2: '#8a82ae', st3: '#a8a0cc', st4: '#4e4870', st5: '#d4ceee',
  path: '#e3a46e', path2: '#c8844e', path3: '#f4c08c',
  w1: '#07563c', w2: '#0f8a5c', w3: '#26bc7c', w4: '#62f0aa', w5: '#dcfff0',
  r1: '#3a1430', r2: '#552042', r3: '#743058', r4: '#9a4a72', r5: '#24081c',
  s1: '#140832', s2: '#24104e', s3: '#3c1f7a', s4: '#6a40c0', s5: '#b48cff',
  h1: '#123c40', h2: '#1b5e56', h3: '#2a846c', h4: '#58c498',
  sand: '#e8c08a', sand2: '#cf9e66',
};

/* which ground each map letter is, and how it behaves */
export const TILE = {
  '.': { name: 'soil' },
  ',': { name: 'lawn' },
  '_': { name: 'plaza' },
  ':': { name: 'path' },
  '"': { name: 'glow', encounter: true },
  '~': { name: 'water', solid: true, water: true },
  'a': { name: 'algae', solid: true, water: true },
  '=': { name: 'bridgeH', bridge: true },
  '|': { name: 'bridgeV', bridge: true },
  'o': { name: 'stone', bridge: true },
  '#': { name: 'hedge', solid: true },
  '^': { name: 'cliff', solid: true },
  ' ': { name: 'void', solid: true, void: true },
  'w': { name: 'fall', solid: true, void: true, water: true },
  '*': { name: 'flowers' },
  '+': { name: 'blooms' },
  'x': { name: 'scorch' },
  's': { name: 'sand' },
  'n': { name: 'nest' },
  // the Whisperwood
  'j': { name: 'jungle' },
  'T': { name: 'canopy', solid: true },
  'f': { name: 'fern', encounter: true },
  'r': { name: 'ruin' },
  // the Shroom Groove
  'q': { name: 'moss' },
  'u': { name: 'shrooms', encounter: true },
  'c': { name: 'capbridge', bridge: true },
  'Y': { name: 'sky2', solid: true, void: true },
};

const LAND_BASE = { soil: P.soil, lawn: P.lawn, plaza: P.st2, path: P.path, glow: P.soil, flowers: P.lawn, blooms: P.soil, scorch: P.lawn, sand: P.sand, nest: '#5a2a34', jungle: '#25603f', fern: '#1b4a30', ruin: '#6e6a90', moss: '#4a1f7a', shrooms: '#3a1660' };

function dot(g, x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); }
function box(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }

/* ---------- ground painters: (g, px, py, frame, n(dx, dy) -> letter, X, Y) ---------- */
function soil(g, x, y, f, n, X, Y, base = P.soil) {
  box(g, x, y, 16, 16, base);
  for (let i = 0; i < 9; i++) {
    const r = hash(X, Y, i);
    const sx = x + Math.floor(hash(X, Y, i + 20) * 16), sy = y + Math.floor(hash(X, Y, i + 40) * 16);
    dot(g, sx, sy, r < 0.5 ? P.soil2 : P.soil3);
  }
  if (hash(X, Y, 99) < 0.35) {   // a pebble
    const sx = x + 2 + Math.floor(hash(X, Y, 98) * 11), sy = y + 2 + Math.floor(hash(X, Y, 97) * 11);
    box(g, sx, sy, 2, 1, P.pebble); dot(g, sx, sy + 1, P.soil4); dot(g, sx + 1, sy + 1, P.soil4);
  }
  if (hash(X, Y, 77) < 0.15) {   // a crack
    const sx = x + 3 + Math.floor(hash(X, Y, 76) * 9), sy = y + 3 + Math.floor(hash(X, Y, 75) * 9);
    dot(g, sx, sy, P.soil4); dot(g, sx + 1, sy + 1, P.soil4); dot(g, sx + 2, sy + 1, P.soil4); dot(g, sx + 3, sy + 2, P.soil4);
  }
}
function lawn(g, x, y, f, n, X, Y) {
  box(g, x, y, 16, 16, P.lawn);
  for (let i = 0; i < 7; i++) {
    const sx = x + Math.floor(hash(X, Y, i + 3) * 15), sy = y + 1 + Math.floor(hash(X, Y, i + 33) * 14);
    dot(g, sx, sy, P.lawn3); dot(g, sx + 1, sy - 1, P.lawn4); dot(g, sx + 2, sy, P.lawn3);
  }
  for (let i = 0; i < 6; i++) dot(g, x + Math.floor(hash(X, Y, i + 60) * 16), y + Math.floor(hash(X, Y, i + 70) * 16), P.lawn2);
}
function plaza(g, x, y, f, n, X, Y) {
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
    const sx = x + i * 8, sy = y + j * 8;
    const v = hash(X * 2 + i, Y * 2 + j, 5);
    box(g, sx, sy, 8, 8, v < 0.15 ? P.st3 : P.st2);
    box(g, sx, sy, 8, 1, P.st5); box(g, sx, sy, 1, 8, P.st3);
    box(g, sx, sy + 7, 8, 1, P.st4); box(g, sx + 7, sy, 1, 8, P.st4);
    if (v > 0.9) {   // a glowing circuit line in the stone
      const c = Math.floor(f / 2) % 2 ? P.cyan : '#3fb8d0';
      box(g, sx + 2, sy + 3, 4, 1, c); dot(g, sx + 5, sy + 4, c); dot(g, sx + 2, sy + 2, c);
    }
  }
}
function path(g, x, y, f, n, X, Y) {
  box(g, x, y, 16, 16, P.path);
  for (let i = 0; i < 8; i++) {
    dot(g, x + Math.floor(hash(X, Y, i + 8) * 16), y + Math.floor(hash(X, Y, i + 18) * 16), hash(X, Y, i) < 0.5 ? P.path2 : P.path3);
  }
  const isPath = (c) => c === ':' || c === '=' || c === '|';
  const edge = (dx, dy) => !isPath(n(dx, dy));
  const nb = (dx, dy) => LAND_BASE[(TILE[n(dx, dy)] || {}).name] || null;
  if (edge(0, -1)) { box(g, x, y, 16, 1, nb(0, -1) || P.path2); for (let i = 0; i < 16; i += 3) dot(g, x + i + (Y % 2), y + 1, nb(0, -1) || P.path2); }
  if (edge(0, 1)) { box(g, x, y + 15, 16, 1, P.path2); for (let i = 1; i < 16; i += 3) dot(g, x + i, y + 14, nb(0, 1) || P.path2); }
  if (edge(-1, 0)) { box(g, x, y, 1, 16, nb(-1, 0) || P.path2); for (let i = 0; i < 16; i += 3) dot(g, x + 1, y + i, nb(-1, 0) || P.path2); }
  if (edge(1, 0)) { box(g, x + 15, y, 1, 16, nb(1, 0) || P.path2); for (let i = 2; i < 16; i += 3) dot(g, x + 14, y + i, nb(1, 0) || P.path2); }
}
function water(g, x, y, f, n, X, Y, algae = false) {
  const wet = (c) => c && ((TILE[c] || {}).water || (TILE[c] || {}).bridge);
  const inner = wet(n(0, -1)) && wet(n(0, 1)) && wet(n(-1, 0)) && wet(n(1, 0));
  box(g, x, y, 16, 16, inner ? '#0c7c53' : P.w2);
  // waves drifting downstream (the frame moves them), each with a bright crest
  for (const [r, k] of [[2, 0], [7, 1], [12, 2]]) {
    const wx = (X * 7 + r * 3 + f * 2 + k * 5) % 16;
    for (let i = 0; i < 5; i++) dot(g, x + ((wx + i) % 16), y + r + (i === 0 || i === 4 ? 1 : 0), P.w3);
    dot(g, x + ((wx + 2) % 16), y + r - 1, P.w4);
  }
  if ((Math.floor(hash(X, Y, 50) * 4) + f) % 4 === 0) { const sx = x + 3 + (X * 5) % 10, sy = y + 4 + (Y * 7) % 8; dot(g, sx, sy, P.w5); dot(g, sx + 1, sy, P.w4); }
  if (algae) {
    for (let i = 0; i < 3; i++) {
      const ax = x + 2 + Math.floor(hash(X, Y, i + 120) * 11), ay = y + 3 + Math.floor(hash(X, Y, i + 130) * 10);
      const lit = (f + i) % 4 < 2;
      box(g, ax, ay, 2, 2, lit ? P.w4 : P.w3); dot(g, ax + 2, ay + 1, '#1a9a62'); dot(g, ax - 1, ay, '#1a9a62');
      if (lit) dot(g, ax, ay, P.w5);
    }
    // a little glowing jelly drifting through
    if (hash(X, Y, 140) < 0.5) {
      const jx = x + 4 + ((f * 2 + Math.floor(hash(X, Y, 141) * 8)) % 8), jy = y + 6 + (f % 2);
      box(g, jx, jy, 3, 2, '#c8a8ff'); dot(g, jx + 1, jy - 1, '#ece0ff'); dot(g, jx, jy + 2, '#a080ff'); dot(g, jx + 2, jy + 2, '#a080ff');
    }
  }
  // banks: a shadow under land to the north, glowing shallows against land elsewhere
  if (!wet(n(0, -1))) { box(g, x, y, 16, 3, P.w1); box(g, x, y, 16, 1, P.r2); }
  if (!wet(n(0, 1))) { box(g, x, y + 14, 16, 2, P.w3); box(g, x, y + 15, 16, 1, P.w4); }
  if (!wet(n(-1, 0))) { box(g, x, y, 2, 16, P.w3); box(g, x, y, 1, 16, P.w4); }
  if (!wet(n(1, 0))) { box(g, x + 14, y, 2, 16, P.w3); box(g, x + 15, y, 1, 16, P.w4); }
}
function glow(g, x, y, f, n, X, Y) {
  soil(g, x, y, f, n, X, Y, P.soil2);
  // tall violet glowgrass: clumps of blades, tips swaying
  for (let i = 0; i < 7; i++) {
    const bx = x + 1 + ((i * 5 + Math.floor(hash(X, Y, i) * 3)) % 14), by = y + 4 + ((i * 7) % 11);
    const sway = ((f + i) % 4 === 1 ? 1 : (f + i) % 4 === 3 ? -1 : 0);
    box(g, bx - 1, by + 1, 4, 1, P.vg1);
    for (let b = 0; b < 3; b++) {
      const hgt = 4 + ((i + b) % 3);
      const cx = bx + b - 1;
      box(g, cx, by - hgt + 2, 1, hgt, b === 1 ? P.vg3 : P.vg2);
      dot(g, cx + (b === 1 ? sway : 0), by - hgt + 1, b === 1 ? P.vg4 : P.vg3);
    }
    if ((i + f) % 5 === 0) dot(g, bx + sway, by - 6, P.vtip);
  }
}
function flowers(g, x, y, f, n, X, Y, onSoil = false) {
  if (onSoil) soil(g, x, y, f, n, X, Y); else lawn(g, x, y, f, n, X, Y);
  const cols = onSoil ? ['#ffd23a', '#8ff0ff', '#ff9a5a'] : ['#ffb43a', '#f8f4ff', '#8ff0ff', '#ffd23a'];
  for (let i = 0; i < 3; i++) {
    const fx = x + 2 + Math.floor(hash(X, Y, i + 200) * 11), fy = y + 3 + Math.floor(hash(X, Y, i + 210) * 10);
    const c = cols[Math.floor(hash(X, Y, i + 220) * cols.length)];
    const s = (f + i) % 4 === 2 ? 1 : 0;
    dot(g, fx + 1, fy + 3, onSoil ? P.vg3 : P.lawn2); dot(g, fx + 1, fy + 2, onSoil ? P.vg3 : P.lawn2);
    dot(g, fx + s, fy, c); dot(g, fx + 2 + s, fy, c); dot(g, fx + 1 + s, fy - 1, c); dot(g, fx + 1 + s, fy + 1, c);
    dot(g, fx + 1 + s, fy, onSoil ? '#ffffff' : P.gold);
  }
}
function hedge(g, x, y, f, n, X, Y) {
  box(g, x, y, 16, 16, P.h2);
  for (let i = 0; i < 10; i++) {
    const lx = x + Math.floor(hash(X, Y, i + 300) * 14), ly = y + Math.floor(hash(X, Y, i + 310) * 13);
    box(g, lx, ly, 2, 2, P.h3); dot(g, lx, ly, P.h4);
  }
  for (let i = 0; i < 5; i++) dot(g, x + Math.floor(hash(X, Y, i + 320) * 16), y + Math.floor(hash(X, Y, i + 330) * 16), P.h1);
  if (hash(X, Y, 340) < 0.3) { const bx = x + 4 + (X * 3) % 8, by = y + 3 + (Y * 5) % 6; dot(g, bx, by, '#ffb43a'); dot(g, bx + 1, by + 1, '#ffd23a'); }
  if (n(0, -1) !== '#') box(g, x, y, 16, 1, P.h4);
  if (n(0, 1) !== '#') { box(g, x, y + 12, 16, 4, P.h1); box(g, x, y + 12, 16, 1, P.h2); for (let i = 1; i < 16; i += 4) dot(g, x + i, y + 13, P.h2); box(g, x, y + 15, 16, 1, P.ink); }
  if (n(-1, 0) !== '#') box(g, x, y, 1, 16, P.h1);
  if (n(1, 0) !== '#') box(g, x + 15, y, 1, 16, P.h1);
}
function cliff(g, x, y, f, n, X, Y) {
  const face = n(0, 1) !== '^';
  box(g, x, y, 16, 16, P.r3);
  for (let i = 0; i < 8; i++) {
    const cx = x + Math.floor(hash(X, Y, i + 400) * 15), cy = y + Math.floor(hash(X, Y, i + 410) * 15);
    box(g, cx, cy, 2, 1, P.r4); dot(g, cx, cy + 1, P.r2);
  }
  if (n(0, -1) !== '^') { box(g, x, y, 16, 2, P.r4); box(g, x, y, 16, 1, '#d87070'); }
  if (n(-1, 0) !== '^') box(g, x, y, 1, 16, P.r2);
  if (n(1, 0) !== '^') box(g, x + 15, y, 1, 16, P.r2);
  if (face) {   // the rock face, with layers
    box(g, x, y + 7, 16, 9, P.r2);
    box(g, x, y + 7, 16, 1, P.r4);
    box(g, x, y + 10, 16, 1, P.r1); box(g, x, y + 13, 16, 1, P.r1);
    for (let i = 0; i < 4; i++) { const cx = x + 1 + Math.floor(hash(X, Y, i + 420) * 14); box(g, cx, y + 8, 1, 7, P.r1); dot(g, cx + 1, y + 9, P.r3); }
    box(g, x, y + 15, 16, 1, P.ink);
  }
}
/* where land meets the sky: the edge crumbles down (a thin shadow under a mushroom-cap bridge) */
const ROCK = { r1: P.r1, r2: P.r2, r4: P.r4 };
const ROCK2 = { r1: '#1a0638', r2: '#2e0e58', r4: '#6a2fa8', glow: '#ff8ae0' };   // under the Groove's islands, with glowing roots
function skyEdges(g, x, y, n, X, Y, rock) {
  const land = (c) => !(TILE[c] || {}).void, up = n(0, -1);
  if (up === 'c') { box(g, x + 1, y, 14, 2, rock.r1); for (let i = 2; i < 14; i += 3) dot(g, x + i, y + 2, rock.r1); }
  else if (land(up)) {
    box(g, x, y, 16, 5, rock.r2); box(g, x, y, 16, 1, rock.r4);
    box(g, x, y + 3, 16, 1, rock.r1);
    for (let i = 0; i < 16; i++) {
      const d = 5 + Math.floor(hash(X * 16 + i, Y, 530) * 3);
      box(g, x + i, y + 5, 1, d - 5, rock.r1);
      if (hash(X * 16 + i, Y, 531) < 0.2) dot(g, x + i, y + d + 1, rock.glow || rock.r1);
    }
  }
  if (land(n(-1, 0)) && n(-1, 0) !== 'c') box(g, x, y, 2, 16, rock.r1);
  if (land(n(1, 0)) && n(1, 0) !== 'c') box(g, x + 14, y, 2, 16, rock.r1);
}
function voidSky(g, x, y, f, n, X, Y, mapH) {
  // the sky below the cliffs: darker the further out you look
  const t = Math.min(1, Y / Math.max(4, mapH * 0.35));
  const base = t < 0.33 ? P.s3 : t < 0.66 ? P.s2 : P.s1;
  box(g, x, y, 16, 16, base);
  for (let j = 0; j < 16; j += 4) if (hash(X, Y + j, 9) < 0.3) box(g, x, y + j, 16, 1, shade(base, 0.08));
  for (let i = 0; i < 3; i++) {
    const sx = x + Math.floor(hash(X, Y, i + 500) * 16), sy = y + Math.floor(hash(X, Y, i + 510) * 16);
    const tw = (Math.floor(hash(X, Y, i + 520) * 4) + f) % 4;
    dot(g, sx, sy, tw === 0 ? '#ffffff' : tw === 1 ? P.s5 : shade(base, 0.25));
    if (tw === 0 && i === 0) { dot(g, sx - 1, sy, P.s5); dot(g, sx + 1, sy, P.s5); dot(g, sx, sy - 1, P.s5); dot(g, sx, sy + 1, P.s5); }
  }
  skyEdges(g, x, y, n, X, Y, ROCK);
}
/* the Shroom Groove's sky: bright violet all the way down, with drifting cloud bands and pink stars */
const G = { moss: '#7a3e9e', moss2: '#663088', moss3: '#9658c0', sky1: '#1c0540', sky2: '#2a0a5c', sky3: '#3c1280' };
function sky2(g, x, y, f, n, X, Y) {
  const v = hash(Math.floor(X / 3), Math.floor(Y / 2), 1500);
  const base = v < 0.3 ? G.sky1 : v < 0.75 ? G.sky2 : G.sky3;
  box(g, x, y, 16, 16, base);
  for (let j = 0; j < 16; j += 4) if (hash(X, Y + j, 1510) < 0.35) box(g, x, y + j, 16, 1, shade(base, 0.1));
  for (let i = 0; i < 3; i++) {
    const sx = x + Math.floor(hash(X, Y, i + 1520) * 16), sy = y + Math.floor(hash(X, Y, i + 1530) * 16);
    const tw = (Math.floor(hash(X, Y, i + 1540) * 4) + f) % 4;
    dot(g, sx, sy, tw === 0 ? '#ffffff' : tw === 1 ? '#ffb0f0' : shade(base, 0.3));
    if (tw === 0 && i === 0) { dot(g, sx - 1, sy, '#ffb0f0'); dot(g, sx + 1, sy, '#ffb0f0'); dot(g, sx, sy - 1, '#ffb0f0'); dot(g, sx, sy + 1, '#ffb0f0'); }
  }
  skyEdges(g, x, y, n, X, Y, ROCK2);
}
function fall(g, x, y, f, n, X, Y, mapH) {
  voidSky(g, x, y, f, n, X, Y, mapH);
  const top = (TILE[n(0, -1)] || {}).void ? 0 : 3;
  for (let i = 1; i < 15; i++) {
    for (let j = top; j < 16; j++) {
      const v = (j - f * 4 + i * 5 + Y * 16) & 15;
      dot(g, x + i, y + j, v < 3 ? P.w5 : v < 8 ? P.w4 : P.w3);
    }
  }
  box(g, x, y + top, 1, 16 - top, P.w2); box(g, x + 15, y + top, 1, 16 - top, P.w2);
}
function bridgeH(g, x, y, f, n, X, Y) {
  water(g, x, y, f, n, X, Y);
  for (let i = 0; i < 16; i += 4) { box(g, x + i, y + 2, 4, 12, i % 8 ? '#b0703a' : '#c8844a'); box(g, x + i + 3, y + 2, 1, 12, '#7a4420'); dot(g, x + i + 1, y + 4, '#5a3018'); dot(g, x + i + 1, y + 11, '#5a3018'); }
  box(g, x, y + 1, 16, 2, '#6a3a1c'); box(g, x, y + 1, 16, 1, '#e0a060');
  box(g, x, y + 13, 16, 2, '#6a3a1c'); box(g, x, y + 15, 16, 1, P.ink);
}
function bridgeV(g, x, y, f, n, X, Y) {
  water(g, x, y, f, n, X, Y);
  for (let j = 0; j < 16; j += 4) { box(g, x + 2, y + j, 12, 4, j % 8 ? '#b0703a' : '#c8844a'); box(g, x + 2, y + j + 3, 12, 1, '#7a4420'); }
  box(g, x + 1, y, 2, 16, '#6a3a1c'); box(g, x + 1, y, 1, 16, '#e0a060');
  box(g, x + 13, y, 2, 16, '#6a3a1c');
}
function stone(g, x, y, f, n, X, Y) {
  water(g, x, y, f, n, X, Y);
  box(g, x + 3, y + 4, 10, 9, P.st4); box(g, x + 2, y + 5, 12, 7, P.st4);
  box(g, x + 3, y + 4, 10, 7, P.st2); box(g, x + 2, y + 5, 12, 5, P.st2);
  box(g, x + 4, y + 5, 5, 2, P.st3); dot(g, x + 4, y + 5, P.st5);
  box(g, x + 3, y + 12, 10, 1, (f % 2) ? P.w4 : P.w3);
}
function sand(g, x, y, f, n, X, Y) {
  box(g, x, y, 16, 16, P.sand);
  for (let i = 0; i < 10; i++) dot(g, x + Math.floor(hash(X, Y, i + 600) * 16), y + Math.floor(hash(X, Y, i + 610) * 16), i % 3 ? P.sand2 : '#f6dcae');
  // soften the edges into whatever is next door
  for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    const c = n(dx, dy), t = TILE[c] || {};
    if (c === 's' || t.water || t.bridge) continue;
    const base = LAND_BASE[t.name] || P.soil;
    for (let i = 0; i < 16; i++) {
      const d = Math.floor(hash(X * 16 + i, Y * 16 + dx + dy * 3, 601) * 3);
      for (let k = 0; k < d; k++) dot(g, dx === 0 ? x + i : dx < 0 ? x + k : x + 15 - k, dy === 0 ? y + i : dy < 0 ? y + k : y + 15 - k, base);
    }
  }
}
function scorch(g, x, y, f, n, X, Y) {
  lawn(g, x, y, f, n, X, Y);
  // burnt, flattened moss where the COMET skidded in
  for (let i = 0; i < 2; i++) {
    const sx = x + 1 + Math.floor(hash(X, Y, i + 700) * 10), sy = y + 2 + Math.floor(hash(X, Y, i + 710) * 10);
    box(g, sx, sy, 5, 2, '#4a3a2e'); box(g, sx + 1, sy - 1, 3, 4, '#4a3a2e'); box(g, sx + 1, sy, 3, 2, '#6a4a34'); dot(g, sx + 2, sy, '#2e2228');
  }
  if ((Math.floor(hash(X, Y, 720) * 4) + f) % 4 === 0) dot(g, x + 5 + (X * 3) % 6, y + 6 + (Y * 5) % 5, '#ff8a2a');
}
function nest(g, x, y, f, n, X, Y) {
  soil(g, x, y, f, n, X, Y, '#5a2a34');
  for (let i = 0; i < 4; i++) {
    const sx = x + Math.floor(hash(X, Y, i + 800) * 13), sy = y + Math.floor(hash(X, Y, i + 810) * 13);
    const c = ['#8a8fa8', '#5a5f78', '#b0b4c8', '#c06a2a'][i];
    box(g, sx, sy, 3, 2, c); dot(g, sx, sy + 2, P.ink);
  }
}

/* ---------- the Whisperwood: mossy jungle floor, a wall of giant trees, tall ferns, old ruins ---------- */
const J = { floor: '#25603f', floor2: '#1b4a30', floor3: '#3a8058', leaf: '#1f5a38', leaf2: '#2f7a48', leaf3: '#58b070', dark: '#123a24', trunk: '#5a3a28', trunk2: '#3a2418' };
function jungle(g, x, y, f, n, X, Y, base = J.floor) {
  box(g, x, y, 16, 16, base);
  for (let i = 0; i < 10; i++) dot(g, x + Math.floor(hash(X, Y, i + 900) * 16), y + Math.floor(hash(X, Y, i + 910) * 16), hash(X, Y, i + 920) < 0.5 ? J.floor2 : J.floor3);
  for (let i = 0; i < 3; i++) {   // fallen leaves: rust, gold and violet
    if (hash(X, Y, i + 930) > 0.55) continue;
    const lx = x + 1 + Math.floor(hash(X, Y, i + 940) * 13), ly = y + 1 + Math.floor(hash(X, Y, i + 950) * 13), c = ['#b0583a', '#d8a040', '#8a50e4'][i];
    box(g, lx, ly, 2, 1, c); dot(g, lx + 1, ly + 1, c);
  }
  if (hash(X, Y, 960) < 0.18) {   // a root
    const rx = x + 2 + Math.floor(hash(X, Y, 961) * 10), ry = y + 3 + Math.floor(hash(X, Y, 962) * 9);
    box(g, rx, ry, 4, 1, J.trunk); dot(g, rx + 4, ry + 1, J.trunk); dot(g, rx, ry - 1, '#7a5238');
  }
  if (hash(X, Y, 970) < 0.12) {   // a tiny glowing mushroom
    const mx = x + 3 + Math.floor(hash(X, Y, 971) * 10), my = y + 4 + Math.floor(hash(X, Y, 972) * 9);
    dot(g, mx, my + 1, '#e8e0d0'); box(g, mx - 1, my, 3, 1, (f % 2) ? '#8ff0ff' : '#5fc8e8');
  }
}
function canopy(g, x, y, f, n, X, Y) {
  const tree = (c) => c === 'T';
  box(g, x, y, 16, 16, J.dark);
  for (let i = 0; i < 9; i++) {
    const lx = x + Math.floor(hash(X, Y, i + 1000) * 14), ly = y + 1 + Math.floor(hash(X, Y, i + 1010) * 13);
    box(g, lx, ly, 3, 2, J.leaf); box(g, lx + 1, ly - 1, 2, 1, J.leaf2); dot(g, lx + 1, ly - 1, J.leaf3);
  }
  if (hash(X, Y, 1020) < 0.14) {   // glowing fruit
    const fx = x + 3 + Math.floor(hash(X, Y, 1021) * 9), fy = y + 3 + Math.floor(hash(X, Y, 1022) * 6);
    box(g, fx, fy, 2, 2, (f + X) % 4 < 2 ? '#ff9ad8' : '#ffc0ea');
  }
  if (!tree(n(0, -1))) { box(g, x, y, 16, 1, J.leaf2); for (let i = 0; i < 16; i += 3) dot(g, x + i + (X % 3), y + 1, J.leaf3); }
  if (!tree(n(0, 1))) {   // the edge of the forest: trunks between the leaves, and hanging vines
    box(g, x, y + 10, 16, 6, '#0a2416');
    for (let i = 0; i < 2; i++) { const tx = x + 2 + Math.floor(hash(X, Y, i + 1030) * 10); box(g, tx, y + 9, 3, 7, J.trunk); dot(g, tx, y + 9, J.trunk2); box(g, tx + 2, y + 10, 1, 6, J.trunk2); }
    for (let i = 0; i < 3; i++) { const vx = x + 1 + Math.floor(hash(X, Y, i + 1040) * 14), vl = 3 + Math.floor(hash(X, Y, i + 1050) * 6); box(g, vx, y + 8, 1, vl, '#3fae5a'); dot(g, vx, y + 8 + vl, '#7ff09a'); }
    box(g, x, y + 15, 16, 1, P.ink);
  }
  if (!tree(n(-1, 0))) box(g, x, y, 1, 16, J.leaf);
  if (!tree(n(1, 0))) box(g, x + 15, y, 1, 16, '#0a2416');
}
function fern(g, x, y, f, n, X, Y) {   // tall ferns: wild creatures hide in them
  jungle(g, x, y, f, n, X, Y, J.floor2);
  for (let i = 0; i < 5; i++) {
    const bx = x + 2 + ((i * 6 + Math.floor(hash(X, Y, i + 1100) * 3)) % 12), by = y + 7 + ((i * 5) % 8);
    const sway = (f + i) % 4 === 1 ? 1 : (f + i) % 4 === 3 ? -1 : 0;
    for (let k = 0; k < 6; k++) {
      const sx = bx + Math.round((sway * k) / 5), sy = by - k;
      dot(g, sx, sy, '#2fa070');
      if (k > 0 && k < 5) { const w = k < 3 ? 2 : 1; dot(g, sx - w, sy + 1, '#3fc080'); dot(g, sx + w, sy + 1, '#3fc080'); }
    }
    dot(g, bx + sway, by - 6, (f + i) % 3 === 0 ? '#8ff0ff' : '#7fe8a8');
  }
}
function ruin(g, x, y, f, n, X, Y) {   // old paving stones round the Veil Gate, mossy, with glowing runes
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
    const sx = x + i * 8, sy = y + j * 8, v = hash(X * 2 + i, Y * 2 + j, 1200);
    box(g, sx, sy, 8, 8, v < 0.3 ? '#5e5a7e' : '#6e6a90');
    box(g, sx, sy, 8, 1, '#8a86aa'); box(g, sx, sy + 7, 8, 1, '#3e3a5a'); box(g, sx + 7, sy, 1, 8, '#4a4668');
    if (v > 0.6) { box(g, sx + 1, sy + 5, 3, 2, '#3f9a5a'); dot(g, sx + 2, sy + 4, '#5fd070'); }
    if (v > 0.88) { const c = (f % 2) ? '#8ff0ff' : '#c08cff'; box(g, sx + 2, sy + 2, 3, 1, c); dot(g, sx + 4, sy + 3, c); dot(g, sx + 2, sy + 4, c); }
  }
}

/* ---------- the Shroom Groove: purple moss, glowing mushroom patches, bridges of mushroom caps ---------- */
function moss(g, x, y, f, n, X, Y, base = G.moss) {
  box(g, x, y, 16, 16, base);
  for (let i = 0; i < 9; i++) dot(g, x + Math.floor(hash(X, Y, i + 1300) * 16), y + Math.floor(hash(X, Y, i + 1310) * 16), hash(X, Y, i + 1320) < 0.5 ? G.moss2 : G.moss3);
  for (let i = 0; i < 4; i++) { const sx = x + 1 + Math.floor(hash(X, Y, i + 1330) * 14), sy = y + 1 + Math.floor(hash(X, Y, i + 1340) * 14); dot(g, sx, sy, G.moss3); dot(g, sx + 1, sy, G.moss3); dot(g, sx, sy - 1, '#b880e8'); }
  for (let i = 0; i < 2; i++) {   // spores twinkling in the moss
    if ((Math.floor(hash(X, Y, i + 1350) * 4) + f) % 4 < 2) dot(g, x + Math.floor(hash(X, Y, i + 1360) * 16), y + Math.floor(hash(X, Y, i + 1370) * 16), i ? '#ffb0f4' : '#8ff0ff');
  }
  // a lit rim where the island ends and the sky begins
  const sky = (c) => (TILE[c] || {}).void;
  if (sky(n(0, -1))) { box(g, x, y, 16, 1, '#d0a8ff'); box(g, x, y + 1, 16, 1, '#a874d8'); }
  if (sky(n(-1, 0))) box(g, x, y, 1, 16, '#b88ae8');
  if (sky(n(1, 0))) box(g, x + 15, y, 1, 16, '#3a1460');
  if (sky(n(0, 1))) box(g, x, y + 15, 16, 1, '#3a1460');
}
function shrooms(g, x, y, f, n, X, Y) {   // a patch of little glowing mushrooms: wild creatures hide in it
  moss(g, x, y, f, n, X, Y, G.moss2);
  for (let i = 0; i < 5; i++) {
    const mx = x + 2 + ((i * 5 + Math.floor(hash(X, Y, i + 1400) * 3)) % 12), my = y + 5 + ((i * 7) % 9);
    const h = 2 + ((i + X) % 3), c = ['#ff6ab0', '#5ff2ff', '#ffd25a', '#b06aff'][(i + Y) % 4], lit = (f + i) % 4 < 2;
    box(g, mx, my - h + 1, 1, h, '#f2e6ff');
    box(g, mx - 1, my - h, 3, 1, lit ? c : shade(c, -0.3)); dot(g, mx, my - h - 1, lit ? '#ffffff' : c);
  }
}
function capbridge(g, x, y, f, n, X, Y) {   // a walkway of big round mushroom caps over the sky
  sky2(g, x, y, f, n, X, Y);
  const solidish = (c) => !(TILE[c] || {}).void;
  const horiz = solidish(n(-1, 0)) || solidish(n(1, 0));
  for (let k = 0; k < 2; k++) {
    const cx = horiz ? x + 4 + k * 8 : x + 8, cy = horiz ? y + 8 : y + 4 + k * 8;
    box(g, cx - 5, cy - 3, 10, 7, '#a02a68'); box(g, cx - 4, cy - 4, 8, 9, '#a02a68');
    box(g, cx - 4, cy - 3, 8, 6, '#ff6ab0'); box(g, cx - 3, cy - 4, 6, 1, '#ff8ac4'); box(g, cx - 3, cy + 3, 6, 1, '#d84a90');
    dot(g, cx - 2, cy - 2, '#ffffff'); dot(g, cx + 1, cy - 1, '#ffe0f0'); dot(g, cx - 1, cy + 1, '#ffffff'); dot(g, cx + 2, cy + 1, '#ffe0f0');
  }
}

const PAINT = {
  soil: (g, x, y, f, n, X, Y) => soil(g, x, y, f, n, X, Y), lawn, plaza, path, glow, hedge, cliff, sand, scorch, nest,
  water: (g, x, y, f, n, X, Y) => water(g, x, y, f, n, X, Y, false),
  algae: (g, x, y, f, n, X, Y) => water(g, x, y, f, n, X, Y, true),
  flowers: (g, x, y, f, n, X, Y) => flowers(g, x, y, f, n, X, Y, false),
  blooms: (g, x, y, f, n, X, Y) => flowers(g, x, y, f, n, X, Y, true),
  bridgeH, bridgeV, stone, void: voidSky, fall,
  jungle: (g, x, y, f, n, X, Y) => jungle(g, x, y, f, n, X, Y), canopy, fern, ruin,
  moss: (g, x, y, f, n, X, Y) => moss(g, x, y, f, n, X, Y), shrooms, capbridge, sky2,
};

/* paint a whole map's ground into 4 animation frames */
export function paintMap(rows) {
  const h = rows.length, w = rows[0].length;
  const frames = [];
  const at = (X, Y) => (Y < 0 || X < 0 || Y >= h || X >= w ? (rows[Math.max(0, Math.min(h - 1, Y))][Math.max(0, Math.min(w - 1, X))]) : rows[Y][X]);
  for (let f = 0; f < 4; f++) {
    const c = makeCanvas(w * 16, h * 16), g = c.getContext('2d');
    for (let Y = 0; Y < h; Y++) for (let X = 0; X < w; X++) {
      const ch = rows[Y][X];
      const t = TILE[ch] || TILE['.'];
      const fn = PAINT[t.name] || PAINT.soil;
      fn(g, X * 16, Y * 16, f, (dx, dy) => at(X + dx, Y + dy), X, Y, h);
    }
    frames.push(c);
  }
  return frames;
}

/* ---------- props ---------- */
function canvasOf(w, h, draw) { const c = makeCanvas(w, h); draw(c.getContext('2d')); return c; }

function towerArt(variant = 0) {
  const roofs = [['#58c498', '#2a846c'], ['#ffb43a', '#c87a1a'], ['#8ff0ff', '#3fa8c8']];
  const [roofA, roofB] = roofs[variant % roofs.length];
  return canvasOf(48, 72, (g) => {
    // roof garden
    box(g, 4, 6, 40, 10, roofB); box(g, 6, 4, 36, 4, roofA);
    for (let i = 0; i < 6; i++) { box(g, 7 + i * 6, 1 + (i % 2), 5, 5, i % 2 ? '#3fb07a' : '#58c498'); dot(g, 8 + i * 6, 2 + (i % 2), '#a6f2c0'); }
    // walls
    box(g, 4, 14, 40, 52, '#e8e2f8'); box(g, 4, 14, 3, 52, '#ffffff'); box(g, 38, 14, 6, 52, '#b8b0d8');
    box(g, 4, 14, 40, 2, '#9a90c0');
    // windows that glow
    for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) {
      const wx = 9 + k * 11, wy = 19 + r * 10;
      const lit = hash(variant, r * 3 + k, 3) < 0.6;
      box(g, wx, wy, 7, 6, P.ink); box(g, wx + 1, wy + 1, 5, 4, lit ? (k === 1 ? '#ffd27a' : '#8ff0ff') : '#3a3460');
      if (lit) dot(g, wx + 1, wy + 1, '#ffffff');
    }
    // vines up the wall
    for (let j = 16; j < 64; j++) { if (hash(variant, j, 7) < 0.6) dot(g, 6 + ((j / 6) | 0) % 2, j, '#2a9a70'); if (hash(variant, j, 8) < 0.4) dot(g, 41, j, '#2a9a70'); }
    // door
    box(g, 19, 54, 10, 12, P.ink); box(g, 20, 55, 8, 11, '#4a3a7a'); box(g, 20, 55, 8, 2, P.cyan); dot(g, 26, 61, P.gold);
    box(g, 2, 64, 44, 2, '#9a90c0');
    // outline
    g.fillStyle = P.ink;
    g.fillRect(3, 14, 1, 52); g.fillRect(44, 14, 1, 52); g.fillRect(3, 66, 42, 1);
    g.fillRect(3, 5, 1, 10); g.fillRect(44, 5, 1, 10);
  });
}
function spireArt() {
  return canvasOf(32, 80, (g) => {
    box(g, 14, 0, 4, 10, '#b8b0d8'); dot(g, 15, 0, P.cyan); dot(g, 16, 0, P.cyan);
    box(g, 6, 8, 20, 6, '#58c498'); box(g, 8, 6, 16, 3, '#8ae0b8');
    box(g, 6, 14, 20, 62, '#d8d0f0'); box(g, 6, 14, 2, 62, '#ffffff'); box(g, 22, 14, 4, 62, '#a8a0cc');
    for (let r = 0; r < 6; r++) { box(g, 11, 18 + r * 9, 10, 5, P.ink); box(g, 12, 19 + r * 9, 8, 3, r % 2 ? '#8ff0ff' : '#c8a8ff'); }
    box(g, 12, 66, 8, 10, P.ink); box(g, 13, 67, 6, 9, '#4a3a7a'); box(g, 13, 67, 6, 1, '#ffd27a');
    g.fillStyle = P.ink; g.fillRect(5, 8, 1, 69); g.fillRect(26, 8, 1, 69); g.fillRect(5, 76, 22, 1);
  });
}
function domeArt() {
  return canvasOf(48, 40, (g) => {
    const p = painter(48, 40);
    p.ellipse(24, 26, 22, 22, 'G');
    p.rect(0, 26, 48, 14, '.');
    p.rect(2, 26, 44, 10, 'B');
    const rows = p.rows();
    g.drawImage(spr(rows, { G: '#7fd8e8', B: '#9a90c0' }), 0, 0);
    // plants inside the glass
    for (let i = 0; i < 7; i++) {
      const px = 8 + i * 5, ph = 6 + (i * 7) % 9;
      box(g, px, 26 - ph, 2, ph, i % 2 ? '#2a9a70' : '#3fb07a');
      box(g, px - 1, 26 - ph, 4, 2, i % 3 ? '#58c498' : '#ffb43a');
    }
    // glass shine and ribs
    g.globalAlpha = 0.55; box(g, 10, 10, 3, 10, '#ffffff'); box(g, 13, 7, 3, 3, '#ffffff'); g.globalAlpha = 1;
    for (const rx of [12, 24, 36]) { box(g, rx, rx === 24 ? 4 : 9, 1, rx === 24 ? 22 : 17, '#c8c0e8'); }
    box(g, 2, 17, 44, 1, '#c8c0e8');
    // base
    box(g, 2, 26, 44, 10, '#b8b0d8'); box(g, 2, 26, 44, 2, '#e8e2f8');
    box(g, 20, 28, 8, 8, P.ink); box(g, 21, 29, 6, 7, '#2a846c'); box(g, 21, 29, 6, 1, P.cyan);
    // outline
    const o = painter(48, 40); o.ellipse(24, 26, 22, 22, 'x'); o.rect(0, 27, 48, 13, '.'); o.rect(2, 26, 44, 10, 'x'); o.outline('K');
    g.drawImage(spr(o.rows().map((r) => r.replace(/x/g, '.')), { K: P.ink }), 0, 0);
  });
}
function treeArt(kind = 0) {
  return canvasOf(16, 32, (g) => {
    const p = painter(16, 32);
    p.rect(7, 14, 2, 16, 'T');
    if (kind === 0) {   // bulb tree: a round glowing crown
      p.ellipse(8, 9, 7, 7, 'L'); p.ellipse(8, 8, 5, 5, 'l');
      p.shade('L', 'D', 1, 1, 2); p.shade('l', 'L', 1, 1, 1);
      p.set(5, 6, 'g'); p.set(10, 11, 'g'); p.set(11, 6, 'g'); p.set(4, 11, 'g');
    } else {           // frond tree
      const leaf = (x1, y1, cx, cy, c) => { for (let i = 0; i <= 12; i++) { const t = i / 12, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, d = t * t; const r = 1.5 - t * 0.9; p.ellipse(a * 8 + b * cx + d * x1, a * 6 + b * cy + d * y1, r, r, c); } };
      leaf(1, 13, 2, 3, 'L'); leaf(15, 13, 14, 3, 'L'); leaf(3, 10, 4, 1, 'l'); leaf(13, 10, 12, 1, 'l'); leaf(8, 1, 8, 3, 'l');
      p.ellipse(8, 7, 2.2, 2, 'L');
      p.set(7, 8, 'g'); p.set(9, 9, 'g'); p.set(8, 8, 'g');
      p.shade('L', 'D', 0, 1, 1);
    }
    p.rect(7, 29, 2, 1, 'T');
    p.outline('K');
    p.recolour('T', 't', (x) => x === 8);
    const pal = kind === 0
      ? { K: P.ink, T: '#a87a5a', t: '#7a5440', L: '#2fb894', l: '#7fe8c0', D: '#1b7a6a', g: '#ffe27a' }
      : { K: P.ink, T: '#c0a07a', t: '#8a6a4a', L: '#c060e0', l: '#e09aff', D: '#7a30a8', g: '#ffd23a' };
    g.drawImage(spr(p.rows(), pal), 0, 0);
  });
}
function shroomArt() {
  return canvasOf(32, 40, (g) => {
    const p = painter(32, 40);
    p.rect(12, 18, 8, 20, 'S'); p.rect(11, 34, 10, 4, 'S');
    p.ellipse(16, 13, 15, 10, 'C'); p.rect(0, 15, 32, 10, '.'); p.ellipse(16, 15, 15, 4, 'C');
    p.shade('C', 'c', 1, 1, 2);
    p.ellipse(16, 17, 12, 2, 'u');
    for (const [sx, sy, r] of [[9, 8, 2], [20, 6, 2.5], [25, 12, 1.6], [14, 13, 1.5], [6, 13, 1.4]]) p.ellipse(sx, sy, r, r, 'g');
    p.shade('S', 's', 1, 0, 2);
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, C: '#8a40d8', c: '#5a2ca4', u: '#3a1a6a', g: '#8ff0ff', S: '#ece0d0', s: '#bfae9a' }), 0, 0);
  });
}
function crystalArt(tint = 0) {
  const pals = [{ A: '#5ff2ff', B: '#2aa8d8', C: '#d8ffff' }, { A: '#c08cff', B: '#7a40d8', C: '#f2e6ff' }, { A: '#7dff9a', B: '#2ab85a', C: '#e6fff0' }];
  return canvasOf(16, 20, (g) => {
    const p = painter(16, 20);
    p.poly([[4, 19], [3, 9], [6, 4], [8, 10], [8, 19]], 'A');
    p.poly([[7, 19], [8, 6], [10, 1], [12, 7], [12, 19]], 'A');
    p.poly([[11, 19], [12, 11], [14, 9], [15, 13], [14, 19]], 'B');
    p.line(9, 3, 9, 16, 'C'); p.line(5, 7, 5, 15, 'C');
    p.shade('A', 'B', 1, 0, 1);
    p.outline('K');
    g.drawImage(spr(p.rows(), { ...pals[tint % 3], K: P.ink }), 0, 0);
  });
}
function rockArt(big = false) {
  const w = big ? 32 : 16, h = big ? 24 : 16;
  return canvasOf(w, h, (g) => {
    const p = painter(w, h);
    if (big) { p.ellipse(15, 14, 14, 9, 'R'); p.ellipse(22, 11, 8, 7, 'R'); } else { p.ellipse(8, 9, 7, 6, 'R'); }
    p.shade('R', 'r', 1, 1, 2);
    p.shade('R', 'L', -1, -1, 1);
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, R: P.r3, r: P.r2, L: P.r4 }), 0, 0);
  });
}
function lampArt(f) {
  return canvasOf(16, 32, (g) => {
    box(g, 7, 10, 2, 20, '#9a90c0'); box(g, 7, 10, 1, 20, '#d8d0f0'); box(g, 5, 28, 6, 3, '#6e6690');
    box(g, 5, 2, 6, 7, P.ink); box(g, 6, 3, 4, 5, f % 2 ? '#ffe27a' : '#fff2b0'); dot(g, 6, 3, '#ffffff');
    box(g, 4, 9, 8, 1, '#6e6690');
    g.globalAlpha = 0.25; g.fillStyle = '#ffe27a'; g.fillRect(3, 1, 10, 9); g.globalAlpha = 1;
  });
}
function fountainArt(f) {
  return canvasOf(32, 32, (g) => {
    const p = painter(32, 32);
    p.ellipse(16, 22, 15, 9, 'S'); p.ellipse(16, 21, 12, 6, 'W'); p.shade('S', 's', 0, 1, 2);
    p.rect(14, 8, 4, 13, 'S'); p.ellipse(16, 9, 5, 2, 'S');
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, S: '#d4ceee', s: '#8a82ae', W: f % 2 ? '#17a068' : '#1fb070' }), 0, 0);
    // glowing jet
    const c = ['#c8ffe0', '#3fe08f', '#7ff0b8'];
    for (let i = 0; i < 6; i++) {
      const t = (f * 3 + i * 5) % 12;
      dot(g, 16 + (i % 2 ? 1 : -1) * Math.floor(t / 3), 4 + t, c[i % 3]);
      dot(g, 15 + (i % 2 ? -1 : 1) * Math.floor(t / 4), 5 + t, c[(i + 1) % 3]);
    }
    box(g, 15, 2, 2, 6, '#c8ffe0');
    for (let i = 0; i < 4; i++) dot(g, 8 + ((f * 5 + i * 7) % 16), 19 + (i % 3), '#c8ffe0');
  });
}
function shipArt() {
  return canvasOf(64, 44, (g) => {
    const p = painter(64, 44);
    p.ellipse(32, 26, 28, 10, 'H');                     // hull, nose down in the dirt
    p.poly([[8, 26], [2, 14], [10, 15], [18, 24]], 'F'); // tail fin
    p.poly([[40, 30], [52, 40], [58, 38], [48, 28]], 'F');
    p.ellipse(40, 21, 9, 6, 'G');                        // cockpit glass (cracked)
    p.ellipse(39, 20, 5, 3, 'g');
    p.rect(10, 26, 46, 2, 'O');                          // orange stripe
    p.shade('H', 'h', 0, 1, 3);
    p.outline('K');
    const pal = { K: P.ink, H: '#e8e6f6', h: '#a8a4c8', F: '#ff8a1e', O: '#ff8a1e', G: '#5fb8e8', g: '#bff0ff' };
    g.drawImage(spr(p.rows(), pal), 0, 0);
    // dents, crack, the ship's name, scorch marks
    g.fillStyle = P.ink; [[36, 18], [37, 19], [38, 19], [39, 20], [40, 22], [41, 22]].forEach(([x, y]) => g.fillRect(x, y, 1, 1));
    box(g, 16, 30, 3, 1, '#8a86a8'); box(g, 24, 33, 4, 1, '#8a86a8');
    box(g, 4, 30, 6, 4, '#3a2a30'); box(g, 56, 26, 5, 5, '#3a2a30');
    box(g, 18, 22, 14, 1, '#6a6690');
    // the dirt it ploughed up
    box(g, 50, 36, 12, 3, '#7a4a3a'); box(g, 52, 35, 8, 1, '#9a6a50');
  });
}
function podArt(kind, open) {
  const inside = { tiger: '#ff8a1e', dragonR: '#e8302a', dragonB: '#2f7cf0', octo: '#5fc8f8', empty: null }[kind];
  return canvasOf(16, 26, (g) => {
    const p = painter(16, 26);
    p.ellipse(8, 9, 7, 9, open ? '.' : 'G');
    p.rect(1, 15, 14, 9, 'B'); p.rect(2, 13, 12, 3, 'b');
    p.outline('K');
    const pal = { K: P.ink, G: '#8fe8ff', B: '#9a90c0', b: '#d8d0f0' };
    g.drawImage(spr(p.rows(), pal), 0, 0);
    if (!open) { g.globalAlpha = 0.5; box(g, 2, 3, 12, 12, '#2a4a6a'); g.globalAlpha = 1; }   // the guardian inside is drawn by the world
    if (open) { box(g, 3, 11, 10, 3, '#5a4a8a'); }
    box(g, 6, 19, 4, 2, inside || '#6e6690'); box(g, 3, 22, 10, 1, '#6e6690');
  });
}
function signArt() {
  return canvasOf(16, 16, (g) => {
    box(g, 7, 9, 2, 6, '#7a4a2a'); box(g, 2, 2, 12, 8, P.ink); box(g, 3, 3, 10, 6, '#e0a060'); box(g, 3, 3, 10, 1, '#f4c890');
    box(g, 4, 5, 8, 1, '#7a4a2a'); box(g, 4, 7, 6, 1, '#7a4a2a');
  });
}
function stallArt(f) {
  return canvasOf(32, 36, (g) => {
    // awning
    for (let i = 0; i < 8; i++) box(g, i * 4, 2, 4, 8, i % 2 ? '#f8f4ff' : '#2fc6b4');
    for (let i = 0; i < 8; i++) { box(g, i * 4, 10, 4, 2, i % 2 ? '#f8f4ff' : '#2fc6b4'); dot(g, i * 4 + 1, 12, i % 2 ? '#f8f4ff' : '#2fc6b4'); dot(g, i * 4 + 2, 12, i % 2 ? '#f8f4ff' : '#2fc6b4'); }
    box(g, 0, 1, 32, 1, P.ink); box(g, 2, 12, 2, 20, '#7a4a2a'); box(g, 28, 12, 2, 20, '#7a4a2a');
    // Mossa, the snail merchant, behind the counter
    const m = painter(16, 14);
    m.ellipse(8, 9, 6, 5, 'S'); m.ellipse(8, 9, 3, 3, 's'); m.set(8, 9, 'S');
    m.ellipse(12, 6, 3, 3, 'B'); m.line(11, 3, 10, 0, 'B'); m.line(13, 3, 14, 0, 'B');
    m.set(10, 0, 'E'); m.set(14, 0, 'E'); m.set(12, 5, 'E'); m.set(13, 5, 'E');
    m.outline('K');
    g.drawImage(spr(m.rows(), { K: P.ink, S: '#ffb43a', s: '#c87a1a', B: '#9ae07a', E: P.ink }), 8, 10 + (f % 2));
    // counter with jewels for sale
    box(g, 1, 22, 30, 12, '#c8844a'); box(g, 1, 22, 30, 2, '#f4c08c'); box(g, 1, 33, 30, 1, P.ink);
    box(g, 0, 22, 1, 12, P.ink); box(g, 31, 22, 1, 12, P.ink);
    box(g, 6, 20, 3, 2, '#3fe08f'); box(g, 12, 20, 3, 2, '#e8302a'); box(g, 18, 20, 3, 2, '#5f9cff'); box(g, 24, 20, 3, 2, '#ffd23a');
    box(g, 4, 27, 24, 1, '#8a5a30');
  });
}
function planetArt() {
  return canvasOf(56, 40, (g) => {
    const p = painter(56, 40);
    p.ellipse(28, 20, 14, 14, 'R');
    p.recolour('R', 'r', (x, y) => (x - 22) * (x - 22) + (y - 14) * (y - 14) > 150);
    p.ellipse(22, 14, 4, 3, 'l');
    p.recolour('R', 'b', (x, y) => Math.abs(y - 18) < 1 || Math.abs(y - 24) < 1);
    const rows = p.rows();
    g.drawImage(spr(rows, { R: '#e8503a', r: '#a82838', l: '#ff9a6a', b: '#c83a3a' }), 0, 0);
    // ring
    g.fillStyle = '#ffd27a';
    for (let x = 2; x < 54; x++) { const y = 22 + Math.round(Math.sin((x - 2) / 52 * Math.PI) * 4 - (x - 28) * 0.08); if (x < 16 || x > 40 || y > 25) g.fillRect(x, y, 1, 1); }
    g.fillStyle = '#c89a4a';
    for (let x = 4; x < 52; x++) { const y = 23 + Math.round(Math.sin((x - 4) / 48 * Math.PI) * 4 - (x - 28) * 0.08); if (x < 16 || x > 40 || y > 26) g.fillRect(x, y, 1, 1); }
  });
}
function moonArt() {
  return canvasOf(20, 20, (g) => {
    const p = painter(20, 20);
    p.ellipse(10, 10, 8, 8, 'M'); p.ellipse(13, 7, 7, 7, '.');
    g.drawImage(spr(p.rows(), { M: '#7fe8c8' }), 0, 0);
  });
}
function bushArt() {
  return canvasOf(16, 16, (g) => {
    const p = painter(16, 16);
    p.ellipse(8, 9, 7, 6, 'L'); p.ellipse(6, 7, 4, 3, 'l');
    p.shade('L', 'D', 1, 1, 1);
    p.set(5, 9, 'F'); p.set(10, 6, 'F'); p.set(11, 11, 'F'); p.set(7, 12, 'F');
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, L: '#2a9a70', l: '#58c498', D: '#1b6a56', F: '#ffb43a' }), 0, 0);
  });
}
function scrapArt() {
  return canvasOf(32, 24, (g) => {
    const p = painter(32, 24);
    p.ellipse(16, 16, 15, 7, 'M'); p.poly([[6, 14], [12, 4], [16, 12]], 'm'); p.poly([[18, 12], [24, 3], [28, 14]], 'M');
    p.rect(9, 9, 8, 3, 'o'); p.shade('M', 'm', 1, 1, 2);
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, M: '#9aa0b8', m: '#5a5f78', o: '#c06a2a' }), 0, 0);
    box(g, 20, 14, 2, 2, '#ffd23a'); box(g, 10, 17, 3, 1, '#3a3a50');
  });
}

/* ---------- Whisperwood props ---------- */
function bigTreeArt() {   // a giant jungle tree: buttress roots, a mossy trunk, a dark canopy hung with glowing fruit
  return canvasOf(48, 64, (g) => {
    const p = painter(48, 64);
    p.ellipse(24, 18, 22, 15, 'L'); p.ellipse(11, 25, 10, 8, 'L'); p.ellipse(37, 24, 11, 8, 'L');
    p.ellipse(21, 12, 12, 7, 'l'); p.ellipse(36, 19, 5, 3, 'l');
    p.shade('L', 'D', 0, 1, 2);
    p.rect(19, 31, 10, 30, 'T');
    p.poly([[19, 50], [11, 63], [21, 58]], 'T'); p.poly([[29, 50], [37, 63], [27, 58]], 'T'); p.poly([[22, 56], [24, 63], [26, 56]], 'T');
    p.recolour('T', 't', (x) => x >= 26);
    p.line(21, 35, 21, 49, 'm'); p.line(23, 41, 23, 53, 'm');
    for (const vx of [8, 15, 33, 40]) p.line(vx, 27, vx, 35 + (vx % 5), 'V');
    for (const [fx, fy] of [[10, 21], [34, 27], [27, 10], [16, 29], [41, 19], [5, 27]]) p.ellipse(fx, fy, 1.6, 1.6, 'F');
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, L: '#2a7a48', l: '#4aa860', D: '#164a2c', T: '#6a4430', t: '#4a2c1e', m: '#3fae5a', V: '#3fae5a', F: '#ff9ad8' }), 0, 0);
  });
}
function glowFlowerArt(f) {
  return canvasOf(16, 24, (g) => {
    const p = painter(16, 24);
    p.rect(7, 12, 2, 12, 'S');
    p.poly([[7, 19], [1, 14], [6, 21]], 'L'); p.poly([[9, 17], [15, 12], [10, 19]], 'L');
    p.ellipse(8, 7, 5, 5.6, 'B'); p.ellipse(8, 6, 3, 3.4, 'b'); p.set(6, 4, 'W');
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, S: '#2a8a4a', L: '#3fbe60', B: f ? '#ff8ad8' : '#e8509a', b: f ? '#ffe0f6' : '#ffa8dc', W: '#ffffff' }), 0, 0);
  });
}
function pillarArt() {
  return canvasOf(16, 32, (g) => {
    const p = painter(16, 32);
    p.rect(3, 8, 10, 24, 'S'); p.rect(1, 28, 14, 4, 'S');
    p.poly([[3, 9], [5, 4], [8, 7], [12, 3], [13, 9]], 'S');   // broken off at the top
    p.shade('S', 's', 1, 0, 2);
    for (let y = 12; y < 28; y += 6) p.line(3, y, 12, y, 's');
    p.line(4, 12, 4, 26, 'M'); p.set(5, 20, 'M'); p.set(11, 9, 'M'); p.line(10, 16, 10, 22, 'M');
    p.set(8, 14, 'R'); p.set(8, 15, 'R'); p.set(7, 16, 'R');
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, S: '#7a7698', s: '#4e4a6e', M: '#3fae5a', R: '#8ff0ff' }), 0, 0);
  });
}
function veilGateArt() {   // an ancient stone arch; the veil inside it is drawn by the world
  return canvasOf(48, 48, (g) => {
    const p = painter(48, 48);
    p.rect(1, 12, 11, 36, 'S'); p.rect(36, 12, 11, 36, 'S');
    p.rect(0, 44, 13, 4, 'S'); p.rect(35, 44, 13, 4, 'S');
    for (let a = 0; a <= 1.0001; a += 0.02) { const t = Math.PI * a; p.ellipse(24 - Math.cos(t) * 18, 15 - Math.sin(t) * 11, 5, 5, 'S'); }
    p.rect(20, 0, 8, 6, 'S');
    p.ellipse(24, 19, 12, 10, '.'); p.rect(12, 19, 24, 29, '.');
    p.shade('S', 's', 1, 1, 2);
    for (const [mx, my, l] of [[2, 14, 9], [10, 30, 7], [37, 16, 6], [45, 28, 9], [8, 6, 3], [33, 4, 4]]) p.line(mx, my, mx, my + l, 'M');
    for (const [rx, ry] of [[5, 18], [6, 26], [5, 34], [41, 20], [42, 28], [41, 36], [23, 1]]) { p.set(rx, ry, 'R'); p.set(rx + 1, ry + 1, 'R'); p.set(rx, ry + 2, 'R'); }
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, S: '#6e6a90', s: '#4a4668', M: '#3fae5a', R: '#8ff0ff' }), 0, 0);
  });
}
function thornsArt() {   // black brambles, pulsing with shadow
  return canvasOf(16, 16, (g) => {
    const p = painter(16, 16);
    for (const [x0, y0, x1, y1] of [[0, 14, 8, 1], [3, 15, 15, 3], [8, 15, 15, 8], [0, 5, 12, 15], [1, 9, 14, 12]]) { p.line(x0, y0, x1, y1, 'V'); p.line(x0 + 1, y0, x1 + 1, y1, 'V'); }
    for (const [sx, sy] of [[4, 8], [10, 6], [6, 12], [12, 10], [2, 4], [13, 14], [8, 3]]) { p.set(sx, sy - 1, 'S'); p.set(sx + 1, sy - 2, 'S'); }
    p.outline('K');
    for (const [gx, gy] of [[5, 7], [11, 9], [7, 13]]) p.set(gx, gy, 'G');
    g.drawImage(spr(p.rows(), { K: '#05020a', V: '#2a1640', S: '#6a3aa8', G: '#c88aff' }), 0, 0);
  });
}

/* ---------- Shroom Groove props ---------- */
const SHROOM_PALS = [
  { C: '#ff5aa8', c: '#c02a78', u: '#7a1a5a', S: '#ffd6f0', g: '#ffffff' },
  { C: '#a050e0', c: '#6a2ab0', u: '#3a1a6a', S: '#8ff0ff', g: '#e0ffff' },
  { C: '#3fc8e8', c: '#2a86c8', u: '#1a4a7a', S: '#ffe27a', g: '#fff8d0' },
];
function giantShroom(kind) {   // a giant mushroom; its spots glow brighter on the beat (the glow image is drawn over it)
  const pal = { K: P.ink, T: '#ece0f8', t: '#bfaed8', ...SHROOM_PALS[kind % 3] };
  const spots = [[12, 12, 3], [24, 7, 3.6], [36, 12, 3], [18, 18, 2], [31, 18, 2.2], [6, 18, 1.6], [42, 18, 1.6]];
  const p = painter(48, 56);
  p.ellipse(24, 18, 23, 15, 'C'); p.rect(0, 22, 48, 12, '.'); p.ellipse(24, 22, 23, 5, 'C');
  p.shade('C', 'c', 0, 1, 2);
  p.ellipse(24, 24, 17, 2.6, 'u');
  for (const [sx, sy, r] of spots) p.ellipse(sx, sy, r, r * 0.8, 'S');
  p.rect(18, 27, 12, 29, 'T'); p.rect(15, 52, 18, 4, 'T');
  p.recolour('T', 't', (x) => x >= 26);
  p.outline('K');
  const full = canvasOf(48, 56, (g) => g.drawImage(spr(p.rows(), pal), 0, 0));
  const q = painter(48, 56);
  for (const [sx, sy, r] of spots) q.ellipse(sx, sy, r + 0.9, r * 0.8 + 0.9, 'g');
  return { full, glow: canvasOf(48, 56, (g) => g.drawImage(spr(q.rows(), { g: pal.g }), 0, 0)) };
}
function miniShroomArt() {
  return canvasOf(16, 16, (g) => {
    const p = painter(16, 16);
    p.rect(3, 9, 2, 6, 'T'); p.rect(10, 7, 2, 8, 'T'); p.rect(7, 11, 2, 4, 'T');
    p.ellipse(4, 8, 3.5, 2.4, 'A'); p.ellipse(11, 6, 4.2, 2.8, 'B'); p.ellipse(8, 10.5, 2.6, 1.8, 'C');
    p.set(3, 7, 'W'); p.set(10, 5, 'W'); p.set(12, 6, 'W'); p.set(8, 10, 'W');
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, T: '#ece0f8', A: '#ff6ab0', B: '#5ff2ff', C: '#ffd25a', W: '#ffffff' }), 0, 0);
  });
}
function boomboxArt() {   // a big retro boombox; its speaker cones are drawn by the world, pumping on the beat
  return canvasOf(48, 32, (g) => {
    const p = painter(48, 32);
    p.line(11, 7, 14, 1, 'M'); p.line(14, 1, 34, 1, 'M'); p.line(34, 1, 37, 7, 'M'); p.line(12, 7, 15, 2, 'M'); p.line(33, 2, 36, 7, 'M');
    p.line(43, 6, 47, 0, 'M');
    p.rect(1, 6, 46, 24, 'B'); p.rect(2, 7, 44, 1, 'b');
    p.ellipse(11, 19, 8.5, 8.5, 'R'); p.ellipse(37, 19, 8.5, 8.5, 'R');
    p.ellipse(11, 19, 6.8, 6.8, 'G'); p.ellipse(37, 19, 6.8, 6.8, 'G');
    p.rect(19, 12, 10, 9, 'D'); p.rect(20, 13, 8, 6, 'd');
    p.ellipse(22.5, 16, 1.6, 1.6, 'W'); p.ellipse(25.5, 16, 1.6, 1.6, 'W');
    p.rect(19, 23, 10, 3, 'L');
    for (const [bx, c] of [[19, 'P'], [22, 'C'], [25, 'Y'], [28, 'P']]) p.rect(bx, 9, 2, 1, c);
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, B: '#3a3a5a', b: '#6a6a90', M: '#c8ccdc', R: '#14142a', G: '#24243e', D: '#14142a', d: '#3a6a8a', W: '#e8e8f8', L: '#5fe07a', P: '#ff6ab0', C: '#5ff2ff', Y: '#ffd23a' }), 0, 0);
  });
}
function speakerArt() {
  return canvasOf(16, 32, (g) => {
    const p = painter(16, 32);
    p.rect(1, 2, 14, 29, 'B'); p.rect(2, 3, 12, 1, 'b');
    p.ellipse(8, 9, 4.6, 4.6, 'R'); p.ellipse(8, 22, 6.2, 6.2, 'R');
    p.outline('K');
    g.drawImage(spr(p.rows(), { K: P.ink, B: '#2e2a48', b: '#4e4a70', R: '#14122a' }), 0, 0);
  });
}

/* every prop: drawn size, footprint (solid tiles from its bottom-left), and frames */
export function buildProps() {
  const two = (fn) => [fn(0), fn(1)];
  const shroom = (k) => { const s = giantShroom(k); return { img: [s.full], glow: s.glow, w: 2, h: 1 }; };
  return {
    bigtree: { img: [bigTreeArt()], w: 2, h: 1 },
    glowflower: { img: two(glowFlowerArt), w: 1, h: 1, anim: 24 },
    pillar: { img: [pillarArt()], w: 1, h: 1 },
    veilgate: { img: [veilGateArt()], w: 3, h: 1, gate: true },
    thorns: { img: [thornsArt()], w: 1, h: 1 },
    gshroom: shroom(0), gshroom2: shroom(1), gshroom3: shroom(2),
    minishroom: { img: [miniShroomArt()], w: 1, h: 1 },
    boombox: { img: [boomboxArt()], w: 3, h: 1, cones: [[11, 19, 6], [37, 19, 6]] },
    speaker: { img: [speakerArt()], w: 1, h: 1, cones: [[8, 9, 3], [8, 22, 5]] },
    tower: { img: [towerArt(0)], w: 3, h: 2 },
    tower2: { img: [towerArt(1)], w: 3, h: 2 },
    tower3: { img: [towerArt(2)], w: 3, h: 2 },
    spire: { img: [spireArt()], w: 2, h: 2 },
    dome: { img: [domeArt()], w: 3, h: 2 },
    tree: { img: [treeArt(0)], w: 1, h: 1 },
    frond: { img: [treeArt(1)], w: 1, h: 1 },
    shroom: { img: [shroomArt()], w: 2, h: 1 },
    crystal: { img: [crystalArt(0)], w: 1, h: 1 },
    crystal2: { img: [crystalArt(1)], w: 1, h: 1 },
    crystal3: { img: [crystalArt(2)], w: 1, h: 1 },
    rock: { img: [rockArt(false)], w: 1, h: 1 },
    boulder: { img: [rockArt(true)], w: 2, h: 1 },
    lamp: { img: two(lampArt), w: 1, h: 1, anim: 30 },
    fountain: { img: [fountainArt(0), fountainArt(1), fountainArt(2), fountainArt(3)], w: 2, h: 2, anim: 8 },
    ship: { img: [shipArt()], w: 4, h: 2 },
    podTiger: { img: [podArt('tiger', false), podArt('empty', true)], w: 1, h: 1 },
    podDragon: { img: [podArt('dragonR', false), podArt('empty', true)], w: 1, h: 1 },
    podOcto: { img: [podArt('octo', false), podArt('empty', true)], w: 1, h: 1 },
    sign: { img: [signArt()], w: 1, h: 1 },
    stall: { img: two(stallArt), w: 2, h: 1, anim: 40 },
    planet: { img: [planetArt()], w: 0, h: 0, deco: true },
    moon: { img: [moonArt()], w: 0, h: 0, deco: true },
    bush: { img: [bushArt()], w: 1, h: 1 },
    scrap: { img: [scrapArt()], w: 2, h: 1 },
  };
}
