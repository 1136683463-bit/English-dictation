// 定向探测：移动端导航在桌面视口下的真实可见性，以及首屏可达性。
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");

const BASE = "http://127.0.0.1:1420";
const browser = await chromium.launch();

for (const vp of [{ k: "desktop", w: 1280, h: 720 }, { k: "mobile", w: 375, h: 667 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/grammar", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const out = await page.evaluate(() => {
    const hiddenByAncestor = (el) => {
      let cur = el;
      while (cur && cur !== document.documentElement) {
        const s = getComputedStyle(cur);
        if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return true;
        cur = cur.parentElement;
      }
      return false;
    };
    const report = [];
    for (const el of document.querySelectorAll('[class*="mobile-"], aside, nav, header, [class*="sidebar"], [class*="topbar"]')) {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      report.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || "").slice(0, 46),
        display: s.display,
        visibility: s.visibility,
        position: s.position,
        zIndex: s.zIndex,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        inViewport: r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0,
        hiddenByAncestor: hiddenByAncestor(el),
        childCount: el.children.length,
        sample: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60)
      });
    }
    // 首屏可见的交互元素（用于判断移动端是否有底部导航遮挡）
    const focusables = [...document.querySelectorAll("a[href], button, input, textarea, select")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && !hiddenByAncestor(el);
    }).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        name: (el.getAttribute("aria-label") || el.innerText || el.placeholder || "").trim().replace(/\s+/g, " ").slice(0, 30),
        top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width)
      };
    });
    return { report, viewportH: window.innerHeight, focusables: focusables.slice(0, 40) };
  });

  console.log("############ " + vp.k + " " + vp.w + "x" + vp.h + " ############");
  for (const r of out.report) {
    console.log(`${r.tag} .${r.cls}  display=${r.display} vis=${r.visibility} pos=${r.position} z=${r.zIndex} rect=${r.rect.x},${r.rect.y} ${r.rect.w}x${r.rect.h} 视口内=${r.inViewport} 祖先隐藏=${r.hiddenByAncestor} 子=${r.childCount} | ${r.sample.slice(0, 40)}`);
  }
  console.log("--- 底部 200px 内的可交互元素（可能被底栏遮挡）---");
  for (const f of out.focusables) {
    if (f.bottom > out.viewportH - 200) console.log(`  ${f.name}  top=${f.top} bottom=${f.bottom} ${f.w}x${f.h}`);
  }
  await ctx.close();
}

await browser.close();
