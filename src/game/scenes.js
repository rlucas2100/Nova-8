/* Title screen, the crash, remembering your name, the START menu screens (party, bag, COSMIC TUBES,
   quest notes and memories), the end of each chapter, the COMET's flights and the dreams on them. */
import { W, H, spr, hash, makeCanvas, disc } from '../engine/pixel.js';
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
import { MOVES, ITEMS, JEWELS, PARTS, CH1_PARTS, CH2_PARTS, COMPANIONS, BLUE_DRAGON, WILD, CATCHABLE, MEMORIES, HERO_NAMES, DEFAULT_NAMES, statsAt, companionStats, companionArt, xpToNext, MAX_EN, levelUp } from './data.js';
import { memoryCount, remember } from './memory.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

let PLANET = null;
const planet = () => PLANET || (PLANET = buildProps().planet.img[0]);

export function newState(name) {
  return {
    v: 3, name, map: 'bloomhaven', x: 4, y: 5, dir: 'up',
    pet: null, riding: false, flags: {}, got: {}, parts: {},
    jewels: { gold: 0, emerald: 0, sapphire: 0, ruby: 0, diamond: 0 }, money: 0,
    bag: { berry: 0, tonic: 0, melon: 0, tube: 0, catnip: 0 },
    tubes: {}, captures: 0, memories: [], furyT: 0,
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
  for (let i = 0; i < 3; i++) { ctx.fillStyle = fl[i]; ctx.fillRect(-13 - i * 2 - (t % 4 < 2 ? 1 : 0), -1, 2, 3 - (i === 2 ? 1 : 0)); }
  ctx.restore();
}
/* your homeworld, painted once: blue seas and green lands, lit from the top left */
let HOME = null;
function homeworld() {
  if (HOME) return HOME;
  const r = 30, c = makeCanvas(r * 2 + 1, r * 2 + 1), g = c.getContext('2d');
  for (let dy = -r; dy <= r; dy++) {
    const w = Math.floor(Math.sqrt(r * r - dy * dy));
    for (let dx = -w; dx <= w; dx++) {
      const land = hash(Math.floor((dx + 40) / 5), Math.floor((dy + 40) / 4), 77) < 0.42, lit = dx + dy < -r * 0.5 ? 1 : dx + dy > r * 0.6 ? -1 : 0;
      g.fillStyle = land ? (lit > 0 ? '#6ad87a' : lit < 0 ? '#1f6a3a' : '#3fae5a') : (lit > 0 ? '#5aa8f0' : lit < 0 ? '#1a3a7a' : '#2f6ad0');
      g.fillRect(r + dx, r + dy, 1, 1);
    }
  }
  return (HOME = c);
}
/* a diamond glinting: the GEM (her signal, the necklace in your memories) */
function glint(ctx, x, y, t, size = 1) {
  const k = 0.5 + 0.5 * Math.sin(t / 8), len = Math.round((3 + 4 * k) * size);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - len, y, len * 2 + 1, 1); ctx.fillRect(x, y - len, 1, len * 2 + 1);
  ctx.fillStyle = '#c8f4ff';
  for (let i = 1; i <= Math.round(2 * size); i++) { ctx.fillRect(x - i, y - i, 1, 1); ctx.fillRect(x + i, y - i, 1, 1); ctx.fillRect(x - i, y + i, 1, 1); ctx.fillRect(x + i, y + i, 1, 1); }
  ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 1, 3, 3);
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
    text(ctx, 'CHAPTER 2: THE DRAGON KINGS', W / 2, 58, '#e6d8ff', { align: 'center', shadow: '#1a0f2e' });
    // the three companions on a ledge
    const pal = CH.OCTO_PALS[Math.floor(t / 8) % CH.OCTO_PALS.length];
    const fr = Math.floor(t / 20) % 2;
    ctx.drawImage(spr(CH.TIGER.down[0], CH.TIGER_PAL), 44, 70);
    ctx.drawImage(spr(CH.DRAGON.down[fr ? 1 : 0], CH.DRAGON_PAL.red), 72, 68 + (fr ? -1 : 0));
    ctx.drawImage(spr(CH.OCTO.down[fr], pal), 100, 70);
    if (t % 260 < 60) { const hk = (t % 260) / 60; ctx.globalAlpha = 1 - hk; ctx.fillStyle = '#e81617'; const hx = 51, hy = 66 - Math.round(hk * 8); ctx.fillRect(hx, hy, 2, 2); ctx.fillRect(hx + 3, hy, 2, 2); ctx.fillRect(hx, hy + 1, 5, 2); ctx.fillRect(hx + 1, hy + 3, 3, 1); ctx.fillRect(hx + 2, hy + 4, 1, 1); ctx.globalAlpha = 1; }
    if (!this.menuOpen && Math.floor(t / 24) % 2 === 0) text(ctx, 'PRESS START', W / 2, 100, '#ffffff', { align: 'center', outline: '#1a0f2e' });
    text(ctx, '© 2026 RYAN LUCAS', W / 2, 134, '#9a8cc8', { align: 'center', shadow: '#1a0f2e' });
  }
}

export async function showControls(g) {
  await g.say('MOVE: W A S D, the arrow keys, or the D-pad.\nA: SPACE, J, Z or ENTER (talk, choose).\nB: K, X or BACKSPACE (back).');
  await g.say('START: ESC or P (menu, pause).\nSELECT: SHIFT or Q (hop on or off your companion).\nA gamepad works too. On a phone, tap the console buttons.');
}

/* ---------- the crash: your homeworld at war, her signal, the meteor storm ----------
   Kept short on purpose: the rest of the story comes back to you as memories while you play. */
export class Intro {
  constructor(game) { this.game = game; this.opaque = true; this.t = 0; this.scene = 'home'; this.phase = 0; this.shipX = -20; this.shipY = 58; this.meteors = []; this.booms = []; this.go(); }
  enter() { playMusic('intro'); }
  async go() {
    const g = this.game;
    // each line stays up long enough to read (longer lines longer), with the ▼ showing that A moves on sooner
    const s = (str) => g.say(str, { auto: Math.round(90 + str.length * 2.5), more: true });
    await g.wait(30);
    if (this.skipped) return;
    await s('Your homeworld is under attack. Your family have been warriors for generations...');
    if (this.skipped) return;
    await s("...but you've seen enough war for one lifetime. Now all you want is to find HER.");
    if (this.skipped) return;
    this.scene = 'space';
    sfx.memory();
    await s('Your childhood sweetheart. Your long-lost love.');
    if (this.skipped) return;
    await s('Her last signal came from the purple planet KIRRA...');
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
    if (this.scene === 'home') {   // explosions blooming on the homeworld
      if (this.t % 9 === 0) { const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 26; this.booms.push({ x: 62 + Math.cos(a) * r, y: 64 + Math.sin(a) * r, t: 0 }); }
      for (const b of this.booms) b.t++;
      this.booms = this.booms.filter((b) => b.t < 18);
      return;
    }
    if (this.phase >= 1 && this.phase <= 4 && this.t % 6 === 0) this.meteors.push({ x: W + 10, y: Math.random() * 90, vx: -(2 + Math.random() * 2), vy: 0.6 + Math.random() * 0.6, s: 1 + Math.floor(Math.random() * 3) });
    for (const m of this.meteors) { m.x += m.vx; m.y += m.vy; }
    this.meteors = this.meteors.filter((m) => m.x > -20 && m.y < H + 10);
    if (this.phase === 0 || this.phase === 1 || this.phase === 2) this.shipX = Math.min(70, this.shipX + 0.6);
    if (this.phase === 3) { this.shipX += 0.3; this.shipY += 0.15; }
    if (this.phase === 4) { this.shipX += 0.6; this.shipY += 0.7; }
  }
  drawHome(ctx) {
    const t = this.t;
    sky(ctx, '#0c0420', '#160830', '#200c40');
    stars(ctx, t, 0.12);
    ctx.drawImage(homeworld(), 32, 34);
    for (const b of this.booms) { const r = 1 + Math.floor(b.t / 3); disc(ctx, Math.round(b.x), Math.round(b.y), r, b.t < 6 ? '#fff2a0' : b.t < 12 ? '#ff8a1e' : '#a82838'); }
    // the attackers: dark wedges circling, firing red beams
    for (let i = 0; i < 5; i++) {
      const a = t / 70 + (i * Math.PI * 2) / 5, sx = Math.round(62 + Math.cos(a) * 46), sy = Math.round(64 + Math.sin(a) * 24);
      ctx.fillStyle = '#1a0610'; ctx.fillRect(sx - 3, sy - 1, 7, 3); ctx.fillRect(sx - 1, sy - 2, 3, 5);
      ctx.fillStyle = '#ff3b4a'; ctx.fillRect(sx, sy, 1, 1);
      if ((t + i * 23) % 70 < 6) { ctx.fillStyle = '#ff5a5a'; const n = 14; for (let k = 0; k < n; k++) ctx.fillRect(Math.round(sx + ((62 - sx) * k) / n * 0.7), Math.round(sy + ((64 - sy) * k) / n * 0.7), 1, 1); }
    }
    // sirens
    if (Math.floor(t / 24) % 2) { ctx.fillStyle = 'rgba(255,40,60,0.12)'; ctx.fillRect(0, 0, W, H); }
    // a warrior's banner, far off: you come from a long line of them
    ctx.fillStyle = '#6a4a2a'; ctx.fillRect(132, 30, 1, 30);
    ctx.fillStyle = '#c83a3a'; for (let y = 0; y < 12; y++) ctx.fillRect(133, 31 + y, 10 - Math.round(Math.sin(t / 8 + y / 3) * 1.5) - (y > 8 ? (y - 8) * 2 : 0), 1);
    ctx.fillStyle = '#ffd23a'; ctx.fillRect(136, 35, 3, 3);
  }
  draw(ctx, g) {
    if (this.scene === 'home') { this.drawHome(ctx); text(ctx, 'START: skip', W - 4, 4, '#6a5a9a', { align: 'right' }); return; }
    const t = this.t;
    sky(ctx, '#0c0420', '#1c0c3a', '#2e1660');
    stars(ctx, t, this.phase >= 3 ? 1.2 : 0.4);
    const pl = planet();
    const ps = this.phase >= 3 ? 3 : 2;
    const px = W - 60 - (ps - 2) * 30, py = 70 - (ps - 2) * 10;
    ctx.drawImage(pl, 0, 0, pl.width, pl.height, px, py, pl.width * ps, pl.height * ps);
    if (this.phase < 3) glint(ctx, px + 28 * ps, py + 18 * ps, t, 1);   // her signal, glinting like a diamond
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

/* ---------- remembering your name (the bump on your head makes it hard) ----------
   Type it, pick letters, or let RANDOM (or SELECT) pick one; leave it empty for the one shown faintly. */
const GRID = ['ABCDEFGHI', 'JKLMNOPQR', 'STUVWXYZ-'];
export class Create {
  constructor(game) { this.game = game; this.opaque = true; this.t = 0; this.name = ''; this.cx = 0; this.cy = 0; this.ghost = pick(DEFAULT_NAMES); }
  enter() { this.game.say('Ugh... your head is pounding. What was your name again...?', { auto: 0 }); }
  get textInput() { return true; }
  typeChar(ch) {
    if (this.busy) return;
    if (ch === '\b') { this.name = this.name.slice(0, -1); sfx.cancel(); return; }
    if (ch === '\n') { this.confirm(); return; }
    if (/^[A-Za-z\- ]$/.test(ch) && this.name.length < 7) { this.name += ch.toUpperCase(); sfx.move(); }
  }
  randomName() {
    let n;
    do n = pick(HERO_NAMES); while (n === this.name);
    this.name = n;
    sfx.select();
  }
  update(g) {
    this.t++;
    const inp = g.input;
    if (this.busy) return;
    if (inp.repeat('right')) { this.cx = (this.cx + 1) % 9; sfx.move(); }
    if (inp.repeat('left')) { this.cx = (this.cx + 8) % 9; sfx.move(); }
    if (inp.repeat('down')) { this.cy = (this.cy + 1) % 4; sfx.move(); }
    if (inp.repeat('up')) { this.cy = (this.cy + 3) % 4; sfx.move(); }
    if (inp.pressed.select) this.randomName();
    if (inp.pressed.b) { if (this.name) { this.name = this.name.slice(0, -1); sfx.cancel(); } else sfx.bump(); }
    if (inp.pressed.start) this.confirm();
    if (inp.pressed.a) {
      if (this.cy === 3) { if (this.cx < 3) { this.name = this.name.slice(0, -1); sfx.cancel(); } else if (this.cx < 6) this.randomName(); else this.confirm(); }
      else if (this.name.length < 7) { this.name += GRID[this.cy][this.cx]; sfx.move(); }
    }
  }
  async confirm() {
    const g = this.game;
    if (this.busy) return;
    this.busy = true;
    if (!this.name.trim()) this.name = this.ghost;
    this.name = this.name.trim();
    const ok = await g.ask(`So your name is ${this.name}?`, ['YES', 'NO']);
    if (ok !== 0) { this.busy = false; return; }
    g.state = newState(this.name);
    g.save();
    await g.fade(1, 20);
    const w = new World(g, 'bloomhaven', 4, 5, 'up');
    g.replace(w);
    await g.fade(0, 30);
    w.run(SCRIPTS.wakeUp);
  }
  draw(ctx) {
    sky(ctx, '#0c0420', '#140832', '#1c0c3a');
    stars(ctx, this.t, 0.1, 40);
    // you, with your green eyes (flashing greener now and then)
    const pal = this.t % 200 < 14 ? CH.HERO_PAL_SHIFT : CH.HERO_PAL;
    ctx.drawImage(spr(CH.HERO.down[0], pal), 12, 8, 32, 32);
    text(ctx, 'YOUR NAME?', 52, 10, '#ffd23a');
    box(ctx, 50, 22, 96, 16, { bg: '#22163f' });
    const blink = Math.floor(this.t / 16) % 2;
    if (this.name) text(ctx, this.name + (blink && this.name.length < 7 ? '_' : ''), 56, 27, '#ffffff');
    else { text(ctx, this.ghost, 56, 27, '#6a5a9a'); if (blink) text(ctx, '_', 56 + measure(this.ghost) + 1, 27, '#ffffff'); }
    box(ctx, 6, 44, W - 12, 64);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) {
      const x = 18 + c * 14, y = 52 + r * 12;
      if (r === this.cy && c === this.cx) text(ctx, '▶', x - 7, y, C.gold);
      text(ctx, GRID[r][c], x, y, '#f8f4ff');
    }
    const y = 52 + 3 * 12;
    if (this.cy === 3) text(ctx, '▶', [11, 55, 103][Math.floor(this.cx / 3)], y, C.gold);
    text(ctx, 'DELETE', 18, y, '#ff8a9a');
    text(ctx, 'RANDOM', 62, y, '#ffd23a');
    text(ctx, 'DONE', 110, y, '#5fe07a');
    wrap('Type it, or pick letters with the D-pad. RANDOM (or SELECT) picks a name for you.', W - 12).forEach((l, i) => text(ctx, l, 6, 114 + i * 10, '#9a8cc8'));
  }
}

/* ---------- the START menu ---------- */
export async function pauseMenu(g, w) {
  const st = g.state;
  let index = 0;
  for (;;) {
    const items = [
      { label: st.pet ? st.pet.name : 'PARTY', disabled: !st.pet },
      'BAG', 'TUBES', 'QUEST', 'SAVE', 'OPTIONS', 'CLOSE',
    ];
    const i = await g.menu(items, { x: W - 72, y: 4, w: 68, index });
    if (i < 0 || i === 6) return;
    index = i;
    if (i === 0) await screen(g, new PartyScreen(g));
    if (i === 1) await screen(g, new BagScreen(g, w));
    if (i === 2) await screen(g, new TubeScreen(g));
    if (i === 3) await screen(g, new QuestScreen(g));
    if (i === 4) { const ok = g.save(); sfx.save(); await g.say(ok ? 'Your adventure has been saved on this device.' : "Sorry, this browser won't let the game save (private browsing?)."); }
    if (i === 5) await options(g);
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
  update(g) { this.t++; if (g.input.pressed.b || g.input.pressed.start) { sfx.cancel(); g.pop(this); this.done && this.done(); return true; } return false; }
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
    if (super.update(g)) return;
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
    const gap = pet.moves.length > 5 ? 10 : 11;
    pet.moves.forEach((m, i) => {
      const mv = MOVES[m];
      text(ctx, mv.name, 8, 83 + i * gap, C.text);
      text(ctx, mv.pow ? 'POW ' + mv.pow : mv.heal ? 'HEAL' : 'STATUS', 108, 83 + i * gap, C.dim, { align: 'right' });
      text(ctx, mv.en + 'EN', 152, 83 + i * gap, C.cyan, { align: 'right' });
    });
  }
  drawEnya(ctx, g) {
    const gone = g.state.flags['enya-gone'];
    this.frame(ctx, gone ? '← ENYA' : "← ENYA'S ECHO");
    const b = BATTLERS.enya;
    box(ctx, 4, 20, 46, 52, { bg: '#22163f' });
    ctx.globalAlpha = gone ? 0.35 : this.t % 150 < 4 ? 0.4 : 0.85;
    ctx.drawImage(spr(b.rows, b.pal), 9, 25 + Math.round(Math.sin(this.t / 16)));
    ctx.globalAlpha = 1;
    const blurb = gone ? 'The ghouls pulled her back beyond the veil. She is waiting for you to find her.' : 'From Tipperary. Lost beyond the veil, she reaches you as an echo through the GEM.';
    wrap(blurb, W - 62).forEach((l, i) => text(ctx, l, 55, 21 + i * 10, C.text));
    box(ctx, 2, 78, W - 4, 64);
    [['DIAMOND FLASH', "The GEM's light dazes the foe."], ['SHAMROCK CHEER', 'Heals your companion.'], ['EMERALD POUNCE', 'The tiger leaps in to attack.']].forEach(([n, d], i) => {
      text(ctx, n, 8, 83 + i * 19, gone ? C.dim : '#ffd27a');
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
    if (it.capture) { await g.say('Use it in battle: weaken a wild creature first, then open the tube!'); this.busy = false; return; }
    if (!st.pet) { await g.say('You have no companion to give it to yet.'); this.busy = false; return; }
    if (it.levelup) {   // CODY's GOLDEN CATNIP: one sniff, one whole level
      if (st.pet.lv >= 30) { await g.say(`${st.pet.name} is already as strong as a companion can be!`); this.busy = false; return; }
      st.bag[id]--;
      const pet = st.pet, r = levelUp(pet);
      pet.en = MAX_EN(pet.lv);
      sfx.levelup();
      await g.say({ tiger: `${pet.name} sniffs the GOLDEN CATNIP... and rolls about in it, purring like an engine!`, dragon: `${pet.name} sniffs the GOLDEN CATNIP and sneezes out a puff of golden sparkles!`, octo: `${pet.name} sniffs the GOLDEN CATNIP and glows every colour of the rainbow!` }[pet.species]);
      await g.say(`${pet.name} grew to Lv ${pet.lv}!  HP ${r.now.hp}  ATK ${r.now.atk}  DEF ${r.now.def}  SPD ${r.now.spd}`);
      for (const m of r.learned) { sfx.buff(); await g.say(`${pet.name} learned ${MOVES[m].name}!`); }
      this.busy = false;
      return;
    }
    const s = companionStats(st.pet);
    if (st.pet.hp >= s.hp && st.pet.en >= MAX_EN(st.pet.lv)) { await g.say(st.pet.name + ' is already full of beans!'); this.busy = false; return; }
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
    box(ctx, 2, 19, W - 4, 56);
    ids.forEach((k, i) => {
      if (i === this.sel) text(ctx, '▶', 8, 24 + i * 10, C.gold);
      text(ctx, ITEMS[k].name, 16, 24 + i * 10, st.bag[k] ? (ITEMS[k].rare ? C.gold : C.text) : C.dim);
      text(ctx, '×' + (st.bag[k] || 0), 150, 24 + i * 10, C.cyan, { align: 'right' });
    });
    wrap(ITEMS[ids[this.sel]].desc, W - 12).slice(0, 2).forEach((l, i) => text(ctx, l, 6, 77 + i * 9, C.dim));
    box(ctx, 2, 97, W - 4, 45);
    text(ctx, 'JEWELS', 8, 102, C.gold);
    text(ctx, 'TOTAL ◆' + st.money, 152, 102, C.cyan, { align: 'right' });
    const kinds = ['gold', 'emerald', 'sapphire', 'ruby', 'diamond'];
    const cols = { gold: C.gold, emerald: '#2fe070', sapphire: '#4f8cff', ruby: '#ff3a4e', diamond: '#c8f4ff' };
    kinds.forEach((k, i) => {
      const x = 8 + (i % 2) * 76, y = 112 + Math.floor(i / 2) * 10;
      ctx.fillStyle = '#1a0f2e'; ctx.fillRect(x, y, 7, 7); ctx.fillStyle = cols[k]; ctx.fillRect(x + 1, y + 1, 5, 5); ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 2, y + 2, 1, 1);
      text(ctx, (k === 'gold' ? 'GOLD' : JEWELS[k].name) + ' ' + (st.jewels[k] || 0), x + 10, y, C.text);
    });
  }
}

/* ---------- COSMIC TUBES: every creature you've captured, glowing in an infinity of light ---------- */
const TUBE_COLS = ['#ffffff', '#8ff0ff', '#c08cff', '#ffd23a', '#ff8ad8'];
class TubeScreen extends Page {
  constructor(g) { super(g); this.sel = 0; }
  update(g) {
    if (super.update(g)) return;
    const n = CATCHABLE.length, inp = g.input, old = this.sel;
    if (inp.repeat('right')) this.sel = (this.sel + 1) % n;
    if (inp.repeat('left')) this.sel = (this.sel + n - 1) % n;
    if (inp.repeat('down') && this.sel + 7 < n) this.sel += 7;
    if (inp.repeat('up') && this.sel - 7 >= 0) this.sel -= 7;
    if (old !== this.sel) sfx.move();
  }
  draw(ctx, g) {
    const st = g.state, tubes = st.tubes || {}, t = this.t;
    const kinds = CATCHABLE.filter((k) => tubes[k]).length;
    this.frame(ctx, 'COSMIC TUBES ' + kinds + '/' + CATCHABLE.length);
    CATCHABLE.forEach((sp, i) => {   // seven to a row
      const x0 = 5 + (i % 7) * 21, y0 = 20 + Math.floor(i / 7) * 38, have = tubes[sp] || 0;
      if (i === this.sel) box(ctx, x0 - 1, y0 - 1, 22, 37, { bg: '#2e1a5a', edge: C.gold });
      const x = x0 + 2, y = y0 + 2;
      ctx.fillStyle = '#1a0f2e'; ctx.fillRect(x - 1, y - 1, 18, 30);
      ctx.fillStyle = '#c8ccdc'; ctx.fillRect(x, y, 16, 3); ctx.fillRect(x, y + 25, 16, 3);
      ctx.fillStyle = '#7a7e94'; ctx.fillRect(x, y + 2, 16, 1); ctx.fillRect(x, y + 25, 16, 1);
      ctx.fillStyle = '#140832'; ctx.fillRect(x, y + 3, 16, 22);
      if (have) {
        for (let k = 0; k < 5; k++) {   // the infinity of light: frames inside frames
          const ix = x + k, iy = y + 3 + k, iw = 16 - k * 2, ih = 22 - k * 2;
          ctx.fillStyle = TUBE_COLS[(k + (t >> 3) + i) % 5]; ctx.globalAlpha = 0.55;
          ctx.fillRect(ix, iy, iw, 1); ctx.fillRect(ix, iy + ih - 1, iw, 1); ctx.fillRect(ix, iy, 1, ih); ctx.fillRect(ix + iw - 1, iy, 1, ih);
        }
        ctx.globalAlpha = 1;
        const b = BATTLERS[WILD[sp].art], img = spr(b.rows, b.pal);
        ctx.drawImage(img, x, y + 7 + Math.round(Math.sin(t / 15 + i) * 1), 16, 16);
      } else text(ctx, '?', x + 6, y + 10, '#4a3a7a');
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + 1, y + 4, 1, 12);
      text(ctx, have ? '×' + have : '', x0 + 10, y0 + 30, C.cyan, { align: 'center' });
    });
    const sp = CATCHABLE[this.sel], have = tubes[sp] || 0;
    box(ctx, 2, 99, W - 4, 43);
    text(ctx, have ? WILD[sp].name : '???', 8, 104, have ? C.gold : C.dim);
    text(ctx, 'BAG: ' + (st.bag.tube || 0) + ' EMPTY', 152, 104, C.dim, { align: 'right' });
    wrap(have ? WILD[sp].desc : 'Not captured yet. Weaken one in battle, then open a COSMIC TUBE!', W - 16).slice(0, 3).forEach((l, i) => text(ctx, l, 8, 114 + i * 9, C.text));
  }
}

/* ---------- your quest notes: the ship's parts, and the memories that have come back ---------- */
class QuestScreen extends Page {
  constructor(g) { super(g); this.page = 0; this.sel = 0; this.scroll = 0; }
  update(g) {
    if (super.update(g)) return;
    const inp = g.input, n = MEMORIES.length;
    if (inp.pressed.left || inp.pressed.right) { this.page ^= 1; sfx.move(); }
    if (this.page === 1) {
      if (inp.repeat('down')) { this.sel = (this.sel + 1) % n; sfx.move(); }
      if (inp.repeat('up')) { this.sel = (this.sel + n - 1) % n; sfx.move(); }
      if (this.sel < this.scroll) this.scroll = this.sel;
      if (this.sel >= this.scroll + 5) this.scroll = this.sel - 4;
    }
  }
  draw(ctx, g) { return this.page ? this.drawMemories(ctx, g) : this.drawParts(ctx, g); }
  drawParts(ctx, g) {
    const st = g.state, all = !!st.flags.chapter1;   // Chapter 2: all six
    const list = all ? CH1_PARTS.concat(CH2_PARTS) : CH1_PARTS;
    this.frame(ctx, 'SHIP PARTS ' + list.filter((k) => st.parts[k]).length + '/' + list.length + '  → MEMORIES');
    box(ctx, 2, 20, W - 4, 46);
    list.forEach((k, i) => {
      const got = !!st.parts[k];
      if (all) {   // two columns of three
        const x = 8 + Math.floor(i / 3) * 76, y = 26 + (i % 3) * 13;
        text(ctx, got ? '★' : '-', x, y, got ? C.gold : C.dim);
        text(ctx, got || i < 3 ? PARTS[k].name : '???', x + 10, y, got ? C.text : C.dim);
        return;
      }
      text(ctx, got ? '★' : '-', 8, 26 + i * 13, got ? C.gold : C.dim);
      text(ctx, PARTS[k].name, 18, 26 + i * 13, got ? C.text : C.dim);
      text(ctx, got ? 'FOUND' : '???', 152, 26 + i * 13, got ? C.green : C.dim, { align: 'right' });
    });
    box(ctx, 2, 68, W - 4, 48);
    text(ctx, 'NOW:', 8, 73, C.gold);
    wrap(st.goal || '', W - 20).slice(0, 3).forEach((l, i) => text(ctx, l, 8, 84 + i * 10, C.text));
    const side = st.flags['met-lumen'] && !st.flags['grimghoul-beaten'] ? "LUMEN'S LIGHT: " + Math.min(3, st.captures || 0) + ' of 3 creatures' : 'CAPTURED: ' + (st.captures || 0) + '   MEMORIES: ' + memoryCount(st) + '/' + MEMORIES.length;
    text(ctx, side, 6, 120, C.cyan);
    const mins = Math.floor((st.playMs || 0) / 60000);
    text(ctx, 'TIME ' + Math.floor(mins / 60) + ':' + String(mins % 60).padStart(2, '0') + '   BATTLES ' + (st.battles || 0) + '   STEPS ' + (st.steps || 0), 6, 131, C.dim);
  }
  drawMemories(ctx, g) {
    const st = g.state, mem = st.memories || [];
    this.frame(ctx, '← MEMORIES ' + mem.length + '/' + MEMORIES.length);
    box(ctx, 2, 19, W - 4, 58);
    for (let k = 0; k < 5; k++) {
      const i = k + this.scroll, m = MEMORIES[i];
      if (!m) break;
      const got = mem.includes(m.id), y = 25 + k * 10;
      if (i === this.sel) text(ctx, '▶', 8, y, C.gold);
      text(ctx, got ? '♥' : '·', 17, y, got ? '#ff8ad8' : C.dim);
      text(ctx, got ? m.title : '? ? ?', 25, y, got ? C.text : C.dim);
    }
    if (this.scroll > 0) text(ctx, '↑', W - 11, 22, C.dim);
    if (this.scroll + 5 < MEMORIES.length) text(ctx, '↓', W - 11, 66, C.dim);
    const m = MEMORIES[this.sel], got = mem.includes(m.id);
    box(ctx, 2, 79, W - 4, 63, { bg: got ? '#1e1238' : C.bg });
    wrap(got ? m.text : 'Still lost in the fog. Explore, talk to everyone, and it may come back to you...', W - 16).slice(0, 6).forEach((l, i) => text(ctx, l, 8, 84 + i * 9, got ? '#f0e6ff' : C.dim));
  }
}

/* ---------- the end of a chapter ---------- */
export class Ending {
  constructor(game, done, chapter = 1) { this.kind = 'Ending'; this.game = game; this.done = done; this.opaque = true; this.t = 0; this.chapter = chapter; }
  update(g) {
    this.t++;
    if (this.t > 120 && (g.input.pressed.a || g.input.pressed.start)) { sfx.select(); g.pop(this); this.done && this.done(); }
  }
  draw(ctx, g) {
    const st = g.state, t = this.t;
    sky(ctx);
    stars(ctx, t, 0.5);
    comet(ctx, (t * 0.9) % (W + 60) - 30, 40 + Math.sin(t / 20) * 6, t);
    text(ctx, 'CHAPTER ' + this.chapter, W / 2, 10, '#ffd23a', { scale: 2, outline: '#1a0f2e', align: 'center' });
    text(ctx, 'COMPLETE!', W / 2, 27, '#8ff0ff', { scale: 2, outline: '#1a0f2e', align: 'center' });
    box(ctx, 14, 52, W - 28, 68);
    const total = Object.values(st.jewels).reduce((a, b) => a + b, 0);
    const mins = Math.floor((st.playMs || 0) / 60000);
    [[st.pet.name, 'Lv ' + st.pet.lv], ['MEMORIES', memoryCount(st) + '/' + MEMORIES.length], ['CAPTURED', String(st.captures || 0)], ['JEWELS', total + ' (◆' + st.money + ')'], ['BATTLES', String(st.battles || 0)], ['TIME', Math.floor(mins / 60) + ':' + String(mins % 60).padStart(2, '0')]].forEach(([a, b], i) => {
      text(ctx, a, 22, 57 + i * 10, C.dim);
      text(ctx, b, W - 22, 57 + i * 10, C.text, { align: 'right' });
    });
    text(ctx, 'TO BE CONTINUED...', W / 2, 124, '#e6d8ff', { align: 'center', shadow: '#1a0f2e' });
    if (t > 120 && Math.floor(t / 24) % 2 === 0) text(ctx, 'PRESS A', W / 2, 134, '#ffd23a', { align: 'center', shadow: '#1a0f2e' });
  }
}

/* ---------- a short hop in the COMET (Chapter 2): over the curve of Kirra, to wherever you're going ---------- */
export class Flight {
  /* opt.dragon: on the White Dragon's back instead of in the COMET; opt.end: the colour to fade to as it ends */
  constructor(game, dest, done, opt = {}) { this.kind = 'Flight'; this.game = game; this.dest = dest; this.done = done; this.opt = opt; this.opaque = true; this.t = 0; }
  update(g) {
    this.t++;
    if (this.t > 170 || (this.t > 40 && (g.input.pressed.a || g.input.pressed.start))) {
      g.fadeLevel = 1; g.fadeColour = this.opt.end || '#000000';   // so the old place doesn't flash up before the new one
      g.pop(this); this.done && this.done();
    }
  }
  draw(ctx) {
    const t = this.t;
    sky(ctx, '#140832', '#2e1660', '#4a2a8a');
    stars(ctx, t, 1.2);
    // Kirra's curve below, sliding past: red wilds, green jungle, the purple glow of the Jelly Jam
    for (let x = 0; x < W; x++) {
      const top = 104 + Math.round(((x - W / 2) ** 2) / 260);
      const band = Math.floor((x + t * 1.5) / 26) % 4;
      ctx.fillStyle = ['#b4443c', '#25603f', '#4a1f7a', '#3e4a26'][band]; ctx.fillRect(x, top, 1, H - top);
      ctx.fillStyle = '#8ff0ff'; ctx.fillRect(x, top - 1, 1, 1);
    }
    for (let i = 0; i < 6; i++) { const cx = (W + 40 - ((t * 2.2 + i * 53) % (W + 80))) | 0, cy = 70 + ((i * 17) % 30); ctx.fillStyle = 'rgba(230,216,255,0.5)'; ctx.fillRect(cx, cy, 18, 1); ctx.fillRect(cx + 4, cy - 1, 9, 1); }
    const k = Math.min(1, t / 140), x = -20 + k * (W + 40), y = 58 - Math.sin(k * Math.PI) * 18;
    if (this.opt.dragon) {   // the White Dragon, with you on its back and the COMET in its claws
      const b = BATTLERS.whiteDragon, img = spr(b.rows, b.pal, true);
      for (let i = 1; i < 10; i++) { ctx.fillStyle = i % 2 ? '#ffffff' : '#c8f4ff'; ctx.fillRect(Math.round(x - 30 - i * 3), Math.round(y + 4 + Math.sin((t + i * 3) / 4) * 2), 1, 1); }
      ctx.drawImage(img, Math.round(x - 24), Math.round(y - 22 + Math.sin(t / 8) * 2));
      ctx.drawImage(spr(CH.HERO_TOP.side, CH.HERO_PAL, false), Math.round(x - 4), Math.round(y - 26 + Math.sin(t / 8) * 2));
      if (this.opt.comet) comet(ctx, x - 6, y + 20, t);
    } else {
      for (let i = 1; i < 10; i++) { ctx.fillStyle = i % 2 ? '#ffd23a' : '#ff8a1e'; ctx.fillRect(Math.round(x - 14 - i * 3), Math.round(y + Math.sin((t + i * 3) / 4)), 2, 1); }
      comet(ctx, x, y, t, -Math.cos(k * Math.PI) * 0.15);
    }
    box(ctx, 8, 6, W - 16, 26);
    text(ctx, this.opt.dragon ? 'FLYING TO' : 'SHORT HOP TO', W / 2, 10, C.dim, { align: 'center' });
    text(ctx, this.dest, W / 2, 20, C.gold, { align: 'center' });
  }
}

/* ---------- dreams on the COMET: a summer's day before the war, and the war itself ----------
   'summer': two kids on a warm kerb, then wall-ball against the gable end (press A to hit it back!) until
   the ball lands on Mr Nolan's roof. 'war': the lost years, counted and forgotten, until her light breaks through. */
const DAY = { sky: ['#6ec0f0', '#8ccff4', '#b4e2fa'], brick: '#b8584a', brick2: '#8a3a32', slate: '#4a5068', slate2: '#6a7290', frame: '#f6f2ff', glass: '#8ac8e8', pave: '#a8a8b8', pave2: '#8e8e9e', kerb: '#d8d8e0', road: '#5a5a66' };
export class Dream {
  constructor(game, which, done) {
    this.kind = 'Dream'; this.game = game; this.which = which; this.done = done; this.opaque = true; this.t = 0;
    this.kids = { hero: { x: 70, y: 117, pose: 'sit', flip: false }, enya: { x: 92, y: 117, pose: 'sit', flip: false } };
    this.ball = null; this.win = 0; this.nolan = false; this.bang = 0; this.prompt = false; this.label = 0; this.dawn = 0; this.year = null;
    this.go().catch((e) => { console.error(e); this.finish(); });
  }
  get name() { return this.game.state.name; }
  finish() { if (this.over) return; this.over = true; this.game.pop(this); this.done && this.done(); }
  update(g) {
    this.t++;
    if (this.swingWanted && (g.input.pressed.a || g.input.pressed.b)) this.swung = true;
  }
  async go() {
    const g = this.game;
    g.fadeLevel = 1; g.fadeColour = '#ffffff';
    await g.fade(0, 40, '#ffffff');
    return this.which === 'war' ? this.war() : this.summer();
  }

  /* the ball's flight from (x0, y0) to (x1, y1) over n frames, with an arc */
  async fly(x0, y0, x1, y1, n, arc = 10) {
    for (let i = 0; i <= n; i++) { const k = i / n; this.ball = { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * arc }; await this.game.wait(1); }
  }
  async summer() {
    const g = this.game, E = 'ENYA', you = (s) => g.say(s, { name: this.name, voice: 'hero' });
    playMusic('dream');
    this.label = 1;
    await g.wait(60);
    this.label = 0;
    await g.say('A warm kerb. A blue sky. The smell of cut grass. You know this street...');
    await g.say('This is the best day EVER. No school, no chores, nothing to do all day but this.', { name: E });
    await you('My lolly is melting all down my arm.');
    await g.say('Lick faster, then! Ha!', { name: E });
    await g.say('...sitting on the kerb outside her house, doing nothing at all... the best days of your life...', { name: this.name, mutter: true });
    await remember(g, 'summer');
    await g.say("Right. Bet you can't beat me at wall-ball.", { name: E });
    // up, and over to the gable wall
    const H0 = this.kids.hero, E0 = this.kids.enya;
    H0.pose = E0.pose = 'stand';
    await g.wait(10);
    for (let i = 0; i < 30; i++) { H0.x += (62 - 70) / 30; E0.x += (44 - 92) / 30; await g.wait(1); }
    H0.flip = E0.flip = true;   // facing the wall
    await g.say('She pulls a scruffy old tennis ball out of her pocket. TIP: press A to hit the ball back when it comes to you!');
    // the rally: she hits, it bounces off the wall, comes to you: hit it back!
    let hits = 0, tries = 0;
    while (hits < 3 && tries < 6) {
      tries++;
      E0.pose = 'swing'; sfx.thwack(); await this.fly(E0.x - 4, 100, 31, 74, 12, 6); E0.pose = 'stand';
      sfx.thwack(); await this.fly(31, 74, 50, 114, 10, 2);
      sfx.land(); await this.fly(50, 114, H0.x - 2, 100, 10, 12);
      this.swingWanted = true; this.swung = false; this.prompt = true;
      for (let i = 0; i < 22 && !this.swung; i++) { this.ball.x += 0.7; this.ball.y += 0.4; await g.wait(1); }
      this.swingWanted = false; this.prompt = false;
      if (this.swung) {
        hits++; H0.pose = 'swing'; sfx.thwack();
        await this.fly(this.ball.x, this.ball.y, 31, 76, 12, 6); H0.pose = 'stand';
        sfx.thwack(); await this.fly(31, 76, 40, 112, 8, 2);
        sfx.land(); await this.fly(40, 112, E0.x - 2, 100, 8, 10);
        if (hits === 1) g.toast('Nice shot!', C.gold);
      } else {
        await this.fly(this.ball.x, this.ball.y, 130, 118, 18, 4);
        this.ball = null;
        await g.say(['Butterfingers!', 'Ha! Too slow!', 'Watch the BALL, not me!'][tries % 3], { name: E });
      }
    }
    // the big one: far too hard, right up onto Mr Nolan's roof
    await you('Right. Watch THIS one.');
    E0.pose = 'swing'; sfx.thwack(); await this.fly(E0.x - 4, 100, 31, 74, 12, 6); E0.pose = 'stand';
    sfx.thwack(); await this.fly(31, 74, 52, 112, 10, 2); await this.fly(52, 112, H0.x - 2, 100, 10, 12);
    H0.pose = 'swing'; sfx.thwack(); g.shake(6, 1);
    await this.fly(H0.x - 2, 100, 76, 44, 26, 40);
    H0.pose = 'stand';
    sfx.bump(); await this.fly(76, 44, 82, 40, 8, 4); sfx.bump(); await this.fly(82, 40, 88, 48, 8, 3);
    sfx.thoom(); g.shake(10, 2); this.bang = 30;
    this.ball = { x: 88, y: 49 };
    await g.say('THUNK. The ball rolls along the slates... and drops into Mr Nolan\'s gutter.');
    await g.say('Uh-oh.', { name: E });
    sfx.door();
    for (let i = 0; i <= 10; i++) { this.win = i / 10; await g.wait(1); }
    this.nolan = true; this.bubble = 70; sfx.encounter();
    await g.wait(20);
    await g.say("OI! SH!TE! Not AGAIN! That's the third ball on me roof this WEEK!", { name: 'MR NOLAN' });
    await g.say('#$%&! Ya little gurriers! It\'s MINE now, d\'ye hear me?!', { name: 'MR NOLAN' });
    await g.say('RUN!', { name: E });
    H0.pose = E0.pose = 'run'; H0.flip = E0.flip = false;
    for (let i = 0; i < 70; i++) { H0.x += 2.2; E0.x += 2.4; H0.y = 117 - (Math.floor(i / 4) % 2); E0.y = 117 - (Math.floor(i / 4 + 1) % 2); await g.wait(1); }
    await g.say('Laughter echoes down the street, all the way round the corner.');
    await g.say('...Mr Nolan. He never gave a single ball back. She laughed so hard she cried...', { name: this.name, mutter: true });
    await remember(g, 'squash');
    await g.fade(1, 40, '#ffffff');
    this.finish();
  }
  async war() {
    const g = this.game, E = 'ENYA';
    playMusic('vision');
    await g.say('You are dreaming of the war again.');
    for (const y of ['YEAR 1', 'YEAR 2', 'YEAR 4', 'YEAR 7', 'YEAR ?']) {
      this.year = { s: y, t: 0 }; sfx.heartbeat(); g.shake(8, 1);
      await g.wait(50);
    }
    this.year = null;
    await g.say('Sirens. Searchlights. Orders shouted in the dark. You stopped counting the days, then the months, then the years.');
    await g.say('...how long was I gone...? Two years...? Ten...? Nobody could ever tell me...', { name: this.name, mutter: true });
    await remember(g, 'years');
    await g.say('Then, through the smoke, a little light. Bright as a diamond.');
    sfx.flash();
    for (let i = 0; i <= 60; i++) { this.dawn = i / 60; await g.wait(1); }
    await g.say('Wherever the stars take you...', { name: E });
    await g.say("...I'll find you.", { name: this.name, voice: 'hero' });
    await g.fade(1, 40, '#ffffff');
    this.finish();
  }

  draw(ctx) {
    if (this.which === 'war') return this.drawWar(ctx);
    const t = this.t;
    // the whole street sits 22 pixels up, so the kids on the kerb stay above the dialogue box
    ctx.save();
    ctx.translate(0, -22);
    // the summer sky, the sun, slow clouds
    for (let y = -22; y < 60; y++) { ctx.fillStyle = DAY.sky[Math.max(0, Math.min(2, Math.floor((y + 10) / 22)))]; ctx.fillRect(0, y, W, 1); }
    disc(ctx, 136, 14, 8, '#fff2a0'); disc(ctx, 136, 14, 6, '#ffe060');
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + t / 90; ctx.fillStyle = '#fff2a0'; ctx.fillRect(Math.round(136 + Math.cos(a) * 12), Math.round(14 + Math.sin(a) * 12), 1, 1); }
    for (let i = 0; i < 3; i++) { const cx = ((i * 70 + t * 0.15) % (W + 60)) - 30, cy = 10 + i * 9; ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(cx), cy, 22, 4); ctx.fillRect(Math.round(cx) + 4, cy - 3, 12, 3); }
    // the gable end (the wall you hit the ball against) and the row of houses
    ctx.fillStyle = DAY.brick; ctx.fillRect(0, 36, 31, 60);
    for (let y = 22; y < 36; y++) { const w = Math.round(((y - 22) / 14) * 15); ctx.fillRect(15 - w, y, w * 2 + 1, 1); }
    ctx.fillStyle = DAY.brick2; for (let y = 40; y < 96; y += 4) for (let x = (y / 4) % 2 ? 0 : 4; x < 31; x += 8) ctx.fillRect(x, y, 1, 3);
    for (let y = 39; y < 96; y += 4) ctx.fillRect(0, y, 31, 1);
    ctx.fillStyle = '#6a2a24'; ctx.fillRect(10, 16, 5, 8); ctx.fillStyle = DAY.brick2; ctx.fillRect(9, 15, 7, 2);
    for (let h = 0; h < 4; h++) {
      const x = 31 + h * 33;
      ctx.fillStyle = h % 2 ? '#c8705a' : DAY.brick; ctx.fillRect(x, 50, 33, 46);
      ctx.fillStyle = DAY.slate; ctx.fillRect(x - 1, 38, 35, 13); ctx.fillStyle = DAY.slate2; for (let y = 40; y < 50; y += 3) ctx.fillRect(x, y, 33, 1);
      ctx.fillStyle = '#3a3a4a'; ctx.fillRect(x - 1, 50, 35, 2);   // the gutter
      ctx.fillStyle = DAY.brick2; ctx.fillRect(x + 24, 30, 5, 9);
      const upWin = h === 1 ? this.win : 0;
      ctx.fillStyle = DAY.frame; ctx.fillRect(x + 6, 56, 12, 12); ctx.fillStyle = upWin > 0 ? '#2a2a3a' : DAY.glass; ctx.fillRect(x + 7, 57, 10, 10);
      if (upWin > 0 && upWin < 1) { ctx.fillStyle = DAY.glass; ctx.fillRect(x + 7, 57, Math.round(10 * (1 - upWin)), 10); }
      ctx.fillStyle = DAY.frame; ctx.fillRect(x + 4, 74, 12, 12); ctx.fillStyle = DAY.glass; ctx.fillRect(x + 5, 75, 10, 10); ctx.fillStyle = DAY.frame; ctx.fillRect(x + 10, 75, 1, 10);
      ctx.fillStyle = ['#2f8a5a', '#c8402a', '#3a5ac8', '#ffd23a'][h]; ctx.fillRect(x + 20, 74, 9, 22); ctx.fillStyle = '#ffd23a'; ctx.fillRect(x + 27, 85, 1, 1);
    }
    if (this.nolan) {   // MR NOLAN, leaning out of his window, a "!" over his head
      ctx.drawImage(spr(CH.NOLAN, CH.NOLAN_CROSS), 31 + 33 + 4, 56);
      if (this.bubble > 0) { this.bubble--; ctx.fillStyle = '#ffffff'; ctx.fillRect(74, 41, 9, 11); ctx.fillStyle = '#1a0f2e'; ctx.fillRect(74, 40, 9, 1); ctx.fillRect(74, 52, 9, 1); ctx.fillRect(73, 41, 1, 11); ctx.fillRect(83, 41, 1, 11); text(ctx, '!', 77, 43, '#e8102e'); }
    }
    // the pavement, the kerb, the road, a lamp post
    ctx.fillStyle = DAY.pave; ctx.fillRect(0, 96, W, 20);
    ctx.fillStyle = DAY.pave2; for (let x = 0; x < W; x += 16) ctx.fillRect(x, 96, 1, 20); ctx.fillRect(0, 106, W, 1);
    ctx.fillStyle = DAY.kerb; ctx.fillRect(0, 116, W, 4); ctx.fillStyle = DAY.road; ctx.fillRect(0, 120, W, 50);
    ctx.fillStyle = '#e8e8f0'; for (let x = 4; x < W; x += 24) ctx.fillRect(x, 140, 12, 1);
    ctx.fillStyle = '#2a2a3a'; ctx.fillRect(146, 58, 2, 58); ctx.fillRect(142, 56, 8, 3); ctx.fillStyle = '#fff2a0'; ctx.fillRect(143, 59, 6, 2);
    // two kids
    for (const [who, pal] of [['hero', CH.KID_HERO_PAL], ['enya', CH.KID_ENYA_PAL]]) {
      const k = this.kids[who];
      ctx.drawImage(spr(CH.KID[who][k.pose], pal, k.flip), Math.round(k.x - 8), Math.round(k.y - 16));
    }
    if (this.ball) { const bx = Math.round(this.ball.x), by = Math.round(this.ball.y); ctx.fillStyle = '#1a0f2e'; ctx.fillRect(bx - 1, by - 1, 4, 4); ctx.fillStyle = '#d8ff3a'; ctx.fillRect(bx, by, 2, 2); ctx.fillStyle = '#ffffff'; ctx.fillRect(bx, by, 1, 1); }
    if (this.prompt && t % 16 < 10) text(ctx, 'A!', Math.round(this.kids.hero.x) - 3, 92, C.gold, { outline: '#1a0f2e' });
    ctx.restore();
    // the dreamy glow round the edges
    ctx.fillStyle = 'rgba(255,230,180,0.14)'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(255,248,230,' + (0.22 - i * 0.035).toFixed(3) + ')'; ctx.fillRect(i, i, W - i * 2, 1); ctx.fillRect(i, H - 1 - i, W - i * 2, 1); ctx.fillRect(i, i, 1, H - i * 2); ctx.fillRect(W - 1 - i, i, 1, H - i * 2); }
    if (this.label) { box(ctx, 30, 36, 100, 22, { bg: C.bg2 }); text(ctx, '· a memory ·', W / 2, 40, '#ffe6a0', { align: 'center' }); text(ctx, 'a summer, long ago', W / 2, 49, C.dim, { align: 'center' }); }
  }
  drawWar(ctx) {
    const t = this.t, d = this.dawn;
    // a night sky glowing red at the horizon (or a dawn, as her light breaks through)
    for (let y = 0; y < H; y++) {
      const k = y / H;
      ctx.fillStyle = d > 0 ? (k < 0.5 ? '#3a2a6a' : k < 0.8 ? '#c86a8a' : '#ffc8a0') : (k < 0.5 ? '#0a0614' : k < 0.8 ? '#2a0a1a' : '#6a1a1a');
      ctx.fillRect(0, y, W, 1);
    }
    if (d > 0) { ctx.globalAlpha = 1 - d; for (let y = 0; y < H; y++) { const k = y / H; ctx.fillStyle = k < 0.5 ? '#0a0614' : k < 0.8 ? '#2a0a1a' : '#6a1a1a'; ctx.fillRect(0, y, W, 1); } ctx.globalAlpha = 1; }
    // searchlights sweeping (out of step with each other), and far-off flashes
    const ground = 96;   // above the dialogue box
    if (d < 1) for (let i = 0; i < 2; i++) {
      const a = -Math.PI / 2 + Math.sin(t / (44 + i * 23) + i * 2.6) * 0.55 + (i ? 0.35 : -0.35), bx = 28 + i * 104;
      ctx.globalAlpha = 0.11 * (1 - d); ctx.fillStyle = '#fff2c0';
      for (let r = 0; r < 110; r += 1) { const w = Math.round(r / 14); ctx.fillRect(Math.round(bx + Math.cos(a) * r) - w, Math.round(ground + Math.sin(a) * r), w * 2 + 1, 1); }
      ctx.globalAlpha = 1;
    }
    if (d < 1 && (t % 47 < 6 || t % 83 < 4)) { const fx = 20 + ((t * 37) % 120), fy = ground - 26 + ((t * 13) % 14); ctx.globalAlpha = 1 - d; disc(ctx, fx, fy, 4 + (t % 6), '#ffd23a'); disc(ctx, fx, fy, 2, '#ffffff'); ctx.globalAlpha = 1; }
    // the city, in silhouette
    ctx.fillStyle = d > 0.5 ? '#3a2a4a' : '#05020a';
    for (let i = 0; i < 12; i++) { const bw = 10 + Math.floor(hash(i, 0, 61) * 10), bh = 16 + Math.floor(hash(i, 1, 61) * 26), bx = i * 14 - 4; ctx.fillRect(bx, ground - bh, bw, bh); }
    ctx.fillRect(0, ground, W, H - ground);
    ctx.fillStyle = '#ffd23a'; for (let i = 0; i < 20; i++) if ((t >> 5) + i * 7 & 1) ctx.fillRect(Math.floor(hash(i, 2, 61) * W), ground - 30 + Math.floor(hash(i, 3, 61) * 26), 1, 1);
    // embers drifting up
    for (let i = 0; i < 14; i++) { const ex = (hash(i, 4, 61) * W + Math.sin((t + i * 20) / 30) * 6) % W, ey = H - ((t * (0.3 + hash(i, 5, 61) * 0.5) + i * 23) % H); ctx.fillStyle = i % 3 ? '#ff8a1e' : '#ffd23a'; ctx.globalAlpha = 1 - d; ctx.fillRect(Math.round(ex), Math.round(ey), 1, 1); ctx.globalAlpha = 1; }
    if (this.year) { const k = Math.min(1, (t % 50) / 10) * Math.min(1, (50 - (t % 50)) / 10); ctx.globalAlpha = Math.max(0.2, k); text(ctx, this.year.s, W / 2, 40, '#e6d8ff', { scale: 2, outline: '#1a0f2e', align: 'center' }); ctx.globalAlpha = 1; }
    if (d > 0) glint(ctx, W / 2, 50, t, 1 + d);
  }
}

/* ---------- choosing your companion ----------
   All three guardians side by side on glowing pedestals, each showing off: NOVA in a ring of fire
   with claw swipes, the dragon breathing fire or frost (up / down picks the colour), LUMI blowing
   bubbles and glowing. Resolves with { species, variant } or null. */
const STARTERS = [
  { species: 'tiger', art: ['tiger'], name: ['NOVA'], tag: ['claws, fire, healing licks'], col: ['#ff9a3a'] },
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
    if (s === 'tiger' && t % 90 === 45) this.fx.push({ k: 'heart', x: x + rnd(-6, 6), y: 40, vx: rnd(-0.1, 0.1), vy: -0.4, t: 0, life: 60 });
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
      else if (f.k === 'heart') {
        ctx.globalAlpha = Math.min(1, (1 - k) * 2);
        const hx = Math.round(f.x + Math.sin(f.t / 9) * 2), hy = Math.round(f.y);
        ctx.fillStyle = '#e81617'; ctx.fillRect(hx, hy, 2, 2); ctx.fillRect(hx + 3, hy, 2, 2); ctx.fillRect(hx, hy + 1, 5, 2); ctx.fillRect(hx + 1, hy + 3, 3, 1); ctx.fillRect(hx + 2, hy + 4, 1, 1);
      }
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
