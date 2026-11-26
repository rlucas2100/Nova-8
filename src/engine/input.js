/* The NOVA-8's eight buttons, fed by the keyboard (while the console has focus), the on-screen
   buttons (mouse or touch) and any gamepad. The game reads held[] and pressed[] once per frame. */

export const BUTTONS = ['up', 'down', 'left', 'right', 'a', 'b', 'start', 'select'];
const DIRS = ['up', 'down', 'left', 'right'];

export const KEYS = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'a', KeyJ: 'a', KeyZ: 'a', Enter: 'a', NumpadEnter: 'a',
  KeyK: 'b', KeyX: 'b', Backspace: 'b',
  Escape: 'start', KeyP: 'start', KeyM: 'start',
  ShiftLeft: 'select', ShiftRight: 'select', KeyQ: 'select',
};

export function createInput() {
  const held = {}, prev = {}, pressed = {}, holdFrames = {};
  const sources = {};           // button -> Set of sources holding it (key codes, pointer ids, 'pad')
  const queued = new Set();     // pressed and maybe released again between two frames
  let dirOrder = [];            // the most recently pressed direction wins
  let any = false;

  for (const b of BUTTONS) { held[b] = prev[b] = pressed[b] = false; holdFrames[b] = 0; sources[b] = new Set(); }

  function down(b, src) {
    if (!sources[b]) return;
    if (!sources[b].size) queued.add(b);
    sources[b].add(src);
    if (DIRS.includes(b)) { dirOrder = dirOrder.filter((d) => d !== b); dirOrder.push(b); }
  }
  function up(b, src) {
    if (!sources[b]) return;
    sources[b].delete(src);
  }
  function releaseAll() {
    for (const b of BUTTONS) sources[b].clear();
  }

  let padWas = {};
  function pollPad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const now = {};
    for (const p of pads) {
      if (!p || !p.connected) continue;
      const btn = (i) => p.buttons[i] && p.buttons[i].pressed;
      const ax = p.axes[0] || 0, ay = p.axes[1] || 0;
      if (btn(12) || ay < -0.5) now.up = true;
      if (btn(13) || ay > 0.5) now.down = true;
      if (btn(14) || ax < -0.5) now.left = true;
      if (btn(15) || ax > 0.5) now.right = true;
      if (btn(0)) now.a = true;
      if (btn(1)) now.b = true;
      if (btn(9)) now.start = true;
      if (btn(8)) now.select = true;
    }
    for (const b of BUTTONS) {
      if (now[b] && !padWas[b]) down(b, 'pad');
      if (!now[b] && padWas[b]) up(b, 'pad');
    }
    padWas = now;
  }

  return {
    held, pressed,
    down, up, releaseAll,
    get any() { return any; },
    /* call once per game frame */
    update() {
      pollPad();
      any = false;
      for (const b of BUTTONS) {
        prev[b] = held[b];
        held[b] = sources[b].size > 0;
        pressed[b] = queued.has(b) || (held[b] && !prev[b]);
        holdFrames[b] = held[b] ? holdFrames[b] + 1 : 0;
        if (pressed[b]) any = true;
      }
      queued.clear();
    },
    /* true when first pressed, then again every few frames while held (menus) */
    repeat(b) {
      if (pressed[b]) return true;
      const f = holdFrames[b];
      return f > 18 && (f - 18) % 5 === 0;
    },
    /* the direction being held, newest first */
    dir() {
      for (let i = dirOrder.length - 1; i >= 0; i--) if (held[dirOrder[i]]) return dirOrder[i];
      for (const d of DIRS) if (held[d]) return d;
      return null;
    },
    /* forget everything that's held (after a scene change, so a held A doesn't fire twice) */
    clear() {
      for (const b of BUTTONS) { pressed[b] = false; holdFrames[b] = Math.max(holdFrames[b], 1); }
      queued.clear();
    },
  };
}
