import { beforeEach, describe, expect, it } from "vitest";
import {
  appendAdventureEvent,
  buildAdventureTelemetryExport,
  clearAdventureTelemetry,
  getAdventureTelemetryStats,
  listAdventureEvents,
  listAdventureEventsByKind,
  type AdventureTelemetryEvent
} from "./adventureTelemetry";

const makeEvent = (index: number): AdventureTelemetryEvent => ({
  kind: "session_start",
  adventureId: `adv-${index}`,
  sessionId: `sess-${index}`,
  entrySource: "continue",
  isReplay: false,
  ts: new Date(2026, 8, 13, 10, 0, index).toISOString()
});

beforeEach(() => {
  clearAdventureTelemetry();
});

describe("adventureTelemetry", () => {
  it("追加事件并可按 kind 过滤", () => {
    appendAdventureEvent(makeEvent(1));
    appendAdventureEvent({
      kind: "custom_action_submitted",
      adventureId: "adv-1",
      nodeId: "node-1",
      textLength: 12,
      outcome: "fallback",
      ts: new Date().toISOString()
    });

    expect(listAdventureEvents()).toHaveLength(2);
    expect(listAdventureEventsByKind("session_start")).toHaveLength(1);
    const custom = listAdventureEventsByKind("custom_action_submitted");
    expect(custom[0]?.outcome).toBe("fallback");
  });

  it("统计与导出结构正确", () => {
    appendAdventureEvent(makeEvent(1));
    const stats = getAdventureTelemetryStats();
    expect(stats.activeEvents).toBe(1);
    expect(stats.nearCapacity).toBe(false);

    const exported = JSON.parse(buildAdventureTelemetryExport()) as {
      version: number;
      events: AdventureTelemetryEvent[];
      stats: { activeEvents: number; lastEventAt: string | null };
    };
    expect(exported.version).toBe(1);
    expect(exported.events).toHaveLength(1);
    expect(exported.stats.activeEvents).toBe(1);
    expect(exported.stats.lastEventAt).not.toBeNull();
  });

  it("清空后事件与统计归零", () => {
    appendAdventureEvent(makeEvent(1));
    clearAdventureTelemetry();
    expect(listAdventureEvents()).toHaveLength(0);
    expect(getAdventureTelemetryStats().activeEvents).toBe(0);
  });

  it("V2 gate 事件类型可落库（M1 挂点前类型就绪）", () => {
    appendAdventureEvent({
      kind: "gate_submitted",
      gateId: "gate-1",
      verdict: "misread",
      attemptIndex: 1,
      errorTags: ["tense-past"],
      latencyMs: 4200,
      hintLevel: 0,
      ts: new Date().toISOString()
    });
    const gates = listAdventureEventsByKind("gate_submitted");
    expect(gates).toHaveLength(1);
    expect(gates[0]?.verdict).toBe("misread");
  });
});
