// Screenshots of Cosmic Castaways for the games page, straight from the game's 160 x 144 canvas (native pixels).
// node tests/siteshots.mjs [url] [outdir]   (outdir defaults to the site's redesign/thumbs/castaways)
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const url = process.argv[2] || 'http://localhost:5199/';
const out = (process.argv[3] || 'C:/Dev/websites/mysite/redesign/thumbs/castaways') + '/';
const only = process.argv[4] ? process.argv[4].split(',') : null;   // e.g. fury,tube: just those
const want = (n) => !only || only.includes(n);
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const key = async (code, hold = 50) => { await page.keyboard.down(code); await sleep(hold); await page.keyboard.up(code); await sleep(70); };
const game = 'document.querySelector("[data-nova8]").nova8.game';
const G = (js) => page.evaluate(js);
const top = () => G(`(${game}).top ? (${game}).top.kind : null`);
const battle = `(${game}).scenes.find((s) => s.kind === 'Battle')`;
async function grab(name) {
  const data = await G(`document.querySelector('.n8-canvas').toDataURL('image/png')`);
  const buf = Buffer.from(data.split(',')[1], 'base64');
  writeFileSync(out + name + '.png', buf);
  console.log(name + '.png', buf.length, 'bytes');
}
async function waitFor(js, max = 200, every = 50) { for (let i = 0; i < max; i++) { if (await G(js)) return true; await sleep(every); } return false; }

const save = {
  v: 2, name: 'KAI', map: 'bloomhaven', x: 16, y: 12, dir: 'down', riding: false,
  pet: { species: 'tiger', variant: 'red', name: 'NOVA', lv: 12, xp: 0, moves: [], hp: 90, en: 16 },
  flags: { awake: true, 'sprig-grove': true, 'gate-open': true, enya: true, 'alpha-beaten': true, 'open-pod-tiger': true, 'wilds-intro': true, 'thorns-cleared': true, 'jungle-intro': true, 'met-lumen': true, 'groove-intro': true },
  got: {}, parts: { fuelcell: true }, jewels: { gold: 9, emerald: 3, sapphire: 2, ruby: 2, diamond: 1 }, money: 54,
  bag: { berry: 3, tonic: 2, melon: 1, tube: 5 }, tubes: { lumoth: 1, glorp: 2, bopjelly: 1, jadehop: 1 }, captures: 5,
  memories: ['fire', 'name', 'gem', 'hill', 'blood', 'veil', 'dance'], furyT: 0,
  respawn: { map: 'bloomhaven', x: 14, y: 12, dir: 'up' }, steps: 400, battles: 9, playMs: 1500000, goal: 'Find the other ship parts.',
};
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('cosmic-castaways.save.v1', s); }, JSON.stringify(save));
await page.reload({ waitUntil: 'networkidle0' });
await page.click('.n8-overlay'); await sleep(2300);
await key('Space'); await sleep(300); await key('Space'); await sleep(1600);   // CONTINUE
const go = async (map, x, y, dir) => { await G(`void (() => { const w = (${game}).top; w.load('${map}', ${x}, ${y}, '${dir}'); w.throbT = 99999; })()`); await sleep(3300); };

// the four areas (the name banner has slid away by the time we grab)
if (want('bloomhaven')) { await go('bloomhaven', 16, 12, 'down'); await grab('bloomhaven'); }
if (want('wilds')) { await go('wilds', 18, 8, 'down'); await grab('wilds'); }
if (want('whisperwood')) { await go('jungle', 32, 5, 'up'); await grab('whisperwood'); }
if (want('groove')) { await go('groove', 17, 14, 'down'); await waitFor(`(${game}).top.pulse > 0.75`, 100, 10); await grab('groove'); }

// FURY: the close-up of his eyes turning green (a boss that survives the round; NOVA heals, so nothing faints)
if (want('fury')) {
await go('jungle', 16, 12, 'down');
await G(`void (${game}).top.run((g, w) => w.battle({ species: 'grimghoul', lv: 12 }))`);
await waitFor(`(${game}).top.kind === 'Menu'`, 200, 50) || (await (async () => { for (let i = 0; i < 20 && (await top()) !== 'Menu'; i++) { await key('Space', 30); await sleep(150); } })());
for (let i = 0; i < 20 && (await top()) !== 'Menu'; i++) { await key('Space', 30); await sleep(150); }
await G(`void (() => { const b = ${battle}; b.fury = 100; b.foe.hp = b.foe.maxHp; })()`);
await key('Space'); await sleep(300); await key('KeyS', 30); await key('KeyS', 30); await key('KeyS', 30); await key('Space');   // FIGHT, HEALING LICK
// Enya's DIAMOND FLASH can bring up a line that waits for a key first: keep reading until the close-up starts
for (let i = 0; i < 60 && !(await G(`!!(${battle} || {}).cutin`)); i++) { await sleep(250); if (!(await G(`!!(${battle} || {}).cutin`)) && (await top()) !== 'Menu') await key('Space', 30); }
await waitFor(`!!(${battle} || {}).cutin && ${battle}.cutin.t >= 50`, 400, 15);
await grab('fury');
await G(`void (() => { const b = ${battle}; if (b) b.foe.hp = 1; })()`);
for (let i = 0; i < 200 && (await top()) !== 'World'; i++) { await key('Space', 30); await sleep(120); }
await sleep(800);
}

// a COSMIC TUBE: wobbling, an infinity of light inside
if (want('tube')) {
await G(`void (${game}).top.run((g, w) => w.battle({ species: 'lumoth', lv: 4 }))`);
for (let i = 0; i < 30 && (await top()) !== 'Menu'; i++) { await key('Space', 30); await sleep(150); }
await G(`void (() => { const b = ${battle}; b.foe.hp = 1; b.foe.disp = 1; })()`);
await key('KeyD'); await sleep(150); await key('Space'); await sleep(400);   // BAG
const items = await G(`(${game}).top.items.map((i) => i.label)`);
for (let i = 0; i < items.indexOf('COSMIC TUBE'); i++) await key('KeyS', 30);
await key('Space');
for (let i = 0; i < 30 && !(await G(`!!(${battle} || {}).tube`)); i++) { await key('Space', 30); await sleep(120); }
await waitFor(`(() => { const b = ${battle}; return b && b.tube && b.anim.foe.hide && b.tube.y >= 62 && Math.abs(b.tube.wob) >= 2; })()`, 600, 10);
await grab('tube');
for (let i = 0; i < 160 && (await top()) !== 'World'; i++) { await key('Space', 30); await sleep(120); }
await sleep(800);
}

// the MEMORIES page of the quest notes
if (want('memories')) {
await key('Escape'); await sleep(300);
await key('KeyS'); await key('KeyS'); await key('KeyS'); await key('Space'); await sleep(400);   // QUEST
await key('KeyD'); await sleep(300);
await key('KeyS'); await key('KeyS'); await key('KeyS'); await sleep(300);                     // STARRY HILL
await grab('memories');
}
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();
