/* The game itself: a stack of scenes (title, world, battle, menus...), a fixed 60 frames-a-second
   update, fades and screen shake, the save file, and little helpers the story scripts await
   (say, ask, wait). The console shell (src/console) owns the canvas, the buttons and the sound switch. */
import { W, H } from '../engine/pixel.js';
import { text } from '../engine/font.js';
import { Dialog, Menu, Toast, C } from './ui.js';
import { playMusic, sfx } from '../engine/audio.js';
import { movesAt } from './data.js';

const SAVE_KEY = 'cosmic-castaways.save.v1';
const SETTINGS_KEY = 'cosmic-castaways.settings.v1';

export function readJSON(key) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : null; } catch (e) { return null; }
}
export function writeJSON(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (e) { return false; }
}

/* bring an older save up to date: there's one hero now (no boy / girl choice), memories, COSMIC TUBES,
   and companions know every move up to their level (NOVA's HEALING LICK is new) */
export function migrate(st) {
  if (!st || typeof st !== 'object') return null;
  if ((st.v || 1) < 2) {
    delete st.gender;
    const f = st.flags || (st.flags = {}), mem = [];
    if (f.awake) mem.push('fire');
    if (st.pet) mem.push('name');
    if (f.enya) mem.push('gem');
    st.memories = mem;
  }
  st.memories = st.memories || [];
  st.tubes = st.tubes || {};
  st.captures = st.captures || 0;
  st.bag = Object.assign({ berry: 0, tonic: 0, melon: 0, tube: 0, catnip: 0 }, st.bag || {});
  st.furyT = st.furyT || 0;
  st.parts = st.parts || {};
  // v3 (Chapter 2): CODY can teach a move, which is kept as well as the ones learned by level
  if (st.pet) { st.pet.taught = st.pet.taught || []; st.pet.moves = movesAt(st.pet.species, st.pet.variant, st.pet.lv, st.pet.taught); }
  st.v = 3;
  return st;
}

/* the screen palettes the SCREEN switch on the console flips between */
export const SCREENS = {
  colour: null,
  classic: ['#0f380f', '#306230', '#8bac0f', '#c4d93a'],
  pocket: ['#1e1e24', '#5a5a66', '#a8a8b4', '#e8e8ee'],
  violet: ['#1a0f2e', '#4a2a8a', '#9a6ae0', '#e6d8ff'],
};
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export class Game {
  constructor(canvas, input, hooks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.ctx.imageSmoothingEnabled = false;
    this.input = input;
    this.hooks = hooks;
    this.scenes = [];
    this.t = 0;
    this.waiters = [];
    this.fadeLevel = 0;
    this.fadeColour = '#000000';
    this.shakeT = 0;
    this.shakeAmt = 0;
    this.toasts = [];
    this.flashT = 0;
    this.flashColour = '#ffffff';
    this.settings = Object.assign({ textSpeed: 'normal', screen: 'colour' }, readJSON(SETTINGS_KEY) || {});
    this.state = null;
    this.paused = false;
    this.beatHud = false;   // in the Jelly Jam: the console's speaker pumps along to the music
    this.speed = 1;         // 1, 3 or 5 game updates per frame (the console's speed button, or F)
    this.lut = null;
    this.setScreen(this.settings.screen);
  }

  /* ---------- scenes ---------- */
  get top() { return this.scenes[this.scenes.length - 1]; }
  push(scene) { this.scenes.push(scene); this.input.clear(); if (scene.enter) scene.enter(this); return scene; }
  pop(scene) {
    const i = scene ? this.scenes.lastIndexOf(scene) : this.scenes.length - 1;
    if (i >= 0) { const [s] = this.scenes.splice(i, 1); if (s.leave) s.leave(this); }
    this.input.clear();
  }
  replace(scene) { while (this.scenes.length) this.pop(); return this.push(scene); }

  /* ---------- helpers the scripts await ---------- */
  wait(frames) { return this.until(() => frames-- <= 0); }
  until(test) { return new Promise((resolve) => this.waiters.push({ test, resolve })); }
  say(str, opt = {}) {
    return new Promise((resolve) => { const d = new Dialog(this, str, opt); d.done = resolve; this.push(d); });
  }
  menu(items, opt = {}) {
    return new Promise((resolve) => { const m = new Menu(this, items, opt); m.done = resolve; this.push(m); });
  }
  /* a question in the dialogue box with a little menu of answers */
  async ask(str, answers = ['YES', 'NO'], opt = {}) {
    const d = new Dialog(this, str, opt);
    d.chars = 0;
    this.push(d);
    d.update = (g) => {   // types out, then waits for the menu below instead of A
      const speed = { slow: 1, normal: 2, fast: 4 }[g.settings.textSpeed] || 2;
      if (d.chars < d.total) { d.chars = Math.min(d.total, d.chars + speed * 0.5); if (g.input.pressed.a) d.chars = d.total; }
    };
    await this.until(() => d.chars >= d.total);
    const w = Math.max(...answers.map((a) => a.length)) * 5 + 24;
    const i = await this.menu(answers, { x: W - w - 4, y: H - 48 - answers.length * 11 - 9, w, noCancel: !!opt.noCancel });
    this.pop(d);
    return i;
  }
  toast(str, colour = C.text) { this.toasts.push(new Toast(str, colour)); if (this.toasts.length > 3) this.toasts.shift(); }
  /* someone said "Em" or "Gem": every scene that cares (the world, a battle) shows the tiger's hearts */
  love() { for (const s of this.scenes) if (s.onLove) s.onLove(this); }
  shake(frames = 12, amt = 2) { this.shakeT = frames; this.shakeAmt = amt; }
  flash(colour = '#ffffff', frames = 10) { this.flashColour = colour; this.flashT = frames; this.flashMax = frames; }
  async fade(to, frames = 16, colour = '#000000') {
    this.fadeColour = colour;
    const from = this.fadeLevel;
    for (let i = 1; i <= frames; i++) { this.fadeLevel = from + (to - from) * (i / frames); await this.wait(1); }
    this.fadeLevel = to;
  }
  music(name, opt) { playMusic(name, opt); }
  sfx(name, ...a) { if (sfx[name]) sfx[name](...a); }

  /* ---------- save file ---------- */
  hasSave() { return !!readJSON(SAVE_KEY); }
  load() { this.state = migrate(readJSON(SAVE_KEY)); return this.state; }
  save() { if (this.state) { this.state.savedAt = Date.now(); return writeJSON(SAVE_KEY, this.state); } return false; }
  deleteSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
  saveSettings() { writeJSON(SETTINGS_KEY, this.settings); }
  setScreen(name) {
    if (!(name in SCREENS)) name = 'colour';
    this.settings.screen = name;
    const pal = SCREENS[name];
    this.lut = pal ? pal.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]) : null;
  }

  /* ---------- the loop ---------- */
  update() {
    this.input.update();
    this.t++;
    if (this.state) this.state.playMs = (this.state.playMs || 0) + 1000 / 60;
    const top = this.top;
    if (top && top.update) top.update(this);
    for (const s of this.scenes) if (s !== top && s.tick) s.tick(this);
    const ws = this.waiters;
    this.waiters = [];
    for (const w of ws) { if (w.test()) w.resolve(); else this.waiters.push(w); }
    for (const t of this.toasts) t.age++;
    this.toasts = this.toasts.filter((t) => t.age < t.life);
    if (this.shakeT > 0) this.shakeT--;
    if (this.flashT > 0) this.flashT--;
  }
  draw() {
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    if (this.shakeT > 0) ctx.translate(Math.round((Math.random() * 2 - 1) * this.shakeAmt), Math.round((Math.random() * 2 - 1) * this.shakeAmt));
    let from = 0;
    for (let i = this.scenes.length - 1; i >= 0; i--) if (this.scenes[i].opaque !== false) { from = i; break; }
    for (let i = from; i < this.scenes.length; i++) {
      const s = this.scenes[i];
      if (s.draw) { ctx.save(); s.draw(ctx, this); ctx.restore(); }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.toasts.forEach((t, i) => t.draw(ctx, i));
    if (this.flashT > 0) { ctx.globalAlpha = this.flashT / this.flashMax; ctx.fillStyle = this.flashColour; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    if (this.fadeLevel > 0) { ctx.globalAlpha = Math.min(1, this.fadeLevel); ctx.fillStyle = this.fadeColour; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    if (this.speed > 1) text(ctx, '▶▶' + this.speed + 'x', 3, H - 9, C.gold, { outline: C.ink });   // fast-forward is on
    if (this.lut) this.recolour();
  }
  /* the four-shade screens: brightness bands with a little ordered dither */
  recolour() {
    const img = this.ctx.getImageData(0, 0, W, H), d = img.data, lut = this.lut;
    for (let y = 0, i = 0; y < H; y++) {
      for (let x = 0; x < W; x++, i += 4) {
        const l = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114 + (BAYER[(y & 3) * 4 + (x & 3)] - 7.5) * 2.2;
        const c = lut[l < 48 ? 0 : l < 98 ? 1 : l < 152 ? 2 : 3];
        d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
      }
    }
    this.ctx.putImageData(img, 0, 0);
  }
}
