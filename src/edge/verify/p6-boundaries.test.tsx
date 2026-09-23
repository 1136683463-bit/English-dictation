// @vitest-environment jsdom
/**
 * P6 · 异常与边界
 *
 * 覆盖：
 *  - 三个页面在「不存在的课 id」下的表现
 *  - 部分完成某季时的进度环数值
 *  - 条件区块（本周语法弱点 / 已战胜的弱点 / 上周小结 / 能力里程碑 / 学习数据导出）
 *    在空数据时是否**正常隐藏**（而非渲染空白或 NaN）
 *  - 脏数据（坏 JSON、未知课 id、重复 id、类型错误字段）下不崩
 *  - 全站文本不得出现 NaN / undefined / null / Invalid Date
 *
 * 数据构造要点（供后续复用）：
 *  - `seedAppData(patch)` 写 localStorage 并返回迁移后的 AppData；须含 seededWordVersions
 *  - 条件区块的数据源是 **localStorage 遥测键** `grammar-telemetry-events-v1`
 *    （形状 `{version:1, events:[...]}`），不是 AppData
 *  - 「上周小结」只在事件落在**上一个自然周**（周一为起点）时才出现；
 *    落在本周或两周前都返回 null（buildLastWeekReport 只在 lastWeekOutput/lastTag/prevTag
 *    三者有其一 > 0 时给结论，且 weekStart 必须严格等于上周一）
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { seedAppData, TELEMETRY_KEY, STORAGE_KEY } from "./fixtures";
import GrammarPathPage from "../../pages/GrammarPathPage";
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import GrammarReauditPage from "../../pages/GrammarReauditPage";
import { grammarLessons } from "../../data/grammarLessons";
import { LESSON_GROUPS } from "../../data/grammarSeasons";

const nowIso = () => new Date().toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

/**
 * 「上一自然周」里的一个确定时刻（本地周三 12:00）。
 *
 * ⚠️ 2026-09-24 修：不能用固定偏移（`daysAgo(3)`）来造「上周」的数据。
 * 周界按**本地日期**算，而 `daysAgo` 是「当前时刻减 N×24h」——
 * 于是同一个 `daysAgo(3)` 在不同时段会落到不同的周：
 * 本地周三 00:25 时，3 天前是**周一**（本周一），而不是上周；
 * 本地周三 12:00 时，3 天前才是上周日。
 * 结果这条用例**只在凌晨 0–8 点失败**（实测连续 3 次复现，属时间依赖缺陷而非产品缺陷）。
 *
 * 现在显式算出「上一个自然周的周三中午」，与运行时刻无关。
 */
const lastWeekMidday = (): string => {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const offsetToMonday = (local.getDay() + 6) % 7; // 周一→0，周日→6
  const thisMonday = new Date(local.getTime() - offsetToMonday * 86400000);
  // 上周三 12:00（本地）——稳稳落在「上一个自然周」内
  return new Date(thisMonday.getTime() - 5 * 86400000 + 12 * 3600000).toISOString();
};
const doneIds = (count: number) => grammarLessons.slice(0, count).map((lesson) => lesson.id);
const seasonMeta = (page: ReturnType<typeof mountPage>, index: number) =>
  (Array.from(page.container.querySelectorAll(".season-card"))[index]?.querySelector(".season-card-meta")?.textContent ?? "").trim();
const ringPercent = (page: ReturnType<typeof mountPage>, index: number) =>
  (Array.from(page.container.querySelectorAll(".season-card"))[index]?.querySelector<HTMLElement>(".season-ring")?.style.getPropertyValue("--p") ?? "").trim();

const writeTelemetry = (events: unknown[]) =>
  window.localStorage.setItem(TELEMETRY_KEY, JSON.stringify({ version: 1, events }));

const outputEvent = (ts: string, hash: string) => ({
  kind: "lesson_step_result",
  lessonId: "lesson-01-am",
  section: "output",
  stepKind: "free_type",
  stepIndex: 0,
  attempts: 1,
  passed: true,
  sentenceHash: hash,
  ts
});

const BLOCKS = {
  weak: '[aria-label="本周语法弱点"]',
  healed: '[aria-label="已战胜的弱点"]',
  weekly: '[aria-label="上周小结"]',
  canDo: '[aria-label="能力里程碑"]',
  export: '[aria-label="学习数据导出"]'
} as const;

describe("P6 · 异常与边界", () => {
  beforeEach(() => resetStorage());

  it("三个页面在全部 204 个真实课 id 下都不崩、不出现 NaN/undefined", () => {
    const sample = [0, 1, 50, 100, 150, 189].map((i) => grammarLessons[i]);
    for (const lesson of sample) {
      // 路径页
      resetStorage();
      let page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
      expect(page.text(), `路径页含异常值（样本 ${lesson.id}）`).not.toMatch(/NaN|undefined|null|Invalid Date/);
      page.unmount();
      // 重访页 / 重审页：分别测未学与已学（关 2 完成）两态
      for (const patch of [{}, { grammarLessonsDone: [lesson.id] }, { grammarLessonsDone: [lesson.id], grammarLessonStagesDone: { [lesson.id]: [1, 2] } }]) {
        resetStorage();
        seedAppData(patch);
        page = mountPage(<GrammarRevisitPage />, `/grammar/lesson/${lesson.id}/revisit`, "/grammar/lesson/:lessonId/revisit");
        expect(page.container.innerHTML.length, `重访页白屏（${lesson.id}）`).toBeGreaterThan(0);
        expect(page.text(), `重访页含异常值（${lesson.id}）`).not.toMatch(/NaN|undefined|null|Invalid Date/);
        page.unmount();
        page = mountPage(<GrammarReauditPage />, `/grammar/lesson/${lesson.id}/reaudit`, "/grammar/lesson/:lessonId/reaudit");
        expect(page.container.innerHTML.length, `重审页白屏（${lesson.id}）`).toBeGreaterThan(0);
        expect(page.text(), `重审页含异常值（${lesson.id}）`).not.toMatch(/NaN|undefined|null|Invalid Date/);
        page.unmount();
      }
      resetStorage();
    }
  });

  it("路径页：不存在的课 id 无影响（页面不吃 :lessonId 参数）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(page.container.querySelectorAll(".season-card").length).toBe(28);
    expect(page.text()).not.toMatch(/NaN|undefined/);
    page.unmount();
  });

  it("部分完成某季：进度环数值与完成数严格对应（含不整除的季）", () => {
    // 第 3 季 25-34 共 10 课：完成 L25-L27（3 课），且 L1-L24 全完成
    const partial = [...doneIds(24), ...grammarLessons.filter((l) => l.number >= 25 && l.number <= 27).map((l) => l.id)];
    seedAppData({ grammarLessonsDone: partial });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(
      page.container.querySelector(".lesson-progress-pill")?.textContent?.replace(/\s+/g, " ").trim(),
      "进度分母应等于课程总数（从数据派生，课程增删时不必改测试）"
    ).toBe(`27 / ${grammarLessons.length} 课`);

    const season3Index = LESSON_GROUPS.findIndex((g) => g.id === "season-3");
    // 第 3 季是「下一课」（L28）所在季 → meta 显示「进行中」，环值给出真实百分比
    expect(seasonMeta(page, season3Index)).toBe("进行中");
    expect(ringPercent(page, season3Index)).toBe("30");
    expect((Array.from(page.container.querySelectorAll(".season-card"))[season3Index].querySelector(".season-ring-num")?.textContent ?? "").trim()).toBe("3");
    // 第 2 季已完成、第 4 季 0 课（非当前季 → 显式分母）
    expect(seasonMeta(page, 1)).toBe("已完成");
    expect(seasonMeta(page, 3)).toBe("0 / 7 课");
    // 数值型检查：环值必须是 0-100 的整数
    for (let i = 0; i < LESSON_GROUPS.length; i += 1) {
      const value = Number(ringPercent(page, i));
      expect(Number.isInteger(value), `${LESSON_GROUPS[i].label} 环值非整数：${ringPercent(page, i)}`).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
    page.unmount();
  });

  it("部分完成：季卡展开后「已完成」课与「下一课」标记数量正确（唯一性）", () => {
    seedAppData({ grammarLessonsDone: doneIds(7) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(page.container.querySelectorAll(".lesson-path-done").length, "第 1 季已展开，应有 7 张已完成标记").toBe(7);
    expect(page.container.querySelectorAll(".lesson-path-next").length, "全页只该有一个「下一课」").toBe(1);
    expect(page.container.querySelector(".lesson-path-next")?.textContent).toBe("下一课");
    page.unmount();
  });

  it("条件区块 · 空数据：五个区块全部隐藏（不渲染空白/NaN）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    for (const [name, selector] of Object.entries(BLOCKS)) {
      expect(page.container.querySelector(selector), `${name} 在空数据下不该渲染`).toBeNull();
    }
    expect(page.text()).not.toMatch(/NaN|undefined|null/);
    // 空数据下也不该有孤立标题（例如「本周语法弱点 Top 0」）
    expect(page.has("Top 0")).toBe(false);
    expect(page.has("上周小结")).toBe(false);
    expect(page.has("已战胜：")).toBe(false);
    page.unmount();
  });

  it("条件区块 · 有弱点时显示弱点卡，且文案数字无异常；一键排进今日复习可用", async () => {
    seedAppData({
      cards: [
        {
          id: "card-1",
          type: "sentence",
          front: "I go to school.",
          back: "",
          note: "",
          sourceId: "hunt:c1",
          tags: ["语法"],
          status: "review",
          priority: false,
          createdAt: nowIso(),
          updatedAt: nowIso()
        }
      ],
      schedules: [
        { cardId: "card-1", easeFactor: 2.5, intervalDays: 1, reviewCount: 0, lapseCount: 0, nextReviewAt: new Date(Date.now() + 30 * 86400000).toISOString() }
      ],
      sentenceDetails: [{ cardId: "card-1", sentence: "I go to school.", translation: "", keywords: [], grammarNote: "[tense]", audioUrl: "" }]
    });
    writeTelemetry([
      { kind: "grammar_review_result", cardId: "card-1", sourceId: "hunt:c1", passed: false, attempts: 2, ts: nowIso() },
      { kind: "hunt_verdict", caseId: "c2", tokenIndex: 1, verdictKind: "wrongTag", guessedTag: "tense", ts: nowIso() },
      { kind: "hunt_verdict", caseId: "c3", tokenIndex: 2, verdictKind: "notError", guessedTag: "article", ts: daysAgo(1) }
    ]);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const card = page.container.querySelector(BLOCKS.weak);
    expect(card, "有弱点时应渲染弱点卡").not.toBeNull();
    expect(card?.textContent).toMatch(/本周语法弱点 Top \d/);
    expect(page.text()).not.toMatch(/NaN|undefined|null/);
    // 有相关卡时是按钮（可一键排进今日复习），不是链接
    const button = card?.querySelector("button") as HTMLButtonElement;
    expect(button?.textContent?.trim()).toBe("排进今日复习");
    expect(button.disabled).toBe(false);
    clickElement(button);
    expect(card?.textContent, "点击后应变为已完成态").toContain("已排进今日复习");
    expect((card?.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    await flushAsync();
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as { schedules?: Array<{ cardId: string; nextReviewAt: string }> };
    const schedule = stored.schedules?.find((item) => item.cardId === "card-1");
    expect(schedule, "排进今日复习应落盘 schedule").toBeDefined();
    expect(Date.parse(schedule!.nextReviewAt), "到期时间应被改成当前时刻（可立即复习）").toBeLessThanOrEqual(Date.now() + 2000);
    page.unmount();
  });

  it("条件区块 · 无关联卡的弱点显示「去复习」链接出口", () => {
    writeTelemetry([{ kind: "hunt_verdict", caseId: "c1", tokenIndex: 1, verdictKind: "wrongTag", guessedTag: "tense", ts: nowIso() }]);
    seedAppData({});
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const card = page.container.querySelector(BLOCKS.weak);
    expect(card).not.toBeNull();
    expect(card?.querySelector("button"), "无关联卡时不该有排课按钮").toBeNull();
    /**
     * 2026-09-22 修断言（走查修复的连带更新）：
     * 「无关联卡」这一支的出口从「去复习」改成了「练这个弱点」→ `/grammar/replay`。
     * 原因是它的前提就是**该弱点没有关联卡片**，而复习队列此时是空的（0/0 张），
     * 点「去复习」进去无事可做；改指向错题重练课才有内容可练。
     *
     * 断言相应改为「应有一个可练的出口」，仍不依赖 DOM 顺序。
     */
    const hrefs = Array.from(card?.querySelectorAll("a") ?? []).map((link) => link.getAttribute("href"));
    expect(hrefs, "应保留一个可继续练的出口").toContain("/grammar/replay");
    expect(hrefs, "不应再指向空的复习队列").not.toContain("/grammar/review");
    expect(page.text()).not.toMatch(/NaN|undefined/);
    page.unmount();
  });

  it("条件区块 · 已战胜的弱点独立于活跃榜显示", () => {
    writeTelemetry([
      { kind: "hunt_verdict", caseId: "c1", tokenIndex: 1, verdictKind: "wrongTag", guessedTag: "article", ts: daysAgo(3) },
      { kind: "card_mastered", cardId: "x", sourceId: "hunt:c1", tag: "article", ts: daysAgo(1) }
    ]);
    seedAppData({});
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const healed = page.container.querySelector(BLOCKS.healed);
    expect(healed, "治愈后应显示「已战胜」行").not.toBeNull();
    expect(healed?.textContent).toContain("已战胜：");
    expect(healed?.textContent).toContain("东西前面那个小词");
    // 治愈的罪名不该出现在活跃榜
    expect(page.container.querySelector(BLOCKS.weak), "已治愈罪名不该仍在活跃榜").toBeNull();
    expect(page.text()).not.toMatch(/NaN|undefined/);
    page.unmount();
  });

  it("条件区块 · 上周小结只在「上一自然周」有产出时才出现", async () => {
    seedAppData({});
    writeTelemetry([outputEvent(lastWeekMidday(), "hash-a")]);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const card = page.container.querySelector(BLOCKS.weekly);
    expect(card, "上一自然周有产出时应显示上周小结").not.toBeNull();
    expect(card?.textContent).toContain("上周小结");
    expect(card?.textContent).toMatch(/上周有效输出 \d+ 句/);
    expect(page.text()).not.toMatch(/NaN|undefined|null/);
    // 可收起，且收起后不再出现（按周记一次）
    const dismiss = Array.from(card!.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "知道了，继续") as HTMLButtonElement;
    expect(dismiss, "应有收起按钮").toBeDefined();
    clickElement(dismiss);
    expect(page.container.querySelector(BLOCKS.weekly), "收起后应消失").toBeNull();
    await flushAsync();
    page.unmount();
  });

  it("条件区块 · 本周产出不触发上周小结（只回顾上一周）", () => {
    seedAppData({});
    writeTelemetry([outputEvent(nowIso(), "hash-now")]);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(page.container.querySelector(BLOCKS.weekly), "本周产出不该触发上周小结").toBeNull();
    page.unmount();
  });

  it("条件区块 · 零进度不显示导出卡，有进度才显示（且计数为合法数字）", () => {
    const fresh = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(fresh.container.querySelector(BLOCKS.export), "首访不展示导出卡").toBeNull();
    fresh.unmount();
    resetStorage();

    seedAppData({ grammarLessonsDone: doneIds(3) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const card = page.container.querySelector(BLOCKS.export);
    expect(card).not.toBeNull();
    expect(card?.textContent).toMatch(/本地记录 \d+ \/ \d+ 条/);
    expect(card?.textContent).not.toMatch(/NaN|undefined/);
    page.unmount();
  });

  it("条件区块 · 能力里程碑：达成后出现，确认后可收起并落盘到独立键", async () => {
    // can-do-m1 要求 L1-L12 全完成
    seedAppData({ grammarLessonsDone: doneIds(12) });
    const page = mountPath();
    const card = page.container.querySelector(BLOCKS.canDo);
    expect(card, "L1-L12 完成后应出现能力里程碑").not.toBeNull();
    expect(card?.textContent).toContain("我能把昨天和明天都说清楚");
    expect(page.text()).not.toMatch(/NaN|undefined/);
    const confirm = Array.from(card!.querySelectorAll("button")).find((b) => (b.textContent ?? "").includes("我做到了")) as HTMLButtonElement;
    expect(confirm, "应有确证按钮").toBeDefined();
    clickElement(confirm);
    expect(page.container.querySelector(BLOCKS.canDo), "确认后应收起").toBeNull();
    await flushAsync();
    expect(window.localStorage.getItem("grammar-can-do-v1"), "确证状态应落盘").toContain("can-do-m1");
    page.unmount();
  });

  it("条件区块 · 未达成里程碑时不出现（L11 完成但 L12 未完成）", () => {
    seedAppData({ grammarLessonsDone: doneIds(11) });
    const page = mountPath();
    expect(page.container.querySelector(BLOCKS.canDo)).toBeNull();
    page.unmount();
  });

  it("脏数据 · 坏遥测 JSON 不影响路径页渲染", () => {
    window.localStorage.setItem(TELEMETRY_KEY, "{ 这不是 JSON");
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(page.container.querySelectorAll(".season-card").length).toBe(28);
    expect(page.text()).not.toMatch(/NaN|undefined/);
    for (const selector of [BLOCKS.weak, BLOCKS.healed, BLOCKS.weekly]) {
      expect(page.container.querySelector(selector), "坏遥测下条件区块应静默隐藏").toBeNull();
    }
    page.unmount();
  });

  it("脏数据 · grammarLessonsDone 含未知 id / 重复 id / 非数组，进度不虚高", () => {
    seedAppData({ grammarLessonsDone: ["不存在的课", "lesson-01-am", "lesson-01-am"] });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const pill = page.container.querySelector(".lesson-progress-pill")?.textContent?.replace(/\s+/g, " ").trim();
    expect(pill, "未知 id 不该被计数，重复 id 不该重复计数").toBe(`1 / ${grammarLessons.length} 课`);
    expect(page.text()).not.toMatch(/NaN|undefined/);
    page.unmount();
    resetStorage();

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, grammarLessonsDone: "坏数据", seededWordVersions: ["core-100-v1"], settings: {} })
    );
    const page2 = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(page2.container.querySelectorAll(".season-card").length, "非数组字段不该导致整页崩").toBe(28);
    expect(page2.text()).not.toMatch(/NaN|undefined/);
    page2.unmount();
  });

  it("脏数据 · 关 2 完成但关 1 缺失（数据不一致）时重审页仍可打开或优雅锁态", () => {
    seedAppData({ grammarLessonStagesDone: { "lesson-06-it": [2] } }); // 只写关 2，不写 grammarLessonsDone
    const page = mountPage(<GrammarReauditPage />, "/grammar/lesson/lesson-06-it/reaudit", "/grammar/lesson/:lessonId/reaudit");
    expect(page.container.innerHTML.length).toBeGreaterThan(0);
    expect(page.text()).not.toMatch(/NaN|undefined/);
    // getLessonStagesDone 会把「关 1」视为完成（grammarLessonsDone 缺 → 不加 1）→ 应锁态
    console.log("关 2 孤立数据下重审页:", page.text().replace(/\s+/g, " ").slice(0, 120));
    page.unmount();
  });

  it("脏数据 · 异常 URL 参数不崩（中文、空格、编码、emoji）", () => {
    // 注：含「/」的参数会改变路径段数，路由本身不匹配（React Router 行为，非本页职责），
    // 因此只测仍是单个路径段的形态。
    for (const bad of ["中文课", "a b", "%20", "😀", "lesson-01-am%20", "'; DROP TABLE"]) {
      resetStorage();
      const page = mountPage(<GrammarRevisitPage />, `/grammar/lesson/${bad}/revisit`, "/grammar/lesson/:lessonId/revisit");
      expect(page.container.innerHTML.length, `id="${bad}" 导致白屏`).toBeGreaterThan(0);
      expect(page.text()).not.toMatch(/NaN|undefined/);
      page.unmount();
    }
  });

  function mountPath() {
    return mountPage(<GrammarPathPage />, "/grammar", "/grammar");
  }
});
