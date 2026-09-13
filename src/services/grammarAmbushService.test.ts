import { beforeEach, describe, expect, it } from "vitest";
import { buildAmbushQuestions, buildRevisitQuiz, buildStage3CasePlan, judgeAmbushPick } from "./grammarAmbushService";
import { appendGrammarEvent, clearGrammarTelemetry } from "./grammarTelemetry";
import type { AppData } from "../types";

const baseData = (overrides: Partial<AppData> = {}): AppData =>
  ({
    schemaVersion: 8,
    cards: [],
    schedules: [],
    wordDetails: [],
    sentenceDetails: [],
    diaryEntries: [],
    grammarLessonsDone: [],
    ...overrides
  }) as unknown as AppData;

describe("F3 回马枪选题", () => {
  beforeEach(() => {
    clearGrammarTelemetry();
  });

  it("无弱点时降级：取当前课之前最近有案课的旧点，weakSpotTag 为 null", () => {
    const questions = buildAmbushQuestions(baseData(), "lesson-13-now", 1);
    expect(questions).toHaveLength(1);
    expect(questions[0].weakSpotTag).toBeNull();
    // L13 之前最近有 huntCase 的课是 L12（hunt-because-so / hunt-word-order）
    expect(questions[0].sourceLessonId).toBe("lesson-12-will");
    expect(questions[0].promptZh).toContain("回马一枪");
  });

  it("有弱点时优先按弱点罪名出题，weakSpotTag 非空", () => {
    // 制造 sv_agreement 弱点（hunt 归错罪名）
    appendGrammarEvent({
      kind: "hunt_verdict",
      caseId: "hunt-my-sister",
      tokenIndex: 0,
      verdictKind: "wrongTag",
      guessedTag: "sv_agreement",
      ts: new Date().toISOString()
    });
    const questions = buildAmbushQuestions(baseData(), "lesson-13-now", 1);
    expect(questions).toHaveLength(1);
    expect(questions[0].weakSpotTag).toBe("sv_agreement");
    // 抽中的植错点罪名必须是 sv_agreement
    expect(questions[0].error.tag).toBe("sv_agreement");
  });

  it("excludeCaseIds：本关正文已用案件不再出回马枪", () => {
    const all = buildAmbushQuestions(baseData(), "lesson-13-now", 1);
    const excluded = buildAmbushQuestions(baseData(), "lesson-13-now", 1, [all[0].caseItem.id]);
    expect(excluded[0].caseItem.id).not.toBe(all[0].caseItem.id);
  });

  it("count=2：弱点 + 降级补足，同案不重复", () => {
    appendGrammarEvent({
      kind: "hunt_verdict",
      caseId: "hunt-breakfast",
      tokenIndex: 0,
      verdictKind: "wrongTag",
      guessedTag: "article",
      ts: new Date().toISOString()
    });
    const questions = buildAmbushQuestions(baseData(), "lesson-13-now", 2);
    expect(questions).toHaveLength(2);
    const caseIds = questions.map((q) => q.caseItem.id);
    expect(new Set(caseIds).size).toBe(2); // 同案不重复
  });

  it("judgeAmbushPick：点中 tokenIndex 即中", () => {
    const questions = buildAmbushQuestions(baseData(), "lesson-13-now", 1);
    const q = questions[0];
    expect(judgeAmbushPick(q, q.error.tokenIndex)).toBe(true);
    expect(judgeAmbushPick(q, q.error.tokenIndex + 1)).toBe(false);
  });

  it("第 1 课（之前无课）：降级到任意可用案件，不报错", () => {
    const questions = buildAmbushQuestions(baseData(), "lesson-01-am", 1);
    expect(questions).toHaveLength(1);
    expect(questions[0].weakSpotTag).toBeNull();
  });
});

// ── F1 关 2/关 3 内容来源（2026-09-13 PRD §6.1）─────────────────────────
describe("F1 关 2 回访问卷（buildRevisitQuiz）", () => {
  it("核心句 rebuild 第 1 题 + variants 轮换，题量 3–5", () => {
    const quiz = buildRevisitQuiz("lesson-13-now");
    expect(quiz.length).toBeGreaterThanOrEqual(3);
    expect(quiz.length).toBeLessThanOrEqual(5);
    // 第 1 题是核心句 rebuild
    expect(quiz[0].kind).toBe("rebuild");
    expect(quiz[0].answer).toBe("I am drawing a picture.");
    expect(quiz[0].rebuildTokens?.length).toBeGreaterThan(0);
  });

  it("cloze 题抽语法关键词，含 ___ 占位与答案词", () => {
    const quiz = buildRevisitQuiz("lesson-13-now");
    const cloze = quiz.find((q) => q.kind === "cloze");
    expect(cloze).toBeDefined();
    expect(cloze?.clozeText).toContain("___");
    expect(cloze?.clozeAnswer).toBeTruthy();
  });

  it("rebuild 词块确定性打乱（同句同序，可回放）", () => {
    const a = buildRevisitQuiz("lesson-13-now");
    const b = buildRevisitQuiz("lesson-13-now");
    expect(a[0].rebuildTokens).toEqual(b[0].rebuildTokens);
  });

  it("未知课程：返回空数组", () => {
    expect(buildRevisitQuiz("lesson-99-nope")).toEqual([]);
  });
});

describe("F1 关 3 旧案重审配置（buildStage3CasePlan）", () => {
  it("L13：新案 = 本课 2 案，旧案变式 = 30–50% 混入（≥1 案）", () => {
    const plan = buildStage3CasePlan("lesson-13-now");
    expect(plan.newCases.map((c) => c.id)).toEqual(["hunt-kitchen-note", "hunt-school-show"]);
    // 2 新案 × 40% ≈ 1 旧案
    expect(plan.revisitCases.length).toBeGreaterThanOrEqual(1);
    // 旧案不能与本课新案重复
    const newIds = new Set(plan.newCases.map((c) => c.id));
    plan.revisitCases.forEach((c) => expect(newIds.has(c.id)).toBe(false));
  });

  it("L1（之前无课）：只有新案，旧案为空", () => {
    const plan = buildStage3CasePlan("lesson-01-am");
    expect(plan.newCases.map((c) => c.id)).toEqual(["hunt-call-mother"]);
    expect(plan.revisitCases).toEqual([]);
  });

  it("L24（最后课）：旧案池最大，混入比例正确", () => {
    const plan = buildStage3CasePlan("lesson-24-past-vs-perfect");
    expect(plan.newCases.length).toBeGreaterThan(0);
    // 旧案数 ≤ 新案数 × 50%（上限）
    expect(plan.revisitCases.length).toBeLessThanOrEqual(Math.max(1, Math.ceil(plan.newCases.length * 0.5)));
  });
});
