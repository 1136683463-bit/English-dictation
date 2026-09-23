import { DiffToken, LetterDiffToken } from "../types";

/**
 * 中文输入法常打出全角标点——先折成半角，免得「句末全角句号」被当成没写对。
 *
 * 2026-09-23 补齐三处漏网（ENV3-B 的 FAIL-B7/B8/C8/C9 记录了它们，本次修复后翻转断言）：
 *
 * ① **弯双引号** U+201C/U+201D：原先只折了单引号 U+2018/U+2019。
 *    中文输入法打双引号得到的是弯引号，而它既不在全角 ASCII 区（U+FF01–FF5E）、
 *    也不在非严格模式的标点删除类（那是纯 ASCII），于是**粘在词上**变成 `“hello”`
 *    一个 token，与 `hello` 对不上——5 词句直接掉到 80 分。
 * ② **中文常用标点**：…（U+2026）、—（U+2014）、·（U+00B7）、「」『』（U+300C–U+300F）、
 *    《》〈〉（U+300A–U+300F）、・（U+30FB）、｡（U+FF61）。这些同样会粘在词上扣分：
 *    实测「I like tea」+「 → 83 分，不过产出段 90 线；「I am」+「 → 50 分，连忆段 70 线都不过。
 *    折成对应 ASCII 标点后，非严格模式会把它们一并删掉（标点不计分）。
 * ③ **不可见字符**：**要分两类处理**，混为一谈会把词粘起来。
 *
 *    - **零宽分隔符**（U+200B ZWSP、U+2060 WORD JOINER、U+180E 蒙古文元音分隔符）
 *      语义是「可换行点」，从网页/PDF 粘贴时通常落在词与词之间 —— 必须折成**空格**：
 *      `I am\u200Bhappy` 删成空会粘成 `amhappy`（仍判错，得 33 分），折成空格才等价于 `I am happy`。
 *    - **不可见标记**（U+00AD 软连字符、U+FEFF BOM、U+200C ZWNJ、U+200D ZWJ）
 *      是排版标记，落在**词内部** —— 必须**删除**：
 *      `hap\u00ADpy` 折成空格会变成两个词，删掉才是 `happy`。
 */
const foldFullWidth = (value: string) =>
  value
    // 零宽分隔符 → 空格（先做，避免它们参与后面的标点折叠）
    .replace(/[\u200B\u2060\u180E]/g, " ")
    // 不可见标记 → 删除
    .replace(/[\u00AD\uFEFF\u200C\u200D]/g, "")
    // 全角 ASCII 区（！～，含全角逗号/问号/分号/冒号）整体左移到半角。
    .replace(/[\uFF01-\uFF5E]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    // 半角句号 ｡（U+FF61）在半角片假名区，不在上面那段里，单独折
    .replace(/\uFF61/g, ".")
    .replace(/[\u2018\u2019\u02BC\u2032]/g, "'")
    // 弯双引号 → ASCII 双引号（非严格模式随后会删掉，严格模式下也按标点处理）
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/\u3002/g, ".")
    .replace(/\u3001/g, ",")
    // 中文省略号与破折号：统一成 ASCII 标点，随后的删标点类会清掉
    .replace(/[\u2026\u22EF]/g, ".")
    .replace(/[\u2014\u2015\u2500]/g, "-")
    // 间隔号 / 中点（外国人名、书名分隔用）
    .replace(/[\u00B7\u30FB\u2022\u2027]/g, "-")
    // 中文书名号与引号：符号折成 ASCII，内容保留（否则会粘在词上）
    .replace(/[\u300C\u300D\u300E\u300F\u300A\u300B\u3008\u3009]/g, '"')
    // 日文波浪号 〜（U+301C）与波折号 〰（U+3030）
    .replace(/[\u301C\u3030]/g, "~");

const normalize = (value: string, strictPunctuation = false) => {
  const base = foldFullWidth(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  if (strictPunctuation) return base;
  /**
   * 非严格模式：删掉标点，只比词。
   *
   * 2026-09-23 扩充 `-` 与 `~`（含全角 `～`）。
   * 起因：`foldFullWidth` 把中文破折号 —、间隔号 ·、波浪号 ～ 折成了这两个 ASCII 字符，
   * 但删除类里没有它们，于是折完仍**粘在词上**（实测「I like tea」+「—」得 83 分）。
   * 教材里没有任何带连字符的答案句（全库 grep 确认），所以纳入删除不会误伤。
   */
  return base.replace(/[.,!?;:"()[\]{}~-]/g, "");
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

/**
 * 拼写题的归一化（逐字母比对前的口径）。
 *
 * R09：补上 `foldFullWidth` —— 与句级的 `normalize`（同文件 :12）对齐。
 *
 * 此前这里只处理弯撇号与空白，**没有全角折叠**，于是同一个输入在两个页面
 * 得到不同结果：中文输入法打出的 `today。`（全角句号）在复习页按句级口径
 * 折成半角、判对；在拼写页却因为多了个 `。` 被判错。
 * 拼写页正是最需要宽容的地方（用户手打单词时输入法状态最不可控）。
 *
 * ⚠️ **本函数保留标点，这是有意的设计**（见 ENV3-B 的 R09 用例）：
 * 它同时喂给两个消费方——
 *   ① `SpellingPage` 的 `isCorrect`（判对错，**应当**宽容标点）；
 *   ② `compareLetters`（字母级差异对照，**需要**保留标点才能在界面上高亮出
 *      「你多打了个句号」）。
 * 一旦在这里删标点，②就再也显示不出标点差异了。
 *
 * 所以 2026-09-23 修 FAIL-B15（`today。` 在拼写页仍判错）时，
 * **没有动本函数**，而是给 ① 单独加了宽容口径 —— 见 `spellingMatches`。
 */
export const normalizeSpelling = (value: string) =>
  foldFullWidth(value)
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, "");

/**
 * 拼写页「答对没答对」的判定口径（2026-09-23 新增，修 ENV3-B 的 FAIL-B15）。
 *
 * 与 `normalizeSpelling` 的区别：**额外容忍标点**。
 * 用户拼一个单词时顺带打出 `。`、`.`、`!` 等，不该判错。
 * 但**撇号必须保留** —— `it's` 与 `its` 的差别正是教材 L87/L88 的考点，
 * 删掉撇号会把该抓的错放过去。
 *
 * 单独成一个函数（而不是改 `normalizeSpelling`）的原因见上：后者还要喂给
 * 差异对照，必须保留标点。
 */
export const spellingMatches = (expected: string, answer: string): boolean => {
  const strip = (value: string) =>
    normalizeSpelling(value).replace(/[.,!?;:"()[\]{}~\-—…、。！？；：“”‘’「」《》〈〉]/g, "");
  return strip(expected) === strip(answer);
};

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
