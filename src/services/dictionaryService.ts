import type { AppData, DictionaryEntry } from "../types";
import { seedDictionary } from "../data/seedDictionary";

export const BUNDLED_DICTIONARY_COUNT = 12000;

const normalizeWord = (word: string) => word.trim().toLowerCase();

const uniqueCandidates = (values: string[]) => {
  const seen = new Set<string>();
  return values.filter((value) => {
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

const trimDoubledFinalConsonant = (value: string) => {
  if (value.length < 4) return value;
  const last = value[value.length - 1] ?? "";
  const previous = value[value.length - 2] ?? "";
  return last === previous && !"aeiou".includes(last) ? value.slice(0, -1) : value;
};

/**
 * 英式／美式拼写对照（2026-09-23 批六十二新增）。
 *
 * 为什么需要：内置词典 12000 词，但**同一个词的两种拼写只收了一侧**——
 * 实测 23 组常见词用户在另一侧拼法下**完全查不到**：
 *   - 词典只有英式（打美式查不到）：`favourite`✓/`favorite`✗、`honour`✓/`honor`✗、
 *     `neighbour`✓/`neighbor`✗、`flavour`✓/`flavor`✗、`theatre`✓/`theater`✗、
 *     `fibre`✓/`fiber`✗、`jewellery`✓/`jewelry`✗、`aluminium`✓/`aluminum`✗ 等 15 组
 *   - 词典只有美式（打英式查不到）：`realize`✓/`realise`✗、`organize`✓/`organise`✗、
 *     `apologize`✓/`apologise`✗、`memorize`✓/`memorise`✗ 等 8 组
 *
 * ⚠️ **为什么用对照表而不是拼写规则**：我先试过规则式（`-our→-or`、`-re→-er`、`-ise→-ize`），
 * 但英语里这些后缀**大量出现在不是英美差异的词上**，实测产出 291 组伪变体——
 * `share`→`shaer`、`nature`→`natuer`、`here`→`heer`、`rise`→`rize`。
 * 拿这些去查表只会浪费查找、且一旦词典里真有同形词就会**张冠李戴**。
 * 英美拼写差异是一个**封闭的已知集合**，用对照表既准确又不会误伤。
 *
 * 本表为**双向**：任一侧拼写都能查到（表里两式都有的词，词典本身已覆盖；
 * 列在这里是为了「无论用户打哪一侧，都能命中同一个条目」）。
 */
const SPELLING_VARIANTS: Record<string, string> = {
  // ── -our / -or（英 / 美）──
  colour: "color", color: "colour",
  favourite: "favorite", favorite: "favourite",
  honour: "honor", honor: "honour",
  neighbour: "neighbor", neighbor: "neighbour",
  flavour: "flavor", flavor: "flavour",
  behaviour: "behavior", behavior: "behaviour",
  humour: "humor", humor: "humour",
  labour: "labor", labor: "labour",
  rumour: "rumor", rumor: "rumour",
  armour: "armor", armor: "armour",
  harbour: "harbor", harbor: "harbour",
  // ── -re / -er ──
  centre: "center", center: "centre",
  theatre: "theater", theater: "theatre",
  metre: "meter", meter: "metre",
  litre: "liter", liter: "litre",
  fibre: "fiber", fiber: "fibre",
  calibre: "caliber", caliber: "calibre",
  sombre: "somber", somber: "sombre",
  // ── -ise / -ize ──
  realise: "realize", realize: "realise",
  organise: "organize", organize: "organise",
  recognise: "recognize", recognize: "recognise",
  apologise: "apologize", apologize: "apologise",
  memorise: "memorize", memorize: "memorise",
  summarise: "summarize", summarize: "summarise",
  criticise: "criticize", criticize: "criticise",
  // ── -yse / -yze ──
  analyse: "analyze", analyze: "analyse",
  paralyse: "paralyze", paralyze: "paralyse",
  // ── 重叠辅音（英式双写 / 美式单写）──
  travelled: "traveled", traveled: "travelled",
  travelling: "traveling", traveling: "travelling",
  cancelled: "canceled", canceled: "cancelled",
  cancelling: "canceling", canceling: "cancelling",
  labelled: "labeled", labeled: "labelled",
  labelling: "labeling", labeling: "labelling",
  modelled: "modeled", modeled: "modelled",
  // ── 其它常见对 ──
  defence: "defense", defense: "defence",
  licence: "license", license: "licence",
  practise: "practice", practice: "practise",
  grey: "gray", gray: "grey",
  cheque: "check", check: "cheque",
  programme: "program", program: "programme",
  aeroplane: "airplane", airplane: "aeroplane",
  jewellery: "jewelry", jewelry: "jewellery",
  aluminium: "aluminum", aluminum: "aluminium",
  catalogue: "catalog", catalog: "catalogue",
  dialogue: "dialog", dialog: "dialogue",
  monologue: "monolog", monolog: "monologue",
  plough: "plow", plow: "plough",
  mould: "mold", mold: "mould",
  smoulder: "smolder", smolder: "smoulder",
  sceptic: "skeptic", skeptic: "sceptic",
  kerb: "curb", curb: "kerb",
  cosy: "cozy", cozy: "cosy",
  storey: "story", story: "storey",
  tyre: "tire", tire: "tyre",
  splendour: "splendor", splendor: "splendour",
  mum: "mom", mom: "mum",
};

const getLookupCandidates = (word: string) => {
  const normalized = normalizeWord(word).replace(/^[^a-z]+|[^a-z]+$/g, "");
  if (!normalized) return [];

  const candidates = [normalized];

  if (normalized.endsWith("ies") && normalized.length > 4) {
    candidates.push(`${normalized.slice(0, -3)}y`);
  }

  if (normalized.endsWith("ves") && normalized.length > 4) {
    candidates.push(`${normalized.slice(0, -3)}f`, `${normalized.slice(0, -3)}fe`);
  }

  if (normalized.endsWith("es") && normalized.length > 3) {
    candidates.push(normalized.slice(0, -2));
  }

  if (normalized.endsWith("s") && !normalized.endsWith("ss") && normalized.length > 3) {
    candidates.push(normalized.slice(0, -1));
  }

  if (normalized.endsWith("ied") && normalized.length > 4) {
    candidates.push(`${normalized.slice(0, -3)}y`);
  }

  if (normalized.endsWith("ed") && normalized.length > 4) {
    const withoutEd = normalized.slice(0, -2);
    candidates.push(withoutEd, `${normalized.slice(0, -1)}`, trimDoubledFinalConsonant(withoutEd));
  }

  if (normalized.endsWith("ing") && normalized.length > 5) {
    const withoutIng = normalized.slice(0, -3);
    candidates.push(withoutIng, `${withoutIng}e`, trimDoubledFinalConsonant(withoutIng));
  }

  /**
   * 英美拼写变体（2026-09-23 批六十二新增）：查不到时再试另一侧拼写。
   *
   * 放在最后：先按用户原样 + 复数/时态变体查（那些命中率最高），
   * 都不中才试拼写变体，避免把「用户确实打错了」也悄悄救回来。
   * 变体本身也要过一遍复数/时态规则——`favourites` 这类要能一路还原到 `favorite`。
   */
  for (const candidate of [...candidates]) {
    const variant = SPELLING_VARIANTS[candidate];
    if (variant) candidates.push(variant);
  }

  return uniqueCandidates(candidates);
};

const seedDictionaryByWord = new Map(
  seedDictionary.map((entry) => [normalizeWord(entry.word), entry])
);

const mergeDictionaryEntry = (
  primary: DictionaryEntry | undefined,
  fallback: DictionaryEntry | undefined
): DictionaryEntry | undefined => {
  if (!primary) return fallback;
  if (!fallback) return primary;

  return {
    word: primary.word || fallback.word,
    phonetic: primary.phonetic || fallback.phonetic,
    partOfSpeech: primary.partOfSpeech || fallback.partOfSpeech,
    definition: primary.definition || fallback.definition,
    translation: primary.translation || fallback.translation,
    collocations: primary.collocations || fallback.collocations
  };
};

let bundledDictionaryPromise: Promise<DictionaryEntry[]> | undefined;
let bundledDictionaryByWordPromise: Promise<Map<string, DictionaryEntry>> | undefined;

const loadBundledDictionary = () => {
  if (!bundledDictionaryPromise) {
    bundledDictionaryPromise = import("../data/bundledDictionary")
      .then((module) => module.bundledDictionary)
      .catch((error) => {
        bundledDictionaryPromise = undefined;
        throw error;
      });
  }
  return bundledDictionaryPromise;
};

const loadBundledDictionaryByWord = () => {
  if (!bundledDictionaryByWordPromise) {
    bundledDictionaryByWordPromise = loadBundledDictionary()
      .then((entries) => new Map(entries.map((entry) => [normalizeWord(entry.word), entry])))
      .catch((error) => {
        bundledDictionaryByWordPromise = undefined;
        throw error;
      });
  }
  return bundledDictionaryByWordPromise;
};

const findSavedWordEntry = (data: AppData, normalized: string): DictionaryEntry | undefined => {
  const details = data.wordDetails.find((entry) => normalizeWord(entry.word) === normalized);
  if (!details) return undefined;

  const card = data.cards.find((item) => item.id === details.cardId);
  return {
    word: details.word,
    phonetic: details.phonetic,
    partOfSpeech: details.partOfSpeech,
    definition: details.englishDefinition,
    translation: details.chineseDefinition || card?.back || "",
    collocations: details.collocations
  };
};

export const findDictionaryEntry = (data: AppData, word: string): DictionaryEntry | undefined => {
  const candidates = getLookupCandidates(word);
  if (candidates.length === 0) return undefined;

  const findLocalEntry = (candidate: string) => data.dictionaryEntries.find((entry) => normalizeWord(entry.word) === candidate);
  const localEntry = candidates.map(findLocalEntry).find(Boolean);
  const savedEntry = candidates.map((candidate) => findSavedWordEntry(data, candidate)).find(Boolean);
  const seedEntry = candidates.map((candidate) => seedDictionaryByWord.get(candidate)).find(Boolean);

  return mergeDictionaryEntry(mergeDictionaryEntry(savedEntry, localEntry), seedEntry);
};

export const findDictionaryEntryAsync = async (
  data: AppData,
  word: string
): Promise<DictionaryEntry | undefined> => {
  const candidates = getLookupCandidates(word);
  if (candidates.length === 0) return undefined;

  const localEntry = findDictionaryEntry(data, word);
  const bundledDictionaryByWord = await loadBundledDictionaryByWord();
  const bundledEntry = candidates.map((candidate) => bundledDictionaryByWord.get(candidate)).find(Boolean);

  return mergeDictionaryEntry(localEntry, bundledEntry);
};

export const searchDictionary = (data: AppData, query: string): DictionaryEntry[] => {
  const normalized = normalizeWord(query);
  if (!normalized) return [];

  const seen = new Set<string>();
  const savedEntries = data.wordDetails
    .map((entry) => findSavedWordEntry(data, normalizeWord(entry.word)))
    .filter((entry): entry is DictionaryEntry => Boolean(entry));

  return [...savedEntries, ...data.dictionaryEntries, ...seedDictionary]
    .filter((entry) => {
      const word = normalizeWord(entry.word);
      if (seen.has(word) || !word.includes(normalized)) return false;
      seen.add(word);
      return true;
    })
    .slice(0, 12);
};

export const searchDictionaryAsync = async (data: AppData, query: string): Promise<DictionaryEntry[]> => {
  const normalized = normalizeWord(query);
  if (!normalized) return [];

  /**
   * 匹配口径（2026-09-23 批六十二补）：
   *   原实现是纯**子串**匹配（`word.includes(normalized)`）——于是搜索框里打
   *   `favorite` **找不到** `favourite`（两个拼写不含彼此），
   *   打 `neighbor` 找不到 `neighbour`。这是与查词同一个维度的缺陷：
   *   查词（findDictionaryEntry）看的是拼写变体表，搜索看的是子串，两条口径不一致。
   *
   *   现在把拼写变体也纳入搜索：用户搜任一侧拼写，另一侧的词都会进结果。
   *   ⚠️ 仍保留子串匹配（用户打 `favour` 前缀应能搜到 `favourite`）——
   *   变体只是**补充**匹配途径，不替换原有行为。
   */
  const variants = new Set<string>([normalized]);
  const directVariant = SPELLING_VARIANTS[normalized];
  if (directVariant) variants.add(directVariant);

  const matches = (word: string): boolean => {
    if (word.includes(normalized)) return true;
    for (const variant of variants) {
      if (variant !== normalized && word.includes(variant)) return true;
      // 反向：词本身的变体是否等于/包含查询串（favourite 的变体 favorite）
      const wordVariant = SPELLING_VARIANTS[word];
      if (wordVariant && wordVariant.includes(normalized)) return true;
    }
    return false;
  };

  const seen = new Set<string>();
  const savedEntries = data.wordDetails
    .map((entry) => findSavedWordEntry(data, normalizeWord(entry.word)))
    .filter((entry): entry is DictionaryEntry => Boolean(entry));
  const bundledDictionary = await loadBundledDictionary();

  return [...savedEntries, ...data.dictionaryEntries, ...seedDictionary, ...bundledDictionary]
    .filter((entry) => {
      const word = normalizeWord(entry.word);
      if (seen.has(word) || !matches(word)) return false;
      seen.add(word);
      return true;
    })
    .slice(0, 12);
};

export const getDictionaryStats = (data: AppData) => {
  const searchableWords = new Set<string>();
  for (const entry of data.dictionaryEntries) searchableWords.add(normalizeWord(entry.word));
  for (const details of data.wordDetails) searchableWords.add(normalizeWord(details.word));
  for (const entry of seedDictionary) searchableWords.add(normalizeWord(entry.word));

  return {
    bundledCount: BUNDLED_DICTIONARY_COUNT,
    localEntryCount: data.dictionaryEntries.length,
    savedWordCount: data.wordDetails.length,
    searchableCount: Math.max(BUNDLED_DICTIONARY_COUNT, searchableWords.size)
  };
};
