// @vitest-environment node
/**
 * EX4 · 考试数据模型与 migrateData 归一化（P0-1）
 *
 * 规格：PRD §11.1 数据模型 ｜ §11.2 白名单归一化 ｜ §11.3 不升 APP_SCHEMA_VERSION ｜ §12.1 G2
 *
 * 为什么这份用例是必须的：`knownAppDataKeys` 是**显式白名单**，
 * 未登记的键在每次 save 时会被**静默吃掉**（`storage.ts` 里已记录过 `dynamicKind`
 * 与三个 settings 字段被吃掉的先例）。若 examSessions 被吃掉，
 * 用户「中途退出、下次接着答」的进度就没了——而中断续做是 P0（§4.7），
 * 所以这不是「存不存得住」的小事，是功能成立与否。
 */
import { describe, expect, it } from "vitest";
import { APP_SCHEMA_VERSION, migrateData } from "../../services/storage";
import type { AppData, ExamSession } from "../../types";

const base = (extra: Record<string, unknown>) => ({
  schemaVersion: APP_SCHEMA_VERSION,
  grammarLessonsDone: [],
  seededWordVersions: ["core-100-v1"],
  ...extra
});

const session = (overrides: Partial<ExamSession> = {}): ExamSession => ({
  paperId: "season-1-v1",
  seasonId: "season-1",
  variantIndex: 0,
  startedAt: "2026-09-24T10:00:00.000Z",
  updatedAt: "2026-09-24T10:12:00.000Z",
  cursor: { section: 2, index: 3 },
  results: [
    {
      itemId: "exam-mcq-choose-lesson-01-am-0",
      section: 1,
      kind: "mcq",
      answer: "am",
      passed: true,
      score: 100,
      durationMs: 8200,
      sourceLessonId: "lesson-01-am",
      answeredAt: "2026-09-24T10:01:00.000Z"
    }
  ],
  revealedSections: [1],
  ...overrides
});

const migrated = (raw: unknown): AppData => migrateData(raw);

describe("EX4 考试数据模型：migrateData 往返", () => {
  it("G2 examSessions 原样存活（中断续做的 cursor 与 results 不能丢）", () => {
    const data = migrated(base({ examSessions: { "season-1-v1": session() } }));
    const kept = data.examSessions?.["season-1-v1"];
    expect(kept, "examSessions 被白名单吃掉了").toBeTruthy();
    expect(kept!.cursor).toEqual({ section: 2, index: 3 });
    expect(kept!.results.length).toBe(1);
    expect(kept!.results[0].itemId).toBe("exam-mcq-choose-lesson-01-am-0");
    expect(kept!.results[0].passed).toBe(true);
    expect(kept!.revealedSections).toEqual([1]);
    expect(kept!.seasonId).toBe("season-1");
  });

  it("examDisputes 原样存活（异议只记录、可复核）", () => {
    const data = migrated(
      base({
        examDisputes: [
          {
            id: "d1",
            paperId: "season-1-v1",
            itemId: "exam-zh2en-practice-lesson-10-went-0",
            claim: "我这句也对",
            createdAt: "2026-09-24T10:20:00.000Z"
          }
        ]
      })
    );
    expect(data.examDisputes?.length).toBe(1);
    expect(data.examDisputes?.[0].claim).toBe("我这句也对");
  });

  it("写作作答与 AI 批改结果存活（降级标记也要留）", () => {
    const data = migrated(
      base({
        examSessions: {
          "season-1-v1": session({
            writing: {
              text: "Sunday was sunny. I went to the park.",
              issues: [{ original: "I go", correction: "I went", explanation: "说的是昨天", tag: "时态" }],
              degraded: true,
              degradeReason: "timeout"
            }
          })
        }
      })
    );
    const writing = data.examSessions?.["season-1-v1"]?.writing;
    expect(writing?.text).toContain("Sunday was sunny");
    expect(writing?.issues?.[0].correction).toBe("I went");
    expect(writing?.degraded).toBe(true);
    expect(writing?.degradeReason).toBe("timeout");
  });

  it("§11.3：不升 APP_SCHEMA_VERSION（旧 blob 缺字段即视为无考试记录）", () => {
    expect(APP_SCHEMA_VERSION).toBe(8);
    const data = migrated(base({}));
    expect(data.schemaVersion).toBe(8);
  });

  it("旧数据不下发空键：没有考试记录时，两个键都不出现（保持旧 blob 形状）", () => {
    const data = migrated(base({}));
    expect("examSessions" in data, "无值时不得下发 examSessions").toBe(false);
    expect("examDisputes" in data, "无值时不得下发 examDisputes").toBe(false);
  });

  it("坏输入一律降级、绝不抛错（非对象 / 非法节号 / 超长文本 / 超量异议）", () => {
    const data = migrated(
      base({
        examSessions: {
          good: session({
            cursor: { section: 9 as never, index: -5 },
            results: [
              { itemId: "x", section: 7 as never, kind: "nope" as never, answer: "a".repeat(9000), passed: "yes" as never, score: 999, durationMs: -3, sourceLessonId: "", answeredAt: "not-a-date" },
              { itemId: "", section: 1, kind: "mcq", answer: "", passed: true, score: 0, durationMs: 0, sourceLessonId: "", answeredAt: "" }
            ],
            revealedSections: [1, 9 as never, 1]
          }),
          notARecord: 42,
          "": session()
        },
        examDisputes: "not-an-array"
      })
    );
    const kept = data.examSessions?.good;
    expect(kept, "合法的 key 应保留").toBeTruthy();
    expect(kept!.cursor.section, "非法节号回落 1").toBe(1);
    expect(kept!.cursor.index, "负数下标回落 0").toBe(0);
    expect(kept!.results.length, "itemId 为空的那条被丢弃").toBe(1);
    expect(kept!.results[0].answer.length, "自由输入必须截断").toBeLessThanOrEqual(4000);
    expect(kept!.results[0].score, "score 夹在 0–100").toBe(100);
    expect(kept!.results[0].durationMs, "负时长回落 0").toBe(0);
    expect(kept!.revealedSections, "非法节号剔除且去重").toEqual([1]);
    expect(data.examSessions?.notARecord, "非对象条目丢弃").toBeUndefined();
    expect(data.examSessions?.[""], "空 key 丢弃").toBeUndefined();
    expect(data.examDisputes, "非数组降级为不下发").toBeUndefined();
  });

  it("迁移是幂等的：跑两遍结果一致（启动期每次 load 都会跑）", () => {
    const once = migrated(base({ examSessions: { "season-1-v1": session() } }));
    const twice = migrateData(JSON.parse(JSON.stringify(once)));
    expect(JSON.stringify(twice.examSessions)).toBe(JSON.stringify(once.examSessions));
  });
});
