/* Chapter 1: Crash Landing. Everyone's lines and the story's events, as little async scripts:
   script(game, world, thing) -> runs while the world waits.

   The story so far: your homeworld is at war, and you come from a long line of warriors. You'd had
   enough of fighting and set off to find your long-lost love, the girl you grew up with, when a
   meteor storm brought you down on planet KIRRA. The crash scrambled your memory: you can only mumble
   "Em... Gem..." and the rest comes back in pieces (MEMORIES in data.js). ENYA reaches you as an echo
   from beyond the veil, through the GEM, her diamond necklace, until the ghouls hunting her pull her
   back at the end of the chapter. The two of you still have to meet for real. */
import { PARTS, ITEMS, JEWELS, newCompanion, enyaWith } from './data.js';
import { sfx, playMusic } from '../engine/audio.js';
import { Ending, chooseCompanion } from './scenes.js';
import { remember, hasMemory } from './memory.js';

const S = 'SPRIG', E = 'ENYA', L = 'LUMEN', DJ = 'DJ JIGGLE', FERRY = 'JELLY FERRY';
const partCount = (st) => Object.keys(PARTS).filter((k) => st.parts[k]).length;
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
    const ids = Object.keys(ITEMS);
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
    st.goal = 'Chapter 1 complete! Find a way beyond the veil to reach the real ENYA... Chapter 2 is on its way.';
    g.save();
    await new Promise((resolve) => g.push(new Ending(g, resolve)));
    playMusic(w.map.music);
  },
};
