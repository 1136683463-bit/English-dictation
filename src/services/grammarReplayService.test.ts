import { describe, expect, it } from "vitest";
import { buildReplayLesson, hasReplayLesson, REPLAY_MAX_ITEMS, REPLAY_MIN_ITEMS } from "./grammarReplayService";
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

  it("无弱点时不成课（宁可不给，不给残缺的课）", () => {
    expect(buildReplayLesson([]).isEmpty).toBe(true);
    expect(hasReplayLesson([])).toBe(false);
  });
});
