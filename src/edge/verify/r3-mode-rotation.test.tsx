// @vitest-environment jsdom
/**
 * R3 · 题型轮换
 *
 * 设计声明（grammarReviewService.ts:9-11, 29-30, 306-323）：
 * - 「题型按 reviewCount 轮换（填空 / 重组），同一张卡每次复习形态不同，防背答案」；
 * - 「reviewCount≥2 的语法卡第 3 次（含）以后出现转自由输出」（FREE_TYPE_MIN_REVIEW_COUNT = 2）。
 *
 * 验证点：同一张卡 reviewCount 递增时题型是否真的变化；free_type 阈值是否正确；
 * 会话内相邻卡是否同型（diversifyReviewModes 的效果）；flag 回滚开关是否有效。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import {
  buildGrammarReviewSession,
  buildGrammarReviewTask,
  diversifyReviewModes,
  FREE_TYPE_MIN_REVIEW_COUNT,
  isFreeTypeReviewEnabled,
  judgeGrammarCloze,
  type GrammarReviewCard,
  type GrammarReviewMode
} from "../../services/grammarReviewService";
import { cardsToData, makeAppData, makeSentenceCard, PAST_ISO, seedAppData } from "./fixtures";
import { answerReviewStep, planReviewSession, type ReviewSessionPlan } from "./drive";

const FREE_TYPE_FLAG_KEY = "grammar-review-free-type";

const cardAt = (reviewCount: number): GrammarReviewCard => {
  const fixture = makeSentenceCard({
    id: `card-rc-${reviewCount}`,
    sentence: "I am drawing a picture.",
    sourceId: "lesson:lesson-13-now",
    schedule: { reviewCount, nextReviewAt: PAST_ISO }
  });
  return { card: fixture.card, schedule: fixture.schedule! };
};

const modeAt = (reviewCount: number): GrammarReviewMode => buildGrammarReviewTask(cardAt(reviewCount)).mode;

describe("R3-a reviewCount → 题型映射", () => {
  beforeEach(() => resetStorage());

  it("阈值常量与设计一致：FREE_TYPE_MIN_REVIEW_COUNT = 2", () => {
    expect(FREE_TYPE_MIN_REVIEW_COUNT).toBe(2);
  });

  it("reviewCount 0/1 → 填空、重组；≥2 → 自由输出（第 3 次起转自由输出）", () => {
    expect(modeAt(0)).toBe("cloze");
    expect(modeAt(1)).toBe("rebuild");
    expect(modeAt(2)).toBe("free_type");
    expect(modeAt(3)).toBe("free_type");
    expect(modeAt(5)).toBe("free_type");
  });

  it("同一张卡连续 4 次复习，每次形态都不同或有推进：cloze → rebuild → free_type → free_type", () => {
    const sequence = [0, 1, 2, 3].map(modeAt);
    expect(sequence).toEqual(["cloze", "rebuild", "free_type", "free_type"]);
    // 「每次形态不同」在前两次成立；第 3 次起稳定在 free_type（符合设计）
    expect(sequence[0]).not.toBe(sequence[1]);
  });

  it("free_type 的任务带来源锚点：note 非空时用 note，为空时给词数提示", () => {
    const withNote = buildGrammarReviewTask(
      // note 有值
      { card: { ...cardAt(2).card, note: "语法课核心句：我正在画一幅画" }, schedule: cardAt(2).schedule },
      []
    );
    expect(withNote.mode).toBe("free_type");
    expect(withNote.promptText).toContain("语法课核心句");
    expect(withNote.answer).toBe("");

    const withoutNote = buildGrammarReviewTask(cardAt(2), []);
    expect(withoutNote.promptText).toContain("5 个词");
  });

  it("rebuild 的词块是原句词块的打乱（同集合、且不等于原序）", () => {
    const task = buildGrammarReviewTask(cardAt(1));
    const original = "I am drawing a picture.".split(/\s+/);
    expect([...task.scrambled].sort()).toEqual([...original].sort());
    expect(task.scrambled.join(" ")).not.toBe(original.join(" "));
  });

  /**
   * 文档化发现（报告 R3-①）：开启 free_type（默认）后 cloze **只可能在 reviewCount === 0** 出现，
   * 而挖空位置 = indexes[reviewCount % indexes.length] = indexes[0 % n] = indexes[0]，
   * 即**永远挖同一个位置**（本句的 "drawing"）——「同一张卡每次复习形态不同」对填空形态不成立。
   * 只有关掉 flag（回到 cloze/rebuild 两形态）时位置才有轮换。
   */
  it("cloze 挖空位置随 card.id 分散（2026-09-20 已修：不再恒挖 indexes[0]）", () => {
    const zero = buildGrammarReviewTask(cardAt(0));
    expect(zero.mode).toBe("cloze");
    // 挖空位置由 card.id + reviewCount 共同决定，不再是固定的 indexes[0]
    expect(zero.promptText).toContain("____");

    // 造多张同句但 id 不同的卡：挖空位置应出现分化（此前全部相同）
    const longCard: GrammarReviewCard = {
      card: { ...cardAt(0).card, front: "She is reading a book in the garden." },
      schedule: cardAt(0).schedule
    };
    const positions = new Set<string>();
    for (let i = 0; i < 8; i += 1) {
      const card: GrammarReviewCard = {
        card: { ...longCard.card, id: `card-spread-${i}` },
        schedule: longCard.schedule
      };
      positions.add(buildGrammarReviewTask(card).promptText);
    }
    expect(positions.size, "不同卡的挖空位置应有分化，而非全部挖同一处").toBeGreaterThan(1);

    // 关闭 flag：奇数 rc 回到 rebuild；偶数 rc 回到 cloze，且挖空位置随 rc 变化
    window.localStorage.setItem(FREE_TYPE_FLAG_KEY, "off");
    expect(isFreeTypeReviewEnabled()).toBe(false);
    const two = buildGrammarReviewTask({ ...longCard, schedule: { ...longCard.schedule, reviewCount: 2 } });
    const four = buildGrammarReviewTask({ ...longCard, schedule: { ...longCard.schedule, reviewCount: 4 } });
    expect(two.mode).toBe("cloze");
    expect(four.mode).toBe("cloze");
    // 种子含 card.id + reviewCount → 同一张卡在不同 rc 下挖空位置不同
    expect(two.promptText).not.toBe(four.promptText);
    window.localStorage.removeItem(FREE_TYPE_FLAG_KEY);
  });

  /**
   * 注意（2026-09-20）：reviewCount 全为 0 时整场都是 cloze（题型层），
   * 但挖空位置已随 card.id 分散（见上一条测试），不再是「每张都挖同一处」。
   */
  it("全部 reviewCount=0 的会话：题型同为 cloze（但挖空位置已分散）", () => {
    const data = makeAppData(
      cardsToData(
        Array.from({ length: 10 }, (_, index) =>
          makeSentenceCard({
            id: `c-${index}`,
            sentence: `Sentence number ${index} is here.`,
            sourceId: `lesson:l-${index % 3}`,
            schedule: { reviewCount: 0, nextReviewAt: PAST_ISO }
          })
        )
      )
    );
    const session = diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails);
    expect(session.length).toBe(10);
    expect(session.every((item) => buildGrammarReviewTask(item).mode === "cloze")).toBe(true);
  });

  it("flag 关闭：第 3 次起不转自由输出，回落到 cloze/rebuild 两形态", () => {
    window.localStorage.setItem(FREE_TYPE_FLAG_KEY, "off");
    expect([0, 1, 2, 3].map(modeAt)).toEqual(["cloze", "rebuild", "cloze", "rebuild"]);
    window.localStorage.removeItem(FREE_TYPE_FLAG_KEY);
  });

  it("default 情况（无 flag 键）默认为开", () => {
    window.localStorage.removeItem(FREE_TYPE_FLAG_KEY);
    expect(isFreeTypeReviewEnabled()).toBe(true);
  });
});

describe("R3-b 会话内同型打散", () => {
  beforeEach(() => resetStorage());

  it("diversifyReviewModes：相邻两张不同型（可行时）", () => {
    // 10 张同型卡（全 reviewCount=0 → cloze）打散后仍全同型：无解时保持原序，不报错
    const allCloze = Array.from({ length: 6 }, (_, index) => ({
      ...cardAt(0),
      card: { ...cardAt(0).card, id: `card-same-${index}` }
    }));
    const same = diversifyReviewModes(allCloze);
    expect(same.length).toBe(6);
    expect(same.map((item) => item.card.id)).toEqual(allCloze.map((item) => item.card.id));
  });

  it("混合 reviewCount 的会话：相邻不同型（有解时必然打散）", () => {
    const mixed = [...Array.from({ length: 4 }, (_, i) => cardAt(0)).map((item, i) => ({ ...item, card: { ...item.card, id: `c0-${i}` } })),
      ...Array.from({ length: 4 }, (_, i) => cardAt(1)).map((item, i) => ({ ...item, card: { ...item.card, id: `c1-${i}` } }))];
    const modes = diversifyReviewModes(mixed).map((item) => buildGrammarReviewTask(item).mode);
    for (let index = 1; index < modes.length; index += 1) {
      expect(modes[index]).not.toBe(modes[index - 1]);
    }
  });

  it("会话长度 ≤2 时原样返回（不做无意义重排）", () => {
    const two = [cardAt(0), cardAt(0)];
    expect(diversifyReviewModes(two)).toBe(two);
  });
});

describe("R3-c UI 呈现与题型一致", () => {
  beforeEach(() => resetStorage());

  it("页面上出现的题型提示与 planReviewSession 推出的题型逐步一致", () => {
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({ id: "c0", sentence: "I am drawing a picture.", schedule: { reviewCount: 0, nextReviewAt: PAST_ISO } }),
        makeSentenceCard({ id: "c1", sentence: "She is a nurse.", schedule: { reviewCount: 1, nextReviewAt: PAST_ISO } }),
        makeSentenceCard({ id: "c2", sentence: "They are playing football.", schedule: { reviewCount: 2, nextReviewAt: PAST_ISO } })
      ])
    );
    const plan = planReviewSession(data);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    const label = (step: ReviewSessionPlan["steps"][number]) =>
      step.mode === "cloze" ? "选词补全句子" : step.mode === "rebuild" ? "把句子拼回去" : "自己把句子写出来";

    for (const step of plan.steps) {
      expect(page.has(label(step))).toBe(true);
      // 三张卡的 reviewCount 分别是 0/1/2 → 三形态各出现一次
      const result = answerReviewStep(page, step);
      expect(result).toBe("passed");
      const next = page.buttons().find((text) => text === "下一张" || text === "完成复习");
      if (next) page.click(next);
    }
    expect(page.has("复习完成")).toBe(true);
    page.unmount();
  });

  it("UI 上 free_type 给的是「自己把句子写出来」+ 输入框，且答案被接受", () => {
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({ id: "cf", sentence: "I am drawing a picture.", schedule: { reviewCount: 2, nextReviewAt: PAST_ISO } })
      ])
    );
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.has("自己把句子写出来")).toBe(true);
    expect(page.container.querySelector("textarea")).not.toBeNull();
    answerReviewStep(page, { mode: "free_type", sentence: "I am drawing a picture." });
    expect(page.has("对了") || page.has("下一张") || page.has("完成复习")).toBe(true);
    expect(page.has("复习完成") || page.buttons().includes("完成复习")).toBe(true);
    void data;
    page.unmount();
  });

  it("填空判分：正确答案通过，错误答案被识别（大小写宽容）", () => {
    const task = buildGrammarReviewTask(cardAt(0));
    expect(task.mode).toBe("cloze");
    expect(judgeGrammarCloze(task.answer, task.answer)).toBe(true);
    expect(judgeGrammarCloze(task.answer.toUpperCase(), task.answer)).toBe(true);
    expect(judgeGrammarCloze("definitely-wrong", task.answer)).toBe(false);
    expect(task.options).toContain(task.answer);
    expect(task.options.length).toBeGreaterThanOrEqual(2);
  });
});
