/* Battles: your companion (and Enya's echo, once she reaches you) against a wild creature. Turn by turn:
   pick a move (moves cost EN, which refills a little each turn), use an item, guard, or run. Enya acts
   on her own after you: she heals, attacks with the Emerald Tiger, or flashes the GEM to daze the foe.
   In the big fight of Chapter 2, CODY the white cat joins in with his staff. Burns and poison sting at
   the end of every round.
   Your FURY builds as your companion gets hurt; when it's full your eyes blaze green and your warrior
   blood strikes. A COSMIC TUBE from the bag captures a weakened creature in an infinity of light. */
import { W, H, spr, makeCanvas, hash, mix, disc } from '../engine/pixel.js';
import { text, measure, wrap } from '../engine/font.js';
import { box, bar, hpColour, C } from './ui.js';
import { sfx, playMusic } from '../engine/audio.js';
import { BATTLERS } from '../art/battlers.js';
import { buildProps } from '../art/tiles.js';
import { MOVES, WILD, ITEMS, JEWELS, companionStats, companionArt, xpToNext, learnsAt, MAX_EN, enyaWith } from './data.js';
import { remember } from './memory.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const STAGE = { '-2': 0.6, '-1': 0.78, 0: 1, 1: 1.3, 2: 1.6 };
const ACC_STAGE = { '-2': 0.62, '-1': 0.8, 0: 1, 1: 1.1, 2: 1.2 };
const STAT_NAME = { atk: 'attack', def: 'defence', acc: 'accuracy', spd: 'speed' };
const GREEN = '#3ad07e', CALM = '#0f6e3e';   // your eyes: blazing emerald, and their everyday dark emerald
let PLANET = null;

/* where you fight: the sky, the shapes on the horizon, the ground and what grows on it */
const BGS = {
  wilds: { sky: ['#1c0c3a', '#2e1660', '#4a2a8a', '#6a40c0'], far: '#3a1430', near: '#552042', ground: ['#b4443c', '#9c3434', '#cf5e48'], edge: '#7a2430', tuft: ['#5a2ca4', '#8a50e4', '#8ff0ff'], spot: 'rgba(60,10,40,0.35)', planet: 52, hills: 'mesa' },
  boss: { sky: ['#1a0820', '#2a0e30', '#3e1638', '#5a1e40'], far: '#2a0c1c', near: '#3a1222', ground: ['#5a2a34', '#4a2230', '#6a3440'], edge: '#2a1420', tuft: ['#7a7e94', '#b8bccc', '#8ff0ff'], spot: 'rgba(10,0,10,0.35)', planet: 70, hills: 'mesa' },
  jungle: { sky: ['#06201a', '#0c3026', '#164a34', '#22603e'], far: '#0a2a1a', near: '#123a24', ground: ['#25603f', '#1b4a30', '#3a8058'], edge: '#0a2416', tuft: ['#2fa070', '#3fc080', '#8ff0ff'], spot: 'rgba(0,20,10,0.35)', planet: null, hills: 'trees' },
  groove: { sky: ['#2c0a56', '#3e127c', '#561ca2', '#7a2ac8'], far: '#3a1660', near: '#4a1f7a', ground: ['#4a1f7a', '#3a1660', '#6a2fa8'], edge: '#2a0e48', tuft: ['#ff6ab0', '#5ff2ff', '#ffd25a'], spot: 'rgba(30,0,40,0.35)', planet: 92, hills: 'plants' },
  veil: { sky: ['#05020a', '#0e0618', '#1a0c2a', '#2a1440'], far: '#0a0414', near: '#140a22', ground: ['#1e1430', '#160e26', '#2a1c40'], edge: '#0a0414', tuft: ['#3a2a5a', '#6a4a9a', '#b06aff'], spot: 'rgba(0,0,0,0.4)', planet: null, hills: 'spires' },
  // Chapter 2
  mire: { sky: ['#1a2410', '#26341a', '#344a22', '#4a602a'], far: '#1e2a14', near: '#2a3a1a', ground: ['#3e4a26', '#2e3a1c', '#56602e'], edge: '#1e2a14', tuft: ['#5a6a2a', '#8a9a3a', '#c8e83a'], spot: 'rgba(10,20,0,0.35)', planet: null, hills: 'deadtrees', pools: '#9ab82a' },
  lagoon: { sky: ['#3a8ad8', '#4aa0e0', '#6ab8e8', '#9ad0f0'], far: '#2a8a5a', near: '#c8402a', ground: ['#48b07a', '#3a9a6a', '#7ad8a8'], edge: '#2a7a52', tuft: ['#ffd23a', '#fff2a0', '#ffffff'], spot: 'rgba(0,40,20,0.3)', planet: null, hills: 'pagoda' },
  withered: { sky: ['#2a2a32', '#3a3a44', '#4a4a56', '#5a5a66'], far: '#33333c', near: '#44444e', ground: ['#5a5a5e', '#4a4a4e', '#6e6e72'], edge: '#33333c', tuft: ['#6e6e72', '#8a8a90', '#b06aff'], spot: 'rgba(0,0,0,0.3)', planet: null, hills: 'trees' },
};
function background(kind) {
  const B = BGS[kind] || BGS.wilds, c = makeCanvas(W, 96), g = c.getContext('2d'), sky = B.sky;
  for (let y = 0; y < 60; y++) {
    const t = y / 60, i = Math.min(3, Math.floor(t * 4)), j = Math.min(3, i + 1), f = t * 4 - i;
    for (let x = 0; x < W; x++) { g.fillStyle = (f + (hash(x, y, 3) - 0.5) * 0.35) > 0.5 ? sky[j] : sky[i]; g.fillRect(x, y, 1, 1); }
  }
  for (let i = 0; i < 40; i++) { g.fillStyle = i % 5 ? (kind === 'groove' ? '#ffb0f0' : '#b48cff') : '#ffffff'; g.fillRect(Math.floor(hash(i, 1, 9) * W), Math.floor(hash(i, 2, 9) * 46), 1, 1); }
  if (B.planet !== null) { PLANET = PLANET || buildProps().planet.img[0]; g.drawImage(PLANET, B.planet, 20); }
  // the horizon
  g.fillStyle = B.far;
  if (B.hills === 'mesa') {
    for (let x = 0; x < W; x++) { const h = 6 + Math.round(4 * Math.sin(x / 11) + 3 * Math.sin(x / 5.3) + (x > 60 && x < 90 ? 6 : 0)); g.fillRect(x, 60 - h, 1, h); }
  } else if (B.hills === 'trees') {   // the jungle: a canopy of giant trees, and trunks below it
    for (let x = 0; x < W; x++) { const h = 30 + Math.round(6 * Math.sin(x / 9) + 4 * Math.sin(x / 4.1) + 3 * Math.sin(x / 2.3)); g.fillRect(x, 60 - h, 1, h - 14); }
    for (let i = 0; i < 9; i++) { const tx = Math.floor(hash(i, 3, 21) * W); g.fillRect(tx, 40, 3 + (i % 3), 20); }
    g.fillStyle = '#ff9ad8'; for (let i = 0; i < 7; i++) g.fillRect(Math.floor(hash(i, 4, 21) * W), 26 + Math.floor(hash(i, 5, 21) * 12), 1, 1);
  } else if (B.hills === 'plants') {   // the Jelly Jam: tall alien plants on the horizon, orbs on their stalks
    for (const [mx, h, r] of [[10, 34, 5], [30, 22, 3], [52, 40, 6], [74, 26, 4], [96, 36, 5], [118, 24, 3], [140, 38, 6], [156, 20, 3]]) {
      g.fillRect(mx - 1, 60 - h, 3, h);
      for (let dy = -r; dy <= r; dy++) { const w = Math.floor(Math.sqrt(r * r - dy * dy)); g.fillRect(mx - w, 60 - h - r + dy, w * 2 + 1, 1); }
      g.fillRect(mx - 6, 60 - Math.round(h * 0.4), 5, 2); g.fillRect(mx + 2, 60 - Math.round(h * 0.55), 5, 2);
    }
  } else if (B.hills === 'deadtrees') {   // the Venom Mire: bare, crooked trees
    for (let i = 0; i < 9; i++) {
      const tx = Math.floor(hash(i, 7, 41) * W), th = 18 + Math.floor(hash(i, 8, 41) * 22);
      g.fillRect(tx, 60 - th, 2, th);
      for (let b = 0; b < 3; b++) { const by = 60 - th + 3 + b * 6, dir = (b + i) % 2 ? 1 : -1; for (let k = 0; k < 5; k++) g.fillRect(tx + dir * k, by - Math.floor(k / 2), 1, 1); }
    }
  } else if (B.hills === 'pagoda') {   // the Jade Lagoon: palace roofs on the far shore
    for (const [px, pw, ph] of [[20, 26, 18], [62, 36, 26], [112, 28, 16]]) {
      g.fillStyle = B.near; g.fillRect(px + 3, 60 - ph, pw - 6, ph);
      g.fillStyle = B.far;
      for (let r = 0; r < 2; r++) { const ry = 60 - ph - 4 + r * 9, rw = pw + 6 - r * 4; g.fillRect(px - 3 + r * 2, ry, rw, 3); g.fillRect(px - 5 + r * 2, ry - 1, 2, 2); g.fillRect(px + rw - 5 + r * 2, ry - 1, 2, 2); }
    }
    g.fillStyle = '#1aa8b8'; g.fillRect(0, 56, W, 4);
  } else {   // beyond the veil: twisted black spires
    for (let x = 0; x < W; x++) { const h = 8 + Math.round(Math.abs(Math.sin(x / 7)) * 14 * hash(Math.floor(x / 7), 0, 31)); g.fillRect(x, 60 - h, 1, h); }
  }
  g.fillStyle = B.near;
  for (let x = 0; x < W; x++) { const h = 3 + Math.round(2 * Math.sin(x / 7 + 1)); g.fillRect(x, 60 - h, 1, h); }
  // the ground
  const grd = B.ground;
  for (let y = 60; y < 96; y++) for (let x = 0; x < W; x++) { const r = hash(x, y, 4); g.fillStyle = r < 0.08 ? grd[2] : r < 0.2 ? grd[1] : grd[0]; g.fillRect(x, y, 1, 1); }
  g.fillStyle = B.edge; g.fillRect(0, 60, W, 1);
  if (B.pools) for (const [px, py, pw] of [[8, 70, 22], [70, 66, 16], [136, 80, 18], [96, 92, 24]]) { g.fillStyle = B.pools; g.fillRect(px, py, pw, 3); g.fillRect(px + 2, py - 1, pw - 4, 5); g.fillStyle = '#f0ff8a'; g.fillRect(px + 3, py, 2, 1); }
  // tufts (glowgrass, ferns, alien sprouts) with glowing tips
  for (let i = 0; i < 22; i++) {
    const x = Math.floor(hash(i, 5, 7) * W), y = 64 + Math.floor(hash(i, 6, 7) * 30);
    g.fillStyle = B.tuft[0]; g.fillRect(x, y - 3, 1, 3); g.fillRect(x + 2, y - 4, 1, 4); g.fillStyle = B.tuft[1]; g.fillRect(x + 1, y - 5, 1, 5);
    if (i % 4 === 0) { g.fillStyle = B.tuft[2]; g.fillRect(x + 1, y - 6, 1, 1); }
  }
  // the two spots where you and the foe stand
  for (const [cx, cy, rx] of [[118, 64, 22], [44, 89, 26]]) {
    for (let y = -4; y <= 4; y++) for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx) + (y * y) / 16 <= 1) { g.fillStyle = B.spot; g.fillRect(cx + x, cy + y, 1, 1); }
  }
  return c;
}

export class Battle {
  constructor(game, world, foe, opt = {}) {
    this.game = game;
    this.kind = 'Battle';
    this.world = world;
    this.opt = opt;
    this.opaque = true;
    const st = game.state, pet = st.pet, s = companionStats(pet);
    this.me = { side: 'me', name: pet.name, lv: pet.lv, hp: pet.hp, maxHp: s.hp, en: pet.en, maxEn: MAX_EN(pet.lv), atk: s.atk, def: s.def, spd: s.spd, art: companionArt(pet), stages: { atk: 0, def: 0, acc: 0, spd: 0 }, status: {}, disp: pet.hp };
    this.foe = { side: 'foe', ...foe, stages: { atk: 0, def: 0, acc: 0, spd: 0 }, status: {}, disp: foe.hp };
    this.enyaHere = enyaWith(st);
    this.enyaCool = { flash: 1, cheer: 0 };
    this.codyHere = !!opt.cody;   // CODY fights beside you (his staff extends, flies and grows on command)
    this.codyN = 0; this.codyCheer = 0;
    this.fury = opt.fury || 0;
    const area = world && world.map ? world.map.id : 'wilds', healed = world && world.healed && world.healed();
    this.bg = background(opt.bg || (foe.ghoul ? 'veil' : foe.big ? 'boss' : { jungle: 'jungle', groove: 'groove', mire: 'mire', lagoon: 'lagoon', deep: healed ? 'jungle' : 'withered' }[area] || 'wilds'));
    this.fx = [];
    this.anim = { me: { dx: -120, dy: 0, blink: 0, hide: false }, foe: { dx: 120, dy: 0, blink: 0, hide: false, sink: 0, scale: 1, white: 0 }, enya: { dx: this.enyaHere || this.codyHere ? -120 : -200, dy: 0, blink: 0 } };
    this.phase = 'intro';
    this.prompt = null;
    this.result = new Promise((r) => { this.resolve = r; });
    this.t = 0;
    playMusic(opt.music || (foe.ghoul ? 'ghoul' : foe.boss ? 'boss' : Math.random() < 0.5 ? 'battle' : 'battle2'));
    this.go().catch((e) => { console.error(e); this.end('run'); });
  }

  /* ---------- the flow ---------- */
  async go() {
    const g = this.game, me = this.me, foe = this.foe;
    await this.slide();
    sfx.cry(foe.species);
    this.anim.foe.wig = 20;
    await this.msg(WILD[foe.species].intro);
    if (foe.ghoul) { this.addFury(25); await this.msg('Your eyes flicker green at the sight of it. Your FURY rises!'); }
    if (foe.shadow) { this.addFury(25); await this.msg('Those violet eyes... the same shadow as the ghouls! Your FURY rises!'); }
    if (this.enyaHere) await this.msg("ENYA's echo and the EMERALD TIGER fight beside you!");
    if (this.codyHere) await this.msg('CODY: Right then. Staff, wake up. We have work to do.', 0, 'CODY');
    ({ tiger: sfx.rawr, dragon: sfx.puff, octo: sfx.blub }[this.game.state.pet.species] || sfx.wiggle)();
    this.anim.me.dy = -6; this.game.wait(8).then(() => { this.anim.me.dy = 0; });
    await this.msg('Go, ' + me.name + '!');
    for (let round = 1; ; round++) {
      if (this.opt.enyaArrives === round && !this.enyaHere) await this.enyaEnters();
      const act = await this.choose();
      me.status.guard = false;
      me.acted = false; foe.acted = false;
      if (act.type === 'run') {
        if (foe.boss) { await this.msg("There's no running from this one!"); }
        else if (Math.random() < 0.55 + (me.spd - foe.spd) * 0.04 + (this.runTries || 0) * 0.15) { sfx.run(); await this.msg('You got away safely!'); return this.end('run'); }
        else { this.runTries = (this.runTries || 0) + 1; await this.msg("Couldn't get away!"); }
        me.acted = true;
        await this.act(foe, me, this.foeMove());
      } else if (act.type === 'item' || act.type === 'guard') {
        if (act.type === 'guard') { me.status.guard = true; me.en = Math.min(me.maxEn, me.en + 3); sfx.guard(); await this.msg(me.name + ' braces for impact! (+3 EN)'); }
        else if (ITEMS[act.item].capture) { if ((await this.capture()) === 'caught') return this.caught(); }
        else await this.useItem(act.item);
        me.acted = true;
        await this.act(foe, me, this.foeMove());
      } else {
        const meFirst = this.speed(me) * rnd(0.9, 1.1) >= this.speed(foe) * rnd(0.9, 1.1);
        const order = meFirst ? [[me, foe, act.move], [foe, me, null]] : [[foe, me, null], [me, foe, act.move]];
        for (const [u, t, mv] of order) {
          if (u.hp <= 0 || t.hp <= 0) break;
          await this.act(u, t, mv || this.foeMove());
          u.acted = true;
        }
      }
      if (foe.hp <= 0) return this.win();
      if (me.hp <= 0) return this.lose();
      if (this.enyaHere) { await this.enyaAct(); if (foe.hp <= 0) return this.win(); }
      if (this.codyHere) { await this.codyAct(); if (foe.hp <= 0) return this.win(); }
      // your warrior blood boils over
      if (this.fury >= 100) { await this.furyBurst(); if (foe.hp <= 0) return this.win(); }
      // end of the round: burns and poison, wearing-off effects, a little energy back
      for (const u of [me, foe]) {
        for (const [st, div, hurt, healed] of [['burn', 12, ' is hurt by its burn!', "'s burn healed."], ['poison', 10, ' is hurt by poison!', ' shook off the poison.']]) {
          if (!(u.status[st] > 0) || u.hp <= 0) continue;
          const d = Math.max(1, Math.round(u.maxHp / div));
          if (st === 'poison') { sfx.poison(); for (let i = 0; i < 6; i++) this.fx.push({ k: 'dot', x: this.pos(u).x + rnd(-10, 10), y: this.pos(u).y + rnd(-4, 8), vx: 0, vy: -rnd(0.3, 0.7), life: 24, t: -i * 2, col: i % 2 ? '#c8ff3a' : '#a050e0' }); }
          await this.flashHit(u);
          u.hp = Math.max(0, u.hp - d);
          if (u === me) this.addFury(8);
          await this.drain(u);
          await this.msg(u.name + hurt);
          if (--u.status[st] <= 0) await this.msg(u.name + healed);
        }
        u.status.flinch = false;
      }
      if (foe.hp <= 0) return this.win();
      if (me.hp <= 0) return this.lose();
      me.en = Math.min(me.maxEn, me.en + 1);
    }
  }

  speed(u) { return u.spd * STAGE[u.stages.spd]; }
  foeMove() { const list = this.foe.moves; return list[Math.floor(Math.random() * list.length)]; }
  addFury(n) { this.fury = Math.min(100, this.fury + n); }

  async act(user, target, moveId) {
    const mv = MOVES[moveId], self = user.side === 'me';
    if (user.status.daze) { user.status.daze = false; await this.msg(user.name + ' is dazed and can’t move!'); return; }
    if (user.status.flinch) { user.status.flinch = false; await this.msg(user.name + ' is knocked off balance!'); return; }
    if (self) user.en = Math.max(0, user.en - mv.en);
    await this.msg((self ? '' : (this.foe.boss ? '' : 'The wild ')) + user.name + ' used ' + mv.name + '!', 26);
    // healing and boosts on itself
    if (mv.self) {
      await this.play(mv.fx, user, user);
      if (mv.heal) {
        const amt = Math.round(user.maxHp * mv.heal);
        user.hp = Math.min(user.maxHp, user.hp + amt);
        sfx.heal();
        await this.drain(user);
        await this.msg(moveId === 'lick' ? 'Tiger saliva heals fast! ' + user.name + ' feels much better!' : user.name + ' feels much better!');
      }
      if (mv.buff) await this.stage(user, mv.buff.stat, mv.buff.by);
      return;
    }
    // does it hit?
    if (target.status.dodge) {
      target.status.dodge = false;
      sfx.miss();
      await this.msg(target.name + ' is already gone in a flash of light! It missed!');
      return;
    }
    const acc = (mv.acc || 100) * ACC_STAGE[user.stages.acc];
    if (Math.random() * 100 > acc) { sfx.miss(); await this.msg('But it missed!'); return; }
    await this.play(mv.fx, user, target);
    if (mv.pow > 0) {
      const hits = mv.hits ? Math.floor(rnd(mv.hits[0], mv.hits[1] + 1)) : 1;
      let crit = false;
      for (let h = 0; h < hits && target.hp > 0; h++) {
        const A = user.atk * STAGE[user.stages.atk];
        const D = mv.pierce ? 9 : target.def * STAGE[target.stages.def];
        let dmg = (mv.pow * A) / (D + 12) * 0.36 * rnd(0.85, 1);
        const c = Math.random() < 1 / 16 + (mv.crit || 0);
        if (c) { dmg *= 1.5; crit = true; }
        if (target.status.guard) dmg *= 0.5;
        dmg = Math.max(1, Math.round(dmg));
        (c ? sfx.crit : sfx.hit)();
        target.hp = Math.max(0, target.hp - dmg);
        if (target === this.me) this.addFury((dmg / target.maxHp) * 150 * (this.foe.ghoul || this.foe.shadow ? 1.5 : 1) + (c ? 10 : 0));
        await this.flashHit(target, c);
        await this.drain(target);
        if (mv.drain && user.hp > 0 && user.hp < user.maxHp) {   // it drinks the life it takes
          user.hp = Math.min(user.maxHp, user.hp + Math.max(1, Math.round(dmg * mv.drain)));
          this.spawnGlow(this.pos(user), '#b06aff');
          await this.drain(user);
          await this.msg(user.name + ' drank in some of the life it took!');
        }
      }
      if (hits > 1) await this.msg('Hit ' + hits + ' times!');
      if (crit) await this.msg('A critical hit!');
      if (target.hp <= 0) return;
    }
    if (mv.dodge) { user.status.dodge = true; await this.msg(user.name + ' blinks away in a flash of light!'); }
    if (mv.burn && !target.status.burn && Math.random() < mv.burn) { target.status.burn = 3; await this.msg(target.name + ' was burned!'); }
    if (mv.poison && !target.status.poison && Math.random() < mv.poison) { target.status.poison = 4; sfx.poison(); await this.msg(target.name + ' was poisoned!'); }
    if (mv.daze && Math.random() < mv.daze * (target.boss ? 0.5 : 1)) { target.status.daze = true; await this.msg(target.name + ' is dazed!'); }
    if (mv.flinch && !target.acted && Math.random() < mv.flinch * (target.boss ? 0.5 : 1)) target.status.flinch = true;
    if (mv.debuff) { if (target === this.me) this.addFury(6); await this.stage(target, mv.debuff.stat, mv.debuff.by); }
  }

  async stage(u, stat, by) {
    const before = u.stages[stat];
    u.stages[stat] = Math.max(-2, Math.min(2, before + by));
    if (u.stages[stat] === before) { await this.msg(u.name + "'s " + STAT_NAME[stat] + " won't go any " + (by > 0 ? 'higher!' : 'lower!')); return; }
    (by > 0 ? sfx.buff : sfx.debuff)();
    await this.msg(u.name + "'s " + STAT_NAME[stat] + (by > 0 ? (by > 1 ? ' rose sharply!' : ' rose!') : (by < -1 ? ' fell sharply!' : ' fell!')));
  }

  async useItem(id) {
    const st = this.game.state, it = ITEMS[id], me = this.me;
    st.bag[id]--;
    await this.msg('You gave ' + me.name + ' a ' + it.name + '!');
    sfx.heal();
    this.spawnGlow(this.pos(me), '#5fe07a');
    if (it.heal) { me.hp = Math.min(me.maxHp, me.hp + it.heal); await this.drain(me); }
    if (it.en) me.en = Math.min(me.maxEn, me.en + it.en);
    await this.msg(me.name + ' feels great!');
  }

  /* ---------- your warrior blood ---------- */
  async furyBurst() {
    const g = this.game, st = g.state, me = this.me, foe = this.foe;
    this.fury = 0;
    sfx.fury();
    this.cutin = { t: 0 };   // a close-up: his brows slam down and his eyes blaze as the power builds
    await g.until(() => this.cutin.t >= 80);
    this.cutin = null;
    st.furyT = 2400;         // they stay green for a while afterwards
    await this.msg('Your eyes blaze green! The warrior blood of your ancestors surges!', 30);
    sfx.whoosh();
    const tp = this.pos(foe);
    for (let i = 0; i < 3; i++) { this.fx.push({ k: 'bolt', x0: -4, y0: 74, x1: tp.x, y1: tp.y, life: 16, t: 0 }); await g.wait(4); }
    g.flash(GREEN, 12); g.shake(18, 3); sfx.crit();
    this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 20, t: 0, col: GREEN });
    const A = 12 + me.lv * 2.2, dmg = Math.max(1, Math.round(((70 * A) / 21) * 0.36 * rnd(0.9, 1.05)));
    foe.hp = Math.max(0, foe.hp - dmg);
    await this.flashHit(foe, true);
    await this.drain(foe);
    await this.msg('WARRIOR STRIKE! It hits ' + foe.name + ' hard!', 30);
    if (await remember(g, 'blood')) await this.msg("(FURY builds when your companion is hurt. When it's full, your warrior blood takes over!)", 60);
    if (foe.hp > 0) { this.aura = true; await this.stage(me, 'atk', 1); }
  }

  /* ---------- COSMIC TUBES ---------- */
  async capture() {
    const g = this.game, st = g.state, foe = this.foe, w = WILD[foe.species], nova = st.pet.species === 'tiger';
    if (nova && w.catch) { await this.msg(st.pet.name + ' pins ' + foe.name + ' down!'); await this.play('pin', this.me, foe); }
    await this.msg('You open a COSMIC TUBE!');
    if (!w.catch) {   // a ghoul isn't of this world: the light can't hold it (and the tube isn't used up)
      await this.tubeAnim(false, 0, true);
      await this.msg("The light passes straight through it! It isn't from this world...");
      return 'fail';
    }
    st.bag.tube--;
    const hpf = foe.hp / foe.maxHp;
    const p = Math.max(0.05, Math.min(0.95, w.catch * (0.2 + 0.8 * (1 - hpf)) + (foe.status.daze ? 0.15 : 0) + (nova ? 0.12 : 0)));
    const per = Math.pow(p, 1 / 3);
    let shakes = 0;
    while (shakes < 3 && Math.random() < per) shakes++;
    await this.tubeAnim(shakes === 3, shakes, false);
    if (shakes === 3) return 'caught';
    await this.msg(['Oh no! ' + foe.name + ' broke free!', 'Argh! So close!', 'Almost had it!'][Math.min(2, shakes)]);
    return 'fail';
  }
  async tubeAnim(ok, shakes, ghost) {
    const g = this.game, A = this.anim.foe, fp = this.pos(this.foe), floor = this.foe.big ? 66 : 64, hover = this.foe.big ? 30 : 38;
    sfx.tube();
    this.tube = { x: fp.x, y: -2, glow: 0, wob: 0 };
    for (let i = 0; i <= 14; i++) { this.tube.y = -2 + (hover + 2) * (1 - (1 - i / 14) ** 2); await g.wait(1); }
    this.fx.push({ k: 'tbeam', x: fp.x, y: hover, y1: floor, life: 28, t: 0 });
    if (ghost) {
      for (let i = 0; i < 28; i++) { A.white = 0.5 * Math.sin((i / 28) * Math.PI); await g.wait(1); }
      A.white = 0;
      for (let i = 0; i <= 10; i++) { this.tube.y = hover + (floor - hover) * (i / 10); await g.wait(1); }
      sfx.breakfree();
      this.tube = null;
      return;
    }
    for (let i = 0; i <= 24; i++) { const k = i / 24; A.white = Math.min(1, k * 2); A.scale = 1 - k * 0.92; await g.wait(1); }
    A.hide = true; A.scale = 1; A.white = 0;
    for (let i = 0; i <= 10; i++) { this.tube.y = hover + (floor - hover) * (i / 10) ** 2; await g.wait(1); }
    sfx.land();
    for (let s = 0; s < (ok ? 3 : shakes); s++) {
      await g.wait(16);
      sfx.wobble();
      for (let i = 0; i < 18; i++) { this.tube.wob = Math.round(Math.sin((i / 18) * Math.PI * 3) * 2); await g.wait(1); }
      this.tube.wob = 0;
      this.fx.push({ k: 'ring', x: this.tube.x, y: floor - 9, life: 30, t: 0, col: ['#8ff0ff', '#c08cff', '#ffd23a'][s] });
    }
    await g.wait(16);
    if (ok) {
      this.tube.glow = 1;
      sfx.captured();
      g.flash('#ffffff', 8);
      this.sparkleAt(this.tube.x, floor - 10, 22, ['#ffffff', '#8ff0ff', '#c08cff', '#ffd23a']);
      for (let i = 0; i < 3; i++) this.fx.push({ k: 'ring', x: this.tube.x, y: floor - 9, life: 36, t: -i * 8, col: '#ffffff' });
      await g.wait(34);
      return;
    }
    sfx.breakfree();
    for (let i = 0; i < 14; i++) { const a = Math.random() * Math.PI * 2, s = rnd(0.6, 2); this.fx.push({ k: 'shard', x: this.tube.x, y: floor - 9, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, g: 0.08, life: 30, t: 0, col: i % 2 ? '#c8f4ff' : '#ffffff' }); }
    this.tube = null;
    A.hide = false;
    for (let i = 0; i <= 12; i++) { A.scale = i / 12; A.white = 1 - i / 12; await g.wait(1); }
    A.scale = 1; A.white = 0;
  }
  async caught() {
    const st = this.game.state, foe = this.foe;
    await this.msg(foe.name + ' is held in an infinity of light. Captured!');
    st.tubes = st.tubes || {};
    st.tubes[foe.species] = (st.tubes[foe.species] || 0) + 1;
    st.captures = (st.captures || 0) + 1;
    if (st.tubes[foe.species] === 1) await this.msg('A new creature for your COSMIC TUBES! (START, then TUBES)');
    playMusic('victory');
    await this.reward(false);
    return this.end('win');
  }

  /* ---------- Enya's echo ---------- */
  async enyaEnters() {
    const g = this.game;
    sfx.rift();
    g.shake(16, 2);
    this.fx.push({ k: 'rift', x: 22, y: 54, life: 70, t: 0 });
    await this.msg('The air TEARS open like glass!');
    playMusic('enya');
    this.enyaHere = true;
    sfx.shatter();
    for (let i = 0; i < 16; i++) { const a = Math.random() * Math.PI * 2, s = rnd(0.6, 2.2); this.fx.push({ k: 'shard', x: 22, y: 54, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, g: 0.07, life: 36, t: 0, col: i % 2 ? '#c8f4ff' : '#ffffff' }); }
    for (let i = 0; i <= 24; i++) { this.anim.enya.dx = -200 + (200 * i) / 24; await g.wait(1); }
    this.sparkleAt(22, 56, 14);
    await this.msg('A girl with golden hair leaps through on a huge, ghostly green tiger!');
    await this.msg('ENYA: Easy there, scaly! Pick on someone your own size!', 0, 'ENYA');
  }
  async enyaAct() {
    const g = this.game, st = g.state, me = this.me, foe = this.foe, c = this.enyaCool;
    c.flash--; c.cheer--;
    if (me.hp < me.maxHp * 0.45 && c.cheer <= 0) {
      c.cheer = 4;
      await this.msg('ENYA: Hang in there, ' + me.name + '! SHAMROCK CHEER!', 0, 'ENYA');
      sfx.heal();
      this.spawnShamrocks();
      await g.wait(30);
      me.hp = Math.min(me.maxHp, me.hp + Math.round(me.maxHp * 0.3));
      await this.drain(me);
      await this.msg(me.name + ' feels lucky! HP restored.');
      return;
    }
    if (c.flash <= 0 && !foe.status.daze && Math.random() < 0.6) {
      c.flash = 3;
      await this.msg('ENYA used DIAMOND FLASH! The GEM at her throat blazes!', 0);
      await this.play('flash', null, foe);
      if (Math.random() < (foe.boss ? 0.7 : 1)) { foe.status.daze = true; await this.msg('Its light shatters like a diamond in ' + foe.name + "'s eyes. " + foe.name + ' is dazed!'); }
      else await this.msg(foe.name + ' shut its eyes just in time!');
      if (!st.flags['saw-flash']) { st.flags['saw-flash'] = true; await g.say('That light... I know that light...', { name: st.name, mutter: true }); }
      return;
    }
    await this.msg('The EMERALD TIGER pounces!', 0);
    await this.play('epounce', null, foe);
    const A = 9 + me.lv * 1.7, D = foe.def * STAGE[foe.stages.def];
    const dmg = Math.max(1, Math.round((42 * A) / (D + 12) * 0.36 * rnd(0.85, 1)));
    sfx.hit();
    foe.hp = Math.max(0, foe.hp - dmg);
    await this.flashHit(foe);
    await this.drain(foe);
  }
  /* ---------- CODY, the wise white cat, fighting beside you ----------
     His staff does what it's told: EXTEND (a long jab), FLY (it spins out and back, twice), BIG (seven thousand
     kilos of staff, slammed down). If your companion's flagging he tosses it a GLOWBERRY instead. */
  async codyAct() {
    const g = this.game, me = this.me, foe = this.foe;
    if (--this.codyCheer < 0 && me.hp < me.maxHp * 0.4) {
      this.codyCheer = 3;
      await this.msg('CODY: Chin up, ' + me.name + '! Catch!', 0, 'CODY');
      sfx.heal(); this.spawnGlow(this.pos(me), '#5fe07a');
      me.hp = Math.min(me.maxHp, me.hp + Math.round(me.maxHp * 0.3));
      await this.drain(me);
      await this.msg(me.name + ' munches a GLOWBERRY. HP restored!');
      return;
    }
    const kind = ['extend', 'fly', 'big'][this.codyN++ % 3];
    await this.msg({ extend: 'CODY: Staff... EXTEND!', fly: 'CODY: Staff... FLY!', big: 'CODY: Staff... BIG! Seven thousand kilos, coming down!' }[kind], 0, 'CODY');
    const tp = this.pos(foe), A = 12 + me.lv * 1.9, D = foe.def * STAGE[foe.stages.def];
    const hit = async (pow, big) => {
      const dmg = Math.max(1, Math.round((pow * A) / (D + 12) * 0.36 * rnd(0.9, 1)));
      (big ? sfx.crit : sfx.hit)();
      foe.hp = Math.max(0, foe.hp - dmg);
      await this.flashHit(foe, big);
      await this.drain(foe);
    };
    if (kind === 'extend') {
      sfx.grow();
      const s = { k: 'staffx', x0: 29, y0: 66, x1: 29, y1: 66, life: 999, t: 0 };
      this.fx.push(s);
      for (let i = 1; i <= 10; i++) { s.x1 = 29 + (tp.x - 6 - 29) * (i / 10); s.y1 = 66 + (tp.y - 66) * (i / 10); await g.wait(1); }
      g.shake(8, 2); this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 14, t: 0, col: '#ffd23a' });
      await hit(52);
      for (let i = 9; i >= 0; i--) { s.x1 = 29 + (tp.x - 6 - 29) * (i / 10); s.y1 = 66 + (tp.y - 66) * (i / 10); await g.wait(1); }
      s.life = 0;
    } else if (kind === 'fly') {
      sfx.whoosh();
      const s = { k: 'staffspin', x: 29, y: 60, a: 0, life: 999, t: 0 };
      this.fx.push(s);
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i <= 14; i++) { const k = i / 14; s.x = 29 + (tp.x - 29) * k; s.y = 60 + (tp.y - 60) * k - Math.sin(k * Math.PI) * 16; s.a += 0.6; await g.wait(1); }
        g.shake(6, 2); this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 12, t: 0, col: '#ffd23a' });
        await hit(28);
        if (foe.hp <= 0) break;
        for (let i = 14; i >= 0; i--) { const k = i / 14; s.x = 29 + (tp.x - 29) * k; s.y = 60 + (tp.y - 60) * k + Math.sin(k * Math.PI) * 10; s.a += 0.6; await g.wait(1); }
        sfx.whoosh();
      }
      s.life = 0;
    } else {
      sfx.grow();
      const s = { k: 'staffbig', x: tp.x, y: -60, life: 999, t: 0 };
      this.fx.push(s);
      for (let i = 0; i <= 12; i++) { s.y = -60 + (tp.y - 30 + 60) * (i / 12) ** 2; await g.wait(1); }
      sfx.thoom(); g.shake(24, 4); g.flash('#fff6a0', 8);
      for (let i = 0; i < 10; i++) this.fx.push({ k: 'dot', x: tp.x + rnd(-14, 14), y: tp.y + 14, vx: rnd(-1.2, 1.2), vy: -rnd(0.4, 1.4), life: 24, t: 0, col: i % 2 ? '#c8b080' : '#ffd23a' });
      await hit(72, true);
      if (foe.hp > 0 && !foe.status.daze && Math.random() < (foe.boss ? 0.35 : 0.6)) { foe.status.daze = true; await this.msg(foe.name + ' is seeing stars!'); }
      s.life = 0;
    }
  }

  /* someone said "Em" or "Gem": NOVA's hearts float up */
  onLove(g) {
    if (g.state.pet.species !== 'tiger' || this.anim.me.hide || g.t - (this.loveT ?? -999) < 40) return;
    this.loveT = g.t;
    for (let i = 0; i < 5; i++) this.fx.push({ k: 'heart', x: 50 + rnd(-12, 12), y: 64 - i * 3, vy: -rnd(0.3, 0.55), life: 60 + i * 6, t: -i * 6 });
  }

  /* ---------- the end ---------- */
  async win() {
    const g = this.game, foe = this.foe;
    sfx.faint();
    for (let i = 0; i < 30; i++) { this.anim.foe.sink = i; await g.wait(1); }
    this.anim.foe.hide = true;
    await this.msg(foe.boss ? foe.name + ' is beaten!' : foe.ghoul ? 'The ' + foe.name + ' melts back into the shadows!' : 'The wild ' + foe.name + ' is out cold!');
    playMusic('victory');
    await this.reward(true);
    return this.end('win');
  }
  /* XP, levelling up, new moves and (after a win) maybe a jewel */
  async reward(jewels) {
    const st = this.game.state, me = this.me, foe = this.foe, pet = st.pet;
    pet.hp = me.hp; pet.en = me.en;
    st.battles = (st.battles || 0) + 1;
    const gain = Math.round((WILD[foe.species].xp * foe.lv) / 2.2);
    pet.xp += gain;
    await this.msg(me.name + ' gained ' + gain + ' XP!');
    while (pet.xp >= xpToNext(pet.lv) && pet.lv < 30) {
      pet.xp -= xpToNext(pet.lv);
      const old = companionStats(pet);
      pet.lv++;
      const now = companionStats(pet);
      pet.hp = Math.min(now.hp, pet.hp + (now.hp - old.hp) + 4);
      me.lv = pet.lv; me.maxHp = now.hp; me.hp = pet.hp; me.disp = me.hp; me.maxEn = MAX_EN(pet.lv);
      sfx.levelup();
      this.levelBox = { old, now, t: 0 };
      await this.msg(me.name + ' grew to Lv ' + pet.lv + '!');
      this.levelBox = null;
      for (const m of learnsAt(pet, pet.lv)) {
        if (!pet.moves.includes(m)) { pet.moves.push(m); sfx.buff(); await this.msg(me.name + ' learned ' + MOVES[m].name + '!'); }
      }
    }
    if (!jewels) return;
    const chance = WILD[foe.species].jewel || (foe.boss ? 1 : 0.35);
    if (Math.random() < chance) {
      const r = Math.random(), kind = foe.boss ? 'diamond' : r < 0.5 ? 'gold' : r < 0.65 ? 'emerald' : r < 0.8 ? 'sapphire' : r < 0.95 ? 'ruby' : 'diamond';
      st.jewels[kind] = (st.jewels[kind] || 0) + 1;
      st.money += JEWELS[kind].value;
      sfx.jewel(kind);
      await this.msg(foe.short + ' left behind a ' + JEWELS[kind].name + '!');
    }
  }
  async lose() {
    const st = this.game.state;
    sfx.faint();
    this.anim.me.hide = true;
    st.pet.hp = 0;
    await this.msg(this.me.name + ' is worn out!');
    return this.end('lose');
  }
  async end(result) {
    const g = this.game;
    if (result !== 'lose' && g.state.pet.hp <= 0) g.state.pet.hp = 1;
    await g.fade(1, 14);
    g.pop(this);
    this.resolve(result);
    if (result !== 'lose') g.fade(0, 14);
  }

  /* ---------- choosing what to do ---------- */
  async choose() {
    const g = this.game, me = this.me, st = g.state;
    for (;;) {
      this.phase = 'choose';
      const i = await g.menu(['FIGHT', 'BAG', 'GUARD', 'RUN'], { x: 92, y: 98, w: 66, h: 44, cols: 2, rowH: 16, noCancel: true, index: this.lastCmd || 0, under: (ctx) => this.drawPrompt(ctx) });
      this.lastCmd = i;
      this.phase = null;
      if (i === 0) {
        const pet = st.pet;
        const items = pet.moves.map((m) => ({ label: MOVES[m].name, right: MOVES[m].en + 'EN', disabled: MOVES[m].en > me.en }));
        const j = await g.menu(items, { x: 46, y: 142 - items.length * 11 - 9, w: 112, index: this.lastMove || 0, under: (ctx, k) => this.drawMoveInfo(ctx, pet.moves[k]) });
        if (j < 0) continue;
        this.lastMove = j;
        return { type: 'move', move: pet.moves[j] };
      }
      if (i === 1) {
        const ids = Object.keys(ITEMS).filter((k) => st.bag[k] > 0 && !ITEMS[k].levelup);   // GOLDEN CATNIP is for the BAG screen
        if (!ids.length) { await this.msg('Your bag has nothing useful in it.'); continue; }
        const j = await g.menu(ids.map((k) => ({ label: ITEMS[k].name, right: '×' + st.bag[k] })), { x: 52, y: 142 - ids.length * 11 - 9, w: 106, under: (ctx, k) => this.drawInfo(ctx, ITEMS[ids[k]].desc) });
        if (j < 0) continue;
        if (ITEMS[ids[j]].capture && this.foe.boss) { await this.msg(this.foe.name + ' is far too strong to fit in a tube!'); continue; }
        return { type: 'item', item: ids[j] };
      }
      if (i === 2) return { type: 'guard' };
      return { type: 'run' };
    }
  }
  msg(str, auto = 34, name = null) {
    return this.game.say(str, { auto: auto || 40, name });
  }

  /* ---------- animation helpers ---------- */
  async slide() {
    for (let i = 0; i <= 26; i++) {
      const k = 1 - Math.pow(1 - i / 26, 3);
      this.anim.me.dx = -120 * (1 - k); this.anim.foe.dx = 120 * (1 - k);
      if (this.enyaHere || this.codyHere) this.anim.enya.dx = -120 * (1 - k);
      await this.game.wait(1);
    }
  }
  async drain(u) {
    await this.game.until(() => {
      const step = Math.max(1, Math.round(u.maxHp / 60));
      if (u.disp > u.hp) u.disp = Math.max(u.hp, u.disp - step);
      else if (u.disp < u.hp) u.disp = Math.min(u.hp, u.disp + step);
      return u.disp === u.hp;
    });
  }
  async flashHit(u, big) {
    const a = this.anim[u.side];
    a.blink = big ? 24 : 16;
    if (big) this.game.shake(10, 2);
    await this.game.wait(big ? 24 : 16);
  }
  pos(u) {
    if (u === 'enya') return { x: 20, y: 60 };
    return u.side === 'me' ? { x: 50, y: 72, mouth: { x: 62, y: 66 } } : (this.foe.big ? { x: 118, y: 44, mouth: { x: 102, y: 44 } } : { x: 118, y: 48, mouth: { x: 106, y: 46 } });
  }
  sparkleAt(x, y, n, cols = ['#ffffff', '#ffd23a', '#8ff0ff']) {
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = rnd(0.5, 2); this.fx.push({ k: 'dot', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 26, t: 0, col: cols[i % cols.length] }); }
  }
  spawnGlow(p, col) { for (let i = 0; i < 3; i++) this.fx.push({ k: 'ring', x: p.x, y: p.y, life: 30, t: -i * 8, col }); }
  spawnShamrocks() {
    const p = this.pos(this.me);
    for (let i = 0; i < 8; i++) this.fx.push({ k: 'clover', x: p.x + rnd(-16, 16), y: p.y + rnd(-4, 14), vx: rnd(-0.2, 0.2), vy: -rnd(0.4, 0.8), life: 50, t: -i * 4 });
  }

  /* each move's animation; resolves when it's done */
  async play(fx, user, target) {
    const g = this.game, tp = target ? this.pos(target) : null, up = user ? this.pos(user) : null;
    const side = user ? this.anim[user.side] : null, dir = user && user.side === 'me' ? 1 : -1;
    const lunge = async (dist = 10, frames = 6) => {
      for (let i = 0; i < frames; i++) { side.dx = (dist * dir * i) / frames; await g.wait(1); }
      for (let i = frames; i >= 0; i--) { side.dx = (dist * dir * i) / frames; await g.wait(1); }
    };
    const stream = async (cols, frames = 28, size = 2) => {
      const m = up.mouth || up;
      for (let i = 0; i < frames; i++) {
        for (let k = 0; k < 2; k++) this.fx.push({ k: 'shot', x: m.x, y: m.y, tx: tp.x + rnd(-6, 6), ty: tp.y + rnd(-6, 6), life: 16, t: 0, col: cols[Math.floor(Math.random() * cols.length)], size });
        await g.wait(1);
      }
      await g.wait(14);
    };
    switch (fx) {
      case 'claw': case 'whip': case 'vine':
        sfx.slash();
        if (side) lunge(8, 4);
        for (let i = 0; i < (fx === 'claw' ? 3 : 4); i++) { this.fx.push({ k: 'slash', x: tp.x - 10 + i * 7, y: tp.y - 12, life: 14, t: 0, col: { claw: '#ffffff', whip: '#8ff0ff', vine: '#5fe07a' }[fx] }); await g.wait(5); }
        await g.wait(10); break;
      case 'roar':
        sfx.roar(); g.shake(24, 2);
        for (let i = 0; i < 5; i++) { this.fx.push({ k: 'arc', x: up.mouth.x, y: up.mouth.y, dir, life: 28, t: 0, col: i % 2 ? '#ffd23a' : '#ffffff' }); await g.wait(6); }
        await g.wait(16); break;
      case 'pounce': case 'dive': {
        sfx.whoosh();
        const a = side, steps = 14;
        for (let i = 0; i <= steps; i++) { const t = i / steps; a.dx = dir * 60 * t; a.dy = -Math.sin(t * Math.PI) * (fx === 'dive' ? 40 : 18); await g.wait(1); }
        g.shake(12, 3); this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 16, t: 0 });
        for (let i = steps; i >= 0; i--) { a.dx = dir * 60 * (i / steps); a.dy = 0; await g.wait(1); }
        break;
      }
      case 'pin': {   // NOVA leaps on the foe and holds it down for the tube
        sfx.whoosh();
        const a = side, steps = 12;
        for (let i = 0; i <= steps; i++) { const k = i / steps; a.dx = dir * 52 * k; a.dy = -Math.sin(k * Math.PI) * 14; await g.wait(1); }
        g.shake(8, 2); sfx.rawr(); this.fx.push({ k: 'star', x: tp.x, y: tp.y + 6, life: 14, t: 0, col: '#ffd23a' });
        await g.wait(16);
        for (let i = steps; i >= 0; i--) { a.dx = dir * 52 * (i / steps); a.dy = 0; await g.wait(1); }
        break;
      }
      case 'step':
        sfx.beam();
        this.fx.push({ k: 'beam', x: up.x, y: up.y, life: 18, t: 0 });
        await g.wait(8); side.hide = true; await g.wait(8);
        this.fx.push({ k: 'beam', x: tp.x - 18 * dir, y: tp.y, life: 16, t: 0 });
        sfx.slash(); this.fx.push({ k: 'slash', x: tp.x - 4, y: tp.y - 12, life: 14, t: 0, col: '#fff07a' });
        await g.wait(14); side.hide = false; this.fx.push({ k: 'beam', x: up.x, y: up.y, life: 14, t: 0 });
        await g.wait(10); break;
      case 'aura':
        sfx.flame();
        for (let i = 0; i < 40; i++) { this.fx.push({ k: 'flame', x: up.x + rnd(-14, 14), y: up.y + 14, vy: -rnd(0.6, 1.2), life: 24, t: 0 }); await g.wait(1); }
        g.flash('#ff3b2f', 8); await g.wait(10); break;
      case 'lick':   // a big lick: hearts and sparkles, and the wounds close up
        sfx.lick();
        for (let i = 0; i < 6; i++) this.fx.push({ k: 'heart', x: up.x + rnd(-14, 14), y: up.y + rnd(-4, 8), vy: -rnd(0.3, 0.6), life: 50, t: -i * 5 });
        for (let i = 0; i < 10; i++) this.fx.push({ k: 'dot', x: up.x + rnd(-8, 8), y: up.y - 4, vx: rnd(-0.6, 0.6), vy: rnd(-1, 0), life: 22, t: -i * 2, col: i % 2 ? '#ff8ad8' : '#c8f4ff' });
        await g.wait(40); break;
      case 'flame': sfx.flame(); await stream(['#ffffff', '#ffd23a', '#ff8a1e', '#e8302a'], 30, 2); this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 16, t: 0, col: '#ff8a1e' }); break;
      case 'frost': sfx.frost(); await stream(['#ffffff', '#c8f4ff', '#6fe0ff'], 30, 2); this.sparkleAt(tp.x, tp.y, 14, ['#ffffff', '#c8f4ff']); break;
      case 'jet': sfx.flame(); g.shake(20, 2); await stream(['#ffffff', '#fff2a0', '#ff8a1e', '#ff5a1a'], 36, 3); break;
      case 'goo': sfx.ink(); await stream(['#7ee04a', '#3fa830', '#d8ffb0'], 14, 2); break;
      case 'shard': sfx.zap(); await stream(['#5ff2ff', '#e0ffff', '#c08cff'], 12, 2); break;
      case 'zapsting': sfx.zap(); await stream(['#ff7ad8', '#ffffff', '#ffd2f0', '#5ff2ff'], 16, 2); this.sparkleAt(tp.x, tp.y, 12, ['#ff7ad8', '#ffffff', '#5ff2ff']); break;
      case 'shadow': sfx.cry('ghoul'); await stream(['#2a1640', '#5a2a8a', '#0a0410', '#b06aff'], 18, 2); this.fx.push({ k: 'slash', x: tp.x - 6, y: tp.y - 12, life: 14, t: 0, col: '#c88aff' }); g.shake(8, 2); await g.wait(10); break;
      case 'wail':
        sfx.cry('ghoul'); g.shake(16, 2);
        for (let i = 0; i < 4; i++) { this.fx.push({ k: 'arc', x: up.mouth.x, y: up.mouth.y, dir, life: 28, t: 0, col: i % 2 ? '#8a5ad8' : '#c8b0ff' }); await g.wait(6); }
        await g.wait(14); break;
      case 'drum':
        sfx.drum(); if (side) lunge(8, 4);
        for (let i = 0; i < 3; i++) { this.fx.push({ k: 'note', x: tp.x + rnd(-12, 12), y: tp.y - 6, vy: -0.6, life: 30, t: 0, col: ['#ff8ad8', '#5ff2ff', '#ffd23a'][i] }); await g.wait(5); }
        await g.wait(8); break;
      case 'bassdrop':
        sfx.boom(); g.shake(22, 3);
        for (let i = 0; i < 4; i++) { this.fx.push({ k: 'ring', x: up.x, y: up.y + 10, life: 30, t: 0, col: i % 2 ? '#ff8ad8' : '#5ff2ff' }); await g.wait(5); }
        this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 16, t: 0, col: '#ff8ad8' }); await g.wait(14); break;
      case 'tail':
        sfx.whoosh(); if (side) lunge(16, 6);
        this.fx.push({ k: 'spin', x: tp.x, y: tp.y, life: 20, t: 0 }); await g.wait(22); break;
      case 'smoke': case 'mist': case 'ink': case 'spores': case 'dust': {
        const cols = { smoke: ['#c83a3a', '#8a2a3a', '#e8604a'], mist: ['#c8f4ff', '#8ab0d8', '#ffffff'], ink: ['#3a2a7a', '#5fc8f8', '#1a0f2e'], spores: ['#c49cff', '#8ff0ff', '#a050e0'], dust: ['#ffe6a0', '#fff2c0', '#d0a868'] }[fx];
        (fx === 'ink' ? sfx.ink : sfx.whoosh)();
        for (let i = 0; i < 16; i++) { this.fx.push({ k: 'puff', x: tp.x + rnd(-14, 14), y: tp.y + rnd(-10, 10), life: 40, t: 0, col: cols[i % 3] }); await g.wait(2); }
        await g.wait(20); break;
      }
      case 'glow': sfx.heal(); this.spawnGlow(up, '#8ff0ff'); this.sparkleAt(up.x, up.y, 14, ['#8ff0ff', '#c08cff', '#ffffff']); await g.wait(36); break;
      case 'wave':
        sfx.wave();
        for (let i = 0; i < 4; i++) { this.fx.push({ k: 'wave', x: up.x, y: up.y, tx: tp.x, ty: tp.y, life: 24, t: 0 }); await g.wait(6); }
        await g.wait(22); break;
      case 'prism':
        sfx.flash();
        for (let i = 0; i < 24; i++) { const cols = ['#ff5a5a', '#ffd23a', '#5fe07a', '#5ff2ff', '#7f8aff', '#c08cff']; this.sparkleAt(tp.x + rnd(-10, 10), tp.y + rnd(-10, 10), 1, [cols[i % 6]]); await g.wait(1); }
        g.flash('#ffffff', 6); await g.wait(16); break;
      case 'harden': sfx.guard(); this.fx.push({ k: 'shine', x: up.x, y: up.y, life: 24, t: 0 }); await g.wait(26); break;
      case 'flash': {   // Enya's Diamond Flash: the GEM blazes, then its light shatters like a diamond
        sfx.flash();
        const nx = 21, ny = 52;
        this.fx.push({ k: 'burst', x: nx, y: ny, life: 40, t: 0 });
        g.flash('#ffffff', 22);
        if (g.hooks.burst) g.hooks.burst(nx, ny);
        await g.wait(14);
        sfx.shatter();
        this.fx.push({ k: 'crack', x: tp.x, y: tp.y, life: 16, t: 0, seed: Math.floor(Math.random() * 1000) });
        for (let i = 0; i < 22; i++) { const a = Math.random() * Math.PI * 2, s = rnd(0.8, 2.6); this.fx.push({ k: 'shard', x: tp.x, y: tp.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, g: 0.08, life: 40, t: 0, col: ['#ffffff', '#c8f4ff', '#8ff0ff', '#ffd23a'][i % 4] }); }
        this.sparkleAt(tp.x, tp.y, 12, ['#ffffff', '#c8f4ff', '#ffd23a']);
        await g.wait(30); break;
      }
      case 'firering': {   // CODY's lesson: rings of fire pulse out from NOVA, stretch across and swallow the foe
        sfx.fireRing(); g.shake(10, 2);
        for (let i = 0; i < 3; i++) { this.fx.push({ k: 'fring', x: up.x, y: up.y + 8, life: 34, t: 0 }); await g.wait(7); }
        await g.wait(10);
        sfx.flame(); g.flash('#ff8a1e', 10);
        for (let i = 0; i < 40; i++) { this.fx.push({ k: 'flame', x: tp.x + rnd(-16, 16), y: tp.y + rnd(-4, 16), vy: -rnd(0.6, 1.4), life: 26, t: 0 }); if (i % 2) await g.wait(1); }
        this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 18, t: 0, col: '#ff8a1e' });
        await g.wait(12); break;
      }
      case 'bite':   // two fangs, snapping shut
        sfx.slash(); if (side) lunge(10, 5);
        for (const dx of [-4, 4]) this.fx.push({ k: 'fang', x: tp.x + dx, y: tp.y - 10, life: 16, t: 0 });
        g.shake(6, 1); await g.wait(18); break;
      case 'hiss':
        sfx.hiss();
        for (let i = 0; i < 4; i++) { this.fx.push({ k: 'arc', x: up.mouth.x, y: up.mouth.y, dir, life: 26, t: 0, col: i % 2 ? '#c8ff3a' : '#6ac83a' }); await g.wait(6); }
        await g.wait(12); break;
      case 'venom': sfx.spit(); await stream(['#c8ff3a', '#a0e02a', '#a050e0', '#f0ffb0'], 16, 2); this.sparkleAt(tp.x, tp.y, 10, ['#c8ff3a', '#a050e0']); break;
      case 'coil': sfx.guard(); for (let i = 0; i < 3; i++) this.fx.push({ k: 'ring', x: up.x, y: up.y + 8, life: 26, t: -i * 6, col: '#ffe23a' }); await g.wait(30); break;
      case 'ooze': sfx.ink(); await stream(['#9ab82a', '#c8e83a', '#6a8a1a', '#f0ff8a'], 26, 3); this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 14, t: 0, col: '#c8e83a' }); break;
      case 'jade': sfx.flame(); await stream(['#5fe07a', '#2fae5a', '#ffd23a', '#e8fff0'], 30, 2); this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 16, t: 0, col: '#5fe07a' }); break;
      case 'tide':   // a wave of lagoon water, crashing across
        sfx.wave(); sfx.whoosh();
        this.fx.push({ k: 'tidewave', x: up.x, x1: tp.x, y: tp.y + 12, life: 30, t: 0 });
        await g.wait(26); g.shake(14, 2); await g.wait(8); break;
      case 'drain': {   // the life it takes streams back to it
        sfx.cry('ghoul');
        for (let i = 0; i < 22; i++) { this.fx.push({ k: 'shot', x: tp.x + rnd(-8, 8), y: tp.y + rnd(-8, 8), tx: up.x, ty: up.y, life: 18, t: 0, col: ['#b06aff', '#e6d8ff', '#5a2a8a'][i % 3], size: 1 }); await g.wait(1); }
        await g.wait(14); break;
      }
      case 'wither': {
        sfx.whoosh();
        for (let i = 0; i < 14; i++) { this.fx.push({ k: 'puff', x: tp.x + rnd(-14, 14), y: tp.y + rnd(-10, 10), life: 40, t: 0, col: ['#8a8698', '#5a566a', '#d0ccdc'][i % 3] }); await g.wait(2); }
        await g.wait(16); break;
      }
      case 'shadowbreath': sfx.cry('ghoul'); g.shake(10, 2); await stream(['#2a1640', '#5a2a8a', '#0a0410', '#c86aff'], 32, 3); this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 16, t: 0, col: '#c86aff' }); break;
      case 'epounce': {
        const a = this.anim.enya;
        sfx.roar();
        for (let i = 0; i <= 12; i++) { a.dx = 70 * (i / 12); a.dy = -Math.sin((i / 12) * Math.PI) * 16; await g.wait(1); }
        g.shake(10, 2); this.fx.push({ k: 'slash', x: tp.x - 6, y: tp.y - 12, life: 14, t: 0, col: '#7dff9a' });
        for (let i = 12; i >= 0; i--) { a.dx = 70 * (i / 12); a.dy = 0; await g.wait(1); }
        break;
      }
      default:   // a plain tackle
        sfx.whoosh();
        if (side) await lunge(14, 6);
        this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 12, t: 0 });
        await g.wait(6);
    }
  }

  /* ---------- drawing ---------- */
  update(g) { this.tick(g); }
  tick() {
    this.t++;
    for (const f of this.fx) { f.t++; if (f.vx !== undefined) { f.x += f.vx; f.y += f.vy; if (f.g) f.vy += f.g; } else if (f.vy !== undefined) f.y += f.vy; }
    this.fx = this.fx.filter((f) => f.t < f.life);
    for (const k of ['me', 'foe', 'enya']) { if (this.anim[k].blink > 0) this.anim[k].blink--; if (this.anim[k].wig > 0) this.anim[k].wig--; }
    if (this.levelBox) this.levelBox.t++;
    if (this.cutin) this.cutin.t++;
    // fired up after a WARRIOR STRIKE: green sparks rise round your companion
    if (this.aura && !this.anim.me.hide && this.t % 5 === 0) this.fx.push({ k: 'dot', x: 50 + rnd(-14, 14), y: 88, vx: rnd(-0.1, 0.1), vy: -rnd(0.5, 1), life: 26, t: 0, col: this.t % 10 ? GREEN : '#b8f0d0' });
    // Enya's echo glitters
    if (this.enyaHere && this.t % 19 === 0) this.fx.push({ k: 'dot', x: rnd(6, 34), y: rnd(46, 80), vx: 0, vy: -0.25, life: 24, t: 0, col: this.t % 38 ? '#ffffff' : '#c8f4ff' });
  }
  draw(ctx, g) {
    ctx.drawImage(this.bg, 0, 0);
    const t = this.t, me = this.me, foe = this.foe, A = this.anim;
    // the foe
    if (!A.foe.hide && !(A.foe.blink && Math.floor(A.foe.blink / 3) % 2)) {
      const b = BATTLERS[foe.art], img = spr(b.rows, b.pal), s = A.foe.scale;
      const bob = Math.round(Math.sin(t / 16) * 1), w = img.width * s, h = img.height * s;
      const x = Math.round(118 - w / 2 + A.foe.dx + (A.foe.wig ? ((A.foe.wig >> 1) % 2 ? 2 : -2) : 0)), y = Math.round((foe.big ? 66 : 64) - h + bob + A.foe.dy + A.foe.sink);
      if (A.foe.sink) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 66); ctx.clip(); ctx.globalAlpha = 1 - A.foe.sink / 30; }
      if (foe.ghoul && !A.foe.sink) ctx.globalAlpha = 0.85 + 0.15 * Math.sin(t / 7);
      ctx.drawImage(img, x, y, w, h);
      ctx.globalAlpha = 1;
      if (A.foe.white) {   // pulled into the tube's light
        this.whitePals = this.whitePals || {};
        const wp = this.whitePals[foe.art] || (this.whitePals[foe.art] = Object.fromEntries(Object.keys(b.pal).map((k) => [k, '#ffffff'])));
        ctx.globalAlpha = A.foe.white; ctx.drawImage(spr(b.rows, wp), x, y, w, h); ctx.globalAlpha = 1;
      }
      if (A.foe.sink) ctx.restore();
      if (foe.status.daze && t % 40 < 30 && s === 1) this.drawDizzy(ctx, 118 + A.foe.dx, y - 2, t);
    }
    // CODY, behind your companion, leaning on his staff (in his shades, by now)
    if (this.codyHere) {
      const b = BATTLERS[g.state.flags['cody-shades'] ? 'codyShades' : 'cody'], img = spr(b.rows, b.pal), bob = Math.round(Math.sin(t / 22));
      const busy = this.fx.some((f) => f.k === 'staffx' || f.k === 'staffspin' || f.k === 'staffbig');
      if (!busy) ctx.drawImage(img, Math.round(4 + A.enya.dx), Math.round(84 - img.height + bob));
      else { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, Math.round(4 + A.enya.dx) + 24, H); ctx.clip(); ctx.drawImage(img, Math.round(4 + A.enya.dx), Math.round(84 - img.height + bob)); ctx.restore(); }   // the staff is out doing the work
    }
    // Enya's echo, behind your companion: see-through, and she flickers
    if (this.enyaHere || (!this.codyHere && A.enya.dx > -190)) {
      const b = BATTLERS.enya, img = spr(b.rows, b.pal), bob = Math.round(Math.sin(t / 18 + 1));
      ctx.globalAlpha = t % 170 < 4 ? 0.35 : 0.78 + 0.12 * Math.sin(t / 15);
      ctx.drawImage(img, Math.round(2 + A.enya.dx), Math.round(84 - img.height + bob + A.enya.dy));
      ctx.globalAlpha = 1;
      if (t % 50 < 4) { ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(2 + A.enya.dx) + 17, Math.round(84 - img.height + bob) + 12, 1, 1); }
    }
    // your companion
    if (!A.me.hide && !(A.me.blink && Math.floor(A.me.blink / 3) % 2)) {
      const b = BATTLERS[me.art];
      let pal = b.pal;
      if (me.art === 'octo') {   // LUMI shimmers through teal, blue and violet
        const hues = ['#5fc8f8', '#4fe0e8', '#8a9cff', '#b48cff', '#8a9cff', '#4fe0e8'];
        pal = this.octoPals || (this.octoPals = hues.map((L) => ({ ...b.pal, L })));
        pal = pal[Math.floor(t / 10) % pal.length];
      }
      const img = spr(b.rows, pal), bob = Math.round(Math.sin(t / 14) * 1);
      ctx.drawImage(img, Math.round(50 - img.width / 2 + A.me.dx), Math.round(90 - img.height + bob + A.me.dy));
    }
    if (this.tube) this.drawTube(ctx);
    // effects
    for (const f of this.fx) this.drawFx(ctx, f);
    // the panels
    this.drawPanels(ctx);
    if (this.levelBox) this.drawLevelBox(ctx);
    if (this.cutin) this.drawCutIn(ctx);
  }
  drawDizzy(ctx, cx, y, t) {
    for (let i = 0; i < 3; i++) {
      const a = t / 10 + (i * Math.PI * 2) / 3;
      ctx.fillStyle = i % 2 ? '#ffd23a' : '#ffffff';
      const x = Math.round(cx + Math.cos(a) * 9), yy = Math.round(y + Math.sin(a) * 3);
      ctx.fillRect(x, yy, 1, 1); ctx.fillRect(x - 1, yy, 3, 1); ctx.fillRect(x, yy - 1, 1, 3);
    }
  }
  /* Cody's staff from (x0, y0) to (x1, y1), thick wood with gold bands */
  drawStaffFx(ctx, x0, y0, x1, y1, thick = 2) {
    const len = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0)));
    for (const pass of [0, 1]) for (let i = 0; i <= len; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / len), y = Math.round(y0 + ((y1 - y0) * i) / len);
      if (!pass) { ctx.fillStyle = '#1a0f2e'; ctx.fillRect(x - 1, y - 1, thick + 2, thick + 2); continue; }
      const band = i < 3 || i > len - 3 || i % 14 === 7;
      ctx.fillStyle = band ? '#ffd23a' : '#9a6232'; ctx.fillRect(x, y, thick, thick);
      if (!band) { ctx.fillStyle = '#c88a4a'; ctx.fillRect(x, y, 1, 1); }
    }
  }
  /* a COSMIC TUBE: silver caps, and inside the glass an infinity of light, frames inside frames forever */
  drawTube(ctx) {
    const tb = this.tube, t = this.t, x = Math.round(tb.x - 5 + tb.wob), y = Math.round(tb.y - 18);
    if (tb.glow) { ctx.globalAlpha = 0.22 + 0.12 * Math.sin(t / 5); disc(ctx, x + 5, y + 9, 13, '#c8f4ff'); ctx.globalAlpha = 1; }
    ctx.fillStyle = '#1a0f2e'; ctx.fillRect(x - 1, y - 1, 12, 20);
    ctx.fillStyle = '#c8ccdc'; ctx.fillRect(x, y, 10, 3); ctx.fillRect(x, y + 15, 10, 3);
    ctx.fillStyle = '#7a7e94'; ctx.fillRect(x, y + 2, 10, 1); ctx.fillRect(x, y + 15, 10, 1);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 1, y, 3, 1);
    ctx.fillStyle = '#140832'; ctx.fillRect(x, y + 3, 10, 12);
    const cols = ['#ffffff', '#8ff0ff', '#c08cff', '#ffd23a', '#ff8ad8'];
    for (let i = 0; i < 4; i++) {
      const ix = x + 1 + i, iy = y + 3 + i, iw = 8 - i * 2, ih = 12 - i * 2;
      ctx.fillStyle = cols[(i + (t >> 2)) % 5];
      ctx.fillRect(ix, iy, iw, 1); ctx.fillRect(ix, iy + ih - 1, iw, 1); ctx.fillRect(ix, iy, 1, ih); ctx.fillRect(ix + iw - 1, iy, 1, ih);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(x + 1, y + 4, 1, 7);
  }
  /* the close-up as your warrior blood takes over, like a storm building: his brows slam down, his eyes narrow
     and blaze emerald, he trembles, and the power flares UP around him (sparks and flames rise; nothing falls,
     so it never reads as tears) */
  drawCutIn(ctx) {
    const t = this.cutin.t, slide = Math.min(1, t / 8), out = t > 70 ? Math.min(1, (t - 70) / 8) : 0;
    const k = Math.min(1, Math.max(0, (t - 10) / 30)), iris = mix(CALM, GREEN, k), y0 = 38, h = 36, cy = y0 + 21;
    ctx.save();
    ctx.translate(Math.round(-W * (1 - slide) + W * out), 0);
    ctx.fillStyle = '#0a0618'; ctx.fillRect(0, y0, W, h);
    for (let i = 0; i < 14; i++) { ctx.fillStyle = k > 0.5 ? (i % 2 ? '#1f8a52' : '#12553a') : (i % 2 ? '#14452c' : '#0c2a1c'); ctx.fillRect((i * 37 + t * 9) % (W + 20) - 20, y0 + 2 + ((i * 7) % (h - 4)), 18, 1); }
    if (k > 0.3) {   // emerald flames licking up both sides of his face
      for (let x = 0; x < W; x++) {
        if (x >= 15 && x < W - 15) continue;
        const fh = Math.max(0, Math.round((h - 2) * ((k - 0.3) / 0.7) * (0.55 + 0.45 * Math.sin(t / 3 + x * 1.7))));
        ctx.fillStyle = GREEN; ctx.fillRect(x, y0 + h - fh, 1, fh);
        ctx.fillStyle = '#b8f0d0'; ctx.fillRect(x, y0 + h - Math.round(fh * 0.4), 1, Math.round(fh * 0.4));
      }
    }
    if (k > 0.4) ctx.translate(((t * 7) % 3) - 1, ((t * 5) % 3) - 1);   // he trembles as the power builds
    ctx.fillStyle = '#ffd0a6'; ctx.fillRect(16, y0 + 5, W - 32, h - 8);
    ctx.fillStyle = '#e09a6a'; ctx.fillRect(16, y0 + h - 5, W - 32, 2);
    ctx.fillStyle = '#4a2c1c'; ctx.fillRect(16, y0 + 3, W - 32, 5);
    for (let x = 18; x < W - 18; x += 7) { const sh = Math.round(k * (1 + (x % 3))); ctx.fillRect(x, y0 + 3 - sh, 2, sh); }   // his hair bristles
    for (let x = 16; x < W - 16; x += 6) ctx.fillRect(x, y0 + 8, 4, 2 + ((x / 6) % 3));
    ctx.fillStyle = '#7a4a2c'; for (let x = 22; x < W - 22; x += 12) ctx.fillRect(x, y0 + 4, 3, 1);
    if (k > 0.35) {   // the furrow between his brows
      ctx.fillStyle = '#d08a5e';
      for (let y = cy - 9; y <= cy - 4; y++) { const lean = y > cy - 7 ? 1 : 0; ctx.fillRect(W / 2 - 4 + lean, y, 1, 1); ctx.fillRect(W / 2 + 3 - lean, y, 1, 1); }
    }
    const rows = [8, 16, 20, 22, 22, 20, 16, 8], white = mix('#ffffff', '#b8f0d0', Math.max(0, (k - 0.6) * 1.5));
    for (const [ex, side] of [[W / 2 - 28, 1], [W / 2 + 28, -1]]) {   // side 1: his nose is to the right
      // the brow: heavy, and slammed down towards his nose
      ctx.fillStyle = '#2a160c';
      for (let i = 0; i <= 28; i++) {
        const u = i / 28, bot = cy - 7 - Math.round((1 - u) * k * 1.5) + Math.round(u * k * 6), th = 2 + Math.round(k) + (u > 0.75 ? 1 : 0);
        ctx.fillRect(ex - side * 14 + side * i, bot - th + 1, 1, th);
      }
      // the eye, narrowed by lids that follow the brow; the pupil shrinks to a pinpoint and the whites glow
      ctx.fillStyle = '#1a0f2e'; ctx.fillRect(ex - 12, cy - 1, 1, 2); ctx.fillRect(ex + 11, cy - 1, 1, 2);
      for (let dx = -11; dx <= 10; dx++) {
        const u = Math.min(1, Math.max(0, (side * dx) / 22 + 0.5));
        let top = 99, bot = -99;
        rows.forEach((w, i) => { if (dx >= -w / 2 && dx < w / 2) { top = Math.min(top, cy - 4 + i); bot = Math.max(bot, cy - 4 + i); } });
        top = Math.max(top, cy - 4 + Math.round(k * (0.5 + 3.5 * u)));
        bot = Math.min(bot, cy + 3 - Math.round(k * (0.3 + 0.7 * u)));
        if (top > bot) continue;
        const lid = k > 0.3 ? 2 : 1;
        ctx.fillStyle = '#1a0f2e'; ctx.fillRect(ex + dx, top - lid, 1, lid); ctx.fillRect(ex + dx, bot + 1, 1, 1);
        for (let y = top; y <= bot; y++) {
          const dy = y - cy, d2 = dx * dx + dy * dy;
          let c = d2 <= 18 ? (d2 <= 5 ? mix(iris, '#06140c', 0.35) : iris) : white;
          if (dx >= -1 && dx <= 0 && dy >= (k < 0.5 ? -2 : -1) && dy <= (k < 0.5 ? 1 : 0)) c = '#06140c';
          ctx.fillStyle = c; ctx.fillRect(ex + dx, y, 1, 1);
        }
      }
      if (k < 0.5) { ctx.fillStyle = '#ffffff'; ctx.fillRect(ex + 1, cy - 3, 2, 2); }   // the sparkle goes as the rage comes
      if (k > 0.6) {   // a vein throbbing at his temple, a blazing streak flaring up and out of each eye, sparks rising
        const ox = ex - side * 12, oy = cy - 1;
        if (Math.sin(t / 3) > -0.4) {
          const vx = ex - side * 19, vy = cy - 9;
          ctx.fillStyle = '#e07a62'; ctx.fillRect(vx, vy, 1, 2); ctx.fillRect(vx - 1, vy + 2, 1, 1); ctx.fillRect(vx + 1, vy + 2, 1, 1);
        }
        ctx.globalAlpha = Math.min(1, (k - 0.6) * 2.5);
        for (let s = 0, len = 6 + ((t >> 2) % 2); s < len; s++) { ctx.fillStyle = s < 2 ? '#e6fff0' : GREEN; ctx.fillRect(ox - side * s, oy - Math.round(s * 0.6), 1, 2); }
        ctx.fillStyle = '#b8f0d0';
        for (let i = 0; i < 5; i++) ctx.fillRect(ex - side * 10 + side * ((i * 5) % 22), Math.round(cy - 6 - ((t * 1.5 + i * 7) % 16)), 1, 1);
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
    ctx.fillStyle = k > 0.9 ? GREEN : CALM; ctx.fillRect(0, y0 - 1, W, 1); ctx.fillRect(0, y0 + h, W, 1);
  }
  drawPanels(ctx) {
    const me = this.me, foe = this.foe;
    // your companion, top left, with your FURY underneath
    box(ctx, 2, 2, 76, 38);
    text(ctx, me.name, 7, 6, C.text);
    text(ctx, 'Lv' + me.lv, 73, 6, C.gold, { align: 'right' });
    text(ctx, 'HP', 7, 15, C.dim); bar(ctx, 19, 17, 28, me.disp / me.maxHp, hpColour(me.disp / me.maxHp));
    text(ctx, me.disp + '/' + me.maxHp, 73, 15, C.text, { align: 'right' });
    text(ctx, 'EN', 7, 23, C.dim); bar(ctx, 19, 25, 54, me.en / me.maxEn, C.cyan);
    this.drawFuryEye(ctx, 7, 31);
    bar(ctx, 19, 33, 54, this.fury / 100, this.fury >= 100 && this.t % 10 < 5 ? '#ffffff' : mix(CALM, GREEN, this.fury / 100));
    // the foe, top right
    const nm = foe.short;
    box(ctx, 82, 2, 76, 22);
    text(ctx, nm, 87, 6, C.text);
    if (measure(nm) + measure('Lv' + foe.lv) + 4 <= 66) text(ctx, 'Lv' + foe.lv, 153, 6, C.gold, { align: 'right' });   // long boss names win
    text(ctx, 'HP', 87, 15, C.dim); bar(ctx, 99, 17, 54, foe.disp / foe.maxHp, hpColour(foe.disp / foe.maxHp));
    const tags = [];
    if (foe.status.burn) tags.push('BRN');
    if (foe.status.poison) tags.push('PSN');
    if (foe.status.daze) tags.push('DAZED');
    if (tags.length) { box(ctx, 82, 23, measure(tags.join(' ')) + 10, 12, { bg: C.bg2 }); text(ctx, tags.join(' '), 87, 26, C.red); }
    const mine = [me.status.burn ? 'BRN' : '', me.status.poison ? 'PSN' : ''].filter(Boolean).join(' ');
    if (mine) { box(ctx, 2, 41, measure(mine) + 10, 12, { bg: C.bg2 }); text(ctx, mine, 7, 44, me.status.poison && !me.status.burn ? '#c8ff3a' : C.red); }
  }
  /* a little eye: green, blazing brighter as your FURY builds */
  drawFuryEye(ctx, x, y) {
    const iris = this.fury >= 100 && this.t % 10 < 5 ? '#b8f0d0' : mix(CALM, GREEN, this.fury / 100);
    ctx.fillStyle = '#1a0f2e'; ctx.fillRect(x + 1, y, 7, 1); ctx.fillRect(x, y + 1, 9, 3); ctx.fillRect(x + 1, y + 4, 7, 1);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 1, y + 1, 7, 3);
    ctx.fillStyle = iris; ctx.fillRect(x + 3, y + 1, 3, 3);
    ctx.fillStyle = '#1a0f2e'; ctx.fillRect(x + 4, y + 2, 1, 1);
  }
  drawPrompt(ctx) {
    box(ctx, 2, 98, 88, 44);
    text(ctx, 'What will', 9, 106, C.text);
    text(ctx, this.me.name + ' do?', 9, 117, C.text);
    text(ctx, 'EN ' + this.me.en + '/' + this.me.maxEn, 9, 130, C.cyan);
  }
  drawMoveInfo(ctx, id) {
    const m = MOVES[id];
    box(ctx, 2, 98, 43, 44);
    text(ctx, m.pow ? 'POW ' + m.pow : 'STATUS', 7, 104, C.gold);
    text(ctx, 'ACC ' + (m.acc || 100), 7, 114, C.text);
    text(ctx, 'EN ' + m.en, 7, 124, m.en > this.me.en ? C.red : C.cyan);
    text(ctx, 'have ' + this.me.en, 7, 133, C.dim);
    this.drawInfo(ctx, m.desc || '');
  }
  drawInfo(ctx, desc) {
    const lines = wrap(desc, W - 16);
    box(ctx, 2, 2, W - 4, 8 + lines.length * 10, { bg: C.bg2 });
    lines.forEach((l, i) => text(ctx, l, 8, 6 + i * 10, C.text));
  }
  drawLevelBox(ctx) {
    const { old, now } = this.levelBox;
    box(ctx, 94, 30, 64, 52);
    [['HP', 'hp'], ['ATK', 'atk'], ['DEF', 'def'], ['SPD', 'spd']].forEach(([l, k], i) => {
      text(ctx, l, 100, 36 + i * 11, C.dim);
      text(ctx, String(now[k]), 136, 36 + i * 11, C.text, { align: 'right' });
      text(ctx, '+' + (now[k] - old[k]), 153, 36 + i * 11, C.green, { align: 'right' });
    });
  }
  drawFx(ctx, f) {
    if (f.t < 0) return;
    const p = f.t / f.life;
    ctx.globalAlpha = 1;
    switch (f.k) {
      case 'dot': ctx.globalAlpha = 1 - p; ctx.fillStyle = f.col; ctx.fillRect(Math.round(f.x), Math.round(f.y), 1, 1); break;
      case 'slash': {
        ctx.fillStyle = f.col; const n = Math.min(18, Math.round(p * 40));
        for (let i = 0; i < n; i++) { ctx.globalAlpha = 1 - p * 0.6; ctx.fillRect(Math.round(f.x + i * 0.7), Math.round(f.y + i * 1.3), 2, 1); }
        break;
      }
      case 'arc': {
        const r = 4 + p * 46; ctx.fillStyle = f.col; ctx.globalAlpha = 1 - p;
        for (let a = -0.7; a <= 0.7; a += 0.08) ctx.fillRect(Math.round(f.x + Math.cos(a) * r * f.dir), Math.round(f.y + Math.sin(a) * r), 1, 1);
        break;
      }
      case 'star': {
        const r = 3 + p * 10; ctx.fillStyle = f.col || '#ffffff'; ctx.globalAlpha = 1 - p;
        for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; for (let k = r * 0.4; k < r; k++) ctx.fillRect(Math.round(f.x + Math.cos(a) * k), Math.round(f.y + Math.sin(a) * k), 1, 1); }
        break;
      }
      case 'beam': ctx.globalAlpha = 1 - p; ctx.fillStyle = '#ffffff'; ctx.fillRect(f.x - 2, 0, 4, f.y + 18); ctx.fillStyle = '#fff07a'; ctx.fillRect(f.x - 4, 0, 1, f.y + 18); ctx.fillRect(f.x + 3, 0, 1, f.y + 18); break;
      case 'tbeam': {   // the tube's beam of light, reaching down for the creature
        ctx.globalAlpha = 0.8 * (1 - p); ctx.fillStyle = '#e8fbff';
        for (let y = f.y; y < f.y1; y++) { const w = Math.round(2 + (y - f.y) * 0.5); ctx.fillRect(f.x - w, y, w * 2, 1); }
        break;
      }
      case 'flame': { const c = ['#ffffff', '#ffd23a', '#ff6a00', '#e8102e', '#7a1fff']; ctx.globalAlpha = 1 - p * 0.5; ctx.fillStyle = c[Math.min(4, Math.floor(p * 5))]; ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 2); break; }
      case 'shot': {
        const x = f.x + (f.tx - f.x) * p, y = f.y + (f.ty - f.y) * p - Math.sin(p * Math.PI) * 4;
        ctx.fillStyle = f.col; ctx.fillRect(Math.round(x), Math.round(y), f.size, f.size); break;
      }
      case 'spin': {
        ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 1 - p;
        for (let i = 0; i < 20; i++) { const a = p * 10 + (i / 20) * Math.PI * 1.5; ctx.fillRect(Math.round(f.x + Math.cos(a) * 14), Math.round(f.y + Math.sin(a) * 8), 2, 1); }
        break;
      }
      case 'puff': { const r = 2 + p * 4; ctx.globalAlpha = 0.85 * (1 - p); ctx.fillStyle = f.col; ctx.fillRect(Math.round(f.x - r), Math.round(f.y - r / 2), Math.round(r * 2), Math.round(r)); ctx.fillRect(Math.round(f.x - r / 2), Math.round(f.y - r), Math.round(r), Math.round(r * 2)); break; }
      case 'ring': {
        const r = 4 + p * 20; ctx.fillStyle = f.col; ctx.globalAlpha = 1 - p;
        for (let a = 0; a < Math.PI * 2; a += 0.15) ctx.fillRect(Math.round(f.x + Math.cos(a) * r), Math.round(f.y + Math.sin(a) * r * 0.6), 1, 1);
        break;
      }
      case 'wave': {
        const x = f.x + (f.tx - f.x) * p, y = f.y + (f.ty - f.y) * p;
        ctx.fillStyle = f.t % 4 < 2 ? '#c08cff' : '#8ff0ff'; ctx.globalAlpha = 0.9;
        for (let a = -1.2; a <= 1.2; a += 0.15) ctx.fillRect(Math.round(x + Math.cos(a) * 8), Math.round(y + Math.sin(a) * 10), 1, 1);
        break;
      }
      case 'shine': ctx.globalAlpha = 1 - p; ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(f.x - 16 + p * 32), Math.round(f.y - 16), 2, 32); break;
      case 'clover': {
        ctx.globalAlpha = Math.min(1, (1 - p) * 2);
        const x = Math.round(f.x + Math.sin(f.t / 6) * 2), y = Math.round(f.y);
        ctx.fillStyle = '#2fd85a'; ctx.fillRect(x, y, 2, 2); ctx.fillRect(x + 3, y, 2, 2); ctx.fillRect(x + 1, y + 2, 3, 2); ctx.fillStyle = '#1b7a33'; ctx.fillRect(x + 2, y + 4, 1, 2);
        break;
      }
      case 'heart': {
        ctx.globalAlpha = Math.min(1, (1 - p) * 2);
        const hx = Math.round(f.x + Math.sin(f.t / 9) * 2), hy = Math.round(f.y);
        ctx.fillStyle = '#e81617'; ctx.fillRect(hx, hy, 2, 2); ctx.fillRect(hx + 3, hy, 2, 2); ctx.fillRect(hx, hy + 1, 5, 2); ctx.fillRect(hx + 1, hy + 3, 3, 1); ctx.fillRect(hx + 2, hy + 4, 1, 1);
        ctx.fillStyle = '#fdf6f6'; ctx.fillRect(hx, hy, 1, 1);
        break;
      }
      case 'note': ctx.globalAlpha = Math.min(1, (1 - p) * 2); text(ctx, '♪', Math.round(f.x + Math.sin(f.t / 6) * 2), Math.round(f.y), f.col, { outline: '#1a0f2e' }); break;
      case 'shard': {   // a splinter of diamond light, tumbling
        ctx.globalAlpha = 1 - p; ctx.fillStyle = f.col;
        const x = Math.round(f.x), y = Math.round(f.y);
        if (f.t % 6 < 3) { ctx.fillRect(x, y, 2, 1); ctx.fillRect(x + 1, y + 1, 1, 1); } else { ctx.fillRect(x, y, 1, 2); ctx.fillRect(x + 1, y, 1, 1); }
        break;
      }
      case 'crack': {   // the air cracking like glass round the foe
        ctx.globalAlpha = 1 - p; ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 9; i++) {
          let x = f.x, y = f.y; const a = (i / 9) * Math.PI * 2 + hash(i, 0, f.seed) * 0.5, len = 10 + hash(i, 1, f.seed) * 16;
          for (let k = 0; k < len; k++) { x += Math.cos(a + (hash(i, k, f.seed) - 0.5) * 0.9); y += Math.sin(a + (hash(i, k, f.seed) - 0.5) * 0.9); ctx.fillRect(Math.round(x), Math.round(y), 1, 1); }
        }
        break;
      }
      case 'rift': {   // a tear in the air, opening between worlds
        const open = Math.min(1, f.t / 14) * (1 - Math.max(0, (f.t - 46) / 24));
        for (let dy = -26; dy <= 26; dy++) {
          const w = Math.max(0, Math.round(open * (5 - Math.abs(dy) / 6))) + (Math.random() < 0.3 ? 1 : 0);
          const jx = Math.round(Math.sin(dy / 3 + f.t / 4) * 2);
          ctx.globalAlpha = 0.9; ctx.fillStyle = '#8ff0ff'; ctx.fillRect(f.x - w - 1 + jx, f.y + dy, w * 2 + 2, 1);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(f.x - w + jx, f.y + dy, w * 2, 1);
        }
        break;
      }
      case 'bolt': {   // your WARRIOR STRIKE: green lightning from where you stand
        ctx.globalAlpha = 1 - p;
        let x = f.x0, y = f.y0;
        for (let i = 1; i <= 12; i++) {
          const nx = f.x0 + (f.x1 - f.x0) * (i / 12) + (i < 12 ? rnd(-4, 4) : 0), ny = f.y0 + (f.y1 - f.y0) * (i / 12) + (i < 12 ? rnd(-5, 5) : 0);
          const steps = Math.max(Math.abs(nx - x), Math.abs(ny - y));
          for (let s = 0; s <= steps; s++) {
            const px = Math.round(x + ((nx - x) * s) / (steps || 1)), py = Math.round(y + ((ny - y) * s) / (steps || 1));
            ctx.fillStyle = GREEN; ctx.fillRect(px - 1, py, 3, 2); ctx.fillStyle = '#ffffff'; ctx.fillRect(px, py, 1, 1);
          }
          x = nx; y = ny;
        }
        break;
      }
      case 'fring': {   // a ring of fire stretching out from NOVA, squashed flat on the ground
        const r = 6 + p * 120, cols = ['#fff6c8', '#ffd23a', '#ff8a1e', '#e8302a'];
        ctx.globalAlpha = Math.min(1, (1 - p) * 2);
        for (let i = 0; i < 64; i++) {
          const a = (i / 64) * Math.PI * 2, fl = Math.sin(i * 2.1 + f.t) * 2, x = Math.round(f.x + Math.cos(a) * (r + fl)), y = Math.round(f.y + Math.sin(a) * (r + fl) * 0.38);
          ctx.fillStyle = cols[(i + (f.t >> 1)) % 4]; ctx.fillRect(x, y, 2, 2);
          if (i % 2) { ctx.fillStyle = '#ff6a1a'; ctx.fillRect(x, y - 2 - ((i + f.t) % 4), 1, 2); }
        }
        break;
      }
      case 'fang': {
        ctx.globalAlpha = 1 - p * 0.5; ctx.fillStyle = '#ffffff';
        const k = Math.min(1, p * 3), y = Math.round(f.y + k * 10);
        ctx.fillRect(f.x, y, 2, 6); ctx.fillRect(f.x, y + 6, 1, 2); ctx.fillStyle = '#c8ff3a'; ctx.fillRect(f.x + 1, y + 7, 1, 1);
        break;
      }
      case 'tidewave': {   // a curling wave sweeping from one side to the other
        const x = Math.round(f.x + (f.x1 - f.x) * p * 1.3), h = Math.round(18 * Math.sin(Math.min(1, p * 1.5) * Math.PI));
        ctx.globalAlpha = 0.9;
        for (let i = -16; i <= 16; i++) { const hh = Math.max(0, h - Math.abs(i) * 0.8); ctx.fillStyle = '#1aa8b8'; ctx.fillRect(x + i, f.y - hh, 1, hh); ctx.fillStyle = '#e8ffff'; ctx.fillRect(x + i, f.y - hh, 1, 1); }
        break;
      }
      case 'staffx': ctx.globalAlpha = 1; this.drawStaffFx(ctx, f.x0, f.y0, f.x1, f.y1); break;
      case 'staffspin': { ctx.globalAlpha = 1; const dx = Math.cos(f.a) * 12, dy = Math.sin(f.a) * 12; this.drawStaffFx(ctx, f.x - dx, f.y - dy, f.x + dx, f.y + dy); break; }
      case 'staffbig': { ctx.globalAlpha = 1; this.drawStaffFx(ctx, f.x, f.y - 40, f.x, f.y + 26, 6); break; }
      case 'burst': {   // rays from Enya's necklace
        ctx.globalAlpha = 1 - p;
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2 + p, len = 10 + p * 140;
          ctx.fillStyle = i % 2 ? '#ffffff' : '#c8f4ff';
          for (let k = 4; k < len; k += 2) ctx.fillRect(Math.round(f.x + Math.cos(a) * k), Math.round(f.y + Math.sin(a) * k), i % 2 ? 2 : 1, 1);
        }
        ctx.fillStyle = '#ffffff'; ctx.fillRect(f.x - 2, f.y - 2, 5, 5);
        break;
      }
    }
    ctx.globalAlpha = 1;
  }
}
