// The games page on the real site (php -S localhost:8000 in mysite): desktop + phone screenshots,
// console errors, and the cast sprites drawn.
import puppeteer from 'puppeteer-core';
const base = process.argv[2] || 'http://localhost:8000/';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [name, vp] of [['desktop', { width: 1366, height: 900 }], ['phone', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(base + 'games.php', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: `tests/shots/site-${name}-top.png` });
  await page.screenshot({ path: `tests/shots/site-${name}-full.png`, fullPage: true });
  const info = await page.evaluate(() => ({
    sprites: [...document.querySelectorAll('canvas[data-castaways-sprite]')].map((c) => c.classList.contains('is-drawn')).filter(Boolean).length,
    canvasCss: (() => { const c = document.querySelector('.n8-canvas'); return c ? c.style.width + 'x' + c.style.height : null; })(),
    scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
  }));
  console.log(name, JSON.stringify(info));
  if (name === 'phone') {
    // tap to play, press A through the boot
    const ov = await page.$('.n8-overlay');
    await ov.tap(); await sleep(2600);
    const a = await page.$('.n8-a'); await a.tap(); await sleep(500);
    const el = await page.$('.n8'); await el.screenshot({ path: `tests/shots/site-phone-console.png` });
  }
  console.log(errors.length ? errors.join('\n') : 'no errors');
  await page.close();
}
// homepage teaser
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });
await page.goto(base, { waitUntil: 'networkidle0' });
const t = await page.$('.game-teaser');
await t.scrollIntoView(); await sleep(500);
await t.screenshot({ path: 'tests/shots/site-teaser.png' });
await browser.close();
