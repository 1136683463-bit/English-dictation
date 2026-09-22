import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * 「为什么我拼的不对？」入口可见性的回归守门（2026-09-22）。
 *
 * 用户实测两次报同一现象：
 * ①「AI 的回答只出现了一次，后面的没有出现过」
 * ②「还是只出现了一次 AI 问答，然后又不出现了」
 *
 * 根因有两个（都已修）：
 * - 入口条件用累积态 `practiceMisses >= 1 || lastAttemptUsedDistractor`，
 *   用户「摆错 → 移除 → 重摆」后两者可能都不同时为真 → 答错态下入口消失
 * - 判题去抖用「块数」，长度相同而内容不同的修正动作被误挡 → 不判题 → 没有新反馈
 *
 * 本测试用源码断言守住这两个契约（页面级交互测试在本项目不便模拟词块拖拽）。
 */
describe("答错追问入口可见性（源码契约守门）", () => {
  const source = readFileSync(resolve(__dirname, "GrammarLessonPage.tsx"), "utf8");

  it("入口条件用「当前反馈态」而非累积次数", () => {
    // 必须有：practiceFeedback === "retry" 作为入口条件
    expect(source).toMatch(/\{practiceFeedback === "retry" && \(\s*<>/);
  });

  it("不再用累积态作为入口条件（只在注释里作为历史说明出现）", () => {
    const lines = source.split("\n");
    const codeLines = lines.filter((line) => {
      const trimmed = line.trim();
      // 排除注释行
      return !trimmed.startsWith("*") && !trimmed.startsWith("//") && !trimmed.startsWith("/*");
    });
    const offenders = codeLines.filter((line) => line.includes("practiceMisses >= 1 || lastAttemptUsedDistractor"));
    expect(offenders, `以下代码行仍在用累积态判据：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("判题去抖用序列指纹而非块数（长度相同但内容不同的修正要重新判）", () => {
    expect(source).toContain("lastJudgedSignatureRef");
    expect(source).not.toContain("lastJudgedLengthRef ="); // 不再有赋值
  });

  it("序列指纹参与判题判据（相同排列才跳过）", () => {
    expect(source).toMatch(/signature !== lastJudgedSignatureRef\.current/);
  });

  it("无 AI 提问配额残留（自学工具不设限）", () => {
    expect(source).not.toMatch(/还剩 \d+ 次/);
    expect(source).not.toContain("EXPLAIN_TOTAL_CAP_PER_LESSON");
  });
});
