/* Title screen, the crash, making your character, the START menu screens and the end of Chapter 1. */
import { W, H, spr, hash } from '../engine/pixel.js';
import { text, measure, wrap } from '../engine/font.js';
import { box, bar, hpColour, C } from './ui.js';
import { sfx, playMusic, stopMusic, currentMusic, boardPlay, boardStop, nowPlaying } from '../engine/audio.js';
import { SOUNDS } from '../engine/soundlist.js';
import { TRACKS } from '../engine/music.js';
import * as CH from '../art/chars.js';
import { BATTLERS } from '../art/battlers.js';
import { buildProps } from '../art/tiles.js';
import { World } from './world.js';
import { SCRIPTS } from './story.js';
import { MOVES, ITEMS, JEWELS, PARTS, COMPANIONS, BLUE_DRAGON, statsAt, companionStats, companionArt, xpToNext, MAX_EN } from './data.js';

const rnd = (a, b) => a + Math.random() * (b - a);

let PLANET = null;
const planet = () => PLANET || (PLANET = buildProps().planet.img[0]);

export function newState(name, gender) {
  return {
    v: 1, name, gender, map: 'bloomhaven', x: 4, y: 5, dir: 'up',
    pet: null, riding: false, flags: {}, got: {}, parts: {},
    jewels: { gold: 0, emerald: 0, sapphire: 0, ruby: 0, diamond: 0 }, money: 0,
    bag: { berry: 0, tonic: 0, melon: 0 },
    respawn: { map: 'bloomhaven', x: 14, y: 12, dir: 'up' },
    steps: 0, battles: 0, playMs: 0, started: Date.now(),
    goal: 'Find out where you are.',
  };
}

/* a starfield that drifts (title, intro, ending) */
function stars(ctx, t, speed = 0.3, n = 70) {
  for (let i = 0; i < n; i++) {
    const depth = 0.3 + hash(i, 0, 1) * 0.7;
    const x = (hash(i, 1, 1) * W * 2 - t * speed * depth) % W;
    const y = hash(i, 2, 1) * H;
    const tw = (Math.floor(t / 8) + i) % 9 === 0;
    ctx.fillStyle = tw ? '#ffffff' : depth > 0.75 ? '#e6d8ff' : depth > 0.5 ? '#b48cff' : '#6a40c0';
    ctx.fillRect(Math.floor(x < 0 ? x + W : x), Math.floor(y), 1, 1);
  }
}
function sky(ctx, top = '#140832', mid = '#2e1660', low = '#4a2a8a') {
  for (let y = 0; y < H; y++) {
    const t = y / H;
    ctx.fillStyle = t < 0.45 ? top : t < 0.75 ? mid : low;
    if ((t > 0.42 && t < 0.48 && (y % 2)) || (t > 0.72 && t < 0.78 && (y % 2))) ctx.fillStyle = t < 0.6 ? mid : low;
    ctx.fillRect(0, y, W, 1);
  }
}
function comet(ctx, x, y, t, tilt = 0) {
  // the little star-skiff, 22 x 10
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (tilt) ctx.rotate(tilt);
  ctx.fillStyle = '#1a0f2e'; ctx.fillRect(-11, -4, 22, 9);
  ctx.fillStyle = '#e8e6f6'; ctx.fillRect(-10, -3, 19, 7); ctx.fillRect(9, -2, 2, 5);
  ctx.fillStyle = '#a8a4c8'; ctx.fillRect(-10, 2, 19, 2);
  ctx.fillStyle = '#ff8a1e'; ctx.fillRect(-10, 0, 19, 1); ctx.fillRect(-12, -6, 4, 3); ctx.fillRect(-12, 4, 4, 3);
  ctx.fillStyle = '#5fb8e8'; ctx.fillRect(3, -2, 4, 2); ctx.fillStyle = '#bff0ff'; ctx.fillRect(4, -2, 1, 1);
  const fl = ['#ffffff', '#ffd23a', '#ff8a1e'];
  for (let i = 0; i < 3; i++) { ctx.fillStyle = fl[i]; ctx.fillRect(-13 - i * 2 - (t % 4 < 2 ? 1 : 0), -1 + (i === 2 ? 0 : 0), 2, 3 - (i === 2 ? 1 : 0)); }
  ctx.restore();
}

/* ---------- title ---------- */
export class Title {
  constructor(game) { this.kind = 'Title'; this.game = game; this.opaque = true; this.t = 0; this.ready = false; }
  enter() { playMusic('title'); }
  update(g) {
    this.t++;
    if (this.busy) return;
    if (g.input.pressed.a || g.input.pressed.start) { sfx.select(); this.busy = true; this.menu().finally(() => { this.busy = false; }); }
  }
  async menu() {
    const g = this.game, has = g.hasSave();
    const items = has ? ['CONTINUE', 'NEW GAME', 'SOUND TEST', 'CONTROLS'] : ['NEW GAME', 'SOUND TEST', 'CONTROLS'];
    this.menuOpen = true;
    const i = await g.menu(items, { x: 44, y: 82, w: 72 });
    this.menuOpen = false;
    const pick = items[i];
    if (!pick) return;
    if (pick === 'CONTROLS') { await showControls(g); return; }
    if (pick === 'SOUND TEST') { await new Promise((resolve) => g.push(new SoundTest(g, resolve))); playMusic('title', { restart: true }); return; }
    if (pick === 'CONTINUE') {
      const st = g.load();
      if (!st) return;
      await g.fade(1, 16);
      const w = new World(g, st.map, st.x, st.y, st.dir);
      g.replace(w);
      await g.fade(0, 16);
      if (!st.flags.awake) w.run(SCRIPTS.wakeUp);
      return;
    }
    if (has) {
      const sure = await g.ask('Start a new game? Your saved adventure will be replaced when you next save.', ['NEW GAME', 'CANCEL']);
      if (sure !== 0) return;
    }
    await g.fade(1, 16);
    g.replace(new Intro(g));
    await g.fade(0, 10);
  }
  draw(ctx, g) {
    const t = this.t;
    sky(ctx);
    stars(ctx, t, 0.15);
    // the planet rising at the bottom
    const pl = planet();
    ctx.drawImage(pl, 0, 0, pl.width, pl.height, 52, 96 + Math.round(Math.sin(t / 50) * 2), pl.width * 2, pl.height * 2);
    // the comet streaking across now and then
    const k = t % 420;
    if (k < 120) comet(ctx, -20 + k * 1.6, 30 + k * 0.25, t);
    // the logo
    const bob = Math.round(Math.sin(t / 30) * 1.5);
    text(ctx, 'COSMIC', W / 2, 16 + bob, '#ffd23a', { scale: 2, outline: '#1a0f2e', align: 'center' });
    text(ctx, 'CASTAWAYS', W / 2, 36 + bob, '#8ff0ff', { scale: 2, outline: '#1a0f2e', align: 'center' });
    text(ctx, 'CHAPTER 1: CRASH LANDING', W / 2, 58, '#e6d8ff', { align: 'center', shadow: '#1a0f2e' });
    // the three companions on a ledge
    const pal = CH.OCTO_PALS[Math.floor(t / 8) % CH.OCTO_PALS.length];
    const fr = Math.floor(t / 20) % 2;
    ctx.drawImage(spr(CH.TIGER.down[0], CH.TIGER_PAL), 44, 70);
    ctx.drawImage(spr(CH.DRAGON.down[fr ? 1 : 0], CH.DRAGON_PAL.red), 72, 68 + (fr ? -1 : 0));
    ctx.drawImage(spr(CH.OCTO.down[fr], pal), 100, 70);
    if (!this.menuOpen && Math.floor(t / 24) % 2 === 0) text(ctx, 'PRESS START', W / 2, 100, '#ffffff', { align: 'center', outline: '#1a0f2e' });
    text(ctx, '© 2026 RYAN LUCAS', W / 2, 134, '#9a8cc8', { align: 'center', shadow: '#1a0f2e' });
  }
}

export async function showControls(g) {
  await g.say('MOVE: W A S D, the arrow keys, or the D-pad.\nA: SPACE, J, Z or ENTER (talk, choose).\nB: K, X or BACKSPACE (back).');
  await g.say('START: ESC or P (menu, pause).\nSELECT: SHIFT or Q (hop on or off your companion).\nA gamepad works too. On a phone, tap the console buttons.');
}

/* ---------- the crash ---------- */
export class Intro {
  constructor(game) { this.game = game; this.opaque = true; this.t = 0; this.phase = 0; this.shipX = -20; this.shipY = 58; this.meteors = []; this.go(); }
  enter() { playMusic('intro'); }
  async go() {
    const g = this.game;
    const s = (str) => g.say(str, { auto: 70 });
    await g.wait(30);
    if (this.skipped) return;
    await s('Far, far away from Earth...');
    if (this.skipped) return;
    await s('Your little star-skiff, the COMET, is cruising home past the purple planet KIRRA.');
    if (this.skipped) return;
    this.phase = 1;
    sfx.zap();
    await g.wait(50);
    if (this.skipped) return;
    this.phase = 2;
    await s('WARNING! WARNING! METEOR STORM!');
    if (this.skipped) return;
    this.phase = 3;
    sfx.crash();
    g.shake(40, 3);
    g.flash('#ff5a3a', 20);
    await g.wait(40);
    if (this.skipped) return;
    await s('MAYDAY! MAYDAY! The COMET is going down!');
    if (this.skipped) return;
    this.phase = 4;
    await g.wait(90);
    if (this.skipped) return;
    sfx.crash();
    g.flash('#ffffff', 40);
    g.shake(30, 4);
    this.phase = 5;
    await g.wait(60);
    if (this.skipped) return;
    await this.finish();
  }
  async finish() {
    const g = this.game;
    if (this.finishing) return;
    this.finishing = true;
    await g.fade(1, 20);
    stopMusic();
    g.replace(new Create(g));
    await g.fade(0, 16);
  }
  update(g) { this.tick(g); }
  tick(g) {
    this.t++;
    if (g.input.pressed.start && !this.finishing) { this.skipped = true; while (g.top !== this && g.scenes.length > 1) g.pop(); this.finish(); return; }
    if (this.phase >= 1 && this.phase <= 4 && this.t % 6 === 0) this.meteors.push({ x: W + 10, y: Math.random() * 90, vx: -(2 + Math.random() * 2), vy: 0.6 + Math.random() * 0.6, s: 1 + Math.floor(Math.random() * 3) });
    for (const m of this.meteors) { m.x += m.vx; m.y += m.vy; }
    this.meteors = this.meteors.filter((m) => m.x > -20 && m.y < H + 10);
    if (this.phase === 0 || this.phase === 1 || this.phase === 2) this.shipX = Math.min(70, this.shipX + 0.6);
    if (this.phase === 3) { this.shipX += 0.3; this.shipY += 0.15; }
    if (this.phase === 4) { this.shipX += 0.6; this.shipY += 0.7; }
  }
  draw(ctx, g) {
    const t = this.t;
    sky(ctx, '#0c0420', '#1c0c3a', '#2e1660');
    stars(ctx, t, this.phase >= 3 ? 1.2 : 0.4);
    const pl = planet();
    const grow = this.phase >= 4 ? Math.min(4, 2 + (t % 1000) / 60) : 2;
    const ps = this.phase >= 3 ? 3 : 2;
    ctx.drawImage(pl, 0, 0, pl.width, pl.height, W - 60 - (ps - 2) * 30, 70 - (ps - 2) * 10, pl.width * ps, pl.height * ps);
    for (const m of this.meteors) {
      ctx.fillStyle = '#ff8a3a'; ctx.fillRect(Math.round(m.x), Math.round(m.y), m.s + 1, m.s + 1);
      ctx.fillStyle = '#ffd23a'; for (let i = 1; i < 6; i++) ctx.fillRect(Math.round(m.x - m.vx * i), Math.round(m.y - m.vy * i), 1, 1);
    }
    if (this.phase < 5) {
      const shake = this.phase >= 2 ? Math.round(Math.sin(t) * 1) : 0;
      comet(ctx, this.shipX, this.shipY + shake + Math.round(Math.sin(t / 12) * 1), t, this.phase >= 3 ? Math.min(0.9, (t % 2000) * 0.004) : 0);
      if (this.phase >= 3) for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#5a4e6e' : '#8a7aa0'; ctx.fillRect(Math.round(this.shipX - 10 - i * 4), Math.round(this.shipY - 2 - i * 2.5 + Math.sin(t / 3 + i)), 3, 3); }
    }
    if (this.phase === 2 && Math.floor(t / 10) % 2) { ctx.fillStyle = 'rgba(255,40,60,0.25)'; ctx.fillRect(0, 0, W, H); }
    text(ctx, 'START: skip', W - 4, 4, '#6a5a9a', { align: 'right' });
  }
}

/* ---------- making your character ---------- */
const GRID = ['ABCDEFGHI', 'JKLMNOPQR', 'STUVWXYZ-'];
export class Create {
  constructor(game) { this.game = game; this.opaque = true; this.t = 0; this.step = 'who'; this.sel = 0; this.name = ''; this.cx = 0; this.cy = 0; }
  enter() { this.game.say('...Who are you?', { auto: 0 }); }
  get textInput() { return this.step === 'name'; }
  typeChar(ch) {
    if (this.step !== 'name') return;
    if (ch === '\b') { this.name = this.name.slice(0, -1); sfx.cancel(); return; }
    if (ch === '\n') { this.confirm(); return; }
    if (/^[A-Za-z\- ]$/.test(ch) && this.name.length < 7) { this.name += ch.toUpperCase(); sfx.move(); }
  }
  update(g) {
    this.t++;
    const inp = g.input;
    if (this.busy) return;
    if (this.step === 'who') {
      if (inp.pressed.left || inp.pressed.right) { this.sel ^= 1; sfx.move(); }
      if (inp.pressed.a) { sfx.select(); this.gender = this.sel ? 'girl' : 'boy'; this.name = ''; this.step = 'name'; this.cx = 0; this.cy = 0; }
      return;
    }
    if (this.step === 'name') {
      if (inp.repeat('right')) { this.cx = (this.cx + 1) % 9; sfx.move(); }
      if (inp.repeat('left')) { this.cx = (this.cx + 8) % 9; sfx.move(); }
      if (inp.repeat('down')) { this.cy = (this.cy + 1) % 4; sfx.move(); }
      if (inp.repeat('up')) { this.cy = (this.cy + 3) % 4; sfx.move(); }
      if (inp.pressed.b) { if (this.name) { this.name = this.name.slice(0, -1); sfx.cancel(); } else { this.step = 'who'; sfx.cancel(); } }
      if (inp.pressed.start) this.confirm();
      if (inp.pressed.a) {
        if (this.cy === 3) { if (this.cx < 4) { this.name = this.name.slice(0, -1); sfx.cancel(); } else this.confirm(); }
        else if (this.name.length < 7) { this.name += GRID[this.cy][this.cx]; sfx.move(); }
      }
    }
  }
  async confirm() {
    const g = this.game;
    if (this.busy) return;
    this.busy = true;
    if (!this.name.trim()) this.name = this.gender === 'girl' ? 'LUNA' : 'KAI';
    this.name = this.name.trim();
    const ok = await g.ask(`So your name is ${this.name}?`, ['YES', 'NO']);
    if (ok !== 0) { this.busy = false; return; }
    g.state = newState(this.name, this.gender);
    g.save();
    await g.fade(1, 20);
    const w = new World(g, 'bloomhaven', 4, 5, 'up');
    g.replace(w);
    await g.fade(0, 30);
    w.run(SCRIPTS.wakeUp);
  }
  draw(ctx, g) {
    sky(ctx, '#0c0420', '#140832', '#1c0c3a');
    stars(ctx, this.t, 0.1, 40);
    if (this.step === 'who') {
      text(ctx, 'WHO ARE YOU?', W / 2, 14, '#ffd23a', { align: 'center' });
      ['boy', 'girl'].forEach((k, i) => {
        const x = 40 + i * 50, y = 34;
        box(ctx, x - 6, y - 6, 44, 52, { bg: i === this.sel ? '#2e1a5a' : C.bg, edge: i === this.sel ? C.gold : C.edgeDark });
        const fr = i === this.sel ? (Math.floor(this.t / 12) % 2 ? 1 : 2) : 0;
        const img = spr(CH.KID[k].down[fr], CH.KID_PAL[k]);
        ctx.drawImage(img, x, y, 32, 32);
      });
      text(ctx, '← → choose, A to pick', W / 2, 92, '#9a8cc8', { align: 'center' });
      return;
    }
    // the name grid
    const img = spr(CH.KID[this.gender].down[0], CH.KID_PAL[this.gender]);
    ctx.drawImage(img, 12, 8, 32, 32);
    text(ctx, 'YOUR NAME?', 52, 10, '#ffd23a');
    box(ctx, 50, 22, 96, 16, { bg: '#22163f' });
    const shown = this.name + (Math.floor(this.t / 16) % 2 && this.name.length < 7 ? '_' : '');
    text(ctx, shown || (Math.floor(this.t / 16) % 2 ? '_' : ''), 56, 27, '#ffffff');
    box(ctx, 6, 44, W - 12, 64);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) {
      const x = 18 + c * 14, y = 52 + r * 12;
      if (r === this.cy && c === this.cx) text(ctx, '▶', x - 7, y, C.gold);
      text(ctx, GRID[r][c], x, y, '#f8f4ff');
    }
    const y = 52 + 3 * 12;
    if (this.cy === 3) text(ctx, '▶', this.cx < 4 ? 11 : 87, y, C.gold);
    text(ctx, 'DELETE', 18, y, '#ff8a9a');
    text(ctx, 'DONE', 94, y, '#5fe07a');
    wrap('Type with your keyboard, or pick letters with the D-pad and A. Leave it empty for ' + (this.gender === 'girl' ? 'LUNA.' : 'KAI.'), W - 12).forEach((l, i) => text(ctx, l, 6, 114 + i * 10, '#9a8cc8'));
  }
}

/* ---------- the START menu ---------- */
export async function pauseMenu(g, w) {
  const st = g.state;
  let index = 0;
  for (;;) {
    const items = [
      { label: st.pet ? st.pet.name : 'PARTY', disabled: !st.pet },
      'BAG', 'QUEST', 'SAVE', 'OPTIONS', 'CLOSE',
    ];
    const i = await g.menu(items, { x: W - 72, y: 4, w: 68, index });
    if (i < 0 || i === 5) return;
    index = i;
    if (i === 0) await screen(g, new PartyScreen(g));
    if (i === 1) await screen(g, new BagScreen(g, w));
    if (i === 2) await screen(g, new QuestScreen(g));
    if (i === 3) { const ok = g.save(); sfx.save(); await g.say(ok ? 'Your adventure has been saved on this device.' : "Sorry, this browser won't let the game save (private browsing?)."); }
    if (i === 4) await options(g);
  }
}
function screen(g, s) { return new Promise((resolve) => { s.done = resolve; g.push(s); }); }

async function options(g) {
  let idx = 0;
  for (;;) {
    const sp = g.settings.textSpeed, sc = g.settings.screen;
    const i = await g.menu([
      { label: 'TEXT', right: sp.toUpperCase() },
      { label: 'SCREEN', right: sc.toUpperCase() },
      'SOUND TEST', 'CONTROLS', 'BACK',
    ], { x: 30, y: 30, w: 100, index: idx, title: 'OPTIONS' });
    if (i < 0 || i === 4) return;
    idx = i;
    if (i === 0) { const order = ['slow', 'normal', 'fast']; g.settings.textSpeed = order[(order.indexOf(sp) + 1) % 3]; }
    if (i === 1) { const order = ['colour', 'classic', 'pocket', 'violet']; g.setScreen(order[(order.indexOf(sc) + 1) % order.length]); if (g.hooks.screen) g.hooks.screen(g.settings.screen); }
    if (i === 2) await new Promise((resolve) => g.push(new SoundTest(g, resolve)));
    if (i === 3) await showControls(g);
    g.saveSettings();
  }
}

class Page {
  constructor(game) { this.game = game; this.opaque = true; this.t = 0; }
  update(g) { this.t++; if (g.input.pressed.b || g.input.pressed.start) { sfx.cancel(); g.pop(this); this.done && this.done(); } }
  frame(ctx, title) {
    ctx.fillStyle = '#0e0820'; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 4) { ctx.fillStyle = 'rgba(80,40,140,0.12)'; ctx.fillRect(0, y, W, 1); }
    box(ctx, 2, 2, W - 4, 15, { bg: C.bg2 });
    text(ctx, title, 8, 6, C.gold);
    text(ctx, 'B: back', W - 8, 6, C.dim, { align: 'right' });
  }
}

class PartyScreen extends Page {
  constructor(g) { super(g); this.page = 0; }
  update(g) {
    super.update(g);
    if (g.state.flags.enya && (g.input.pressed.left || g.input.pressed.right)) { this.page ^= 1; sfx.move(); }
  }
  draw(ctx, g) {
    const st = g.state, pet = st.pet;
    if (this.page === 1) return this.drawEnya(ctx, g);
    this.frame(ctx, pet.name + ' · ' + COMPANIONS[pet.species].kind + (st.flags.enya ? '   → ENYA' : ''));
    const s = companionStats(pet), b = BATTLERS[companionArt(pet)];
    box(ctx, 4, 20, 44, 44, { bg: '#22163f' });
    let pal = b.pal;
    if (pet.species === 'octo') pal = { ...b.pal, L: ['#5fc8f8', '#4fe0e8', '#8a9cff', '#b48cff'][Math.floor(this.t / 10) % 4] };
    ctx.drawImage(spr(b.rows, pal), 10, 26 + Math.round(Math.sin(this.t / 14)));
    text(ctx, 'Lv ' + pet.lv, 54, 22, C.gold);
    text(ctx, 'HP', 54, 33, C.dim); bar(ctx, 66, 35, 50, pet.hp / s.hp, hpColour(pet.hp / s.hp)); text(ctx, pet.hp + '/' + s.hp, 154, 33, C.text, { align: 'right' });
    text(ctx, 'EN', 54, 43, C.dim); bar(ctx, 66, 45, 50, pet.en / MAX_EN(pet.lv), C.cyan); text(ctx, pet.en + '/' + MAX_EN(pet.lv), 154, 43, C.text, { align: 'right' });
    text(ctx, 'XP', 54, 53, C.dim); bar(ctx, 66, 55, 50, pet.xp / xpToNext(pet.lv), C.gold); text(ctx, pet.xp + '/' + xpToNext(pet.lv), 154, 53, C.text, { align: 'right' });
    text(ctx, 'ATK ' + s.atk + '   DEF ' + s.def + '   SPD ' + s.spd, 6, 68, C.text);
    box(ctx, 2, 78, W - 4, 64);
    pet.moves.forEach((m, i) => {
      const mv = MOVES[m];
      text(ctx, mv.name, 8, 83 + i * 11, C.text);
      text(ctx, mv.pow ? 'POW ' + mv.pow : 'STATUS', 108, 83 + i * 11, C.dim, { align: 'right' });
      text(ctx, mv.en + 'EN', 152, 83 + i * 11, C.cyan, { align: 'right' });
    });
  }
  drawEnya(ctx) {
    this.frame(ctx, '← ENYA');
    const b = BATTLERS.enya;
    box(ctx, 4, 20, 46, 52, { bg: '#22163f' });
    ctx.drawImage(spr(b.rows, b.pal), 9, 25 + Math.round(Math.sin(this.t / 16)));
    const lines = wrap('A street brawler from Tipperary, Ireland. She rides the EMERALD TIGER, an armoured ghost tiger.', W - 62);
    lines.forEach((l, i) => text(ctx, l, 55, 21 + i * 10, C.text));
    box(ctx, 2, 78, W - 4, 64);
    [['DIAMOND FLASH', 'Her necklace dazes the foe.'], ['SHAMROCK CHEER', 'Heals your companion.'], ['EMERALD POUNCE', 'The tiger leaps in to attack.']].forEach(([n, d], i) => {
      text(ctx, n, 8, 83 + i * 19, '#ffd27a');
      text(ctx, d, 8, 92 + i * 19, C.dim);
    });
  }
}

class BagScreen extends Page {
  constructor(g, w) { super(g); this.world = w; this.sel = 0; }
  update(g) {
    this.t++;
    const inp = g.input, ids = Object.keys(ITEMS);
    if (this.busy) return;
    if (inp.repeat('down')) { this.sel = (this.sel + 1) % ids.length; sfx.move(); }
    if (inp.repeat('up')) { this.sel = (this.sel + ids.length - 1) % ids.length; sfx.move(); }
    if (inp.pressed.b || inp.pressed.start) { sfx.cancel(); g.pop(this); this.done && this.done(); return; }
    if (inp.pressed.a) this.use(ids[this.sel]);
  }
  async use(id) {
    const g = this.game, st = g.state, it = ITEMS[id];
    this.busy = true;
    if (!st.bag[id]) { sfx.bump(); await g.say("You don't have any."); this.busy = false; return; }
    if (!st.pet) { await g.say('You have no companion to give it to yet.'); this.busy = false; return; }
    const s = companionStats(st.pet);
    if (st.pet.hp >= s.hp && st.pet.en >= MAX_EN(st.pet.lv)) { await g.say(st.pet.name + " is already full of beans!"); this.busy = false; return; }
    st.bag[id]--;
    if (it.heal) st.pet.hp = Math.min(s.hp, st.pet.hp + it.heal);
    if (it.en) st.pet.en = Math.min(MAX_EN(st.pet.lv), st.pet.en + it.en);
    sfx.heal();
    await g.say(`${st.pet.name} munches the ${it.name}. Delicious!`);
    this.busy = false;
  }
  draw(ctx, g) {
    const st = g.state, ids = Object.keys(ITEMS);
    this.frame(ctx, 'BAG');
    box(ctx, 2, 20, W - 4, 44);
    ids.forEach((k, i) => {
      if (i === this.sel) text(ctx, '▶', 8, 26 + i * 12, C.gold);
      text(ctx, ITEMS[k].name, 16, 26 + i * 12, st.bag[k] ? C.text : C.dim);
      text(ctx, '×' + (st.bag[k] || 0), 150, 26 + i * 12, C.cyan, { align: 'right' });
    });
    wrap(ITEMS[ids[this.sel]].desc + ' (A: use)', W - 12).forEach((l, i) => text(ctx, l, 6, 68 + i * 10, C.dim));
    box(ctx, 2, 92, W - 4, 50);
    text(ctx, 'JEWELS', 8, 97, C.gold);
    text(ctx, 'TOTAL ◆' + st.money, 152, 97, C.cyan, { align: 'right' });
    const kinds = ['gold', 'emerald', 'sapphire', 'ruby', 'diamond'];
    const cols = { gold: C.gold, emerald: '#2fe070', sapphire: '#4f8cff', ruby: '#ff3a4e', diamond: '#c8f4ff' };
    kinds.forEach((k, i) => {
      const x = 8 + (i % 2) * 76, y = 108 + Math.floor(i / 2) * 11;
      ctx.fillStyle = '#1a0f2e'; ctx.fillRect(x, y, 7, 7); ctx.fillStyle = cols[k]; ctx.fillRect(x + 1, y + 1, 5, 5); ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 2, y + 2, 1, 1);
      text(ctx, (k === 'gold' ? 'GOLD' : JEWELS[k].name) + ' ' + (st.jewels[k] || 0), x + 10, y, C.text);
    });
  }
}

class QuestScreen extends Page {
  draw(ctx, g) {
    const st = g.state;
    this.frame(ctx, 'QUEST: SHIP PARTS');
    box(ctx, 2, 20, W - 4, 46);
    Object.keys(PARTS).forEach((k, i) => {
      const got = !!st.parts[k];
      text(ctx, got ? '★' : '-', 8, 26 + i * 13, got ? C.gold : C.dim);
      text(ctx, PARTS[k].name, 18, 26 + i * 13, got ? C.text : C.dim);
      text(ctx, got ? 'FOUND' : '???', 152, 26 + i * 13, got ? C.green : C.dim, { align: 'right' });
    });
    box(ctx, 2, 68, W - 4, 48);
    text(ctx, 'NOW:', 8, 73, C.gold);
    wrap(st.goal || '', W - 20).slice(0, 3).forEach((l, i) => text(ctx, l, 8, 84 + i * 10, C.text));
    const mins = Math.floor((st.playMs || 0) / 60000);
    text(ctx, 'TIME ' + Math.floor(mins / 60) + ':' + String(mins % 60).padStart(2, '0') + '   BATTLES ' + (st.battles || 0) + '   STEPS ' + (st.steps || 0), 6, 124, C.dim);
  }
}

/* ---------- the end of Chapter 1 ---------- */
export class Ending {
  constructor(game, done) { this.kind = 'Ending'; this.game = game; this.done = done; this.opaque = true; this.t = 0; }
  update(g) {
    this.t++;
    if (this.t > 120 && (g.input.pressed.a || g.input.pressed.start)) { sfx.select(); g.pop(this); this.done && this.done(); }
  }
  draw(ctx, g) {
    const st = g.state, t = this.t;
    sky(ctx);
    stars(ctx, t, 0.5);
    comet(ctx, (t * 0.9) % (W + 60) - 30, 40 + Math.sin(t / 20) * 6, t);
    text(ctx, 'CHAPTER 1', W / 2, 12, '#ffd23a', { scale: 2, outline: '#1a0f2e', align: 'center' });
    text(ctx, 'COMPLETE!', W / 2, 30, '#8ff0ff', { scale: 2, outline: '#1a0f2e', align: 'center' });
    box(ctx, 14, 60, W - 28, 58);
    const total = Object.values(st.jewels).reduce((a, b) => a + b, 0);
    const mins = Math.floor((st.playMs || 0) / 60000);
    [[st.pet.name, 'Lv ' + st.pet.lv], ['JEWELS', total + ' (◆' + st.money + ')'], ['BATTLES', String(st.battles || 0)], ['TIME', Math.floor(mins / 60) + ':' + String(mins % 60).padStart(2, '0')]].forEach(([a, b], i) => {
      text(ctx, a, 22, 66 + i * 12, C.dim);
      text(ctx, b, W - 22, 66 + i * 12, C.text, { align: 'right' });
    });
    text(ctx, 'TO BE CONTINUED...', W / 2, 124, '#e6d8ff', { align: 'center', shadow: '#1a0f2e' });
    if (t > 120 && Math.floor(t / 24) % 2 === 0) text(ctx, 'PRESS A', W / 2, 134, '#ffd23a', { align: 'center', shadow: '#1a0f2e' });
  }
}

/* ---------- choosing your companion ----------
   All three guardians side by side on glowing pedestals, each showing off: NOVA in a ring of fire
   with claw swipes, the dragon breathing fire or frost (up / down picks the colour), LUMI blowing
   bubbles and glowing. Resolves with { species, variant } or null. */
const STARTERS = [
  { species: 'tiger', art: ['tiger'], name: ['NOVA'], tag: ['claws, roar and fire'], col: ['#ff9a3a'] },
  { species: 'dragon', art: ['dragonRed', 'dragonBlue'], name: ['EMBER', 'AZURE'], tag: ['red: breathes fire', 'blue: breathes frost'], col: ['#ff5a4a', '#7fb0ff'] },
  { species: 'octo', art: ['octo'], name: ['LUMI'], tag: ['heals and baffles'], col: ['#8ff0ff'] },
];
const CX = [28, 80, 132];
export function chooseCompanion(g, first) {
  return new Promise((resolve) => g.push(new StarterSelect(g, first, resolve)));
}
class StarterSelect {
  constructor(game, first, done) {
    this.kind = 'Starter';
    this.game = game;
    this.done = done;
    this.opaque = true;
    this.idx = Math.max(0, STARTERS.findIndex((s) => s.species === first));
    this.variant = 0;
    this.t = 0;
    this.fx = [];
    this.wig = 0;
    this.prev = currentMusic();
  }
  enter() { playMusic('select'); this.cry(); }
  get cur() { return STARTERS[this.idx]; }
  v(s = this.cur) { return s.species === 'dragon' ? this.variant : 0; }
  cry() {
    ({ tiger: sfx.rawr, dragon: sfx.puff, octo: sfx.blub }[this.cur.species])();
    this.wig = 18;
    this.burst();
  }
  burst() {   // a showy moment for whoever is picked
    const s = this.cur.species, x = CX[this.idx];
    if (s === 'tiger') this.fx.push({ k: 'claw', x: x - 10, y: 34, t: 0, life: 22 });
    if (s === 'dragon') for (let i = 0; i < 26; i++) this.fx.push({ k: this.variant ? 'frost' : 'fire', x: x + 13, y: 48, vx: rnd(1, 2.6), vy: rnd(-0.7, 0.5), t: -i, life: 22 });
    if (s === 'octo') for (let i = 0; i < 3; i++) this.fx.push({ k: 'ring', x, y: 54, t: -i * 7, life: 30 });
  }
  update(g) {
    this.tick();
    if (this.busy) return;
    const inp = g.input;
    if (inp.repeat('right') || inp.repeat('left')) {
      this.idx = (this.idx + (inp.repeat('right') ? 1 : 2)) % 3;
      sfx.move();
      this.cry();
    }
    if (this.cur.species === 'dragon' && (inp.pressed.up || inp.pressed.down || inp.pressed.select)) { this.variant ^= 1; this.cry(); }
    if (inp.pressed.b) { sfx.cancel(); this.close(null); return; }
    if (inp.pressed.a) this.confirm();
  }
  async confirm() {
    const g = this.game, s = this.cur, v = this.v();
    this.busy = true;
    sfx.select();
    const kind = { tiger: 'the tiger', dragon: v ? 'the blue dragon' : 'the red dragon', octo: 'the octopus' }[s.species];
    const yes = await g.ask(`Choose ${s.name[v]}, ${kind}?`, ['YES', 'NO']);
    this.busy = false;
    if (yes === 0) this.close({ species: s.species, variant: s.species === 'dragon' ? (v ? 'blue' : 'red') : 'red' });
  }
  close(result) {
    this.game.pop(this);
    playMusic(this.prev || 'pl:town');
    this.done(result);
  }
  tick() {
    this.t++;
    if (this.wig > 0) this.wig--;
    const t = this.t, s = this.cur.species, x = CX[this.idx];
    // each guardian's own effect, all the time
    if (s === 'tiger' && t % 2 === 0) { const a = Math.random() * Math.PI * 2; this.fx.push({ k: 'flame', x: x + Math.cos(a) * 17, y: 58 + Math.sin(a) * 8, vx: rnd(-0.1, 0.1), vy: -rnd(0.5, 1.1), t: 0, life: 26 }); }
    if (s === 'tiger' && t % 70 === 0) this.fx.push({ k: 'claw', x: x - 10, y: 34, t: 0, life: 22 });
    if (s === 'dragon' && t % 4 === 0) this.fx.push({ k: this.variant ? 'snow' : 'ember', x: x + rnd(-16, 16), y: 70, vx: rnd(-0.2, 0.2), vy: -rnd(0.3, 0.8), t: 0, life: 40 });
    if (s === 'dragon' && t % 80 === 40) this.burst();
    if (s === 'octo' && t % 6 === 0) this.fx.push({ k: 'bubble', x: x + rnd(-14, 14), y: 66, vx: 0, vy: -rnd(0.3, 0.6), t: 0, life: 60 });
    if (s === 'octo' && t % 45 === 0) this.fx.push({ k: 'ring', x, y: 54, t: 0, life: 30 });
    for (const f of this.fx) { f.t++; if (f.t > 0 && f.vx !== undefined) { f.x += f.vx; f.y += f.vy; } }
    this.fx = this.fx.filter((f) => f.t < f.life);
  }
  draw(ctx, g) {
    const t = this.t;
    sky(ctx, '#0c0420', '#1c0c3a', '#2e1660');
    stars(ctx, t, 0.08, 40);
    box(ctx, 14, 3, W - 28, 14, { bg: C.bg2 });
    text(ctx, 'CHOOSE YOUR COMPANION', W / 2, 6, C.gold, { align: 'center' });
    // the spotlight on the chosen one
    const sx = CX[this.idx];
    ctx.globalAlpha = 0.16 + 0.04 * Math.sin(t / 10);
    ctx.fillStyle = STARTERS[this.idx].col[this.v()];
    for (let y = 18; y < 76; y++) { const w = 6 + (y - 18) * 0.42; ctx.fillRect(Math.round(sx - w), y, Math.round(w * 2), 1); }
    ctx.globalAlpha = 1;
    STARTERS.forEach((s, i) => {
      const x = CX[i], on = i === this.idx, v = this.v(s);
      // pedestal
      ctx.fillStyle = on ? '#4a2a8a' : '#2a1850';
      for (let k = -3; k <= 3; k++) { const w = Math.round(Math.sqrt(1 - (k * k) / 12) * 18); ctx.fillRect(x - w, 74 + k, w * 2, 1); }
      ctx.fillStyle = on ? s.col[v] : '#4a3a7a'; ctx.fillRect(x - 15, 74, 30, 1);
      // the guardian
      const b = BATTLERS[s.art[v]];
      let pal = b.pal;
      if (s.species === 'octo') { const L = ['#5fc8f8', '#4fe0e8', '#8a9cff', '#b48cff', '#8a9cff', '#4fe0e8'][Math.floor(t / 10) % 6]; pal = this.octo || (this.octo = {}); if (!pal[L]) pal[L] = { ...b.pal, L }; pal = pal[L]; }
      const img = spr(b.rows, pal);
      const bob = on ? Math.round(Math.sin(t / 12) * 1.5) : 0, wig = on && this.wig ? ((this.wig >> 1) % 2 ? 1 : -1) : 0;
      ctx.globalAlpha = on ? 1 : 0.45;
      ctx.drawImage(img, x - 16 + wig, 73 - img.height + bob - (on && this.wig > 10 ? 3 : 0));
      ctx.globalAlpha = 1;
      text(ctx, s.name[v], x, 79, on ? s.col[v] : '#6a5a9a', { align: 'center', outline: on ? '#1a0f2e' : null });
    });
    // effects
    for (const f of this.fx) {
      if (f.t < 0) continue;
      const k = f.t / f.life;
      if (f.k === 'flame' || f.k === 'fire') {
        ctx.fillStyle = k < 0.2 ? '#fff6c8' : k < 0.45 ? '#ffd23a' : k < 0.7 ? '#ff7a1a' : k < 0.88 ? '#e8302a' : '#7a1fff';
        const s = k < 0.5 ? 2 : 1; ctx.fillRect(Math.round(f.x), Math.round(f.y), s, s);
      } else if (f.k === 'frost' || f.k === 'snow') {
        ctx.globalAlpha = 1 - k * 0.5; ctx.fillStyle = k < 0.3 ? '#ffffff' : k < 0.7 ? '#c8f4ff' : '#5fa8ff';
        ctx.fillRect(Math.round(f.x), Math.round(f.y), 1, 1); if (f.k === 'frost' && k < 0.4) { ctx.fillRect(Math.round(f.x) - 1, Math.round(f.y), 3, 1); ctx.fillRect(Math.round(f.x), Math.round(f.y) - 1, 1, 3); }
      } else if (f.k === 'ember') { ctx.globalAlpha = 1 - k; ctx.fillStyle = k < 0.5 ? '#ffd23a' : '#ff5a2a'; ctx.fillRect(Math.round(f.x), Math.round(f.y), 1, 1); }
      else if (f.k === 'bubble') {
        const bx = Math.round(f.x + Math.sin(f.t / 7) * 1.5), by = Math.round(f.y);
        ctx.globalAlpha = Math.min(1, (1 - k) * 2); ctx.fillStyle = '#8ff0ff';
        ctx.fillRect(bx, by - 1, 2, 1); ctx.fillRect(bx, by + 2, 2, 1); ctx.fillRect(bx - 1, by, 1, 2); ctx.fillRect(bx + 2, by, 1, 2);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(bx, by, 1, 1);
      } else if (f.k === 'ring') {
        const r = 6 + k * 18; ctx.globalAlpha = 1 - k; ctx.fillStyle = Math.floor(f.t / 5) % 2 ? '#8ff0ff' : '#c08cff';
        for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; ctx.fillRect(Math.round(f.x + Math.cos(a) * r), Math.round(f.y + Math.sin(a) * r * 0.75), 1, 1); }
      } else if (f.k === 'claw') {
        const n = Math.min(20, Math.round(k * 50));
        ctx.globalAlpha = 1 - k * 0.6;
        for (let s = 0; s < 3; s++) for (let i = 0; i < n; i++) { ctx.fillStyle = i < n - 2 ? '#ffffff' : '#ffd23a'; ctx.fillRect(Math.round(f.x + s * 7 + i * 0.7), Math.round(f.y + i * 1.2), 1, 1); ctx.fillStyle = '#ff7a1a'; ctx.fillRect(Math.round(f.x + s * 7 + i * 0.7) + 1, Math.round(f.y + i * 1.2), 1, 1); }
      }
      ctx.globalAlpha = 1;
    }
    // a pointer over the chosen one
    text(ctx, '▼', sx, 22 + Math.round(Math.sin(t / 8) * 2), C.gold, { align: 'center' });
    // what they're like
    const s = this.cur, v = this.v(), c = COMPANIONS[s.species];
    const lv3 = (sp) => statsAt(COMPANIONS[sp].base, COMPANIONS[sp].grow, 3);
    const st = lv3(s.species), max = { hp: 44, atk: 15, def: 12, spd: 16 };
    box(ctx, 2, 89, W - 4, 53);
    text(ctx, c.kind, 8, 94, s.col[v]);
    text(ctx, s.tag[v], 8 + measure(c.kind) + 6, 94, C.dim);
    [['HP', 'hp'], ['ATK', 'atk'], ['DEF', 'def'], ['SPD', 'spd']].forEach(([l, key], i) => {
      const x = 8 + i * 37, lw = measure(l) + 3;
      text(ctx, l, x, 103, C.dim);
      bar(ctx, x + lw, 105, 33 - lw, st[key] / max[key], s.col[v]);
    });
    const moves = c.learn.filter(([lv]) => lv <= 3).map(([, m]) => (s.species === 'dragon' && v && BLUE_DRAGON.swap[m]) || m).map((m) => MOVES[m].name);
    wrap(moves.join(', '), W - 16).slice(0, 2).forEach((l, i) => text(ctx, l, 8, 113 + i * 10, C.cyan));
    text(ctx, s.species === 'dragon' ? '◀▶ choose  ▲▼ colour  A pick' : '◀▶ choose   A pick   B back', 8, 134, '#6a5a9a');
  }
}

/* ---------- the sound test: every tune and sound effect ---------- */
export class SoundTest {
  constructor(game, done) { this.kind = 'SoundTest'; this.game = game; this.done = done; this.opaque = true; this.tab = 0; this.sel = [0, 0]; this.scroll = [0, 0]; this.t = 0; }
  update(g) {
    this.t++;
    const inp = g.input, list = this.tab ? SOUNDS : TRACKS, n = list.length;
    if (inp.pressed.left || inp.pressed.right) { this.tab ^= 1; sfx.move(); }
    if (inp.repeat('down')) { this.sel[this.tab] = (this.sel[this.tab] + 1) % n; sfx.move(); }
    if (inp.repeat('up')) { this.sel[this.tab] = (this.sel[this.tab] + n - 1) % n; sfx.move(); }
    const i = this.sel[this.tab];
    if (i < this.scroll[this.tab]) this.scroll[this.tab] = i;
    if (i >= this.scroll[this.tab] + 8) this.scroll[this.tab] = i - 7;
    if (inp.pressed.a) {
      if (this.tab === 0) { const np = nowPlaying(); if (np && np.owner === 'board' && np.name === TRACKS[i][0]) boardStop(); else boardPlay(TRACKS[i][0]); }
      else SOUNDS[i][2]();
    }
    if (inp.pressed.b || inp.pressed.start) { sfx.cancel(); boardStop(); g.pop(this); this.done && this.done(); }
  }
  draw(ctx) {
    const t = this.t;
    ctx.fillStyle = '#0e0820'; ctx.fillRect(0, 0, W, H);
    box(ctx, 2, 2, W - 4, 15, { bg: C.bg2 });
    text(ctx, 'SOUND TEST', 8, 6, C.gold);
    text(ctx, (this.tab ? '◀ MUSIC  ' : '') + (this.tab ? 'SOUNDS' : 'MUSIC') + (this.tab ? '' : '  SOUNDS ▶'), W - 8, 6, C.cyan, { align: 'right' });
    const list = this.tab ? SOUNDS : TRACKS, np = nowPlaying();
    box(ctx, 2, 19, W - 4, 92);
    for (let k = 0; k < 8; k++) {
      const i = k + this.scroll[this.tab];
      if (i >= list.length) break;
      const y = 25 + k * 10, on = i === this.sel[this.tab];
      const playing = !this.tab && np && np.owner === 'board' && np.name === list[i][0];
      if (on) text(ctx, '▶', 8, y, C.gold);
      text(ctx, (this.tab ? '' : String(i + 1).padStart(2, '0') + ' ') + list[i][1], 16, y, playing ? C.green : on ? C.text : C.dim);
      if (playing) text(ctx, '♪', W - 12, y, C.green, { align: 'right' });
    }
    // a little equaliser that dances while music plays
    box(ctx, 2, 113, W - 4, 29, { bg: C.bg2 });
    const playingName = np ? (TRACKS.find((q) => q[0] === np.track) || [0, np.track])[1] : null;
    text(ctx, playingName ? '♪ ' + playingName : 'A: play   B: back', 8, 118, playingName ? C.green : C.dim);
    for (let i = 0; i < 18; i++) {
      const h = np ? 2 + Math.round((Math.sin(t / 5 + i * 1.7) * 0.5 + 0.5) * (Math.sin(t / 11 + i) * 0.5 + 0.5) * 9) : 1;
      ctx.fillStyle = i % 3 === 0 ? '#ffd23a' : i % 3 === 1 ? '#5fe07a' : '#8ff0ff';
      ctx.fillRect(8 + i * 8, 138 - h, 6, h);
    }
  }
}
