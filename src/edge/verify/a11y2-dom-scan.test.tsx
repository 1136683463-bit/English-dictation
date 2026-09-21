// @vitest-environment jsdom
/**
 * A11Y-2 · DOM 层无障碍扫描（jsdom 真实渲染，不是源码正则）
 *
 * 覆盖：
 *  - 图标按钮（只含 svg / 图标、无文字）的可读名（aria-label / title）
 *  - aria-live 区域是「预先存在、内容变化」还是「新插入」
 *  - 标题层级 h1/h2/h3 顺序
 *  - 列表是否用 ol/ul/li
 *  - 可点区域是否用原生 button（role=button 的 div/span 键盘可达性）
 *  - 装饰性元素 aria-hidden
 *  - 表单控件的可读名（aria-label / 关联 label / title；placeholder 不算）
 *
 * 说明：可访问名算法（ACCNAME）里 title 是**最后兜底**，且只在没有其它
 * 名称来源时才生效；多数屏幕阅读器对纯 title 的播报不稳定，所以本文件把
 * title-only 单列为「弱名称」，不算合格。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage, type Mounted } from "../harness";
import { cardsToData, DONE_LESSON_ID, makeSentenceCard, seedAppData, STORAGE_KEY } from "./fixtures";
import { clickElement, flushAsync } from "./drive";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import GrammarDiaryPage from "../../pages/GrammarDiaryPage";
import GrammarPathPage from "../../pages/GrammarPathPage";
import GrammarReplayPage from "../../pages/GrammarReplayPage";
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import GrammarReauditPage from "../../pages/GrammarReauditPage";
import SentencesPage from "../../pages/SentencesPage";
import ReviewPage from "../../pages/ReviewPage";
import LibraryPage from "../../pages/LibraryPage";
import UnitsPage from "../../pages/UnitsPage";
import WordsPage from "../../pages/WordsPage";
import StatsPage from "../../pages/StatsPage";
import ImportPage from "../../pages/ImportPage";
import ProbePages from "./probe-pages";

const LESSON_ID = "lesson-13-now";

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}
if (typeof window !== "undefined" && !window.matchMedia) {
  (window as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  });
}

// ── 通用扫描器 ───────────────────────────────────────────────

interface IconButtonFinding {
  /** 页面上第几个 button（1 起）。 */
  index: number;
  className: string;
  /** 是否含 svg（Lucide 图标会渲染成 svg）。 */
  hasSvg: boolean;
  ariaLabel: string | null;
  title: string | null;
  /** 可访问名来源判定。 */
  nameSource: "aria-label" | "title-only" | "none";
}

const iconButtonsOf = (container: HTMLElement): IconButtonFinding[] => {
  const buttons = Array.from(container.querySelectorAll("button"));
  const out: IconButtonFinding[] = [];
  buttons.forEach((button, index) => {
    const text = (button.textContent ?? "").replace(/\s+/g, "").trim();
    const hasSvg = Boolean(button.querySelector("svg"));
    if (text !== "" || !hasSvg) return;
    const ariaLabel = button.getAttribute("aria-label");
    const title = button.getAttribute("title");
    const labelledby = button.getAttribute("aria-labelledby");
    out.push({
      index: index + 1,
      className: (button.className || "").toString().slice(0, 60),
      hasSvg,
      ariaLabel: labelledby ? `(via aria-labelledby=${labelledby}) ${ariaLabel ?? ""}`.trim() : ariaLabel,
      title,
      nameSource: ariaLabel || labelledby ? "aria-label" : title ? "title-only" : "none"
    });
  });
  return out;
};

interface InputFinding {
  tag: string;
  type: string;
  className: string;
  ariaLabel: string | null;
  ariaLabelledby: string | null;
  htmlForLabel: boolean;
  wrappedInLabel: boolean;
  title: string | null;
  placeholder: string | null;
  /** 有真正的可读名（aria-label / aria-labelledby / label / title）。 */
  hasRealName: boolean;
}

const inputsOf = (container: HTMLElement): InputFinding[] =>
  Array.from(container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    "input, textarea, select"
  )).map((field) => {
    const type = (field as HTMLInputElement).type ?? field.tagName.toLowerCase();
    if (["hidden", "checkbox", "radio", "file"].includes(type)) {
      // checkbox/radio 由 <label> 包裹即可；hidden 不需名称
      return {
        tag: field.tagName,
        type,
        className: (field.className || "").toString().slice(0, 40),
        ariaLabel: field.getAttribute("aria-label"),
        ariaLabelledby: field.getAttribute("aria-labelledby"),
        htmlForLabel: false,
        wrappedInLabel: Boolean(field.closest("label")),
        title: field.getAttribute("title"),
        placeholder: field.getAttribute("placeholder"),
        hasRealName: Boolean(field.getAttribute("aria-label") || field.closest("label"))
      };
    }
    const id = field.id;
    // jsdom 没有 CSS.escape；改用属性选择器精确匹配（id 里可能有特殊字符，用引号包住）
    const htmlForLabel = Boolean(
      id &&
        Array.from(container.querySelectorAll("label[for]")).some((l) => l.getAttribute("for") === id)
    );
    const wrappedInLabel = Boolean(field.closest("label"));
    const ariaLabel = field.getAttribute("aria-label");
    const ariaLabelledby = field.getAttribute("aria-labelledby");
    return {
      tag: field.tagName,
      type,
      className: (field.className || "").toString().slice(0, 40),
      ariaLabel,
      ariaLabelledby,
      htmlForLabel,
      wrappedInLabel,
      title: field.getAttribute("title"),
      placeholder: field.getAttribute("placeholder"),
      hasRealName: Boolean(ariaLabel || ariaLabelledby || htmlForLabel || wrappedInLabel)
    };
  });

/** 标题层级顺序：返回诸标题的 level，用于检查 h1 先于 h2、无跳级。 */
const headingLevels = (container: HTMLElement): number[] =>
  Array.from(container.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) => Number(h.tagName.slice(1)));

/** 页面上 role=button / role=link 的非原生元素（键盘可达性风险）。 */
interface RoleButtonFinding {
  tag: string;
  className: string;
  role: string;
  tabIndex: string | null;
  hasKeyHandler: boolean;
  ariaLabel: string | null;
}

const roleButtonsOf = (container: HTMLElement): RoleButtonFinding[] =>
  Array.from(container.querySelectorAll<HTMLElement>('[role="button"], [role="link"]')).map((el) => ({
    tag: el.tagName,
    className: (el.className || "").toString().slice(0, 50),
    role: el.getAttribute("role") ?? "",
    tabIndex: el.getAttribute("tabindex"),
    // jsdom 里拿不到 React 的 onKeyDown prop；改用 tabindex + tag 判定可达性
    hasKeyHandler: el.getAttribute("tabindex") !== null,
    ariaLabel: el.getAttribute("aria-label")
  }));

/** 所有 svg 中带 aria-hidden 的比例。 */
const svgAriaHidden = (container: HTMLElement): { total: number; hidden: number } => {
  const svgs = Array.from(container.querySelectorAll("svg"));
  return { total: svgs.length, hidden: svgs.filter((s) => s.getAttribute("aria-hidden") === "true").length };
};

/** 可点区域（onclick 属性在 React 里不会落到 DOM，所以按 role/button 统计）。 */
const clickableDivs = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll<HTMLElement>('div[role="button"], span[role="button"], li[role="button"]')).map(
    (el) => `${el.tagName}.${(el.className || "").toString().slice(0, 40)}`
  );

// ── 页面挂载清单 ─────────────────────────────────────────────

interface PageCase {
  name: string;
  mount: () => Mounted;
}

const pageCases = (): PageCase[] => [
  {
    name: "GrammarLessonPage（正课·前测）",
    mount: () => mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON_ID}`, "/grammar/lesson/:lessonId")
  },
  {
    name: "GrammarReviewPage（复习）",
    mount: () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review")
  },
  {
    name: "GrammarBoostPage（趁热练）",
    mount: () =>
      mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}`, "/grammar/boost/:lessonId")
  },
  {
    name: "GrammarHuntPage（侦探找错）",
    mount: () => mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt")
  },
  {
    name: "GrammarDiaryPage（日记）",
    mount: () => mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary")
  },
  {
    name: "GrammarPathPage（课程地图）",
    mount: () => mountPage(<GrammarPathPage />, "/grammar", "/grammar")
  },
  {
    name: "GrammarReplayPage（错题重练）",
    mount: () => mountPage(<GrammarReplayPage />, "/grammar/replay", "/grammar/replay")
  },
  {
    name: "GrammarRevisitPage（次日回访）",
    mount: () =>
      mountPage(<GrammarRevisitPage />, `/grammar/lesson/${LESSON_ID}/revisit`, "/grammar/lesson/:lessonId/revisit")
  },
  {
    name: "GrammarReauditPage（旧案重审）",
    mount: () =>
      mountPage(<GrammarReauditPage />, `/grammar/lesson/${LESSON_ID}/reaudit`, "/grammar/lesson/:lessonId/reaudit")
  },
  {
    name: "SentencesPage（句子库）",
    mount: () => mountPage(<SentencesPage />, "/sentences", "/sentences")
  },
  {
    name: "ReviewPage（复习队列）",
    mount: () => mountPage(<ReviewPage />, "/review", "/review")
  },
  {
    name: "LibraryPage（语料库）",
    mount: () => mountPage(<LibraryPage />, "/library", "/library")
  },
  {
    name: "UnitsPage（词书）",
    mount: () => mountPage(<UnitsPage />, "/units", "/units")
  },
  {
    name: "WordsPage（单词本）",
    mount: () => mountPage(<WordsPage />, "/words", "/words")
  },
  {
    name: "StatsPage（学习周报）",
    mount: () => mountPage(<StatsPage />, "/stats", "/stats")
  },
  {
    name: "ImportPage（导入）",
    mount: () => mountPage(<ImportPage />, "/import", "/import")
  },
  {
    name: "共享组件探针页（SpeakButton / ConfirmDialog）",
    mount: () => mountPage(<ProbePages />, "/probe", "/probe")
  }
];

/** 给每页一份「有真实内容」的数据（带 audioUrl 的句子卡 → 让播放/删除类图标按钮都渲染出来）。 */
const seedForPages = (): void => {
  const data = seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    ...cardsToData([
      makeSentenceCard({ id: "s1", sentence: "I am drawing a picture." }),
      makeSentenceCard({ id: "s2", sentence: "She is reading a book." })
    ])
  });
  for (const detail of data.sentenceDetails) {
    detail.audioUrl = "https://example.com/a.mp3";
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

describe("A11Y-2 图标按钮可读名", () => {
  beforeEach(() => resetStorage());

  it("逐页扫描：无文字按钮的名称来源清单（aria-label / 仅 title / 无名称）", async () => {
    const all: Array<{ page: string; finding: IconButtonFinding }> = [];
    for (const testCase of pageCases()) {
      resetStorage();
      seedForPages();
      const page = testCase.mount();
      await flushAsync();
      for (const finding of iconButtonsOf(page.container)) all.push({ page: testCase.name, finding });
      page.unmount();
    }
    const noName = all.filter((row) => row.finding.nameSource === "none");
    const titleOnly = all.filter((row) => row.finding.nameSource === "title-only");
    // eslint-disable-next-line no-console
    console.log(
      `[图标按钮] 共 ${all.length} 个无文字按钮；aria-label ${all.length - noName.length - titleOnly.length} 个；` +
        `仅 title ${titleOnly.length} 个；无任何名称 ${noName.length} 个`
    );
    for (const row of titleOnly) {
      // eslint-disable-next-line no-console
      console.log(`  [仅 title] ${row.page} #${row.finding.index} .${row.finding.className} title="${row.finding.title}"`);
    }
    for (const row of noName) {
      // eslint-disable-next-line no-console
      console.log(`  [无名称]   ${row.page} #${row.finding.index} .${row.finding.className}`);
    }
    // 硬断言：任何无文字按钮都不该「既没 aria-label 也没 title」
    expect(
      noName.map((row) => `${row.page} #${row.finding.index} .${row.finding.className}`),
      "以下图标按钮没有任何可读名（屏幕阅读器只读「按钮」）"
    ).toEqual([]);
  });

  it("仅靠 title 命名的图标按钮清单（title 是可访问名算法的最后兜底，播报不稳定）", async () => {
    const titleOnly: Array<{ page: string; finding: IconButtonFinding }> = [];
    for (const testCase of pageCases()) {
      resetStorage();
      seedForPages();
      const page = testCase.mount();
      await flushAsync();
      for (const finding of iconButtonsOf(page.container)) {
        if (finding.nameSource === "title-only") titleOnly.push({ page: testCase.name, finding });
      }
      page.unmount();
    }
    // eslint-disable-next-line no-console
    console.log(
      `[仅 title 命名] 共 ${titleOnly.length} 个：` +
        titleOnly.map((r) => `${r.page}#${r.finding.index}.${r.finding.className}(title="${r.finding.title}")`).join(" | ")
    );
    expect(
      titleOnly.map((r) => `${r.page} #${r.finding.index} .${r.finding.className} title="${r.finding.title}"`),
      "以下图标按钮只有 title 作为可读名（建议补 aria-label）"
    ).toEqual([]);
  });

  it("SentencesPage 句子卡操作按钮（删除发音 / 重点 / 删除）是否有可读名", async () => {
    resetStorage();
    const data = seedAppData(
      cardsToData([makeSentenceCard({ id: "s1", sentence: "I am drawing a picture." })])
    );
    // 给这张卡一条 audioUrl，让「移除真人发音」按钮出现
    data.sentenceDetails[0] = { ...data.sentenceDetails[0], audioUrl: "https://example.com/a.mp3" };
    window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(data));
    const page = mountPage(<SentencesPage />, "/sentences", "/sentences");
    await flushAsync();
    const findings = iconButtonsOf(page.container);
    // eslint-disable-next-line no-console
    console.log("[SentencesPage] 无文字按钮:", JSON.stringify(findings, null, 1));
    const unnamed = findings.filter((f) => f.nameSource === "none");
    expect(unnamed.length, `SentencesPage 有 ${unnamed.length} 个无名称图标按钮`).toBe(0);
    page.unmount();
  });
});

describe("A11Y-2 表单可读名", () => {
  beforeEach(() => resetStorage());

  it("逐页扫描：输入框的可读名来源（placeholder 不算）", async () => {
    const all: Array<{ page: string; field: InputFinding }> = [];
    for (const testCase of pageCases()) {
      resetStorage();
      seedForPages();
      const page = testCase.mount();
      await flushAsync();
      for (const field of inputsOf(page.container)) all.push({ page: testCase.name, field });
      page.unmount();
    }
    const noName = all.filter((row) => !row.field.hasRealName);
    // eslint-disable-next-line no-console
    console.log(`[输入框] 共 ${all.length} 个；有真名称 ${all.length - noName.length} 个；无可读名 ${noName.length} 个`);
    for (const row of all) {
      // eslint-disable-next-line no-console
      console.log(
        `  ${row.field.hasRealName ? "OK  " : "缺名"} ${row.page} <${row.field.tag} type=${row.field.type}> ` +
          `aria-label=${row.field.ariaLabel ?? "-"} label=${row.field.htmlForLabel || row.field.wrappedInLabel} ` +
          `placeholder=${row.field.placeholder ?? "-"}`
      );
    }
    expect(
      noName.map((row) => `${row.page} <${row.field.tag}> placeholder="${row.field.placeholder}"`),
      "以下输入框没有可读名（只有 placeholder 不算）"
    ).toEqual([]);
  });

  it("GrammarDiaryPage 日记输入框：只有 placeholder，没有 aria-label/label", async () => {
    resetStorage();
    seedForPages();
    const page = mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");
    await flushAsync();
    const fields = inputsOf(page.container).filter((f) => f.tag === "TEXTAREA");
    // eslint-disable-next-line no-console
    console.log(
      "[日记页 textarea]",
      JSON.stringify(
        fields.map((f) => ({
          ariaLabel: f.ariaLabel,
          wrapped: f.wrappedInLabel,
          htmlFor: f.htmlForLabel,
          placeholder: f.placeholder,
          hasRealName: f.hasRealName
        })),
        null,
        1
      )
    );
    expect(fields.length).toBeGreaterThan(0);
    expect(
      fields.filter((f) => !f.hasRealName).length,
      `日记页 ${fields.filter((f) => !f.hasRealName).length} 个输入框没有可读名`
    ).toBe(0);
    page.unmount();
  });
});

describe("A11Y-2 语义结构", () => {
  beforeEach(() => resetStorage());

  it("逐页扫描：标题层级、ol/ul、可点区域语义", async () => {
    for (const testCase of pageCases()) {
      resetStorage();
      seedForPages();
      const page = testCase.mount();
      await flushAsync();
      const levels = headingLevels(page.container);
      const h1Count = levels.filter((l) => l === 1).length;
      const ol = page.container.querySelectorAll("ol").length;
      const ul = page.container.querySelectorAll("ul").length;
      const li = page.container.querySelectorAll("li").length;
      const roleBtns = roleButtonsOf(page.container);
      const divs = clickableDivs(page.container);
      const svgs = svgAriaHidden(page.container);
      // 跳级：出现 h3 而前面没有 h2；或 h2 前面没有 h1
      const firstIdx = { 1: levels.indexOf(1), 2: levels.indexOf(2), 3: levels.indexOf(3) };
      const skipped =
        (firstIdx[3] >= 0 && firstIdx[2] < 0) || (firstIdx[2] >= 0 && firstIdx[1] < 0);
      // eslint-disable-next-line no-console
      console.log(
        `[语义] ${testCase.name} | h1=${h1Count} h2=${levels.filter((l) => l === 2).length} h3=${levels.filter((l) => l === 3).length}` +
          ` | ol=${ol} ul=${ul} li=${li} | role=button/link 元素=${roleBtns.length} div/span 型=${divs.length}` +
          ` | svg=${svgs.total} aria-hidden=${svgs.hidden} | 层级跳级=${skipped}`
      );
      if (roleBtns.length > 0) {
        // eslint-disable-next-line no-console
        for (const rb of roleBtns) {
          console.log(`      <${rb.tag} role=${rb.role}> tabindex=${rb.tabIndex} aria-label=${rb.ariaLabel ?? "-"} .${rb.className}`);
        }
      }
      expect(page.container.textContent?.length ?? 0).toBeGreaterThan(0);
      page.unmount();
    }
  });

  it("每个页面都应有且只有一个 h1（当前页面／屏幕阅读器用户定位「我在哪」的锚点）", async () => {
    const problems: string[] = [];
    for (const testCase of pageCases()) {
      resetStorage();
      seedForPages();
      const page = testCase.mount();
      await flushAsync();
      const levels = headingLevels(page.container);
      const h1 = levels.filter((l) => l === 1).length;
      if (h1 !== 1) problems.push(`${testCase.name}: h1 x${h1}（全页标题总数 ${levels.length}）`);
      page.unmount();
    }
    // eslint-disable-next-line no-console
    console.log("[h1 唯一性]", problems.length === 0 ? "全部页面恰好 1 个 h1" : problems.join(" | "));
    expect(problems, "以下页面没有恰好一个 h1").toEqual([]);
  });

  it("列表语义：全站是否用了 ol/ul/li 或 role=list（列表类布局目前全是 div）", async () => {
    const rows: string[] = [];
    let totalOl = 0;
    let totalUl = 0;
    let totalRoleList = 0;
    for (const testCase of pageCases()) {
      resetStorage();
      seedForPages();
      const page = testCase.mount();
      await flushAsync();
      const ol = page.container.querySelectorAll("ol").length;
      const ul = page.container.querySelectorAll("ul").length;
      const roleList = page.container.querySelectorAll("[role=list]").length;
      totalOl += ol;
      totalUl += ul;
      totalRoleList += roleList;
      // 形如「重复兄弟元素」的 div 容器（3 个以上同层子元素，类名带 list/grid/cards）
      const listish = Array.from(
        page.container.querySelectorAll<HTMLElement>('[class*="-list"], [class*="-grid"], [class*="cards"], [class*="-row"]')
      )
        .filter((el) => el.children.length >= 3)
        .map((el) => `div.${(el.className || "").toString().split(" ")[0]}(${el.children.length})`);
      rows.push(`${testCase.name}: ol=${ol} ul=${ul} li=${page.container.querySelectorAll("li").length} role=list=${roleList} | div 列表容器: ${listish.slice(0, 4).join(" ") || "-"}`);
      page.unmount();
    }
    // eslint-disable-next-line no-console
    console.log("[列表语义]\n" + rows.join("\n"));
    // 报事实：全站语义列表为零，列表类布局一律用 div
    expect(
      totalOl + totalUl + totalRoleList,
      "扫描的 17 个页面里 ol/ul/role=list 总数为 0（列表类内容没有列表语义）"
    ).toBe(0);
  });

  it("所有 role=button / role=link 的非原生元素都必须可聚焦（tabindex=0）", async () => {
    const problems: string[] = [];
    for (const testCase of pageCases()) {
      resetStorage();
      seedForPages();
      const page = testCase.mount();
      await flushAsync();
      for (const rb of roleButtonsOf(page.container)) {
        if (rb.tabIndex === null) problems.push(`${testCase.name} <${rb.tag} role=${rb.role}> .${rb.className} 无 tabindex`);
      }
      page.unmount();
    }
    // eslint-disable-next-line no-console
    console.log("[role=button 可达性]", problems.length === 0 ? "全部有 tabindex" : problems.join("\n"));
    expect(problems, "这些 role=button/link 元素键盘 Tab 不到").toEqual([]);
  });

  it("装饰性 svg 是否带 aria-hidden（Lucide 图标默认不加）", async () => {
    const perPage: string[] = [];
    for (const testCase of pageCases()) {
      resetStorage();
      seedForPages();
      const page = testCase.mount();
      await flushAsync();
      const svgs = svgAriaHidden(page.container);
      perPage.push(`${testCase.name}: ${svgs.hidden}/${svgs.total} 个 svg 带 aria-hidden`);
      page.unmount();
    }
    // eslint-disable-next-line no-console
    console.log("[装饰性 svg]\n" + perPage.join("\n"));
    // Lucide 图标默认不带 aria-hidden；项目只在少数位置显式补了。这里报事实，不断言。
    expect(perPage.length).toBeGreaterThan(0);
  });
});

describe("A11Y-2 aria-live 存在性", () => {
  beforeEach(() => resetStorage());

  it("判题反馈的 live region 是「预先存在」还是「判题后才插入」", async () => {
    resetStorage();
    seedForPages();
    const data = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await flushAsync();

    // 答题前：页面上有没有 live region？
    const before = Array.from(page.container.querySelectorAll("[aria-live], [role=status], [role=alert]"));
    // eslint-disable-next-line no-console
    console.log(`[复习页] 答题前 live region 数=${before.length}`);

    const { buildGrammarReviewSession, buildGrammarReviewTask, diversifyReviewModes } = await import(
      "../../services/grammarReviewService"
    );
    const session = diversifyReviewModes(buildGrammarReviewSession(data));
    const task = buildGrammarReviewTask(session[0], data.sentenceDetails);
    const btn = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
      (b) => (b.textContent ?? "").trim() === task.answer
    );
    expect(btn, "应能定位到正确答案").toBeTruthy();
    clickElement(btn!);
    await flushAsync();

    const after = Array.from(page.container.querySelectorAll("[aria-live], [role=status], [role=alert]"));
    // eslint-disable-next-line no-console
    console.log(
      `[复习页] 判题后 live region 数=${after.length}；` +
        after.map((el) => `${el.tagName}.${(el.className || "").toString().slice(0, 30)}[aria-live=${el.getAttribute("aria-live")}]`).join(" ")
    );
    // 这是「新插入」的报告事实：答题前 0 个、判题后才出现
    expect(before.length, "复习页答题前没有任何 live region（判题反馈是判题后才插入的）").toBe(0);
    expect(after.length, "判题后应出现反馈区").toBeGreaterThan(0);
    page.unmount();
  });

  it("课程页 guided 段：判题前后的 live region 数量对比", async () => {
    resetStorage();
    seedForPages();
    const page = mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON_ID}`, "/grammar/lesson/:lessonId");
    await flushAsync();
    const count = () =>
      page.container.querySelectorAll("[aria-live], [role=status], [role=alert]").length;
    // eslint-disable-next-line no-console
    console.log(`[课程页] 初始（前测）live region 数=${count()}`);
    // 走完前测
    const opt = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
      (b) => (b.textContent ?? "").trim() === "is"
    );
    if (opt) {
      clickElement(opt);
      await flushAsync();
    }
    // eslint-disable-next-line no-console
    console.log(`[课程页] 前测答题后 live region 数=${count()}`);
    page.unmount();
  });
});
