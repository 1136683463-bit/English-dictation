// 折叠区一体化样式冒烟：展开态 header 与首个内容卡视觉合并
import { chromium } from "/Users/liujun/.workbuddy/binaries/node/versions/22.22.2/lib/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs";
import os from "node:os";
import path from "node:path";

const exe = path.join(
  os.homedir(),
  "Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell"
);

const review = (id, cardId, rating, reviewedAt) => ({ id, cardId, mode: "spelling", rating, answer: "", diffJson: "[]", reviewedAt });
const appData = {
  schemaVersion: 1, unitGroups: [], units: [], wordDetails: [], sentenceDetails: [],
  materials: [], materialSegments: [], mistakeGenerations: [], adventures: [],
  huntAttempts: [], huntResults: [], grammarLessonsDone: [], diaryEntries: [], dictionaryEntries: [],
  cards: [{ id: "w1", type: "word", front: "apple", back: "苹果", note: "", tags: [], status: "review", priority: false, createdAt: "2026-08-01T09:00:00", updatedAt: "2026-09-12T09:00:00" }],
  reviews: [review("c1", "w1", 4, "2026-09-12T09:00:00"), review("c2", "w1", 1, "2026-09-13T09:00:00")],
  schedules: [{ cardId: "w1", easeFactor: 2.5, intervalDays: 3, reviewCount: 2, lapseCount: 1, nextReviewAt: "2026-09-14T09:00:00" }],
  settings: { dailyReviewLimit: 30, dailyNewWords: 10, dailySentences: 3 }
};

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1100, height: 1000 } });
await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
await page.evaluate((data) => {
  localStorage.setItem("onboarding-done-v1", "1");
  localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(data));
}, appData);
await page.goto("http://localhost:5173/stats", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);

const results = [];
const check = (name, pass, extra = "") => results.push(`${pass ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);

// 展开「目标与建议」区
const goalsHead = page.locator(".collapsible-section-head", { hasText: "目标与建议" });
await goalsHead.click();
await page.waitForTimeout(400);

const section = page.locator(".collapsible-section.is-open", { hasText: "目标与建议" });
const geometry = await section.evaluate((el) => {
  const head = el.querySelector(".collapsible-section-head");
  const firstCard = el.querySelector(".collapsible-section-body > .stats-card");
  const headRect = head.getBoundingClientRect();
  const cardRect = firstCard.getBoundingClientRect();
  const cs = getComputedStyle(firstCard);
  const hs = getComputedStyle(head);
  return {
    gap: cardRect.top - headRect.bottom,
    leftAligned: Math.abs(cardRect.left - headRect.left) < 1,
    sameWidth: Math.abs(cardRect.width - headRect.width) < 1,
    cardBorderTop: cs.borderTopWidth,
    cardRadiusTop: cs.borderTopLeftRadius,
    headRadiusBottom: hs.borderBottomLeftRadius
  };
});

check("展开后 head 与内容卡无缝隙", geometry.gap <= 1, `gap=${geometry.gap}px`);
check("左右边缘对齐同宽", geometry.leftAligned && geometry.sameWidth);
check("内容卡顶边去除（分隔线由 head 底边承担）", geometry.cardBorderTop === "0px", geometry.cardBorderTop);
check("内容卡上圆角为 0", geometry.cardRadiusTop === "0px", geometry.cardRadiusTop);
check("head 下圆角为 0", geometry.headRadiusBottom === "0px", geometry.headRadiusBottom);

await section.screenshot({ path: "scripts/smoke-collapsible-open.png" });

// 折叠态不受影响：仍是独立圆角 pill
await goalsHead.click();
await page.waitForTimeout(300);
const closedRadius = await goalsHead.evaluate((el) => getComputedStyle(el).borderRadius);
check("折叠态 head 保持 14px 完整圆角", closedRadius === "14px", closedRadius);

console.log(results.join("\n"));
await browser.close();
