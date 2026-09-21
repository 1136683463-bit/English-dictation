import {
  AppData,
  Adventure,
  AdventureChoice,
  AdventureLevel,
  AdventureNode,
  AdventureNodeSource,
  AdventureTemplate,
  AdventureVocabulary,
  Card,
  CardStatus,
  CardType,
  DictionaryEntry,
  DiaryEntry,
  GateAttempt,
  GrammarErrorTag,
  GrammarRune,
  HuntAttempt,
  HuntResult,
  LanguageGate,
  Material,
  MaterialSegment,
  MisreadBranch,
  MistakeGeneration,
  MistakeGenerationCoverage,
  MistakeGenerationLength,
  MistakeGenerationLevel,
  MistakeGenerationSettings,
  MistakeGenerationStory,
  MistakeGenerationWordSnapshot,
  MistakeGenerationWordStatus,
  MistakeGenerationType,
  Rating,
  Review,
  ReviewMode,
  RuneState,
  Schedule,
  SentenceDetails,
  Settings,
  Unit,
  UnitGroup,
  WordDetails
} from "../types";
import { seedDictionary } from "../data/seedDictionary";
import { CORE_100_WORDS_VERSION, core100Words } from "../data/seedWords";
import { syncUnitCompletion } from "./learningTelemetry";
import { restructureOversizedUnits } from "./bookRestructureService";

const STORAGE_KEY = "personal-vocab-app-data-v1";
export const APP_SCHEMA_VERSION = 8;

export const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

export const nowIso = () => new Date().toISOString();

// 设置默认值的唯一来源（R13）：测试侧的 testUtils 也从这里取，改默认值只改这一处。
export const defaultSettings: Settings = {
  dailyNewWords: 10,
  dailyReviewLimit: 30,
  dailySentences: 5,
  strictPunctuation: false,
  speechVoice: "",
  speechLang: "en-US",
  speechRate: 0.9,
  autoSpeakInSpelling: true,
  lastExportedAt: "",
  lastSyncedAt: "",
  diaryDailyCount: 3,
  aiProvider: {
    enabled: false,
    baseUrl: "",
    apiKey: "",
    model: "",
    temperature: 0.7,
    timeoutMs: 120000,
    fallbackToLocal: true
  },
  dataSync: {
    enabled: false,
    baseUrl: "",
    token: ""
  }
};

const createInitialData = (): AppData => ({
  schemaVersion: APP_SCHEMA_VERSION,
  unitGroups: [],
  units: [],
  cards: [],
  wordDetails: [],
  sentenceDetails: [],
  materials: [],
  materialSegments: [],
  reviews: [],
  mistakeGenerations: [],
  adventures: [],
  huntAttempts: [],
  huntResults: [],
  grammarLessonsDone: [],
  diaryEntries: [],
  schedules: [],
  dictionaryEntries: seedDictionary,
  seededWordVersions: [],
  languageGates: [],
  gateAttempts: [],
  runeStates: [],
  settings: defaultSettings
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const asTrimmedStringArray = (value: unknown) =>
  Array.from(new Set(asStringArray(value).map((item) => item.trim()).filter(Boolean)));

const asNumber = (value: unknown, fallback: number) => {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const asBoolean = (value: unknown, fallback = false) => (typeof value === "boolean" ? value : fallback);

const validIsoOrNow = (value: unknown) => {
  const text = asString(value);
  return text && !Number.isNaN(new Date(text).getTime()) ? text : nowIso();
};

/**
 * F1 三关卡完成态归一化：Record<lessonId, number[]>，关卡序号只保留合法值 1/2/3 并去重排序。
 * 非法输入（非对象、数组含非数字、序号越界）一律降级为安全值，绝不让坏数据进入 AppData。
 */
const normalizeLessonStagesDone = (value: unknown): Record<string, number[]> => {
  if (!isRecord(value)) return {};
  const result: Record<string, number[]> = {};
  for (const [lessonId, stages] of Object.entries(value)) {
    if (typeof lessonId !== "string" || !lessonId) continue;
    const legal = Array.isArray(stages)
      ? [...new Set(stages.filter((stage): stage is number => stage === 1 || stage === 2 || stage === 3))].sort(
          (a, b) => a - b
        )
      : [];
    if (legal.length > 0) result[lessonId] = legal;
  }
  return result;
};

/**
 * 「趁热练」档位完成态归一化（R-B1）：与关卡完成态同型（1/2/3 合法值、去重、升序）。
 * 抽成同一实现，避免两套口径各自演化。
 */
const normalizeLessonTiersDone = normalizeLessonStagesDone;

const knownAppDataKeys = [
  "schemaVersion",
  "unitGroups",
  "units",
  "cards",
  "wordDetails",
  "sentenceDetails",
  "materials",
  "materialSegments",
  "reviews",
  "mistakeGenerations",
  "adventures",
  "huntAttempts",
  "huntResults",
  "grammarLessonsDone",
  "grammarLessonStagesDone",
  "grammarBoostsDone",
  "diaryEntries",
  "schedules",
  "dictionaryEntries",
  "settings"
];

const hasRecognizableAppShape = (value: Record<string, unknown>) =>
  knownAppDataKeys.some((key) => Object.prototype.hasOwnProperty.call(value, key));

const normalizeSettings = (value: unknown): Settings => {
  const settings = isRecord(value) ? value : {};
  const aiProvider = isRecord(settings.aiProvider) ? settings.aiProvider : {};
  const dataSync = isRecord(settings.dataSync) ? settings.dataSync : {};
  const speechLang = asString(settings.speechLang);
  const normalizedAiTimeout = Math.min(300000, Math.max(5000, Math.round(asNumber(aiProvider.timeoutMs, defaultSettings.aiProvider.timeoutMs))));
  const rawDiaryCount = Math.round(asNumber(settings.diaryDailyCount, defaultSettings.diaryDailyCount));
  const diaryDailyCount = rawDiaryCount === 5 || rawDiaryCount === 10 ? rawDiaryCount : 3;
  // R11：批改强度归一化（默认 standard；非法值回退）
  const rawStyle = asString(settings.diaryCorrectionStyle);
  const diaryCorrectionStyle = (rawStyle === "gentle" || rawStyle === "strict" ? rawStyle : "standard") as
    | "gentle"
    | "standard"
    | "strict";

  return {
    dailyNewWords: Math.max(0, Math.round(asNumber(settings.dailyNewWords, defaultSettings.dailyNewWords))),
    dailyReviewLimit: Math.max(1, Math.round(asNumber(settings.dailyReviewLimit, defaultSettings.dailyReviewLimit))),
    dailySentences: Math.max(0, Math.round(asNumber(settings.dailySentences, defaultSettings.dailySentences))),
    strictPunctuation: asBoolean(settings.strictPunctuation, defaultSettings.strictPunctuation),
    speechVoice: asString(settings.speechVoice, defaultSettings.speechVoice),
    speechLang: speechLang === "en-GB" ? "en-GB" : "en-US",
    speechRate: Math.min(1.5, Math.max(0.4, asNumber(settings.speechRate, defaultSettings.speechRate))),
    autoSpeakInSpelling: asBoolean(settings.autoSpeakInSpelling, defaultSettings.autoSpeakInSpelling),
    lastExportedAt: asString(settings.lastExportedAt, defaultSettings.lastExportedAt),
    lastSyncedAt: asString(settings.lastSyncedAt, defaultSettings.lastSyncedAt),
    diaryDailyCount,
    diaryCorrectionStyle,
    aiProvider: {
      enabled: asBoolean(aiProvider.enabled, defaultSettings.aiProvider.enabled),
      baseUrl: asString(aiProvider.baseUrl, defaultSettings.aiProvider.baseUrl).trim(),
      apiKey: asString(aiProvider.apiKey, defaultSettings.aiProvider.apiKey).trim(),
      model: asString(aiProvider.model, defaultSettings.aiProvider.model).trim(),
      temperature: Math.min(2, Math.max(0, asNumber(aiProvider.temperature, defaultSettings.aiProvider.temperature))),
      timeoutMs: normalizedAiTimeout < 60000 ? defaultSettings.aiProvider.timeoutMs : normalizedAiTimeout,
      fallbackToLocal: asBoolean(aiProvider.fallbackToLocal, defaultSettings.aiProvider.fallbackToLocal)
    },
    dataSync: {
      enabled: asBoolean(dataSync.enabled, defaultSettings.dataSync.enabled),
      baseUrl: asString(dataSync.baseUrl, defaultSettings.dataSync.baseUrl).trim(),
      token: asString(dataSync.token, defaultSettings.dataSync.token).trim()
    }
  };
};

const normalizeUnit = (value: unknown, index: number): Unit | null => {
  if (!isRecord(value)) return null;
  const timestamp = validIsoOrNow(value.createdAt);
  // completedAt 是「全部掌握」的打点时间，只在合法 ISO 字符串时保留；缺失/非法时不得补 now。
  const completedAt = asString(value.completedAt);
  const hasValidCompletedAt = completedAt && !Number.isNaN(new Date(completedAt).getTime());

  return {
    id: asString(value.id) || uid("unit"),
    title: asString(value.title) || `Unit ${index + 1}`,
    description: asString(value.description),
    order: asNumber(value.order, index + 1),
    color: asString(value.color) || "#2563eb",
    groupId: asString(value.groupId) || undefined,
    createdAt: timestamp,
    updatedAt: validIsoOrNow(value.updatedAt || timestamp),
    ...(hasValidCompletedAt ? { completedAt } : {}),
    ...(asBoolean(value.speedRun) ? { speedRun: true } : {})
  };
};

const normalizeUnitGroup = (value: unknown, index: number): UnitGroup | null => {
  if (!isRecord(value)) return null;
  const timestamp = validIsoOrNow(value.createdAt);

  return {
    id: asString(value.id) || uid("unit_group"),
    title: asString(value.title) || `分组 ${index + 1}`,
    color: asString(value.color) || "#f06423",
    order: asNumber(value.order, index + 1),
    createdAt: timestamp,
    updatedAt: validIsoOrNow(value.updatedAt || timestamp)
  };
};

const normalizeCardType = (value: unknown): CardType => {
  if (value === "phrase" || value === "sentence") return value;
  return "word";
};

const normalizeCardStatus = (value: unknown): CardStatus => {
  if (value === "learning" || value === "review" || value === "mastered" || value === "suspended") return value;
  return "new";
};

const normalizeCard = (value: unknown): Card | null => {
  if (!isRecord(value)) return null;
  const timestamp = validIsoOrNow(value.createdAt);
  const type = normalizeCardType(value.type);
  const front = asString(value.front) || asString(value.word) || asString(value.sentence);
  const back = asString(value.back) || asString(value.translation);

  if (!front.trim() && !back.trim()) return null;

  const status = normalizeCardStatus(value.status);
  const updatedAt = validIsoOrNow(value.updatedAt || timestamp);

  return {
    id: asString(value.id) || uid("card"),
    type,
    front,
    back,
    note: asString(value.note),
    sourceId: asString(value.sourceId) || undefined,
    unitId: type === "word" ? asString(value.unitId) || undefined : undefined,
    tags: asStringArray(value.tags),
    status,
    priority: asBoolean(value.priority),
    // R13：masteredAt 是「进入掌握」的打点时间；历史 mastered 卡无此字段时回退 updatedAt，非 mastered 恒为 null。
    masteredAt: status === "mastered" ? validIsoOrNow(value.masteredAt || updatedAt) : null,
    createdAt: timestamp,
    updatedAt
  };
};

const normalizeWordDetails = (value: unknown, cards: Card[]): WordDetails | null => {
  if (!isRecord(value)) return null;
  const word = asString(value.word).trim().toLowerCase();
  const cardId =
    asString(value.cardId) ||
    cards.find((card) => card.type === "word" && card.front.trim().toLowerCase() === word)?.id ||
    "";

  if (!cardId) return null;
  const card = cards.find((item) => item.id === cardId);

  return {
    cardId,
    word: word || card?.front.trim().toLowerCase() || "",
    phonetic: asString(value.phonetic),
    partOfSpeech: asString(value.partOfSpeech),
    chineseDefinition: asString(value.chineseDefinition) || card?.back || "",
    englishDefinition: asString(value.englishDefinition),
    collocations: asString(value.collocations),
    synonyms: asString(value.synonyms),
    antonyms: asString(value.antonyms),
    confusedWords: asString(value.confusedWords),
    audioUrl: asString(value.audioUrl),
    sourceSentence: asString(value.sourceSentence)
  };
};

const normalizeSentenceDetails = (value: unknown, cards: Card[]): SentenceDetails | null => {
  if (!isRecord(value)) return null;
  const sentence = asString(value.sentence).trim();
  const cardId =
    asString(value.cardId) ||
    cards.find((card) => card.type === "sentence" && card.front.trim() === sentence)?.id ||
    "";

  if (!cardId) return null;
  const card = cards.find((item) => item.id === cardId);

  return {
    cardId,
    sentence: sentence || card?.front || "",
    translation: asString(value.translation) || card?.back || "",
    keywords: asStringArray(value.keywords),
    grammarNote: asString(value.grammarNote),
    audioUrl: asString(value.audioUrl)
  };
};

const fillMissingDetails = (cards: Card[], wordDetails: WordDetails[], sentenceDetails: SentenceDetails[]) => {
  const wordDetailIds = new Set(wordDetails.map((details) => details.cardId));
  const sentenceDetailIds = new Set(sentenceDetails.map((details) => details.cardId));

  return {
    wordDetails: [
      ...wordDetails,
      ...cards
        .filter((card) => card.type === "word" && !wordDetailIds.has(card.id))
        .map<WordDetails>((card) => ({
          cardId: card.id,
          word: card.front.trim().toLowerCase(),
          phonetic: "",
          partOfSpeech: "",
          chineseDefinition: card.back,
          englishDefinition: "",
          collocations: "",
          synonyms: "",
          antonyms: "",
          confusedWords: "",
          audioUrl: "",
          sourceSentence: ""
        }))
    ],
    sentenceDetails: [
      ...sentenceDetails,
      ...cards
        .filter((card) => card.type === "sentence" && !sentenceDetailIds.has(card.id))
        .map<SentenceDetails>((card) => ({
          cardId: card.id,
          sentence: card.front,
          translation: card.back,
          keywords: [],
          grammarNote: "",
          audioUrl: ""
        }))
    ]
  };
};

const normalizeMaterial = (value: unknown): Material | null => {
  if (!isRecord(value)) return null;
  const content = asString(value.content);
  const title = asString(value.title);
  if (!content && !title) return null;

  return {
    id: asString(value.id) || uid("material"),
    title: title || "未命名材料",
    type: value.type === "subtitle" || value.type === "audio" || value.type === "note" ? value.type : "text",
    content,
    sourceUrl: asString(value.sourceUrl),
    tags: asStringArray(value.tags),
    createdAt: validIsoOrNow(value.createdAt)
  };
};

const normalizeMaterialSegment = (value: unknown): MaterialSegment | null => {
  if (!isRecord(value)) return null;
  const text = asString(value.text);
  if (!text) return null;

  return {
    id: asString(value.id) || uid("segment"),
    materialId: asString(value.materialId),
    index: asNumber(value.index, 0),
    text,
    createdAt: validIsoOrNow(value.createdAt)
  };
};

const normalizeReviewMode = (value: unknown): ReviewMode => {
  if (
    value === "recall" ||
    value === "spelling" ||
    value === "cloze" ||
    value === "dictation" ||
    value === "rebuild"
  ) {
    return value;
  }
  return "recognize";
};

const normalizeRating = (value: unknown): Rating => {
  const rating = Math.round(asNumber(value, 3));
  if (rating <= 1) return 1;
  if (rating === 2) return 2;
  if (rating === 3) return 3;
  return 4;
};

const normalizeReview = (value: unknown, cardIds: Set<string>): Review | null => {
  if (!isRecord(value)) return null;
  const cardId = asString(value.cardId);
  if (!cardIds.has(cardId)) return null;

  return {
    id: asString(value.id) || uid("review"),
    cardId,
    mode: normalizeReviewMode(value.mode),
    rating: normalizeRating(value.rating),
    answer: asString(value.answer),
    diffJson: asString(value.diffJson, "[]"),
    reviewedAt: validIsoOrNow(value.reviewedAt)
  };
};

const normalizeMistakeGenerationType = (value: unknown): MistakeGenerationType =>
  value === "story" ? "story" : "examples";

const normalizeMistakeGenerationLevel = (value: unknown): MistakeGenerationLevel | undefined => {
  if (value === "A2" || value === "B1" || value === "B2") return value;
  return undefined;
};

const normalizeMistakeGenerationLength = (value: unknown): MistakeGenerationLength | undefined => {
  if (value === "short" || value === "medium" || value === "long") return value;
  return undefined;
};

const normalizeMistakeGenerationWordStatus = (value: unknown): MistakeGenerationWordStatus | undefined => {
  if (value === "pending" || value === "improving" || value === "mastered" || value === "stubborn") return value;
  return undefined;
};

const normalizeMistakeGenerationSettings = (value: unknown): MistakeGenerationSettings | undefined => {
  if (!isRecord(value)) return undefined;

  const normalized: MistakeGenerationSettings = {};
  const level = normalizeMistakeGenerationLevel(value.level);
  const scene = asString(value.scene).trim();
  const length = normalizeMistakeGenerationLength(value.length);
  const tone = asString(value.tone).trim();

  if (level) normalized.level = level;
  if (scene) normalized.scene = scene;
  if (length) normalized.length = length;
  if (tone) normalized.tone = tone;
  if (typeof value.bilingual === "boolean") normalized.bilingual = value.bilingual;

  return Object.keys(normalized).length > 0 ? normalized : undefined;
};

const filterKnownCardIds = (value: unknown, cardIds: Set<string>) =>
  asTrimmedStringArray(value).filter((cardId) => cardIds.has(cardId));

const normalizeMistakeGenerationWordSnapshots = (
  value: unknown,
  cardIds: Set<string>
): MistakeGenerationWordSnapshot[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const snapshots = value
    .filter(isRecord)
    .map<MistakeGenerationWordSnapshot | null>((snapshot) => {
      const cardId = asString(snapshot.cardId).trim();
      if (!cardIds.has(cardId)) return null;
      const status = normalizeMistakeGenerationWordStatus(snapshot.status);

      return {
        cardId,
        word: asString(snapshot.word).trim(),
        translation: asString(snapshot.translation).trim(),
        wrongAnswers: asTrimmedStringArray(snapshot.wrongAnswers),
        ...(status ? { status } : {})
      };
    })
    .filter((snapshot): snapshot is MistakeGenerationWordSnapshot => Boolean(snapshot));

  return snapshots.length > 0 ? snapshots : undefined;
};

const normalizeMistakeGenerationCoverage = (
  value: unknown,
  cardIds: Set<string>
): MistakeGenerationCoverage | undefined => {
  if (!isRecord(value)) return undefined;

  const coverage = {
    usedCardIds: filterKnownCardIds(value.usedCardIds, cardIds),
    missingCardIds: filterKnownCardIds(value.missingCardIds, cardIds)
  };

  return coverage.usedCardIds.length > 0 || coverage.missingCardIds.length > 0 ? coverage : undefined;
};

const normalizeMistakeGenerationStory = (value: unknown): MistakeGenerationStory | undefined => {
  if (!isRecord(value)) return undefined;

  const wordNotes = (Array.isArray(value.wordNotes) ? value.wordNotes : [])
    .filter(isRecord)
    .map((note) => ({
      word: asString(note.word).trim(),
      sentence: asString(note.sentence).trim(),
      meaning: asString(note.meaning).trim()
    }))
    .filter((note) => note.word || note.sentence || note.meaning);
  const story = {
    title: asString(value.title).trim(),
    englishStory: asString(value.englishStory).trim(),
    chineseTranslation: asString(value.chineseTranslation).trim(),
    usedWords: asTrimmedStringArray(value.usedWords),
    missingWords: asTrimmedStringArray(value.missingWords),
    wordNotes
  };

  return story.title ||
    story.englishStory ||
    story.chineseTranslation ||
    story.usedWords.length > 0 ||
    story.missingWords.length > 0 ||
    story.wordNotes.length > 0
    ? story
    : undefined;
};

const normalizeMistakeGeneration = (value: unknown, cardIds: Set<string>): MistakeGeneration | null => {
  if (!isRecord(value)) return null;
  const content = asString(value.content).trim();
  if (!content) return null;

  const type = normalizeMistakeGenerationType(value.type);
  const settings = normalizeMistakeGenerationSettings(value.settings);
  const wordSnapshots = normalizeMistakeGenerationWordSnapshots(value.wordSnapshots, cardIds);
  const coverage = normalizeMistakeGenerationCoverage(value.coverage, cardIds);
  const story = normalizeMistakeGenerationStory(value.story);

  return {
    id: asString(value.id) || uid("mistake_generation"),
    dateKey: asString(value.dateKey) || localDateKey(value.createdAt),
    type,
    cardIds: filterKnownCardIds(value.cardIds, cardIds),
    title: asString(value.title) || (type === "story" ? "错词故事" : "错词例句"),
    content,
    prompt: asString(value.prompt),
    createdAt: validIsoOrNow(value.createdAt),
    ...(settings ? { settings } : {}),
    ...(wordSnapshots ? { wordSnapshots } : {}),
    ...(coverage ? { coverage } : {}),
    ...(story ? { story } : {})
  };
};

const normalizeAdventureLevel = (value: unknown): AdventureLevel => {
  if (value === "A1" || value === "A2" || value === "B1" || value === "B2" || value === "C1") return value;
  return "A2";
};

const normalizeAdventureTemplate = (value: unknown): AdventureTemplate => {
  if (value === "campus" || value === "city" || value === "travel" || value === "fantasy" || value === "custom") return value;
  return "city";
};

const normalizeAdventureSource = (value: unknown): AdventureNodeSource => value === "ai" ? "ai" : "offline";

const normalizeAdventureChoices = (value: unknown): AdventureChoice[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map((choice, index) => ({
      id: asString(choice.id).trim() || `choice_${index + 1}`,
      label: asString(choice.label).trim(),
      description: asString(choice.description).trim(),
      promptHint: asString(choice.promptHint).trim()
    }))
    .filter((choice) => choice.label)
    .slice(0, 4);

const normalizeAdventureVocabulary = (value: unknown): AdventureVocabulary[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map((item) => ({
      word: asString(item.word).trim().toLowerCase(),
      translation: asString(item.translation).trim(),
      partOfSpeech: asString(item.partOfSpeech).trim(),
      sentence: asString(item.sentence).trim(),
      cardId: asString(item.cardId).trim() || undefined
    }))
    .filter((item) => item.word);

const normalizeAdventureNode = (value: unknown, index: number): AdventureNode | null => {
  if (!isRecord(value)) return null;
  const englishText = asString(value.englishText).trim();
  if (!englishText) return null;

  return {
    id: asString(value.id).trim() || uid("adventure_node"),
    parentId: asString(value.parentId).trim() || undefined,
    chapter: Math.max(1, Math.round(asNumber(value.chapter, index + 1))),
    title: asString(value.title).trim() || `Chapter ${index + 1}`,
    englishText,
    chineseText: asString(value.chineseText).trim(),
    sentenceTranslations: asTrimmedStringArray(value.sentenceTranslations),
    summary: asString(value.summary).trim(),
    source: normalizeAdventureSource(value.source),
    choices: normalizeAdventureChoices(value.choices),
    selectedChoiceId: asString(value.selectedChoiceId).trim() || undefined,
    customAction: asString(value.customAction).trim() || undefined,
    vocabulary: normalizeAdventureVocabulary(value.vocabulary),
    createdAt: validIsoOrNow(value.createdAt)
  };
};

const normalizeAdventure = (value: unknown): Adventure | null => {
  if (!isRecord(value)) return null;
  const nodes = (Array.isArray(value.nodes) ? value.nodes : [])
    .map(normalizeAdventureNode)
    .filter((node): node is AdventureNode => Boolean(node));
  if (nodes.length === 0) return null;

  const nodeIds = new Set(nodes.map((node) => node.id));
  const validNodes = nodes.map((node) => ({
    ...node,
    parentId: node.parentId && nodeIds.has(node.parentId) ? node.parentId : undefined,
    selectedChoiceId: node.selectedChoiceId && node.choices.some((choice) => choice.id === node.selectedChoiceId)
      ? node.selectedChoiceId
      : undefined
  }));
  const currentNodeId = asString(value.currentNodeId).trim();

  return {
    id: asString(value.id).trim() || uid("adventure"),
    title: asString(value.title).trim() || "未命名冒险",
    template: normalizeAdventureTemplate(value.template),
    // 冒险对应的场景插画 ID（AdventureSceneId）；非法值交给页面侧按关键词兜底。
    scene: asString(value.scene).trim() || undefined,
    // 内置主题库 ID，缺省/非法时列表回退到 scene 插画。
    themeId: asString(value.themeId).trim() || undefined,
    level: normalizeAdventureLevel(value.level),
    customPrompt: asString(value.customPrompt).trim(),
    createdAt: validIsoOrNow(value.createdAt),
    updatedAt: validIsoOrNow(value.updatedAt || value.createdAt),
    currentNodeId: nodeIds.has(currentNodeId) ? currentNodeId : validNodes[validNodes.length - 1].id,
    nodes: validNodes
  };
};

const normalizeGrammarErrorTag = (value: unknown): GrammarErrorTag => {
  const allowed: GrammarErrorTag[] = [
    "tense",
    "sv_agreement",
    "missing_be",
    "article",
    "plural",
    "preposition",
    "fragment",
    "run_on",
    "word_order",
    "verb_form",
    "comparison"
  ];
  const tag = asString(value).trim();
  return (allowed as string[]).includes(tag) ? (tag as GrammarErrorTag) : "tense";
};

const normalizeDiaryEntries = (value: unknown): DiaryEntry[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map<DiaryEntry>((item) => ({
      id: asString(item.id) || uid("diary"),
      dateKey: asString(item.dateKey).trim() || localDateKey(item.createdAt),
      questionId: asString(item.questionId).trim(),
      questionZh: asString(item.questionZh).trim(),
      answerEn: asString(item.answerEn).trim(),
      correctedEn: asString(item.correctedEn).trim(),
      issues: (Array.isArray(item.issues) ? item.issues : [])
        .filter(isRecord)
        .map((issue) => ({
          original: asString(issue.original),
          correction: asString(issue.correction),
          explanation: asString(issue.explanation),
          ...(issue.tag ? { tag: normalizeGrammarErrorTag(issue.tag) } : {})
        }))
        .filter((issue) => issue.original || issue.correction),
      status: item.status === "done" ? ("done" as const) : ("pending" as const),
      note: asString(item.note).trim() || undefined,
      // 逐字段重建：新字段必须显式保留，否则存一次就被抹掉（followUp 曾漏在这里）
      followUp: asString(item.followUp).trim() || undefined,
      createdAt: validIsoOrNow(item.createdAt)
    }))
    .filter((item) => item.answerEn && item.questionId);

const normalizeHuntAttempts = (value: unknown): HuntAttempt[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map<HuntAttempt>((item) => ({
      id: asString(item.id) || uid("hunt_attempt"),
      caseId: asString(item.caseId).trim(),
      tokenIndex: Math.max(0, Math.round(asNumber(item.tokenIndex, 0))),
      guessedTag: item.guessedTag == null || asString(item.guessedTag) === ""
        ? null
        : normalizeGrammarErrorTag(item.guessedTag),
      hit: asBoolean(item.hit),
      createdAt: validIsoOrNow(item.createdAt)
    }))
    .filter((item) => item.caseId);

const normalizeHuntResults = (value: unknown): HuntResult[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map<HuntResult>((item) => ({
      id: asString(item.id) || uid("hunt_result"),
      caseId: asString(item.caseId).trim(),
      found: Math.max(0, Math.round(asNumber(item.found, 0))),
      total: Math.max(0, Math.round(asNumber(item.total, 0))),
      misses: Math.max(0, Math.round(asNumber(item.misses, 0))),
      stars: Math.min(3, Math.max(0, Math.round(asNumber(item.stars, 0)))),
      durationMs: Math.max(0, Math.round(asNumber(item.durationMs, 0))),
      finishedAt: validIsoOrNow(item.finishedAt)
    }))
    .filter((item) => item.caseId);

const localDateKey = (value: unknown) => {
  const date = new Date(validIsoOrNow(value));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/* ── 语言之门 / 符文 归一化（GRAMMAR_ADVENTURE_PLAN §8.2）──────────────── */

const GATE_MODES = ["complete", "say", "respond"] as const;
const RUNE_MASTERIES = ["unseen", "seen", "usable", "fluent", "instinct"] as const;
const GATE_VERDICTS = ["pass", "near", "misread"] as const;

const normalizeMisreadBranches = (value: unknown): MisreadBranch[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map<MisreadBranch>((item) => ({
      errorTag: normalizeGrammarErrorTag(item.errorTag),
      npcReply: asString(item.npcReply),
      npcReplyZh: asString(item.npcReplyZh),
      lampHint: asString(item.lampHint)
    }))
    .filter((item) => item.npcReply);

const normalizeLanguageGates = (value: unknown): LanguageGate[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map<LanguageGate>((item) => {
      const hintsRaw = Array.isArray(item.hints) ? item.hints.map((hint) => asString(hint)) : [];
      const hints: [string, string, string] = [hintsRaw[0] ?? "", hintsRaw[1] ?? "", hintsRaw[2] ?? ""];
      return {
        id: asString(item.id) || uid("gate"),
        topicId: asString(item.topicId),
        runeId: asString(item.runeId),
        mode: GATE_MODES.includes(item.mode as (typeof GATE_MODES)[number]) ? (item.mode as LanguageGate["mode"]) : "say",
        npcLine: asString(item.npcLine),
        npcLineZh: asString(item.npcLineZh),
        zhIntent: asString(item.zhIntent),
        canDo: asString(item.canDo) || asString(item.zhIntent),
        requiredPattern: asString(item.requiredPattern),
        sampleAnswer: asString(item.sampleAnswer),
        hints,
        skeleton: isRecord(item.skeleton)
          ? {
              subject: asString(item.skeleton.subject),
              verb: asString(item.skeleton.verb),
              subjectLabel: asString(item.skeleton.subjectLabel),
              verbLabel: asString(item.skeleton.verbLabel)
            }
          : { subject: "", verb: "", subjectLabel: "", verbLabel: "" },
        counterExample: asString(item.counterExample),
        counterNote: asString(item.counterNote),
        acceptRegex: asString(item.acceptRegex) || undefined,
        misreadBranches: normalizeMisreadBranches(item.misreadBranches)
      };
    })
    .filter((item) => item.npcLine && item.sampleAnswer);

const normalizeGateAttempts = (value: unknown): GateAttempt[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map<GateAttempt>((item) => ({
      id: asString(item.id) || uid("gate_attempt"),
      adventureId: asString(item.adventureId),
      nodeId: asString(item.nodeId),
      gateId: asString(item.gateId),
      topicId: asString(item.topicId),
      raw: asString(item.raw),
      verdict: GATE_VERDICTS.includes(item.verdict as (typeof GATE_VERDICTS)[number]) ? (item.verdict as GateAttempt["verdict"]) : "near",
      errorTags: (Array.isArray(item.errorTags) ? item.errorTags : []).map(normalizeGrammarErrorTag),
      hintsUsed: Math.max(0, Math.round(asNumber(item.hintsUsed, 0))),
      attemptIndex: Math.max(1, Math.round(asNumber(item.attemptIndex, 1))),
      createdAt: validIsoOrNow(item.createdAt)
    }))
    .filter((item) => item.gateId);

const normalizeRuneStates = (value: unknown): RuneState[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map<RuneState>((item) => ({
      runeId: asString(item.runeId),
      mastery: RUNE_MASTERIES.includes(item.mastery as (typeof RUNE_MASTERIES)[number]) ? (item.mastery as RuneState["mastery"]) : "unseen",
      xp: Math.max(0, Math.round(asNumber(item.xp, 0))),
      unlockedAt: item.unlockedAt ? validIsoOrNow(item.unlockedAt) : undefined
    }))
    .filter((item) => item.runeId);

const createDefaultSchedule = (cardId: string): Schedule => ({
  cardId,
  easeFactor: 2.5,
  intervalDays: 0,
  reviewCount: 0,
  lapseCount: 0,
  nextReviewAt: nowIso()
});

const normalizeSchedules = (value: unknown, cards: Card[]) => {
  const cardIds = new Set(cards.map((card) => card.id));
  const schedulesByCardId = new Map<string, Schedule>();

  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isRecord(item)) continue;
      const cardId = asString(item.cardId);
      if (!cardIds.has(cardId) || schedulesByCardId.has(cardId)) continue;

      schedulesByCardId.set(cardId, {
        cardId,
        easeFactor: Math.max(1.3, asNumber(item.easeFactor, 2.5)),
        intervalDays: Math.max(0, Math.round(asNumber(item.intervalDays, 0))),
        reviewCount: Math.max(0, Math.round(asNumber(item.reviewCount, 0))),
        lapseCount: Math.max(0, Math.round(asNumber(item.lapseCount, 0))),
        nextReviewAt: validIsoOrNow(item.nextReviewAt),
        // R2：recoveryCount 透传（可选字段，旧数据缺省为 undefined，无需迁移版本号）。
        ...(item.recoveryCount !== undefined
          ? { recoveryCount: Math.max(0, Math.round(asNumber(item.recoveryCount, 0))) }
          : {})
      });
    }
  }

  for (const card of cards) {
    if (!schedulesByCardId.has(card.id)) {
      schedulesByCardId.set(card.id, createDefaultSchedule(card.id));
    }
  }

  return Array.from(schedulesByCardId.values());
};

const normalizeDictionaryEntries = (value: unknown): DictionaryEntry[] => {
  if (!Array.isArray(value)) return seedDictionary;
  const entries = value
    .filter(isRecord)
    .map<DictionaryEntry>((entry) => ({
      word: asString(entry.word),
      phonetic: asString(entry.phonetic),
      partOfSpeech: asString(entry.partOfSpeech),
      definition: asString(entry.definition),
      translation: asString(entry.translation),
      collocations: asString(entry.collocations)
    }))
    .filter((entry) => entry.word || entry.translation);

  return entries.length > 0 ? entries : seedDictionary;
};

/**
 * M1 启动迁移（P0-3 + P1-7）：词书粒度重组（≤200 词/本）+ 维护 Unit.completedAt。
 * 幂等：拆完后所有词书 ≤200，重复执行为 no-op；在 loadData / 恢复备份时执行。
 */
const applyStartupMigration = (data: AppData): AppData => {
  const restructured = restructureOversizedUnits(data).data;
  return syncUnitCompletion(restructured);
};

export const migrateData = (raw: unknown): AppData => {  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!isRecord(parsed) || !hasRecognizableAppShape(parsed)) {
    throw new Error("这不是可识别的听写工坊 JSON 备份。");
  }

  const cards = (Array.isArray(parsed.cards) ? parsed.cards : [])
    .map(normalizeCard)
    .filter((card): card is Card => Boolean(card));
  const cardIds = new Set(cards.map((card) => card.id));
  const normalizedWordDetails = (Array.isArray(parsed.wordDetails) ? parsed.wordDetails : [])
    .map((details) => normalizeWordDetails(details, cards))
    .filter((details): details is WordDetails => Boolean(details))
    .filter((details) => cardIds.has(details.cardId));
  const normalizedSentenceDetails = (Array.isArray(parsed.sentenceDetails) ? parsed.sentenceDetails : [])
    .map((details) => normalizeSentenceDetails(details, cards))
    .filter((details): details is SentenceDetails => Boolean(details))
    .filter((details) => cardIds.has(details.cardId));
  const details = fillMissingDetails(cards, normalizedWordDetails, normalizedSentenceDetails);
  const materials = (Array.isArray(parsed.materials) ? parsed.materials : [])
    .map(normalizeMaterial)
    .filter((material): material is Material => Boolean(material));
  const materialIds = new Set(materials.map((material) => material.id));
  const materialSegments = (Array.isArray(parsed.materialSegments) ? parsed.materialSegments : [])
    .map(normalizeMaterialSegment)
    .filter((segment): segment is MaterialSegment => Boolean(segment && materialIds.has(segment.materialId)));

  const normalizedData: AppData = {
    ...createInitialData(),
    schemaVersion: APP_SCHEMA_VERSION,
    unitGroups: (Array.isArray(parsed.unitGroups) ? parsed.unitGroups : [])
      .map(normalizeUnitGroup)
      .filter((group): group is UnitGroup => Boolean(group)),
    units: (Array.isArray(parsed.units) ? parsed.units : [])
      .map(normalizeUnit)
      .filter((unit): unit is Unit => Boolean(unit)),
    cards,
    wordDetails: details.wordDetails,
    sentenceDetails: details.sentenceDetails,
    materials,
    materialSegments,
    reviews: (Array.isArray(parsed.reviews) ? parsed.reviews : [])
      .map((review) => normalizeReview(review, cardIds))
      .filter((review): review is Review => Boolean(review)),
    mistakeGenerations: (Array.isArray(parsed.mistakeGenerations) ? parsed.mistakeGenerations : [])
      .map((generation) => normalizeMistakeGeneration(generation, cardIds))
      .filter((generation): generation is MistakeGeneration => Boolean(generation)),
    adventures: (Array.isArray(parsed.adventures) ? parsed.adventures : [])
      .map(normalizeAdventure)
      .filter((adventure): adventure is Adventure => Boolean(adventure)),
    huntAttempts: normalizeHuntAttempts(parsed.huntAttempts),
    huntResults: normalizeHuntResults(parsed.huntResults),
    grammarLessonsDone: asStringArray(parsed.grammarLessonsDone),
    grammarLessonStagesDone: normalizeLessonStagesDone(parsed.grammarLessonStagesDone),
    grammarBoostsDone: normalizeLessonTiersDone(parsed.grammarBoostsDone),
    diaryEntries: normalizeDiaryEntries(parsed.diaryEntries),
    schedules: normalizeSchedules(parsed.schedules, cards),
    dictionaryEntries: normalizeDictionaryEntries(parsed.dictionaryEntries),
    seededWordVersions: asStringArray(parsed.seededWordVersions),
    languageGates: normalizeLanguageGates(parsed.languageGates),
    gateAttempts: normalizeGateAttempts(parsed.gateAttempts),
    runeStates: normalizeRuneStates(parsed.runeStates),
    settings: normalizeSettings(parsed.settings)
  };

  // F1 旧数据回填（幂等）：双写上线前的存量 grammarLessonsDone 进度 = 关 1 完成，补进新字段。
  // 内联实现而非调 lessonService.backfillLessonStages——避免 storage → lessonService → cardService → storage 循环依赖。
  // 逻辑与 lessonService.backfillLessonStages 等价（纯数据操作）：旧字段有值但新字段缺 1 的课补 [1]。
  const stagesDone = { ...normalizedData.grammarLessonStagesDone };
  for (const lessonId of normalizedData.grammarLessonsDone) {
    const existing = new Set(stagesDone[lessonId] ?? []);
    if (existing.has(1)) continue;
    existing.add(1);
    stagesDone[lessonId] = [...existing].sort((a, b) => a - b);
  }
  const withStages: AppData = { ...normalizedData, grammarLessonStagesDone: stagesDone };
  return { ...seedCoreWords(withStages), schemaVersion: APP_SCHEMA_VERSION };
};

const seedCoreWords = (data: AppData): AppData => {
  if (data.seededWordVersions.includes(CORE_100_WORDS_VERSION)) {
    return ensureDefaultUnits(data);
  }

  const existingWords = new Set(data.wordDetails.map((details) => details.word.toLowerCase()));
  const timestamp = nowIso();
  const seededUnits = createCoreUnits(timestamp);
  const nextCards = [...data.cards];
  const nextWordDetails = [...data.wordDetails];
  const nextSchedules = [...data.schedules];

  for (const [index, seed] of core100Words.entries()) {
    const normalized = seed.word.toLowerCase();
    if (existingWords.has(normalized)) continue;
    const unitId = seededUnits[Math.floor(index / 20)]?.id ?? seededUnits[0].id;

    const cardId = uid("card");
    nextCards.push({
      id: cardId,
      type: "word",
      front: normalized,
      back: seed.translation,
      note: "内置核心词",
      unitId,
      tags: ["核心100"],
      status: "new",
      priority: false,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    nextWordDetails.push({
      cardId,
      word: normalized,
      phonetic: seed.phonetic,
      partOfSpeech: seed.partOfSpeech,
      chineseDefinition: seed.translation,
      englishDefinition: seed.definition,
      collocations: seed.collocations,
      synonyms: "",
      antonyms: "",
      confusedWords: "",
      audioUrl: "",
      sourceSentence: seed.sourceSentence
    });

    nextSchedules.push({
      cardId,
      easeFactor: 2.5,
      intervalDays: 0,
      reviewCount: 0,
      lapseCount: 0,
      nextReviewAt: timestamp
    });

    existingWords.add(normalized);
  }

  const existingGroupTitles = new Set(data.unitGroups.map((group) => group.title.trim()));
  const defaultGroups = createDefaultUnitGroups(timestamp).filter((group) => !existingGroupTitles.has(group.title));
  const unitGroups = mergeUnitGroups(data.unitGroups, defaultGroups);
  const adventureGroupId = unitGroups.find((group) => group.title.trim() === "冒险积累")?.id;
  return {
    ...data,
    unitGroups,
    units: mergeUnits(data.units, [...seededUnits, createAdventureAccumulationUnit(timestamp, adventureGroupId)]),
    cards: nextCards,
    wordDetails: nextWordDetails,
    schedules: nextSchedules,
    seededWordVersions: [...data.seededWordVersions, CORE_100_WORDS_VERSION]
  };
};

const createCoreUnits = (timestamp: string) =>
  Array.from({ length: 5 }, (_, index) => ({
    id: `core-100-unit-${index + 1}`,
    title: `核心100 - Unit ${index + 1}`,
    description: `内置核心词第 ${index * 20 + 1}-${(index + 1) * 20} 个`,
    order: index + 1,
    color: "#f06423",
    groupId: "group-core-100",
    createdAt: timestamp,
    updatedAt: timestamp
  }));

const createAdventureAccumulationUnit = (timestamp: string, groupId = "group-adventure-accumulation"): Unit => ({
  id: "unit-adventure-accumulation",
  title: "冒险积累",
  description: "在冒险阅读中收藏的单词",
  order: 6,
  color: "#177e78",
  groupId,
  createdAt: timestamp,
  updatedAt: timestamp
});

const createDefaultUnitGroups = (timestamp: string): UnitGroup[] => [
  {
    id: "group-core-100",
    title: "核心100",
    color: "#f06423",
    order: 1,
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: "group-adventure-accumulation",
    title: "冒险积累",
    color: "#177e78",
    order: 2,
    createdAt: timestamp,
    updatedAt: timestamp
  }
];

const mergeUnits = (currentUnits: AppData["units"], nextUnits: AppData["units"]) => {
  const existingIds = new Set(currentUnits.map((unit) => unit.id));
  return [...currentUnits, ...nextUnits.filter((unit) => !existingIds.has(unit.id))].sort((a, b) => a.order - b.order);
};

const mergeUnitGroups = (currentGroups: AppData["unitGroups"], nextGroups: AppData["unitGroups"]) => {
  const existingIds = new Set(currentGroups.map((group) => group.id));
  return [...currentGroups, ...nextGroups.filter((group) => !existingIds.has(group.id))].sort((a, b) => a.order - b.order);
};

const ensureDefaultUnits = (data: AppData): AppData => {
  const timestamp = nowIso();
  const existingGroupTitles = new Set((data.unitGroups ?? []).map((group) => group.title.trim()));
  const defaultGroups = createDefaultUnitGroups(timestamp).filter((group) => !existingGroupTitles.has(group.title));
  const unitGroups = mergeUnitGroups(data.unitGroups ?? [], defaultGroups);
  const coreUnits = createCoreUnits(timestamp);
  const adventureGroupId = unitGroups.find((group) => group.title.trim() === "冒险积累")?.id;
  const units = mergeUnits(data.units ?? [], [...coreUnits, createAdventureAccumulationUnit(timestamp, adventureGroupId)]).map((unit) =>
    unit.id.startsWith("core-100-unit-") && !unit.groupId ? { ...unit, groupId: "group-core-100", color: "#f06423" } : unit
  );
  const wordCards = data.cards.filter((card) => card.type === "word");
  const cards = data.cards.map((card) => {
    if (card.type !== "word" || card.unitId) return card;
    const wordIndex = wordCards.findIndex((wordCard) => wordCard.id === card.id);
    const unitId = coreUnits[Math.max(0, Math.floor(wordIndex / 20))]?.id ?? coreUnits[0].id;
    return { ...card, unitId };
  });

  if (units === data.units && cards === data.cards && unitGroups === data.unitGroups) return data;
  return { ...data, unitGroups, units, cards };
};

export const loadData = (): AppData => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = applyStartupMigration(seedCoreWords(createInitialData()));
    saveData(initial);
    return initial;
  }

  try {
    const migrated = applyStartupMigration(migrateData(raw));
    // R12：干净数据马上会被写回，修复信号必须在这里捕获留档。
    // 报告是粘性的：只在发现新修复时覆盖，不因后续干净启动而清除
    //（否则 HMR/二次刷新会立刻抹掉它，用户永远看不到）。
    const repairs = summarizeStartupRepairs(raw, migrated);
    if (repairs.length > 0) recordStartupRepairs(repairs);
    saveData(migrated);
    return migrated;
  } catch {
    recordStartupRepairs(["本地数据损坏（无法解析），已自动重置为初始状态；如有 JSON 备份可在设置页恢复"]);
    const initial = applyStartupMigration(seedCoreWords(createInitialData()));
    saveData(initial);
    return initial;
  }
};

export const saveData = (data: AppData) => {
  const normalized = migrateData(data);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
};

export const resetData = () => {
  const initial = seedCoreWords(createInitialData());
  saveData(initial);
  return initial;
};

/** R02：解析 JSON 备份用于预览——与 restoreDataFromJson 同一条迁移管线，但不写 localStorage。 */
export const parseBackupJson = (json: string): AppData => applyStartupMigration(migrateData(json));

export const restoreDataFromJson = (json: string): AppData => {
  const restored = parseBackupJson(json);
  saveData(restored);
  return restored;
};

export const markDataExported = (data: AppData, exportedAt = nowIso()): AppData => ({
  ...data,
  settings: {
    ...data.settings,
    lastExportedAt: exportedAt
  }
});

/** R03：一次成功的云同步（上传或恢复）同样是一次有效备份，记录到 lastSyncedAt。 */
export const markDataSyncedBackup = (data: AppData, syncedAt = nowIso()): AppData => ({
  ...data,
  settings: {
    ...data.settings,
    lastSyncedAt: syncedAt
  }
});

/**
 * R12 存储健康诊断。关键约束：loadData 迁移后会立刻把干净数据写回 localStorage，
 * 页面代码永远读不到"脏"快照——因此修复信号必须在 loadData 内捕获，
 * 以一份轻量报告（STARTUP_REPAIR_KEY）留给设置页展示。
 * - repaired：最近一次启动时被自动修复/清理的问题（旧 schema、孤儿引用、损坏重置）。
 * - issues：当前仍需用户处理的问题（体积超限、存储不可读）。
 * 只读不改——修复动作（导出/重置）由设置页触发。
 */
export interface DataDiagnosis {
  /** 无 repaired 且无 issues。 */
  ok: boolean;
  /** 最近一次启动时自动修复/清理的问题描述。 */
  repaired: string[];
  /** 当前仍然存在的问题描述（需要用户动作）。 */
  issues: string[];
  schemaVersion: number;
  sizeKb: number;
  /** 修复报告生成时间（ISO），无报告时为空串。 */
  repairedAt: string;
}

export const LOCAL_STORAGE_SOFT_LIMIT_KB = 4096;
const STARTUP_REPAIR_KEY = "personal-vocab-startup-repairs-v1";

/** 纯函数：对比启动时的 raw 快照与迁移结果，列出被自动修复/清理的问题。 */
export const summarizeStartupRepairs = (rawJson: string, normalized: AppData): string[] => {
  let raw: unknown;
  try {
    raw = JSON.parse(rawJson);
  } catch {
    return ["本地数据损坏（无法解析），已自动重置为初始状态；如有 JSON 备份可在设置页恢复"];
  }
  if (!isRecord(raw)) return [];

  const items: string[] = [];
  if (raw.schemaVersion !== APP_SCHEMA_VERSION) {
    items.push(`旧版本数据结构（v${asNumber(raw.schemaVersion, 0)}）已自动迁移到 v${APP_SCHEMA_VERSION}`);
  }
  const rawCards = Array.isArray(raw.cards) ? raw.cards : [];
  const rawCardIds = new Set(rawCards.map((card) => (isRecord(card) ? asString(card.id) : "")).filter(Boolean));
  const rawReviews = Array.isArray(raw.reviews) ? raw.reviews : [];
  const orphanReviews = rawReviews.filter(
    (review) => !isRecord(review) || !rawCardIds.has(asString(review.cardId))
  ).length;
  if (orphanReviews > 0 || rawReviews.length > normalized.reviews.length) {
    items.push(`${Math.max(orphanReviews, rawReviews.length - normalized.reviews.length)} 条无效复习记录（找不到对应卡片）已自动清理`);
  }
  const rawMaterials = Array.isArray(raw.materials) ? raw.materials : [];
  const rawMaterialIds = new Set(
    rawMaterials.map((material) => (isRecord(material) ? asString(material.id) : "")).filter(Boolean)
  );
  const rawSegments = Array.isArray(raw.materialSegments) ? raw.materialSegments : [];
  const orphanSegments = rawSegments.filter(
    (segment) => !isRecord(segment) || !rawMaterialIds.has(asString(segment.materialId))
  ).length;
  if (orphanSegments > 0) {
    items.push(`${orphanSegments} 个无效句段（找不到所属材料）已自动清理`);
  }
  return items;
};

const recordStartupRepairs = (items: string[]) => {
  try {
    window.localStorage.setItem(STARTUP_REPAIR_KEY, JSON.stringify({ at: nowIso(), items }));
  } catch {
    // 存储不可用时忽略——诊断报告只是增强，不影响主流程。
  }
};

/** 用户在设置页确认"知道了"后清除修复报告。 */
export const clearStartupRepairReport = () => {
  try {
    window.localStorage.removeItem(STARTUP_REPAIR_KEY);
  } catch {
    // 忽略。
  }
};

/** 纯函数：由修复条目 + 体积 + 存储可用性组装诊断结果。 */
export const buildDiagnosis = (
  repaired: string[],
  sizeKb: number,
  schemaVersion: number,
  storageIssue?: string,
  repairedAt = ""
): DataDiagnosis => {
  const issues = storageIssue ? [storageIssue] : [];
  if (sizeKb > LOCAL_STORAGE_SOFT_LIMIT_KB) {
    issues.push(`本地数据约 ${(sizeKb / 1024).toFixed(1)}MB，接近浏览器存储上限，建议导出备份后清理`);
  }
  return { ok: repaired.length === 0 && issues.length === 0, repaired, issues, schemaVersion, sizeKb, repairedAt };
};

/** 读取 localStorage（数据快照体积 + 启动修复报告）并诊断。 */
export const diagnoseStoredData = (data: AppData): DataDiagnosis => {
  if (typeof window === "undefined") {
    return buildDiagnosis([], 0, data.schemaVersion, "读不到本地存储快照，浏览器可能限制了存储访问");
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const sizeKb = Math.round((raw ?? JSON.stringify(data)).length / 1024);
    let repaired: string[] = [];
    let repairedAt = "";
    const repairRaw = window.localStorage.getItem(STARTUP_REPAIR_KEY);
    if (repairRaw) {
      try {
        const parsed: unknown = JSON.parse(repairRaw);
        if (isRecord(parsed) && Array.isArray(parsed.items)) {
          repaired = parsed.items.filter((item): item is string => typeof item === "string");
          repairedAt = asString(parsed.at);
        }
      } catch {
        // 报告损坏时按无报告处理。
      }
    }
    return buildDiagnosis(
      repaired,
      sizeKb,
      data.schemaVersion,
      raw === null ? "读不到本地存储快照，浏览器可能限制了存储访问" : undefined,
      repairedAt
    );
  } catch {
    return buildDiagnosis([], 0, data.schemaVersion, "访问本地存储被浏览器拒绝，请检查隐私模式或站点权限设置");
  }
};

export const needsBackupReminder = (data: AppData, dayThreshold = 7) => {
  if (data.cards.length === 0 && data.reviews.length === 0) return false;

  // 备份时间点取「本地导出」与「云同步成功」两者中较近的一个（R03：
  // 之前只看 lastExportedAt，开了云同步的用户会被误报「7 天未备份」）。
  const backupTimes = [data.settings.lastExportedAt, data.settings.lastSyncedAt]
    .map((value) => new Date(value).getTime())
    .filter((time) => Number.isFinite(time));
  if (backupTimes.length === 0) return true;
  return Date.now() - Math.max(...backupTimes) > dayThreshold * 24 * 60 * 60 * 1000;
};

export const downloadTextFile = (filename: string, content: string, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
