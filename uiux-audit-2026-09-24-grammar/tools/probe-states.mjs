// 收尾实测：完成态卡片子清单是否溢出 + 答错反馈与恢复路径。
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT = ROOT + "screenshots-states/";
mkdirSync(OUT, { recursive: true });
const BASE = "http://127.0.0.1:1420";

const ctx = await chromium.launchPersistentContext(ROOT + ".browser-profile-desktop", { viewport: { width: 1280, height: 720 } });
const page = ctx.pages()[0] || (await ctx.newPage());

console.log("############ A. 完成态课程卡片的子清单是否溢出卡片 ############");
await page.goto(BASE + "/grammar", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const card = await page.evaluate(() => {
  const c = document.querySelector("a.lesson-path-card.done");
  if (!c) return { found: false };
  const cr = c.getBoundingClientRect();
  const cs = getComputedStyle(c);
  const kids = [...c.querySelectorAll("*")].map((el) => {
    const r = el.getBoundingClientRect();
    return { tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 34), bottom: Math.round(r.bottom), top: Math.round(r.top), right: Math.round(r.right), h: Math.round(r.height) };
  }).filter((k) => k.h > 0);
  const maxBottom = Math.max(...kids.map((k) => k.bottom));
  const maxRight = Math.max(...kids.map((k) => k.right));
  return {
    found: true,
    card: { w: Math.round(cr.width), h: Math.round(cr.height), right: Math.round(cr.right), bottom: Math.round(cr.bottom) },
    overflow: cs.overflow, overflowX: cs.overflowX, overflowY: cs.overflowY,
    childMaxBottom: maxBottom, childMaxRight: maxRight,
    spillsBottom: maxBottom > Math.round(cr.bottom) + 1,
    spillsRight: maxRight > Math.round(cr.right) + 1,
    linkCount: c.querySelectorAll("a").length,
    smallLinks: [...c.querySelectorAll("a")].map((a) => {
      const r = a.getBoundingClientRect();
      return { name: (a.textContent || "").trim().slice(0, 20), w: Math.round(r.width), h: Math.round(r.height) };
    }).filter((l) => l.h > 0 && l.h < 44)
  };
});
console.log(JSON.stringify(card, null, 1).slice(0, 2000));
await page.locator("a.lesson-path-card.done").screenshot({ path: OUT + "path-card-done.png" }).catch(() => {});

console.log("\n############ B. 答错反馈与恢复路径（试一试第 1 题，故意选错）############");
await page.goto(BASE + "/grammar/lesson/lesson-01-am", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
// 若停在讲解，推进到试一试
for (let i = 0; i < 5; i++) {
  const hasOptions = await page.evaluate(() => document.querySelectorAll("main button.lesson-option").length > 0);
  if (hasOptions) break;
  const moved = await page.evaluate(() => {
    const b = [...document.querySelectorAll("main button.primary-button, main button")].find((x) => /揭晓|下一步|看懂了|试一试|继续刚才|下面自己来/.test(x.textContent || ""));
    if (!b) return null;
    b.click(); return (b.textContent || "").trim().slice(0, 24);
  });
  console.log("  推进:", moved ?? "无");
  await page.waitForTimeout(1100);
  if (!moved) break;
}
const before = await page.evaluate(() => (document.querySelector("main")?.innerText || "").replace(/\s+/g, " ").slice(0, 200));
console.log("  答前正文:", before);
const wrongClicked = await page.evaluate(() => {
  const b = [...document.querySelectorAll("main button.lesson-option")].find((x) => (x.textContent || "").trim() === "is");
  if (!b) return null;
  b.click(); return (b.textContent || "").trim();
});
console.log("  点击错误项:", wrongClicked ?? "未找到 is");
await page.waitForTimeout(900);
await page.screenshot({ path: OUT + "lesson-wrong-answer-1.png" });
await page.screenshot({ path: OUT + "lesson-wrong-answer-1-full.png", fullPage: true });
const after = await page.evaluate(() => {
  const mains = document.querySelector("main");
  return {
    body: (mains?.innerText || "").replace(/\s+/g, " ").slice(0, 700),
    options: [...document.querySelectorAll("main button.lesson-option")].map((b) => ({ t: (b.textContent || "").trim(), dis: b.disabled, cls: String(b.className) })),
    buttons: [...document.querySelectorAll("main button")].map((b) => (b.textContent || "").trim().slice(0, 26)).filter(Boolean),
    liveRegions: [...document.querySelectorAll("[aria-live], [role=status], [role=alert]")].map((e) => ({ role: e.getAttribute("role") || e.getAttribute("aria-live"), t: (e.textContent || "").trim().slice(0, 80) }))
  };
});
console.log("  答后正文:", after.body);
console.log("  选项状态:", JSON.stringify(after.options));
console.log("  屏读器提示区:", JSON.stringify(after.liveRegions));
console.log("  可用按钮:", JSON.stringify(after.buttons));

// 是否还能重试 / 下一步
const next = await page.evaluate(() => {
  const b = [...document.querySelectorAll("main button.primary-button, main button")].find((x) => /下一题|再试一次|重试|下一步/.test(x.textContent || "") && !x.disabled);
  if (!b) return null;
  b.click(); return (b.textContent || "").trim().slice(0, 24);
});
console.log("  错误后的前进动作:", next ?? "无");
await page.waitForTimeout(1000);
await page.screenshot({ path: OUT + "lesson-wrong-answer-2.png" });
console.log("  前进后正文:", (await page.evaluate(() => (document.querySelector("main")?.innerText || "").replace(/\s+/g, " ").slice(0, 260))));

await ctx.close();
