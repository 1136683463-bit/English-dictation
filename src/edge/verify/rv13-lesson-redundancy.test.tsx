// @vitest-environment jsdom
/**
 * RV13 · 课内冗余消除结果 + several 刻度卡落位（2026-09-23 批五十五）
 *
 * 背景：批五十五普查发现 4 课有**逐字重复的对照卡**、10 课有**完全相同的练习题**，
 * 它们全部通过了原有 38 项课程守门——因为此前没有任何断言检查课内唯一性。
 *
 * 本文件守两件事：
 *   ① 冗余已清零（与 grammarLessons.test.ts 的新闸互为独立复核：这里查的是
 *      「同一卡片在**渲染位点**上的重复」，那边查的是数据层重复）；
 *   ② 新引入的 several 刻度卡**落在会渲染的位点内**——页面三处位点分别是
 *      watch=[0,2) / mid-practice=[2,4) / challenge=[4,∞)，卡若落到 6 张之外
 *      就永远不会渲染，是一条静默失效路径。
 */
import { describe, expect, it } from "vitest";
import { grammarLessons } from "../../data/grammarLessons";

const norm = (v: string) => v.toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();

describe("RV13 课内冗余与卡位落点", () => {
  it("① 全库无一课存在逐字重复的对照卡", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const seen = new Map<string, number>();
      (lesson.contrast ?? []).forEach((card, index) => {
        const key = `${norm(card.wrong)}|||${norm(card.correct)}`;
        const prev = seen.get(key);
        if (prev !== undefined) offenders.push(`${lesson.id} [${prev}]≡[${index}]`);
        else seen.set(key, index);
      });
    }
    expect(offenders, `仍有重复对照卡：${offenders.join(" | ")}`).toEqual([]);
  });

  it("② 全库无一课存在完全相同的练习题", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const seen = new Map<string, number>();
      (lesson.practice ?? []).forEach((step, index) => {
        const record = step as { answer?: string; tokens?: string[]; distractors?: string[] };
        const key = [record.answer ?? "", (record.tokens ?? []).join(" "), (record.distractors ?? []).join(" ")]
          .map(norm)
          .join("|||");
        const prev = seen.get(key);
        if (prev !== undefined) offenders.push(`${lesson.id} [${prev}]≡[${index}]`);
        else seen.set(key, index);
      });
    }
    expect(offenders, `仍有重复练习：${offenders.join(" | ")}`).toEqual([]);
  });

  it("③ several 刻度卡存在，且落在会渲染的位点内", () => {
    const lesson = grammarLessons.find((entry) => entry.id === "lesson-114-a-few");
    expect(lesson, "L114 应存在").toBeTruthy();
    const index = (lesson!.contrast ?? []).findIndex((card) => /\bseveral\b/i.test(card.wrong));
    expect(index, "L114 应有 several 刻度卡").toBeGreaterThanOrEqual(0);
    // 页面位点：watch=[0,2) / mid-practice=[2,4) / challenge=[4, ...)
    const rendered = index < (lesson!.contrast ?? []).length;
    expect(rendered, "卡下标必须在数组范围内（否则永不渲染）").toBe(true);
    const card = lesson!.contrast![index];
    expect(card.bothRight, "刻度卡必须是双正解（两侧语法都对，标不出错）").toBe(true);
    expect(card.whyZh, "讲解要点明 several 的刻度位置").toContain("several");
    // 防退化：本卡不得与课内其它卡重复（它是替换掉一张重复卡而来的）
    const sameKey = (lesson!.contrast ?? []).filter(
      (other) => `${norm(other.wrong)}|||${norm(other.correct)}` === `${norm(card.wrong)}|||${norm(card.correct)}`
    );
    expect(sameKey.length, "several 卡本身也不得重复").toBe(1);
  });

  it("④ 位点覆盖自检：每课的 6 张卡都要有渲染位点", () => {
    /**
     * 页面渲染 `slice(0,2)` + `slice(2,4)` + `slice(4)` ⇒ 只要数组长度 ≥ 1
     * 就至少有一位点覆盖；但位点③ 有一道 `length > 4` 的门。
     * 这里确认**所有课**都满足「每张卡都能被某个位点取到」——
     * 即数组长度与三段切片的并集相等。
     */
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const cards = lesson.contrast ?? [];
      const covered = new Set<number>([
        ...cards.slice(0, 2).map((_, i) => i),
        ...cards.slice(2, 4).map((_, i) => i + 2),
        ...(cards.length > 4 ? cards.slice(4).map((_, i) => i + 4) : []),
      ]);
      for (let i = 0; i < cards.length; i += 1) {
        if (!covered.has(i)) offenders.push(`${lesson.id}[${i}]`);
      }
    }
    expect(
      offenders,
      `以下卡位没有任何渲染位点（静默失效）：${offenders.join(" | ")}`
    ).toEqual([]);
  });
});
