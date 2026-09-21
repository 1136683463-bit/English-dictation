import { describe, expect, it } from "vitest";
import { compareLetters, compareText, diffScore } from "./diffService";

describe("diffService", () => {
  it("treats adjacent swapped letters as substitutions", () => {
    expect(compareLetters("predict", "perdict").map((token) => token.status)).toEqual([
      "match",
      "substitution",
      "substitution",
      "match",
      "match",
      "match",
      "match"
    ]);
  });
});

/**
 * 缩写与全称是同一句话的两种正确写法。
 *
 * 起因（2026-09-19 用户反馈）：忆段答 "It is windy today." 被判错——判分把 it's 当一个词、
 * it is 当两个词，逐词对不上只得 50 分，低于 70 通过线。而课程自己的数据说两句都对
 * （L88 对比卡 bothRight、"It is cold today. —— 长版（也对）"）。
 */
describe("diffService · 缩写与全称等价", () => {
  const score = (expected: string, answer: string) => diffScore(compareText(expected, answer, false));

  it("用户报的那一句：It is 与 It's 互判通过", () => {
    expect(score("It's windy today.", "It is windy today.")).toBe(100);
    expect(score("It is windy today.", "It's windy today.")).toBe(100);
    // 逐词对照全部标 match，不该出现 substitution/extra 让用户以为自己写错了
    expect(compareText("It's windy today.", "It is windy today.", false).map((token) => token.status)).toEqual([
      "match",
      "match",
      "match",
      "match"
    ]);
  });

  it("各课真实答句的长短版都能通过各自的通过线（忆段 70 / 产出段 90）", () => {
    const pairs: Array<[string, string]> = [
      ["It's cold today.", "It is cold today."], // L87 考点课
      ["Let's go to the park.", "Let us go to the park."], // L75
      ["I don't have a pen.", "I do not have a pen."], // L03
      ["I can't swim.", "I can not swim."], // L14
      ["I can't swim.", "I cannot swim."], // can not / cannot 两种全称写法
      ["He doesn't like coffee.", "He does not like coffee."], // L25
      ["I won't go out.", "I will not go out."], // L48
      ["There aren't any apples.", "There are not any apples."], // L30
      ["I'm a student.", "I am a student."],
      ["We're classmates.", "We are classmates."],
      ["I haven't seen it.", "I have not seen it."],
      ["She shouldn't worry.", "She should not worry."]
    ];
    for (const [short, long] of pairs) {
      expect(score(short, long), `${short} ↔ ${long}`).toBe(100);
      expect(score(long, short), `${long} ↔ ${short}`).toBe(100);
    }
  });

  it("一个 token 有多个读法时都算对：he's = he is / he has", () => {
    expect(score("He's a teacher.", "He is a teacher.")).toBe(100);
    expect(score("He's finished.", "He has finished.")).toBe(100);
  });

  it("整句写对时才判等价，句中一处不同仍是错", () => {
    expect(score("It's windy today.", "It is windy tomorrow.")).toBeLessThan(100);
    expect(score("It's windy today.", "It is cold today.")).toBeLessThan(90);
  });

  it("严格标点模式下等价依然成立（开严格标点不该把两种正确写法判成不同）", () => {
    expect(diffScore(compareText("It's cold today.", "It is cold today.", true))).toBe(100);
  });
});

/**
 * 反向保护：撇号是实义差别，不能顺手一起放宽。
 *
 * L87/L88 整课在教「少一小撇就成了『它的』」——判分如果把 Its 也算对，
 * 就等于把这一课的考点判成对，比漏判更糟。L75 的 Let's、L76 的 whose / who's 同理。
 */
describe("diffService · 撇号不能丢（考点保护）", () => {
  const score = (expected: string, answer: string) => diffScore(compareText(expected, answer, false));

  it("Its / Lets / Were 这类去掉撇号后是另一个词的写法，判错", () => {
    const offenders: Array<[string, string]> = [
      ["It's cold today.", "Its cold today."], // its = 它的
      ["Let's go to the park.", "Lets go to the park."], // lets = 让（第三人称单数）
      ["We're classmates.", "Were classmates."], // were = 过去式
      ["Who's book is this?", "Whose book is this?"], // L76：whose = 谁的
      ["I'll go.", "Ill go."], // ill = 生病
      ["We'd better go.", "Wed better go."] // wed = 结婚
    ];
    for (const [expected, answer] of offenders) {
      // 判错的具体表现：该词按 substitution（全错）计，而不是 spelling（半分）——
      // 与「实义词写错」同等待遇，不得比它更宽容。
      const statuses = compareText(expected, answer, false)
        .filter((token) => token.status !== "match")
        .map((token) => token.status);
      expect(statuses, `${answer} 应含 substitution（而非半分的 spelling）`).toContain("substitution");
      expect(statuses, `${answer} 不该按拼写接近给半分`).not.toContain("spelling");
    }
  });

  it("同形词与普通实词写错的待遇一致（不多扣也不放过）", () => {
    const score = (expected: string, answer: string) => diffScore(compareText(expected, answer, false));
    // Its 之于 It's，与 hot 之于 cold：都是「把一个词写成了另一个词」，同分。
    expect(score("It's cold today.", "Its cold today.")).toBe(score("It's cold today.", "It's hot today."));
    // Lets 之于 Let's，与 shop 之于 park：同理。
    expect(score("Let's go to the park.", "Lets go to the park.")).toBe(
      score("Let's go to the park.", "Let's go to the shop.")
    );
  });

  it("点词成句：干扰项 Its 拼不出 It's 的句子", () => {
    // L87/L88 练习题把 Its 作为干扰项放进词块库，选它必须判错。
    const statuses = compareText("It's cold today.", "Its cold today.", false).map((token) => token.status);
    expect(statuses).toContain("substitution");
  });

  it("单纯漏撇（dont）仍按拼写接近给半分——与「用错词」区别对待", () => {
    // 漏撇是常见笔误，不该和 its 这种实义词错误同罪：给半分但不满分。
    const typo = score("I don't have a pen.", "I dont have a pen.");
    expect(typo).toBeGreaterThan(0);
    expect(typo).toBeLessThan(100);
  });
});
