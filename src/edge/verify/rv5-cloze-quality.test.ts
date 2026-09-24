// @vitest-environment node
/**
 * RV5 · 挖空题的题面必须真的能作答（2026-09-21 修，两处）
 *
 * ① 答案词在题面里还看得见：`I was late because the bus was late.` 挖掉第一个 late，
 *    第二个 late 仍在题面上——用户直接照抄。
 * ② 单词卡的题面塌成光秃秃的 `____`：front="am" 这类卡挖空后没有任何上下文，
 *    用户无从判断要填什么（全库实测 12 例）。
 *
 * 2026-09-24 追加：② 的修复一度被 downstream 的「单词卡一律转 free_type」守卫遮蔽成死代码。
 * 该守卫的理由（cloze 会只剩 1 个选项）对**功能词**不成立——实测 front="am" 的选项是
 * am/is/are 三条。守卫已收窄为：单词卡一律不走 rebuild；cloze 选项 ≥2 就用 cloze，否则 free_type。
 * 本文件后三条用例锁死这个分流，防止再次被遮蔽。
 */
import { describe, expect, it } from "vitest";
import { buildGrammarReviewTask, type GrammarReviewCard } from "../../services/grammarReviewService";
import type { Card } from "../../types";

const mk = (front: string, id = "c1", note = "", reviewCount = 0): GrammarReviewCard =>
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
      reviewCount, // 0 → cloze；1 → rebuild
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

  /**
   * 以下三条锁死 2026-09-24 收窄的分流规则（见文件头）。
   * 判据一句话：**单词卡一律不走 rebuild；cloze 选项 ≥2 就用 cloze，否则 free_type。**
   */
  it("单词卡永不走 rebuild（reviewCount=1 也是），因为 1 个词块＝点一下就过", () => {
    for (const word of ["am", "is", "the", "went"]) {
      const task = buildGrammarReviewTask(mk(word, `rb-${word}`, "第 1 课核心句", 1));
      expect(task.mode, `单词卡「${word}」不得走 rebuild`).not.toBe("rebuild");
    }
  });

  it("cloze 选项 ≥2 的功能词走 cloze：题面带锚点、选项含答案、且不是单选项", () => {
    for (const word of ["am", "is", "are", "the", "my"]) {
      const task = buildGrammarReviewTask(mk(word, `fn-${word}`, "第 1 课核心句"));
      expect(task.mode, `功能词「${word}」应走 cloze`).toBe("cloze");
      expect(task.options.length, `「${word}」不得塌成单选项`).toBeGreaterThanOrEqual(2);
      expect(task.options).toContain(task.answer);
      expect(task.promptText).toContain("第 1 课核心句");
      expect(task.promptText.trim(), "题面不能只有空位").not.toBe("____");
    }
  });

  /**
   * 单词卡的分流**不变量**（2026-09-25 由「按词逐个写死」改为「只锁不变量」）。
   *
   * 为什么改：原先这里写死「went / dogs / tomorrow / quickly 必须退 free_type」，
   * 依据是 `buildClozeOptions` 对它们凑不出干扰项。但干扰项来源会随内容侧演进
   * （2026-09-24 起新增了「课程词汇池」这一类），写死具体词的期望会**随别人改池子而假红**。
   * 真正该守的是规则本身：
   *   ① 单词卡永不 rebuild（1 个词块＝点一下就过）；
   *   ② 若出 cloze，选项必须 ≥2 且含答案；
   *   ③ 若退 free_type，题面必须带来源锚点、且不得泄漏答案。
   * 这三条对任何干扰项来源都成立。
   */
  it("单词卡分流不变量：永不 rebuild；cloze 必须 ≥2 且含答案；free_type 必须带锚点不泄漏", () => {
    const words = ["am", "is", "are", "the", "my", "to", "went", "dogs", "tomorrow", "quickly"];
    const freeTypeSeen: string[] = [];
    for (const word of words) {
      const task = buildGrammarReviewTask(mk(word, `inv-${word}`, "第 1 课核心句"));
      expect(task.mode, `单词卡「${word}」不得走 rebuild`).not.toBe("rebuild");
      expect(task.promptText.trim(), `「${word}」的题面不能是空`).not.toBe("");
      if (task.mode === "cloze") {
        expect(task.options.length, `「${word}」的 cloze 选项不足 2 个`).toBeGreaterThanOrEqual(2);
        expect(task.options, `「${word}」的 cloze 选项里必须含答案`).toContain(task.answer);
      } else {
        freeTypeSeen.push(word);
        expect(task.sentence, `「${word}」退 free_type 时必须留下要产出的句子`).toBe(word);
        expect(task.promptText, `「${word}」的 free_type 题面必须带来源锚点`).toContain("第 1 课核心句");
        expect(
          task.promptText.toLowerCase().includes(word.toLowerCase()),
          `「${word}」的 free_type 题面不得泄漏答案`
        ).toBe(false);
      }
    }
    // 记录当前实际走 free_type 的词（不写死期望：干扰项池变化时这条只是信息，不是判据）
    expect(Array.isArray(freeTypeSeen), "free_type 分支当前命中：" + freeTypeSeen.join("/")).toBe(true);
  });
});
