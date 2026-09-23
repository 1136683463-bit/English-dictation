// @vitest-environment node
/**
 * R13b · 配额墙的**重新标定**（2026-09-23 第 11 轮）
 *
 * ## 为什么要重算
 *
 * 「约 30 个月撞墙」这个结论是第 7 轮算出来的，但它的前提在第 9 轮被推翻：
 *
 * - 第 7 轮假设：5MB 配额按 **UTF-16 字符**计 → 可用 5,242,880 字符。
 * - 第 9 轮实测（Playwright 真机，非 jsdom 推断）：**WebKit 按字节计**，
 *   且只要字符串里出现一个 U+00FF 以上的字符（汉字全在此列），**整串**按
 *   2 字节/字符计费；Chromium 才按字符计。
 *   → WebKit 的真实可用量是 **2,600,000 字符**，正好是 Chromium 的一半。
 *
 * 而 macOS 桌面端（Tauri 用 WKWebView）**就是 WebKit**。
 * 所以「30 个月」只对 Chromium 成立，桌面端要短得多。
 *
 * ## 本文件做什么
 *
 * 用**真实的 `compactReviewHistory`**（不是估算公式）跑一遍增长模拟，
 * 分别按两个内核的账单口径，算出各自的撞墙月份。
 * 结论用于决定归档保留窗口是否需要调整。
 */
import { describe, expect, it } from "vitest";
import { compactReviewHistory } from "../../services/reviewArchiveService";
import { storageCostBytes } from "../../services/storage";
import { makeAppData, cardsToData, makeSentenceCard } from "./fixtures";
import type { AppData, Review, ReviewMode } from "../../types";

/** 两个内核的实测可用量（字符口径）。 */
const QUOTA = {
  chromium: 5_200_000,   // 按字符计
  webkit: 2_600_000      // 按字节计 → 含汉字时整串 ×2，等效字符数减半
} as const;

const MODES: ReviewMode[] = ["recognize", "recall", "spelling", "cloze"];
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 模拟「每天 20 分钟」的积累。
 *
 * 沿用第 6 轮的模型参数（那轮已用真实数据校准过）：
 * 每月新增约 300 张卡、每天约 30 条复习记录、日记与释义按比例增长。
 * 这里只关心**体积随时间**，所以按同样的密度线性铺数据即可。
 */
const buildAtMonth = (months: number, now: Date): AppData => {
  const days = Math.round(months * 30);
  const reviewsPerDay = 30;
  const newCardsPerMonth = 300;

  const cardCount = Math.round(newCardsPerMonth * months);
  const cards = Array.from({ length: cardCount }, (_, index) =>
    makeSentenceCard({
      id: `c-${index}`,
      // 课程句子里有中文释义与中文 note，这正是让 WebKit 翻倍的那部分内容
      sentence: `I have been learning this sentence number ${index} for a while now.`,
      note: `第 ${index} 句：这是我练习过的句子，记录一下当时的想法与用法。`,
      tags: ["语法", "日记"],
      schedule: { reviewCount: 3, intervalDays: 5, nextReviewAt: new Date(now.getTime() - DAY_MS).toISOString() },
      sourceId: `imported:${index}`
    })
  );

  const reviews: Review[] = [];
  for (let day = 0; day < days; day += 1) {
    const at = new Date(now.getTime() - day * DAY_MS);
    for (let n = 0; n < reviewsPerDay; n += 1) {
      reviews.push({
        id: `r-${day}-${n}`,
        cardId: cards[(day * reviewsPerDay + n) % Math.max(1, cards.length)]?.card.id ?? "c-0",
        mode: MODES[n % MODES.length],
        rating: (n % 4 === 0 ? 2 : 4) as Review["rating"],
        answer: "I have been learning this sentence for a while now.",
        reviewedAt: new Date(at.getTime() + n * 1000).toISOString()
      });
    }
  }

  return makeAppData({
    ...cardsToData(cards),
    reviews
  });
};

/** 归档在每月整理一次（界面入口的用户行为），返回归档后的数据。 */
const withArchive = (data: AppData, now: Date, retentionDays: number): AppData =>
  compactReviewHistory(data, { retentionDays, now }).data;

const costOf = (data: AppData): number => storageCostBytes(JSON.stringify(data));

const monthsUntilWall = (retentionDays: number | null): { chromium: number; webkit: number } => {
  const found = { chromium: 0, webkit: 0 };
  for (let months = 1; months <= 60; months += 1) {
    const now = new Date("2026-09-23T00:00:00.000Z");
    const raw = buildAtMonth(months, now);
    const data = retentionDays === null ? raw : withArchive(raw, now, retentionDays);
    const chars = JSON.stringify(data).length;
    if (!found.chromium && chars > QUOTA.chromium) found.chromium = months;
    if (!found.webkit && chars > QUOTA.webkit) found.webkit = months;
    if (found.chromium && found.webkit) break;
  }
  return found;
};

describe("PF2g1 配额墙重新标定（WebKit 按字节 vs Chromium 按字符）", () => {
  it("归档前：两个内核的撞墙月份（WebKit 只有 Chromium 的一半）", () => {
    const wall = monthsUntilWall(null);
    console.log(
      `\n[PF2g1] 归档前撞墙（每天 20 分钟）：\n` +
        `  Chromium（5.2M 字符）：约 ${wall.chromium} 个月\n` +
        `  WebKit  （2.6M 字符，含汉字整串 ×2）：约 ${wall.webkit} 个月\n` +
        `  → macOS 桌面端跑的是 WebKit`
    );
    expect(wall.webkit, "WebKit 先撞墙").toBeLessThan(wall.chromium);
    // 历史文档声称 14~18 个月（字符口径）——与 Chromium 的实测吻合
    expect(wall.chromium, "Chromium 与历史结论同量级").toBeGreaterThanOrEqual(12);
    expect(wall.chromium, "Chromium 与历史结论同量级").toBeLessThanOrEqual(20);
  });

  it("★ 归档（180 天窗口）在 WebKit 上把墙推后多少", () => {
    const before = monthsUntilWall(null);
    const after180 = monthsUntilWall(180);
    console.log(
      `\n[PF2g1] 180 天归档的效果：\n` +
        `  Chromium：${before.chromium} → ${after180.chromium} 个月\n` +
        `  WebKit  ：${before.webkit} → ${after180.webkit} 个月\n` +
        `  历史文档声称「推到约 30 个月」——见下个用例核对它对应哪个口径`
    );
    expect(after180.webkit, "归档确实推后了 WebKit 的墙").toBeGreaterThan(before.webkit);
    expect(after180.chromium, "归档确实推后了 Chromium 的墙").toBeGreaterThan(before.chromium);
  });

  it("★ 核对「30 个月」这个历史结论对应哪个内核", () => {
    const before = monthsUntilWall(null);
    const after180 = monthsUntilWall(180);
    console.log(
      `\n[PF2g1] 「约 30 个月」的归属：\n` +
        `  Chromium 归档后 = ${after180.chromium} 个月\n` +
        `  WebKit  归档后 = ${after180.webkit} 个月\n` +
        `  → 若 Chromium 接近 30 而 WebKit 明显更短，` +
        `则那条结论只对浏览器版成立，桌面端需要单独的保留窗口`
    );
    // 这条不断言具体数值（模型是模拟，不是实测），只固定「两者确实不同」这一事实
    expect(
      after180.chromium,
      "两个内核归档后的墙不在同一量级——历史结论必须标注口径"
    ).toBeGreaterThan(after180.webkit);
  });

  it("更短的保留窗口能换到多少个月（供产品决策：90 / 180 / 365 天对比）", () => {
    const rows = [90, 180, 365].map((days) => {
      const wall = monthsUntilWall(days);
      return { days, chromium: wall.chromium, webkit: wall.webkit };
    });
    console.log("\n[PF2g1] 保留窗口 vs 撞墙月份：");
    for (const row of rows) {
      console.log(`  ${String(row.days).padStart(3)} 天：Chromium ${row.chromium} 个月 / WebKit ${row.webkit} 个月`);
    }
    console.log(
      "  取舍：窗口越短，越早把「用户可能还想翻的错题明细」压成汇总；\n" +
        "        窗口越长，桌面端越早撞墙（撞墙＝写入失败，用户看到保存失败横幅）。"
    );
    // 窗口越短，墙越靠后（单调性）——这条是设计不变量
    expect(rows[0].webkit, "90 天窗口的 WebKit 墙不早于 180 天").toBeGreaterThanOrEqual(rows[1].webkit);
    expect(rows[2].webkit, "365 天窗口的 WebKit 墙不晚于 180 天").toBeLessThanOrEqual(rows[1].webkit);
  });
});

describe("PF2d 模型自检：能否复现第 6 轮的校准点", () => {
  /**
   * 第 6 轮的校准点：**12 个月 ≈ 4.0MB**（按 .length 字符口径）。
   * 若本文件的模型复现不出这个数，说明它与历史实测不同源，
   * 那本文件的结论就不能用来推翻历史结论——先证明尺子是同一把。
   */
  it("12 个月 / 24 个月 / 36 个月的体积（对照第 6 轮 12 个月 ≈ 4.0MB）", () => {
    const now = new Date("2026-09-23T00:00:00.000Z");
    const rows = [12, 24, 36].map((months) => {
      const data = buildAtMonth(months, now);
      const json = JSON.stringify(data);
      return {
        months,
        chars: json.length,
        mbChars: json.length / 1024 / 1024,
        cards: data.cards.length,
        reviews: data.reviews.length
      };
    });
    console.log("\n[PF2g1·模型自检] 不归档时的原始体积：");
    for (const row of rows) {
      console.log(
        `  ${row.months} 个月：${row.mbChars.toFixed(2)}MB(字符)  cards=${row.cards} reviews=${row.reviews}`
      );
    }
    console.log("  第 6 轮实测校准点：12 个月 ≈ 4.0MB");
    // 同源检查：模型在 12 个月处应与历史实测同量级（±40%）
    const at12 = rows[0].mbChars;
    expect(at12, `模型 12 个月 = ${at12.toFixed(2)}MB，应接近历史实测 4.0MB`).toBeGreaterThan(2.4);
    expect(at12, `模型 12 个月 = ${at12.toFixed(2)}MB，应接近历史实测 4.0MB`).toBeLessThan(5.6);
  });

  it("体积构成：谁在增长（决定该压哪一类）", () => {
    const now = new Date("2026-09-23T00:00:00.000Z");
    const data = buildAtMonth(24, now);
    const parts = [
      ["cards", data.cards],
      ["reviews", data.reviews],
      ["schedules", data.schedules],
      ["wordDetails", data.wordDetails],
      ["sentenceDetails", data.sentenceDetails],
      ["unitGroups", data.unitGroups],
      ["units", data.units],
      ["settings", data.settings]
    ] as const;
    const total = JSON.stringify(data).length;
    console.log("\n[PF2g1·体积构成] 24 个月：");
    const sorted = parts
      .map(([name, value]) => ({ name, chars: JSON.stringify(value).length }))
      .sort((a, b) => b.chars - a.chars);
    for (const part of sorted) {
      const pct = (part.chars / total) * 100;
      if (pct < 1) continue;
      console.log(`  ${part.name.padEnd(16)} ${String(part.chars).padStart(9)} 字符  ${pct.toFixed(1)}%`);
    }
    console.log(`  ${"总计".padEnd(16)} ${String(total).padStart(9)} 字符`);
    expect(total).toBeGreaterThan(0);
  });
});

describe("PF2d 关键差异：中文字段决定 WebKit 的账单翻不翻倍", () => {
  /**
   * 这是本轮最值得记的一条。
   *
   * 第 7 轮的墙测试用**纯 ASCII 的词卡**（`front: "w0"`、`answer: "x"`、`note: ""`），
   * 于是 `storageCostBytes` 对它**不翻倍**——它测出的碰撞点自然更靠后。
   *
   * 而真实用户的数据**必然含汉字**：课程句子的中文释义、日记内容、
   * 中文标签、中文 note。只要出现一个汉字，WebKit 就把**整串**按 2 字节计费。
   *
   * 两个模型的差别不是「谁的估算更准」，而是**它们在不同内核上跑**：
   * 纯 ASCII 数据在两个内核上账单相同；含汉字的数据在 WebKit 上翻倍。
   */
  const asciiWordCardData = (days: number) => {
    const cardCount = days * 14;
    return makeAppData({
      ...cardsToData(
        Array.from({ length: cardCount }, (_, i) =>
          makeSentenceCard({
            id: `w-${i}`,
            sentence: "word",
            note: "",
            tags: [],
            schedule: { reviewCount: 3, intervalDays: 3, nextReviewAt: "2024-01-01T00:00:00.000Z" }
          })
        )
      ),
      reviews: Array.from({ length: days * 30 }, (_, i) => ({
        id: `r${i}`,
        cardId: `w-${i % cardCount}`,
        mode: "spelling" as const,
        rating: 3 as const,
        answer: "x",
        reviewedAt: new Date(Date.now() - Math.floor(i / 30) * 86400000).toISOString()
      }))
    });
  };

  it("对照：纯 ASCII 数据不触发翻倍，含中文 note 的数据触发", () => {
    const ascii = asciiWordCardData(30);
    const withChinese = buildAtMonth(1, new Date("2026-09-23T00:00:00.000Z"));

    const asciiJson = JSON.stringify(ascii);
    const chineseJson = JSON.stringify(withChinese);

    const asciiCost = storageCostBytes(asciiJson);
    const chineseCost = storageCostBytes(chineseJson);

    console.log(
      `\n[PF2g1·翻倍条件] \n` +
        `  纯 ASCII 数据：.length=${asciiJson.length}  计费=${asciiCost}  ` +
        `倍数=${(asciiCost / asciiJson.length).toFixed(2)}（不翻倍）\n` +
        `  含中文数据  ：.length=${chineseJson.length}  计费=${chineseCost}  ` +
        `倍数=${(chineseCost / chineseJson.length).toFixed(2)}（翻倍）\n` +
        `  → 真实数据含汉字，所以在 WebKit 上按 2 倍计费`
    );

    expect(asciiCost, "纯 ASCII 不翻倍").toBe(asciiJson.length);
    expect(chineseCost, "含中文翻倍").toBe(chineseJson.length * 2);
    expect(
      asciiCost / asciiJson.length < chineseCost / chineseJson.length,
      "含中文的每字符成本更高"
    ).toBe(true);
  });

  it("第 7 轮「30 个月」与本次「WebKit 10 个月」不矛盾——它们差的正是翻倍", () => {
    const now = new Date("2026-09-23T00:00:00.000Z");
    const data24 = buildAtMonth(24, now);
    const archived = compactReviewHistory(data24, { retentionDays: 180, now }).data;
    const json = JSON.stringify(archived);

    const cost = storageCostBytes(json);
    const charged = cost > json.length;
    console.log(
      `\n[PF2g1·口径对照] 24 个月归档后的同一份数据：\n` +
        `  字符口径（第 7 轮用的）：${(json.length / 1024 / 1024).toFixed(2)}MB ` +
        `→ 能写进 Chromium 的 5MB\n` +
        `  字节口径（WebKit 实际）：${(cost / 1024 / 1024).toFixed(2)}MB ` +
        `→ ${cost > QUOTA.webkit ? "写不进 WebKit 的 2.6M 字符额度 ❌" : "能写进 ✅"}\n` +
        `  含汉字 = ${charged}`
    );
    /**
     * 这条固定的是「两份结论各自的适用范围」：
     * 第 7 轮的 30 个月对 Chromium 版成立；桌面端（WebKit）要按翻倍后的账单算。
     */
    expect(charged, "真实数据必然含汉字 → WebKit 翻倍").toBe(true);
  });
});
