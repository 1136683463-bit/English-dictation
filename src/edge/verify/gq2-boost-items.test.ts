// @vitest-environment node
/**
 * GQ2 · 生成题全库扫描（B）——趁热练（grammarBoostService.buildBoostItems / judgeBoostItem）
 *
 * 背景同 GQ1：趁热练三档的题全部由引擎按课程数据现场生成，从未被全库扫过。
 * 扫描面：**全部 205 课 × 三档 × 16 轮**（轮次影响档 1 的题型轮转与档 2/3 的取题顺序），
 *         另有弱点驱动（weakSpotTag）与 seen（近 7 天已练）两种真实调用形态。
 *
 * 检查项（与任务书对齐）：
 *   A 可作答性：题面/答案非空、cloze 空位唯一且答案在选项里、选项无重复、arrange/rebuild 词块能拼出答案
 *   B 语义一致：题面（中文意图 / 供选择的两句 / 供改的错句）与答案指向同一件事；
 *               **bothRight（双正解）素材不得作为「有错」的题面**——这是项目血泪教训
 *   C 干扰项  ：真实英语词、有效干扰项 ≥ 2 的占比
 *   D 判分一致：正解必判对、错解必判错、边界（空串 / 纯空格 / 全角 / 大小写）
 */
import { describe, expect, it } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { GRAMMAR_LESSON_BY_ID, grammarLessons } from "../../data/grammarLessons";
import { bundledDictionary } from "../../data/bundledDictionary";
import {
  BOOST_TIER_META,
  boostArrangeAnswerLength,
  buildBoostItems,
  judgeBoostItem,
  type BoostItem
} from "../../services/grammarBoostService";
import type { GrammarErrorTag, GrammarLesson } from "../../types";

// ── 口径工具 ──
const words = (value: string): string[] => value.split(/\s+/).filter(Boolean);
const clean = (token: string): string => token.replace(/[.,!?;:]/g, "");
const norm = (value: string): string =>
  value.toLowerCase().replace(/[.,!?;:'"’‘“”()\[\]{}]/g, "").replace(/\s+/g, " ").trim();
const FORCED_ROUNDS = 16;
const ALL_TAGS: GrammarErrorTag[] = [
  "tense", "sv_agreement", "missing_be", "article", "plural",
  "preposition", "word_order", "verb_form", "fragment", "run_on", "comparison"
];

// ── 真词判定（词典 + 功能词 + 应用语料 + 规则屈折） ──
const dictHeadwords = new Set(bundledDictionary.map((entry) => entry.word.toLowerCase()));
const appCorpus = new Set<string>();
const addCorpus = (text: string | undefined): void => {
  for (const raw of (text ?? "").split(/\s+/)) {
    const cleaned = raw.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "").replace(/\u2019/g, "'").toLowerCase();
    if (cleaned) appCorpus.add(cleaned);
  }
};
for (const lesson of grammarLessons) {
  addCorpus(lesson.targetSentence);
  lesson.blocks.forEach((block) => addCorpus(block.text));
  lesson.examples.forEach((example) => addCorpus(example.en));
  (lesson.dialogue ?? []).forEach((line) => addCorpus(line.en));
  (lesson.variants ?? []).forEach((variant) => addCorpus(variant.en));
  (lesson.sceneSwings ?? []).forEach((swing) => addCorpus(swing.en));
  (lesson.contrast ?? []).forEach((contrast) => {
    addCorpus(contrast.wrong);
    addCorpus(contrast.correct);
    addCorpus(contrast.wrongMark ?? "");
  });
  lesson.guided.forEach((step) => {
    addCorpus(step.answer);
    (step.tokens ?? []).forEach(addCorpus);
    (step.options ?? []).forEach(addCorpus);
  });
  lesson.practice.forEach((step) => {
    addCorpus(step.answer);
    step.tokens.forEach(addCorpus);
    (step.distractors ?? []).forEach(addCorpus);
  });
  if (lesson.recall) addCorpus(lesson.recall.answer);
}
const FUNCTION_WORDS = new Set([
  "i", "a", "an", "the", "am", "is", "are", "was", "were", "be", "been", "doing", "do", "does", "did",
  "to", "of", "in", "on", "at", "it", "he", "she", "we", "they", "you", "my", "your", "his", "her",
  "our", "their", "this", "that", "these", "those", "not", "no", "and", "or", "but", "so", "for", "with",
  "me", "him", "us", "them", "mine", "yours", "hers", "ours", "theirs", "here", "there", "what", "who",
  "how", "why", "when", "where", "which", "whose", "can", "could", "will", "would", "should", "must",
  "may", "might", "shall", "have", "has", "had", "don't", "doesn't", "didn't", "isn't", "aren't",
  "wasn't", "weren't", "can't", "cannot", "couldn't", "won't", "wouldn't", "shouldn't", "mustn't",
  "haven't", "hasn't", "hadn't", "let's", "it's", "that's", "what's", "i'm", "i'd", "i'll", "i've",
  "you're", "you'd", "you'll", "you've", "we're", "we'd", "we'll", "we've", "they're", "they'd",
  "they'll", "they've", "he's", "he'd", "he'll", "she's", "she'd", "she'll", "s"
]);
const baseForms = (word: string): string[] => {
  const out = [word];
  if (word.endsWith("ies") && word.length > 4) out.push(`${word.slice(0, -3)}y`);
  if (word.endsWith("es") && word.length > 3) out.push(word.slice(0, -2));
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) out.push(word.slice(0, -1));
  if (word.endsWith("ed") && word.length > 3) out.push(word.slice(0, -2), word.slice(0, -1));
  if (word.endsWith("ing") && word.length > 4) out.push(word.slice(0, -3), `${word.slice(0, -3)}e`);
  return out;
};
/** 真词判定；`allowInflection=false` 时只认词典原形（用于识别「加后缀硬造的词」）。 */
const isRealEnglishWord = (word: string, allowInflection = true): boolean => {
  const lower = word.toLowerCase().trim();
  if (!lower) return false;
  if (FUNCTION_WORDS.has(lower)) return true;
  if (appCorpus.has(lower)) return true;
  if (dictHeadwords.has(lower)) return true;
  if (!allowInflection) return false;
  const bare = lower.replace(/\u2019/g, "'").replace(/'/g, "");
  return baseForms(bare).some((base) => dictHeadwords.has(base));
};

/** 槽位相容（与 GQ1 同口径）：动词类槽位之间不互通。 */
const SLOT_PATTERNS: Array<[string, RegExp]> = [
  ["neg-contraction", /^(isn't|aren't|wasn't|weren't|don't|doesn't|didn't|haven't|hasn't|hadn't|can't|couldn't|won't|wouldn't|shouldn't|mustn't|let's)$/],
  ["be", /^(am|is|are|was|were|be|been|being)$/],
  ["aux", /^(do|does|did|have|has|had|can|could|will|would|shall|should|must|may|might)$/],
  ["verb-s", /^[a-z]{3,}(s|es)$/],
  ["verb-ed", /^[a-z]{3,}(ed|d)$/],
  ["verb-ing", /^[a-z]{3,}(ing)$/],
  ["pronoun", /^(i|you|he|she|it|we|they|me|him|her|us|them|my|your|his|our|their|this|that|these|those|mine|yours|hers|ours|theirs)$/],
  ["numeral", /^\d+$/]
];
const slotOf = (word: string): string => {
  const lower = word.toLowerCase();
  for (const [name, pattern] of SLOT_PATTERNS) if (pattern.test(lower)) return name;
  return "other";
};
const slotCompatible = (answer: string, distractor: string): boolean => {
  const a = slotOf(answer);
  const d = slotOf(distractor);
  if (a === d) return true;
  const verbish = new Set(["neg-contraction", "be", "aux", "verb-s", "verb-ed", "verb-ing"]);
  return !verbish.has(a) && !verbish.has(d);
};

// ── findings ──
interface Finding {
  check: string;
  severity: "P0" | "P1" | "P2";
  lessonId: string;
  itemId: string;
  kind: string;
  tier: number;
  detail: string;
  sample: string;
}
const findings: Finding[] = [];
const record = (
  check: string,
  severity: Finding["severity"],
  item: BoostItem,
  tier: number,
  detail: string,
  sample: string
): void => {
  findings.push({
    check,
    severity,
    lessonId: item.id.replace(/^boost-/, "").split("-t")[0] ?? "",
    itemId: item.id,
    kind: item.kind,
    tier,
    detail,
    sample
  });
};

/** 全库采样：三档 × 轮次 × 弱点标签的调用矩阵（与页面真实调用一致）。 */
interface Scanned {
  lesson: GrammarLesson;
  tier: 1 | 2 | 3;
  round: number;
  weakSpotTag: GrammarErrorTag | null;
  item: BoostItem;
}
const scanned: Scanned[] = [];
for (const lesson of grammarLessons) {
  for (const tier of [1, 2, 3] as const) {
    for (let round = 0; round < FORCED_ROUNDS; round += 1) {
      const items = buildBoostItems(lesson.id, tier, { round });
      for (const item of items) scanned.push({ lesson, tier, round, weakSpotTag: null, item });
    }
  }
  // 弱点驱动：真实调用形态（currentWeakSpotTag 命中时页面会传）
  for (const tag of ALL_TAGS) {
    for (const tier of [1, 2, 3] as const) {
      for (const item of buildBoostItems(lesson.id, tier, { round: 0, weakSpotTag: tag })) {
        scanned.push({ lesson, tier, round: 0, weakSpotTag: tag, item });
      }
    }
  }
}
/** 去重后的「题」（同 id 同内容在多轮里反复出现，统计按题而非按轮）。 */
const uniqueItems = new Map<string, Scanned>();
for (const entry of scanned) {
  const key = `${entry.item.id}|${entry.item.sourceRef}|${entry.tier}`;
  if (!uniqueItems.has(key)) uniqueItems.set(key, entry);
}
const UNIQUE = [...uniqueItems.values()];

/** 双正解（bothRight）素材全集：这些句对「两句都对」，绝不能作为「找错」的题面。 */
const bothRightStatements = new Set<string>();
for (const lesson of grammarLessons) {
  for (const contrast of lesson.contrast ?? []) {
    if (!contrast.bothRight) continue;
    bothRightStatements.add(contrast.wrong.trim());
    bothRightStatements.add(contrast.correct.trim());
  }
}

/** 已知基线上界（2026-09-21 扫描；源码 grammarBoostService.ts sha256 d8f95f40…）。 */
const BASELINE = {
  /** contrast 题面取自 bothRight 条（用户选「没问题」反被判错） */
  bothRightAsWrong: 12,
  fabricatedDistractor: 10,
  visibleAnswer: 1,
  emptyOrBadAnswer: 0,
  arrangeNotConstructible: 0,
  zhMultiAnswerSingleKey: 40,
  weakDistractors: 160
};

describe("GQ2 · 趁热练生成题全库扫描（A 可作答性 / B 语义一致 / C 干扰项 / D 判分）", () => {
  it("扫描覆盖：205 课 × 三档 × 16 轮 + 11 弱点标签（证明覆盖面）", () => {
    const byTier = new Map<number, number>();
    const byKind = new Map<string, number>();
    for (const entry of scanned) {
      byTier.set(entry.tier, (byTier.get(entry.tier) ?? 0) + 1);
      byKind.set(entry.item.kind, (byKind.get(entry.item.kind) ?? 0) + 1);
    }
    console.log("[GQ2] 课程:", grammarLessons.length, "三档声明题量:",
      [1, 2, 3].map((tier) => `${tier}=${BOOST_TIER_META[tier as 1 | 2 | 3].questionCount}`).join(" "));
    console.log("[GQ2] 出题调用样本数:", scanned.length, "去重题数:", UNIQUE.length);
    console.log("[GQ2] 分档:", [...byTier.entries()].sort((a, b) => a[0] - b[0]));
    console.log("[GQ2] 题型分布:", [...byKind.entries()].sort((a, b) => b[1] - a[1]));
    console.log("[GQ2] 双正解（bothRight）素材条数:", bothRightStatements.size);
    expect(grammarLessons.length).toBe(205);
    expect(scanned.length).toBeGreaterThan(20000);
    // 三档都必须出得满（与 BOOST_TIER_META 声明一致）
    const shortfalls: string[] = [];
    for (const entry of scanned) {
      if (entry.weakSpotTag !== null) continue;
      const byLessonTier = scanned.filter((item) => item.lesson.id === entry.lesson.id && item.tier === entry.tier && item.round === entry.round);
      const declared = BOOST_TIER_META[entry.tier].questionCount;
      if (byLessonTier.length < declared && byLessonTier.length > 0) {
        shortfalls.push(`${entry.lesson.id} t${entry.tier} r${entry.round}: ${byLessonTier.length}/${declared}`);
      }
    }
    console.log("[GQ2] 题量不达声明值的调用（去重后）:", new Set(shortfalls).size, [...new Set(shortfalls)].slice(0, 5));
  });

  // ── A 可作答性 ──
  it("A-1 每题 answer/promptZh 非空；answer 是合法英文句（≥2 词 + 句末标点）", () => {
    const emptyAnswer: string[] = [];
    const emptyPrompt: string[] = [];
    const notSentence: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (!item.answer.trim()) {
        emptyAnswer.push(`${item.id} kind=${item.kind}`);
        record("emptyAnswer", "P0", item, tier, "answer 为空", `sourceRef=${item.sourceRef}`);
      }
      if (!item.promptZh.trim()) {
        emptyPrompt.push(`${item.id} kind=${item.kind}`);
        record("emptyPrompt", "P0", item, tier, "promptZh 为空（题面无指令）", `sourceRef=${item.sourceRef}`);
      }
      const answerWords = words(item.answer).length;
      const punctuated = /[.!?]["')\]]*$/.test(item.answer.trim());
      // replace/choose/spot 的 answer 是「要填进空位的那个词/词组」，本就不是整句——不算缺陷
      const shortFormKinds = new Set(["replace", "choose", "spot"]);
      if (!shortFormKinds.has(item.kind) && (answerWords < 2 || !punctuated)) {
        notSentence.push(`${item.id} kind=${item.kind} "${item.answer}"`);
        record(
          "answerNotSentence",
          "P1",
          item,
          tier,
          `answer 不是完整句子（${answerWords} 词，句末标点=${punctuated}）`,
          `answer="${item.answer}"`
        );
      }
    }
    console.log("[GQ2] A-1 去重题数:", UNIQUE.length);
    console.log("[GQ2] A-1 answer 为空:", emptyAnswer.length, "promptZh 为空:", emptyPrompt.length);
    console.log("[GQ2] A-1 answer 非整句（已排除 choose/replace/spot 的短答案题型）:", new Set(notSentence).size);
    console.log("[GQ2] A-1 样本:", [...new Set(notSentence)].slice(0, 8));
    expect(emptyAnswer, `answer 为空：${emptyAnswer.slice(0, 5).join(", ")}`).toEqual([]);
    expect(emptyPrompt, `promptZh 为空：${emptyPrompt.slice(0, 5).join(", ")}`).toEqual([]);
    expect(new Set(notSentence).size).toBeLessThanOrEqual(BASELINE.emptyOrBadAnswer);
  });

  it("A-2 cloze：空位恰好 1 个、答案非空、答案在选项里、选项无重复", () => {
    let clozeCount = 0;
    const blankCountWrong: string[] = [];
    const answerMissing: string[] = [];
    const duplicates: string[] = [];
    const optionCountHistogram = new Map<number, number>();
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (item.kind !== "cloze") continue;
      clozeCount += 1;
      const text = item.clozeText ?? "";
      const blanks = (text.match(/_{2,}/g) ?? []).length;
      optionCountHistogram.set((item.clozeOptions ?? []).length, (optionCountHistogram.get((item.clozeOptions ?? []).length) ?? 0) + 1);
      if (blanks !== 1) {
        blankCountWrong.push(`${item.id} blanks=${blanks} "${text}"`);
        record("clozeBlankCount", "P0", item, tier, `空位数量 ${blanks} != 1`, `clozeText="${text}"`);
      }
      if (!item.clozeAnswer?.trim()) {
        record("clozeEmptyAnswer", "P0", item, tier, "clozeAnswer 为空", `clozeText="${text}"`);
      }
      if (!(item.clozeOptions ?? []).includes(item.clozeAnswer ?? "")) {
        answerMissing.push(`${item.id} answer="${item.clozeAnswer}" options=${JSON.stringify(item.clozeOptions)}`);
        record("clozeAnswerNotInOptions", "P0", item, tier, "正确答案不在选项里", `options=${JSON.stringify(item.clozeOptions)}`);
      }
      const normedOptions = (item.clozeOptions ?? []).map((option) => option.trim().toLowerCase());
      if (new Set(normedOptions).size !== normedOptions.length) {
        duplicates.push(`${item.id} options=${JSON.stringify(item.clozeOptions)}`);
        record("clozeDuplicateOptions", "P0", item, tier, "选项存在重复项", `options=${JSON.stringify(item.clozeOptions)}`);
      }
    }
    console.log("[GQ2] A-2 cloze 题数:", clozeCount, "选项数分布:", [...optionCountHistogram.entries()].sort((a, b) => a[0] - b[0]));
    console.log("[GQ2] A-2 空位数!=1:", blankCountWrong.length, "答案不在选项:", answerMissing.length, "选项重复:", duplicates.length);
    expect(blankCountWrong, `cloze 空位数不为 1：${blankCountWrong.slice(0, 5).join(" ;; ")}`).toEqual([]);
    expect(answerMissing, `cloze 答案不在选项：${answerMissing.slice(0, 5).join(" ;; ")}`).toEqual([]);
    expect(duplicates, `cloze 选项重复：${duplicates.slice(0, 5).join(" ;; ")}`).toEqual([]);
  });

  it("A-3 rebuild/arrange：词块必须是原句的排列（多重集相等），且打乱后不等于原句", () => {
    let tokensCount = 0;
    const notPermutation: string[] = [];
    const preSolved: string[] = [];
    const tooFewChunks: string[] = [];
    const notConstructible: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (item.kind !== "rebuild" && item.kind !== "arrange") continue;
      tokensCount += 1;
      const bank = item.tokens ?? [];
      // ① rebuild：词块即答案的词（无干扰项）——多重集必须完全相等
      if (item.kind === "rebuild") {
        const answerMultiset = words(item.answer).map(clean).sort().join(" ");
        const bankMultiset = bank.map(clean).sort().join(" ");
        if (answerMultiset !== bankMultiset) {
          notPermutation.push(`${item.id} answer="${item.answer}" tokens=${JSON.stringify(bank)}`);
          record("rebuildNotPermutation", "P0", item, tier, "词块不是原句的排列（多/少词）", `answer="${item.answer}" tokens=${JSON.stringify(bank)}`);
        }
      }
      // ② arrange：词块 = 答案词 + 干扰项，必须能从中挑出答案的全部词
      const pool = [...bank];
      let constructible = true;
      for (const word of words(item.answer)) {
        const at = pool.findIndex((token) => clean(token).toLowerCase() === clean(word).toLowerCase());
        if (at < 0) {
          constructible = false;
          break;
        }
        pool.splice(at, 1);
      }
      if (!constructible) {
        notConstructible.push(`${item.id} answer="${item.answer}" tokens=${JSON.stringify(bank)}`);
        record("arrangeNotConstructible", "P0", item, tier, "词块库拼不出答案（缺词）", `answer="${item.answer}" tokens=${JSON.stringify(bank)}`);
      }
      // ③ 打乱后不得等于原句（否则不用做）
      if (bank.join(" ") === item.answer.trim()) {
        preSolved.push(`${item.id} "${item.answer}"`);
        record("tokensAlreadyInOrder", "P0", item, tier, "词块显示顺序恰好等于答案顺序（不用做就对了）", `tokens=${JSON.stringify(bank)}`);
      }
      if (bank.length < 2) tooFewChunks.push(`${item.id} "${item.answer}"`);
      // ④ 页面判题门槛：摆满「答案词数」即判——词块库必须 ≥ 答案词数
      if (item.kind === "arrange" && bank.length < boostArrangeAnswerLength(item)) {
        record("arrangeBankTooSmall", "P0", item, tier, "词块库比答案词数还少，页面等不到判题", `bank=${bank.length} need=${boostArrangeAnswerLength(item)}`);
      }
    }
    console.log("[GQ2] A-3 rebuild/arrange 题数:", tokensCount);
    console.log("[GQ2] A-3 rebuild 词块非排列:", notPermutation.length, "arrange 拼不出答案:", notConstructible.length);
    console.log("[GQ2] A-3 顺序已预解:", preSolved.length, "词块<2:", tooFewChunks.length);
    expect(notPermutation, `rebuild 词块非排列：${notPermutation.slice(0, 5).join(" ;; ")}`).toEqual([]);
    expect(notConstructible, `arrange 拼不出答案：${notConstructible.slice(0, 5).join(" ;; ")}`).toEqual([]);
    expect(preSolved, `词块顺序已预解：${preSolved.slice(0, 5).join(" ;; ")}`).toEqual([]);
  });

  it("A-4 题型专属字段齐备（listen/bothright/spot/choose/rebuild 缺字段即不可作答）", () => {
    const missing: string[] = [];
    const notDrawable: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      switch (item.kind) {
        case "listen": {
          if (!item.listenText?.trim() || (item.listenOptions ?? []).length !== 2) {
            missing.push(`${item.id} listenText="${item.listenText}" options=${JSON.stringify(item.listenOptions)}`);
            record("listenFieldsMissing", "P0", item, tier, "听力题缺音频文本或不是二选一", `listenOptions=${JSON.stringify(item.listenOptions)}`);
          } else {
            const normed = (item.listenOptions ?? []).map((option) => norm(option));
            if (new Set(normed).size !== 2) {
              notDrawable.push(`${item.id} options=${JSON.stringify(item.listenOptions)}`);
              record("listenOptionsIdentical", "P0", item, tier, "二选一的两个选项归一化后相同（怎么选都对/都错）", `listenOptions=${JSON.stringify(item.listenOptions)}`);
            }
            if (!(item.listenOptions ?? []).some((option) => norm(option) === norm(item.listenText ?? ""))) {
              record("listenAnswerNotInOptions", "P0", item, tier, "播放句不在选项里（唯一正确项缺失）", `options=${JSON.stringify(item.listenOptions)}`);
            }
          }
          break;
        }
        case "bothright": {
          if (!item.correctPair?.first?.trim() || !item.correctPair?.second?.trim()) {
            missing.push(`${item.id} correctPair=${JSON.stringify(item.correctPair)}`);
            record("bothrightFieldsMissing", "P0", item, tier, "双正解题缺句对", `correctPair=${JSON.stringify(item.correctPair)}`);
          }
          break;
        }
        case "spot": {
          if (!(item.spotTokens ?? []).length) {
            missing.push(`${item.id} spotTokens 空`);
            record("spotFieldsMissing", "P0", item, tier, "改错题无词块", `answer="${item.answer}"`);
          } else {
            const accepted = item.spotWrongIndexes?.length
              ? item.spotWrongIndexes
              : item.spotWrongIndex !== undefined
                ? [item.spotWrongIndex]
                : [];
            if (accepted.length === 0 || accepted.some((index) => index < 0 || index >= (item.spotTokens ?? []).length)) {
              missing.push(`${item.id} accepted=${JSON.stringify(accepted)} tokens=${(item.spotTokens ?? []).length}`);
              record("spotIndexOutOfRange", "P0", item, tier, "标错下标越界：点任何词都判错（题目不可通过）", `accepted=${JSON.stringify(accepted)} tokens=${JSON.stringify(item.spotTokens)}`);
            }
          }
          break;
        }
        case "choose":
        case "replace": {
          if ((item.options ?? []).length < 2) {
            missing.push(`${item.id} options=${JSON.stringify(item.options)}`);
            record("choiceOptionsMissing", "P0", item, tier, "选择题选项不足 2 个", `options=${JSON.stringify(item.options)}`);
          }
          if (!(item.options ?? []).includes(item.answer)) {
            record("choiceAnswerNotInOptions", "P0", item, tier, "正确答案不在选项里", `answer="${item.answer}" options=${JSON.stringify(item.options)}`);
          }
          if (item.kind === "replace" && (!item.replaceBase?.trim() || !item.replaceTarget?.trim())) {
            record("replaceFieldsMissing", "P1", item, tier, "变形题缺原句或替换提示", `replaceBase="${item.replaceBase}" replaceTarget="${item.replaceTarget}"`);
          }
          break;
        }
        case "cloze": {
          if (!item.clozeText?.trim()) {
            missing.push(`${item.id} clozeText 空`);
            record("clozeFieldsMissing", "P0", item, tier, "填空题无题面", `answer="${item.answer}"`);
          }
          break;
        }
        case "recall":
        case "translate":
        case "produce":
        case "variant":
        case "fix": {
          if (!item.intentZh.trim() && item.kind !== "fix" && item.kind !== "variant") {
            missing.push(`${item.id} intentZh 空`);
            record("intentMissing", "P0", item, tier, "产出题无中文意图（用户不知要说什么）", `answer="${item.answer}"`);
          }
          break;
        }
        default:
          break;
      }
    }
    console.log("[GQ2] A-4 字段缺失题:", new Set(missing).size, [...new Set(missing)].slice(0, 8));
    console.log("[GQ2] A-4 二选一归一化相同的听力题:", notDrawable.length);
    expect(new Set(missing).size, `题型字段缺失：${[...new Set(missing)].slice(0, 5).join(" ;; ")}`).toBe(0);
    expect(notDrawable, `听力二选一两项相同：${notDrawable.slice(0, 5).join(" ;; ")}`).toEqual([]);
  });

  it("A-5 弱点标签（weakSpotTag）不得改变题的可作答性", () => {
    const problems: string[] = [];
    const withTag = scanned.filter((entry) => entry.weakSpotTag !== null);
    for (const entry of withTag) {
      const { item, tier } = entry;
      if (!item.answer.trim() || !item.promptZh.trim()) {
        problems.push(`${item.id} tag=${entry.weakSpotTag} kind=${item.kind}`);
        record("weakSpotBrokenItem", "P0", item, tier, "弱点驱动下出了不可作答的题", `tag=${entry.weakSpotTag} sourceRef=${item.sourceRef}`);
      }
    }
    console.log("[GQ2] A-5 弱点驱动调用样本数:", withTag.length, "不可作答题:", problems.length);
    expect(problems, `弱点驱动出的坏题：${problems.slice(0, 5).join(" ;; ")}`).toEqual([]);
  });

  // ── B 语义一致（血泪教训：bothRight 素材被当成「有错」的题面） ──
  it("B-1 contrast/fix 题面不得取自 bothRight（双正解）素材", () => {
    const leaked: string[] = [];
    /** listen 的干扰项取自「本课语法点的典型错句」，bothRight 条目的 wrong 字段是「另一句也对的话」，
     *  拿它当听辨干扰项时两句都合法——判分仍唯一（比对播放文本），但选项本身不具排他性，单列 P1。 */
    const listenSoft: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (item.kind === "contrast" && item.contrast && bothRightStatements.has(item.contrast.sentence.trim())) {
        leaked.push(`${item.id} t${tier} kind=contrast contrast.sentence="${item.contrast.sentence}" correct="${item.contrast.correct}"`);
      }
      if (item.kind === "fix" && item.shapedFrom && bothRightStatements.has(item.shapedFrom.trim())) {
        leaked.push(`${item.id} t${tier} kind=fix shapedFrom="${item.shapedFrom}" answer="${item.answer}"`);
      }
      if (item.kind === "spot" && item.contrast && bothRightStatements.has(item.contrast.sentence.trim())) {
        leaked.push(`${item.id} t${tier} kind=spot sentence="${item.contrast.sentence}"`);
      }
      if (item.kind === "listen") {
        const correct = item.listenText ?? "";
        const wrong = (item.listenOptions ?? []).find((option) => norm(option) !== norm(correct)) ?? "";
        if (wrong && bothRightStatements.has(wrong.trim())) {
          listenSoft.push(`${item.id} t${tier} listen 干扰项="${wrong}"（播放="${correct}"）`);
        }
      }
    }
    const uniqueLeaked = [...new Set(leaked)];
    const uniqueListenSoft = [...new Set(listenSoft)];
    console.log("[GQ2] B-1 双正解素材被当成「有错」题面（去重）:", uniqueLeaked.length);
    console.log(uniqueLeaked.join("\n"));
    console.log("[GQ2] B-1' 听力干扰项取自双正解条目（两句都合法，选项不排他）:", uniqueListenSoft.length);
    console.log(uniqueListenSoft.slice(0, 6).join("\n"));
    for (const sample of uniqueLeaked) {
      const [itemId, tierToken] = sample.split(" ");
      const match = UNIQUE.find((entry) => entry.item.id === itemId && `t${entry.tier}` === tierToken);
      if (match) {
        record(
          "bothRightAsWrong",
          "P0",
          match.item,
          match.tier,
          "bothRight（两句都对）素材被当成「这句写错了」的题面：用户选「没问题」反被判错",
          sample
        );
      }
    }
    for (const sample of uniqueListenSoft) {
      const [itemId, tierToken] = sample.split(" ");
      const match = UNIQUE.find((entry) => entry.item.id === itemId && `t${entry.tier}` === tierToken);
      if (match) {
        record(
          "listenDistractorBothRight",
          "P1",
          match.item,
          match.tier,
          "听力二选一的干扰项本身也是合法句子（只听语法差异，语义无提示力）",
          sample
        );
      }
    }
    console.log("[GQ2] B-1 说明：contrast 候选池 (lesson.contrast ?? []).slice(0,4) 未过滤 bothRight 条；");
    console.log("            tier3 fix 候选池 (lesson.contrast ?? []) 全量未过滤 bothRight 条；");
    console.log("            pickReviewContrast → pickFirstUnseenContrast 也未过滤 bothRight 条。");
    expect(uniqueLeaked.length).toBeLessThanOrEqual(BASELINE.bothRightAsWrong);
  });

  it("B-2 语义一致：contrast/spot 题面确含错处，bothright 题面确都是对的", () => {
    const problems: string[] = [];
    /** 保留撇号与大小写之外的一切实义差别：L87/L88/L169 教的正是「少一小撇成了另一个词」，
     *  用去撇号归一化会把这类正确的错句判成「无错可找」。 */
    const strictNorm = (value: string): string =>
      value.toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (item.kind === "contrast" && item.contrast) {
        // 「有点问题」是唯一正确回答：题面必须真的与正确答案不同（含撇号）
        if (strictNorm(item.contrast.sentence) === strictNorm(item.contrast.correct)) {
          problems.push(`${item.id} contrast 题面与正确答案同句 "${item.contrast.sentence}"`);
          record("contrastSentenceEqualsCorrect", "P0", item, tier, "判断题题面与正确答案是同一句（无错可找）", `sentence="${item.contrast.sentence}"`);
        }
      }
      if (item.kind === "bothright" && item.correctPair) {
        if (strictNorm(item.correctPair.first) === strictNorm(item.correctPair.second)) {
          problems.push(`${item.id} bothright 两句相同`);
          record("bothrightIdenticalPair", "P0", item, tier, "双正解题的两句归一化后相同（题目无意义）", `pair=${JSON.stringify(item.correctPair)}`);
        }
      }
      if (item.kind === "spot" && item.spotTokens && item.contrast) {
        // 标出的错词必须与正确句同一位置不同形（否则点对了也看不出差别）
        const marked = item.spotTokens[item.spotWrongIndex ?? -1] ?? "";
        const correctTokens = words(item.contrast.correct);
        const correctAt = correctTokens[item.spotWrongIndex ?? -1] ?? "";
        if (marked && correctAt && clean(marked).toLowerCase() === clean(correctAt).toLowerCase()) {
          problems.push(`${item.id} spot 下标 ${item.spotWrongIndex} 前后同形 "${marked}"`);
          record("spotMarkedTokenUnchanged", "P1", item, tier, "标出的错词在正确句同一位置不变（提示无意义）", `wrong="${item.contrast.sentence}" correct="${item.contrast.correct}"`);
        }
      }
      if (item.kind === "variant") {
        const label = (item.promptZh.match(/「(肯定|否定|疑问)」/) ?? [])[1] ?? null;
        if (label && item.shapedFrom && strictNorm(item.shapedFrom) === strictNorm(item.answer)) {
          problems.push(`${item.id} variant 样例句与答案相同（题面已给答案）`);
          record("variantAnswerInSample", "P0", item, tier, "变式题的样例句就是答案（照抄即对）", `shapedFrom="${item.shapedFrom}" answer="${item.answer}"`);
        }
      }
      if (item.kind === "translate" || item.kind === "recall" || item.kind === "produce") {
        if (!item.intentZh.trim()) {
          problems.push(`${item.id} ${item.kind} 无中文意图`);
          record("productionNoIntent", "P0", item, tier, "产出题无中文意图（用户不知道要说什么）", `answer="${item.answer}"`);
        }
      }
    }
    console.log("[GQ2] B-2 语义不一致:", new Set(problems).size, [...new Set(problems)].slice(0, 8));
    expect(new Set(problems).size, `语义不一致：${[...new Set(problems)].slice(0, 5).join(" ;; ")}`).toBe(0);
  });

  it("B-5 变式题的 label（肯定/否定/疑问）必须与答案的形式一致", () => {
    const mismatches: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (item.kind !== "variant") continue;
      const label = (item.promptZh.match(/「(肯定|否定|疑问)」/) ?? [])[1] ?? null;
      if (!label) continue;
      const lower = item.answer.toLowerCase();
      // 「否定」不必然含 not：never / no / neither / nobody / nothing / none 都是否定
      const negated = /\b(not|never|no|neither|nobody|nothing|none)\b|n't/.test(lower);
      const inverted = /^(is|are|am|was|were|do|does|did|can|could|will|would|should|must|may|have|has|had|what|where|when|who|why|how|whose|which)\b/i.test(item.answer.trim());
      if (label === "否定" && !negated) {
        mismatches.push(`${item.id} t${tier} label=否定 但答案是否定以外的形式 "${item.answer}" shapedFrom="${item.shapedFrom}"`);
        record("variantLabelMismatch", "P1", item, tier, "题面要求写成「否定」形态，答案却不是否定句", `promptZh="${item.promptZh}" answer="${item.answer}"`);
      }
      if (label === "疑问" && !inverted) {
        mismatches.push(`${item.id} t${tier} label=疑问 但答案未倒装 "${item.answer}" shapedFrom="${item.shapedFrom}"`);
        record("variantLabelMismatch", "P1", item, tier, "题面要求写成「疑问」形态，答案未倒装", `promptZh="${item.promptZh}" answer="${item.answer}"`);
      }
    }
    console.log("[GQ2] B-5 变式题 label 与答案形式不符:", mismatches.length);
    console.log(mismatches.join("\n"));
    console.log("[GQ2] B-5 说明：variants 的 label 是数据侧人工标注（如 L66「It is too heavy for me.」标成「否定」），");
    console.log("            出题侧直接引用 label 拼题面，未校验答案形式——属于数据语义标注问题，用户看到「说成否定」却写成陈述");
    expect(mismatches.length).toBeLessThanOrEqual(40);
  });

  it("B-6 中英对照题：中文提示是否多解而只认一解（真实判错场景统计）", () => {
    // 收集全库「中文 → 英文」映射（课程内所有可作题源的句对）
    const zhToEn = new Map<string, Map<string, string[]>>();
    const push = (zh: string, en: string, who: string): void => {
      const z = (zh ?? "").trim();
      const e = (en ?? "").trim();
      if (!z || !e) return;
      const bucket = zhToEn.get(z) ?? new Map<string, string[]>();
      const key = norm(e);
      bucket.set(key, [...(bucket.get(key) ?? []), who]);
      zhToEn.set(z, bucket);
    };
    for (const lesson of grammarLessons) {
      push(lesson.intentZh, lesson.targetSentence, `${lesson.id}:target`);
      lesson.examples.forEach((example) => push(example.zh, example.en, `${lesson.id}:example`));
      (lesson.sceneSwings ?? []).forEach((swing) => push(swing.zh, swing.en, `${lesson.id}:swing`));
      (lesson.variants ?? []).forEach((variant) => push(variant.zh, variant.en, `${lesson.id}:variant`));
      lesson.practice.forEach((step) => push(step.promptZh, step.answer, `${lesson.id}:practice`));
      if (lesson.recall) push(lesson.recall.intentZh, lesson.recall.answer, `${lesson.id}:recall`);
    }
    const multiAnswer = [...zhToEn.entries()].filter(([, bucket]) => bucket.size > 1);
    // 题面给 A 的中文、却只认 B 的英文：用户写出课程里另一处教过的等价英文即被判错
    const risky: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (!["recall", "translate", "produce"].includes(item.kind)) continue;
      if (!item.intentZh.trim()) continue;
      const bucket = zhToEn.get(item.intentZh.trim());
      if (!bucket) continue;
      const others = [...bucket.entries()].filter(([key]) => key !== norm(item.answer));
      if (others.length === 0) continue;
      // 只统计「另一解也出现在同一课以外/以内、且判分不认」的情况
      const altEn = others.map(([key, whos]) => `${key}(${whos[0]})`).join(" | ");
      risky.push(`${item.id} t${tier} kind=${item.kind} 中文="${item.intentZh}" 只认="${item.answer}" 另有合法写法=${altEn}`);
      record(
        "zhMultiAnswerSingleKey",
        "P1",
        item,
        tier,
        "中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错）",
        `intentZh="${item.intentZh}" answer="${item.answer}" 另一解=${altEn}`
      );
    }
    const uniqueRisky = [...new Set(risky)];
    console.log("[GQ2] B-3 全库中文多解条目:", multiAnswer.length);
    console.log("[GQ2] B-3 多解只认一解的中英对照题（去重）:", uniqueRisky.length);
    console.log(uniqueRisky.slice(0, 12).join("\n"));
    // 说明：判分走 diffScore ≥90，等价改写（如宾语位置互换）会掉分
    console.log("[GQ2] B-3 判分口径：judgeBoostProduce/Recall 用 diffScore(compareText(...)) ≥ 90/70，只认近似原文");
    expect(uniqueRisky.length).toBeGreaterThan(0);
  });

  it("B-4 hunt 来源的题：题面给的是案件错句时，正确答案必须是修正后的句子", () => {
    const problems: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (!item.sourceRef.startsWith("hunt")) continue;
      // 当前 boost 不从 hunt 案件取素材（题源只有 lesson），此检查用于护栏
      problems.push(`${item.id} sourceRef=${item.sourceRef}`);
    }
    console.log("[GQ2] B-4 boost 题源含 hunt 案件的数量:", problems.length, "（当前 0 = 题源仅来自 lesson，hunt 案件不参与趁热练）");
    expect(problems).toEqual([]);
  });

  // ── C 干扰项质量 ──
  it("C-1 cloze 干扰项必须是真实英语词（不得加后缀硬造）", () => {
    const fabricated = new Map<string, string>();
    let clozeCount = 0;
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (item.kind !== "cloze" || !item.clozeOptions) continue;
      clozeCount += 1;
      const answer = (item.clozeAnswer ?? "").toLowerCase().trim();
      for (const option of item.clozeOptions) {
        const lower = option.toLowerCase().trim();
        if (lower === answer) continue;
        if (/^[0-9]+$/.test(lower)) continue;
        // allowInflection=false：先排除「规则屈折的真词」，剩下的才算硬造
        if (isRealEnglishWord(lower, false)) continue;
        if (!isRealEnglishWord(lower, true)) {
          if (!fabricated.has(lower)) fabricated.set(lower, `${item.id} answer="${item.clozeAnswer}"`);
        }
      }
      void tier;
    }
    console.log("[GQ2] C-1 cloze 题数:", clozeCount, "硬造干扰项（去重）:", fabricated.size);
    console.log([...fabricated.entries()].map(([word, where]) => `  ${word}  <- ${where}`).join("\n"));
    for (const [word, where] of fabricated) {
      const itemId = where.split(" ")[0];
      const match = UNIQUE.find((entry) => entry.item.id === itemId);
      if (match) record("fabricatedDistractor", "P0", match.item, match.tier, `干扰项 "${word}" 不是英语词（加后缀硬造）`, where);
    }
    expect(fabricated.size).toBeLessThanOrEqual(BASELINE.fabricatedDistractor);
  });

  it("C-2 有效干扰项 ≥ 2 的占比；题面内可抄 / 词形不搭 的废干扰项统计", () => {
    let items = 0;
    let good = 0;
    let answerVisible = 0;
    const histogram = new Map<number, number>();
    const badSamples: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      if (item.kind !== "cloze" || !item.clozeOptions) continue;
      items += 1;
      const answer = (item.clozeAnswer ?? "").toLowerCase().trim();
      const promptWords = new Set(
        words(item.clozeText ?? "")
          .filter((token) => !/^_+/.test(token))
          .map((token) => norm(token))
      );
      // 题面里还留着答案词 = 直接照抄（泄题）
      if (promptWords.has(norm(answer))) {
        answerVisible += 1;
        if (answerVisible <= 5) {
          record("clozeAnswerVisible", "P1", item, tier, "答案词仍出现在题面里（可照抄）", `clozeText="${item.clozeText}" answer="${item.clozeAnswer}"`);
        }
      }
      const effective = (item.clozeOptions ?? []).filter((option) => {
        const lower = option.toLowerCase().trim();
        if (lower === answer) return false;
        if (/^[0-9]+$/.test(lower)) return false;
        if (!isRealEnglishWord(lower, true)) return false;
        if (!slotCompatible(answer, lower)) return false;
        return true;
      }).length;
      histogram.set(effective, (histogram.get(effective) ?? 0) + 1);
      if (effective >= 2) good += 1;
      else if (badSamples.length < 8) {
        badSamples.push(`${item.id} t${tier} answer="${item.clozeAnswer}" options=${JSON.stringify(item.clozeOptions)} text="${item.clozeText}" 有效=${effective}`);
      }
      if (effective < 2) {
        record("weakDistractors", "P1", item, tier, "有效干扰项 < 2（题目近似白送）", `answer="${item.clozeAnswer}" options=${JSON.stringify(item.clozeOptions)}`);
      }
    }
    console.log("[GQ2] C-2 cloze 题数:", items);
    console.log("[GQ2] C-2 有效干扰项 ≥2:", `${good}/${items}`, `= ${((good / items) * 100).toFixed(1)}%`);
    console.log("[GQ2] C-2 有效干扰项数分布:", [...histogram.entries()].sort((a, b) => a[0] - b[0]));
    console.log("[GQ2] C-2 答案可见（可照抄）:", answerVisible);
    console.log("[GQ2] C-2 典型不达标本:", badSamples);
    expect(good / items).toBeGreaterThan(0.5);
    expect(findings.filter((finding) => finding.check === "weakDistractors").length).toBeLessThanOrEqual(BASELINE.weakDistractors);
    expect(answerVisible).toBeLessThanOrEqual(BASELINE.visibleAnswer);
  });

  it("C-3 干扰项池必须来自课程内词汇（不得引入超纲词）", () => {
    const outside = new Map<string, string>();
    for (const entry of UNIQUE) {
      const { item } = entry;
      if (item.kind !== "cloze" || !item.clozeOptions) continue;
      const answer = (item.clozeAnswer ?? "").toLowerCase().trim();
      for (const option of item.clozeOptions) {
        const lower = option.toLowerCase().trim();
        if (lower === answer) continue;
        if (/^[0-9]+$/.test(lower)) continue;
        if (!appCorpus.has(lower) && !FUNCTION_WORDS.has(lower)) {
          if (!outside.has(lower)) outside.set(lower, `${item.id} answer="${item.clozeAnswer}"`);
        }
      }
    }
    console.log("[GQ2] C-3 不在课程语料中的干扰项（去重）:", outside.size);
    console.log([...outside.entries()].map(([word, where]) => `  ${word}  <- ${where}`).slice(0, 30).join("\n"));
    // 不在语料里但字典里有的规则屈折（如 clean→cleans）属于「同学过词形」的合法干扰项
  });

  // ── D 判分一致 ──
  it("D-1 按正确答案作答必须判对（全题型自洽性）", () => {
    const failures: string[] = [];
    let judged = 0;
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      judged += 1;
      let passed = false;
      switch (item.kind) {
        case "contrast": passed = judgeBoostItem(item, { pickedProblem: true }).passed; break;
        case "bothright": passed = judgeBoostItem(item, { pickedProblem: true }).passed; break;
        case "spot": passed = judgeBoostItem(item, { tokenIndex: item.spotWrongIndex ?? -1 }).passed; break;
        case "listen": passed = judgeBoostItem(item, { text: item.listenText ?? "" }).passed; break;
        case "cloze": passed = judgeBoostItem(item, { text: item.clozeAnswer ?? "" }).passed; break;
        case "choose":
        case "replace": passed = judgeBoostItem(item, { text: item.answer }).passed; break;
        case "rebuild":
        case "arrange": {
          const picked: string[] = [];
          const pool = [...(item.tokens ?? [])];
          let ok = true;
          for (const word of words(item.answer)) {
            const at = pool.findIndex((token) => clean(token).toLowerCase() === clean(word).toLowerCase());
            if (at < 0) { ok = false; break; }
            picked.push(pool[at]);
            pool.splice(at, 1);
          }
          passed = ok && judgeBoostItem(item, { tokens: picked }).passed;
          break;
        }
        default:
          passed = judgeBoostItem(item, { text: item.answer }).passed;
          break;
      }
      if (!passed) {
        failures.push(`${item.id} t${tier} kind=${item.kind} answer="${item.answer}"`);
        record("correctAnswerJudgedWrong", "P0", item, tier, "按标准答案作答被判错", `kind=${item.kind} answer="${item.answer}"`);
      }
    }
    console.log("[GQ2] D-1 判题样本:", judged, "正解被判错:", failures.length);
    console.log(failures.slice(0, 8).join("\n"));
    expect(failures, `正解被判错：${failures.slice(0, 5).join(" ;; ")}`).toEqual([]);
  });

  it("D-2 明显错误的答案必须判错；空串/纯空格不得通过", () => {
    const falsePositive: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      const wrongPayload = { text: "zzz qqq zzz", tokens: ["zzz", "qqq", "zzz"], tokenIndex: -1, pickedProblem: false };
      if (judgeBoostItem(item, wrongPayload).passed) {
        falsePositive.push(`${item.id} t${tier} kind=${item.kind} 错答判对 answer="${item.answer}"`);
        record("wrongAnswerJudgedRight", "P0", item, tier, "明显错误的答案被判对", `kind=${item.kind} answer="${item.answer}"`);
      }
      for (const [label, payload] of [
        ["空串", { text: "", tokens: [] as string[], tokenIndex: -1, pickedProblem: false }],
        ["纯空格", { text: "   ", tokens: ["   "], tokenIndex: -1, pickedProblem: false }],
        ["全角顿号", { text: "、", tokens: ["、"], tokenIndex: -1, pickedProblem: false }]
      ] as Array<[string, { text: string; tokens: string[]; tokenIndex: number; pickedProblem: boolean }]>) {
        if (judgeBoostItem(item, payload).passed) {
          falsePositive.push(`${item.id} t${tier} kind=${item.kind} 「${label}」判对`);
          record("emptyAnswerJudgedRight", "P0", item, tier, `「${label}」被判对`, `kind=${item.kind} answer="${item.answer}"`);
        }
      }
    }
    console.log("[GQ2] D-2 错误答案/边界被判对:", falsePositive.length);
    console.log(falsePositive.slice(0, 8).join("\n"));
    expect(falsePositive, `错答/空答被判对：${falsePositive.slice(0, 5).join(" ;; ")}`).toEqual([]);
  });

  it("D-3 边界宽容：大小写混合 / 全角句末标点 / 首尾空格 必须仍判对", () => {
    const tooStrict: string[] = [];
    for (const entry of UNIQUE) {
      const { item, tier } = entry;
      switch (item.kind) {
        case "cloze": {
          if (!judgeBoostItem(item, { text: (item.clozeAnswer ?? "").toUpperCase() }).passed) {
            tooStrict.push(`${item.id} cloze 全大写判错 answer="${item.clozeAnswer}"`);
          }
          if (!judgeBoostItem(item, { text: `  ${item.clozeAnswer ?? ""}  ` }).passed) {
            tooStrict.push(`${item.id} cloze 首尾空格判错 answer="${item.clozeAnswer}"`);
          }
          break;
        }
        case "choose":
        case "replace": {
          if (!judgeBoostItem(item, { text: item.answer.toUpperCase() }).passed) {
            tooStrict.push(`${item.id} ${item.kind} 全大写判错 answer="${item.answer}"`);
          }
          break;
        }
        case "recall":
        case "translate":
        case "produce":
        case "variant":
        case "fix":
        case "free": {
          if (!judgeBoostItem(item, { text: item.answer.toUpperCase() }).passed) {
            tooStrict.push(`${item.id} ${item.kind} 全大写判错 answer="${item.answer}"`);
          }
          const fullWidthEnd = item.answer.replace(/[.!?]$/, "。");
          if (!judgeBoostItem(item, { text: fullWidthEnd }).passed) {
            tooStrict.push(`${item.id} ${item.kind} 全角句号判错 answer="${item.answer}"`);
          }
          break;
        }
        case "listen": {
          if (!judgeBoostItem(item, { text: (item.listenText ?? "").toUpperCase() }).passed) {
            tooStrict.push(`${item.id} listen 全大写判错`);
          }
          break;
        }
        case "rebuild":
        case "arrange": {
          const upper = item.answer.toUpperCase().split(" ").filter(Boolean);
          if (!judgeBoostItem(item, { tokens: upper }).passed) {
            tooStrict.push(`${item.id} ${item.kind} 全大写判错 answer="${item.answer}"`);
          }
          break;
        }
        default:
          break;
      }
      void tier;
    }
    console.log("[GQ2] D-3 判分过严（边界不容忍）:", tooStrict.length);
    console.log(tooStrict.slice(0, 10).join("\n"));
    expect(tooStrict, `边界判分过严：${tooStrict.slice(0, 5).join(" ;; ")}`).toEqual([]);
  });

  it("D-4 判题种子稳定性：同一课同一档多次调用题目可回放（确定性）", () => {
    const unstable: string[] = [];
    for (const lesson of grammarLessons) {
      for (const tier of [1, 2, 3] as const) {
        const first = buildBoostItems(lesson.id, tier, { round: 3 });
        const second = buildBoostItems(lesson.id, tier, { round: 3 });
        if (JSON.stringify(first) !== JSON.stringify(second)) {
          unstable.push(`${lesson.id} t${tier}`);
        }
      }
    }
    console.log("[GQ2] D-4 同一调用参数两次出题不一致的课档:", unstable.length, unstable.slice(0, 5));
    expect(unstable, `出题不确定（无法回放）：${unstable.slice(0, 5).join(", ")}`).toEqual([]);
  });

  it("汇总：输出 findings 与统计表（写入 .rvfind/gq2-findings.json）", () => {
    const byCheck = new Map<string, { count: number; severity: Finding["severity"] }>();
    for (const finding of findings) {
      const bucket = byCheck.get(finding.check) ?? { count: 0, severity: finding.severity };
      bucket.count += 1;
      byCheck.set(finding.check, bucket);
    }
    const byKind = new Map<string, number>();
    for (const entry of UNIQUE) byKind.set(entry.item.kind, (byKind.get(entry.item.kind) ?? 0) + 1);
    const summary = {
      scannedAt: "2026-09-21",
      lessons: grammarLessons.length,
      forcedRounds: FORCED_ROUNDS,
      weakSpotTags: ALL_TAGS.length,
      callSamples: scanned.length,
      uniqueItems: UNIQUE.length,
      kinds: Object.fromEntries([...byKind.entries()].sort((a, b) => b[1] - a[1])),
      counts: Object.fromEntries([...byCheck.entries()].map(([check, value]) => [check, value.count])),
      severities: Object.fromEntries([...byCheck.entries()].map(([check, value]) => [check, value.severity])),
      samples: findings.slice(0, 300)
    };
    mkdirSync(".rvfind", { recursive: true });
    writeFileSync(".rvfind/gq2-findings.json", JSON.stringify(summary, null, 2), "utf8");
    console.log("[GQ2] 统计:", JSON.stringify(summary.counts));
    console.log("[GQ2] 严重度:", JSON.stringify(summary.severities));
    expect(findings.length).toBeGreaterThan(0);
  });
});

/** 让类型检查器知道 GRAMMAR_LESSON_BY_ID 被用于 B-1 的来源回溯（保留定位能力）。 */
void GRAMMAR_LESSON_BY_ID;
