// 折叠区一体化 v2 冒烟：①数据报告展开为一张卡 ②折叠 pill 间距收紧
import { chromium } from "/Users/liujun/.workbuddy/binaries/node/versions/22.22.2/lib/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs";
import os from "node:os";
import path from "node:path";

const exe = path.join(
  os.homedir(),
  "Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell"
);

const review = (id, rating, at) => ({ id, cardId: "w1", mode: "spelling", rating, answer: "", diffJson: "[]", reviewedAt: at });
const appData = {
  schemaVersion: 1, unitGroups: [], units: [], wordDetails: [], sentenceDetails: [],
  materials: [], materialSegments: [], mistakeGenerations: [], adventures: [],
  huntAttempts: [], huntResults: [], grammarLessonsDone: [], diaryEntries: [], dictionaryEntries: [],
  cards: [{ id: "w1", type: "word", front: "apple", back: "苹果", note: "", tags: [], status: "mastered", priority: false, masteredAt: "2026-09-10T09:00:00", createdAt: "2026-08-01T09:00:00", updatedAt: "2026-09-10T09:00:00" }],
  reviews: [review("c1", 4, "2026-09-12T09:00:00"), review("c2", 1, "2026-09-13T08:00:00"), review("c3", 3, "2026-09-13T09:00:00")],
  schedules: [{ cardId: "w1", easeFactor: 2.5, intervalDays: 30, reviewCount: 5, lapseCount: 0, nextReviewAt: "2026-10-10T09:00:00" }],
  settings: { dailyReviewLimit: 30, dailyNewWords: 10, dailySentences: 3 }
};

const seed = async (page) => {
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.evaluate((data) => {
    localStorage.setItem("onboarding-done-v1", "1");
    localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(data));
  }, appData);
};

const browser = await chromium.launch({ executablePath: exe });
const results = [];
const check = (name, pass, extra = "") => results.push(`${pass ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);

// ---- 桌面：数据报告默认展开 ----
const page = await browser.newPage({ viewport: { width: 1100, height: 1250 } });
await seed(page);
await page.goto("http://localhost:5173/stats", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);

const report = page.locator(".collapsible-section", { hasText: "数据报告" });
const geo = await report.evaluate((el) => {
  const head = el.querySelector(".collapsible-section-head");
  const body = el.querySelector(".collapsible-section-body");
  const kpi = el.querySelector(".stats-kpi");
  const headRect = head.getBoundingClientRect();
  const bodyRect = body.getBoundingClientRect();
  const bs = getComputedStyle(body);
  const ks = getComputedStyle(kpi);
  return {
    gap: bodyRect.top - headRect.bottom,
    sameLeft: Math.abs(bodyRect.left - headRect.left) < 1,
    sameWidth: Math.abs(bodyRect.width - headRect.width) < 1,
    bodyBorderTop: bs.borderTopWidth,
    bodyRadiusBottom: bs.borderBottomLeftRadius,
    kpiBorder: ks.borderTopWidth,
    kpiShadow: ks.boxShadow,
    kpiBg: ks.backgroundColor
  };
});
check("数据报告：head 与 body 无缝衔接", geo.gap <= 1 && geo.sameLeft && geo.sameWidth, `gap=${geo.gap}`);
check("body 顶边去除（head 底边作分隔线）", geo.bodyBorderTop === "0px");
check("body 下圆角 14px 拼接", geo.bodyRadiusBottom === "14px", geo.bodyRadiusBottom);
check("KPI 瓦片已拍平（无边框/无阴影/透明底）",
  geo.kpiBorder === "0px" && geo.kpiShadow === "none" && geo.kpiBg === "rgba(0, 0, 0, 0)",
  `${geo.kpiBorder}/${geo.kpiShadow}/${geo.kpiBg}`);
await report.screenshot({ path: "scripts/smoke-v2-report-open.png" });

// ---- 折叠 pill 间距 ----
const riskHead = page.locator(".collapsible-section-head", { hasText: "错词与风险" });
const goalsHead = page.locator(".collapsible-section-head", { hasText: "目标与建议" });
const spacing = await page.evaluate(([a, b]) => {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  return rb.top - ra.bottom;
}, [await riskHead.elementHandle(), await goalsHead.elementHandle()]);
check("折叠 pill 间距收紧到 ~14px", spacing <= 16, `${spacing}px`);

await page.close();

// ---- 移动端 390px ----
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await seed(mob);
await mob.goto("http://localhost:5173/stats", { waitUntil: "domcontentloaded" });
await mob.waitForTimeout(1000);
await mob.screenshot({ path: "scripts/smoke-v2-mobile.png", fullPage: false });
await mob.locator(".collapsible-section-head", { hasText: "数据报告" }).click();
await mob.waitForTimeout(400);
await mob.locator(".collapsible-section", { hasText: "数据报告" }).screenshot({ path: "scripts/smoke-v2-mobile-report.png" });
await mob.close();

console.log(results.join("\n"));
await browser.close();
