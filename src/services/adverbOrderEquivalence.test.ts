import { describe, expect, it } from "vitest";
import { isAdverbOrderEquivalent, isFreeOutputPassed } from "./lessonService";

/**
 * 状语移位等价（2026-09-23 用户实测）。
 *
 * 用户写 `yesterday I went to the park`，核心句是 `I went to the park yesterday`——
 * 英语里两句都对（时间状语可前置可后置），但逐词位置比对只得 71% 被判错。
 *
 * 判定边界很关键：只放过**句首/句尾的状语换位**，
 * 中间的语序错误（she always is happy）必须仍然判错。
 */
describe("isAdverbOrderEquivalent（状语移位等价）", () => {
  it("用户实测的那句：状语前置与后置等价", () => {
    expect(isAdverbOrderEquivalent("yesterday I went to the park", "I went to the park yesterday")).toBe(true);
  });

  it("完全相同当然等价", () => {
    expect(isAdverbOrderEquivalent("I went to the park", "I went to the park")).toBe(true);
  });

  it("时间短语整体移位也等价", () => {
    expect(isAdverbOrderEquivalent("every day he drinks milk", "he drinks milk every day")).toBe(true);
    expect(isAdverbOrderEquivalent("last week I was busy", "I was busy last week")).toBe(true);
  });

  it("核心语序错误不放过（词相同但不是状语移位）", () => {
    expect(isAdverbOrderEquivalent("music like I", "I like music")).toBe(false);
    expect(isAdverbOrderEquivalent("park the to went I", "I went to the park")).toBe(false);
  });

  it("中间位置的语序错误不放过（she always is happy 是错的）", () => {
    expect(isAdverbOrderEquivalent("she always is happy", "she is always happy")).toBe(false);
  });

  it("词不同的不放过", () => {
    expect(isAdverbOrderEquivalent("I like dog", "I like dogs")).toBe(false);
    expect(isAdverbOrderEquivalent("I went park", "I went to the park")).toBe(false);
  });

  it("长度不同的不放过", () => {
    expect(isAdverbOrderEquivalent("I went to the park", "I went to the park yesterday")).toBe(false);
  });
});

describe("isFreeOutputPassed（自由输出统一通过判定）", () => {
  it("状语移位：无论分数多低都算通过", () => {
    // 逐词比对只得 71 分，但状语移位正确
    expect(isFreeOutputPassed("yesterday I went to the park", "I went to the park yesterday", 71, 90)).toBe(true);
  });

  it("拼写接近：走分数通道", () => {
    expect(isFreeOutputPassed("I went to the park", "I went to the park", 100, 90)).toBe(true);
    expect(isFreeOutputPassed("I went to the par", "I went to the park", 92, 90)).toBe(true);
  });

  it("既非移位也不够分：不通过", () => {
    expect(isFreeOutputPassed("I go park", "I went to the park", 40, 90)).toBe(false);
  });
});
