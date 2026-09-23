// @vitest-environment jsdom
/**
 * ENV2c · 多窗口 / 多标签的一致性（2026-09-22 存储环境差异专项）
 *
 * Tauri 多窗口与浏览器多标签共用一个 origin 的 localStorage，
 * 但**同一个站点的多个窗口各自持有一份内存态**。本文件回答：
 * 两个窗口同时打开时会不会互相覆盖？
 *
 * ## 本文件的范围（R10 修复后已收窄）
 *
 * 这里测的是**存储层原语**（`loadData` / `saveData`）的语义：
 * 它们**本来就是整份覆盖写**——这不打算改，因为它们是「把一份完整数据落盘」的
 * 最底层动作，不该在那里猜业务意图。
 *
 * 于是本文件固定的事实是：
 *   1. 全项目**没有** `storage` 事件监听，也没有 BroadcastChannel。
 *      （R10 的多窗口合并**不靠**它们实现，是靠写入前比对磁盘内容 —— 见下。）
 *   2. `saveData` 是「整份覆盖写」（一次 `setItem`），后写的一方整份胜出。
 *   3. 所以**直接调用 `saveData` 模拟两个窗口**时，一方的进度会丢。
 *
 * ## 应用层的真实行为请看 ENV5
 *
 * 上面的第 3 条**不是用户会遇到的行为**：页面从不直接调 `saveData`，
 * 而是走 `AppContext.commitData` —— 它在写入前比对「我上次写的」与
 * 「磁盘现在的」，发现另一窗口写过时把函数式 updater **重放到对方的数据上**，
 * 双方的改动都保留。端到端验证在 `env5-multiwindow-merge.test.tsx`。
 *
 * 历史：本文件最初（第 9 轮）的结论是「两窗口交替学习会稳定丢进度且不可恢复」，
 * 那是当时的事实；第 10 轮的 R10 修复改变了应用层行为，
 * 存储层原语与下面这些断言仍然成立，故保留作为底层语义的固定。
 */
import { describe, expect, it } from "vitest";
import { loadData, saveData } from "../../services/storage";
import { STORAGE_KEY, makeAppData } from "./fixtures";
import type { AppData, Card } from "../../types";

/** 一个「窗口」：各持一份内存态，写入时整份覆盖 localStorage。 */
interface Window_ {
  data: AppData;
  /** 模拟 commitData：内存先改，再整份落盘。 */
  commit: (next: AppData) => void;
  /** 重新从存储读（相当于用户手动刷新页面）。 */
  reload: () => void;
}

const openWindow = (): Window_ => {
  const win: Window_ = {
    data: loadData(),
    commit(next) {
      this.data = next;
      saveData(next);
    },
    reload() {
      this.data = loadData();
    }
  };
  return win;
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

const withNewCards = (data: AppData, cards: Card[]): AppData => ({
  ...data,
  cards: [...data.cards, ...cards]
});

const withReview = (data: AppData, id: string, cardId: string): AppData => ({
  ...data,
  reviews: [
    ...data.reviews,
    { id, cardId, mode: "spelling", rating: 4, answer: "x", reviewedAt: "2024-01-02T09:00:00.000Z" }
  ]
});

const readDisk = (): AppData => JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as AppData;

/** 一份至少有一张卡的起始数据（没有卡就没法「复习一张卡」）。 */
const seeded = (): AppData =>
  makeAppData({ cards: [makeCard("seed-card", "This is the sentence that was already here.")] });

describe("ENV2c 多窗口的一致性", () => {
  it("基线：单窗口内写入正常（对照组）", () => {
    window.localStorage.clear();
    const win = openWindow();
    const before = win.data.cards.length;
    win.commit(withNewCards(win.data, [makeCard("only-window", "Only one window here.")]));
    win.reload();
    expect(win.data.cards.length, "单窗口：新增一张卡").toBe(before + 1);
    expect(win.data.cards.some((card) => card.id === "only-window")).toBe(true);
  });

  it("存储层语义：直接调 saveData 时，后写的整份覆盖先写的（应用层已由 commitData 合并，见 ENV5）", () => {
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded()));

    const a = openWindow();
    const b = openWindow();

    // 窗口 A：复习了一张卡
    a.commit(withReview(a.data, "review-from-A", "seed-card"));
    // 窗口 B：也复习了一张卡（B 的内存态是打开时的快照，不含 A 的记录）
    b.commit(withReview(b.data, "review-from-B", "seed-card"));

    const onDisk = readDisk();
    expect(
      onDisk.reviews.some((review) => review.id === "review-from-A"),
      "A 的复习记录在磁盘上不见了（不是合并，是整份覆盖）"
    ).toBe(false);
    expect(onDisk.reviews.some((review) => review.id === "review-from-B")).toBe(true);

    /** A 的窗口里界面仍显示自己的记录（内存态），但它已经不在磁盘上了 —— 内存与磁盘分叉。 */
    expect(
      a.data.reviews.some((review) => review.id === "review-from-A"),
      "A 仍在显示自己的记录，用户看不出异常"
    ).toBe(true);

    /** A 刷新一次就永久失去那条记录。 */
    a.reload();
    expect(
      a.data.reviews.some((review) => review.id === "review-from-A"),
      "A 刷新后自己的记录彻底消失，且没有任何提示"
    ).toBe(false);
  });

  it("存储层语义：直接调 saveData 时，一次小操作会整份抹掉批量导入（应用层已由 commitData 合并，见 ENV5）", () => {
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(makeAppData()));

    const importer = openWindow();
    const other = openWindow();
    const baseline = importer.data.cards.length;

    const imported = Array.from({ length: 50 }, (_, index) =>
      makeCard(`imported-${index}`, `Imported sentence number ${index}.`)
    );
    importer.commit(withNewCards(importer.data, imported));
    expect(readDisk().cards.length, "前置：50 张卡已落盘").toBe(baseline + 50);

    /** 另一个窗口只是改了个设置（一次很小的操作），落盘时把整份旧快照写回去。 */
    other.commit({
      ...other.data,
      settings: { ...other.data.settings, dailyNewWords: 42 }
    });

    const onDisk = readDisk();
    expect(onDisk.settings.dailyNewWords, "设置改动生效了").toBe(42);
    expect(
      onDisk.cards.length,
      "50 张导入的卡被整份抹掉——用户在另一个窗口的工作凭空消失"
    ).toBe(baseline);
  });

  it("storage 事件：应用没有监听（另一窗口的写入不会让本窗口更新）", () => {
    window.localStorage.clear();
    const a = openWindow();
    const cardsBefore = a.data.cards.length;

    let storageEventsSeen = 0;
    const listener = () => {
      storageEventsSeen += 1;
    };
    /** storage 事件在同窗口内本来就不会因自己的写触发；这里记录的是
     *  「应用有没有注册过监听」——用一次显式派发来验证注册表是空的。 */
    window.addEventListener("storage", listener);

    // 模拟「另一个窗口写了存储」：真实浏览器会派发 storage 事件到本窗口。
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(withNewCards(a.data, [makeCard("from-other", "From the other window.")])));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: window.localStorage.getItem(STORAGE_KEY)
      })
    );

    /** 本窗口的内存态一动不动 —— 因为没有任何地方消费这个事件。 */
    expect(a.data.cards.length, "本窗口内存态完全没变").toBe(cardsBefore);
    expect(a.data.cards.some((card) => card.id === "from-other")).toBe(false);
    /** 事件本身是被派发了的（说明「没更新」不是因为事件没到，而是没人听）。 */
    expect(storageEventsSeen, "事件已派发但应用无人监听").toBe(1);

    window.removeEventListener("storage", listener);
  });

  it("结构性证据：合并逻辑不依赖 storage 事件 / BroadcastChannel（写入前比对即可）", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    /** `__dirname` 在 vitest 下指向本文件所在目录（src/edge/verify）→ 上溯两级得到 src。 */
    const srcRoot = path.resolve(__dirname, "../..");
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(entry.name)) continue;
        if (/\.test\.(ts|tsx)$/.test(entry.name)) continue;
        const text = fs.readFileSync(full, "utf8");
        if (/addEventListener\(\s*["']storage["']/.test(text) || /BroadcastChannel/.test(text)) {
          offenders.push(path.relative(srcRoot, full));
        }
      }
    };
    walk(srcRoot);

    expect(
      offenders,
      "R10 的多窗口合并刻意**不依赖** storage 事件 / BroadcastChannel"
        + "（而是写入前比对磁盘内容，见 AppContext.otherWindowSnapshot）；"
        + "若这里出现文件，说明换了实现路线，请一并更新注释与 ENV5 的说明"
    ).toEqual([]);
  });
});
