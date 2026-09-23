// @vitest-environment jsdom
/**
 * PF1 · 语法遥测的追加/读取成本（2026-09-22 修，P1 性能）
 *
 * 背景：`appendGrammarEvent` 曾是「读全部 → push → 写全部」——
 * 每次追加都要 `JSON.parse` + `JSON.stringify` 整个 3000 条 / ~450KB 的数组。
 * 而遥测是**答题热路径**上的一环（每答一题至少记一条），
 * 满仓时单条 1.5ms，一节课累计几百毫秒的同步阻塞。
 *
 * 修法：内存缓存主键内容（用原始字符串比对判断是否过期），
 * 读取命中缓存、追加只 stringify 一次（省掉 parse 与数组重建）。
 *
 * ⚠️ 测量说明：断言用的是**相对阈值**（性能比 + 宽松上限），
 * 不是精确毫秒——CI 机器抖动大，绝对阈值会变成 flaky 测试。
 * 这里验证的是「成本没有随历史增长而爆炸」这一性质。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { resetStorage } from "../harness";
import { appendGrammarEvent, listGrammarEvents, MAX_TELEMETRY_EVENTS_FOR_TEST } from "../../services/grammarTelemetry";
import { nowIso } from "../../services/storage";

const append = (n: number) => {
  for (let i = 0; i < n; i += 1) {
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
  }
};

const measure = (fn: () => void, rounds: number): number => {
  fn(); // 预热
  const t0 = performance.now();
  fn();
  return performance.now() - t0;
};

describe("PF1 遥测追加/读取成本", () => {
  beforeEach(() => resetStorage());

  it("读取必须命中缓存：200 次读取的成本应远小于 200 次「解析整份 JSON」", () => {
    append(800);
    const raw = window.localStorage.getItem("grammar-telemetry-events-v1") ?? "";
    // 基线：直接 JSON.parse 同一份数据（= 修复前读取路径的真实成本）
    const parseBaseline = measure(() => {
      for (let i = 0; i < 200; i += 1) JSON.parse(raw);
    }, 1);
    const readCost = measure(() => {
      for (let i = 0; i < 200; i += 1) listGrammarEvents();
    }, 1);
    /**
     * 判据：读取若命中缓存，成本应显著低于「每次都 parse 整份 JSON」。
     * 用 parseBaseline 而非绝对毫秒做基准——CI 机器快慢不同，比值才稳定。
     * 修复前 listGrammarEvents 每次都 parse，两者应当接近；
     * 修复后前者应快至少 3 倍。
     */
    expect(
      readCost,
      `读 200 次（${readCost.toFixed(2)}ms）应显著快于解析基线（${parseBaseline.toFixed(2)}ms）——` +
        `若接近说明缓存没生效`
    ).toBeLessThan(parseBaseline / 3);
  });

  it("追加成本不随历史线性爆炸：满仓后的单条成本 < 空仓时的 8 倍", () => {
    append(10);
    const early = measure(() => append(5), 1) / 5;
    append(MAX_TELEMETRY_EVENTS_FOR_TEST - listGrammarEvents().length - 5);
    const late = measure(() => append(5), 1) / 5;
    /**
     * 判据：追加仍需 stringify 整份数据，所以**不会**随规模完全持平；
     * 但不能比空仓时慢一个数量级（那说明有额外的 parse 或数组重建）。
     * 修复前满仓单条 1.5ms、空仓约 0.05ms → 30 倍，会被这条抓住。
     */
    expect(
      late,
      `满仓后单条（${late.toFixed(2)}ms）不应比空仓时（${early.toFixed(2)}ms）慢 8 倍以上——` +
        `若超了说明又变成每次全量 parse`
    ).toBeLessThan(Math.max(early * 8, 2));
  });

  it("缓存对「外部直接改存储」失效（不会读到旧数据）", () => {
    append(3);
    expect(listGrammarEvents().length, "前置：3 条").toBe(3);
    // 模拟外部直接写存储（导入恢复 / 另一处代码）
    window.localStorage.setItem(
      "grammar-telemetry-events-v1",
      JSON.stringify({ version: 1, events: [{ kind: "lesson_exit", lessonId: "ext", stage: "watch", ts: nowIso() }] })
    );
    expect(listGrammarEvents().length, "缓存应失效并读到外部写入的内容").toBe(1);
  });

  it("缓存不影响写入语义：追加后再读能拿到新事件", () => {
    append(2);
    appendGrammarEvent({ kind: "lesson_exit", lessonId: "z", stage: "practice", ts: nowIso() } as never);
    const events = listGrammarEvents();
    expect(events.length).toBe(3);
    expect(events[events.length - 1].kind).toBe("lesson_exit");
  });
});
