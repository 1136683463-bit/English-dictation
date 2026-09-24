// @vitest-environment node
/**
 * EX2 · 季末卷内容守门（P0-8）
 *
 * 规格：`deliverables/product-strategy/prd-grammar-season-final-exam-2026-09-24.md` §8.2
 *   §13 M1 出口判据「三条守门全绿」
 *
 * 三条守门（任一失败 = 构建失败）：
 *   ① 用词 ⊆ 第 1 季已教词（**不与 core100Words 取并集**，见 guard 模块头部的实测更正）
 *   ② 句型 ⊆ 本季已教句型（禁 be+动词形式、have/has+过去分词）
 *   ③ 短文不得逐字包含本卷任何中译英答案句
 *
 * 为什么这三条是硬门而不是「尽量」：短文是新写的，面向的是第 1 季零基础学习者。
 * 混进一个没教过的词，用户就会把「看不懂」归因为「语法难」（`GRAMMAR_PEDAGOGY_REVIEW.md:88`），
 * 季末收束变成一次劝退。这也是内容审计「题干-答案错配」14 处的同一类风险。
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  buildTaughtWords,
  examContentViolations,
  tokenizeEnglish,
  zh2EnAnswerPool
} from "../../services/grammarExamContentGuard";
import { SEASON_1_COMPREHENSION, SEASON_1_PASSAGE, SEASON_1_WRITING } from "../../data/grammarExamPapers";
import { findZeroTermHits } from "../../data/grammarZeroTerms";

const SEASON_1 = { seasonMinLessonNumber: 1, seasonMaxLessonNumber: 12 };
const report = examContentViolations({
  passage: SEASON_1_PASSAGE,
  comprehension: SEASON_1_COMPREHENSION,
  writing: SEASON_1_WRITING,
  ...SEASON_1
});

describe("EX2 第 1 季季末卷内容守门", () => {
  it("守门① 用词全部落在本季已教词内（或已登记注释）", () => {
    const detail = report.wordsOutOfSeason
      .slice(0, 12)
      .map((v) => `${v.where} 出现未教词「${v.word}」：${v.sentence}`)
      .join("\n");
    expect(report.wordsOutOfSeason, `超出本季已教词的用词：\n${detail}`).toEqual([]);
  });

  it("守门② 句型全部落在本季已教句型内", () => {
    const detail = report.untaughSyntax
      .slice(0, 12)
      .map((v) => `${v.where} 出现未教句型「${v.pattern}」：${v.sentence}`)
      .join("\n");
    expect(report.untaughSyntax, `超出本季已教句型的用法：\n${detail}`).toEqual([]);
  });

  it("守门③ 短文不逐字包含任何中译英答案句（否则读短文就能抄答案）", () => {
    const detail = report.answerLeaks
      .slice(0, 12)
      .map((v) => `答案「${v.answer}」已出现在短文：${v.passageSentence}`)
      .join("\n");
    expect(report.answerLeaks, `答案泄漏：\n${detail}`).toEqual([]);
  });

  it("结构完整性：中英逐句对齐、四选一、答案在选项内、写作提示不含英文", () => {
    expect(report.shapeProblems, `结构问题：\n${report.shapeProblems.join("\n")}`).toEqual([]);
  });

  it("P0-9 新增的中文文案全部零术语（与课程守门同源，不另起第二份词表）", () => {
    const texts: Array<[string, string]> = [
      ["passage.titleZh", SEASON_1_PASSAGE.titleZh],
      ...SEASON_1_PASSAGE.zhSentences.map(
        (text, index): [string, string] => [`passage.zhSentences[${index}]`, text]
      ),
      ...SEASON_1_COMPREHENSION.flatMap((question): Array<[string, string]> => [
        [`${question.id}.promptZh`, question.promptZh],
        ...question.options.map((option): [string, string] => [`${question.id}/${option.id}.zh`, option.zh])
      ]),
      ["writing.promptZh", SEASON_1_WRITING.promptZh],
      ...SEASON_1_WRITING.points.map((text, index): [string, string] => [`writing.points[${index}]`, text]),
      ...SEASON_1_WRITING.keywords.map((text, index): [string, string] => [`writing.keywords[${index}]`, text])
    ];
    const offenders = texts.flatMap(([where, text]) =>
      findZeroTermHits(text).map((term) => `${where} 出现语法术语「${term}」：${text}`)
    );
    expect(offenders, `新增文案混入术语：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("短文规模符合 PRD §8.1 规格（6–10 句 / 120–150 词 / 生词 ≤2）", () => {
    const words = SEASON_1_PASSAGE.sentences.flatMap((sentence) => tokenizeEnglish(sentence));
    expect(SEASON_1_PASSAGE.sentences.length, "句数应在 6–10 之间").toBeGreaterThanOrEqual(6);
    expect(SEASON_1_PASSAGE.sentences.length).toBeLessThanOrEqual(10);
    expect(words.length, "词数应在 120–150 之间").toBeGreaterThanOrEqual(120);
    expect(words.length).toBeLessThanOrEqual(150);
    expect(SEASON_1_PASSAGE.notes.length, "未登录生词上限 2 个").toBeLessThanOrEqual(2);
  });

  it("阅读理解配比：2 细节 + 1 推断 + 1 主旨（PRD §4.2④）", () => {
    const count = (kind: string) => SEASON_1_COMPREHENSION.filter((q) => q.kind === kind).length;
    expect(count("detail")).toBe(2);
    expect(count("inference")).toBe(1);
    expect(count("mainIdea")).toBe(1);
    expect(SEASON_1_COMPREHENSION.length).toBe(4);
  });

  it("守门不是空转：注入坏内容必须被抓到（反向对照）", () => {
    // 未教词 + 被动语态 + 逐字抄答案，三种都应被抓
    const poisoned = {
      passage: {
        ...SEASON_1_PASSAGE,
        sentences: ["The bag was bought by my brother.", "I am happy."],
        zhSentences: ["背包是哥哥买的。", "我很开心。"]
      },
      comprehension: SEASON_1_COMPREHENSION,
      writing: SEASON_1_WRITING,
      ...SEASON_1
    };
    const bad = examContentViolations(poisoned);
    expect(bad.wordsOutOfSeason.length, "未教词 by 应被抓").toBeGreaterThan(0);
    expect(bad.untaughSyntax.length, "被动 was bought 应被抓").toBeGreaterThan(0);
  });

  it("已教词集合的规模与关键更正可复核（不与学术词表取并集）", () => {
    const taught = buildTaughtWords(12);
    // 第 1 季已教词实测 185 个（严格口径）
    expect(taught.size).toBeGreaterThan(150);
    // 正确的过去式在表内
    for (const good of ["went", "ate", "drank", "saw", "met", "drew", "bought"]) {
      expect(taught.has(good), `已教词应含正确形式 ${good}`).toBe(true);
    }
    // 故意写错的形式必须**不在**表内（否则守门反而放行错形）
    for (const bad of ["haves", "eated", "sandwichs", "buyed", "wills"]) {
      expect(taught.has(bad), `已教词不得含错误形式 ${bad}`).toBe(false);
    }
    // 学术词表里的词不得被当作零基础词
    for (const academic of ["analyze", "constitute", "distinguish", "achieve"]) {
      expect(taught.has(academic), `学术词 ${academic} 不应出现在第 1 季已教词里`).toBe(false);
    }
  });

  it("中译英题源池非空且都是完整句（翻译题不能取自单字答案）", () => {
    const pool = zh2EnAnswerPool(12, 1);
    expect(pool.length).toBeGreaterThan(30);
    const tooShort = pool.filter((answer) => tokenizeEnglish(answer).length < 3);
    expect(tooShort, `题源池里出现过短的「句子」：${tooShort.slice(0, 5).join(" / ")}`).toEqual([]);
  });
});

/**
 * P0-9 的另一半：**考试页自身的用户可见文案**也要过零术语与文案纪律。
 *
 * 此前只覆盖了内容资产（短文 / 题干 / 写作提示），页面文案没人管——
 * 而页面文案恰恰是「承诺」所在的地方。第一次跑这条闸就抓到一个真问题：
 * 结果页原写「这几处已经排进你的复习队列，明天会再见到它们」，
 * 但**错题回流 SM-2 是 P1-2，本批边界明确写了不做**（PRD §13）。
 * 文案承诺了不存在的行为，用户去复习页找不到，信任就没了。
 *
 * 注意：扫描前**必须剥掉注释**——否则警示注释里引用的禁用词会自己触发告警。
 */
describe("EX2 考试页文案纪律（P0-9 页面侧）", () => {
  /** 剥掉块注释与行注释后，取出所有含中文的片段（字符串字面量与 JSX 文本都会落进来）。 */
  const pageCopy = (): string[] => {
    const raw = readFileSync(new URL("../../pages/GrammarExamPage.tsx", import.meta.url), "utf8");
    const noBlock = raw.replace(/\/\*[\s\S]*?\*\//g, "");
    const code = noBlock
      .split("\n")
      .filter((line) => !line.trim().startsWith("//"))
      .join("\n");
    const segments = code.match(/[^\n]*[\u4e00-\u9fff][^\n]*/g) ?? [];
    return [...new Set(segments.map((text) => text.trim()))];
  };

  it("闸不是空转：确实提取到了页面文案，且禁用检查能命中「已实现」的坏例", () => {
    const copy = pageCopy();
    // 提取不到文案时，下面四条断言会全绿却什么都没检查——先堵死这个失败模式
    expect(copy.length, "应提取到足量中文文案片段（正则失效会让整组用例空转）").toBeGreaterThan(20);
    expect(copy.some((text) => text.includes("稳住了")), "应包含结果页文案").toBe(true);
    // 反向对照：把已知违规文案喂进同一条检查链，必须被抓到
    expect(findZeroTermHits("这一句里有时态的错误").length, "零术语检查应能命中").toBeGreaterThan(0);
    expect(findZeroTermHits("这一季你稳住了 12 件事。").length, "正常文案不应命中").toBe(0);
  });

  it("零术语：页面文案不含任何语法术语（与课程守门同源）", () => {
    const offenders = pageCopy().flatMap((text) =>
      findZeroTermHits(text).map((term) => `出现术语「${term}」：${text.slice(0, 70)}`)
    );
    expect(offenders, `考试页文案混入术语：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("不出现裁决词（界面口径只有「稳住 / 还漏」）", () => {
    const offenders = pageCopy().filter((text) =>
      ["正确", "错误", "得分", "分数", "及格", "通过"].some((word) => text.includes(word))
    );
    expect(offenders, `考试页出现裁决词：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("不出现倒计时类措辞（无限时是红线，不是「还没做」）", () => {
    const offenders = pageCopy().filter((text) =>
      ["倒计时", "剩余时间", "限时", "计时"].some((word) => text.includes(word))
    );
    expect(offenders, `考试页出现倒计时措辞：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("承诺必须兑现：文案说「排进复习队列」，代码里就真的要有回流（P1-2 已落地）", () => {
    /**
     * 这条用例**翻过面**。原来它守的是「P1-2 没做，就不许写『会回到复习队列』」；
     * P1-2 落地后改为守「写了就必须有实现」——同一件事的两个方向。
     * 判据：页面文案只要出现「复习队列」，源文件里就必须真的调用回流函数。
     */
    const copy = pageCopy();
    const promises = copy.filter((text) => text.includes("复习队列"));
    if (promises.length === 0) return; // 不承诺也可以，那这条就不适用
    const raw = readFileSync(new URL("../../pages/GrammarExamPage.tsx", import.meta.url), "utf8");
    expect(
      raw.includes("queueExamMistakes"),
      `文案承诺了「复习队列」但页面没调用回流：\n${promises.join("\n")}`
    ).toBe(true);
  });
});
