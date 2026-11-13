// Browser checks on the built site (npm run test:browser, after npm run build).
// Each check is a bug the site has actually had; the order of the opening itself is in opening.test.ts.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const OUT = new URL("../out/", import.meta.url).pathname;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ""; // the build's base path, e.g. /huif-website on Pages
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

let server, browser, url;
before(async () => {
  server = createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (!path.startsWith(BASE)) return res.writeHead(404).end();
    path = normalize(path.slice(BASE.length) || "/");
    if (path.endsWith("/")) path += "index.html";
    try {
      const body = await readFile(join(OUT, path));
      res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  }).listen(0);
  url = (p = "") => `http://127.0.0.1:${server.address().port}${BASE}/${p}`;
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  server?.close();
});

const page = async (opts = {}) => {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, ...opts });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.errors = errors;
  return p;
};
const visible = (p, sel) =>
  p.evaluate((s) => {
    const e = document.querySelector(s);
    const c = getComputedStyle(e);
    return e.getClientRects().length > 0 && c.visibility !== "hidden" && +c.opacity > 0.5;
  }, sel);
const headers = async (p) => [await visible(p, ".site-header--photo"), await visible(p, ".site-header--bar")].filter(Boolean).length;
const settle = (p, ms = 2500) => p.waitForTimeout(ms);

test("exactly one header: at the top, deep in the page, back at the top, and with reduced motion", async () => {
  const p = await page();
  await p.goto(url(), { waitUntil: "networkidle" });
  await settle(p, 800);
  assert.equal(await headers(p), 1, "at the top");
  await p.evaluate(() => scrollTo(0, 5000));
  await settle(p);
  assert.equal(await headers(p), 1, "deep in the page");
  assert.ok(await visible(p, ".site-header--bar"), "the slim bar shows deep in the page");
  await p.evaluate(() => scrollTo(0, 0));
  await settle(p);
  assert.equal(await headers(p), 1, "back at the top");
  assert.ok(await visible(p, ".site-header--photo"), "the opening's own header is back at the top");
  assert.deepEqual(p.errors, []);

  const r = await page({ reducedMotion: "reduce" });
  await r.goto(url(), { waitUntil: "networkidle" });
  assert.equal(await headers(r), 1, "with reduced motion");
});

test("scrolling deep and back up leaves the title in full over a gate at rest", async () => {
  const p = await page();
  await p.goto(url(), { waitUntil: "networkidle" });
  await settle(p, 1200);
  const rest = await p.evaluate(() => document.querySelector(".opening .gate-scene__gate").style.transform);
  await p.mouse.move(700, 450);
  for (let i = 0; i < 30; i++) await p.mouse.wheel(0, 150);
  await settle(p);
  for (let i = 0; i < 60; i++) await p.mouse.wheel(0, -150);
  await settle(p, 3500);
  const s = await p.evaluate(() => ({
    y: scrollY,
    title: +getComputedStyle(document.querySelector(".opening__title")).opacity,
    gate: document.querySelector(".opening .gate-scene__gate").style.transform,
  }));
  assert.equal(s.y, 0);
  assert.equal(s.title, 1, "the title is back in full");
  assert.equal(s.gate, rest, "the gate is back where it started");
});

test("the menu's links land on their own sections", async () => {
  const p = await page();
  for (const id of ["about", "panels", "programme"]) {
    await p.goto(url(`#${id}`), { waitUntil: "networkidle" });
    await settle(p, 3000);
    const top = await p.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, id);
    assert.ok(Math.abs(top) < 120, `#${id} is ${Math.round(top)}px from the top of the screen`);
  }
});

test("no sideways scrolling at 320px", async () => {
  const p = await page({ viewport: { width: 320, height: 640 } });
  const paths = ["", "partners/", await (async () => {
    await p.goto(url(), { waitUntil: "networkidle" });
    return p.evaluate(() => document.querySelector('a[href*="/panels/"]').getAttribute("href").replace(/^.*?panels\//, "panels/"));
  })()];
  for (const path of paths) {
    await p.goto(url(path), { waitUntil: "networkidle" });
    const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(over <= 0, `${path || "home"} scrolls sideways by ${over}px`);
  }
});
