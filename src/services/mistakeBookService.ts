import {
  AppData,
  Card,
  MistakeGeneration,
  MistakeGenerationCoverage,
  MistakeGenerationSettings,
  MistakeGenerationStory,
  MistakeGenerationType,
  MistakeGenerationWordSnapshot,
  Review,
  WordDetails
} from "../types";
import { nowIso, uid } from "./storage";

export interface MistakeAttempt {
  review: Review;
  answer: string;
}

export interface MistakeEntry {
  card: Card;
  details?: WordDetails;
  attempts: MistakeAttempt[];
  wrongCount: number;
  answers: string[];
  latestWrongAt: string;
}

export interface MistakeDateGroup {
  dateKey: string;
  label: string;
  mistakeCount: number;
  attemptCount: number;
  latestWrongAt: string;
  entries: MistakeEntry[];
}

export interface MistakeGenerationInput {
  dateKey: string;
  type: MistakeGenerationType;
  cardIds: string[];
  title: string;
  content: string;
  prompt: string;
  settings?: MistakeGenerationSettings;
  wordSnapshots?: MistakeGenerationWordSnapshot[];
  coverage?: MistakeGenerationCoverage;
  story?: MistakeGenerationStory;
}

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

const safeTime = (value: string) => {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
};

export const getLocalDateKey = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  const safeDate = isValidDate(date) ? date : new Date();
  const year = safeDate.getFullYear();
  const month = String(safeDate.getMonth() + 1).padStart(2, "0");
  const day = String(safeDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// R8：rating 判定唯一权威来源；此处再导出保持既有 API，调用方零改动。
import { isWrongReview } from "./reviewRating";
export { isWrongReview };

export const formatMistakeDateLabel = (dateKey: string, now = new Date()) => {
  const todayKey = getLocalDateKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);

  if (dateKey === todayKey) return "今天";
  if (dateKey === yesterdayKey) return "昨天";

  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return dateKey;

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    weekday: "short"
  }).format(new Date(year, month - 1, day));
};

const getWordDetailsByCardId = (data: AppData) => new Map(data.wordDetails.map((details) => [details.cardId, details]));

const getCardsById = (data: AppData) => new Map(data.cards.map((card) => [card.id, card]));

const createEntry = (card: Card, details: WordDetails | undefined, review: Review): MistakeEntry => ({
  card,
  details,
  attempts: [{ review, answer: review.answer.trim() || "未填写" }],
  wrongCount: 1,
  answers: review.answer.trim() ? [review.answer.trim()] : ["未填写"],
  latestWrongAt: review.reviewedAt
});

const addAttempt = (entry: MistakeEntry, review: Review): MistakeEntry => {
  const answer = review.answer.trim() || "未填写";
  return {
    ...entry,
    attempts: [...entry.attempts, { review, answer }].sort((a, b) => safeTime(b.review.reviewedAt) - safeTime(a.review.reviewedAt)),
    wrongCount: entry.wrongCount + 1,
    answers: Array.from(new Set([...entry.answers, answer])),
    latestWrongAt: safeTime(review.reviewedAt) > safeTime(entry.latestWrongAt) ? review.reviewedAt : entry.latestWrongAt
  };
};

export const getMistakeGroupsByDate = (data: AppData): MistakeDateGroup[] => {
  const cardsById = getCardsById(data);
  const detailsByCardId = getWordDetailsByCardId(data);
  const entriesByDate = new Map<string, Map<string, MistakeEntry>>();

  for (const review of data.reviews.filter(isWrongReview)) {
    const card = cardsById.get(review.cardId);
    if (!card || card.status === "suspended") continue;

    const dateKey = getLocalDateKey(review.reviewedAt);
    const entries = entriesByDate.get(dateKey) ?? new Map<string, MistakeEntry>();
    const current = entries.get(card.id);
    entries.set(
      card.id,
      current ? addAttempt(current, review) : createEntry(card, detailsByCardId.get(card.id), review)
    );
    entriesByDate.set(dateKey, entries);
  }

  return Array.from(entriesByDate.entries())
    .map(([dateKey, entries]) => {
      const sortedEntries = Array.from(entries.values()).sort((a, b) => safeTime(b.latestWrongAt) - safeTime(a.latestWrongAt));
      return {
        dateKey,
        label: formatMistakeDateLabel(dateKey),
        mistakeCount: sortedEntries.length,
        attemptCount: sortedEntries.reduce((count, entry) => count + entry.wrongCount, 0),
        latestWrongAt: sortedEntries[0]?.latestWrongAt ?? "",
        entries: sortedEntries
      };
    })
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
};

export const getMistakesByDate = (data: AppData, dateKey: string): MistakeEntry[] =>
  getMistakeGroupsByDate(data).find((group) => group.dateKey === dateKey)?.entries ?? [];

export const getTodayMistakes = (data: AppData, now = new Date()): MistakeEntry[] =>
  getMistakesByDate(data, getLocalDateKey(now));

export const getMistakeGenerationsByDate = (data: AppData, dateKey: string) =>
  data.mistakeGenerations
    .filter((generation) => generation.dateKey === dateKey)
    .slice()
    .sort((a, b) => safeTime(b.createdAt) - safeTime(a.createdAt));

const uniqueTrimmedStrings = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

const filterKnownCardIds = (values: string[], cardIds: Set<string>) =>
  Array.from(new Set(values.filter((cardId) => cardIds.has(cardId))));

const normalizeGenerationSettings = (settings: MistakeGenerationSettings | undefined) => {
  if (!settings) return undefined;

  const normalized: MistakeGenerationSettings = {};
  if (settings.level) normalized.level = settings.level;
  if (settings.scene?.trim()) normalized.scene = settings.scene.trim();
  if (settings.length) normalized.length = settings.length;
  if (settings.tone?.trim()) normalized.tone = settings.tone.trim();
  if (typeof settings.bilingual === "boolean") normalized.bilingual = settings.bilingual;

  return Object.keys(normalized).length > 0 ? normalized : undefined;
};

const normalizeWordSnapshots = (
  wordSnapshots: MistakeGenerationWordSnapshot[] | undefined,
  cardIds: Set<string>
) => {
  if (!wordSnapshots) return undefined;

  const normalized = wordSnapshots
    .filter((snapshot) => cardIds.has(snapshot.cardId))
    .map<MistakeGenerationWordSnapshot>((snapshot) => ({
      cardId: snapshot.cardId,
      word: snapshot.word.trim(),
      translation: snapshot.translation.trim(),
      wrongAnswers: uniqueTrimmedStrings(snapshot.wrongAnswers),
      ...(snapshot.status ? { status: snapshot.status } : {})
    }));

  return normalized.length > 0 ? normalized : undefined;
};

const normalizeCoverage = (coverage: MistakeGenerationCoverage | undefined, cardIds: Set<string>) => {
  if (!coverage) return undefined;

  return {
    usedCardIds: filterKnownCardIds(coverage.usedCardIds, cardIds),
    missingCardIds: filterKnownCardIds(coverage.missingCardIds, cardIds)
  };
};

const normalizeStory = (story: MistakeGenerationStory | undefined) => {
  if (!story) return undefined;

  const normalized: MistakeGenerationStory = {
    title: story.title.trim(),
    englishStory: story.englishStory.trim(),
    chineseTranslation: story.chineseTranslation.trim(),
    usedWords: uniqueTrimmedStrings(story.usedWords),
    missingWords: uniqueTrimmedStrings(story.missingWords),
    wordNotes: story.wordNotes
      .map((note) => ({
        word: note.word.trim(),
        sentence: note.sentence.trim(),
        meaning: note.meaning.trim()
      }))
      .filter((note) => note.word || note.sentence || note.meaning)
  };

  return normalized.title ||
    normalized.englishStory ||
    normalized.chineseTranslation ||
    normalized.usedWords.length > 0 ||
    normalized.missingWords.length > 0 ||
    normalized.wordNotes.length > 0
    ? normalized
    : undefined;
};

export const saveMistakeGeneration = (data: AppData, input: MistakeGenerationInput): AppData => {
  const cardIds = new Set(data.cards.map((card) => card.id));
  const settings = normalizeGenerationSettings(input.settings);
  const wordSnapshots = normalizeWordSnapshots(input.wordSnapshots, cardIds);
  const coverage = normalizeCoverage(input.coverage, cardIds);
  const story = normalizeStory(input.story);
  const generation: MistakeGeneration = {
    id: uid("mistake_generation"),
    dateKey: input.dateKey,
    type: input.type,
    cardIds: filterKnownCardIds(input.cardIds, cardIds),
    title: input.title.trim() || (input.type === "story" ? "错词故事" : "错词例句"),
    content: input.content.trim(),
    prompt: input.prompt,
    createdAt: nowIso(),
    ...(settings ? { settings } : {}),
    ...(wordSnapshots ? { wordSnapshots } : {}),
    ...(coverage ? { coverage } : {}),
    ...(story ? { story } : {})
  };

  if (!generation.content) return data;

  return {
    ...data,
    mistakeGenerations: [...data.mistakeGenerations, generation]
  };
};
