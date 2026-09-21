// @vitest-environment node
/**
 * RV5 · 挖空题的题面必须真的能作答（2026-09-21 修，两处）
 *
 * ① 答案词在题面里还看得见：`I was late because the bus was late.` 挖掉第一个 late，
 *    第二个 late 仍在题面上——用户直接照抄。
 * ② 单词卡的题面塌成光秃秃的 `____`：front="am" 这类卡挖空后没有任何上下文，
 *    用户无从判断要填什么（全库实测 12 例）。
 */
import { describe, expect, it } from "vitest";
import { buildGrammarReviewTask, type GrammarReviewCard } from "../../services/grammarReviewService";
import type { Card } from "../../types";

const mk = (front: string, id = "c1", note = ""): GrammarReviewCard =>
  ({
    card: {
      id,
      type: "sentence",
      front,
      back: "",
      note,
      tags: ["语法"],
      status: "review",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
    } as Card,
    schedule: {
      cardId: id,
      easeFactor: 2.5,
      intervalDays: 3,
      reviewCount: 0, // 0 → cloze
      lapseCount: 0,
      nextReviewAt: "2024-01-01T00:00:00.000Z"
    }
  }) as GrammarReviewCard;

describe("RV5 挖空题面质量", () => {
  it("答案词不能在题面里还看得见（同句重复词不挖）", () => {
    const task = buildGrammarReviewTask(mk("I was late because the bus was late."));
    expect(task.mode).toBe("cloze");
    const visible = task.promptText.replace("____", "");
    expect(
      visible.toLowerCase().includes(` ${task.answer.toLowerCase()}`) ||
        visible.toLowerCase().includes(`${task.answer.toLowerCase()} `),
      `题面不得再出现答案词「${task.answer}」：${task.promptText}`
    ).toBe(false);
  });

  it("候选词里有唯一出现的词时，优先挖那个唯一词", () => {
    const task = buildGrammarReviewTask(mk("She goes to the park every day."));
    const occurrences = task.sentence.split(/\s+/).filter(
      (token) => token.toLowerCase().replace(/[.,!?;:]/g, "") === task.answer.toLowerCase()
    ).length;
    expect(occurrences, `挖的词应唯一出现：${task.answer}`).toBe(1);
  });

  it("单词卡：题面不能塌成光秃秃的 ____（要给出锚点）", () => {
    const task = buildGrammarReviewTask(mk("am", "single", "第 1 课核心句"));
    expect(task.mode).toBe("cloze");
    expect(task.promptText.trim(), "题面不能只有空位").not.toBe("____");
    expect(task.promptText).toContain("第 1 课核心句");
    // 仍然保留可选项，判分口径不变
    expect(task.options).toContain(task.answer);
  });

  it("单词卡没有 note 时也给一句引导，而不是光秃秃的空位", () => {
    const task = buildGrammarReviewTask(mk("is", "single2"));
    expect(task.promptText.trim()).not.toBe("____");
    expect(task.promptText.length).toBeGreaterThan(4);
  });
});
