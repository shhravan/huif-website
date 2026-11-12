// Build and serve out/, then run npm run test:site -- http://localhost:3200/huif-website/.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = process.argv[2] || 'http://localhost:3200/';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || undefined });
  let failures = 0;
  async function check(name, options, run) {
    const context = await browser.newContext(options);
    try {
      const page = await context.newPage();
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('.opening h1').count(), 1);
      await page.evaluate(() => document.fonts.ready);
      await run(page);
      console.log(`PASS ${name}`);
    } catch (error) {
      failures++;
      console.error(`FAIL ${name}: ${error.message}`);
    } finally { await context.close(); }
  }
  const phone = { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' };
  await check('panel selection survives layout changes', phone, async (page) => {
    for (const button of await page.locator('.panels__item').all()) {
      const title = await button.innerText();
      await button.click();
      await page.waitForTimeout(200); // Let layout-induced pointer events settle.
      assert.equal(await page.locator('.panels__item[aria-pressed="true"]').innerText(), title);
    }
    const next = page.getByRole('button', { name: 'Fashion & Design', exact: true });
    await next.focus();
    await next.press('Enter');
    assert.equal(await next.getAttribute('aria-pressed'), 'true');
  });
  await check('320px content fits the viewport', { viewport: { width: 320, height: 568 } }, async (page) => {
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(width <= 321, `document is ${width}px wide`);
  });
  await check('both schedule days keep their text visible', { viewport: { width: 320, height: 568 } }, async (page) => {
    for (const tab of await page.getByRole('tab').all()) {
      await tab.click();
      const clipped = await page.locator('[role="tabpanel"]:visible .cal__block').evaluateAll((blocks) =>
        blocks.flatMap((block) => [...block.children].filter((child) => child.getBoundingClientRect().bottom > block.getBoundingClientRect().bottom + 1).map((child) => child.textContent)));
      assert.deepEqual(clipped, []);
    }
    await page.getByRole('tab').nth(1).press('ArrowLeft');
    assert.equal(await page.getByRole('tab').nth(0).getAttribute('aria-selected'), 'true');
  });
  await check('reduced motion keeps the context heading', phone, async (page) => {
    assert.ok(await page.getByRole('heading', { name: 'A country too complex for a single narrative', exact: true }).isVisible(), 'context heading is hidden');
  });
  await check('context heading survives without JavaScript', { ...phone, javaScriptEnabled: false }, async (page) => {
    assert.ok(await page.getByRole('heading', { name: 'A country too complex for a single narrative', exact: true }).isVisible());
  });
  await check('landscape title clears the logo', { viewport: { width: 844, height: 390 } }, async (page) => {
    const title = await page.locator('.opening h1').boundingBox();
    const logo = await page.locator('.site-header:visible .site-header__logo').first().boundingBox();
    assert.ok(title.y >= logo.y + logo.height, `title begins at ${title.y}px; logo ends at ${logo.y + logo.height}px`);
  });
  await browser.close();
  process.exitCode = failures ? 1 : 0;
})().catch((error) => { console.error(error); process.exitCode = 1; });
