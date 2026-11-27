/* Chapter 1: Crash Landing, and Chapter 2: The Dragon Kings. Everyone's lines and the story's events, as
   little async scripts: script(game, world, thing) -> runs while the world waits.

   The story so far: your homeworld is at war, and you come from a long line of warriors. You'd had
   enough of fighting and set off to find your long-lost love, the girl you grew up with, when a
   meteor storm brought you down on planet KIRRA. The crash scrambled your memory: you can only mumble
   "Em... Gem..." and the rest comes back in pieces (MEMORIES in data.js). ENYA reaches you as an echo
   from beyond the veil, through the GEM, her diamond necklace, until the ghouls hunting her pull her
   back at the end of the chapter. The two of you still have to meet for real.

   Along the way you meet CODY, a wise and cheeky white cat who walks on two legs. His staff (once the
   Dragon King's pillar) grows, shrinks to the size of an earbud for keeping in his ear, flies and fights on
   command, and weighs seven thousand kilos. He hands out GOLDEN CATNIP and teaches NOVA the FIRE TIGER RING.

   Chapter 2: the COMET makes short hops across Kirra for its last three parts. OOZEFANG has the WARP COIL
   in the VENOM MIRE; the DRAGON KING keeps the STAR CORE as a "pearl" at the JADE LAGOON (where Cody wants
   sunglasses, and the great gong calls the WHITE DRAGON); and the BLACK DRAGON, poisoned by shadow from
   beyond the veil, is draining the life out of the WITHERED DEEP, wrapped in the SOLAR SAIL. On the
   flights you dream of a summer before the war, and of the years the war took. */
import { PARTS, ITEMS, JEWELS, MOVES, CH1_PARTS, CH2_PARTS, newCompanion, enyaWith } from './data.js';
import { sfx, playMusic } from '../engine/audio.js';
import { Ending, chooseCompanion, Flight, Dream } from './scenes.js';
import { remember, hasMemory } from './memory.js';

const S = 'SPRIG', E = 'ENYA', L = 'LUMEN', DJ = 'DJ JIGGLE', FERRY = 'JELLY FERRY';
const K = 'DRAGON KING', WD = 'WHITE DRAGON', BD = 'BLACK DRAGON';
const partCount = (st) => CH1_PARTS.filter((k) => st.parts[k]).length;
const ch2Count = (st) => CH2_PARTS.filter((k) => st.parts[k]).length;
const cody = (g, str) => g.say(str, { name: 'CODY' });
/* you, thinking out loud (mumbling, while the bump on your head still hurts) */
const think = (g, str) => (dazed(g.state) ? mutter(g, str) : hero(g, str));

/* ---------- Cody's staff, and Cody coming and going ---------- */
const ear = (n) => ({ x0: n.px + 10, y0: n.py - 1, x1: n.px + 10, y1: n.py - 1 });
/* "Big!": out of his ear, and up, up, up */
async function staffBig(g, w, n) {
  n.bare = true; sfx.grow();
  w.staff = { ...ear(n), top: true, cap: true };
  await w.morphStaff({ x0: n.px + 14, y0: n.py + 12, x1: n.px + 14, y1: n.py - 36, top: true, cap: true }, 26);
}
/* back to walking size, in his paw */
async function staffBack(g, w, n) {
  await w.morphStaff({ x0: n.px + 14, y0: n.py + 11, x1: n.px + 14, y1: n.py - 4, top: true, cap: true }, 14);
  w.staff = null; n.bare = false;
}
/* "Small!": smaller and smaller, the size of an earbud, and into his ear */
async function staffSmall(g, w, n) {
  sfx.shrink();
  if (!w.staff) w.staff = { x0: n.px + 14, y0: n.py + 11, x1: n.px + 14, y1: n.py - 4, top: true, cap: true };
  n.bare = true;
  await w.morphStaff({ ...ear(n), top: true }, 28);
  w.staff = null;
  w.sparkle(n.px + 10, n.py - 2, 6, ['#ffd23a', '#fff6a0']);
}
/* "FLY!": he hops on his staff and zooms off up into the sky */
async function codyFly(g, w, n) {
  n.riding = true; sfx.grow();
  for (let i = 0; i <= 60; i++) { n.dy = -Math.pow(i / 60, 2) * 150; n.dx = (i / 60) * 50; await g.wait(1); }
  w.removeNpc(n.id);
}
async function codyPoof(g, w, n) { w.poof(n.px + 8, n.py + 2); sfx.whoosh(); w.removeNpc(n.id); await g.wait(10); }
/* Cody turns up in a puff of white fur, next to you */
function codyArrives(w, opt = {}) {
  const p = w.player;
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1]]) {
    const x = p.x + dx, y = p.y + dy;
    if (w.blocked(x, y) || w.followers.some((f) => f.x === x && f.y === y)) continue;
    const n = w.addNpc({ id: 'cody', art: 'cody', x, y, dir: dx > 0 ? 'left' : dx < 0 ? 'right' : dy > 0 ? 'up' : 'down', talk: 'cody', ...opt });
    w.poof(n.px + 8, n.py + 2); sfx.meow();
    return n;
  }
  return null;
}
async function giveCatnip(g) {
  const st = g.state;
  st.bag.catnip = (st.bag.catnip || 0) + 1;
  sfx.part();
  await g.say('You got a GOLDEN CATNIP! Give it to your companion from your BAG (START, then BAG): one sniff and they grow a whole level!');
}

/* the little gifts the turtles carry about on their shells */
const TURTLE_GIFTS = {
  green: [['berry', 2], ['tonic', 1], ['berry', 1], ['tube', 1]],
  purple: [['melon', 1], ['tube', 2], ['tonic', 2]],
  yellow: [['gold', 3], ['diamond', 1], ['gold', 5]],
};
/* where the COMET can hop to in Chapter 2 (and where it lands) */
const HOPS = {
  bloomhaven: { name: 'BLOOMHAVEN', tx: 4, ty: 5, dir: 'down' },
  mire: { name: 'THE VENOM MIRE', tx: 5, ty: 13, dir: 'down', open: (st) => st.flags.ch2 },
  lagoon: { name: 'THE JADE LAGOON', tx: 4, ty: 21, dir: 'down', open: (st) => st.flags['mire-done'] },
};
const hero = (g, str) => g.say(str, { name: g.state.name, voice: 'hero' });
/* your concussed mumbling: typed out slowly, in lavender */
const mutter = (g, str) => g.say(str, { name: g.state.name, mutter: true });
/* true the first time only */
const once = (st, key) => (st.flags[key] ? false : (st.flags[key] = true));
/* until the end of Chapter 1 the bump on your head still has you mumbling when people talk to you */
const dazed = (st) => !st.flags.chapter1;

export const SCRIPTS = {
  /* you wake up next to the crashed COMET, seeing double; Sprig rolls over to help */
  async wakeUp(g, w) {
    const st = g.state;
    w.daze = 900;
    await g.wait(40);
    await g.say('Ugh... your head is pounding, and everything is blurry. Where are you?');
    await mutter(g, '...Em...? Where... are you...?');
    w.emote('sprig', '!');
    sfx.blip();
    await g.wait(30);
    await w.walk('sprig', ['down', 'down', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'up', 'up']);
    w.face('player', 'right');
    w.face('sprig', 'left');
    await g.say('Beep! Boop! A visitor fell out of the sky! Are you hurt?', { name: S });
    await mutter(g, "My head... I was going somewhere... to someone. I can't... remember...");
    w.daze = Math.min(w.daze, 160);
    await g.say(`You have a nasty bump, ${st.name}. Your name is stitched on your flight suit! Bzzt.`, { name: S });
    await remember(g, 'fire');
    await g.say('I am SPRIG, gardener of BLOOMHAVEN, the garden city of planet KIRRA. You crashed right into our moss-roses!', { name: S });
    await g.say('Let me scan your ship... Oh dear. Bzzt.', { name: S });
    await g.say('My scanner says your ship needs SIX new parts to fly. THREE of them landed in the CRIMSON WILDS, east of the river: a FUEL CELL, a NAV CORE and a THRUSTER.', { name: S });
    await g.say('The Wilds are full of wild creatures. You must not go alone! Come to the GROVE, up the path. Our three young guardians are waiting to meet you.', { name: S });
    await w.walk('sprig', ['down', 'down', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'up', 'up']);
    w.face('sprig', 'down');
    st.flags.awake = true;
    st.flags['sprig-grove'] = true;
    st.goal = 'Meet the guardians in the GROVE (north of the plaza) and choose a companion.';
    g.save();
  },

  async sprig(g, w) {
    const st = g.state;
    if (!st.pet) { await g.say('The three pods hold our young guardians. Look at each one, then choose who will travel with you!', { name: S }); return; }
    if (st.flags.chapter2) { await g.say('The COMET is whole again! Beep! I polished every single rivet. Twice. Bzzt.', { name: S }); return; }
    if (st.flags.ch2) { await g.say(`You have found ${ch2Count(st)} of the last 3 parts! The COMET will hop you anywhere you need to go. Bzzt.`, { name: S }); return; }
    if (st.flags.chapter1) { await g.say('Beep! The COMET can make short hops now. Talk to it: its scanner is looking for your other three parts! Bzzt.', { name: S }); return; }
    const n = partCount(st);
    if (n === 0) await g.say(`Your parts are somewhere in the CRIMSON WILDS, across the bridge. Rest at the FOUNTAIN if ${st.pet.name} gets tired!`, { name: S });
    else await g.say(`You have found ${n} of 3 parts! Keep going, ${st.name}!`, { name: S });
    await g.say('TIP: press SELECT to hop on or off your companion. Riding is twice as fast! Press START for your menu.', { name: S });
  },

  /* the three guardian pods */
  async pod(g, w, prop) {
    const st = g.state;
    const which = { 'pod-tiger': 'tiger', 'pod-dragon': 'dragon', 'pod-octo': 'octo' }[prop.id];
    if (st.pet) {
      if (st.pet.species === which) await g.say('The pod is empty. Your companion lived here!');
      else await g.say('The guardian inside is fast asleep, dreaming. Shh...');
      return;
    }
    if (!st.flags.awake) return;
    const pick = await chooseCompanion(g, which);
    if (!pick) return;
    const variant = pick.variant;
    prop = w.props.find((q) => q.id === 'pod-' + pick.species) || prop;
    const chosen = pick.species;
    // the pod opens
    st.pet = newCompanion(chosen, variant);
    st.flags['open-' + prop.id] = true;
    sfx.pick();
    g.flash('#ffffff', 14);
    w.sparkle(prop.x * 16 + 8, prop.y * 16 - 6, 16);
    await g.wait(20);
    w.buildFollowers();
    w.face('pet', 'up');
    const hello = { tiger: `${st.pet.name} bounds out of the pod and nuzzles your hand. Purrr!`, dragon: `${st.pet.name} flutters out of the pod and puffs a little ${variant === 'red' ? 'smoke ring' : 'snowflake'}!`, octo: `${st.pet.name} floats out of the pod, pushes up her glasses and waves a tentacle at you.` }[chosen];
    w.wiggle(w.entity('pet'), chosen);
    await g.say(hello);
    w.emote('pet', '♥');
    sfx.joined();
    await g.say(`${st.pet.name} joined you!`);
    // your new friend's comfort brings a name up out of the fog
    const pe = w.entity('pet');
    if (chosen === 'tiger') {
      sfx.lick();
      if (pe) w.hearts(pe.px + 8, pe.py - 4, 5);
      await g.say(`${st.pet.name} sniffs the bump on your head... and gives it a big, rough lick!`);
      await g.say('Tiger saliva has powerful healing powers. The throbbing fades, and a name floats up out of the fog...');
    } else if (chosen === 'dragon') await g.say(`${st.pet.name} curls up against you, warm as a little stove. The throbbing in your head eases, and a name floats up out of the fog...`);
    else await g.say(`${st.pet.name} rests a cool, glowing tentacle on your forehead. The throbbing eases, and a name floats up out of the fog...`);
    await mutter(g, '...Em? ...Gem...? Who... who is that?');
    await remember(g, 'name');
    await g.say('TIP: press B to hop. Your companion loves it! Face your companion and press A to give them a fuss.');
    st.bag.berry = (st.bag.berry || 0) + 3;
    await g.say(`Wonderful choice! ${st.pet.name} will keep you safe. Here are 3 GLOWBERRIES for the road.`, { name: S });
    await g.say('You got 3 GLOWBERRIES!');
    await g.say('Press SELECT to ride, START for your menu. The gate drone by the bridge will let you pass now. Good luck!', { name: S });
    st.goal = 'Cross the bridge (east) into the CRIMSON WILDS and find your three ship parts.';
    st.respawn = { map: 'bloomhaven', x: 14, y: 12, dir: 'up' };
    g.save();
  },

  /* face your companion and press A */
  async petTalk(g, w) {
    const st = g.state, pet = st.pet, e = w.entity('pet');
    if (e) w.wiggle(e, pet.species);
    const n = (st.petN = (st.petN || 0) + 1);
    if (pet.species === 'tiger') {
      if (e) { w.hearts(e.px + 8, e.py - 4, 5); w.emote('pet', '♥'); }
      sfx.purr();
      if (st.furyT > 0) { st.furyT = 0; sfx.lick(); await g.say(`${pet.name} licks your face until your eyes stop glowing green. You feel calm again.`); return; }
      const lines = [`You scratch ${pet.name} behind the ears. He purrs like a little engine.`, `${pet.name} licks your scraped hands. Tiger saliva heals cuts in no time!`, `${pet.name} rolls over for a belly rub. Purrrr!`, `${pet.name} headbutts your knee, then licks the bump on your head. It hardly hurts now.`];
      const line = lines[n % lines.length];
      if (line.includes('lick')) sfx.lick();
      await g.say(line);
    } else if (pet.species === 'dragon') {
      await g.say([`${pet.name} puffs a happy ${pet.variant === 'blue' ? 'snowflake' : 'smoke ring'} and nuzzles your hand.`, `${pet.name} flaps up onto your shoulder for a moment. Heavy!`, `You stroke ${pet.name}'s warm scales. ${pet.name} hums happily.`][n % 3]);
    } else {
      await g.say([`${pet.name} pats your head with a tentacle and pushes up her glasses.`, `${pet.name} glows a happy pink when you tickle her.`, `${pet.name} gives you a tiny, squishy high-five.`][n % 3]);
    }
  },

  /* face Enya's echo and press A: a little more of the past comes back each time */
  async enyaTalk(g, w) {
    const st = g.state, n = st.enyaTalk || 0;
    st.enyaTalk = n + 1;
    const talks = [
      async () => {
        await g.say('Do you remember the hill behind my house? We used to lie in the long grass and count shooting stars.', { name: E });
        await mutter(g, '...a hill... the grass was always wet... you found more stars than me...');
        await g.say('Ha! Every single time. So you DO remember a little.', { name: E });
        await remember(g, 'hill');
      },
      async () => {
        await g.say("This necklace? It's the CELESTIAL GEM. My gran said it holds a splinter of the very first star.", { name: E });
        await mutter(g, '...Gem... Em... why do those sound... the same...?');
        await g.say("Keep thinking. You'll get there. You always were a slow one!", { name: E });
      },
      async () => {
        await g.say("Where I really am, it's cold and dark. GHOULS hunt anything that shines... and the GEM shines brightest of all.", { name: E });
        st.furyT = Math.max(st.furyT || 0, 600);
        await hero(g, "I won't let them near you.");
        await g.say('...There it is. That green in your eyes. You always got that look when someone picked on me.', { name: E });
      },
      async () => {
        await g.say('My gran had an old story: when two hearts that belong together finally meet, they light a COSMIC FLAME...', { name: E });
        await g.say("...bright enough to start a whole new universe. Daft, isn't it?", { name: E });
        await mutter(g, '...not daft... my grandmother told me the very same story...');
        await remember(g, 'flame');
      },
    ];
    if (n < talks.length) return talks[n]();
    await g.say(['The GEM is holding. For now.', `${st.pet.name} keeps staring at me. Is that normal?`, 'Tipperary feels a million miles away. It probably is.', "Find your parts first. Then we'll find a way to the real me."][n % 4], { name: E });
  },

  async drone(g, w) {
    const st = g.state;
    if (!st.pet) { await g.say('HALT. The CRIMSON WILDS are full of wild creatures. No one may pass without a companion. BZZT.', { name: 'GATE DRONE' }); return; }
    if (!st.flags['gate-open']) {
      await g.say(`Companion detected: ${st.pet.name}. ACCESS GRANTED. Travel safely.`, { name: 'GATE DRONE' });
      st.flags['gate-open'] = true;
      sfx.beam();
      await w.walk('drone', ['up'], { ghost: true });
      w.face('drone', 'down');
      g.save();
      return;
    }
    await g.say('Have a pleasant adventure. Do not feed the THORNBACKS.', { name: 'GATE DRONE' });
  },

  async fountain(g, w) {
    const st = g.state;
    if (!st.pet) { await g.say('A fountain of glowing green water. It smells like mint and rain.'); return; }
    await g.say(`${st.pet.name} drinks the glowing water...`);
    w.heal();
    sfx.heal();
    w.sparkle(w.player.px + 8, w.player.py, 12, ['#3fe08f', '#c8ffe0', '#ffffff']);
    st.respawn = { map: 'bloomhaven', x: 14, y: 12, dir: 'up' };
    await g.say('HP and EN fully restored!');
    g.save();
  },

  async shop(g, w) {
    const st = g.state;
    playMusic('shop');
    await g.say('Welcome, welcome! Shiny jewels for tasty treats! What can MOSSA get you?', { name: 'MOSSA' });
    if (dazed(st) && once(st, 'm-mossa')) {
      await mutter(g, "...I... sorry. I can't remember what I came here for.");
      await g.say('Ho ho! Snacks, dearie. Everyone comes for snacks. And my COSMIC TUBES are very popular!', { name: 'MOSSA' });
    }
    const ids = Object.keys(ITEMS).filter((k) => !ITEMS[k].rare);   // no GOLDEN CATNIP: only CODY has that
    for (;;) {
      const i = await g.menu(ids.map((k) => ({ label: ITEMS[k].name, right: '◆' + ITEMS[k].price, disabled: st.money < ITEMS[k].price })), {
        x: 52, y: 6, w: 104, title: 'YOU HAVE ◆' + st.money,
      });
      if (i < 0) break;
      const it = ITEMS[ids[i]];
      st.money -= it.price;
      st.bag[ids[i]] = (st.bag[ids[i]] || 0) + 1;
      sfx.jewel('gold');
      await g.say(`One ${it.name}! ${it.desc}`, { name: 'MOSSA' });
    }
    await g.say('Come back with more sparkles!', { name: 'MOSSA' });
    w.updateMusic();
    g.save();
  },

  async ship(g, w) {
    const st = g.state;
    if (st.flags.chapter1) {   // Chapter 2: short hops across Kirra
      if (st.flags.chapter2) await g.say('The COMET hums, whole again, its engines warm. Ready for the longest trip of all... (Chapter 3 is on its way!)');
      else if (!st.flags.ch2) await SCRIPTS.ch2Start(g, w);
      else await g.say(`The COMET can make short hops across KIRRA. Parts found: ${ch2Count(st)} of the last 3.`);
      return SCRIPTS.hop(g, w);
    }
    const n = partCount(st);
    if (n < 3) {
      const list = CH1_PARTS.map((k) => (st.parts[k] ? '★ ' : '- ') + PARTS[k].name).join('   ');
      await g.say(`The COMET, your star-skiff. Its hull is cracked and smoking. Parts found: ${n} of 3.`);
      await g.say(list);
      return;
    }
    await SCRIPTS.ending(g, w);
  },

  /* ---------- people of Bloomhaven (the first time, you can only mumble back) ---------- */
  async b1(g) {
    await g.say('The river glows because of the algae. At night the little jellies come up to the top and sing!', { name: 'FERN' });
    if (dazed(g.state) && once(g.state, 'm-b1')) await mutter(g, '...singing... she used to sing... I can almost hear it...');
  },
  async b2(g) {
    await g.say('Tall violet GLOWGRASS hides wild critters. Walk around it if your companion is tired!', { name: 'BUD' });
    if (dazed(g.state) && once(g.state, 'm-b2')) await mutter(g, "...sorry, what? My head's still ringing...");
  },
  async b3(g) {
    await g.say('MOSSA trades snacks for jewels: GOLD COINS, EMERALDS, SAPPHIRES, RUBIES, DIAMONDS... she loves them all!', { name: 'SOL' });
    if (dazed(g.state) && once(g.state, 'm-b3')) await mutter(g, '...diamonds... someone I knew wore a diamond... on a necklace...');
  },
  async b4(g) {
    const st = g.state;
    if (st.flags['enya-gone']) await g.say('Where did ENYA go? She just... faded away. I hope she comes back soon.', { name: 'SKYE' });
    else if (enyaWith(st)) await g.say("You met ENYA? She's my hero! But... is she a ghost? I can see the fountain right through her!", { name: 'SKYE' });
    else {
      await g.say('Have you heard about the ghost girl with golden hair? She rides a huge green tiger through the Wilds, then vanishes like mist!', { name: 'SKYE' });
      if (once(st, 'm-b4')) await mutter(g, '...golden hair... Em...?');
    }
  },
  async b5(g) {
    await g.say("I'm fishing for star-shrimp. This river runs to the edge of the world and pours right off it into the sky! They say a JELLY up there floats people down.", { name: 'REEF' });
    if (dazed(g.state) && once(g.state, 'm-b5')) await mutter(g, '...the edge of the world... I flew to the edge of everything... to find her...');
  },

  /* ---------- the Crimson Wilds ---------- */
  async wildsIntro(g) {
    g.state.flags['wilds-intro'] = true;
    await g.say('THE CRIMSON WILDS. Red earth, violet glowgrass and a river that glows green. Somewhere out here are your three ship parts!');
    await g.say('TIP: move with W A S D, the arrow keys or the D-pad. Walk over jewels to pick them up. Wild creatures hide in the tall violet glowgrass!');
    g.save();
  },
  async medic(g, w) {
    const st = g.state;
    await g.say("I'm the Wilds' field medic. Let me patch up your companion... There! Good as new.", { name: 'MOSS' });
    w.heal(); sfx.heal(); w.setRespawn();
    if (dazed(st) && once(st, 'm-medic')) {
      await g.say('And look at the bump on YOUR head! Did you fall out of the sky or something?', { name: 'MOSS' });
      await mutter(g, "...something like that... I've had worse. I think.");
    }
    await g.say('HP and EN fully restored! If you get into trouble, you can rest here.');
    g.save();
  },
  async scout(g) {
    const st = g.state;
    if (!st.parts.thruster) await g.say('A giant scrap crab called RUSTCLAW lives in the nest down south-east. It stole something shiny from a crashed ship and wears it like a shell!', { name: 'PEBBLE' });
    else await g.say('You beat RUSTCLAW?! Wait until everyone in Bloomhaven hears about this!', { name: 'PEBBLE' });
    if (!st.flags['thorns-cleared']) await g.say("And keep away from the black THORNS on the east trail. Nobody's got past them for ages. They give me the creeps!", { name: 'PEBBLE' });
  },
  async alphaZone(g, w) {
    const st = g.state;
    if (st.flags['alpha-beaten'] || !st.pet) return;
    st.flags['alpha-zone'] = true;
    w.emote('alpha', '!');
    sfx.roar();
    g.shake(20, 2);
    await g.wait(30);
    await g.say('GRRRAAAH! A huge THORNBACK ALPHA is sitting on something metal, and it does NOT want to share!');
    await SCRIPTS.alphaFight(g, w);
  },
  async alpha(g, w) {
    if (g.state.flags['alpha-beaten']) return;
    await g.say('The THORNBACK ALPHA growls and stamps its feet!');
    await SCRIPTS.alphaFight(g, w);
  },
  /* the Alpha, and Enya's echo tearing through from the other side */
  async alphaFight(g, w) {
    const st = g.state;
    const res = await w.battle({ species: 'thornAlpha', lv: 6, enyaArrives: st.flags.enya ? 0 : 2 });
    if (res !== 'win') { st.flags['alpha-zone'] = false; return; }
    st.flags['alpha-beaten'] = true;
    w.removeNpc('alpha');
    if (!st.flags.enya) {
      playMusic('enya');
      const p = w.player;
      w.addNpc({ id: 'enyaNpc', art: 'enya', x: Math.max(2, p.x - 4), y: p.y, dir: 'right' });
      await w.walk('enyaNpc', ['right', 'right', 'right'], { ghost: true });
      w.face('player', 'left');
      await g.say("Nice moves, you two! Name's ENYA. And this big lad is the EMERALD TIGER.", { name: E });
      if (st.flags['gate-vision']) await hero(g, 'You... I saw you. Through the gate in the Whisperwood!');
      await mutter(g, '...that necklace... Gem...? ...Em...?');
      w.emote('enyaNpc', '!');
      await g.say('...What did you just call me?', { name: E });
      await g.say("Nobody's called me that in a very long time. Look at me... You really don't know who I am, do you?", { name: E });
      await mutter(g, "I... I want to. My head's all in pieces...");
      await g.say("...It's alright. The GEM remembers for both of us.", { name: E });
      await remember(g, 'gem');
      await g.say("I'm from Tipperary, back on Earth. But I'm not really here, you know. I'm lost somewhere else... somewhere dark.", { name: E });
      await g.say('The GEM lets me reach across to you, as an echo, for as long as its light holds.', { name: E });
      if (st.pet.species === 'tiger') {
        const petE = w.entity('pet') || w.player;   // when you're riding him, he's under you
        w.emote(petE.id, '♥', 80);
        w.hearts(petE.px + 8, petE.py - 6, 6);
        await g.say(`${st.pet.name} can't stop staring at ENYA. Little hearts float up around him!`);
        await g.say('Ha! Hello to you too, handsome.', { name: E });
      }
      await g.say('That ALPHA was sitting on something shiny... Here. Is this yours?', { name: E });
      st.parts.fuelcell = true;
      sfx.part();
      await g.say('You got the FUEL CELL! (1 of 3)');
      await g.say(`Your ship needs more parts? Then you've got yourself a partner, ${st.name}. For as long as the GEM's light holds.`, { name: E });
      w.removeNpc('enyaNpc');
      st.flags.enya = true;
      w.buildFollowers();
      sfx.joined();
      await g.say("ENYA's echo and the EMERALD TIGER joined you! In battle she uses DIAMOND FLASH, SHAMROCK CHEER and the EMERALD TIGER's pounce.");
      await g.say('TIP: face ENYA and press A to talk. Her words might bring your memories back.');
      w.updateMusic();
    } else {
      st.parts.fuelcell = true;
      sfx.part();
      await g.say('The ALPHA was guarding your FUEL CELL! You got the FUEL CELL!');
    }
    st.goal = partCount(st) < 3 ? 'Find the other ship parts: the NAV CORE (river island) and the THRUSTER (RUSTCLAW’s nest, south-east).' : 'Take the parts back to the COMET in Bloomhaven!';
    g.save();
  },
  async part(g, w, part) {
    const st = g.state;
    st.parts[part.id] = true;
    sfx.part();
    g.flash('#ffffff', 10);
    w.sparkle(w.player.px + 8, w.player.py, 14);
    await g.say(`You found the ${PARTS[part.id].name}! (${partCount(st)} of 3)`);
    if (enyaWith(st) && part.id === 'navcore') await g.say(partCount(st) < 3 ? "Brilliant! Word is RUSTCLAW has the last one. It's in the scrap nest, past the bridge in the south." : "That's the lot! Back to your ship!", { name: E });
    st.goal = partCount(st) < 3 ? 'Find the remaining ship parts.' : 'Take the parts back to the COMET in Bloomhaven!';
    if (partCount(st) === 3) await g.say('All three parts! Head back to the COMET in BLOOMHAVEN.');
    g.save();
  },
  async rustclaw(g, w) {
    const st = g.state;
    if (st.flags['rustclaw-beaten']) return;
    w.emote('rustclaw', '!');
    sfx.roar();
    g.shake(16, 2);
    await g.say("A giant crab, as big as a car! And it's wearing your ship's THRUSTER as a shell!");
    if (!enyaWith(st)) {
      await g.say("RUSTCLAW snaps its huge claws at you! You back away. It's far too strong to face alone... maybe someone in the Wilds could help you.");
      return;
    }
    await g.say("That's your THRUSTER, isn't it? Right. Ready when you are!", { name: E });
    const go = await g.ask('Fight RUSTCLAW?');
    if (go !== 0) { await g.say('Take your time. Rest with the medic up north if you need to!', { name: E }); return; }
    const res = await w.battle({ species: 'rustclaw', lv: 9 });
    if (res !== 'win') return;
    st.flags['rustclaw-beaten'] = true;
    w.removeNpc('rustclaw');
    await g.say('RUSTCLAW wriggles out of the THRUSTER and scuttles away into the rocks!');
    st.parts.thruster = true;
    sfx.part();
    await g.say(`You got the THRUSTER! (${partCount(st)} of 3)`);
    await g.say("Ha! Did you see its face? Come on, let's get these back to your ship!", { name: E });
    st.goal = partCount(st) < 3 ? 'Find the remaining ship parts.' : 'Take the parts back to the COMET in Bloomhaven!';
    g.save();
  },
  /* black thorns on the east trail: touching them shows you HER, bound in them, and your eyes go green */
  async thorns(g, w) {
    const st = g.state;
    if (st.flags['thorns-cleared'] || !st.pet) return;
    await g.say('Thick black THORNS choke the trail east. They pulse with a cold, shadowy light...');
    await g.say('You reach out to touch one, and the world spins...');
    w.daze = 150; sfx.heartbeat(); g.flash('#2a0a4a', 30);
    await g.say('A flash: a girl with golden hair, bound in thorns just like these, and shadowy GHOULS laughing in the dark.');
    st.furyT = 2400; sfx.fury(); g.shake(26, 3); g.flash('#3ad07e', 18);
    await g.say("Something snaps inside you. Your eyes blaze GREEN, and a warrior's strength floods your arms!");
    sfx.slash();
    w.removeProp('thorns');
    w.sparkle(42 * 16 + 8, 12 * 16 + 4, 20, ['#3ad07e', '#b8f0d0', '#ffffff']);
    g.shake(12, 2);
    st.flags['thorns-cleared'] = true;
    await g.say('You tear the thorns apart with your bare hands! The trail east to the WHISPERWOOD is open.');
    if (st.pet.species === 'tiger') await g.say(`${st.pet.name} stares at you, wide-eyed... then purrs, very impressed.`);
    if (enyaWith(st)) await g.say('...Where did THAT come from? Remind me never to get on your bad side.', { name: E });
    g.save();
  },

  /* ---------- the Whisperwood ---------- */
  async jungleIntro(g) {
    const st = g.state;
    st.flags['jungle-intro'] = true;
    await g.say('THE WHISPERWOOD. Giant trees, glowing vines and ferns taller than you. The air hums with something very old...');
    await g.say('Whispers drift between the trees. You could swear one of them just said your name.');
    await mutter(g, '...that voice...? ...Em?');
    await g.say(st.bag.tube ? 'TIP: wild creatures hide in the tall ferns. Weaken one in battle, then capture it with a COSMIC TUBE from your BAG!' : 'TIP: wild creatures hide in the tall ferns. The LIGHT KEEPER lives by the old gate, over the stream to the north-east.');
    g.save();
  },
  async gate(g) {
    const st = g.state;
    if (st.flags['grimghoul-beaten']) { await g.say('The VEIL GATE. Its runes glow softly, as if it remembers you.'); return; }
    await g.say('An ancient stone arch. Inside it, dark motes swirl slowly... You feel someone watching you from the other side.');
    if (dazed(st) && once(st, 'm-gate')) await mutter(g, '...is someone... there...?');
  },
  /* LUMEN, the Light Keeper: COSMIC TUBES, and the light of 3 captured creatures to wake the gate */
  async lumen(g, w) {
    const st = g.state, caught = st.captures || 0;
    if (!st.flags['met-lumen']) {
      st.flags['met-lumen'] = true;
      await g.say('Oh! A traveller from the stars... with a little spark of HER light on you. How curious.', { name: L });
      await g.say('I am LUMEN, keeper of the VEIL GATE. Beyond it lies the OTHER SIDE: a dark mirror of our world.', { name: L });
      await g.say('The veil is wearing thin. GHOULS slip through, and their shadow frightens our creatures half to death.', { name: L });
      await g.say('Light heals shadow. Capture a creature in a COSMIC TUBE, and the infinite light inside will make it well again.', { name: L });
      st.bag.tube = (st.bag.tube || 0) + 3;
      sfx.part();
      await g.say('You got 3 COSMIC TUBES!');
      await g.say('Weaken a wild creature in battle, then open a tube from your BAG. Bring me the light of 3 creatures...', { name: L });
      await g.say('...and perhaps the gate will show you what you are looking for.', { name: L });
      await mutter(g, "...what I'm looking for... Em...");
      w.heal(); w.setRespawn();
      if (caught >= 3) { await g.say('Oh! But you already carry so much light...', { name: L }); return SCRIPTS.gateVision(g, w); }
      g.save();
      return;
    }
    if (st.flags['grimghoul-beaten']) {
      w.heal(); sfx.heal(); w.setRespawn();
      await g.say('Rest in my light a while, star traveller. (HP and EN fully restored!)', { name: L });
      await g.say('The gate remembers you now. When your light is strong enough, it will open for you. I am sure of it.', { name: L });
      g.save();
      return;
    }
    if (caught >= 3) return SCRIPTS.gateVision(g, w);
    w.heal(); sfx.heal(); w.setRespawn();
    await g.say('Rest in my light a while. (HP and EN fully restored!)', { name: L });
    if (!st.bag.tube) { st.bag.tube = 2; sfx.part(); await g.say('Out of tubes? Here, take 2 more. Use them gently.', { name: L }); await g.say('You got 2 COSMIC TUBES!'); }
    await g.say(`Creatures captured: ${caught} of 3. Their light will wake the gate.`, { name: L });
    g.save();
  },
  /* the gate shows you where she really is... and something slips through */
  async gateVision(g, w) {
    const st = g.state;
    w.heal(); w.setRespawn();
    const toGate = async () => { await g.fade(1, 10); w.place('player', 31, 6, 'up'); w.buildFollowers(); w.camShift.y = -22; await g.fade(0, 10); };
    if (!st.flags['gate-vision']) {
      await g.say('So much light... Look! The gate is waking!', { name: L });
      await toGate();
      playMusic('vision');
      sfx.rift();
      w.gateGlow = 1;
      g.flash('#ffffff', 20);
      g.shake(20, 2);
      await g.wait(50);
      await g.say('Through the shimmering gate you see a dark, broken forest... and a girl with golden hair, running.');
      await g.say('Shadowy GHOULS are closing in on her. The diamond at her throat blazes like a star.');
      await hero(g, 'EM! ...GEM!');
      await g.say("...Is that you? You came! I knew you'd come for me, I knew it—", { name: st.flags.enya ? E : '???' });
      sfx.shatter();
      w.shatter(31 * 16 + 8, 2 * 16 + 8, 30);
      g.flash('#ffffff', 24);
      g.shake(24, 3);
      w.gateGlow = 0;
      await g.say('CRACK! The vision shatters like a diamond!');
      st.flags['gate-vision'] = true;
      if (enyaWith(st)) await g.say("That... that's where I really am. They're getting closer.", { name: E });
      await remember(g, 'veil');
    } else {
      await toGate();
      sfx.rift();
      g.flash('#2a0a4a', 16);
      await g.say('The gate shudders. Something is clawing its way through again...');
    }
    w.addNpc({ id: 'grimghoul', art: 'grimghoul', x: 30, y: 5, dir: 'down', big: true });
    sfx.cry('grimghoul');
    g.shake(16, 2);
    w.emote('grimghoul', '!');
    await g.say('Something slipped through before the gate closed... a GRIMGHOUL! It sniffs the air, hungry for light.');
    st.furyT = 2400;
    await g.say('Your eyes blaze green. You will NOT let these things anywhere near her.');
    const res = await w.battle({ species: 'grimghoul', lv: 8, fury: 60 });
    w.removeNpc('grimghoul');
    w.camShift.y = 0;
    if (res !== 'win') return;
    st.flags['grimghoul-beaten'] = true;
    await g.say('The GRIMGHOUL dissolves into cold black smoke.');
    await g.say('The gate remembers you now. When your light is strong enough, it will open for you.', { name: L });
    await g.say('They say only a love bright enough to light a COSMIC FLAME can open it for good.', { name: L });
    if (!hasMemory(st, 'flame')) { await mutter(g, "...a cosmic flame... my grandmother's old story..."); await remember(g, 'flame'); }
    st.bag.melon = (st.bag.melon || 0) + 2;
    sfx.part();
    await g.say('LUMEN gave you 2 MOON MELONS!');
    g.save();
  },

  /* ---------- the Jelly Jam ---------- */
  async ferryDown(g, w) {
    await g.say("Bloop! Wanna see where the river goes? I'll float you down to the JELLY JAM! Best party on all of KIRRA!", { name: FERRY });
    if ((await g.ask('Float down to the JELLY JAM?')) !== 0) { await g.say('Bloop! Any time!', { name: FERRY }); return; }
    sfx.boing();
    await w.warp({ to: 'groove', tx: 3, ty: 14, dir: 'right' });
    if (once(g.state, 'groove-intro')) await SCRIPTS.grooveIntro(g, w);
  },
  async ferryUp(g, w) {
    await g.say('Bloop! Heading back up to the CRIMSON WILDS?', { name: FERRY });
    if ((await g.ask('Float back up to the WILDS?')) !== 0) { await g.say('Stay and dance a while! Bloop!', { name: FERRY }); return; }
    sfx.boing();
    await w.warp({ to: 'wilds', tx: 27, ty: 4, dir: 'down' });
  },
  async grooveIntro(g) {
    const st = g.state;
    await g.say('THE JELLY JAM: islands of glowing purple alien plants, floating in a deep purple sky. Somewhere, a big beat is pumping!');
    await g.say('The jellyfolk who live here bop along to the bass. Even the plants pulse in time!');
    if (enyaWith(st)) await g.say('Ha! This place is brilliant. Reminds me of the dances back home in Tipperary.', { name: E });
    await g.say('TIP: DJ JIGGLE is by the big boombox in JELLY TOWN, over the leaf bridge.');
    g.save();
  },
  async dj(g, w) {
    const st = g.state;
    await g.say('Yo yo YO! DJ JIGGLE in the house! This boombox fell out of the stars, just like you! Wanna dance?', { name: DJ });
    if ((await g.ask('Dance with DJ JIGGLE?', ['DANCE!', 'NOT NOW'])) !== 0) { await g.say("No worries! The beat'll be right here when you're ready!", { name: DJ }); return; }
    sfx.scratch();
    await g.say('Drop the bass! Everybody, on the beat... GO!', { name: DJ });
    await w.dance(8);
    await g.say('The jellies go wild! Bloop! Bloop! BLOOP!');
    if (once(st, 'danced')) {
      if (enyaWith(st)) await g.say('Look at you! Still got two left feet.', { name: E });
      await mutter(g, '...a crowded hall... music... she pulled me onto the floor... I kept treading on her toes...');
      await remember(g, 'dance');
      st.jewels.diamond = (st.jewels.diamond || 0) + 1;
      st.money += JEWELS.diamond.value;
      sfx.jewel('diamond');
      await g.say('Moves like that deserve a prize! Here, have a shiny DIAMOND!', { name: DJ });
      await g.say('You got a DIAMOND!');
    } else await g.say('Fresh moves, star traveller! Come back any time!', { name: DJ });
    g.save();
  },
  async j1(g) { await g.say('Bloop bloop! Welcome to the JELLY JAM! Down here, everything moves to the beat!', { name: 'BLOOP' }); },
  async j2(g) {
    await g.say('The glow-plants shine brighter every time the bass drops. Can you feel it in your tentacles?', { name: 'WOBBLE' });
    await hero(g, "...I don't have tentacles.");
    await g.say('Aww. You poor thing.', { name: 'WOBBLE' });
  },
  async j3(g) {
    await g.say('We float up to the river at night and sing to the stars. Do you sing, star traveller?', { name: 'SQUISH' });
    if (dazed(g.state) && once(g.state, 'm-j3')) await mutter(g, '...she used to hum on the walk home... the same little tune, every time...');
  },
  async j4(g) { await g.say('DJ JIGGLE found that boombox when it fell out of the sky. Now the party NEVER stops! Bloop!', { name: 'PLINK' }); },
  async j5(g) { await g.say('Shh... the DRUMCAPS are practising their drum solos in the sprout patch. They get grumpy if you interrupt!', { name: 'GLOOP' }); },
  async j6(g) {
    await g.say("Hmm-hmm-hmmm... Oh! I hum along with the stars. They're always singing, you know. You just have to be very quiet.", { name: 'HUM' });
    if (enyaWith(g.state)) await g.say('My gran used to say that too...', { name: E });
  },

  /* ---------- little things: humming her tune, the turtles, NOVA's fire, flowers ---------- */
  /* now and then you whistle or hum a little tune without thinking, and NOVA joins in (badly) */
  async hum(g, w) {
    const st = g.state, p = w.player, pet = st.pet;
    const whistle = (st.humN = (st.humN || 0) + 1) % 2 === 1;
    (whistle ? sfx.whistle : sfx.hum)();
    w.notes(p, 4);
    g.toast(whistle ? '♪ You whistle a little tune...' : '♪ You hum a little tune...', '#ffe6a0');
    await g.wait(80);
    const pe = pet.species === 'tiger' ? w.tigerEntity() : st.riding ? p : w.entity('pet');
    if (pe && pet.species === 'tiger') { sfx.humNova(); w.notes(pe, 3, ['#ff9a3a', '#ffd23a']); g.toast(`♪ ${pet.name} hums along. A bit off-key.`, '#ffb070'); }
    else if (pe && pet.species === 'dragon') { sfx.puff(); pe.wiggleT = 22; g.toast(`♪ ${pet.name} puffs little rings in time.`, '#ffb070'); }
    else if (pe) { sfx.blub(); pe.wiggleT = 22; g.toast(`♪ ${pet.name} glows in time with the tune.`, '#8ff0ff'); }
    if (!hasMemory(st, 'tune')) {
      await g.wait(60);
      await mutter(g, '...this tune... where do I know it from...? She hummed it... on the walk home... every single time...');
      await remember(g, 'tune');
    }
  },
  /* the turtles: the first time, each one has something on its back for you; after that, they're good company */
  async turtle(g, w, n) {
    const st = g.state, key = 'turtle-' + n.id, pet = st.pet;
    const name = { green: 'GREEN TURTLE', purple: 'PURPLE TURTLE', yellow: 'YELLOW TURTLE' }[n.pal] || 'TURTLE';
    if (!st.got[key]) {
      st.got[key] = true;
      await g.say(`A little ${name} pokes its head out of its shell and blinks up at you. There's something balanced on its back!`);
      const list = TURTLE_GIFTS[n.pal] || TURTLE_GIFTS.green, [k, num] = list[[...n.id].reduce((s, c) => s + c.charCodeAt(0), 0) % list.length];
      if (JEWELS[k]) { st.jewels[k] = (st.jewels[k] || 0) + num; st.money += JEWELS[k].value * num; sfx.jewel(k); await g.say(`You got ${num > 1 ? num + ' ' : 'a '}${JEWELS[k].name}${num > 1 ? 'S' : ''}!`); }
      else { st.bag[k] = (st.bag[k] || 0) + num; sfx.part(); await g.say(`You got ${ITEMS[k].name}${num > 1 ? ' ×' + num : ''}!`); }
      if (pet && pet.species === 'tiger') await g.say(`${pet.name} sniffs the turtle. The turtle sniffs ${pet.name} right back.`);
      g.save();
      return;
    }
    const lines = [
      'You sit with the turtle for a while. Turtles never hurry. The noise in your head slows down, too.',
      'The turtle munches a leaf, very, very slowly. Watching it is the most peaceful thing you have done all week.',
      'The turtle blinks at you, slow and kind. For a moment, everything is quiet.',
    ];
    await g.say(lines[(st.turtleN = (st.turtleN || 0) + 1) % lines.length]);
  },
  /* a ghoul grabs at Enya's echo out in the world, and NOVA's FIRE TIGER RING sees it off */
  async enyaRescue(g, w) {
    const st = g.state, pet = st.pet;
    let en = w.entity('enya');
    if (!en) return;
    if (st.riding) { st.riding = false; w.buildFollowers(); w.updateMusic(); en = w.entity('enya'); }   // NOVA leaps down
    const pe = w.entity('pet'), p = w.player;
    // a ghoul seeps up out of the ground, right behind her
    const dx = Math.sign(en.x - p.x), dy = Math.sign(en.y - p.y);
    const gn = w.addNpc({ id: 'rescueGhoul', art: 'ghoul', x: en.x + dx, y: en.y + dy + (dx || dy ? 0 : 1), big: true, ghost: true, alpha: 0 });
    sfx.cry('ghoul');
    for (let i = 0; i <= 20; i++) { gn.alpha = i / 24; await g.wait(1); }
    delete gn.alpha;
    w.emote('enya', '!'); g.shake(10, 2);
    const first = !st.flags.rescued;
    await g.say(first ? "Oi! Get OFF! It's got the tiger by the paws!" : ['Not again! Get away from me!', 'Ugh, these things! NOVA?', 'A little help here?!'][Math.floor(Math.random() * 3)], { name: E });
    if (first) await g.say("Shadowy tendrils wrap round the EMERALD TIGER's legs. ENYA is stuck!");
    if (pe) { pe.hopT = pe.hopMax = 14; pe.hopH = 6; w.emote('pet', '!'); }
    sfx.roar(); g.shake(16, 2);
    await w.fireRing((pe || p).px + 8, (pe || p).py + 10, 44);
    if (first) await g.say(`${pet.name} roars! A RING OF FIRE pulses out around him, stretching wider and wider... and swallows the GHOUL whole!`);
    sfx.shatter();
    for (let i = 0; i < 16; i++) { const a = Math.random() * Math.PI * 2, s = 0.5 + Math.random() * 1.4; w.particles.push({ x: gn.px + 16, y: gn.py, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.6, life: 40, age: 0, kind: 'puff', col: i % 2 ? '#2a1640' : '#6a3aa8' }); }
    w.removeNpc('rescueGhoul');
    w.tigerHearts(5); sfx.purr();
    await g.say(first ? `...Wow. Good lad, ${pet.name}! Thank you.` : ['My hero! Well, one of them.', `Nice one, ${pet.name}!`, 'Ha! Burnt to a crisp. Thanks, handsome.'][Math.floor(Math.random() * 3)], { name: E });
    st.flags.rescued = true;
  },
  /* grey, dead vines across the way between the Whisperwood and the Withered Deep */
  async vines(g) {
    await g.say('Grey, dead vines choke the path. They crumble at a touch... then creep right back. Something beyond them is drinking the life out of the jungle.');
  },

  /* ---------- CODY, the wise (and cheeky) white cat ---------- */
  async cody(g, w, n) {
    const id = w.map.id;
    if (id === 'wilds') return SCRIPTS.codyWilds(g, w, n);
    if (id === 'jungle') return SCRIPTS.codyWood(g, w, n);
    if (id === 'groove') return SCRIPTS.codyJam(g, w, n);
    if (id === 'lagoon') {
      if (g.state.flags['cody-shades']) await cody(g, ['These shades make everything look cooler. Even you.', 'Frost-glass. They never melt. A bit like me.', 'Go on. Tell me I look magnificent.'][Math.floor(Math.random() * 3)]);
      else await cody(g, 'Shh. I am working on him. He WILL crack. Every Dragon King has his price.');
      return;
    }
    await cody(g, 'Mrrrow?');
  },
  /* the first time you meet him, wherever that is */
  async codyIntro(g, w, n) {
    const st = g.state, pet = st.pet;
    st.flags['met-cody'] = true;
    await cody(g, 'Mrrrow? ...A star traveller. With a bump on his head the size of a MOON MELON.');
    await think(g, '...Did that cat just talk?');
    await cody(g, 'That cat has a name, kid. CODY. Wise, handsome, and only eight hundred and twelve years old.');
    await cody(g, 'Give or take. You stop counting after the first few centuries.');
    if (pet.species === 'tiger') await cody(g, "And who's this? A tiger cub! Fire in his belly, and he doesn't even know it yet. Heh.");
    else await cody(g, `Nice friend you've got there. ${pet.name}, is it? Good name.`);
  },
  /* the Crimson Wilds: fast asleep, standing up */
  async codyWilds(g, w, n) {
    const st = g.state;
    playMusic('cody');
    if (n.sleep) {
      await g.say('A white cat is fast asleep... standing up on its back legs, leaning on a wooden staff. It is snoring.');
      sfx.snore();
      await g.say('You give the cat a gentle poke.');
      n.sleep = false; w.emote('cody', '!'); sfx.meow();
      const p = w.player; n.dir = p.x < n.x ? 'left' : p.x > n.x ? 'right' : p.y < n.y ? 'up' : 'down';
    }
    if (!st.flags['met-cody']) await SCRIPTS.codyIntro(g, w, n);
    await cody(g, "You look like you've lost something. Bits of your ship? Bits of your memory? Bits of your heart, maybe?");
    await think(g, '...All three, I think.');
    await cody(g, "Ha! Honest. I like that. Here: GOLDEN CATNIP, from my secret stash. Don't tell anyone.");
    await giveCatnip(g);
    await cody(g, 'Right. Nap time, somewhere quieter. Staff... small!');
    await staffSmall(g, w, n);
    await g.say('The staff shrinks... and shrinks... until it is no bigger than an earbud. CODY pops it into his ear.');
    await think(g, '...He just put his staff in his ear.');
    await cody(g, 'Best place for it. It weighs seven thousand kilos, you know. Try carrying THAT in your pocket.');
    await cody(g, 'See you around, kid. I get about.');
    await codyPoof(g, w, n);
    st.flags['cody-wilds'] = true;
    w.updateMusic();
    g.save();
  },
  /* the Whisperwood: he teaches NOVA the FIRE TIGER RING */
  async codyWood(g, w, n) {
    const st = g.state, pet = st.pet;
    playMusic('cody');
    if (!st.flags['met-cody']) await SCRIPTS.codyIntro(g, w, n);
    else await cody(g, "Oh, it's you again. The kid with the bump. Still mumbling about 'Em'?");
    await cody(g, "I remember everything, you know. Except where I left my sunglasses. Never had any, come to think of it. Shame. I'd look GREAT in sunglasses.");
    if (pet.species === 'tiger') {
      await cody(g, `Now then, ${pet.name}. Let's see that fire of yours. Staff... BIG!`);
      await staffBig(g, w, n);
      await cody(g, "A tiger's fire isn't in his claws, cub. It's in here.");
      await g.say(`CODY taps ${pet.name} on the chest with the end of his staff. ${pet.name} takes a deep, deep breath...`);
      await cody(g, '...and let it go. ALL the way round you!');
      const pe = w.entity('pet') || w.player;
      sfx.roar(); g.shake(14, 2);
      await w.fireRing(pe.px + 8, pe.py + 10, 54);
      await g.say(`A RING OF FIRE pulses out around ${pet.name}, stretching wider and wider, crackling through the ferns!`);
      if (!pet.taught.includes('firering')) pet.taught.push('firering');
      if (!pet.moves.includes('firering')) pet.moves.push('firering');
      sfx.levelup();
      await g.say(`${pet.name} learned FIRE TIGER RING! (${MOVES.firering.desc})`);
      await cody(g, 'Not bad for a cub. Use it to protect the ones you love, eh?');
      if (enyaWith(st)) {
        await cody(g, '...Like that echo of a girl riding round behind you.');
        await g.say('Oi! I can look after myself, thanks very much.', { name: E });
        await cody(g, "Course you can. But it's nice not to have to, sometimes.");
        await g.say('...Fair point, cat.', { name: E });
      }
      await staffBack(g, w, n);
    } else {
      await cody(g, `${pet.name}'s fire is a different sort from mine. Here: have a GOLDEN CATNIP instead. Works on everyone.`);
      await giveCatnip(g);
    }
    await cody(g, 'Right, I am off. Staff... FLY!');
    await codyFly(g, w, n);
    await g.say('CODY zooms up into the treetops on his staff. "WHEEEEEE!"');
    st.flags['cody-wood'] = true;
    w.updateMusic();
    g.save();
  },
  /* the Jelly Jam: he's seen DJ JIGGLE's shades, and now he wants some */
  async codyJam(g, w, n) {
    const st = g.state;
    if (!st.flags['met-cody']) await SCRIPTS.codyIntro(g, w, n);
    else await cody(g, 'Oh, hello again! Lovely party. The bass makes my staff hum in my ear. Bzzzzm.');
    await cody(g, "See DJ JIGGLE's shades? THAT is what I need. A pair of smart, cool cat SUNGLASSES.");
    await cody(g, 'The DRAGON KING out at the JADE LAGOON owes me a favour. Well, I owe him a staff. Same thing, really.');
    await cody(g, "Here: a GOLDEN CATNIP. For dancing. Or for not dancing. I'm not judging.");
    await giveCatnip(g);
    await cody(g, "If you're ever out east at the JADE LAGOON, pop in. I'll be the one in sunglasses.");
    await codyPoof(g, w, n);
    st.flags['cody-jam'] = true;
    g.save();
  },

  /* ================= Chapter 2: the COMET's short hops ================= */
  async ch2Start(g, w) {
    const st = g.state;
    st.flags.ch2 = true;
    await g.say("The COMET's scanner gives a happy PING! Three faint signals blink on its screen, far across KIRRA.");
    await g.say('SIGNALS FOUND: 3. NEAREST: A SWAMP TO THE SOUTH. THE VENOM MIRE.', { name: 'COMET' });
    await g.say('SECOND SIGNAL: FAR TO THE EAST, BY A LAGOON. THIRD SIGNAL: ...MOVING. SOMETHING HAS SWALLOWED IT.', { name: 'COMET' });
    await hero(g, 'Short hops will do. One part at a time.');
    await hero(g, "Hold on, Em. I'm coming.");
    st.goal = 'Hop to the VENOM MIRE in the COMET and find the WARP COIL.';
    g.save();
  },
  /* the COMET's menu: hop somewhere, or rest on board */
  async hop(g, w) {
    const st = g.state, here = w.map.id;
    const dests = Object.keys(HOPS).filter((k) => k !== here && (!HOPS[k].open || HOPS[k].open(st)));
    const i = await g.menu(dests.map((k) => HOPS[k].name).concat(['REST ON BOARD', 'STAY HERE']), { x: 20, y: 20, w: 120, title: 'THE COMET' });
    if (i < 0 || i === dests.length + 1) return;
    if (i === dests.length) {
      w.heal(); sfx.heal(); w.setRespawn();
      await g.say(`You and ${st.pet.name} rest in the COMET's cosy little cabin. (HP and EN fully restored!)`);
      g.save();
      return;
    }
    const to = dests[i], d = HOPS[to];
    // the first hop brings a dream of a summer long ago; the first hop to the lagoon, a dream of the war
    const dream = !st.flags['dream-summer'] ? 'summer' : to === 'lagoon' && !st.flags['dream-war'] ? 'war' : null;
    sfx.beam();
    await g.fade(1, 14);
    const flight = new Promise((r) => g.push(new Flight(g, d.name, r, { end: dream ? '#ffffff' : '#000000' })));
    g.fade(0, 10);
    await flight;
    if (dream) {
      st.flags['dream-' + dream] = true;
      await new Promise((r) => g.push(new Dream(g, dream, r)));
    }
    w.load(to, d.tx, d.ty, d.dir);
    w.setRespawn();
    g.save();
    await g.fade(0, 18);
    if (dream) await g.say('...You wake with a jolt as the COMET bumps down. The dream fades, but the warm feeling stays.');
    if (to === 'mire' && !st.flags['mire-intro']) await SCRIPTS.mireIntro(g, w);
    if (to === 'lagoon' && !st.flags['lagoon-intro']) await SCRIPTS.lagoonIntro(g, w);
    w.updateMusic();
  },

  /* ---------- the Venom Mire ---------- */
  async mireIntro(g, w) {
    const st = g.state, pet = st.pet;
    st.flags['mire-intro'] = true;
    await g.say('THE VENOM MIRE. Dead trees drip with moss, and rivers of thick yellow-green ooze bubble and gloop between them.');
    await g.say('It smells like a thousand old socks. Something hisses, somewhere in the reeds.');
    if (pet.species === 'tiger') await g.say(`${pet.name} wrinkles his nose and sneezes.`);
    await hero(g, "The WARP COIL's signal is coming from the east. Right across the ooze, by the looks of it.");
    await g.say('TIP: snakes hide in the reeds. Their bites can POISON your companion: it stings at the end of every round until it wears off.');
    st.goal = 'Find the WARP COIL: its signal is across the big river of ooze, to the east.';
    g.save();
  },
  /* the old bridge is out, so Cody's staff becomes the bridge */
  async mireGap(g, w) {
    const st = g.state;
    await g.say('The old plank bridge stops dead in the middle. The planks have fallen in, and the ooze below gurgles hungrily.');
    playMusic('cody');
    const c = codyArrives(w, { bare: true });
    await g.say('A white blur drops out of the dead trees, in a puff of fur!');
    if (!st.flags['met-cody']) await SCRIPTS.codyIntro(g, w, c);
    else await cody(g, 'Fancy meeting you here. Mind the ooze, kid. It stains.');
    await cody(g, 'Bridge out, is it? Stand back. Staff... EXTEND!');
    // out of his ear, and right across the gap
    sfx.grow();
    const y = 15 * 16 + 6;
    w.staff = { x0: 28 * 16 + 12, y0: y, x1: 28 * 16 + 12, y1: y, thick: 3 };
    await w.morphStaff({ x0: 28 * 16 + 12, y0: y, x1: 31 * 16 + 4, y1: y, thick: 3 }, 30);
    sfx.thoom(); g.shake(18, 3);
    st.flags['staff-bridge'] = true;
    w.refresh();
    w.staff = null;
    await g.say('THOOM! The staff crashes down across the gap so hard that every plank in the Mire rattles.');
    await cody(g, "Go on, it won't bend. Seven thousand kilos, that staff. Mind the ooze... and whatever lives in it.");
    st.goal = "Cross the ooze on CODY's staff and find the WARP COIL.";
    w.updateMusic();
    g.save();
  },
  async snake1(g, w) {
    await g.say('Halfway across the planks, the ooze beside you bulges... and something comes slithering up out of it!');
    sfx.hiss();
    if ((await w.battle({ species: 'hissling', lv: 10 })) !== 'win') return;
    g.state.flags['snake-1'] = true;
    await g.say('The HISSLING slithers back down into the ooze. Bloop.');
  },
  async snake2(g, w) {
    await g.say("Right over the deepest ooze, on CODY's staff, a SPITVIPER rears up in front of you, hood flared!");
    await cody(g, "Don't look down! ...Or do. I'm not your mum.");
    sfx.hiss(0.8);
    if ((await w.battle({ species: 'spitviper', lv: 11 })) !== 'win') return;
    g.state.flags['snake-2'] = true;
    await g.say('The SPITVIPER sulks off into the ooze, spitting at nothing.');
  },
  async oozefangTalk(g, w) { return SCRIPTS.oozefang(g, w); },
  /* the giant serpent on the far bank, with the WARP COIL round its middle */
  async oozefang(g, w) {
    const st = g.state;
    if (st.flags['oozefang-beaten']) return;
    w.emote('oozefang', '!'); sfx.cry('oozefang'); g.shake(20, 3);
    await g.say('The far bank heaves. A GIANT serpent rears up out of the ooze, dripping, its eyes burning red...');
    await g.say('...and wound round its middle like a belt: the WARP COIL!');
    st.furyT = Math.max(st.furyT || 0, 600);
    await hero(g, "That's my WARP COIL. Give it back, you overgrown worm!");
    if ((await w.battle({ species: 'oozefang', lv: 12, bg: 'mire' })) !== 'win') return;
    st.flags['oozefang-beaten'] = true;
    w.removeNpc('oozefang');
    await g.say('OOZEFANG thrashes, shrinks... and slithers away into the ooze, coughing up the WARP COIL!');
    st.parts.warpcoil = true; sfx.part(); g.flash('#ffffff', 10);
    w.sparkle(w.player.px + 8, w.player.py, 14);
    await g.say(`You got the WARP COIL! (${ch2Count(st)} of 3)`);
    // Cody fishes the old planks out of the ooze, mends the bridge, and puts his staff away
    playMusic('cody');
    const c = w.npc('cody');
    await cody(g, 'Bravo! Now, I will be wanting my staff back. But first, let us mend your bridge properly. Staff... FISH!');
    if (c) {
      const y = 15 * 16 + 6;
      w.staff = { x0: 28 * 16 + 12, y0: y, x1: 31 * 16 + 4, y1: y, thick: 3 };
      st.flags['bridge-fixed'] = true;
      w.refresh();
      for (let i = 0; i < 2; i++) { sfx.boing(); w.sparkle((29 + i) * 16 + 8, 15 * 16 + 8, 8, ['#c8b080', '#fff6a0']); await g.wait(14); }
      await w.morphStaff({ ...ear(c), thick: 3 }, 30);
      sfx.shrink();
      w.staff = null;
      w.sparkle(c.px + 10, c.py - 2, 6, ['#ffd23a', '#fff6a0']);
      await g.say("The staff fishes the old planks out of the ooze and slots them back in, neat as you like. Then it shrinks to the size of an earbud and zips into CODY's ear.");
      await codyPoof(g, w, c);
    }
    const c2 = codyArrives(w, { bare: true });
    await cody(g, 'Took the shortcut.');
    await cody(g, 'Here: a GOLDEN CATNIP, for being brave. Or daft. Same thing, mostly.');
    await giveCatnip(g);
    await cody(g, 'Now, if you will excuse me, I am off to the JADE LAGOON. The DRAGON KING has a whole palace full of treasure...');
    await cody(g, "...and I have my heart set on a pair of smart, cool cat SUNGLASSES. Purrr.");
    await hero(g, "Isn't the Dragon King the one you nicked that staff from?");
    await cody(g, 'BORROWED. ...See you there, kid! Staff... FLY!');
    if (c2) await codyFly(g, w, c2);
    st.flags['mire-done'] = true;
    st.goal = 'Back to the COMET (west of the Mire) and hop to the JADE LAGOON. The STAR CORE is there... and so is CODY.';
    w.updateMusic();
    g.save();
  },

  /* ---------- the Jade Lagoon ---------- */
  async lagoonIntro(g, w) {
    const st = g.state;
    st.flags['lagoon-intro'] = true;
    await g.say('THE JADE LAGOON. Water as clear as glass, white sand, and out on an island a palace of red lacquer and jade.');
    await g.say("Somewhere inside, a very loud, very cross voice is shouting about a CAT.");
    st.goal = "Cross the red bridge to the DRAGON KING's palace. The STAR CORE's signal is coming from inside.";
    g.save();
  },
  async crab(g) {
    const st = g.state, CG = 'CRAB GUARD';
    if (st.flags['king-beaten']) { await g.say('The KING says you may come and go as you please. Most unusual! Snip snip!', { name: CG }); return; }
    await g.say('HALT! Who goes there? ...A star traveller, with a tiger? Hmm. In you go, then. Snip snip.', { name: CG });
    await g.say('But mind your manners. The DRAGON KING is in a VERY bad mood. Some cat has been pestering him all morning.', { name: CG });
    await g.say('And whatever you do, do NOT mention the pillar.', { name: CG });
  },
  async crab2(g) {
    const st = g.state, CC = 'CRAB CAPTAIN';
    if (st.flags.gong) { await g.say('THREE Dragon Kings in one day! Well, two. My claws are shaking!', { name: CC }); return; }
    await g.say("I'm the CRAB CAPTAIN. Well, I'm a crab. Captain is more of a hobby.", { name: CC });
    await g.say("The KING's pillar was the biggest in the whole lagoon, you know. Then a CAT borrowed it. Sore subject.", { name: CC });
  },
  /* the courtyard: Cody, the Dragon King, and your STAR CORE on a heap of gold */
  async palace(g, w) {
    const st = g.state;
    st.flags['palace-scene'] = true;
    const c = w.npc('cody');
    w.camShift.y = -28;
    sfx.cry('dragonKing'); g.shake(14, 2);
    await g.say('FOR THE LAST TIME, CAT: NO! SUNGLASSES!', { name: K });
    await cody(g, "Not even a little pair? Cat-sized. Gold rims. I'm not fussy.");
    await g.say('You STOLE my PILLAR! The great iron pillar that measured the depths of the COSMIC SEA!', { name: K });
    await cody(g, 'Borrowed. And I made it ever so much more useful. It fits in my ear now. Look! Staff... BIG!');
    if (c) await staffBig(g, w, c);
    sfx.cry('dragonKing'); g.shake(22, 3);
    await g.say('GRRRAAAAAAH!', { name: K });
    if (c) { await cody(g, '...Small!'); await staffSmall(g, w, c); }
    w.emote('king', '!');
    await g.say('And who is THIS? Another thief, come to rob a poor old Dragon King?', { name: K });
    await g.say('Behind the throne, on a heap of gold, something glows soft white and blue... your STAR CORE!');
    await hero(g, "That's part of my ship. The STAR CORE. I need it to... to find someone.");
    await g.say('That? That is my new PEARL. It fell out of the sky, and it glows all night long. MINE.', { name: K });
    await g.say('...But I do love a contest. Best me in battle, star traveller, and the pearl is yours.', { name: K });
    await SCRIPTS.kingFight(g, w);
    w.camShift.y = 0;
  },
  async king(g, w) {
    const st = g.state;
    if (!st.flags['king-beaten']) { await g.say('Well? Will you fight me for the pearl, or not?', { name: K }); return SCRIPTS.kingFight(g, w); }
    if (!st.flags['deep-healed']) await g.say('My poor brother... Help him, star traveller. I would go myself, but my old bones creak so.', { name: K });
    else await g.say('My brothers are safe, and that CAT has gone. My lagoon is quiet again. ...I almost miss him. ALMOST.', { name: K });
  },
  async kingFight(g, w) {
    const st = g.state, pet = st.pet;
    if ((await g.ask('Fight the DRAGON KING?')) !== 0) { await g.say('Hmph. Come back when your little friend has grown some teeth.', { name: K }); return; }
    if ((await w.battle({ species: 'dragonKing', lv: 14, music: 'dragon', bg: 'lagoon' })) !== 'win') return;
    st.flags['king-beaten'] = true;
    w.refresh();
    await g.say('Hmph! Well fought, star traveller. A deal is a deal.', { name: K });
    st.parts.starcore = true; sfx.part(); g.flash('#ffffff', 12);
    await g.say(`The DRAGON KING hands over his "pearl". You got the STAR CORE! (${ch2Count(st)} of 3)`);
    await g.say('Mind you, I have reigned over this lagoon for three thousand years. A pearl comes, a pearl goes.', { name: K });
    await hero(g, "Three thousand years... I can't even tell you how many years the war took from me.");
    // Cody, and the sunglasses
    playMusic('cody');
    await cody(g, 'Wonderful! Lovely! So. About those sunglasses...');
    await g.say('AAARGH! FINE! FINE! Anything to be rid of you!', { name: K });
    await g.say('My brothers owe me favours. The Dragon Kings of the north and the south. One of them will have your... SUNGLASSES.', { name: K });
    const gong = w.props.find((q) => q.id === 'gong');
    sfx.gong(); g.shake(36, 2); g.flash('#ffd23a', 10);
    if (gong) for (let i = 0; i < 4; i++) w.particles.push({ x: gong.x * 16 + 16, y: gong.y * 16 - 14, vx: 0, vy: 0, life: 70, age: -i * 12, kind: 'glowring' });
    await g.say('BWONNNNNG! The great gong booms out across the lagoon, across the sea, across the whole sky...');
    st.flags.gong = true;
    // the White Dragon swoops down out of the clouds
    const wd = w.addNpc({ id: 'white', art: 'whiteDragon', x: 28, y: 8, dir: 'left', big: true, talk: 'white', dy: -170 });
    sfx.cry('whiteDragon');
    for (let i = 0; i <= 60; i++) { wd.dy = -170 * Math.pow(1 - i / 60, 2); if (i % 3 === 0) w.particles.push({ x: wd.px + 16 + (Math.random() * 30 - 15), y: wd.py + wd.dy - 10, vx: 0, vy: 0.3, life: 30, age: 0, kind: 'frost' }); await g.wait(1); }
    wd.dy = 0; g.shake(10, 2);
    await g.say('A WHITE DRAGON swoops down out of the clouds in a swirl of glittering frost!');
    await g.say('You rang, brother? I came as fast as the wind would carry me.', { name: WD });
    await g.say('Where is our brother, the BLACK DRAGON? He never misses a summons.', { name: K });
    await g.say('...He will not come. He has gone into the deep jungle beyond the WHISPERWOOD, and he is drinking its life.', { name: WD });
    await g.say('The trees are turning grey. The birds have stopped singing. Something dark from beyond the VEIL has got into him.', { name: WD });
    await hero(g, 'Beyond the veil... the GHOULS.');
    await g.say('He even swallowed a sail of star-metal that fell out of the sky. He wears it like a cloak, and drinks its light.', { name: WD });
    await hero(g, 'A sail... the SOLAR SAIL! The last part of my ship!');
    await cody(g, 'Ahem. Before all the doom and gloom: SUNGLASSES?');
    await g.say('...Sunglasses? Oh! You mean these?', { name: WD });
    await g.say('The WHITE DRAGON hands CODY a pair of shades carved from the ice at the top of the world. They will never melt.');
    st.flags['cody-shades'] = true; sfx.jewel('diamond');
    const c = w.npc('cody');
    if (c) w.sparkle(c.px + 8, c.py, 12, ['#ffffff', '#8fd0ff', '#ffd23a']);
    await cody(g, '...Purr-fect.');
    await cody(g, 'Well? How do I look?');
    if (pet.species === 'tiger') await g.say(`${pet.name} tilts his head. He has never seen anything so cool in his whole life.`);
    await hero(g, 'Very cool, Cody.');
    await cody(g, 'I KNOW.');
    await g.say('Star traveller. Will you help me save my brother, and the jungle with him? Climb on my back. I will fly you there.', { name: WD });
    await SCRIPTS.whiteOffer(g, w);
  },
  async gong(g) {
    if (g.state.flags.gong) await g.say('The great bronze gong still hums, very softly, if you put your ear close.');
    else await g.say('A great bronze gong in a red frame. You had better not touch it: the crab guards are watching.');
  },
  async treasure(g, w) {
    const st = g.state;
    if (st.flags['king-beaten']) { await g.say('A heap of gold and jewels. The DRAGON KING counts it every night, twice.'); return; }
    await g.say('A heap of gold and jewels. On top, glowing soft white and blue: your STAR CORE!');
    if (st.flags['palace-scene']) await g.say('Paws OFF my pearl!', { name: K });
  },
  async white(g, w) {
    if (g.state.flags['deep-visited']) { await g.say('My brother needs you. The jungle needs you. Hurry, star traveller!', { name: WD }); return SCRIPTS.whiteOffer(g, w); }
    await g.say('Are you ready? The jungle has not long left.', { name: WD });
    return SCRIPTS.whiteOffer(g, w);
  },
  /* the White Dragon flies you to the Withered Deep */
  async whiteOffer(g, w) {
    const st = g.state;
    if ((await g.ask('Fly to the WITHERED DEEP?', ['FLY!', 'NOT YET'])) !== 0) {
      await g.say('Then rest and ready yourself. I will wait for you here. But please, do not be long.', { name: WD });
      st.goal = 'Talk to the WHITE DRAGON in the palace when you are ready to fly to the WITHERED DEEP.';
      g.save();
      return;
    }
    if (!st.flags['cody-lagoon-gone']) await cody(g, "You go on. I'll catch you up. I just want to admire myself in the lagoon for a bit.");
    st.flags['cody-lagoon-gone'] = true;
    st.flags['deep-visited'] = true;
    await g.fade(1, 14);
    const flight = new Promise((r) => g.push(new Flight(g, 'THE WITHERED DEEP', r, { dragon: true })));
    g.fade(0, 10);
    await flight;
    w.load('deep', 4, 13, 'right');
    w.setRespawn();
    g.save();
    await g.fade(0, 18);
    if (!st.flags['deep-intro']) await SCRIPTS.deepIntro(g, w);
  },

  /* ---------- the Withered Deep ---------- */
  async deepIntro(g, w) {
    const st = g.state, pet = st.pet;
    st.flags['deep-intro'] = true;
    st.flags['deep-visited'] = true;
    await g.say('THE WITHERED DEEP. The jungle here is grey and silent. No birds. No wind. The leaves crumble to dust when you touch them.');
    await g.say("...It's so quiet. Like the house was, after the war...", { name: st.name, mutter: true });
    w.daze = 140; sfx.heartbeat(); g.flash('#2a2a32', 30);
    await g.say("Your father's chair by the fire. Empty. The clock ticking in the hall. You never got to say goodbye.");
    await remember(g, 'chair');
    const pe = w.tigerEntity() || w.entity('pet') || w.player;
    if (pet.species === 'tiger') { w.hearts(pe.px + 8, pe.py - 4, 4); sfx.purr(); }
    await g.say({
      tiger: `${pet.name} presses his big head into your hand and purrs, very softly. The quiet doesn't feel so heavy any more.`,
      dragon: `${pet.name} curls round your legs, warm as a little stove. The quiet doesn't feel so heavy any more.`,
      octo: `${pet.name} wraps a cool, glowing tentacle round your hand. The quiet doesn't feel so heavy any more.`,
    }[pet.species]);
    await hero(g, `...Thanks, ${pet.name}. Come on. Let's bring some noise back to this place.`);
    await g.say("My brother's lair is at the heart of the Deep, over the grey stream to the east. I will stay here and keep the way back open.", { name: WD });
    await g.say('If you are hurt, come back to me. My frost will soothe you.', { name: WD });
    st.goal = "Find the BLACK DRAGON's lair, over the grey stream to the east.";
    w.setRespawn();
    g.save();
  },
  async whiteDeep(g, w) {
    const st = g.state;
    w.heal(); sfx.heal(); w.setRespawn();
    w.sparkle(w.player.px + 8, w.player.py, 12, ['#ffffff', '#c8f4ff', '#8fd8ff']);
    if (st.flags['deep-healed']) await g.say('Listen to that: birdsong! Thank you, star traveller. (The WHITE DRAGON breathes a cool frost over you: HP and EN fully restored!)', { name: WD });
    else await g.say('The WHITE DRAGON breathes a soft, cool frost over you. (HP and EN fully restored!)');
    g.save();
  },
  async blackTalk(g, w) {
    if (g.state.flags['black-beaten']) { await g.say('The jungle sings again. I had forgotten how lovely it sounds. Thank you, little star.', { name: BD }); return; }
    return SCRIPTS.blackScene(g, w);
  },
  /* the Black Dragon, coiled round the great dead tree, drinking the jungle's life */
  async blackScene(g, w) {
    const st = g.state;
    if (st.flags['black-beaten']) return;
    w.camShift.y = -24;
    w.emote('black', '!'); sfx.cry('blackDragon'); g.shake(24, 3);
    await g.say('Coiled round the great dead tree is a BLACK DRAGON, wrapped in a shimmering sail of star-metal like a cloak.');
    await g.say('MORE... light... MORE...', { name: BD });
    await g.say('His eyes burn violet, just like the GHOULS beyond the veil.');
    await g.say('Little star... you shine so brightly... GIVE IT TO ME!', { name: BD });
    st.furyT = 2400; sfx.fury(); g.flash('#3ad07e', 14);
    await g.say('Your eyes blaze green. Whatever has got into him came from the same dark place that took ENYA.');
    codyArrives(w, { bare: true });
    await cody(g, 'Thought you could use a hand. And a staff. And some STYLE.');
    await cody(g, 'Shall we?');
    const res = await w.battle({ species: 'blackDragon', lv: 16, cody: true, music: 'dragon', bg: 'withered', fury: 30 });
    if (res !== 'win') { w.camShift.y = 0; return; }
    st.flags['black-beaten'] = true;
    const b = w.npc('black'), p = w.player;
    // the shadow pours out of him, back towards the veil
    sfx.rift(); g.flash('#2a0a4a', 30);
    for (let i = 0; i < 50; i++) { if (b) w.particles.push({ x: b.px + 16 + (Math.random() * 30 - 15), y: b.py - 10 + Math.random() * 10, vx: Math.random() * 0.6 - 0.3, vy: -0.6 - Math.random(), life: 60, age: 0, kind: 'puff', col: i % 2 ? '#2a1640' : '#6a3aa8' }); await g.wait(1); }
    if (b) b.art = 'blackDragonCalm';
    await g.say('A cloud of shadow pours out of the BLACK DRAGON and streams away through the trees, back towards the VEIL.');
    await g.say('His eyes clear to a warm, dark gold.');
    await g.say('...What... what have I done? The jungle... all that life...', { name: BD });
    const wd = w.addNpc({ id: 'whiteLair', art: 'whiteDragon', x: 26, y: 12, dir: 'right', big: true, flip: true, dy: -150 });
    sfx.cry('whiteDragon');
    for (let i = 0; i <= 50; i++) { wd.dy = -150 * Math.pow(1 - i / 50, 2); await g.wait(1); }
    wd.dy = 0;
    await g.say('BROTHER!', { name: WD });
    await g.say('It whispered to me from beyond the VEIL. It was so HUNGRY. I could not stop...', { name: BD });
    await g.say('The SOLAR SAIL slides from his back, and all the light he drank pours out of it at once...');
    // the colour floods back
    sfx.flash(); g.flash('#ffffff', 50); g.shake(24, 2);
    st.flags['deep-healed'] = true;
    w.refresh();
    w.updateMusic();
    for (let i = 0; i < 30; i++) w.sparkle(w.camX + Math.random() * 160, w.camY + Math.random() * 120, 1, ['#5fe07a', '#ff9ad8', '#ffd23a', '#8ff0ff']);
    await g.wait(40);
    w.banner = { str: w.mapName().toUpperCase(), t: 0 };
    await g.say('Colour floods back into the jungle! Leaves unfurl, flowers burst open, the stream runs clear and green...');
    sfx.chirp();
    for (let i = 0; i < 3; i++) w.particles.push({ x: w.camX - 10 - i * 10, y: w.camY + 20 + i * 6, vx: 0.8, vy: -0.03, life: 260, age: 0, kind: 'bird', seed: i * 7 });
    await g.say('...and somewhere, a bird begins to sing.');
    // birdsong: you whistle her tune, and a bird whistles it right back
    await g.say('Without even thinking, you whistle her little tune.');
    sfx.whistle(); w.notes(p, 4);
    await g.wait(110);
    sfx.chirp(); await g.wait(12); sfx.chirp();
    await g.say('A bird whistles it right back to you, note for note.');
    await g.say('...After the war, the birds were the only thing that helped. Sitting so still in the garden while they came back, one by one...', { name: st.name, mutter: true });
    await remember(g, 'birdsong');
    st.parts.solarsail = true; sfx.part(); g.flash('#ffffff', 10);
    await g.say(`You got the SOLAR SAIL! (${ch2Count(st)} of 3)`);
    await g.say('Thank you, little star. And forgive me. When you face whatever hides beyond the VEIL, call the DRAGON KINGS. We will come.', { name: BD });
    // Cody says goodbye
    const c = w.npc('cody');
    await cody(g, "Well. That was fun. Don't I look marvellous in the sunlight?");
    await cody(g, "One more GOLDEN CATNIP, kid. You've earned it.");
    await giveCatnip(g);
    await hero(g, "Cody... the war took so many years from me. I don't even know how many.");
    await cody(g, "Time's not robbed, kid. It's only borrowed for a while, by the wrong people. You'll get it back. Every minute. Usually when you least expect it.");
    await cody(g, 'Now go and find that girl of yours. Staff... FLY!');
    if (c) await codyFly(g, w, c);
    await g.say('My brother is himself again, and the jungle sings. Let me fly you home, you and your little ship. It is the least I can do.', { name: WD });
    w.camShift.y = 0;
    await SCRIPTS.ending2(g, w);
  },

  /* ---------- the end of Chapter 2: all six parts, and her light, brighter than ever ---------- */
  async ending2(g, w) {
    const st = g.state, pet = st.pet;
    await g.fade(1, 16);
    const flight = new Promise((r) => g.push(new Flight(g, 'BLOOMHAVEN', r, { dragon: true, comet: true })));
    g.fade(0, 10);
    await flight;
    w.load('bloomhaven', 4, 5, 'down');
    w.place('sprig', 6, 5, 'left');
    w.setRespawn();
    await g.fade(0, 20);
    playMusic('chapter');
    await g.say('The WHITE DRAGON sets you down in BLOOMHAVEN, the COMET held gently in its claws, then bows and flies off into the clouds.');
    await g.say('Beep! Boop! You found them ALL! Bzzt!', { name: S });
    await g.say('WARP COIL: installed. STAR CORE: installed. SOLAR SAIL: installed. ALL SIX PARTS!', { name: S });
    sfx.beam(); g.flash('#ffffff', 24); g.shake(30, 2);
    w.sparkle(4 * 16 + 24, 3 * 16 + 8, 24);
    await g.wait(40);
    await g.say('The COMET roars to life! It lifts off the ground and hovers there, humming, its hull shining like new.');
    await g.say('It can fly anywhere now. Anywhere at all. Maybe even... through the VEIL itself!', { name: S });
    await g.say("In your pocket, the tiny spark of diamond light ENYA left you begins to glow. Warm. Brighter than ever.");
    playMusic('dream');
    sfx.flash(); g.flash('#c8f4ff', 20);
    await g.say("...You're getting closer. I can feel it. The GEM's light reaches a little further every day.", { name: E });
    await g.say("Do you remember the tennis ball? On Mr Nolan's roof?", { name: E });
    await hero(g, '...Every single time. He never once gave it back.');
    await g.say("Ha! ...And that little tune you're always whistling? It's mine, you know. I used to hum it on the walk home.", { name: E });
    await hero(g, 'I know. I remember now.');
    await g.say('Then come and find me. The real me. And bring that tune.', { name: E });
    if (pet.species === 'tiger') { const pe = w.tigerEntity() || w.player; w.hearts(pe.px + 8, pe.py - 4, 6); sfx.purr(); }
    await hero(g, "I'm coming, Em. Hold on. Not long now.");
    st.flags.chapter2 = true;
    st.goal = 'Chapter 2 complete! The COMET is whole again. Next: through the VEIL, to find the real ENYA... Chapter 3 is on its way.';
    g.save();
    await new Promise((resolve) => g.push(new Ending(g, resolve, 2)));
    w.updateMusic();
  },

  /* when your companion is worn out: you black out, and wake back at the last safe place */
  async revive(g, w) {
    const pet = g.state.pet;
    await g.say('Everything goes dark...');
    if (pet.species === 'tiger') { const e = w.entity('pet') || w.player; w.hearts(e.px + 8, e.py - 4, 5); sfx.lick(); }
    await g.say({
      tiger: `Something warm and rough is licking your face. ${pet.name}! Tiger saliva has powerful healing properties. You both feel much better.`,
      dragon: `${pet.name} is curled round you like a warm, scaly blanket. You both feel much better.`,
      octo: `${pet.name}'s soft glow eases the ache in your head. You both feel much better.`,
    }[pet.species]);
  },

  /* ---------- the end of Chapter 1: the COMET flies, and the ghouls pull Enya back ---------- */
  async ending(g, w) {
    const st = g.state;
    playMusic('chapter');
    await g.say('You hand the three parts to SPRIG, who has rolled over from the grove.');
    await g.say('Beep... boop... FUEL CELL: installed. NAV CORE: installed. THRUSTER: installed! Bzzt!', { name: S });
    sfx.beam();
    g.flash('#ffffff', 20);
    g.shake(30, 2);
    w.sparkle(4 * 16 + 24, 3 * 16 + 8, 24);
    await g.wait(40);
    await g.say('The COMET coughs, rumbles and lights up! Smoke stops pouring out of the engine.');
    await g.say('It can fly again! But only short hops. The other THREE parts landed somewhere far across KIRRA.', { name: S });
    if (enyaWith(st)) {
      await g.say("Then you'll go and get them. Kirra's a big planet, but you never were one to give up.", { name: E });
      playMusic('vision');
      sfx.rift();
      g.flash('#c8f4ff', 16);
      await g.say("ENYA's echo flickers... and starts to fade!");
      await g.say("No... not yet! The GEM's light is running out...", { name: E });
      await g.say('Cold shadows curl around her. Something on the other side is pulling her back!');
      st.furyT = 2400;
      sfx.fury();
      g.shake(20, 3);
      await hero(g, 'EM! NO!');
      await g.say('You lunge for her, eyes blazing green... but your hands close on nothing but light.');
      await g.say(`Listen to me, ${st.name}. They're coming for the GEM, and for me. You have to find me. The REAL me.`, { name: E });
      await g.say('Remember the hill? The shooting stars? You made me a promise up there.', { name: E });
      await remember(g, 'hill');
      await hero(g, "...Wherever the stars take you, I'll find you. I remember. I promised.");
      await g.say('You always did keep your promises... Hurry.', { name: E });
      const en = w.entity('enya');
      sfx.shatter();
      g.flash('#ffffff', 30);
      if (en) w.shatter(en.px + 8, en.py - 4, 30);
      st.flags['enya-gone'] = true;
      w.buildFollowers();
      await g.wait(30);
      await g.say('She is gone, in a shower of diamond light. One tiny spark drifts down into your hand, still warm.');
      st.flags['gem-spark'] = true;
      await remember(g, 'promise');
      if (st.pet.species === 'tiger') {
        const pe = w.entity('pet') || w.player;
        w.hearts(pe.px + 8, pe.py - 4, 2);
        await g.say(`${st.pet.name} presses against your legs and lets out a small, sad purr.`);
      }
      await hero(g, "I'm coming, Em. Hold on.");
    }
    st.flags.chapter1 = true;
    st.goal = 'Chapter 1 complete! Talk to the COMET in BLOOMHAVEN: its scanner is looking for your last three parts.';
    g.save();
    await new Promise((resolve) => g.push(new Ending(g, resolve)));
    playMusic(w.map.music);
  },
};
