import { describe, expect, it } from "vitest";
import {
  appendHuntAttempt,
  appendHuntResult,
  buildHintMessage,
  buildHuntResult,
  computeStars,
  findErrorAt,
  GRAMMAR_ERROR_TAG_LABELS,
  HUNT_CLUE_BUDGET,
  judgeGuess,
  listHuntCases,
  pickCorrectionWord,
  pickHintTarget,
  summarizeHuntProgress
} from "./huntService";
import { huntCases } from "../data/huntCases";
import { grammarLessons } from "../data/grammarLessons";
import { makeTestData } from "./testUtils";

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
    // 全部 10 个罪名都要出现在统计里，便于页面渲染固定的罪名面板。
    expect(summary.tagStats).toHaveLength(10);
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
    expect(pickCorrectionWord("an")).toBe("");
    expect(pickCorrectionWord("a")).toBe("");
    expect(pickCorrectionWord("去掉 so")).toBe("");
    expect(pickCorrectionWord("moved")).toBe("moved");
    expect(pickCorrectionWord("is happy")).toBe("happy");
    expect(pickCorrectionWord("a beautiful dress")).toBe("beautiful");
    expect(pickCorrectionWord("information")).toBe("information");
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

