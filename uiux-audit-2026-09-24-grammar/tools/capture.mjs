// 语法模块 UI/UX 走查 —— 采集脚本 A：路由级截图 + 布局指标 + 可访问性实测。
// 只读：不修改任何源码，只往 uiux-audit-2026-09-24-grammar/ 写证据。
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");

const BASE = process.env.AUDIT_BASE || "http://127.0.0.1:1420";
const ROOT = fileURLToPath(new URL("../", import.meta.url));
const SHOTS = ROOT + "screenshots-playwright/";
mkdirSync(SHOTS, { recursive: true });

const ROUTES = [
  { id: "01-path", route: "/grammar", label: "课程路径" },
  { id: "02-lesson", route: "/grammar/lesson/lesson-01-am", label: "课堂主体" },
  { id: "03-revisit", route: "/grammar/lesson/lesson-01-am/revisit", label: "重访" },
  { id: "04-reaudit", route: "/grammar/lesson/lesson-01-am/reaudit", label: "重审" },
  { id: "05-boost", route: "/grammar/boost/lesson-01-am", label: "趁热练" },
  { id: "06-review", route: "/grammar/review", label: "复习" },
  { id: "07-replay", route: "/grammar/replay", label: "复盘课" },
  { id: "08-profile", route: "/grammar/profile", label: "能力画像" },
  { id: "09-hunt", route: "/grammar/hunt", label: "侦探找错" },
  { id: "10-diary", route: "/grammar/diary", label: "语法日记" }
];

const VIEWPORTS = [
  { key: "desktop", width: 1280, height: 720 },
  { key: "mobile", width: 375, height: 667 }
];

// ── 页内实测：布局指标 ────────────────────────────────────────────────────
const layoutProbe = () => {
  const de = document.documentElement;
  const main = document.querySelector("main");
  const aside = document.querySelector("aside, nav[class*=side], [class*=sidebar]");
  const overflow = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const style = getComputedStyle(el);
    if (style.position === "fixed") continue;
    if (r.right > de.clientWidth + 1) {
      overflow.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && String(el.className).slice(0, 60)) || "",
        right: Math.round(r.right),
        width: Math.round(r.width),
        text: (el.textContent || "").trim().slice(0, 40)
      });
    }
  }
  // 同元素去重（取最外层，子元素必然也溢出）
  const dedup = [];
  for (const o of overflow) {
    if (!dedup.some((d) => d.text && o.text && d.text === o.text && d.tag === o.tag)) dedup.push(o);
  }
  return {
    url: location.pathname,
    viewport: { width: window.innerWidth, height: window.innerHeight, dpr: devicePixelRatio },
    docScroll: { width: de.scrollWidth, height: de.scrollHeight },
    bodyScroll: { width: document.body.scrollWidth, height: document.body.scrollHeight },
    mainScroll: main ? { height: main.scrollHeight } : null,
    sidebarWidth: aside ? Math.round(aside.getBoundingClientRect().width) : null,
    mainWidth: main ? Math.round(main.getBoundingClientRect().width) : null,
    horizontalOverflow: dedup.slice(0, 12),
    nodes: document.querySelectorAll("*").length
  };
};

// ── 页内实测：可访问性 ────────────────────────────────────────────────────
const a11yProbe = () => {
  const accName = (el) => {
    const aria = el.getAttribute("aria-label");
    if (aria && aria.trim()) return aria.trim();
    const lb = el.getAttribute("aria-labelledby");
    if (lb) {
      const t = lb.split(/\s+/).map((id) => document.getElementById(id)?.textContent || "").join(" ").trim();
      if (t) return t;
    }
    if (el.labels && el.labels.length) {
      const t = Array.from(el.labels).map((l) => l.textContent || "").join(" ").trim();
      if (t) return t;
    }
    const title = el.getAttribute("title");
    if (title && title.trim()) return title.trim();
    if (el.tagName === "INPUT" && /^(submit|button|reset)$/.test(el.type)) return (el.value || "").trim();
    const t = (el.innerText || el.textContent || "").trim();
    if (t) return t.slice(0, 80);
    const img = el.querySelector("img[alt]");
    if (img && img.alt.trim()) return img.alt.trim();
    return "";
  };

  const controls = [];
  const fields = [];
  const smallTargets = [];
  const imagesNoAlt = [];

  for (const el of document.querySelectorAll("input, textarea, select")) {
    if (el.type === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const hasLabelEl = Boolean(el.labels && el.labels.length) || Boolean(el.getAttribute("aria-label")) ||
      Boolean(el.getAttribute("aria-labelledby")) || Boolean(el.getAttribute("title"));
    fields.push({
      tag: el.tagName.toLowerCase(),
      type: el.type || "",
      id: el.id || "",
      name: el.name || "",
      placeholder: (el.placeholder || "").slice(0, 50),
      labelElement: hasLabelEl,
      accessibleName: accName(el).slice(0, 60),
      height: Math.round(r.height),
      width: Math.round(r.width)
    });
  }

  for (const el of document.querySelectorAll("button, a[href], [role=button], [role=tab], [role=switch], [role=checkbox], [role=radio], summary")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    const name = accName(el);
    const w = Math.round(r.width), h = Math.round(r.height);
    if (!name) {
      controls.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || "").slice(0, 60),
        html: el.outerHTML.slice(0, 160),
        w, h
      });
    }
    // 44×44 是触控下限；只统计真实可点控件，跳过内联文本链接
    if (h < 44 || w < 44) {
      smallTargets.push({
        tag: el.tagName.toLowerCase(),
        name: name.slice(0, 40),
        cls: String(el.className || "").slice(0, 50),
        w, h
      });
    }
  }

  for (const img of document.querySelectorAll("img")) {
    if (!img.hasAttribute("alt")) imagesNoAlt.push(img.src.slice(-60));
  }

  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
    level: Number(h.tagName[1]),
    text: (h.textContent || "").trim().slice(0, 50)
  }));
  let headingJumps = [];
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level - headings[i - 1].level > 1) headingJumps.push(headings[i - 1].text + " → " + headings[i].text);
  }

  return {
    fieldsWithoutLabelElement: fields.filter((f) => !f.labelElement),
    fieldsWithLabelElement: fields.filter((f) => f.labelElement && f.id),
    fieldsTotal: fields.length,
    controlsWithoutName: controls,
    smallTargets: smallTargets.slice(0, 40),
    smallTargetsCount: smallTargets.length,
    imagesWithoutAlt: imagesNoAlt,
    h1Count: headings.filter((h) => h.level === 1).length,
    headings: headings.slice(0, 30),
    headingJumps
  };
};

// ── 页内实测：焦点可见性 ──────────────────────────────────────────────────
const focusProbe = () => {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const fingerprint = (el) => {
    const s = getComputedStyle(el);
    return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderColor, s.backgroundColor, s.transform].join("|");
  };
  const out = [];
  const all = [...document.querySelectorAll("button, a[href], input, textarea, select, [role=button], [tabindex]")]
    .filter((el) => visible(el) && !el.disabled && el.tabIndex >= 0)
    .slice(0, 60);
  for (const el of all) {
    const before = fingerprint(el);
    el.focus();
    const after = fingerprint(el);
    const isActive = document.activeElement === el;
    out.push({
      tag: el.tagName.toLowerCase(),
      name: (el.getAttribute("aria-label") || el.innerText || el.placeholder || el.id || "").trim().slice(0, 40),
      focusable: isActive,
      focusVisibleChange: before !== after,
      outline: getComputedStyle(el).outlineStyle + " " + getComputedStyle(el).outlineWidth
    });
  }
  return {
    sampled: out.length,
    notFocusable: out.filter((o) => !o.focusable),
    noFocusStyleChange: out.filter((o) => !o.focusVisibleChange).slice(0, 30),
    noFocusStyleChangeCount: out.filter((o) => !o.focusVisibleChange).length
  };
};

const browser = await chromium.launch();
// AUDIT_PROFILE=<dir前缀> 时用持久化 profile（带学习进度），否则用全新无进度状态
const PROFILE = process.env.AUDIT_PROFILE;
const SUFFIX = process.env.AUDIT_SUFFIX || "";
const evidence = { capturedAt: new Date().toISOString(), baseUrl: BASE, profile: PROFILE || "fresh", desktop: [], mobile: [] };
const a11y = { capturedAt: new Date().toISOString(), baseUrl: BASE, profile: PROFILE || "fresh", desktop: [], mobile: [] };
const consoleLog = [];

for (const vp of VIEWPORTS) {
  const ctx = PROFILE
    ? await chromium.launchPersistentContext(PROFILE + "-" + vp.key, { viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 })
    : await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = ctx.pages()[0] || (await ctx.newPage());
  const bucket = vp.key === "desktop" ? evidence.desktop : evidence.mobile;
  const a11yBucket = vp.key === "desktop" ? a11y.desktop : a11y.mobile;

  for (const r of ROUTES) {
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
    page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 200)));

    const resp = await page.goto(BASE + r.route, { waitUntil: "networkidle", timeout: 30000 }).catch((e) => e);
    await page.waitForTimeout(900);

    const layout = await page.evaluate(layoutProbe);
    const a11yData = await page.evaluate(a11yProbe);
    const focusData = await page.evaluate(focusProbe);

    // 滚动切片（每屏一张，最多 4 张），用于逐屏读图
    const total = layout.docScroll.height;
    const slices = Math.min(4, Math.max(1, Math.ceil(total / vp.height)));
    for (let i = 0; i < slices; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * vp.height);
      await page.waitForTimeout(320);
      await page.screenshot({ path: `${SHOTS}${r.id}-${vp.key}${SUFFIX}-s${i + 1}.png` });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${SHOTS}${r.id}-${vp.key}${SUFFIX}-full.png`, fullPage: true });

    bucket.push({
      id: r.id, label: r.label, route: r.route,
      status: resp && resp.status ? resp.status() : String(resp),
      title: await page.title(),
      file: `${SHOTS}${r.id}-${vp.key}${SUFFIX}-full.png`,
      slices,
      metrics: layout,
      consoleErrors: errors.slice(0, 6)
    });
    a11yBucket.push({ id: r.id, route: r.route, ...a11yData, focus: focusData });
    consoleLog.push(`[${vp.key}] ${r.route} → ${slices} 屏, 高 ${total}px, 控制台错误 ${errors.length}`);
    console.error(consoleLog[consoleLog.length - 1]);
  }
  await ctx.close();
}

await browser.close();
writeFileSync(ROOT + `screenshot-evidence${SUFFIX}.json`, JSON.stringify(evidence, null, 2));
writeFileSync(ROOT + `accessibility-heuristics${SUFFIX}.json`, JSON.stringify(a11y, null, 2));
console.log(consoleLog.join("\n"));
