// @vitest-environment jsdom
/**
 * MG4-c · 导入是否破坏当前数据 + 二次确认（2026-09-22）
 *
 * 这项是备份功能里风险最高的一条：restoreDataFromJson 到底是「全量替换」还是「合并」？
 * 用户导入前后的未导出进度会不会被静默覆盖？UI 有没有二次确认？
 *
 * 分两层验证：
 *  1. 服务层：restoreDataFromJson 与 saveData 是写死覆盖，无 diff、无保护；
 *  2. UI 层：SettingsPage 的「恢复 JSON」→ ConfirmDialog → 确认后才 setData。
 *     UI 层用真实 React 渲染，走 FileReader 的完整路径。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import type { AppData } from "../../types";
import { exportJson } from "../../services/exportService";
import { restoreDataFromJson, saveData } from "../../services/storage";
import SettingsPage from "../../pages/SettingsPage";
import { mountPage, resetStorage, type Mounted } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { readAppData, seedAppData } from "./fixtures";
import { makeAppData } from "./fixtures";

const wordCard = (id: string, front: string, extra: Record<string, unknown> = {}) => ({
  id,
  type: "word" as const,
  front,
  back: `${front} 的释义`,
  note: "",
  tags: [] as string[],
  status: "review" as const,
  priority: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  ...extra
});

/* ── 服务层 ───────────────────────────────────────────────────────────── */

describe("MG4-c 服务层：全量替换（无合并、无保护）", () => {
  beforeEach(() => {
    resetStorage();
  });

  it("restoreDataFromJson 覆盖本机全部卡片与复习，不保留任何本机实体", () => {
    const local = makeAppData({
      cards: [wordCard("local_1", "local"), wordCard("local_2", "local2")],
      reviews: [
        {
          id: "r1",
          cardId: "local_1",
          mode: "spelling",
          rating: 4,
          answer: "local",
          diffJson: "[]",
          reviewedAt: "2024-01-01T00:00:00.000Z"
        }
      ]
    });
    saveData(local);
    expect(readAppData().cards.length).toBe(2);

    const backup = makeAppData({ cards: [wordCard("backup_1", "backup")] });
    const restored = restoreDataFromJson(exportJson(backup));

    expect(restored.cards.map((card) => card.id)).toEqual(["backup_1"]);
    expect(restored.reviews, "本机复习记录被清空，且没有任何提示").toEqual([]);
    expect(readAppData().cards.map((card) => card.id)).toEqual(["backup_1"]);
  });

  it("导入后新增的本机卡片在再导入一次旧备份时消失（不可撤销）", () => {
    const backup = makeAppData({ cards: [wordCard("old_1", "old")] });
    restoreDataFromJson(exportJson(backup));

    // 用户在导入之后学了新词
    const withNew = { ...readAppData(), cards: [...readAppData().cards, wordCard("learned_after", "later")] };
    saveData(withNew);
    expect(readAppData().cards.length).toBe(2);

    // 再次导入同一份旧备份 → 导入后的进度静默消失
    const again = restoreDataFromJson(exportJson(backup));
    expect(again.cards.map((card) => card.id), "导入后学的新词被静默清掉").toEqual(["old_1"]);
  });

  it("全量替换的判据：没有任何按 id 合并的逻辑（同 id 卡片的字段也不保留本机值）", () => {
    const local = makeAppData({ cards: [wordCard("same_id", "localvalue", { status: "mastered", note: "本机备注" })] });
    saveData(local);

    const backup = makeAppData({ cards: [wordCard("same_id", "backupvalue", { status: "new" })] });
    const restored = restoreDataFromJson(exportJson(backup));

    expect(restored.cards[0].front).toBe("backupvalue");
    expect(restored.cards[0].status, "本机的 mastered 进度被备份的值覆盖").toBe("new");
    expect(restored.cards[0].note, "本机备注被备份的空值覆盖").toBe("");
  });
});

/* ── UI 层：二次确认 ──────────────────────────────────────────────────── */

/** 触发页面上「恢复 JSON」的 file input（走真实 change 事件 + FileReader）。 */
const uploadBackup = async (page: Mounted, content: string, filename = "vocab-backup.json"): Promise<void> => {
  const input = page.container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error("设置页上没有找到「恢复 JSON」的文件输入框");
  const file = new File([content], filename, { type: "application/json" });
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  // React 的 onChange 挂在原生 change 事件上；jsdom 的 .click() 不会打开文件选择器，
  // 所以这里直接派发 change，等价于用户选中文件。
  await act(async () => {
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  // FileReader 是异步的，多冲几次微/宏任务等 onload 走完。
  await flushAsync();
  await flushAsync();
  await flushAsync();
};

const dialogOf = (page: Mounted): HTMLElement | null =>
  page.container.querySelector<HTMLElement>('[role="alertdialog"], [role="dialog"]');

/** 打开「数据与安全」标签页：恢复入口只在那里渲染。 */
const openDataTab = (page: Mounted): void => {
  const tab = Array.from(page.container.querySelectorAll("button")).find((button) =>
    (button.textContent ?? "").includes("数据与安全")
  );
  clickElement(tab);
};

const setupSettingsPage = (): Mounted => {
  seedAppData({
    cards: [wordCard("local_1", "local"), wordCard("local_2", "local2")],
    reviews: [
      {
        id: "r1",
        cardId: "local_1",
        mode: "spelling",
        rating: 4,
        answer: "local",
        diffJson: "[]",
        reviewedAt: "2024-01-01T00:00:00.000Z"
      }
    ]
  });
  return mountPage(<SettingsPage />, "/settings", "/settings");
};

describe("MG4-c UI 层：恢复 JSON 有二次确认弹窗", () => {
  beforeEach(() => {
    resetStorage();
  });

  it("选择备份文件后先弹确认，不直接覆盖", async () => {
    const page = setupSettingsPage();
    openDataTab(page);

    const backup = makeAppData({ cards: [wordCard("backup_1", "backup")] });
    await uploadBackup(page, exportJson(backup));

    const dialog = dialogOf(page);
    const dialogText = (dialog?.textContent ?? "").replace(/\s+/g, " ");
    // eslint-disable-next-line no-console
    console.log(`[UI 确认弹窗] "${dialogText}"`);

    expect(dialog, "选文件后应弹确认框").not.toBeNull();
    expect(dialogText, "应说明会完全覆盖本机数据").toContain("完全覆盖");
    expect(dialogText, "应说明不可撤销").toContain("不可撤销");
    expect(dialogText, "应给出本机当前范围").toContain("本机当前");
    expect(dialogText, "应给出备份文件范围").toContain("备份文件");

    // 关键：确认前本机数据未被改动
    expect(readAppData().cards.map((card) => card.id), "确认之前不能动数据").toEqual(["local_1", "local_2"]);
    expect(page.text(), "弹窗阶段不该出现「已恢复」").not.toContain("已恢复");

    page.unmount();
  }, 30000);

  it("确认弹窗展示的是两边真实数量（本机 2 张 vs 备份 1 张）", async () => {
    const page = setupSettingsPage();
    openDataTab(page);

    const backup = makeAppData({ cards: [wordCard("backup_1", "backup")] });
    await uploadBackup(page, exportJson(backup));

    const scope = page.container.querySelector(".danger-preview-scope");
    const scopeText = (scope?.textContent ?? "").replace(/\s+/g, " ");
    // eslint-disable-next-line no-console
    console.log(`[影响范围] "${scopeText}"`);
    expect(scopeText, "本机 2 张卡").toContain("2 张卡片");
    expect(scopeText, "备份 1 张卡").toContain("1 张卡片");

    page.unmount();
  }, 30000);

  it("取消后数据保持原样", async () => {
    const page = setupSettingsPage();
    openDataTab(page);

    const backup = makeAppData({ cards: [wordCard("backup_1", "backup")] });
    await uploadBackup(page, exportJson(backup));
    expect(dialogOf(page)).not.toBeNull();

    const cancelButton = Array.from(page.container.querySelectorAll("button")).find(
      (button) => (button.textContent ?? "").trim() === "取消"
    );
    clickElement(cancelButton);
    await flushAsync();

    expect(dialogOf(page), "取消后弹窗关闭").toBeNull();
    expect(readAppData().cards.map((card) => card.id), "取消后数据不变").toEqual(["local_1", "local_2"]);

    page.unmount();
  }, 30000);

  it("确认后数据被备份替换，并给出恢复结果提示", async () => {
    const page = setupSettingsPage();
    openDataTab(page);

    // 备份里带复习记录，好核对提示里的数字
    const backup = makeAppData({
      cards: [wordCard("backup_1", "backup")],
      reviews: [
        {
          id: "rb1",
          cardId: "backup_1",
          mode: "spelling",
          rating: 4,
          answer: "backup",
          diffJson: "[]",
          reviewedAt: "2024-01-01T00:00:00.000Z"
        }
      ]
    });
    await uploadBackup(page, exportJson(backup));

    const confirmButton = Array.from(page.container.querySelectorAll("button")).find(
      (button) => (button.textContent ?? "").trim() === "确认覆盖"
    );
    expect(confirmButton, "确认按钮文案应清楚表达会覆盖").toBeTruthy();
    clickElement(confirmButton);
    // setData 会同步 commitData → saveData，但 React 状态需要一次刷新
    await flushAsync();

    const restored = readAppData();
    // eslint-disable-next-line no-console
    console.log(
      `[确认后] 落盘卡片=${JSON.stringify(restored.cards.map((c) => c.id))} 复习=${restored.reviews.length} 页面提示含"已恢复"=${page.text().includes("已恢复")}`
    );

    expect(restored.cards.map((card) => card.id), "确认后备份生效").toEqual(["backup_1"]);
    expect(page.text(), "应给出恢复结果提示").toContain("已恢复");
    expect(dialogOf(page), "确认后弹窗关闭").toBeNull();

    page.unmount();
  }, 30000);

  it("非法 JSON：给错误提示且不动数据（不弹确认框）", async () => {
    const page = setupSettingsPage();
    openDataTab(page);

    await uploadBackup(page, "{ this is not json");

    const messages = Array.from(page.container.querySelectorAll('[role="status"]'))
      .map((node) => (node.textContent ?? "").trim())
      .filter(Boolean);
    // eslint-disable-next-line no-console
    console.log(`[非法 JSON 页面提示] ${JSON.stringify(messages)}`);

    expect(dialogOf(page), "非法 JSON 不该弹确认框").toBeNull();
    expect(readAppData().cards.map((card) => card.id), "非法 JSON 不该动数据").toEqual(["local_1", "local_2"]);

    page.unmount();
  }, 30000);

  it("空对象 {}：给错误提示且不动数据", async () => {
    const page = setupSettingsPage();
    openDataTab(page);

    await uploadBackup(page, "{}");

    const messages = Array.from(page.container.querySelectorAll('[role="status"]'))
      .map((node) => (node.textContent ?? "").trim())
      .filter(Boolean);
    // eslint-disable-next-line no-console
    console.log(`[{} 页面提示] ${JSON.stringify(messages)}`);

    expect(dialogOf(page)).toBeNull();
    expect(readAppData().cards.map((card) => card.id)).toEqual(["local_1", "local_2"]);
    expect(messages.some((text) => text.includes("不是可识别")), "错误文案应说明这不是可识别的备份").toBe(true);

    page.unmount();
  }, 30000);

  it("超大备份写不下时：内存与磁盘分叉——页面显示 7000 张卡，磁盘还只有 1 张", async () => {
    const page = setupSettingsPage();
    openDataTab(page);

    // 7000 张卡 ≈ 2.9MB 备份；迁移会为每张卡补 wordDetails + schedule，
    // 落盘体积约为备份的 1.9 倍，因此超过 jsdom 的 500 万字符配额。
    const big = makeAppData({
      cards: Array.from({ length: 7000 }, (_, index) => ({
        id: `bulk_${index}`,
        type: "word",
        front: `word${index}`,
        back: `释义${index}`,
        note: "x".repeat(250),
        tags: [],
        status: "new",
        priority: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }))
    });
    await uploadBackup(page, exportJson(big));
    expect(dialogOf(page), "体积不影响解析，仍会弹确认框").not.toBeNull();

    const errors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "));
    };
    await act(async () => {
      Array.from(page.container.querySelectorAll("button"))
        .find((button) => (button.textContent ?? "").trim() === "确认覆盖")
        ?.click();
    });
    await flushAsync();
    console.error = originalError;

    const pageScope = Array.from(page.container.querySelectorAll(".settings-data-scope div"))
      .map((node) => (node.textContent ?? "").trim())
      .join(" / ");
    const onDisk = readAppData();

    // eslint-disable-next-line no-console
    console.log(
      `[写不下] 页面数据范围=${JSON.stringify(pageScope)}\n` +
        `  磁盘卡片数=${onDisk.cards.length}（本机 local_1 还在=${onDisk.cards.some((card) => card.id === "local_1")}）\n` +
        `  弹窗仍打开=${Boolean(dialogOf(page))} 页面含"已恢复"=${page.text().includes("已恢复")}\n` +
        `  React 未捕获错误=${errors.length} 首条=${(errors[0] ?? "").slice(0, 120)}`
    );

    // 1) UI 状态被换成了 7000 张卡（setData 成功）
    expect(pageScope, "界面显示已切到备份的 7000 张卡").toContain("卡片7000");
    // 2) 磁盘没写上（saveData 抛了 QuotaExceededError，被 React 当作未捕获错误吞掉）
    expect(onDisk.cards.length, "磁盘仍是导入前的 2 张卡 —— 内存与磁盘分叉").toBe(2);
    expect(onDisk.cards.some((card) => card.id === "local_1")).toBe(true);
    /**
     * 3) 修复后（2026-09-22）：落盘失败会**被捕获并显示给用户**。
     *
     * 修复前：`commitData` 没有 try/catch，`QuotaExceededError` 冒泡成 React 未捕获错误，
     * 只进 console——界面显示「已恢复」而磁盘没变，用户完全不知道。
     * 现在 AppContext 捕获后设 `saveError`，App 在内容区顶部渲染 role="alert" 横幅。
     */
    const notices = Array.from(page.container.querySelectorAll('[role="status"]')).map(
      (node) => node.textContent ?? ""
    );
    expect(
      notices.some((text) => /保存|空间|备份/.test(text)),
      `应有面向用户的失败提示，实际 status 内容：${JSON.stringify(notices)}`
    ).toBe(true);
    // 内存与磁盘仍会分叉（写入本身失败），但用户现在能看见这件事
    expect(onDisk.cards.length, "磁盘写不下时仍是旧数据").toBe(2);

    page.unmount();
  }, 180000);
});
