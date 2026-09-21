/**
 * SM-2 审计 · 第 3 条：摘星 / 康复逻辑（recoveryCount / priority / PRIORITY_RECOVERY_THRESHOLD）。
 *
 * 重点核查：
 * ① `prioritySource === "manual"` 的卡是否真的永不被自动摘星；
 * ② 「手动标星」的所有入口是否都写了 prioritySource（markCardsPriority vs togglePriority）；
 * ③ priorityManual / prioritySystem 两个计数是否互斥；
 * ④ 康复计数在 rating 3/4 边界上与注释声明是否一致。
 */
import { describe, expect, it } from "vitest";
import { applyReview, applyReviewWithUndo, getLearningStats, markCardsPriority, PRIORITY_RECOVERY_THRESHOLD } from "../../services/reviewService";
import { togglePriority } from "../../services/cardService";
import { makeCard, makeSchedule, makeTestData, makeWordCard } from "../../services/testUtils";
import type { Card } from "../../types";

const day = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(Date.now() - n * day).toISOString();

const reviewCard = (id: string, patch: Partial<Card> = {}): Card => ({
  ...makeWordCard(id, id, id),
  status: "review",
  ...patch
});

describe("SM3-a 康复阈值与 rating 边界", () => {
  it("PRIORITY_RECOVERY_THRESHOLD = 2，注释声明「连续 2 次 rating>=3」", () => {
    expect(PRIORITY_RECOVERY_THRESHOLD).toBe(2);
  });

  it("isCorrectReview 的判定线是 rating >= 3：rating3 也计入康复（不只是 rating4）", () => {
    const card = reviewCard("c1", { priority: true, prioritySource: "system" });
    const data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "c1", lapseCount: 3 })] });

    const r3a = applyReviewWithUndo(data, card, "spelling", 3);
    const r3b = applyReviewWithUndo(r3a.data, r3a.data.cards[0], "spelling", 3);
    expect(r3a.data.schedules[0].recoveryCount).toBe(1);
    expect(r3b.data.cards[0].priority).toBe(false);
  });

  it("rating2 不算康复（清零），rating3/4 才算", () => {
    const card = reviewCard("c1", { priority: true, prioritySource: "system" });
    const data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "c1", lapseCount: 3 })] });

    const two = applyReviewWithUndo(data, card, "spelling", 2);
    expect(two.data.schedules[0].recoveryCount).toBe(0);
    expect(two.data.cards[0].priority).toBe(true); // 未摘

    const four = applyReviewWithUndo(data, card, "spelling", 4);
    expect(four.data.schedules[0].recoveryCount).toBe(1);
  });

  it("manual 卡不维护 recoveryCount 字段、永不摘星", () => {
    const card = reviewCard("c1", { priority: true, prioritySource: "manual" });
    let data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "c1", lapseCount: 5 })] });
    for (const rating of [3, 3, 4, 3, 4] as const) {
      data = applyReview(data, data.cards[0], "spelling", rating);
    }
    expect(data.cards[0].priority).toBe(true);
    expect(data.cards[0].prioritySource).toBe("manual");
    expect(data.schedules[0].recoveryCount).toBeUndefined();
  });
});

describe("SM3-b 【确认的缺陷】markCardsPriority 的手动标星会被自动摘掉", () => {
  /**
   * 「错词加入重点」按钮（SpellingPage.tsx:499）走 markCardsPriority，
   * 该函数设置 priority: true 但**不写 prioritySource**（reviewService.ts:393-405）。
   * 于是 participatesRecovery 的 `prioritySource !== "manual"` 判定把这张卡当成
   * 「legacy 无 source 的系统卡」（reviewService.ts:463 注释明说含 legacy 无 source），
   * 连续两次评分 >=3 后自动摘星 —— 用户手动加的重点被系统静默取消。
   *
   * 对照：cardService.togglePriority / setCardsPriority 写 prioritySource="manual"，
   * 同样的用户动作（点星）在两个入口语义不同。
   */
  it("markCardsPriority → 两次 rating3 → priority 变 false（用户加的重点消失）", () => {
    const card = reviewCard("c1");
    const data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "c1", lapseCount: 0 })] });

    const starred = markCardsPriority(data, ["c1"]);
    expect(starred.cards[0].priority).toBe(true);
    expect(starred.cards[0].prioritySource).toBeUndefined(); // ← 关键：没有 source

    const first = applyReviewWithUndo(starred, starred.cards[0], "spelling", 3);
    expect(first.data.cards[0].priority).toBe(true);
    expect(first.data.schedules[0].recoveryCount).toBe(1); // ← 竟然参与了康复计数

    const second = applyReviewWithUndo(first.data, first.data.cards[0], "spelling", 3);
    console.log(
      "SM3-b markCardsPriority 标星后两次答对:",
      JSON.stringify({ priority: second.data.cards[0].priority, source: second.data.cards[0].prioritySource })
    );
    expect(second.data.cards[0].priority).toBe(false); // ❌ 手动重点被摘
    expect(second.data.cards[0].prioritySource).toBeUndefined();
  });

  it("对照：cardService.togglePriority 的手动标星不会被摘", () => {
    const card = reviewCard("c1");
    const data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "c1", lapseCount: 0 })] });

    const starred = togglePriority(data, "c1");
    expect(starred.cards[0].prioritySource).toBe("manual");

    const first = applyReviewWithUndo(starred, starred.cards[0], "spelling", 3);
    const second = applyReviewWithUndo(first.data, first.data.cards[0], "spelling", 3);
    expect(second.data.cards[0].priority).toBe(true);
    expect(second.data.schedules[0].recoveryCount).toBeUndefined();
  });
});

describe("SM3-c 【确认的缺陷】priorityManual 与 prioritySystem 双计同一张卡", () => {
  /**
   * priorityManual = priority && source !== "system"
   * prioritySystem = priority && source !== "manual"
   * 对 source === undefined（markCardsPriority / legacy / normalizeCard 丢字段后）两者都为真。
   * 同一张卡同时出现在「我的重点」（LibraryPage 筛选）与「系统关注」两个统计里。
   */
  it("source 为 undefined 的 priority 卡同时被两个计数纳入", () => {
    const data = makeTestData({
      cards: [reviewCard("c1", { priority: true })], // source undefined
      schedules: [makeSchedule({ cardId: "c1" })]
    });
    const stats = getLearningStats(data);
    console.log(
      "SM3-c priority=", stats.priority,
      "priorityManual=", stats.priorityManual,
      "prioritySystem=", stats.prioritySystem
    );
    expect(stats.priority).toBe(1);
    expect(stats.priorityManual).toBe(1);
    expect(stats.prioritySystem).toBe(1);
    // 互斥性被破坏：1 张卡贡献了 2 个「阵营」计数
    expect(stats.priorityManual + stats.prioritySystem).toBeGreaterThan(stats.priority);
  });

  it("对照：有明确 source 时两计数互斥", () => {
    const data = makeTestData({
      cards: [
        reviewCard("m", { priority: true, prioritySource: "manual" }),
        reviewCard("s", { priority: true, prioritySource: "system" }),
        reviewCard("plain")
      ],
      schedules: [makeSchedule({ cardId: "m" }), makeSchedule({ cardId: "s" }), makeSchedule({ cardId: "plain" })]
    });
    const stats = getLearningStats(data);
    expect(stats.priority).toBe(2);
    expect(stats.priorityManual).toBe(1);
    expect(stats.prioritySystem).toBe(1);
  });
});

describe("SM3-d 【确认的缺陷】prioritySource 与其它 Card 可选字段在持久化时被丢弃", () => {
  /**
   * storage.normalizeCard（storage.ts:275-303）只重建白名单字段，未透传
   * prioritySource / suspendedFrom / mistakeGraduatedAt。
   * loadData → migrateData → saveData 每次启动都跑，所以这些字段在**第一次保存**后永久消失。
   * - prioritySource 丢失 → 手动标星退化为「legacy 系统卡」→ 参与康复、被自动摘星（与 SM3-b 合流）；
   * - mistakeGraduatedAt 丢失 → 动态错词书的「已毕业」标记失效，毕业过的词重新出现在错词本；
   * - suspendedFrom 丢失 → setCardsStatus 恢复暂停卡时回退到 "review" 而非原状态。
   */
  it("parseBackupJson（= loadData 的迁移管线）后 prioritySource/suspendedFrom/mistakeGraduatedAt 全部消失", async () => {
    const { parseBackupJson } = await import("../../services/storage");
    const raw = makeTestData({
      cards: [
        reviewCard("c1", { priority: true, prioritySource: "manual", mistakeGraduatedAt: daysAgo(1) }),
        reviewCard("c2", { status: "suspended", suspendedFrom: "mastered" })
      ],
      schedules: [makeSchedule({ cardId: "c1" }), makeSchedule({ cardId: "c2" })]
    });

    const migrated = parseBackupJson(JSON.stringify(raw));
    const asRecord = (card: Card) => card as unknown as Record<string, unknown>;
    console.log("SM3-d 输入:", JSON.stringify(raw.cards.map((c) => asRecord(c))));
    console.log("SM3-d 迁移后:", JSON.stringify(migrated.cards.map((c) => asRecord(c))));

    expect(asRecord(migrated.cards[0]).prioritySource).toBeUndefined();
    expect(asRecord(migrated.cards[0]).mistakeGraduatedAt).toBeUndefined();
    expect(asRecord(migrated.cards[1]).suspendedFrom).toBeUndefined();
    // priority 本身保留 → 退化为「legacy 无 source」
    expect(migrated.cards[0].priority).toBe(true);
  });

  it("端到端后果：重启后再两次答对，用户手动加的重点被摘", async () => {
    const { parseBackupJson } = await import("../../services/storage");
    const raw = makeTestData({
      cards: [reviewCard("c1", { priority: true, prioritySource: "manual" })],
      schedules: [makeSchedule({ cardId: "c1" })]
    });
    // 重启一次
    let data = parseBackupJson(JSON.stringify(raw));
    expect(data.cards[0].prioritySource).toBeUndefined();

    for (const rating of [3, 3] as const) {
      data = applyReview(data, data.cards[0], "spelling", rating);
    }
    console.log("SM3-d 重启 + 两次答对后 priority:", data.cards[0].priority);
    expect(data.cards[0].priority).toBe(false);
  });
});

describe("SM3-e 自动置位的触发条件", () => {
  it("只有 rating=1（新 lapse）且累计 lapseCount>=3 才自动置位", () => {
    const card = reviewCard("c1");
    // lapseCount=2 → rating1 后变 3 → 置位
    const data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "c1", lapseCount: 2 })] });
    const set = applyReview(data, card, "spelling", 1);
    expect(set.cards[0].priority).toBe(true);
    expect(set.cards[0].prioritySource).toBe("system");

    // rating=2 不触发（lapseCount 不增）
    const two = applyReview(data, card, "spelling", 2);
    expect(two.cards[0].priority).toBe(false);
  });

  it("lapseCount 已 >=3 但本次不是 rating=1 → 不置位（避免历史 lapse 反复算回）", () => {
    const card = reviewCard("c1");
    const data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "c1", lapseCount: 9 })] });
    expect(applyReview(data, card, "spelling", 3).cards[0].priority).toBe(false);
    expect(applyReview(data, card, "spelling", 4).cards[0].priority).toBe(false);
    expect(applyReview(data, card, "spelling", 2).cards[0].priority).toBe(false);
  });
});
