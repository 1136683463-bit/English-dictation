import { describe, expect, it } from "vitest";
import type { AppData, DiaryEntry } from "../types";
import {
  addDiarySentenceToReview,
  applyDiaryCorrection,
  listDiaryEntries,
  markDiaryCorrectionFailed,
  pickDailyDiaryQuestions,
  requestDiaryCorrection,
  saveDiaryEntry,
  summarizeDiaryProgress
} from "./diaryService";
import { makeTestData } from "./testUtils";
import { getLocalDateKey } from "./mistakeBookService";

const baseData = (): AppData => makeTestData();

const question = { id: "d-today-feel", zh: "你现在的心情怎么样？" };

const makeEntry = (patch: Partial<DiaryEntry> = {}): DiaryEntry => ({
  id: "diary_1",
  dateKey: "2026-09-12",
  questionId: "d-today-feel",
  questionZh: "你现在的心情怎么样？",
  answerEn: "I am happy today.",
  correctedEn: "",
  issues: [],
  status: "pending",
  createdAt: "2026-09-12T10:00:00.000Z",
  ...patch
});

describe("diaryService", () => {
  it("每日抽题：同一天稳定，不同天大概率不同，数量正确", () => {
    const dayA = pickDailyDiaryQuestions("2026-09-12", 3);
    const dayAagain = pickDailyDiaryQuestions("2026-09-12", 3);
    const dayB = pickDailyDiaryQuestions("2026-09-13", 3);

    expect(dayA).toHaveLength(3);
    expect(dayAagain.map((item) => item.id)).toEqual(dayA.map((item) => item.id));
    expect(dayB.map((item) => item.id)).not.toEqual(dayA.map((item) => item.id));
  });

  it("保存日记：同一天同一问题覆盖更新，不同问题追加", () => {
    let data = baseData();
    const first = saveDiaryEntry(data, { dateKey: "2026-09-12", question, answerEn: "I am happy." });
    data = first.data;
    expect(data.diaryEntries).toHaveLength(1);
    expect(data.diaryEntries[0].status).toBe("pending");

    const rewritten = saveDiaryEntry(data, { dateKey: "2026-09-12", question, answerEn: "I am very happy today." });
    expect(rewritten.data.diaryEntries).toHaveLength(1);
    expect(rewritten.data.diaryEntries[0].answerEn).toBe("I am very happy today.");

    const other = saveDiaryEntry(rewritten.data, {
      dateKey: "2026-09-12",
      question: { id: "d-like-food", zh: "你最喜欢吃什么？" },
      answerEn: "I like noodles."
    });
    expect(other.data.diaryEntries).toHaveLength(2);

    expect(() => saveDiaryEntry(data, { dateKey: "2026-09-12", question, answerEn: "   " })).toThrow();
  });

  it("批改写回：状态变 done，失败标记不影响原句", () => {
    let data = baseData();
    const saved = saveDiaryEntry(data, { dateKey: "2026-09-12", question, answerEn: "I drink three cup of tea." });
    data = saved.data;
    const entry = data.diaryEntries[0];

    data = applyDiaryCorrection(data, entry.id, "I drank three cups of tea.", [
      { original: "drink", correction: "drank", explanation: "说的是今天已经发生的事，用过去式。" }
    ]);
    expect(data.diaryEntries[0].status).toBe("done");
    expect(data.diaryEntries[0].correctedEn).toContain("drank");
    expect(data.diaryEntries[0].issues[0].explanation).not.toContain("错误");

    data = markDiaryCorrectionFailed(data, entry.id, "网络不给力");
    expect(data.diaryEntries[0].note).toBe("网络不给力");
    expect(data.diaryEntries[0].answerEn).toBe("I drink three cup of tea.");
  });

  it("日记句子进复习队列：优先用批改后的句子，幂等去重", () => {
    let data = baseData();
    const saved = saveDiaryEntry(data, { dateKey: "2026-09-12", question, answerEn: "I drink three cup of tea." });
    data = saved.data;
    const entry = data.diaryEntries[0];
    data = applyDiaryCorrection(data, entry.id, "I drank three cups of tea.", []);
    data = addDiarySentenceToReview(data, data.diaryEntries[0]);

    const sentenceCards = data.cards.filter((card) => card.type === "sentence");
    expect(sentenceCards).toHaveLength(1);
    expect(sentenceCards[0].front).toBe("I drank three cups of tea.");
    expect(sentenceCards[0].sourceId).toBe(`diary:${entry.id}`);

    const again = addDiarySentenceToReview(data, data.diaryEntries[0]);
    expect(again.cards.filter((card) => card.type === "sentence")).toHaveLength(1);
  });

  it("进度汇总：条数、天数、今日条数、已批改数", () => {
    // 用真实的「今天 / 昨天」日期键，避免测试跨天失效
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const todayKey = getLocalDateKey(today);
    const yesterdayKey = getLocalDateKey(yesterday);

    let data = baseData();
    data = saveDiaryEntry(data, { dateKey: todayKey, question, answerEn: "I am happy." }).data;
    data = saveDiaryEntry(data, {
      dateKey: todayKey,
      question: { id: "d-like-food", zh: "你最喜欢吃什么？" },
      answerEn: "I like noodles."
    }).data;
    data = saveDiaryEntry(data, {
      dateKey: yesterdayKey,
      question: { id: "d-like-food", zh: "你最喜欢吃什么？" },
      answerEn: "I like rice."
    }).data;
    data = applyDiaryCorrection(data, data.diaryEntries[0].id, "I am happy.", []);

    const summary = summarizeDiaryProgress(data);
    expect(summary.totalEntries).toBe(3);
    expect(summary.days).toBe(2);
    expect(summary.correctedCount).toBe(1);
    expect(summary.todayCount).toBe(2);
  });

  it("列表按时间倒序（显式时间戳，不依赖 nowIso 的毫秒差）", () => {
    const older = makeEntry({
      id: "diary_old",
      dateKey: "2026-09-11",
      answerEn: "I am fine.",
      createdAt: "2026-09-11T10:00:00.000Z"
    });
    const newer = makeEntry({
      id: "diary_new",
      dateKey: "2026-09-12",
      answerEn: "I am great.",
      createdAt: "2026-09-12T10:00:00.000Z"
    });
    const data = makeTestData({ diaryEntries: [older, newer] });
    const entries = listDiaryEntries(data);
    expect(entries[0].answerEn).toBe("I am great.");
    expect(entries[1].answerEn).toBe("I am fine.");
  });

  it("未配置 AI 时批改请求直接给出可理解的提示", async () => {
    await expect(requestDiaryCorrection(makeTestData().settings.aiProvider, "问题", "I am happy.")).rejects.toThrow(
      /AI/
    );
  });
});
