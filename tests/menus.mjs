// Screens: pause menu, party (+Enya), bag, quest, shop, options; and a battle for each companion.
import puppeteer from 'puppeteer-core';
const url = process.argv[2] || 'http://localhost:5199/';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message + '\n' + e.stack));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto(url, { waitUntil: 'networkidle0' });
const save = (pet) => ({ v: 1, name: 'LUNA', gender: 'girl', map: 'bloomhaven', x: 14, y: 12, dir: 'up', pet, riding: false,
  flags: { awake: true, 'sprig-grove': true, 'gate-open': true, enya: true, 'open-pod-tiger': true }, got: {}, parts: { fuelcell: true },
  jewels: { gold: 7, emerald: 2, sapphire: 1, ruby: 3, diamond: 1 }, money: 39, bag: { berry: 2, tonic: 1, melon: 0 },
  respawn: { map: 'bloomhaven', x: 14, y: 12, dir: 'up' }, steps: 321, battles: 6, playMs: 754000, goal: 'Find the other ship parts: the NAV CORE (river island) and the THRUSTER.' });
let n = 0;
async function shot(name) { const el = await page.$('.n8-screen'); await el.screenshot({ path: `tests/shots/m-${String(++n).padStart(2, '0')}-${name}.png` }); }
async function key(code, hold = 50) { await page.keyboard.down(code); await sleep(hold); await page.keyboard.up(code); await sleep(80); }
const G = (fn, ...a) => page.evaluate(fn, ...a);
for (const [species, variant, lv] of [['tiger', 'red', 7], ['octo', 'red', 7], ['dragon', 'blue', 7]]) {
  const moves = { tiger: ['claw', 'roar', 'pounce', 'tigerstep', 'flameaura'], octo: ['whip', 'ink', 'glowpulse', 'mindwave', 'prism'], dragon: ['swipe', 'frost', 'tailswipe', 'mist', 'dragondive'] }[species];
  const name = { tiger: 'NOVA', octo: 'LUMI', dragon: 'AZURE' }[species];
  await G((s) => { localStorage.clear(); localStorage.setItem('cosmic-castaways.save.v1', s); }, JSON.stringify(save({ species, variant, name, lv, xp: 30, moves, hp: 50, en: 12 })));
  await page.reload({ waitUntil: 'networkidle0' });
  await page.click('.n8-overlay'); await sleep(2300);
  await key('Space'); await sleep(300); await key('Space'); await sleep(1500);   // CONTINUE
  if (species === 'tiger') {
    await key('Escape'); await sleep(300); await shot('pause');
    await key('Space'); await sleep(300); await shot('party');
    await key('KeyD'); await sleep(300); await shot('party-enya');
    await key('KeyK'); await sleep(200); await key('KeyS'); await key('Space'); await sleep(300); await shot('bag');
    await key('KeyK'); await sleep(200); await key('KeyS'); await key('Space'); await sleep(300); await shot('quest');
    await key('KeyK'); await sleep(200); await key('KeyS'); await key('KeyS'); await key('Space'); await sleep(300); await shot('options');
    await key('KeyK'); await sleep(200); await key('KeyK'); await sleep(300);
    // shop
    await G(() => { const w = document.querySelector('[data-nova8]').nova8.game.top; w.place('player', 17, 9, 'up'); w.buildFollowers(); });
    await key('Space'); await sleep(900); await key('Space'); await sleep(500); await shot('shop');
    for (let i = 0; i < 20; i++) { const ok = await G(() => { const g = document.querySelector('[data-nova8]').nova8.game; return g.top.kind === 'World' && !g.top.busy; }); if (ok) break; await key(i % 2 ? 'Space' : 'KeyK'); await sleep(200); }
    // fountain + Enya follower + tiger hearts
    await G(() => { const w = document.querySelector('[data-nova8]').nova8.game.top; w.place('player', 14, 12, 'up'); w.buildFollowers(); });
    await sleep(300); await shot('party-walk');
    // the classic green screen
    await G(() => { const g = document.querySelector('[data-nova8]').nova8.game; g.setScreen('classic'); });
    await sleep(300); await shot('classic');
    await G(() => { const g = document.querySelector('[data-nova8]').nova8.game; g.setScreen('violet'); });
    await sleep(300); await shot('violet');
    await G(() => { const g = document.querySelector('[data-nova8]').nova8.game; g.setScreen('colour'); });
  }
  await G(() => { const w = document.querySelector('[data-nova8]').nova8.game.top; w.run((g, w) => w.battle({ species: 'sporelet', lv: 5 })); });
  await sleep(1500);
  for (let i = 0; i < 12; i++) { await key('Space', 30); await sleep(150); const t = await G(() => document.querySelector('[data-nova8]').nova8.game.top.kind); if (t === 'Menu') break; }
  await key('Space'); await sleep(300);
  await key('KeyS'); await key('KeyS'); await key('KeyS'); await sleep(200);
  await shot(species + '-moves');
  await key('Space'); await sleep(1100); await shot(species + '-fx1');
  await sleep(500); await shot(species + '-fx2');
}
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();
