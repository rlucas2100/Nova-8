// The new story and levels, sped up: the thorns (green eyes), the Whisperwood (LUMEN, a COSMIC TUBE
// capture, the Veil Gate vision and the GRIMGHOUL with a FURY burst), the Shroom Groove (the jelly
// ferry, the boombox, DJ JIGGLE's dance), talking to Enya's echo and petting NOVA, and the new screens.
// node tests/levels.mjs [url]
import puppeteer from 'puppeteer-core';
const url = process.argv[2] || 'http://localhost:5199/';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message + '\n' + e.stack));
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) errors.push('console: ' + m.text()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 0;
async function shot(name) { const el = await page.$('.n8-screen'); await el.screenshot({ path: `tests/shots/v-${String(++n).padStart(2, '0')}-${name}.png` }); }
async function key(code, hold = 50) { await page.keyboard.down(code); await sleep(hold); await page.keyboard.up(code); await sleep(60); }
const G = (fn, ...a) => page.evaluate(fn, ...a);
const game = 'document.querySelector("[data-nova8]").nova8.game';
const top = () => G(`(${game}).top ? (${game}).top.kind : null`);
const worldIdle = () => G(`(() => { const g = ${game}; return g.top && g.top.kind === 'World' && !g.top.busy && !g.top.player.moving; })()`);
const state = () => G(`JSON.parse(JSON.stringify((${game}).state))`);
async function mash(until, max = 200) { for (let i = 0; i < max; i++) { if (await until()) { await sleep(400); if (await until()) return true; } await key('Space', 30); await sleep(110); } return false; }
async function walk(dir, tiles) { await page.keyboard.down(dir); await sleep(tiles * 290 + 60); await page.keyboard.up(dir); await sleep(250); }
const place = (x, y, dir) => G(`(() => { const w = (${game}).top; w.place('player', ${x}, ${y}, '${dir}'); w.buildFollowers(); })()`);
const check = (ok, what) => console.log((ok ? 'ok   ' : 'FAIL ') + what);

const save = {
  v: 2, name: 'KAI', map: 'wilds', x: 38, y: 12, dir: 'right', riding: false,
  pet: { species: 'tiger', variant: 'red', name: 'NOVA', lv: 9, xp: 0, moves: [], hp: 70, en: 14 },
  flags: { awake: true, 'sprig-grove': true, 'gate-open': true, enya: true, 'alpha-beaten': true, 'open-pod-tiger': true, 'wilds-intro': true },
  got: {}, parts: { fuelcell: true }, jewels: { gold: 3, emerald: 1, sapphire: 0, ruby: 0, diamond: 0 }, money: 8,
  bag: { berry: 2, tonic: 1, melon: 0, tube: 0 }, tubes: {}, captures: 0, memories: ['fire', 'name', 'gem'], furyT: 0,
  respawn: { map: 'wilds', x: 5, y: 10, dir: 'down' }, steps: 100, battles: 3, playMs: 300000, goal: 'Find the other ship parts.',
};
await page.goto(url, { waitUntil: 'networkidle0' });
await G((s) => { localStorage.clear(); localStorage.setItem('cosmic-castaways.save.v1', s); }, JSON.stringify(save));
await page.reload({ waitUntil: 'networkidle0' });
await page.click('.n8-overlay'); await sleep(2300);
await key('Space'); await sleep(300); await key('Space'); await sleep(1600);   // CONTINUE
await mash(worldIdle, 10);

// ---- the black thorns: a vision, green eyes, torn apart ----
await walk('KeyD', 2); await sleep(600);
await shot('thorns');
await mash(worldIdle, 60);
let st = await state();
check(st.flags['thorns-cleared'], 'the thorns are torn down');
check(st.furyT > 0, 'his eyes are green (furyT ' + st.furyT + ')');
await shot('green-eyes');

// ---- talk to Enya's echo, pet NOVA ----
await G(`(() => { const w = (${game}).top; const en = w.followers.find((f) => f.kind === 'enya'); const p = w.player; en.x = p.x; en.y = p.y + 1; en.px = en.x * 16; en.py = en.y * 16; p.dir = 'down'; })()`);
await key('Space'); await sleep(900); await shot('enya-talk');
await mash(worldIdle, 40);
st = await state();
check(st.memories.includes('hill'), "talking to Enya's echo brings back STARRY HILL");
await G(`(() => { const w = (${game}).top; const pe = w.followers.find((f) => f.kind === 'pet'); const p = w.player; pe.x = p.x - 1; pe.y = p.y; pe.px = pe.x * 16; pe.py = pe.y * 16; p.dir = 'left'; })()`);
await key('Space'); await sleep(500); await shot('pet-nova');
await mash(worldIdle, 20);

// ---- into the Whisperwood ----
await place(41, 12, 'right'); await sleep(200);
await walk('KeyD', 2); await sleep(1500);
check((await state()).map === 'jungle', 'through to the Whisperwood');
await walk('KeyD', 2); await sleep(700);
await shot('jungle-intro');
await mash(worldIdle, 40);
await shot('jungle');

// ---- LUMEN, the Light Keeper ----
await place(34, 5, 'up'); await sleep(300);
await key('Space'); await sleep(900); await shot('lumen');
await mash(worldIdle, 60);
st = await state();
check(st.bag.tube === 3, 'LUMEN gave 3 COSMIC TUBES (' + st.bag.tube + ')');

// ---- a capture: weaken a LUMOTH, open a tube ----
await G(`void (${game}).top.run((g, w) => w.battle({ species: 'lumoth', lv: 4 }))`);
await sleep(1500); await shot('battle-jungle');
await mash(async () => (await top()) === 'Menu', 30);
await G(`(() => { const b = (${game}).scenes.find((s) => s.kind === 'Battle'); b.foe.hp = 1; b.foe.disp = 1; })()`);
await key('KeyD'); await sleep(150); await key('Space'); await sleep(400);      // BAG
await shot('bag-in-battle');
const items = await G(`(${game}).top.items.map((i) => i.label)`);
const ti = items.indexOf('COSMIC TUBE');
for (let i = 0; i < ti; i++) await key('KeyS', 30);
await key('Space'); await sleep(300);
for (let i = 0; i < 40; i++) { if (await G(`!!((${game}).scenes.find((s) => s.kind === 'Battle') || {}).tube`)) break; await key('Space', 30); await sleep(100); }
await sleep(900); await shot('tube-pull');
await sleep(1200); await shot('tube-wobble');
for (let i = 0; i < 120 && (await top()) !== 'World'; i++) { await key('Space', 30); await sleep(130); if (i === 4) await shot('captured'); }
await mash(worldIdle, 30);
st = await state();
check(st.captures === 1 && st.tubes.lumoth === 1, 'LUMOTH captured (captures ' + st.captures + ')');

// ---- the Veil Gate: a vision, a GRIMGHOUL, a FURY burst ----
await G(`(() => { const g = ${game}; g.state.captures = 3; g.state.pet.lv = 22; g.state.pet.hp = 160; })()`);
await place(34, 5, 'up'); await sleep(300);
await key('Space'); await sleep(400);
for (let i = 0; i < 30; i++) { if (await G(`(${game}).top.kind === 'Dialog' && ((${game}).scenes.find((s) => s.kind === 'World') || {}).gateGlow > 0`)) break; await key('Space', 30); await sleep(200); }
await sleep(600); await shot('gate-vision');
for (let i = 0; i < 80 && (await top()) !== 'Battle'; i++) { await key('Space', 30); await sleep(150); if (i === 8) await shot('gate-shatter'); }
await sleep(1500);
await shot('grimghoul');
await G(`(() => { const b = (${game}).scenes.find((s) => s.kind === 'Battle'); if (b) b.fury = 100; })()`);
for (let i = 0; i < 400 && (await top()) !== 'World'; i++) {
  await key('Space', 30); await sleep(120);
  if (await G(`!!((${game}).scenes.find((s) => s.kind === 'Battle') || {}).cutin`)) { await sleep(500); await shot('fury-cutin'); await sleep(900); await shot('warrior-strike'); }
}
await mash(worldIdle, 60);
st = await state();
check(st.flags['grimghoul-beaten'], 'the GRIMGHOUL is beaten');
check(st.memories.includes('veil') && st.memories.includes('blood'), 'memories: THE OTHER SIDE and WARRIOR BLOOD');

// ---- the Shroom Groove ----
await G(`void (${game}).top.load('wilds', 27, 4, 'up')`); await sleep(400);
await key('Space'); await sleep(700);
for (let i = 0; i < 10 && (await top()) !== 'Menu'; i++) { await key('Space', 30); await sleep(200); }
await key('Space'); await sleep(1500);   // YES
await shot('groove-arrive');
await mash(worldIdle, 40);
check((await state()).map === 'groove', 'the jelly ferry floated us down to the Shroom Groove');
await place(17, 14, 'up'); await sleep(900);
await shot('groove-town');
await sleep(400); await shot('groove-beat');
await place(20, 13, 'up'); await sleep(300);
await key('Space'); await sleep(700);
for (let i = 0; i < 10 && (await top()) !== 'Menu'; i++) { await key('Space', 30); await sleep(200); }
await key('Space'); await sleep(500);    // DANCE!
for (let i = 0; i < 6 && !(await G(`(${game}).top.kind === 'World'`)); i++) { await key('Space', 30); await sleep(250); }
await sleep(700); await shot('dance');
await sleep(900); await shot('dance2');
await mash(worldIdle, 50);
st = await state();
check(st.memories.includes('dance'), 'dancing brings back THE DANCE');
// a Groove battle
await G(`void (${game}).top.run((g, w) => w.battle({ species: 'shroomboom', lv: 5 }))`);
await sleep(1500); await shot('battle-groove');
for (let i = 0; i < 120 && (await top()) !== 'World'; i++) { await key('Space', 30); await sleep(130); }
await mash(worldIdle, 30);
// a ghoul in the Whisperwood (the veil background)
await G(`void (${game}).top.load('jungle', 16, 12, 'down')`); await sleep(300);
await G(`void (${game}).top.run((g, w) => w.battle({ species: 'ghoul', lv: 6 }))`);
await sleep(1500); await shot('battle-ghoul');
for (let i = 0; i < 120 && (await top()) !== 'World'; i++) { await key('Space', 30); await sleep(130); }
await mash(worldIdle, 30);

// ---- the screens ----
await key('Escape'); await sleep(300); await shot('pause');
await key('KeyS'); await key('KeyS'); await key('Space'); await sleep(400); await shot('tubes');
await key('KeyK'); await sleep(200); await key('KeyS'); await key('Space'); await sleep(300); await key('KeyD'); await sleep(300); await shot('memories');
await key('KeyS'); await key('KeyS'); await sleep(200); await shot('memories2');
await key('KeyK'); await sleep(200); await key('KeyK'); await sleep(300);
st = await state();
console.log('memories:', st.memories.join(', '));
console.log('tubes:', JSON.stringify(st.tubes), 'captures', st.captures);
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();
