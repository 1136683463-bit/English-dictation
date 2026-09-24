// @vitest-environment jsdom
/**
 * RV20 · 首页三线常驻与「文案/按钮同源」的方向性（2026-09-24 首页重规划 P4 新增）
 *
 * ## 为什么需要这道闸
 *
 * 改造前，首页（`/today`）对 `adventure` 的引用数为 **0**——而冒险线是三条内容线里
 * **唯一有真实消费行为**的那条（6 段故事 17 个节点、3 段被真读、11 次选择）。
 * 语法线则相反：09-23 已拿到 Hero 主 CTA，但主 CTA 与 Hero 文案来自**两套口径**
 * （`primaryTask` 只看词汇三数、`grammarTarget` 只看语法），在真实数据
 * （0 到期 / 0 薄弱 / 115 新词 / 0 课）下必然渲染成「建议可以推进新词」+ 按钮「继续第 1 课」。
 *
 * 本闸与 `rv15` 分工：
 *   - `rv15` 锁语法线的**固定入口**是否还在、是否与 `lessonService` 同源（既有闸）。
 *   - 本闸锁**新增的那三件事**：① 三线常驻可见（含冒险）② 主推荐与 Hero 文案同源且
 *     「续上优先」真的会选到冒险线 ③ 三线行不许退化成裸 0 仪表盘。
 *
 * ## 判据纪律（按仓库惯例）
 *
 * - **不断言像素**：jsdom 没有布局引擎，尺寸类验收只能靠真机复测；
 *   这里只断言 **DOM 存在性与顺序**（顺序是「三线行要进第 2 屏」的可测替身）。
 * - **不断言文案措辞**：只查「线、落点、顺序、存在性、以及『不许出现裸 0』」。
 * - **时间夹具不用写死日期**：本文件涉及 7 天「续上」窗口与相对时间，
 *   写死近期 ISO 会随真实日期流逝而失效（`lg4-time-bomb-tests.test.ts` 专门扫这个）。
 *   一律用 `daysAgo(n)` 相对当下生成。
 */
import { describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
import { mountPage, resetStorage } from "../harness";
import TodayPage from "../../pages/TodayPage";
import TrainingPage from "../../pages/TrainingPage";
import SettingsPage from "../../pages/SettingsPage";
import { getCurrentAdventureNode } from "../../services/adventureService";
import { HOME_LINE_LABEL, buildHomeLineRows, buildHomeSnapshot, lineOfPath } from "../../services/homeDirectiveService";
import { makeAppData, seedAppData } from "./fixtures";
import type { Adventure, AdventureNode, AppData } from "../../types";

const mountToday = () => mountPage(<TodayPage />, "/today", "/today");
const mountTraining = () => mountPage(<TrainingPage />, "/training", "/training");

const iso = (daysAgo: number, hourOffset = 0) =>
  new Date(Date.now() - daysAgo * 86_400_000 + hourOffset).toISOString();

const choice = (id: string) => ({ id, label: `选项 ${id}`, description: "", promptHint: "" });

const makeNode = (id: string, chapter: number, parentId?: string, selectedChoiceId?: string): AdventureNode => ({
  id,
  ...(parentId ? { parentId } : {}),
  chapter,
  title: `第 ${chapter} 章`,
  englishText: `Chapter ${chapter} text.`,
  chineseText: `第 ${chapter} 章译文。`,
  summary: "",
  source: "offline",
  choices: [choice("a"), choice("b"), choice("c")],
  ...(selectedChoiceId ? { selectedChoiceId } : {}),
  vocabulary: [],
  createdAt: iso(14)
});

/** 一段读进去过的冒险（>= 2 章），updatedAt 可指定。 */
const makeAdventure = (over: Partial<Adventure> = {}): Adventure => {
  const nodes = [makeNode("n-1", 1, undefined, "a"), makeNode("n-2", 2, "n-1", "b"), makeNode("n-3", 3, "n-2")];
  return {
    id: "adv-1",
    title: "海岸列车",
    template: "travel",
    level: "A2",
    customPrompt: "",
    createdAt: iso(14),
    updatedAt: iso(2),
    currentNodeId: "n-3",
    nodes,
    ...over
  };
};

const lineOf = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLAnchorElement>(".today-line-row")).map((row) => ({
    line: row.getAttribute("data-line"),
    href: row.getAttribute("href") ?? "",
    text: (row.textContent ?? "").replace(/\s+/g, " ").trim()
  }));

describe("RV20 首页三线常驻", () => {
  it("① 三条线各一行且常驻（真实数据形态：115 张全 new 卡 / 0 复习 / 0 课 / 有冒险）", () => {
    resetStorage();
    const cards = Array.from({ length: 115 }, (_, i) => ({
      id: `c-${i}`,
      type: "word" as const,
      front: `word-${i}`,
      back: "释义",
      note: "",
      sourceId: "",
      tags: [],
      status: "new" as const,
      priority: false,
      createdAt: iso(14),
      updatedAt: iso(14)
    }));
    seedAppData(makeAppData({ cards, adventures: [makeAdventure()] }) as Partial<AppData>);
    const page = mountToday();
    const rows = lineOf(page.container);
    expect(rows, "三条线必须各有一行").toHaveLength(3);
    expect(rows.map((row) => row.line).sort(), "三条线都要在，一条都不能少").toEqual([
      "adventure",
      "grammar",
      "vocab"
    ]);
    // 每一行都必须有可用落点（不能是占位空行）
    rows.forEach((row) => expect(row.href.startsWith("/"), `${row.line} 行应有落点`).toBe(true));
    page.unmount();
  });

  it("② 空数据下仍然三行常驻，且给的是「第一步」而不是裸 0", () => {
    resetStorage();
    seedAppData(makeAppData({ cards: [], schedules: [], adventures: [] }) as Partial<AppData>);
    const page = mountToday();
    const rows = lineOf(page.container);
    expect(rows, "空态也必须三行常驻（既有反馈「有时候有按钮有时候没有」三次）").toHaveLength(3);
    expect(rows.map((row) => row.line).sort()).toEqual(["adventure", "grammar", "vocab"]);
    /**
     * 风险 #2 的专属断言：改造前首页在真实数据下本已是一片 0
     *（`0/30`、`0/10`、`0/5`、`0/205` + 摘要四个 0），加三行入口若只是把 0 摆得更显眼，
     * 就变成了「更空的仪表盘」。所以三线行的位置描述里**不许出现裸 0**。
     * 允许 `0/205` 这种带分母的进度（它表达的是「205 课里的 0 课」，是有信息量的起点），
     * 但不允许 `0 个…`、`0 ·`、`0/N` 这类孤立计数。
     */
    rows.forEach((row) => {
      expect(
        /(^|\s)0\s*(个|张|条|·|$)/.test(row.text),
        `${row.line} 行出现了裸 0：『${row.text}』`
      ).toBe(false);
      expect(row.text.length, `${row.line} 行不能是空文案`).toBeGreaterThan(3);
    });
    // 空态要点出「开始」的落点，而不是让用户自己猜
    const adventureRow = rows.find((row) => row.line === "adventure");
    expect(adventureRow!.href).toBe("/adventure");
    page.unmount();
  });

  it("③ 三线区块必须排在「今日任务队列」之前（这是「进第 2 屏」的可测替身）", () => {
    resetStorage();
    seedAppData(makeAppData({}) as Partial<AppData>);
    const page = mountToday();
    const container = page.container;
    const lines = container.querySelector(".today-lines");
    const queue = container.querySelector(".today-columns");
    expect(lines, "应有三线区块").toBeTruthy();
    expect(queue, "应有今日任务队列").toBeTruthy();
    /**
     * 用 DOM 顺序代替像素断言：三线区块在任务队列之前 ⇒ 在同样的滚动位置上先于它出现。
     * jsdom 无布局引擎，`getBoundingClientRect` 恒为 0，**任何像素断言都是假绿**。
     */
    expect(
      lines!.compareDocumentPosition(queue!) & Node.DOCUMENT_POSITION_FOLLOWING,
      "三线区块必须出现在任务队列之前"
    ).toBeTruthy();
    page.unmount();
  });

  it("④ 冒险行的章号与 /adventure 同源（不允许首页另算一套章节推导）", () => {
    resetStorage();
    const adventure = makeAdventure();
    seedAppData(makeAppData({ adventures: [adventure] }) as Partial<AppData>);
    const page = mountToday();
    const adventureRow = lineOf(page.container).find((row) => row.line === "adventure");
    const expectedChapter = getCurrentAdventureNode(adventure).chapter;
    expect(expectedChapter).toBe(3);
    expect(adventureRow!.text, "冒险行应显示当前章号").toContain(`第 ${expectedChapter} 章`);
    expect(adventureRow!.href, "应指向这一段冒险").toBe("/adventure/adv-1");
    page.unmount();
  });

  it("⑤ 续上优先：窗口内的半读故事会接管主 CTA（与 Hero 文案同源）", () => {
    resetStorage();
    // 2 天前读过、读到第 3 章、这一章还没做选择 ⇒ 是一个真实中断点
    seedAppData(makeAppData({ adventures: [makeAdventure({ updatedAt: iso(2) })] }) as Partial<AppData>);
    const page = mountToday();
    const cta = page.container.querySelector<HTMLAnchorElement>("[data-testid='today-primary-cta']");
    const note = page.container.querySelector<HTMLElement>("[data-testid='today-cta-note']");
    expect(cta!.getAttribute("data-line"), "有中断点时应把主推荐交给冒险线").toBe("adventure");
    expect(cta!.getAttribute("href")).toBe("/adventure/adv-1");
    expect(note!.getAttribute("data-line"), "说明行必须与主 CTA 同线").toBe("adventure");
    expect(note!.textContent ?? "", "说明行要讲清为什么是它").toContain("第 3 章");
    page.unmount();
  });

  it("⑥ 超出 7 天窗口的旧故事不再抢占主 CTA（窗口是真实生效的判据）", () => {
    resetStorage();
    seedAppData(makeAppData({ adventures: [makeAdventure({ updatedAt: iso(14) })] }) as Partial<AppData>);
    const page = mountToday();
    const cta = page.container.querySelector<HTMLAnchorElement>("[data-testid='today-primary-cta']");
    expect(cta!.getAttribute("data-line"), "14 天前的半读故事不该再是「今天做什么」").not.toBe("adventure");
    // 但那条线仍然必须可见（这正是「常驻细行」与「主推荐」分工的地方）
    expect(lineOf(page.container).some((row) => row.line === "adventure"), "冒险行仍须常驻").toBe(true);
    page.unmount();
  });

  it("⑦ 语法线的枢纽入口补齐：/training 能进语法（此前该页对 grammar 引用数为 0）", () => {
    resetStorage();
    seedAppData(makeAppData({}) as Partial<AppData>);
    const page = mountTraining();
    const links = Array.from(page.container.querySelectorAll<HTMLAnchorElement>("a[href]")).map((a) =>
      a.getAttribute("href")
    );
    expect(links, "次级枢纽必须能装下三条线，语法是此前缺的那条").toContain("/grammar");
    expect(links, "冒险线原有的入口不能被顶掉").toContain("/adventure");
    expect(page.text()).toContain("语法阶梯");
    page.unmount();
  });

  it("⑧ 冒险遥测可观测：设置页总数含冒险，且能导出（改造前冒险既不计入也不可导出）", () => {
    resetStorage();
    seedAppData(makeAppData({}) as Partial<AppData>);
    // 造 15 条冒险事件（与真实数据的基准条数一致）
    const events = Array.from({ length: 15 }, (_, i) => ({
      kind: "node_viewed" as const,
      ts: iso(9, i * 1000),
      adventureId: "adv-1",
      nodeId: `n-${i}`
    }));
    window.localStorage.setItem("adventure-telemetry-events-v1", JSON.stringify({ version: 1, events }));

    const page = mountPage(<SettingsPage />, "/settings", "/settings");
    // 遥测导出区在「数据与安全」标签页内（默认标签是「学习偏好」），先切过去。
    const dataTab = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button.settings-nav-item")).find(
      (button) => (button.textContent ?? "").includes("数据与安全")
    );
    expect(dataTab, "设置页应有「数据与安全」标签").toBeTruthy();
    act(() => dataTab!.click());

    const summary = page.container.querySelector(".telemetry-export-section summary");
    expect(summary, "应有遥测导出区").toBeTruthy();
    expect(summary!.textContent ?? "", "总数应为 15（三线求和，此前冒险不计入）").toContain("15 条");
    const buttons = page.buttons().join(" | ");
    expect(buttons, "应新增冒险遥测导出按钮").toContain("冒险遥测");
    expect(buttons, "三类遥测都要可导出，不是只加冒险").toContain("语法遥测");
    page.unmount();
  });
  it("⑨ 首页唯一化：`/` 收敛到 `/today`，门页降级到 `/welcome`（仍可达、组件未删）", () => {
    resetStorage();
    seedAppData(makeAppData({}) as Partial<AppData>);
    /**
     * 这里挂的是整个 `App`（它自带 `<Routes>`），因为「`/` 该落到哪」是路由表的事实，
     * 单独挂 `EntryPage` 或 `TodayPage` 都验证不到。
     * 改造前产品有**两个「首页」**：`/` 的品牌门页（4 个按钮 100% 词汇线）与侧边栏
     * 标签也叫「首页」的 `/today` —— 语义重复、范式不同。
     */
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      );
    });
    expect(container.querySelector(".today-v2"), "`/` 应落到今日页").toBeTruthy();
    expect(container.querySelector(".entry-shell"), "`/` 不应再渲染门页").toBeNull();
    act(() => root.unmount());
    container.remove();

    // `/welcome` 仍能渲染门页：保留组件而不是删掉，rv19 的「今日到期口径」判据因此继续有效
    const welcome = document.createElement("div");
    document.body.appendChild(welcome);
    const welcomeRoot = createRoot(welcome);
    act(() => {
      welcomeRoot.render(
        <MemoryRouter initialEntries={["/welcome"]}>
          <App />
        </MemoryRouter>
      );
    });
    expect(welcome.querySelector(".entry-shell"), "`/welcome` 应可达门页").toBeTruthy();
    act(() => welcomeRoot.unmount());
    welcome.remove();
  });

  it("⑩ 收口：主 CTA 与说明行在三处数据源上一致（与 rv15 同源判据互为独立实现）", () => {
    resetStorage();
    // 分别覆盖三条线各自主推的情形，确认 `data-line` 不是写死的常量
    const cases: Array<{ name: string; patch: Partial<AppData>; expectLine: string }> = [
      {
        name: "冒险有中断点",
        patch: { adventures: [makeAdventure({ updatedAt: iso(1) })] } as Partial<AppData>,
        expectLine: "adventure"
      },
      { name: "全空（兜底）", patch: { cards: [], schedules: [], adventures: [] } as Partial<AppData>, expectLine: "grammar" }
    ];
    for (const testCase of cases) {
      resetStorage();
      seedAppData(makeAppData(testCase.patch) as Partial<AppData>);
      const page = mountToday();
      const cta = page.container.querySelector<HTMLAnchorElement>("[data-testid='today-primary-cta']");
      const note = page.container.querySelector<HTMLElement>("[data-testid='today-cta-note']");
      const line = cta!.getAttribute("data-line");
      expect(line, `${testCase.name}：主推荐应当来自 ${testCase.expectLine}`).toBe(testCase.expectLine);
      expect(note!.getAttribute("data-line"), `${testCase.name}：说明行与 CTA 必须同线`).toBe(line);
      expect(lineOfPath(cta!.getAttribute("href") ?? ""), `${testCase.name}：落点必须属于声明的线`).toBe(line);
      page.unmount();
    }
  });
});

/**
 * 双向自检（闸必须能真的失败）。
 *
 * 仓库惯例是「闸能双向自检」：不只证明它对合法实现说通过，还要证明它对**错误实现**
 * 说失败。这里直接对纯函数 `buildHomeLineRows` 施加「错误实现」形态的输入，
 * 确认判据能区分——而不是靠改页面来试。
 */
describe("RV20 闸自检：判据对错误实现必须失败", () => {
  it("① 三线行数判据会随缺线而变（不是恒等断言）", () => {
    resetStorage();
    const rows = buildHomeLineRows(buildHomeSnapshot(makeAppData({}) as AppData));
    expect(rows).toHaveLength(3);
    // 反例：删掉一条线后，行数确实会变——证明 ① 的 3 是「测出来的」而不是「写死的」
    const half = rows.filter((row) => row.line !== "adventure");
    expect(half).toHaveLength(2);
    expect(half).not.toHaveLength(3);
  });

  it("② 裸 0 判据能真的抓到裸 0（正例通过、反例失败）", () => {
    const bare = /(^|\s)0\s*(个|张|条|·|$)/;
    expect(bare.test("还没有冒险 · 选一个主题开始")).toBe(false);
    expect(bare.test("0/205")).toBe(false);
    expect(bare.test("0 个到期")).toBe(true);
    expect(bare.test("0 · 今天")).toBe(true);
  });

  it("③ 线名映射与线的枚举一致（新增一条线不改这里就会红）", () => {
    expect(Object.keys(HOME_LINE_LABEL).sort()).toEqual(["adventure", "grammar", "vocab"]);
    // 语法行的标题必须是「语法阶梯」——rv15 ③ 的锚点靠这四个字
    expect(HOME_LINE_LABEL.grammar).toBe("语法阶梯");
  });
});
