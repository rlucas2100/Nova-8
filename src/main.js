/* Cosmic Castaways on the NOVA-8. Put <div data-nova8></div> in a page and load castaways.js
   (type="module") and castaways.css: the console appears inside the div.
   <canvas data-castaways-sprite="tiger"></canvas> (names from src/art/battlers.js, comma-separated
   for several side by side) is filled with that character's pixel art, for the page's cast list.
   <div data-castaways-soundboard></div> becomes the soundboard: every tune and sound effect. */
import './console/console.css';
import { mountConsole } from './console/shell.js';
import { mountSoundboard } from './console/soundboard.js';
import { spr } from './engine/pixel.js';
import { BATTLERS } from './art/battlers.js';

function sprites() {
  document.querySelectorAll('canvas[data-castaways-sprite]').forEach((c) => {
    const imgs = c.dataset.castawaysSprite.split(',').map((n) => BATTLERS[n.trim()]).filter(Boolean).map((b) => spr(b.rows, b.pal, c.dataset.flip === '1'));
    if (!imgs.length) return;
    const gap = 4, w = imgs.reduce((s, i) => s + i.width, 0) + gap * (imgs.length - 1), h = Math.max(...imgs.map((i) => i.height));
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    let x = 0;
    for (const im of imgs) { g.drawImage(im, x, h - im.height); x += im.width + gap; }
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
