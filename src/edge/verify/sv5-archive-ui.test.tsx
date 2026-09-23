// @vitest-environment jsdom
/**
 * SV5 · 归档功能的端到端可用性（2026-09-22）
 *
 * 服务层已由 `sv1` 覆盖（含「连胜不变」这条关键不变量）。
 * 这里验证**用户真的能用上**：设置页有入口、点开有影响面说明、确认后生效且进度不变。
 *
 * 另含一条本轮的重要修正：`diffJson` 的摘除必须**两侧同步**——
 * 写入侧停发（reviewService）而迁移侧还在补（storage）时，
 * 修复会被完全抵消（实测：没有该字段的记录迁完又冒出来）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import SettingsPage from "../../pages/SettingsPage";
import { clickButtonContaining, flushAsync } from "./drive";
import { makeAppData, seedAppData } from "./fixtures";
import { migrateData } from "../../services/storage";
import type { Card, Review } from "../../types";

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}

const card = (id: string): Card =>
  ({
    id, type: "word", front: `w${id}`, back: "x", note: "", tags: [],
    status: "review", priority: false,
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z"
  }) as Card;

/** 造 300 天历史（超过 180 天保留窗口）。 */
const longHistory = () => {
  const reviews: Review[] = [];
  for (let d = 0; d < 300; d += 1) {
    for (let i = 0; i < 6; i += 1) {
      reviews.push({
        id: `r-${d}-${i}`,
        cardId: "c1",
        mode: "spelling",
        rating: (i % 4 === 0 ? 2 : 4) as 2 | 4,
        answer: `a-${d}-${i}`,
        reviewedAt: new Date(Date.now() - d * 86400000 + i * 60000).toISOString()
      });
    }
  }
  reviews.sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt));
  return makeAppData({ cards: [card("c1")], reviews });
};

describe("SV5 归档功能端到端", () => {
  beforeEach(() => resetStorage());

  it("设置页有归档入口，点开有影响面说明，确认后明细被压缩", async () => {
    const data = seedAppData(longHistory());
    const beforeCount = data.reviews.length;

    const page = mountPage(<SettingsPage />, "/settings", "/settings");
    await flushAsync();
    clickButtonContaining(page, "数据");
    await flushAsync();

    const entry = Array.from(page.container.querySelectorAll("button")).find((button) =>
      (button.textContent ?? "").includes("归档久远复习明细")
    ) as HTMLButtonElement | undefined;
    expect(entry, "设置页应有「归档久远复习明细」入口").toBeTruthy();

    entry!.click();
    await flushAsync();
    // 确认框应说明这是安全操作（保留进度）
    expect(page.text(), "确认框应说明不会丢进度").toMatch(/进度|连胜|掌握/);

    const confirm = Array.from(page.container.querySelectorAll("button")).find((button) =>
      (button.textContent ?? "").includes("确认")
    ) as HTMLButtonElement | undefined;
    expect(confirm, "应有确认按钮").toBeTruthy();
    confirm!.click();
    await flushAsync();

    const after = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
    expect(after.reviews.length, "归档后条数应减少").toBeLessThan(beforeCount);
    expect(page.text(), "应提示归档了多少").toMatch(/已归档|没有需要归档/);
    page.unmount();
  });

  it("★ diffJson 两侧同步：写入侧停发后，迁移侧不得再补回", () => {
    // 一条明确没有 diffJson 的记录
    const raw = { schemaVersion: 8, cards: [card("c1")], reviews: [{ id: "r1", cardId: "c1", mode: "spelling", rating: 3, answer: "x", reviewedAt: "2024-01-01T00:00:00.000Z" }] };
    const migrated = migrateData(raw);
    expect(
      "diffJson" in migrated.reviews[0],
      "迁移不应给缺失的记录补 diffJson——补 \"[]\" 等于编造「比过了、零差异」"
    ).toBe(false);
  });

  it("旧数据里真实存在的 diffJson 值仍应保留（不误删用户数据）", () => {
    const raw = {
      schemaVersion: 8,
      cards: [card("c1")],
      reviews: [{ id: "r1", cardId: "c1", mode: "spelling", rating: 3, answer: "x", diffJson: '[{"token":"a","status":"match"}]', reviewedAt: "2024-01-01T00:00:00.000Z" }]
    };
    const migrated = migrateData(raw);
    expect(migrated.reviews[0].diffJson, "旧值应原样保留").toBe('[{"token":"a","status":"match"}]');
  });

  it("空字符串的 diffJson 不保留（视为无值，不写入）", () => {
    const raw = {
      schemaVersion: 8,
      cards: [card("c1")],
      reviews: [{ id: "r1", cardId: "c1", mode: "spelling", rating: 3, answer: "x", diffJson: "", reviewedAt: "2024-01-01T00:00:00.000Z" }]
    };
    expect("diffJson" in migrateData(raw).reviews[0]).toBe(false);
  });
});
