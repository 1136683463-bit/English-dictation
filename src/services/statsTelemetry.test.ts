import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildStatsTelemetryExport,
  clearStatsTelemetry,
  listStatsEvents,
  trackStatsActionClicked,
  trackStatsPageViewed
} from "./statsTelemetry";

// R15：statsTelemetry 行为补测。node 环境天然无 window，默认走内存降级路径。
describe("statsTelemetry 内存降级与导出（R15）", () => {
  beforeEach(() => {
    clearStatsTelemetry();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("无 localStorage 时内存降级：track 后 listStatsEvents 可读", () => {
    trackStatsPageViewed({ healthScore: 80, dueTotal: 5, weakWords: 3, streak: 7 });
    trackStatsActionClicked({ actionId: "primary", target: "/review", healthScore: 80, dueTotal: 5 });

    const events = listStatsEvents();
    expect(events).toHaveLength(2);
    expect(events[0].kind).toBe("stats_page_viewed");
    expect(events[1].kind).toBe("stats_action_clicked");
  });

  it("clearStatsTelemetry 清空内存事件", () => {
    trackStatsPageViewed({ healthScore: 60, dueTotal: 0, weakWords: 0, streak: 1 });
    expect(listStatsEvents()).toHaveLength(1);
    clearStatsTelemetry();
    expect(listStatsEvents()).toHaveLength(0);
  });

  it("超过 1000 条截断最旧、保留最新", () => {
    for (let i = 0; i < 1005; i += 1) {
      trackStatsActionClicked({ actionId: "plan", target: "/review", position: i, healthScore: 50, dueTotal: i });
    }

    const events = listStatsEvents();
    expect(events).toHaveLength(1000);
    // 最旧的 5 条（position 0-4）被丢弃，最新一条完整保留
    const first = events[0] as { position?: number; dueTotal: number };
    const last = events[events.length - 1] as { position?: number; dueTotal: number };
    expect(first.position).toBe(5);
    expect(last.position).toBe(1004);
    expect(last.dueTotal).toBe(1004);
  });

  it("buildStatsTelemetryExport 输出 {version, exportedAt, totalEvents, events} 结构", () => {
    trackStatsPageViewed({ healthScore: 90, dueTotal: 2, weakWords: 1, streak: 3 });

    const parsed = JSON.parse(buildStatsTelemetryExport()) as {
      version: number;
      exportedAt: string;
      totalEvents: number;
      events: unknown[];
    };
    expect(parsed.version).toBe(1);
    expect(typeof parsed.exportedAt).toBe("string");
    expect(Number.isNaN(Date.parse(parsed.exportedAt))).toBe(false);
    expect(parsed.totalEvents).toBe(1);
    expect(parsed.events).toHaveLength(1);
  });

  it("track 自动补齐 kind / schemaVersion:1 / ts", () => {
    trackStatsActionClicked({ actionId: "wrong_word", target: "/spelling?mode=mistakes", healthScore: 70, dueTotal: 4 });

    const event = listStatsEvents()[0];
    expect(event.kind).toBe("stats_action_clicked");
    expect(event.schemaVersion).toBe(1);
    expect(typeof event.ts).toBe("string");
    expect(Number.isNaN(Date.parse(event.ts))).toBe(false);
  });

  it("localStorage 写入抛错时静默不抛", () => {
    const throwingStorage = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota exceeded");
      },
      removeItem: () => {
        throw new Error("denied");
      }
    };
    vi.stubGlobal("window", { localStorage: throwingStorage });

    expect(() =>
      trackStatsPageViewed({ healthScore: 50, dueTotal: 1, weakWords: 0, streak: 0 })
    ).not.toThrow();
    expect(() => clearStatsTelemetry()).not.toThrow();
    // 读失败同样静默，按空处理
    expect(listStatsEvents()).toEqual([]);
  });
});
