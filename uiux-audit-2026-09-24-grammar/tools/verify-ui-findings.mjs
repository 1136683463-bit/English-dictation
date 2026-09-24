// 界面走查结论的逐条实测（把「看一眼就写」换成数字）。
// 只测**无需进度态**即可复现的那些；需要进度的用已录的 lesson-walkthrough-*.json。
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");
const BASE = "http://127.0.0.1:1420";
const b = await chromium.launch();

// ── F-9：找错页案件编号是否跳号 ──
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/grammar/hunt", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const nums = await p.evaluate(() =>
    [...document.querySelectorAll("main *")]
      .filter((e) => e.children.length === 0 && /^案件 \d+$/.test((e.textContent || "").trim()))
      .map((e) => Number((e.textContent || "").trim().replace(/\D/g, "")))
  );
  const max = Math.max(...nums, 0);
  const missing = [];
  for (let i = 1; i <= max; i++) if (!nums.includes(i)) missing.push(i);
  console.log(`【F-9】渲染编号 ${nums.slice(0, 14).join(",")}… 共 ${nums.length} 个；缺号: ${missing.join(",") || "无"}`);
  await ctx.close();
}

// ── F-10：文本放大 200% 是否裁切 ──
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  for (const route of ["/grammar", "/grammar/hunt", "/grammar/diary"]) {
    await p.goto(BASE + route, { waitUntil: "networkidle" });
    await p.addStyleTag({ content: "html { font-size: 200% !important; }" });
    await p.waitForTimeout(600);
    const clipped = await p.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("main *")) {
        const s = getComputedStyle(el);
        if (el.children.length || !(el.textContent || "").trim()) continue;
        if (s.overflow === "hidden" && el.scrollHeight > el.clientHeight + 2) {
          out.push(`${String(el.className).slice(0, 30)}:${(el.textContent || "").trim().slice(0, 24)}`);
        }
      }
      return out;
    });
    console.log(`【F-10】${route} 200% 放大后裁切元素 ${clipped.length} 个 ${clipped.slice(0, 3).join(" | ")}`);
  }
  await ctx.close();
}

// ── A-4：课堂页加载时的 activeElement ──
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/grammar/lesson/lesson-01-am", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  const info = await p.evaluate(() => ({
    active: document.activeElement ? document.activeElement.tagName.toLowerCase() + "." + String(document.activeElement.className || "").slice(0, 30) : "none",
    tabbableInSidebar: [...document.querySelectorAll(".sidebar a")].length
  }));
  console.log(`【A-4】课堂页加载后 activeElement = ${info.active}；侧栏可聚焦 ${info.tabbableInSidebar} 项`);
  await ctx.close();
}

// ── A-5 / F-5：焦点环与超小热区（桌面）──
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/grammar/lesson/lesson-01-am", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const r = await p.evaluate(() => {
    const rows = [];
    for (const el of document.querySelectorAll("main button, main a[href]")) {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const s = getComputedStyle(el);
      rows.push({
        cls: String(el.className || "").slice(0, 28),
        name: (el.getAttribute("aria-label") || el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 20),
        w: Math.round(rect.width), h: Math.round(rect.height),
        outline: `${s.outlineStyle} ${s.outlineWidth}`,
        shadow: s.boxShadow !== "none"
      });
    }
    return rows;
  });
  const tiny = r.filter((x) => x.h < 24);
  console.log(`【F-5/A-3】课堂页桌面可点元素 ${r.length} 个，高度 <24px 的 ${tiny.length} 个：`);
  for (const t of tiny) console.log(`        ${String(t.h).padStart(3)}px  .${t.cls}  「${t.name}」`);
  const uaDefault = r.filter((x) => x.outline.startsWith("auto") && !x.shadow);
  console.log(`【A-5】用浏览器默认 outline（无自定义焦点环）的元素 ${uaDefault.length}/${r.length}`);
  await ctx.close();
}

// ── F-7：同一概念的文案变体（静态可测）──
{
  const out = await (async () => {
    const { readFileSync } = await import("node:fs");
    const g = readFileSync("src/pages/GrammarDiaryPage.tsx", "utf8");
    const phrasings = ["一次性批改", "写完整批改", "写完了一起批改", "已批改", "自动批改"];
    return phrasings.filter((t) => g.includes(t));
  })();
  console.log(`【F-7】日记页「批改」的不同说法命中 ${out.length} 种: ${out.join(" / ")}`);
}

// ── A-1/A-2：对比度（对方正在修，核对当前实况）──
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/grammar", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const c = await p.evaluate(() => {
    const btn = document.querySelector("main .primary-button");
    const s = btn ? getComputedStyle(btn) : null;
    return s ? { color: s.color, bg: s.backgroundColor, size: s.fontSize, weight: s.fontWeight } : null;
  });
  console.log(`【A-1】主按钮当前: ${JSON.stringify(c)}`);
  await ctx.close();
}

await b.close();
