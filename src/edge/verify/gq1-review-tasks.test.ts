// @vitest-environment node
/**
 * GQ1 · 生成题全库扫描（A）——语法复习卡（grammarReviewService.buildGrammarReviewTask）
 *
 * 背景：复习题不是手写的，是引擎按卡片现场生成的（cloze / rebuild / free_type 三型轮换）。
 * 手写题目有内容核查（grammarLessons.test / huntCases 校验）兜着，**生成题从来没有被全库扫过**。
 * 本文件把「所有可能进入 SM-2 复习队列的卡片」全部枚举出来，逐卡逐型检查题目是否成立。
 *
 * 卡片的真实来源（已核对入队链路，全部走 addSentence → tags「语法」）：
 *   ① lessonService.addLessonCoreSentence      —— 每课 targetSentence，note = `语法课核心句：${episode} ${title}`
 *   ② lessonService.addLessonMistakeSentence   —— 课内练错的句子，note = `语法课：${episode} ${title}`
 *        入队句子包含：guided[i].answer（choose/replace/spot 是**单个词**，arrange 是整句）、
 *        practice[i].answer、recall.answer、output 段（半提示变体句 + 核心句）
 *   ③ huntService.addHuntGapSentences          —— 整段案件原文（含植错），note = `找错案件：${title}（罪名）`
 *   ④ diaryService.addDiarySentenceToReview    —— 用户自己写的句子（非库内容，本扫描不覆盖）
 *
 * 检查项（与任务书 A/B/C/D 对齐）：
 *   A1 cloze     ：可挖词 / 恰好一个正确答案 / 正确答案在选项里 / 空位恰好 1 个 / 无重复选项 / 干扰项不与答案等价
 *   A2 rebuild   ：打乱后是原句的多重集排列 / 不等于原句 / 词块数 ≥ 2
 *   A3 free_type ：题面（promptText，内容 = card.note）不写出完整答案
 *   A4 全题型    ：answer/sentence 非空；sentence 是合法英文句（≥2 词 + 句末标点）
 *   B  语义一致  ：题面与答案指向同一句话（含「题面无中文意图」这类信息不足）
 *   C  干扰项质量：真实英语词 / 有效干扰项 ≥ 2 的占比
 *   D  判分自洽  ：正解必判对、错解必判错、边界输入（空串/纯空格/全角/大小写）
 *
 * 断言策略（重要）：本文件同时是**回归门禁**。
 *   - 「当前 0 命中」的检查用 expect(...).toEqual([]) 断言——回归立刻变红；
 *   - 「当前有已知命中」的检查不断言相等，而是断言**不得比 2026-09-21 的基线更差**
 *     （计数上界），并把明细写入 .rvfind/gq1-findings.json 供报告与复现。
 */
import { describe, expect, it } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import { bundledDictionary } from "../../data/bundledDictionary";
import { addHuntGapSentences } from "../../services/huntService";
import { makeTestData } from "../../services/testUtils";
import {
  buildGrammarReviewTask,
  judgeGrammarCloze,
  judgeGrammarFreeType,
  judgeGrammarRebuild,
  isFreeTypeReviewEnabled
} from "../../services/grammarReviewService";
import type { Card, Schedule } from "../../types";

// ── 与产品代码同口径的归一化（不要改：改了就不再是「用户看到的那道题」） ──
const cleanToken = (token: string): string => token.replace(/[.,!?;:]/g, "");
/** 判分口径归一化（大小写 + 标点，与 judgeGrammarCloze 一致）。 */
const judgeNorm = (value: string): string => value.trim().toLowerCase();
/** 内容口径归一化（去标点、压空白）。 */
const contentNorm = (value: string): string =>
  value.toLowerCase().replace(/[.,!?;:'"’‘“”()\[\]{}]/g, "").replace(/\s+/g, " ").trim();
const words = (value: string): string[] => value.split(/\s+/).filter(Boolean);
const hasSentenceEnd = (value: string): boolean => /[.!?]["')\]]*$/.test(value.trim());

// ── 干扰项「是不是真词」的判定依据（三层，从严到宽） ──
const dictHeadwords = new Set(bundledDictionary.map((entry) => entry.word.toLowerCase()));
/** 应用自身语料里出现过的词（课程 + 案件 + 课程词汇池）——用户学过、见过。 */
const appCorpus = new Set<string>();
const addCorpus = (text: string | undefined): void => {
  for (const raw of (text ?? "").split(/\s+/)) {
    const clean = raw
      .replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "")
      .replace(/\u2019/g, "'")
      .toLowerCase();
    if (clean) appCorpus.add(clean);
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
for (const huntCase of huntCases) huntCase.tokens.forEach(addCorpus);

/** 规则屈折还原（-s/-es/-ed/-ing/-ies），用于判断「造出来的词是否是真词的合法变形」。 */
const baseForms = (word: string): string[] => {
  const out = [word];
  if (word.endsWith("ies") && word.length > 4) out.push(`${word.slice(0, -3)}y`);
  if (word.endsWith("es") && word.length > 3) out.push(word.slice(0, -2));
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) out.push(word.slice(0, -1));
  if (word.endsWith("ed") && word.length > 3) out.push(word.slice(0, -2), `${word.slice(0, -1)}`);
  if (word.endsWith("ing") && word.length > 4) out.push(word.slice(0, -3), `${word.slice(0, -3)}e`);
  return out;
};
/** 真词判定：词典词条 / 词条的规则屈折 / 应用语料里出现过 / 撇号缩写（撇号前的部分是真词）。 */
const isRealEnglishWord = (word: string): boolean => {
  const lower = word.toLowerCase().trim();
  if (!lower) return false;
  if (appCorpus.has(lower)) return true;
  if (dictHeadwords.has(lower)) return true;
  if (/^[a-z]+('[a-z]+)?$/.test(lower) && baseForms(lower.replace(/'/g, "")).some((base) => dictHeadwords.has(base))) return true;
  return baseForms(lower).some((base) => dictHeadwords.has(base));
};

/** 槽位类型：判断干扰项「是否可能出现在同一个空位」。 */
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
/** 动词类槽位之间不互通（am 的干扰项不该是 teacher）；「其他」与任何非动词槽位都算互通。 */
const slotCompatible = (answer: string, distractor: string): boolean => {
  const a = slotOf(answer);
  const d = slotOf(distractor);
  if (a === d) return true;
  const verbish = new Set(["be", "aux", "verb-s", "verb-ed", "verb-ing", "neg-contraction"]);
  return !verbish.has(a) && !verbish.has(d);
};

// ── 待扫描卡片的全量枚举 ──
interface ScanCard {
  id: string;
  front: string;
  note: string;
  /** 来源链路，报告里用于定位 */
  origin: string;
}
const cards: ScanCard[] = [];
const pushCard = (id: string, front: string, note: string, origin: string): void => {
  const sentence = (front ?? "").trim();
  if (!sentence) return;
  cards.push({ id, front: sentence, note, origin });
};
/** 卡 id 里不可控的随机后缀（uid）在一次构建内唯一即可，跨构建不需要——见 hunt 循环的解释。 */
let huntSeq = 0;
for (const lesson of grammarLessons) {
  pushCard(
    `lesson:${lesson.id}`,
    lesson.targetSentence,
    `语法课核心句：${lesson.episode} ${lesson.title}`,
    `${lesson.id} · addLessonCoreSentence`
  );
  lesson.guided.forEach((step, index) => {
    pushCard(
      `lesson:${lesson.id}#guided${index}`,
      step.answer ?? "",
      `语法课：${lesson.episode} ${lesson.title}`,
      `${lesson.id} guided[${index}].${step.kind}`
    );
  });
  lesson.practice.forEach((step, index) => {
    pushCard(
      `lesson:${lesson.id}#practice${index}`,
      step.answer,
      `语法课：${lesson.episode} ${lesson.title}`,
      `${lesson.id} practice[${index}]`
    );
  });
  if (lesson.recall) {
    pushCard(
      `lesson:${lesson.id}#recall`,
      lesson.recall.answer,
      `语法课：${lesson.episode} ${lesson.title}`,
      `${lesson.id} recall`
    );
  }
  // output 段（R6 两档产出）：半提示变体句 + 核心句都会在「看答案」时入队
  (lesson.variants ?? []).forEach((variant, index) => {
    if (variant.label === "肯定") return;
    pushCard(
      `lesson:${lesson.id}#variant${index}`,
      variant.en,
      `语法课：${lesson.episode} ${lesson.title}`,
      `${lesson.id} variants[${index}](${variant.label})`
    );
  });
}
for (const huntCase of huntCases) {
  // ⚠️ 必须走产品代码建卡，不能自己拼 `tokens.join(" ")`：
  // huntService.addHuntGapSentences 会把案件原文按 errors 替换成**修正后的句子**再入队
  // （见 huntService.ts 的 correctedSentenceOf，2026-09-21 批三十九 修）。
  // 自行拼原文会扫出产品里并不存在的「植错原文当答案」缺陷——本次扫描第一版即如此，
  // 已改为走真实链路，这样扫描结果与用户实际拿到的卡严格一致。
  const gapIndexes = huntCase.errors.map((error) => error.tokenIndex);
  const { data: withCards } = addHuntGapSentences(makeTestData(), huntCase, gapIndexes);
  for (const card of withCards.cards) {
    const details = withCards.sentenceDetails.find((item) => item.cardId === card.id);
    // ⚠️ 卡 id 由 `uid()` 生成（含 Date.now + Math.random，见 storage.ts:52），
    // 而复习题的挖空位置/打乱顺序都以 card.id 为种子——直接用随机 id 会让扫描
    // 每次跑在不同挖空位上，统计随之抖动（本次实测 B-1b 在 2–7 之间跳）。
    // 卡 id 只影响「挖哪个空」，与「题是否成立」无关，故归一成稳定的扫描 id，
    // 让本文件成为可复现的回归门禁。
    pushCard(
      `hunt:${huntCase.id}#err${huntSeq++}`,
      card.front,
      card.note,
      `${huntCase.id} · addHuntGapSentences[${(details?.grammarNote ?? "").slice(0, 34)}…]`
    );
  }
}

const makeCard = (scan: ScanCard): Card => ({
  id: scan.id,
  type: "sentence",
  front: scan.front,
  back: "",
  note: scan.note,
  sourceId: scan.id.split("#")[0],
  tags: ["语法"],
  status: "review",
  priority: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
});
const makeSchedule = (cardId: string, reviewCount: number): Schedule => ({
  cardId,
  easeFactor: 2.5,
  intervalDays: 3,
  reviewCount,
  lapseCount: 0,
  nextReviewAt: "2026-01-01T00:00:00.000Z"
});

/** 一张卡能生成的全部题型：rc=0 → cloze；rc=1 → rebuild；rc≥2 → free_type（flag 默认开）。 */
const reviewCountsForScan = [0, 1, 2];
const tasks = cards.flatMap((scan) =>
  reviewCountsForScan.map((reviewCount) => ({
    scan,
    reviewCount,
    task: buildGrammarReviewTask({ card: makeCard(scan), schedule: makeSchedule(scan.id, reviewCount) })
  }))
);

// ── 单一来源的 findings 收集器 ──
interface Finding {
  check: string;
  severity: "P0" | "P1" | "P2";
  cardId: string;
  origin: string;
  detail: string;
  sample: string;
}
const findings: Finding[] = [];
/**
 * 每个检查项的**真实命中数**与 severity——与 findings 分开维护：
 * findings 为控制 JSON 体积只留样本（每项 ≤ 8 条），计数若也从它派生就会低报。
 */
const tally = new Map<string, { count: number; severity: Finding["severity"] }>();
const record = (check: string, severity: Finding["severity"], scan: ScanCard, detail: string, sample: string): void => {
  const bucket = tally.get(check) ?? { count: 0, severity };
  bucket.count += 1;
  tally.set(check, bucket);
  if (findings.filter((finding) => finding.check === check).length < 8) {
    findings.push({ check, severity, cardId: scan.id, origin: scan.origin, detail, sample });
  }
};

/**
 * 已知基线上界（2026-09-21 扫描）。**用占比而非绝对数**——课程库仍在增长
 * （扫描期间从 192 课 3590 卡涨到 193 课 3609 卡），绝对数门禁会因内容扩量误报。
 * 扫描时源码修订：
 *   grammarReviewService.ts sha256 46332d91…
 *   grammarLessons.ts        sha256 ad37a95a…（193 课）
 *   huntCases.ts             sha256 2be0c024…（202 案）
 * 回归门禁：只允许变好，不允许变差（占比上界 = 基线占比 × 1.1 + 少量绝对容差）。
 */
const BASELINE = {
  /** 答案词仍出现在题面里（泄题）：扫描时为 0，必须保持 0 */
  clozeAnswerVisibleInPrompt: 0,
  /** 选项不足 4 个的 cloze 占比（扫描时 656/3609 = 18.2%） */
  clozeFewerThanFourOptionsRatio: 0.182,
  /** 只有 1 个选项的 cloze 占比（扫描时 291/3609 = 8.1%） */
  clozeSingleOptionRatio: 0.081,
  /** sentence 词数 < 2 或 无句末标点的卡占比（扫描时 371/451 of 3609 = 10~12.5%） */
  sentenceNotASentenceRatio: 0.125,
  /** free_type 题面复述答案的占比（扫描时 1/3609） */
  freeTypePromptEchoesAnswer: 1,
  /** hunt 卡面混入中文修正括注（扫描时 4 张卡 / 每卡 3 型） */
  huntCardCjkInFront: 4,
  /** 同一案件产生多张 front 相同的卡（扫描时 745 卡 → 543 张是重复；见 2.6b） */
  huntDuplicateCards: 581, // 批四十七：+L204 后 577→581（数据增长）
  /** 词块数 < 2 的 rebuild 占比（扫描时 371/3609 = 10.3%） */
  rebuildTooFewChunksRatio: 0.103,
  /** 多词句打乱后仍等于原句（首尾同形兜底失效）占比（扫描时 1/3609） */
  rebuildAlreadySolvedRatio: 0.001,
  /** hunt cloze 的正确答案是中文括注片段（扫描时 3 题，随挖空位变化在 2–7 之间） */
  huntClozeAnswerIsChineseFragment: 7,
  /** 复习 cloze 干扰项不是真词（扫描时 8 个去重词：mustn't + hunt 中文括注碎片） */
  distractorNotRealWord: 8,
  /** cloze 答案词仍在题面（扫描时含 hunt 修正句的 4 例） */
  clozeAnswerVisible: 4
};

describe("GQ1 · 复习卡生成题全库扫描（A 可作答性 / B 语义一致 / C 干扰项 / D 判分）", () => {
  it("扫描覆盖：枚举出的卡片与生成的任务量（证明覆盖面）", () => {
    const byOrigin = new Map<string, number>();
    for (const scan of cards) {
      const key = scan.origin.split(" ")[1] ?? scan.origin;
      byOrigin.set(key, (byOrigin.get(key) ?? 0) + 1);
    }
    const modeCounts = new Map<string, number>();
    for (const entry of tasks) modeCounts.set(entry.task.mode, (modeCounts.get(entry.task.mode) ?? 0) + 1);
    console.log("[GQ1] 卡片数:", cards.length, "任务数:", tasks.length, "free_type flag:", isFreeTypeReviewEnabled());
    console.log("[GQ1] 题型分布:", [...modeCounts.entries()]);
    console.log("[GQ1] 来源分布(前 12):", [...byOrigin.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12));
    expect(cards.length).toBeGreaterThan(3000);
    expect(tasks.length).toBe(cards.length * reviewCountsForScan.length);
  });

  // ── A4 全题型：answer / sentence 非空；sentence 合法英文句 ──
  it("A4-1 sentence 非空且是合法英文句（≥2 词 + 句末标点）", () => {
    const empty: string[] = [];
    const shortIds = new Set<string>();
    const unpunctuatedIds = new Set<string>();
    for (const entry of tasks) {
      if (!entry.task.sentence.trim()) empty.push(entry.scan.id);
      const tokenCount = words(entry.task.sentence).length;
      const punctuated = hasSentenceEnd(entry.task.sentence);
      if (tokenCount < 2) shortIds.add(`${entry.scan.id}|${entry.scan.front}`);
      if (!punctuated) unpunctuatedIds.add(`${entry.scan.id}|${entry.scan.front}`);
      if (entry.scan.id === tasks.find((item) => item.scan.id === entry.scan.id)?.scan.id && (tokenCount < 2 || !punctuated)) {
        record(
          "sentenceNotASentence",
          tokenCount < 2 ? "P2" : "P1",
          entry.scan,
          tokenCount < 2 ? `sentence 只有 ${tokenCount} 个词（课内 guided 单词语答案是入队来源）` : `sentence 无句末标点`,
          `sentence="${entry.task.sentence}"`
        );
      }
    }
    expect(empty, `sentence 为空的卡：${empty.slice(0, 5).join(", ")}`).toEqual([]);
    console.log("[GQ1] A4-1 卡数不足 2 词（去重）:", shortIds.size, "无句末标点（去重）:", unpunctuatedIds.size);
    console.log("[GQ1] A4-1 全部为「课内 guided 单词语答案」入队所致，样本:", [...shortIds].slice(0, 4));
    const shortRatio = shortIds.size / cards.length;
    const unpunctuatedRatio = unpunctuatedIds.size / cards.length;
    console.log("[GQ1] A4-1 占比:", `词数<2 = ${(shortRatio * 100).toFixed(1)}%`, `无句末标点 = ${(unpunctuatedRatio * 100).toFixed(1)}%`);
    expect(shortRatio).toBeLessThanOrEqual(BASELINE.sentenceNotASentenceRatio);
    expect(unpunctuatedRatio).toBeLessThanOrEqual(BASELINE.sentenceNotASentenceRatio + 0.02);
  });

  it("A4-2 cloze/rebuild 的 answer 字段语义（free_type 的 answer 恒为空是模式约定）", () => {
    const clozeEmptyAnswer: string[] = [];
    const unexpectedModeAnswer: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode === "cloze") {
        if (!task.answer.trim()) clozeEmptyAnswer.push(entry.scan.id);
        continue;
      }
      // rebuild / free_type 页面只用 sentence 判分（GrammarReviewPage:141/151），answer 不参与
      if (task.answer !== "") unexpectedModeAnswer.push(`${entry.scan.id}:${task.mode}="${task.answer}"`);
    }
    expect(clozeEmptyAnswer, `cloze 的 answer 为空：${clozeEmptyAnswer.slice(0, 5).join(", ")}`).toEqual([]);
    expect(unexpectedModeAnswer, `rebuild/free_type 的 answer 非空（页面不读该字段，仅契约噪音）`).toEqual([]);
    console.log("[GQ1] A4-2 rebuild/free_type 的 answer 恒为空（模式约定，非缺陷；页面判分只用 sentence）");
  });

  // ── A1 cloze ──
  it("A1-1 cloze 空位恰好 1 个、答案非空、答案确实来自被挖掉的那个词", () => {
    const blankCountWrong: string[] = [];
    const emptyAnswer: string[] = [];
    const answerNotBlanked: string[] = [];
    let singleWordCards = 0;
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "cloze") continue;
      const blanks = (task.promptText.match(/____/g) ?? []).length;
      if (!task.answer.trim()) emptyAnswer.push(entry.scan.id);
      // 单词语卡（front 只有 1 个词）没有句子可挖：题面改为来源锚点，没有空位属于设计（见 buildGrammarReviewTask）
      if (words(task.sentence).length <= 1) {
        singleWordCards += 1;
        continue;
      }
      if (blanks !== 1) blankCountWrong.push(`${entry.scan.id} blanks=${blanks} "${task.promptText}"`);
      // 被挖的位置原本就应该等于 answer（cleanToken 后）
      const blankIndex = words(task.promptText).findIndex((token) => token === "____");
      const originalTokens = words(task.sentence);
      const originalAtBlank = blankIndex >= 0 ? cleanToken(originalTokens[blankIndex] ?? "") : "";
      if (originalAtBlank && cleanToken(task.answer) !== originalAtBlank) {
        answerNotBlanked.push(`${entry.scan.id} blank=#${blankIndex} answer="${task.answer}" original="${originalAtBlank}"`);
      }
    }
    console.log("[GQ1] A1-1 单词语卡（题面走来源锚点、无空位）:", singleWordCards);
    expect(blankCountWrong, `空位数量不为 1：${blankCountWrong.slice(0, 5).join(" ;; ")}`).toEqual([]);
    expect(emptyAnswer, `cloze answer 为空：${emptyAnswer.slice(0, 5).join(", ")}`).toEqual([]);
    expect(answerNotBlanked, `answer 与该位置原词不一致：${answerNotBlanked.slice(0, 5).join(" ;; ")}`).toEqual([]);
    console.log("[GQ1] A1-1 通过：多词句空位恒为 1，答案恒来自被挖位置（0 命中）");
  });

  it("A1-2 cloze 恰好一个正确答案、答案在选项里、选项无重复", () => {
    const notExactlyOne: string[] = [];
    const answerMissing: string[] = [];
    const duplicates: string[] = [];
    const equivalentDistractor: string[] = [];
    let probes = 0;
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "cloze") continue;
      probes += 1;
      if (!task.options.includes(task.answer)) {
        answerMissing.push(`${entry.scan.id} answer="${task.answer}" options=${JSON.stringify(task.options)}`);
      }
      const correctCount = task.options.filter((option) => judgeGrammarCloze(option, task.answer)).length;
      if (correctCount !== 1) {
        notExactlyOne.push(`${entry.scan.id} correct=${correctCount} answer="${task.answer}" options=${JSON.stringify(task.options)}`);
      }
      const normed = task.options.map(judgeNorm);
      if (new Set(normed).size !== normed.length) {
        duplicates.push(`${entry.scan.id} options=${JSON.stringify(task.options)}`);
      }
      for (const option of task.options) {
        if (option === task.answer) continue;
        if (judgeNorm(option) === judgeNorm(task.answer)) {
          equivalentDistractor.push(`${entry.scan.id} answer="${task.answer}" option="${option}"`);
        }
      }
    }
    console.log("[GQ1] A1-2 扫描 cloze 题数:", probes);
    if (equivalentDistractor.length > 0) {
      for (const sample of equivalentDistractor.slice(0, 5)) {
        const id = sample.split(" ")[0];
        const scan = cards.find((item) => item.id === id);
        if (scan) record("clozeEquivalentDistractor", "P0", scan, "干扰项与答案在判分口径下等价", sample);
      }
    }
    expect(notExactlyOne, `正确答案数量 != 1：${notExactlyOne.slice(0, 5).join(" ;; ")}`).toEqual([]);
    expect(answerMissing, `答案不在选项里：${answerMissing.slice(0, 5).join(" ;; ")}`).toEqual([]);
    expect(duplicates, `选项重复：${duplicates.slice(0, 5).join(" ;; ")}`).toEqual([]);
    expect(equivalentDistractor, `干扰项与答案判分等价（用户选它必判错，但其实是同一答案）`).toEqual([]);
  });

  it("A1-3 cloze 挖掉的必须是「可挖」的实词，且题面不得泄漏答案", () => {
    const improperBlank: string[] = [];
    const leaked: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "cloze") continue;
      const cleaned = cleanToken(task.answer);
      // 可挖词判据：至少 3 个字母（contentTokenIndexes 的口径）且不是纯标点/数字
      if (cleaned.length < 3 || !/[A-Za-z]{3}/.test(cleaned)) {
        improperBlank.push(`${entry.scan.id} answer="${task.answer}" prompt="${task.promptText}"`);
        {
          record(
            "clozeBlankNotContentWord",
            "P1",
            entry.scan,
            `挖空词 "${task.answer}" 不满足「可挖实词」口径（<3 字母或非字母）`,
            `prompt="${task.promptText}"`
          );
        }
      }
      // 泄题：答案词仍出现在题面其它位置（题面已改为「只挖唯一出现词」，此处应恒为 0）
      const stripped = words(task.promptText).filter((token) => token !== "____").map(contentNorm);
      if (cleaned && stripped.includes(contentNorm(cleaned))) {
        leaked.push(`${entry.scan.id} answer="${task.answer}" prompt="${task.promptText}"`);
        {
          record(
            "clozeAnswerVisibleInPrompt",
            "P1",
            entry.scan,
            `答案词 "${task.answer}" 仍出现在题面里（可直接照抄）`,
            `prompt="${task.promptText}"`
          );
        }
      }
    }
    console.log("[GQ1] A1-3 挖空非实词:", improperBlank.length, "题面泄漏答案:", leaked.length, "基线:", BASELINE.clozeAnswerVisibleInPrompt);
    expect(improperBlank.length / cards.length).toBeLessThanOrEqual(BASELINE.sentenceNotASentenceRatio);
    expect(leaked.length).toBeLessThanOrEqual(BASELINE.clozeAnswerVisible);
  });

  it("A1-4 cloze 选项数量（充足性）：<4 时记录，作为 P1 质量项", () => {
    const histogram = new Map<number, number>();
    let shortCount = 0;
    let singleOption = 0;
    const singleOptionSamples: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "cloze") continue;
      histogram.set(task.options.length, (histogram.get(task.options.length) ?? 0) + 1);
      if (task.options.length < 4) {
        shortCount += 1;
        record(
          "clozeFewerThanFourOptions",
          "P1",
          entry.scan,
          `只有 ${task.options.length} 个选项（设计为四选一）`,
          `options=${JSON.stringify(task.options)} prompt="${task.promptText}"`
        );
      }
      if (task.options.length <= 1) {
        singleOption += 1;
        record(
          "clozeSingleOption",
          "P1",
          entry.scan,
          "只有一个选项：点一下即通过（没有干扰项的选择题）",
          `answer="${task.answer}" options=${JSON.stringify(task.options)} card.front="${entry.scan.front}"`
        );
        if (singleOptionSamples.length < 6) {
          singleOptionSamples.push(`${entry.scan.id} answer="${task.answer}" options=${JSON.stringify(task.options)} card.front="${entry.scan.front}"`);
        }
      }
    }
    console.log("[GQ1] A1-4 选项数分布:", [...histogram.entries()].sort((a, b) => a[0] - b[0]));
    console.log("[GQ1] A1-4 不足 4 个选项:", shortCount, "其中只有 1 个选项:", singleOption);
    console.log("[GQ1] A1-4 单选项样本:", singleOptionSamples);
    console.log("[GQ1] A1-4 占比:", `不足 4 个 = ${((shortCount / cards.length) * 100).toFixed(1)}%`, `只有 1 个 = ${((singleOption / cards.length) * 100).toFixed(1)}%`);
    expect(shortCount / cards.length).toBeLessThanOrEqual(BASELINE.clozeFewerThanFourOptionsRatio);
    expect(singleOption / cards.length).toBeLessThanOrEqual(BASELINE.clozeSingleOptionRatio);
  });

  it("A1-5 cloze 题面必须给出可用上下文（整句挖空 或 来源锚点）", () => {
    const noContext: string[] = [];
    const anchored: string[] = [];
    for (const entry of tasks) {
      const { task, scan } = entry;
      if (task.mode !== "cloze") continue;
      const singleWordCard = words(task.sentence).length <= 1;
      if (!singleWordCard) continue;
      // 单词语卡在新契约下应改用来源锚点题面（card.note + 「这句里的词是什么？」）
      const hasAnchor = scan.note.trim().length > 0 && task.promptText.includes(scan.note.trim());
      if (!hasAnchor) {
        noContext.push(`${scan.id} prompt="${task.promptText}" note="${scan.note}"`);
        record("clozeNoContext", "P0", scan, "单词语卡的 cloze 题面既无上下文也无来源锚点，用户无法作答", `prompt="${task.promptText}"`);
      } else {
        anchored.push(`${scan.id} prompt="${task.promptText}"`);
      }
    }
    console.log("[GQ1] A1-5 单词语卡走来源锚点:", anchored.length, "样本:", anchored.slice(0, 3));
    console.log("[GQ1] A1-5 无上下文、无锚点:", noContext.length);
    expect(noContext, `无上下文 cloze（用户被卡住）：${noContext.slice(0, 5).join(" ;; ")}`).toEqual([]);
  });

  // ── A2 rebuild ──
  it("A2-1 rebuild 词块是原句的多重集排列（一个不多一个不少）", () => {
    const notPermutation: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "rebuild") continue;
      const original = words(task.sentence).slice().sort().join(" ");
      const scrambled = task.scrambled.slice().sort().join(" ");
      if (original !== scrambled) {
        notPermutation.push(`${entry.scan.id} sentence="${task.sentence}" scrambled=${JSON.stringify(task.scrambled)}`);
      }
    }
    expect(notPermutation, `打乱后不是原句排列：${notPermutation.slice(0, 5).join(" ;; ")}`).toEqual([]);
    console.log("[GQ1] A2-1 通过：打乱结果恒为原句多重集排列（0 命中）");
  });

  it("A2-2 rebuild 打乱后不等于原句，且词块数 ≥ 2", () => {
    const alreadySolvedMultiWord: string[] = [];
    const singleWordCards: string[] = [];
    const tooFewChunks: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "rebuild") continue;
      // 单词语卡：sentence 只有 1 个词，scrambled 恒等于 [自身]——结构性不可拆，单独归类
      if (words(task.sentence).length <= 1) {
        singleWordCards.push(`${entry.scan.id} sentence="${task.sentence}"`);
        tooFewChunks.push(`${entry.scan.id} sentence="${task.sentence}"`);
        {
          record(
            "rebuildTooFewChunks",
            "P0",
            entry.scan,
            "词块数 1 < 2：只有一个块，点一下即通过（题目无意义；卡源是课内 guided 单词语答案）",
            `sentence="${task.sentence}" scrambled=${JSON.stringify(task.scrambled)}`
          );
        }
        continue;
      }
      if (task.scrambled.join(" ") === task.sentence.trim()) {
        alreadySolvedMultiWord.push(`${entry.scan.id} "${task.sentence}"`);
        record(
          "rebuildAlreadySolved",
          "P0",
          entry.scan,
          "多词句打乱结果恰好等于原句：不用做就对了（「若相等则交换首尾」兜底在首尾词相同时失效）",
          `sentence="${task.sentence}" scrambled=${JSON.stringify(task.scrambled)}`
        );
      }
      if (task.scrambled.length < 2) tooFewChunks.push(`${entry.scan.id} "${task.sentence}"`);
    }
    console.log("[GQ1] A2-2 多词句打乱后仍等于原句:", alreadySolvedMultiWord.length, alreadySolvedMultiWord);
    console.log("[GQ1] A2-2 单词语卡（词块数 1，与 A4-1 同源）:", singleWordCards.length);
    // 已知缺陷（P0 已登记）：首尾词相同时「交换首尾」兜底失效——见 A2-3 与报告 GQ1-P0-2
    console.log("[GQ1] A2-2 占比:", `打乱==原句 = ${((alreadySolvedMultiWord.length / cards.length) * 100).toFixed(2)}%`, `词块<2 = ${((tooFewChunks.length / cards.length) * 100).toFixed(1)}%`);
    expect(alreadySolvedMultiWord.length / cards.length).toBeLessThanOrEqual(BASELINE.rebuildAlreadySolvedRatio);
    expect(tooFewChunks.length / cards.length).toBeLessThanOrEqual(BASELINE.rebuildTooFewChunksRatio);
  });

  it("A2-3 rebuild 首尾词相同的句子：兜底交换是否真的打乱（真实语料探针）", () => {
    // 首尾同形的句子是「交换首尾」兜底的边界：交换后可能仍是原序
    const firstLastSame = cards.filter((scan) => {
      const tokenList = words(scan.front);
      return tokenList.length > 1 && tokenList[0] === tokenList[tokenList.length - 1];
    });
    const stillSolved: string[] = [];
    for (const scan of firstLastSame) {
      const task = buildGrammarReviewTask({ card: makeCard(scan), schedule: makeSchedule(scan.id, 1) });
      if (task.mode !== "rebuild") continue;
      if (task.scrambled.join(" ") === task.sentence.trim()) {
        stillSolved.push(`${scan.id}「${scan.front}」scrambled=${JSON.stringify(task.scrambled)}`);
        record(
          "rebuildFallbackIneffective",
          "P0",
          scan,
          "首尾词相同导致「若相等则交换首尾」兜底失效，打乱后仍等于原句",
          `sentence="${scan.front}" scrambled=${JSON.stringify(task.scrambled)}`
        );
      }
    }
    console.log("[GQ1] A2-3 首尾同形的卡:", firstLastSame.length, firstLastSame.map((scan) => `${scan.id}「${scan.front}」`));
    console.log("[GQ1] A2-3 其中打乱后仍等于原句:", stillSolved);
    expect(stillSolved.length).toBeLessThanOrEqual(Math.ceil(BASELINE.rebuildAlreadySolvedRatio * cards.length) + 3);
  });

  // ── A3 free_type：题面不得写出完整答案 ──
  it("A3-1 free_type 题面（promptText）不含完整答案；note 含答案的卡单独统计", () => {
    const noteContainsFront: string[] = [];
    const promptContainsFront: string[] = [];
    let freeTypeCount = 0;
    for (const entry of tasks) {
      const { task, scan } = entry;
      if (task.mode !== "free_type") continue;
      freeTypeCount += 1;
      if (scan.note.includes(scan.front)) {
        noteContainsFront.push(`${scan.id} note="${scan.note}" front="${scan.front}"`);
        record(
          "freeTypePromptEchoesAnswer",
          "P2",
          scan,
          "卡片 note 里含完整答案文本，free_type 题面直接引用 note（泄题）",
          `note="${scan.note}" front="${scan.front}"`
        );
      }
      if (task.promptText.includes(scan.front)) {
        promptContainsFront.push(`${scan.id} prompt="${task.promptText}"`);
      }
    }
    console.log("[GQ1] A3-1 free_type 题数:", freeTypeCount, "note 含完整答案:", noteContainsFront.length, "题面含完整答案:", promptContainsFront.length);
    console.log("[GQ1] A3-1 命中样本:", noteContainsFront.slice(0, 5));
    expect(promptContainsFront.length).toBeLessThanOrEqual(BASELINE.freeTypePromptEchoesAnswer);
    expect(noteContainsFront.length).toBeLessThanOrEqual(BASELINE.freeTypePromptEchoesAnswer);
  });

  it("A3-2 free_type 题面是否给出可作答抓手（信息量审计，非门禁）", () => {
    const noIntent: Array<{ id: string; prompt: string; answer: string }> = [];
    for (const entry of tasks) {
      const { task, scan } = entry;
      if (task.mode !== "free_type") continue;
      // 题面形态：① 有 note → "note——把那句话自己写出来"；② 无 note → "把那句 N 个词的句子自己写出来"
      const anchored = /^(语法课|找错案件|我的英文日记)/.test(task.promptText);
      if (!anchored || !/[\u4e00-\u9fa5]/.test(scan.note)) {
        noIntent.push({ id: scan.id, prompt: task.promptText, answer: task.sentence });
      }
    }
    console.log("[GQ1] A3-2 free_type 题面无来源锚点/无中文意图:", noIntent.length, "样本:", noIntent.slice(0, 3));
    console.log("[GQ1] A3-2 说明：课内 recall/boost 档 2/3 都给中文意图（intentZh），复习 free_type 只给「来源标题」，属于信息量落差");
  });

  // ── B 语义一致 ──
  it("B-1 hunt 来源卡的题面必须是纯英文句子（不许混入中文修正括注）", () => {
    // huntService.correctedSentenceOf 会把 errors[].correction 原样写回句子。
    // 数据里有一类 correction 是**给用户看的括注**（「（So 与 do I 对调）」），
    // 不是可替换的词——它们若不在 `^（?去掉` 的删词分支里，就会把整段中文写进卡面。
    const broken: string[] = [];
    let huntCardCount = 0;
    const seen = new Set<string>();
    for (const scan of cards) {
      if (!scan.id.startsWith("hunt:")) continue;
      if (seen.has(scan.front)) continue;
      seen.add(scan.front);
      huntCardCount += 1;
      if (!/^[\x20-\x7E]+$/.test(scan.front)) {
        broken.push(`${scan.id} front="${scan.front}"`);
        {
          record(
            "huntCardCjkInFront",
            "P0",
            scan,
            "卡面（题面/答案基准）混入了中文修正括注：句子不是英文、cloze 会挖出中文片段、rebuild 会有中文词块",
            `front="${scan.front}"`
          );
        }
      }
    }
    console.log("[GQ1] B-1 hunt 卡（去重卡面）:", huntCardCount, "卡面含非 ASCII（中文括注混入）:", broken.length);
    console.log(broken.join("\n"));
    console.log("[GQ1] B-1 已知 4 例来源：hunt-so-do-i / hunt-would-rather-walk / hunt-prefer-tea / hunt-why-dont-you-rest");
    expect(broken.length).toBeLessThanOrEqual(BASELINE.huntCardCjkInFront);
  });

  it("B-1b hunt 来源卡的答案不得是中文修正括注的片段", () => {
    const bad: string[] = [];
    for (const entry of tasks) {
      const { scan, task } = entry;
      if (!scan.id.startsWith("hunt:")) continue;
      if (task.mode !== "cloze") continue;
      // 正确答案里出现中文/全角括号 = 挖空落在括注片段上
      if (/[\u4e00-\u9fa5（）]/.test(task.answer)) {
        bad.push(`${scan.id} answer="${task.answer}" prompt="${task.promptText.slice(0, 90)}"`);
        {
          record(
            "huntClozeAnswerIsChineseFragment",
            "P0",
            scan,
            "cloze 的「正确答案」是中文括注的片段（如「（rather」「对调）」）：无论选什么都荒谬",
            `answer="${task.answer}" options 见 prompt="${task.promptText.slice(0, 90)}"`
          );
        }
      }
    }
    console.log("[GQ1] B-1b cloze 正确答案是中文括注片段:", bad.length);
    console.log(bad.join("\n"));
    expect(bad.length).toBeLessThanOrEqual(BASELINE.huntClozeAnswerIsChineseFragment);
  });

  it("B-1c 同一案件的重复卡（front 完全相同）——复习会话里会连着出同一句话", () => {
    // huntService 为**每一个错点**都建一张卡（幂等键 = 案件 + 罪名 + 原错词），
    // 而 2026-09-21 的修复让同案的每张卡正面都是**同一句修正后的完整句**。
    // 于是同一句话会以 N 张卡的形式进入 SM-2 队列，同一场复习里连出 N 遍。
    const byFront = new Map<string, string[]>();
    for (const scan of cards) {
      if (!scan.id.startsWith("hunt:")) continue;
      const bucket = byFront.get(scan.front) ?? [];
      bucket.push(scan.id);
      byFront.set(scan.front, bucket);
    }
    const duplicated = [...byFront.entries()].filter(([, ids]) => ids.length > 1);
    const extraCards = duplicated.reduce((sum, [, ids]) => sum + ids.length - 1, 0);
    console.log("[GQ1] B-1c 有重复卡的句子:", duplicated.length, "| 多出来的重复卡:", extraCards, "| hunt 卡总数:", cards.filter((scan) => scan.id.startsWith("hunt:")).length);
    console.log("[GQ1] B-1c 样本:", duplicated.slice(0, 5).map(([front, ids]) => `${ids.length} 张 ← "${front.slice(0, 60)}…"`));
    for (const [front, ids] of duplicated) {
      const scan = cards.find((item) => item.id === ids[0]);
      if (scan) {
        record(
          "huntDuplicateCardsSameFront",
          "P1",
          scan,
          `同一案件的 ${ids.length} 张卡正面完全相同（同一句话会在一次复习里出现 ${ids.length} 次）`,
          `front="${front.slice(0, 80)}…" ids=${ids.slice(0, 4).join(", ")}`
        );
      }
    }
    console.log("[GQ1] B-1c 影响：一次复习上限 10 张，同一案件可吃掉最多 7 张（全库最大 errors 数）——复习容量被重复句挤占");
    expect(extraCards).toBeLessThanOrEqual(BASELINE.huntDuplicateCards);
  });

  it("B-2 题面与答案指向同一句话（结构校验）", () => {
    const mismatched: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode === "rebuild") {
        // rebuild 的题面是固定引导语；句子本体靠词块给出，必须至少 2 块才谈得上「拼回去」
        if (!/点回去|拼出/.test(task.promptText)) mismatched.push(`${entry.scan.id} rebuild prompt="${task.promptText}"`);
        if (task.scrambled.length < 2 && words(task.sentence).length >= 2) {
          mismatched.push(`${entry.scan.id} rebuild 词块不足 sentence="${task.sentence}"`);
        }
      }
      if (task.mode === "cloze") {
        const singleWordCard = words(task.sentence).length <= 1;
        if (!singleWordCard && !task.promptText.includes("____")) {
          mismatched.push(`${entry.scan.id} cloze 题面无空位 "${task.promptText}"`);
        }
      }
      if (task.mode === "free_type" && !/写/.test(task.promptText)) {
        mismatched.push(`${entry.scan.id} free_type 题面无「写」指令 prompt="${task.promptText}"`);
      }
    }
    expect(mismatched, `题面与答案结构不匹配：${mismatched.slice(0, 5).join(" ;; ")}`).toEqual([]);
    console.log("[GQ1] B-2 通过：三种题型的题面结构都与答案一致（0 命中）");
  });

  // ── C 干扰项质量 ──
  it("C-1 干扰项必须是真实英语词（不得是加后缀硬造的词）", () => {
    const fabricated = new Map<string, string>();
    const numeral = new Map<string, string>();
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "cloze") continue;
      for (const option of task.options) {
        if (option === task.answer) continue;
        const lower = option.toLowerCase();
        // 数字：不是「造词」，但同样是一眼可排除的废干扰项，单独归类
        if (/^[0-9]+$/.test(lower)) {
          if (!numeral.has(lower)) numeral.set(lower, `${entry.scan.id} answer="${task.answer}"`);
          continue;
        }
        if (!isRealEnglishWord(lower)) {
          if (!fabricated.has(lower)) fabricated.set(lower, `${entry.scan.id} answer="${task.answer}"`);
        }
      }
    }
    const residue = [...fabricated.entries()];
    console.log("[GQ1] C-1 全库复习 cloze 干扰项中的「非真词」:", residue.length);
    console.log(residue.map(([word, where]) => `  ${word}  <- ${where}`).join("\n"));
    console.log("[GQ1] C-1 数字型干扰项:", numeral.size, [...numeral.keys()].slice(0, 10));
    for (const [word, where] of residue) {
      const id = where.split(" ")[0];
      const scan = cards.find((item) => item.id === id);
      if (scan) record("distractorNotRealWord", "P0", scan, `干扰项 "${word}" 不是英语词`, where);
    }
    expect(residue.length).toBeLessThanOrEqual(BASELINE.distractorNotRealWord);
  });

  it("C-2 有效干扰项 ≥ 2 的占比（真词 + 槽位相容，不看是否句内可见）", () => {
    let items = 0;
    let good = 0;
    const histogram = new Map<number, number>();
    const badSamples: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "cloze") continue;
      items += 1;
      const valid = task.options.filter((option) => {
        if (option === task.answer) return false;
        if (judgeNorm(option) === judgeNorm(task.answer)) return false;
        if (/^[0-9]+$/.test(option)) return false;
        if (!isRealEnglishWord(option)) return false;
        return slotCompatible(task.answer, option);
      }).length;
      histogram.set(valid, (histogram.get(valid) ?? 0) + 1);
      if (valid >= 2) good += 1;
      else {
        const sample = `${entry.scan.id} answer="${task.answer}" options=${JSON.stringify(task.options)} prompt="${task.promptText}" 有效=${valid}`;
        record("weakDistractors", "P1", entry.scan, `有效干扰项只有 ${valid} 个（题目近似白送）`, sample);
        if (badSamples.length < 8) badSamples.push(sample);
      }
    }
    console.log("[GQ1] C-2 有效干扰项 ≥2 的题:", `${good}/${items}`, `= ${((good / items) * 100).toFixed(1)}%`);
    console.log("[GQ1] C-2 有效干扰项数分布:", [...histogram.entries()].sort((a, b) => a[0] - b[0]));
    console.log("[GQ1] C-2 典型不达标本:", badSamples);
    expect(good / items).toBeGreaterThan(0.4);
  });

  // ── D 判分自洽 ──
  it("D-1 cloze：正确答案必判对；每个干扰项必判错", () => {
    const wrongPositive: string[] = [];
    const wrongNegative: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "cloze") continue;
      if (!judgeGrammarCloze(task.answer, task.answer)) wrongPositive.push(`${entry.scan.id} answer="${task.answer}"`);
      for (const option of task.options) {
        if (option === task.answer) continue;
        if (judgeGrammarCloze(option, task.answer)) {
          wrongNegative.push(`${entry.scan.id} option="${option}" answer="${task.answer}"`);
        }
      }
    }
    expect(wrongPositive, `正解被判错：${wrongPositive.slice(0, 5).join(", ")}`).toEqual([]);
    expect(wrongNegative, `干扰项被判对：${wrongNegative.slice(0, 5).join(", ")}`).toEqual([]);
    console.log("[GQ1] D-1 通过：cloze 正解判对、全部干扰项判错（0 命中）");
  });

  it("D-2 rebuild：按原序提交必判对；打乱序必判错", () => {
    const wrongPositive: string[] = [];
    const wrongNegative: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "rebuild") continue;
      const inOrder = words(task.sentence);
      if (!judgeGrammarRebuild(inOrder, task.sentence)) wrongPositive.push(`${entry.scan.id} "${task.sentence}"`);
      // 反向：交换两个不同词的位置（若能构造出不同序列）
      const swapped = [...inOrder];
      const swapAt = swapped.findIndex((token, index) => index > 0 && token !== swapped[0]);
      if (swapAt > 0) {
        [swapped[0], swapped[swapAt]] = [swapped[swapAt], swapped[0]];
        if (judgeGrammarRebuild(swapped, task.sentence)) {
          wrongNegative.push(`${entry.scan.id} "${task.sentence}" swapped=${JSON.stringify(swapped)}`);
        }
      }
    }
    expect(wrongPositive, `按原序提交被判错：${wrongPositive.slice(0, 5).join(", ")}`).toEqual([]);
    expect(wrongNegative, `错序被判对：${wrongNegative.slice(0, 5).join(", ")}`).toEqual([]);
    console.log("[GQ1] D-2 通过：rebuild 正序判对、错序判错（0 命中）");
  });

  it("D-3 free_type：照抄原句必通过；空串/空格/全角/明显错句必不通过", () => {
    const wrongPositive: string[] = [];
    const wrongNegative: string[] = [];
    const fwPass: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "free_type") continue;
      const exact = judgeGrammarFreeType(task.sentence, task.sentence);
      if (!exact.passed) wrongPositive.push(`${entry.scan.id} score=${exact.score}`);
      for (const [label, value] of [
        ["empty", ""],
        ["spaces", "   "],
        ["wrong", "zzz qqq zzz"],
        ["fullwidth", "。"]
      ] as Array<[string, string]>) {
        const result = judgeGrammarFreeType(value, task.sentence);
        if (result.passed) wrongNegative.push(`${entry.scan.id} ${label} score=${result.score}`);
      }
      // 全角句末标点：中文输入法高频，必须仍判对
      const fullWidthEnd = task.sentence.replace(/[.!?]$/, "。");
      if (!judgeGrammarFreeType(fullWidthEnd, task.sentence).passed) fwPass.push(`${entry.scan.id} "${fullWidthEnd}"`);
      // 大小写混合（全大写）必须仍判对
      const upper = task.sentence.toUpperCase();
      if (!judgeGrammarFreeType(upper, task.sentence).passed) fwPass.push(`UPPER ${entry.scan.id} "${upper}"`);
    }
    expect(wrongPositive, `照抄原句未通过：${wrongPositive.slice(0, 5).join(", ")}`).toEqual([]);
    expect(wrongNegative, `空/错答案被判通过：${wrongNegative.slice(0, 5).join(", ")}`).toEqual([]);
    expect(fwPass, `全角标点或全大写被判错：${fwPass.slice(0, 5).join(" ;; ")}`).toEqual([]);
    console.log("[GQ1] D-3 通过：free_type 正解满分、空/错必败、全角与全大写宽容（0 命中）");
  });

  it("D-4 cloze 边界：空串、纯空格、全角、大小写混合", () => {
    const problems: string[] = [];
    for (const entry of tasks) {
      const { task } = entry;
      if (task.mode !== "cloze") continue;
      for (const value of ["", "   ", "。", "ＡＢＣ"]) {
        if (judgeGrammarCloze(value, task.answer)) problems.push(`${entry.scan.id} 边界值「${value}」被判对`);
      }
      // 大小写宽容：用户看到 "Don't" 选 "don't" 应判对
      if (!judgeGrammarCloze(task.answer.toUpperCase(), task.answer)) {
        problems.push(`${entry.scan.id} 答案全大写被判错 answer="${task.answer}"`);
      }
      if (!judgeGrammarCloze(`  ${task.answer}  `, task.answer)) {
        problems.push(`${entry.scan.id} 答案带空格被判错 answer="${task.answer}"`);
      }
    }
    expect(problems, `cloze 判分边界问题：${problems.slice(0, 8).join(" ;; ")}`).toEqual([]);
    console.log("[GQ1] D-4 通过：空/空格/全角必判错，大小写与首尾空格宽容（0 命中）");
  });

  it("汇总：输出 findings 与统计表（写入 .rvfind/gq1-findings.json）", () => {
    const byCheck = tally;
    const summary = {
      scannedAt: "2026-09-21",
      cards: cards.length,
      tasks: tasks.length,
      byMode: tasks.reduce<Record<string, number>>((acc, entry) => {
        acc[entry.task.mode] = (acc[entry.task.mode] ?? 0) + 1;
        return acc;
      }, {}),
      counts: Object.fromEntries([...byCheck.entries()].map(([check, value]) => [check, value.count])),
      severities: Object.fromEntries([...byCheck.entries()].map(([check, value]) => [check, value.severity])),
      /** 每项最多 8 条样本；完整计数见 counts（由 tally 维护，不受样本截断影响）。 */
      samples: findings.map((finding) => ({
        check: finding.check,
        severity: finding.severity,
        cardId: finding.cardId,
        origin: finding.origin,
        detail: finding.detail,
        sample: finding.sample
      }))
    };
    mkdirSync(".rvfind", { recursive: true });
    writeFileSync(".rvfind/gq1-findings.json", JSON.stringify(summary, null, 2), "utf8");
    console.log("[GQ1] 统计:", JSON.stringify(summary.counts));
    console.log("[GQ1] 严重度:", JSON.stringify(summary.severities));
    for (const [check, value] of byCheck.entries()) {
      console.log(`[GQ1] ${value.severity} ${check}: ${value.count}`);
    }
    expect(findings.length).toBeGreaterThan(0);
  });
});
