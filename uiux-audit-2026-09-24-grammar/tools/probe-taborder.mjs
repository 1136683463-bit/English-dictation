// 精确核实：课堂页的可聚焦元素全集与 Tab 实际能否到达（区分「不存在」与「到不了」）。
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const BASE = "http://127.0.0.1:1420";
const ctx = await chromium.launchPersistentContext(ROOT + ".browser-profile-desktop", { viewport: { width: 1280, height: 720 } });
const page = ctx.pages()[0] || (await ctx.newPage());

const domEnumerate = () => {
    const vis = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      let c = el;
      while (c && c !== document.documentElement) {
        const s = getComputedStyle(c);
        if (s.display === "none" || s.visibility === "hidden") return false;
        c = c.parentElement;
      }
      return true;
    };
    const sel = 'a[href], button, input, textarea, select, [tabindex], [contenteditable="true"], summary, audio[controls], video[controls]';
    const all = [...document.querySelectorAll(sel)];
    const tabbable = [];
    for (const el of all) {
      if (el.disabled) continue;
      if (el.getAttribute("tabindex") !== null && Number(el.getAttribute("tabindex")) < 0) continue;
      if (!vis(el)) continue;
      // 祖先是否有 inert / aria-hidden
      let inert = false, ariaHidden = false, cur = el;
      while (cur && cur !== document.documentElement) {
        if (cur.hasAttribute?.("inert")) inert = true;
        if (cur.getAttribute?.("aria-hidden") === "true") ariaHidden = true;
        cur = cur.parentElement;
      }
      const r = el.getBoundingClientRect();
      tabbable.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || "").slice(0, 36),
        name: (el.getAttribute("aria-label") || el.innerText || el.placeholder || "").trim().replace(/\s+/g, " ").slice(0, 30),
        inSidebar: Boolean(el.closest(".sidebar, aside")),
        inert, ariaHidden,
        y: Math.round(r.y + window.scrollY),
        h: Math.round(r.height),
        tabIndex: el.getAttribute("tabindex")
      });
    }
  return {
    tabbableCount: tabbable.length,
    sidebarCount: tabbable.filter((t) => t.inSidebar).length,
    list: tabbable,
    activeOnLoad: document.activeElement ? document.activeElement.tagName.toLowerCase() + "." + String(document.activeElement.className || "").slice(0, 30) : null
  };
};

const readActive = () =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { tag: "body" };
    return { tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 34), name: (el.getAttribute("aria-label") || el.innerText || el.placeholder || "").trim().replace(/\s+/g, " ").slice(0, 26) };
  });

for (const route of ["/grammar/lesson/lesson-01-am", "/grammar"]) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const en = await page.evaluate(domEnumerate);
  console.log("=".repeat(74));
  console.log(`${route}`);
  console.log(`  加载后 activeElement: ${en.activeOnLoad}`);
  console.log(`  页面内可聚焦元素 ${en.tabbableCount} 个（其中侧栏 ${en.sidebarCount} 个）`);
  for (const t of en.list) {
    console.log(`   ${t.inSidebar ? "[侧栏] " : "       "}${t.tag}.${t.cls.slice(0, 30).padEnd(30)} ${t.name.slice(0, 22).padEnd(22)} y=${String(t.y).padStart(5)} h=${String(t.h).padStart(3)}${t.inert ? " INERT" : ""}${t.ariaHidden ? " aria-hidden" : ""}${t.tabIndex ? " tabindex=" + t.tabIndex : ""}`);
  }
  // 真实 Tab 序列
  console.log("  --- 真实 Tab 序列 ---");
  await page.evaluate(() => document.activeElement?.blur?.());
  const seenSeq = [];
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(90);
    const a = await readActive();
    seenSeq.push(a);
    if (a.tag === "body") break;
  }
  console.log("  " + seenSeq.map((a, i) => `${i + 1}.${a.name || a.cls || a.tag}`).join("  →  "));
}

await ctx.close();
