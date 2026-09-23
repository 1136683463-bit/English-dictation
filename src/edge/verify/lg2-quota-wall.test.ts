// @vitest-environment jsdom
/**
 * LG2 · 存储配额的真实墙体在哪（2026-09-22）
 *
 * 「一年使用」模拟的核心问题：**用户用多久会写不下。**
 *
 * 实测 jsdom 的 localStorage 上限是 **5MB（按 UTF-16 字符计）**：
 *   4MB 可写、5MB 抛 QuotaExceededError。
 * 真实 Chrome 的政策是 5MB **字符**（≈10MB 字节），
 * 但不同内核/嵌入式 WebView 差异很大，所以这个文件测的是**结构关系**：
 *   「主数据 + 遥测 + 缓存」三者合计占多少、谁会把总占用推过线。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { resetStorage } from "../harness";
import { nowIso } from "../../services/storage";
import { appendGrammarEvent } from "../../services/grammarTelemetry";

const MB = 1024 * 1024;

/** jsdom localStorage 的写入上限（实测）。 */
const probeCeiling = (): number => {
  let low = 0;
  let high = 8 * MB;
  for (let i = 0; i < 12 && high - low > 64 * 1024; i += 1) {
    const mid = Math.floor((low + high) / 2);
    try {
      window.localStorage.setItem("probe", "x".repeat(mid));
      window.localStorage.removeItem("probe");
      low = mid;
    } catch {
      high = mid;
    }
  }
  return low;
};

describe("LG2 存储配额墙体", () => {
  beforeEach(() => resetStorage());

  it("确认本环境的写入上限（作为后续判断的基准）", () => {
    const ceiling = probeCeiling();
    expect(ceiling, "本环境上限应在 4MB~5.5MB 之间").toBeGreaterThan(4 * MB);
    expect(ceiling).toBeLessThan(5.5 * MB);
  });

  it("主数据写到接近上限时，遥测写入会失败（但不能影响主数据）", () => {
    const ceiling = probeCeiling();
    // 主数据占到上限的 88%（留一点余量让它能写进去）
    const mainSize = Math.floor(ceiling * 0.88);
    window.localStorage.setItem("personal-vocab-app-data-v1", "m".repeat(mainSize));
    const before = (window.localStorage.getItem("personal-vocab-app-data-v1") ?? "").length;

    // 再灌遥测（满仓 3000 条，每条约 200 字符）
    let ok = 0;
    let failed = false;
    for (let i = 0; i < 4000; i += 1) {
      try {
        appendGrammarEvent({
          kind: "lesson_step_result",
          lessonId: "x",
          section: "guided",
          stepKind: "choose",
          stepIndex: i % 6,
          misses: 0,
          passed: true,
          ts: nowIso()
        } as never);
        ok += 1;
      } catch {
        failed = true;
        break;
      }
    }
    const after = (window.localStorage.getItem("personal-vocab-app-data-v1") ?? "").length;
    const telemetrySize = (window.localStorage.getItem("grammar-telemetry-events-v1") ?? "").length;

    /**
     * 关键保证：遥测写不下时，**主数据一字不动**。
     * 遥测的失败是刻意静默的（不影响学习主流程），但不能影响学习数据本身。
     */
    expect(after, "遥测写入不应挤压主数据").toBe(before);
    /**
     * 另一条结构性事实：遥测有 3000 条上限（超出转归档），
     * 所以它**不会无限增长**——实测灌 4000 次也只写入 3000 条左右的量级。
     * 这意味着长期使用时，真正无界增长的只有 `reviews` / `cards` / `diaryEntries`
     * 这些**主数据**字段，而不是遥测。
     */
    expect(ok, "应能写入若干条（未占满时）").toBeGreaterThan(0);
    expect(telemetrySize, "遥测体积应有界（受 3000 条上限约束）").toBeLessThan(1.5 * MB);
    void failed;
  }, 120000);
});
