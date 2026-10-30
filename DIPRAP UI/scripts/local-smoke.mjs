// One-off local smoke: mirrors scripts/browser-smoke.mjs checks for this Windows checkout.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = "http://127.0.0.1:8080";
const OUT = join(process.cwd(), "screenshots");
mkdirSync(OUT, { recursive: true });

const routes = [
  ["/", "home"],
  ["/analyze?view=overview", "analyze-overview"],
  ["/analyze?view=bars", "analyze-bars"],
  ["/analyze?view=flow", "analyze-flow"],
  ["/analyze?view=rhymes", "analyze-rhymes"],
  ["/analyze?view=story", "analyze-story"],
  ["/rhyme-lab", "rhyme-lab"],
  ["/flow-lab", "flow-lab"],
  ["/search", "search"],
  ["/projects", "projects"],
  ["/practice", "practice"],
  ["/settings", "settings"],
];

const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
const verdicts = [];

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const [route, slug] of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(String(err)));
    let status = null;
    let bodyText = "";
    let overflow = false;
    try {
      const response = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 20000 });
      status = response?.status() ?? null;
      await page.waitForTimeout(800);
      bodyText = (await page.evaluate(() => document.body.innerText)).trim();
      overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      );
      await page.screenshot({ path: join(OUT, `${vp.name}-${slug}.png`), fullPage: false });
    } catch (err) {
      pageErrors.push(String(err));
    }
    verdicts.push({
      viewport: vp.name,
      route,
      status,
      hasContent: bodyText.length > 40,
      textLength: bodyText.length,
      horizontalOverflow: overflow,
      consoleErrors,
      pageErrors,
    });
    await page.close();
  }
  await context.close();
}
await browser.close();

const failures = verdicts.filter(
  (v) => !v.hasContent || v.pageErrors.length > 0 || v.consoleErrors.length > 0 || v.status >= 400,
);
console.log(JSON.stringify({ ok: failures.length === 0, failures, total: verdicts.length }, null, 2));
if (failures.length > 0) process.exit(1);
