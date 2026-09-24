// @vitest-environment node
/**
 * EX1 · 考试判分口径（M1 出口判据）
 *
 * 规格：`deliverables/product-strategy/prd-grammar-season-final-exam-2026-09-24.md`
 *   §4.5 判分口径 ｜ §12.1 G7 ｜ §13 M1 出口判据「20 条真实手写句误判率 = 0」
 *
 * 这份用例存在的唯一理由：**一个会误判的判分器会让整个功能在用户视角失效**。
 * 依据是产品负责人唯一一次为判错公开发声——「有些单词明明开头结尾都可以放，但是现在是
 * 强制我放在哪里，我句子又没错」（`IMPLEMENTATION_NOTES.md:4453`），而那次**他完全正确**。
 * 所以这里同时锁两个方向：
 *   ① 正解变体不许判错（误判＝他把功能关掉）
 *   ② 真错答不许判对（放水＝考试失去意义）
 *
 * 三类偏差取自他真实会犯的类型：状语移位、相邻词块换序、三单漏 s。
 */
import { describe, expect, it } from "vitest";
import {
  EXAM_ZH2EN_PASS_SCORE,
  judgeExamChoice,
  judgeExamCloze,
  judgeExamZh2En
} from "../../services/grammarExamService";
import { BOOST_PRODUCE_PASS_SCORE, BOOST_RECALL_PASS_SCORE } from "../../services/grammarBoostService";
import { FREE_TYPE_PASS_SCORE } from "../../services/grammarReviewService";

/** 基准句全部取自第 1 季（L1–L12）真实课内素材。 */
const BASE = {
  am: "I am happy.",
  nurse: "She is a nurse.",
  pen: "I have a pen.",
  apple: "I want an apple.",
  dogs: "I like dogs.",
  students: "They are students.",
  book: "This is my book.",
  school: "I go to school every day.",
  park: "Yesterday I went to the park.",
  books: "I bought three books.",
  draw: "I will draw tomorrow.",
  reading: "She is reading.",
  cold: "It is cold today.",
  mine: "This book is mine."
};

describe("EX1 考试判分：正解变体不许判错（① 误判率必须为 0）", () => {
  it("20 条真实手写句：全部判「稳住」", () => {
    const cases: Array<{ name: string; input: string; answer: string; acceptAlso?: string[] }> = [
      // 完全一致（6 条）
      { name: "原句 L1", input: "I am happy.", answer: BASE.am },
      { name: "原句 L2", input: "She is a nurse.", answer: BASE.nurse },
      { name: "原句 L5", input: "I like dogs.", answer: BASE.dogs },
      { name: "原句 L8", input: "This is my book.", answer: BASE.book },
      { name: "原句 L11", input: "I bought three books.", answer: BASE.books },
      { name: "原句 L13", input: "She is reading.", answer: BASE.reading },
      // 状语移位（4 条）——他公开胜诉过的那一类
      { name: "状语后移", input: "I went to the park yesterday.", answer: BASE.park },
      { name: "状语前移", input: "Every day I go to school.", answer: BASE.school },
      { name: "状语后移 L12", input: "I will draw tomorrow.", answer: BASE.draw },
      { name: "状语前移 L12", input: "Tomorrow I will draw.", answer: BASE.draw },
      // 大小写 / 标点 / 多重空格（5 条）
      { name: "首字母小写", input: "she is a nurse.", answer: BASE.nurse },
      { name: "全小写", input: "i am happy.", answer: BASE.am },
      { name: "缺句点", input: "I have a pen", answer: BASE.pen },
      { name: "多重空格", input: "I  want   an apple.", answer: BASE.apple },
      { name: "句末多余空格", input: "They are students. ", answer: BASE.students },
      // 缩写等价（3 条）
      { name: "缩写等价 It's", input: "It's cold today.", answer: BASE.cold },
      { name: "缩写在答案侧", input: "It is cold today.", answer: "It's cold today." },
      { name: "缩写等价 She's", input: "She's reading.", answer: BASE.reading },
      // 多解 acceptAlso（2 条）
      {
        name: "多解 L112 另一说法",
        input: "This one is mine.",
        answer: BASE.mine,
        acceptAlso: ["This one is mine."]
      },
      {
        name: "多解 L175 So am I",
        input: "So am I.",
        answer: "So do I.",
        acceptAlso: ["So am I."]
      },
      // 复合：小写 + 逗号 + 状语后移（1 条，最接近真实手写）
      { name: "小写逗号状语后移", input: "yesterday, i went to the park.", answer: BASE.park }
    ];

    const failures: string[] = [];
    for (const item of cases) {
      const result = judgeExamZh2En(item.input, item.answer, item.acceptAlso ?? []);
      console.log(
        `${item.name.padEnd(18)} passed=${String(result.passed).padEnd(5)} score=${String(result.score).padEnd(4)} input="${item.input}"`
      );
      if (!result.passed) failures.push(`${item.name}：「${item.input}」→ ${result.score} 分（基准「${item.answer}」）`);
    }
    expect(cases.length, "抽样条数必须 ≥20").toBeGreaterThanOrEqual(20);
    expect(failures, `这些正解被判错（误判率必须为 0）：\n${failures.join("\n")}`).toEqual([]);
  });
});

describe("EX1 考试判分：真错答不许判对（② 不放水）", () => {
  it("语法错、语序错、错词、空答一律判「还漏」", () => {
    const cases: Array<{ name: string; input: string; answer: string }> = [
      // 三单漏 s
      { name: "三单漏 s", input: "She go to school every day.", answer: BASE.school },
      { name: "三单漏 s（be）", input: "She are a nurse.", answer: BASE.nurse },
      { name: "三单漏 s（have）", input: "He have a pen.", answer: BASE.pen },
      // 语序错（中间位置的副词绝不能算「状语自由」）
      { name: "副词位置错", input: "She always is happy.", answer: "She is always happy." },
      { name: "词块换序错", input: "I to school go every day.", answer: BASE.school },
      // 缺/多 be 动词
      { name: "缺 be 动词", input: "I happy.", answer: BASE.am },
      { name: "多 be 动词", input: "I am like dogs.", answer: BASE.dogs },
      // 错词 / 错形
      { name: "错词", input: "I like cats.", answer: BASE.dogs },
      { name: "错动词形", input: "I buyed three books.", answer: BASE.books },
      { name: "错代词", input: "This is my book.", answer: "That is my book." },
      // 空答与噪声
      { name: "空答", input: "", answer: BASE.am },
      { name: "空白", input: "   ", answer: BASE.am },
      { name: "完全无关", input: "Hello world.", answer: BASE.am }
    ];

    const falsePositives: string[] = [];
    for (const item of cases) {
      const result = judgeExamZh2En(item.input, item.answer);
      console.log(
        `${item.name.padEnd(16)} passed=${String(result.passed).padEnd(5)} score=${String(result.score).padEnd(4)} input="${item.input}"`
      );
      if (result.passed) falsePositives.push(`${item.name}：「${item.input}」被判过（${result.score} 分）`);
    }
    expect(falsePositives, `这些错答被判对（放水）：\n${falsePositives.join("\n")}`).toEqual([]);
  });

  it("状语移位与「副词该在 is 后」的边界不被混淆", () => {
    // 允许：首尾状语换位置
    expect(judgeExamZh2En("Yesterday I went to the park.", BASE.park).passed).toBe(true);
    // 不允许：中间位置的副词错位（真实语序错误，不是「状语自由」）
    expect(judgeExamZh2En("I always am happy.", "I am always happy.").passed).toBe(false);
  });

  /**
   * 拼写偏差的边界：**实测值，不是误判**，且是可解释的（不是玄学）。
   *
   * 实测（见用例内断言）：
   *   - 删 1 个字母 `schol`  / 错 1 个字母 `schook` → `spelling` 状态 → 半分 → 92 分 → **过线**
   *   - 相邻字母换序 `shcool` → `substitution` 状态 → 0 分 → 83 分 → **不过线**
   *
   * 成因是 `diffService.isNearSpelling` 的容错规则：`edits === 1 || edits / maxLen <= 0.25`。
   * 换序的 Levenshtein 距离是 **2**，`2 / 6 = 0.33 > 0.25`，所以拿不到那半分。同一类偏差在
   * 6 词句与 8 词句里结论一致（都是不过），**不存在「长句就放过」的不一致**。
   *
   * 这是一个**取舍**，需要产品负责人拍板：
   *   - 维持现状：换序型拼错判「还漏」（真实考试对拼写扣分），1-edit 型宽松放行。
   *   - 或统一：都不扣（这是**语法**考试，拼写不是本季考点，且他对误判零容忍
   *     ——`IMPLEMENTATION_NOTES.md:4453`）。
   *
   * 本用例只锁当前实测行为。若裁决改为「拼写一律不扣」，改这里并同步
   * `EXAM_ZH2EN_PASS_SCORE` 的口径说明——**不要**偷偷放宽整条通过线，
   * 那会把三单漏 s、错词这些真错误一起放过去（见上面「真错答不许判对」）。
   */
  it("【已测定的边界】拼写偏差：1-edit 过线、换序不过线（取舍待产品负责人裁决）", () => {
    // 1-edit：半分 → 过线
    const deleted = judgeExamZh2En("I go to schol every day.", BASE.school);
    expect(deleted.score).toBeGreaterThanOrEqual(EXAM_ZH2EN_PASS_SCORE);
    expect(deleted.passed, "删/错 1 个字母属 spelling 状态，拿半分后过线").toBe(true);
    // 换序：0 分 → 不过线（Levenshtein 2，拿不到 spelling 的半分）
    const swapped = judgeExamZh2En("I go to shcool every day.", BASE.school);
    expect(swapped.score).toBeLessThan(EXAM_ZH2EN_PASS_SCORE);
    expect(swapped.passed, "相邻字母换序是 substitution 状态，零分").toBe(false);
    // 两类偏差在更长的句子里结论不变——不存在「长句放水」
    const longBase = "I go to school with my friends every day.";
    expect(judgeExamZh2En("I go to schol with my friends every day.", longBase).passed).toBe(true);
    expect(judgeExamZh2En("I go to shcool with my friends every day.", longBase).passed).toBe(false);
  });
});

describe("EX1 判分口径与 AI 边界（G7 / P0-0c）", () => {
  it("考试通过线 = 90，且独立于存量三条线（不改存量属红线⑩ Non-goal 8）", () => {
    expect(EXAM_ZH2EN_PASS_SCORE).toBe(90);
    // 存量三条线原样：本功能不得改它们（若未来统一，那是 PRD Q11 的独立决策）
    expect(BOOST_PRODUCE_PASS_SCORE).toBe(90);
    expect(BOOST_RECALL_PASS_SCORE).toBe(70);
    expect(FREE_TYPE_PASS_SCORE).toBe(90);
  });

  it("G7：判分层不得 import 任何 AI 模块（客观题 AI 零参与）", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(new URL("../../services/grammarExamService.ts", import.meta.url), "utf8")
    );
    // 只看 import 语句——注释里引用红线原文是允许的，禁令针对的是真实依赖。
    const importLines = source.split("\n").filter((line) => /^\s*(import|export)\b.*\bfrom\b/.test(line));
    const dynamicImports = source.split("\n").filter((line) => /\bimport\s*\(/.test(line));
    const banned = ["aiHttpClient", "postChatCompletion", "modelService", "grammarBoostAiService", "adventureModelService"];
    for (const name of banned) {
      expect(
        importLines.some((line) => line.includes(name)) || dynamicImports.some((line) => line.includes(name)),
        `判分层不得 import AI 模块：${name}`
      ).toBe(false);
    }
    // 正向对照：判分层该引的是确定性判分链
    expect(importLines.some((line) => line.includes("diffService"))).toBe(true);
    expect(importLines.some((line) => line.includes("lessonService"))).toBe(true);
  });

  it("判分层的用户可见文案只用「稳住 / 还漏」，不出现裁决词（PRD §4.5 呈现口径）", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(new URL("../../services/grammarExamService.ts", import.meta.url), "utf8")
    );
    // 只看代码行——注释里引用 PRD 红线原文与历史缺陷描述是允许的
    const codeLines = source
      .split("\n")
      .filter((line) => !/^\s*(\*|\/\/|\/\*)/.test(line));
    const verdictWords = ["正确", "错误", "得分", "通过"];
    for (const word of verdictWords) {
      expect(
        codeLines.some((line) => line.includes(`"${word}`) || line.includes(`「${word}`)),
        `判分层的用户可见文案不得出现裁决词「${word}」`
      ).toBe(false);
    }
  });

  it("判定与分数永不矛盾：`passed === (score >= 90)` 对三种题型恒成立", () => {
    // 中译英：含「等价放行但相似度为 0/60」的两条——这正是会把不变量撑破的输入
    const zh2en: Array<[string, string]> = [
      ["Every day I go to school.", "I go to school every day."],
      ["Tomorrow I will draw.", "I will draw tomorrow."],
      ["I went to the park yesterday.", "Yesterday I went to the park."],
      ["She go to school every day.", "I go to school every day."],
      ["", "I am happy."],
      ["I am happy.", "I am happy."]
    ];
    for (const [input, answer] of zh2en) {
      const r = judgeExamZh2En(input, answer);
      expect(
        r.passed,
        `等价放行必须把分数抬到线上，不得出现 {passed:true, score:${r.score}}：input="${input}"`
      ).toBe(r.score >= EXAM_ZH2EN_PASS_SCORE);
    }
    // 选择 / 填空同样满足
    for (const r of [judgeExamChoice("b", "b"), judgeExamChoice("a", "b"), judgeExamCloze("am", "am"), judgeExamCloze("is", "am")]) {
      expect(r.passed).toBe(r.score >= EXAM_ZH2EN_PASS_SCORE);
    }
  });

  it("选择题与填空题：确定性精确比对，不做近似容错", () => {
    expect(judgeExamChoice("b", "b").passed).toBe(true);
    expect(judgeExamChoice("a", "b").passed).toBe(false);
    expect(judgeExamChoice("", "b").passed).toBe(false);

    expect(judgeExamCloze("am", "am").passed).toBe(true);
    expect(judgeExamCloze("AM", "am").passed).toBe(true);
    expect(judgeExamCloze("is", "am").passed).toBe(false);
    expect(judgeExamCloze("", "am").passed).toBe(false);
    // 选择题的干扰项按易混设计——容错会把干扰项放过
    expect(judgeExamChoice("is", "am").passed).toBe(false);
  });
});
