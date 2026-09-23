import type { AppData, GateAttempt, GrammarErrorTag, LanguageGate, MisreadBranch } from "../types";
import { compareText, diffScore } from "./diffService";
import { nowIso, uid } from "./storage";

/**
 * 语言之门判定引擎（GRAMMAR_ADVENTURE_PLAN §7.4 三档判定）。
 *
 * P0 只实现规则层（L1）：diffService 词级对齐 + 错位关键词探测 + acceptRegex。
 * 本地模型（L2）与 LLM（L3）的接口在 judge 签名里预留，M3 扩量时接入。
 *
 * 设计纪律（§7.4）：判定结果只用于选择剧情分支，界面永不出现"正确/错误"字样。
 */

export type GateVerdict = "pass" | "near" | "misread";

export interface GateJudgement {
  verdict: GateVerdict;
  /** 命中的 errorTag（misread 档用它匹配误读支线）。 */
  errorTags: GrammarErrorTag[];
  /** 命中的误读支线（misread 档才有；未命中具体支线时由调用方回退到 lampHint）。 */
  branch?: MisreadBranch;
  /** near 档：把玩家句子和参考答案对齐后的词级 diff，供小灯复述用。 */
  score: number;
}

/** 常见不规则动词：原形 → 过去式。误判防护见 detectTenseTag。 */
const IRREGULAR_PAST: Record<string, string> = {
  // ── 起步那批（原有）──
  come: "came",
  go: "went",
  arrive: "arrived",
  leave: "left",
  take: "took",
  get: "got",
  see: "saw",
  say: "said",
  tell: "told",
  give: "gave",
  find: "found",
  bring: "brought",
  buy: "bought",
  meet: "met",
  run: "ran",
  eat: "ate",
  sleep: "slept",
  // ── 2026-09-22 批四十四补：以下 32 个「换零件」动词**课程里已经教过**
  //（L10/L11/L13/L14/L108/L197/L198/L199 等），但此表一直没有它们——
  // 用户写 keeped / swimmed / thinked 时，引擎据此表判断「该用过去式却用了原形」，
  // 表里缺词就等于那条判定对这批动词完全失效。本批补齐。
  //
  // ⚠️ 2026-09-22 批四十八起注：上列 32 项是按**变化模式**整批补的，而课程是**按缺口**
  // 一个一个教的——两者进度不同步，因此表中大部分项的过去式**目前还没在课程里出现过**，
  // 也就无从触发（触发前提见 detectTenseTag：参考答案含过去时间词、且玩家的句子用了该过去式
  // 而参考答案用的是原形）。这些表项**保留**：无害，且一旦将来补上对应课文即可生效。
  //
  // ⚠️ 2026-09-23 批四十九修正：本注释原写「18 项当前永不触发」——这个数字**不准确**。
  // 一方面它的归属混了两批（told/brought 属原有 17 项那批）；另一方面「可触发」的判据
  // 比「课程里出没出现过」更严（还需参考答案含过去时间词），实测可触发项**远少于 18**。
  // **结论不变（表项保留），但不要引用具体数字**——要判断覆盖度请看课程侧的缺口审计，
  // 不要看这张表。
  swim: "swam",
  sing: "sang",
  sit: "sat",
  catch: "caught",
  think: "thought",
  know: "knew",
  keep: "kept",
  feel: "felt",
  draw: "drew",
  break: "broke",
  fall: "fell",
  lose: "lost",
  win: "won",
  hear: "heard",
  write: "wrote",
  speak: "spoke",
  stand: "stood",
  hold: "held",
  spend: "spent",
  build: "built",
  wear: "wore",
  teach: "taught",
  pay: "paid",
  sell: "sold",
  send: "sent",
  ride: "rode",
  drive: "drove",
  fly: "flew",
  grow: "grew",
  begin: "began",
  choose: "chose",
  wake: "woke"
};

const PAST_TIME_HINTS = ["yesterday", "last night", "last week", "last year", "ago", "this morning", "just now"];

const WORD_RE = /[A-Za-z']+/g;

const tokenize = (value: string): string[] => value.toLowerCase().match(WORD_RE) ?? [];

/** 探测"该用过去式却用了原形/现在式"：句子含过去时间词，且目标动词的过去式未出现而原形出现。 */
const detectTenseTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const answerJoined = answerTokens.join(" ");
  const hasPastHint = PAST_TIME_HINTS.some((hint) => answerJoined.includes(hint));
  if (!hasPastHint) return false;

  // 从参考答案里找"参考答案用了过去式、玩家却用了原形"的动词对。
  for (const [base, past] of Object.entries(IRREGULAR_PAST)) {
    const sampleHasPast = sampleTokens.includes(past);
    const answerHasBase = answerTokens.includes(base);
    const answerHasPast = answerTokens.includes(past);
    if (sampleHasPast && answerHasBase && !answerHasPast) return true;
  }
  // 规则动词：参考答案含 -ed 形式，玩家同词根原形出现（如 arrived vs arrive）。
  for (const token of sampleTokens) {
    if (!token.endsWith("ed") || token.length <= 4) continue;
    const stem = token.slice(0, -2);
    const stemD = token.slice(0, -1);
    if ((answerTokens.includes(stem) || answerTokens.includes(stemD)) && !answerTokens.includes(token)) return true;
  }
  return false;
};

/**
 * 探测无时间词的过去式漏用（图书馆批 1 扩展）：
 * sample 含规则 -ed 动词，answer 用了其原形，且 answer 全文无任何 -ed——
 * 用于 "I decided to…" vs "I decide to…" 这类无过去时间锚点的场景。
 */
const detectTenseNoHint = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const sampleEd = sampleTokens.find((token) => token.endsWith("ed") && token.length > 4 && !token.endsWith("eed"));
  if (!sampleEd) return false;
  const stem = sampleEd.slice(0, -2);
  const stemD = sampleEd.slice(0, -1);
  const answerHasEd = answerTokens.some((token) => token.endsWith("ed") && token.length > 4);
  if (answerHasEd) return false;
  return answerTokens.includes(stem) || answerTokens.includes(stemD);
};

/** 探测缺 be：参考答案含 am/are/is/was/were，玩家句子在主语后直接接了形容词/名词（跳过 be）。 */
const detectMissingBeTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const BE = new Set(["am", "are", "is", "was", "were", "'m", "'re", "'s"]);
  const sampleBeIndex = sampleTokens.findIndex((token) => BE.has(token));
  if (sampleBeIndex < 0) return false;
  const answerHasBe = answerTokens.some((token) => BE.has(token));
  if (answerHasBe) return false;
  // 玩家句子里存在参考答案中 be 后面的那个词（如 ready），但前面没有 be。
  const complement = sampleTokens[sampleBeIndex + 1];
  if (!complement) return false;
  const answerComplementIndex = answerTokens.indexOf(complement);
  if (answerComplementIndex < 0) return false;
  const before = answerTokens[answerComplementIndex - 1];
  return Boolean(before) && !BE.has(before ?? "");
};

/** 常见名词的复数形态助手：规则加 -s/-es，及高频不规则。 */
const IRREGULAR_PLURAL: Record<string, string> = {
  child: "children",
  man: "men",
  woman: "women",
  foot: "feet",
  tooth: "teeth",
  mouse: "mice",
  person: "people"
};

const pluralFormOf = (noun: string): string[] => {
  if (IRREGULAR_PLURAL[noun]) return [IRREGULAR_PLURAL[noun]];
  if (/(s|sh|ch|x|z)$/.test(noun)) return [`${noun}es`];
  if (/[^aeiou]y$/.test(noun)) return [`${noun.slice(0, -1)}ies`];
  return [`${noun}s`];
};

/**
 * 探测 plural（集市批 1 新增）：
 * a) 数量词后名词未变复数：two apple / three pear；
 * b) 复数主语配了单数 be：The pears is sweet。
 * 仅在参考答案确实用了复数形态时才探测，避免误伤单数场景。
 */
const detectPluralTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const QUANTIFIERS = new Set(["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "many", "several", "some", "2", "3", "4", "5"]);
  // a) 数量词 + 单数名词（参考答案里该名词是复数）
  for (let index = 0; index < answerTokens.length - 1; index += 1) {
    if (!QUANTIFIERS.has(answerTokens[index])) continue;
    const noun = answerTokens[index + 1];
    // 该名词的复数形式出现在参考答案里，但玩家用了原形
    const plurals = pluralFormOf(noun);
    if (plurals.some((plural) => sampleTokens.includes(plural)) && !plurals.includes(noun)) return true;
  }
  // b) 复数主语（-s 结尾且不在参考答案里作单数）+ is/was
  const answerJoined = answerTokens.join(" ");
  for (const token of sampleTokens) {
    if (!token.endsWith("s") || token.length <= 3) continue;
    if (!answerTokens.includes(token)) continue; // 玩家用了这个复数名词
    const nextIndex = answerTokens.indexOf(token) + 1;
    const next = answerTokens[nextIndex];
    if (next === "is" || next === "was" || next === "isn't") return true;
    if (answerJoined.includes(`${token} is`) || answerJoined.includes(`${token} was`)) return true;
  }
  return false;
};

/**
 * 探测 quantifier（集市批 2 新增）：much/many 误用——问价用 many、数东西用 much 等。
 * 仅在参考答案出现 much/many 时探测。
 */
const detectQuantifierTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const sampleUsesMuch = sampleTokens.includes("much");
  const sampleUsesMany = sampleTokens.includes("many");
  if (sampleUsesMuch && answerTokens.includes("many")) return true;
  if (sampleUsesMany && answerTokens.includes("much")) return true;
  return false;
};

/**
 * 探测 article 的特指误用（集市批 2 扩展）：
 * 参考答案用 the（特指前文提过/双方知道的那个），玩家用了 a/an（泛指）——
 * 如 "I will take a bag" vs "I will take the bag"。仅当 the 后名词与答案中 a/an 后名词一致时判定。
 */
const detectDefiniteTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    if (sampleTokens[index] !== "the") continue;
    const noun = sampleTokens[index + 1];
    const answerIndex = answerTokens.indexOf(noun);
    if (answerIndex > 0) {
      const before = answerTokens[answerIndex - 1];
      if (before === "a" || before === "an") return true;
    }
  }
  return false;
};

/**
 * 探测 comparison（山径批 1 新增，批 2 扩展最高级）：
 * a) than 前用原级（steep than）——比较级缺形态；
 * b) 最高级场景：sample 含 -est/the most，玩家却用了比较级 -er（the higher inn）。
 */
const detectComparisonTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const sampleJoined = sampleTokens.join(" ");
  if (sampleTokens.includes("than")) {
    const sampleHasComparative = sampleTokens.some((token) => token.endsWith("er") || token === "more");
    if (sampleHasComparative) {
      const answerHasComparative = answerTokens.some((token) => token.endsWith("er") || token === "more");
      if (answerTokens.includes("than") && !answerHasComparative) return true;
    }
  }
  // 最高级：sample 含 -est，玩家却用 -er 形态
  const sampleSuperlative = sampleTokens.find((token) => token.endsWith("est") && token.length > 4);
  if (sampleSuperlative && !sampleJoined.includes("than")) {
    const stem = sampleSuperlative.slice(0, -3);
    if (stem.length > 1) {
      const comparative = `${stem}er`;
      if (answerTokens.includes(comparative)) return true;
    }
  }
  return false;
};

/**
 * 探测 fragment·so-that（山径批 2 新增）：so + 形容词引出结果时缺 that 桥。
 */
const detectSoThatTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  if (!sampleTokens.includes("so") || !sampleTokens.includes("that")) return false;
  if (answerTokens.includes("that")) return false;
  const soIndex = sampleTokens.indexOf("so");
  const adjective = sampleTokens[soIndex + 1];
  if (!adjective) return false;
  return answerTokens.includes(adjective);
};

/**
 * 探测 run_on（图书馆批 1 新增）：
 * a) because 与 so 同句连用（中文「因为…所以」的直译病）；
 * b) 连词误用：sample 用 but（转折），answer 用 and（顺承）。
 */
const detectRunOnTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const joined = answerTokens.join(" ");
  if (joined.includes("because") && joined.includes("so")) return true;
  if (joined.includes("although") && joined.includes("but")) return true;
  // b) but → and 误用
  if (sampleTokens.includes("but") && answerTokens.includes("and") && !answerTokens.includes("but")) return true;
  return false;
};

/** 后接不定式的高频动词（to 不可省略）。 */
const TO_VERBS = new Set(["want", "decide", "hope", "need", "plan", "try", "learn", "forget", "remember", "would"]);

/**
 * 探测 verb_form·缺 to（图书馆批 1 新增）：want/decide/hope 等后接光杆动词（want read）。
 * sample 里是 "want to read"，answer 里是 "want read"。
 */
const detectMissingToTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    const token = sampleTokens[index];
    if (!TO_VERBS.has(token)) continue;
    if (sampleTokens[index + 1] !== "to") continue;
    const nextVerb = sampleTokens[index + 2];
    if (!nextVerb) continue;
    // 玩家句：动词后直接跟光杆动词（无 to）
    const answerIndex = answerTokens.indexOf(token);
    if (answerIndex < 0) continue;
    const answerNext = answerTokens[answerIndex + 1];
    if (answerNext === nextVerb && answerNext !== "to") return true;
  }
  return false;
};

/**
 * 探测 verb_form·动名词（图书馆批 2）：enjoy/介词后接 to do 或光杆动词（enjoy to read / for help）。
 * sample 含 "enjoy + Ving" 或 "for + Ving" 时，answer 用 to do / 原形即命中。
 */
const detectGerundTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const GERUND_VERBS = new Set(["enjoy", "finish", "keep", "practice", "mind"]);
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    const token = sampleTokens[index];
    const next = sampleTokens[index + 1];
    const isGerundAfterVerb = GERUND_VERBS.has(token) && next.endsWith("ing");
    const isGerundAfterPrep = (token === "for" || token === "of" || token === "in" || token === "about") && next.endsWith("ing");
    if (!isGerundAfterVerb && !isGerundAfterPrep) continue;
    const stem = next.slice(0, -3); // reading → read; helping → help
    const answerIndex = answerTokens.indexOf(token);
    if (answerIndex < 0) continue;
    const answerNext = answerTokens[answerIndex + 1];
    // a) 动词/介词后接了 to（enjoy to read / for to help）
    if (answerNext === "to") return true;
    // b) 动词/介词后直接接光杆（for help）
    if (answerNext === stem) return true;
  }
  return false;
};

/**
 * 探测 run_on·缺关系词（图书馆批 2）：sample 含 "who/which + 动词"（从句），
 * answer 把关系词丢了，两个动词直接相连（The man helped me is kind）。
 */
const detectMissingRelativeTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    const token = sampleTokens[index];
    if (token !== "who" && token !== "which" && token !== "that") continue;
    const verb = sampleTokens[index + 1];
    if (!verb) continue;
    // answer 里没有关系词
    if (answerTokens.includes("who") || answerTokens.includes("which")) continue;
    // answer 里出现了从句动词，且其前面直接是名词（而非关系词）
    const verbIndex = answerTokens.indexOf(verb);
    if (verbIndex > 0) {
      const before = answerTokens[verbIndex - 1];
      const NOUNS = new Set(["man", "book", "woman", "lamp", "city", "story"]);
      if (NOUNS.has(before)) return true;
    }
  }
  return false;
};

/**
 * 探测 word_order·关系词位置（图书馆批 2）：sample 是 "the book which I read"，
 * answer 把 which/that 拖到句尾（…last week which）。
 */
const detectRelativePositionTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const RELATIVE = new Set(["which", "who", "that"]);
  for (const token of sampleTokens) {
    if (!RELATIVE.has(token)) continue;
    if (!answerTokens.includes(token)) continue;
    // sample 中关系词在句中（后面还有实词），answer 中它在最后一位
    const sampleIndex = sampleTokens.indexOf(token);
    if (sampleIndex >= sampleTokens.length - 2) continue;
    const answerIndex = answerTokens.indexOf(token);
    if (answerIndex === answerTokens.length - 1) return true;
  }
  return false;
};

/**
 * 探测 fragment·从句缺主语（图书馆批 2）：sample 的从句有主语（because I wanted），
 * answer 从句里主语丢了（because want）。
 */
const detectClauseSubjectTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const SUBJECTS = new Set(["i", "she", "he", "we", "they", "you", "it"]);
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    const token = sampleTokens[index];
    if (!["because", "that", "and", "but", "so"].includes(token)) continue;
    const subject = sampleTokens[index + 1];
    if (!SUBJECTS.has(subject)) continue;
    const verb = sampleTokens[index + 2];
    if (!verb) continue;
    // answer：连词后直接是动词（主语丢了）
    const answerConjIndex = answerTokens.indexOf(token);
    if (answerConjIndex < 0) continue;
    const answerNext = answerTokens[answerConjIndex + 1];
    if (answerNext === verb) return true;
  }
  return false;
};

/**
 * 探测 preposition（山径批 1 新增，批 2 扩展方向介词）：
 * 对照参考答案里名词前的介词；玩家在同名词前用了另一个介词即命中。
 */
const detectPrepositionTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const PREPS = new Set(["on", "in", "at", "to", "from", "under", "over", "by", "along", "past", "through", "across", "into"]);
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    if (!PREPS.has(sampleTokens[index])) continue;
    const noun = sampleTokens[index + 1];
    const answerIndex = answerTokens.indexOf(noun);
    if (answerIndex <= 0) continue;
    const answerPrep = answerTokens[answerIndex - 1];
    if (PREPS.has(answerPrep) && answerPrep !== sampleTokens[index]) return true;
  }
  return false;
};

/**
 * 探测 verb_form·情态动词（灯塔新增）：can/must/should + to / 变形动词。
 * sample 含情态动词时，answer 在情态动词后接 to 或 -s/-ed 即命中。
 */
const detectModalTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const MODALS = new Set(["can", "must", "should", "could", "would", "may", "might", "will", "'ll", "can't", "mustn't"]);
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    if (!MODALS.has(sampleTokens[index])) continue;
    const answerIndex = answerTokens.indexOf(sampleTokens[index]);
    if (answerIndex < 0) continue;
    const next = answerTokens[answerIndex + 1];
    if (!next) continue;
    // a) 情态动词后接 to（must to say）
    if (next === "to") return true;
    // b) 情态动词后接变形动词（can sees / should rests / will came）
    if (next.endsWith("s") && !next.endsWith("ss") && sampleTokens.includes(next.slice(0, -1))) return true;
    if (next.endsWith("ed") && next.length > 3 && sampleTokens.includes(next.slice(0, -2))) return true;
  }
  return false;
};

/**
 * 探测 verb_form·被动语态（灯塔新增）：sample 用 be + 过去分词（is lit），
 * answer 用主动（lights）或 be + 原形（is light）。
 */
const detectPassiveTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  const BE = new Set(["am", "are", "is", "was", "were", "be", "been", "being"]);
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    if (!BE.has(sampleTokens[index])) continue;
    const participle = sampleTokens[index + 1];
    if (!participle || !(participle.endsWith("ed") || participle === "lit" || participle === "made")) continue;
    // 玩家写成了主动（用第三人称 -s 形式）：The lamp lights
    const nounIndex = sampleTokens.indexOf("lamp");
    if (nounIndex < 0) continue;
    const activeForm = participle === "lit" ? "lights" : `${participle.slice(0, -2)}s`;
    const activeFormD = participle === "lit" ? "lights" : `${participle.slice(0, -1)}s`;
    if (answerTokens.includes(activeForm) || answerTokens.includes(activeFormD)) return true;
    // 玩家写成了 be + 原形：is light
    const answerBeIndex = answerTokens.indexOf(sampleTokens[index]);
    if (answerBeIndex >= 0) {
      const answerNext = answerTokens[answerBeIndex + 1];
      const base = participle === "lit" ? "light" : participle.slice(0, -2);
      if (answerNext === base && !answerTokens.some((t) => t === participle)) return true;
    }
  }
  return false;
};

/**
 * 探测 tense·if 从句（灯塔新增）：sample 是 "if + 现在时"（If the storm comes），
 * answer 在 if 里用了 will（If the storm will come）。
 */
const detectIfClauseTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  if (!sampleTokens.includes("if")) return false;
  const ifIndex = answerTokens.indexOf("if");
  if (ifIndex < 0) return false;
  // if 从句范围内（到逗号或前 6 词）出现 will
  for (let index = ifIndex + 1; index < Math.min(ifIndex + 6, answerTokens.length); index += 1) {
    if (answerTokens[index] === "will" || answerTokens[index] === "'ll") return true;
  }
  return false;
};

/**
 * 探测 verb_form·to 后接过去式（灯塔 G6 新增）：sample 是 "to + 原形"（to meet），
 * answer 是 "to + 过去式"（to met）。通用覆盖 to met / to came / to went 类错误。
 */
const detectToPastTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    if (sampleTokens[index] !== "to") continue;
    const base = sampleTokens[index + 1];
    if (!base) continue;
    const answerToIndex = answerTokens.indexOf("to");
    if (answerToIndex < 0 || answerToIndex >= answerTokens.length - 1) continue;
    const answerNext = answerTokens[answerToIndex + 1];
    // to + 该动词的过去式（不规则表或规则 -ed）
    const irregularPast = IRREGULAR_PAST[base];
    if (irregularPast && answerNext === irregularPast) return true;
    if (answerNext === `${base}ed` || (base.endsWith("e") && answerNext === `${base}d`)) return true;
  }
  return false;
};

/** 探测 a/an：玩家写了 "a + 元音开头词"（参考答案里是 an）。 */
const detectArticleTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  for (let index = 0; index < sampleTokens.length - 1; index += 1) {
    if (sampleTokens[index] !== "an") continue;
    const noun = sampleTokens[index + 1];
    const answerIndex = answerTokens.indexOf(noun);
    if (answerIndex > 0 && answerTokens[answerIndex - 1] === "a") return true;
  }
  return false;
};

/** 程度副词（用于位置探测）。 */
const DEGREE_ADVERBS = new Set(["really", "very", "quite", "often", "always", "usually"]);

/**
 * 探测 word_order（集市批 2 新增）：
 * a) 指示代词单复数错配：this + 复数名词 / these + 单数名词（this apples）；
 * b) 介词/宾语位用了主格代词：for she / to he（应为 her / him）。
 */
const detectWordOrderTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  // a) 指示代词与名词数不一致
  for (let index = 0; index < answerTokens.length - 1; index += 1) {
    const token = answerTokens[index];
    const next = answerTokens[index + 1];
    if (token === "this" && (next.endsWith("s") && !next.endsWith("ss")) && sampleTokens.includes("these")) return true;
    if (token === "these" && !next.endsWith("s") && sampleTokens.includes("this")) return true;
  }
  // b) 介词后主格代词（for/to/with + she/he/they/I）
  const NOMINATIVE = new Set(["she", "he", "they", "i"]);
  const PREPOSITIONS = new Set(["for", "to", "with", "from", "at", "about", "of"]);
  for (let index = 0; index < answerTokens.length - 1; index += 1) {
    if (!PREPOSITIONS.has(answerTokens[index])) continue;
    if (NOMINATIVE.has(answerTokens[index + 1])) return true;
  }
  // c) 程度副词位置错（山径批 1）：玩家把 really 放在动词后（like really），
  //    而参考答案是副词在动词前（really like）。
  const VERBS_AFTER_ADVERB = new Set(["like", "want", "love", "need", "enjoy", "know"]);
  for (let index = 1; index < answerTokens.length; index += 1) {
    const token = answerTokens[index];
    if (!DEGREE_ADVERBS.has(token)) continue;
    const before = answerTokens[index - 1];
    if (!VERBS_AFTER_ADVERB.has(before)) continue;
    // 参考答案里同一副词后面紧跟动词（副词在动词前）
    const sampleAdverbIndex = sampleTokens.indexOf(token);
    const sampleNext = sampleAdverbIndex >= 0 ? sampleTokens[sampleAdverbIndex + 1] : undefined;
    if (sampleNext && VERBS_AFTER_ADVERB.has(sampleNext)) return true;
  }
  return false;
};

/** 常见动词的过去分词（不规则）。 */
const PAST_PARTICIPLE: Record<string, string> = {
  come: "come",
  go: "gone",
  see: "seen",
  take: "taken",
  eat: "eaten",
  be: "been",
  do: "done"
};

/** 助动词与主要动词之间允许插入的副词。 */
const INTERRUPTING_ADVERBS = new Set(["never", "ever", "already", "just", "not", "n't", "also", "only", "finally"]);

const nextContentToken = (tokens: string[], from: number): string | undefined => {
  let index = from;
  while (index < tokens.length && INTERRUPTING_ADVERBS.has(tokens[index])) index += 1;
  return tokens[index];
};

const isIrregularPast = (word: string): boolean => Object.values(IRREGULAR_PAST).includes(word);

/** 过去分词形态：不规则分词表、或规则 -ed。 */
const isParticiple = (word: string): boolean =>
  Object.values(PAST_PARTICIPLE).includes(word) || (word.endsWith("ed") && word.length > 3);

/**
 * 探测 verb_form（回声城批 3 新增）：
 * a) will 后面接了变形动词（will came / will gone）——will 后必须原形；
 * b) have/has 后面接了原形或过去式（have go / has went）——完成时用过去分词。
 * 支持助动词后插入副词（have never seen / will not come）。
 */
const detectVerbFormTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  // a) will + 非原形
  if (sampleTokens.includes("will") || sampleTokens.includes("'ll")) {
    for (let index = 0; index < answerTokens.length - 1; index += 1) {
      const token = answerTokens[index];
      if (token !== "will" && token !== "'ll") continue;
      const next = nextContentToken(answerTokens, index + 1);
      if (!next) continue;
      const participle = Object.values(PAST_PARTICIPLE).includes(next) && !Object.keys(PAST_PARTICIPLE).includes(next);
      if (isIrregularPast(next) || participle || (next.endsWith("ed") && next.length > 3)) return true;
    }
  }
  // b) have/has + 非分词
  if (sampleTokens.some((token) => ["have", "has", "'ve"].includes(token))) {
    for (let index = 0; index < answerTokens.length - 1; index += 1) {
      const token = answerTokens[index];
      if (token !== "have" && token !== "has" && token !== "'ve") continue;
      const next = nextContentToken(answerTokens, index + 1);
      if (!next) continue;
      if (isParticiple(next)) continue;
      // 过去式（have saw）或需要换形的原形（have go / has see）
      const needsDifferentRequirement =
        isIrregularPast(next) || (PAST_PARTICIPLE[next] !== undefined && PAST_PARTICIPLE[next] !== next);
      if (needsDifferentRequirement) return true;
    }
  }
  return false;
};

/** 探测三单：参考答案含三单 -s 形式（如 goes），玩家用了原形。 */
const detectSvAgreementTag = (answerTokens: string[], sampleTokens: string[]): boolean => {
  for (const token of sampleTokens) {
    if (!token.endsWith("s") || token.length <= 3) continue;
    const stem = token.slice(0, -1);
    const stemEs = token.endsWith("es") ? token.slice(0, -2) : null;
    if (answerTokens.includes(stem) && !answerTokens.includes(token)) return true;
    if (stemEs && answerTokens.includes(stemEs) && !answerTokens.includes(token)) return true;
  }
  // 反向：参考答案用原形（live/go/want…），玩家多加了 s（如 I lives / My friends lives）。
  const COMMON_VERBS = new Set([
    "live", "go", "want", "work", "wait", "come", "play", "eat", "run", "walk",
    "read", "write", "speak", "listen", "open", "close", "ring", "keep", "take",
    "buy", "see", "say", "tell", "know", "think", "help", "move", "stay", "travel"
  ]);
  for (const token of sampleTokens) {
    if (!COMMON_VERBS.has(token)) continue;
    const sForm = `${token}s`;
    const esForm = /(s|sh|ch|x|o)$/.test(token) ? `${token}es` : null;
    if (answerTokens.includes(sForm) || (esForm && answerTokens.includes(esForm))) return true;
  }
  return false;
};

/**
 * 规则层判定（L1）。
 * 顺序：pass（完全匹配/容错）→ misread（命中 errorTag）→ near（diff 高分）→ misread（低分兜底）。
 */
export const judgeGateAnswer = (gate: LanguageGate, rawAnswer: string): GateJudgement => {
  const answer = rawAnswer.trim();
  if (!answer) {
    return { verdict: "near", errorTags: [], score: 0 };
  }

  // 1) pass：标点/大小写/缩写容错后的完全一致，或命中 acceptRegex。
  const tokens = compareText(gate.sampleAnswer, answer);
  const score = diffScore(tokens);
  const allMatch = tokens.every((token) => token.status === "match");
  if (allMatch) return { verdict: "pass", errorTags: [], score: 100 };
  if (gate.acceptRegex) {
    try {
      if (new RegExp(gate.acceptRegex, "i").test(answer)) return { verdict: "pass", errorTags: [], score: 100 };
    } catch {
      // 非法正则视为不存在，继续走规则。
    }
  }

  // 2) misread：结构化 errorTag 探测（时态 / 缺 be / a-an / 三单 / 动词形态）。
  const answerTokens = tokenize(answer);
  const sampleTokens = tokenize(gate.sampleAnswer);
  const errorTags: GrammarErrorTag[] = [];
  if (detectTenseTag(answerTokens, sampleTokens)) errorTags.push("tense");
  if (detectMissingBeTag(answerTokens, sampleTokens)) errorTags.push("missing_be");
  if (detectArticleTag(answerTokens, sampleTokens)) errorTags.push("article");
  if (detectDefiniteTag(answerTokens, sampleTokens)) errorTags.push("article");
  if (detectQuantifierTag(answerTokens, sampleTokens)) errorTags.push("fragment");
  if (detectSvAgreementTag(answerTokens, sampleTokens)) errorTags.push("sv_agreement");
  if (detectVerbFormTag(answerTokens, sampleTokens)) errorTags.push("verb_form");
  if (detectPluralTag(answerTokens, sampleTokens)) errorTags.push("plural");
  if (detectWordOrderTag(answerTokens, sampleTokens)) errorTags.push("word_order");
  if (detectComparisonTag(answerTokens, sampleTokens)) errorTags.push("comparison");
  if (detectSoThatTag(answerTokens, sampleTokens)) errorTags.push("fragment");
  if (detectPrepositionTag(answerTokens, sampleTokens)) errorTags.push("preposition");
  if (detectRunOnTag(answerTokens, sampleTokens)) errorTags.push("run_on");
  if (detectTenseNoHint(answerTokens, sampleTokens)) errorTags.push("tense");
  if (detectMissingToTag(answerTokens, sampleTokens)) errorTags.push("verb_form");
  if (detectGerundTag(answerTokens, sampleTokens)) errorTags.push("verb_form");
  if (detectMissingRelativeTag(answerTokens, sampleTokens)) errorTags.push("run_on");
  if (detectRelativePositionTag(answerTokens, sampleTokens)) errorTags.push("word_order");
  if (detectClauseSubjectTag(answerTokens, sampleTokens)) errorTags.push("fragment");
  if (detectModalTag(answerTokens, sampleTokens)) errorTags.push("verb_form");
  if (detectPassiveTag(answerTokens, sampleTokens)) errorTags.push("verb_form");
  if (detectIfClauseTag(answerTokens, sampleTokens)) errorTags.push("tense");
  if (detectToPastTag(answerTokens, sampleTokens)) errorTags.push("verb_form");

  if (errorTags.length > 0) {
    const branch = gate.misreadBranches.find((item) => errorTags.includes(item.errorTag)) ?? gate.misreadBranches[0];
    return { verdict: "misread", errorTags, branch, score };
  }

  // 3) near：词级对齐得分够高（拼写/词序/漏词但能猜懂）。
  if (score >= 60) return { verdict: "near", errorTags: [], score };

  // 4) 兜底：差得太远按 misread 处理（无具体支线，走通用 lampHint）。
  return { verdict: "misread", errorTags: [], branch: gate.misreadBranches[0], score };
};

/** 组装一条 GateAttempt（M1 落库 + NPC 记忆的数据源）。 */
export const buildGateAttempt = (input: {
  adventureId: string;
  nodeId: string;
  gate: LanguageGate;
  raw: string;
  judgement: GateJudgement;
  hintsUsed: number;
  attemptIndex: number;
}): GateAttempt => ({
  id: uid("gate_attempt"),
  adventureId: input.adventureId,
  nodeId: input.nodeId,
  gateId: input.gate.id,
  topicId: input.gate.topicId,
  raw: input.raw,
  verdict: input.judgement.verdict,
  errorTags: input.judgement.errorTags,
  hintsUsed: input.hintsUsed,
  attemptIndex: input.attemptIndex,
  createdAt: nowIso()
});

/** 把一次 attempt 追加到 AppData（含符文经验推进，见 runeService.chargeRuneForVerdict）。 */
export const recordGateAttempt = (data: AppData, attempt: GateAttempt): AppData => ({
  ...data,
  gateAttempts: [...data.gateAttempts, attempt]
});

/** 该门已通过的 attempt（每门只需 pass 一次即视为"门已打开"）。 */
export const findPassedAttempt = (data: AppData, gateId: string): GateAttempt | undefined =>
  data.gateAttempts.find((attempt) => attempt.gateId === gateId && attempt.verdict === "pass");

/** 该门的历史尝试数（attemptIndex 的下一个值）。 */
export const countGateAttempts = (data: AppData, gateId: string): number =>
  data.gateAttempts.filter((attempt) => attempt.gateId === gateId).length;
