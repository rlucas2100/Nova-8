/* Walking sprites, 16 x 16: you, your companion, Enya on the Emerald Tiger, the people of Bloomhaven,
   LUMEN the Light Keeper and the jellies of the Jelly Jam. One letter per pixel; each direction
   has a standing frame and two steps, and facing left is the side frames mirrored. All original
   pixel art. */
import { art, remap, painter } from '../engine/pixel.js';

export const INK = '#1a0f2e';

/* ---------- you: a castaway from a long line of warriors ----------
   K outline, H hair, h hair shine, S skin, s skin shade, E eyes, T flight suit, t suit shade,
   W white stripe, O scarf, G goggle frame, g goggle lens, P backpack, p pack shade, B boots */
const BOY_DOWN_TOP = art(`
  ................
  .....KKKKKK.....
  ....KHHHHHHK....
  ...KHHhHHHHHK...
  ...KGggGGggGK...
  ...KHSSSSSSHK...
  ...KSESSSSESK...
  ....KSSssSSK....
  ...KKOOOOOOKK...
  ..KTKTTWWTTKTK..
  ..KTKTTWWTTKTK..
`);
const BOY_UP_TOP = art(`
  ................
  .....KKKKKK.....
  ....KHHHHHHK....
  ...KHHHHhHHHK...
  ...KGGGGGGGGK...
  ...KHHHHHHHHK...
  ...KHHHHHHHHK...
  ....KHHHHHHK....
  ...KKOOOOOOKK...
  ..KTKPPPPPPKTK..
  ..KTKPpPPpPKTK..
`);
const BOY_SIDE_TOP = art(`
  ................
  .....KKKKK......
  ....KHHHHHKK....
  ...KHHHhHHHHK...
  ...KHHHHHGggK...
  ...KHHHHSSSSK...
  ...KHHHSSSESK...
  ....KHSSSSSSK...
  .....KKOOOOK....
  ....KPKTTWTK....
  ....KPKTTWTK....
`);
const legsDown = [
  ['..KSKttWWttKSK..', '...KKttttttKK...', '....KTTKKTTK....', '....KBBKKBBK....', '.....KK..KK.....'],
  ['..KSKttWWttKTK..', '...KKttttttKSK..', '....KTTKKTTK....', '....KTTKKBBK....', '....KBBK.KK.....'],
  ['..KTKttWWttKSK..', '..KSKttttttKK...', '....KTTKKTTK....', '....KBBKKTTK....', '.....KK.KBBK....'],
];
const legsUp = [
  ['..KSKPPPPPPKSK..', '...KKttttttKK...', '....KTTKKTTK....', '....KBBKKBBK....', '.....KK..KK.....'],
  ['..KSKPPPPPPKTK..', '...KKttttttKSK..', '....KTTKKTTK....', '....KTTKKBBK....', '....KBBK.KK.....'],
  ['..KTKPPPPPPKSK..', '..KSKttttttKK...', '....KTTKKTTK....', '....KBBKKTTK....', '.....KK.KBBK....'],
];
const legsSide = [
  ['....KPKTSWtK....', '.....KttttK.....', '.....KTTTTK.....', '.....KBBKBBK....', '.....KKK.KKK....'],
  ['....KPKtSWtK....', '.....KttttK.....', '....KTTKKTTK....', '...KBBK..KBBK...', '...KKK....KKK...'],
  ['....KPKtSWtK....', '.....KttttK.....', '......KTTK......', '......KBBBK.....', '......KKKKK.....'],
];
function build(top, legs) { return legs.map((l) => top.concat(l)); }

export const HERO = { down: build(BOY_DOWN_TOP, legsDown), up: build(BOY_UP_TOP, legsUp), side: build(BOY_SIDE_TOP, legsSide) };
/* riding: just the top half, sat on the companion's back */
export const HERO_TOP = { down: BOY_DOWN_TOP.slice(0, 10).concat(['..KTKTTWWTTKTK..']), up: BOY_UP_TOP.slice(0, 11), side: BOY_SIDE_TOP.slice(0, 11) };

/* his eyes are a dark emerald green: now and then they flash greener (more often once his warrior blood has woken), and
   while it's up they blaze */
const SUIT = { K: INK, S: '#ffd0a6', s: '#e09a6a', T: '#2fc6b4', t: '#1b8f8c', W: '#f6f2ff', O: '#ff8a1e', G: '#ffd23a', g: '#8ff0ff', P: '#c8702a', p: '#8a4418', B: '#5a2f6e', H: '#4a2c1c', h: '#7a4a2c' };
export const HERO_PAL = { ...SUIT, E: '#0f6e3e' };   // dark emerald
export const HERO_PAL_SHIFT = { ...SUIT, E: '#1f9e5c' };
export const HERO_PAL_FURY = { ...SUIT, E: '#3ad07e' };

/* ---------- NOVA, the tiger ----------
   Ryan's own pixel tiger from the site (tiger.js), frame for frame.
   K outline and stripes, O orange fur, D shade, L light fur, W cream, E eyes, N nose. */
const T_DOWN_TOP = [
  '................', '..KK........KK..', '.KLOK......KOLK.', '.KOOOKKKKKKOOOK.', '.KOKOOKOOKOOKOK.', 'KOOKOOOKKOOOKOOK',
  'KKOOOOOOOOOOOOKK', 'KOWWEKOOOOKEWWOK', 'KKOOOOOWWOOOOOKK', 'KOKOOWWWWWWOOKOK', '.KWWWWWNNWWWWWK.', '.KWWWWKWWKWWWWK.', '..KKWWWWWWWWKK..',
];
const T_UP_TOP = [
  '................', '..KK........KK..', '.KOOK......KOOK.', '.KOOOKKKKKKOOOK.', '.KOOOOOOOOOOOOK.', 'KOKKOOKKKKOOKKOK',
  'KOOOOOOOOOOOOOOK', '.KOKKOOOOOOKKOK.', '..KOOOKKKKOOOK..', '.KOOOOOOOOOOOOK.', '.KKKOOKKKKOOKKK.', '.KOOOOOOOOOOOOK.', '.KKKOOOKKOOOKKK.',
];
const T_SIDE_TOP = [
  '................', '................', '..........KK....', '.K.......KLOK...', 'KOK......KOOOKKK', 'KOK.....KOKOOOOK',
  '.KOKKKKKOOKOOEOK', '..KOOKOOKOOOOWWK', '..KOOKOOKOOWWWNK', '..KOKOOKOOKWWWK.', '..KOKOOKOOOKKK..', '...KWWWWWWWK....',
];
export const TIGER = {
  down: [
    T_DOWN_TOP.concat(['..KOOKKKKKKOOK..', '..KWWK....KWWK..', '...KK......KK...']),
    T_DOWN_TOP.concat(['..KOOKKKKKKWWK..', '..KWWK.....KK...', '...KK...........']),
    T_DOWN_TOP.concat(['..KWWKKKKKKOOK..', '...KK.....KWWK..', '...........KK...']),
  ],
  up: [
    T_UP_TOP.concat(['..KDOOOOOOOODK..', '..KWWK.KOK.KWWK.', '...KK...KOK.KK..']),
    T_UP_TOP.concat(['..KDOOOOOOOOKK..', '..KWWK.KOK..KK..', '...KK...KOK.....']),
    T_UP_TOP.concat(['..KKOOOOOOOODK..', '...KK..KOK.KWWK.', '.......KOK..KK..']),
  ],
  side: [
    T_SIDE_TOP.concat(['...KOOK..KOOK...', '...KOOK..KOOK...', '...KWWK..KWWK...', '....KK....KK....']),
    T_SIDE_TOP.concat(['..KOOK....KOOK..', '.KOOK......KOOK.', '.KWWK......KWWK.', '..KK........KK..']),
    T_SIDE_TOP.concat(['...KOOKKOOK.....', '....KOKKOK......', '....KWKKWK......', '.....K..K.......']),
  ],
};
export const TIGER_PAL = { K: '#1d0c05', O: '#ff8a1e', D: '#c9580c', L: '#ffc46e', W: '#fff2da', E: '#7dff2e', N: '#7a2e1c' };
export const TIGER_SLEEPY = { ...TIGER_PAL, E: '#1d0c05' };   // eyes shut (asleep in his pod)
/* the Emerald Tiger: the same build in green and white, with gold armour trim where the orange stripes were */
export const EMERALD_PAL = { K: '#06240f', O: '#2fb34a', D: '#1b7a33', L: '#a6f27a', W: '#eafff0', E: '#c6ff3a', N: '#3a2a10' };

/* ---------- EMBER / AZURE, the baby dragon ----------
   K outline, R scales, r scale shade, C belly, Y horns, w wing, v wing shade, E eye, W eye shine */
const D_DOWN = art(`
  ................
  ...YK......KY...
  ...KYK....KYK...
  ....KRKKKKRK....
  ...KRRRRRRRRK...
  ..KRREWRRWERRK..
  ..KRRRRCCRRRRK..
  .KvKKRCKKCRKKvK.
  KwvvKRRRRRRKvvwK
  KwvvKRCCCCRKvvwK
  .KvKRrCCCCrRKvK.
  ..KKRrCCCCrRKK..
  ...KRRrCCrRRK...
  ...KRRKKKKRRK...
  ...KCCK..KCCK...
  ....KK....KK....
`);
const D_UP = art(`
  ................
  ...YK......KY...
  ...KYK....KYK...
  ....KRKKKKRK....
  ...KRRRRRRRRK...
  ..KRRRRrrRRRRK..
  ..KRRRRRRRRRRK..
  .KvKKRRrrRRKKvK.
  KwvvKRRRRRRKvvwK
  KwvvKRrRRrRKvvwK
  .KvKRRRRRRRRKvK.
  ..KKRRRRRRRRKK..
  ...KRRRrrRRRK...
  ...KRRKRRKRRK...
  ...KCCKRRKCCK...
  ....KK.KK.KK....
`);
const D_SIDE = art(`
  ................
  .........YK.....
  ........KYK.....
  ........KRKKK...
  .......KRRRRRK..
  .......KRRREWRK.
  .......KRRRRRRRK
  ...KK..KRRCCCKK.
  ..KwwK.KRRCCK...
  .KwvvwKRRRCCK...
  KwvvvKRRRCCCK...
  .KKKKRRRRCCK....
  .KRRRRRrrCCK....
  KRK.KRRKKRRK....
  KK..KCCK.KCCK...
  .....KK...KK....
`);
function dragonFrames(base, dir) {
  /* the wings beat: frame 1 folds them up a pixel, frame 2 opens them down a pixel */
  const up = base.slice(), dn = base.slice();
  if (dir === 'side') {
    up[8] = '..KvvK.KRRCCK...'; up[9] = '.KwwwvKRRRCCK...'; up[10] = '.KwvvKRRRCCCK...';
    dn[8] = '.......KRRCCK...'; dn[9] = '...KKKKRRRCCK...'; dn[10] = '.KwvvvKRRCCCK...'; dn[11] = 'KwvvKKRRRCCK....';
  } else {
    up[7] = 'KvvKKRCKKCRKKvvK'.replace('CKKC', dir === 'up' ? 'RrrR' : 'CKKC'); up[8] = 'KwvvKRRRRRRKvvwK'; up[9] = '.KvvKRCCCCRKvvK.'.replace('CCCC', dir === 'up' ? 'rRRr' : 'CCCC'); up[10] = '..KKRrCCCCrRKK..'.replace('CCCC', dir === 'up' ? 'RRRR' : 'CCCC');
    dn[7] = '..KKKRCKKCRKKK..'.replace('CKKC', dir === 'up' ? 'RrrR' : 'CKKC'); dn[9] = 'KwvvKRCCCCRKvvwK'.replace('CCCC', dir === 'up' ? 'rRRr' : 'CCCC'); dn[10] = 'KvvKRrCCCCrRKvvK'.replace('CCCC', dir === 'up' ? 'RRRR' : 'CCCC');
  }
  return [base, up, dn];
}
export const DRAGON = { down: dragonFrames(D_DOWN, 'down'), up: dragonFrames(D_UP, 'up'), side: dragonFrames(D_SIDE, 'side') };
export const DRAGON_PAL = {
  red: { K: '#2a0510', R: '#e8302a', r: '#a3141e', C: '#ffd9a0', Y: '#ffd23a', w: '#ff7a3a', v: '#b8301e', E: INK, W: '#ffffff' },
  blue: { K: '#06102e', R: '#2f7cf0', r: '#1a48a8', C: '#c8f4ff', Y: '#e6f0ff', w: '#6fe0ff', v: '#2a6ad0', E: INK, W: '#ffffff' },
};

/* ---------- LUMI, the glowing octopus ----------
   K outline, L glow body, l highlight, D shade, W eye white, E pupil, M spots */
const O_FRONT = art(`
  ................
  .....KKKKKK.....
  ....KLLlLLLK....
  ...KLlllLMLLK...
  ...KLLlLLLLLK...
  ..KLMLLLLLLMLK..
  ..KLWWELLWWELK..
  ..KLWWELLWWELK..
  ..KLLLLDDLLLLK..
  ...KLLLLLLLLK...
  ..KLKLLDDLLKLK..
  .KLKLKLLLLKLKLK.
  .KLKLKLKKLKLKLK.
  KLK.KLK..KLK.KLK
  KK..KK....KK..KK
  ................
`);
const O_BACK = remap(O_FRONT.slice(), {}).map((r, i) => (i === 6 || i === 7 ? '..KLLLLLLLLLLK..' : i === 8 ? '..KLLMLLLLMLLK..' : r));
const O_SIDE = art(`
  ................
  ......KKKKK.....
  .....KLLlLLK....
  ....KLlllLLLK...
  ...KLLlLLLMLLK..
  ...KLMLLLLLLLK..
  ...KLLLLLLWWEK..
  ...KLLLLLLWWEK..
  ...KLLLLLDDLLK..
  ....KLLLLLLLK...
  ...KLKLLDDLKLK..
  ..KLKLKLLKLKLK..
  .KLKLKLKKLKLK...
  KLK.KLK.KLK.....
  KK..KK..KK......
  ................
`);
function octoFrames(base) {
  const a = base.slice(), b = base.slice();
  a[11] = base[11]; a[12] = base[12].replace(/^\./, 'K').slice(0, 16); a[13] = '.KLK.KLKKLK.KLK.'; a[14] = '.KK..KK..KK..KK.';
  b[13] = 'KLK..KLKKLK..KLK'; b[14] = 'K.K..KK..KK..K.K';
  return [base, a, b];
}
export const OCTO = { down: octoFrames(O_FRONT), up: octoFrames(O_BACK), side: [O_SIDE, O_SIDE, O_SIDE] };
/* LUMI shimmers: these palettes are cycled every few frames */
export const OCTO_PALS = [
  { K: '#140a30', L: '#4fe0e8', l: '#d8fffb', D: '#2a86c8', W: '#ffffff', E: INK, M: '#c08cff' },
  { K: '#140a30', L: '#5fc8f8', l: '#e0f4ff', D: '#3a6ad8', W: '#ffffff', E: INK, M: '#7ff0d0' },
  { K: '#140a30', L: '#8a9cff', l: '#ece6ff', D: '#5a4ad8', W: '#ffffff', E: INK, M: '#4fe8e0' },
  { K: '#140a30', L: '#b48cff', l: '#f2e8ff', D: '#7040d0', W: '#ffffff', E: INK, M: '#8ff0ff' },
  { K: '#140a30', L: '#8a9cff', l: '#ece6ff', D: '#5a4ad8', W: '#ffffff', E: INK, M: '#4fe8e0' },
  { K: '#140a30', L: '#5fc8f8', l: '#e0f4ff', D: '#3a6ad8', W: '#ffffff', E: INK, M: '#7ff0d0' },
];

/* ---------- Enya, riding the Emerald Tiger ----------
   Her top half sits on the tiger's back like yours does on your companion.
   H golden hair, h hair shine, S skin, E green eyes, F freckle/tattoo green, G outfit green,
   g outfit shade, Y gold trim, D diamond */
export const ENYA_TOP = {
  down: art(`
    ................
    .....KKKKKK.....
    ....KHHHHHHK....
    ...KHhHHHHHHK...
    ..KHHHHHHHHHHK..
    ..KHHSSSSSSHHK..
    ..KHSESSSSESHK..
    ..KHSSFSSSSSHK..
    .KHHKSSSSSSKHHK.
    .KHHKGYDDYGKHHK.
    .KHKSKGGGGKSKHK.
  `),
  up: art(`
    ................
    .....KKKKKK.....
    ....KHHHHHHK....
    ...KHHHHhHHHK...
    ..KHHHHHHHHHHK..
    ..KHHHHHHHHHHK..
    ..KHHHHhHHHHHK..
    ..KHHHHHHHHHHK..
    .KHHHHHHHHHHHHK.
    .KHKHHHHHHHHKHK.
    .KGKSKHHHHKSKGK.
  `),
  side: art(`
    ................
    ......KKKKK.....
    ....KKHHHHHK....
    ...KHHHHhHHHK...
    ..KHHHHHHHHHK...
    ..KHHHHHSSSSK...
    .KHHHHHSSSESK...
    .KHHHHHSFSSSK...
    KHHKHHKKSSSK....
    KHKKHKGYDYK.....
    .K.KHKSGGGK.....
  `),
};
export const ENYA_PAL = { K: '#1a0c08', H: '#f0b440', h: '#ffe08a', S: '#f2c08e', E: '#2fd85a', F: '#1fae4a', G: '#1f6b34', g: '#134a22', Y: '#ffcf3a', D: '#ffffff' };

/* ---------- people of Bloomhaven ---------- */
/* Sprig, the garden robot: M metal, m metal shade, C eye glow, G leaf, Y button, d tread */
const SPRIG_DOWN = art(`
  ........G.......
  .......GGK......
  ........K.......
  .....KKKKKKK....
  ....KMMMMMMMK...
  ....KMKKKKKMK...
  ....KMKCCCKMK...
  ....KMKKKKKMK...
  ....KmMMMMMmK...
  .....KKKKKKK....
  ....KmMMMMMmK...
  ...KMKMMYMMKMK..
  ...KK.KMMMK.KK..
  .....KKKKKKK....
  .....KdKdKdK....
  .....KKKKKKK....
`);
const SPRIG_UP = SPRIG_DOWN.map((r, i) => (i === 6 ? '....KMKKKKKMK...' : i === 11 ? '...KMKMMMMMKMK..' : r));
const SPRIG_SIDE = art(`
  ........G.......
  .......GGK......
  ........K.......
  .....KKKKKKK....
  ....KMMMMMMMK...
  ....KMMMMKKKK...
  ....KMMMMKCCK...
  ....KMMMMKKKK...
  ....KmMMMMMmK...
  .....KKKKKKK....
  .....KmMMMmK....
  .....KMMMMMK....
  .....KMMYMMK....
  .....KKKKKKK....
  .....KdKdKdK....
  .....KKKKKKK....
`);
export const SPRIG = { down: [SPRIG_DOWN, SPRIG_DOWN, SPRIG_DOWN], up: [SPRIG_UP, SPRIG_UP, SPRIG_UP], side: [SPRIG_SIDE, SPRIG_SIDE, SPRIG_SIDE] };
export const SPRIG_PAL = { K: INK, M: '#d8d0f0', m: '#9a8fc4', C: '#5ff2ff', G: '#5fe07a', Y: '#ffd23a', d: '#4a4266' };

/* Bloomkin, the garden folk: round, with a leafy tuft. B body, b shade, F leaf, W eye, E pupil */
const BLOOM_DOWN = art(`
  ................
  ......F..F......
  .....FFKKFF.....
  ......KFFK......
  .....KKKKKK.....
  ....KBBBBBBK....
  ...KBBBBBBBBK...
  ...KBWEBBWEBK...
  ...KBWEBBWEBK...
  ...KBBBbbBBBK...
  ...KbBBBBBBbK...
  ..KbKBBBBBBKbK..
  ...KKbBBBBbKK...
  ....KbbKKbbK....
  ....KKK..KKK....
  ................
`);
const BLOOM_UP = BLOOM_DOWN.map((r, i) => (i === 7 || i === 8 ? '...KBBBBBBBBK...' : i === 9 ? '...KBBBBBBBBK...' : r));
const BLOOM_SIDE = art(`
  ................
  .......F..F.....
  ......FFKKFF....
  .......KFFK.....
  ......KKKKKK....
  .....KBBBBBBK...
  ....KBBBBBBBBK..
  ....KBBBBBWEBK..
  ....KBBBBBWEBK..
  ....KBBBBBBbBK..
  ....KbBBBBBBbK..
  .....KBBBBbBK...
  .....KbBBBBbK...
  .....KbbKbbK....
  .....KKK.KKK....
  ................
`);
function bob(f) { return [f, f.slice(1).concat([f[0]]), f]; }
export const BLOOM = { down: bob(BLOOM_DOWN), up: bob(BLOOM_UP), side: bob(BLOOM_SIDE) };
export const BLOOM_PALS = {
  mint: { K: INK, B: '#7fe0b0', b: '#3fa880', F: '#ffb43a', W: '#ffffff', E: INK },
  lilac: { K: INK, B: '#c8a8ff', b: '#8a6ad8', F: '#5fe07a', W: '#ffffff', E: INK },
  sun: { K: INK, B: '#ffd25a', b: '#d8962a', F: '#3fc8a8', W: '#ffffff', E: INK },
  sky: { K: INK, B: '#7fd0ff', b: '#3f8ad8', F: '#ff7a5a', W: '#ffffff', E: INK },
  coral: { K: INK, B: '#ff9a6a', b: '#d0603a', F: '#7fe0b0', W: '#ffffff', E: INK },
};

/* the gate drone that guards the bridge: hovers, red light */
const DRONE = art(`
  ................
  ..KKK......KKK..
  .KwwwK....KwwwK.
  ..KKKKKKKKKKKK..
  ....KMMMMMMK....
  ...KMMRRRRMMK...
  ...KMRrrrrRMK...
  ...KMMRRRRMMK...
  ....KMMMMMMK....
  .....KmmmmK.....
  ......KKKK......
  ................
  .......ss.......
  ................
  ................
  ................
`);
export const DRONE_FR = { down: [DRONE, DRONE, DRONE], up: [DRONE, DRONE, DRONE], side: [DRONE, DRONE, DRONE] };
export const DRONE_PAL = { K: INK, M: '#a59fc4', m: '#6e6690', R: '#ff3b4a', r: '#ffc0c0', w: '#d8f4ff', s: '#00000040' };

/* LUMEN, the Light Keeper of the Whisperwood: a big soft moth with glowing feelers.
   K outline, W wings, s wing spots, F fuzz, c fuzz stripes, E eyes, A glowing feeler tips */
export const LUMEN = art(`
  ..A..........A..
  ...K........K...
  ....K......K....
  .KKK.KKKKKK.KKK.
  KWWWKFFFFFFKWWWK
  KWsWKFEFFEFKWsWK
  KWWWKFFFFFFKWWWK
  KWsWWKFFFFKWWsWK
  .KWWWKccccKWWWK.
  ..KWWKFFFFKWWK..
  ...KKKccccKKK...
  .....KFFFFK.....
  .....KccccK.....
  ......KFFK......
  .......KK.......
  ................
`);
export const LUMEN_PAL = { K: '#2a1a3a', W: '#f2e6ff', s: '#9a5ae0', F: '#ffe8b0', c: '#e0b870', E: INK, A: '#fff2a0' };

/* the jellies of the Jelly Jam: floating jellyfish folk who live for the beat.
   K outline, B bell, b rim, l shine, W eye white, E pupil, M mouth, T tentacles; DJ JIGGLE wears shades (G, g) */
const JELLY_TOP = art(`
  ................
  .....KKKKKK.....
  ...KKBBBBBBKK...
  ..KBBllBBBBBBK..
  ..KBlBBBBBBBBK..
  .KBBBBBBBBBBBBK.
  .KBBWEBBBBWEBBK.
  .KBBWEBBBBWEBBK.
  .KBBBBBMMBBBBBK.
  .KbbBBBBBBBBbbK.
  ..KbKbbKKbbKbK..
`);
const TENTS = [
  ['...T..T..T..T...', '...T..T..T..T...', '..T..T....T..T..', '..T...T..T...T..', '...T...TT...T...'],
  ['...T..T..T..T...', '..T...T..T...T..', '..T..T....T..T..', '...T..T..T..T...', '....T.T..T.T....'],
];
export const JELLY = TENTS.map((t) => JELLY_TOP.concat(t));
export const JELLY_DJ = JELLY.map((f) => f.map((r, i) => (i === 6 ? '.KBKKKKKKKKKKBK.' : i === 7 ? '.KBKgGKBBKgGKBK.' : r)));
const JELLY_BASE = { W: '#ffffff', E: INK, G: INK, g: '#8ff0ff' };
export const JELLY_PALS = {
  pink: { ...JELLY_BASE, K: '#6a1458', B: '#ff8ad8', b: '#d050a8', l: '#ffe0f6', M: '#6a1458', T: '#ffb8ea' },
  cyan: { ...JELLY_BASE, K: '#0a3a58', B: '#6ae8ff', b: '#2aa8d8', l: '#e0fbff', M: '#0a3a58', T: '#a8f4ff' },
  violet: { ...JELLY_BASE, K: '#2a1060', B: '#b48cff', b: '#7a50d8', l: '#f0e6ff', M: '#2a1060', T: '#d8c4ff' },
  gold: { ...JELLY_BASE, K: '#5a3a06', B: '#ffd25a', b: '#d89a2a', l: '#fff6c8', M: '#5a3a06', T: '#ffe8a0' },
  mint: { ...JELLY_BASE, K: '#0a4a30', B: '#7fe0b0', b: '#3fa880', l: '#e0fff0', M: '#0a4a30', T: '#b8f4d8' },
};

/* ---------- CODY, the wise (and cheeky) white cat ----------
   He walks on two legs and leans on his staff (the Dragon King's old pillar: it grows, shrinks to the size
   of an earbud for keeping in his ear, flies and fights on command, and weighs seven thousand kilos).
   W fur, w fur shade, P inner ear, N nose, E eyes, e pupils, M mouth, R his purple neckerchief,
   B staff wood, b wood shade, Y gold bands, y the star cap's glow, G/g frost-glass sunglasses */
function codyFrame(dir, step, shades, bare) {
  const p = painter(16, 16);
  const side = dir === 'side', up = dir === 'up';
  const sx = 14;                                                     // the staff, held upright in his right paw
  if (!bare) { p.line(sx, 2, sx, 15, 'B'); p.set(sx, 5, 'Y'); p.set(sx, 12, 'Y'); p.set(sx, 1, 'Y'); p.set(sx, 0, 'y'); }
  if (side) {
    p.line(4, 12, 2, 10, 'W'); p.line(2, 10, 2, 8, 'W'); p.set(3, 7, 'W');                  // tail, curling up behind
    p.ellipse(7.5, 11.2, 3.1, 2.9, 'W');                                                   // body
    p.rect(6, 13, 2, step === 1 ? 1 : 2, 'W'); p.rect(8, 13, 2, step === 2 ? 1 : 2, 'W');   // legs
    if (step === 1) p.set(5, 13, 'W'); if (step === 2) p.set(10, 13, 'W');
    if (bare) p.line(9, 10, 10, 12, 'W'); else p.line(9, 10, 13, 9, 'W');                  // arm out to the staff (or down)
    p.ellipse(8.2, 5.3, 4.6, 3.9, 'W');                                                    // head
    p.ellipse(11.6, 6.6, 1.6, 1.3, 'W');                                                   // muzzle
    p.poly([[5, 3], [5.5, -0.5], [8.5, 2]], 'W'); p.set(6, 1, 'P'); p.set(6, 2, 'P');       // the near ear
    p.poly([[9, 2], [10.5, -0.5], [11.5, 3]], 'w');                                        // the far ear
    p.rect(6, 9, 4, 1, 'R'); p.set(9, 10, 'R');                                            // neckerchief
    p.shade('W', 'w', -1, 1, 1);
    if (shades) { p.rect(9, 5, 3, 1, 'G'); p.set(10, 4, 'G'); p.set(8, 5, 'G'); p.set(10, 5, 'g'); }
    else { p.set(10, 5, 'E'); p.set(11, 5, 'e'); p.set(10, 4, 'K'); p.set(11, 4, 'K'); }
    p.set(12, 6, 'N'); p.set(11, 8, 'M'); p.set(12, 8, 'M');
  } else {
    if (up) { p.line(7, 14, 9, 12, 'W'); p.line(9, 12, 10, 9, 'W'); p.set(10, 8, 'W'); }   // tail, from behind
    else { p.line(3, 13, 1, 11, 'W'); p.set(1, 10, 'W'); }
    p.ellipse(6.5, 11.4, 3.5, 3, 'W');                                                     // body
    p.rect(4, 13, 2, step === 1 ? 1 : 2, 'W'); p.rect(7, 13, 2, step === 2 ? 1 : 2, 'W');   // feet
    p.rect(2, 10, 1, 2, 'W');                                                              // left paw on his hip
    if (bare) p.rect(10, 10, 1, 2, 'W'); else p.line(9, 10, 13, 9, 'W');                    // right arm out to the staff
    p.ellipse(6.5, 5.4, 5.3, 3.9, 'W');                                                    // head
    p.poly([[1.5, 3.5], [2, -0.5], [5, 2]], 'W'); p.poly([[8, 2], [11, -0.5], [11.5, 3.5]], 'W');   // ears
    if (!up) { p.set(2, 1, 'P'); p.set(2, 2, 'P'); p.set(3, 2, 'P'); p.set(10, 1, 'P'); p.set(10, 2, 'P'); p.set(9, 2, 'P'); }
    p.rect(4, 9, 5, 1, 'R'); if (!up) p.set(6, 10, 'R');                                    // neckerchief
    p.shade('W', 'w', 1, 1, 1);
    if (!up) {
      if (shades) { p.rect(3, 5, 7, 1, 'G'); p.set(3, 4, 'G'); p.set(4, 4, 'G'); p.set(8, 4, 'G'); p.set(9, 4, 'G'); p.set(4, 5, 'g'); p.set(8, 5, 'g'); p.set(6, 5, 'Y'); }
      else { p.set(4, 5, 'E'); p.set(8, 5, 'E'); p.set(5, 5, 'e'); p.set(9, 5, 'e'); p.set(4, 4, 'K'); p.set(5, 4, 'K'); p.set(8, 4, 'K'); p.set(9, 4, 'K'); }   // half-lidded, a sideways look
      p.set(6, 6, 'N'); p.set(5, 7, 'M'); p.set(7, 7, 'M');                                 // a little cat smile
    } else p.set(6, 3, 'w');
  }
  p.outline('K');
  if (!up) { p.set(0, side ? 7 : 6, 'w'); if (!side) p.set(13, 6, 'w'); }                  // whiskers poking out
  return p.rows();
}
const codyDir = (dir, shades, bare) => [0, 1, 2].map((s) => codyFrame(dir, s, shades, bare));
export const CODY = { down: codyDir('down'), up: codyDir('up'), side: codyDir('side') };
export const CODY_SHADES = { down: codyDir('down', true), up: CODY.up, side: codyDir('side', true) };
/* with his staff tucked away in his ear (or out doing the work) */
export const CODY_BARE = { down: codyDir('down', false, true), up: codyDir('up', false, true), side: codyDir('side', false, true) };
export const CODY_BARE_SHADES = { down: codyDir('down', true, true), up: CODY_BARE.up, side: codyDir('side', true, true) };
export const CODY_PAL = { K: '#2a1a3a', W: '#ffffff', w: '#c8bcdc', P: '#ff9ac0', N: '#ff6a9a', E: '#ffc23a', e: '#2a1a3a', M: '#2a1a3a', R: '#8a50e4', B: '#9a6232', b: '#5a3a1c', Y: '#ffd23a', y: '#fff6a0', G: '#14142a', g: '#8fd0ff' };

/* ---------- turtles: they roam about, and often carry something on their shells ----------
   S shell, s shell plates, r shell rim, L skin, E eye */
function turtleFrame(dir, step) {
  const p = painter(16, 16);
  if (dir === 'side') {
    p.rect(2, 12, 2, 2, 'L'); p.rect(9, 12, 2, 2, 'L');                                     // legs, walking
    if (step === 1) { p.rect(1, 12, 1, 1, 'L'); p.rect(11, 12, 1, 1, 'L'); }
    if (step === 2) { p.rect(4, 13, 1, 1, 'L'); p.rect(8, 13, 1, 1, 'L'); }
    p.set(1, 11, 'L');                                                                      // tail
    p.ellipse(13, 9.6, 1.9, 1.7, 'L'); p.rect(11, 10, 2, 2, 'L');                             // head and neck
    p.ellipse(7, 9, 5.6, 3.8, 'S'); p.rect(1, 9, 12, 3, '.'); p.rect(1, 9, 12, 2, 'S');      // the dome of the shell
    p.rect(1, 11, 12, 1, 'r');
    for (const [x, y] of [[4, 8], [7, 7], [10, 8], [5, 10], [9, 10]]) p.set(x, y, 's');
    p.shade('S', 's', 0, 1, 1);
    p.outline('K');
    p.set(13, 9, 'E'); p.set(14, 11, 'K');
  } else {
    const back = dir === 'up';
    p.rect(2, 12, 2, step === 1 ? 1 : 2, 'L'); p.rect(12, 12, 2, step === 2 ? 1 : 2, 'L');   // legs
    if (back) p.set(8, 14, 'L');                                                            // tail
    else { p.ellipse(8, 11.6, 2.2, 2, 'L'); }                                                // head, peeking out
    p.ellipse(8, 9, 6.2, 3.6, 'S'); p.rect(1, 9, 14, 3, '.'); p.rect(2, 9, 12, 2, 'S');
    if (!back) { p.ellipse(8, 11.6, 2.2, 2, 'L'); p.set(7, 11, 'E'); p.set(9, 11, 'E'); p.set(8, 13, 'K'); }
    p.rect(2, 11, 12, 1, 'r');
    if (!back) p.ellipse(8, 12, 2.1, 1.6, 'L');
    for (const [x, y] of [[5, 8], [8, 7], [11, 8], [8, 9]]) p.set(x, y, 's');
    if (!back) { p.set(7, 11, 'E'); p.set(9, 11, 'E'); p.set(7, 13, 'K'); p.set(8, 13, 'K'); p.set(9, 13, 'K'); }
    p.outline('K');
  }
  return p.rows();
}
const turtleDir = (d) => [0, 1, 2].map((s) => turtleFrame(d, s));
export const TURTLE = { down: turtleDir('down'), up: turtleDir('up'), side: turtleDir('side') };
export const TURTLE_PALS = {
  green: { K: '#0e2a14', S: '#3fae5a', s: '#1f6a34', r: '#e8d890', L: '#a8e07a', E: '#0e2a14' },
  purple: { K: '#1e0a3a', S: '#a060e0', s: '#5a2aa0', r: '#ffd6f4', L: '#b8f0a0', E: '#1e0a3a' },
  yellow: { K: '#3a2606', S: '#ffd23a', s: '#c8881a', r: '#fff6d0', L: '#b0e888', E: '#3a2606' },
};

/* ---------- the Dragon King's crab guards: R shell, r shade, W eyes, B spear shaft, Y spear tip ---------- */
function crabFrame(open) {
  const p = painter(16, 16);
  p.line(15, 1, 15, 15, 'B'); p.set(15, 0, 'Y'); p.set(15, 1, 'Y');
  for (const lx of [3, 5, 10, 12]) p.line(lx, 12, lx + (lx < 8 ? -2 : 2), 15, 'r');        // legs
  p.ellipse(7.5, 11, 5.2, 3.2, 'R');                                                        // body
  p.line(5, 9, 5, 5, 'r'); p.line(10, 9, 10, 5, 'r');                                       // eye stalks
  p.ellipse(5, 4.5, 1.3, 1.3, 'W'); p.ellipse(10, 4.5, 1.3, 1.3, 'W');
  p.ellipse(2, open ? 6 : 7, 2, 2, 'R'); p.ellipse(13, open ? 6 : 7, 2, 2, 'R');           // claws, snapping
  if (open) { p.set(1, 4, 'R'); p.set(3, 4, 'R'); p.set(12, 4, 'R'); p.set(14, 4, 'R'); }
  p.shade('R', 'r', 0, 1, 1);
  p.outline('K');
  p.set(5, 4, 'K'); p.set(10, 4, 'K');
  p.line(6, 12, 9, 12, 'K');
  return p.rows();
}
export const CRAB = [crabFrame(false), crabFrame(true)];
export const CRAB_PALS = {
  red: { K: '#2a0808', R: '#ff6a4a', r: '#b83a2a', W: '#ffffff', B: '#8a5a2c', Y: '#ffd23a' },
  coral: { K: '#2a0818', R: '#ff8ab0', r: '#c0507a', W: '#ffffff', B: '#8a5a2c', Y: '#c8f4ff' },
};

/* ---------- the dream: two kids on a summer's day, and the neighbour whose roof the ball keeps landing on ----------
   H hair, h hair shine, S skin, E eyes, T top, t top shade, D shorts / skirt, B shoes, L ice lolly */
function kidFrame(girl, pose) {
  const p = painter(16, 16);
  const sit = pose === 'sit', swing = pose === 'swing', run = pose === 'run';
  if (girl) p.poly([[4, 3], [3, 9], [4, 12], [7, 10], [7, 3]], 'H');                        // her hair, down her back
  else p.rect(5, 1, 3, 5, 'H');                                                             // his, short at the back
  if (sit) { p.rect(5, 12, 6, 2, 'D'); p.rect(9, 13, 4, 1, 'S'); p.rect(12, 13, 2, 2, 'B'); p.rect(10, 13, 1, 1, 'S'); }
  else {
    p.rect(6, 12, 2, run ? 2 : 3, 'S'); p.rect(9, 12, 2, run ? 3 : 3, 'S');
    if (run) { p.set(5, 13, 'S'); p.rect(4, 14, 2, 1, 'B'); } else p.rect(5, 14, 3, 1, 'B');
    p.rect(9, 14, 3, 1, 'B');
    p.rect(5, 10, 7, girl ? 3 : 2, 'D');
  }
  p.rect(5, 7, 7, 4, 'T');                                                                  // top
  if (swing) { p.line(11, 7, 14, 3, 'S'); p.set(14, 2, 'S'); }                              // an arm up, hitting the ball
  else if (sit) { p.line(11, 8, 12, 6, 'S'); p.set(12, 5, 'L'); p.set(12, 4, 'L'); }         // holding an ice lolly
  else p.line(11, 8, 12, 11, 'S');
  p.ellipse(8.5, 4, 3.4, 3.4, 'S');                                                         // head
  p.poly(girl ? [[5, 3], [6, 0.5], [11, 0.5], [12.5, 3], [11, 2.5], [8, 3]] : [[5, 3.5], [6, 0.5], [11, 0.5], [12.5, 2.5], [10, 2], [7, 3]], 'H');
  if (girl) p.rect(5, 2, 1, 5, 'H');
  p.shade('T', 't', 0, 1, 1);
  p.outline('K');
  p.set(10, 4, 'E'); p.set(11, 5, 'M');
  if (girl) p.set(12, 2, 'F');                                                              // a shamrock clip, even then
  return p.rows();
}
export const KID = { hero: {}, enya: {} };
for (const pose of ['stand', 'sit', 'swing', 'run']) { KID.hero[pose] = kidFrame(false, pose); KID.enya[pose] = kidFrame(true, pose); }
export const KID_HERO_PAL = { K: INK, H: '#4a2c1c', S: '#ffd0a6', E: '#0f6e3e', M: '#c0606a', T: '#2fc6b4', t: '#1b8f8c', D: '#3a4a8a', B: '#f6f2ff', L: '#ff6ab0' };
export const KID_ENYA_PAL = { K: INK, H: '#f0b440', S: '#f2c08e', E: '#2fd85a', M: '#c0606a', T: '#3fae5a', t: '#1f6b34', D: '#1f6b34', B: '#ff8ad8', L: '#ffd25a', F: '#3ae070' };
/* MR NOLAN, at his upstairs window: bald on top, two white tufts, specs, and a very red face when he's cross */
export const NOLAN = art(`
  ................
  .....KKKKKK.....
  ...KKSSSSSSKK...
  ..KWKSSSSSSKWK..
  ..KWSKKSSKKSWK..
  ..KSGGGSSGGGSK..
  ..KSGEGSSGEGSK..
  ..KSSSSNNSSSSK..
  ...KSSKKKKSSK...
  ....KSSSSSSK....
  ...KVVVKKVVVK...
  ..KVVVVTTVVVVK..
`);
export const NOLAN_PAL = { K: INK, S: '#ffc8a0', W: '#f6f2ff', G: '#2a2a3a', E: '#ffffff', N: '#e89070', V: '#6a4a8a', T: '#f6f2ff' };
export const NOLAN_CROSS = { ...NOLAN_PAL, S: '#ff8a7a', N: '#e85a5a' };

/* the companions, by species, for walking behind you (or carrying you) */
export const COMPANION_ART = {
  tiger: { frames: TIGER, pal: () => TIGER_PAL },
  dragon: { frames: DRAGON, pal: (v) => DRAGON_PAL[v || 'red'] },
  octo: { frames: OCTO, pal: (v, t) => OCTO_PALS[Math.floor((t || 0) / 8) % OCTO_PALS.length] },
};
