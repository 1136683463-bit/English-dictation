// @vitest-environment jsdom
/**
 * PF4 · 事件监听器计数
 *
 * 方法：包住 window/document 的 addEventListener / removeEventListener，
 * 记录「当前活跃监听器」的净数量。渲染 N 次后看净数量是否线性增长
 * （线性增长 = 依赖数组漏写，每次渲染都重注册）。
 *
 * 判据（按任务要求）：只做相对比较与数量级判断；毫秒数仅标注为 jsdom 观测值。
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { clickElement } from "./drive";
import { seedAppData, makeSentenceCard, cardsToData, PAST_ISO } from "./fixtures";
import ReviewPage from "../../pages/ReviewPage";
import SpellingPage from "../../pages/SpellingPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarPathPage from "../../pages/GrammarPathPage";
import UnitsPage from "../../pages/UnitsPage";
import LibraryPage from "../../pages/LibraryPage";
import { grammarLessons } from "../../data/grammarLessons";

/** 一份「有多张到期句子卡 + 部分课已完成」的数据，供各页面共用。 */
const richData = () => {
  const fixtures = Array.from({ length: 40 }, (_, index) =>
    makeSentenceCard({
      id: `card-${index}`,
      sentence: `I am learning sentence number ${index}.`,
      schedule: { nextReviewAt: PAST_ISO }
    })
  );
  return {
    grammarLessonsDone: grammarLessons.slice(0, 40).map((lesson) => lesson.id),
    ...cardsToData(fixtures)
  };
};

interface Ledger {
  live: () => Array<[string, number]>;
  total: () => number;
  adds: number;
  removes: number;
  reset: () => void;
}

let ledger: Ledger;
let uninstall: (() => void) | null = null;

const installLedger = (): Ledger => {
  const live = new Map<string, number>();
  const state = { adds: 0, removes: 0 };

  const keyOf = (target: string, type: string, options?: boolean | EventListenerOptions): string => {
    const capture = typeof options === "object" ? Boolean(options.capture) : Boolean(options);
    return `${target}:${type}:${capture}`;
  };

  const targets: Array<[string, EventTarget]> = [
    ["window", window],
    ["document", document],
    ["document.body", document.body]
  ];
  const originals: Array<[EventTarget, EventTarget["addEventListener"], EventTarget["removeEventListener"]]> = [];

  for (const [name, target] of targets) {
    const originalAdd = target.addEventListener;
    const originalRemove = target.removeEventListener;
    originals.push([target, originalAdd, originalRemove]);
    const add = originalAdd.bind(target);
    const remove = originalRemove.bind(target);
    target.addEventListener = ((
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => {
      state.adds += 1;
      const key = keyOf(name, type, options);
      live.set(key, (live.get(key) ?? 0) + 1);
      add(type, listener, options);
    }) as EventTarget["addEventListener"];
    target.removeEventListener = ((
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ) => {
      state.removes += 1;
      const key = keyOf(name, type, options);
      live.set(key, (live.get(key) ?? 0) - 1);
      remove(type, listener, options);
    }) as EventTarget["removeEventListener"];
  }

  uninstall = () => {
    for (const [target, originalAdd, originalRemove] of originals) {
      target.addEventListener = originalAdd;
      target.removeEventListener = originalRemove;
    }
  };

  return {
    live: () => [...live.entries()].filter(([, count]) => count !== 0).sort((a, b) => b[1] - a[1]),
    total: () => [...live.values()].reduce((sum, count) => sum + count, 0),
    get adds() {
      return state.adds;
    },
    get removes() {
      return state.removes;
    },
    reset: () => {
      live.clear();
      state.adds = 0;
      state.removes = 0;
    }
  };
};

const settle = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

/**
 * 派发一个 keydown。
 *
 * 必须在 `document.body` 上派发并冒泡——ReviewPage 的处理器里有
 * `event.target === document.body` 守卫（只接管「焦点不在任何控件上」时的空格键），
 * 直接在 window 上派发会让守卫短路、页面不重渲染，测不到「每次渲染重注册」。
 */
const pressKey = (key: string): void => {
  act(() => {
    document.body.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  });
};

describe("PF4 · 事件监听器计数", () => {
  beforeEach(() => {
    resetStorage();
    // jsdom 没有 ResizeObserver，Segmented 等组件在 layout effect 里直接用它会抛错刷屏。
    if (!("ResizeObserver" in globalThis)) {
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
    ledger = installLedger();
  });

  afterEach(() => {
    uninstall?.();
  });

  it("ReviewPage：每次渲染重注册 window keydown（依赖数组缺失）", async () => {
    seedAppData(richData());
    ledger.reset();
    const page = mountPage(<ReviewPage />, "/review", "/review");
    await settle();
    const afterMount = ledger.total();
    const keydownLive = new Map(ledger.live()).get("window:keydown:false") ?? 0;

    const addsBefore = ledger.adds;
    const perRender: number[] = [];
    for (let round = 0; round < 8; round += 1) {
      const before = ledger.adds;
      pressKey(" ");
      await settle();
      perRender.push(ledger.adds - before);
    }

    console.log("【ReviewPage】");
    console.log(`  挂载后活跃监听器 ${afterMount}，其中 window:keydown 净数量 ${keydownLive}`);
    console.log(`  8 次渲染各自新增 addEventListener：${perRender.join(", ")}`);
    console.log(`  累计 add=${ledger.adds}（挂载后新增 ${ledger.adds - addsBefore}） remove=${ledger.removes}`);
    console.log("  活跃明细：", ledger.live().slice(0, 8));
    page.unmount();
    console.log(`  卸载后活跃监听器 = ${ledger.total()}`);
  });

  it("ReviewPage：先答一题再渲染，add/remove 是否配平（有无累积泄漏）", async () => {
    seedAppData(richData());
    const page = mountPage(<ReviewPage />, "/review", "/review");
    await settle();
    const baseline = ledger.total();
    for (let round = 0; round < 10; round += 1) {
      pressKey(" ");
      await settle();
    }
    console.log(
      `【ReviewPage】基线活跃 ${baseline}，10 次渲染后活跃 ${ledger.total()}（add=${ledger.adds} remove=${ledger.removes}，差 ${ledger.adds - ledger.removes}）`
    );
    console.log("  活跃明细：", ledger.live().slice(0, 8));
    page.unmount();
    expect(ledger.total()).toBeLessThanOrEqual(baseline + 2);
  });

  it("各页面：挂载后活跃监听器数 + 6 次渲染后的新增注册数", async () => {
    const pages: Array<{ name: string; mount: () => ReturnType<typeof mountPage>; note: string }> = [
      { name: "GrammarPathPage", mount: () => mountPage(<GrammarPathPage />, "/grammar", "/grammar"), note: "点季卡" },
      { name: "GrammarReviewPage", mount: () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review"), note: "点选项/空格" },
      { name: "SpellingPage", mount: () => mountPage(<SpellingPage />, "/spelling", "/spelling"), note: "Tab" },
      { name: "UnitsPage", mount: () => mountPage(<UnitsPage />, "/units", "/units"), note: "Tab" },
      { name: "LibraryPage", mount: () => mountPage(<LibraryPage />, "/library", "/library"), note: "Tab" }
    ];

    for (const entry of pages) {
      ledger.reset();
      seedAppData(richData());
      const page = entry.mount();
      await settle();
      const mounted = ledger.total();
      const mountedDetail = ledger.live().slice(0, 6);
      // 逐次记录「本次渲染新增注册数」，识别是否每次渲染都重注册
      const perRender: number[] = [];
      for (let round = 0; round < 6; round += 1) {
        const before = ledger.adds;
        pressKey("Tab");
        await settle();
        perRender.push(ledger.adds - before);
      }
      console.log(
        `【${entry.name}】挂载后活跃 ${mounted}；6 次渲染各自新增注册 ${perRender.join(", ")}；当前活跃 ${ledger.total()}`
      );
      console.log(`   挂载时明细：${JSON.stringify(mountedDetail)}`);
      page.unmount();
      console.log(`   卸载后活跃 ${ledger.total()}`);
    }
    expect(true).toBe(true);
  });

  it("GrammarReviewPage 点选项（真实作答路径）：监听器是否随每次判题再注册", async () => {
    seedAppData(richData());
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await settle();
    const addsBefore = ledger.adds;
    const counts: number[] = [];
    for (let round = 0; round < 4; round += 1) {
      const option = Array.from(page.container.querySelectorAll(".lesson-option")).find(
        (node) => !(node as HTMLButtonElement).disabled
      ) as HTMLButtonElement | undefined;
      if (option) clickElement(option);
      else pressKey(" ");
      await settle();
      counts.push(ledger.adds - addsBefore);
    }
    console.log(
      `【GrammarReviewPage 作答】累计新增注册（每答一次）：${counts.join(", ")}；活跃 ${ledger.total()}；明细 ${JSON.stringify(ledger.live().slice(0, 8))}`
    );
    page.unmount();
    expect(true).toBe(true);
  });

  it("重复挂载/卸载 5 轮：有无泄漏", async () => {
    seedAppData(richData());
    ledger.reset();
    const afterUnmount: number[] = [];
    for (let round = 0; round < 5; round += 1) {
      const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
      await settle();
      page.unmount();
      afterUnmount.push(ledger.total());
    }
    console.log(`【GrammarReviewPage 5 轮】每轮卸载后活跃监听器：${afterUnmount.join(" → ")}`);
    expect(afterUnmount[afterUnmount.length - 1]).toBeLessThanOrEqual(afterUnmount[0]);
  });
});
