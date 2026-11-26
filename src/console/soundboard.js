/* The soundboard on the page: every tune in the game (click to play, click again to stop) and a
   grid of sound-effect pads, each with a little pixel picture from the game. It uses the console's
   own sound chip, so it shows (and can take over) whatever the game is playing.
   <div data-castaways-soundboard></div> */
import { spr } from '../engine/pixel.js';
import { unlockAudio, boardPlay, boardStop, nowPlaying, onMusicChange } from '../engine/audio.js';
import { TRACKS } from '../engine/music.js';
import { SOUNDS } from '../engine/soundlist.js';
import * as CH from '../art/chars.js';
import { BATTLERS } from '../art/battlers.js';
import { GEM, COIN, DIAMOND, GEM_PAL, PART_ART, PART_PAL } from '../art/items.js';

const WHERE = {
  title: 'title screen', intro: 'the crash', town: 'Bloomhaven', town2: 'Bloomhaven, taking turns', select: 'choosing a companion',
  shop: "Mossa's stall", wilds: 'the Crimson Wilds', wilds2: 'the Wilds, taking turns', ride: 'riding your companion',
  enya: "Enya's echo rides in", nest: 'near the scrap nest', battle: 'wild battles', battle2: 'wild battles', boss: 'the boss fight',
  victory: 'after a win', chapter: 'end of Chapter 1', jungle: 'the Whisperwood', jungle2: 'the Whisperwood, taking turns',
  groove: 'the Jelly Jam', groove2: 'the Jelly Jam, taking turns', vision: 'visions beyond the veil', ghoul: 'ghoul battles',
};
const battler = (n) => ({ rows: BATTLERS[n].rows, pal: BATTLERS[n].pal });
const ICONS = {
  coin: { rows: COIN, pal: GEM_PAL.gold }, emerald: { rows: GEM, pal: GEM_PAL.emerald }, sapphire: { rows: GEM, pal: GEM_PAL.sapphire },
  ruby: { rows: GEM, pal: GEM_PAL.ruby }, diamond: { rows: DIAMOND, pal: GEM_PAL.diamond },
  jump: { rows: CH.HERO.down[1], pal: CH.HERO_PAL }, rawr: { rows: CH.TIGER.down[0], pal: CH.TIGER_PAL },
  puff: { rows: CH.DRAGON.down[1], pal: CH.DRAGON_PAL.red }, blub: { rows: CH.OCTO.down[0], pal: CH.OCTO_PALS[2] },
  boing: { rows: CH.BLOOM.down[0], pal: CH.BLOOM_PALS.sun }, glorp: battler('glorp'), flitterfin: battler('flitterfin'),
  rustclaw: battler('rustclaw'), roar: { rows: CH.TIGER.side[1], pal: CH.TIGER_PAL }, claw: battler('tiger'),
  flame: battler('dragonRed'), frost: battler('dragonBlue'), hit: battler('thornback'), crit: battler('thornAlpha'),
  flash: { rows: CH.ENYA_TOP.down, pal: CH.ENYA_PAL }, heal: battler('octo'), levelup: { rows: CH.TIGER.down[1], pal: CH.TIGER_PAL },
  itemget: { rows: PART_ART.navcore, pal: PART_PAL }, joined: battler('enya'), encounter: battler('sporelet'), beam: { rows: CH.TIGER.down[0], pal: CH.TIGER_PAL }, ink: battler('octo'), wave: { rows: CH.OCTO.down[1], pal: CH.OCTO_PALS[4] }, crash: { rows: PART_ART.thruster, pal: PART_PAL }, save: { rows: CH.SPRIG.down[0], pal: CH.SPRIG_PAL },
  purr: { rows: CH.TIGER.down[1], pal: CH.TIGER_PAL }, lick: { rows: CH.TIGER.side[0], pal: CH.TIGER_PAL }, fury: { rows: CH.HERO.down[0], pal: CH.HERO_PAL_FURY },
  shatter: { rows: DIAMOND, pal: GEM_PAL.diamond }, rift: battler('enya'), memory: { rows: CH.HERO.down[0], pal: CH.HERO_PAL_SHIFT },
  tube: { rows: CH.LUMEN, pal: CH.LUMEN_PAL }, lumoth: battler('lumoth'), jadehop: battler('jadehop'), ghoul: battler('ghoul'),
  bopjelly: battler('bopjelly'), drumcap: battler('shroomboom'), scratch: { rows: CH.JELLY_DJ[0], pal: CH.JELLY_PALS.violet }, boom: battler('shroomboom'),
};

function el(tag, attrs = {}, kids = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else e.setAttribute(k, v); }
  for (const k of [].concat(kids)) if (k) e.append(k);
  return e;
}
function icon(name) {
  const ic = ICONS[name];
  const c = el('canvas', { class: 'sb-icon', 'aria-hidden': 'true' });
  if (!ic) return c;
  const img = spr(ic.rows, ic.pal);
  c.width = img.width; c.height = img.height;
  c.getContext('2d').drawImage(img, 0, 0);
  const scale = img.width <= 9 ? 3 : img.width <= 16 ? 2 : 1;
  c.style.width = img.width * scale + 'px';
  c.style.height = img.height * scale + 'px';
  return c;
}

export function mountSoundboard(root) {
  const title = el('b', { class: 'sb-title', text: 'Pick a tune, or tap a pad' });
  const where = el('span', { class: 'sb-where' });
  const stop = el('button', { type: 'button', class: 'sb-stop', text: '■ stop' });
  stop.hidden = true;
  const eq = el('span', { class: 'sb-eq', 'aria-hidden': 'true' }, Array.from({ length: 6 }, () => el('i')));
  const now = el('div', { class: 'sb-now', role: 'status', 'aria-live': 'polite' }, [eq, el('span', { class: 'sb-now-text' }, [title, where]), stop]);

  const trackBtns = new Map();
  const tracks = el('ol', { class: 'sb-tracks' }, TRACKS.map(([id, name], i) => {
    const b = el('button', { type: 'button', class: 'sb-track', 'aria-pressed': 'false' }, [
      el('span', { class: 'sb-num', text: String(i + 1).padStart(2, '0') }),
      el('span', { class: 'sb-name', text: name }),
      el('span', { class: 'sb-at', text: WHERE[id] || '' }),
    ]);
    b.addEventListener('click', () => {
      const np = nowPlaying();
      if (np && np.owner === 'board' && np.name === id) boardStop(); else boardPlay(id);
    });
    trackBtns.set(id, b);
    return el('li', {}, b);
  }));

  const pads = el('div', { class: 'sb-pads' }, SOUNDS.map(([id, name, play]) => {
    const b = el('button', { type: 'button', class: 'sb-pad', 'data-sfx': id }, [icon(id), el('span', { text: name })]);
    b.addEventListener('click', () => {
      unlockAudio();
      play();
      b.classList.remove('is-hit'); void b.offsetWidth; b.classList.add('is-hit');
      if (id === 'flash') {   // Enya's Diamond Flash shatters the page's rain from here too
        const r = b.getBoundingClientRect();
        document.dispatchEvent(new CustomEvent('matrix:burst', { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 } }));
      }
    });
    return b;
  }));

  root.textContent = '';
  root.append(el('div', { class: 'sb' }, [
    now,
    el('div', { class: 'sb-cols' }, [
      el('div', { class: 'sb-col' }, [el('p', { class: 'sb-head', text: 'soundtrack · ' + TRACKS.length + ' tunes' }), tracks]),
      el('div', { class: 'sb-col' }, [el('p', { class: 'sb-head', text: 'sound effects · ' + SOUNDS.length + ' pads' }), pads]),
    ]),
  ]));
  stop.addEventListener('click', () => boardStop());

  function show(np) {
    for (const [id, b] of trackBtns) {
      const on = !!np && np.track === id;
      b.setAttribute('aria-pressed', String(on && np.owner === 'board'));
      b.classList.toggle('is-game', on && np.owner === 'game');
    }
    const name = np ? (TRACKS.find((q) => q[0] === np.track) || [0, np.track])[1] : null;
    title.textContent = name ? name : 'Pick a tune, or tap a pad';
    where.textContent = np ? (np.owner === 'game' ? 'playing in the game' : 'on the soundboard') : '';
    stop.hidden = !(np && np.owner === 'board');
    root.classList.toggle('is-playing', !!np);
  }
  onMusicChange(show);
  show(nowPlaying());
}
