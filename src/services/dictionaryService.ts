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

  const seen = new Set<string>();
  const savedEntries = data.wordDetails
    .map((entry) => findSavedWordEntry(data, normalizeWord(entry.word)))
    .filter((entry): entry is DictionaryEntry => Boolean(entry));
  const bundledDictionary = await loadBundledDictionary();

  return [...savedEntries, ...data.dictionaryEntries, ...seedDictionary, ...bundledDictionary]
    .filter((entry) => {
      const word = normalizeWord(entry.word);
      if (seen.has(word) || !word.includes(normalized)) return false;
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
