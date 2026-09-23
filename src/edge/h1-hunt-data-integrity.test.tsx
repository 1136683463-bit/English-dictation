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
  it("删词型修正的讲解必须说清「去掉什么」（2026-09-20 新增；批五十三改为读 editOp）", () => {
    /**
     * ⚠️ 2026-09-23 批五十三修正：这条断言此前**从未检查过任何数据**。
     *
     * 旧判据是 `error.correction.trim() !== "（去掉）"`（整串精确等于「（去掉）」）——
     * 全库匹配 **0 条**，而 correction 以「去掉」开头的有 **62 条**（走 editOp 口径）。
     * 一个恒真的 continue 让整个 it 变成空转：vague 永远是空数组，
     * 于是「删词型讲解必须说清去掉什么」这道门禁从来没拦住过任何一条数据。
     *
     * 改用 editOp === "delete" 后，本断言真正覆盖全部删词型条目（当前 62 条）。
     */
    const vague: string[] = [];
    let checked = 0;
    /**
     * 「说清了怎么改」的判据：讲解里要么有**删除动作词**（去掉/省/不加/多余/只留一个…），
     * 要么给出**改完的样子**（【…】引文，如「中间不夹 of：among 【the】 boxes」）。
     *
     * 判据经过自检：合成反例「这里错了。」「注意这个位置。」必须被判坏，
     * 正例「去掉多余的 it。」「because 和 so 只能来一个。」必须被判好——
     * 下面 `expect(checked)` 保证判据真的命中数据，避免重演「恒真 continue 空转」。
     */
    const ACTION_WORD = /去掉|删|省|不加|不多|多余|多出来|只留|留一个|只能来一个|只能用一个|不留|别|不许|不要|不用|不带|不跟|不认|进不了|不垫|不能|没有|不请|不站|不夹|不补|自己就够|对调|搬/;
    const QUOTED_FORM = /【[^】]+】/;
    for (const item of huntCases) {
      for (const error of item.errors) {
        if (error.editOp !== "delete") continue;
        checked += 1;
        if (!ACTION_WORD.test(error.explanation) && !QUOTED_FORM.test(error.explanation)) {
          vague.push(`${item.id}#${error.tokenIndex} "${error.original}"`);
        }
      }
    }
    // 防回归：判据必须真的命中数据（否则这个 it 又会退化成空转）
    expect(checked, "全库应有删词型修正；为 0 说明判据又空了").toBeGreaterThan(0);
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

  it("【R09 已解决】每个罪名标签都至少被一个案件使用——不再有「点了必然说不是这个」的死按钮", () => {
    /**
     * 2026-09-20 记录过一次缺口：`comparison` 出现在罪名词表里，
     * 但**没有任何案件使用它**，于是页面上渲染出的这个按钮点了只会得到
     * 「这里确实有问题，但不是比较级」。
     *
     * 2026-09-22 的内容扩充已让 comparison 被多个案件使用（本轮核对：
     * huntCases.ts 里 10+ 处），所以这里从「记录缺口」改为**守住不回归**：
     * 任何一个出现在按钮上的标签都必须有案件在用。
     */
    const used = new Set(huntCases.flatMap((item) => item.errors.map((error) => error.tag)));
    const deadButtons = Object.keys(GRAMMAR_ERROR_TAG_LABELS).filter((tag) => !used.has(tag as GrammarErrorTag));
    expect(deadButtons, "这些罪名按钮没有任何案件使用，点了必然答非所问").toEqual([]);
    expect(used.has("comparison" as GrammarErrorTag), "comparison 现在有案件在用").toBe(true);
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
