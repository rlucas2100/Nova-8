/* Chapter 1: Crash Landing. Everyone's lines and the story's events, as little async scripts:
   script(game, world, thing) -> runs while the world waits. */
import { COMPANIONS, PARTS, ITEMS, newCompanion } from './data.js';
import { sfx, playMusic } from '../engine/audio.js';
import { C } from './ui.js';
import { Ending, chooseCompanion } from './scenes.js';

const S = 'SPRIG', E = 'ENYA';
const partCount = (st) => Object.keys(PARTS).filter((k) => st.parts[k]).length;

export const SCRIPTS = {
  /* you wake up next to the crashed COMET; Sprig rolls over to help */
  async wakeUp(g, w) {
    const st = g.state;
    await g.wait(40);
    await g.say('Ugh... your head is spinning. Where are you?');
    w.emote('sprig', '!');
    sfx.blip();
    await g.wait(30);
    await w.walk('sprig', ['down', 'down', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'up', 'up']);
    w.face('player', 'right');
    w.face('sprig', 'left');
    await g.say('Beep! Boop! A visitor fell out of the sky! Are you hurt?', { name: S });
    await g.say("I am SPRIG, gardener of BLOOMHAVEN, the garden city of planet KIRRA. You crashed right into our moss-roses!", { name: S });
    await g.say(`Hello, ${st.name}! Let me scan your ship... Oh dear. Bzzt.`, { name: S });
    await g.say('My scanner says your ship needs SIX new parts to fly home. THREE of them landed in the CRIMSON WILDS, east of the river: a FUEL CELL, a NAV CORE and a THRUSTER.', { name: S });
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
    if (st.flags.chapter1) { await g.say('Beep! The COMET is looking shinier every day. Bzzt.', { name: S }); return; }
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
    await g.say('TIP: press B to hop. Your companion loves it!');
    st.bag.berry = (st.bag.berry || 0) + 3;
    await g.say(`Wonderful choice! ${st.pet.name} will keep you safe. Here are 3 GLOWBERRIES for the road.`, { name: S });
    await g.say('You got 3 GLOWBERRIES!');
    await g.say('Press SELECT to ride, START for your menu. The gate drone by the bridge will let you pass now. Good luck!', { name: S });
    st.goal = 'Cross the bridge (east) into the CRIMSON WILDS and find your three ship parts.';
    st.respawn = { map: 'bloomhaven', x: 14, y: 12, dir: 'up' };
    g.save();
  },

  async drone(g, w, n) {
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
    const ids = Object.keys(ITEMS);
    for (;;) {
      const i = await g.menu(ids.map((k) => ({ label: ITEMS[k].name, right: '◆' + ITEMS[k].price, disabled: st.money < ITEMS[k].price })), {
        x: 52, y: 6, w: 104, title: 'YOU HAVE ◆' + st.money,
        under: (ctx, k) => {},
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
    if (st.flags.chapter1) { await g.say('The COMET hums quietly. Three new parts gleam on its hull. Three more to go...'); return; }
    const n = partCount(st);
    if (n < 3) {
      const list = Object.keys(PARTS).map((k) => (st.parts[k] ? '★ ' : '- ') + PARTS[k].name).join('   ');
      await g.say(`The COMET, your star-skiff. Its hull is cracked and smoking. Parts found: ${n} of 3.`);
      await g.say(list);
      return;
    }
    await SCRIPTS.ending(g, w);
  },

  /* ---------- people of Bloomhaven ---------- */
  async b1(g) { await g.say('The river glows because of the algae. At night the little jellies come up to the top and sing!', { name: 'FERN' }); },
  async b2(g) { await g.say('Tall violet GLOWGRASS hides wild critters. Walk around it if your companion is tired!', { name: 'BUD' }); },
  async b3(g) { await g.say('MOSSA trades snacks for jewels: GOLD COINS, EMERALDS, SAPPHIRES, RUBIES, DIAMONDS... she loves them all!', { name: 'SOL' }); },
  async b4(g) {
    if (g.state.flags.enya) await g.say("You met ENYA? She's my hero! She chased a THORNBACK away from my uncle's melon patch once.", { name: 'SKYE' });
    else await g.say("Have you seen the girl with golden hair? She rides a huge green tiger through the Wilds. I think she's from another planet, like you!", { name: 'SKYE' });
  },
  async b5(g) { await g.say("I'm fishing for star-shrimp. This river runs all the way to the edge of the world, then pours right off it into the sky!", { name: 'REEF' }); },

  /* ---------- the Crimson Wilds ---------- */
  async wildsIntro(g) {
    g.state.flags['wilds-intro'] = true;
    await g.say('THE CRIMSON WILDS. Red earth, violet glowgrass and a river that glows green. Somewhere out here are your three ship parts!');
    await g.say('TIP: move with W A S D, the arrow keys or the D-pad. Walk over jewels to pick them up. Wild creatures hide in the tall violet glowgrass!');
    g.save();
  },
  async medic(g, w) {
    await g.say("I'm the Wilds' field medic. Let me patch up your companion... There! Good as new.", { name: 'MOSS' });
    w.heal(); sfx.heal(); w.setRespawn();
    await g.say('HP and EN fully restored! If you get into trouble, you can rest here.');
    g.save();
  },
  async scout(g) {
    const st = g.state;
    if (!st.parts.thruster) await g.say('A giant scrap crab called RUSTCLAW lives in the nest down south-east. It stole something shiny from a crashed ship and wears it like a shell!', { name: 'PEBBLE' });
    else await g.say('You beat RUSTCLAW?! Wait until everyone in Bloomhaven hears about this!', { name: 'PEBBLE' });
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
  async alphaFight(g, w) {
    const st = g.state;
    const res = await w.battle({ species: 'thornAlpha', lv: 6, enyaArrives: st.flags.enya ? 0 : 2 });
    if (res !== 'win') { st.flags['alpha-zone'] = false; return; }
    st.flags['alpha-beaten'] = true;
    w.removeNpc('alpha');
    if (!st.flags.enya) {
      // Enya rides over from the west
      playMusic('enya');
      const p = w.player;
      const enya = w.addNpc({ id: 'enyaNpc', art: 'enya', x: Math.max(2, p.x - 4), y: p.y, dir: 'right' });
      enya.drawEnya = true;
      await w.walk('enyaNpc', ['right', 'right', 'right'], { ghost: true });
      w.face('player', 'left');
      await g.say(`Nice moves, you two! Name's ENYA. And this big lad is the EMERALD TIGER.`, { name: E });
      await g.say("I'm from Tipperary, in Ireland, back on Earth. I crashed on Kirra a long while ago myself. The Emerald Tiger found me, and we've been looking out for each other ever since.", { name: E });
      if (st.pet.species === 'tiger') {
        const petE = w.entity('pet') || w.player;   // when you're riding him, he's under you
        w.emote(petE.id, '♥', 80);
        w.hearts(petE.px + 8, petE.py - 6, 6);
        await g.say(`${st.pet.name} can't stop staring at ENYA. Little hearts float up around him!`);
        await g.say(`Ha! Hello to you too, handsome.`, { name: E });
      }
      await g.say('That ALPHA was sitting on something shiny... Here. Is this yours?', { name: E });
      st.parts.fuelcell = true;
      sfx.part();
      await g.say('You got the FUEL CELL! (1 of 3)');
      await g.say(`Your ship needs more parts? Then you've got yourself a partner, ${st.name}. Let's find them together!`, { name: E });
      w.removeNpc('enyaNpc');
      st.flags.enya = true;
      w.buildFollowers();
      sfx.joined();
      await g.say('ENYA and the EMERALD TIGER joined you! In battle, ENYA uses DIAMOND FLASH, SHAMROCK CHEER and the EMERALD TIGER’s pounce.');
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
    if (st.flags.enya && part.id === 'navcore') await g.say(partCount(st) < 3 ? "Brilliant! Word is RUSTCLAW has the last one. It's in the scrap nest, past the bridge in the south." : "That's the lot! Back to your ship!", { name: E });
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
    if (!st.flags.enya) {
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

  /* ---------- the end of Chapter 1 ---------- */
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
    await g.say("Then we'll go and get them. Kirra is a big planet, and I know a few people.", { name: E });
    await g.say(`Keep this up, ${st.name}, and the EMERALD TIGER might even let you ride him one day.`, { name: E });
    st.flags.chapter1 = true;
    st.goal = 'Chapter 1 complete! Explore, collect jewels and train your companion. Chapter 2 is on its way.';
    g.save();
    await new Promise((resolve) => g.push(new Ending(g, resolve)));
    playMusic(w.map.music);
  },
};
