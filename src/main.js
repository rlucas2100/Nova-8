/* Cosmic Castaways on the NOVA-8. Put <div data-nova8></div> in a page and load castaways.js
   (type="module") and castaways.css: the console appears inside the div.
   <canvas data-castaways-sprite="tiger"></canvas> (names from src/art/battlers.js, or one of the
   walking characters in WALKERS below; comma-separated for several side by side) is filled with that
   character's pixel art, for the page's cast list.
   <div data-castaways-soundboard></div> becomes the soundboard: every tune and sound effect. */
import './console/console.css';
import { mountConsole } from './console/shell.js';
import { mountSoundboard } from './console/soundboard.js';
import { spr } from './engine/pixel.js';
import { BATTLERS } from './art/battlers.js';
import * as CH from './art/chars.js';

/* characters with no battle sprite: their 16 px walking sprite, drawn at twice the size so they stand
   as tall as the 32 px battle sprites */
const WALKERS = {
  hero: [CH.HERO.down[0], CH.HERO_PAL], heroFury: [CH.HERO.down[0], CH.HERO_PAL_FURY],
  lumen: [CH.LUMEN, CH.LUMEN_PAL], dj: [CH.JELLY_DJ[0], CH.JELLY_PALS.violet], jelly: [CH.JELLY[0], CH.JELLY_PALS.pink],
  turtleGreen: [CH.TURTLE.side[0], CH.TURTLE_PALS.green], turtlePurple: [CH.TURTLE.side[0], CH.TURTLE_PALS.purple], turtleYellow: [CH.TURTLE.side[0], CH.TURTLE_PALS.yellow],
  crab: [CH.CRAB[0], CH.CRAB_PALS.red],
};

function sprites() {
  document.querySelectorAll('canvas[data-castaways-sprite]').forEach((c) => {
    const flip = c.dataset.flip === '1';
    const imgs = c.dataset.castawaysSprite.split(',').map((n) => n.trim()).map((n) => {
      if (BATTLERS[n]) return { im: spr(BATTLERS[n].rows, BATTLERS[n].pal, flip), s: 1 };
      if (WALKERS[n]) return { im: spr(WALKERS[n][0], WALKERS[n][1], flip), s: 2 };
      return null;
    }).filter(Boolean);
    if (!imgs.length) return;
    const gap = 4, w = imgs.reduce((s, i) => s + i.im.width * i.s, 0) + gap * (imgs.length - 1), h = Math.max(...imgs.map((i) => i.im.height * i.s));
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    let x = 0;
    for (const { im, s } of imgs) { g.drawImage(im, x, h - im.height * s, im.width * s, im.height * s); x += im.width * s + gap; }
    c.style.setProperty('--sw', w);
    c.style.setProperty('--sh', h);
    c.classList.add('is-drawn');
  });
}

function boot() {
  document.querySelectorAll('[data-nova8]').forEach((el) => { if (!el.nova8) mountConsole(el); });
  document.querySelectorAll('[data-castaways-soundboard]').forEach((el) => { if (!el.dataset.ready) { el.dataset.ready = '1'; mountSoundboard(el); } });
  sprites();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
