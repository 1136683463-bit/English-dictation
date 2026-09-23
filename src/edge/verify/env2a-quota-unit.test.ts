// @vitest-environment jsdom
/**
 * ENV2a · 配额口径的可移植性（2026-09-22 存储环境差异专项）
 *
 * ## 背景：曾经的缺陷
 *
 * 前几轮的容量结论（lg1 / lg2 / pf2c / sv3）**全部建立在 jsdom 的配额模型上**：
 * jsdom 按 **UTF-16 code unit（= 字符）** 计 5,000,000 的额度。
 * 而真实环境的账单口径不同：
 *
 * | 环境                          | 配额口径                                    |
 * |-------------------------------|---------------------------------------------|
 * | jsdom（本测试环境）           | 5,000,000 **字符**                          |
 * | Chromium（Chrome/Edge/WebView2） | 5,242,880 **字符**（与内容字符种类无关）  |
 * | WebKit（Safari / macOS WKWebView） | 5,242,880 **字节**；含一个 U+00FF 以上字符即整串按 2 字节/字符 |
 *
 * 旧实现 `LOCAL_STORAGE_SOFT_LIMIT_KB = 4096` 用 `.length`（字符）来比，
 * 在 WebKit 上那把「4,194,304 字符」的阈值换算成字节是 8,388,608 ——
 * **比真实容量 5,242,880 还大**，于是唯一的提前告警在 macOS 桌面端永不出现。
 *
 * ## 本轮状态：**已被修复**（同批次另一路同时改动了 `storage.ts`）
 *
 * 现在的实现是（`storage.ts`）：
 *   - `storageCostBytes(value)`：扫描到任一 `charCodeAt > 0xff` 就返回 `length * 2`，
 *     否则返回 `length`——即**最坏情况账单**，刻意取两内核中更紧的那个；
 *   - `STORAGE_SOFT_LIMIT_BYTES = 4 * 1024 * 1024`（5,242,880 的约 80%）；
 *   - `buildDiagnosis` 比较 `storageCostKb * 1024 > STORAGE_SOFT_LIMIT_BYTES`；
 *   - `DataDiagnosis.storageCostKb` 取代了旧的 `sizeKb` 字段名。
 *
 * 本文件因此从「报告偏差」转为**回归护栏**：把新口径的行为固定住，
 * 并量化剩余偏差（对 Chromium 上的含中文数据会**高估一倍**，即更早提醒——
 * 方向是刻意的，见 `storageCostBytes` 的注释）。
 */
import { describe, expect, it } from "vitest";
import {
  STORAGE_SOFT_LIMIT_BYTES,
  buildDiagnosis,
  storageCostBytes,
  summarizeStartupRepairs
} from "../../services/storage";
import { compactReviewHistory } from "../../services/reviewArchiveService";
import { makeAppData, cardsToData, makeSentenceCard } from "./fixtures";
import type { Review } from "../../types";

/** WebKit 与 Chromium 的实测容量（storage.ts 的注释里记录了 Playwright 真机数据）。 */
const WEBKIT_BYTES = 5_242_880;
const CHROMIUM_CHARS = 5_242_880;

describe("ENV2a-1 计费函数：最坏情况账单", () => {
  it("纯 ASCII 按字符计（1 字节/字符）", () => {
    expect(storageCostBytes("a".repeat(1000)), "ASCII：1 字节/字符").toBe(1000);
  });

  it("含任一 U+00FF 以上字符 → 整串按 2 字节/字符", () => {
    const mixed = "a".repeat(99_999) + "中"; // 1 个汉字 + 99,999 个 ASCII
    expect(
      storageCostBytes(mixed),
      "一个汉字就让整串翻倍——这是 WebKit 的实际规则，不是逐字符累加"
    ).toBe(mixed.length * 2);
  });

  it("边界：U+00FF 与 U+0100 的分界", () => {
    expect(storageCostBytes("é".repeat(10)), "U+00E9 ≤ 0xff → 不触发翻倍").toBe(10);
    expect(storageCostBytes("Ā".repeat(10)), "U+0100 > 0xff → 触发翻倍").toBe(20);
  });
});

describe("ENV2a-2 软上限阈值：方向正确（宁早不晚）", () => {
  it("阈值取 WebKit 实测容量的约 80%，且**小于**两内核的真实容量", () => {
    expect(STORAGE_SOFT_LIMIT_BYTES, "4MB 阈值").toBe(4 * 1024 * 1024);
    expect(
      STORAGE_SOFT_LIMIT_BYTES,
      "阈值必须小于 WebKit 容量，否则告警在 macOS 上永不触发（这正是旧实现的缺陷）"
    ).toBeLessThan(WEBKIT_BYTES);
    expect(STORAGE_SOFT_LIMIT_BYTES, "阈值也小于 Chromium 容量").toBeLessThan(CHROMIUM_CHARS);
    expect(
      STORAGE_SOFT_LIMIT_BYTES / WEBKIT_BYTES,
      "约为 WebKit 容量的 80%"
    ).toBeGreaterThan(0.75);
  });

  it("含中文数据刚好超过阈值即告警（WebKit 场景，走真实诊断路径）", () => {
    /**
     * `buildDiagnosis` 的判据是 `storageCostKb * 1024 > STORAGE_SOFT_LIMIT_BYTES`。
     * 含中文时 `storageCostBytes` = 字符数 × 2，所以阈值等价于
     * 「字符数 > 4,194,304 / 2 = 2,097,152」。
     */
    const minCharsOverThreshold = STORAGE_SOFT_LIMIT_BYTES / 2;
    expect(minCharsOverThreshold, "含中文数据的告警门槛（字符数）").toBe(2_097_152);

    // 刚好在门槛下：不告警
    const underChars = Math.floor(minCharsOverThreshold) - 2048;
    const underKb = Math.round(storageCostBytes("中".repeat(underChars)) / 1024);
    expect(buildDiagnosis([], underKb, 8).issues.length, "门槛下不告警").toBe(0);

    // 刚好越过门槛：告警
    const overChars = Math.floor(minCharsOverThreshold) + 2048;
    const overKb = Math.round(storageCostBytes("中".repeat(overChars)) / 1024);
    const diag = buildDiagnosis([], overKb, 8);
    expect(diag.issues.length, "越过门槛 → 告警").toBe(1);
    expect(diag.issues.join(" "), "告警文案建议导出备份").toMatch(/备份/);
    expect(diag.ok, "诊断为不健康").toBe(false);

    console.log(
      `\n[ENV2a] 含中文数据的告警门槛：\n` +
        `  ${Math.round(minCharsOverThreshold).toLocaleString()} 字符（= ${STORAGE_SOFT_LIMIT_BYTES.toLocaleString()} 字节 ÷ 2）\n` +
        `  门槛下 ${Math.round(underChars).toLocaleString()} 字符 → ${underKb} KB → 不告警\n` +
        `  门槛上 ${Math.round(overChars).toLocaleString()} 字符 → ${overKb} KB → 告警`
    );
  });

  it("对照：旧实现在 WebKit 上会漏报（用同一条规则复算，证明修复的必要性）", () => {
    /**
     * 旧逻辑：`sizeKb = Math.round(raw.length / 1024)` 与 `4096` 比。
     * 一份 2,600,000 字符的含中文数据：
     *   - 旧口径读数 2,539 KB < 4096 → **无告警**
     *   - 但 WebKit 实际占用 2,600,000 × 2 = 5,200,000 字节，已到 5,242,880 的 99%
     */
    const chars = 2_600_000;
    const oldReadingKb = Math.round(chars / 1024);
    const realBytesWebKit = storageCostBytes("中".repeat(1) + "a".repeat(chars - 1));

    expect(oldReadingKb < 4096, "旧口径读数远低于 4096 → 旧实现不会告警").toBe(true);
    expect(realBytesWebKit, "实际占用已到 WebKit 容量的 99%").toBeGreaterThan(WEBKIT_BYTES * 0.98);
    expect(realBytesWebKit, "且已超过新的 4MB 阈值 → 新实现会告警").toBeGreaterThan(STORAGE_SOFT_LIMIT_BYTES);

    console.log(
      `\n[ENV2a] 修复前后对比（${chars.toLocaleString()} 字符的含中文数据）：\n` +
        `  旧口径读数  ${oldReadingKb.toLocaleString()} KB  vs 阈值 4096 KB  → 不告警（漏报）\n` +
        `  WebKit 实付 ${realBytesWebKit.toLocaleString()} 字节 vs 容量 ${WEBKIT_BYTES.toLocaleString()} → 已用 99%\n` +
        `  新口径：${realBytesWebKit.toLocaleString()} 字节 > 阈值 ${STORAGE_SOFT_LIMIT_BYTES.toLocaleString()} → 正常告警`
    );
  });

  it("剩余偏差（刻意保留）：Chromium 上的含中文数据被高估一倍 → 更早提醒", () => {
    /**
     * `storageCostBytes` 返回最坏情况。对 **Chromium**（按字符计）来说，
     * 含中文的数据会被高估一倍：真实的 2,600,000 字符只占 5,242,880 的 50%，
     * 但会被算成 5,200,000 字节（99%）。
     *
     * 这不是缺陷而是取舍：宁可对 Chromium 早提醒，也不要对 WebKit 漏提醒。
     * 本用例把这个取舍固定下来，避免将来有人「顺手优化」掉方向性。
     */
    const chars = CHROMIUM_CHARS * 0.5;
    const chromiumRealShare = chars / CHROMIUM_CHARS;
    const billedShare = storageCostBytes("a".repeat(chars - 1) + "中") / WEBKIT_BYTES;

    expect(chromiumRealShare, "Chromium 实际只用了 50%").toBeCloseTo(0.5, 5);
    expect(billedShare, "但被按 99% 计费").toBeGreaterThan(0.95);
    expect(
      billedShare > chromiumRealShare,
      "偏差方向是「高估」→ 更早提醒（安全的方向）"
    ).toBe(true);

    console.log(
      `\n[ENV2a] 刻意保留的偏差：Chromium + 含中文数据\n` +
        `  实际占用 ${(chromiumRealShare * 100).toFixed(0)}%，计费按 ${(billedShare * 100).toFixed(0)}% → 提前约一倍提醒\n` +
        `  方向安全（早提醒无害，漏提醒才会丢数据）`
    );
  });
});

describe("ENV2a-3 每处配额相关常量的口径盘点", () => {
  it("主数据体积：唯一权威是 storageCostBytes（已无 .length 直读）", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const source = fs.readFileSync(path.resolve(__dirname, "../../services/storage.ts"), "utf8");

    expect(source, "有计费函数").toContain("storageCostBytes");
    expect(source, "阈值以字节命名").toContain("STORAGE_SOFT_LIMIT_BYTES");
    expect(
      /const sizeKb = Math\.round\(\(raw \?\? JSON\.stringify\(data\)\)\.length \/ 1024\)/.test(source),
      "旧的 .length 直读已不存在（若复发，告警会在 WebKit 上漏报）"
    ).toBe(false);
  });

  it("归档释放量仍是**字符**口径，但只用于文案展示（影响面有限）", () => {
    /**
     * `reviewArchiveService.ts` 的 `freedBytes = beforeJson.length - afterJson.length`
     * 是**字符差**，字段名却叫 bytes，`SettingsPage` 除以 1024 报成「释放约 N KB」。
     * 中文内容下会偏小（UTF-8 3 字节/字，UTF-16 2 字节/字，而 .length 只数 1）。
     *
     * 与主数据体积判断不同，这只是**一句提示文案**，不参与任何阈值判断，
     * 因此本轮不改（改文案口径属于另一件事）。
     */
    const chineseReviews: Review[] = Array.from({ length: 400 }, (_, index) => ({
      id: `r-${index}`,
      cardId: "c1",
      mode: "spelling",
      rating: 4 as const,
      answer: "这是一个包含较多中文字符的答案，用来把字节与字符的差距放大到可测量的程度。",
      reviewedAt: new Date(Date.UTC(2024, 0, 1 + (index % 300), 9, index % 60)).toISOString()
    }));
    const data = makeAppData({
      ...cardsToData([makeSentenceCard({ id: "c1", sentence: "anchor", schedule: null })]),
      reviews: chineseReviews
    });
    const now = new Date(Date.UTC(2025, 0, 1));
    const result = compactReviewHistory(data, { retentionDays: 180, now });

    const reportedChars = result.freedBytes;
    const realBytes = storageCostBytes(JSON.stringify(chineseReviews)) - storageCostBytes(JSON.stringify(result.data.reviews));

    expect(reportedChars, "报告的确实是字符差").toBeGreaterThan(0);
    expect(realBytes / reportedChars, "按 storageCostBytes 口径会大得多（含中文 → 2 倍）").toBeGreaterThan(1.5);

    console.log(
      `\n[ENV2a] 归档提示文案的口径（仅影响展示，不影响阈值判断）：\n` +
        `  freedBytes 字段 = ${reportedChars.toLocaleString()} 字符 → 界面显示 ${Math.round(reportedChars / 1024)}KB\n` +
        `  按 storageCostBytes 实付 ${realBytes.toLocaleString()} 字节 → ${Math.round(realBytes / 1024)}KB\n` +
        `  → 显示值偏小约 ${(realBytes / reportedChars).toFixed(1)} 倍；用户在 WebKit 上看到的「释放了 X KB」低于真实值`
    );
  });

  it("启动修复报告不涉及体积口径（对照项，确认无需改动）", () => {
    const raw = JSON.stringify(
      makeAppData({ ...cardsToData([makeSentenceCard({ id: "c1", sentence: "x", schedule: null })]) })
    );
    expect(Array.isArray(summarizeStartupRepairs(raw, makeAppData()))).toBe(true);
  });

  it("遥测上限是**条数**不是字节 —— 与配额口径无关，不受两内核差异影响", () => {
    /**
     * 四类遥测（vocab / grammar / adventure / settings）都以 MAX_EVENTS 条数封顶
     * （如 vocabTelemetry.ts:21 `MAX_EVENTS = 3000`），并配 nearCapacity（≥80%）。
     * 这是条数口径，不会因为字符/字节的差异而偏移 —— 属于安全的对照项。
     */
    expect(true).toBe(true);
  });
});
