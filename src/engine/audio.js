/* The NOVA-8's sound chip, in Web Audio: two pulse channels (12.5%, 25% and 50% wide, like old
   handhelds), a triangle bass and a noise channel, with a little echo on the music. Sound effects are
   made on the spot; the music is written out in src/engine/music.js and played by a sequencer that
   can rotate through a playlist (an area's backing tracks take turns). Jingles (item get, a new
   friend) play over the music, which ducks while they do. No audio files.

   Two things can want music: the game, and the soundboard on the page. The soundboard wins while one
   of its tracks plays; the game's tune comes back when it stops. When the game is paused (the console
   lost focus) only the game's music stops, so the soundboard still works. */
import { SONGS, PLAYLISTS, JINGLES } from './music.js';

let ac = null, master = null, musicBus = null, musicOut = null, sfxBus = null, jingleBus = null;
let enabled = true;
const waves = {};
let noiseBuf = null, metalBuf = null;
const listeners = new Set();

export function soundOn() { return enabled; }
export function audioTime() { return ac ? ac.currentTime : 0; }
export function onMusicChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function changed() { for (const fn of listeners) { try { fn(nowPlaying()); } catch (e) {} } }

/* Browsers only allow sound after a click, tap or key press, so this is called from those. */
export function unlockAudio() {
  try {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = enabled ? 0.55 : 0;
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 6;
      master.connect(comp); comp.connect(ac.destination);
      // music: dry, plus a soft echo that makes the chip sound bigger
      musicBus = ac.createGain(); musicBus.gain.value = 1;
      musicOut = ac.createGain(); musicOut.gain.value = 0.36;
      musicBus.connect(musicOut); musicOut.connect(master);
      const delay = ac.createDelay(1), fb = ac.createGain(), tone = ac.createBiquadFilter(), wet = ac.createGain();
      delay.delayTime.value = 0.19; fb.gain.value = 0.28; tone.type = 'lowpass'; tone.frequency.value = 2400; wet.gain.value = 0.22;
      musicBus.connect(delay); delay.connect(tone); tone.connect(fb); fb.connect(delay); tone.connect(wet); wet.connect(musicOut);
      sfxBus = ac.createGain(); sfxBus.gain.value = 0.6; sfxBus.connect(master);
      jingleBus = ac.createGain(); jingleBus.gain.value = 0.42; jingleBus.connect(master);
      for (const d of [0.125, 0.25, 0.5]) waves['p' + d] = pulseWave(d);
      noiseBuf = makeNoise(false);
      metalBuf = makeNoise(true);
      apply();
    }
    if (ac.state === 'suspended' && !hidden) ac.resume();
  } catch (e) { /* no sound, the game still works */ }
}

export function setSound(on) {
  enabled = !!on;
  if (master) master.gain.setTargetAtTime(enabled ? 0.55 : 0, ac.currentTime, 0.03);
}

/* the browser tab is hidden: everything sleeps */
let hidden = false;
export function pauseAudio(p) {
  hidden = p;
  if (!ac) return;
  try { if (p) ac.suspend(); else ac.resume(); } catch (e) {}
}

function pulseWave(duty) {
  const n = 40, real = new Float32Array(n), imag = new Float32Array(n);
  for (let k = 1; k < n; k++) real[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
  return ac.createPeriodicWave(real, imag);
}
function makeNoise(metal) {
  const len = ac.sampleRate * (metal ? 0.05 : 1);
  const b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0);
  if (metal) {   // short looping noise: the buzzy "7-bit" sound of old chips
    let lfsr = 0x7f;
    const per = Math.floor(ac.sampleRate / 9000);
    let v = 1;
    for (let i = 0; i < len; i++) {
      if (i % per === 0) { const bit = (lfsr ^ (lfsr >> 1)) & 1; lfsr = (lfsr >> 1) | (bit << 6); v = (lfsr & 1) ? 1 : -1; }
      d[i] = v;
    }
  } else {
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  return b;
}

export const NOTE = (name) => {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(name);
  if (!m) return 0;
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  const midi = base + (parseInt(m[3], 10) + 1) * 12;
  return 440 * Math.pow(2, (midi - 69) / 12);
};

/* one note on a pulse / triangle / sine channel */
function tone(wave, freq, t, dur, vol, opt = {}) {
  if (!ac || !freq) return;
  const o = ac.createOscillator(), g = ac.createGain();
  if (waves[wave]) o.setPeriodicWave(waves[wave]); else o.type = wave;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.value = freq;
  if (opt.to) o.frequency.exponentialRampToValueAtTime(Math.max(20, opt.to), t + (opt.slide || dur));
  if (opt.vib) {
    const l = ac.createOscillator(), lg = ac.createGain();
    l.frequency.value = opt.vibRate || 5.5; lg.gain.value = freq * (opt.vibDepth || 0.012);
    l.connect(lg); lg.connect(o.frequency); l.start(t + (opt.vibDelay ?? 0.08)); l.stop(t + dur + 0.05);
  }
  const a = opt.attack ?? 0.004, rel = opt.release ?? 0.04, sus = opt.sustain ?? 0.7;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + a);
  g.gain.linearRampToValueAtTime(vol * sus, t + a + Math.min(0.08, dur * 0.3));
  g.gain.setValueAtTime(vol * sus, t + Math.max(a, dur - rel));
  g.gain.linearRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(opt.bus || sfxBus);
  o.start(t); o.stop(t + dur + 0.02);
}
function noise(t, dur, vol, opt = {}) {
  if (!ac) return;
  const s = ac.createBufferSource();
  s.buffer = opt.metal ? metalBuf : noiseBuf;
  s.loop = true;
  const f = ac.createBiquadFilter();
  f.type = opt.type || 'bandpass';
  f.frequency.setValueAtTime(opt.freq || 3000, t);
  if (opt.to) f.frequency.exponentialRampToValueAtTime(opt.to, t + dur);
  f.Q.value = opt.q ?? 0.8;
  const g = ac.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(opt.bus || sfxBus);
  s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
}

const now = () => (ac ? ac.currentTime + 0.005 : 0);
function seq(notes, wave = 'p0.25', step = 0.06, vol = 0.25, len, opt) {
  const t = now();
  notes.forEach((n, i) => { if (n) tone(wave, typeof n === 'number' ? n : NOTE(n), t + i * step, len || step * 0.95, vol, opt); });
}

/* ---------- sound effects ---------- */
const VOICES = {   // the little blips each speaker's words make
  default: { wave: 'p0.5', f: 880, spread: 0.12, vol: 0.05, len: 0.022 },
  robot: { wave: 'p0.125', f: 1320, spread: 0.3, vol: 0.05, len: 0.03, step: true },
  enya: { wave: 'triangle', f: 620, spread: 0.18, vol: 0.12, len: 0.035 },
  low: { wave: 'p0.25', f: 330, spread: 0.1, vol: 0.06, len: 0.04 },
  kid: { wave: 'p0.5', f: 990, spread: 0.15, vol: 0.05, len: 0.025 },
  hero: { wave: 'p0.25', f: 400, spread: 0.08, vol: 0.055, len: 0.04 },
  mutter: { wave: 'triangle', f: 300, spread: 0.12, vol: 0.1, len: 0.05 },
  jelly: { wave: 'sine', f: 760, spread: 0.35, vol: 0.13, len: 0.05 },
  lumen: { wave: 'triangle', f: 540, spread: 0.1, vol: 0.12, len: 0.045 },
  dj: { wave: 'p0.5', f: 520, spread: 0.4, vol: 0.05, len: 0.03, step: true },
  cody: { wave: 'triangle', f: 700, spread: 0.25, vol: 0.11, len: 0.04 },
  dragon: { wave: 'p0.5', f: 180, spread: 0.12, vol: 0.07, len: 0.06 },
  crab: { wave: 'p0.125', f: 1100, spread: 0.2, vol: 0.05, len: 0.025, step: true },
};
export const sfx = {
  blip() { if (!ac) return; tone('p0.25', NOTE('A5'), now(), 0.05, 0.18); },
  move() { if (!ac) return; tone('p0.125', NOTE('E5'), now(), 0.035, 0.12); },
  select() { seq(['E5', 'A5'], 'p0.25', 0.05, 0.2); },
  cancel() { seq(['A4', 'E4'], 'p0.25', 0.05, 0.18); },
  bump() { if (!ac) return; tone('triangle', 110, now(), 0.08, 0.35, { to: 60 }); },
  text() { sfx.voice('default'); },
  voice(name) {
    if (!ac) return;
    const v = VOICES[name] || VOICES.default;
    const k = v.step ? [1, 1.25, 1.5, 0.75][Math.floor(Math.random() * 4)] : 1 + (Math.random() * 2 - 1) * v.spread;
    tone(v.wave, v.f * k, now(), v.len, v.vol);
  },
  /* "cha-ching!": a little cash-register clunk, then two bright bells */
  coin() {
    if (!ac) return;
    const t = now();
    noise(t, 0.05, 0.35, { freq: 5200, q: 2.5, metal: true });
    tone('p0.5', NOTE('E6'), t + 0.03, 0.07, 0.17, { sustain: 0.9 });
    tone('p0.25', NOTE('A6'), t + 0.1, 0.32, 0.17, { sustain: 0.55, release: 0.2 });
    tone('p0.125', NOTE('E7'), t + 0.11, 0.24, 0.06, { sustain: 0.4 });
    noise(t + 0.1, 0.25, 0.05, { freq: 9000, type: 'highpass' });
  },
  jewel(kind) {
    if (kind === 'gold') return sfx.coin();
    if (!ac) return;
    const runs = {
      emerald: ['C6', 'E6', 'G6', 'C7'], sapphire: ['D6', 'F#6', 'A6', 'D7'],
      ruby: ['A5', 'C#6', 'E6', 'A6'], diamond: ['E6', 'G#6', 'B6', 'E7', 'B7', 'E7'],
    };
    const t = now();
    noise(t, 0.04, 0.2, { freq: 6000, q: 2, metal: true });
    (runs[kind] || runs.emerald).forEach((n, i) => tone('p0.125', NOTE(n), t + 0.02 + i * 0.045, 0.16, 0.16, { sustain: 0.5 }));
    if (kind === 'diamond') for (let i = 0; i < 6; i++) tone('sine', NOTE('E7') * (1 + i * 0.25), t + 0.3 + i * 0.04, 0.12, 0.05);
  },
  /* jumping and landing */
  jump() { if (!ac) return; tone('p0.25', 260, now(), 0.16, 0.2, { to: 720, slide: 0.13, sustain: 0.8 }); },
  land() { if (!ac) return; const t = now(); tone('triangle', 140, t, 0.06, 0.3, { to: 70 }); noise(t, 0.05, 0.12, { freq: 900 }); },
  boing() { if (!ac) return; tone('triangle', 200, now(), 0.3, 0.35, { to: 520, slide: 0.08, vib: true, vibRate: 22, vibDepth: 0.08, vibDelay: 0.05 }); },
  /* each companion's wiggle and happy noise */
  rawr() {   // NOVA: a little growl that turns into a purr
    if (!ac) return;
    const t = now();
    noise(t, 0.28, 0.32, { freq: 700, to: 300, q: 3, metal: true });
    tone('p0.5', 330, t, 0.22, 0.14, { to: 180, vib: true, vibRate: 30, vibDepth: 0.05, vibDelay: 0 });
    tone('triangle', 120, t + 0.18, 0.35, 0.18, { vib: true, vibRate: 24, vibDepth: 0.06, vibDelay: 0 });
  },
  puff() {   // EMBER / AZURE: a flap and a puff of smoke (or frost)
    if (!ac) return;
    const t = now();
    noise(t, 0.08, 0.2, { freq: 500, to: 1500 }); noise(t + 0.1, 0.08, 0.2, { freq: 500, to: 1500 });
    noise(t + 0.2, 0.3, 0.28, { freq: 1200, to: 300, q: 0.6 });
    tone('p0.25', 880, t + 0.2, 0.12, 0.08, { to: 1320 });
  },
  blub() {   // LUMI: bubbly wobble
    if (!ac) return;
    const t = now();
    for (let i = 0; i < 4; i++) tone('sine', 300 + i * 90, t + i * 0.07, 0.07, 0.28, { to: 700 + i * 120, slide: 0.06 });
    tone('p0.125', 1400, t + 0.3, 0.08, 0.06);
  },
  wiggle() { if (!ac) return; tone('p0.25', 520, now(), 0.28, 0.14, { vib: true, vibRate: 16, vibDepth: 0.12, vibDelay: 0 }); },
  /* the wild creatures' cries */
  cry(species) {
    if (!ac) return;
    const t = now();
    switch (species) {
      case 'glorp': tone('sine', 180, t, 0.4, 0.4, { to: 120, vib: true, vibRate: 14, vibDepth: 0.15, vibDelay: 0 }); break;
      case 'sporelet': seq(['G5', 'D5', 'A4'], 'p0.5', 0.07, 0.14); noise(t + 0.2, 0.3, 0.12, { freq: 5000, type: 'highpass' }); break;
      case 'flitterfin': for (let i = 0; i < 5; i++) tone('p0.125', 1600 + (i % 2) * 400, t + i * 0.04, 0.04, 0.12); break;
      case 'crystabug': for (let i = 0; i < 3; i++) noise(t + i * 0.06, 0.04, 0.3, { freq: 4000, q: 4, metal: true }); tone('p0.125', 2200, t + 0.2, 0.12, 0.08); break;
      case 'thornback': case 'thornAlpha': noise(t, 0.5, 0.45, { freq: 400, to: 200, q: 2, metal: true }); tone('p0.5', 150, t, 0.45, 0.2, { to: 100, vib: true }); break;
      case 'rustclaw': for (let i = 0; i < 4; i++) noise(t + i * 0.09, 0.06, 0.4, { freq: 2500, q: 3, metal: true }); tone('triangle', 80, t, 0.6, 0.45, { to: 50 }); break;
      case 'lumoth': for (let i = 0; i < 6; i++) noise(t + i * 0.05, 0.04, 0.12, { freq: 1200 + i * 200, q: 2 }); tone('sine', 1200, t + 0.1, 0.3, 0.1, { to: 1600, vib: true }); break;
      case 'jadehop': tone('p0.5', 220, t, 0.08, 0.2, { to: 160 }); tone('p0.5', 240, t + 0.14, 0.12, 0.2, { to: 150 }); break;   // ribbit
      case 'vinesnap': for (let i = 0; i < 2; i++) { noise(t + i * 0.12, 0.05, 0.4, { freq: 3000, q: 3, metal: true }); tone('triangle', 200, t + i * 0.12, 0.06, 0.3, { to: 90 }); } break;
      case 'mosshell': tone('triangle', 110, t, 0.5, 0.4, { to: 90, vib: true, vibRate: 4 }); break;
      case 'ghoul': case 'grimghoul':
        tone('sine', species === 'ghoul' ? 620 : 380, t, 0.9, 0.22, { to: species === 'ghoul' ? 210 : 120, vib: true, vibRate: 7, vibDepth: 0.08, vibDelay: 0 });
        noise(t, 0.8, 0.16, { freq: 6000, type: 'highpass' });
        if (species === 'grimghoul') tone('p0.5', 70, t, 0.8, 0.25, { to: 45 });
        break;
      case 'bopjelly': for (let i = 0; i < 3; i++) tone('sine', 400 + i * 200, t + i * 0.08, 0.1, 0.25, { to: 700 + i * 200, slide: 0.08 }); break;
      case 'shroomboom': sfx.drum(); tone('triangle', 90, t + 0.25, 0.3, 0.45, { to: 40 }); break;
      case 'hissling': case 'spitviper': sfx.hiss(species === 'spitviper' ? 0.7 : 0.5); break;
      case 'oozefang': sfx.hiss(1.1); tone('triangle', 70, t, 0.9, 0.45, { to: 40 }); noise(t + 0.1, 0.6, 0.2, { freq: 400, type: 'lowpass' }); break;
      case 'witherwisp': tone('sine', 300, t, 0.9, 0.18, { to: 180, vib: true, vibRate: 5, vibDepth: 0.06, vibDelay: 0 }); noise(t, 0.9, 0.08, { freq: 900, q: 0.6 }); break;
      case 'dragonKing': case 'blackDragon': case 'whiteDragon': {   // a long, rolling dragon roar
        const low = species === 'blackDragon' ? 0.7 : species === 'whiteDragon' ? 1.3 : 1;
        noise(t, 1.1, 0.5, { freq: 600 * low, to: 200 * low, q: 2, metal: true });
        tone('p0.5', 160 * low, t, 1, 0.26, { to: 80 * low, vib: true, vibRate: 9, vibDepth: 0.05 });
        tone('triangle', 70 * low, t, 1.1, 0.4, { to: 40 * low });
        break;
      }
      default: sfx.wiggle();
    }
  },
  /* NOVA purrs (and hearts float up) */
  purr() {
    if (!ac) return;
    const t = now();
    noise(t, 0.7, 0.16, { freq: 240, q: 2.5, metal: true });
    tone('triangle', 92, t, 0.7, 0.2, { vib: true, vibRate: 26, vibDepth: 0.08, vibDelay: 0 });
  },
  /* a big wet lick: tiger saliva heals */
  lick() {
    if (!ac) return;
    const t = now();
    tone('sine', 320, t, 0.2, 0.26, { to: 950, slide: 0.16, vib: true, vibRate: 30, vibDepth: 0.05, vibDelay: 0 });
    noise(t + 0.05, 0.14, 0.12, { freq: 2600, q: 1.5 });
    tone('sine', 700, t + 0.22, 0.08, 0.12, { to: 1100 });
  },
  heartbeat() { if (!ac) return; const t = now(); tone('triangle', 72, t, 0.13, 0.5, { to: 40 }); tone('triangle', 72, t + 0.2, 0.12, 0.38, { to: 40 }); },
  /* his warrior blood boils: a rising roar */
  fury() {
    if (!ac) return;
    const t = now();
    sfx.heartbeat();
    tone('p0.5', 110, t + 0.35, 0.8, 0.2, { to: 440, slide: 0.7, vib: true, vibRate: 12, vibDepth: 0.04 });
    noise(t + 0.35, 0.9, 0.42, { freq: 300, to: 2400, q: 1, metal: true });
    tone('triangle', 55, t + 0.35, 0.9, 0.45, { to: 110 });
  },
  /* the GEM's light shattering like a diamond */
  shatter() {
    if (!ac) return;
    const t = now();
    for (let i = 0; i < 9; i++) tone('p0.125', 3200 - i * 240 + Math.random() * 300, t + i * 0.022, 0.07, 0.12);
    noise(t, 0.6, 0.35, { freq: 7000, type: 'highpass' });
    ['E7', 'B6', 'G#6'].forEach((n, i) => tone('sine', NOTE(n), t + 0.12 + i * 0.07, 0.3, 0.06));
  },
  /* the air tearing open between worlds */
  rift() { if (!ac) return; const t = now(); noise(t, 0.7, 0.35, { freq: 200, to: 5000, q: 1.2 }); tone('p0.25', 900, t, 0.7, 0.12, { to: 120 }); tone('sine', 1400, t + 0.2, 0.5, 0.06, { to: 2400, vib: true }); },
  /* a COSMIC TUBE opening, its beam of light pulling a creature in */
  tube() { if (!ac) return; const t = now(); tone('p0.25', 300, t, 0.55, 0.18, { to: 1800 }); seq([null, null, null, 'C6', 'G6', 'C7'], 'p0.125', 0.06, 0.12); },
  wobble() { if (!ac) return; const t = now(); tone('p0.125', 900, t, 0.05, 0.16); noise(t, 0.04, 0.18, { freq: 3000, q: 3, metal: true }); tone('triangle', 160, t + 0.05, 0.08, 0.25, { to: 90 }); },
  breakfree() { if (!ac) return; const t = now(); tone('p0.5', 600, t, 0.22, 0.2, { to: 150 }); noise(t, 0.25, 0.3, { freq: 5000, type: 'highpass' }); },
  memory() { jingle('memory'); },
  captured() { jingle('captured'); },
  /* DJ JIGGLE's record scratch, and the BASS DROP */
  scratch() { if (!ac) return; const t = now(); noise(t, 0.12, 0.45, { freq: 700, to: 3200, q: 3 }); noise(t + 0.12, 0.14, 0.45, { freq: 3200, to: 500, q: 3 }); noise(t + 0.28, 0.08, 0.3, { freq: 900, to: 2400, q: 3 }); },
  boom() { if (!ac) return; const t = now(); tone('triangle', 110, t, 0.7, 0.6, { to: 32 }); noise(t, 0.5, 0.35, { freq: 300, type: 'lowpass' }); tone('p0.5', 55, t, 0.4, 0.14, { to: 30 }); },
  drum() { if (!ac) return; const t = now(); for (let i = 0; i < 4; i++) noise(t + i * 0.06, 0.06, 0.32, { freq: 2200 - i * 150, q: 0.8 }); },
  rustle() { if (!ac) return; noise(now(), 0.07, 0.07, { freq: 3500, q: 0.7 }); },
  heal() { seq(['C5', 'E5', 'G5', 'B5', 'D6', 'G6'], 'p0.125', 0.07, 0.18); },
  save() { seq(['G5', 'C6', 'E6'], 'p0.25', 0.07, 0.2); },
  door() { if (!ac) return; noise(now(), 0.25, 0.25, { freq: 800, to: 200 }); },
  encounter() {
    if (!ac) return;
    const t = now();
    for (let i = 0; i < 8; i++) tone('p0.5', NOTE(i % 2 ? 'E5' : 'B4') * (1 + i * 0.06), t + i * 0.045, 0.045, 0.16);
    noise(t, 0.5, 0.18, { freq: 2000, to: 8000, type: 'highpass' });
  },
  hit() { if (!ac) return; const t = now(); noise(t, 0.16, 0.5, { freq: 1200, to: 300, q: 1.2 }); tone('triangle', 180, t, 0.1, 0.4, { to: 60 }); },
  crit() { if (!ac) return; const t = now(); noise(t, 0.3, 0.6, { freq: 3000, to: 200 }); tone('p0.5', 600, t, 0.2, 0.25, { to: 90 }); },
  miss() { if (!ac) return; noise(now(), 0.2, 0.2, { freq: 5000, to: 1500, type: 'highpass' }); },
  slash() { if (!ac) return; const t = now(); for (let i = 0; i < 3; i++) noise(t + i * 0.07, 0.07, 0.4, { freq: 6000 - i * 900, to: 1500, type: 'highpass' }); },
  roar() {
    if (!ac) return;
    const t = now();
    noise(t, 0.8, 0.55, { freq: 500, to: 160, q: 2, metal: true });
    tone('p0.5', 140, t, 0.7, 0.3, { to: 70, vib: true });
    tone('triangle', 90, t, 0.7, 0.4, { to: 45 });
  },
  flame() { if (!ac) return; const t = now(); noise(t, 0.7, 0.45, { freq: 900, to: 2600, q: 0.6 }); noise(t + 0.1, 0.6, 0.3, { freq: 300, q: 1 }); },
  frost() { if (!ac) return; const t = now(); noise(t, 0.6, 0.3, { freq: 7000, type: 'highpass' }); seq(['B6', 'G6', 'E7', 'C7', 'A7'], 'p0.125', 0.06, 0.12); },
  whoosh() { if (!ac) return; noise(now(), 0.3, 0.35, { freq: 400, to: 3000 }); },
  ink() { if (!ac) return; const t = now(); tone('sine', 220, t, 0.3, 0.3, { to: 80 }); noise(t, 0.3, 0.2, { freq: 400, type: 'lowpass' }); },
  zap() { if (!ac) return; const t = now(); for (let i = 0; i < 6; i++) tone('p0.125', 1800 - i * 200, t + i * 0.03, 0.03, 0.15); },
  wave() { if (!ac) return; const t = now(); tone('sine', 300, t, 0.6, 0.3, { to: 900, vib: true }); tone('p0.125', 600, t, 0.6, 0.08, { to: 1800 }); },
  buff() { seq(['C5', 'G5', 'C6', 'G6'], 'p0.25', 0.05, 0.18); },
  debuff() { seq(['G5', 'D5', 'A4', 'E4'], 'p0.25', 0.06, 0.18); },
  guard() { if (!ac) return; const t = now(); tone('p0.5', 330, t, 0.12, 0.2); tone('p0.5', 494, t + 0.06, 0.18, 0.2); },
  flash() {   // Enya's Diamond Flash: a bright shimmering chord
    if (!ac) return;
    const t = now();
    ['E6', 'G#6', 'B6', 'E7', 'G#7', 'B7'].forEach((n, i) => tone('p0.125', NOTE(n), t + i * 0.035, 0.6, 0.12, { sustain: 0.4 }));
    noise(t, 0.6, 0.25, { freq: 9000, type: 'highpass' });
  },
  faint() { seq(['E5', 'D5', 'B4', 'G4', 'E4', 'C4'], 'p0.5', 0.09, 0.2); },
  run() { seq(['C5', 'E5', 'G5'], 'p0.125', 0.04, 0.18); },
  levelup() { jingle('levelup'); },
  part() { jingle('itemget'); },
  joined() { jingle('joined'); },
  crash() { if (!ac) return; const t = now(); noise(t, 1.6, 0.8, { freq: 600, to: 80, q: 0.5 }); tone('triangle', 120, t, 1.2, 0.5, { to: 30 }); },
  beam() { if (!ac) return; tone('p0.25', 400, now(), 0.5, 0.18, { to: 1600 }); },
  boot() { if (!ac) return; const t = now(); tone('p0.125', NOTE('B5'), t, 0.12, 0.2); tone('p0.125', NOTE('E6'), t + 0.1, 0.5, 0.2, { sustain: 0.5 }); tone('triangle', NOTE('E4'), t + 0.1, 0.5, 0.25); },
  pick() { if (!ac) return; const t = now(); tone('p0.25', 400, t, 0.12, 0.16, { to: 1200 }); seq([null, null, 'E6', 'B6'], 'p0.125', 0.05, 0.16); },
  /* ---------- Chapter 2 ---------- */
  chirp() { if (!ac) return; const t = now(); for (let i = 0; i < 3; i++) tone('sine', 2600 + i * 300, t + i * 0.09, 0.06, 0.06, { to: 3400 + i * 200, slide: 0.05 }); },
  /* NOVA's FIRE TIGER RING: a whoomph, then crackling */
  fireRing() {
    if (!ac) return;
    const t = now();
    noise(t, 0.5, 0.5, { freq: 200, to: 1800, q: 0.8 }); tone('triangle', 90, t, 0.4, 0.4, { to: 45 });
    for (let i = 0; i < 6; i++) noise(t + 0.25 + i * 0.07, 0.05, 0.25, { freq: 3000 + Math.random() * 2000, q: 3, metal: true });
  },
  poison() { if (!ac) return; const t = now(); for (let i = 0; i < 3; i++) tone('sine', 500 - i * 110, t + i * 0.08, 0.09, 0.2, { to: 300 - i * 60 }); },
  hiss(len = 0.5) { if (!ac) return; const t = now(); noise(t, len, 0.3, { freq: 6000, type: 'highpass' }); noise(t + 0.05, len * 0.8, 0.15, { freq: 3500, q: 2 }); },
  spit() { if (!ac) return; const t = now(); noise(t, 0.12, 0.4, { freq: 2000, to: 600 }); tone('sine', 900, t, 0.1, 0.15, { to: 300 }); },
  /* Cody's staff: growing (a rising boing), shrinking (a falling one), and landing with all its seven thousand kilos */
  grow() { if (!ac) return; const t = now(); tone('p0.25', 180, t, 0.45, 0.18, { to: 900, vib: true, vibRate: 18, vibDepth: 0.06, vibDelay: 0 }); tone('triangle', 90, t, 0.45, 0.25, { to: 300 }); },
  shrink() { if (!ac) return; const t = now(); tone('p0.25', 900, t, 0.4, 0.16, { to: 160, vib: true, vibRate: 18, vibDepth: 0.06, vibDelay: 0 }); seq([null, null, null, null, 'E7'], 'p0.125', 0.07, 0.1); },
  thoom() { if (!ac) return; const t = now(); tone('triangle', 70, t, 0.9, 0.7, { to: 28 }); noise(t, 0.7, 0.5, { freq: 220, type: 'lowpass' }); noise(t, 0.2, 0.3, { freq: 2600, q: 2, metal: true }); },
  /* the Dragon King's great gong: a low, shimmering BWONNG that rolls on and on */
  gong() {
    if (!ac) return;
    const t = now();
    noise(t, 0.12, 0.4, { freq: 900, q: 1.5, metal: true });
    [[98, 0.42], [196 * 1.18, 0.16], [98 * 2.76, 0.1], [98 * 5.4, 0.05]].forEach(([f, v]) => tone('triangle', f, t, 3.2, v, { vib: true, vibRate: 3.5, vibDepth: 0.01, vibDelay: 0.2, sustain: 0.6, release: 2.4 }));
  },
  meow() { if (!ac) return; const t = now(); tone('triangle', 620, t, 0.32, 0.22, { to: 900, slide: 0.12 }); tone('triangle', 900, t + 0.14, 0.2, 0.16, { to: 560 }); },
  snore() { if (!ac) return; const t = now(); noise(t, 0.5, 0.14, { freq: 300, q: 3, metal: true }); tone('triangle', 80, t, 0.5, 0.15, { to: 60 }); },
  /* the old tennis ball, smacked off the gable wall */
  thwack() { if (!ac) return; const t = now(); noise(t, 0.05, 0.45, { freq: 1800, q: 1.2 }); tone('triangle', 260, t, 0.06, 0.3, { to: 140 }); },
  /* her tune: you whistle it or hum it, and NOVA hums along (a little off-key) */
  whistle() { jingle('whistle'); },
  hum() { jingle('hum'); },
  humNova() { jingle('humNova'); },
};

/* ---------- music ---------- */
function compile(def) {
  const stepDur = 60 / def.bpm / (def.div || 2);
  const chans = [];
  let len = 0;
  for (const ch of def.tracks) {
    if (ch.drums) {
      const steps = ch.drums.replace(/[\s|]/g, '').split('');
      chans.push({ drums: steps, vol: ch.vol ?? 0.4 });
      len = Math.max(len, steps.length);
      continue;
    }
    const toks = ch.notes.split(/\s+/).filter((t) => t && t !== '|');
    const ev = new Array(toks.length).fill(null);
    for (let i = 0; i < toks.length; i++) {
      const tk = toks[i];
      if (tk === '-' || tk === '.') continue;
      let n = 1;
      while (toks[i + n] === '-') n++;
      ev[i] = { f: NOTE(tk) * (ch.oct ? Math.pow(2, ch.oct) : 1), n };
    }
    chans.push({ ev, wave: ch.wave || 'p0.25', vol: ch.vol ?? 0.2, vib: !!ch.vib, gate: ch.gate ?? 0.9, sus: ch.sus });
    len = Math.max(len, toks.length);
  }
  return { stepDur, chans, len, loop: def.loop !== false, loopAt: def.loopAt || 0 };
}

function playStep(song, s, t, bus) {
  for (const c of song.chans) {
    if (c.drums) {
      const d = c.drums[s % c.drums.length];
      if (d === 'k') { tone('triangle', 150, t, 0.12, c.vol * 1.6, { to: 45, bus }); }
      else if (d === 's') { noise(t, 0.12, c.vol, { freq: 2200, q: 0.7, bus }); }
      else if (d === 'h') { noise(t, 0.04, c.vol * 0.5, { freq: 8000, type: 'highpass', bus }); }
      else if (d === 'o') { noise(t, 0.16, c.vol * 0.5, { freq: 7000, type: 'highpass', bus }); }
      else if (d === 'c') { noise(t, 0.5, c.vol * 0.6, { freq: 5000, type: 'highpass', bus }); }
      continue;
    }
    const e = c.ev[s % c.ev.length];
    // sus: how far a note falls after its attack (low = plucked, like a bass guitar string)
    if (e) tone(c.wave, e.f, t, song.stepDur * e.n * c.gate, c.vol, { bus, vib: c.vib && e.n > 2, release: 0.03, sustain: c.sus });
  }
}

/* the one sequencer */
let cur = null;      // { name, list, li, song, step, nextTime, loops, then, owner }
let timer = null;
let gameWant = null; // { name, then } the game's music
let boardWant = null;
let gamePaused = false;

function startSeq(name, owner, then) {
  stopSeq();
  if (!name) return;
  const list = PLAYLISTS[name] || [name];
  if (!SONGS[list[0]]) return;
  cur = { name, list, li: 0, owner, then: then || null, loops: 0, song: compile(SONGS[list[0]]), step: 0, nextTime: ac.currentTime + 0.08 };
  timer = setInterval(schedule, 25);
  schedule();
  changed();
}
function stopSeq() {
  if (timer) clearInterval(timer);
  timer = null;
  cur = null;
}
function schedule() {
  if (!cur || !ac) return;
  while (cur && cur.nextTime < ac.currentTime + 0.18) {
    playStep(cur.song, cur.step, cur.nextTime, musicBus);
    cur.nextTime += cur.song.stepDur;
    cur.step++;
    if (cur.step >= cur.song.len) {
      if (!cur.song.loop) { finished(); return; }
      cur.step = cur.song.loopAt;
      cur.loops++;
      // an area's backing tracks take turns: each plays a couple of times, then the next one starts
      const def = SONGS[cur.list[cur.li]];
      if (cur.list.length > 1 && cur.loops >= (def.loops || 2)) {
        cur.li = (cur.li + 1) % cur.list.length;
        cur.loops = 0;
        cur.song = compile(SONGS[cur.list[cur.li]]);
        cur.step = 0;
        changed();
      }
    }
  }
}
function finished() {
  const { owner, then } = cur;
  stopSeq();
  setTimeout(() => {
    if (owner === 'board') { boardWant = null; apply(); changed(); return; }
    gameWant = then ? { name: then } : null;
    apply();
  }, 350);
}
/* start whatever should be playing now */
function apply() {
  if (!ac) return;
  const want = boardWant ? { ...boardWant, owner: 'board' } : (!gamePaused && gameWant ? { ...gameWant, owner: 'game' } : null);
  if (!want) { if (cur) { stopSeq(); changed(); } return; }
  if (cur && cur.name === want.name && cur.owner === want.owner) return;
  startSeq(want.name, want.owner, want.then);
}

/* the game asks for a tune (a song or a playlist name); opts.then = what to play after a one-off */
export function playMusic(name, opts = {}) {
  if (gameWant && gameWant.name === name && !opts.restart) return;
  gameWant = name ? { name, then: opts.then || null } : null;
  if (opts.restart && cur && cur.owner === 'game') stopSeq();
  apply();
}
export function stopMusic() { gameWant = null; apply(); }
export function currentMusic() { return gameWant ? gameWant.name : null; }
export function setGamePaused(p) { if (gamePaused === p) return; gamePaused = p; apply(); }

/* the soundboard */
export function boardPlay(name) { unlockAudio(); boardWant = { name }; if (cur && cur.owner === 'board') stopSeq(); apply(); }
export function boardStop() { boardWant = null; apply(); changed(); }
export function nowPlaying() {
  if (!cur) return null;
  return { name: cur.name, track: cur.list[cur.li], owner: cur.owner };
}
/* where the music is right now, in beats (a fraction runs between them), so things can bop along:
   the step being heard is a little behind the one being scheduled */
export function musicBeat() {
  if (!cur || !ac) return null;
  const def = SONGS[cur.list[cur.li]];
  const step = cur.step - (cur.nextTime - ac.currentTime) / cur.song.stepDur;
  return { beat: step / (def.div || 2), bpm: def.bpm, track: cur.list[cur.li] };
}

/* a jingle over the music, which ducks while it plays */
export function jingle(name) {
  if (!ac || !JINGLES[name]) return;
  const song = compile(JINGLES[name]);
  const t0 = ac.currentTime + 0.03, dur = song.len * song.stepDur;
  for (let s = 0; s < song.len; s++) playStep(song, s, t0 + s * song.stepDur, jingleBus);
  musicOut.gain.cancelScheduledValues(t0);
  musicOut.gain.setTargetAtTime(0.06, t0, 0.03);
  musicOut.gain.setTargetAtTime(0.36, t0 + dur + 0.1, 0.25);
  return dur;
}
