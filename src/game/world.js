/* The overworld: walking tile by tile, your companion and Enya following (or carrying you), people to
   talk to, jewels to pick up, glowgrass where wild creatures hide, and doors to the next area. */
import { W, H, spr } from '../engine/pixel.js';
import { paintMap, buildProps, TILE } from '../art/tiles.js';
import { MAPS } from './maps.js';
import * as CH from '../art/chars.js';
import { BATTLERS } from '../art/battlers.js';
import { JEWELS, PARTS, WILD, newWild, companionStats, MAX_EN } from './data.js';
import { text, measure } from '../engine/font.js';
import { box, C } from './ui.js';
import { sfx, playMusic } from '../engine/audio.js';
import { SCRIPTS } from './story.js';
import { Battle } from './battle.js';
import { GEM, COIN, COIN_EDGE, DIAMOND, GEM_PAL, PART_ART, PART_PAL } from '../art/items.js';
import { pauseMenu } from './scenes.js';

let PROPS = null;
const painted = {};
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
const rnd = (a, b) => a + Math.random() * (b - a);

const BUBBLE = { K: '#1a0f2e', W: '#ffffff', R: '#e8102e', P: '#ff3a5a' };

export class World {
  constructor(game, mapId, x, y, dir) {
    this.game = game;
    this.kind = 'World';
    this.opaque = true;
    PROPS = PROPS || buildProps();
    this.busy = 0;
    this.particles = [];
    this.emotes = [];
    this.load(mapId, x, y, dir);
  }

  get st() { return this.game.state; }

  load(mapId, x, y, dir) {
    const m = MAPS[mapId], st = this.st;
    this.map = m;
    this.rows = m.rows;
    this.mw = m.rows[0].length;
    this.mh = m.rows.length;
    this.frames = painted[mapId] || (painted[mapId] = paintMap(m.rows));
    st.map = mapId; st.x = x; st.y = y; st.dir = dir;
    this.player = { id: 'player', x, y, px: x * 16, py: y * 16, dir, moving: false, turnT: 0, parity: 0, prog: 0, bumpT: 0 };
    this.npcs = m.npcs.filter((n) => !(n.flag && st.flags[n.flag])).map((n) => {
      const o = { ...n, px: n.x * 16, py: n.y * 16, moving: false, parity: 0, prog: 0, wanderT: 120 + Math.random() * 200, home: { x: n.x, y: n.y } };
      return o;
    });
    if (st.flags['gate-open']) { const d = this.npc('drone'); if (d) { d.x = 23; d.y = 10; d.px = d.x * 16; d.py = d.y * 16; d.dir = 'down'; } }
    if (st.flags['sprig-grove']) { const s = this.npc('sprig'); if (s) { s.x = 15; s.y = 5; s.px = 240; s.py = 80; } }
    this.props = m.props.map((p) => ({ ...p, def: PROPS[p.t] }));
    this.jewels = (m.jewels || []).filter((j) => !st.got[j.id]);
    this.parts = (m.parts || []).filter((p) => !st.parts[p.id]);
    this.blockGrid = new Uint8Array(this.mw * this.mh);
    for (const p of this.props) {
      const d = p.def;
      for (let j = 0; j < d.h; j++) for (let i = 0; i < d.w; i++) this.blockGrid[(p.y + j) * this.mw + p.x + i] = 1;
    }
    // never start inside something solid (a save from before a prop moved)
    if (this.solidTile(x, y) || this.npcAt(x, y)) {
      let best = null;
      for (let r = 1; r < 6 && !best; r++) for (let dy = -r; dy <= r && !best; dy++) for (let dx = -r; dx <= r && !best; dx++) {
        if (!this.solidTile(x + dx, y + dy) && !this.npcAt(x + dx, y + dy)) best = [x + dx, y + dy];
      }
      if (best) { this.player.x = best[0]; this.player.y = best[1]; this.player.px = best[0] * 16; this.player.py = best[1] * 16; st.x = best[0]; st.y = best[1]; }
    }
    this.buildFollowers();
    this.particles = [];
    this.banner = { str: m.name.toUpperCase(), t: 0 };
    this.updateMusic();
  }

  /* the tune for where you are: a zone's own (the scrap nest), riding, or the area's backing tracks */
  musicHere() {
    const p = this.player, z = (this.map.zones || []).find((q) => p.x >= q.x && p.x < q.x + q.w && p.y >= q.y && p.y < q.y + q.h);
    if (z) return z.music;
    if (this.st.riding && this.st.pet) return 'ride';
    return this.map.music;
  }
  updateMusic() { playMusic(this.musicHere()); }

  /* your companion walks behind you (or carries you), then Enya on the Emerald Tiger */
  buildFollowers() {
    const st = this.st, p = this.player;
    this.followers = [];
    if (st.pet && !st.riding) this.followers.push({ id: 'pet', kind: 'pet' });
    if (st.flags.enya) this.followers.push({ id: 'enya', kind: 'enya' });
    const [dx, dy] = DIRS[OPP[p.dir]];
    let bx = p.x, by = p.y;
    this.followers.forEach((f, i) => {
      const nx = bx + dx, ny = by + dy;
      if (!this.solidTile(nx, ny) && !this.npcAt(nx, ny)) { bx = nx; by = ny; }
      Object.assign(f, { x: bx, y: by, px: bx * 16, py: by * 16, dir: p.dir, moving: false, parity: i, prog: 0 });
    });
  }

  npc(id) { return this.npcs.find((n) => n.id === id); }
  tile(x, y) { return x < 0 || y < 0 || x >= this.mw || y >= this.mh ? '^' : this.rows[y][x]; }
  solidTile(x, y) {
    if (x < 0 || y < 0 || x >= this.mw || y >= this.mh) return true;
    return !!(TILE[this.rows[y][x]] || {}).solid || this.blockGrid[y * this.mw + x] === 1;
  }
  npcAt(x, y) {
    for (const n of this.npcs) {
      if (n.big) { if ((x === n.x || x === n.x + 1) && (y === n.y || y === n.y - 1)) return n; continue; }
      if (n.x === x && n.y === y) return n;
      if (n.moving && n.tx === x && n.ty === y) return n;
    }
    return null;
  }
  blocked(x, y, who) {
    if (this.solidTile(x, y)) return true;
    const n = this.npcAt(x, y);
    if (n && n !== who) return true;
    if (who && who !== this.player && this.player.x === x && this.player.y === y) return true;
    return false;
  }
  propAt(x, y) {
    for (const p of this.props) { const d = p.def; if (x >= p.x && x < p.x + d.w && y >= p.y && y < p.y + d.h) return p; }
    return null;
  }

  /* ---------- the loop ---------- */
  update(g) {
    const inp = g.input, p = this.player;
    this.tick(g);
    if (this.busy || this.leaving) return;
    if (!p.moving) {
      if (inp.pressed.start) { sfx.select(); this.run(pauseMenu); return; }
      if (inp.pressed.select) { this.toggleRide(); return; }
      if (inp.pressed.b) { this.hop(); return; }
      if (inp.pressed.a) { this.interact(); return; }
      const d = inp.dir();
      if (d) {
        if (d !== p.dir) { p.dir = d; p.turnT = 5; }
        else if (p.turnT > 0) p.turnT--;
        else this.tryMove(d);
      } else p.turnT = 0;
    }
  }
  /* animation that keeps running under dialogue boxes and menus */
  tick(g) {
    const p = this.player, speed = this.st.riding ? 2 : 1;
    this.stepEntity(p, speed, () => this.onStep());
    for (const f of this.followers) this.stepEntity(f, speed);
    for (const n of this.npcs) {
      this.stepEntity(n, 1);
      if (n.wander && !this.busy && !n.moving && g.top === this) {
        if (--n.wanderT <= 0) {
          n.wanderT = 90 + Math.random() * 240;
          const d = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
          n.dir = d;
          const [dx, dy] = DIRS[d], tx = n.x + dx, ty = n.y + dy;
          if (Math.abs(tx - n.home.x) <= 2 && Math.abs(ty - n.home.y) <= 2 && !this.blocked(tx, ty, n) && !this.followers.some((f) => f.x === tx && f.y === ty)) this.beginMove(n, tx, ty);
        }
      }
    }
    if (p.bumpT > 0) p.bumpT--;
    for (const e of [p, ...this.followers, ...this.npcs]) { if (e.hopT > 0) e.hopT--; if (e.wiggleT > 0) e.wiggleT--; }
    if (this.timers && this.timers.length) {
      const due = this.timers.filter((q) => --q.t <= 0);
      this.timers = this.timers.filter((q) => q.t > 0);
      for (const q of due) q.fn();
    }
    this.banner.t++;
    if (this.map.id === 'bloomhaven') this.podFx(g.t);
    // particles: smoke from the crashed ship, drifting pollen, sparkles
    const t = g.t;
    if (this.map.id === 'bloomhaven' && !this.st.flags.chapter1 && t % 9 === 0) {
      this.particles.push({ x: 3 * 16 + 30 + rnd(-4, 4), y: 3 * 16 + 4, vx: rnd(-0.1, 0.25), vy: -rnd(0.25, 0.45), life: 90, age: 0, kind: 'smoke' });
    }
    if (t % 14 === 0) {
      const cx = this.camX || 0, cy = this.camY || 0;
      this.particles.push({ x: cx + rnd(0, W), y: cy + rnd(0, H), vx: rnd(-0.15, 0.15), vy: rnd(-0.2, -0.05), life: 160, age: 0, kind: this.map.id === 'wilds' ? 'spore' : 'petal' });
    }
    for (const q of this.particles) { q.age++; q.x += q.vx; q.y += q.vy; }
    this.particles = this.particles.filter((q) => q.age < q.life);
    this.emotes = this.emotes.filter((e) => ++e.t < e.life);
  }

  stepEntity(e, speed, done) {
    if (!e.moving) return;
    e.prog += speed;
    const [dx, dy] = DIRS[e.dir];
    e.px = e.fx * 16 + dx * Math.min(16, e.prog);
    e.py = e.fy * 16 + dy * Math.min(16, e.prog);
    if (e.prog >= 16) {
      e.moving = false;
      e.x = e.tx; e.y = e.ty;
      e.px = e.x * 16; e.py = e.y * 16;
      e.parity ^= 1;
      if (e.resolve) { const r = e.resolve; e.resolve = null; r(); }
      if (done) done();
    }
  }
  beginMove(e, tx, ty) {
    e.fx = e.x; e.fy = e.y; e.tx = tx; e.ty = ty; e.prog = 0; e.moving = true;
    const dx = tx - e.x, dy = ty - e.y;
    e.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
  }

  tryMove(d) {
    const p = this.player, [dx, dy] = DIRS[d], tx = p.x + dx, ty = p.y + dy;
    if (this.blocked(tx, ty, p)) {
      if (p.bumpT === 0) { sfx.bump(); p.bumpT = 18; }
      return;
    }
    this.moveParty(tx, ty);
  }
  /* you step to (tx, ty) and the party shuffles up behind you */
  moveParty(tx, ty) {
    const p = this.player;
    let prevX = p.x, prevY = p.y;
    for (const f of this.followers) {
      const ox = f.x, oy = f.y;
      if (f.moving) { f.x = f.tx; f.y = f.ty; }
      if (prevX !== f.x || prevY !== f.y) this.beginMove(f, prevX, prevY);
      prevX = ox; prevY = oy;
    }
    this.beginMove(p, tx, ty);
  }

  onStep() {
    const p = this.player, st = this.st;
    st.x = p.x; st.y = p.y; st.dir = p.dir;
    if (this.busy) return;
    st.steps = (st.steps || 0) + 1;
    p.sinceBattle = (p.sinceBattle || 0) + 1;
    // jewels
    const j = this.jewels.find((q) => q.x === p.x && q.y === p.y);
    if (j) {
      this.jewels = this.jewels.filter((q) => q !== j);
      st.got[j.id] = true;
      st.jewels[j.kind] = (st.jewels[j.kind] || 0) + 1;
      st.money += JEWELS[j.kind].value;
      sfx.jewel(j.kind);
      this.game.toast('+1 ' + JEWELS[j.kind].name + '  ◆' + JEWELS[j.kind].value, j.kind === 'gold' ? C.gold : j.kind === 'emerald' ? C.green : j.kind === 'ruby' ? '#ff6a7a' : j.kind === 'sapphire' ? '#7fb0ff' : C.cyan);
      this.sparkle(p.px + 8, p.py + 4, 10);
    }
    // ship parts
    const part = this.parts.find((q) => q.x === p.x && q.y === p.y);
    if (part) { this.parts = this.parts.filter((q) => q !== part); this.run(SCRIPTS.part, part); return; }
    // doors to the next area
    const warp = (this.map.warps || []).find((w) => w.x === p.x && w.y === p.y);
    if (warp) { this.warp(warp); return; }
    // story triggers
    for (const tr of this.map.triggers || []) {
      if (st.flags[tr.id]) continue;
      if (p.x >= tr.x && p.x < tr.x + tr.w && p.y >= tr.y && p.y < tr.y + tr.h && SCRIPTS[tr.script]) { this.run(SCRIPTS[tr.script], tr); return; }
    }
    // wild creatures in the glowgrass (it rustles as you push through)
    const t = TILE[this.tile(p.x, p.y)] || {};
    if (t.encounter) {
      sfx.rustle();
      for (let i = 0; i < 4; i++) this.particles.push({ x: p.px + 4 + rnd(0, 8), y: p.py + 10, vx: rnd(-0.5, 0.5), vy: -rnd(0.4, 0.9), life: 16, age: 0, kind: 'leaf' });
    }
    this.updateMusic();
    if (t.encounter && st.pet && p.sinceBattle > 3 && Math.random() < 0.11) {
      const list = this.map.encounters || [];
      let r = Math.random() * list.reduce((n, e) => n + e.weight, 0);
      const e = list.find((q) => (r -= q.weight) < 0) || list[0];
      if (e) this.run(async (g, w) => { await w.battle({ species: e.species, lv: Math.floor(rnd(e.min, e.max + 1)) }); });
    }
  }

  interact() {
    const p = this.player, [dx, dy] = DIRS[p.dir], fx = p.x + dx, fy = p.y + dy;
    const n = this.npcAt(fx, fy);
    if (n) {
      if (!n.big && !n.hover) n.dir = OPP[p.dir];
      if (n.art === 'bloom') { n.hopT = n.hopMax = 12; n.hopH = 4; sfx.boing(); }
      if (SCRIPTS[n.talk]) this.run(SCRIPTS[n.talk], n);
      return;
    }
    const pr = this.propAt(fx, fy);
    if (pr) {
      if (pr.talk && SCRIPTS[pr.talk]) { this.run(SCRIPTS[pr.talk], pr); return; }
      if (pr.text) { this.run(async (g) => { await g.say(pr.text); }); return; }
    }
    const t = TILE[this.tile(fx, fy)] || {};
    if (t.water && !t.void) this.run(async (g) => { await g.say(this.tile(fx, fy) === 'a' ? 'Glowing algae sway in the water. A tiny jelly blinks at you.' : 'The river glows a soft, bright green.'); });
    else if (t.void) this.run(async (g) => { await g.say('The land ends here. Below, the purple sky goes on forever...'); });
  }

  toggleRide() {
    const st = this.st;
    if (!st.pet) return;
    const pet = st.pet;
    // can't hop on in the middle of things
    st.riding = !st.riding;
    sfx[st.riding ? 'select' : 'cancel']();
    this.buildFollowers();
    this.game.toast(st.riding ? 'You hop on ' + pet.name + '!' : 'You hop off.', C.cyan);
    if (st.riding) { this.player.hopT = this.player.hopMax = 14; sfx.jump(); this.after(8, () => this.wiggle(this.player, pet.species)); }
    this.updateMusic();
  }

  /* B: you hop, and your companion wiggles (or hops with you when you're riding) */
  hop() {
    const p = this.player, st = this.st;
    if (p.hopT > 0) return;
    p.hopT = p.hopMax = st.riding ? 20 : 18;
    p.hopH = st.riding ? 7 : 6;
    sfx.jump();
    this.after(p.hopMax - 1, () => sfx.land());
    if (!st.pet) return;
    const pet = this.followers.find((f) => f.kind === 'pet');
    this.after(st.riding ? 4 : 9, () => this.wiggle(st.riding ? p : pet, st.pet.species));
    const en = this.followers.find((f) => f.kind === 'enya');
    if (en) this.after(16, () => { en.hopT = en.hopMax = 14; en.hopH = 4; });
  }
  wiggle(e, species) {
    if (!e) return;
    e.wiggleT = 22;
    ({ tiger: sfx.rawr, dragon: sfx.puff, octo: sfx.blub }[species] || sfx.wiggle)();
    const x = e.px + 8, y = e.py + 2;
    if (species === 'tiger') {
      for (let i = 0; i < 12; i++) this.particles.push({ x: x + rnd(-7, 7), y: y + rnd(2, 10), vx: rnd(-0.12, 0.12), vy: -rnd(0.4, 0.9), life: 26, age: 0, kind: 'flame' });
    } else if (species === 'dragon') {
      const blue = this.st.pet && this.st.pet.variant === 'blue', [dx] = DIRS[e.dir];
      const fx = dx || (e.dir === 'up' ? 0 : 0);
      for (let i = 0; i < 12; i++) this.particles.push({ x: x + fx * 7, y: y + 2, vx: fx * rnd(0.5, 1.3) + rnd(-0.3, 0.3), vy: rnd(-0.6, 0.1) - (fx ? 0 : 0.4), life: 26, age: 0, kind: blue ? 'frost' : 'flame' });
      this.particles.push({ x, y: y - 4, vx: 0, vy: -0.4, life: 40, age: 0, kind: 'ring', col: blue ? '#c8f4ff' : '#9a8aa8' });
    } else {
      for (let i = 0; i < 7; i++) this.particles.push({ x: x + rnd(-6, 6), y: y + rnd(2, 10), vx: rnd(-0.1, 0.1), vy: -rnd(0.3, 0.6), life: 50, age: -i * 4, kind: 'bubble' });
    }
  }
  after(frames, fn) { (this.timers || (this.timers = [])).push({ t: frames, fn }); }
  hopY(e) { return e && e.hopT > 0 ? -Math.round(Math.sin((1 - e.hopT / e.hopMax) * Math.PI) * (e.hopH || 6)) : 0; }
  wigX(e) { return e && e.wiggleT > 0 ? ((e.wiggleT >> 1) % 2 ? 1 : -1) : 0; }

  /* the guardians' pods in the grove: each one shows what's inside */
  podFx(t) {
    for (const pr of this.props) {
      if (!pr.id || !pr.id.startsWith('pod-') || this.st.flags['open-' + pr.id]) continue;
      const cx = pr.x * 16 + 8, top = (pr.y + 1) * 16 - 26;
      if (this.camX !== undefined && !this.onScreen(cx - 24, top - 24, 48, 56)) continue;
      if (pr.id === 'pod-tiger') {   // NOVA: a ring of fire, and now and then a claw swipe
        if (t % 3 === 0) {
          const a = Math.random() * Math.PI * 2;
          this.particles.push({ x: cx + Math.cos(a) * 9, y: top + 12 + Math.sin(a) * 11, vx: rnd(-0.1, 0.1), vy: -rnd(0.35, 0.8), life: 26, age: 0, kind: 'flame' });
        }
        if (t % 140 === 20) this.particles.push({ x: cx - 9, y: top - 12, vx: 0, vy: 0, life: 24, age: 0, kind: 'claw' });
      } else if (pr.id === 'pod-dragon') {   // the dragon: fire, then frost, and smoke rings
        const blue = Math.floor(t / 150) % 2 === 1;
        pr.blue = blue;
        if (t % 4 === 0) this.particles.push({ x: cx + rnd(-7, 7), y: top + 4 + rnd(0, 14), vx: rnd(-0.3, 0.3), vy: -rnd(0.3, 0.7), life: 26, age: 0, kind: blue ? 'frost' : 'flame' });
        if (t % 60 === 0) this.particles.push({ x: cx, y: top - 2, vx: 0, vy: -0.35, life: 56, age: 0, kind: 'ring', col: blue ? '#8ff0ff' : '#ff9a6a' });
      } else {   // LUMI: bubbles and a soft pulse of light
        if (t % 8 === 0) this.particles.push({ x: cx + rnd(-6, 6), y: top + 15, vx: rnd(-0.08, 0.08), vy: -rnd(0.25, 0.45), life: 64, age: 0, kind: 'bubble' });
        if (t % 50 === 0) this.particles.push({ x: cx, y: top + 9, vx: 0, vy: 0, life: 40, age: 0, kind: 'glowring' });
      }
    }
  }

  /* run a story script: the world waits until it's finished */
  async run(fn, arg) {
    this.busy++;
    try { await fn(this.game, this, arg); } catch (e) { console.error(e); }
    this.busy--;
    this.game.input.clear();
  }

  async warp(w) {
    const g = this.game;
    this.leaving = true;
    sfx.door();
    await g.fade(1, 12);
    this.load(w.to, w.tx, w.ty, w.dir);
    g.save();
    this.leaving = false;
    await g.fade(0, 12);
  }

  /* ---------- things the story scripts use ---------- */
  emote(id, glyph = '!', life = 50) { this.emotes.push({ id, glyph, t: 0, life }); }
  sparkle(x, y, n = 8, cols = ['#ffffff', '#ffd23a', '#8ff0ff']) {
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = rnd(0.4, 1.4); this.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.3, life: 30, age: 0, kind: 'spark', col: cols[i % cols.length] }); }
  }
  hearts(x, y, n = 5) {
    for (let i = 0; i < n; i++) this.particles.push({ x: x + rnd(-6, 6), y: y - i * 3, vx: rnd(-0.15, 0.15), vy: -rnd(0.3, 0.55), life: 70 + i * 6, age: -i * 8, kind: 'heart' });
  }
  entity(id) {
    if (id === 'player') return this.player;
    return this.followers.find((f) => f.id === id) || this.npc(id);
  }
  /* walk someone along a list of directions, one tile each */
  async walk(id, dirs, opt = {}) {
    const e = this.entity(id);
    if (!e) return;
    for (const d of dirs) {
      const [dx, dy] = DIRS[d];
      if (!opt.ghost && this.blocked(e.x + dx, e.y + dy, e)) { e.dir = d; await this.game.wait(8); continue; }
      await new Promise((resolve) => { e.resolve = resolve; if (e === this.player) this.moveParty(e.x + dx, e.y + dy); else this.beginMove(e, e.x + dx, e.y + dy); });
    }
  }
  face(id, dir) { const e = this.entity(id); if (e) e.dir = dir; }
  place(id, x, y, dir) { const e = this.entity(id); if (e) { e.x = x; e.y = y; e.px = x * 16; e.py = y * 16; e.moving = false; if (dir) e.dir = dir; } }
  removeNpc(id) { this.npcs = this.npcs.filter((n) => n.id !== id); }
  addNpc(n) { const o = { ...n, px: n.x * 16, py: n.y * 16, moving: false, parity: 0, prog: 0, wanderT: 200, home: { x: n.x, y: n.y } }; this.npcs.push(o); return o; }
  heal() { const st = this.st; if (!st.pet) return; st.pet.hp = companionStats(st.pet).hp; st.pet.en = MAX_EN(st.pet.lv); }
  setRespawn() { const p = this.player; this.st.respawn = { map: this.map.id, x: p.x, y: p.y, dir: p.dir }; }

  /* a battle: the screen flashes and wipes, the battle runs, then back here */
  async battle(opt) {
    const g = this.game;
    const foe = newWild(opt.species, opt.lv);
    sfx.encounter();
    for (let i = 0; i < 3; i++) { g.flash('#ffffff', 6); await g.wait(8); }
    this.wipe = 0;
    for (let i = 0; i <= 20; i++) { this.wipe = i / 20; await g.wait(1); }
    const b = new Battle(g, this, foe, opt);
    g.push(b);
    this.wipe = 0;
    const result = await b.result;
    this.player.sinceBattle = 0;
    if (result === 'lose') {
      await g.fade(1, 20);
      const r = this.st.respawn;
      this.st.riding = false;
      this.load(r.map, r.x, r.y, r.dir);
      this.heal();
      g.save();
      await g.fade(0, 20);
      await g.say('You hurried back to safety. ' + this.st.pet.name + ' rested and feels much better!');
    } else {
      playMusic(this.map.music);
      g.save();
    }
    return result;
  }

  /* ---------- drawing ---------- */
  draw(ctx, g) {
    const p = this.player;
    const camX = Math.max(0, Math.min(this.mw * 16 - W, Math.round(p.px + 8 - W / 2)));
    const camY = Math.max(0, Math.min(this.mh * 16 - H, Math.round(p.py + 8 - H / 2)));
    this.camX = camX; this.camY = camY;
    const f = Math.floor(g.t / 18) % 4;
    ctx.drawImage(this.frames[f], camX, camY, W, H, 0, 0, W, H);
    ctx.translate(-camX, -camY);
    const items = [];
    for (const pr of this.props) {
      const d = pr.def, img = d.img[d.anim ? Math.floor(g.t / d.anim) % d.img.length : (pr.open ? 1 : 0)] || d.img[0];
      let x, y;
      if (d.deco) { x = pr.x * 16 + (pr.px || 0); y = pr.y * 16 + (pr.py || 0) + Math.round(Math.sin(g.t / 60) * 1); ctx.drawImage(img, x, y); continue; }
      x = pr.x * 16 + Math.floor((d.w * 16 - img.width) / 2);
      y = (pr.y + d.h) * 16 - img.height;
      if (!this.onScreen(x, y, img.width, img.height)) continue;
      const opened = pr.id && this.st.flags['open-' + pr.id];
      const im = opened && d.img[1] ? d.img[1] : img;
      const pod = pr.id && pr.id.startsWith('pod-') && !opened;
      items.push({ z: (pr.y + d.h) * 16 - 1, draw: () => { ctx.drawImage(im, x, y); if (pod) this.drawPodGuest(ctx, pr, x, y, g.t); } });
    }
    for (const j of this.jewels) {
      if (!this.onScreen(j.x * 16, j.y * 16, 16, 16)) continue;
      const bob = Math.round(Math.sin((g.t + j.x * 13) / 12) * 1.5);
      items.push({ z: j.y * 16 + 2, draw: () => this.drawJewel(ctx, j, bob, g.t) });
    }
    for (const q of this.parts) {
      items.push({ z: q.y * 16 + 3, draw: () => {
        const img = spr(PART_ART[q.id], PART_PAL), bob = Math.round(Math.sin(g.t / 14) * 2);
        ctx.globalAlpha = 0.35 + 0.25 * Math.sin(g.t / 8); ctx.fillStyle = '#8ff0ff'; ctx.fillRect(q.x * 16 + 1, q.y * 16 + 12, 14, 3); ctx.globalAlpha = 1;
        ctx.drawImage(img, q.x * 16 + (16 - img.width) / 2, q.y * 16 + (14 - img.height) + bob - 2);
        if (g.t % 30 < 4) { ctx.fillStyle = '#ffffff'; ctx.fillRect(q.x * 16 + 3 + (g.t % 9), q.y * 16 + bob, 1, 1); }
      } });
    }
    for (const n of this.npcs) {
      if (!this.onScreen(n.px - 16, n.py - 32, 48, 48)) continue;
      items.push({ z: n.py + 15, draw: () => this.drawNpc(ctx, n, g.t) });
    }
    for (const fo of this.followers) items.push({ z: fo.py + 14, draw: () => this.drawFollower(ctx, fo, g.t) });
    items.push({ z: p.py + 15, draw: () => this.drawPlayer(ctx, g.t) });
    items.sort((a, b) => a.z - b.z);
    for (const it of items) it.draw();
    // particles
    for (const q of this.particles) {
      if (q.age < 0) continue;
      const a = 1 - q.age / q.life;
      if (q.kind === 'smoke') { ctx.globalAlpha = a * 0.55; ctx.fillStyle = q.age < 20 ? '#8a7aa0' : '#5a4e6e'; const s = 2 + Math.floor(q.age / 30); ctx.fillRect(Math.round(q.x), Math.round(q.y), s, s); }
      else if (q.kind === 'spore') { ctx.globalAlpha = Math.min(1, a * 1.5) * 0.8; ctx.fillStyle = (q.age >> 4) % 2 ? '#8ff0ff' : '#c49cff'; ctx.fillRect(Math.round(q.x), Math.round(q.y + Math.sin(q.age / 15) * 2), 1, 1); }
      else if (q.kind === 'petal') { ctx.globalAlpha = Math.min(1, a * 1.5) * 0.8; ctx.fillStyle = (q.age >> 5) % 2 ? '#ffd27a' : '#ffffff'; ctx.fillRect(Math.round(q.x + Math.sin(q.age / 12) * 3), Math.round(q.y), 1, 1); }
      else if (q.kind === 'spark') { ctx.globalAlpha = a; ctx.fillStyle = q.col; ctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 1); }
      else if (q.kind === 'flame') { const k = q.age / q.life; ctx.fillStyle = k < 0.2 ? '#fff6c8' : k < 0.45 ? '#ffd23a' : k < 0.7 ? '#ff7a1a' : k < 0.88 ? '#e8302a' : '#7a1fff'; ctx.fillRect(Math.round(q.x), Math.round(q.y), k < 0.5 ? 2 : 1, k < 0.5 ? 2 : 1); }
      else if (q.kind === 'frost') { const k = q.age / q.life; ctx.globalAlpha = 1 - k * 0.6; ctx.fillStyle = k < 0.3 ? '#ffffff' : k < 0.65 ? '#c8f4ff' : '#5fa8ff'; ctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 1); if (k < 0.3) { ctx.fillRect(Math.round(q.x) - 1, Math.round(q.y), 3, 1); ctx.fillRect(Math.round(q.x), Math.round(q.y) - 1, 1, 3); } }
      else if (q.kind === 'leaf') { ctx.globalAlpha = a; ctx.fillStyle = (q.age >> 2) % 2 ? '#c49cff' : '#8a50e4'; ctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 2); q.vy += 0.08; }
      else if (q.kind === 'ring' || q.kind === 'glowring') {
        const k = q.age / q.life, r = q.kind === 'ring' ? 2 + k * 6 : 6 + k * 10;
        ctx.globalAlpha = (1 - k) * 0.9; ctx.fillStyle = q.kind === 'ring' ? (q.col || '#c8c0d8') : (Math.floor(q.age / 6) % 2 ? '#8ff0ff' : '#c08cff');
        for (let i = 0; i < 16; i++) { const an = (i / 16) * Math.PI * 2; ctx.fillRect(Math.round(q.x + Math.cos(an) * r), Math.round(q.y + Math.sin(an) * r * (q.kind === 'ring' ? 0.5 : 0.9)), 1, 1); }
      }
      else if (q.kind === 'bubble') {
        const bx = Math.round(q.x + Math.sin(q.age / 7) * 1.5), by = Math.round(q.y);
        ctx.globalAlpha = Math.min(1, a * 1.6); ctx.fillStyle = '#8ff0ff';
        ctx.fillRect(bx, by - 1, 2, 1); ctx.fillRect(bx, by + 2, 2, 1); ctx.fillRect(bx - 1, by, 1, 2); ctx.fillRect(bx + 2, by, 1, 2);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(bx, by, 1, 1);
      }
      else if (q.kind === 'claw') {   // three slashes, drawn in a flash
        const k = q.age / q.life, n = Math.min(12, Math.round(k * 40));
        ctx.globalAlpha = 1 - k * 0.7;
        for (let s = 0; s < 3; s++) for (let i = 0; i < n; i++) { ctx.fillStyle = i < n - 2 ? '#ffffff' : '#ffd23a'; ctx.fillRect(Math.round(q.x + s * 5 + i * 0.6), Math.round(q.y + i), 1, 1); ctx.fillStyle = '#ff7a1a'; ctx.fillRect(Math.round(q.x + s * 5 + i * 0.6) + 1, Math.round(q.y + i), 1, 1); }
      }
      else if (q.kind === 'heart') {
        ctx.globalAlpha = Math.min(1, a * 2);
        const hx = Math.round(q.x + Math.sin(q.age / 9) * 2), hy = Math.round(q.y);
        ctx.fillStyle = '#e81617'; ctx.fillRect(hx, hy, 2, 2); ctx.fillRect(hx + 3, hy, 2, 2); ctx.fillRect(hx, hy + 1, 5, 2); ctx.fillRect(hx + 1, hy + 3, 3, 1); ctx.fillRect(hx + 2, hy + 4, 1, 1);
        ctx.fillStyle = '#fdf6f6'; ctx.fillRect(hx, hy, 1, 1);
      }
      ctx.globalAlpha = 1;
    }
    // name tags over the pods while you choose
    if (this.map.id === 'bloomhaven' && !this.st.pet && this.st.flags.awake) {
      for (const pr of this.props) {
        if (!pr.id || !pr.id.startsWith('pod-')) continue;
        if (Math.max(Math.abs(pr.x - p.x), Math.abs(pr.y - p.y)) > 4) continue;
        const info = { 'pod-tiger': ['NOVA', 'TIGER', '#ff9a3a'], 'pod-dragon': [pr.blue ? 'AZURE' : 'EMBER', 'DRAGON', pr.blue ? '#7fb0ff' : '#ff5a4a'], 'pod-octo': ['LUMI', 'OCTOPUS', '#8ff0ff'] }[pr.id];
        const w = Math.max(measure(info[0]), measure(info[1])) + 8, bx = pr.x * 16 + 8 - Math.floor(w / 2), by = Math.max(camY + 2, (pr.y + 1) * 16 - 26 - 25 + Math.round(Math.sin(g.t / 20 + pr.x)));
        box(ctx, bx, by, w, 22, { bg: C.bg2 });
        text(ctx, info[0], pr.x * 16 + 8, by + 3, info[2], { align: 'center' });
        text(ctx, info[1], pr.x * 16 + 8, by + 12, C.dim, { align: 'center' });
      }
    }
    // emote bubbles
    for (const e of this.emotes) {
      const en = this.entity(e.id);
      if (!en) continue;
      const bx = Math.round(en.px + (en.big ? 12 : 4)), by = Math.round(en.py - (en.big ? 34 : 22)) - (e.t < 6 ? 6 - e.t : 0);
      const img = spr(['.KKKKKKK.', 'KWWWWWWWK', 'KWWWWWWWK', 'KWWWWWWWK', 'KWWWWWWWK', 'KWWWWWWWK', 'KWWWWWWWK', '.KKKKKKK.', '...KWK...', '....K....'], BUBBLE);
      ctx.drawImage(img, bx, by);
      if (e.glyph === '♥') { ctx.fillStyle = '#e81617'; ctx.fillRect(bx + 2, by + 2, 2, 2); ctx.fillRect(bx + 5, by + 2, 2, 2); ctx.fillRect(bx + 2, by + 3, 5, 2); ctx.fillRect(bx + 3, by + 5, 3, 1); ctx.fillRect(bx + 4, by + 6, 1, 1); }
      else text(ctx, e.glyph, bx + 4 - Math.floor(measure(e.glyph) / 2) + 1, by + 0, '#e8102e');
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // the area's name, sliding in at the top
    const bt = this.banner.t;
    if (bt < 170) {
      const w = measure(this.banner.str) + 16, y = bt < 12 ? -16 + bt * 1.67 : bt > 150 ? 4 - (bt - 150) : 4;
      box(ctx, 4, Math.round(y), w, 15, { bg: C.bg2 });
      text(ctx, this.banner.str, 12, Math.round(y) + 4, C.gold);
    }
    // the battle wipe
    if (this.wipe > 0) {
      ctx.fillStyle = '#000';
      const n = 9;
      for (let i = 0; i < n; i++) {
        const w = Math.max(0, Math.min(1, this.wipe * 2 - i / n)) * W;
        if (i % 2) ctx.fillRect(W - w, i * 16, w, 16); else ctx.fillRect(0, i * 16, w, 16);
      }
    }
  }
  onScreen(x, y, w, h) { return x + w > this.camX && x < this.camX + W && y + h > this.camY && y < this.camY + H; }

  drawPodGuest(ctx, pr, x, y, t) {
    const near = Math.max(Math.abs(pr.x - this.player.x), Math.abs(pr.y - this.player.y)) <= 2;
    let img;
    if (pr.id === 'pod-tiger') img = spr(CH.TIGER.down[0], near ? CH.TIGER_PAL : CH.TIGER_SLEEPY);
    else if (pr.id === 'pod-dragon') img = spr(CH.DRAGON.down[near && t % 40 < 20 ? 1 : 0], CH.DRAGON_PAL[pr.blue ? 'blue' : 'red']);
    else img = spr(CH.OCTO.down[Math.floor(t / 16) % 3], CH.OCTO_PALS[Math.floor(t / 8) % CH.OCTO_PALS.length]);
    const bob = Math.round(Math.sin(t / 30 + pr.x) * (near ? 1.5 : 0.8));
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 9, 6.5, 8.5, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x, y + 2 + bob);
    ctx.fillStyle = 'rgba(160, 236, 255, 0.22)';
    ctx.fillRect(x, y, 16, 18);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(x + 3, y + 3, 1, 4); ctx.fillRect(x + 4, y + 2, 1, 2);
    ctx.restore();
    if (near && t % 50 < 3) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 11, y + 4, 1, 1); }
  }

  drawJewel(ctx, j, bob, t) {
    const x = j.x * 16 + 4, y = j.y * 16 + 4 + bob;
    ctx.fillStyle = 'rgba(20,8,30,0.35)'; ctx.fillRect(j.x * 16 + 5, j.y * 16 + 13, 6, 2);
    let img;
    if (j.kind === 'gold') img = spr(Math.floor(t / 10) % 4 === 2 ? COIN_EDGE : COIN, GEM_PAL.gold);
    else if (j.kind === 'diamond') img = spr(DIAMOND, GEM_PAL.diamond);
    else img = spr(GEM, GEM_PAL[j.kind]);
    ctx.drawImage(img, j.kind === 'diamond' ? x - 1 : x, y);
    const k = (t + j.x * 7 + j.y * 3) % 50;
    if (k < 6) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 5, y - 1 + (k >> 1), 1, 1); if (k > 1 && k < 5) { ctx.fillRect(x + 4, y + (k >> 1), 3, 1); } }
  }

  frameOf(e, moving) { return e.moving ? (e.prog < 8 ? (e.parity ? 1 : 2) : 0) : 0; }
  dirKey(d) { return d === 'left' || d === 'right' ? 'side' : d; }

  drawPlayer(ctx, t) {
    const p = this.player, st = this.st, k = this.dirKey(p.dir), flip = p.dir === 'left', fr = this.frameOf(p);
    const x = Math.round(p.px) + this.wigX(p), y = Math.round(p.py) - 4 + this.hopY(p);
    this.shadow(ctx, Math.round(p.px), Math.round(p.py));
    if (st.riding && st.pet) {
      this.drawRider(ctx, x, y, p.dir, fr, this.petSprite(st.pet, k, fr, flip, t), spr(CH.KID_TOP[st.gender][k], CH.KID_PAL[st.gender], flip), st.pet.species);
      return;
    }
    ctx.drawImage(spr(CH.KID[st.gender][k][fr], CH.KID_PAL[st.gender], flip), x, y);
  }
  drawRider(ctx, x, y, dir, fr, base, top, species) {
    const lift = species === 'dragon' ? 2 : 0;
    const bob = fr ? 1 : 0;
    if (dir === 'down') { ctx.drawImage(top, x, y - 9 - lift + bob); ctx.drawImage(base, x, y - lift); }
    else if (dir === 'up') { ctx.drawImage(base, x, y - lift); ctx.drawImage(top, x, y - 7 - lift + bob); }
    else { ctx.drawImage(base, x, y - lift); ctx.drawImage(top, x + (dir === 'right' ? -2 : 2), y - 8 - lift + bob); }
  }
  petSprite(pet, k, fr, flip, t) {
    const art = CH.COMPANION_ART[pet.species];
    return spr(art.frames[k][fr], art.pal(pet.variant, t), flip);
  }
  shadow(ctx, x, y) { ctx.fillStyle = 'rgba(20,8,30,0.28)'; ctx.fillRect(x + 3, y + 13, 10, 2); ctx.fillRect(x + 4, y + 12, 8, 1); }
  drawFollower(ctx, f, t) {
    const st = this.st, k = this.dirKey(f.dir), flip = f.dir === 'left', fr = this.frameOf(f);
    const x = Math.round(f.px) + this.wigX(f), y = Math.round(f.py) - 4 + this.hopY(f);
    this.shadow(ctx, Math.round(f.px), Math.round(f.py));
    if (f.kind === 'pet') {
      const lift = st.pet.species === 'dragon' ? Math.round(Math.sin(t / 10) * 1.5) + 2 : 0;
      ctx.drawImage(this.petSprite(st.pet, k, fr, flip, t), x, y - lift);
    } else {
      this.drawRider(ctx, x, y, f.dir, fr, spr(CH.TIGER[k][fr], CH.EMERALD_PAL, flip), spr(CH.ENYA_TOP[k], CH.ENYA_PAL, flip), 'tiger');
      if (t % 40 < 3) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 7, y - (f.dir === 'up' ? 0 : 0), 1, 1); }
    }
  }
  drawNpc(ctx, n, t) {
    const k = this.dirKey(n.dir), flip = n.dir === 'left', fr = this.frameOf(n);
    const x = Math.round(n.px), y = Math.round(n.py) - 4 + this.hopY(n);
    if (n.big) {
      const b = BATTLERS[n.art === 'thornback' ? 'thornAlpha' : n.art];
      const img = spr(b.rows, b.pal), bob = Math.round(Math.sin(t / 20));
      ctx.fillStyle = 'rgba(20,8,30,0.3)'; ctx.fillRect(n.px + 2, n.py + 12, 28, 4);
      ctx.drawImage(img, n.px + 16 - Math.floor(img.width / 2), n.py + 16 - img.height + bob);
      return;
    }
    if (n.art === 'drone') {
      const hov = Math.round(Math.sin(t / 10) * 2);
      ctx.fillStyle = 'rgba(20,8,30,0.25)'; ctx.fillRect(x + 5, y + 16, 6, 2);
      ctx.drawImage(spr(CH.DRONE_FR.down[0], CH.DRONE_PAL), x, y - 2 + hov);
      if (Math.floor(t / 20) % 2) { ctx.fillStyle = '#ff3b4a'; ctx.fillRect(x + 7, y + 4 + hov, 2, 1); }
      return;
    }
    this.shadow(ctx, x, y + 4);
    if (n.art === 'enya') { this.drawRider(ctx, x, y, n.dir, fr, spr(CH.TIGER[k][fr], CH.EMERALD_PAL, flip), spr(CH.ENYA_TOP[k], CH.ENYA_PAL, flip), 'tiger'); return; }
    if (n.art === 'sprig') ctx.drawImage(spr(CH.SPRIG[k][0], CH.SPRIG_PAL, flip), x, y + (Math.floor(t / 24) % 2));
    else if (n.art === 'pet') ctx.drawImage(spr(CH.COMPANION_ART[n.species].frames[k][fr], CH.COMPANION_ART[n.species].pal(n.variant, t), flip), x, y);
    else ctx.drawImage(spr(CH.BLOOM[k][Math.floor(t / 30) % 2 ? 1 : 0], CH.BLOOM_PALS[n.pal] || CH.BLOOM_PALS.mint, flip), x, y);
  }
}
