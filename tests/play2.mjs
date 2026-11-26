// The rest of Chapter 1, sped up: choose a companion, pass the drone, a wild battle, Enya, the boss, the end.
// node tests/play2.mjs [url] [species] [variant]
import puppeteer from 'puppeteer-core';
const url = process.argv[2] || 'http://localhost:5199/';
const species = process.argv[3] || 'dragon', variant = process.argv[4] || 'red';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message + '\n' + e.stack));
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) errors.push('console: ' + m.text()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle0' });
let n = 0;
const tag = species + (species === 'dragon' ? '-' + variant : '');
async function shot(name) { const el = await page.$('.n8-screen'); await el.screenshot({ path: `tests/shots/q-${tag}-${String(++n).padStart(2, '0')}-${name}.png` }); }
async function key(code, hold = 50) { await page.keyboard.down(code); await sleep(hold); await page.keyboard.up(code); await sleep(50); }
const G = (fn, ...a) => page.evaluate(fn, ...a);
const top = () => G(() => { const g = document.querySelector('[data-nova8]').nova8.game; return g.top ? g.top.kind : null; });
const worldIdle = () => G(() => { const g = document.querySelector('[data-nova8]').nova8.game; return g.top && g.top.kind === 'World' && !g.top.busy && !g.top.player.moving; });
async function mash(until, max = 200, k = 'Space') { for (let i = 0; i < max; i++) { if (await until()) { await sleep(450); if (await until()) return true; } await key(k, 30); await sleep(120); } return false; }
async function walk(dir, tiles) { await page.keyboard.down(dir); await sleep(tiles * 290 + 60); await page.keyboard.up(dir); await sleep(250); }
async function settle() { for (let i = 0; i < 30; i++) { if (await worldIdle()) { await sleep(500); if (await worldIdle()) return; } else { await key('Space', 30); await sleep(250); } } }
const placeRaw = (x, y, dir) => G((x, y, dir) => { const w = document.querySelector('[data-nova8]').nova8.game.top; w.place('player', x, y, dir); w.buildFollowers(); }, x, y, dir);
const place = async (x, y, dir) => { await settle(); await placeRaw(x, y, dir); };

await page.click('.n8-overlay');
await sleep(2400);
await key('Space'); await sleep(300); await key('Space'); await sleep(800);
await key('Escape'); await sleep(1400);
await key('Space'); await sleep(300); await key('Space'); await sleep(300);
await key('Enter'); await sleep(600); await key('Space'); await sleep(2000);
await mash(worldIdle, 80);
console.log('awake, top:', await top());
// walk to the grove: down 2, right along the path, up into the grove
await walk('KeyS', 2); await walk('KeyD', 11); await walk('KeyW', 3);
await shot('grove');
const podX = { tiger: 12, dragon: 15, octo: 18 }[species];
await place(podX, 4, 'up');
await sleep(200);
await key('Space'); await sleep(900);
await shot('chooser');
if (species === 'dragon' && variant === 'blue') { await key('KeyS'); await sleep(500); await shot('chooser-blue'); }
await key('Space'); await sleep(900);
await mash(async () => (await top()) === 'Menu', 10);
await key('Space'); await sleep(1200);   // YES
await shot('chosen');
await mash(worldIdle, 80);
await shot('with-pet');
// the drone
await place(22, 11, 'right'); await sleep(200);
await key('Space'); await sleep(600); await mash(worldIdle, 30);
await shot('drone-open');
await walk('KeyD', 7); await sleep(1500);
await mash(worldIdle, 30);
await shot('wilds');
// ride
await key('ShiftLeft'); await sleep(400);
await shot('riding');
await walk('KeyD', 3);
await shot('riding-moved');
// a wild battle
await mash(worldIdle, 40);
await G(() => { const w = document.querySelector('[data-nova8]').nova8.game.top; w.run((g, w) => w.battle({ species: 'glorp', lv: 3 })); });
await sleep(1600);
await shot('battle-intro');
await mash(async () => (await top()) === 'Menu', 30);
await shot('battle-menu');
await key('Space'); await sleep(400);
await shot('battle-moves');
await key('Space'); await sleep(700);
await shot('battle-attack');
for (let i = 0; i < 120 && (await top()) !== 'World'; i++) { await key('Space', 30); await sleep(150); if (i === 10) await shot('battle-mid'); }
await mash(worldIdle, 40);
await shot('after-battle');
// Enya: make the companion a bit stronger first so the test can win
await G(() => { const g = document.querySelector('[data-nova8]').nova8.game; g.state.pet.lv = 7; g.state.pet.hp = 70; g.state.pet.en = 13; });
await place(11, 17, 'down'); await sleep(200);
await walk('KeyS', 1); await sleep(1200);
await shot('alpha');
for (let i = 0; i < 300 && !(await G(() => !!document.querySelector('[data-nova8]').nova8.game.state.flags.enya)); i++) { await key('Space', 30); await sleep(140); if (i === 30) await shot('alpha-battle'); if (i === 60) await shot('alpha-battle2'); }
await mash(worldIdle, 60);
await shot('enya-joined');
await walk('KeyD', 2);
await shot('party');
// the nav core
await place(21, 15, 'right'); await sleep(200); await walk('KeyD', 1); await sleep(800); await mash(worldIdle, 40);
// the boss
await G(() => { const g = document.querySelector('[data-nova8]').nova8.game; g.state.pet.lv = 10; g.state.pet.hp = 80; });
await place(37, 25, 'right'); await sleep(200);
await key('Space'); await sleep(600);
await mash(async () => (await top()) === 'Menu', 30);
await key('Space'); await sleep(2200);
await shot('boss');
for (let i = 0; i < 400 && !(await G(() => !!document.querySelector('[data-nova8]').nova8.game.state.flags['rustclaw-beaten'])); i++) { await key('Space', 30); await sleep(140); if (i === 40) await shot('boss-mid'); if (await top() === 'World' && await worldIdle()) { await place(37, 25, 'right'); await key('Space'); } }
await mash(worldIdle, 60);
await shot('boss-won');
// back to the ship
await G(() => { const w = document.querySelector('[data-nova8]').nova8.game.top; w.load('bloomhaven', 4, 5, 'up'); });
await sleep(400);
await key('Space'); await sleep(800);
for (let i = 0; i < 80 && (await top()) !== 'Ending'; i++) { await key('Space', 30); await sleep(150); }
await sleep(800);
await shot('ending');
const st = await G(() => JSON.stringify(document.querySelector('[data-nova8]').nova8.game.state));
console.log('state:', st.slice(0, 600));
const pet = JSON.parse(st).pet;
console.log('companion:', pet.species, pet.variant, pet.name);
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();
