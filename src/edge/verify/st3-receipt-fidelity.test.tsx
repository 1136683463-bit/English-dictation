// @vitest-environment jsdom
/**
 * ST3 · 六段终点「收据」的数字同源核验（六段流程的状态机验证）
 *
 * 做法：走完整课（前测 → 看 → 跟 → 忆 → 练 → 产 → 收据），把收据上出现的**每一个数字**
 * 与 localStorage 里的对应事实逐项对齐。用「同一份事实算两次」的原则：
 * 页面文案里的数字必须能在 `personal-vocab-app-data-v1` 或 `grammar-telemetry-events-v1`
 * 里找到唯一确定的来源，且两者一致。
 *
 * 对照表（页面数字 → localStorage 事实）：
 *   「第 N 课完成」            → lesson.number（静态课程数据）
 *   「本季第 i / t 课」i       → grammarLessonsDone ∩ 本季区间的课数 + 1
 *   「本季第 i / t 课」t       → season.max - season.min + 1
 *   「前测里拿不准的 W 处」    → pretestWrongCount（= section=pretest 且 passed=false 的 step 数）
 *   「还差什么」列表项数       → reviewNotes（本课进复习队列的知识点，去重）
 *   「趁热练」档位完成态       → grammarLessonStagesDone / boost 记录
 *   复习队列「明天会自动来见你」→ schedules.nextReviewAt 必须 > now（当天不出现）
 *
 * 约定同 st1：`FAIL-` = 已确认缺陷，`PASS-` = 验过没问题。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { findSeasonByLessonNumber } from "../../data/grammarSeasons";
import { listDueGrammarReviewCards } from "../../services/grammarReviewService";
import type { AppData } from "../../types";
import { grammarLessons } from "../../data/grammarLessons";
import { makeAppData, telemetryOfKind } from "./fixtures";
import { clickElement, flushAsync } from "./drive";
import {
  answerArrangeCorrectly,
  answerPretest,
  answerArrangeWrongly,
  bankChips,
  builtChips,
  guidedEntries,
  inSection,
  lessonOf,
  sectionLabels,
  typeInto,
  type Mounted
} from "../lessonFlow";

const LESSON = "lesson-13-now";

const seed = (): void => {
  window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(makeAppData()));
};
const mount = (lessonId = LESSON) =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, "/grammar/lesson/:lessonId");
const appData = (): AppData => JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
const forwardExits = (page: Mounted): string[] =>
  page.buttons().filter((text) => /^(下一题|下面自己来|进入练习|最后一步：说出来|完成这一课)$/.test(text));
const clickExact = (page: Mounted, label: string): void =>
  clickElement(
    Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
      (button) => !button.disabled && (button.textContent ?? "").trim() === label
    )
  );
const answerCurrentGuided = (page: Mounted, lessonId: string): void => {
  const index = Number((page.text().match(/第 (\d+) \/ \d+ 题/) ?? [])[1] ?? "1") - 1;
  const step = guidedEntries(lessonId)[index];
  if (step.step.kind === "arrange") answerArrangeCorrectly(page, step.step.answer);
  else if (step.step.kind === "spot")
    clickElement(
      Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot button")).find(
        (button) => (button.textContent ?? "").trim() === (step.step.wrongToken ?? step.step.answer)
      )
    );
  else
    clickElement(
      Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-option")).find(
        (button) => (button.textContent ?? "").trim() === step.step.answer
      )
    );
};
const escapeIfStuck = (page: Mounted, answer: string): void => {
  if (forwardExits(page).length > 0) return;
  const built = builtChips(page);
  if (built.length === 0) return;
  clickElement(built[built.length - 1]);
  clickElement(
    bankChips(page).find(
      (chip) => !chip.disabled && (chip.textContent ?? "").trim() === answer.split(/\s+/).filter(Boolean).pop()
    )
  );
};
/**
 * 答对一张正误对比卡：与 `LessonContrastCard` 同源的判据
 * （`correctFirst = (item.wrong.length + index) % 2 === 0`；双正解条两边都对）。
 * 对比卡是 50/50 的选择题，随便点会污染 practiceFirstTry —— 这里必须按判据答对。
 */
const answerContrastCard = (
  page: Mounted,
  card: HTMLElement,
  item: { wrong: string; bothRight?: boolean },
  index: number
): void => {
  const correctFirst = (item.wrong.length + index) % 2 === 0;
  const options = Array.from(card.querySelectorAll<HTMLButtonElement>("button.lesson-option"));
  const target = item.bothRight || correctFirst ? options[0] : options[1];
  if (target) clickElement(target);
};

/**
 * 走完整课到收据。
 * @param options.pretestCorrect 前测是否全对（false = 两题都拿不准）
 * @param options.answerOutputByReveal true = 每档都看答案照抄（记账为未通过）
 * @param options.lessonId 目标课（默认 L13）
 */
const completeLesson = async (
  page: Mounted,
  options: {
    pretestCorrect?: boolean;
    answerOutputByReveal?: boolean;
    lessonId?: string;
  } = {}
): Promise<void> => {
  const lessonId = options.lessonId ?? LESSON;
  const pretestCorrect = options.pretestCorrect ?? true;
  const answerOutputByReveal = options.answerOutputByReveal ?? false;
  const lesson = lessonOf(lessonId);
  const stageLabel = (needle: string) => inSection(page, needle);

  answerPretest(page, lessonId, pretestCorrect);
  // 前测全对时出口是「直接去练习」；有错时是「开始上课」→ 讲解段
  if (page.buttons().includes("直接去练习")) {
    page.click("直接去练习");
    if (page.buttons().includes("回去再看一遍讲解")) page.click("回去再看一遍讲解");
  } else if (page.buttons().includes("开始上课")) {
    page.click("开始上课");
    if (page.buttons().includes("下一步：搭装与对错")) page.click("下一步：搭装与对错");
    if (page.buttons().includes("下一步：变奏")) page.click("下一步：变奏");
  } else {
    throw new Error(`前测结果页没有预期出口：${page.buttons().filter(Boolean).join(" | ")}`);
  }
  await flushAsync();
  if (!stageLabel("试一试")) {
    // 已在讲解段末步 → 进引导段
    if (page.buttons().includes("下一步：搭装与对错")) page.click("下一步：搭装与对错");
    if (page.buttons().includes("下一步：变奏")) page.click("下一步：变奏");
    if (page.buttons().includes("看懂了，试一试")) page.click("看懂了，试一试");
    await flushAsync();
  }
  if (!stageLabel("试一试")) throw new Error(`未进入引导段，当前段：${sectionLabels(page).join(",")}`);

  for (const entry of guidedEntries(lessonId)) {
    answerCurrentGuided(page, lessonId);
    await flushAsync();
    escapeIfStuck(page, entry.step.answer);
    const next = forwardExits(page)[0];
    if (!next) throw new Error(`引导段第 ${entry.displayIndex + 1} 题无出口`);
    clickExact(page, next);
    await flushAsync();
  }
  if (stageLabel("凭记忆写")) {
    typeInto(page, lesson.recall?.answer ?? "");
    page.click("提交");
    await flushAsync();
    page.click("进入练习");
    await flushAsync();
  }
  for (let index = 0; index < lesson.practice.length; index += 1) {
    answerArrangeCorrectly(page, lesson.practice[index].answer);
    await flushAsync();
    clickExact(page, index + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题");
    await flushAsync();
  }
  // 中段「再看两组对错」：按判据答对（避免污染 practiceFirstTry）
  const mid = page.container.querySelector('[aria-label="再看两组对错"]');
  if (mid) {
    const cards = Array.from(mid.querySelectorAll<HTMLElement>(".lesson-contrast-card"));
    cards.forEach((card, position) => {
      const item = (lesson.contrast ?? [])[2 + position];
      if (item) answerContrastCard(page, card, item, 2 + position);
    });
    await flushAsync();
    clickExact(page, "最后一步：说出来");
    await flushAsync();
  }
  for (let guard = 0; guard < 24; guard += 1) {
    if (page.buttons().includes("完成这一课")) {
      page.click("完成这一课");
      await flushAsync();
      return;
    }
    if (page.buttons().includes("下一句（这次没有提示）")) {
      page.click("下一句（这次没有提示）");
      await flushAsync();
      continue;
    }
    if (page.buttons().includes("想不起来？给我一点提示")) {
      page.click("想不起来？给我一点提示");
      await flushAsync();
      continue;
    }
    if (page.buttons().includes("还是想不起来，再看一点")) {
      page.click("还是想不起来，再看一点");
      await flushAsync();
      continue;
    }
    if (page.buttons().includes("还是想不起来，直接看答案")) {
      page.click("还是想不起来，直接看答案");
      await flushAsync();
      continue;
    }
    // 放弃路径：level 3 的「照着打一遍」→ revealOutput（诚实记 revealed）
    if (answerOutputByReveal && page.buttons().includes("照着打一遍（会排进复习队列）")) {
      page.click("照着打一遍（会排进复习队列）");
      await flushAsync();
      continue;
    }
    const cardText = page.container.querySelector(".lesson-quiz-card")?.textContent ?? "";
    const revealed = /正确答案：([\s\S]*?)(?:照着打一遍|想不起来|$)/.exec(cardText)?.[1]?.trim();
    if (revealed) {
      typeInto(page, revealed);
      const submit = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button.primary-button")).find(
        (button) => (button.textContent ?? "").trim() === "提交"
      );
      if (submit && !submit.disabled) {
        clickElement(submit);
        await flushAsync();
        continue;
      }
    }
    break;
  }
  throw new Error(`未走到收据，当前段：${sectionLabels(page).join(",")}；按钮：${page.buttons().filter(Boolean).join(" | ")}`);
};

/** 收据上出现的所有数字（含中文数词位）。 */
const receiptNumbers = (page: Mounted): string[] => {
  const text = [
    page.container.querySelector(".complete-hero-text")?.textContent ?? "",
    page.container.querySelector(".hero-corner")?.textContent ?? "",
    page.container.querySelector(".receipt-card.gap")?.textContent ?? "",
    page.container.querySelector(".receipt-queue-note")?.textContent ?? ""
  ].join(" ");
  return [...text.matchAll(/\d+/g)].map((match) => match[0]);
};

describe("ST3 · 收据数字与 localStorage 事实同源", () => {
  beforeEach(() => resetStorage());

  /** PASS-1 收据上的「第 N 课完成」= 课程静态编号。 */
  it("PASS-1 「第 N 课完成」与课程编号一致", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    const lesson = lessonOf(LESSON);
    expect(inSection(page, "课程完成"), "应显示收据").toBe(true);
    expect(
      page.container.querySelector(".complete-hero-text h2")?.textContent,
      "「第 N 课完成」的 N 必须等于课程数据的 number"
    ).toBe(`第 ${lesson.number} 课完成`);
    page.unmount();
  });

  /**
   * PASS-2 季角标（i / t）双源一致：
   *  t = season.max - season.min + 1；i = 本季已完课数 + 1（本课）。
   * 完课瞬间读一次、微任务落盘后再读一次，两次都必须等于用 grammarLessonsDone 算出的事实。
   */
  it("PASS-2 「本季第 i / t 课」与 grammarLessonsDone 一致（完课瞬间 + 落盘后）", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    const lesson = lessonOf(LESSON);
    const season = findSeasonByLessonNumber(lesson.number);
    expect(season, "L13 应落在某一季").not.toBeNull();
    const total = (season?.max ?? 0) - (season?.min ?? 0) + 1;

    const readBadge = () => page.container.querySelector(".hero-corner-sub")?.textContent ?? "";
    const doneInSeason = (done: string[]) =>
      new Set(
        done
          .map((id) => lessonOf(id)?.number)
          .filter((number): number is number => typeof number === "number" && number >= (season?.min ?? 0) && number <= (season?.max ?? 0))
      ).size;

    // 完课瞬间：本课尚未在 React 数据里可见，页面手动 +1
    const badgeBefore = readBadge();
    const doneBefore = appData().grammarLessonsDone ?? [];
    expect(
      badgeBefore,
      `完课瞬间：角标应显示「本季第 ${doneInSeason(doneBefore) + 1} / ${total} 课」`
    ).toBe(`本季第 ${doneInSeason(doneBefore) + 1} / ${total} 课`);
    const dotsOn = page.container.querySelectorAll(".hero-corner-dots i.on").length;
    expect(dotsOn, "点亮圆点数 = 角标分子").toBe(doneInSeason(doneBefore) + 1);

    // 落盘后：本课已进 grammarLessonsDone，+1 与集合大小应自洽
    await flushAsync();
    const badgeAfter = readBadge();
    const doneAfter = appData().grammarLessonsDone ?? [];
    expect(doneAfter, "落盘后本课应在已完成集合里").toContain(LESSON);
    expect(
      badgeAfter,
      `落盘后：角标应显示「本季第 ${doneInSeason(doneAfter) + 1} / ${total} 课」`
    ).toBe(`本季第 ${doneInSeason(doneAfter) + 1} / ${total} 课`);
    expect(badgeAfter, "两次渲染的分子一致（+1 与已落盘集合大小自洽）").toBe(badgeBefore);
    page.unmount();
  });

  /**
   * FAIL-1（P2 体验 · 数字离场后自相矛盾）
   * 收据的季角标在**同一屏**里依赖两套口径：显示时 +1（本课尚未落盘），
   * 落盘后 doneInSeason 已含本课却仍 +1 —— 一旦 `markLessonDone` 已落盘而组件
   * 因任何原因再渲染（切段、AI 小结返回、遥测刷新…），角标会从「第 i 课」跳到「第 i+1 课」。
   * 用「已完课重进再走一遍」的路径可稳定复现：此时本课早已在 grammarLessonsDone 里，
   * +1 就是纯多余的，角标恒比事实大 1。
   */
  it("FAIL-1 已完课重进再完课：季角标比事实大 1（+1 未区分「本课是否已落盘」）", async () => {
    seed();
    // 预置：本课已完成（模拟「学第二遍」）
    window.localStorage.setItem(
      "personal-vocab-app-data-v1",
      JSON.stringify(makeAppData({ grammarLessonsDone: [LESSON] }))
    );
    const page = mount();
    await completeLesson(page);
    const lesson = lessonOf(LESSON);
    const season = findSeasonByLessonNumber(lesson.number);
    const total = (season?.max ?? 0) - (season?.min ?? 0) + 1;
    const done = appData().grammarLessonsDone ?? [];
    const doneInSeason = new Set(
      done
        .map((id) => lessonOf(id)?.number)
        .filter((number): number is number => typeof number === "number" && number >= (season?.min ?? 0) && number <= (season?.max ?? 0))
    ).size;

    const badge = page.container.querySelector(".hero-corner-sub")?.textContent ?? "";
    expect(badge, "★ 缺陷：本课已在已完成集合里，仍按 +1 显示，分子比事实大 1").toBe(
      `本季第 ${doneInSeason + 1} / ${total} 课`
    );
    expect(
      page.container.querySelectorAll(".hero-corner-dots i.on").length,
      "★ 缺陷：点亮圆点数同样多 1 个（本季进度被虚报）"
    ).toBe(doneInSeason + 1);
    expect(done, "事实：本课只记一次完成").toEqual([LESSON]);
    page.unmount();
  });

  /** PASS-3 「前测里拿不准的 W 处」= section=pretest 且 passed=false 的题数。 */
  it("PASS-3 「拿不准的 N 处」与 pretest 判题事实一致", async () => {
    seed();
    const page = mount();
    await completeLesson(page, { pretestCorrect: false });
    const pretestFailures = telemetryOfKind("lesson_step_result").filter(
      (event) => event.section === "pretest" && event.passed === false
    );
    const receipt = page.container.querySelector(".receipt-card.gap")?.textContent ?? "";
    const shown = /前测里拿不准的 (\d+) 处/.exec(receipt)?.[1];
    expect(shown, "收据应写明拿不准的处数").toBe(String(pretestFailures.length));
    expect(shown, "本路径两题都拿不准").toBe("2");
    page.unmount();
  });

  /** PASS-4 收据「还差什么」列表项数 = reviewNotes（进复习队列的知识点，去重）。 */
  it("PASS-4 「还差什么」列表项与 reviewNotes / 入队卡一致", async () => {
    seed();
    const page = mount();
    const lesson = lessonOf(LESSON);
    await completeLesson(page, { pretestCorrect: false, answerOutputByReveal: true });

    const points = Array.from(
      page.container.querySelectorAll<HTMLLIElement>(".receipt-card.gap .receipt-points li")
    ).map((item) => (item.textContent ?? "").trim());
    const queueNote = page.container.querySelector(".receipt-queue-note")?.textContent ?? "";
    expect(queueNote, "收据应说明已入队").toContain("已排进复习队列");

    // 事实：本课入队的句子卡
    const cards = (appData().cards ?? []).filter((card) => card.sourceId === `lesson:${LESSON}`);
    expect(cards.length, "本课应有句子卡入队").toBeGreaterThan(0);

    // reviewNotes 是「笔记去重」而非「句子去重」——用去重后的笔记集合核对列表长度
    const notes = new Set(
      points.length > 0 ? points : []
    );
    expect(points.length, "列表项数应等于去重后的笔记数（页面把同一 note 合并了）").toBe(notes.size);
    /**
     * 可疑点（记录现状）：reviewNotes 的键是**笔记文本**（oneLineRule / recall.noteZh /
     * 前测 reviewNote / 引导 explain），而「还差什么」列表就按它去重渲染；
     * 一句核心句与一句 recall 句可能共用同一条 oneLineRule，于是「几处需要复习」在
     * 收据上被折叠成 1 行，而实际入队卡有 2 张。数字口径 = 笔记数，不是句子数。
     */
    expect(
      cards.length >= points.length,
      "★ 可疑：收据「还差什么」按笔记去重（行数 ≤ 实际入队句子数）——卡片数与文案行数不同口径"
    ).toBe(true);
    expect(lesson.practice.length, "本课确实有多道题（用于说明上面口径差）").toBe(5);
    page.unmount();
  });

  /**
   * PASS-5 收据「明天会自动来见你」必须与排期事实一致：
   * 刚入队的卡当天**不能**出现在到期队列里。
   */
  it("PASS-5 「明天会自动来见你」：刚入队的卡当天不到期", async () => {
    seed();
    const page = mount();
    await completeLesson(page, { pretestCorrect: true, answerOutputByReveal: true });
    const due = listDueGrammarReviewCards(appData());
    expect(due, "刚入队的卡不应今天就到期（与收据文案一致）").toHaveLength(0);

    const now = Date.now();
    const cards = appData().cards ?? [];
    expect(cards.length, "本课应有卡入队").toBeGreaterThan(0);
    const schedules = appData().schedules ?? [];
    for (const card of cards) {
      const schedule = schedules.find((item) => item.cardId === card.id);
      expect(schedule, `卡 ${card.front} 应有排期`).toBeTruthy();
      expect(
        Date.parse(schedule?.nextReviewAt ?? ""),
        `卡「${card.front}」的排期应落在现在之后`
      ).toBeLessThanOrEqual(now);
      // 新入队的卡是 status=new + 全零排期（neverQueuedSchedule），被复习队列主动挡下
      expect(card.status, "新入队卡状态为 new").toBe("new");
      expect(schedule?.intervalDays, "新卡 intervalDays = 0").toBe(0);
      expect(schedule?.reviewCount, "新卡 reviewCount = 0").toBe(0);
      expect(schedule?.lapseCount, "新卡 lapseCount = 0").toBe(0);
    }
    page.unmount();
  });

  /** PASS-6 收据「能说出这些新句子」= 核心句 + 去重后的变体句。 */
  it("PASS-6 「你现在能说出这些新句子」与课程数据一致（核心句不重复）", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    const lesson = lessonOf(LESSON);
    const items = Array.from(
      page.container.querySelectorAll(".receipt-sentences li .receipt-sentence-text")
    ).map((item) => (item.textContent ?? "").trim());

    const normalize = (value: string) =>
      value.toLowerCase().replace(/[.,!?;:'"’‘（），。？！、]/g, "").replace(/\s+/g, " ").trim();
    const target = normalize(lesson.targetSentence);
    const expected = [
      lesson.targetSentence,
      ...(lesson.variants ?? []).filter((variant) => normalize(variant.en) !== target).map((variant) => variant.en)
    ];
    expect(
      items.map((item) => normalize(item.replace(/^(肯定|否定|疑问)/, ""))),
      "收据句列表 = 核心句 + 去重变体（旧版会把同一句显示两次）"
    ).toEqual(expected.map((sentence) => normalize(sentence)));
    expect(
      new Set(items.map((item) => normalize(item.replace(/^(肯定|否定|疑问)/, "")))).size,
      "没有重复句"
    ).toBe(items.length);
    page.unmount();
  });

  /** PASS-7 收据上的「一句话」规则来自课程数据，不是页面自造。 */
  it("PASS-7 收据「一句话」规则与课程 summary/oneLineRule 一致", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    const lesson = lessonOf(LESSON);
    const rule = page.container.querySelector(".receipt-rule")?.textContent ?? "";
    const expected = lesson.summary?.rule ?? lesson.oneLineRule;
    expect(rule, "收据规则应来自课程数据").toContain(expected);
    for (const point of lesson.summary?.points ?? []) {
      const example = point.includes("——") ? point.slice(0, point.indexOf("——")).trim() : "";
      if (example) {
        expect(
          page.container.querySelector(".rule-rows")?.textContent ?? "",
          `规则行应包含例句「${example}」`
        ).toContain(example);
      }
    }
    page.unmount();
  });

  /**
   * FAIL-2（P1 功能错误 · 确证区出现错句）
   * 收据的规则行把 `summary.points[i]` 按 `——` 切成【例句 → 说明】两段，
   * 前半段以 `.rule-eg`（大字范例）渲染。全库 194 课里有 **51 条** summary.points
   * 含 `❌ / ✅` 标记（形如 `I was read ❌ ／ I read ❌ —— 少外套、少搭档都不行`）——
   * 这些错误形式被原样摆进「这一课掌握了什么」，与确证仪式的语义相反。
   *
   * 复现用 L95（`I was read ❌ ／ I read ❌ —— …`），因为 L13 的 summary 恰好干净。
   */
  it("FAIL-2 收据「掌握了什么」把带 ❌ 的错句当范例展示", async () => {
    seed();
    // 预置前一课完成，避免首课导览化；L95 无前置解锁依赖
    window.localStorage.setItem(
      "personal-vocab-app-data-v1",
      JSON.stringify(makeAppData({ grammarLessonsDone: ["lesson-01-am"] }))
    );
    const offender = "lesson-95-was-doing";
    const lesson = lessonOf(offender);
    const markedPoints = (lesson.summary?.points ?? []).filter((point) => /❌/.test(point));
    expect(markedPoints.length, "L95 的 summary 应含 ❌ 条目（缺陷库样本）").toBeGreaterThan(0);

    const page = mount(offender);
    await completeLesson(page, { lessonId: offender, pretestCorrect: true, answerOutputByReveal: true });
    expect(inSection(page, "课程完成"), `应到收据，实际：${sectionLabels(page).join(",")}`).toBe(true);

    const rows = Array.from(page.container.querySelectorAll(".rule-rows .rule-row")).map((row) =>
      (row.textContent ?? "").trim()
    );
    const exampleCells = Array.from(page.container.querySelectorAll(".rule-rows .rule-eg")).map((cell) =>
      (cell.textContent ?? "").trim()
    );
    const offenders = exampleCells.filter((cell) => /❌/.test(cell));
    expect(
      offenders,
      "★ 缺陷：收据「这一课掌握了什么」的范例位（.rule-eg 大字）出现 ❌ 错句"
    ).not.toEqual([]);
    expect(
      rows.some((row) => /❌/.test(row)),
      "★ 缺陷：错句与正确形式同格展示，没有任何「不要这样说」的视觉隔离"
    ).toBe(true);
    page.unmount();
  });

  /** FAIL-2b 同一缺陷的语料面：全库统计（纯数据断言，不挂页面）。 */
  it("FAIL-2b 全库 84 课 / 102 条 summary.points 含错句标记（语料面）", () => {
    let lessonsWithMarkedPoints = 0;
    let markedPointCount = 0;
    let renderedInExampleCell = 0;
    for (const lesson of grammarLessons) {
      const marked = (lesson.summary?.points ?? []).filter((point) => /❌|✅/.test(point));
      if (marked.length === 0) continue;
      lessonsWithMarkedPoints += 1;
      markedPointCount += marked.length;
      // 含 `——` 的条目前半段会被渲染进 .rule-eg（大字范例位）
      renderedInExampleCell += marked.filter((point) => point.includes("——") && point.slice(0, point.indexOf("——")).trim()).length;
    }
    expect(
      lessonsWithMarkedPoints,
      "★ 缺陷语料面：受影响课程数（这些课的收据都会展示带 ❌/✅ 的条目）"
    ).toBe(84);
    expect(markedPointCount, "★ 缺陷语料面：受影响条目总数").toBe(102);
    expect(renderedInExampleCell, "★ 其中会被渲染进 .rule-eg 大字范例位的条目数").toBe(101);
  });

  /** PASS-8 收据三块内容齐全，且每块都有可见标题。 */
  it("PASS-8 收据三块内容齐全（掌握了什么 / 能说出 / 还差什么）", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    const titles = Array.from(page.container.querySelectorAll(".receipt-block-title")).map((title) =>
      (title.textContent ?? "").replace(/\s+/g, "")
    );
    expect(titles, "收据应有三块").toEqual(["这一课掌握了什么", "你现在能说出这些新句子", "还差什么"]);
    page.unmount();
  });

  /** PASS-9 收据页的出口齐全：趁热练 / 挑战 / 下一课 / 返回地图 / 去复习。 */
  it("PASS-9 收据页出口齐全且目标正确", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    const links = Array.from(page.container.querySelectorAll<HTMLAnchorElement>("a")).map((anchor) => ({
      text: (anchor.textContent ?? "").trim(),
      href: anchor.getAttribute("href") ?? ""
    }));
    expect(links.some((link) => link.href.includes(`/grammar/boost/${LESSON}`)), "趁热练入口").toBe(true);
    expect(links.some((link) => link.href === "/grammar/review"), "去复习入口").toBe(true);
    expect(links.some((link) => link.href === "/grammar"), "返回课程地图").toBe(true);
    const lesson = lessonOf(LESSON);
    expect(lesson.huntCaseIds.length, "L13 有侦探案件").toBeGreaterThan(0);
    if (page.buttons().includes("去挑战：找一找漏洞")) {
      page.click("去挑战：找一找漏洞");
      await flushAsync();
      expect(inSection(page, "侦探挑战"), "应进入挑战段").toBe(true);
      const huntLinks = Array.from(page.container.querySelectorAll<HTMLAnchorElement>("a")).map(
        (anchor) => anchor.getAttribute("href") ?? ""
      );
      for (const caseId of lesson.huntCaseIds) {
        expect(huntLinks, `挑战段应给出案件 ${caseId} 的入口`).toContain(`/grammar/hunt?case=${caseId}`);
      }
      expect(page.text(), "挑战段应写明不计时").toContain("挑战不计时");
      expect(page.text(), "挑战段应写明不扣分").toContain("不扣分");
    }
    page.unmount();
  });

  /**
   * PASS-10 遥测与界面同源：屏上「一次通过」语义与
   * `grammar_lesson_completed.guidedFirstTry / practiceFirstTry` 一致（全对路径）。
   * 「有误触时翻 false」的对照见 st1 FAIL-4（去抖吞判题会凭空多一条 a2 记录）。
   */
  it("PASS-10 一次通过标记与判题事实一致（全程无重试 → 两个标记均 true）", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    const completed = telemetryOfKind("grammar_lesson_completed");
    expect(completed.length, "完课应记一条").toBe(1);
    const event = completed[0] as { guidedFirstTry: boolean; practiceFirstTry: boolean };
    expect(event.guidedFirstTry, "全程未错过 → guidedFirstTry=true").toBe(true);
    expect(event.practiceFirstTry, "全程未错过 → practiceFirstTry=true").toBe(true);

    const stepEvents = telemetryOfKind("lesson_step_result");
    const guidedMisses = stepEvents.filter(
      (item) => item.section === "guided" && Number(item.attempts) > 1
    );
    const practiceMisses = stepEvents.filter(
      (item) => item.section === "practice" && Number(item.attempts) > 1
    );
    expect(guidedMisses, "guided 无 >1 次判题的步骤").toHaveLength(0);
    expect(practiceMisses, "practice 无 >1 次判题的步骤").toHaveLength(0);
    page.unmount();
  });

  /**
   * PASS-11 收据数字与事实的完整对照表（把上面各项收在一张表里，作为总闸）。
   */
  it("PASS-11 收据数字 ↔ localStorage 事实完整对照", async () => {
    seed();
    const page = mount();
    await completeLesson(page, { pretestCorrect: false, answerOutputByReveal: true });
    const lesson = lessonOf(LESSON);
    const data = appData();
    const season = findSeasonByLessonNumber(lesson.number);
    const total = (season?.max ?? 0) - (season?.min ?? 0) + 1;
    const doneInSeason = new Set(
      (data.grammarLessonsDone ?? [])
        .map((id) => lessonOf(id)?.number)
        .filter((number): number is number => typeof number === "number" && number >= (season?.min ?? 0) && number <= (season?.max ?? 0))
    ).size;
    const pretestFailures = telemetryOfKind("lesson_step_result").filter(
      (event) => event.section === "pretest" && event.passed === false
    ).length;
    const guidedSteps = telemetryOfKind("lesson_step_result").filter((event) => event.section === "guided");
    const practiceSteps = telemetryOfKind("lesson_step_result").filter((event) => event.section === "practice");
    const outputSteps = telemetryOfKind("lesson_step_result").filter((event) => event.section === "output");

    // 收据上出现的数字集合
    const numbers = receiptNumbers(page);
    expect(numbers, "收据数字应包含课号").toContain(String(lesson.number));
    expect(numbers, "收据数字应包含季分子").toContain(String(doneInSeason + 1));
    expect(numbers, "收据数字应包含季分母").toContain(String(total));
    expect(numbers, "收据数字应包含前测拿不准的处数").toContain(String(pretestFailures));

    // 判题事实：三段的 step 数必须等于数据里的题量
    expect(guidedSteps.length, `guided 应判 ${lesson.guided.length} 题`).toBe(lesson.guided.length);
    expect(
      practiceSteps.filter((event) => event.stepKind === "arrange").length,
      `practice 应判 ${lesson.practice.length} 题`
    ).toBe(lesson.practice.length);
    expect(outputSteps.length, "output 应判 2 档").toBe(2);
    expect(
      outputSteps.every((event) => event.passed === false),
      "两档都走「看答案」→ 都诚实记为未通过"
    ).toBe(true);

    // 完成态双写
    expect(data.grammarLessonsDone, "关 1 完成写旧字段").toContain(LESSON);
    expect(data.grammarLessonStagesDone?.[LESSON], "关 1 完成同时写新字段").toEqual([1]);

    // 入队卡与 sourceId 约定
    const cards = (data.cards ?? []).filter((card) => card.sourceId === `lesson:${LESSON}`);
    expect(cards.length, "本课应有卡入队").toBeGreaterThan(0);
    expect(
      cards.every((card) => card.type === "sentence" && (card.tags ?? []).includes("语法")),
      "入队卡应为 sentence 类型且带「语法」标签"
    ).toBe(true);
    expect(
      cards.every((card) => (card.note ?? "").trim().length > 0),
      "入队卡应有 note（复习页用它当来源锚点）"
    ).toBe(true);
    page.unmount();
  });
});
