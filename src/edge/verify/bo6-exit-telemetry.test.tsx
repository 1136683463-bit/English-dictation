// @vitest-environment jsdom
/**
 * BO6 · 退出与放弃埋点（清单项 6）
 *
 * 设计声明（GrammarBoostPage.tsx:173-202 注释）：
 *   「中途离开：未完成且**已答过题** → 记 abandoned。答 0 题不算放弃（2026-09-20 修）：
 *     原先 itemsCountRef 在出题 effect 就被写成题目总数 → 守卫恒 false，
 *     『点进来看一眼就走』也记一条 abandoned，抬高放弃率。」
 *
 * 三档完整覆盖：
 * ① 答 0 题退出 → 只有 started，没有 abandoned；
 * ② 答 1 题退出 → started + abandoned（answered=1）；
 * ③ 做完退出 → started + completed，没有 abandoned；
 * ④ 换档（档 1 完成 → 档 2）不产生假 abandoned；
 * ⑤ StrictMode 下不重复记账；
 * ⑥ 走页面内链接离开（真实动线）同样成立。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { act, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "../../AppContext";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { BOOST_TIER_META, buildBoostItems, buildBoostSeenIndex, type BoostItem, type BoostTier } from "../../services/grammarBoostService";
import { listGrammarEventsByKind, summarizeGrammarTelemetry } from "../../services/grammarTelemetry";
import { DONE_LESSON_ID, readAppData, readTelemetry, seedAppData, telemetryOfKind } from "./fixtures";
import { answerBoostItem, flushAsync } from "./drive";

const seedLesson = (patch: Record<string, unknown> = {}) =>
  seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
    ...patch
  });

const mountBoost = (search = "", lessonId = DONE_LESSON_ID) =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${lessonId}${search}`, "/grammar/boost/:lessonId");

/** 与页面同序地规划当前该出哪些题（seen 来自遥测、round 来自完成次数）。 */
const planLikePage = (tier: BoostTier): BoostItem[] => {
  const seen = buildBoostSeenIndex(readAppData());
  const round = listGrammarEventsByKind("grammar_boost_completed").filter(
    (event) => event.lessonId === DONE_LESSON_ID && event.tier === tier
  ).length;
  let next = buildBoostItems(DONE_LESSON_ID, tier, { seen, round });
  if (next.length === 0) next = buildBoostItems(DONE_LESSON_ID, tier, { round });
  return next;
};

/** 只答题不推进（每题答对后停在该题反馈区）。 */
const answerOnly = (page: ReturnType<typeof mountBoost>, count: number) => {
  const items = planLikePage(1);
  for (let index = 0; index < count; index += 1) {
    expect(answerBoostItem(page, items[index]), `第 ${index + 1} 题`).toBe("passed");
    if (index + 1 < count) page.click("下一题");
  }
  return items;
};

describe("BO6-a 三档退出情形（0 题 / 1 题 / 完成）", () => {
  beforeEach(() => resetStorage());

  it("答 0 题退出（进入档位后立刻离开）：只有 started，没有 abandoned", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    expect(page.has(`第 1 / ${BOOST_TIER_META[1].questionCount} 题`)).toBe(true);
    page.unmount();
    await flushAsync();

    expect(telemetryOfKind("grammar_boost_started").length).toBe(1);
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
    expect(telemetryOfKind("grammar_boost_step_result").length).toBe(0);
    expect(telemetryOfKind("grammar_boost_completed").length).toBe(0);
  });

  it("答 1 题并推进到下一题后退出：记 1 条 abandoned，answered=1、total=声明题量", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    const items = answerOnly(page, 1);
    page.click("下一题");
    page.unmount();
    await flushAsync();

    const abandoned = telemetryOfKind("grammar_boost_abandoned");
    expect(abandoned.length).toBe(1);
    expect(abandoned[0].lessonId).toBe(DONE_LESSON_ID);
    expect(abandoned[0].tier).toBe(1);
    expect(abandoned[0].answered).toBe(1);
    expect(abandoned[0].total).toBe(BOOST_TIER_META[1].questionCount);
    expect(typeof abandoned[0].dwellMs).toBe("number");
    expect(telemetryOfKind("grammar_boost_started").length).toBe(1);
    expect(telemetryOfKind("grammar_boost_completed").length).toBe(0);
    void items;
  });

  /**
   * 【已确认缺陷 · P2 埋点口径】答完一题、**还停在反馈区**（尚未点「下一题」）就退出，
   * 不记 abandoned。
   *
   * 机制：`answeredRef.current` 只在 `advance()` 里自增（GrammarBoostPage.tsx:340），
   * 而 `advance` 由反馈区的「下一题 / 完成这一档」按钮触发；判题本身的
   * `recordStep` 只写 step_result、不碰 answeredRef。
   * 于是「答了一题、看完反馈直接关页面」这条真实动线记成「0 题放弃」，
   * 而 abandonRate = abandoned / started 的分母里有这个会话，
   * 分母被抬高 → 放弃率被**系统性低估**（与此前修掉的「0 题也记放弃」正好反向）。
   *
   * 佐证：同一会话若多点一次「下一题」，abandoned 就正常记账（上一个用例）。
   * 本用例断言「答过题就该记 abandoned」，当前为 failing —— 修复后应转绿。
   */
  it("BR-EXIT-1：答完 1 题（停在反馈区）就退出也应记 abandoned（当前为已确认缺陷）", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    answerOnly(page, 1);
    // 不点「下一题」，直接关掉页面——这是「看完了就走」的真实动线
    expect(page.buttons(), "前提：应停在 pass 反馈区").toContain("下一题");
    page.unmount();
    await flushAsync();

    expect(telemetryOfKind("grammar_boost_step_result").length, "前提：确实答了 1 题").toBe(1);
    const abandoned = telemetryOfKind("grammar_boost_abandoned");
    expect(abandoned.length, "答过题就离开，abandoned 应记 1 条（否则放弃率被低估）").toBe(1);
  });

  it("做完一档退出：记 completed，没有 abandoned；完成态写入", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    const items = planLikePage(1);
    for (const [index, item] of items.entries()) {
      expect(answerBoostItem(page, item)).toBe("passed");
      if (index + 1 < items.length) page.click("下一题");
      else page.click("完成这一档");
    }
    page.unmount();
    await flushAsync();

    expect(telemetryOfKind("grammar_boost_completed").length).toBe(1);
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
    expect(telemetryOfKind("grammar_boost_started").length).toBe(1);
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1]);
  });

  it("档 3 答 2 题并推进后退出：abandoned 的 tier=3、total=3", async () => {
    seedLesson({ grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] } });
    const page = mountBoost("?tier=3");
    const items = planLikePage(3);
    expect(answerBoostItem(page, items[0])).toBe("passed");
    page.click("下一题");
    expect(answerBoostItem(page, items[1])).toBe("passed");
    page.click("下一题");
    page.unmount();
    await flushAsync();

    const abandoned = telemetryOfKind("grammar_boost_abandoned");
    expect(abandoned.length).toBe(1);
    expect(abandoned[0].tier).toBe(3);
    expect(abandoned[0].answered).toBe(2);
    expect(abandoned[0].total).toBe(BOOST_TIER_META[3].questionCount);
  });
});

describe("BO6-b 换档不产生假 abandoned", () => {
  beforeEach(() => resetStorage());

  it("档 1 完成 → 完成态继续做档 2 → 档 2 答 0 题退出：只有档 1 的 completed，没有 abandoned", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    const items = planLikePage(1);
    for (const [index, item] of items.entries()) {
      expect(answerBoostItem(page, item)).toBe("passed");
      if (index + 1 < items.length) page.click("下一题");
      else page.click("完成这一档");
    }
    await flushAsync();
    // 从完成态点「再深一点」进档 2
    const deeper = page.buttons().find((text) => text.includes("再深一点"));
    expect(deeper, "完成态没有「再深一点」按钮").toBeTruthy();
    page.clickMatch(/再深一点/);
    expect(page.has(`第 1 / ${BOOST_TIER_META[2].questionCount} 题`)).toBe(true);
    page.unmount();
    await flushAsync();

    const abandoned = telemetryOfKind("grammar_boost_abandoned");
    expect(abandoned.length, `档 2 一题未答不该记 abandoned：${JSON.stringify(abandoned)}`).toBe(0);
    expect(telemetryOfKind("grammar_boost_completed").length).toBe(1);
    expect(telemetryOfKind("grammar_boost_completed")[0].tier).toBe(1);
    expect(telemetryOfKind("grammar_boost_started").length).toBe(2);
  });

  it("档 1 答 1 题并推进后退出：abandoned 只对应真实作答的那一档", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    answerOnly(page, 1);
    page.click("下一题");
    page.unmount();
    await flushAsync();
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(1);
    expect(telemetryOfKind("grammar_boost_abandoned")[0].tier).toBe(1);
  });
});

describe("BO6-c StrictMode 下的记账守卫", () => {
  beforeEach(() => resetStorage());

  const mountStrict = (path: string) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(
        <StrictMode>
          <AppProvider>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route path="/grammar/boost/:lessonId" element={<GrammarBoostPage />} />
              </Routes>
            </MemoryRouter>
          </AppProvider>
        </StrictMode>
      );
    });
    return {
      container,
      buttons: () => Array.from(container.querySelectorAll("button")).map((b) => (b.textContent ?? "").trim()),
      click: (label: string) => {
        const target = Array.from(container.querySelectorAll("button")).find(
          (b) => (b.textContent ?? "").trim() === label
        ) as HTMLButtonElement;
        act(() => target.click());
      },
      unmount: () => {
        act(() => root.unmount());
        container.remove();
      }
    };
  };

  it("StrictMode：进档再离开（0 题）→ started 只 1 条、无 abandoned", async () => {
    seedLesson();
    const page = mountStrict(`/grammar/boost/${DONE_LESSON_ID}?tier=1`);
    page.unmount();
    await flushAsync();
    expect(telemetryOfKind("grammar_boost_started").length).toBe(1);
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
  });

  it("StrictMode：答 1 题、点「下一题」后离开 → abandoned 只 1 条", async () => {
    seedLesson();
    const page = mountStrict(`/grammar/boost/${DONE_LESSON_ID}?tier=1`);
    // 档 1 第一题是 spot：点对错词位置即通过
    const items = planLikePage(1);
    const spot = items[0];
    const accepted = spot.spotWrongIndexes?.length ? spot.spotWrongIndexes : [spot.spotWrongIndex ?? -1];
    const chips = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
    act(() => chips[accepted[0]].click());
    page.click("下一题");
    page.unmount();
    await flushAsync();
    expect(telemetryOfKind("grammar_boost_abandoned").length, "StrictMode 下 abandoned 重复记账").toBe(1);
    expect(telemetryOfKind("grammar_boost_started").length).toBe(1);
  });
});

describe("BO6-d 真实动线：走页面内链接离开", () => {
  beforeEach(() => resetStorage());

  it("答 1 题、点「下一题」后走页面内链接离开 → 记 abandoned（组件卸载即结算）", async () => {
    seedLesson();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(
        <AppProvider>
          <MemoryRouter initialEntries={[`/grammar/boost/${DONE_LESSON_ID}?tier=1`]}>
            <Routes>
              <Route path="/grammar/boost/:lessonId" element={<GrammarBoostPage />} />
              <Route path="/grammar" element={<div>语法地图占位</div>} />
            </Routes>
          </MemoryRouter>
        </AppProvider>
      );
    });
    const items = planLikePage(1);
    const spot = items[0];
    const accepted = spot.spotWrongIndexes?.length ? spot.spotWrongIndexes : [spot.spotWrongIndex ?? -1];
    const chips = Array.from(container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
    act(() => chips[accepted[0]].click());
    expect(container.textContent).toContain("对了");

    // 走到下一题（answeredRef 只在 advance 里自增）
    const next = Array.from(container.querySelectorAll("button")).find(
      (button) => (button.textContent ?? "").trim() === "下一题"
    ) as HTMLButtonElement;
    act(() => next.click());

    const back = Array.from(container.querySelectorAll("a")).find((anchor) =>
      (anchor.textContent ?? "").includes("先回去")
    ) as HTMLAnchorElement;
    expect(back, "找不到「先回去，晚点再来」出口").toBeTruthy();
    act(() => back.click());
    await flushAsync();

    expect(container.textContent).toContain("语法地图占位");
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(1);
    expect(telemetryOfKind("grammar_boost_abandoned")[0].answered).toBe(1);
    act(() => root.unmount());
    container.remove();
  });

  it("答 0 题后点「先回去」→ 不记 abandoned", async () => {
    seedLesson();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(
        <AppProvider>
          <MemoryRouter initialEntries={[`/grammar/boost/${DONE_LESSON_ID}?tier=2`]}>
            <Routes>
              <Route path="/grammar/boost/:lessonId" element={<GrammarBoostPage />} />
              <Route path="/grammar" element={<div>语法地图占位</div>} />
            </Routes>
          </MemoryRouter>
        </AppProvider>
      );
    });
    const back = Array.from(container.querySelectorAll("a")).find((anchor) =>
      (anchor.textContent ?? "").includes("先回去")
    ) as HTMLAnchorElement;
    act(() => back.click());
    await flushAsync();
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
    act(() => root.unmount());
    container.remove();
  });
});

describe("BO6-e 选择态 / 未准入的曝光埋点", () => {
  beforeEach(() => resetStorage());

  it("?from=receipt 的选择态记 offered（entryPoint=settlement），direct 不记", async () => {
    seedLesson();
    const withFrom = mountBoost("?from=receipt");
    await flushAsync();
    const offered = telemetryOfKind("grammar_boost_offered");
    expect(offered.length).toBe(1);
    expect(offered[0].entryPoint).toBe("settlement");
    expect(offered[0].lessonId).toBe(DONE_LESSON_ID);
    expect(offered[0].recommendedTier).toBe(1);
    withFrom.unmount();

    resetStorage();
    seedLesson();
    const direct = mountBoost();
    await flushAsync();
    expect(telemetryOfKind("grammar_boost_offered").length).toBe(0);
    direct.unmount();
  });

  it("?from=card / reaudit 各自映射正确", async () => {
    for (const [from, expected] of [
      ["card", "card"],
      ["reaudit", "reaudit"]
    ] as const) {
      resetStorage();
      seedLesson();
      const page = mountBoost(`?from=${from}`);
      await flushAsync();
      expect(telemetryOfKind("grammar_boost_offered")[0]?.entryPoint, `from=${from}`).toBe(expected);
      page.unmount();
    }
  });

  it("未准入的课不给入口：页面显示「先上完这一课」且无练习按钮", async () => {
    seedAppData({ grammarLessonsDone: [] });
    const page = mountBoost("?tier=1&from=receipt");
    expect(page.has("先上完这一课")).toBe(true);
    expect(page.buttons().filter((text) => text.includes("约")).length, "未准入却渲染了档位卡").toBe(0);
    page.unmount();
  });

  it("abandonRate 口径可用（abandoned / started 都是真事件）", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    answerOnly(page, 1);
    page.click("下一题");
    page.unmount();
    await flushAsync();
    const summary = summarizeGrammarTelemetry().boost;
    expect(summary.started).toBe(1);
    expect(summary.abandoned).toBe(1);
    expect(summary.abandonRate).toBe(1);
    // 答了 1 题就走：题量数据里没有这道题的痕迹（通过率样本只来自 completed）
    expect(summary.firstTryRateByTier[1]).toBe(0);
    expect(telemetryOfKind("grammar_boost_step_result").length).toBe(1);
  });

  it("遥测写入独立键空间：不污染 AppData", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    page.unmount();
    await flushAsync();
    const appRaw = window.localStorage.getItem("personal-vocab-app-data-v1") ?? "";
    expect(appRaw).not.toContain("grammar_boost_abandoned");
    expect(readTelemetry().length).toBeGreaterThan(0);
  });
});

describe("BO6-f 【已确认缺陷】入口门禁与曝光埋点的顺序问题", () => {
  beforeEach(() => resetStorage());

  /**
   * 【已确认缺陷 · P2 埋点口径】未准入的课（关 1 未完成）**也记 started / offered**。
   *
   * 机制：GrammarBoostPage 的两个埋点 effect（offered 在 :145、started 在 :160）
   * 都写在 `if (!canBoostLesson(...)) return ...`（:241）**之前**。
   * 于是用直链 `?tier=1&from=receipt` 打开一节没学过的课时，
   * 页面显示「先上完这一课」（用户没进任何档），遥测却记下：
   *   grammar_boost_started { tier:1, questionCount:4, entryPoint:"direct" }
   *   grammar_boost_offered { entryPoint:"settlement", recommendedTier:1 }
   *
   * 后果：`startRate = started / offered` 与三档漏斗的分子都被
   * 「未准入的直链/外部链接」污染——而这一批会话在数据上完全等价于
   * 「用户看到了入口并决定练习」。
   *
   * 佐证：不存在的课（`lesson-does-not-exist`）走 `if (!lesson) return`（:228，
   * 在埋点 effect 之前）则一条事件都不记——同一种「页面不可用」，两种记账行为。
   */
  it("BR-EXIT-2：未准入的课不应记任何 boost 埋点（当前为已确认缺陷）", async () => {
    const cases = ["?tier=1&from=receipt", "?from=receipt", "?tier=1", "?from=card", "?tier=3&from=reaudit"];
    const observed: Array<{ search: string; events: string[] }> = [];
    for (const search of cases) {
      resetStorage();
      seedAppData({ grammarLessonsDone: [] });
      const page = mountBoost(search);
      expect(page.has("先上完这一课"), `前提：${search} 应显示准入空态`).toBe(true);
      await flushAsync();
      observed.push({
        search,
        events: readTelemetry()
          .map((event) => String(event.kind))
          .filter((kind) => kind.startsWith("grammar_boost_"))
      });
      page.unmount();
    }
    expect(
      observed.filter((entry) => entry.events.length > 0),
      `未准入的课却记了埋点：\n${observed.map((e) => `${e.search} → ${e.events.join(",") || "(无)"}`).join("\n")}`
    ).toEqual([]);
  });

  /**
   * 【已确认缺陷 · P2 埋点口径】课内入口 `?from=lesson` 被记成 `direct`。
   *
   * 机制：GrammarBoostPage.tsx:63-64 的映射只认 receipt/card/reaudit，其余一律落 "direct"。
   * 而正课页的档位条（GrammarLessonPage.tsx:2086）用的正是 `from=lesson`
   * ——它是 W1 新增的第三个入口，也是「学完当课立刻练」的主入口。
   *
   * 后果：`startedByEntry.lesson` 结构上恒为 0（GrammarBoostStartedEvent 的
   * entryPoint 类型里甚至没有 "lesson"），started 全落到 direct 桶里；
   * 「课内入口带来多少进入」这个新增入口的转化率**永远无法归因**。
   * 注意 offered 侧是对的（正课页自己 append 了 entryPoint:"lesson"），
   * 于是出现了同一入口 startRate 结构性偏低（分子记 direct、分母记 lesson）。
   *
   * 本用例断言「from=lesson 应映射到 lesson」，当前为 failing —— 修复后应转绿。
   */
  it("BR-EXIT-3：课内入口 ?from=lesson 应记 entryPoint=lesson（当前为已确认缺陷）", async () => {
    seedLesson();
    const page = mountBoost("?tier=1&from=lesson");
    await flushAsync();
    const started = telemetryOfKind("grammar_boost_started");
    expect(started.length).toBe(1);
    expect(
      started[0].entryPoint,
      `课内入口被记成了 ${String(started[0].entryPoint)}（应为 lesson）；startedByEntry 会把它算进 direct`
    ).toBe("lesson");
    page.unmount();
  });

  it("其余入口映射正确（receipt→settlement / card→card / reaudit→reaudit / 无参数→direct）", async () => {
    const mapping: Array<[string, string]> = [
      ["?tier=1&from=receipt", "settlement"],
      ["?tier=1&from=card", "card"],
      ["?tier=1&from=reaudit", "reaudit"],
      ["?tier=1", "direct"]
    ];
    for (const [search, expected] of mapping) {
      resetStorage();
      seedLesson();
      const page = mountBoost(search);
      await flushAsync();
      expect(telemetryOfKind("grammar_boost_started")[0]?.entryPoint, `from=${search}`).toBe(expected);
      page.unmount();
    }
  });

  it("对照组：不存在的课一条事件都不记（说明「页面不可用就不该记账」是既有口径）", async () => {
    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    const page = mountBoost("?tier=1&from=receipt", "lesson-does-not-exist");
    expect(page.has("课程不存在")).toBe(true);
    await flushAsync();
    expect(telemetryOfKind("grammar_boost_started").length).toBe(0);
    expect(telemetryOfKind("grammar_boost_offered").length).toBe(0);
    page.unmount();
  });
});
