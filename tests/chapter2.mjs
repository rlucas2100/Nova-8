// The new characters and Chapter 2, sped up: CODY in the Wilds (GOLDEN CATNIP), the Whisperwood (NOVA learns the
// FIRE TIGER RING) and the Jelly Jam; a turtle's gift; humming her tune; NOVA saving Enya's echo from a ghoul;
// then Chapter 2: the COMET's hops and dreams, the Venom Mire (Cody's staff bridge, snakes, OOZEFANG), the Jade
// Lagoon (the DRAGON KING, the gong, the WHITE DRAGON, Cody's sunglasses), the Withered Deep (the BLACK DRAGON,
// with Cody) and the end of Chapter 2.
// node tests/chapter2.mjs [url] [from=lagoon]   (from=lagoon starts at the Jade Lagoon, for a quicker run)
import puppeteer from 'puppeteer-core';
const url = process.argv.slice(2).find((a) => a.startsWith('http')) || 'http://localhost:5199/';
const FROM = (process.argv.find((a) => a.startsWith('from=')) || 'from=').slice(5);
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message + '\n' + e.stack));
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) errors.push('console: ' + m.text()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 0;
async function shot(name) { const el = await page.$('.n8-screen'); await el.screenshot({ path: `tests/shots/c2-${String(++n).padStart(2, '0')}-${name}.png` }); }
async function key(code, hold = 50) { await page.keyboard.down(code); await sleep(hold); await page.keyboard.up(code); await sleep(60); }
const G = (fn, ...a) => page.evaluate(fn, ...a);
const game = 'document.querySelector("[data-nova8]").nova8.game';
const top = () => G(`(${game}).top ? (${game}).top.kind : null`);
const worldIdle = () => G(`(() => { const g = ${game}; return g.top && g.top.kind === 'World' && !g.top.busy && !g.top.player.moving; })()`);
const state = () => G(`JSON.parse(JSON.stringify((${game}).state))`);
async function mash(until, max = 300) { for (let i = 0; i < max; i++) { if (await until()) { await sleep(300); if (await until()) return true; } await key('Space', 30); await sleep(90); } return false; }
const place = (x, y, dir) => G(`(() => { const w = (${game}).top; w.place('player', ${x}, ${y}, '${dir}'); w.buildFollowers(); })()`);
const check = (ok, what) => console.log((ok ? 'ok   ' : 'FAIL ') + what);
/* stand next to someone (by id), face them and press A */
async function talkTo(id) {
  await G(`(() => { const n = (${game}).top.npc('${id}'); if (n) n.wander = false; })()`);   // wanderers: stop, and finish any step
  for (let i = 0; i < 20 && (await G(`!!((${game}).top.npc('${id}') || {}).moving`)); i++) await sleep(50);
  const spot = await G(`(() => { const w = (${game}).top, n = w.npc('${id}'); if (!n) return null;
    for (const [dx, dy, d] of [[0, 1, 'up'], [-1, 0, 'right'], [1, 0, 'left'], [0, -1, 'down']]) { const x = n.x + dx, y = n.y + dy; if (!w.blocked(x, y, w.player)) { n.wander = false; return [x, y, d]; } } return null; })()`);
  if (!spot) { console.log('  (no spot next to ' + id + ')'); return; }
  await place(spot[0], spot[1], spot[2]); await sleep(150);
  await key('Space'); await sleep(500);
}
/* in a battle: the foe is down to its last HP, then keep pressing A (FIGHT, first move) until it's over */
async function winBattle(snap) {
  for (let i = 0; i < 40 && (await top()) !== 'Battle' && !(await G(`!!(${game}).scenes.find((s) => s.kind === 'Battle')`)); i++) { await key('Space', 30); await sleep(150); }
  await sleep(1200);
  if (snap) await shot(snap);
  await G(`(() => { const b = (${game}).scenes.find((s) => s.kind === 'Battle'); if (b) { b.foe.hp = 1; b.foe.disp = 1; } })()`);
  for (let i = 0; i < 400 && (await G(`!!(${game}).scenes.find((s) => s.kind === 'Battle')`)); i++) { await key('Space', 30); await sleep(110); }
}

const save = {
  v: 3, name: 'KAI', map: 'wilds', x: 14, y: 11, dir: 'up', riding: false,
  pet: { species: 'tiger', variant: 'red', name: 'NOVA', lv: 9, xp: 0, moves: [], taught: [], hp: 70, en: 14 },
  flags: { awake: true, 'sprig-grove': true, 'gate-open': true, enya: true, 'alpha-beaten': true, 'open-pod-tiger': true, 'wilds-intro': true, 'thorns-cleared': true, 'jungle-intro': true, 'groove-intro': true },
  got: {}, parts: { fuelcell: true }, jewels: { gold: 3, emerald: 1, sapphire: 0, ruby: 0, diamond: 0 }, money: 8,
  bag: { berry: 2, tonic: 1, melon: 0, tube: 0, catnip: 0 }, tubes: {}, captures: 0, memories: ['fire', 'name', 'gem'], furyT: 0,
  respawn: { map: 'wilds', x: 5, y: 10, dir: 'down' }, steps: 100, battles: 3, playMs: 300000, goal: 'Find the other ship parts.',
};
await page.goto(url, { waitUntil: 'networkidle0' });
await G((s) => { localStorage.clear(); localStorage.setItem('cosmic-castaways.save.v1', s); }, JSON.stringify(save));
await page.reload({ waitUntil: 'networkidle0' });
await page.click('.n8-overlay'); await sleep(2300);
await key('Space'); await sleep(300); await key('Space'); await sleep(1600);   // CONTINUE
await mash(worldIdle, 10);
await G(`(${game}).speed = 3`);
let st;
if (FROM === 'lagoon') {
  await G(`(() => { const g = ${game}, st = g.state;
    Object.assign(st.flags, { chapter1: true, 'enya-gone': true, ch2: true, 'mire-intro': true, 'staff-bridge': true, 'snake-1': true, 'snake-2': true, 'oozefang-beaten': true, 'bridge-fixed': true, 'mire-done': true, 'met-cody': true, 'cody-wilds': true, 'cody-wood': true, 'cody-jam': true, 'dream-summer': true, 'dream-war': true });
    Object.assign(st.parts, { navcore: true, thruster: true, warpcoil: true }); st.memories.push('tune', 'summer', 'squash', 'years');
    st.pet.lv = 26; st.pet.hp = 150; st.pet.taught = ['firering']; st.pet.moves.push('firering'); })()`);
  await G(`void (${game}).top.load('lagoon', 4, 21, 'down')`); await sleep(500);
  await G(`(() => { const w = (${game}).top; w.run((g) => g.wait(1)); })()`);
}
const skip = !!FROM;

if (!skip) {
// ---- CODY in the Crimson Wilds: asleep standing up; a GOLDEN CATNIP; the staff goes in his ear ----
await sleep(400); await shot('cody-asleep');
await talkTo('cody');
await shot('cody-wakes');
for (let i = 0; i < 60 && !(await G(`!!(${game}).top.staff || ((${game}).scenes.find((s) => s.kind === 'World') || {}).staff`)); i++) { await key('Space', 30); await sleep(120); }
await sleep(150); await shot('cody-staff-small');
await mash(worldIdle, 80);
st = await state();
check(st.bag.catnip === 1 && st.flags['cody-wilds'] && st.flags['met-cody'], 'CODY in the Wilds gave a GOLDEN CATNIP (' + st.bag.catnip + ')');

// ---- GOLDEN CATNIP from the BAG: a level up ----
const lv0 = st.pet.lv;
await key('Escape'); await sleep(300); await key('KeyS'); await key('Space'); await sleep(400);   // BAG
for (let i = 0; i < 4; i++) await key('KeyS', 30);                                             // down to GOLDEN CATNIP
await shot('bag-catnip');
await key('Space'); await sleep(400);
for (let i = 0; i < 10 && (await top()) === 'Dialog'; i++) { if (i === 1) await shot('catnip-levelup'); await key('Space', 30); await sleep(200); }
await key('KeyK'); await sleep(200); await key('KeyK'); await sleep(300);
st = await state();
check(st.pet.lv === lv0 + 1 && st.bag.catnip === 0, 'the catnip levelled NOVA up (' + lv0 + ' -> ' + st.pet.lv + ')');

// ---- a turtle's gift, and then some peace and quiet ----
const before = JSON.stringify(st.bag) + st.money;
await talkTo('t-wy'); await shot('turtle-gift');
await mash(worldIdle, 30);
st = await state();
check(st.got['turtle-t-wy'] && JSON.stringify(st.bag) + st.money !== before, 'the yellow turtle had a gift (money ' + st.money + ')');
await talkTo('t-wy'); await mash(worldIdle, 20);

// ---- humming her tune (NOVA joins in): HER TUNE ----
await G(`(() => { const w = (${game}).top; w.humT = 1; })()`);
for (let i = 0; i < 40 && !(await G(`(${game}).toasts.some((t) => t.str.includes('hum') || t.str.includes('whistle'))`)); i++) await sleep(50);
await sleep(300); await shot('whistle');
await sleep(1500); await shot('nova-hums');
await mash(worldIdle, 40);
st = await state();
check(st.memories.includes('tune'), 'whistling brought back HER TUNE');

// ---- CODY in the Whisperwood: NOVA learns the FIRE TIGER RING ----
await G(`void (${game}).top.load('jungle', 15, 22, 'down')`); await sleep(400);
await talkTo('cody');
for (let i = 0; i < 80 && !(await G(`((${game}).scenes.find((s) => s.kind === 'World') || {}).particles.some((q) => q.kind === 'firering')`)); i++) { await key('Space', 30); await sleep(120); }
await sleep(200); await shot('fire-ring-lesson');
await mash(worldIdle, 80);
st = await state();
check(st.pet.moves.includes('firering') && st.pet.taught.includes('firering'), 'NOVA learned the FIRE TIGER RING');

// ---- a ghoul grabs Enya's echo: NOVA's ring of fire ----
// one step with the dice loaded (it happens at random as you walk the Wilds, the Whisperwood or the Jelly Jam)
await place(5, 12, 'right'); await sleep(200);
await G(`(() => { const g = ${game}; g.state.sinceRescue = 999; window.__rnd = Math.random; Math.random = () => 0.001; })()`);
await key('KeyD', 120);
await sleep(100);
await G(`(() => { Math.random = window.__rnd; })()`);
for (let i = 0; i < 30 && !(await G(`!!((${game}).scenes.find((s) => s.kind === 'World') || {}).npc('rescueGhoul')`)); i++) await sleep(100);
await sleep(500); await shot('enya-grabbed');
for (let i = 0; i < 30 && !(await G(`((${game}).scenes.find((s) => s.kind === 'World') || {}).particles.some((q) => q.kind === 'firering')`)); i++) { await key('Space', 30); await sleep(120); }
await sleep(250); await shot('nova-saves-enya');
await mash(worldIdle, 40);
st = await state();
check(st.flags.rescued, 'NOVA saved ENYA from the ghoul');

// ---- a FIRE TIGER RING in battle ----
await G(`void (${game}).top.run((g, w) => w.battle({ species: 'vinesnap', lv: 6 }))`);
await mash(async () => (await top()) === 'Menu', 40);
await key('Space'); await sleep(300);
const moves = await G(`(${game}).top.items.map((i) => i.label)`);
for (let i = 0; i < moves.indexOf('FIRE TIGER RING'); i++) await key('KeyS', 30);
await shot('fire-ring-menu');
await key('Space');
for (let i = 0; i < 40 && !(await G(`((${game}).scenes.find((s) => s.kind === 'Battle') || { fx: [] }).fx.some((f) => f.k === 'fring')`)); i++) { await key('Space', 30); await sleep(80); }
await sleep(250); await shot('fire-ring-battle');
for (let i = 0; i < 200 && (await G(`!!(${game}).scenes.find((s) => s.kind === 'Battle')`)); i++) { await key('Space', 30); await sleep(110); }
await mash(worldIdle, 30);

// ---- CODY at the Jelly Jam ----
await G(`void (${game}).top.load('groove', 16, 14, 'down')`); await sleep(400);
await talkTo('cody'); await shot('cody-jam');
await mash(worldIdle, 60);
st = await state();
check(st.flags['cody-jam'] && st.bag.catnip === 1, 'CODY at the Jelly Jam wants sunglasses (and gave a catnip)');

// ================= Chapter 2 =================
await G(`(() => { const st = (${game}).state; Object.assign(st.flags, { chapter1: true, 'enya-gone': true, 'gem-spark': true, 'rustclaw-beaten': true }); Object.assign(st.parts, { navcore: true, thruster: true }); st.pet.lv = 26; st.pet.hp = 150; })()`);
await G(`void (${game}).top.load('bloomhaven', 4, 5, 'up')`); await sleep(500);
await key('Space'); await sleep(500);                                 // the COMET
for (let i = 0; i < 20 && (await top()) !== 'Menu'; i++) { await key('Space', 30); await sleep(150); }
await shot('comet-hops');
await key('Space'); await sleep(800);                                 // THE VENOM MIRE
await shot('flight');
for (let i = 0; i < 40 && (await top()) !== 'Dream'; i++) await sleep(150);
await sleep(1200); await shot('dream-summer');
// the dream: talk, then wall-ball (press A when the ball comes), then the roof, Mr Nolan, and RUN
let shotRally = false, shotNolan = false;
for (let i = 0; i < 500 && (await top()) !== 'World'; i++) {
  const d = await G(`(() => { const s = (${game}).scenes.find((q) => q.kind === 'Dream'); return s ? { prompt: s.prompt, nolan: s.nolan, ball: !!s.ball } : null; })()`);
  if (d && d.prompt) { if (!shotRally) { await shot('dream-rally'); shotRally = true; } await key('Space', 30); }
  if (d && d.nolan && !shotNolan) { await sleep(300); await shot('dream-nolan'); shotNolan = true; }
  await key('Space', 30); await sleep(110);
}
await mash(worldIdle, 60);
st = await state();
check(st.map === 'mire' && st.memories.includes('summer') && st.memories.includes('squash'), 'hopped to the Mire, dreaming of SUMMER DAYS and THE TENNIS BALL');
await shot('mire');

// the broken bridge: Cody's staff
await place(26, 15, 'right'); await sleep(200);
await key('KeyA'); await sleep(200); await key('KeyD'); await sleep(600);   // step off and back on to trigger
for (let i = 0; i < 60 && !(await G(`!!((${game}).scenes.find((s) => s.kind === 'World') || {}).staff`)); i++) { await key('Space', 30); await sleep(120); }
await sleep(300); await shot('staff-extends');
await mash(worldIdle, 60);
st = await state();
check(st.flags['staff-bridge'], "CODY's staff bridges the gap");
await shot('staff-bridge');
for (const [x, sp] of [[28, 'hissling'], [30, 'spitviper']]) {
  await place(x - 1, 15, 'right'); await sleep(150);
  await key('KeyD'); await sleep(500);
  await winBattle(x === 28 ? 'battle-mire' : null);
  await mash(worldIdle, 30);
}
st = await state();
check(st.flags['snake-1'] && st.flags['snake-2'], 'the snakes on the bridge are beaten');
await place(30, 15, 'right'); await sleep(150); await key('KeyD'); await sleep(500);
await winBattle('oozefang');
await mash(worldIdle, 100);
st = await state();
check(st.parts.warpcoil && st.flags['mire-done'] && st.flags['bridge-fixed'], 'OOZEFANG beaten: the WARP COIL');

// hop to the Jade Lagoon (dreaming of the war)
await place(5, 13, 'up'); await sleep(200); await key('Space'); await sleep(500);
for (let i = 0; i < 20 && (await top()) !== 'Menu'; i++) { await key('Space', 30); await sleep(150); }
const hopItems = await G(`(${game}).top.items.map((i) => i.label)`);
for (let i = 0; i < hopItems.indexOf('THE JADE LAGOON'); i++) await key('KeyS', 30);
await key('Space'); await sleep(800);
for (let i = 0; i < 40 && (await top()) !== 'Dream'; i++) await sleep(150);
await sleep(2500); await shot('dream-war');
for (let i = 0; i < 300 && (await top()) !== 'World'; i++) { await key('Space', 30); await sleep(110); if (i === 40) await shot('dream-dawn'); }
await mash(worldIdle, 60);
st = await state();
check(st.map === 'lagoon' && st.memories.includes('years'), 'hopped to the Jade Lagoon, dreaming of THE LOST YEARS');
}
await shot('lagoon');
await talkTo('crab1'); await mash(worldIdle, 20);

// the palace: Cody, the Dragon King, the fight, the gong, the White Dragon, sunglasses
await place(25, 13, 'up'); await sleep(200); await key('KeyW'); await sleep(700);
await shot('palace');
for (let i = 0; i < 40 && (await top()) !== 'Menu'; i++) { await key('Space', 30); await sleep(130); if (i === 6) await shot('palace-staff'); }
await key('Space'); await sleep(300);                                // FIGHT? YES
await winBattle('dragon-king');
for (let i = 0; i < 200 && (await top()) !== 'Menu'; i++) { await key('Space', 30); await sleep(110); if (i === 30) await shot('white-dragon'); }
await shot('cody-shades');
st = await state();
check(st.parts.starcore && st.flags.gong && st.flags['cody-shades'], 'the DRAGON KING beaten: the STAR CORE; the gong; CODY gets his sunglasses');
await key('Space'); await sleep(800);                                // FLY!
for (let i = 0; i < 300 && !(await worldIdle()); i++) { await key('Space', 30); await sleep(110); if (i === 2) await shot('dragon-flight'); }
st = await state();
check(st.map === 'deep' && st.memories.includes('chair'), 'flew to the Withered Deep: AN EMPTY CHAIR');
await shot('deep-grey');

// the Black Dragon, with Cody
await place(29, 14, 'up'); await sleep(200); await key('KeyS'); await sleep(200); await key('KeyW'); await sleep(600);
for (let i = 0; i < 40 && !(await G(`!!(${game}).scenes.find((s) => s.kind === 'Battle')`)); i++) { await key('Space', 30); await sleep(130); if (i === 8) await shot('black-dragon'); }
await sleep(1500); await shot('battle-black-cody');
await G(`(() => { const b = (${game}).scenes.find((s) => s.kind === 'Battle'); if (b) { b.foe.hp = Math.round(b.foe.maxHp * 0.25); b.foe.disp = b.foe.hp; } })()`);
let codyShot = false;
for (let i = 0; i < 500 && (await G(`!!(${game}).scenes.find((s) => s.kind === 'Battle')`)); i++) {
  if (!codyShot && (await G(`((${game}).scenes.find((s) => s.kind === 'Battle') || { fx: [] }).fx.some((f) => f.k && f.k.startsWith('staff'))`))) { await sleep(120); await shot('cody-staff-attack'); codyShot = true; }
  await key('Space', 30); await sleep(100);
}
for (let i = 0; i < 400 && (await top()) !== 'Ending'; i++) { await key('Space', 30); await sleep(110); if (i === 25) await shot('deep-healed'); if (i === 160) await shot('chapter2-bloomhaven'); }
await sleep(2500); await shot('chapter2-complete');
st = await state();
check(st.parts.solarsail && st.flags['deep-healed'] && st.memories.includes('birdsong'), 'the BLACK DRAGON beaten: the SOLAR SAIL, the Deep healed, BIRDSONG');
check(st.flags.chapter2, 'Chapter 2 complete');
await key('Space'); await sleep(800);
await mash(worldIdle, 30);
await shot('after');
st = await state();
console.log('memories:', st.memories.join(', '));
console.log('pet: Lv', st.pet.lv, 'moves', st.pet.moves.join(', '));
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();
