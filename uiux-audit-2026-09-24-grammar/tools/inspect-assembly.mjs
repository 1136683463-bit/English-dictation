// 观察拼句题：题干、词块、以及答案是否暴露在 DOM 里。
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const BASE = "http://127.0.0.1:1420";

const ctx = await chromium.launchPersistentContext(ROOT + ".browser-profile", { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const page = ctx.pages()[0] || (await ctx.newPage());
await page.goto(BASE + "/grammar/lesson/lesson-01-am", { waitUntil: "networkidle" });
await page.waitForTimeout(900);

// 若出现「继续刚才」，点它
await page.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) => /继续刚才/.test(x.textContent || ""));
  if (b) b.click();
});
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const main = document.querySelector("main");
  // 找包含 lesson-chip 的容器
  const chip = main.querySelector(".lesson-chip");
  const card = chip ? chip.closest('[class*="card"], section, div[class*="quiz"], div[class*="practice"]') : null;
  const holder = chip ? chip.parentElement.parentElement : null;
  return {
    body: (main.innerText || "").replace(/\s+/g, " ").slice(0, 600),
    holderHtml: holder ? holder.outerHTML.replace(/\s+/g, " ").slice(0, 2600) : null,
    cardClass: card ? String(card.className) : null,
    // 找出所有带 aria-label 的元素，看有没有藏着正确答案
    ariaLabels: [...main.querySelectorAll("[aria-label]")].map((e) => ({ t: e.tagName.toLowerCase(), c: String(e.className || "").slice(0, 30), a: e.getAttribute("aria-label") })),
    // 找所有 data-* 属性名，可能有 answers
    dataAttrs: [...new Set([...main.querySelectorAll("*")].flatMap((e) => [...e.attributes].filter((a) => a.name.startsWith("data-")).map((a) => a.name)))],
    placeholderNodes: [...main.querySelectorAll('[class*="slot"], [class*="drop"], [class*="answer"], [class*="target"]')].map((e) => ({ c: String(e.className).slice(0, 40), t: (e.textContent || "").trim().slice(0, 60), h: e.outerHTML.replace(/\s+/g, " ").slice(0, 120) }))
  };
});
console.log("正文:", info.body);
console.log("\n卡片类:", info.cardClass);
console.log("\ndata-* 属性:", info.dataAttrs.join(", "));
console.log("\naria-label 清单:");
for (const a of info.ariaLabels) console.log(`  ${a.t}.${a.c} → ${a.a}`);
console.log("\n可能的槽位/答案节点:");
for (const p of info.placeholderNodes) console.log(`  .${p.c} "${p.t}"\n     ${p.h}`);
console.log("\n词块容器 HTML:\n", info.holderHtml);

await ctx.close();
