/* Pixel helpers: turning letter-grid art into little canvases, a "painter" for drawing sprites from
   simple shapes (then outlining and shading them like hand-made pixel art), and seeded randomness so
   the procedural tiles look the same every time. */

export const W = 160;   // the NOVA-8's screen: 160 x 144 pixels, 10 x 9 tiles of 16 px
export const H = 144;
export const T = 16;

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/* A sprite from rows of letters ('.' = transparent) and a palette { letter: '#rrggbb' }.
   Drawn once per palette and direction, then kept. */
const cache = new WeakMap();
export function spr(rows, pal, flip = false) {
  let byPal = cache.get(rows);
  if (!byPal) { byPal = new Map(); cache.set(rows, byPal); }
  let entry = byPal.get(pal);
  if (!entry) { entry = {}; byPal.set(pal, entry); }
  const k = flip ? 'f' : 'n';
  if (entry[k]) return entry[k];
  let w = 0;
  for (const r of rows) w = Math.max(w, r.length);
  const h = rows.length;
  const c = makeCanvas(w || 1, h || 1);
  const g = c.getContext('2d');
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const col = pal[ch];
      if (!col) continue;
      g.fillStyle = col;
      g.fillRect(flip ? w - 1 - x : x, y, 1, 1);
    }
  }
  entry[k] = c;
  return c;
}

/* a filled circle in crisp pixels (canvas arcs would blur them) */
export function disc(ctx, cx, cy, r, col) {
  ctx.fillStyle = col;
  for (let dy = -r; dy <= r; dy++) { const w = Math.floor(Math.sqrt(r * r - dy * dy + r * 0.8)); ctx.fillRect(cx - w, cy + dy, w * 2 + 1, 1); }
}

/* Multi-line art written as a template string: one row per line, spaces trimmed. */
export function art(str) {
  return str.split('\n').map((s) => s.trim()).filter((s) => s.length);
}

/* Swap letters in art rows: recolour({ O: 'G' }) etc. */
export function remap(rows, map) {
  return rows.map((r) => r.replace(/./g, (c) => (map[c] !== undefined ? map[c] : c)));
}

/* ---------- seeded randomness ---------- */
export function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hash(x, y, s = 0) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/* ---------- colours ---------- */
export function hex2rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgb2hex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
/* towards white (amount > 0) or black (amount < 0) */
export function shade(hex, amount) {
  const [r, g, b] = hex2rgb(hex);
  const f = (c) => (amount > 0 ? c + (255 - c) * amount : c * (1 + amount));
  return rgb2hex(f(r), f(g), f(b));
}
export function mix(a, b, t) {
  const A = hex2rgb(a), B = hex2rgb(b);
  return rgb2hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}

/* ---------- the painter: sprites from shapes ----------
   Works on a grid of letters, so the result goes through spr() like hand-drawn art. */
export function painter(w, h) {
  const px = new Array(w * h).fill('.');
  const P = {
    w, h,
    get(x, y) { return x < 0 || y < 0 || x >= w || y >= h ? '.' : px[y * w + x]; },
    set(x, y, c) {
      x = Math.floor(x); y = Math.floor(y);
      if (x >= 0 && y >= 0 && x < w && y < h) px[y * w + x] = c;
      return P;
    },
    rect(x, y, rw, rh, c) {
      for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) P.set(x + i, y + j, c);
      return P;
    },
    ellipse(cx, cy, rx, ry, c) {
      for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) {
        for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
          const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
          if (dx * dx + dy * dy <= 1) P.set(x, y, c);
        }
      }
      return P;
    },
    poly(pts, c) {
      let minY = Infinity, maxY = -Infinity;
      for (const [, y] of pts) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
      for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
        const yc = y + 0.5, xs = [];
        for (let i = 0; i < pts.length; i++) {
          const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
          if ((y0 <= yc && y1 > yc) || (y1 <= yc && y0 > yc)) xs.push(x0 + ((yc - y0) / (y1 - y0)) * (x1 - x0));
        }
        xs.sort((a, b) => a - b);
        for (let k = 0; k + 1 < xs.length; k += 2) {
          for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) P.set(x, y, c);
        }
      }
      return P;
    },
    line(x0, y0, x1, y1, c) {
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      for (;;) {
        P.set(x0, y0, c);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
      }
      return P;
    },
    paste(rows, ox, oy, flip = false) {
      const rw = Math.max(...rows.map((r) => r.length));
      rows.forEach((r, j) => {
        for (let i = 0; i < r.length; i++) {
          if (r[i] !== '.' && r[i] !== ' ') P.set(ox + (flip ? rw - 1 - i : i), oy + j, r[i]);
        }
      });
      return P;
    },
    /* rim shadow: pixels of colour c whose neighbour towards (dx, dy) is empty become d */
    shade(c, d, dx = 1, dy = 1, depth = 1) {
      const out = [];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (px[y * w + x] !== c) continue;
        for (let k = 1; k <= depth; k++) {
          if (P.get(x + dx * k, y + dy * k) === '.') { out.push([x, y]); break; }
        }
      }
      for (const [x, y] of out) px[y * w + x] = d;
      return P;
    },
    /* everything of colour c below the line y = y0 + slope * x becomes d (a belly, a shaded half) */
    recolour(c, d, test) {
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[y * w + x] === c && test(x, y)) px[y * w + x] = d;
      return P;
    },
    /* a 1-pixel outline round every filled pixel */
    outline(c = 'K', diag = false) {
      const out = [];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (px[y * w + x] !== '.') continue;
        const n = P.get(x - 1, y) !== '.' || P.get(x + 1, y) !== '.' || P.get(x, y - 1) !== '.' || P.get(x, y + 1) !== '.' ||
          (diag && (P.get(x - 1, y - 1) !== '.' || P.get(x + 1, y - 1) !== '.' || P.get(x - 1, y + 1) !== '.' || P.get(x + 1, y + 1) !== '.'));
        if (n) out.push([x, y]);
      }
      for (const [x, y] of out) px[y * w + x] = c;
      return P;
    },
    rows() {
      const r = [];
      for (let y = 0; y < h; y++) r.push(px.slice(y * w, y * w + w).join(''));
      return r;
    },
  };
  return P;
}
