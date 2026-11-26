import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });
await page.goto('http://localhost:8000/games.php', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 800));
const got = await page.evaluate(() => new Promise((res) => {
  let ev = null;
  document.addEventListener('matrix:burst', (e) => { ev = e.detail; });
  document.querySelector('[data-nova8]').nova8.game.hooks.burst(21, 52);
  setTimeout(() => res({ ev, cls: document.body.className, burstVar: getComputedStyle(document.body).getPropertyValue('--burst') }), 300);
}));
console.log(JSON.stringify(got));
await page.screenshot({ path: 'tests/shots/burst.png' });
await browser.close();
