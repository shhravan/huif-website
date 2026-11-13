// Scroll-smoothness check. Build the site, serve out/ (e.g. `npx serve out -l 3200`), then: npm run perf
// Scrolls through the pinned opening with wheel steps under 4x CPU throttle and reports frame stats.
// GREEN = p95 frame <= 25ms and <= 10% of frames slower than 25ms. Run it before shipping visual changes.
const { chromium } = require('playwright');
const url = process.argv[2] || 'http://localhost:3200/';
const label = process.argv[3] || 'baseline';
const extraCSS = process.argv[4] || '';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  if (extraCSS) await p.addStyleTag({ content: extraCSS });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.mouse.move(700, 450);
  await p.evaluate(() => { window.__f = []; let last = performance.now();
    const tick = (t) => { window.__f.push(t - last); last = t; if (!window.__stop) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); });
  for (let i = 0; i < 90; i++) { await p.mouse.wheel(0, 30); await p.waitForTimeout(16); }  // ~2700px: the whole pinned opening
  await p.waitForTimeout(1200);
  const f = await p.evaluate(() => { window.__stop = true; return window.__f.slice(2); });
  f.sort((a, b) => a - b);
  const pct = (q) => f[Math.min(f.length - 1, Math.floor(q * f.length))];
  const slow = f.filter((x) => x > 25).length / f.length;
  const red = pct(0.95) > 25 || slow > 0.10;
  console.log(`${red ? 'RED  ' : 'GREEN'} ${label.padEnd(22)} frames=${f.length} p50=${pct(0.5).toFixed(1)}ms p95=${pct(0.95).toFixed(1)}ms slow(>25ms)=${(slow * 100).toFixed(0)}%`);
  await b.close();
})();
