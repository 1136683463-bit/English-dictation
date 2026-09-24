// 探测：应用在纯浏览器（非 Tauri）下能否渲染语法模块，有无阻断性控制台错误。
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");

const BASE = "http://127.0.0.1:1420";
const OUT = fileURLToPath(new URL("../probe/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 300)); });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).slice(0, 300)));

for (const route of ["/grammar", "/grammar/lesson/lesson-01-am", "/grammar/hunt", "/grammar/diary"]) {
  errors.length = 0;
  const resp = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 }).catch((e) => e);
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => {
    const main = document.querySelector("main");
    return {
      title: document.title,
      hash: location.hash,
      path: location.pathname,
      bodyText: (document.body.innerText || "").trim().slice(0, 400),
      mainH: main ? main.scrollHeight : null,
      docH: document.documentElement.scrollHeight,
      nodes: document.querySelectorAll("*").length,
      dialogs: document.querySelectorAll('[role="dialog"]').length
    };
  });
  const safe = route.replace(/\//g, "_") || "_root";
  await page.screenshot({ path: OUT + "probe" + safe + ".png", fullPage: false });
  console.log("=== " + route + " ===");
  console.log("status:", resp && resp.status ? resp.status() : resp);
  console.log(JSON.stringify(info, null, 1).slice(0, 900));
  console.log("errors:", errors.length ? errors.slice(0, 5) : "none");
}

await browser.close();
