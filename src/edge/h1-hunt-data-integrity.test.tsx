// @vitest-environment jsdom
/**
 * H1 · 案件数据完整性（侦探找错，全库 201 案程序化扫描）
 *
 * 验证目标：数据层错误会让「用户点对了却判错」，所以这里把每个案件的
 * tokens / errors 关系逐条机械核对，并守住「每案必须有干净词块」的设计底线。
 *
 * 与既有 src/services/huntService.test.ts 的差别：那边守的是「合法」，
 * 这边守的是「游戏可玩且判定诚实」——尤其是「修正 ≠ 原词」这条：
 * 目前有 2 处 correction 与 original 完全相同，命中后结算页会显示「go. → go.」，
 * 玩家看不到任何改动。这类点被断言记录为「已知例外」，数量变化会失败。
 */
import { describe, expect, it } from "vitest";
import { huntCases } from "../data/huntCases";
import { grammarLessons } from "../data/grammarLessons";
import { GRAMMAR_ERROR_TAGS, GRAMMAR_ERROR_TAG_LABELS, judgeGuess, listHuntCasesWithLock } from "../services/huntService";
import { seedAppData } from "./huntDiaryEnv";
import type { GrammarErrorTag } from "../types";

const strip = (token: string) => token.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();

/** 已知的「修正与原词相同（含标点）」例外，均已在数据中留下「这句没问题」的讲解。 */
const KNOWN_NO_OP_CORRECTIONS = [
  { caseId: "hunt-myself-cake", tokenIndex: 12, original: "help" },
  { caseId: "hunt-unless-rain", tokenIndex: 12, original: "go." }
];

/** 已知的「修正为空串（删词/换位型）」例外，属教学上合理的「这是多余的词 / 顺序反了」。 */
const KNOWN_EMPTY_CORRECTIONS_MIN = 12;

describe("H1 案件数据完整性", () => {
  it("案件池非空且 errors 总量与人工标注规模一致", () => {
    expect(huntCases.length).toBeGreaterThan(0);
    const totalErrors = huntCases.reduce((sum, item) => sum + item.errors.length, 0);
    expect(totalErrors).toBeGreaterThanOrEqual(54);
    console.log(`[H1] 案件 ${huntCases.length} 案 / ${totalErrors} 处植错`);
  });

  it("每个 errors[].tokenIndex 都是 tokens 的合法下标（全库扫描）", () => {
    const invalid: string[] = [];
    for (const item of huntCases) {
      for (const error of item.errors) {
        const index = error.tokenIndex;
        if (!Number.isInteger(index) || index < 0 || index >= item.tokens.length) {
          invalid.push(`${item.id} tokenIndex=${index} tokens=${item.tokens.length}`);
        }
      }
    }
    expect(invalid).toEqual([]);
  });

  it("errors[].original 与 tokens[tokenIndex] 文本一致（忽略标点与大小写）", () => {
    const mismatched: string[] = [];
    for (const item of huntCases) {
      for (const error of item.errors) {
        const token = item.tokens[error.tokenIndex];
        if (token === undefined) continue;
        const tokenWord = strip(token);
        // 多词 original（如 "a dress beautiful"）只要包含该位置的词即视为对位。
        const originalWords = error.original.split(/\s+/).map(strip).filter(Boolean);
        if (originalWords.length === 0 || !originalWords.includes(tokenWord)) {
          mismatched.push(`${item.id} idx=${error.tokenIndex} token="${token}" original="${error.original}"`);
        }
      }
    }
    expect(mismatched).toEqual([]);
  });

  it("同一案件内没有重复的 tokenIndex（否则一处命中会算两处）", () => {
    const duplicated: string[] = [];
    for (const item of huntCases) {
      const seen = new Set<number>();
      for (const error of item.errors) {
        if (seen.has(error.tokenIndex)) duplicated.push(`${item.id} idx=${error.tokenIndex}`);
        seen.add(error.tokenIndex);
      }
    }
    expect(duplicated).toEqual([]);
  });

  it("每个案件的 errors[].tag 都在罪名词表内", () => {
    const tags = new Set<string>(GRAMMAR_ERROR_TAGS);
    const unknown: string[] = [];
    for (const item of huntCases) {
      for (const error of item.errors) {
        if (!tags.has(error.tag)) unknown.push(`${item.id} idx=${error.tokenIndex} tag=${error.tag}`);
      }
    }
    expect(unknown).toEqual([]);
  });

  it("每个案件至少有一个「干净词块」（防止乱点就中）", () => {
    const violations: string[] = [];
    for (const item of huntCases) {
      const errorIndexes = new Set(item.errors.map((error) => error.tokenIndex));
      const cleanCount = item.tokens.filter((_, index) => !errorIndexes.has(index)).length;
      if (cleanCount < 1) violations.push(`${item.id} clean=${cleanCount} tokens=${item.tokens.length}`);
    }
    expect(violations).toEqual([]);
  });

  it("干净词块占比整体足够高（乱点不能有像样的命中率）", () => {
    let totalTokens = 0;
    let totalErrors = 0;
    for (const item of huntCases) {
      totalTokens += item.tokens.length;
      totalErrors += item.errors.length;
    }
    const cleanRatio = (totalTokens - totalErrors) / totalTokens;
    console.log(`[H1] 干净词块占比 ${(cleanRatio * 100).toFixed(1)}%（${totalTokens - totalErrors}/${totalTokens}）`);
    expect(cleanRatio).toBeGreaterThan(0.5);
  });

  it("errors[].explanation 非空且达到可读长度", () => {
    const thin: string[] = [];
    for (const item of huntCases) {
      for (const error of item.errors) {
        if (!error.explanation || error.explanation.trim().length < 8) {
          thin.push(`${item.id} idx=${error.tokenIndex} len=${error.explanation?.trim().length ?? 0}`);
        }
      }
    }
    expect(thin).toEqual([]);
  });

  // ── 问题登记：修正与原词相同 ─────────────────────────────
  it("「修正与原词相同」的植错点必须为 0（2026-09-20 已修：2 处假错改成真错）", () => {
    const noOp: Array<{ caseId: string; tokenIndex: number; original: string }> = [];
    for (const item of huntCases) {
      for (const error of item.errors) {
        if (error.correction.trim() === error.original.trim()) {
          noOp.push({ caseId: item.id, tokenIndex: error.tokenIndex, original: error.original });
        }
      }
    }
    expect(
      noOp,
      `这些植错点「修正后与原词相同」——用户找出来了却看不到改什么：${JSON.stringify(noOp)}`
    ).toEqual([]);
  });

  it("修正文案不得为空串（2026-09-20 已修：12 处删词型改为「（去掉）」）", () => {
    const empty: Array<{ caseId: string; tokenIndex: number; original: string }> = [];
    for (const item of huntCases) {
      for (const error of item.errors) {
        if (error.correction.trim() === "") {
          empty.push({ caseId: item.id, tokenIndex: error.tokenIndex, original: error.original });
        }
      }
    }
    expect(
      empty,
      `修正为空串会让界面渲染成「原词 → 」（用户看不到该改成什么）：${JSON.stringify(empty)}`
    ).toEqual([]);
  });

  // 空修正里只有一部分是真正的「删掉这个词」；其余是「换位 / 换形 + 删」的混合修正。
  // 混合修正的 UI 呈现是原词 → 空白（见 H2 的渲染断言），登记在此以便数据变更时被看见。
  it("删词型修正的讲解必须说清「去掉什么」（2026-09-20 新增：防止空修正复活）", () => {
    const vague: string[] = [];
    for (const item of huntCases) {
      for (const error of item.errors) {
        if (error.correction.trim() !== "（去掉）") continue;
        // 纯删词型（没有任何补充说明）才不合格；「（去掉 to）」这类带对象的不算
        if (!/去掉|不垫|多余的|不跟|不用|对调/.test(error.explanation)) {
          vague.push(`${item.id}#${error.tokenIndex} "${error.original}"`);
        }
      }
    }
    expect(vague, `删词型错误但讲解没说清怎么改：${vague.join(" | ")}`).toEqual([]);
  });

  it("每个事故点都能被 judgeGuess 以正确 tag 判为 hit（判定诚实性，全库）", () => {
    const failures: string[] = [];
    for (const item of huntCases) {
      for (const error of item.errors) {
        const verdict = judgeGuess(item, error.tokenIndex, error.tag as GrammarErrorTag, []);
        if (verdict.kind !== "hit") failures.push(`${item.id} idx=${error.tokenIndex} => ${verdict.kind}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("每个案件的每个干净词块都被判为 notError（不会出现「点对了却判错」）", () => {
    const failures: string[] = [];
    for (const item of huntCases) {
      const errorIndexes = new Set(item.errors.map((error) => error.tokenIndex));
      for (let index = 0; index < item.tokens.length; index += 1) {
        if (errorIndexes.has(index)) continue;
        const verdict = judgeGuess(item, index, "tense", []);
        if (verdict.kind !== "notError") failures.push(`${item.id} idx=${index} => ${verdict.kind}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("课程引用的案件 id 全部存在（无悬挂引用）", () => {
    const ids = new Set(huntCases.map((item) => item.id));
    const dangling = grammarLessons.flatMap((lesson) => lesson.huntCaseIds.filter((id) => !ids.has(id)));
    expect(dangling).toEqual([]);
  });

  // ── 已知问题 P6：罪名词表不唯一 ─────────────────────────
  // 页面罪名按钮用 Object.keys(GRAMMAR_ERROR_TAG_LABELS)（11 个，含 comparison），
  // 而日记批改的 tag 白名单用 GRAMMAR_ERROR_TAGS（10 个，不含 comparison）——
  // 同一份「语法错误类型」有两处来源，比较级在日记侧永远无法归因。
  it("罪名词表单一来源（2026-09-20 已修：TAGS 从 LABELS 派生）", () => {
    const labelKeys = Object.keys(GRAMMAR_ERROR_TAG_LABELS);
    expect(GRAMMAR_ERROR_TAGS.slice().sort()).toEqual(labelKeys.slice().sort());
  });

  it("[已知问题] comparison 罪名按钮存在但无任何案件使用（点了只会得到「这里确实有问题，但不是比较级」）", () => {
    const used = new Set(huntCases.flatMap((item) => item.errors.map((error) => error.tag)));
    expect(used.has("comparison" as GrammarErrorTag)).toBe(false);
    // 但页面上确实会渲染这个按钮（见 H2 的罪名按钮快照断言）
    expect(Object.keys(GRAMMAR_ERROR_TAG_LABELS)).toContain("comparison");
    console.log("[H1] 全库未被使用的 tag：", Object.keys(GRAMMAR_ERROR_TAG_LABELS).filter((tag) => !used.has(tag as GrammarErrorTag)));
  });

  it("零进度下每个锁定案都指得出「学完第几课解锁」", () => {
    const data = seedAppData();
    const infos = listHuntCasesWithLock(data);
    const noPath = infos
      .filter((info) => !info.unlocked && !info.unlockLesson)
      .map((info) => info.caseItem.id);
    // 番外案（未被课程引用）无 unlockLesson 是设计如此：整体挂第 12 课档位。
    const extras = new Set([
      "hunt-white-cat",
      "hunt-sports-day",
      "hunt-pen-pal-letter",
      "hunt-fridge-note",
      "hunt-term-review"
    ]);
    expect(noPath.filter((id) => !extras.has(id))).toEqual([]);
    expect(extras.size).toBeGreaterThan(0);
  });
});
