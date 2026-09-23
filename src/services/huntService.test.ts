import { describe, expect, it } from "vitest";
import {
  addHuntGapSentences,
  appendHuntAttempt,
  appendHuntResult,
  buildHintMessage,
  buildHuntResult,
  computeStars,
  correctedSentenceOf,
  findErrorAt,
  GRAMMAR_ERROR_TAG_LABELS,
  hasUnlockedHuntCase,
  HUNT_CLUE_BUDGET,
  judgeGuess,
  listHuntCases,
  listHuntCasesWithLock,
  pickCorrectionWord,
  pickHintTarget,
  summarizeHuntProgress, GRAMMAR_ERROR_TAGS } from "./huntService";
import { huntCases } from "../data/huntCases";
import { grammarLessons } from "../data/grammarLessons";
import { makeTestData } from "./testUtils";
import { GRAMMAR_ZERO_TERMS } from "../data/grammarZeroTerms";

const firstCase = listHuntCases()[0];
const firstError = firstCase.errors[0];

const stripPunctuation = (token: string) => token.replace(/[^\p{L}\p{N}]/gu, "");

describe("hunt service", () => {
  it("judges a correct tag as a hit", () => {
    const verdict = judgeGuess(firstCase, firstError.tokenIndex, firstError.tag, []);
    expect(verdict.kind).toBe("hit");
    expect(verdict.error?.tokenIndex).toBe(firstError.tokenIndex);
  });

  it("judges a wrong tag as wrongTag with a teaching hint", () => {
    const otherTag = firstError.tag === "tense" ? "plural" : "tense";
    const verdict = judgeGuess(firstCase, firstError.tokenIndex, otherTag, []);

    expect(verdict.kind).toBe("wrongTag");
    expect(verdict.error?.tokenIndex).toBe(firstError.tokenIndex);
    expect(verdict.message).toContain("这里确实有问题");
    expect(verdict.message).not.toContain(GRAMMAR_ERROR_TAG_LABELS[firstError.tag]);
  });

  it("judges a clean word as notError with a gentle message", () => {
    const verdict = judgeGuess(firstCase, 0, "tense", []);
    expect(verdict.kind).toBe("notError");
    expect(verdict.error).toBeUndefined();
    expect(verdict.message).toContain("没有问题");
  });

  it("judges an already-found token as alreadyFound", () => {
    const verdict = judgeGuess(firstCase, firstError.tokenIndex, firstError.tag, [firstError.tokenIndex]);
    expect(verdict.kind).toBe("alreadyFound");
  });

  it("computes stars by miss tiers", () => {
    expect(computeStars(0)).toBe(3);
    expect(computeStars(1)).toBe(2);
    expect(computeStars(2)).toBe(2);
    expect(computeStars(3)).toBe(1);
    expect(computeStars(10)).toBe(1);
  });

  it("builds a result with stars and timestamps", () => {
    const result = buildHuntResult(firstCase, 1, 65000, "2024-01-15T12:00:00.000Z");
    expect(result.caseId).toBe(firstCase.id);
    expect(result.found).toBe(firstCase.errors.length);
    expect(result.total).toBe(firstCase.errors.length);
    expect(result.misses).toBe(1);
    expect(result.stars).toBe(2);
    expect(result.durationMs).toBe(65000);
    expect(result.finishedAt).toBeTruthy();
  });

  it("marks a case solved only when a result reaches found === total", () => {
    const total = firstCase.errors.length;
    const started = makeTestData();
    const partial = appendHuntResult(started, {
      ...buildHuntResult(firstCase, 0, 1000, "2024-01-15T12:00:00.000Z"),
      found: total - 1
    });

    expect(summarizeHuntProgress(partial).solvedCaseIds).toEqual([]);

    const solved = appendHuntResult(started, buildHuntResult(firstCase, 0, 1000, "2024-01-15T12:00:00.000Z"));
    expect(summarizeHuntProgress(solved).solvedCaseIds).toEqual([firstCase.id]);
    expect(summarizeHuntProgress(solved).totalCases).toBe(listHuntCases().length);
  });

  it("summarizes tag stats from attempts", () => {
    let data = makeTestData();
    data = appendHuntAttempt(data, { caseId: firstCase.id, tokenIndex: 3, guessedTag: "tense", hit: true });
    data = appendHuntAttempt(data, { caseId: firstCase.id, tokenIndex: 3, guessedTag: "plural", hit: false });
    data = appendHuntAttempt(data, { caseId: firstCase.id, tokenIndex: 5, guessedTag: "tense", hit: false });
    data = appendHuntAttempt(data, { caseId: firstCase.id, tokenIndex: 5, guessedTag: null, hit: false });

    const summary = summarizeHuntProgress(data);
    expect(summary.guessCount).toBe(4);
    expect(summary.hitCount).toBe(1);
    expect(summary.totalMisses).toBe(0);

    const tenseStat = summary.tagStats.find((stat) => stat.tag === "tense");
    expect(tenseStat).toEqual({ tag: "tense", found: 1, wrong: 1 });
    const pluralStat = summary.tagStats.find((stat) => stat.tag === "plural");
    expect(pluralStat).toEqual({ tag: "plural", found: 0, wrong: 1 });
    // 全部罪名都要出现在统计里，便于页面渲染固定的罪名面板。
    // 2026-09-21：词表已从 LABELS 派生（唯一来源），含 comparison 共 11 个——
    // 原先的 10 是「两处词表不一致」的遗留值（见 H1 的已知问题登记）。
    expect(summary.tagStats).toHaveLength(GRAMMAR_ERROR_TAGS.length);
    expect(summary.tagStats).toHaveLength(11);
  });

  it("works with default empty hunt fields from makeTestData", () => {
    const summary = summarizeHuntProgress(makeTestData());
    expect(summary.solvedCaseIds).toEqual([]);
    expect(summary.totalCases).toBe(listHuntCases().length);
    expect(summary.totalMisses).toBe(0);
    expect(summary.hitCount).toBe(0);
    expect(summary.guessCount).toBe(0);
    expect(summary.tagStats.every((stat) => stat.found === 0 && stat.wrong === 0)).toBe(true);
    expect(HUNT_CLUE_BUDGET).toBe(5);
  });

  it("finds errors only at their token indexes", () => {
    expect(findErrorAt(firstCase, firstError.tokenIndex)?.tag).toBe(firstError.tag);
    expect(findErrorAt(firstCase, -1)).toBeUndefined();
    expect(findErrorAt(firstCase, 999)).toBeUndefined();
  });

  it("picks a correction word, skipping articles and deletion-style fixes", () => {
    // 判据走 editOp（批五十三）：不可机械执行的三类一律取不到词
    expect(pickCorrectionWord("an", "replace")).toBe("");
    expect(pickCorrectionWord("a", "replace")).toBe("");
    expect(pickCorrectionWord("去掉 so", "delete")).toBe("");
    expect(pickCorrectionWord("把 white 移到 cat 前面", "move")).toBe("");
    expect(pickCorrectionWord("（rather 跟在 would 后）", "explain")).toBe("");
    expect(pickCorrectionWord("moved", "replace")).toBe("moved");
    expect(pickCorrectionWord("is happy", "insert")).toBe("happy");
    expect(pickCorrectionWord("a beautiful dress", "replace")).toBe("beautiful");
    expect(pickCorrectionWord("information", "replace")).toBe("information");
  });

  it("handles a null guessedTag without crashing", () => {
    const onErrorToken = judgeGuess(firstCase, firstError.tokenIndex, null, []);
    expect(onErrorToken.kind).toBe("wrongTag");
    expect(onErrorToken.message).toContain("这里确实有问题");

    const onCleanToken = judgeGuess(firstCase, 0, null, []);
    expect(onCleanToken.kind).toBe("notError");
    expect(onCleanToken.error).toBeUndefined();
  });

  it("does not double-count or penalize an already-found token", () => {
    const verdict = judgeGuess(firstCase, firstError.tokenIndex, firstError.tag, [firstError.tokenIndex]);
    expect(verdict.kind).toBe("alreadyFound");
    expect(verdict.error).toBeUndefined();
  });

  it("appends attempts and results immutably", () => {
    const data = makeTestData();
    const next = appendHuntAttempt(data, {
      caseId: firstCase.id,
      tokenIndex: 3,
      guessedTag: "tense",
      hit: true
    });

    expect(next).not.toBe(data);
    expect(data.huntAttempts).toHaveLength(0);
    expect(next.huntAttempts).toHaveLength(1);
    expect(next.huntAttempts[0].tokenIndex).toBe(3);

    const result = buildHuntResult(firstCase, 0, 1000, "2024-01-15T12:00:00.000Z");
    const next2 = appendHuntResult(data, result);
    expect(next2).not.toBe(data);
    expect(data.huntResults).toHaveLength(0);
    expect(next2.huntResults).toHaveLength(1);
  });

  it("clamps negative misses to a clean round", () => {
    const result = buildHuntResult(firstCase, -3, 1000, "2024-01-15T12:00:00.000Z");
    expect(result.misses).toBe(0);
    expect(result.stars).toBe(3);
  });
});

describe("R01 课程锁：listHuntCasesWithLock", () => {
  it("零进度用户：全部案件锁定，解锁提示指向引用该案的课程", () => {
    const infos = listHuntCasesWithLock(makeTestData({ grammarLessonsDone: [] }));
    expect(infos).toHaveLength(huntCases.length);
    expect(infos.every((info) => !info.unlocked)).toBe(true);
    // 首案（被 lesson-01-am 引用）提示「学完第 1 课」
    const first = infos.find((info) => info.caseItem.id === "hunt-call-mother");
    expect(first?.unlockLesson?.id).toBe("lesson-01-am");
    expect(first?.unlockLesson?.number).toBe(1);
    expect(hasUnlockedHuntCase(makeTestData({ grammarLessonsDone: [] }))).toBe(false);
  });

  it("完成 lesson-01-am：仅其引用的案件解锁，其余仍锁定", () => {
    const data = makeTestData({ grammarLessonsDone: ["lesson-01-am"] });
    const infos = listHuntCasesWithLock(data);
    const byId = new Map(infos.map((info) => [info.caseItem.id, info]));
    expect(byId.get("hunt-call-mother")?.unlocked).toBe(true);
    expect(byId.get("hunt-new-phone")?.unlocked).toBe(false); // lesson-04 的案
    expect(byId.get("hunt-passive")?.unlocked).toBe(false); // lesson-11 的案
    expect(hasUnlockedHuntCase(data)).toBe(true);
  });

  it("完成全部 24 课：33 案全部解锁", () => {
    const allDone = grammarLessons.map((lesson) => lesson.id);
    const infos = listHuntCasesWithLock(makeTestData({ grammarLessonsDone: allDone }));
    expect(infos.every((info) => info.unlocked)).toBe(true);
  });

  it("番外案（未被课程引用）：完成第 12 课整体解锁，未达档位保持锁定", () => {
    const infos = listHuntCasesWithLock(makeTestData({ grammarLessonsDone: [] }));
    const orphans = infos.filter((info) => info.unlockLesson === null).map((info) => info.caseItem.id);
    // 数据基线：当前有 5 个番外案（综合复习性质）
    expect(orphans).toEqual(["hunt-white-cat", "hunt-sports-day", "hunt-pen-pal-letter", "hunt-fridge-note", "hunt-term-review"]);
    // 完成第 11 课：番外案仍锁定
    const beforeSeasonOneDone = grammarLessons.filter((l) => l.number <= 11).map((l) => l.id);
    const lockedInfos = listHuntCasesWithLock(makeTestData({ grammarLessonsDone: beforeSeasonOneDone }));
    for (const id of orphans) {
      expect(lockedInfos.find((info) => info.caseItem.id === id)?.unlocked).toBe(false);
    }
    // 完成第 12 课（第一季）：番外案整体解锁
    const seasonOneDone = grammarLessons.filter((l) => l.number <= 12).map((l) => l.id);
    const unlockedInfos = listHuntCasesWithLock(makeTestData({ grammarLessonsDone: seasonOneDone }));
    for (const id of orphans) {
      expect(unlockedInfos.find((info) => info.caseItem.id === id)?.unlocked).toBe(true);
    }
  });
});

describe("R02 找错知识缺口 → SM-2 复习队列", () => {
  it("只把缺口点（看过提示/罪名绕弯）生成句子卡，tags 为「语法」，sourceId 为 hunt:<caseId>", () => {
    const caseItem = huntCases[0];
    const gapTokens = [caseItem.errors[0].tokenIndex];
    const { data, added } = addHuntGapSentences(makeTestData(), caseItem, gapTokens);

    expect(added).toBe(1);
    expect(data.cards).toHaveLength(1);
    const card = data.cards[0];
    expect(card.type).toBe("sentence");
    expect(card.tags).toContain("语法");
    expect(card.sourceId).toBe(`hunt:${caseItem.id}`);
    /**
     * 正面是「完整正确句」（2026-09-21 修）：
     * 此前断言的 `caseItem.tokens.join(" ")` 是含错原文——那句子里留着案件的植错，
     * 而这张卡是进 SM-2 复习队列当答案用的（用户照抄它应该判对）。
     * 修好后正确句 = 把该案全部植错改正（见 correctedSentenceOf）。
     *
     * 2026-09-23 批五十三：这里原有一份**手抄的修正算法副本**（自带的 splice 与贴标点逻辑），
     * 正是「同一套判据散落多份」的隐患来源。改为直接调用生产函数——独立核算的职责
     * 已由 RV11（换算法重建 + 词数守恒）承担，此处不再重复实现。
     */
    expect(card.front).toBe(correctedSentenceOf(caseItem));
    expect(card.front, "正面不应再含任何植错原形").not.toBe(caseItem.tokens.join(" "));
    // grammarNote 嵌入稳定罪名 token（[tag:原错词]，弱点回溯用）
    const details = data.sentenceDetails.find((item) => item.cardId === card.id);
    expect(details?.grammarNote).toContain(`[${caseItem.errors[0].tag}:${caseItem.errors[0].original}]`);
    expect(details?.grammarNote).toContain(caseItem.errors[0].correction);
    // 调度卡已创建（进入 SM-2 队列）
    expect(data.schedules.some((schedule) => schedule.cardId === card.id)).toBe(true);
  });

  it("幂等：同一案件同一罪名重复结算不重复建卡", () => {
    const caseItem = huntCases[0];
    const gapTokens = [caseItem.errors[0].tokenIndex];
    const once = addHuntGapSentences(makeTestData(), caseItem, gapTokens);
    const twice = addHuntGapSentences(once.data, caseItem, gapTokens);

    expect(twice.added).toBe(0);
    expect(twice.data.cards).toHaveLength(1);
  });

  it("同案同罪名的多处不同错词各自成卡（幂等键含原错词）；无缺口零新增", () => {
    // hunt-moving-day 有两处 tense（moved / helped）——同罪名不同错词，应各建一张
    const caseItem = huntCases.find((item) => item.id === "hunt-moving-day")!;
    const allGap = caseItem.errors.map((error) => error.tokenIndex);
    const { data, added } = addHuntGapSentences(makeTestData(), caseItem, allGap);
    expect(added).toBe(caseItem.errors.length);
    const tenseCards = data.cards.filter((card) => {
      const details = data.sentenceDetails.find((item) => item.cardId === card.id);
      return details?.grammarNote.startsWith("[tense:");
    });
    expect(tenseCards).toHaveLength(2);

    const { data: unchanged, added: zero } = addHuntGapSentences(makeTestData(), caseItem, []);
    expect(zero).toBe(0);
    expect(unchanged.cards).toHaveLength(0);
  });
});

describe("hunt cases data integrity", () => {
  // 案件池随第二季进阶篇持续扩容（PRD-grammar-advanced R1–R8 每课配 1–2 案），
  // 故用下限守卫防意外丢数据，不再钉死精确总数（原快照：20 案 / 54 错）。
  it("keeps the case pool at or above the season-1 baseline (20 cases / 54 errors)", () => {
    expect(huntCases.length).toBeGreaterThanOrEqual(20);
    expect(huntCases.reduce((sum, huntCase) => sum + huntCase.errors.length, 0)).toBeGreaterThanOrEqual(54);
  });

  it("keeps case ids and numbers unique", () => {
    expect(new Set(huntCases.map((huntCase) => huntCase.id)).size).toBe(huntCases.length);
    expect(new Set(huntCases.map((huntCase) => huntCase.number)).size).toBe(huntCases.length);
  });

  // R15：未被任何课程引用的案件必须经过人工校验（reviewed），防止 AI 初稿静默上线。
  it("requires unreferenced cases to be human-reviewed (R15)", () => {
    const referenced = new Set(grammarLessons.flatMap((lesson) => lesson.huntCaseIds));
    const unreviewed = huntCases
      .filter((huntCase) => !referenced.has(huntCase.id) && !huntCase.reviewed)
      .map((huntCase) => huntCase.id);
    expect(unreviewed).toEqual([]);
  });

  // R13 红线：被课程引用的案件必须先过人工校验——未校验的案件直接配课会把错误内容带给玩家。
  it("requires referenced cases to be human-reviewed (R13)", () => {
    const referenced = new Set(grammarLessons.flatMap((lesson) => lesson.huntCaseIds));
    const unreviewedReferenced = huntCases
      .filter((huntCase) => referenced.has(huntCase.id) && !huntCase.reviewed)
      .map((huntCase) => huntCase.id);
    expect(unreviewedReferenced).toEqual([]);
  });

  // 案件 hunt-new-phone 的冠词下标曾错指 "hour"，修复后此处作为数据对齐回归守门。
  it("aligns every error tokenIndex with the token text (ignoring punctuation)", () => {
    for (const huntCase of huntCases) {
      for (const error of huntCase.errors) {
        expect(error.tokenIndex).toBeGreaterThanOrEqual(0);
        expect(error.tokenIndex).toBeLessThan(huntCase.tokens.length);

        const tokenWord = stripPunctuation(huntCase.tokens[error.tokenIndex]).toLowerCase();
        const originalWords = error.original.split(/\s+/).map((word) => stripPunctuation(word).toLowerCase());
        expect(originalWords).toContain(tokenWord);
      }
    }
  });

  it("leaves every case with at least one clean (decoy) token", () => {
    for (const huntCase of huntCases) {
      const errorIndexes = new Set(huntCase.errors.map((error) => error.tokenIndex));
      expect(huntCase.tokens.length).toBeGreaterThan(errorIndexes.size);
    }
  });

  it("pickHintTarget：按词序返回第一个未找到的错误，已找到的跳过", () => {
    const [first, second] = firstCase.errors;
    expect(pickHintTarget(firstCase, [])?.tokenIndex).toBe(first.tokenIndex);
    expect(pickHintTarget(firstCase, [first.tokenIndex])?.tokenIndex).toBe(second.tokenIndex);
    const allFound = firstCase.errors.map((error) => error.tokenIndex);
    expect(pickHintTarget(firstCase, allFound)).toBeUndefined();
  });

  it("buildHintMessage：只给罪名与方位，不泄露答案词", () => {
    const message = buildHintMessage(firstCase, firstError);
    expect(message).toContain(GRAMMAR_ERROR_TAG_LABELS[firstError.tag]);
    expect(message).toMatch(/前半段|后半段/);
    expect(message).not.toContain(firstError.original);
    expect(message).not.toContain(firstError.correction);
  });
});


/**
 * huntCases 零术语守门（2026-09-22 批四十三新增）。
 *
 * 背景：零术语红线在**课程侧**（grammarLessons）有 30+ 项断言守着，
 * 但**找错案件侧**（huntCases）一处都没有——而案件里的 `errors[].explanation`
 * 是**用户可见的**（点对错词后直接显示，见 GrammarHuntPage）。
 *
 * 实测：本守门落地前有 **313 处**术语命中、散布在 131/206 个案里，
 * 且都是高频词（复数 107、可数 98、三单 33、主语 32）——
 * 数量比课程侧历史上任何一次泄漏都多，存活时间也最长（无人发现）。
 * 已全部改写为项目自建词汇；本断言防止回潮。
 *
 * 口径：与课程侧一致——`title` / `scene` / `errors[].explanation` 三处
 * 都是用户可见文案，全部纳入。`tokens`（英文原句）与 `correction`（英文修正）
 * 不含中文，无需检查。
 */
describe("零术语红线 · 找错案件侧（huntCases 用户可见文案）", () => {
  it("案件的 title / scene / errors[].explanation 都不得含语法术语", () => {
    const offenders: string[] = [];
    for (const huntCase of huntCases) {
      const check = (text: string | undefined, where: string) => {
        if (!text) return;
        const hits = GRAMMAR_ZERO_TERMS.filter((term) => text.includes(term));
        if (hits.length > 0) offenders.push(`${huntCase.id} ${where}→${hits.join("/")}：${text.slice(0, 60)}`);
      };
      check(huntCase.title, "title");
      check(huntCase.scene, "scene");
      huntCase.errors.forEach((error, index) => check(error.explanation, `errors[${index}].explanation`));
    }
    expect(
      offenders.slice(0, 10),
      `找错案件侧的用户可见文案含语法术语（这些会在破案反馈里直接显示给用户）：\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
