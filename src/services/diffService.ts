import { DiffToken, LetterDiffToken } from "../types";

/** 中文输入法常打出全角标点——先折成半角，免得「句末全角句号」被当成没写对。 */
const foldFullWidth = (value: string) =>
  value
    // 全角 ASCII 区（！～，含全角逗号/问号/分号/冒号）整体左移到半角。
    .replace(/[\uFF01-\uFF5E]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\u3002/g, ".")
    .replace(/\u3001/g, ",");

const normalize = (value: string, strictPunctuation = false) => {
  const base = foldFullWidth(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  if (strictPunctuation) return base;
  return base.replace(/[.,!?;:"()[\]{}]/g, "");
};

const tokenize = (value: string, strictPunctuation = false) =>
  normalize(value, strictPunctuation)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);

/**
 * 缩写 ↔ 全称的等值展开表（judging 用，不是教学用）。
 *
 * 判分必须承认 It's 与 It is 是同一句话：两者都是正确说法，用户选哪个都不该判错。
 * 但它的/她的那类词必须留在表外——its、whose、o'clock、名词所有格（wind's / grandma's）
 * 都不是缩写，一旦也展开成 it is 之类，反而会把 L87/L88 专门教的
 * 「少一小撇就成了另一个词」这个考点判成对，比漏判更糟。
 *
 * 值 = 该缩写的候选全称写法；一个 token 可能有两种读法（he's = he is / he has），
 * 两者都算对，所以给候选列表而不是单一展开。
 */
const CONTRACTION_FORMS: Record<string, string[][]> = {
  // be：is / are / am
  "it's": [["it", "is"], ["it", "has"]],
  "that's": [["that", "is"]],
  "what's": [["what", "is"]],
  "who's": [["who", "is"], ["who", "has"]],
  "there's": [["there", "is"]],
  "here's": [["here", "is"]],
  "he's": [["he", "is"], ["he", "has"]],
  "she's": [["she", "is"], ["she", "has"]],
  "how's": [["how", "is"]],
  "where's": [["where", "is"]],
  "when's": [["when", "is"]],
  "why's": [["why", "is"]],
  "i'm": [["i", "am"]],
  "we're": [["we", "are"]],
  "you're": [["you", "are"]],
  "they're": [["they", "are"]],
  // not 系列
  "don't": [["do", "not"]],
  "doesn't": [["does", "not"]],
  "didn't": [["did", "not"]],
  "isn't": [["is", "not"]],
  "aren't": [["are", "not"]],
  "wasn't": [["was", "not"]],
  "weren't": [["were", "not"]],
  "hasn't": [["has", "not"]],
  "haven't": [["have", "not"]],
  "hadn't": [["had", "not"]],
  "can't": [["can", "not"]],
  cannot: [["can", "not"]],
  "couldn't": [["could", "not"]],
  "shouldn't": [["should", "not"]],
  "wouldn't": [["would", "not"]],
  "mustn't": [["must", "not"]],
  "won't": [["will", "not"]],
  // 其他助动词
  "let's": [["let", "us"]],
  "i'll": [["i", "will"]],
  "you'll": [["you", "will"]],
  "he'll": [["he", "will"]],
  "she'll": [["she", "will"]],
  "it'll": [["it", "will"]],
  "we'll": [["we", "will"]],
  "they'll": [["they", "will"]],
  "i've": [["i", "have"]],
  "you've": [["you", "have"]],
  "we've": [["we", "have"]],
  "they've": [["they", "have"]],
  "i'd": [["i", "would"], ["i", "had"]],
  "you'd": [["you", "would"], ["you", "had"]],
  "he'd": [["he", "would"], ["he", "had"]],
  "she'd": [["she", "would"], ["she", "had"]],
  "we'd": [["we", "would"], ["we", "had"]],
  "they'd": [["they", "would"], ["they", "had"]]
};

/** 一个 token 的候选写法；非缩写只有它自己。 */
const expansionOf = (token: string): string[][] => CONTRACTION_FORMS[token] ?? [[token]];

/** 展开组合的上限：正常句子至多一两个缩写，超过即以首选写法为准，避免组合爆炸。 */
const MAX_EXPANSIONS = 64;

/** 一个词序列的全部等价写法（缩写展开为全称；无缩写时只有一种）。 */
const canonicalForms = (tokens: string[]): string[] => {
  const forms: string[] = [];
  const walk = (index: number, acc: string[]): void => {
    if (forms.length >= MAX_EXPANSIONS) return;
    if (index >= tokens.length) {
      forms.push(acc.join(" "));
      return;
    }
    for (const expansion of expansionOf(tokens[index])) walk(index + 1, [...acc, ...expansion]);
  };
  walk(0, []);
  return forms;
};

/** 词序列的规范写法（首选展开），用于逐词对位比较。 */
const canonicalTokenList = (tokens: string[]): string[] =>
  canonicalForms(tokens)[0]?.split(" ") ?? [];

/**
 * 逐个词块展开成词序列，并记住每个词来自哪个词块。
 *
 * 点词成句的提示文案说的是「从第 N 个词块开始有点不对」，数的是用户看得见的词块；
 * 而 It's 展开成 it is 会多出一个词，位置就错位了。带上来源下标才能把展开后的位置
 * 映射回用户眼里的第几个词块。
 */
export const expandWithSource = (chunks: string[]): Array<{ token: string; chunkIndex: number }> => {
  const out: Array<{ token: string; chunkIndex: number }> = [];
  chunks.forEach((chunk, chunkIndex) => {
    for (const token of canonicalTokenList(tokenize(chunk, false))) out.push({ token, chunkIndex });
  });
  return out;
};

/**
 * 两组词序列是否在「缩写 ↔ 全称」意义下等价；等价则返回规范写法，否则 null。
 * 任一侧为空都不算等价——空输入走常规路径（空对空返回空 diff，不给假 match）。
 */
const matchContractionEquivalent = (a: string[], b: string[]): string[] | null => {
  if (a.length === 0 || b.length === 0) return null;
  const right = new Set(canonicalForms(b));
  for (const form of canonicalForms(a)) {
    if (right.has(form)) return form.split(" ");
  }
  return null;
};

/**
 * 词块成句（点词成句 / 词块重建）判分：词块数组与答案句都归一成词序列后比较。
 * 缩写等价，但撇号仍是实义差别——选 "Its" 拼 "It's" 的句子判错（L87/L88 的考点）。
 *
 * 两个空序列视为相等（沿用旧口径：空对空算「都对上了」，由调用方的非空校验兜底提示）。
 */
export const tokenSequencesEquivalent = (picked: string[], answer: string): boolean => {
  const pickedTokens = picked.flatMap((token) => tokenize(token));
  const answerTokens = tokenize(answer);
  if (pickedTokens.length === 0 || answerTokens.length === 0) {
    return pickedTokens.length === answerTokens.length;
  }
  return matchContractionEquivalent(pickedTokens, answerTokens) !== null;
};

const distance = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
};

/**
 * 去掉撇号后**本身是另一个常用词**的写法——这些不能与对应缩写混为一谈。
 *
 * its / it's、lets / let's、were / we're 差的就是一小撇，但去掉撇号后是完全不同的词。
 * L87/L88 整课在教「少一小撇就成了『它的』」、L75 教 Let's，所以这几对必须判为不同；
 * 而 dont、thats 这种去掉撇号不成词的单纯漏撇，仍按拼写接近给半分
 * （学习者漏撇很常见，不该和「用错词」同罪）。
 *
 * whose / who's（多一个 e）不在此列：编辑距离本身已把它们判开，不需要这条兜底。
 */
const APOSTROPHE_HOMOGRAPHS = new Set([
  "its", // ← it's
  "lets", // ← let's
  "were", // ← we're
  "well", // ← we'll
  "ill", // ← i'll
  "id", // ← i'd
  "wed", // ← we'd
  "hell", // ← he'll
  "shell" // ← she'll
]);

const isNearSpelling = (a: string, b: string) => {
  if (a.length <= 2 || b.length <= 2) return false;
  const bareA = a.replace(/'/g, "");
  const bareB = b.replace(/'/g, "");
  if (bareA === bareB && (APOSTROPHE_HOMOGRAPHS.has(bareA) || APOSTROPHE_HOMOGRAPHS.has(bareB))) return false;
  const edits = distance(a, b);
  return edits === 1 || edits / Math.max(a.length, b.length) <= 0.25;
};

export const compareText = (expected: string, answer: string, strictPunctuation = false): DiffToken[] => {
  const expectedTokens = tokenize(expected, strictPunctuation);
  const answerTokens = tokenize(answer, strictPunctuation);

  // 缩写 ↔ 全称等价：It is 与 It's 是同一句话，整句判定为完全对上。
  // 这是「同一句话的两种正确写法」，不是拼写容错，所以直接给满分而不是按半对计入。
  // 回显用用户自己写的词形（他写的 It's 就显示 It's），而不是展开后的全称——
  // 两种写法都对，逐词对照里没必要把用户没写的东西摆在他面前。
  if (matchContractionEquivalent(answerTokens, expectedTokens)) {
    return answerTokens.map((token) => ({ token, expected: token, status: "match" }));
  }

  const result: DiffToken[] = [];
  let i = 0;
  let j = 0;

  while (i < expectedTokens.length || j < answerTokens.length) {
    const expectedToken = expectedTokens[i];
    const answerToken = answerTokens[j];

    if (expectedToken && answerToken && expectedToken === answerToken) {
      result.push({ token: answerToken, expected: expectedToken, status: "match" });
      i += 1;
      j += 1;
      continue;
    }

    if (expectedToken && answerToken && isNearSpelling(expectedToken, answerToken)) {
      result.push({ token: answerToken, expected: expectedToken, status: "spelling" });
      i += 1;
      j += 1;
      continue;
    }

    if (expectedToken && answerTokens[j + 1] === expectedToken) {
      result.push({ token: answerToken, status: "extra" });
      j += 1;
      continue;
    }

    if (answerToken && expectedTokens[i + 1] === answerToken) {
      result.push({ token: expectedToken, expected: expectedToken, status: "missing" });
      i += 1;
      continue;
    }

    if (expectedToken && answerToken) {
      result.push({ token: answerToken, expected: expectedToken, status: "substitution" });
      i += 1;
      j += 1;
      continue;
    }

    if (expectedToken) {
      result.push({ token: expectedToken, expected: expectedToken, status: "missing" });
      i += 1;
    } else if (answerToken) {
      result.push({ token: answerToken, status: "extra" });
      j += 1;
    }
  }

  return result;
};

export const diffScore = (tokens: DiffToken[]) => {
  if (tokens.length === 0) return 0;
  const matched = tokens.filter((token) => token.status === "match").length;
  const spelling = tokens.filter((token) => token.status === "spelling").length;
  return Math.round(((matched + spelling * 0.5) / tokens.length) * 100);
};

export const normalizeSpelling = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\s+/g, "");

export const compareLetters = (expected: string, answer: string): LetterDiffToken[] => {
  const expectedChars = normalizeSpelling(expected).split("");
  const answerChars = normalizeSpelling(answer).split("");
  const result: LetterDiffToken[] = [];
  let i = 0;
  let j = 0;

  while (i < expectedChars.length || j < answerChars.length) {
    const expectedChar = expectedChars[i];
    const answerChar = answerChars[j];

    if (expectedChar && answerChar && expectedChar === answerChar) {
      result.push({ char: answerChar, expected: expectedChar, status: "match" });
      i += 1;
      j += 1;
      continue;
    }

    if (
      expectedChar &&
      answerChar &&
      expectedChars[i + 1] &&
      answerChars[j + 1] &&
      expectedChar === answerChars[j + 1] &&
      expectedChars[i + 1] === answerChar
    ) {
      result.push({ char: answerChar, expected: expectedChar, status: "substitution" });
      result.push({ char: answerChars[j + 1], expected: expectedChars[i + 1], status: "substitution" });
      i += 2;
      j += 2;
      continue;
    }

    if (expectedChar && answerChars[j + 1] === expectedChar) {
      result.push({ char: answerChar, status: "extra" });
      j += 1;
      continue;
    }

    if (answerChar && expectedChars[i + 1] === answerChar) {
      result.push({ char: expectedChar, expected: expectedChar, status: "missing" });
      i += 1;
      continue;
    }

    if (expectedChar && answerChar) {
      result.push({ char: answerChar, expected: expectedChar, status: "substitution" });
      i += 1;
      j += 1;
      continue;
    }

    if (expectedChar) {
      result.push({ char: expectedChar, expected: expectedChar, status: "missing" });
      i += 1;
    } else if (answerChar) {
      result.push({ char: answerChar, status: "extra" });
      j += 1;
    }
  }

  return result;
};
