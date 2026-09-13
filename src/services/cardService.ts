import {
  AppData,
  Card,
  CardStatus,
  DictionaryEntry,
  SentenceDetails,
  Settings,
  WordDetails
} from "../types";
import { findDictionaryEntry, findDictionaryEntryAsync } from "./dictionaryService";
import { createInitialSchedule } from "./reviewService";
import { nowIso, uid } from "./storage";

const parseTags = (tags: string) =>
  tags
    .split(/[，,\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);

const MAX_AUDIO_BYTES = 2 * 1024 * 1024;

export const readAudioFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    if (file.type && !file.type.startsWith("audio/")) {
      reject(new Error("请选择音频文件。"));
      return;
    }

    if (file.size > MAX_AUDIO_BYTES) {
      reject(new Error("音频文件超过 2MB，请先裁剪成较短片段。"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      result ? resolve(result) : reject(new Error("音频读取失败。"));
    };
    reader.onerror = () => reject(new Error("音频读取失败。"));
    reader.readAsDataURL(file);
  });

export interface WordInput {
  word: string;
  translation: string;
  phonetic: string;
  partOfSpeech: string;
  englishDefinition: string;
  collocations: string;
  sourceSentence: string;
  sourceId?: string;
  unitId: string;
  note: string;
  tags: string;
}

export interface SentenceInput {
  sentence: string;
  translation: string;
  keywords: string;
  grammarNote: string;
  sourceId?: string;
  note: string;
  tags: string;
}

export interface WordSaveResult {
  data: AppData;
  status: "created" | "merged";
  cardId: string;
  word: string;
  mergedFields: string[];
  audioAttached?: boolean;
}

export interface WordBatchSaveResult {
  data: AppData;
  created: number;
  merged: number;
  words: WordSaveResult[];
  audioAttached?: number;
  audioLookups?: number;
}

export interface WordBatchAudioOptions {
  maxAudioLookups?: number;
}

type PronunciationAudioFetcher = (word: string, lang?: Settings["speechLang"]) => Promise<string | null>;
type PronunciationServiceModule = {
  fetchWordPronunciationAudio?: PronunciationAudioFetcher;
};

const DEFAULT_MAX_AUDIO_LOOKUPS = 20;
const pronunciationServiceLoaders = (
  import.meta as ImportMeta & {
    glob: <Module>(pattern: string) => Record<string, () => Promise<Module>>;
  }
).glob<PronunciationServiceModule>("./pronunciationService.ts");
let pronunciationAudioFetcherForTest: PronunciationAudioFetcher | null | undefined;
let pronunciationAudioFetcherPromise: Promise<PronunciationAudioFetcher | null> | null = null;

export const setPronunciationAudioFetcherForTest = (
  fetcher: PronunciationAudioFetcher | null | undefined
) => {
  pronunciationAudioFetcherForTest = fetcher;
  pronunciationAudioFetcherPromise = null;
};

const getPronunciationAudioFetcher = async () => {
  if (pronunciationAudioFetcherForTest !== undefined) {
    return pronunciationAudioFetcherForTest;
  }

  if (!pronunciationAudioFetcherPromise) {
    pronunciationAudioFetcherPromise = (async () => {
      const loadPronunciationService = pronunciationServiceLoaders["./pronunciationService.ts"];
      if (!loadPronunciationService) return null;

      try {
        const service = await loadPronunciationService();
        return service.fetchWordPronunciationAudio ?? null;
      } catch {
        return null;
      }
    })();
  }

  return pronunciationAudioFetcherPromise;
};

const createHydratedWordInput = (word: string, entry: DictionaryEntry | undefined): WordInput => ({
  word: word.trim().toLowerCase(),
  translation: entry?.translation ?? "",
  phonetic: entry?.phonetic ?? "",
  partOfSpeech: entry?.partOfSpeech ?? "",
  englishDefinition: entry?.definition ?? "",
  collocations: entry?.collocations ?? "",
  sourceSentence: "",
  unitId: "",
  note: "",
  tags: ""
});

const compactLines = (values: string[]) => {
  const seen = new Set<string>();
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const normalized = value.toLowerCase();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .join("\n");
};

const replaceIfPresent = (currentValue: string | undefined, nextValue: string | undefined) => {
  const trimmed = nextValue?.trim() ?? "";
  return trimmed || currentValue || "";
};

const collectChangedField = (
  fields: string[],
  label: string,
  currentValue: string | undefined,
  nextValue: string | undefined
) => {
  const trimmed = nextValue?.trim() ?? "";
  if (trimmed && trimmed !== (currentValue ?? "")) fields.push(label);
};

export const hydrateWordInput = (data: AppData, word: string): WordInput => {
  const entry = findDictionaryEntry(data, word);
  return createHydratedWordInput(word, entry);
};

export const hydrateWordInputAsync = async (data: AppData, word: string): Promise<WordInput> => {
  const entry = await findDictionaryEntryAsync(data, word);
  return createHydratedWordInput(word, entry);
};

export const addOrUpdateWordWithResult = (data: AppData, input: WordInput): WordSaveResult => {
  const word = input.word.trim().toLowerCase();
  const existingDetails = data.wordDetails.find((item) => item.word.toLowerCase() === word);
  const timestamp = nowIso();

  if (existingDetails) {
    const existingCard = data.cards.find((card) => card.id === existingDetails.cardId);
    const inputTags = parseTags(input.tags);
    const mergedFields: string[] = [];
    collectChangedField(mergedFields, "释义", existingCard?.back || existingDetails.chineseDefinition, input.translation);
    collectChangedField(mergedFields, "音标", existingDetails.phonetic, input.phonetic);
    collectChangedField(mergedFields, "词性", existingDetails.partOfSpeech, input.partOfSpeech);
    collectChangedField(mergedFields, "英文解释", existingDetails.englishDefinition, input.englishDefinition);
    collectChangedField(mergedFields, "搭配", existingDetails.collocations, input.collocations);
    collectChangedField(mergedFields, "例句", existingDetails.sourceSentence, input.sourceSentence);
    collectChangedField(mergedFields, "备注", existingCard?.note, input.note);
    if (input.unitId && input.unitId !== existingCard?.unitId) mergedFields.push("词书");
    if (inputTags.some((tag) => !existingCard?.tags.includes(tag))) mergedFields.push("标签");

    const nextSource = compactLines([existingDetails.sourceSentence, input.sourceSentence]);
    const nextData = {
      ...data,
      cards: data.cards.map((card) =>
        card.id === existingDetails.cardId
          ? {
              ...card,
              back: replaceIfPresent(card.back, input.translation),
              note: compactLines([card.note, input.note]),
              sourceId: card.sourceId || input.sourceId || undefined,
              tags: Array.from(new Set([...card.tags, ...parseTags(input.tags)])),
              unitId: input.unitId || card.unitId,
              updatedAt: timestamp
            }
          : card
      ),
      wordDetails: data.wordDetails.map((details) =>
        details.cardId === existingDetails.cardId
          ? {
              ...details,
              chineseDefinition: replaceIfPresent(details.chineseDefinition, input.translation),
              englishDefinition: replaceIfPresent(details.englishDefinition, input.englishDefinition),
              phonetic: replaceIfPresent(details.phonetic, input.phonetic),
              partOfSpeech: replaceIfPresent(details.partOfSpeech, input.partOfSpeech),
              collocations: replaceIfPresent(details.collocations, input.collocations),
              sourceSentence: nextSource
            }
          : details
      )
    };
    return {
      data: nextData,
      status: "merged",
      cardId: existingDetails.cardId,
      word,
      mergedFields
    };
  }

  const id = uid("card");
  const card: Card = {
    id,
    type: "word",
    front: word,
    back: input.translation,
    note: input.note,
    sourceId: input.sourceId || undefined,
    unitId: input.unitId || undefined,
    tags: parseTags(input.tags),
    status: "new",
    priority: false,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  const details: WordDetails = {
    cardId: id,
    word,
    phonetic: input.phonetic,
    partOfSpeech: input.partOfSpeech,
    chineseDefinition: input.translation,
    englishDefinition: input.englishDefinition,
    collocations: input.collocations,
    synonyms: "",
    antonyms: "",
    confusedWords: "",
    audioUrl: "",
    sourceSentence: input.sourceSentence
  };

  return {
    data: {
      ...data,
      cards: [...data.cards, card],
      wordDetails: [...data.wordDetails, details],
      schedules: [...data.schedules, createInitialSchedule(id)]
    },
    status: "created",
    cardId: id,
    word,
    mergedFields: []
  };
};

export const addOrUpdateWord = (data: AppData, input: WordInput): AppData =>
  addOrUpdateWordWithResult(data, input).data;

export const addWordsBatch = (data: AppData, inputs: WordInput[]): WordBatchSaveResult =>
  inputs.reduce(
    (result, input) => {
      const saved = addOrUpdateWordWithResult(result.data, input);
      return {
        data: saved.data,
        created: result.created + (saved.status === "created" ? 1 : 0),
        merged: result.merged + (saved.status === "merged" ? 1 : 0),
        words: [...result.words, saved]
      };
    },
    {
      data,
      created: 0,
      merged: 0,
      words: [] as WordSaveResult[]
    } as WordBatchSaveResult
  );

const getWordAudioUrl = (data: AppData, cardId: string) =>
  data.wordDetails.find((details) => details.cardId === cardId)?.audioUrl.trim() ?? "";

const attachPronunciationAudio = async (
  result: WordSaveResult,
  lang?: Settings["speechLang"]
): Promise<WordSaveResult> => {
  if (getWordAudioUrl(result.data, result.cardId)) {
    return { ...result, audioAttached: false };
  }

  const fetchPronunciationAudio = await getPronunciationAudioFetcher();
  if (!fetchPronunciationAudio) {
    return { ...result, audioAttached: false };
  }

  try {
    const audioUrl = (await fetchPronunciationAudio(result.word, lang))?.trim() ?? "";
    if (!audioUrl) {
      return { ...result, audioAttached: false };
    }

    return {
      ...result,
      data: {
        ...result.data,
        wordDetails: result.data.wordDetails.map((details) =>
          details.cardId === result.cardId && !details.audioUrl.trim()
            ? { ...details, audioUrl }
            : details
        )
      },
      audioAttached: true
    };
  } catch {
    return { ...result, audioAttached: false };
  }
};

export const addOrUpdateWordWithAudio = async (
  data: AppData,
  input: WordInput,
  lang?: Settings["speechLang"]
): Promise<WordSaveResult> => attachPronunciationAudio(addOrUpdateWordWithResult(data, input), lang);

export const addWordsBatchWithAudio = async (
  data: AppData,
  inputs: WordInput[],
  lang?: Settings["speechLang"],
  options: WordBatchAudioOptions = {}
): Promise<WordBatchSaveResult> => {
  const maxAudioLookups = Math.max(0, options.maxAudioLookups ?? DEFAULT_MAX_AUDIO_LOOKUPS);
  const savedBatch = addWordsBatch(data, inputs);
  if (maxAudioLookups === 0) {
    return {
      ...savedBatch,
      words: savedBatch.words.map((word) => ({ ...word, data: savedBatch.data, audioAttached: false })),
      audioAttached: 0,
      audioLookups: 0
    };
  }

  const fetchPronunciationAudio = await getPronunciationAudioFetcher();
  if (!fetchPronunciationAudio) {
    return {
      ...savedBatch,
      words: savedBatch.words.map((word) => ({ ...word, data: savedBatch.data, audioAttached: false })),
      audioAttached: 0,
      audioLookups: 0
    };
  }

  const seenCardIds = new Set<string>();
  const lookupTargets = savedBatch.words
    .filter((word) => {
      if (seenCardIds.has(word.cardId) || getWordAudioUrl(savedBatch.data, word.cardId)) return false;
      seenCardIds.add(word.cardId);
      return true;
    })
    .slice(0, maxAudioLookups);

  const lookupResults = await Promise.all(
    lookupTargets.map(async (word) => {
      try {
        const audioUrl = (await fetchPronunciationAudio(word.word, lang))?.trim() ?? "";
        return { cardId: word.cardId, audioUrl };
      } catch {
        return { cardId: word.cardId, audioUrl: "" };
      }
    })
  );
  const audioUrlsByCardId = new Map(
    lookupResults
      .filter((result) => result.audioUrl)
      .map((result) => [result.cardId, result.audioUrl])
  );
  const currentData = {
    ...savedBatch.data,
    wordDetails: savedBatch.data.wordDetails.map((details) => {
      const audioUrl = audioUrlsByCardId.get(details.cardId);
      return audioUrl && !details.audioUrl.trim() ? { ...details, audioUrl } : details;
    })
  };

  return {
    data: currentData,
    created: savedBatch.created,
    merged: savedBatch.merged,
    words: savedBatch.words.map((word) => ({
      ...word,
      data: currentData,
      audioAttached: audioUrlsByCardId.has(word.cardId)
    })),
    audioAttached: audioUrlsByCardId.size,
    audioLookups: lookupTargets.length
  };
};

export const addSentence = (data: AppData, input: SentenceInput): AppData => {
  const timestamp = nowIso();
  const id = uid("card");
  const sentence = input.sentence.trim();
  const card: Card = {
    id,
    type: "sentence",
    front: sentence,
    back: input.translation,
    note: input.note,
    sourceId: input.sourceId || undefined,
    tags: parseTags(input.tags),
    status: "new",
    priority: false,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  const details: SentenceDetails = {
    cardId: id,
    sentence,
    translation: input.translation,
    keywords: parseTags(input.keywords),
    grammarNote: input.grammarNote,
    audioUrl: ""
  };

  return {
    ...data,
    cards: [...data.cards, card],
    sentenceDetails: [...data.sentenceDetails, details],
    schedules: [...data.schedules, createInitialSchedule(id)]
  };
};

export const deleteCard = (data: AppData, cardId: string): AppData => ({
  ...data,
  cards: data.cards.filter((card) => card.id !== cardId),
  wordDetails: data.wordDetails.filter((details) => details.cardId !== cardId),
  sentenceDetails: data.sentenceDetails.filter((details) => details.cardId !== cardId),
  schedules: data.schedules.filter((schedule) => schedule.cardId !== cardId),
  reviews: data.reviews.filter((review) => review.cardId !== cardId)
});

export const deleteCards = (data: AppData, cardIds: string[]): AppData => {
  const ids = new Set(cardIds);
  return {
    ...data,
    cards: data.cards.filter((card) => !ids.has(card.id)),
    wordDetails: data.wordDetails.filter((details) => !ids.has(details.cardId)),
    sentenceDetails: data.sentenceDetails.filter((details) => !ids.has(details.cardId)),
    schedules: data.schedules.filter((schedule) => !ids.has(schedule.cardId)),
    reviews: data.reviews.filter((review) => !ids.has(review.cardId))
  };
};

export const togglePriority = (data: AppData, cardId: string): AppData => ({
  ...data,
  cards: data.cards.map((card) => {
    if (card.id !== cardId) return card;
    const priority = !card.priority;
    const nextCard: Card = { ...card, priority, updatedAt: nowIso() };
    if (priority) {
      nextCard.prioritySource = "manual";
    } else {
      delete nextCard.prioritySource;
    }
    return nextCard;
  })
});

export const setCardsPriority = (data: AppData, cardIds: string[], priority: boolean): AppData => {
  const ids = new Set(cardIds);
  const timestamp = nowIso();
  return {
    ...data,
    cards: data.cards.map((card) => {
      if (!ids.has(card.id) || card.priority === priority) return card;
      const nextCard: Card = { ...card, priority, updatedAt: timestamp };
      if (priority) {
        nextCard.prioritySource = "manual";
      } else {
        delete nextCard.prioritySource;
      }
      return nextCard;
    })
  };
};

export const setCardsStatus = (data: AppData, cardIds: string[], status: CardStatus): AppData => {
  const ids = new Set(cardIds);
  const timestamp = nowIso();
  return {
    ...data,
    cards: data.cards.map((card) => {
      if (!ids.has(card.id) || card.status === status) return card;
      const nextCard: Card = { ...card, status, updatedAt: timestamp };
      if (status === "suspended") {
        nextCard.suspendedFrom = card.status;
      } else {
        delete nextCard.suspendedFrom;
      }
      return nextCard;
    })
  };
};

export const restoreCards = (data: AppData, cardIds: string[]): AppData => {
  const ids = new Set(cardIds);
  const timestamp = nowIso();
  return {
    ...data,
    cards: data.cards.map((card) => {
      if (!ids.has(card.id) || card.status !== "suspended") return card;
      const nextCard: Card = { ...card, status: card.suspendedFrom ?? "review", updatedAt: timestamp };
      delete nextCard.suspendedFrom;
      return nextCard;
    })
  };
};

export const updateWordAudio = (data: AppData, cardId: string, audioUrl: string): AppData => ({
  ...data,
  cards: data.cards.map((card) => (card.id === cardId ? { ...card, updatedAt: nowIso() } : card)),
  wordDetails: data.wordDetails.map((details) =>
    details.cardId === cardId ? { ...details, audioUrl } : details
  )
});

export const updateSentenceAudio = (data: AppData, cardId: string, audioUrl: string): AppData => ({
  ...data,
  cards: data.cards.map((card) => (card.id === cardId ? { ...card, updatedAt: nowIso() } : card)),
  sentenceDetails: data.sentenceDetails.map((details) =>
    details.cardId === cardId ? { ...details, audioUrl } : details
  )
});

export const getWordDetails = (data: AppData, cardId: string) =>
  data.wordDetails.find((details) => details.cardId === cardId);

// R13：通用卡片内容更新（释义/备注/标签），供短语等在 LibraryPage 内联编辑使用。
export const updateCardContent = (
  data: AppData,
  cardId: string,
  patch: { back?: string; note?: string; tags?: string[] }
): AppData => ({
  ...data,
  cards: data.cards.map((card) =>
    card.id === cardId
      ? {
          ...card,
          back: patch.back ?? card.back,
          note: patch.note ?? card.note,
          tags: patch.tags ?? card.tags,
          updatedAt: nowIso()
        }
      : card
  )
});

export const getSentenceDetails = (data: AppData, cardId: string) =>
  data.sentenceDetails.find((details) => details.cardId === cardId);
