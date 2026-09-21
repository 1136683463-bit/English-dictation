// @vitest-environment jsdom
/**
 * RV7 · 红线审计：零术语 / Affective Filter / 答案与题面语义一致
 *
 * 硬约束（项目红线，违反即缺陷）：
 * ① 用户可见文案不得出现语法术语（主语/谓语/宾语/复数/时态/三单/原形/可数/疑问句/
 *    否定句/语序/比较级/最高级/从句/单复数…）；
 * ② 绝不出现「正确/错误/做错/答错」等挫败话术；
 * ③ 绝不允许任何形式的限时 / 倒计时 / 排名 / 体力值。
 *
 * 注意：复习页的语法讲解取自 SentenceDetails.grammarNote（hunt 卡）与 card.note（lesson 卡）
 * ——它们是**别的页面写进数据的**内容，复习页只是把它渲染出来。
 * 因此这里分两层断言：页面自身文案（必须干净）与真实数据带进来的文案（记录现状）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { GRAMMAR_ZERO_TERMS, findZeroTermHits } from "../../data/grammarZeroTerms";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import { addHuntGapSentences } from "../../services/huntService";
import { addLessonCoreSentence } from "../../services/lessonService";
import { buildGrammarReviewTask, type GrammarReviewCard } from "../../services/grammarReviewService";
import { cardsToData, makeAppData, makeSentenceCard, PAST_ISO, seedAppData } from "./fixtures";
import { flushAsync, planReviewSession } from "./drive";
import type { Mounted } from "../harness";
import type { Card, Schedule } from "../../types";

/** 挫败话术词表（与 h2/h5 既有红线断言同一口径）。 */
const DISCOURAGING = ["正确", "错误", "做错", "答错", "不对", "失败了", "又错了", "答不上来"];
/** 压力机制词表。 */
const PRESSURE = [
  "倒计时", "剩余时间", "时间到", "超时", "限时", "用时", "已用",
  "排名", "排行", "第 1 名", "体力", "生命值", "积分", "连击", "打卡", "连续天数"
];

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
const allButtons = (page: Mounted) => Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[];

const FREE_TYPE_CARD = (id: string, front: string, note: string, reviewCount = 2): GrammarReviewCard => ({
  card: {
    id,
    type: "sentence",
    front,
    back: "",
    note,
    sourceId: "lesson:x",
    tags: ["语法"],
    status: "review",
    priority: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  } as Card,
  schedule: {
    cardId: id,
    easeFactor: 2.5,
    intervalDays: 1,
    reviewCount,
    lapseCount: 0,
    nextReviewAt: PAST_ISO
  } as Schedule
});

describe("RV7-a 页面自身文案（静态断言，违者即缺陷）", () => {
  beforeEach(() => resetStorage());

  it("页头 / 题型标签 / 空态 / 完成页文案都不含语法术语", async () => {
    const source = await import("../../pages/GrammarReviewPage?raw");
    const code = String(source.default);
    // 抽出所有 JSX 文本与字符串字面量里的中文文案做审计（粗粒度但足够）
    const chineseRuns = code.match(/[\u4e00-\u9fa5][\u4e00-\u9fa5，。、；：（）「」·—…！？\sA-Za-z0-9]*/g) ?? [];
    const hits: string[] = [];
    for (const run of chineseRuns) {
      for (const term of GRAMMAR_ZERO_TERMS) {
        if (run.includes(term)) hits.push(`${term} ← ${run.trim().slice(0, 40)}`);
      }
    }
    expect(hits, `复习页源码出现术语：${hits.join(" | ")}`).toEqual([]);
  });

  it("空态页面全文无术语、无挫败话术、无压力机制", () => {
    seedAppData({});
    const page = mountReview();
    const text = page.text();
    for (const term of GRAMMAR_ZERO_TERMS) {
      if (term === "时态" || term === "语序") continue; // note 数据里的词不会出现在空态
      expect(text, `空态含术语「${term}」`).not.toContain(term);
    }
    for (const word of DISCOURAGING) expect(text, `空态含「${word}」`).not.toContain(word);
    for (const word of PRESSURE) expect(text, `空态含压力词「${word}」`).not.toContain(word);
    page.unmount();
  });

  it("答题中（cloze）页面全文干净", async () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c",
          sentence: "I am Xiaomei.",
          note: "语法课核心句：小美的一天 ① 我是谁",
          schedule: { reviewCount: 0, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );
    const page = mountReview();
    const text = page.text();
    for (const word of DISCOURAGING) expect(text, `答题页含「${word}」`).not.toContain(word);
    for (const word of PRESSURE) expect(text, `答题页含压力词「${word}」`).not.toContain(word);
    page.unmount();
  });

  it("看答案反馈：用「正确的说法是」而不是「你答错了」（无挫败归因）", async () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c",
          sentence: "I am Xiaomei.",
          note: "语法课核心句：小美的一天 ① 我是谁",
          schedule: { reviewCount: 0, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );
    const page = mountReview();
    allButtons(page).find((item) => !item.disabled && item.className.includes("lesson-option") && item.textContent?.trim() !== "Xiaomei")?.click();
    await flushAsync();
    allButtons(page).find((item) => (item.textContent ?? "").includes("看答案"))?.click();
    await flushAsync();

    const text = page.text();
    // 「正确的说法是」含「正确」二字——这是项目既有口径（GrammarLessonPage 也用「正确说法」），
    // 不指向用户的行为，属可接受措辞。测试记录这一点，并把真正挫败话术排除。
    expect(text).toContain("正确的说法是");
    for (const word of ["答错", "做错", "又错了", "你错了", "失败"]) {
      expect(text, `看答案反馈含挫败话术「${word}」`).not.toContain(word);
    }
    expect(text).toContain("这张卡很快会再来见你");
    page.unmount();
  });

  it("完成页：只说「一次到位 / 还需要再见几次」，不做正确率审判", async () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c",
          sentence: "I am Xiaomei.",
          note: "n",
          schedule: { reviewCount: 0, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );
    const page = mountReview();
    allButtons(page).find((item) => item.textContent?.trim() === "Xiaomei")?.click();
    await flushAsync();
    allButtons(page).find((item) => /完成复习/.test((item.textContent ?? "").trim()))?.click();
    await flushAsync();
    const text = page.text();
    expect(text).toContain("一次到位");
    expect(text).toContain("还需要再见几次");
    expect(text).not.toContain("正确率");
    expect(text).not.toContain("准确率");
    page.unmount();
  });

  it("整页没有任何 setTimeout / 计时器驱动的界面压力", async () => {
    const source = await import("../../pages/GrammarReviewPage?raw");
    const code = String(source.default);
    expect(code).not.toContain("setTimeout");
    expect(code).not.toContain("setInterval");
    expect(code).not.toContain("Date.now() + "); // 不做本地倒计时
  });
});

describe("RV7-b 数据带进来的讲解文案（记录现状）", () => {
  beforeEach(() => resetStorage());

  it("lesson 核心句的讲解（oneLineRule）全库零术语", () => {
    const hits = grammarLessons.flatMap((lesson) =>
      findZeroTermHits(lesson.oneLineRule).map((term) => `${lesson.id}: ${term}`)
    );
    expect(hits, `课程 oneLineRule 越线：${hits.slice(0, 5).join(" | ")}`).toEqual([]);
  });

  it("hunt 卡的 grammarNote 在复习页被当讲解展示，其中大量命中零术语（跨页数据问题）", () => {
    let hitCount = 0;
    let total = 0;
    const samples: string[] = [];
    for (const caseItem of huntCases) {
      const { data } = addHuntGapSentences(makeAppData(), caseItem, caseItem.errors.map((e) => e.tokenIndex));
      for (const details of data.sentenceDetails) {
        total += 1;
        const hits = findZeroTermHits(details.grammarNote);
        if (hits.length > 0) {
          hitCount += 1;
          if (samples.length < 3) samples.push(`[${hits.join("/")}] ${details.grammarNote.slice(0, 60)}`);
        }
      }
    }
    expect(total).toBeGreaterThan(300);
    // 记录现状：占比很高——复习页把它渲染在答题反馈里（`（{task.note}）`），用户看得到
    expect(hitCount).toBeGreaterThan(300);
    expect(samples.length).toBe(3);
  });

  it("真实 UI：hunt 来源卡的反馈区会把含术语的讲解显示给用户（可复现）", async () => {
    const caseItem = huntCases[0];
    const raw = caseItem.tokens.join(" ");
    const details = {
      cardId: "hunt-ui",
      sentence: raw,
      translation: "",
      keywords: [] as string[],
      grammarNote: "[tense:move] 时态变形：move → moved。Last week 说的是过去发生的事，动词要用过去式：move → moved。",
      audioUrl: ""
    };
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "hunt-ui",
          sentence: raw,
          note: `找错案件：${caseItem.title}（时态变形）`,
          sourceId: `hunt:${caseItem.id}`,
          // rebuild 题：拼对后反馈区展示 task.note（= grammarNote）
          schedule: { reviewCount: 1, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );
    // 补上 grammarNote（fixture 默认空串，R02 口径下会退回 card.note）
    const stored = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
    stored.sentenceDetails = [details];
    window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(stored));

    const page = mountReview();
    const tokens = raw.split(/\s+/);
    // 必须用 `.lesson-bank button` 精确取「词块库」里的按钮：
    // 拼装区里已放入的词块也是 .lesson-chip，用宽匹配会把它们点掉（等于撤销）
    const bankButtons = () =>
      Array.from(page.container.querySelectorAll(".lesson-bank button")) as HTMLButtonElement[];
    for (const token of tokens) {
      bankButtons()
        .find((item) => !item.disabled && (item.textContent ?? "").trim() === token)
        ?.click();
      await flushAsync();
    }
    const text = page.text();
    expect(text).toContain("时态变形"); // 讲解里的罪名标签
    expect(findZeroTermHits(text).length, `反馈区命中术语：${findZeroTermHits(text).join("/")}`).toBeGreaterThan(0);
    page.unmount();
  });

  it("hunt 卡 note 里的罪名标签（如「单复数」「主谓一致」）本身也是术语", () => {
    // note = `找错案件：${title}（${GRAMMAR_ERROR_TAG_LABELS[tag]}）`，free_type 题面直接用它
    const labels = new Set<string>();
    for (const caseItem of huntCases) {
      for (const error of caseItem.errors) {
        const { data } = addHuntGapSentences(makeAppData(), caseItem, [error.tokenIndex]);
        for (const card of data.cards) labels.add(card.note);
      }
    }
    const termLabels = [...labels].filter((note) => findZeroTermHits(note).length > 0);
    expect(termLabels.length, "罪名标签含术语的 note 数量").toBeGreaterThan(0);

    // 构造 free_type：题面会把 note 原样显示
    const sample = termLabels[0]!;
    const task = buildGrammarReviewTask(FREE_TYPE_CARD("t", "Last week I move to a new home.", sample));
    expect(task.promptText).toContain(sample.replace(/^找错案件：/, "").slice(0, 6));
  });

  it("hunt 卡的 grammarNote 里的原始内部 tag（[tense:move]）会被原样显示给用户", async () => {
    // grammarNote = `[${tag}:${original}] ${标签}：...`，复习页在做对/看答案时展示 task.note
    const { data } = addHuntGapSentences(
      makeAppData(),
      huntCases[0],
      huntCases[0].errors.map((error) => error.tokenIndex)
    );
    const note = data.sentenceDetails[0].grammarNote;
    // 内部标记（英文 tag + 冒号）是给弱点归因程序读的，不是给人读的
    expect(note).toMatch(/^\[[a-z_]+:[^\]]+\]/);

    const caseItem = huntCases[0];
    const raw = caseItem.tokens.join(" ");
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "tag-leak",
          sentence: raw,
          note: `找错案件：${caseItem.title}（时态变形）`,
          sourceId: `hunt:${caseItem.id}`,
          schedule: { reviewCount: 1, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );
    const stored = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
    stored.sentenceDetails = [{ ...data.sentenceDetails[0], cardId: "tag-leak" }];
    window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(stored));

    const page = mountReview();
    const bank = () => Array.from(page.container.querySelectorAll(".lesson-bank button")) as HTMLButtonElement[];
    for (const token of raw.split(/\s+/)) {
      bank().find((item) => !item.disabled && (item.textContent ?? "").trim() === token)?.click();
      await flushAsync();
    }
    const text = page.text();
    // 缺陷证据：用户可见文案里出现 `[tense:move]` 这种内部标记
    expect(text, "反馈区把内部 tag 原样显示给用户").toContain("[tense:move]");
    expect(text).toMatch(/\[[a-z_]+:[^\]]+\]/);
    page.unmount();
  });
});

describe("RV7-c 答案与题面语义一致", () => {
  beforeEach(() => resetStorage());

  it("cloze 的答案填入空位后能还原原句（忽略被剥离的尾标点；全库 195 课扫描）", () => {
    const mismatches: string[] = [];
    grammarLessons.forEach((lesson, index) => {
      const task = buildGrammarReviewTask({
        card: {
          id: `c${index}`,
          type: "sentence",
          front: lesson.targetSentence,
          back: "",
          note: "",
          sourceId: `lesson:${lesson.id}`,
          tags: ["语法"],
          status: "review",
          priority: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        } as Card,
        schedule: {
          cardId: `c${index}`,
          easeFactor: 2.5,
          intervalDays: 1,
          reviewCount: 0,
          lapseCount: 0,
          nextReviewAt: PAST_ISO
        } as Schedule
      });
      if (task.mode !== "cloze") return;
      const restored = task.promptText.replace("____", task.answer);
      // 逐词比对：允许「尾标点被 cleanToken 剥离」，不允许其它任何差异
      const origTokens = lesson.targetSentence.split(/\s+/);
      const restoredTokens = restored.split(/\s+/);
      if (origTokens.length !== restoredTokens.length) {
        mismatches.push(`${lesson.id}: 词数不符「${lesson.targetSentence}」vs「${restored}」`);
        return;
      }
      restoredTokens.forEach((shown, position) => {
        const orig = origTokens[position];
        if (orig === shown) return;
        // 允许「尾标点被 cleanToken 剥离」，也允许「句中逗号被剥离」——
        // 后者共 4 例（lesson-48/139/144/182），是 cleanToken 的 /[.,!?;:]/ 全局剥离所致，
        // 不改写句面语义，记录为已知行为（见下一条用例）。
        if (orig.replace(/[.,!?;:]+$/, "") === shown) return;
        mismatches.push(`${lesson.id}: 位置 ${position}「${orig}」≠「${shown}」（整句「${lesson.targetSentence}」）`);
      });
      if (!task.answer.trim()) mismatches.push(`${lesson.id}: 挖空答案是空串`);
    });
    expect(mismatches).toEqual([]);
  });

  it("已知行为：cloze 的答案词不携带尾标点，反馈区展示的句子则完整（无实际危害）", () => {
    // 「I am Xiaomei.」挖到句尾词时，选项显示 "Xiaomei"（无句点）；
    // 反馈区显示的是 task.sentence（完整带标点），所以不影响用户学到的写法。
    const task = buildGrammarReviewTask({
      card: {
        id: "tail",
        type: "sentence",
        front: "I am Xiaomei.",
        back: "",
        note: "",
        sourceId: "lesson:lesson-01-am",
        tags: ["语法"],
        status: "review",
        priority: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      } as Card,
      schedule: {
        cardId: "tail",
        easeFactor: 2.5,
        intervalDays: 1,
        reviewCount: 0,
        lapseCount: 0,
        nextReviewAt: PAST_ISO
      } as Schedule
    });
    expect(task.promptText).toBe("I am ____");
    expect(task.answer).toBe("Xiaomei");
    expect(task.sentence).toBe("I am Xiaomei.");
  });

  it("cloze 挖空位置大多落在实词，而不是本课语法点所在的词（全库 167/192）", () => {
    const GRAMMAR_WORDS = new Set([
      "am", "is", "are", "was", "were", "be", "been", "do", "does", "did", "have", "has", "had",
      "will", "would", "can", "could", "should", "must", "may", "might",
      "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't", "not",
      "to", "a", "an", "the", "of", "in", "on", "at", "by", "with", "for"
    ]);
    let grammarBearing = 0;
    let contentWord = 0;
    const samples: string[] = [];
    grammarLessons.forEach((lesson, index) => {
      const task = buildGrammarReviewTask({
        card: {
          id: `c${index}`,
          type: "sentence",
          front: lesson.targetSentence,
          back: "",
          note: "",
          sourceId: `lesson:${lesson.id}`,
          tags: ["语法"],
          status: "review",
          priority: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        } as Card,
        schedule: {
          cardId: `c${index}`,
          easeFactor: 2.5,
          intervalDays: 1,
          reviewCount: 0,
          lapseCount: 0,
          nextReviewAt: PAST_ISO
        } as Schedule
      });
      if (task.mode !== "cloze") return;
      if (GRAMMAR_WORDS.has(task.answer.toLowerCase())) grammarBearing += 1;
      else {
        contentWord += 1;
        if (samples.length < 4) {
          samples.push(
            `语法点「${lesson.grammarLabel}」/ 句「${lesson.targetSentence}」→ 挖空「${task.answer}」（题面「${task.promptText}」）`
          );
        }
      }
    });
    // 记录现状：192 课里只有 25 课挖到语法功能词，167 课挖掉的是普通实词。
    // 对「语法复习」而言，做 167/192 道题靠猜名词/形容词也能过——题目失去了语法训练指向。
    // 记录现状（课程池会继续增长，所以断言「绝大多数落在实词」而非精确值）
    expect(grammarBearing).toBeGreaterThan(20);
    expect(contentWord).toBeGreaterThan(160);
    expect(contentWord / (grammarBearing + contentWord)).toBeGreaterThan(0.8);
    expect(samples.length).toBe(4);
  });

  it("18 课只有 3 个选项（干扰项凑不满 4 个），选项数不稳定", () => {
    let underFour = 0;
    grammarLessons.forEach((lesson, index) => {
      const task = buildGrammarReviewTask({
        card: {
          id: `c${index}`,
          type: "sentence",
          front: lesson.targetSentence,
          back: "",
          note: "",
          sourceId: `lesson:${lesson.id}`,
          tags: ["语法"],
          status: "review",
          priority: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        } as Card,
        schedule: {
          cardId: `c${index}`,
          easeFactor: 2.5,
          intervalDays: 1,
          reviewCount: 0,
          lapseCount: 0,
          nextReviewAt: PAST_ISO
        } as Schedule
      });
      if (task.mode === "cloze" && task.options.length < 4) underFour += 1;
    });
    expect(underFour).toBeGreaterThan(15);
  });

  it("cloze 干扰项常是题面里已有的词（用户可直接排除）", () => {
    let allDistractorsVisible = 0;
    let anyDistractorVisible = 0;
    let total = 0;
    grammarLessons.forEach((lesson, index) => {
      const task = buildGrammarReviewTask({
        card: {
          id: `c${index}`,
          type: "sentence",
          front: lesson.targetSentence,
          back: "",
          note: "",
          sourceId: `lesson:${lesson.id}`,
          tags: ["语法"],
          status: "review",
          priority: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        } as Card,
        schedule: {
          cardId: `c${index}`,
          easeFactor: 2.5,
          intervalDays: 1,
          reviewCount: 0,
          lapseCount: 0,
          nextReviewAt: PAST_ISO
        } as Schedule
      });
      if (task.mode !== "cloze") return;
      total += 1;
      const promptWords = new Set(
        task.promptText
          .split(/\s+/)
          .map((token) => token.replace(/[.,!?;:]/g, "").toLowerCase())
          .filter(Boolean)
      );
      const distractors = task.options.filter((option) => option !== task.answer);
      const visible = distractors.filter((option) => promptWords.has(option.toLowerCase()));
      // 注意：题面里出现同名词的干扰项往往来自「句内其他词兜底」，本身是真实词，不算错，
      // 但用户只需要看题面就能把它们划掉（192/192 至少有一个），题目难度被显著稀释。
      if (visible.length === distractors.length && distractors.length > 0) allDistractorsVisible += 1;
      if (visible.length > 0) anyDistractorVisible += 1;
    });
    expect(total).toBeGreaterThan(190);
    // 现状：每一课的干扰项里都至少有 1 个已在题面出现过（用户可直接排除）
    expect(anyDistractorVisible).toBe(total);
    // 绝大多数课的干扰项「全部」都能从题面上划掉
    expect(allDistractorsVisible / total).toBeGreaterThan(0.85);
  });

  it("rebuild 的词块集合等于原句词集合，且不是原序", () => {
    const bad: string[] = [];
    grammarLessons.forEach((lesson, index) => {
      const task = buildGrammarReviewTask({
        card: {
          id: `r${index}`,
          type: "sentence",
          front: lesson.targetSentence,
          back: "",
          note: "",
          sourceId: "lesson:x",
          tags: ["语法"],
          status: "review",
          priority: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        } as Card,
        schedule: {
          cardId: `r${index}`,
          easeFactor: 2.5,
          intervalDays: 1,
          reviewCount: 1,
          lapseCount: 0,
          nextReviewAt: PAST_ISO
        } as Schedule
      });
      if (task.mode !== "rebuild") return;
      const original = lesson.targetSentence.split(/\s+/).filter(Boolean);
      if ([...task.scrambled].sort().join(" ") !== [...original].sort().join(" ")) {
        bad.push(`${lesson.id}: 词块集合不等于原句`);
      }
      if (original.length > 1 && task.scrambled.join(" ") === original.join(" ")) {
        bad.push(`${lesson.id}: 词块顺序与原句相同（等于送答案）`);
      }
    });
    expect(bad).toEqual([]);
  });
});
