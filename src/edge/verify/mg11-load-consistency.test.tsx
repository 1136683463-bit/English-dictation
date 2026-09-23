// @vitest-environment jsdom
/**
 * MG11 · 首次加载的一致性（2026-09-22 修，两处 P0）
 *
 * ① `loadData` 曾迁移两次：直接 `migrateData(raw)` 一次，随后 `saveData(migrated)`
 *    内部**又**迁移一次。返回给页面的是第一次的结果，落盘的是第二次的，
 *    两者并不相同（实测 116 项差异）——首屏显示的数据与本次启动写盘的数据不一致。
 * ② 损坏数据的 catch 分支里直接 `saveData(initial)`；配额满时它会再抛一次，
 *    而项目没有 ErrorBoundary → 白屏，用户连导出备份自救的机会都没有。
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetStorage } from "../harness";
import { STORAGE_KEY } from "./fixtures";
import { loadData } from "../../services/storage";

describe("MG11 首次加载一致性", () => {
  beforeEach(() => {
    resetStorage();
  });

  it("返回值与落盘内容完全一致（不再迁移两次）", () => {
    // 一份会触发迁移修复的旧数据：卡片缺 unitId、缺 seededWordVersions
    const legacy = JSON.stringify({
      schemaVersion: 1,
      cards: [
        {
          id: "c1",
          type: "word",
          front: "achieve",
          back: "达到",
          note: "",
          tags: [],
          status: "review",
          priority: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        }
      ],
      schedules: []
    });
    window.localStorage.setItem(STORAGE_KEY, legacy);

    const returned = loadData();
    const onDisk = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");

    expect(
      JSON.stringify(returned),
      "内存里的初始数据应与磁盘上的一致——否则页面首屏与本次启动写盘的内容不符"
    ).toBe(JSON.stringify(onDisk));
  });

  it("配额满导致重置也写不下时，不抛错（应用仍能起来）", () => {
    // 让写入必定失败（模拟 QuotaExceededError）
    const setItem = vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("The quota has been exceeded.", "QuotaExceededError");
    });
    // 损坏到无法解析 → 走 catch 分支 → 重置也要写
    window.localStorage.getItem = () => "{ 这不是 JSON";

    expect(() => loadData(), "写不下时也不应抛错（否则无 ErrorBoundary 会白屏）").not.toThrow();
    const recovered = loadData();
    expect(recovered.cards.length, "仍应返回一份可用的初始数据").toBeGreaterThanOrEqual(0);
    setItem.mockRestore();
  });
});
