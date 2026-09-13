// R13 冒烟：周环比箭头 + 北极星里程碑
// 口径：今天 2026-09-13（周日），本周 9/7-9/13，上周 8/31-9/6
import { chromium } from "/Users/liujun/.workbuddy/binaries/node/versions/22.22.2/lib/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs";
import os from "node:os";
import path from "node:path";

const exe = path.join(
  os.homedir(),
  "Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell"
);

const now = new Date();
const iso = (d) => d.toISOString();

// 卡片：3 张掌握（1 张本周 masteredAt，2 张更早）+ 1 张 review
const cards = [
  { id: "m1", type: "word", front: "apple", back: "苹果", note: "", tags: [], status: "mastered", priority: false, masteredAt: "2026-09-10T09:00:00", createdAt: "2026-08-01T09:00:00", updatedAt: "2026-09-10T09:00:00" },
  { id: "m2", type: "word", front: "banana", back: "香蕉", note: "", tags: [], status: "mastered", priority: false, masteredAt: "2026-08-20T09:00:00", createdAt: "2026-08-01T09:00:00", updatedAt: "2026-08-20T09:00:00" },
  { id: "m3", type: "word", front: "cherry", back: "樱桃", note: "", tags: [], status: "mastered", priority: false, masteredAt: "2026-07-15T09:00:00", createdAt: "2026-07-01T09:00:00", updatedAt: "2026-07-15T09:00:00" },
  { id: "r1", type: "word", front: "delta", back: "三角洲", note: "", tags: [], status: "review", priority: false, createdAt: "2026-09-01T09:00:00", updatedAt: "2026-09-12T09:00:00" }
];

const review = (id, cardId, rating, reviewedAt, mode = "spelling") => ({ id, cardId, mode, rating, answer: "", diffJson: "[]", reviewedAt });

// 本周 5 次拼写（4 对 1 错 = 80%），上周 3 次（2 对 1 错 = 67%）
const reviews = [
  review("c1", "r1", 4, "2026-09-08T09:00:00"),
  review("c2", "r1", 4, "2026-09-09T09:00:00"),
  review("c3", "r1", 4, "2026-09-10T09:00:00"),
  review("c4", "r1", 1, "2026-09-11T09:00:00"),
  review("c5", "r1", 4, "2026-09-12T09:00:00"),
  review("p1", "r1", 4, "2026-09-01T09:00:00"),
  review("p2", "r1", 3, "2026-09-02T09:00:00"),
  review("p3", "r1", 1, "2026-09-03T09:00:00")
];

const schedules = [
  { cardId: "r1", easeFactor: 2.5, intervalDays: 3, reviewCount: 8, lapseCount: 1, nextReviewAt: iso(new Date(now.getTime() + 86400000)) }
];

const appData = {
  schemaVersion: 1,
  unitGroups: [], units: [], wordDetails: [], sentenceDetails: [],
  materials: [], materialSegments: [], mistakeGenerations: [],
  adventures: [], huntAttempts: [], huntResults: [], grammarLessonsDone: [],
  diaryEntries: [], dictionaryEntries: [],
  cards, reviews, schedules,
  settings: { dailyReviewLimit: 30, dailyNewWords: 10, dailySentences: 3 }
};

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
await page.evaluate((data) => {
  localStorage.setItem("onboarding-done-v1", "1");
  localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(data));
}, appData);
await page.goto("http://localhost:5173/stats", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);

const results = [];
const check = (name, pass, extra = "") => results.push(`${pass ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);

// Zone A 可能默认展开（桌面 1280 ≥ 861 → 展开）
const deltas = await page.$$eval(".stats-core-metrics .stats-delta", (els) => els.map((el) => el.textContent.trim()));
check("核心指标出现 3 个环比标签", deltas.length === 3, JSON.stringify(deltas));
check("复习环比 +2 vs 上周", deltas.some((t) => t.includes("+2") && t.includes("上周")), deltas[0]);
check("正确率环比 +13pp", deltas.some((t) => t.includes("+13pp")), deltas[1]);
check("新词环比 -1 vs 上周", deltas.some((t) => t.includes("-1") && t.includes("上周")), deltas[2]);

// Zone D 北极星
const zoneD = await page.$$eval(".stats-zone", (els) => els.map((el) => el.textContent));
const northStarTotal = await page.$eval(".stats-north-star-head strong", (el) => el.textContent.trim()).catch(() => null);
const northStarText = await page.$eval(".stats-north-star p", (el) => el.textContent.trim()).catch(() => null);
check("北极星累计掌握 = 3", northStarTotal === "3", String(northStarTotal));
check("里程碑文案：距 100 词还差 97 词", northStarText === "距 100 词里程碑还差 97 词", String(northStarText));
const trackWidth = await page.$eval(".stats-north-star-track span", (el) => el.style.width);
check("里程碑进度条 3%", trackWidth === "3%", trackWidth);

// 本周掌握口径：m1 masteredAt 9/10 在本周 → 核心指标"新词 / 掌握" = 0 / 1
const metricStrong = await page.$$eval(".stats-core-metrics strong", (els) => els.map((el) => el.textContent.trim()));
check("本周新词/掌握 = 0 / 1", metricStrong[2] === "0 / 1", metricStrong[2]);

await page.screenshot({ path: "scripts/smoke-r13.png", fullPage: false });
console.log(results.join("\n"));
console.log("zones found:", zoneD.length);
await browser.close();
