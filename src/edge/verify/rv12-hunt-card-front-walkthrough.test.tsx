// @vitest-environment jsdom
/**
 * 批五十三走查（走仓库自身的 jsdom 渲染路径，与全部 edge 套件同一入口）
 *
 * ① 上一批登记的「无标注对比卡」新文案「整句都要看」渲染确认；
 * ② 本批修的短语型卡面（粘连病句）在真实建卡路径上的样子。
 */
import { describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import { addHuntGapSentences, correctedSentenceOf } from "../../services/huntService";
import { makeAppData, seedAppData } from "./fixtures";
import type { AppData } from "../../types";

describe("批五十三走查", () => {
  it("① 无标注对比卡揭示后显示「整句都要看」而非「缺了一块」", () => {
    resetStorage();
    const lesson = grammarLessons.find((l) => l.id === "lesson-01-am")!;
    const blank = (lesson.contrast ?? []).filter((item) => !item.bothRight && !item.wrongMark);
    expect(blank.length, "L1 应有无标注对比卡").toBeGreaterThan(0);
    console.log(`【走查①】L1 无标注卡 ${blank.length} 张，样本: "${blank[0].wrong}"`);

    seedAppData(makeAppData({}) as AppData);
    const page = mountPage(<GrammarLessonPage />, `/grammar/lesson/${lesson.id}`, "/grammar/lesson/:lessonId");
    page.clickMatch(/去讲解里揭晓/);              // 跳过 pretest
    page.clickMatch(/下一步：搭装与对错/);          // 进「搭装与对错」步（对比卡在此渲染）
    // 这一屏渲染 contrast[0..1]，[1] 正是无标注那张（wrongMark = null）
    const before = page.text();
    console.log(`  揭示前含「整句都要看」: ${before.includes("整句都要看")}`);
    expect(before, "揭示前不应显示该标签").not.toContain("整句都要看");

    // 点第一句 → 揭示态，诊断标签出现
    page.clickMatch(/^AI Xiaomei\.$/);
    const after = page.text();
    const hasNew = after.includes("整句都要看");
    const hasOld = after.includes("缺了一块");
    console.log(`  揭示后：含「整句都要看」= ${hasNew}，含旧文案「缺了一块」= ${hasOld}`);
    expect(hasNew, "应显示新文案").toBe(true);
    expect(hasOld, "旧文案不应再出现").toBe(false);
    page.unmount();
  });

  it("② 短语型卡面不再粘连，且建卡路径给出的正是这句", () => {
    const c = huntCases.find((x) => x.id === "hunt-word-order")!;
    const front = correctedSentenceOf(c);
    console.log(`【走查②】${c.id}`);
    console.log(`  原文: ${c.tokens.join(" ")}`);
    console.log(`  卡面: ${front}`);
    expect(front).not.toContain("a dress a beautiful dress");
    expect(front).toContain("a beautiful dress");
    expect(front).toContain("an old house");

    let data = makeAppData({ cards: [], schedules: [], sentenceDetails: [] }) as AppData;
    data = addHuntGapSentences(data, c, c.errors.map((e) => e.tokenIndex)).data;
    console.log(`  建卡 ${data.cards.length} 张，正面: ${data.cards[0].front}`);
    for (const card of data.cards) {
      expect(card.front).toBe(front);
      expect(card.front).not.toMatch(/dress a beautiful dress/);
    }
  });
});
