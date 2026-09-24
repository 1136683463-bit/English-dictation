// 走查脚本：按题号驱动整课，逐阶段截图 + 每步实测可访问性。
// 答案来自 src/data/grammarLessons.ts 的 guided/practice 数组（走查者离线抄录，脚本不猜语法）。
// 用法: node drive-lesson.mjs <lessonId> <desktop|mobile> [wrong]
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");

const BASE = "http://127.0.0.1:1420";
const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT = ROOT + "screenshots-lesson/";
const PROFILE = ROOT + ".browser-profile";
mkdirSync(OUT, { recursive: true });

const lessonId = process.argv[2] || "lesson-01-am";
const vpKey = process.argv[3] || "desktop";
const MODE = process.argv[4] || "correct";
const VIEWPORT = vpKey === "mobile" ? { width: 375, height: 667 } : { width: 1280, height: 720 };

// 答案（源自 src/data/grammarLessons.ts → guided / practice）按阶段+题号索引
const PLANS = {
  "lesson-01-am": {
    guided: { 1: "am", 2: "I am a student.", 3: "I am Xiaoming.", 4: "is", 5: "am" },
    practice: { 1: "I am tired.", 2: "I am a teacher.", 3: "I am hungry.", 4: "I am not tired." },
    speak: { 1: "Are you new here.", 2: "I am Xiaomei." }
  }
};
// 故意答错时用的错误答案（用于采集错误反馈态）
const WRONG = {
  "lesson-01-am": { guided: { 1: "is", 2: "I is a student.", 3: "is I Xiaoming.", 4: "Xiaomei.", 5: "are" }, practice: { 1: "is tired.", 2: "a I teacher.", 3: "am hungry.", 4: "not tired." } }
};
// 「凭记忆写」阶段的目标句（src/data/grammarLessons.ts → recall.answer）
const RECALL = { "lesson-01-am": "I am Xiaomei." };

const probe = () => {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    let c = el;
    while (c && c !== document.documentElement) {
      const s = getComputedStyle(c);
      if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return false;
      c = c.parentElement;
    }
    return true;
  };
  const txt = (el) => (el.textContent || "").replace(/\s+/g, " ").trim();
  const accName = (el) => {
    const a = el.getAttribute("aria-label"); if (a && a.trim()) return a.trim();
    const lb = el.getAttribute("aria-labelledby");
    if (lb) { const t = lb.split(/\s+/).map((i) => document.getElementById(i)?.textContent || "").join(" ").trim(); if (t) return t; }
    if (el.labels && el.labels.length) { const t = [...el.labels].map((l) => l.textContent || "").join(" ").trim(); if (t) return t; }
    const ti = el.getAttribute("title"); if (ti && ti.trim()) return ti.trim();
    return txt(el).slice(0, 70);
  };
  const rect = (el) => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };

  const headings = [...document.querySelectorAll("main h1, main h2, main h3, main h4")].filter(visible).map((h) => ({ level: h.tagName, text: txt(h).slice(0, 70) }));
  const buttons = [...document.querySelectorAll("main button, main a[href]")].filter(visible).map((b) => ({
    text: txt(b).slice(0, 44), cls: String(b.className || "").slice(0, 44),
    disabled: b.disabled === true, accName: accName(b), ...rect(b)
  }));
  const inputs = [...document.querySelectorAll("main input, main textarea")].filter(visible).map((i) => ({
    tag: i.tagName.toLowerCase(), ph: (i.placeholder || "").slice(0, 44), val: (i.value || "").slice(0, 44), accName: accName(i), ...rect(i)
  }));
  const chips = [...document.querySelectorAll("main .lesson-chip")].filter(visible).map((c) => ({
    text: txt(c), disabled: c.disabled === true, ...rect(c)
  }));
  const dots = [...document.querySelectorAll(".lesson-stage-dots")].filter(visible).map((el) => ({
    aria: el.getAttribute("aria-label") || "", html: el.outerHTML.replace(/\s+/g, " ").slice(0, 260)
  }));
  const smallTargets = [...document.querySelectorAll("main button, main a[href], main [role=button]")].filter(visible)
    .map((el) => ({ name: accName(el).slice(0, 30), cls: String(el.className || "").slice(0, 34), ...rect(el) }))
    .filter((t) => t.h < 44 || t.w < 44);
  const unnamed = [...document.querySelectorAll("main button, main a[href], main [role=button]")].filter(visible).filter((el) => !accName(el));

  return {
    headings, buttons, inputs, chips, dots, smallTargets,
    unnamedCount: unnamed.length,
    unnamed: unnamed.map((el) => ({ cls: String(el.className || "").slice(0, 40), html: el.outerHTML.slice(0, 170) })),
    body: (document.querySelector("main")?.innerText || "").replace(/\s+/g, " ").slice(0, 700),
    scrollH: document.documentElement.scrollHeight
  };
};

const ctx = await chromium.launchPersistentContext(PROFILE, { viewport: VIEWPORT, deviceScaleFactor: 1 });
const page = ctx.pages()[0] || (await ctx.newPage());
await page.goto(BASE + "/grammar/lesson/" + lessonId, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1000);


const handled = new Set();
const placed = new Set();
const log = [];
const seen = new Set();
let step = 0;

const clickPrimary = () =>
  page.evaluate(() => {
    const b = [...document.querySelectorAll("main button.primary-button")].find((x) => {
      const r = x.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && !x.disabled;
    });
    if (!b) return null;
    b.scrollIntoView({ block: "center" });
    b.click();
    return (b.textContent || "").trim().slice(0, 34);
  });

while (step < 60) {
  step++;
  const snap = await page.evaluate(probe);
  const tag = String(step).padStart(2, "0");
  await page.screenshot({ path: `${OUT}${lessonId}-${vpKey}-${MODE}-${tag}.png` });
  await page.screenshot({ path: `${OUT}${lessonId}-${vpKey}-${MODE}-${tag}-full.png`, fullPage: true });

  const qm = snap.body.match(/(?:第\s*)?(\d+)\s*\/\s*(\d+)\s*题?/);
  const qn = qm ? Number(qm[1]) : null;
  log.push({ step, questionNumber: qn, ...snap, screenshot: `${OUT}${lessonId}-${vpKey}-${MODE}-${tag}.png` });

  console.error(`[${vpKey}/${MODE}] ${tag} 高${snap.scrollH} 题=${qn ?? "-"} 词块=${snap.chips.length} 无名=${snap.unnamedCount} 小热区=${snap.smallTargets.length} | ${snap.headings.map((h) => h.text).join(" / ").slice(0, 56)}`);
  console.error(`      ${snap.body.slice(0, 150)}`);

  const key = snap.body.slice(0, 150) + "|" + snap.chips.map((c) => c.text + (c.disabled ? "D" : "")).join(",") + "|" + snap.buttons.map((b) => b.text + (b.disabled ? "D" : "")).join(",");
  if (seen.has(key)) { console.error("      → 状态不再变化，停止"); break; }
  seen.add(key);

  // 输入框类作答：按阶段取目标句（凭记忆写 / 最后一步·说出来）
  if (snap.inputs.length) {
    const speakM = snap.body.match(/说出来（\s*(\d+)\s*\/\s*(\d+)\s*）/);
    const st = speakM ? "speak" : "recall";
    const idx = speakM ? Number(speakM[1]) : 1;
    const target = st === "speak"
      ? (PLANS[lessonId]?.speak?.[idx] ?? "I am Xiaomei.")
      : (RECALL[lessonId] || "I am happy");
    const pick = MODE === "wrong" && st === "recall" ? "I is Xiaomei." : target;
    await page.evaluate((p) => {
      for (const el of [...document.querySelectorAll("main input, main textarea")]) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0 || el.disabled || el.value) continue;
        const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, "value")?.set;
        setter ? setter.call(el, p) : (el.value = p);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, pick);
    await page.waitForTimeout(400);
    const c = await clickPrimary();
    console.error(`      [${st}${speakM ? " " + idx : ""}] 输入「${pick}」后点：${c ?? "无主按钮"}`);
    await page.waitForTimeout(1200);
    continue;
  }

  // 作答：按「阶段 + 题号」索引，每题只动作一次
  // 阶段标记用语义文本判定，不依赖「·」这类可能不一致的符号
  // 阶段用「题号分母」判定，不依赖阶段名文案（移动端完成课会把阶段名换成「已完成，可再学一遍」）：
  // 前测 2 题 / 试一试 5 题 / 自己来 4 题
  const denom = qm ? Number(qm[2]) : null;
  const stage = denom === 2 ? "pretest" : denom === 5 ? "guided" : denom === 4 ? "practice" : null;
  const isPretest = stage === "pretest";
  if (stage === "pretest" && !handled.has("pretest:" + qn)) {
    const t = await page.evaluate(() => {
      const b = [...document.querySelectorAll("main button.lesson-option")].find((x) => !x.disabled);
      if (!b) return null;
      b.click(); return (b.textContent || "").trim();
    });
    console.error(`      前测：点「${t ?? "无选项"}」（不判分）`);
    if (t) handled.add("pretest:" + qn);
    await page.waitForTimeout(1100);
    continue;
  }
  const plan = PLANS[lessonId] || {};
  const wrong = WRONG[lessonId] || {};
  const tkey = stage && qn ? `${stage}:${qn}` : null;

  if (tkey && plan[stage] && plan[stage][qn] && !handled.has(tkey)) {
    const answer = MODE === "wrong" ? (wrong[stage]?.[qn] ?? plan[stage][qn]) : plan[stage][qn];
    if (snap.chips.length) {
      const isSpot = /哪个词块不太对/.test(snap.body);
      if (isSpot) {
        await page.evaluate((w) => {
          const c = [...document.querySelectorAll("main .lesson-chip")].find((x) => (x.textContent || "").trim() === w);
          if (c) c.click();
        }, answer);
        console.error(`      spot：点「${answer}」`);
        await page.waitForTimeout(500);
      } else {
        for (const word of String(answer).split(/\s+/)) {
          const ok = await page.evaluate((w) => {
            const c = [...document.querySelectorAll("main .lesson-chip")].find((x) => {
              const t = (x.textContent || "").trim();
              return !x.disabled && (t === w || t.replace(/\.$/, "") === w.replace(/\.$/, ""));
            });
            if (c) { c.click(); return true; }
            return false;
          }, word);
          if (!ok) console.error(`      arrange：词块「${word}」未找到`);
          await page.waitForTimeout(260);
        }
        console.error(`      arrange：${stage} 第${qn}题 按「${answer}」点词块`);
      }
      const c = await (async () => { for (let i = 0; i < 6; i++) { const r = await clickPrimary(); if (r) return r; await page.waitForTimeout(400); } return null; })();
      console.error(`      提交：${c ?? "未出现主按钮"}`);
      if (c) handled.add(tkey);
      await page.waitForTimeout(1300);
      continue;
    }
    const ok = await page.evaluate((w) => {
      const b = [...document.querySelectorAll("main button")].find((x) => {
        const t = (x.textContent || "").trim();
        return !x.disabled && (t === w || t.replace(/^[A-D]\s*/, "") === w);
      });
      if (!b) return false;
      b.click(); return true;
    }, answer);
    console.error(`      选项：${ok ? "点「" + answer + "」" : "未找到「" + answer + "」"}`);
    if (ok) handled.add(tkey);
    await page.waitForTimeout(1200);
    continue;
  }

  const c = await clickPrimary();
  if (!c) { console.error("      → 无主按钮，停止"); break; }
  console.error(`      → 点「${c}」`);
  await page.waitForTimeout(1300);
}

writeFileSync(ROOT + `lesson-walkthrough-${vpKey}-${MODE}.json`, JSON.stringify({ lessonId, viewport: VIEWPORT, mode: MODE, steps: log }, null, 2));
await ctx.close();
console.error(`\n共 ${log.length} 步 → lesson-walkthrough-${vpKey}-${MODE}.json`);
