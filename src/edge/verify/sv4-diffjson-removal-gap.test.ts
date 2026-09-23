// @vitest-environment node
/**
 * SV4 · diffJson 摘除的归一化缺口（2026-09-22 存储精简专项）
 *
 * 背景：`Review.diffJson` 已被标记废弃（types.ts:129 `diffJson?:`），
 * 写入侧也确实停发了（reviewService.ts:534-542，`void diffJson`）。
 * 但摘除**只完成了一半**：
 *
 *   缺口 ① 归一化仍在给它赋值（storage.ts:513 `diffJson: asString(value.diffJson, "[]")`）
 *          → 每条 review 迁移后都带 `"diffJson":"[]"`（11 字符键名开销 + 2 字符值）。
 *            写入侧停发只把值从 ~21 字符压到 2 字符，**字段本身没消失**。
 *
 *   缺口 ② `reviewArchiveService.compactReviewHistory` 已实现（:75），
 *          但**没有任何调用方**——types.ts:127 承诺的「旧值会在下一次清理历史时
 *          一并清除」没有任何触发路径，设置页也没有入口。所以已落盘的历史
 *          diffJson（旧版本写入的真实内容）会一直留在 5MB 配额里。
 *
 * ✅ 2026-09-22 两条都已闭环：
 *   - 归一化不再补 `"[]"`（storage.ts 改为「合法非空才保留」）；
 *   - 归档已接到设置页（`SettingsPage` 的「归档久远复习明细」入口）。
 * 本文件相应翻转为**防回退断言**：若将来有人恢复 fallback 或摘掉入口，这里会红。
 */
import { describe, expect, it } from "vitest";
import { compactReviewHistory } from "../../services/reviewArchiveService";
import { migrateData } from "../../services/storage";
import type { Review } from "../../types";

const ISO = "2024-01-01T00:00:00.000Z";

/** 最小可识别备份。 */
const backupWith = (reviews: unknown[]) => ({
  schemaVersion: 8,
  cards: [
    {
      id: "c1",
      type: "word",
      front: "approach",
      back: "方法",
      note: "",
      tags: [],
      status: "review",
      priority: false,
      createdAt: ISO,
      updatedAt: ISO
    }
  ],
  schedules: [
    { cardId: "c1", easeFactor: 2.5, intervalDays: 1, reviewCount: 1, lapseCount: 0, nextReviewAt: ISO }
  ],
  reviews,
  units: [],
  unitGroups: [],
  wordDetails: [],
  sentenceDetails: [],
  materials: [],
  materialSegments: [],
  mistakeGenerations: [],
  adventures: [],
  huntAttempts: [],
  huntResults: [],
  grammarLessonsDone: [],
  diaryEntries: [],
  dictionaryEntries: [],
  seededWordVersions: ["core-100-v1"],
  languageGates: [],
  gateAttempts: [],
  runeStates: [],
  settings: {}
});

describe("SV2 · diffJson 摘除缺口", () => {
  it("【已闭环】迁移不再给缺失的记录补 diffJson", () => {
    const out = migrateData(
      backupWith([{ id: "r1", cardId: "c1", mode: "spelling", rating: 4, answer: "approach", reviewedAt: ISO }])
    );
    const row = out.reviews[0] as unknown as Record<string, unknown>;

    console.log(
      `\n[SV4] 输入（写入侧现在的产物，无 diffJson）：\n` +
        `  {"id":"r1","cardId":"c1","mode":"spelling","rating":4,"answer":"approach","reviewedAt":"…"}\n` +
        `  迁移后：\n  ${JSON.stringify(row)}\n` +
        `  → diffJson = ${JSON.stringify(row.diffJson)}（应为 undefined）`
    );

    // 修复前：迁移会补 "[]"，字段消失不了，摘除被完全抵消
    expect("diffJson" in row, "归一化不应再给缺失的记录补 diffJson").toBe(false);
  });

  it("【已闭环】缺失不补、非法值丢弃、真实值保留（与 mistakeGraduatedAt 同口径）", () => {
    /**
     * 对照 storage.ts 里同一文件的两套口径：
     *   - `mistakeGraduatedAt`（:351-356）：合法字符串才保留，否则 **undefined**
     *     —— 注释明写「缺失与垃圾都落到 undefined，不给一个不存在的毕业时间编造时间戳」。
     *   - `diffJson`（:513）：任何输入都给 `"[]"`。
     *
     * `"[]"` 不是「无数据」，它的语义是「我比过了，零差异」。
     * 若将来有人读它，会读到**假的零差异**，而不是「当时没记录」。
     * 这与本仓库自己立的口径（不编造时间戳）是同一个类别的缺陷。
     */
    const out = migrateData(
      backupWith([
        { id: "r1", cardId: "c1", mode: "spelling", rating: 4, answer: "approach", reviewedAt: ISO },
        { id: "r2", cardId: "c1", mode: "cloze", rating: 1, answer: "aproach", diffJson: "not-json", reviewedAt: ISO }
      ])
    );
    const [missing, garbage] = out.reviews as unknown as Array<Record<string, unknown>>;

    console.log(
      `\n[SV4] 归一化对 diffJson 的处理\n` +
        `  字段缺失        → ${JSON.stringify(missing.diffJson)}  ← 补成"零差异"（编造内容）\n` +
        `  非法值"not-json" → ${JSON.stringify(garbage.diffJson)}  ← 原样透传，不做合法性校验\n` +
        `  期望（与 mistakeGraduatedAt 同口径）→ 不写这个键（undefined）`
    );

    // 修复后：缺失与垃圾都不写该键；只有真实值才保留
    expect(missing.diffJson, "缺失不应编造「零差异」").toBeUndefined();
    expect(garbage.diffJson, "非法值不应原样透传").toBeUndefined();
  });

  it("缺口②已闭环：归档已接到设置页（防回退断言）", async () => {
    /**
     * 审计过程中本缺口被并行修复：`SettingsPage.tsx:169` 现在调用
     * `compactReviewHistory(data)`（危险操作里的「归档久远复习明细」）。
     * 这条改成**防回退断言**：入口在，且归档产物不被归一化污染（见下一条）。
     */
    const { readFileSync } = await import("node:fs");
    // process.cwd()（vitest 从仓库根启动），不写死本机绝对路径（2026-09-24 修）。
    const repo = process.cwd();
    const settings = readFileSync(`${repo}/src/pages/SettingsPage.tsx`, "utf8");
    const hasEntry = settings.includes("compactReviewHistory(data)");

    console.log(
      `\n[SV4] 归档入口现状：SettingsPage.tsx ${hasEntry ? "已接线" : "仍未接线"}\n` +
        `  → types.ts:127 承诺的「旧值会在下一次清理历史时被一并清除」现已成立。\n` +
        `  ⚠️ 但归档产出**刻意不带 diffJson**（reviewArchiveService.ts:131-138），\n` +
        `     而 storage.ts:513 会立刻给它补一个 "diffJson":"[]" —— 见下一条。`
    );

    expect(readFileSync(`${repo}/src/types.ts`, "utf8")).toContain("compactReviewHistory");
    expect(hasEntry, "设置页应保留归档入口").toBe(true);
  });

  it("【已闭环】归档产出的汇总记录，迁移后不再被补 diffJson", () => {
    /**
     * 归档自身产出的汇总记录是**刻意不带 diffJson** 的
     *（reviewArchiveService.ts:131-138 只写 id/cardId/mode/rating/answer/reviewedAt），
     * 而迁移会立刻给它补一个 `"diffJson":"[]"`。
     * 所以「归档 → 迁移 → 落盘」这条链上，每条汇总记录都会白拿 13 字符。
     */
    const reviews: Review[] = Array.from({ length: 30 }, (_, index) => ({
      id: `r${index}`,
      cardId: "c1",
      mode: "spelling",
      rating: 4,
      answer: "approach",
      reviewedAt: "2023-01-01T09:00:00.000Z"
    }));
    const compacted = compactReviewHistory({ reviews } as never, { now: new Date("2024-06-01T00:00:00.000Z") });
    const summary = compacted.data.reviews[0] as unknown as Record<string, unknown>;
    const afterMigrate = (
      migrateData(backupWith(compacted.data.reviews)).reviews[0] as unknown as Record<string, unknown>
    );

    console.log(
      `\n[SV4] 归档 → 迁移 往返\n` +
        `  归档产出（30 条压成 1 条，释放 ${compacted.freedBytes} 字符）：\n    ${JSON.stringify(summary)}\n` +
        `  经 migrateData 后：\n    ${JSON.stringify(afterMigrate)}\n` +
        `  → 多出的 "diffJson":"[]" 共 ${JSON.stringify(afterMigrate).length - JSON.stringify(summary).length} 字符，\n` +
        `     对每条汇总记录都是白付的（汇总记录的 answer 本就是空的，不存在 diff 可算）。`
    );

    expect(compacted.compactedCount).toBe(30);
    expect("diffJson" in summary, "归档产出的汇总本就不带该字段").toBe(false);
    expect(afterMigrate.diffJson, "迁移也不应再把它补回来（缺口已闭环）").toBeUndefined();
  });

  it("量化：字段没消失，只是从真实内容缩成一个空数组（一年模型的残值）", () => {
    const REVIEWS = 10950;
    const oldDiffChars = 21; // 实测 42 字节 ≈ 21 字符
    const emptyValueChars = 2; // "[]"
    const keyOverheadChars = JSON.stringify({ diffJson: "" }).length - JSON.stringify({}).length - 2;

    const savedValueChars = (oldDiffChars - emptyValueChars) * REVIEWS;
    const residualKeyChars = (keyOverheadChars + emptyValueChars) * REVIEWS;
    const MONTH_CHARS = 0.242 * 1024 * 1024; // lg1 实测每 +1 月 ≈ +0.242M 字符

    console.log(
      `\n[SV4] diffJson 摘除的当前收益 vs 剩余残值（一年 ${REVIEWS} 条）\n` +
        `  单条：旧真实 diff ${oldDiffChars} 字符 → 现在 ${emptyValueChars} 字符（"[]"）\n` +
        `  字段名与结构开销：${keyOverheadChars} 字符/条\n` +
        `  ── 写入侧已省下：        ${((savedValueChars * 2) / 1024).toFixed(0)} KB（约 ${(savedValueChars / MONTH_CHARS).toFixed(2)} 个月寿命）\n` +
        `  ── 仍留在存储里（残值）：${((residualKeyChars * 2) / 1024).toFixed(0)} KB（键名 + "[]"）\n` +
        `  ── 归一化若一并停发可再省：${((residualKeyChars * 2) / 1024).toFixed(0)} KB（约 ${(residualKeyChars / MONTH_CHARS).toFixed(2)} 个月）\n` +
        `  ── 历史记录里的真实 diffJson 若走归档清理：约 ${(((oldDiffChars - emptyValueChars) * REVIEWS * 2) / 1024).toFixed(0)} KB`
    );

    expect(savedValueChars).toBeGreaterThan(0);
    expect(residualKeyChars).toBeGreaterThan(0);
  });
});
