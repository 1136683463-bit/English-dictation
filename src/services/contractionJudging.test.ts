import { describe, expect, it } from "vitest";
import { grammarLessons } from "../data/grammarLessons";
import { compareText, diffScore } from "./diffService";
import { checkLessonTokens, describeOutputGap, firstMismatchIndex } from "./lessonService";

/**
 * 缩写判分的全库守护（2026-09-19 用户反馈引发的回归网）。
 *
 * 起因：忆段答 "It is windy today." 被判 50 分（低于 70 线）判错，而课程数据自己写着
 * 「It is cold today. —— 长版（也对）」、「两句都对」（L88 对比卡 bothRight）。
 * 根因是判分把 it's 当一个词、it is 当两个词，逐词对不上。
 *
 * 这个文件横扫全库每一句「要用户自己打字」的题，逐个换成对应的长版/短版，
 * 断言两种写法都能过线——避免以后新增课文再踩同一个坑（当时 47 句产出题、3 句忆题受影响）。
 */

/** 常见缩写 → 全称（覆盖语法课实际出现的全部缩写，语料清点见提交说明）。 */
const TO_LONG: Array<[RegExp, string]> = [
  [/\bit's\b/gi, "it is"],
  [/\bthat's\b/gi, "that is"],
  [/\bthere's\b/gi, "there is"],
  [/\bwhat's\b/gi, "what is"],
  [/\bwho's\b/gi, "who is"],
  [/\bhow's\b/gi, "how is"],
  [/\bi'm\b/gi, "i am"],
  [/\bwe're\b/gi, "we are"],
  [/\byou're\b/gi, "you are"],
  [/\bthey're\b/gi, "they are"],
  [/\bdon't\b/gi, "do not"],
  [/\bdoesn't\b/gi, "does not"],
  [/\bdidn't\b/gi, "did not"],
  [/\bisn't\b/gi, "is not"],
  [/\baren't\b/gi, "are not"],
  [/\bwasn't\b/gi, "was not"],
  [/\bweren't\b/gi, "were not"],
  [/\bhasn't\b/gi, "has not"],
  [/\bhaven't\b/gi, "have not"],
  [/\bcan't\b/gi, "can not"],
  [/\bcouldn't\b/gi, "could not"],
  [/\bshouldn't\b/gi, "should not"],
  [/\bwouldn't\b/gi, "would not"],
  [/\bwon't\b/gi, "will not"],
  [/\blet's\b/gi, "let us"]
];

/** 把一句里所有缩写换成全称写法；没有缩写时原样返回。 */
const toLongForm = (sentence: string): string => {
  let out = sentence;
  for (const [pattern, long] of TO_LONG) out = out.replace(pattern, long);
  return out;
};

const hasContraction = (sentence: string): boolean => /\b[a-z]+'[a-z]+\b/i.test(sentence);

/** 忆段通过线（GrammarLessonPage.RECALL_PASS_SCORE）与产出段通过线（OUTPUT_PASS_SCORE / FREE_TYPE_PASS_SCORE）。 */
const RECALL_PASS = 70;
const OUTPUT_PASS = 90;

describe("缩写判分 · 全库守护", () => {
  const lessonRecalls = grammarLessons.filter((lesson) => lesson.recall?.answer && hasContraction(lesson.recall.answer));
  const outputSentences: Array<{ lessonId: string; sentence: string }> = [];
  for (const lesson of grammarLessons) {
    // 产出段两种句子：半提示的变体句（首个非肯定变体）与核心句——与 GrammarLessonPage 的 outputPlan 同口径。
    const variant = (lesson.variants ?? []).find((item) => item.label !== "肯定" && item.en.trim());
    for (const sentence of [variant?.en, lesson.targetSentence]) {
      if (sentence && hasContraction(sentence)) outputSentences.push({ lessonId: lesson.id, sentence });
    }
  }

  it("语料里确实有大量含缩写的题（守护本身不是空转）", () => {
    expect(lessonRecalls.length).toBeGreaterThan(0);
    expect(outputSentences.length).toBeGreaterThan(20);
  });

  it("忆段：含缩写的答句，长短两版都能过 70 线", () => {
    for (const lesson of lessonRecalls) {
      const answer = lesson.recall!.answer;
      const long = toLongForm(answer);
      for (const [label, input] of [["原句", answer], ["长版", long]] as Array<[string, string]>) {
        const score = diffScore(compareText(answer, input, false));
        expect(score, `${lesson.id} 忆段（${label}）"${input}" 得分 ${score}`).toBeGreaterThanOrEqual(RECALL_PASS);
      }
    }
  });

  it("产出段：含缩写的核心句/变体句，长短两版都能过 90 线", () => {
    for (const { lessonId, sentence } of outputSentences) {
      const long = toLongForm(sentence);
      for (const [label, input] of [["原句", sentence], ["长版", long]] as Array<[string, string]>) {
        const score = diffScore(compareText(sentence, input, false));
        expect(score, `${lessonId} 产出段（${label}）"${input}" 得分 ${score}`).toBeGreaterThanOrEqual(OUTPUT_PASS);
      }
    }
  });

  it("判错时的提示不撒谎：长短版之间不该说「多了/少了词」", () => {
    // describeOutputGap 是答错后的差异说明。用户写长版但真的错在别处时，
    // 不能提示「多了 it is 一个词」——那会把正确的两种写法之一说成多余的。
    for (const lesson of lessonRecalls) {
      const answer = lesson.recall!.answer;
      const long = toLongForm(answer);
      expect(describeOutputGap(long, answer), `${lesson.id} 长版被判成「多了词」`).toBeNull();
    }
  });

  it("点词成句：含缩写的题，长短两版词块都能拼对", () => {
    let checked = 0;
    for (const lesson of grammarLessons) {
      for (const step of lesson.practice ?? []) {
        if (!hasContraction(step.answer)) continue;
        checked += 1;
        // 数据里的 tokens 是「打乱后的词块库」，不是答案顺序——判分只看词集与顺序，
        // 所以这里分别断言「按答案顺序摆出的词块」能判对，而不是照抄 tokens 的原始顺序。
        const answerOrder = step.answer.split(/\s+/).filter(Boolean);
        expect(checkLessonTokens(answerOrder, step.answer), `${lesson.id} "${step.answer}" 答案顺序拼不对`).toBe(true);
        // 长版词块：把 It's 拆成 It + is 后仍应判对
        const longChunks = toLongForm(step.answer).split(/\s+/).filter(Boolean);
        expect(
          checkLessonTokens(longChunks, toLongForm(step.answer)),
          `${lesson.id} "${step.answer}" 长版词块拼不对`
        ).toBe(true);
        // 反向：短版答案配长版词块，以及长版答案配短版词块，两个方向都要通
        expect(
          checkLessonTokens(answerOrder, toLongForm(step.answer)),
          `${lesson.id} "${step.answer}" 短版词块拼长版答案判错`
        ).toBe(true);
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("点词成句提示的位置落在用户看得见的词块上", () => {
    // 用户选 It's、答案写 It is：展开后 is 会多出一个词。
    // 若按展开口径返回下标，会把后面所有位置推后一位，提示「第 N 个词不对」就指错了。
    expect(firstMismatchIndex(["It's", "cold", "today."], "It is cold today.")).toBe(-1);
    expect(firstMismatchIndex(["It's", "hot", "today."], "It's cold today.")).toBe(1);
  });
});
