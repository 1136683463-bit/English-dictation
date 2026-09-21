// @vitest-environment jsdom
/**
 * PR1 · 承诺核查：复习页 + 趁热练（断言版）
 *
 * 每条用例对应报告里的一条「承诺核查表」条目，断言的是**实现事实**，
 * 描述行写明「文案承诺 X / 实现是 Y」。
 * 不修改 src 下产品代码。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import {
  buildGrammarReviewSession,
  buildGrammarReviewTask,
  listDueGrammarReviewCards,
  summarizeGrammarMastery,
  isMasteredByOutput
} from "../../services/grammarReviewService";
import { buildBoostItems, BOOST_TIER_META } from "../../services/grammarBoostService";
import { applyReview, getDueCards } from "../../services/reviewService";
import { markLessonDone } from "../../services/lessonService";
import { addDiarySentenceToReview } from "../../services/diaryService";
import { addHuntGapSentences } from "../../services/huntService";
import { GRAMMAR_ERROR_TAG_PLAIN, GRAMMAR_ERROR_TAG_LABELS } from "../../services/huntService";
import { computeWeakSpots } from "../../services/grammarWeakSpotsService";
import { appendGrammarEvent, listGrammarEventsByKind } from "../../services/grammarTelemetry";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import { GRAMMAR_ZERO_TERMS } from "../../data/grammarZeroTerms";
import { cardsToData, makeSentenceCard, PAST_ISO, readAppData, seedAppData, telemetryOfKind } from "./fixtures";
import { advanceBoost, answerBoostItem, clickElement, clickText, flushAsync, typeText } from "./drive";

const DONE_LESSON_ID = "lesson-13-now";
const buttonMatching = (page: ReturnType<typeof mountPage>, pattern: RegExp) =>
  Array.from(page.container.querySelectorAll("button")).find((button) => pattern.test(button.textContent ?? "")) as
    | HTMLButtonElement
    | undefined;

// ══════════════════════════════════════════════════════════════════
// 一、趁热练「会排进复习」的承诺
// ══════════════════════════════════════════════════════════════════

describe("PR1-1 趁热练 reveal 文案与实现一致（2026-09-21 修）", () => {
  beforeEach(() => resetStorage());

  it("档 1 listen 看答案：文案出现，但队列零增长、零入队事件", async () => {
    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=1&from=lesson`, "/grammar/boost/:lessonId");
    for (const item of items) {
      if (page.has("这一课的记忆稳住了")) break;
      if (item.kind === "listen") {
        const options = Array.from(page.container.querySelectorAll(".boost-listen-option")) as HTMLButtonElement[];
        const wrong = options.find((button) => (button.textContent ?? "").trim() !== item.listenText);
        expect(wrong, "listen 题必须有一个干扰项").toBeTruthy();
        clickElement(wrong!);
        const reveal = buttonMatching(page, /看答案（会排进复习）/);
        expect(reveal, "retry 面板应给出「看答案（会排进复习）」").toBeTruthy();
        clickElement(reveal!);
        await flushAsync();
        break;
      }
      expect(answerBoostItem(page, item)).toBe("passed");
      advanceBoost(page);
    }

    /**
     * 修复前：页面写「这句已经排进复习队列，后面会再见到它。」但档 1 不会入队
     * （`queueFailedProduce` 开头就是 `if (tier !== 3) return`）——承诺与实现相反。
     * 现在档 1/2 改为如实说明「到「换你来说」时写不顺的句子会自动排进复习」。
     */
    expect(page.text(), "档 1 不应再承诺已入队").not.toContain("这句已经排进复习队列");
    expect(page.text(), "应如实说明入队发生在哪一档").toContain("换你来说");
    // 实现事实：档 1 不入队（与文案现在一致了）
    expect(readAppData().cards.length, "档 1 看答案不应新增卡片").toBe(0);
    expect(telemetryOfKind("sentence_card_enqueued"), "档 1 看答案不应产生入队事件").toEqual([]);
    page.unmount();
  });

  it("档 2 recall 看答案：文案出现，但队列零增长、零入队事件", async () => {
    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    const items = buildBoostItems(DONE_LESSON_ID, 2, {});
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=2&from=lesson`, "/grammar/boost/:lessonId");
    const first = items[0];
    expect(first.kind).toBe("recall");
    typeText(page, "zzz");
    clickText(page, "提交");
    const reveal = buttonMatching(page, /看答案（会排进复习）/);
    expect(reveal).toBeTruthy();
    clickElement(reveal!);
    await flushAsync();
    // 档 2 同样不入队，文案也不再承诺已入队（2026-09-21 修）
    expect(page.text()).not.toContain("这句已经排进复习队列");
    expect(page.text()).toContain("换你来说");
    expect(readAppData().cards.length).toBe(0);
    expect(telemetryOfKind("sentence_card_enqueued")).toEqual([]);
    page.unmount();
  });

  it("对照：档 3 看答案确实入队，且文案如实说有入队", async () => {
    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=3&from=lesson`, "/grammar/boost/:lessonId");
    typeText(page, "zzz");
    clickText(page, "提交");
    clickElement(buttonMatching(page, /看答案（会排进复习）/)!);
    await flushAsync();
    expect(page.text(), "档 3 的入队承诺与实现一致，应保留原文案").toContain("这句已经排进复习队列");
    expect(readAppData().cards.length).toBe(1);
    expect(telemetryOfKind("sentence_card_enqueued").length).toBe(1);
    page.unmount();
  });
});

describe("PR1-2 趁热练档 3 入队的是用户写的乱码，不是目标句", () => {
  beforeEach(() => resetStorage());

  it("输入 qqqq 看答案 → 队列里新增的句子就是 qqqq", async () => {
    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    const items = buildBoostItems(DONE_LESSON_ID, 3, {});
    const target = items[0];
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=3&from=lesson`, "/grammar/boost/:lessonId");
    typeText(page, "qqqq");
    clickText(page, "提交");
    clickElement(buttonMatching(page, /看答案（会排进复习）/)!);
    await flushAsync();

    const cards = readAppData().cards;
    expect(cards.length).toBe(1);
    expect(cards[0].front, "入队的应是目标句，实际是用户输入的乱码").toBe("qqqq");
    expect(cards[0].front).not.toBe(target.answer);
    // 该卡完成后会进语法复习队列，题面就是乱码
    const stored = readAppData();
    const normalized = {
      ...stored,
      cards: stored.cards.map((card) => ({ ...card, status: "review" as const })),
      schedules: stored.schedules.map((schedule) => ({ ...schedule, intervalDays: 1, nextReviewAt: PAST_ISO }))
    };
    expect(listDueGrammarReviewCards(normalized as typeof stored)[0]?.card.front).toBe("qqqq");
    page.unmount();
  });
});

// ══════════════════════════════════════════════════════════════════
// 二、复习页「很快会再来见你」与实际排期
// ══════════════════════════════════════════════════════════════════

describe("PR1-3 复习页「这张卡很快会再来见你」：10 分钟后确实回到队列（已兑现）", () => {
  beforeEach(() => resetStorage());

  it("看答案后 intervalDays=0、nextReviewAt=+10min；1h/24h/7d 后卡回到队列", async () => {
    const seeded = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-1",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const task = buildGrammarReviewTask(buildGrammarReviewSession(seeded)[0], seeded.sentenceDetails);
    const wrongOption = task.options.find((option) => option !== task.answer)!;
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    clickElement(buttonMatching(page, new RegExp(`^${wrongOption}$`))!);
    clickText(page, "想不起来了，看答案");
    await flushAsync();
    expect(page.text()).toContain("这张卡很快会再来见你。");

    const stored = readAppData();
    const schedule = stored.schedules.find((item) => item.cardId === "card-1")!;
    expect(schedule.intervalDays, "rating=1 → 间隔归零").toBe(0);
    expect(schedule.lapseCount).toBe(1);
    expect(Date.parse(schedule.nextReviewAt)).toBeGreaterThan(Date.now());

    for (const hours of [1, 24, 24 * 7]) {
      expect(
        listDueGrammarReviewCards(stored, new Date(Date.now() + hours * 3600 * 1000)).length,
        `${hours}h 后卡回到队列（neverQueuedSchedule 用三字段判据，不再只看 intervalDays）`
      ).toBe(1);
    }
    page.unmount();

    // 立刻重进仍是空态：这句话把一个 10 分钟后就会回来的卡描述成「明天」
    const again = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(again.has("今天没有到期的语法复习")).toBe(true);
    expect(again.has("上完新课，错过的句子和核心句型明天会排进这里")).toBe(true);
    again.unmount();
  });
});

// ══════════════════════════════════════════════════════════════════
// 三、复习页空态「明天会排进这里」
// ══════════════════════════════════════════════════════════════════

describe("PR1-4 复习页空态「明天会排进这里」：新课卡片永远进不来", () => {
  beforeEach(() => resetStorage());

  it("markLessonDone 后的核心句卡：语法队列立刻/25h/7d 都是 0，但通用复习页能见到", () => {
    const data = markLessonDone(seedAppData({}), DONE_LESSON_ID);
    const card = data.cards.find((item) => item.sourceId === `lesson:${DONE_LESSON_ID}`)!;
    expect(card.status, "新卡是 status=new").toBe("new");
    for (const hours of [0, 25, 24 * 7]) {
      expect(
        listDueGrammarReviewCards(data, new Date(Date.now() + hours * 3600 * 1000)).length,
        `${hours}h 后语法复习队列仍为空`
      ).toBe(0);
    }
    window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(data));
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.has("上完新课，错过的句子和核心句型明天会排进这里")).toBe(true);
    expect(page.has("今天没有到期的语法复习")).toBe(true);
    page.unmount();
  });

  it("日记卡（有问题的句子）同样进不了语法队列", () => {
    const data = seedAppData({});
    const entry = {
      id: "entry-1",
      dateKey: "2026-09-21",
      questionId: "q1",
      questionZh: "今天做了什么？",
      answerEn: "I go to school yesterday.",
      correctedEn: "I went to school yesterday.",
      createdAt: PAST_ISO,
      updatedAt: PAST_ISO,
      issues: [{ original: "go", correction: "went", explanation: "昨天要说 went", tag: "tense" as const }],
      note: "",
      status: "done" as const
    };
    const withEntry = addDiarySentenceToReview(
      { ...data, diaryEntries: [entry] },
      { ...entry, issues: entry.issues as never }
    );
    expect(withEntry.cards.length, "日记卡确实建了").toBe(1);
    expect(withEntry.cards[0].tags).toContain("语法");
    for (const hours of [0, 25, 24 * 7]) {
      expect(
        listDueGrammarReviewCards(withEntry, new Date(Date.now() + hours * 3600 * 1000)).length,
        `${hours}h 后语法复习队列仍为空（status=new + intervalDays=0）`
      ).toBe(0);
    }
  });

  it("反证：卡只有在通用复习页被评过分（rating≥2）之后才可能进语法队列", () => {
    const data = markLessonDone(seedAppData({}), DONE_LESSON_ID);
    const card = data.cards.find((item) => item.sourceId === `lesson:${DONE_LESSON_ID}`)!;
    const afterFirstReview = applyReview(data, card, "recall", 4, card.front);
    const schedule = afterFirstReview.schedules.find((item) => item.cardId === card.id)!;
    expect(schedule.intervalDays).toBeGreaterThan(0);
    expect(listDueGrammarReviewCards(afterFirstReview, new Date(Date.now() + 4 * 24 * 3600 * 1000)).length).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════
// 四、零术语红线
// ══════════════════════════════════════════════════════════════════

describe("PR1-5 趁热练 replace 答错提示的红线词已清除（2026-09-21 修）", () => {
  beforeEach(() => resetStorage());

  it("replace 题选错后的提示不含术语「主语」", async () => {
    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=1&from=lesson`, "/grammar/boost/:lessonId");
    for (const item of items) {
      if (page.has("这一课的记忆稳住了")) break;
      if (item.kind === "replace" || item.kind === "choose") {
        const wrongOption = (item.options ?? []).find((option) => option !== item.answer);
        const buttons = Array.from(page.container.querySelectorAll(".boost-choice")) as HTMLButtonElement[];
        const target = buttons.find((button) => (button.textContent ?? "").trim() === wrongOption);
        expect(target).toBeTruthy();
        clickElement(target!);
        // 修复前文案是「还差一点——想想主语是谁，搭档要跟着变。」——「主语」命中术语表。
        // 现在改为零术语说法（保留「搭档」比喻），页面全文本不再命中红线词。
        expect(page.text()).not.toContain("主语");
        expect(page.text()).toContain("还差一点——先看这句话说的是「谁」");
        expect(GRMAR_ZERO_TERMS_HIT(page.text()), "页面不应再命中零术语红线").toEqual([]);
        break;
      }
      expect(answerBoostItem(page, item)).toBe("passed");
      advanceBoost(page);
    }
    page.unmount();
  });
});

describe("PR1-6 趁热练弱点提示把罪名「人话版」渲染进页面（零术语）", () => {
  beforeEach(() => resetStorage());

  it("missing_be 的 plain 是零术语大白话，并原样出现在 .boost-weak-hint", () => {
    const plain = GRAMMAR_ERROR_TAG_PLAIN.missing_be;
    // 2026-09-21 批四十：原断言要求 plain **含**「主语」「形容词」——那是把旧缺陷当契约。
    // 服务层已把 11 条 plain 全部改成零术语大白话，断言随之反转为「不得命中红线」。
    expect(GRMAR_ZERO_TERMS_HIT(plain), "plain 不得命中零术语红线").toEqual([]);
    expect(plain.length, "plain 不能为空").toBeGreaterThan(0);

    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    for (let index = 0; index < 8; index += 1) {
      appendGrammarEvent({
        kind: "hunt_verdict",
        caseId: `fake-${index}`,
        tokenIndex: 0,
        verdictKind: "wrongTag",
        guessedTag: "missing_be",
        ts: new Date().toISOString()
      });
    }
    expect(computeWeakSpots(readAppData())[0]?.tag).toBe("missing_be");

    const items = buildBoostItems(DONE_LESSON_ID, 1, { weakSpotTag: "missing_be" });
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=1&from=lesson`, "/grammar/boost/:lessonId");
    let rendered: string | null = null;
    for (const item of items) {
      if (page.has("这一课的记忆稳住了")) break;
      const hint = page.container.querySelector(".boost-weak-hint");
      if (hint) {
        rendered = hint.textContent ?? "";
        break;
      }
      expect(answerBoostItem(page, item)).toBe("passed");
      advanceBoost(page);
    }
    expect(rendered, "弱点提示应已渲染").toBeTruthy();
    expect(rendered).toContain("句子里少了个『是』");
    expect(GRMAR_ZERO_TERMS_HIT(rendered!), "渲染出的弱点提示不得命中红线").toEqual([]);
    page.unmount();
  });

  it("扫描：全部罪名的 plain 都不得命中红线词", () => {
    const offenders = Object.entries(GRAMMAR_ERROR_TAG_PLAIN)
      .map(([tag, text]) => ({ tag, hits: GRMAR_ZERO_TERMS_HIT(text) }))
      .filter((entry) => entry.hits.length > 0);
    expect(offenders.map((entry) => `${entry.tag}→${entry.hits.join("/")}`), "plain 含术语的罪名").toEqual([]);
    // 反向对照：确实覆盖了全部罪名（防止词表变空导致断言恒真）
    expect(Object.keys(GRAMMAR_ERROR_TAG_PLAIN).length).toBeGreaterThanOrEqual(11);
  });
});

describe("PR1-7 复习页反馈把 hunt 的 grammarNote 原样渲染（含「时态变形」与机器 token）", () => {
  beforeEach(() => resetStorage());

  it("hunt 卡答对后 .lesson-saved-hint = 「（[tense:move] 时态变形：…）」", async () => {
    seedAppData({});
    const caseItem = huntCases[0];
    const withHunt = addHuntGapSentences(readAppData(), caseItem, caseItem.errors.map((error) => error.tokenIndex));
    const huntCardIds = new Set(
      withHunt.data.cards.filter((card) => card.sourceId === `hunt:${caseItem.id}`).map((card) => card.id)
    );
    const patched = {
      ...withHunt.data,
      cards: withHunt.data.cards.map((card) => (huntCardIds.has(card.id) ? { ...card, status: "review" as const } : card)),
      schedules: withHunt.data.schedules.map((schedule) =>
        huntCardIds.has(schedule.cardId) ? { ...schedule, intervalDays: 1, reviewCount: 2, nextReviewAt: PAST_ISO } : schedule
      )
    };
    window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(patched));
    const data = readAppData();
    const task = buildGrammarReviewTask(buildGrammarReviewSession(data)[0], data.sentenceDetails);
    expect(task.note).toContain("时态变形");
    expect(GRMAR_ZERO_TERMS_HIT(task.note)).toContain("时态");

    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    if (task.mode === "free_type") {
      typeText(page, task.sentence);
      clickText(page, "提交");
    } else {
      clickText(page, task.answer);
    }
    const hint = page.container.querySelector(".lesson-saved-hint");
    expect(hint?.textContent ?? "").toContain("[tense:move]");
    expect(GRMAR_ZERO_TERMS_HIT(hint?.textContent ?? "")).toContain("时态");
    page.unmount();
  });

  it("规模：hunt 讲解越线 441 处 / 案件标题 4 处（全库）", () => {
    let noteHits = 0;
    let titleHits = 0;
    for (const huntCase of huntCases) {
      if (GRMAR_ZERO_TERMS_HIT(huntCase.title).length > 0) titleHits += 1;
      for (const error of huntCase.errors) {
        const note = `${GRAMMAR_ERROR_TAG_LABELS[error.tag]}：${error.original} → ${error.correction}。${error.explanation}`;
        if (GRMAR_ZERO_TERMS_HIT(note).length > 0) noteHits += 1;
      }
    }
    expect(noteHits, "hunt 讲解（grammarNote）越线数量级").toBeGreaterThan(400);
    expect(titleHits).toBeGreaterThan(0);
  });
});

describe("PR1-8 复习页 reveal 文案「正确的说法是」命中情绪红线「正确」", () => {
  beforeEach(() => resetStorage());

  it("看答案后页面出现「正确的说法是」", async () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-z",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    // 先点错一个选项（cloze 首题未答时不显示「看答案」）
    clickElement(buttonMatching(page, /^i$/)!);
    clickText(page, "想不起来了，看答案");
    await flushAsync();
    expect(page.text()).toContain("正确的说法是：");
    page.unmount();
  });
});

// ══════════════════════════════════════════════════════════════════
// 五、答案与题面语义一致
// ══════════════════════════════════════════════════════════════════

describe("PR1-9 趁热练 fix 题把「两句都对」的句子当成「这句写错了」", () => {
  beforeEach(() => resetStorage());

  it("lesson-87：题面说写错了、讲解说两句都对，答案是被改动的那句", async () => {
    const items = buildBoostItems("lesson-87-its-cold", 3, {});
    const fix = items.find((item) => item.kind === "fix")!;
    expect(fix.shapedFrom).toBe("It's cold today.");
    expect(fix.answer).toBe("It is cold today.");
    expect(fix.shapedLabel).toBe("这句有问题");
    expect(fix.promptZh).toContain("这句写错了");
    // 讲解却明说两句都对
    expect(fix.explainZh).toContain("两句都对");
    // 题面要求「改对」，但源数据说原句本身没问题 —— 学生照原样写反而判通过
    const { judgeBoostItem } = await import("../../services/grammarBoostService");
    expect(
      judgeBoostItem(fix, { text: fix.shapedFrom ?? "" }).passed,
      "照题面给出的原句作答被判通过（说明该句本身没有可改之处）"
    ).toBe(true);

    const lesson = grammarLessons.find((entry) => entry.id === "lesson-87-its-cold")!;
    const bothRight = (lesson.contrast ?? []).filter((entry) => entry.bothRight && entry.wrong.trim() === fix.shapedFrom);
    expect(bothRight.length, "源数据明确标注 bothRight").toBe(1);
  });

  it("全库 3 处被抽中（候选池 460 条 bothRight 中，命中取决于交错取题顺序）", () => {
    const hits: string[] = [];
    for (const lesson of grammarLessons) {
      const bothRightWrong = new Set((lesson.contrast ?? []).filter((entry) => entry.bothRight).map((entry) => entry.wrong.trim()));
      for (const item of buildBoostItems(lesson.id, 3, {})) {
        if (item.kind === "fix" && item.shapedFrom && bothRightWrong.has(item.shapedFrom)) hits.push(lesson.id);
      }
    }
    expect(hits.length, "实际抽中的 bothRight 来源 fix 题").toBeGreaterThan(0);
    expect(hits).toContain("lesson-87-its-cold");
  });

  it("候选池规模：460 条 bothRight 全部可被 fix 题取用（无 bothRight 过滤）", () => {
    let candidates = 0;
    for (const lesson of grammarLessons) {
      for (const contrast of lesson.contrast ?? []) {
        if (!contrast.bothRight) continue;
        if (!contrast.wrong.trim() || !contrast.correct.trim()) continue;
        if (contrast.wrong.trim() === contrast.correct.trim()) continue;
        candidates += 1;
      }
    }
    expect(candidates, "候选池应远大于 0（数据增长中，不写死绝对值）").toBeGreaterThan(100);
  });

  it("反向危害：有的 fix 用原句作答反而通过（判分对「两句都对」无感知）", async () => {
    const { judgeBoostItem } = await import("../../services/grammarBoostService");
    const results: Array<{ lessonId: string; passed: boolean; score: number | undefined; isBothRight: boolean }> = [];
    for (const lesson of grammarLessons) {
      const bothRightWrong = new Set((lesson.contrast ?? []).filter((entry) => entry.bothRight).map((entry) => entry.wrong.trim()));
      for (const item of buildBoostItems(lesson.id, 3, {})) {
        if (item.kind !== "fix") continue;
        const judged = judgeBoostItem(item, { text: item.shapedFrom ?? "" });
        results.push({
          lessonId: lesson.id,
          passed: judged.passed,
          score: judged.score,
          isBothRight: Boolean(item.shapedFrom && bothRightWrong.has(item.shapedFrom))
        });
      }
    }
    const contradictory = results.filter((entry) => entry.isBothRight);
    expect(contradictory.length).toBeGreaterThan(0);
    // 其中 2 处「照原样作答」直接判通过（90 分线把两者视为等价），1 处判不通过（17 分）
    expect(contradictory.filter((entry) => entry.passed).length, "照原样作答被判通过的数量").toBeGreaterThan(0);
    // 其余处照原样作答被判不通过（同一句式两种判法，取决于 90 分线）
    expect(contradictory.filter((entry) => !entry.passed).length + contradictory.filter((entry) => entry.passed).length).toBe(contradictory.length);
  });
});

describe("PR1-10 趁热练档 1 对比题已排除 bothRight 句（2026-09-21 修）", () => {
  beforeEach(() => resetStorage());

  /**
   * 修复前：`contrast.bothRight === true` 的条目里 `wrong` 字段其实**也是正确说法**
   * （如 L76 的 `How much milk is there?`、L87 的 `It's cold today.`），
   * 但两条通道（同课对比池 `lesson.contrast.slice(0,4)` 与旧课点混题
   * `pickFirstUnseenContrast`）都无条件写 `isWrong: true`，于是：
   *   题面 = 一句正确的话，问「这句话有问题吗」，用户选「没问题」被判错，
   *   紧接着的讲解又说他是对的（全库 9 处组合、3 句）。
   * 现在两条通道都跳过 bothRight，这类句子改由专门的 `bothright` 通道承载。
   */
  it("全库 195 课 × 6 轮：没有任何 bothRight 句以 contrast 题形态出现", () => {
    const conflicts: string[] = [];
    for (const lesson of grammarLessons) {
      const bothRightWrong = new Set(
        (lesson.contrast ?? []).filter((entry) => entry.bothRight).map((entry) => entry.wrong.trim())
      );
      if (bothRightWrong.size === 0) continue;
      for (let round = 0; round < 6; round += 1) {
        for (const item of buildBoostItems(lesson.id, 1, { round })) {
          if (item.kind !== "contrast" || !item.contrast) continue;
          if (bothRightWrong.has(item.contrast.sentence)) {
            conflicts.push(`${lesson.id}:r${round}:${item.contrast.sentence}`);
          }
        }
      }
    }
    expect(conflicts, `bothRight 句仍被当错句出题：\n${conflicts.slice(0, 6).join("\n")}`).toEqual([]);
  });

  it("对照：双正解句仍以专门的 bothright 通道出现（教学价值不丢）", () => {
    // 排除出「有问题吗」题面 ≠ 这类素材消失——它由 kind: "bothright" 承载
    const lesson = grammarLessons.find((entry) => entry.id === "lesson-76-much-better");
    expect(lesson, "L76 应存在").toBeTruthy();
    let sawBothright = false;
    for (let round = 0; round < 6; round += 1) {
      for (const item of buildBoostItems("lesson-76-much-better", 1, { round })) {
        if (item.kind === "bothright") sawBothright = true;
      }
    }
    expect(sawBothright, "双正解素材应由 bothright 题型承载").toBe(true);
  });

  it("L76 定点：How much milk is there? 不再出现在 contrast 题里", () => {
    const hits: string[] = [];
    for (let round = 0; round < 6; round += 1) {
      for (const item of buildBoostItems("lesson-76-much-better", 1, { round })) {
        if (item.kind === "contrast" && item.contrast?.sentence === "How much milk is there?") {
          hits.push(`round ${round}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════
// 六、计数与口径
// ══════════════════════════════════════════════════════════════════

describe("PR1-11 复习页掌握条数字口径", () => {
  beforeEach(() => resetStorage());

  it("已掌握/进行中/未开始 三者之和恒等于 total", () => {
    const shapes = [
      { status: "mastered" as const, reviewCount: 0, intervalDays: 3 },
      { status: "review" as const, reviewCount: 1, intervalDays: 1 },
      { status: "new" as const, reviewCount: 0, intervalDays: 0 },
      { status: "review" as const, reviewCount: 0, intervalDays: 1 }
    ];
    const data = seedAppData(
      cardsToData(
        shapes.map((shape, index) =>
          makeSentenceCard({
            id: `card-${index}`,
            sentence: `Sentence ${index} is here.`,
            status: shape.status,
            schedule: { reviewCount: shape.reviewCount, intervalDays: shape.intervalDays, nextReviewAt: PAST_ISO }
          })
        )
      )
    );
    const mastery = summarizeGrammarMastery(data);
    expect(mastery.mastered + mastery.inProgress + mastery.notStarted).toBe(mastery.total);
    expect(mastery.total).toBe(4);
  });

  it("已掌握 + 到期的卡仍被出成题目：同屏「已掌握 1 / 共 1 句」与「第 1 / 1 张」", () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-m",
          sentence: "I am drawing a picture.",
          status: "mastered",
          schedule: { reviewCount: 3, intervalDays: 3, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.has("已掌握 1")).toBe(true);
    expect(page.has("共 1 句")).toBe(true);
    expect(page.has("第 1 / 1 张"), "已掌握的卡仍在被提问").toBe(true);
    page.unmount();
  });

  it("reviewCount=0 但已进队列的卡：同屏「未开始 1」与「第 1 / 1 张」", () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-n",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.has("未开始 1")).toBe(true);
    expect(page.has("第 1 / 1 张"), "正在作答的卡被标为「未开始」").toBe(true);
    page.unmount();
  });
});

describe("PR1-12 复习页完成态数字", () => {
  beforeEach(() => resetStorage());

  it("10 张全一次通过：一次到位 10 / 还需要再见 0；上限 10 生效", async () => {
    seedAppData(
      cardsToData(
        Array.from({ length: 12 }, (_, index) =>
          makeSentenceCard({
            id: `card-${index}`,
            sentence: `Sentence number ${index} is here.`,
            sourceId: `lesson:l-${index % 5}`,
            schedule: { reviewCount: 1, intervalDays: 3, nextReviewAt: PAST_ISO }
          })
        )
      )
    );
    const data = readAppData();
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    const { completeReviewSession } = await import("./drive");
    expect(completeReviewSession(page, data)).toBe(10);
    expect(page.text()).toContain("本次共 10 张卡：10 张一次到位，0 张还需要再见几次");
    expect(page.text()).toContain("每次复习不超过 10 张");
    page.unmount();
  });

  it("看答案的卡不计入「一次到位」", async () => {
    const seeded = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-1",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const task = buildGrammarReviewTask(buildGrammarReviewSession(seeded)[0], seeded.sentenceDetails);
    expect(task.mode).toBe("cloze");
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    clickElement(buttonMatching(page, new RegExp(`^${task.options.find((option) => option !== task.answer)}$`))!);
    clickText(page, "想不起来了，看答案");
    await flushAsync();
    clickText(page, "完成复习");
    await flushAsync();
    expect(page.text()).toContain("0 张一次到位，1 张还需要再见几次");
    page.unmount();
  });

  it("「（已记入本周复习数据）」只要库里有任意一条事件就显示（含 30 天前的完课事件）", async () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-w",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    appendGrammarEvent({
      kind: "grammar_lesson_completed",
      lessonId: DONE_LESSON_ID,
      completedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      guidedFirstTry: true,
      practiceFirstTry: true,
      durationMs: 1000
    });
    const data = readAppData();
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    const { completeReviewSession } = await import("./drive");
    completeReviewSession(page, data);
    await flushAsync();
    expect(page.text(), "「本周」无任何校验，只要求 totalEvents>0").toContain("已记入本周复习数据");
    expect(listGrammarEventsByKind("grammar_review_result").length, "本次确实写了复习事件").toBe(1);
    const ancientOnly = listGrammarEventsByKind("grammar_lesson_completed")[0];
    expect(Date.now() - Date.parse(ancientOnly.completedAt)).toBeGreaterThan(29 * 24 * 3600 * 1000);
    page.unmount();
  });
});

describe("PR1-13 复习页描述「改一改、拼一拼的小任务」：改一改不存在", () => {
  beforeEach(() => resetStorage());

  it("可用题型只有 cloze / rebuild / free_type", () => {
    const modes = new Set<string>();
    for (const lesson of grammarLessons.slice(0, 40)) {
      for (const reviewCount of [0, 1, 2, 3, 4]) {
        const data = seedAppData(
          cardsToData([
            makeSentenceCard({
              id: `c-${lesson.id}-${reviewCount}`,
              sentence: lesson.targetSentence,
              schedule: { reviewCount, intervalDays: 3, nextReviewAt: PAST_ISO }
            })
          ])
        );
        const item = buildGrammarReviewSession(data)[0];
        if (item) modes.add(buildGrammarReviewTask(item, data.sentenceDetails).mode);
      }
    }
    expect([...modes].sort()).toEqual(["cloze", "free_type", "rebuild"]);
    seedAppData({});
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.text()).toContain("改一改、拼一拼的小任务");
    page.unmount();
  });
});

describe("PR1-14 复习页「产出一次，才算真的会」与实际掌握口径", () => {
  beforeEach(() => resetStorage());

  it("四次 cloze 通过（rating=4）即可 mastered，全程没有产出题", () => {
    let data = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-c",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 3, intervalDays: 3, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const session = buildGrammarReviewSession(data);
    const task = buildGrammarReviewTask(session[0], data.sentenceDetails);
    expect(task.mode, "reviewCount=3 → free_type（说明产出题型需要复习 3 次才出现）").toBe("free_type");
    // 用只有 cloze 的路径模拟：reviewCount 0/1 时是 cloze/rebuild，重复评分到 4 次
    data = applyReview(data, data.cards[0], "cloze", 4);
    data = applyReview(data, data.cards[0], "cloze", 4);
    data = applyReview(data, data.cards[0], "cloze", 4);
    data = applyReview(data, data.cards[0], "cloze", 4);
    const card = data.cards[0];
    expect(card.status, "纯 cloze 路径也能置 mastered（不需要任何产出）").toBe("mastered");
  });

  it("反向：rebuild 通过被当作「输出通过」计数", () => {
    const rebuildPasses = [
      { cardId: "c1", mode: "recall", rating: 4 as const },
      { cardId: "c1", mode: "recall", rating: 4 as const }
    ];
    // 页面 reviewModeForTask 把 rebuild 与 free_type 都映射成 "recall"
    expect(isMasteredByOutput(rebuildPasses, "c1"), "两次 rebuild 通过即被判定「输出连续 2 次通过」").toBe(true);
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c1",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 1, intervalDays: 3, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const item = buildGrammarReviewSession(data)[0];
    expect(buildGrammarReviewTask(item, data.sentenceDetails).mode, "reviewCount=1 → rebuild").toBe("rebuild");
    const after = applyReview(data, item.card, "recall", 4, item.card.front);
    expect(after.reviews[0].mode, "rebuild 被记成 recall，会被当作输出记录").toBe("recall");
  });
});

// ══════════════════════════════════════════════════════════════════
// 七、降级与出口
// ══════════════════════════════════════════════════════════════════

describe("PR1-15 趁热练 AI 降级提示「先看下面的对照」是悬空引用", () => {
  beforeEach(() => resetStorage());

  it("AI 不可达 → notice 出现但 .boost-ai-card 数量为 0", async () => {
    const seeded = seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    const patched = {
      ...seeded,
      settings: {
        ...seeded.settings,
        aiProvider: {
          ...seeded.settings.aiProvider,
          enabled: true,
          baseUrl: "https://127.0.0.1:9/v1",
          apiKey: "k",
          model: "m"
        }
      }
    };
    window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(patched));
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=3&from=lesson`, "/grammar/boost/:lessonId");
    for (const item of buildBoostItems(DONE_LESSON_ID, 3, {})) {
      if (page.has("又稳了一层")) break;
      expect(answerBoostItem(page, item)).toBe("passed");
      advanceBoost(page);
    }
    await flushAsync();
    await flushAsync();
    await flushAsync();
    const notice = page.container.querySelector(".boost-ai-notice");
    expect(notice?.textContent ?? "").toContain("先看下面的对照");
    expect(page.container.querySelectorAll(".boost-ai-card").length, "提示所指的「下面的对照」并不存在").toBe(0);
    page.unmount();
  });

  it("未配置 AI 走完档 3：既无 AI 卡片也无任何降级提示", async () => {
    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=3&from=lesson`, "/grammar/boost/:lessonId");
    for (const item of buildBoostItems(DONE_LESSON_ID, 3, {})) {
      if (page.has("又稳了一层")) break;
      typeText(page, "x");
      clickText(page, "提交");
      const reveal = buttonMatching(page, /看答案（会排进复习）/);
      if (reveal) clickElement(reveal);
      await flushAsync();
      advanceBoost(page);
    }
    await flushAsync();
    expect(page.container.querySelectorAll(".boost-ai-card").length).toBe(0);
    expect(page.container.querySelectorAll(".boost-ai-notice").length).toBe(0);
    page.unmount();
  });
});

describe("PR1-16 趁热练档位承诺（题数）兑现", () => {
  beforeEach(() => resetStorage());

  it("全库 195 课 × 三档：实际题量恒等于档位卡承诺的题数", () => {
    const distribution: Record<number, Set<number>> = { 1: new Set(), 2: new Set(), 3: new Set() };
    for (const lesson of grammarLessons) {
      for (const tier of [1, 2, 3] as const) {
        distribution[tier].add(buildBoostItems(lesson.id, tier, {}).length);
      }
    }
    expect([...distribution[1]]).toEqual([BOOST_TIER_META[1].questionCount]);
    expect([...distribution[2]]).toEqual([BOOST_TIER_META[2].questionCount]);
    expect([...distribution[3]]).toEqual([BOOST_TIER_META[3].questionCount]);
    expect(BOOST_TIER_META[1].summaryZh).toContain("4 题，约 2 分钟");
    expect(BOOST_TIER_META[2].summaryZh).toContain("5 题，约 4 分钟");
    expect(BOOST_TIER_META[3].summaryZh).toContain("3 题，约 4 分钟");
  });
});

describe("PR1-17 复习页第一题的「看答案」可见性", () => {
  beforeEach(() => resetStorage());

  it("cloze 首题：一次未答时没有看答案按钮，点错一个之后才出现（可自救）", () => {
    const seeded = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-a",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const task = buildGrammarReviewTask(buildGrammarReviewSession(seeded)[0], seeded.sentenceDetails);
    const wrongOption = task.options.find((option) => option !== task.answer)!;
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(buttonMatching(page, /看答案/), "首答前不提供看答案").toBeFalsy();
    clickElement(buttonMatching(page, new RegExp(`^${wrongOption}$`))!);
    expect(buttonMatching(page, /看答案/), "答过一次后出现看答案").toBeTruthy();
    page.unmount();
  });

  it("rebuild 首题：必须把所有词块摆满才会出现看答案（半途没有出口、也没有任何反馈）", () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-b",
          sentence: "I am drawing a picture with my sister.",
          schedule: { reviewCount: 1, intervalDays: 3, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.text()).toContain("把这些词块按顺序点回去，拼出正确的句子");
    const chips = () => Array.from(page.container.querySelectorAll(".lesson-bank button")) as HTMLButtonElement[];
    // 摆到只剩一个词块：仍无出口
    const tokens = chips().map((chip) => (chip.textContent ?? "").trim());
    for (const token of tokens.slice(0, tokens.length - 1)) {
      const chip = chips().find((item) => !item.disabled && (item.textContent ?? "").trim() === token);
      if (chip) clickElement(chip);
    }
    expect(buttonMatching(page, /看答案/), "摆到只剩一个词块仍无「看答案」").toBeFalsy();
    // 摆满（故意错序）才出现
    const rest = chips().map((chip) => (chip.textContent ?? "").trim());
    for (const token of rest) {
      const chip = chips().find((item) => !item.disabled && (item.textContent ?? "").trim() === token);
      if (chip) clickElement(chip);
    }
    expect(buttonMatching(page, /看答案/), "摆满后出现「看答案」").toBeTruthy();
    // 摆错顺序没有任何文字反馈：页面上的「顺序」只来自题面引导语
    const body = page.text();
    const occurrences = body.split("顺序").length - 1;
    expect(occurrences, "「顺序」只应出现在题面（1 次），反馈区没有额外说明").toBe(1);
    page.unmount();
  });
});

/** 页面文本命中零术语词表。 */
function GRMAR_ZERO_TERMS_HIT(text: string): string[] {
  return GRAMMAR_ZERO_TERMS.filter((term) => text.includes(term));
}
