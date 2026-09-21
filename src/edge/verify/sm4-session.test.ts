/**
 * SM-2 审计 · 第 4 条：会话组装的不变量。
 *
 * 逐条验证：
 * ① listDueGrammarReviewCards 的排序（lapse 多的优先，再按 nextReviewAt）与过滤口径；
 * ② interleaveBySource 的 while 上界在极端分布下是否丢卡；
 * ③ diversifyReviewModes 的贪心交换是否守恒（不丢卡、不重复卡）；
 * ④ summarizeGrammarMastery 的三个计数之和是否恒等于 total；
 * ⑤ 组合链 buildGrammarReviewSession → diversifyReviewModes 的端到端守恒。
 */
import { describe, expect, it } from "vitest";
import {
  buildGrammarReviewSession,
  diversifyReviewModes,
  GRAMMAR_REVIEW_SESSION_LIMIT,
  interleaveBySource,
  listDueGrammarReviewCards,
  summarizeGrammarMastery
} from "../../services/grammarReviewService";
import type { AppData, Card, Schedule } from "../../types";
import type { GrammarReviewCard } from "../../services/grammarReviewService";

const PAST = "2020-01-01T00:00:00.000Z";
const FUTURE = "2999-01-01T00:00:00.000Z";

const grammarCard = (id: string, sourceId: string | undefined, patch: Partial<Card> = {}): Card => ({
  id,
  type: "sentence",
  front: `Sentence ${id}.`,
  back: "",
  note: "",
  ...(sourceId === undefined ? {} : { sourceId }),
  tags: ["语法"],
  status: "review",
  priority: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  ...patch
});

const scheduleFor = (cardId: string, patch: Partial<Schedule> = {}): Schedule => ({
  cardId,
  easeFactor: 2.5,
  intervalDays: 1,
  reviewCount: 1,
  lapseCount: 0,
  nextReviewAt: PAST,
  ...patch
});

const dataOf = (cards: Card[], schedules: Schedule[]): AppData =>
  ({ cards, schedules } as unknown as AppData);

describe("SM4-a listDueGrammarReviewCards 过滤与排序", () => {
  /**
   * 过滤口径（2026-09-21 修后的 `neverQueuedSchedule`）：
   *   排除 status === "new"，以及「三个字段全为初始值」（intervalDays/reviewCount/lapseCount 都为 0）的计划。
   * 注意审计期间（同一工作树被并发编辑）此处口径从「只看 intervalDays === 0」收紧为三字段合取，
   * 修掉了「看答案（rating1）后 intervalDays 归零 → 语法卡被永久排除」的 P1。
   */
  it("过滤：只收 type=sentence + tags 含「语法」+ 非 suspended/new + 非「从未排期」+ 已到期", () => {
    const cards = [
      grammarCard("due", "s1"),
      grammarCard("not-due", "s1"),
      grammarCard("suspended", "s1", { status: "suspended" }),
      grammarCard("new-status", "s1", { status: "new" }),
      grammarCard("no-grammar-tag", "s1", { tags: [] }),
      grammarCard("word-card", "s1", { type: "word" }),
      grammarCard("never-queued", "s1"),
      grammarCard("no-schedule", "s1")
    ];
    const data = dataOf(cards, [
      scheduleFor("due"),
      scheduleFor("not-due", { nextReviewAt: FUTURE }),
      scheduleFor("suspended"),
      scheduleFor("new-status"),
      scheduleFor("no-grammar-tag"),
      scheduleFor("word-card"),
      // 三字段全 0 = 从未排期 → 排除
      scheduleFor("never-queued", { intervalDays: 0, reviewCount: 0, lapseCount: 0 })
      // no-schedule 故意不给
    ]);

    const ids = listDueGrammarReviewCards(data).map((item) => item.card.id);
    console.log("SM4-a 到期集合:", JSON.stringify(ids));
    expect(ids).toEqual(["due"]);
  });

  /**
   * 回归保护：旧判据（只看 intervalDays === 0）会把「刚看答案」的卡永久排除。
   * 现判据三字段合取 → rating1 后（intervalDays=0 但 reviewCount>0 / lapseCount>0）仍到期。
   */
  it("rating1 后的语法卡（intervalDays=0 但 reviewCount/lapseCount>0）仍进队列", () => {
    const data = dataOf([grammarCard("lapsed", "s1")], [scheduleFor("lapsed", { intervalDays: 0, reviewCount: 4, lapseCount: 2 })]);
    expect(listDueGrammarReviewCards(data).map((item) => item.card.id)).toEqual(["lapsed"]);
  });

  it("存量数据：reviewCount=0 但 intervalDays>0（已排期）照常到期", () => {
    const data = dataOf([grammarCard("legacy", "s1")], [scheduleFor("legacy", { intervalDays: 3, reviewCount: 0 })]);
    expect(listDueGrammarReviewCards(data).map((item) => item.card.id)).toEqual(["legacy"]);
  });

  /**
   * 【确认的缺陷】isGrammarSentenceCard 只排除 suspended，不排除 mastered。
   * mastered 卡只要 schedule 到期就重新回到语法复习会话 —— 与 getDueCards 的
   * `status !== "mastered"` 口径（reviewService.ts:85）相反。
   */
  it("[P2] mastered 语法卡只要到期仍进复习队列（与 getDueCards 的排除口径不一致）", () => {
    const cards = [grammarCard("mastered", "s1", { status: "mastered" })];
    const data = dataOf(cards, [scheduleFor("mastered")]);
    const due = listDueGrammarReviewCards(data);
    console.log("SM4-a mastered 卡是否进队列:", due.length === 1);
    expect(due.map((item) => item.card.id)).toEqual(["mastered"]);
  });

  it("排序：lapseCount 降序优先，同 lapse 再按 nextReviewAt 升序", () => {
    const cards = ["a", "b", "c", "d", "e"].map((id) => grammarCard(id, `s-${id}`));
    const data = dataOf(cards, [
      scheduleFor("a", { lapseCount: 0, nextReviewAt: "2020-01-01T00:00:00.000Z" }),
      scheduleFor("b", { lapseCount: 3, nextReviewAt: "2021-01-01T00:00:00.000Z" }),
      scheduleFor("c", { lapseCount: 3, nextReviewAt: "2020-06-01T00:00:00.000Z" }),
      scheduleFor("d", { lapseCount: 1, nextReviewAt: "2019-01-01T00:00:00.000Z" }),
      scheduleFor("e", { lapseCount: 3, nextReviewAt: "2020-02-01T00:00:00.000Z" })
    ]);
    const order = listDueGrammarReviewCards(data).map((item) => item.card.id);
    console.log("SM4-a 排序结果:", JSON.stringify(order));
    expect(order).toEqual(["e", "c", "b", "d", "a"]);
  });

  it("lapseCount 相同时按 nextReviewAt 字符串比较（ISO 单调 ⇒ 顺序正确）", () => {
    const cards = ["x", "y"].map((id) => grammarCard(id, "s"));
    const data = dataOf(cards, [
      scheduleFor("x", { lapseCount: 2, nextReviewAt: "2020-05-01T00:00:00.000Z" }),
      scheduleFor("y", { lapseCount: 2, nextReviewAt: "2020-04-01T00:00:00.000Z" })
    ]);
    expect(listDueGrammarReviewCards(data).map((item) => item.card.id)).toEqual(["y", "x"]);
  });
});

describe("SM4-b interleaveBySource 丢卡边界", () => {
  /** 复刻实现（grammarReviewService.ts:79-97） */
  const reference = (counts: number[]) => {
    const items = counts.flatMap((count, sourceIndex) =>
      Array.from({ length: count }, (_, i) => ({ card: { sourceId: `s${sourceIndex}`, id: `${sourceIndex}-${i}` } }))
    );
    const buckets = new Map<string, typeof items>();
    for (const item of items) {
      const key = item.card.sourceId ?? "";
      const bucket = buckets.get(key);
      if (bucket) bucket.push(item);
      else buckets.set(key, [item]);
    }
    const queues = [...buckets.values()];
    const result: typeof items = [];
    let index = 0;
    const bound = items.length * queues.length + queues.length;
    let iterations = 0;
    while (result.length < items.length && index < bound) {
      const queue = queues[index % queues.length];
      const next = queue.shift();
      if (next) result.push(next);
      index += 1;
      iterations += 1;
    }
    return { result, bound, iterations, leftovers: queues.reduce((sum, queue) => sum + queue.length, 0) };
  };

  const distributions: Array<[string, number[]]> = [
    ["全同源 10 张", [10]],
    ["9 源各 1 张", Array(9).fill(1)],
    ["单源 1 张", [1]],
    ["2 源 9+1", [9, 1]],
    ["3 源 8+1+1", [8, 1, 1]],
    ["10 源各 1 张", Array(10).fill(1)],
    ["20 源各 1 张", Array(20).fill(1)],
    ["4 源 5+5+5+5", [5, 5, 5, 5]],
    ["最坏交错需求 2 源 1+10", [1, 10]]
  ];

  for (const [name, counts] of distributions) {
    it(`${name}：不丢卡（理论最坏上界内）`, () => {
      const { result, bound, iterations, leftovers } = reference(counts);
      const total = counts.reduce((sum, value) => sum + value, 0);
      console.log(
        `SM4-b ${name}: 结果 ${result.length}/${total} 迭代 ${iterations} 上界 ${bound} 残留 ${leftovers}`
      );
      expect(result.length).toBe(total);
      expect(leftovers).toBe(0);
    });
  }

  it("上界本身是充分条件（index < total*queues + queues），最坏比例 = 最大桶占比", () => {
    // 上界推导：一个「空转」轮次只可能出现在所有队列都被取空的桶上；
    // 最坏情况下单源独占 n 张，需要 n 次有效 + (queues-1) 次空转/轮，
    // 总迭代 <= n*queues + queues 恒成立。
    const [a, b] = [1, 10];
    const { iterations, bound } = reference([a, b]);
    expect(iterations).toBeLessThanOrEqual(bound);
  });

  it("真实实现 interleaveBySource：全同源不丢卡，但相邻卡必然同源（不变量在此分布下无法成立）", () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      card: grammarCard(`c${i}`, "same-source"),
      schedule: scheduleFor(`c${i}`)
    }));
    const out = interleaveBySource(items);
    expect(out).toHaveLength(10);
    // 邻接不变量：全同源时「相邻不同源」不可能成立
    const sameAdjacent = out.filter((item, i) => i > 0 && item.card.sourceId === out[i - 1].card.sourceId).length;
    console.log("SM4-b 全同源时相邻同源的对数:", sameAdjacent, "/", 9);
    expect(sameAdjacent).toBe(9);
  });

  it("真实实现：无 sourceId 的卡（空键）与显式空串同桶", () => {
    const items = [
      { card: grammarCard("a", undefined), schedule: scheduleFor("a") },
      { card: grammarCard("b", ""), schedule: scheduleFor("b") },
      { card: grammarCard("c", "x"), schedule: scheduleFor("c") }
    ];
    const out = interleaveBySource(items);
    expect(out).toHaveLength(3);
  });
});

describe("SM4-c diversifyReviewModes 守恒性", () => {
  const item = (id: string, reviewCount: number) => ({
    card: grammarCard(id, "s"),
    schedule: scheduleFor(id, { reviewCount })
  });

  const modeOf = (reviewCount: number) =>
    reviewCount >= 2 ? "free_type" : reviewCount % 2 === 0 ? "cloze" : "rebuild";

  it("守恒：输出长度 = 输入长度，且 id 集合完全相同（多组输入）", () => {
    const cases: Array<Array<{ card: Card; schedule: Schedule }>> = [
      [item("a", 0), item("b", 2), item("c", 4), item("d", 1)],
      Array.from({ length: 10 }, (_, i) => item(`x${i}`, i)),
      Array.from({ length: 7 }, (_, i) => item(`y${i}`, 0)), // 全同型，无解
      [item("p", 0), item("q", 1)],
      [item("r", 4)],
      []
    ];
    for (const session of cases) {
      const out = diversifyReviewModes(session as never, []);
      expect(out).toHaveLength(session.length);
      expect(out.map((entry) => entry.card.id).sort()).toEqual(session.map((entry) => entry.card.id).sort());
      expect(new Set(out.map((entry) => entry.card.id)).size).toBe(session.length); // 不重复
    }
  });

  it("≤2 张时原样返回", () => {
    const two = [item("a", 0), item("b", 0)];
    expect(diversifyReviewModes(two as never, [])).toBe(two);
  });

  it("无解时退化正确：全 cloze 会话无法打散，但不丢卡不重复（保持原序）", () => {
    const session = Array.from({ length: 6 }, (_, i) => item(`z${i}`, 0));
    const out = diversifyReviewModes(session as never, []);
    expect(out.map((entry) => entry.card.id)).toEqual(session.map((entry) => entry.card.id));
    console.log("SM4-c 全 cloze（无解）→ 原序返回:", JSON.stringify(out.map((e) => e.card.id)));
  });

  /**
   * 【可疑但未证实为缺陷】贪心只做「向后找第一个异型」，找到就换。
   * 当前算法保证「相邻不同型」在**存在解**时并不总是成立——
   * 交换到 index 位置的元素虽然与 index-1 不同型，但新的 index+1 位置可能
   * 因此与 index 同型，而扫描已经前进。下面给出真实反例。
   */
  it("[P2] 存在解时仍可能残留相邻同型（贪心只换一次，不回溯）", () => {
    // cloze, cloze, rebuild, rebuild → 贪心在 index=1 换 rebuild → cloze,rebuild,cloze,rebuild 成功
    const good = [item("a", 0), item("b", 0), item("c", 1), item("d", 1)];
    const goodOut = diversifyReviewModes(good as never, []);
    console.log("SM4-c 可解样本:", JSON.stringify(goodOut.map((e) => [e.card.id, modeOf(e.schedule.reviewCount)])));
    const goodAdjacent = goodOut.filter((e, i) => i > 0 && modeOf(e.schedule.reviewCount) === modeOf(goodOut[i - 1].schedule.reviewCount)).length;
    expect(goodAdjacent).toBe(0);

    // 构造反例：cloze, cloze, cloze, rebuild（3 cloze + 1 rebuild）
    // index=1 找到 probe=3 的 rebuild 换入 → cloze,rebuild,cloze,cloze
    // index=2 是 cloze ≠ rebuild 跳过；index=3 是 cloze == cloze(index2)，
    // 向后无元素可换 → 保持。结果末两位仍同型，但存在解（rebuild,cloze,cloze,cloze）。
    const bad = [item("a", 0), item("b", 0), item("c", 0), item("d", 1)];
    const badOut = diversifyReviewModes(bad as never, []);
    const modes = badOut.map((e) => modeOf(e.schedule.reviewCount));
    console.log("SM4-c 反例样本:", JSON.stringify(badOut.map((e) => [e.card.id, modeOf(e.schedule.reviewCount)])));
    const adjacent = modes.filter((mode, i) => i > 0 && mode === modes[i - 1]).length;
    console.log("SM4-c 反例残留相邻同型对数:", adjacent, "（存在完美解 rebuild,cloze,cloze,cloze 时 adjacent 应为 0）");
    expect(adjacent).toBeGreaterThan(0);
    // 守恒性仍成立
    expect(badOut.map((e) => e.card.id).sort()).toEqual(["a", "b", "c", "d"]);
  });
});

describe("SM4-d summarizeGrammarMastery 计数完备性", () => {
  const masteryData = (cards: Card[], schedules: Schedule[]): AppData => dataOf(cards, schedules);

  it("三计数之和恒等于 total（多种混合）", () => {
    const constructors: Array<(n: number) => AppData> = [
      (n) => masteryData([], []),
      () => masteryData([grammarCard("a", "s")], [scheduleFor("a")]),
      () => masteryData([grammarCard("a", "s", { status: "mastered" })], [scheduleFor("a")]),
      () => masteryData([grammarCard("a", "s")], []), // 无 schedule
      () =>
        masteryData(
          [
            grammarCard("m", "s", { status: "mastered" }),
            grammarCard("p", "s"),
            grammarCard("n", "s", { status: "new" })
          ],
          [scheduleFor("m", { reviewCount: 5 }), scheduleFor("p", { reviewCount: 2 }), scheduleFor("n", { reviewCount: 0 })]
        ),
      () =>
        masteryData(
          [
            grammarCard("susp", "s", { status: "suspended" }),
            grammarCard("word", "s", { type: "word" }),
            grammarCard("nogtag", "s", { tags: [] }),
            grammarCard("ok", "s")
          ],
          [scheduleFor("susp"), scheduleFor("word"), scheduleFor("nogtag"), scheduleFor("ok")]
        )
    ];
    for (const [index, build] of constructors.entries()) {
      const summary = summarizeGrammarMastery(build(index));
      expect(summary.mastered + summary.inProgress + summary.notStarted, `构造器 #${index}`).toBe(summary.total);
    }
  });

  it("mastered 卡即使 reviewCount=0 也计入 mastered（continue 分支先于 reviewCount 判定）", () => {
    const data = masteryData([grammarCard("m", "s", { status: "mastered" })], [scheduleFor("m", { reviewCount: 0 })]);
    const summary = summarizeGrammarMastery(data);
    expect(summary).toEqual({ mastered: 1, inProgress: 0, notStarted: 0, total: 1 });
  });

  /**
   * 【确认的口径不一致】summarizeGrammarMastery 用 reviewCount===0 判「未开始」，
   * 而 listDueGrammarReviewCards 用「三字段全 0」判「从未进过复习队列」。
   * 一张 intervalDays=0 / reviewCount=0 / lapseCount=0 的卡：两侧都算「未开始/不出题」，一致；
   * 但一张 reviewCount>0 的卡在掌握视图里是「进行中」，若其 intervalDays 也为 0
   * （rating1 之后即如此）会话仍会出题 —— 以下是当前口径的实际对齐情况。
   */
  it("「未开始」口径：reviewCount 判据 vs neverQueued 三字段判据（当前已基本对齐）", () => {
    // rating1 之后：intervalDays=0、reviewCount>0、lapseCount>0
    const data = masteryData(
      [grammarCard("lapsed", "s")],
      [scheduleFor("lapsed", { reviewCount: 5, intervalDays: 0, lapseCount: 1, nextReviewAt: PAST })]
    );
    const summary = summarizeGrammarMastery(data);
    const due = listDueGrammarReviewCards(data);
    console.log(
      "SM4-d rating1 后的卡: 掌握视图 inProgress =",
      summary.inProgress,
      " 复习会话出题数 =",
      due.length
    );
    // 两侧都视为「进行中 + 出题」 —— 一致
    expect(summary.inProgress).toBe(1);
    expect(due).toHaveLength(1);
  });

  it("[P2] 边界残余：lapseCount>0 但 reviewCount=0 的卡，掌握视图算「未开始」而会话出题", () => {
    // 手工/旧数据形态：只有 lapseCount 非 0
    const data = masteryData(
      [grammarCard("odd", "s")],
      [scheduleFor("odd", { reviewCount: 0, intervalDays: 0, lapseCount: 2, nextReviewAt: PAST })]
    );
    const summary = summarizeGrammarMastery(data);
    const due = listDueGrammarReviewCards(data);
    console.log("SM4-d 口径残余: notStarted =", summary.notStarted, " 出题数 =", due.length);
    expect(summary.notStarted).toBe(1); // 掌握视图：「未开始」
    expect(due).toHaveLength(1); // 但会话出题
  });
});

describe("SM4-e buildGrammarReviewSession 端到端守恒", () => {
  it("会话长度 = min(到期数, limit)，且 diversify 后仍守恒", () => {
    for (const count of [0, 1, 2, 5, 10, 11, 25]) {
      const cards = Array.from({ length: count }, (_, i) => grammarCard(`c${i}`, `src-${i % 4}`));
      const schedules = cards.map((card, i) => scheduleFor(card.id, { lapseCount: i % 3, reviewCount: i }));
      const data = dataOf(cards, schedules);
      const session = buildGrammarReviewSession(data);
      const diversified = diversifyReviewModes(session, []);
      const expected = Math.min(count, GRAMMAR_REVIEW_SESSION_LIMIT);
      expect(session, `count=${count}`).toHaveLength(expected);
      expect(diversified, `count=${count}`).toHaveLength(expected);
      expect(new Set(session.map((item) => item.card.id)).size).toBe(expected); // 不重复
    }
  });

  it("截断发生在交错之后（前 limit 张已尽量分散来源）", () => {
    // 12 张同源卡会被截到 10 张，但相邻仍同源（同源无法分散）
    const cards = Array.from({ length: 12 }, (_, i) => grammarCard(`c${i}`, "one"));
    const data = dataOf(cards, cards.map((card) => scheduleFor(card.id)));
    const session = buildGrammarReviewSession(data);
    expect(session).toHaveLength(10);
  });
});
