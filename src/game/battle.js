/* Battles: your companion (and Enya, once she's with you) against a wild creature of the Crimson
   Wilds. Turn by turn: pick a move (moves cost EN, which refills a little each turn), use an item,
   guard, or run. Enya acts on her own after you: she heals, attacks with the Emerald Tiger, or uses
   her Diamond Flash to daze the foe. */
import { W, H, spr, makeCanvas, hash, painter } from '../engine/pixel.js';
import { text, measure, wrap } from '../engine/font.js';
import { box, bar, hpColour, C } from './ui.js';
import { sfx, playMusic } from '../engine/audio.js';
import { BATTLERS } from '../art/battlers.js';
import { buildProps } from '../art/tiles.js';
import { MOVES, WILD, ITEMS, JEWELS, companionStats, companionArt, xpToNext, learnsAt, MAX_EN } from './data.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const STAGE = { '-2': 0.6, '-1': 0.78, 0: 1, 1: 1.3, 2: 1.6 };
const ACC_STAGE = { '-2': 0.62, '-1': 0.8, 0: 1, 1: 1.1, 2: 1.2 };
const STAT_NAME = { atk: 'attack', def: 'defence', acc: 'accuracy', spd: 'speed' };
let BG = null, PLANET = null;

function background(boss) {
  const c = makeCanvas(W, 96), g = c.getContext('2d');
  const sky = boss ? ['#1a0820', '#2a0e30', '#3e1638', '#5a1e40'] : ['#1c0c3a', '#2e1660', '#4a2a8a', '#6a40c0'];
  for (let y = 0; y < 60; y++) {
    const t = y / 60, i = Math.min(3, Math.floor(t * 4)), j = Math.min(3, i + 1), f = t * 4 - i;
    for (let x = 0; x < W; x++) { g.fillStyle = (f + (hash(x, y, 3) - 0.5) * 0.35) > 0.5 ? sky[j] : sky[i]; g.fillRect(x, y, 1, 1); }
  }
  for (let i = 0; i < 40; i++) { g.fillStyle = i % 5 ? '#b48cff' : '#ffffff'; g.fillRect(Math.floor(hash(i, 1, 9) * W), Math.floor(hash(i, 2, 9) * 46), 1, 1); }
  PLANET = PLANET || buildProps().planet.img[0];
  g.drawImage(PLANET, boss ? 70 : 52, 20);
  // mesas on the horizon
  g.fillStyle = boss ? '#2a0c1c' : '#3a1430';
  for (let x = 0; x < W; x++) { const h = 6 + Math.round(4 * Math.sin(x / 11) + 3 * Math.sin(x / 5.3) + (x > 60 && x < 90 ? 6 : 0)); g.fillRect(x, 60 - h, 1, h); }
  g.fillStyle = boss ? '#3a1222' : '#552042';
  for (let x = 0; x < W; x++) { const h = 3 + Math.round(2 * Math.sin(x / 7 + 1)); g.fillRect(x, 60 - h, 1, h); }
  // the ground
  const grd = boss ? ['#5a2a34', '#4a2230', '#6a3440'] : ['#b4443c', '#9c3434', '#cf5e48'];
  for (let y = 60; y < 96; y++) for (let x = 0; x < W; x++) { const r = hash(x, y, 4); g.fillStyle = r < 0.08 ? grd[2] : r < 0.2 ? grd[1] : grd[0]; g.fillRect(x, y, 1, 1); }
  g.fillStyle = boss ? '#2a1420' : '#7a2430'; g.fillRect(0, 60, W, 1);
  // tufts of glowgrass and glowing flowers
  for (let i = 0; i < 22; i++) {
    const x = Math.floor(hash(i, 5, 7) * W), y = 64 + Math.floor(hash(i, 6, 7) * 30);
    g.fillStyle = boss ? '#7a7e94' : '#5a2ca4'; g.fillRect(x, y - 3, 1, 3); g.fillRect(x + 2, y - 4, 1, 4); g.fillStyle = boss ? '#b8bccc' : '#8a50e4'; g.fillRect(x + 1, y - 5, 1, 5);
    if (i % 4 === 0) { g.fillStyle = '#8ff0ff'; g.fillRect(x + 1, y - 6, 1, 1); }
  }
  // the two spots where you and the foe stand
  for (const [cx, cy, rx] of [[118, 64, 22], [44, 89, 26]]) {
    for (let y = -4; y <= 4; y++) for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx) + (y * y) / 16 <= 1) { g.fillStyle = boss ? 'rgba(10,0,10,0.35)' : 'rgba(60,10,40,0.35)'; g.fillRect(cx + x, cy + y, 1, 1); }
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
    this.enyaHere = !!st.flags.enya;
    this.enyaCool = { flash: 1, cheer: 0 };
    this.bg = background(!!foe.big);
    this.fx = [];
    this.anim = { me: { dx: -120, dy: 0, blink: 0, hide: false }, foe: { dx: 120, dy: 0, blink: 0, hide: false, sink: 0 }, enya: { dx: this.enyaHere ? -120 : -200, dy: 0, blink: 0 } };
    this.phase = 'intro';
    this.prompt = null;
    this.result = new Promise((r) => { this.resolve = r; });
    this.t = 0;
    playMusic(foe.boss ? 'boss' : Math.random() < 0.5 ? 'battle' : 'battle2');
    this.go().catch((e) => { console.error(e); this.end('run'); });
  }

  /* ---------- the flow ---------- */
  async go() {
    const g = this.game, me = this.me, foe = this.foe;
    await this.slide();
    sfx.cry(foe.species);
    this.anim.foe.wig = 20;
    await this.msg(WILD[foe.species].intro);
    if (this.enyaHere) await this.msg('ENYA and the EMERALD TIGER fight beside you!');
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
      // end of the round: burns, wearing-off effects, a little energy back
      for (const u of [me, foe]) {
        if (u.status.burn > 0 && u.hp > 0) {
          const d = Math.max(1, Math.round(u.maxHp / 12));
          await this.flashHit(u);
          u.hp = Math.max(0, u.hp - d);
          await this.drain(u);
          await this.msg(u.name + ' is hurt by its burn!');
          if (--u.status.burn <= 0) await this.msg(u.name + "'s burn healed.");
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
        await this.msg(user.name + ' feels much better!');
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
        await this.flashHit(target, c);
        await this.drain(target);
      }
      if (hits > 1) await this.msg('Hit ' + hits + ' times!');
      if (crit) await this.msg('A critical hit!');
      if (target.hp <= 0) return;
    }
    if (mv.dodge) { user.status.dodge = true; await this.msg(user.name + ' blinks away in a flash of light!'); }
    if (mv.burn && !target.status.burn && Math.random() < mv.burn) { target.status.burn = 3; await this.msg(target.name + ' was burned!'); }
    if (mv.daze && Math.random() < mv.daze * (target.boss ? 0.5 : 1)) { target.status.daze = true; await this.msg(target.name + ' is dazed!'); }
    if (mv.flinch && !target.acted && Math.random() < mv.flinch * (target.boss ? 0.5 : 1)) target.status.flinch = true;
    if (mv.debuff) await this.stage(target, mv.debuff.stat, mv.debuff.by);
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

  /* ---------- Enya ---------- */
  async enyaEnters() {
    sfx.roar();
    this.game.shake(16, 2);
    await this.msg('A roar shakes the Wilds!');
    playMusic('enya');
    this.enyaHere = true;
    for (let i = 0; i <= 24; i++) { this.anim.enya.dx = -200 + (200 * i) / 24; await this.game.wait(1); }
    sfx.flash();
    this.sparkleAt(22, 56, 14);
    await this.msg('A girl with golden hair rides in on a huge green tiger!');
    await this.msg('ENYA: Easy there, scaly! Pick on someone your own size!', 0, 'ENYA');
  }
  async enyaAct() {
    const me = this.me, foe = this.foe, c = this.enyaCool;
    c.flash--; c.cheer--;
    if (me.hp < me.maxHp * 0.45 && c.cheer <= 0) {
      c.cheer = 4;
      await this.msg('ENYA: Hang in there, ' + me.name + '! SHAMROCK CHEER!', 0, 'ENYA');
      sfx.heal();
      this.spawnShamrocks();
      await this.game.wait(30);
      me.hp = Math.min(me.maxHp, me.hp + Math.round(me.maxHp * 0.3));
      await this.drain(me);
      await this.msg(me.name + ' feels lucky! HP restored.');
      return;
    }
    if (c.flash <= 0 && !foe.status.daze && Math.random() < 0.6) {
      c.flash = 3;
      await this.msg('ENYA used DIAMOND FLASH!', 0);
      await this.play('flash', null, foe);
      if (Math.random() < (foe.boss ? 0.7 : 1)) { foe.status.daze = true; await this.msg('Her necklace flashes in ' + foe.name + "'s eyes. " + foe.name + ' is dazed!'); }
      else await this.msg(foe.name + ' shut its eyes just in time!');
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

  /* ---------- the end ---------- */
  async win() {
    const g = this.game, st = g.state, me = this.me, foe = this.foe, pet = st.pet;
    sfx.faint();
    for (let i = 0; i < 30; i++) { this.anim.foe.sink = i; await g.wait(1); }
    this.anim.foe.hide = true;
    await this.msg(foe.boss ? foe.name + ' is beaten!' : 'The wild ' + foe.name + ' is out cold!');
    playMusic('victory');
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
    const chance = WILD[foe.species].jewel || (foe.boss ? 1 : 0.35);
    if (Math.random() < chance) {
      const r = Math.random(), kind = foe.boss ? 'diamond' : r < 0.5 ? 'gold' : r < 0.65 ? 'emerald' : r < 0.8 ? 'sapphire' : r < 0.95 ? 'ruby' : 'diamond';
      st.jewels[kind] = (st.jewels[kind] || 0) + 1;
      st.money += JEWELS[kind].value;
      sfx.jewel(kind);
      await this.msg(foe.short + ' left behind a ' + JEWELS[kind].name + '!');
    }
    return this.end('win');
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
        const j = await g.menu(items, { x: 52, y: 142 - items.length * 11 - 9, w: 106, index: this.lastMove || 0, under: (ctx, k) => this.drawMoveInfo(ctx, pet.moves[k]) });
        if (j < 0) continue;
        this.lastMove = j;
        return { type: 'move', move: pet.moves[j] };
      }
      if (i === 1) {
        const ids = Object.keys(ITEMS).filter((k) => st.bag[k] > 0);
        if (!ids.length) { await this.msg('Your bag has nothing useful in it.'); continue; }
        const j = await g.menu(ids.map((k) => ({ label: ITEMS[k].name, right: '×' + st.bag[k] })), { x: 52, y: 142 - ids.length * 11 - 9, w: 106, under: (ctx, k) => this.drawInfo(ctx, ITEMS[ids[k]].desc) });
        if (j < 0) continue;
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
      if (this.enyaHere) this.anim.enya.dx = -120 * (1 - k);
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
      case 'claw': case 'whip':
        sfx.slash();
        if (side) lunge(8, 4);
        for (let i = 0; i < (fx === 'whip' ? 4 : 3); i++) { this.fx.push({ k: 'slash', x: tp.x - 10 + i * 7, y: tp.y - 12, life: 14, t: 0, col: fx === 'whip' ? '#8ff0ff' : '#ffffff' }); await g.wait(5); }
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
      case 'flame': sfx.flame(); await stream(['#ffffff', '#ffd23a', '#ff8a1e', '#e8302a'], 30, 2); this.fx.push({ k: 'star', x: tp.x, y: tp.y, life: 16, t: 0, col: '#ff8a1e' }); break;
      case 'frost': sfx.frost(); await stream(['#ffffff', '#c8f4ff', '#6fe0ff'], 30, 2); this.sparkleAt(tp.x, tp.y, 14, ['#ffffff', '#c8f4ff']); break;
      case 'jet': sfx.flame(); g.shake(20, 2); await stream(['#ffffff', '#fff2a0', '#ff8a1e', '#ff5a1a'], 36, 3); break;
      case 'goo': sfx.ink(); await stream(['#7ee04a', '#3fa830', '#d8ffb0'], 14, 2); break;
      case 'shard': sfx.zap(); await stream(['#5ff2ff', '#e0ffff', '#c08cff'], 12, 2); break;
      case 'tail':
        sfx.whoosh(); if (side) lunge(16, 6);
        this.fx.push({ k: 'spin', x: tp.x, y: tp.y, life: 20, t: 0 }); await g.wait(22); break;
      case 'smoke': case 'mist': case 'ink': case 'spores': {
        const cols = { smoke: ['#c83a3a', '#8a2a3a', '#e8604a'], mist: ['#c8f4ff', '#8ab0d8', '#ffffff'], ink: ['#3a2a7a', '#5fc8f8', '#1a0f2e'], spores: ['#c49cff', '#8ff0ff', '#a050e0'] }[fx];
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
      case 'flash': {   // Enya's Diamond Flash
        sfx.flash();
        const nx = 21, ny = 52;
        this.fx.push({ k: 'burst', x: nx, y: ny, life: 40, t: 0 });
        g.flash('#ffffff', 22);
        if (g.hooks.burst) g.hooks.burst(nx, ny);
        this.sparkleAt(tp.x, tp.y, 18, ['#ffffff', '#c8f4ff', '#ffd23a']);
        await g.wait(40); break;
      }
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
    for (const f of this.fx) { f.t++; if (f.vx !== undefined) { f.x += f.vx; f.y += f.vy; } else if (f.vy !== undefined) f.y += f.vy; }
    this.fx = this.fx.filter((f) => f.t < f.life);
    for (const k of ['me', 'foe', 'enya']) { if (this.anim[k].blink > 0) this.anim[k].blink--; if (this.anim[k].wig > 0) this.anim[k].wig--; }
    if (this.levelBox) this.levelBox.t++;
  }
  draw(ctx, g) {
    ctx.drawImage(this.bg, 0, 0);
    const t = this.t, me = this.me, foe = this.foe, A = this.anim;
    // the foe
    if (!A.foe.hide && !(A.foe.blink && Math.floor(A.foe.blink / 3) % 2)) {
      const b = BATTLERS[foe.art], img = spr(b.rows, b.pal);
      const bob = Math.round(Math.sin(t / 16) * 1);
      const x = Math.round(118 - img.width / 2 + A.foe.dx + (A.foe.wig ? ((A.foe.wig >> 1) % 2 ? 2 : -2) : 0)), y = Math.round((foe.big ? 66 : 64) - img.height + bob + A.foe.dy + A.foe.sink);
      if (A.foe.sink) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 66); ctx.clip(); ctx.globalAlpha = 1 - A.foe.sink / 30; }
      ctx.drawImage(img, x, y);
      if (A.foe.sink) ctx.restore();
      if (foe.status.daze && t % 40 < 30) this.drawDizzy(ctx, 118 + A.foe.dx, y - 2, t);
    }
    // Enya, behind your companion
    if (this.enyaHere || A.enya.dx > -190) {
      const b = BATTLERS.enya, img = spr(b.rows, b.pal), bob = Math.round(Math.sin(t / 18 + 1));
      ctx.drawImage(img, Math.round(2 + A.enya.dx), Math.round(84 - img.height + bob + A.enya.dy));
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
    // effects
    for (const f of this.fx) this.drawFx(ctx, f);
    // the panels
    this.drawPanels(ctx);
    if (this.levelBox) this.drawLevelBox(ctx);
  }
  drawDizzy(ctx, cx, y, t) {
    for (let i = 0; i < 3; i++) {
      const a = t / 10 + (i * Math.PI * 2) / 3;
      ctx.fillStyle = i % 2 ? '#ffd23a' : '#ffffff';
      const x = Math.round(cx + Math.cos(a) * 9), yy = Math.round(y + Math.sin(a) * 3);
      ctx.fillRect(x, yy, 1, 1); ctx.fillRect(x - 1, yy, 3, 1); ctx.fillRect(x, yy - 1, 1, 3);
    }
  }
  drawPanels(ctx) {
    const me = this.me, foe = this.foe;
    // your companion, top left
    box(ctx, 2, 2, 76, 30);
    text(ctx, me.name, 7, 6, C.text);
    text(ctx, 'Lv' + me.lv, 73, 6, C.gold, { align: 'right' });
    text(ctx, 'HP', 7, 15, C.dim); bar(ctx, 19, 17, 28, me.disp / me.maxHp, hpColour(me.disp / me.maxHp));
    text(ctx, me.disp + '/' + me.maxHp, 73, 15, C.text, { align: 'right' });
    text(ctx, 'EN', 7, 23, C.dim); bar(ctx, 19, 25, 54, me.en / me.maxEn, C.cyan);
    if (this.enyaHere) {
      box(ctx, 2, 31, 40, 12, { bg: C.bg2 });
      ctx.fillStyle = '#2fd85a'; ctx.fillRect(6, 35, 2, 2); ctx.fillRect(9, 35, 2, 2); ctx.fillRect(7, 37, 3, 2); ctx.fillRect(8, 39, 1, 2);
      text(ctx, '+ENYA', 13, 34, '#ffd27a');
    }
    // the foe, top right
    const nm = foe.short;
    box(ctx, 82, 2, 76, 22);
    text(ctx, nm, 87, 6, C.text);
    text(ctx, 'Lv' + foe.lv, 153, 6, C.gold, { align: 'right' });
    text(ctx, 'HP', 87, 15, C.dim); bar(ctx, 99, 17, 54, foe.disp / foe.maxHp, hpColour(foe.disp / foe.maxHp));
    const tags = [];
    if (foe.status.burn) tags.push('BRN');
    if (foe.status.daze) tags.push('DAZED');
    if (tags.length) { box(ctx, 82, 23, measure(tags.join(' ')) + 10, 12, { bg: C.bg2 }); text(ctx, tags.join(' '), 87, 26, C.red); }
    if (me.status.burn) { box(ctx, 2, this.enyaHere ? 42 : 31, 26, 12, { bg: C.bg2 }); text(ctx, 'BRN', 7, (this.enyaHere ? 42 : 31) + 3, C.red); }
  }
  drawPrompt(ctx) {
    box(ctx, 2, 98, 88, 44);
    text(ctx, 'What will', 9, 106, C.text);
    text(ctx, this.me.name + ' do?', 9, 117, C.text);
    text(ctx, 'EN ' + this.me.en + '/' + this.me.maxEn, 9, 130, C.cyan);
  }
  drawMoveInfo(ctx, id) {
    const m = MOVES[id];
    box(ctx, 2, 98, 48, 44);
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
        if (f.t < 0) break; const r = 4 + p * 20; ctx.fillStyle = f.col; ctx.globalAlpha = 1 - p;
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
        if (f.t < 0) break; ctx.globalAlpha = Math.min(1, (1 - p) * 2);
        const x = Math.round(f.x + Math.sin(f.t / 6) * 2), y = Math.round(f.y);
        ctx.fillStyle = '#2fd85a'; ctx.fillRect(x, y, 2, 2); ctx.fillRect(x + 3, y, 2, 2); ctx.fillRect(x + 1, y + 2, 3, 2); ctx.fillStyle = '#1b7a33'; ctx.fillRect(x + 2, y + 4, 1, 2);
        break;
      }
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
