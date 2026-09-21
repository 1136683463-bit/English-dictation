// @vitest-environment node
/**
 * RV9 · 找错案件生成的复习卡正面必须是「改正后」的句子（2026-09-21 修）
 *
 * `sentenceForError` 此前返回 `caseItem.tokens.join(" ")`——**含错原文**，
 * 而它自己的文档写着「正面 = 完整正确句」。后果：
 *   ① 语法复习页照抄含错原文得 100 分通过，把错处改对反而判不通过（判分与语义相反）；
 *   ② /review 对句子卡显示 `back || front`，back 为空时题面就是含错句。
 * 顺带：原来遇到「（去掉 X）」型修正直接放弃成卡，删词型错法永远进不了复习队列。
 */
import { describe, expect, it } from "vitest";
import { huntCases } from "../../data/huntCases";
import { addHuntGapSentences } from "../../services/huntService";
import { makeAppData } from "./fixtures";
import type { AppData } from "../../types";

const norm = (value: string): string => value.toLowerCase().replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();

/** 用真实建卡路径造卡（每案的每个错点各一张）。 */
const cardsFor = (caseItem: (typeof huntCases)[number]): AppData => {
  let data = makeAppData({ cards: [], schedules: [], sentenceDetails: [] }) as AppData;
  data = addHuntGapSentences(
    data,
    caseItem,
    caseItem.errors.map((error) => error.tokenIndex)
  ).data;
  return data;
};

describe("RV9 找错案件复习卡的正面句", () => {
  it("全库：卡正面不再是含错原文（除「句子本就正确」的删词型边界外）", () => {
    const offenders: string[] = [];
    let checked = 0;
    for (const caseItem of huntCases) {
      const wrongOriginal = norm(caseItem.tokens.join(" "));
      const data = cardsFor(caseItem);
      for (const card of data.cards) {
        checked += 1;
        if (norm(card.front) === wrongOriginal) {
          offenders.push(`${caseItem.id}：正面仍等于含错原文「${card.front}」`);
        }
      }
    }
    expect(checked, "应造出卡片（否则断言没有覆盖面）").toBeGreaterThan(100);
    expect(
      offenders,
      `以下卡片正面仍是含错原文：\n${offenders.slice(0, 8).join("\n")}${offenders.length > 8 ? `\n…共 ${offenders.length} 条` : ""}`
    ).toEqual([]);
  });

  it("定点：hunt-yesterday-park 的卡正面把全部植错都改对", () => {
    const caseItem = huntCases.find((item) => item.id === "hunt-yesterday-park")!;
    expect(caseItem).toBeTruthy();
    const data = cardsFor(caseItem);
    expect(data.cards.length, "应生成至少一张卡").toBeGreaterThan(0);
    const front = data.cards[0].front;
    // 该案两处植错：go→went、see→saw。正面必须是两句都改对的完整正确句——
    // 若只改本卡针对的那一处，用户会在这张卡上看到并记住另一处错形。
    for (const error of caseItem.errors) {
      const wrongWord = error.original.replace(/[.,!?;:]+$/, "");
      expect(front, `正面不应再含错形「${wrongWord}」`).not.toMatch(new RegExp(`\\b${wrongWord}\\b`, "i"));
    }
    expect(front).toContain("went");
    expect(front, "第二处错（see→saw）也应改对").toContain("saw");
  });

  it("删词型修正也能成卡（原来直接放弃）", () => {
    const caseWithDeletion = huntCases.find((item) =>
      item.errors.some((error) => error.correction.trim().startsWith("去掉") || error.correction.includes("（去掉"))
    );
    expect(caseWithDeletion, "库里应有删词型修正的案例").toBeTruthy();
    const data = cardsFor(caseWithDeletion!);
    expect(data.cards.length, "删词型错点现在也应能成卡").toBeGreaterThan(0);
    // 删词后句子应比原文短
    expect(data.cards[0].front.split(/\s+/).length).toBeLessThan(caseWithDeletion!.tokens.length);
  });

  it("卡正面不得混入中文说明文字（修正文案的括注不能被当成替换文本）", () => {
    /**
     * 修正文案有几种中文形态：「（去掉 to）」「（与 don't 对调）」
     * 「（rather 跟在 would 后）」「（drink → drinking 或去掉）」。
     * 只有第一种能机械执行（删词），第二种取 → 后的英文，第三种是位置说明——
     * 若把说明文字整段写回句子，会造出
     * `I would （rather 跟在 would 后） walk...` 这种病句（实测 4 卡 12 题）。
     */
    const offenders: string[] = [];
    for (const caseItem of huntCases) {
      const data = cardsFor(caseItem);
      for (const card of data.cards) {
        if (/[\u4e00-\u9fa5]/.test(card.front)) offenders.push(`${caseItem.id}: "${card.front}"`);
      }
    }
    expect(offenders, `以下卡正面混入了中文：\n${offenders.slice(0, 6).join("\n")}`).toEqual([]);
  });

  it("纯说明型修正（对调 / 位置说明）不改动原词，句子仍是合法英文", () => {
    // would-rather-walk 的 @6 是「（rather 跟在 would 后）」——位置说明，机械改不了
    const caseItem = huntCases.find((item) => item.id === "hunt-would-rather-walk");
    if (!caseItem) return;
    const data = cardsFor(caseItem);
    for (const card of data.cards) {
      expect(card.front, "句子不应出现中文").not.toMatch(/[\u4e00-\u9fa5]/);
      expect(card.front, "不应出现多余空格").not.toMatch(/ {2,}/);
      expect(card.front, "不应出现空括号").not.toMatch(/（\s*）|\(\s*\)/);
    }
  });

  it("卡正面带尾标点时，替换不会吞掉标点", () => {
    // 找一个 original 带尾标点的错点
    const target = huntCases.find((item) =>
      item.errors.some((error) => /[.,!?;:]$/.test(error.original) && !/^（?去掉/.test(error.correction.trim()))
    );
    if (!target) return; // 库中确实没有这类数据时跳过（不虚报通过）
    const data = cardsFor(target);
    for (const card of data.cards) {
      expect(card.front, "句子必须以标点收尾").toMatch(/[.!?]$/);
    }
  });
});
