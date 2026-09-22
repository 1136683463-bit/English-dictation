import { describe, expect, it } from "vitest";
import { buildReplayLesson, hasReplayLesson, resolveReplayRound, REPLAY_MAX_ITEMS, REPLAY_MIN_ITEMS } from "./grammarReplayService";
import { findZeroTermHits } from "../data/grammarZeroTerms";
import { GRAMMAR_ERROR_TAG_PLAIN, GRAMMAR_ERROR_TAGS } from "./huntService";
import type { GrammarErrorTag } from "../types";

/** C4（M3）「你的三句话」复盘课：素材 100% 溯源、零术语、答案可点。 */
describe("grammarReplayService（C4 错题重练）", () => {
  const sampleTags: GrammarErrorTag[][] = [
    ["sv_agreement", "article", "tense"],
    ["missing_be", "fragment", "run_on"],
    ["plural", "word_order", "verb_form"]
  ];

  it("能从 Top3 弱点拼出可走通的课（3–5 题）", () => {
    for (const tags of sampleTags) {
      const lesson = buildReplayLesson(tags);
      expect(lesson.isEmpty, tags.join("+")).toBe(false);
      expect(lesson.items.length).toBeGreaterThanOrEqual(REPLAY_MIN_ITEMS);
      expect(lesson.items.length).toBeLessThanOrEqual(REPLAY_MAX_ITEMS);
    }
  });

  it("每题素材 100% 可溯源（有来源课 id）", () => {
    for (const tags of sampleTags) {
      for (const item of buildReplayLesson(tags).items) {
        expect(item.sourceLessonId, `${item.tag} 缺溯源`).toBeTruthy();
      }
    }
  });

  it("全库罪名：题面与讲解一律零术语（红线守门）", () => {
    const allTags = [...GRAMMAR_ERROR_TAGS] as GrammarErrorTag[];
    for (const tag of allTags) {
      const lesson = buildReplayLesson([tag]);
      for (const item of lesson.items) {
        expect(findZeroTermHits(item.promptZh), `${tag} 题面带术语`).toEqual([]);
        expect(findZeroTermHits(item.explainZh), `${tag} 讲解带术语`).toEqual([]);
        expect(findZeroTermHits(item.plain), `${tag} 罪名说明带术语`).toEqual([]);
      }
    }
  });

  it("答案必须是真的英文词块（不能是中文修正措辞，否则点不了）", () => {
    for (const tags of sampleTags) {
      for (const item of buildReplayLesson(tags).items) {
        expect(item.answer.trim().length, `${item.tag} 答案为空`).toBeGreaterThan(0);
        expect(/[\u4e00-\u9fff]/.test(item.answer), `${item.tag} 答案含中文：「${item.answer}」`).toBe(false);
      }
    }
  });

  it("答案词必须是题面上真实存在的词块（点得到）", () => {
    for (const tags of sampleTags) {
      for (const item of buildReplayLesson(tags).items) {
        const onBoard = (item.tokens ?? []).some(
          (token) => token.replace(/[.,!?;:]+$/, "").trim() === item.answer
        );
        expect(onBoard, `${item.tag} 答案「${item.answer}」不在题面词块里`).toBe(true);
      }
    }
  });

  it("Top3 罪名覆盖：每个可用罪名至少出一题（不被素材多的罪名淹没）", () => {
    const tags: GrammarErrorTag[] = ["missing_be", "fragment", "run_on"];
    const lesson = buildReplayLesson(tags);
    const covered = new Set(lesson.items.map((item) => item.tag));
    for (const tag of tags) {
      expect(covered.has(tag), `${tag} 未出题`).toBe(true);
    }
  });

  it("全部罪名说明已无术语（2026-09-21 清理 6 条）", () => {
    for (const tag of GRAMMAR_ERROR_TAGS) {
      const plain = GRAMMAR_ERROR_TAG_PLAIN[tag as GrammarErrorTag];
      expect(findZeroTermHits(plain), `${tag}: ${plain}`).toEqual([]);
    }
  });

  it("题目只呈现目标那一句（走查修复：案件多句会混成一屏）", () => {
    // 全库 205/206 个案件是多句、平均 3.7 个错误——整段铺出来用户不知道「这句」是哪句
    for (const tags of sampleTags) {
      for (const item of buildReplayLesson(tags).items) {
        const board = item.tokens ?? [];
        // 词块数必须像「一句话」而不是「一整段」
        expect(board.length, `${item.tag} 题面过长（${board.length} 块）`).toBeLessThanOrEqual(14);
        // 题面里最多只有一个句末标点（即只有一个句子）
        const sentenceEnds = board.filter((token) => /[.!?]$/.test(token.trim())).length;
        expect(sentenceEnds, `${item.tag} 题面含多个句子：${board.join(" ")}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("目标错误必定出现在题面词块里（切句不得切掉答案）", () => {
    for (const tags of sampleTags) {
      for (const item of buildReplayLesson(tags).items) {
        const onBoard = (item.tokens ?? []).some(
          (token) => token.replace(/[.,!?;:]+$/, "").trim() === item.answer
        );
        expect(onBoard, `${item.tag} 切句后答案「${item.answer}」丢失：${item.tokens?.join(" ")}`).toBe(true);
      }
    }
  });

  it("无弱点时不成课（宁可不给，不给残缺的课）", () => {
    expect(buildReplayLesson([]).isEmpty).toBe(true);
    expect(hasReplayLesson([])).toBe(false);
  });
});

describe("复盘课换一批（走查修复：同弱点不重复出同一套题）", () => {
  const tags: GrammarErrorTag[] = ["sv_agreement", "plural", "tense"];

  it("轮次递增会换出新素材（素材充足的罪名至少换掉一题）", () => {
    const r1 = buildReplayLesson(tags, 1);
    const r2 = buildReplayLesson(tags, 2);
    const set1 = new Set(r1.items.map((item) => `${item.tag}:${item.answer}`));
    const set2 = new Set(r2.items.map((item) => `${item.tag}:${item.answer}`));
    const fresh = [...set2].filter((key) => !set1.has(key));
    expect(fresh.length, "第 2 轮应有新素材").toBeGreaterThan(0);
  });

  it("轮次回绕安全（素材用尽后回到第一轮，不崩不空）", () => {
    for (const round of [1, 5, 20]) {
      const lesson = buildReplayLesson(tags, round);
      expect(lesson.isEmpty, `轮次 ${round} 不应为空`).toBe(false);
      expect(lesson.items.length).toBeGreaterThanOrEqual(REPLAY_MIN_ITEMS);
    }
  });

  it("轮次内保持确定性（同一轮反复进出看到同一套题）", () => {
    const a = buildReplayLesson(tags, 2);
    const b = buildReplayLesson(tags, 2);
    expect(a.items.map((i) => i.answer)).toEqual(b.items.map((i) => i.answer));
  });

  it("resolveReplayRound：同组弱点练过 N 次 → 第 N+1 轮", () => {
    const empty: Array<{ tags: string[] }> = [];
    expect(resolveReplayRound(tags, empty)).toBe(1);
    // 练过 1 次同一组（顺序无关）
    expect(resolveReplayRound(tags, [{ tags: ["tense", "sv_agreement", "plural"] }])).toBe(2);
    // 练过 2 次 → 第 3 轮
    expect(
      resolveReplayRound(tags, [
        { tags: ["sv_agreement", "plural", "tense"] },
        { tags: ["plural", "tense", "sv_agreement"] }
      ])
    ).toBe(3);
    // 不同弱点组合不计入
    expect(resolveReplayRound(tags, [{ tags: ["article", "fragment"] }])).toBe(1);
  });
});
