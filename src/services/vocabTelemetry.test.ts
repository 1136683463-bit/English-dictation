import { beforeEach, describe, expect, it } from "vitest";
import {
  appendVocabEvent,
  buildVocabTelemetryExport,
  clearVocabTelemetry,
  getVocabTelemetryStats,
  listVocabEvents,
  listVocabEventsByKind,
  summarizeVocabTelemetry
} from "./vocabTelemetry";

describe("vocabTelemetry（PRD-wordbook-v2 P0-1）", () => {
  beforeEach(() => {
    clearVocabTelemetry();
  });

  it("追加后可按类型读回事件", () => {
    appendVocabEvent({
      kind: "unit_created",
      unitId: "unit-1",
      source: "file_import",
      bookTitle: "高频核心",
      batchSize: 2,
      wordCount: 23,
      ts: "2026-09-13T00:00:00.000Z"
    });
    appendVocabEvent({
      kind: "unit_detail_open",
      unitId: "unit-1",
      ts: "2026-09-13T00:01:00.000Z"
    });

    expect(listVocabEvents()).toHaveLength(2);
    const created = listVocabEventsByKind("unit_created");
    expect(created).toHaveLength(1);
    expect(created[0].source).toBe("file_import");
    expect(listVocabEventsByKind("import_started")).toHaveLength(0);
  });

  it("汇总：建书来源分布与导入漏斗", () => {
    appendVocabEvent({ kind: "unit_created", unitId: "u1", source: "file_import", bookTitle: "A", batchSize: 1, wordCount: 20, ts: "t" });
    appendVocabEvent({ kind: "unit_created", unitId: "u2", source: "custom_book", bookTitle: "B", batchSize: 1, wordCount: 15, ts: "t" });
    appendVocabEvent({ kind: "unit_created", unitId: "u3", source: "file_import", bookTitle: "C", batchSize: 1, wordCount: 10, ts: "t" });
    appendVocabEvent({ kind: "import_started", fileName: "a.txt", format: "txt", ts: "t" });
    appendVocabEvent({ kind: "import_previewed", fileName: "a.txt", chapters: 2, words: 100, failRows: 3, ts: "t" });
    appendVocabEvent({ kind: "import_confirmed", fileName: "a.txt", chapters: 2, words: 100, failRows: 3, ts: "t" });
    appendVocabEvent({ kind: "import_started", fileName: "b.csv", format: "csv", ts: "t" });

    const summary = summarizeVocabTelemetry();
    expect(summary.unitsCreated).toBe(3);
    expect(summary.unitsCreatedBySource.file_import).toBe(2);
    expect(summary.unitsCreatedBySource.custom_book).toBe(1);
    expect(summary.importFunnel).toEqual({ started: 2, previewed: 1, confirmed: 1 });
  });

  it("汇总：首学转化 72h 口径与平均滞后", () => {
    appendVocabEvent({ kind: "first_learning_after_create", unitId: "u1", lagHours: 10, ts: "t" });
    appendVocabEvent({ kind: "first_learning_after_create", unitId: "u2", lagHours: 80, ts: "t" });

    const summary = summarizeVocabTelemetry();
    expect(summary.firstLearning.units).toBe(2);
    expect(summary.firstLearning.within72h).toBe(1);
    expect(summary.firstLearning.within72hRate).toBe(0.5);
    expect(summary.firstLearning.avgLagHours).toBe(45);
  });

  it("汇总：复习会话中途退出率（started 无配对 completed）", () => {
    appendVocabEvent({ kind: "review_session_started", sessionId: "s1", mode: "standard", unitId: "u1", cardsPlanned: 30, ts: "t" });
    appendVocabEvent({
      kind: "review_session_completed",
      sessionId: "s1",
      mode: "standard",
      unitId: "u1",
      cardsPlanned: 30,
      cardsDone: 32,
      abandoned: false,
      durationMs: 60000,
      ts: "t"
    });
    appendVocabEvent({ kind: "review_session_started", sessionId: "s2", mode: "mistakes", unitId: null, cardsPlanned: 10, ts: "t" });
    appendVocabEvent({ kind: "review_session_started", sessionId: "s3", mode: "standard", unitId: "u2", cardsPlanned: 20, ts: "t" });

    const summary = summarizeVocabTelemetry();
    expect(summary.reviewSessions.started).toBe(3);
    expect(summary.reviewSessions.completed).toBe(1);
    expect(summary.reviewSessions.abandonmentRate).toBeCloseTo(2 / 3);
  });

  it("library_view 与 unit_detail_open 计数", () => {
    appendVocabEvent({ kind: "library_view", filter: "all", ts: "t" });
    appendVocabEvent({ kind: "library_view", filter: "due", ts: "t" });
    appendVocabEvent({ kind: "unit_detail_open", unitId: "u1", ts: "t" });

    const summary = summarizeVocabTelemetry();
    expect(summary.libraryViews).toBe(2);
    expect(summary.unitDetailOpens).toBe(1);
    expect(summary.totalEvents).toBe(3);
  });

  it("存量统计与导出快照结构", () => {
    appendVocabEvent({ kind: "library_view", filter: "all", ts: "2026-09-13T00:00:00.000Z" });

    const stats = getVocabTelemetryStats();
    expect(stats.activeEvents).toBe(1);
    expect(stats.maxEvents).toBe(3000);
    expect(stats.nearCapacity).toBe(false);

    const exportJson = JSON.parse(buildVocabTelemetryExport());
    expect(exportJson.version).toBe(1);
    expect(exportJson.events).toHaveLength(1);
    expect(exportJson.stats.lastEventAt).toBe("2026-09-13T00:00:00.000Z");
    expect(Array.isArray(exportJson.archivedEvents)).toBe(true);
  });

  it("清空后读不到任何事件", () => {
    appendVocabEvent({ kind: "library_view", filter: "all", ts: "t" });
    clearVocabTelemetry();
    expect(listVocabEvents()).toHaveLength(0);
  });
});
