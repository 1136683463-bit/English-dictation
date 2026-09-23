// @vitest-environment jsdom
/**
 * PF5 · 首屏同步耗时分解
 *
 * 把一个「真实体量」的应用数据写进 localStorage，然后逐段计时：
 *   ① JSON.parse（读缓存）→ ② migrateData（归一化全库，逐字段）
 *   → ③ seedCoreWords / ensureDefaultUnits（种子词 + 默认词书）
 *   → ④ applyStartupMigration → ⑤ summarizeStartupRepairs
 *   → ⑥ writeRaw（写回磁盘，JSON.stringify 全库）
 *   → ⑦ AppProvider 首次渲染（loadData 的完整代价）
 *
 * ⚠️ 所有毫秒数都是 jsdom 观测值。jsdom 的 JSON.parse / 数组遍历
 * 与真实浏览器同为 V8，故**纯计算段（迁移/序列化）的相对比例**可信；
 * 但 DOM 相关段在 jsdom 里显著偏慢，不可外推到浏览器。
 *
 * 另附：AppProvider mount 时除 loadData 之外还做了什么（遥测读取、种子词写入等）。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { act } from "react";
import { resetStorage, mountPage } from "../harness";
import { seedAppData, makeSentenceCard, cardsToData, PAST_ISO, STORAGE_KEY } from "./fixtures";
import { makeAppData } from "./fixtures";
import { migrateData, loadData, saveData } from "../../services/storage";

const settle = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

/** 造一份「长期用户」体量：197 课完成 + 大量卡/计划/复习记录/日记/案件记录。 */
const buildHeavyRaw = () => {
  const fixtures = Array.from({ length: 400 }, (_, index) =>
    makeSentenceCard({
      id: `card-${index}`,
      sentence: `I am learning sentence number ${index} today.`,
      schedule: { nextReviewAt: PAST_ISO, reviewCount: index % 5, intervalDays: (index % 20) + 1 }
    })
  );
  const { cards, schedules, sentenceDetails } = cardsToData(fixtures);
  return makeAppData({
    cards,
    schedules,
    sentenceDetails,
    grammarLessonsDone: Array.from({ length: 197 }, (_, index) => `lesson-${index + 1}`),
    reviews: Array.from({ length: 3000 }, (_, index) => ({
      id: `review-${index}`,
      cardId: `card-${index % 400}`,
      mode: "recognize" as const,
      rating: ((index % 4) + 1) as 1 | 2 | 3 | 4,
      answer: "",
      diffJson: "[]",
      reviewedAt: new Date(Date.now() - index * 3_600_000).toISOString()
    })),
    diaryEntries: Array.from({ length: 60 }, (_, index) => ({
      id: `entry-${index}`,
      dateKey: `2026-0${(index % 9) + 1}-1${index % 10}`,
      questionId: `q-${index % 20}`,
      questionZh: "今天做了什么？",
      answerEn: `Today I go to school and I see my friend number ${index}.`,
      correctedEn: `Today I went to school and I saw my friend number ${index}.`,
      createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
      status: "done" as const,
      issues: []
    }))
  });
};

const timeIt = <T,>(label: string, fn: () => T, iterations = 3): { ms: number; value: T } => {
  fn(); // 预热
  const start = performance.now();
  let value: T;
  for (let index = 0; index < iterations; index += 1) value = fn();
  const ms = (performance.now() - start) / iterations;
  console.log(`  ${label}: ${ms.toFixed(2)}ms（jsdom，${iterations} 次均值）`);
  return { ms, value: value! };
};

describe("PF5 · 首屏同步耗时分解", () => {
  beforeEach(() => resetStorage());

  it("分解：JSON.parse / migrateData / seedCoreWords / writeRaw 各自的耗时", async () => {
    const raw = buildHeavyRaw();
    const json = JSON.stringify(raw);
    console.log(
      `【数据体量】JSON ${(json.length / 1024).toFixed(0)}KB / 卡 ${raw.cards.length} / 计划 ${raw.schedules.length} / 复习 ${raw.reviews.length} / 日记 ${raw.diaryEntries.length} / 完成课 ${raw.grammarLessonsDone.length}`
    );

    const parse = timeIt("① JSON.parse（localStorage 读入）", () => JSON.parse(json) as ReturnType<typeof makeAppData>);
    const migrate = timeIt("② migrateData（全库归一化）", () => migrateData(json));
    const stringify = timeIt("③ JSON.stringify（写回盘）", () => JSON.stringify(migrate.value));
    const repairs = timeIt("④ summarizeStartupRepairs（启动修复对账）", async () => {
      const storage = await import("../../services/storage");
      return storage.summarizeStartupRepairs(json, migrate.value);
    });

    // 完整 loadData（含 parse + migrate + repairs + writeRaw）
    window.localStorage.setItem(STORAGE_KEY, json);
    const full = timeIt("⑤ loadData（完整首屏同步读入）", () => loadData());

    const total = parse.ms + migrate.ms + stringify.ms;
    console.log("【同步耗时构成】");
    console.log(`  JSON.parse      ${parse.ms.toFixed(2)}ms  ${((parse.ms / total) * 100).toFixed(0)}%`);
    console.log(`  migrateData     ${migrate.ms.toFixed(2)}ms  ${((migrate.ms / total) * 100).toFixed(0)}%`);
    console.log(`  JSON.stringify  ${stringify.ms.toFixed(2)}ms  ${((stringify.ms / total) * 100).toFixed(0)}%`);
    console.log(`  loadData 合计   ${full.ms.toFixed(2)}ms`);
    console.log(`  （另：summarizeStartupRepairs 是 async 包装，见下方子段）`);
    void repairs;
    expect(migrate.value.cards.length).toBeGreaterThan(0);
  });

  it("migrateData 内部逐字段耗时（哪一段最贵）", async () => {
    const raw = buildHeavyRaw();
    const json = JSON.stringify(raw);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    const storage = await import("../../services/storage");

    // 分字段构造：把除目标字段外的部分清零，看各字段归一化的边际成本
    const isolated = (label: string, patch: Record<string, unknown>) => {
      const variant = JSON.stringify({ ...parsed, ...patch });
      timeIt(`仅 ${label}`, () => storage.migrateData(variant), 3);
    };
    console.log("【migrateData 分段成本】");
    timeIt("全量（基准）", () => storage.migrateData(json), 3);
    isolated("cards（400）", { reviews: [], schedules: [], sentenceDetails: [] });
    isolated("reviews（3000）", { cards: [], schedules: [], sentenceDetails: [], diaryEntries: [] });
    isolated("diaryEntries（60）", { cards: [], schedules: [], sentenceDetails: [], reviews: [] });
    isolated("空数据", { cards: [], schedules: [], sentenceDetails: [], reviews: [], diaryEntries: [], grammarLessonsDone: [] });
    expect(true).toBe(true);
  });

  it("AppProvider 挂载：loadData 之外还同步做了什么（遥测读取 / 种子词写入）", async () => {
    const raw = buildHeavyRaw();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    // 预置遥测，观察挂载阶段是否被同步读取
    const telemetry = Array.from({ length: 2000 }, (_, index) => ({
      kind: "grammar_lesson_completed",
      lessonId: `lesson-${(index % 197) + 1}`,
      completedAt: new Date(Date.now() - index * 3_600_000).toISOString(),
      ts: new Date(Date.now() - index * 3_600_000).toISOString()
    }));
    window.localStorage.setItem(
      "grammar-telemetry-events-v1",
      JSON.stringify({ version: 1, events: telemetry })
    );

    const setItemCalls: Array<{ key: string; bytes: number }> = [];
    let getItemCalls = 0;
    // jsdom 的 Storage 实例属性是 getter，直接赋值不生效——必须改 Storage.prototype。
    const originalSetItem = Storage.prototype.setItem;
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.setItem = function patchedSetItem(key: string, value: string) {
      setItemCalls.push({ key, bytes: value.length });
      return originalSetItem.call(this, key, value);
    };
    Storage.prototype.getItem = function patchedGetItem(key: string) {
      getItemCalls += 1;
      return originalGetItem.call(this, key);
    };

    try {
      const start = performance.now();
      const GrammarPathPage = (await import("../../pages/GrammarPathPage")).default;
      const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
      const mountMs = performance.now() - start;
      await settle();

      console.log("【AppProvider + 语法地图挂载】");
      console.log(`  挂载耗时 ${mountMs.toFixed(1)}ms（jsdom，单次观测，含模块冷启动）`);
      console.log(`  localStorage.getItem 调用 ${getItemCalls} 次`);
      console.log(`  localStorage.setItem 调用 ${setItemCalls.length} 次：`);
      for (const call of setItemCalls) {
        console.log(`    ${call.key} — ${(call.bytes / 1024).toFixed(0)}KB`);
      }
      const storageWrites = setItemCalls.filter((call) => call.key === STORAGE_KEY);
      const telemetryWrites = setItemCalls.filter((call) => call.key.startsWith("grammar-telemetry"));
      console.log(
        `  → 主数据写盘 ${storageWrites.length} 次（共 ${(storageWrites.reduce((sum, c) => sum + c.bytes, 0) / 1024).toFixed(0)}KB），遥测写盘 ${telemetryWrites.length} 次`
      );
      page.unmount();
    } finally {
      Storage.prototype.setItem = originalSetItem;
      Storage.prototype.getItem = originalGetItem;
    }
    expect(true).toBe(true);
  });

  it("语文地图挂载：种子词/默认词书是否每次都跑（同一份数据二次挂载）", async () => {
    const raw = buildHeavyRaw();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    const GrammarPathPage = (await import("../../pages/GrammarPathPage")).default;

    const times: number[] = [];
    for (let round = 0; round < 3; round += 1) {
      const start = performance.now();
      const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
      times.push(performance.now() - start);
      await settle();
      page.unmount();
    }
    console.log(`【语法地图连续 3 次挂载】${times.map((t) => t.toFixed(1)).join("ms / ")}ms（jsdom）`);

    // loadData 是幂等的吗：连续调用两次，比较耗时
    const first = performance.now();
    loadData();
    const firstMs = performance.now() - first;
    const second = performance.now();
    loadData();
    const secondMs = performance.now() - second;
    console.log(`【loadData 连调】第一次 ${firstMs.toFixed(2)}ms，第二次 ${secondMs.toFixed(2)}ms（jsdom）`);
    expect(times.length).toBe(3);
  });

  it("遥测重解析：一次挂载把 259KB 遥测 JSON 解析多少次", async () => {
    const raw = buildHeavyRaw();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    const telemetry = Array.from({ length: 2000 }, (_, index) => ({
      kind: "hunt_verdict",
      caseId: `case-${index % 206}`,
      tokenIndex: index % 10,
      verdictKind: "wrongTag",
      guessedTag: "sv_agreement",
      ts: new Date(Date.now() - index * 3_600_000).toISOString()
    }));
    const telemetryJson = JSON.stringify({ version: 1, events: telemetry });
    window.localStorage.setItem("grammar-telemetry-events-v1", telemetryJson);
    console.log(`【遥测体量】${(telemetryJson.length / 1024).toFixed(0)}KB / ${telemetry.length} 条`);

    // 一次 JSON.parse(遥测) 的单价
    timeIt("JSON.parse(遥测 259KB) 单次", () => JSON.parse(telemetryJson), 10);

    const telemetryReads: number[] = [];
    let parsing = false;
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function patchedGetItem(key: string) {
      const value = originalGetItem.call(this, key);
      if (key === "grammar-telemetry-events-v1") telemetryReads.push(value?.length ?? 0);
      return value;
    };

    try {
      const GrammarPathPage = (await import("../../pages/GrammarPathPage")).default;
      const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
      await settle();
      console.log(`  挂载 + 回填落定期间，遥测被读取 ${telemetryReads.length} 次`);
      console.log(
        `  → 每次读取都伴随一次 JSON.parse（readEvents 无缓存），合计解析 ${(
          (telemetryReads.reduce((sum, bytes) => sum + bytes, 0) /
            1024 /
            1024)
        ).toFixed(1)}MB 文本`
      );
      page.unmount();
    } finally {
      Storage.prototype.getItem = originalGetItem;
      void parsing;
    }
    expect(telemetryReads.length).toBeGreaterThan(0);
  });

  it("saveData 每次落盘都重新迁移全库（写盘路径的隐性成本）", async () => {
    const raw = buildHeavyRaw();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    const data = loadData();
    console.log("【写盘路径】updateData 的每次提交都走 saveData → migrateData(raw 全库) + JSON.stringify");
    const save = timeIt("saveData(data)（全库迁移 + 序列化 + 写盘）", () => saveData(data), 5);
    const onlyStringify = timeIt("仅 JSON.stringify(data)（对照）", () => JSON.stringify(data), 5);
    console.log(
      `  → saveData 是纯序列化的 ${(save.ms / Math.max(0.01, onlyStringify.ms)).toFixed(1)}×（多出的部分 = migrateData 全库归一化）`
    );
    expect(save.ms).toBeGreaterThan(0);
  });
});
