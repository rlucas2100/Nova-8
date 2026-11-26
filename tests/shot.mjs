// Screenshot helper for development: node tests/shot.mjs <url> <out.png> [width] [height] [waitMs] [js-to-run]
import puppeteer from 'puppeteer-core';
const [url, out, w = '900', h = '700', wait = '800', js = ''] = process.argv.slice(2);
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
await page.goto(url, { waitUntil: 'networkidle0' });
if (js) await page.evaluate(js);
await new Promise((r) => setTimeout(r, +wait));
await page.screenshot({ path: out });
if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
await browser.close();
