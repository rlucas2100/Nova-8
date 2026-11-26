// Plays through the start of the game in headless Chrome, taking screenshots along the way.
// node tests/play.mjs [url]
import puppeteer from 'puppeteer-core';
const url = process.argv[2] || 'http://localhost:5199/';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle0' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shotN = { n: 0 };
async function shot(name) { const el = await page.$('.n8-screen'); await el.screenshot({ path: `tests/shots/p${String(++shotN.n).padStart(2, '0')}-${name}.png` }); }
async function key(code, hold = 60) { await page.keyboard.down(code); await sleep(hold); await page.keyboard.up(code); await sleep(60); }
const top = () => page.evaluate(() => { const g = document.querySelector('[data-nova8]').nova8.game; const t = g.top; return t ? t.kind : null; });
await page.click('.n8-overlay');
await sleep(2600);
await shot('title');
await key('Space'); await sleep(400);
await shot('menu');
await key('Space'); await sleep(1200);   // NEW GAME
await shot('intro');
await sleep(3800); await shot("intro-home"); await sleep(3200); await shot("intro-signal");
await key("Escape"); await sleep(1500);   // skip
await shot('remember');
for (let i = 0; i < 10 && (await page.evaluate(() => { const g = document.querySelector('[data-nova8]').nova8.game; return !!g.top && g.top.kind === 'Dialog'; })); i++) { await key('Space'); await sleep(300); }   // close "What was your name again...?"
await shot('name');
await key('ShiftLeft'); await sleep(300); // SELECT: a random name
await shot('random');
for (let i = 0; i < 7; i++) await key('Backspace', 30);
await key('KeyR'); await key('KeyY'); await key('KeyA'); await key('KeyN'); await sleep(200);
await shot('typed');
await key('Enter'); await sleep(800);
await shot('confirm');
await key('Space'); await sleep(2500);   // YES
await shot('wake');
for (let i = 0; i < 40; i++) { const t = await top(); if (t === 'World') { const busy = await page.evaluate(() => document.querySelector('[data-nova8]').nova8.game.top.busy); if (!busy) break; } await key('Space', 40); await sleep(300); }
await shot('awake');
console.log('top now:', await top());
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();
