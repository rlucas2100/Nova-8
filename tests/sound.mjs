// The grove (pods), the companion chooser, hopping, and the soundboard on the games page.
// node tests/sound.mjs [base]   (base defaults to http://localhost:8000/, the site on php -S)
import puppeteer from 'puppeteer-core';
const base = process.argv[2] || 'http://localhost:8000/';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
await page.goto(base + 'games.php', { waitUntil: 'networkidle0' });
const save = { v: 1, name: 'KAI', gender: 'boy', map: 'bloomhaven', x: 15, y: 6, dir: 'up', pet: null, riding: false, flags: { awake: true, 'sprig-grove': true }, got: {}, parts: {}, jewels: { gold: 0, emerald: 0, sapphire: 0, ruby: 0, diamond: 0 }, money: 0, bag: { berry: 0, tonic: 0, melon: 0 }, respawn: { map: 'bloomhaven', x: 14, y: 12, dir: 'up' }, steps: 0, battles: 0, playMs: 0, goal: '' };
await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('cosmic-castaways.save.v1', s); }, JSON.stringify(save));
await page.reload({ waitUntil: 'networkidle0' });
await page.evaluate(() => document.querySelector('.n8-stage').scrollIntoView({ block: 'center' }));
let n = 0;
const shot = async (name) => { const el = await page.$('.n8-screen'); await el.screenshot({ path: `tests/shots/s-${String(++n).padStart(2, '0')}-${name}.png` }); };
const key = async (c, h = 50) => { await page.keyboard.down(c); await sleep(h); await page.keyboard.up(c); await sleep(80); };
const G = (fn) => page.evaluate(fn);
await page.click('.n8-overlay'); await sleep(2400);
await key('Space'); await sleep(300); await key('Space'); await sleep(1500);   // CONTINUE
await sleep(1500); await shot('grove-far');
await key('KeyW'); await sleep(400); await key('KeyW'); await sleep(500);
await shot('grove-near');
await sleep(1200); await shot('grove-near2');
await G(() => { const w = document.querySelector('[data-nova8]').nova8.game.top; w.place('player', 12, 4, 'up'); });
await key('Space'); await sleep(1200); await shot('chooser-tiger');
await sleep(700); await shot('chooser-tiger2');
await key('KeyD'); await sleep(900); await shot('chooser-dragon');
await key('KeyS'); await sleep(900); await shot('chooser-dragon-blue');
await key('KeyD'); await sleep(900); await shot('chooser-octo');
await key('KeyA'); await key('KeyA'); await sleep(300);
await key('Space'); await sleep(900); await shot('confirm');
await key('Space'); await sleep(1500); await shot('chosen');
for (let i = 0; i < 20; i++) { const ok = await G(() => { const g = document.querySelector('[data-nova8]').nova8.game; return g.top.kind === 'World' && !g.top.busy; }); if (ok) break; await key('Space', 30); await sleep(250); }
await key('KeyS'); await sleep(400);
await key('KeyK', 40); await sleep(150); await shot('hop');
await sleep(250); await shot('wiggle');
await key('ShiftLeft'); await sleep(300); await shot('ride');
// the soundboard
const sb = await page.$('[data-castaways-soundboard]');
await sb.scrollIntoView(); await sleep(400);
await page.screenshot({ path: 'tests/shots/s-board-0.png' });
const tracks = await page.$$('.sb-track');
await tracks[8].click(); await sleep(600);
const info1 = await G(() => ({ now: document.querySelector('.sb-title').textContent, where: document.querySelector('.sb-where').textContent, pressed: [...document.querySelectorAll('.sb-track[aria-pressed=true]')].length }));
const pads = await page.$$('.sb-pad');
await pads[0].click(); await sleep(200);
await page.screenshot({ path: 'tests/shots/s-board-1.png' });
await (await page.$('.sb-stop')).click(); await sleep(300);
const info2 = await G(() => ({ now: document.querySelector('.sb-title').textContent, where: document.querySelector('.sb-where').textContent }));
console.log(JSON.stringify(info1), JSON.stringify(info2));
for (let i = 0; i < pads.length; i++) { await pads[i].click(); await sleep(60); }
await sleep(600);
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();
