// @vitest-environment node
/**
 * RV6 · 改错题必须能「点中真错处」（2026-09-21 修）
 *
 * 标注词在句中出现多次时，「第一个同形词」往往**不是**真正的错处：
 *   L66 `It is too heavy to carry it.` 标注 `it.` —— 真错处是句尾多余的 it，
 *   取首个却指向句首的 It，用户点对反而被判错。
 *   L170 `She can both sing and dance both.` 同款（真错处是句尾 both）。
 *
 * 修法：`locateMarkedTokens` 拿正确句做逐位消歧；「多出来的词」（正确句在同一位置
 * 没有对应词）也算错处——只比词形会漏掉这类增删型错误。
 */
import { describe, expect, it } from "vitest";
import { grammarLessons } from "../../data/grammarLessons";
import {
  buildBoostItems,
  boostSourceRef,
  locateMarkedTokens,
  judgeBoostItem,
  type BoostItem,
  type BoostTier
} from "../../services/grammarBoostService";

const clean = (token: string): string => token.replace(/[.,!?;:]$/g, "").toLowerCase();

interface Contrast {
  wrong: string;
  correct: string;
  wrongMark?: string | null;
  bothRight?: boolean;
}

/** 逐位 diff：与正确句不同的下标即真实错处（长度不齐时，多出来的位也算）。 */
const trueErrorIndexes = (wrong: string, correct: string): number[] => {
  const w = wrong.split(/\s+/).filter(Boolean);
  const c = correct.split(/\s+/).filter(Boolean);
  const hits: number[] = [];
  for (let index = 0; index < Math.max(w.length, c.length); index += 1) {
    if (clean(w[index] ?? "") !== clean(c[index] ?? "")) hits.push(index);
  }
  return hits;
};

/**
 * 取「由某条对比卡派生」的改错题。
 * 档 1 每题只从池里取 4 道，歧义句未必被取到，所以把同池的 guided 题标为已见，
 * 让对比卡派生的那道优先露出来。
 */
const spotContrastItemFor = (lessonId: string, wrongSentence: string): BoostItem => {
  const guidedRef = boostSourceRef(lessonId, "guided", 0, 1);
  for (const tier of [1, 2, 3] as BoostTier[]) {
    const found = buildBoostItems(lessonId, tier, { seen: new Set([guidedRef]) }).find(
      (item) => item.kind === "spot" && (item.spotTokens ?? []).join(" ") === wrongSentence
    );
    if (found) return found;
  }
  throw new Error(`${lessonId} 未能取到对比卡「${wrongSentence}」派生的改错题`);
};

const acceptedIndexes = (item: BoostItem): number[] =>
  item.spotWrongIndexes?.length
    ? item.spotWrongIndexes
    : item.spotWrongIndex !== undefined
      ? [item.spotWrongIndex]
      : [];

describe("RV6 改错题的点中判定", () => {
  it("全库对比卡：标注词重复出现时，真错处在判对集合里，且集合不含非错处", () => {
    const problems: string[] = [];
    for (const lesson of grammarLessons as unknown as Array<{
      id: string;
      number: number;
      contrast?: Contrast[];
    }>) {
      for (const contrast of lesson.contrast ?? []) {
        if (contrast.bothRight || !contrast.wrongMark?.trim()) continue;
        const wrongTokens = contrast.wrong.split(/\s+/).filter(Boolean);
        const occurrences = wrongTokens.filter((token) => clean(token) === clean(contrast.wrongMark!)).length;
        if (occurrences < 2) continue; // 只在「有歧义」的题上验证消歧

        let item: BoostItem;
        try {
          item = spotContrastItemFor(lesson.id, wrongTokens.join(" "));
        } catch {
          continue; // 该对比组未进入任何档位的题池，不影响本题结论
        }
        const truth = trueErrorIndexes(contrast.wrong, contrast.correct);
        const accepted = acceptedIndexes(item);

        if (!truth.some((index) => accepted.includes(index))) {
          problems.push(
            `${lesson.id}(L${lesson.number}) 标注「${contrast.wrongMark}」出现 ${occurrences} 次；` +
              `真错处=[${truth.join(",")}] 判对集合=[${accepted.join(",")}] | wrong="${contrast.wrong}"`
          );
        }
        const falseAccepts = accepted.filter((index) => !truth.includes(index));
        if (falseAccepts.length > 0) {
          problems.push(
            `${lesson.id}(L${lesson.number}) 判对集合含非错处 [${falseAccepts.join(",")}]；` +
              `真错处=[${truth.join(",")}] | wrong="${contrast.wrong}"`
          );
        }
      }
    }
    expect(problems, `以下题目的点中判定与真实错处不符：\n${problems.join("\n")}`).toEqual([]);
  });

  /**
   * 具名复核：直接测「标注定位」这一层。
   *
   * 不经过档位取样——档 1 每题只从池里取 4 道，这两句未必被取到，
   * 那样这条回归就测不到东西（库级扫描已经覆盖了真实出题路径）。
   */
  /**
   * 具名复核：直测「标注定位」这一层。
   *
   * 为什么不用 `buildBoostItems` 取证：档 1 每题只从池里取 4 道，
   * 这两句歧义句未必被取到（实测就取不到），那样这条回归等于没测。
   * 定位结果直接决定 spotWrongIndex(es)，所以直测这一层是等价的。
   */
  it("L66：定位到句尾多余的 it.，不含句首正常的 It", () => {
    const tokens = "It is too heavy to carry it.".split(" ");
    const located = locateMarkedTokens(tokens, "it.", "It is too heavy to carry.");
    expect(located, "应定位句尾的 it.（下标 6）").toEqual([6]);
  });

  it("L170：定位到句尾多余的 both，不含句中正常的 both", () => {
    const tokens = "She can both sing and dance both.".split(" ");
    const located = locateMarkedTokens(tokens, "both.", "She can both sing and dance.");
    expect(located, "应定位句尾的 both.（下标 6）").toEqual([6]);
  });

  it("替换型歧义同样消歧（大写不应被误判为不同）", () => {
    const tokens = "While I was reading, he was sleeping.".split(" ");
    const located = locateMarkedTokens(tokens, "was", "While I am reading, he was sleeping.");
    expect(located, "应指向与正确句不同的那一处（下标 2）").toEqual([2]);
  });

  it("没有正确句可消歧时保持原行为（只认首个同形词，不放松判题）", () => {
    const tokens = "It is too heavy to carry it.".split(" ");
    expect(locateMarkedTokens(tokens, "it.")).toEqual([0]);
  });
});
