// 交互走查：真实键盘 Tab 的焦点可见性（必须用键盘触发 :focus-visible，
// 否则程序化 focus() 会给出假阴性）、焦点是否被遮挡、Esc 与输入法/全角。
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liujun/.npm/_npx/423231821c231c73/node_modules/playwright");

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const BASE = "http://127.0.0.1:1420";
const PROFILE = ROOT + ".browser-profile-desktop";

const ctx = await chromium.launchPersistentContext(PROFILE, { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const page = ctx.pages()[0] || (await ctx.newPage());

const readActive = () =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { tag: "body" };
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: String(el.className || "").slice(0, 40),
      name: (el.getAttribute("aria-label") || el.innerText || el.placeholder || "").trim().replace(/\s+/g, " ").slice(0, 34),
      focusVisible: el.matches(":focus-visible"),
      outline: `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`,
      boxShadow: s.boxShadow === "none" ? "none" : s.boxShadow.slice(0, 44),
      border: s.borderColor,
      bg: s.backgroundColor,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      // 焦点是否被固定底栏遮挡
      obscured: (() => {
        const bar = document.querySelector(".sidebar");
        if (!bar) return false;
        const bs = getComputedStyle(bar);
        if (bs.position !== "fixed") return false;
        const br = bar.getBoundingClientRect();
        const own = el.getBoundingClientRect();
        return !(own.bottom < br.top || own.top > br.bottom);
      })()
    };
  });

console.log("############ 1. 真实 Tab 焦点链（:focus-visible 判定）############");
for (const route of ["/grammar", "/grammar/lesson/lesson-01-am", "/grammar/diary", "/grammar/hunt"]) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.body.focus?.());
  console.log(`\n--- ${route} ---`);
  const seq = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(110);
    const a = await readActive();
    if (a.tag === "body") { seq.push({ ...a, i }); break; }
    seq.push({ ...a, i });
    const visible = a.outline.startsWith("solid") || a.outline.includes(" 3px") || a.boxShadow !== "none";
    console.log(`  ${String(i + 1).padStart(2)}. ${a.tag}.${a.cls.slice(0, 26)} | ${a.name.slice(0, 24).padEnd(24)} focus-visible=${String(a.focusVisible).padEnd(5)} outline=[${a.outline}] shadow=${a.boxShadow === "none" ? "-" : "有"} ${visible ? "" : "  ⚠ 无可见焦点指示"}${a.obscured ? "  ⚠ 被底栏遮挡" : ""}`);
  }
}

console.log("\n############ 2. Esc / 遮罩与焦点管理（课堂）############");
await page.goto(BASE + "/grammar/lesson/lesson-01-am", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const dialogInfo = await page.evaluate(() => ({
  dialogs: document.querySelectorAll('[role="dialog"], dialog, [aria-modal="true"]').length,
  ariaModal: document.querySelectorAll('[aria-modal="true"]').length
}));
console.log("  首屏 dialog / aria-modal 数量:", JSON.stringify(dialogInfo));
// 点「想不起来」，看是否出现提示层
const hintClicked = await page.evaluate(() => {
  const b = [...document.querySelectorAll("main button, main a")].find((x) => /想不起来|给我一点提示|看答案/.test(x.textContent || ""));
  if (!b) return null;
  b.click();
  return (b.textContent || "").trim().slice(0, 30);
});
console.log("  点击提示类按钮:", hintClicked ?? "首屏没有");
await page.waitForTimeout(700);

console.log("\n############ 3. 中文输入法 / 全角输入（凭记忆写）############");
// 走到「凭记忆写」不容易，改为对日记页的多行输入做同样的输入环境检测
await page.goto(BASE + "/grammar/diary", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const ime = await page.evaluate(() => {
  const ta = document.querySelector("main textarea");
  if (!ta) return null;
  const s = getComputedStyle(ta);
  return {
    autocapitalize: ta.getAttribute("autocapitalize") ?? "(未设置)",
    autocorrect: ta.getAttribute("autocorrect") ?? "(未设置)",
    autocomplete: ta.getAttribute("autocomplete") ?? "(未设置)",
    spellcheck: ta.getAttribute("spellcheck") ?? "(未设置)",
    inputMode: ta.getAttribute("inputmode") ?? "(未设置)",
    lang: ta.getAttribute("lang") ?? "(未设置)",
    enterKeyHint: ta.getAttribute("enterkeyhint") ?? "(未设置)",
    fontSize: s.fontSize
  };
});
console.log("  日记 textarea 输入环境:", JSON.stringify(ime, null, 1));

// 全角 / 半角 与首尾空格：验证判分宽容度（写全角英文与小写）
await page.goto(BASE + "/grammar/diary", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
const fullwidth = await page.evaluate(async () => {
  const ta = document.querySelector("main textarea");
  if (!ta) return null;
  const set = Object.getOwnPropertyDescriptor(ta.constructor.prototype, "value").set;
  const probe = (v) => {
    set.call(ta, v);
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    return ta.value;
  };
  const r = {};
  r.全角输入 = probe("Ｉ ａｍ ｈａｐｐｙ．");
  r.带首尾空格 = probe("  I am happy  ");
  r.全角逗号 = probe("I am happy，");
  return r;
});
console.log("  输入受理情况（界面原样保留，未做归一化）:", JSON.stringify(fullwidth, null, 1));

await ctx.close();
