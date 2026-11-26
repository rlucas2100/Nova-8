/* The NOVA-8: a handheld console drawn in HTML and CSS, with a 160 x 144 pixel screen, a D-pad,
   A and B, SELECT and START. Its buttons work with a mouse or touch, the keyboard works while the
   console has focus, and a gamepad works any time. Underneath it: shells to choose from, screen
   colours, a backdrop, a sound switch and a big-screen button. */
import { W, H } from '../engine/pixel.js';
import { createInput, KEYS } from '../engine/input.js';
import { unlockAudio, setSound, pauseAudio, setGamePaused, sfx, musicBeat } from '../engine/audio.js';
import { Game, readJSON, writeJSON } from '../game/game.js';
import { Boot } from './boot.js';

const PREFS = 'cosmic-castaways.console.v1';
export const SKINS = [
  { id: 'tiger', label: 'Tiger' },
  { id: 'ruby', label: 'Ruby dragon' },
  { id: 'sapphire', label: 'Sapphire dragon' },
  { id: 'lumi', label: 'Glow octopus' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'cosmic', label: 'Cosmic' },
  { id: 'matrix', label: 'Matrix' },
];
const SCREENS = [['colour', 'Colour'], ['classic', 'Classic green'], ['pocket', 'Pocket grey'], ['violet', 'Violet']];
const BACKDROPS = [['kirra', 'Planet Kirra'], ['stars', 'Starfield'], ['none', 'None']];

function el(tag, attrs = {}, kids = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (v !== null && v !== undefined) e.setAttribute(k, v);
  }
  for (const k of [].concat(kids)) if (k) e.append(k);
  return e;
}

export function mountConsole(root) {
  const prefs = Object.assign({ skin: 'tiger', backdrop: 'kirra', sound: true, speed: 1 }, readJSON(PREFS) || {});
  if (!SKINS.some((s) => s.id === prefs.skin)) prefs.skin = 'tiger';
  if (![1, 3, 5].includes(prefs.speed)) prefs.speed = 1;
  setSound(prefs.sound);
  const savePrefs = () => writeJSON(PREFS, prefs);

  /* ---------- build the console ---------- */
  const canvas = el('canvas', { width: W, height: H, class: 'n8-canvas', 'aria-hidden': 'true' });
  const overlay = el('div', { class: 'n8-overlay' }, [
    el('span', { class: 'n8-play', 'aria-hidden': 'true' }),
    el('b', { class: 'n8-ov-title', text: 'Press to play' }),
    el('span', { class: 'n8-ov-keys', text: 'WASD / arrows · Space = A · K = B · Esc = Start' }),
  ]);
  const btn = (name, label, cls) => el('button', { type: 'button', class: 'n8-btn ' + cls, 'data-btn': name, tabindex: '-1', 'aria-label': label }, [el('span', { text: name === 'a' || name === 'b' ? name.toUpperCase() : '' })]);
  const dpad = el('div', { class: 'n8-dpad', 'aria-hidden': 'true' });
  const CROSS = 'M35 9Q35 4 40 4H60Q65 4 65 9V35H91Q96 35 96 40V60Q96 65 91 65H65V91Q65 96 60 96H40Q35 96 35 91V65H9Q4 65 4 60V40Q4 35 9 35H35Z';
  dpad.innerHTML = '<svg viewBox="0 0 100 100" focusable="false">' +
    '<path class="n8-cross-shadow" d="' + CROSS + '" transform="translate(0 5)"/>' +
    '<path class="n8-cross" d="' + CROSS + '"/>' +
    '<rect class="n8-arm n8-arm-up" x="37" y="6" width="26" height="29" rx="3"/><rect class="n8-arm n8-arm-down" x="37" y="65" width="26" height="29" rx="3"/>' +
    '<rect class="n8-arm n8-arm-left" x="6" y="37" width="29" height="26" rx="3"/><rect class="n8-arm n8-arm-right" x="65" y="37" width="29" height="26" rx="3"/>' +
    '<path class="n8-arrow" d="M50 12L57 22H43Z M50 88L43 78H57Z M12 50L22 43V57Z M88 50L78 57V43Z"/>' +
    '<circle class="n8-dimple" cx="50" cy="50" r="9"/>' +
    '<path class="n8-cross-shine" d="M39 8H61M8 39V44"/></svg>';
  const aBtn = btn('a', 'A button', 'n8-a'), bBtn = btn('b', 'B button', 'n8-b');
  const startBtn = btn('start', 'Start', 'n8-pill'), selectBtn = btn('select', 'Select', 'n8-pill');
  const led = el('i', { class: 'n8-led', 'aria-hidden': 'true' });
  const n8 = el('div', {
    class: 'n8', tabindex: '0', role: 'application', 'data-skin': prefs.skin,
    'aria-label': 'NOVA-8 handheld console playing Cosmic Castaways, a pixel-art adventure. Click here, then play with W A S D or the arrow keys to move, Space or J for A, K for B, Escape for Start and Shift for Select.',
  }, [
    el('span', { class: 'n8-glow', 'aria-hidden': 'true' }),
    el('span', { class: 'n8-ear n8-ear-l', 'aria-hidden': 'true' }),
    el('span', { class: 'n8-ear n8-ear-r', 'aria-hidden': 'true' }),
    el('div', { class: 'n8-shell' }, [
      el('div', { class: 'n8-top', 'aria-hidden': 'true' }, [el('span', { class: 'n8-switch' }), el('span', { class: 'n8-model', text: 'NOVA-8' })]),
      el('div', { class: 'n8-bezel' }, [
        el('div', { class: 'n8-bezel-top', 'aria-hidden': 'true' }, [led, el('span', { text: 'POWER' }), el('em', { text: 'COLOUR PIXEL SCREEN' })]),
        el('div', { class: 'n8-screen' }, [canvas, el('span', { class: 'n8-scan', 'aria-hidden': 'true' }), overlay]),
      ]),
      el('div', { class: 'n8-brand', 'aria-hidden': 'true' }, [el('b', { text: 'NOVA' }), el('i', { text: '-8' }), el('small', { text: 'pocket adventure system' })]),
      el('div', { class: 'n8-controls' }, [
        dpad,
        el('div', { class: 'n8-ab' }, [bBtn, aBtn]),
      ]),
      el('div', { class: 'n8-meta' }, [
        el('label', { class: 'n8-pill-wrap' }, [selectBtn, el('span', { text: 'SELECT', 'aria-hidden': 'true' })]),
        el('label', { class: 'n8-pill-wrap' }, [startBtn, el('span', { text: 'START', 'aria-hidden': 'true' })]),
      ]),
      el('div', { class: 'n8-speaker', 'aria-hidden': 'true' }, Array.from({ length: 6 }, () => el('i'))),
    ]),
  ]);
  const stage = el('div', { class: 'n8-stage', 'data-backdrop': prefs.backdrop }, [el('span', { class: 'n8-backdrop', 'aria-hidden': 'true' }), n8]);

  /* the switches underneath */
  const group = (label, items) => el('div', { class: 'n8-tool', role: 'group', 'aria-label': label }, [el('span', { class: 'n8-tool-label', text: label }), ...items]);
  const skinBtns = SKINS.map((s) => el('button', { type: 'button', class: 'n8-swatch', 'data-skin': s.id, 'aria-label': s.label + ' shell', title: s.label, 'aria-pressed': String(s.id === prefs.skin) }));
  const screenSel = el('select', { class: 'n8-select', 'aria-label': 'Screen colours' }, SCREENS.map(([v, l]) => el('option', { value: v, text: l })));
  const backSel = el('select', { class: 'n8-select', 'aria-label': 'Backdrop' }, BACKDROPS.map(([v, l]) => el('option', { value: v, text: l })));
  backSel.value = prefs.backdrop;
  const soundBtn = el('button', { type: 'button', class: 'n8-chip', 'aria-pressed': String(prefs.sound) }, [el('span', { text: prefs.sound ? '♪ sound on' : '♪ sound off' })]);
  const bigBtn = el('button', { type: 'button', class: 'n8-chip', title: 'Full screen' }, [el('span', { text: '⛶ big screen' })]);
  /* fast-forward: the game runs 1, 3 or 5 times as fast (handy for testing; F does the same) */
  const speedText = () => '» speed ' + prefs.speed + '×';
  const speedBtn = el('button', { type: 'button', class: 'n8-chip', title: 'Game speed: 1×, 3× or 5× (or press F)', 'aria-pressed': String(prefs.speed > 1) }, [el('span', { text: speedText() })]);
  const tools = el('div', { class: 'n8-tools' }, [
    group('shell', skinBtns),
    group('screen', [screenSel]),
    group('backdrop', [backSel]),
    el('div', { class: 'n8-tool' }, [soundBtn, speedBtn, document.fullscreenEnabled ? bigBtn : null]),
  ]);
  const wrap = el('div', { class: 'n8-wrap' }, [stage, tools]);
  root.textContent = '';
  root.append(wrap);

  /* ---------- the game ---------- */
  const input = createInput();
  const game = new Game(canvas, input, {
    burst(x, y) {   // Enya's Diamond Flash also shatters the page's Matrix rain
      const r = canvas.getBoundingClientRect();
      document.dispatchEvent(new CustomEvent('matrix:burst', { detail: { x: r.left + (x / W) * r.width, y: r.top + (y / H) * r.height } }));
    },
    screen(name) { screenSel.value = name; },
  });
  screenSel.value = game.settings.screen;
  game.speed = prefs.speed;
  function cycleSpeed() {
    prefs.speed = { 1: 3, 3: 5, 5: 1 }[prefs.speed] || 1;
    game.speed = prefs.speed;
    speedBtn.firstChild.textContent = speedText();
    speedBtn.setAttribute('aria-pressed', String(prefs.speed > 1));
    savePrefs();
    sfx.select();
    if (!running) game.draw();
  }
  const boot = new Boot(game);
  game.push(boot);

  /* ---------- input: keyboard ---------- */
  n8.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const top = game.top;
    if (top && top.textInput && started) {   // typing a name
      if (e.key.length === 1 && /[a-z\- ]/i.test(e.key)) { top.typeChar(e.key); e.preventDefault(); return; }
      if (e.key === 'Backspace') { top.typeChar('\b'); e.preventDefault(); return; }
      if (e.key === 'Enter') { top.typeChar('\n'); e.preventDefault(); return; }
    }
    if (e.code === 'KeyF') { e.preventDefault(); if (!e.repeat) cycleSpeed(); return; }   // fast-forward
    const b = KEYS[e.code];
    if (!b) return;
    e.preventDefault();
    play();
    if (!e.repeat) input.down(b, 'k:' + e.code);
  });
  n8.addEventListener('keyup', (e) => { const b = KEYS[e.code]; if (b) { input.up(b, 'k:' + e.code); e.preventDefault(); } });

  /* ---------- input: the on-screen buttons ---------- */
  for (const b of [aBtn, bBtn, startBtn, selectBtn]) {
    const name = b.dataset.btn;
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (err) {}
      n8.focus({ preventScroll: true });
      play();
      input.down(name, 'p' + e.pointerId);
    });
    const up = (e) => input.up(name, 'p' + e.pointerId);
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
    b.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  let dpadId = null, dpadDir = null;
  const dpadSet = (e) => {
    const r = dpad.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) < r.width * 0.12 ? dpadDir : Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    if (d !== dpadDir) { if (dpadDir) input.up(dpadDir, 'dpad'); dpadDir = d; if (d) input.down(d, 'dpad'); }
  };
  dpad.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try { dpad.setPointerCapture(e.pointerId); } catch (err) {}
    n8.focus({ preventScroll: true });
    play();
    dpadId = e.pointerId;
    dpadSet(e);
  });
  dpad.addEventListener('pointermove', (e) => { if (e.pointerId === dpadId) dpadSet(e); });
  const dpadUp = (e) => { if (e.pointerId !== dpadId) return; dpadId = null; if (dpadDir) input.up(dpadDir, 'dpad'); dpadDir = null; };
  dpad.addEventListener('pointerup', dpadUp); dpad.addEventListener('pointercancel', dpadUp); dpad.addEventListener('lostpointercapture', dpadUp);
  overlay.addEventListener('pointerdown', (e) => { e.preventDefault(); n8.focus({ preventScroll: true }); play(); });
  canvas.addEventListener('pointerdown', () => { n8.focus({ preventScroll: true }); play(); });

  /* ---------- playing, pausing ---------- */
  let started = false, focused = false, visible = true, running = false;
  function play() {
    unlockAudio();
    if (!started) { started = true; boot.start(); }
    focused = true;
    refresh();
  }
  function refresh() {
    const go = started && focused && visible && !document.hidden;
    if (go !== running) {
      running = go;
      setGamePaused(!go);   // only the game's music stops: the soundboard keeps working
      if (!go) input.releaseAll();
    }
    overlay.hidden = go;
    n8.classList.toggle('is-on', started);
    overlay.querySelector('.n8-ov-title').textContent = started ? 'Paused · press to play' : 'Press to play';
  }
  n8.addEventListener('focusin', () => { if (started) { focused = true; refresh(); } });
  n8.addEventListener('focusout', () => {
    setTimeout(() => { if (!n8.contains(document.activeElement) && !document.fullscreenElement) { focused = false; refresh(); } }, 0);
  });
  document.addEventListener('visibilitychange', () => { pauseAudio(document.hidden); refresh(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; refresh(); }, { threshold: 0.25 }).observe(n8);
  }

  /* ---------- the switches ---------- */
  skinBtns.forEach((b) => b.addEventListener('click', () => {
    prefs.skin = b.dataset.skin;
    n8.dataset.skin = prefs.skin;
    skinBtns.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    savePrefs();
  }));
  screenSel.addEventListener('change', () => { game.setScreen(screenSel.value); game.saveSettings(); if (!running) game.draw(); });
  backSel.addEventListener('change', () => { prefs.backdrop = backSel.value; stage.dataset.backdrop = prefs.backdrop; savePrefs(); });
  soundBtn.addEventListener('click', () => {
    prefs.sound = !prefs.sound;
    setSound(prefs.sound);
    soundBtn.setAttribute('aria-pressed', String(prefs.sound));
    soundBtn.firstChild.textContent = prefs.sound ? '♪ sound on' : '♪ sound off';
    savePrefs();
    if (prefs.sound) { unlockAudio(); sfx.select(); }
  });
  speedBtn.addEventListener('click', cycleSpeed);
  bigBtn.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else stage.requestFullscreen().then(() => { n8.focus({ preventScroll: true }); play(); }).catch(() => {});
  });

  /* ---------- the screen's size: whole pixels where possible ---------- */
  function fit() {
    const full = document.fullscreenElement === stage;
    stage.classList.toggle('is-full', full);
    // measure the frame round the screen with the canvas shrunk, so the canvas can't stretch it
    canvas.style.width = '1px'; canvas.style.height = '1px';
    const bez = n8.querySelector('.n8-bezel'), cs = getComputedStyle(bez);
    const avail = bez.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 4;
    let k = Math.floor(avail / W);
    if (full) k = Math.max(1, Math.min(k, Math.floor((window.innerHeight - 340) / H)));
    if (k < 2) k = Math.max(1, avail / W);
    canvas.style.width = Math.floor(W * k) + 'px';
    canvas.style.height = Math.floor(H * k) + 'px';
  }
  new ResizeObserver(fit).observe(wrap);
  document.addEventListener('fullscreenchange', () => { fit(); setTimeout(fit, 100); });
  fit();

  /* ---------- the loop ---------- */
  let last = performance.now(), acc = 0, grooving = false;
  const STEP = 1000 / 60;
  const pressedBtns = { a: aBtn, b: bBtn, start: startBtn, select: selectBtn };
  /* in the Jelly Jam the console's own speaker grille pumps along to the beat */
  function groove() {
    if (game.beatHud) {
      const b = musicBeat(), k = b ? Math.max(0, 1 - (b.beat - Math.floor(b.beat)) * 2.4) : 0;
      n8.style.setProperty('--beat', k.toFixed(2));
      if (!grooving) { grooving = true; n8.classList.add('is-grooving'); }
    } else if (grooving) { grooving = false; n8.classList.remove('is-grooving'); n8.style.removeProperty('--beat'); }
  }
  function frame(now) {
    const dt = Math.min(100, now - last);
    last = now;
    if (running) {
      const k = game.speed || 1;   // fast-forward: k game updates for every 60th of a second
      acc += dt * k;
      let n = 0;
      while (acc >= STEP && n < 4 * k) { game.update(); acc -= STEP; n++; }
      if (n >= 4 * k) acc = 0;
      for (const [k, b] of Object.entries(pressedBtns)) b.classList.toggle('is-down', input.held[k]);
      dpad.dataset.dir = ['up', 'down', 'left', 'right'].find((d) => input.held[d]) || '';
      groove();
      game.draw();
    } else if (!started) {
      game.draw();
    }
    requestAnimationFrame(frame);
  }
  game.draw();
  requestAnimationFrame(frame);

  root.nova8 = { game, input, play };
  return root.nova8;
}
