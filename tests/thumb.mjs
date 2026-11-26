import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 1000, deviceScaleFactor: 2 });
await page.goto('http://localhost:8000/games.php', { waitUntil: 'networkidle0' });
const save = { v: 1, name: 'KAI', gender: 'boy', map: 'wilds', x: 16, y: 16, dir: 'right', pet: { species: 'tiger', variant: 'red', name: 'NOVA', lv: 6, xp: 10, moves: ['claw', 'roar', 'pounce', 'tigerstep'], hp: 50, en: 12 }, riding: false,
  flags: { awake: true, 'sprig-grove': true, 'gate-open': true, enya: true, 'wilds-intro': true, 'alpha-beaten': true, 'alpha-zone': true }, got: {}, parts: { fuelcell: true }, jewels: { gold: 3, emerald: 1, sapphire: 0, ruby: 1, diamond: 0 }, money: 13, bag: { berry: 2, tonic: 0, melon: 0 }, respawn: { map: 'wilds', x: 5, y: 10, dir: 'down' }, steps: 100, battles: 3, playMs: 300000, goal: '' };
await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('cosmic-castaways.save.v1', s); localStorage.setItem('cosmic-castaways.console.v1', JSON.stringify({ skin: 'tiger', backdrop: 'kirra', sound: false })); }, JSON.stringify(save));
await page.reload({ waitUntil: 'networkidle0' });
await page.evaluate(() => document.querySelector('.n8-stage').scrollIntoView({ block: 'center' }));
await page.click('.n8-overlay'); await sleep(2400);
const key = async (c, h = 60) => { await page.keyboard.down(c); await sleep(h); await page.keyboard.up(c); await sleep(100); };
await key('Space'); await sleep(300); await key('Space'); await sleep(1600);
// walk a little so the party lines up, then stop facing the river
await page.keyboard.down('KeyD'); await sleep(560); await page.keyboard.up('KeyD'); await sleep(2600);
const el = await page.$('.n8-stage');
await el.screenshot({ path: 'tests/shots/thumb-stage.png' });
const box = await page.evaluate(() => { const s = document.querySelector('.n8-stage').getBoundingClientRect(); const c = document.querySelector('.n8-screen').getBoundingClientRect(); return { sx: s.x, sy: s.y, cx: c.x, cy: c.y, cw: c.width, ch: c.height }; });
console.log(JSON.stringify(box));
await browser.close();
