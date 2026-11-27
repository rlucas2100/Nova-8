/* On-screen UI: text boxes, the dialogue box with its typewriter text, menus and yes/no choices.
   Each one is a small scene pushed on top of the current one; await it to get the answer. */
import { W, H } from '../engine/pixel.js';
import { text, wrap, measure, LINE_H } from '../engine/font.js';
import { sfx } from '../engine/audio.js';

export const C = {
  bg: '#140c2a', bg2: '#22163f', edge: '#b48cff', edgeDark: '#4a2a8a', text: '#f8f4ff', dim: '#9a8cc8',
  gold: '#ffd23a', red: '#ff5c6c', green: '#5fe07a', cyan: '#5ff2ff', ink: '#1a0f2e',
};

/* a framed box: dark fill, a light border, rounded corners */
export function box(ctx, x, y, w, h, opt = {}) {
  ctx.fillStyle = opt.bg || C.bg;
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.fillStyle = opt.edge || C.edge;
  ctx.fillRect(x + 2, y, w - 4, 1); ctx.fillRect(x + 2, y + h - 1, w - 4, 1);
  ctx.fillRect(x, y + 2, 1, h - 4); ctx.fillRect(x + w - 1, y + 2, 1, h - 4);
  ctx.fillRect(x + 1, y + 1, 1, 1); ctx.fillRect(x + w - 2, y + 1, 1, 1);
  ctx.fillRect(x + 1, y + h - 2, 1, 1); ctx.fillRect(x + w - 2, y + h - 2, 1, 1);
  ctx.fillStyle = opt.inner || C.edgeDark;
  ctx.fillRect(x + 2, y + 1, w - 4, 1);
  ctx.fillRect(x + 2, y + h - 2, w - 4, 1);
}

/* a bar (HP / EN / XP) */
export function bar(ctx, x, y, w, frac, col, back = '#3a2a5a') {
  ctx.fillStyle = C.ink; ctx.fillRect(x - 1, y - 1, w + 2, 5);
  ctx.fillStyle = back; ctx.fillRect(x, y, w, 3);
  ctx.fillStyle = col; ctx.fillRect(x, y, Math.max(0, Math.round(w * Math.max(0, Math.min(1, frac)))), 3);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x, y, Math.max(0, Math.round(w * Math.max(0, Math.min(1, frac)))), 1);
}
export function hpColour(frac) { return frac > 0.5 ? C.green : frac > 0.2 ? C.gold : C.red; }

/* ---------- dialogue ----------
   text with {gold}, {cyan}... colour tags is not needed: names are in CAPITALS, like old RPGs.
   opt.mutter: your confused, concussed mumbling, typed out slowly (slower still on the dots).
   Any line that says "Em" or "Gem" makes NOVA's heart flutter (game.love). */
const SPEED = { slow: 1, normal: 2, fast: 4 };
const LOVE = /\b(e+m+|g+e+m+)\b/i;
const VOICE_OF = {
  SPRIG: 'robot', 'GATE DRONE': 'robot', ENYA: 'enya', MOSSA: 'low', PEBBLE: 'kid', SKYE: 'kid', BUD: 'kid',
  LUMEN: 'lumen', 'DJ JIGGLE': 'dj', BLOOP: 'jelly', WOBBLE: 'jelly', SQUISH: 'jelly', PLINK: 'jelly', GLOOP: 'jelly', HUM: 'jelly', 'JELLY FERRY': 'jelly',
  CODY: 'cody', 'DRAGON KING': 'dragon', 'WHITE DRAGON': 'dragon', 'BLACK DRAGON': 'dragon', 'CRAB GUARD': 'crab', 'CRAB CAPTAIN': 'crab', 'MR NOLAN': 'low',
};
export class Dialog {
  constructor(game, str, opt = {}) {
    this.game = game;
    this.kind = 'Dialog';
    this.name = opt.name || null;
    this.lines = wrap(str, W - 20);
    this.pages = [];
    for (let i = 0; i < this.lines.length; i += 3) this.pages.push(this.lines.slice(i, i + 3));
    this.page = 0;
    this.chars = 0;
    this.done = null;
    this.opaque = false;
    this.auto = opt.auto || 0;
    this.t = 0;
    this.mutter = !!opt.mutter;
    this.more = opt.more !== undefined ? !!opt.more : !this.auto;   // the ▼ that says A moves on
    this.voice = this.mutter ? 'mutter' : opt.voice || VOICE_OF[this.name] || 'default';
    if (LOVE.test(str) && game.love) game.love();
  }
  get current() { return this.pages[this.page] || []; }
  get total() { return this.current.reduce((n, l) => n + l.length, 0); }
  update(g) {
    const inp = g.input;
    this.t++;
    let speed = SPEED[g.settings.textSpeed] || 2;
    if (this.mutter) { const next = this.current.join('')[Math.floor(this.chars)]; speed *= next === '.' ? 0.15 : 0.45; }
    if (this.chars < this.total) {
      const before = Math.floor(this.chars);
      this.chars = Math.min(this.total, this.chars + speed * 0.5);
      if (Math.floor(this.chars) !== before && Math.floor(this.chars) % 2 === 0) sfx.voice(this.voice);
      if (inp.pressed.a || inp.pressed.b) this.chars = this.total;
      return;
    }
    this.typed = (this.typed || 0) + 1;
    if (inp.pressed.a || inp.pressed.b || (this.auto && this.typed > this.auto)) {
      if (this.page < this.pages.length - 1) { this.page++; this.chars = 0; this.t = 0; this.typed = 0; sfx.blip(); }
      else { g.pop(this); this.done && this.done(); }
    }
  }
  draw(ctx, g) {
    const y = H - 44;
    box(ctx, 2, y, W - 4, 42);
    if (this.name) {
      const w = measure(this.name) + 10;
      box(ctx, 6, y - 11, w, 13, { bg: C.bg2 });
      text(ctx, this.name, 11, y - 8, C.gold);
    }
    let left = Math.floor(this.chars);
    this.current.forEach((line, i) => {
      if (left <= 0) return;
      text(ctx, line.slice(0, left), 10, y + 7 + i * LINE_H, this.mutter ? '#cdb8ff' : C.text);
      left -= line.length;
    });
    if (this.chars >= this.total && this.more && Math.floor(g.t / 16) % 2 === 0) text(ctx, '▼', W - 16, y + 33, C.gold);
  }
}

/* ---------- menus ----------
   items: strings or { label, disabled, right (text on the right), hint }.
   Resolves with the chosen index, or -1 for B (unless noCancel). */
export class Menu {
  constructor(game, items, opt = {}) {
    this.game = game;
    this.kind = 'Menu';
    this.items = items.map((it) => (typeof it === 'string' ? { label: it } : it));
    this.index = opt.index || 0;
    this.x = opt.x ?? (W - 4 - (opt.w || 64));
    this.y = opt.y ?? 4;
    this.w = opt.w || Math.max(48, ...this.items.map((it) => measure(it.label) + (it.right ? measure(it.right) + 14 : 0) + 22));
    this.rowH = opt.rowH || 11;
    this.visible = opt.visible || this.items.length;
    this.h = opt.h || this.visible * this.rowH + 9;
    this.noCancel = !!opt.noCancel;
    this.title = opt.title || null;
    this.cols = opt.cols || 1;
    this.done = null;
    this.opaque = false;
    this.scroll = 0;
    this.onMove = opt.onMove || null;
    this.under = opt.under || null;   // draw something (a description) while this menu is open
  }
  update(g) {
    const inp = g.input, n = this.items.length;
    const old = this.index;
    if (this.cols > 1) {
      if (inp.repeat('right') && this.index % this.cols < this.cols - 1 && this.index + 1 < n) this.index++;
      if (inp.repeat('left') && this.index % this.cols > 0) this.index--;
      if (inp.repeat('down') && this.index + this.cols < n) this.index += this.cols;
      if (inp.repeat('up') && this.index - this.cols >= 0) this.index -= this.cols;
    } else {
      if (inp.repeat('down')) this.index = (this.index + 1) % n;
      if (inp.repeat('up')) this.index = (this.index + n - 1) % n;
    }
    if (old !== this.index) { sfx.move(); this.onMove && this.onMove(this.index); }
    if (this.index < this.scroll) this.scroll = this.index;
    if (this.index >= this.scroll + this.visible) this.scroll = this.index - this.visible + 1;
    if (inp.pressed.a) {
      if (this.items[this.index].disabled) { sfx.bump(); return; }
      sfx.select(); g.pop(this); this.done && this.done(this.index);
    } else if (inp.pressed.b && !this.noCancel) {
      sfx.cancel(); g.pop(this); this.done && this.done(-1);
    }
  }
  draw(ctx, g) {
    if (this.under) this.under(ctx, this.index);
    let y0 = this.y;
    if (this.title) {
      box(ctx, this.x, this.y, this.w, 14, { bg: C.bg2 });
      text(ctx, this.title, this.x + 7, this.y + 4, C.gold);
      y0 += 13;
    }
    box(ctx, this.x, y0, this.w, this.h);
    const colW = Math.floor((this.w - 8) / this.cols);
    for (let k = 0; k < Math.min(this.visible * this.cols, this.items.length); k++) {
      const i = k + this.scroll * this.cols;
      if (i >= this.items.length) break;
      const it = this.items[i];
      const cx = this.x + 6 + (k % this.cols) * colW, cy = y0 + 5 + Math.floor(k / this.cols) * this.rowH;
      const col = it.disabled ? C.dim : (it.colour || C.text);
      if (i === this.index) text(ctx, '▶', cx, cy, C.gold);
      text(ctx, it.label, cx + 8, cy, col);
      if (it.right) text(ctx, it.right, this.x + this.w - 7, cy, it.disabled ? C.dim : C.cyan, { align: 'right' });
    }
    if (this.scroll > 0) text(ctx, '↑', this.x + this.w - 9, y0 + 2, C.dim);
    if (this.scroll + this.visible < this.items.length) text(ctx, '↓', this.x + this.w - 9, y0 + this.h - 10, C.dim);
  }
}

/* a little label that floats up and fades (for "+1 RUBY" etc.) */
export class Toast {
  constructor(str, colour = C.text, frames = 110) { this.str = str; this.colour = colour; this.life = frames; this.age = 0; }
  draw(ctx, i) {
    const t = this.age, w = measure(this.str) + 14, x = Math.floor((W - w) / 2);
    const y = 4 + i * 16 - (t < 8 ? 8 - t : 0) - (t > this.life - 8 ? t - (this.life - 8) : 0);
    box(ctx, x, y, w, 14, { bg: C.bg2 });
    text(ctx, this.str, x + 7, y + 4, this.colour);
  }
}
