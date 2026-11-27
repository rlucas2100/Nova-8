/* Numbers and words: companions, wild creatures, moves, items, jewels, and the memories that come back. */

export const JEWELS = {
  gold: { name: 'GOLD COIN', value: 1 },
  emerald: { name: 'EMERALD', value: 5 },
  sapphire: { name: 'SAPPHIRE', value: 5 },
  ruby: { name: 'RUBY', value: 5 },
  diamond: { name: 'DIAMOND', value: 10 },
};

export const PARTS = {
  fuelcell: { name: 'FUEL CELL', where: 'Guarded by a huge THORNBACK in the west of the Wilds.' },
  navcore: { name: 'NAV CORE', where: 'On the island in the middle of the river.' },
  thruster: { name: 'THRUSTER', where: 'Worn as a shell by RUSTCLAW, in the scrap nest (south-east).' },
  // Chapter 2: the other three, far across Kirra
  warpcoil: { name: 'WARP COIL', where: 'Wrapped in the coils of OOZEFANG, across the ooze in the VENOM MIRE.' },
  starcore: { name: 'STAR CORE', where: "Kept as a 'pearl' by the DRAGON KING, in his palace at the JADE LAGOON." },
  solarsail: { name: 'SOLAR SAIL', where: 'Wrapped round the BLACK DRAGON, deep in the WITHERED DEEP.' },
};
export const CH1_PARTS = ['fuelcell', 'navcore', 'thruster'];
export const CH2_PARTS = ['warpcoil', 'starcore', 'solarsail'];

export const ITEMS = {
  berry: { name: 'GLOWBERRY', price: 6, desc: 'A sweet glowing berry. Restores 30 HP.', heal: 30 },
  tonic: { name: 'STAR TONIC', price: 8, desc: 'Fizzy and bright. Fills EN to the top.', en: 99 },
  melon: { name: 'MOON MELON', price: 15, desc: 'A whole melon! Restores all HP and EN.', heal: 999, en: 99 },
  tube: { name: 'COSMIC TUBE', price: 8, desc: 'Holds an infinity of light. In battle, it captures a weakened wild creature.', capture: true },
  // only CODY has any (not for sale, and only used from the BAG, outside battle)
  catnip: { name: 'GOLDEN CATNIP', price: 0, rare: true, levelup: true, desc: "From CODY's secret stash. One sniff and your companion grows a whole level!" },
};

/* the naming screen: one of the DEFAULT_NAMES is shown faintly to start with (and used if you leave it
   empty); RANDOM picks from all of HERO_NAMES, Celtic and elvish-sounding names included (7 letters at most) */
export const DEFAULT_NAMES = ['MANNY', 'SPACEY', 'RHINO'];
export const HERO_NAMES = [
  ...DEFAULT_NAMES, 'KAI', 'RIGEL', 'ATLAS', 'ZANE', 'JAX', 'ORRIN', 'LEO', 'CASSIUS',
  'RONAN', 'CORMAC', 'DECLAN', 'OISIN', 'CIAN', 'CONALL', 'TADHG', 'BRAN',   // Celtic
  'AELAR', 'ELDRIN', 'SILVAN', 'THAELIN', 'CAELUM', 'FAELAN',                // elvish-sounding
];

/* moves. pow = power (0 = no damage), en = energy cost, acc = % to hit.
   Extras: crit (extra crit chance), burn/daze/flinch (chance), hits [min, max], pierce (ignores
   defence), heal (fraction of max HP), buff/debuff { stat, by }, dodge (avoid the next hit). */
export const MOVES = {
  claw: { name: 'CLAW', pow: 40, acc: 95, en: 0, fx: 'claw', desc: 'Swipe with sharp claws.' },
  roar: { name: 'ROAR', pow: 0, acc: 100, en: 3, fx: 'roar', debuff: { stat: 'atk', by: -1 }, flinch: 0.3, desc: "A mighty roar. Lowers the foe's attack and may stun it." },
  pounce: { name: 'POUNCE', pow: 70, acc: 90, en: 5, fx: 'pounce', crit: 0.2, desc: 'A huge leap. Often lands a critical hit.' },
  lick: { name: 'HEALING LICK', pow: 0, acc: 100, en: 4, fx: 'lick', heal: 0.4, self: true, desc: 'Tiger saliva has amazing healing powers. Restores HP.' },
  tigerstep: { name: 'TIGER STEP', pow: 50, acc: 100, en: 6, fx: 'step', dodge: true, desc: 'Teleports in a flash of light, strikes, and dodges the next attack.' },
  flameaura: { name: 'FLAME AURA', pow: 0, acc: 100, en: 6, fx: 'aura', buff: { stat: 'atk', by: 2 }, self: true, desc: 'Crimson flames blaze up: attack sharply up.' },
  swipe: { name: 'SWIPE', pow: 40, acc: 95, en: 0, fx: 'claw', desc: 'A quick swipe of the claws.' },
  flame: { name: 'FLAME', pow: 60, acc: 92, en: 4, fx: 'flame', burn: 0.3, desc: 'Breathes fire. May burn the foe.' },
  frost: { name: 'FROST BREATH', pow: 58, acc: 92, en: 4, fx: 'frost', daze: 0.25, desc: 'Icy breath. May freeze the foe for a turn.' },
  tailswipe: { name: 'TAIL SWIPE', pow: 45, acc: 95, en: 3, fx: 'tail', flinch: 0.35, desc: 'A spinning tail hit. May knock the foe off balance.' },
  smoke: { name: 'SMOKE SCREEN', pow: 0, acc: 100, en: 3, fx: 'smoke', debuff: { stat: 'acc', by: -1 }, desc: "Crimson smoke. Lowers the foe's accuracy." },
  mist: { name: 'MIST VEIL', pow: 0, acc: 100, en: 3, fx: 'mist', debuff: { stat: 'acc', by: -1 }, desc: "A cold mist. Lowers the foe's accuracy." },
  dragondive: { name: 'DRAGON DIVE', pow: 85, acc: 88, en: 7, fx: 'dive', desc: 'Soars up and dives down hard.' },
  whip: { name: 'TENTACLE WHIP', pow: 18, acc: 95, en: 0, fx: 'whip', hits: [2, 4], desc: 'Hits 2 to 4 times in a row.' },
  ink: { name: 'INK CLOUD', pow: 0, acc: 100, en: 3, fx: 'ink', debuff: { stat: 'acc', by: -1 }, desc: "Squirts glowing ink. Lowers the foe's accuracy." },
  glowpulse: { name: 'GLOW PULSE', pow: 0, acc: 100, en: 4, fx: 'glow', heal: 0.4, self: true, desc: 'A soothing glow that restores HP.' },
  mindwave: { name: 'MIND WAVE', pow: 60, acc: 100, en: 5, fx: 'wave', pierce: true, desc: 'A clever psychic wave. Ignores defence.' },
  prism: { name: 'PRISM SHIMMER', pow: 35, acc: 100, en: 6, fx: 'prism', daze: 0.6, desc: 'Dazzling colours. Often dazes the foe.' },
  // the wild ones
  bounce: { name: 'BOUNCE', pow: 35, acc: 95, en: 0, fx: 'bump' },
  goo: { name: 'GOO', pow: 20, acc: 90, en: 0, fx: 'goo', debuff: { stat: 'spd', by: -1 } },
  headbutt: { name: 'HEADBUTT', pow: 38, acc: 95, en: 0, fx: 'bump' },
  spores: { name: 'SPORES', pow: 0, acc: 85, en: 0, fx: 'spores', debuff: { stat: 'acc', by: -1 } },
  finslap: { name: 'FIN SLAP', pow: 36, acc: 95, en: 0, fx: 'bump' },
  divebomb: { name: 'DIVE BOMB', pow: 52, acc: 85, en: 0, fx: 'bump' },
  pinch: { name: 'PINCH', pow: 34, acc: 95, en: 0, fx: 'bump' },
  shard: { name: 'CRYSTAL SHARD', pow: 46, acc: 90, en: 0, fx: 'shard' },
  harden: { name: 'HARDEN', pow: 0, acc: 100, en: 0, fx: 'harden', buff: { stat: 'def', by: 1 }, self: true },
  bite: { name: 'BITE', pow: 44, acc: 95, en: 0, fx: 'bump', flinch: 0.1 },
  spikes: { name: 'SPIKE ROLL', pow: 50, acc: 88, en: 0, fx: 'bump' },
  stomp: { name: 'STOMP', pow: 58, acc: 90, en: 0, fx: 'bump', flinch: 0.15 },
  crush: { name: 'CRUSH CLAW', pow: 56, acc: 92, en: 0, fx: 'bump' },
  scrapshot: { name: 'HOT SCRAP', pow: 44, acc: 95, en: 0, fx: 'shard', burn: 0.3 },
  jet: { name: 'THRUSTER BLAST', pow: 72, acc: 80, en: 0, fx: 'jet' },
  // the Whisperwood
  dust: { name: 'MOTH DUST', pow: 0, acc: 90, en: 0, fx: 'dust', debuff: { stat: 'acc', by: -1 } },
  flutter: { name: 'FLUTTER', pow: 38, acc: 95, en: 0, fx: 'bump' },
  tongue: { name: 'TONGUE LASH', pow: 36, acc: 95, en: 0, fx: 'whip' },
  leap: { name: 'LEAP', pow: 50, acc: 88, en: 0, fx: 'bump' },
  snap: { name: 'SNAP', pow: 46, acc: 92, en: 0, fx: 'bump', flinch: 0.15 },
  vinewrap: { name: 'VINE WRAP', pow: 28, acc: 95, en: 0, fx: 'vine', debuff: { stat: 'spd', by: -1 } },
  shellbash: { name: 'SHELL BASH', pow: 42, acc: 95, en: 0, fx: 'bump' },
  bloom: { name: 'MOSS BLOOM', pow: 0, acc: 100, en: 0, fx: 'glow', heal: 0.25, self: true },
  shadowclaw: { name: 'SHADOW CLAW', pow: 48, acc: 92, en: 0, fx: 'shadow' },
  chill: { name: 'GRAVE CHILL', pow: 0, acc: 90, en: 0, fx: 'wail', debuff: { stat: 'atk', by: -1 } },
  wail: { name: 'WAIL', pow: 32, acc: 90, en: 0, fx: 'wail', flinch: 0.25 },
  grasp: { name: 'GRASP', pow: 58, acc: 90, en: 0, fx: 'shadow' },
  gloom: { name: 'GLOOM WAVE', pow: 64, acc: 85, en: 0, fx: 'wail' },
  // the Jelly Jam
  zapsting: { name: 'ZAP STING', pow: 40, acc: 95, en: 0, fx: 'zapsting', daze: 0.15 },
  bop: { name: 'BOP', pow: 34, acc: 95, en: 0, fx: 'bump' },
  drumroll: { name: 'DRUM ROLL', pow: 16, acc: 95, en: 0, fx: 'drum', hits: [2, 4] },
  sporebeat: { name: 'SPORE BEAT', pow: 0, acc: 85, en: 0, fx: 'spores', debuff: { stat: 'acc', by: -1 } },
  bassdrop: { name: 'BASS DROP', pow: 56, acc: 85, en: 0, fx: 'bassdrop' },
  // taught by CODY (NOVA only): kept in the save as one of the companion's taught moves
  firering: { name: 'FIRE TIGER RING', pow: 80, acc: 100, en: 7, fx: 'firering', burn: 0.4, desc: 'Taught by CODY: a ring of fire pulses out, stretches wide and engulfs the foe. May burn.' },
  // the Venom Mire (poison hurts at the end of every round until it wears off)
  fangs: { name: 'POISON FANG', pow: 38, acc: 95, en: 0, fx: 'bite', poison: 0.3 },
  hiss: { name: 'HISS', pow: 0, acc: 100, en: 0, fx: 'hiss', debuff: { stat: 'def', by: -1 } },
  venomspit: { name: 'VENOM SPIT', pow: 44, acc: 85, en: 0, fx: 'venom', poison: 0.4 },
  coil: { name: 'COIL', pow: 0, acc: 100, en: 0, fx: 'coil', buff: { stat: 'atk', by: 1 }, self: true },
  venombite: { name: 'VENOM BITE', pow: 54, acc: 90, en: 0, fx: 'bite', poison: 0.4 },
  oozewave: { name: 'OOZE WAVE', pow: 58, acc: 85, en: 0, fx: 'ooze', debuff: { stat: 'spd', by: -1 } },
  // the Jade Lagoon and the Withered Deep
  jadebreath: { name: 'JADE BREATH', pow: 60, acc: 90, en: 0, fx: 'jade' },
  tidalwave: { name: 'TIDAL WAVE', pow: 66, acc: 85, en: 0, fx: 'tide', flinch: 0.2 },
  dragonclaw: { name: 'DRAGON CLAW', pow: 56, acc: 92, en: 0, fx: 'claw', crit: 0.1 },
  kingroar: { name: 'KINGLY ROAR', pow: 0, acc: 100, en: 0, fx: 'roar', debuff: { stat: 'atk', by: -1 }, flinch: 0.3 },
  drainlife: { name: 'DRAIN LIFE', pow: 40, acc: 95, en: 0, fx: 'drain', drain: 0.5 },
  wither: { name: 'WITHER', pow: 0, acc: 90, en: 0, fx: 'wither', debuff: { stat: 'atk', by: -1 } },
  shadowbreath: { name: 'SHADOW BREATH', pow: 64, acc: 88, en: 0, fx: 'shadowbreath' },
};

/* companions: stats at level 1 and growth per level; moves learned at a level */
export const COMPANIONS = {
  tiger: {
    kind: 'TIGER', name: 'NOVA', art: 'tiger',
    base: { hp: 30, atk: 11, def: 8, spd: 11 }, grow: { hp: 5, atk: 2.1, def: 1.5, spd: 1.7 },
    learn: [[1, 'claw'], [1, 'roar'], [1, 'pounce'], [4, 'lick'], [5, 'tigerstep'], [7, 'flameaura']],
    blurb: 'A tiger cub with fiery stripes and bright green eyes. Strong claws, a mighty ROAR, a healing lick, and he can teleport in a flash of light.',
  },
  dragon: {
    kind: 'DRAGON', name: 'EMBER', art: 'dragonRed',
    base: { hp: 32, atk: 10, def: 9, spd: 9 }, grow: { hp: 5.4, atk: 2, def: 1.6, spd: 1.5 },
    learn: [[1, 'swipe'], [1, 'flame'], [1, 'tailswipe'], [5, 'smoke'], [7, 'dragondive']],
    blurb: 'A baby dragon with shimmering scales. Breathes fire (or frost!), and packs a TAIL SWIPE.',
  },
  octo: {
    kind: 'OCTOPUS', name: 'LUMI', art: 'octo',
    base: { hp: 28, atk: 9, def: 8, spd: 12 }, grow: { hp: 4.6, atk: 1.9, def: 1.5, spd: 1.8 },
    learn: [[1, 'whip'], [1, 'ink'], [1, 'glowpulse'], [5, 'mindwave'], [7, 'prism']],
    blurb: 'A glowing octopus in tiny reading glasses. Very clever: LUMI heals herself and baffles foes with ink.',
  },
};
export const BLUE_DRAGON = { name: 'AZURE', art: 'dragonBlue', swap: { flame: 'frost', smoke: 'mist' } };

/* wild creatures. catch = how easily a COSMIC TUBE holds them (0: it can't); ghoul = from beyond the veil */
export const WILD = {
  glorp: { name: 'GLORP', art: 'glorp', base: { hp: 14, atk: 6, def: 5, spd: 5 }, moves: ['bounce', 'bounce', 'goo'], xp: 8, catch: 1, intro: 'A GLORP oozes out of the glowgrass!', desc: 'A wobbly green blob. It bounces when it is happy, which is always.' },
  sporelet: { name: 'SPORELET', art: 'sporelet', base: { hp: 15, atk: 6, def: 6, spd: 4 }, moves: ['headbutt', 'headbutt', 'spores'], xp: 9, catch: 0.9, intro: 'A grumpy SPORELET pops up!', desc: 'A grumpy little mushroom. Its spores make everyone sneeze.' },
  flitterfin: { name: 'FLITTERFIN', art: 'flitterfin', base: { hp: 12, atk: 7, def: 4, spd: 10 }, moves: ['finslap', 'finslap', 'divebomb'], xp: 9, catch: 0.8, intro: 'A FLITTERFIN zips out of the river spray!', desc: 'A flying fish that zips out of the river spray.' },
  crystabug: { name: 'CRYSTABUG', art: 'crystabug', base: { hp: 16, atk: 6, def: 9, spd: 3 }, moves: ['pinch', 'shard', 'harden'], xp: 11, catch: 0.7, intro: 'A CRYSTABUG clicks its crystal shell!', jewel: 0.8, desc: 'Grows crystals on its back, and often drops jewels.' },
  thornback: { name: 'THORNBACK', art: 'thornback', base: { hp: 18, atk: 8, def: 7, spd: 6 }, moves: ['bite', 'spikes', 'bite'], xp: 14, catch: 0.55, intro: 'A spiky THORNBACK blocks the way!', desc: 'Spiky and stubborn. Will do anything for a melon.' },
  thornAlpha: { name: 'THORNBACK ALPHA', short: 'ALPHA', art: 'thornAlpha', base: { hp: 36, atk: 9, def: 8, spd: 6 }, moves: ['bite', 'spikes', 'stomp'], xp: 30, boss: true, intro: 'The THORNBACK ALPHA charges!' },
  rustclaw: { name: 'RUSTCLAW', art: 'rustclaw', base: { hp: 56, atk: 10, def: 9, spd: 5 }, moves: ['crush', 'scrapshot', 'jet', 'harden', 'crush'], xp: 50, boss: true, big: true, intro: 'RUSTCLAW rears up, its stolen THRUSTER blazing!' },
  // the Whisperwood
  lumoth: { name: 'LUMOTH', art: 'lumoth', base: { hp: 15, atk: 7, def: 5, spd: 9 }, moves: ['flutter', 'flutter', 'dust'], xp: 10, catch: 0.9, intro: 'A LUMOTH flutters out of the ferns, glowing like a lantern!', desc: 'A moth that glows like a lantern. Its wing dust sparkles.' },
  jadehop: { name: 'JADEHOP', art: 'jadehop', base: { hp: 16, atk: 8, def: 6, spd: 8 }, moves: ['tongue', 'leap', 'tongue'], xp: 11, catch: 0.8, intro: 'A JADEHOP leaps out of the ferns! Ribbit!', desc: 'A frog with a jade crystal back. It can leap over a whole tree.' },
  vinesnap: { name: 'VINESNAP', art: 'vinesnap', base: { hp: 17, atk: 9, def: 6, spd: 6 }, moves: ['snap', 'vinewrap', 'snap'], xp: 13, catch: 0.7, intro: 'A VINESNAP uncurls from the undergrowth, jaws snapping!', desc: 'A snappy plant that walks on its vines. All bark, mostly bite.' },
  mosshell: { name: 'MOSSHELL', art: 'mosshell', base: { hp: 20, atk: 7, def: 10, spd: 3 }, moves: ['shellbash', 'shellbash', 'harden', 'bloom'], xp: 13, catch: 0.6, intro: 'A MOSSHELL plods out of the ferns. A garden grows on its back!', desc: 'An old turtle with a little glowing garden on its shell.' },
  ghoul: { name: 'GHOUL', art: 'ghoul', base: { hp: 18, atk: 9, def: 6, spd: 8 }, moves: ['shadowclaw', 'wail', 'chill'], xp: 18, catch: 0, ghoul: true, intro: 'A GHOUL seeps out of the shadows! It came from beyond the veil...' },
  grimghoul: { name: 'GRIMGHOUL', art: 'grimghoul', base: { hp: 50, atk: 10, def: 8, spd: 7 }, moves: ['grasp', 'gloom', 'shadowclaw', 'chill', 'grasp'], xp: 55, catch: 0, ghoul: true, boss: true, big: true, intro: 'The GRIMGHOUL reaches for you with long, grasping claws!' },
  // the Jelly Jam
  bopjelly: { name: 'BOPJELLY', art: 'bopjelly', base: { hp: 15, atk: 7, def: 5, spd: 8 }, moves: ['bop', 'zapsting', 'bop'], xp: 10, catch: 0.85, intro: 'A BOPJELLY bops down out of the purple sky!', desc: 'A sky jelly in tiny headphones. It bops along to any beat.' },
  shroomboom: { name: 'DRUMCAP', art: 'shroomboom', base: { hp: 18, atk: 8, def: 7, spd: 5 }, moves: ['drumroll', 'sporebeat', 'bassdrop'], xp: 13, catch: 0.7, intro: 'A DRUMCAP drums its way out of the alien sprouts!', desc: 'A mushroom whose cap is a drum. It has never missed a beat.' },
  // the Venom Mire
  hissling: { name: 'HISSLING', art: 'hissling', base: { hp: 17, atk: 9, def: 6, spd: 9 }, moves: ['fangs', 'hiss', 'fangs'], xp: 13, catch: 0.75, intro: 'A HISSLING slithers out of the reeds! Hsssss!', desc: 'A little striped snake. Its bite is poisonous, but it mostly wants to be left alone.' },
  spitviper: { name: 'SPITVIPER', art: 'spitviper', base: { hp: 19, atk: 10, def: 7, spd: 8 }, moves: ['venomspit', 'fangs', 'coil'], xp: 15, catch: 0.6, intro: 'A SPITVIPER rears up out of the ooze, hood flared wide!', desc: 'A hooded viper that spits glowing venom. Luckily, its aim is terrible.' },
  oozefang: { name: 'OOZEFANG', art: 'oozefang', base: { hp: 56, atk: 11, def: 9, spd: 7 }, moves: ['venombite', 'oozewave', 'venomspit', 'coil', 'venombite'], xp: 60, boss: true, big: true, intro: 'OOZEFANG rises out of the ooze, the WARP COIL glinting in its coils!' },
  // the Withered Deep
  witherwisp: { name: 'WITHERWISP', art: 'witherwisp', base: { hp: 17, atk: 9, def: 7, spd: 9 }, moves: ['drainlife', 'wither', 'drainlife'], xp: 15, catch: 0.7, intro: 'A WITHERWISP drifts out of the grey ferns, cold as ash...', desc: 'A wisp of life the Black Dragon drank. Inside a COSMIC TUBE, its colour comes back.' },
  // the Dragon Kings
  dragonKing: { name: 'DRAGON KING', art: 'dragonKing', base: { hp: 60, atk: 12, def: 10, spd: 8 }, moves: ['jadebreath', 'tidalwave', 'dragonclaw', 'kingroar', 'jadebreath'], xp: 70, boss: true, big: true, intro: 'The DRAGON KING rises from his throne, scales flashing jade and gold!' },
  blackDragon: { name: 'BLACK DRAGON', art: 'blackDragon', base: { hp: 66, atk: 12, def: 10, spd: 8 }, moves: ['shadowbreath', 'drainlife', 'dragonclaw', 'gloom', 'shadowbreath'], xp: 85, boss: true, big: true, shadow: true, intro: 'The BLACK DRAGON uncoils from the dead tree, eyes burning violet!' },
};
const WILD_GROW = { hp: 4, atk: 1.5, def: 1.25, spd: 1.2 };
const BOSS_GROW = { hp: 9, atk: 1.7, def: 1.4, spd: 1.1 };
/* every creature a COSMIC TUBE can hold, in the order the TUBES screen shows them */
export const CATCHABLE = Object.keys(WILD).filter((k) => WILD[k].catch > 0);

/* the memories that come back to you, one by one: the story so far */
export const MEMORIES = [
  { id: 'fire', title: 'FIRE IN THE SKY', text: 'Your homeworld under attack. Sirens and burning banners. You left anyway, chasing one last signal across the stars... to her.' },
  { id: 'name', title: 'A NAME', text: 'Em... Gem... A name, half-lost in the fog, right on the tip of your tongue.' },
  { id: 'gem', title: 'THE CELESTIAL GEM', text: 'Her diamond necklace, the CELESTIAL GEM, bright as a star. She wore it every single day, even when the whole world was at war.' },
  { id: 'hill', title: 'STARRY HILL', text: 'Two kids lying in the long grass on a hill, counting shooting stars. She always found more than you did.' },
  { id: 'blood', title: 'WARRIOR BLOOD', text: "Your father's voice: 'Our anger burns green, son. Only ever point it at whatever threatens the ones you love.'" },
  { id: 'veil', title: 'THE OTHER SIDE', text: 'She is trapped beyond the VEIL, in a dark mirror of this world. GHOULS hunt her for the light of the GEM.' },
  { id: 'flame', title: 'THE COSMIC FLAME', text: 'An old bedtime story: when two hearts meant for each other finally meet, they light a COSMIC FLAME bright enough to begin a universe.' },
  { id: 'dance', title: 'THE DANCE', text: 'A summer dance in a crowded hall. She pulled you onto the floor and laughed every time you trod on her toes.' },
  { id: 'promise', title: 'THE PROMISE', text: "'Wherever the stars take you, I'll find you.' You promised her that, long ago. You still mean every word." },
  // from humming her tune (Chapter 1), and from dreams on the COMET and the Withered Deep (Chapter 2)
  { id: 'tune', title: 'HER TUNE', text: 'The little tune she always hummed on the walk home. You still whistle it without thinking.' },
  { id: 'summer', title: 'SUMMER DAYS', text: 'Sitting on the warm kerb with her, sharing a bag of sweets and doing nothing at all. The best days of your life, and you never even knew it.' },
  { id: 'squash', title: 'THE TENNIS BALL', text: "Smacking an old tennis ball off the gable wall, squash-style. It always ended up on Mr Nolan's roof. He never once gave it back." },
  { id: 'years', title: 'THE LOST YEARS', text: 'How long did the war go on? Two years? Ten? The battles blur together, and the years went with them. Nobody can tell you how many.' },
  { id: 'chair', title: 'AN EMPTY CHAIR', text: "Home after the war. Your father's chair by the fire, empty. The clock ticking. You never got to say goodbye." },
  { id: 'birdsong', title: 'BIRDSONG', text: 'After the war, the only thing that helped: sitting very still in the garden while the birds came back, one by one.' },
];

/* Enya's echo is with you: from the Thornback Alpha until the end of Chapter 1, when the ghouls pull her back */
export const enyaWith = (st) => !!(st && st.flags && st.flags.enya && !st.flags['enya-gone']);

export function statsAt(base, grow, lv) {
  return {
    hp: Math.round(base.hp + grow.hp * (lv - 1)),
    atk: Math.round(base.atk + grow.atk * (lv - 1)),
    def: Math.round(base.def + grow.def * (lv - 1)),
    spd: Math.round(base.spd + grow.spd * (lv - 1)),
  };
}
export function xpToNext(lv) { return 10 + lv * 10; }
export const MAX_EN = (lv) => 10 + Math.floor(lv / 2);

/* every move a companion knows by a level (nothing is ever forgotten), plus any CODY taught them */
export function movesAt(species, variant, lv, taught = []) {
  const s = COMPANIONS[species], blue = species === 'dragon' && variant === 'blue';
  const list = s.learn.filter(([at]) => at <= lv).map(([, m]) => (blue && BLUE_DRAGON.swap[m] ? BLUE_DRAGON.swap[m] : m));
  return list.concat(taught.filter((m) => !list.includes(m)));
}

/* a new companion, as stored in the save file */
export function newCompanion(species, variant = 'red', lv = 3) {
  const s = COMPANIONS[species];
  const blue = species === 'dragon' && variant === 'blue';
  const c = { species, variant, name: blue ? BLUE_DRAGON.name : s.name, lv, xp: 0, moves: movesAt(species, variant, lv), taught: [] };
  const st = statsAt(s.base, s.grow, lv);
  c.hp = st.hp;
  c.en = MAX_EN(lv);
  return c;
}
export function companionStats(c) { const s = COMPANIONS[c.species]; return statsAt(s.base, s.grow, c.lv); }
export function companionArt(c) { return c.species === 'dragon' ? (c.variant === 'blue' ? 'dragonBlue' : 'dragonRed') : COMPANIONS[c.species].art; }
/* the moves a companion learns on reaching a level */
export function learnsAt(c, lv) {
  const s = COMPANIONS[c.species], blue = c.species === 'dragon' && c.variant === 'blue';
  return s.learn.filter(([at]) => at === lv).map(([, m]) => (blue && BLUE_DRAGON.swap[m] ? BLUE_DRAGON.swap[m] : m));
}

export function newWild(species, lv) {
  const w = WILD[species];
  const st = statsAt(w.base, w.boss ? BOSS_GROW : WILD_GROW, lv);
  return { species, name: w.name, short: w.short || w.name, art: w.art, lv, ...st, maxHp: st.hp, boss: !!w.boss, big: !!w.big, ghoul: !!w.ghoul, shadow: !!w.shadow, moves: w.moves.slice() };
}

/* one level up (after a battle, or from a GOLDEN CATNIP): resolves to { old, now, learned } */
export function levelUp(c) {
  const old = companionStats(c);
  c.lv++;
  const now = companionStats(c);
  c.hp = Math.min(now.hp, c.hp + (now.hp - old.hp) + 4);
  const learned = learnsAt(c, c.lv).filter((m) => !c.moves.includes(m));
  c.moves.push(...learned);
  return { old, now, learned };
}
