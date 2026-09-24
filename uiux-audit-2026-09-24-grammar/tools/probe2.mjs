// 定向实测 2：底栏遮挡、对比度、文本放大、找错编号断档、悬停依赖。
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");

const BASE = "http://127.0.0.1:1420";
const ROUTES = [
  "/grammar", "/grammar/lesson/lesson-01-am", "/grammar/lesson/lesson-01-am/revisit",
  "/grammar/lesson/lesson-01-am/reaudit", "/grammar/boost/lesson-01-am", "/grammar/review",
  "/grammar/replay", "/grammar/profile", "/grammar/hunt", "/grammar/diary"
];

// 对比度：把文本节点与其有效背景算成 WCAG 对比度
const contrastProbe = () => {
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map((x) => parseFloat(x));
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const effBg = (el) => {
    let cur = el;
    while (cur && cur !== document.documentElement) {
      const c = parse(getComputedStyle(cur).backgroundColor);
      if (c && c.a > 0.9) return c.rgb;
      cur = cur.parentElement;
    }
    return [255, 255, 255];
  };
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    if (el.children.length > 0) continue;
    const t = (el.textContent || "").trim();
    if (!t) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || Number(s.opacity) === 0) continue;
    const fg = parse(s.color);
    if (!fg || fg.a === 0) continue;
    const bg = effBg(el);
    const l1 = lum(fg.rgb), l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = parseFloat(s.fontSize);
    const bold = Number(s.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (ratio < need) {
      out.push({
        text: t.slice(0, 46), cls: String(el.className || "").slice(0, 40),
        fontSize: size, weight: s.fontWeight, color: s.color, bg: `rgb(${bg.map(Math.round).join(",")})`,
        ratio: Math.round(ratio * 100) / 100, need
      });
    }
  }
  // 同一样式去重
  const seen = new Set(), dedup = [];
  for (const o of out) {
    const k = o.cls + "|" + o.color + "|" + o.fontSize;
    if (seen.has(k)) continue;
    seen.add(k); dedup.push(o);
  }
  return { total: out.length, unique: dedup };
};

const browser = await chromium.launch();

// ── A. 移动端底栏遮挡 ─────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  console.log("############ A. 移动端固定底栏遮挡（滚到最底）############");
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    const r = await page.evaluate(async () => {
      const bar = document.querySelector(".sidebar");
      const barRect = bar.getBoundingClientRect();
      const barTop = barRect.top;
      const main = document.querySelector("main");
      const mainPadBottom = main ? getComputedStyle(main).paddingBottom : null;
      const bodyPadBottom = getComputedStyle(document.body).paddingBottom;
      // 滚到最底
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((res) => setTimeout(res, 500));
      // 找被底栏压住的、可读的内容元素（排除底栏自身）
      const occluded = [];
      for (const el of document.querySelectorAll("main *")) {
        if (el.children.length > 0) continue;
        const t = (el.textContent || "").trim();
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.top >= barTop) continue;          // 完全在底栏下方：非遮挡
        if (rect.bottom > barTop + 2) {            // 跨越底栏上沿：被压住
          occluded.push({
            tag: el.tagName.toLowerCase(), text: t.slice(0, 30),
            cls: String(el.className || "").slice(0, 32),
            top: Math.round(rect.top), bottom: Math.round(rect.bottom)
          });
        }
      }
      const de = document.documentElement;
      return {
        barTop: Math.round(barTop), barHeight: Math.round(barRect.height),
        viewportH: window.innerHeight, barShare: Math.round((barRect.height / window.innerHeight) * 100),
        scrollRemain: Math.round(de.scrollHeight - window.scrollY - window.innerHeight),
        mainPadBottom, bodyPadBottom,
        occludedCount: occluded.length, occluded: occluded.slice(0, 5)
      };
    });
    console.log(`${route.padEnd(40)} 底栏高=${r.barHeight}(${r.barShare}%视口) main-pad-bottom=${r.mainPadBottom} body-pad-bottom=${r.bodyPadBottom} 到底后残余可滚=${r.scrollRemain} 被压住文本=${r.occludedCount}`);
    for (const o of r.occluded) console.log(`      压住: ${o.tag}.${o.cls} "${o.text}" ${o.top}~${o.bottom} (底栏上沿=${r.barTop})`);
  }
  await ctx.close();
}

// ── B. 对比度（桌面+移动）─────────────────────────────────────────
for (const vp of [{ k: "desktop", w: 1280, h: 720 }, { k: "mobile", w: 375, h: 667 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  console.log(`\n############ B. 对比度不足（${vp.k}）############`);
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const c = await page.evaluate(contrastProbe);
    console.log(`${route.padEnd(40)} 不足 ${c.total} 处 / 去重后 ${c.unique.length}`);
    for (const u of c.unique.slice(0, 5)) {
      console.log(`      ${u.ratio}:1 (需 ${u.need}) ${u.fontSize}px/${u.weight} ${u.color} on ${u.bg} | .${u.cls} | ${u.text}`);
    }
  }
  await ctx.close();
}

// ── C. 文本放大到 200% ───────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  console.log("\n############ C. 文本放大 200%（WCAG 1.4.4）############");
  for (const route of ["/grammar", "/grammar/lesson/lesson-01-am", "/grammar/hunt", "/grammar/diary"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const bad = [];
      for (const el of document.querySelectorAll("main *")) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.right > de.clientWidth + 1) {
          bad.push({ tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 34), right: Math.round(rect.right), text: (el.textContent || "").trim().slice(0, 26) });
        }
        const s = getComputedStyle(el);
        if (el.children.length === 0 && (el.textContent || "").trim() && (s.overflow === "hidden" || s.textOverflow === "ellipsis")) {
          if (el.scrollHeight > el.clientHeight + 2) bad.push({ tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 34), clipped: true, text: (el.textContent || "").trim().slice(0, 26) });
        }
      }
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, badCount: bad.length, bad: bad.slice(0, 8) };
    });
    console.log(`${route.padEnd(40)} scrollW=${r.scrollW} clientW=${r.clientW} 溢出/裁切=${r.badCount}`);
    for (const b of r.bad) console.log(`      ${b.tag}.${b.cls} ${b.clipped ? "被裁切" : "right=" + b.right} | ${b.text}`);
  }
  await ctx.close();
}

// ── D. 找错页编号断档 ────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/grammar/hunt", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  console.log("\n############ D. 找错页案件编号顺序 ############");
  const list = await page.evaluate(() =>
    [...document.querySelectorAll("main *")]
      .filter((el) => el.children.length === 0 && /^案件 \d+$/.test((el.textContent || "").trim()))
      .map((el) => (el.textContent || "").trim())
  );
  console.log("页面渲染的编号:", list.join(" "));
  const nums = list.map((s) => Number(s.replace(/\D/g, "")));
  const missing = [];
  for (let i = 1; i <= Math.max(...nums); i++) if (!nums.includes(i)) missing.push(i);
  console.log("缺号:", missing.length ? missing.join(", ") : "无");
  await ctx.close();
}

// ── E. 悬停依赖 ──────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  console.log("\n############ E. 仅在 :hover 出现的样式（桌面）############");
  for (const route of ["/grammar", "/grammar/hunt"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      // 找出所有带 :hover 规则的类名，再看哪些类在页面里出现
      const hits = [];
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        for (const rule of rules) {
          if (!rule.selectorText || !rule.selectorText.includes(":hover")) continue;
          const props = [];
          for (const p of rule.style || []) props.push(p);
          const meaningful = props.filter((p) => !["cursor", "transition", "transition-duration"].includes(p));
          if (meaningful.length < 2) continue;
          hits.push({ sel: rule.selectorText.slice(0, 70), props: meaningful.join(",") });
        }
      }
      return { count: hits.length, hits: hits.slice(0, 14) };
    });
    console.log(`${route}：含实质样式的 :hover 规则 ${r.count} 条`);
    for (const h of r.hits) console.log(`      ${h.sel}  →  ${h.props}`);
  }
  await ctx.close();
}

await browser.close();
