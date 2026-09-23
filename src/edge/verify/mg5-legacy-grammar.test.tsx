// @vitest-environment jsdom
/**
 * MG5 · 老数据 → 语法模块的行为一致性（2026-09-22）
 *
 * 三组已确认有风险的老数据形态：
 *   A. 只有 `grammarLessonsDone`（没有 `grammarLessonStagesDone`）的存量进度；
 *   B. 卡片没有 `tags` / 没有 `sourceId` 的老语法卡；
 *   C. `schedules` 缺 `recoveryCount`。
 *
 * 每一项都问到「功能是否正常」，而不只是「页面能不能打开」：
 * 课程地图关卡状态、次日回访入口、旧案重审入口、复习队列是否漏卡、摘星是否误触发。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { clickElement, flushAsync } from "./drive";
import GrammarPathPage from "../../pages/GrammarPathPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import GrammarReauditPage from "../../pages/GrammarReauditPage";
import { grammarLessons } from "../../data/grammarLessons";
import { LESSON_GROUPS } from "../../data/grammarSeasons";
import {
  buildGrammarReviewSession,
  isMasteredByOutput,
  listDueGrammarReviewCards,
  summarizeGrammarMastery
} from "../../services/grammarReviewService";
import { getLessonStageLock } from "../../services/lessonService";
import { applyReview, getWeakCardInsights } from "../../services/reviewService";
import { seedAppData } from "./fixtures";
import {
  LEGACY_ISO,
  LESSON_ID,
  LESSON_SENTENCE,
  legacyBase,
  legacySchedule,
  legacySentenceCard,
  legacySentenceDetails
} from "./mgLegacy";

const noCompletedAt = () => null;
const noTelemetry = () => null;

const lesson = grammarLessons.find((item) => item.id === LESSON_ID);
if (!lesson) throw new Error(`夹具引用了不存在的课程 ${LESSON_ID}`);

/** 打开第 seasonIndex 个季卡（默认只展开「下一课」所在季）。 */
const openSeason = (page: ReturnType<typeof mountPage>, seasonIndex: number): void => {
  const cards = Array.from(page.container.querySelectorAll(".season-card"));
  const card = cards[seasonIndex];
  if (!card) throw new Error(`没有第 ${seasonIndex} 个季卡（共 ${cards.length} 个）`);
  if (!card.className.includes("is-open")) {
    clickElement(card.querySelector(".season-card-head") as HTMLButtonElement);
  }
};

/** 找到某课的三关卡链（先把该课所在季展开）。 */
const findStageChain = (page: ReturnType<typeof mountPage>, lessonNumber: number) => {
  const seasonIndex = LESSON_GROUPS.findIndex(
    (group) => lessonNumber >= group.min && lessonNumber <= group.max
  );
  openSeason(page, seasonIndex);
  const refreshed = Array.from(page.container.querySelectorAll(".season-card"))[seasonIndex];
  return refreshed?.querySelector(`[aria-label="第 ${lessonNumber} 课三关卡"]`) ?? null;
};

describe("MG5-A 只有 grammarLessonsDone 的老进度", () => {
  beforeEach(() => resetStorage());

  /** 只写旧字段，完全不写 grammarLessonStagesDone（双写上线前的存量形态）。 */
  const seedOldProgress = () =>
    seedAppData(
      legacyBase({
        grammarLessonsDone: [LESSON_ID]
      }) as never
    );

  it("迁移时回填 grammarLessonStagesDone = [1]（关 1 不丢）", () => {
    const data = seedOldProgress();
    expect(
      data.grammarLessonStagesDone?.[LESSON_ID],
      "旧字段有值但新字段缺 1 时，migrateData 应回填 [1]（storage.ts:1016-1023）"
    ).toEqual([1]);
  });

  it("课程地图：已完成课的关 1 显示为「已走过」，关 2 解锁、关 3 仍锁", () => {
    seedOldProgress();
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const chain = findStageChain(page, lesson.number);
    expect(chain, "已完成课应显示三关卡链").toBeTruthy();
    const nodes = Array.from(chain!.querySelectorAll(".lesson-stage-node"));
    const states = nodes.map((node) => node.className.replace("lesson-stage-node ", "").trim());
    expect(states, "关 1=done / 关 2=open / 关 3=locked").toEqual(["done", "open", "locked"]);
    page.unmount();
  });

  it("关 2 解锁判定：老进度没有完成时间戳 → 按「已满次日窗」处理，不永久锁关", () => {
    const data = seedOldProgress();
    const lock = getLessonStageLock(data, LESSON_ID, 2, noTelemetry);
    expect(lock.state, "无完成时间戳的老用户不该被永久锁在关 2 之外").toBe("unlocked");
    expect(lock.unlockAt, "已解锁时不应给出解锁时刻").toBeUndefined();
  });

  it("关 3 旧案重审：关 2 未完成 → 锁定（不是入口挂了）", () => {
    const data = seedOldProgress();
    const lock = getLessonStageLock(data, LESSON_ID, 3, noTelemetry);
    expect(lock.state, "关 3 需关 2 完成才解锁（lessonService.ts:174）").toBe("locked");
  });

  it("次日回访页可直接进入并渲染题目（老进度不留死路）", () => {
    seedOldProgress();
    const page = mountPage(
      <GrammarRevisitPage />,
      `/grammar/lesson/${LESSON_ID}/revisit`,
      "/grammar/lesson/:lessonId/revisit"
    );
    expect(page.has("回访关还没解锁"), "老进度应已解锁关 2，不该看到锁定空态").toBe(false);
    expect(page.text().length, "页面应有内容而不是空白").toBeGreaterThan(50);
    page.unmount();
  });

  it("旧案重审页在「关 2 未完成」时给明确引导（柔性入口，不崩溃）", () => {
    seedOldProgress();
    const page = mountPage(
      <GrammarReauditPage />,
      `/grammar/lesson/${LESSON_ID}/reaudit`,
      "/grammar/lesson/:lessonId/reaudit"
    );
    expect(page.text().trim().length, "锁定态也应有可见文案").toBeGreaterThan(20);
    expect(/undefined|null|NaN/.test(page.text()), "锁定态文案不得出现占位词").toBe(false);
    page.unmount();
  });

  it("关 1 完成后可见页码：课程地图显示「已完成」而非残留的 0 进度", () => {
    seedOldProgress();
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const chain = findStageChain(page, lesson.number);
    expect(chain, "第 13 课应带三关卡链（= 已完课）").toBeTruthy();
    // 页头进度：done 必须包含这一课（1/197）
    const pill = page.container.querySelector('[aria-label="课程进度"]')?.textContent ?? "";
    expect(pill.replace(/\s+/g, " ").trim(), "课程进度应计入这 1 课").toBe(`1 / ${grammarLessons.length} 课`);
    page.unmount();
  });
});

describe("MG5-B 卡片没有 tags / 没有 sourceId", () => {
  beforeEach(() => resetStorage());

  /** 老语法卡：只有 sourceId，tags 字段整体缺失（早期备份被裁剪的形态）。 */
  const seedTaglessGrammarCards = (cards: Array<Record<string, unknown>>) =>
    seedAppData(
      legacyBase({
        cards,
        schedules: cards.map((card) => legacySchedule(String(card.id))),
        sentenceDetails: cards.map((card) => legacySentenceDetails(String(card.id), String(card.front)))
      }) as never
    );

  it("tags 缺失 → 迁移补成空数组（不是 undefined，避免调用方 .includes 崩）", () => {
    const data = seedTaglessGrammarCards([
      legacySentenceCard({ id: "c_no_tags", front: LESSON_SENTENCE, sourceId: `lesson:${LESSON_ID}` })
    ]);
    expect(data.cards[0].tags, "tags 缺失应补空数组").toEqual([]);
  });

  it("★ 无 tags 的语法句子卡会从语法复习队列里静默消失（确认缺陷）", () => {
    const withTags = seedTaglessGrammarCards([
      legacySentenceCard({ id: "c_tagged", front: LESSON_SENTENCE, sourceId: `lesson:${LESSON_ID}`, tags: ["语法"] })
    ]);
    const withoutTags = seedTaglessGrammarCards([
      legacySentenceCard({ id: "c_untagged", front: LESSON_SENTENCE, sourceId: `lesson:${LESSON_ID}` })
    ]);
    expect(listDueGrammarReviewCards(withTags).length, "带「语法」标签的卡正常到期").toBe(1);
    expect(
      listDueGrammarReviewCards(withoutTags).length,
      "只缺 tags 字段的同一张卡完全进不了语法复习队列（grammarReviewService.ts:39）"
    ).toBe(0);
  });

  it("★ 缺 tags 也会漏掉「已掌握」统计（summarizeGrammarMastery 总数少算）", () => {
    const data = seedTaglessGrammarCards([
      legacySentenceCard({ id: "c1", front: LESSON_SENTENCE, tags: ["语法"] }),
      legacySentenceCard({ id: "c2", front: "I am reading a book.", sourceId: `lesson:${LESSON_ID}` })
    ]);
    const summary = summarizeGrammarMastery(data);
    expect(summary.total, "页头「共 N 句」只数得到带标签的那一张").toBe(1);
    expect(
      data.cards.length,
      "而库里实际有 2 张语法来源句子卡——数字与老数据实际内容不一致"
    ).toBe(2);
  });

  it("有无 sourceId 不影响到期队列（sourceId 只用于交错与展示，不是筛选条件）", () => {
    const withSource = seedTaglessGrammarCards([
      legacySentenceCard({ id: "c_src", front: LESSON_SENTENCE, sourceId: `lesson:${LESSON_ID}`, tags: ["语法"] })
    ]);
    const withoutSource = seedTaglessGrammarCards([
      legacySentenceCard({ id: "c_nosrc", front: LESSON_SENTENCE, tags: ["语法"] })
    ]);
    expect(listDueGrammarReviewCards(withSource).length).toBe(1);
    expect(listDueGrammarReviewCards(withoutSource).length, "sourceId 缺失不该把卡挤出队列").toBe(1);
  });

  it("复习页在「无 tags 卡」数据下渲染：不是崩溃，但会话为空", () => {
    seedTaglessGrammarCards([
      legacySentenceCard({ id: "c_untagged", front: LESSON_SENTENCE, sourceId: `lesson:${LESSON_ID}` })
    ]);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.has("今天没有到期的语法复习"), "队列为空的空态").toBe(true);
    expect(/undefined|NaN|Invalid Date/.test(page.text()), "空态文案不得出现占位词").toBe(false);
    page.unmount();
  });

  it("负向对照：把 tags 补上后，同一张卡立刻出现在队列里", () => {
    const data = seedTaglessGrammarCards([
      legacySentenceCard({ id: "c_untagged", front: LESSON_SENTENCE, sourceId: `lesson:${LESSON_ID}`, tags: ["语法"] })
    ]);
    expect(listDueGrammarReviewCards(data).length, "补 tags 后应回到队列").toBe(1);
    const session = buildGrammarReviewSession(data);
    expect(session.length).toBe(1);
    expect(session[0].card.id).toBe("c_untagged");
  });
});

describe("MG5-C schedules 缺 recoveryCount", () => {
  beforeEach(() => resetStorage());

  const seedPriorityCard = (cardPatch: Record<string, unknown> = {}, schedulePatch: Record<string, unknown> = {}) => {
    const data = seedAppData(
      legacyBase({
        cards: [
          legacySentenceCard({
            id: "c_priority",
            front: LESSON_SENTENCE,
            tags: ["语法"],
            sourceId: `lesson:${LESSON_ID}`,
            priority: true,
            ...cardPatch
          })
        ],
        schedules: [legacySchedule("c_priority", { intervalDays: 3, reviewCount: 2, ...schedulePatch })],
        sentenceDetails: [legacySentenceDetails("c_priority", LESSON_SENTENCE)]
      }) as never
    );
    return { data, card: data.cards[0], schedule: data.schedules[0] };
  };

  it("迁移后 recoveryCount 保持 undefined（不写 0，避免伪造「已康复」进度）", () => {
    const { schedule } = seedPriorityCard();
    expect(schedule.recoveryCount, "旧数据无此字段应保持 undefined（storage.ts:906-909）").toBeUndefined();
  });

  it("系统置位卡（无 prioritySource）缺 recoveryCount：第一次通过后计数从 0 起算，不误摘星", () => {
    const { data, card } = seedPriorityCard();
    const afterOne = applyReview(data, card, "cloze", 3, "");
    const nextSchedule = afterOne.schedules.find((item) => item.cardId === card.id);
    expect(nextSchedule?.recoveryCount, "第一次通过应记 1（undefined 视为 0）").toBe(1);
    expect(
      afterOne.cards[0].priority,
      "只通过 1 次不该摘星（阈值 2，reviewService.ts:9）"
    ).toBe(true);
  });

  it("连续 2 次通过才摘星（老数据缺 recoveryCount 也能正确康复）", () => {
    const { data, card } = seedPriorityCard();
    const once = applyReview(data, card, "cloze", 3, "");
    const twice = applyReview(once, once.cards[0], "cloze", 3, "");
    expect(twice.cards[0].priority, "连续 2 次 ≥3 应自动摘星").toBe(false);
    expect(twice.cards[0].prioritySource ?? undefined, "摘星后应清掉 prioritySource").toBeUndefined();
  });

  it("低分一次即清零重来（recoveryCount 从 1 退回 0）", () => {
    const { data, card } = seedPriorityCard();
    const once = applyReview(data, card, "cloze", 3, "");
    const failed = applyReview(once, once.cards[0], "cloze", 1, "");
    const schedule = failed.schedules.find((item) => item.cardId === card.id);
    expect(schedule?.recoveryCount, "低分应清零（reviewService.ts:516）").toBe(0);
    expect(failed.cards[0].priority, "清零后仍保持置位").toBe(true);
  });

  it("手动标星卡（prioritySource=manual）缺 recoveryCount：无论通过几次都不摘星", () => {
    const { data, card } = seedPriorityCard({ prioritySource: "manual" });
    let next = data;
    for (let round = 0; round < 4; round += 1) {
      next = applyReview(next, next.cards[0], "cloze", 4, "");
    }
    const schedule = next.schedules.find((item) => item.cardId === card.id);
    expect(next.cards[0].priority, "手动标星不该被自动摘除").toBe(true);
    expect(
      schedule?.recoveryCount,
      "不参与康复的卡不维护 recoveryCount（保持 undefined，reviewService.ts:527）"
    ).toBeUndefined();
  });

  it("legacy 无 source 的置位卡被当作系统卡（与 R2 注释口径一致）", () => {
    const { data, card } = seedPriorityCard();
    expect(card.prioritySource ?? undefined).toBeUndefined();
    const once = applyReview(data, card, "cloze", 3, "");
    expect(
      once.schedules.find((item) => item.cardId === card.id)?.recoveryCount,
      "legacy 无 source 的卡参与康复计数（reviewService.ts:512 注释）"
    ).toBe(1);
  });
});

describe("MG5-D「连续 2 次输出通过」掌握判定在缺 reviews 时的行为", () => {
  beforeEach(() => resetStorage());

  it("reviews 完全缺失：isMasteredByOutput 返回 false（不崩、不误判已掌握）", () => {
    const data = seedAppData(
      legacyBase({
        cards: [legacySentenceCard({ id: "c1", front: LESSON_SENTENCE, tags: ["语法"] })],
        schedules: [legacySchedule("c1")]
      }) as never
    );
    expect(data.reviews, "老数据 reviews 缺失应补空数组").toEqual([]);
    expect(isMasteredByOutput(data.reviews, "c1"), "没有历史记录不该判为已掌握").toBe(false);
  });

  it("老数据里只有 1 条 recall 满分记录：不判已掌握（需要连续 2 条）", () => {
    const data = seedAppData(
      legacyBase({
        cards: [legacySentenceCard({ id: "c1", front: LESSON_SENTENCE, tags: ["语法"] })],
        schedules: [legacySchedule("c1")],
        reviews: [
          {
            id: "r1",
            cardId: "c1",
            mode: "recall",
            rating: 4,
            answer: LESSON_SENTENCE,
            diffJson: "[]",
            reviewedAt: LEGACY_ISO
          }
        ]
      }) as never
    );
    expect(isMasteredByOutput(data.reviews, "c1")).toBe(false);
  });

  it("★ 历史数据里 rebuild 与 free_type 都记成 recall：1 次拼词块 + 1 次真输出被判「已掌握」", () => {
    // 2026-09-21 之前 GrammarReviewPage 把 rebuild 也记成 mode="recall"（见该文件注释），
    // 于是老数据里的两条 recall 无法区分「点词块」与「自己写」。
    const data = seedAppData(
      legacyBase({
        cards: [legacySentenceCard({ id: "c1", front: LESSON_SENTENCE, tags: ["语法"] })],
        schedules: [legacySchedule("c1")],
        reviews: [
          {
            id: "r_rebuild_as_recall",
            cardId: "c1",
            mode: "recall",
            rating: 4,
            answer: LESSON_SENTENCE,
            diffJson: "[]",
            reviewedAt: LEGACY_ISO
          },
          {
            id: "r_free_type",
            cardId: "c1",
            mode: "recall",
            rating: 4,
            answer: LESSON_SENTENCE,
            diffJson: "[]",
            reviewedAt: LEGACY_ISO
          }
        ]
      }) as never
    );
    expect(
      isMasteredByOutput(data.reviews, "c1"),
      "两条 recall 满分 → 判已掌握（历史记录无法追溯区分 rebuild，按宽口径保留，见 grammarReviewService.ts:495-504）"
    ).toBe(true);
  });

  it("getWeakCardInsights 在缺 reviews / 缺 schedule 的老数据上不崩，且不把卡误判为薄弱", () => {
    const data = seedAppData(
      legacyBase({
        cards: [legacySentenceCard({ id: "c1", front: LESSON_SENTENCE, tags: ["语法"] })]
      }) as never
    );
    // 该卡没有 schedule、没有 reviews：migrateData 会补默认计划，但历史记录仍是空。
    expect(data.reviews).toEqual([]);
    const insights = getWeakCardInsights(data);
    expect(insights, "无历史记录、无置位的卡不该被判为薄弱").toEqual([]);
  });
});
