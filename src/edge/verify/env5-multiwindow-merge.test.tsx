// @vitest-environment jsdom
/**
 * ENV5 · 多窗口写入的合并（2026-09-22 第 10 轮 · R10 修复的端到端验证）
 *
 * ## 为什么不能只测存储层
 *
 * `env2c` 直接调 `loadData` / `saveData`（存储层原语），那两个函数**本来**
 * 就是整份覆盖——真正的修复在 `AppContext.commitData` 里：
 * 发现「另一个窗口在中间写过」时，把函数式 updater **重放到对方的数据上**。
 * 所以只有挂载**两个真实的 AppProvider** 共享同一份 localStorage，
 * 才能验证用户实际遇到的行为。
 *
 * ## 修复前后
 *
 * | 场景 | 修复前 | 修复后 |
 * |---|---|---|
 * | 两窗口各复习一张卡 | 后写的整份胜出，先写的进度**永久丢失** | 两条都在 |
 * | 一窗口导入 50 张卡，另一窗口改个设置 | 50 张卡被整份抹掉 | 50 张卡 + 设置都在 |
 *
 * 判据不是「代码里有 storage 监听」这类结构证据，而是**用户的数据还在不在**。
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { AppProvider, useAppData } from "../../AppContext";
import { STORAGE_KEY, seedAppData } from "./fixtures";
import type { AppData, Card } from "../../types";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type Ctx = ReturnType<typeof useAppData>;

/** 探针组件：把 context 暴露给测试（不渲染任何东西）。 */
const makeProbe = (sink: { ctx: Ctx | null }) => () => {
  sink.ctx = useAppData();
  return null;
};

interface Window_ {
  sink: { ctx: Ctx | null };
  root: Root;
  /** 当前窗口看到的数据 */
  data: () => AppData;
  unmount: () => void;
}

/**
 * 打开一个「窗口」：独立的 React 树 + 独立的 AppProvider，
 * 但与另一个窗口共享同一份 localStorage —— 这正是 Tauri 多窗口/浏览器多标签的真实形态。
 */
const openWindow = (): Window_ => {
  const sink: { ctx: Ctx | null } = { ctx: null };
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const Probe = makeProbe(sink);
  act(() => {
    root.render(
      <AppProvider>
        <Probe />
      </AppProvider>
    );
  });
  return {
    sink,
    root,
    data: () => sink.ctx!.data,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    }
  };
};

const makeCard = (id: string, sentence: string): Card => ({
  id,
  type: "sentence",
  front: sentence,
  back: "",
  note: "",
  tags: ["语法"],
  status: "review",
  priority: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
});

const addCard = (id: string, sentence: string) => (data: AppData): AppData => ({
  ...data,
  cards: [...data.cards, makeCard(id, sentence)]
});

const readDisk = (): AppData => JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as AppData;

/**
 * 给磁盘铺一份起始数据。
 *
 * 必须走 `seedAppData`（内部是 `parseBackupJson` → 真实迁移管线）：
 * 手写一份「看起来像 AppData」的 JSON 会被 `loadData` 判为需要迁移的裸数据，
 * 结果是它被种子词库替换掉，测试就完全测不到想测的东西。
 */
const seedDisk = (cards: Card[]) => {
  seedAppData({ cards });
};

/**
 * 提交一次函数式更新并等它真正落盘。
 *
 * `AppContext.updateData` 是**排队异步**的（`waitForQueuedUpdates().then(...)`），
 * 同步的 `act()` 不会 flush 微任务队列 —— 必须用 async act 并让出一轮微任务，
 * 否则断言会看到「什么都没发生」（这本身也是项目的一个真实行为：提交不是同步生效的）。
 */
const commit = async (win: Window_, updater: (data: AppData) => AppData) => {
  await act(async () => {
    win.sink.ctx!.updateData(updater);
  });
  await act(async () => {
    await Promise.resolve();
  });
};

const windows: Window_[] = [];
const open = () => {
  const w = openWindow();
  windows.push(w);
  return w;
};

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  while (windows.length) windows.pop()!.unmount();
});

describe("ENV5 多窗口写入：函数式更新会与另一窗口合并", () => {
  it("基线：单窗口的函数式更新正常落盘（对照组）", async () => {
    seedDisk([makeCard("seed", "A sentence that was already here.")]);
    const a = open();
    const before = a.data().cards.length;

    await commit(a, addCard("only", "Added by the only window."));

    expect(a.data().cards.length, "内存态 +1").toBe(before + 1);
    expect(readDisk().cards.some((card) => card.id === "only"), "磁盘上也有").toBe(true);
  });

  it("★ 修复核心：两个窗口依次各加一张卡，两张都保留（此前先写的会被整份覆盖）", async () => {
    seedDisk([makeCard("seed", "A sentence that was already here.")]);
    const a = open();
    const b = open();

    // 窗口 A 先写
    await commit(a, addCard("from-A", "Added by window A."));
    // 窗口 B 后写（B 的内存态是打开时的快照，不含 A 那张卡）
    await commit(b, addCard("from-B", "Added by window B."));

    const onDisk = readDisk();
    expect(
      onDisk.cards.some((card) => card.id === "from-A"),
      "A 的卡片仍在磁盘上（修复前会被 B 整份覆盖掉）"
    ).toBe(true);
    expect(onDisk.cards.some((card) => card.id === "from-B"), "B 的卡片也在").toBe(true);
    expect(onDisk.cards.some((card) => card.id === "seed"), "原有数据没丢").toBe(true);
  });

  it("★ 修复核心：另一窗口只改设置时，不会抹掉这边导入的 50 张卡", async () => {
    seedDisk([makeCard("seed", "A sentence that was already here.")]);
    const importer = open();
    const other = open();
    const baseline = importer.data().cards.length;

    const imported = Array.from({ length: 50 }, (_, index) =>
      makeCard(`imported-${index}`, `Imported sentence number ${index}.`)
    );
    await commit(importer, (data) => ({ ...data, cards: [...data.cards, ...imported] }));

    // 另一个窗口只改了一个设置
    await commit(other, (data) => ({
        ...data,
        settings: { ...data.settings, dailyNewWords: 42 }
      }));

    const onDisk = readDisk();
    expect(onDisk.settings.dailyNewWords, "设置改动生效").toBe(42);
    expect(
      onDisk.cards.length,
      "50 张导入的卡仍在——这正是修复前被整份抹掉的场景"
    ).toBe(baseline + 50);
  });

  it("三次交替写入（A→B→A）互不覆盖——重放对多轮交替同样成立", async () => {
    seedDisk([]);
    const a = open();
    const b = open();

    await commit(a, addCard("a1", "First from A."));
    await commit(b, addCard("b1", "First from B."));
    await commit(a, addCard("a2", "Second from A."));

    const ids = readDisk().cards.map((card) => card.id);
    expect(ids).toContain("a1");
    expect(ids).toContain("b1");
    expect(ids).toContain("a2");
  });

  it("本窗口连续多次更新（无其他窗口）不被误判为冲突", async () => {
    seedDisk([]);
    const a = open();
    for (let index = 0; index < 5; index += 1) {
      await commit(a, addCard(`own-${index}`, `Own sentence ${index}.`));
    }
    const ids = readDisk().cards.map((card) => card.id);
    expect(ids.length, "五次更新全部保留").toBe(5);
    expect(a.sink.ctx!.crossWindowNotice, "没有冲突就不该有提示").toBeNull();
  });

  it("另一窗口写入后本窗口界面仍显示自己的数据（内存态不被别人的写入顶掉）", async () => {
    seedDisk([]);
    const a = open();
    const b = open();

    await commit(b, addCard("from-B", "Added by window B."));

    /**
     * A 还没提交过任何东西，所以它不会主动去读 B 的写入——
     * 这是刻意的：会话中途热替换用户正在看的数据会造成「界面突然变了」。
     * 但当 A 提交时，它会先把 B 的数据合并进来，所以两边都不丢。
     */
    expect(a.data().cards.some((card) => card.id === "from-B"), "A 的界面还没被改动").toBe(false);

    await commit(a, addCard("from-A", "Added by window A."));
    const onDisk = readDisk();
    expect(onDisk.cards.map((card) => card.id).sort(), "A 提交时把 B 的一起带上了").toEqual([
      "from-A",
      "from-B"
    ]);
  });

  it("整份替换（重置）无法合并 → 如实告知，不静默吞掉另一窗口的改动", async () => {
    seedDisk([makeCard("seed", "A sentence that was already here.")]);
    const a = open();
    const b = open();

    await commit(b, addCard("from-B", "Added by window B."));
    expect(b.sink.ctx!.crossWindowNotice, "B 是函数式更新，自动合并，无需提示").toBeNull();

    // A 执行重置（整份替换语义，无法与 B 的改动合并）
    await act(async () => {
      a.sink.ctx!.reset();
    });

    expect(
      a.sink.ctx!.crossWindowNotice,
      "整份替换遇到另一窗口的改动时必须告知用户，而不是默默覆盖"
    ).toBeTruthy();
    expect(a.sink.ctx!.crossWindowNotice).toMatch(/另一个窗口/);
    // 提示可关闭
    act(() => {
      a.sink.ctx!.dismissCrossWindowNotice();
    });
    expect(a.sink.ctx!.crossWindowNotice).toBeNull();
  });
});
