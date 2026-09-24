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
  ExamDispute,
  ExamItemResult,
  ExamSession,
  RuneState,
  Schedule,
  SentenceDetails,
  Settings,
  Unit,
  UnitGroup,
  WordDetails
} from "../types";
import { seedDictionary } from "../data/seedDictionary";
import { CORE_100_WORDS_VERSION, CORE_WORDS_PER_UNIT, core100Words } from "../data/seedWords";
import { syncUnitCompletion } from "./learningTelemetry";
import { lastRestructureProducedUnitIds, restructureOversizedUnits } from "./bookRestructureService";

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

/**
 * 考试作答会话归一化（P0-1）。照 `normalizeLessonStagesDone` 的纪律：
 * 非对象一律降级为空、逐字段白名单拷贝、非法值回落安全值、**绝不抛错**。
 *
 * 为什么必须在这里登记：`knownAppDataKeys` 是显式白名单，未登记的键会被静默丢弃——
 * 而考试会话一旦被吃掉，用户中断续做的进度就没了（PRD §4.7 是 P0）。
 * 自由输入必须截断，避免一条超长 textarea 把整份 localStorage 撑爆。
 */
const EXAM_FREE_TEXT_MAX = 4000;
const trimFreeText = (value: unknown) => asString(value).slice(0, EXAM_FREE_TEXT_MAX);

/** 节序号只认 1/2/3，其余一律回落 1（TS 无法从 unknown 直接收窄成字面量联合）。 */
const asExamSection = (value: unknown): 1 | 2 | 3 => (value === 2 || value === 3 ? value : 1);

const normalizeExamSessions = (value: unknown): Record<string, ExamSession> => {
  if (!isRecord(value)) return {};
  const result: Record<string, ExamSession> = {};
  for (const [paperId, raw] of Object.entries(value)) {
    if (typeof paperId !== "string" || !paperId) continue;
    if (!isRecord(raw)) continue;
    const rawCursor = isRecord(raw.cursor) ? raw.cursor : {};
    const section = asExamSection(rawCursor.section);
    const index = Math.max(0, Math.floor(asNumber(rawCursor.index, 0)));
    const results: ExamItemResult[] = (Array.isArray(raw.results) ? raw.results : [])
      .filter(isRecord)
      .map((item) => ({
        itemId: asString(item.itemId),
        section: asExamSection(item.section),
        kind: (["mcq", "cloze", "zh2en", "read", "write"] as const).includes(item.kind as never)
          ? (item.kind as ExamItemResult["kind"])
          : "mcq",
        answer: trimFreeText(item.answer),
        passed: asBoolean(item.passed),
        score: Math.min(100, Math.max(0, asNumber(item.score, 0))),
        durationMs: Math.max(0, asNumber(item.durationMs, 0)),
        sourceLessonId: asString(item.sourceLessonId),
        answeredAt: validIsoOrNow(item.answeredAt)
      }))
      .filter((item) => Boolean(item.itemId))
      .slice(0, 200);
    const revealedSections = (Array.isArray(raw.revealedSections) ? raw.revealedSections : [])
      .filter((entry): entry is number => entry === 1 || entry === 2 || entry === 3)
      .filter((entry, position, list) => list.indexOf(entry) === position)
      .sort((left, right) => left - right);
    const rawWriting = isRecord(raw.writing) ? raw.writing : undefined;
    result[paperId] = {
      paperId,
      seasonId: asString(raw.seasonId),
      variantIndex: Math.max(0, Math.floor(asNumber(raw.variantIndex, 0))),
      startedAt: validIsoOrNow(raw.startedAt),
      updatedAt: validIsoOrNow(raw.updatedAt),
      ...(asString(raw.submittedAt) ? { submittedAt: validIsoOrNow(raw.submittedAt) } : {}),
      cursor: { section, index },
      results,
      revealedSections,
      ...(rawWriting
        ? {
            writing: {
              text: trimFreeText(rawWriting.text),
              ...(rawWriting.corrected !== undefined ? { corrected: trimFreeText(rawWriting.corrected) } : {}),
              ...(rawWriting.recast !== undefined ? { recast: trimFreeText(rawWriting.recast) } : {}),
              ...(rawWriting.comment !== undefined ? { comment: trimFreeText(rawWriting.comment) } : {}),
              ...(Array.isArray(rawWriting.issues)
                ? {
                    issues: rawWriting.issues
                      .filter(isRecord)
                      .slice(0, 20)
                      .map((issue) => ({
                        original: trimFreeText(issue.original),
                        correction: trimFreeText(issue.correction),
                        explanation: trimFreeText(issue.explanation),
                        ...(issue.tag !== undefined ? { tag: asString(issue.tag) } : {})
                      }))
                  }
                : {}),
              ...(rawWriting.degraded !== undefined ? { degraded: asBoolean(rawWriting.degraded) } : {}),
              ...(rawWriting.degradeReason !== undefined ? { degradeReason: asString(rawWriting.degradeReason) } : {})
            }
          }
        : {})
    };
  }
  return result;
};

/** 考试异议记录归一化（P0-1）：非对象丢弃、ts 走既有 validIsoOrNow、**数组设上限**防无限增长。 */
const EXAM_DISPUTE_MAX = 200;
const normalizeExamDisputes = (value: unknown): ExamDispute[] =>
  (Array.isArray(value) ? value : [])
    .filter(isRecord)
    .map((item) => ({
      id: asString(item.id) || uid("exam_dispute"),
      paperId: asString(item.paperId),
      itemId: asString(item.itemId),
      claim: trimFreeText(item.claim),
      createdAt: validIsoOrNow(item.createdAt)
    }))
    .filter((item) => Boolean(item.paperId) && Boolean(item.itemId))
    .slice(-EXAM_DISPUTE_MAX);

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
  "examSessions",
  "examDisputes",
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
    },
    /**
     * 以下三个是「类型可选、业务必需」的持久化标记（2026-09-22 修）。
     *
     * 白名单结构把它们一起抹掉了，而 `commitData` 每次更新都会 `saveData`，
     * 所以任何一次操作都会命中——对应机制静默失效：
     *   - `reviewOnlyDayKey`（纯复习日）：`isReviewOnlyDay` 恒为 false，
     *     当天又按日常节奏排新词，用户以为「今天只复习」的设置被无声解除。
     *   - `studyScopeUnitIds`（学习范围锁定）：`getStudyScopeUnitIds` 回退到全部词书，
     *     全局智能队列又开始出范围外的词。
     *   - `reachedMilestoneIds`（已达里程碑）：同一个里程碑会反复弹庆祝。
     * 缺失时保持 undefined（不写空值），非法值按安全降级丢弃。
     */
    // 注意类型是 number（YYYYMMDD，见 statsService.dayKey），不是日期字符串
    reviewOnlyDayKey: Number.isFinite(settings.reviewOnlyDayKey) ? (settings.reviewOnlyDayKey as number) : undefined,
    studyScopeUnitIds: Array.isArray(settings.studyScopeUnitIds)
      ? settings.studyScopeUnitIds.filter((id): id is string => typeof id === "string").map((id) => id.trim()).filter(Boolean)
      : undefined,
    reachedMilestoneIds: Array.isArray(settings.reachedMilestoneIds)
      ? settings.reachedMilestoneIds.filter((id): id is string => typeof id === "string").map((id) => id.trim()).filter(Boolean)
      : undefined
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
    /**
     * `dynamicKind` 必须保留（2026-09-22 修，P0）。
     *
     * 它是**动态词书的身份标识**（当前只有 "mistakes" = 错词书）。
     * 此前这里的返回对象没列它，于是每次保存都被抹掉：
     *   `getMistakeBookUnit` 恒返回 undefined → `syncMistakeBookUnit` 每次都
     *   **新建一本《我的错词书》**。实测「同步 3 次」会累积出 4 本重复词书。
     * 它虽然类型上可选，但业务上必需——典型的「可选字段被白名单吃掉」。
     */
    dynamicKind: value.dynamicKind === "mistakes" ? "mistakes" : undefined,
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

const normalizePrioritySource = (value: unknown): Card["prioritySource"] => {
  if (value === "manual" || value === "system") return value;
  return undefined;
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
    /**
     * 以下三个字段此前**没有列进返回对象**，于是每次迁移都被静默丢弃
     * （2026-09-22 修，数据丢失级）。
     *
     * migrateData 是**白名单**：不在返回对象里的字段一律不产出。
     * 而 `AppContext.commitData` 每次更新都会 `saveData`（读 → migrateData → 写回），
     * 所以不是「升级时丢一次」，而是**任何一次操作都会把它们抹掉**：
     *   - `prioritySource`：区分「用户手动标星」与「算法自动置位」。
     *     丢掉后手动标星的卡会被当成 legacy 系统卡 → 两次评分 ≥3 就被自动摘星，
     *     用户加的星静默消失（正是上一轮审计发现的那条缺陷——当时只修了写入侧，
     *     没发现读取侧还会把它丢掉）。
     *   - `suspendedFrom`：暂停前的状态，恢复暂停卡时要还原。
     *   - `mistakeGraduatedAt`：错题毕业时间。
     */
    prioritySource: normalizePrioritySource(value.prioritySource),
    suspendedFrom: status === "suspended" ? normalizeCardStatus(value.suspendedFrom) || undefined : undefined,
    mistakeGraduatedAt:
      // 用「合法才保留，否则不写」而非 validIsoOrNow（后者会把垃圾值替换成"现在"，
      // 等于给一个不存在的毕业时间编造时间戳）。缺失与垃圾都落到 undefined。
      typeof value.mistakeGraduatedAt === "string" && !Number.isNaN(new Date(value.mistakeGraduatedAt).getTime())
        ? value.mistakeGraduatedAt
        : undefined,
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
    /**
     * 三个死字段**不再产出**（2026-09-22 存储治理）。
     *
     * 此前是 `synonyms: asString(value.synonyms)`——于是哪怕写入侧已经不产生它们，
     * **每次迁移又给每一条补上空串**，写入侧的修复被完全抵消
     * （与 `diffJson` 那次是同一个坑：字段废弃必须两侧同步）。
     *
     * 它们零读取（无 UI、无导入、无展示），永久为空，占的纯粹是键名开销：
     * 单条 47 字节、一年模型约 168KB。
     *
     * 只在**有非空真实值**时才保留——手工导入的备份里若写了内容不该被丢掉，
     * 将来做近义词功能也能直接启用。
     */
    ...(asString(value.synonyms).trim() ? { synonyms: asString(value.synonyms) } : {}),
    ...(asString(value.antonyms).trim() ? { antonyms: asString(value.antonyms) } : {}),
    ...(asString(value.confusedWords).trim() ? { confusedWords: asString(value.confusedWords) } : {}),
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
          // 不再生成三个已废弃的空字段（synonyms/antonyms/confusedWords，
          // 2026-09-22 存储治理：零读取、永久为空、单条白付 47 字节）。
          // 这是**第三个**写入点——前两个是 cardService.addWord 与 normalizeWordDetails，
          // 少改一处就会让治理失效（迁移会把字段又补回来）。
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

/**
 * `diffJson` 的合法性校验（2026-09-22）。
 *
 * 只接受「能解析成数组」的字符串：那才是历史写入侧真正产出过的形态
 * （`JSON.stringify(compareText(...))` 的结果）。
 * 缺失、空串、非字符串、以及 `"not-json"` 这类垃圾一律**不写入**——
 * 与 `mistakeGraduatedAt` 同口径：没有就说没有，不编造、也不透传无意义的值。
 */
const isValidDiffJson = (value: unknown): boolean => {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    return Array.isArray(JSON.parse(value));
  } catch {
    return false;
  }
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
    /**
     * `diffJson` **不再补默认值**（2026-09-22 存储治理，与写入侧同步）。
     *
     * 此前这里是 `asString(value.diffJson, "[]")`——于是即使写入侧已经不产生它，
     * **每次迁移又给每一条补回来**，写入侧的修复被完全抵消（实测：
     * 一条没有该字段的记录迁完又冒出来了）。
     *
     * 而且 `"[]"` 不是中性的「缺失」标记：它的语义是**「我比对过了，零差异」**，
     * 等于给一个不存在的比对结果编造内容。这与同文件 `mistakeGraduatedAt`
     * 的处理口径（「缺失/非法时不得补 now」）一致——**没有就说没有**。
     *
     * 合法值仍原样保留：旧数据里可能真有值（历史上写入侧确实产出过），
     * 用户重新导出/导入备份时不该丢；它会被「归档久远复习明细」或
     * 后续的自然淘汰清掉。
     */
    ...(isValidDiffJson(value.diffJson) ? { diffJson: value.diffJson as string } : {}),
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
  /**
   * 拆分产出块不该被算作「独立读完的一本」。
   *
   * `syncUnitCompletion` 见它们的卡仍是 mastered 就会补 completedAt，
   * 让「已完成本数」从 1 翻成 2（MG3b 的 FAIL-3——用户只读完过 1 本，
   * 拆分只是存储结构变化）。故在它**之后**按拆分产出清单剔除。
   */
  const producedUnitIds = lastRestructureProducedUnitIds();
  const synced = syncUnitCompletion(restructured);
  if (producedUnitIds.size === 0) return synced;
  let touched = false;
  const units = synced.units.map((unit) => {
    if (!producedUnitIds.has(unit.id) || !unit.completedAt) return unit;
    touched = true;
    const { completedAt: _drop, ...rest } = unit;
    return rest;
  });
  return touched ? { ...synced, units } : synced;
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
    /**
     * 2026-09-23 修（MG3b 的 FAIL-5：空串课 id 进进度统计）。
     *
     * 原用 `asStringArray`（只滤非字符串），于是 `["", "  "]` 原样进来，
     * 随后被当作「已完成课」写进 `grammarLessonStagesDone`（键变成 `""` / `"  "`），
     * 且页面侧 `grammarLessonsDone.length` 直接被当成「已学课数」——
     * 两个空串会被算成两节课，进度数字凭空 +2。
     *
     * 改用同文件已有的 `asTrimmedStringArray`（trim + 滤空 + 去重），
     * 与 usedWords / missingWords 等其它字符串数组口径一致。
     */
    grammarLessonsDone: asTrimmedStringArray(parsed.grammarLessonsDone),
    // 删除标记（tombstone）：只收非空字符串、去重；无值时不下发该键（保持旧数据形状不变）
    ...(asTrimmedStringArray(parsed.deletedBuiltinUnitIds).length > 0
      ? { deletedBuiltinUnitIds: asTrimmedStringArray(parsed.deletedBuiltinUnitIds) }
      : {}),
    grammarLessonStagesDone: normalizeLessonStagesDone(parsed.grammarLessonStagesDone),
    grammarBoostsDone: normalizeLessonTiersDone(parsed.grammarBoostsDone),
    // 考试会话/异议：可选字段，无值时不下发该键（保持旧数据形状不变，与 deletedBuiltinUnitIds 同款）
    ...(Object.keys(normalizeExamSessions(parsed.examSessions)).length > 0
      ? { examSessions: normalizeExamSessions(parsed.examSessions) }
      : {}),
    ...(normalizeExamDisputes(parsed.examDisputes).length > 0
      ? { examDisputes: normalizeExamDisputes(parsed.examDisputes) }
      : {}),
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
    if (!lessonId.trim()) continue;   // 空串不构成一门课（防御：规格化已滤，这里兜底）
    const existing = new Set(stagesDone[lessonId] ?? []);
    if (existing.has(1)) continue;
    existing.add(1);
    stagesDone[lessonId] = [...existing].sort((a, b) => a - b);
  }
  const withStages: AppData = { ...normalizedData, grammarLessonStagesDone: stagesDone };
  /**
   * 注（2026-09-22 已核查，未修）：`ensureDefaultUnits` 会给「没有归属的词卡」补 `unitId`，
   * 但它的产物在本函数内就已经带上归属，**问题在于卡片归一化发生在它之前**——
   * 于是用户自建的词卡要**第二次启动**才拿到 `unitId`。
   * 实测：第一次 loadData 后该字段仍为 undefined，第二次才有。
   *
   * 影响有限且已可接受：只补一个归属字段，不改内容；且本轮已保证
   * 「同一次启动里返回值与落盘内容一致」，用户不会再看到界面自己变化。
   * 因此不在这一轮强行改动迁移顺序（那会牵动 seed/units/卡片三者的相互依赖）。
   */
  /**
   * 2026-09-23 修（MG3c 的 FAIL-1a/1b 等）：seeding 的产物也要过一遍归一化。
   *
   * 根因：`migrateData` 是**白名单归一化**——卡片先被 `normalizeCard` 收窄，
   * 之后才跑 `seedCoreWords` 补内置词卡。于是 seeding **新造的卡绕过了归一化**：
   *  · 缺 `masteredAt`（新卡 status 是 "new"，归一化会补 `null`）；
   *  `ensureDefaultUnits` 也修不到它（它的 `data.cards` 是同一批未归一化的卡）。
   * 结果：**同一次迁移产出的数据不是终态**，要等下一次迁移才补齐——
   * 而 `commitData` 每次操作都 saveData（读→迁移→写回），所以用户看到的是
   * 「数据每打开一次就自己变一次」，这也是 FAIL-1e「第 2 次迁移之后才稳定」的成因。
   *
   * 修法：对 seeding 产出的卡片再跑一次 `normalizeCard`，让**一次迁移即终态**。
   * 只重新归一化卡片（不重跑整个 migrateData，避免递归与性能问题）——
   * 卡片的字段缺口正是这批 FAIL 的共同根因。
   */
  const seeded = seedCoreWords(withStages);
  /**
   * 再跑一次 `ensureDefaultUnits`：它负责给「没有归属的词卡」补 `unitId`，
   * 但它原本只在 `seedCoreWords` 的**早退分支**里被调用——
   * 首次补种时走的是正常分支，于是**这一次**没人为用户已有卡片补归属
   * （MG3c 的 FAIL-1a：要等下次迁移才补上）。
   * 现在统一在归一化之后再调一次，两条分支都能在一次迁移内收敛。
   */
  const reseeded = ensureDefaultUnits(seeded);
  return {
    ...reseeded,
    cards: reseeded.cards.map(normalizeCard).filter((card): card is Card => Boolean(card)),
    schemaVersion: APP_SCHEMA_VERSION
  };
};

const seedCoreWords = (data: AppData): AppData => {
  if (data.seededWordVersions.includes(CORE_100_WORDS_VERSION)) {
    return ensureDefaultUnits(data);
  }

  /**
   * 去重口径（2026-09-23 修 MG3b 的 FAIL-9/10：重复插入内置词卡）。
   *
   * 修复前只用 `wordDetails[].word.toLowerCase()` 建集合，两个漏网：
   *  · **FAIL-9**：`fillMissingDetails` 只给 `type === "word"` 的卡补 wordDetails，
   *    所以用户把单词做成了**句子卡/短语卡**时，那个词不在集合里 → 又插一张词卡，
   *    同一个词在库里出现两张（类型不同）。
   *  · **FAIL-10**：用户卡 front 带句末标点（`achieve.`）时字面量对不上 → 同样重复插入。
   *
   * 现在改用**卡片 front 归一化**建集合（也保留 wordDetails 侧），归一化包含：
   * 去首尾空白、转小写、去句末标点。与 `normalizeLessonSentence` 的口径一致，
   * 但不引入对 lessonService 的依赖（避免 storage ↔ lessonService 循环引用）。
   *
   * 注意：只影响「是否补种」的判断，不修改用户已有卡片的内容——
   * 用户卡上的 `achieve.` 原样保留，只是不再为它多插一张内置卡。
   */
  const dedupeKey = (text: string) =>
    text.trim().toLowerCase().replace(/[.!?]+$/, "").trim();
  const existingWords = new Set<string>();
  for (const details of data.wordDetails) existingWords.add(dedupeKey(details.word));
  for (const card of data.cards) {
    // 任意类型的卡都参与去重：单词做成了句子卡/短语卡也算「用户已经有这个词」
    const front = typeof card.front === "string" ? card.front : "";
    if (front.trim()) existingWords.add(dedupeKey(front));
  }
  const timestamp = nowIso();
  /** 尊重删除标记：被用户删掉的内置书不再补回（MG3b 的 FAIL-7）。 */
  const seededUnits = createCoreUnits(timestamp).filter(
    (unit) => !(data.deletedBuiltinUnitIds ?? []).includes(unit.id)
  );
  const nextCards = [...data.cards];
  const nextWordDetails = [...data.wordDetails];
  const nextSchedules = [...data.schedules];

  /**
   * 本数按**词表实际长度**算，不再用写死的「索引 / 20」。
   *
   * ## 修的是什么（2026-09-24）
   *
   * `createCoreUnits` 建 5 本（20 词/本 ⇒ 容量 100），但 `core100Words`
   * 已经长到 **115** 词。于是索引 100-114 那 15 个词走
   * `seededUnits[Math.floor(100/20)]` = `seededUnits[5]`——**越界**，
   * 被 `?? seededUnits[0]` 兜回 **Unit 1**。
   *
   * 实测（空存储跑一次 `loadData`，非推断）：
   *
   * ```
   * core-100-unit-1: 35 张   ← 应为 20
   * core-100-unit-2: 20 张
   * ...（3/4/5 各 20）
   * ```
   *
   * 即**每个新用户的第 1 本词书都多 15 张、第 6 本该有的词全挤进第 1 本**。
   * 用户可见后果：第 1 本显得异常长；`description` 写的「第 1-20 个」
   * 与实际 35 张不符；按本推进的节奏在第 1 本就被打乱。
   *
   * ## 为什么现在才发现
   *
   * 既有测试只断言**总数**（`cards` 长度 == `core100Words.length`），
   * 从没断言**分布**——所以 115 词 × 5 本这个组合长期无人发现。
   *
   * ## 修法
   *
   * 用 `Math.floor(index / CORE_WORDS_PER_UNIT)` 取本下标（与 `createCoreUnits`
   * 的 20 词/本口径一致），并**按本数取模**兜底：
   * 即使将来词表再长、而 `createCoreUnits` 未同步扩容，也只会**回绕到已有本**，
   * 不再依赖「越界 undefined → 兜底第 0 本」这条隐式行为。
   *
   * `createCoreUnits` 同步改为按词表长度建够本数——两处口径从此都由
   * `CORE_WORDS_PER_UNIT` 与 `core100Words.length` 推导，不会再各走各的。
   */
  const wordsPerUnit = CORE_WORDS_PER_UNIT;
  const unitCount = seededUnits.length;

  for (const [index, seed] of core100Words.entries()) {
    const normalized = seed.word.toLowerCase();
    if (existingWords.has(dedupeKey(normalized))) continue;
    /**
     * 目标本下标 → 映射到**实际存在**的本（跳过被用户删掉的本）。
     *
     * ⚠️ 这里必须按「未删除本」的序号取，而不是直接下标：
     * 用户删掉 Unit 3 后 `seededUnits` 变成 [u1,u2,u4,u5]，
     * 直接 `seededUnits[2]` 会把本该进 u3 的词塞进 **u4**——
     * 与「本 N = 第 N×20 个」的口径错位。
     */
    const desiredUnitNumber = Math.floor(index / wordsPerUnit) + 1;
    const direct = seededUnits.find((unit) => unit.id === `core-100-unit-${desiredUnitNumber}`);
    const unitId = direct?.id ?? seededUnits[0]?.id ?? "";
    if (!unitId) continue;

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
      // 不再生成三个已废弃的空字段（2026-09-22 存储治理）。
      // 这是**第四个**写入点（前三个：cardService.addWord / normalizeWordDetails /
      // fillMissingDetails）——内置 100 核心词每人都有，漏掉这一处会让治理打折。
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

  // 按 id 判断内置分组是否已存在（**不按标题**——用户自建同名分组不该挤掉内置组，见 mergeUnitGroups 注释）
  const existingGroupIds = new Set(data.unitGroups.map((group) => group.id));
  const defaultGroups = createDefaultUnitGroups(timestamp).filter((group) => !existingGroupIds.has(group.id));
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

/**
 * 建够覆盖整张词表的内置本数。
 *
 * 此前写死 `length: 5`（= 100 词容量），而 `core100Words` 有 **115** 词——
 * 多出的 15 个词在分本时越界落到 Unit 1（见 `seedCoreWords` 内的长注释）。
 * 现在由 `CORE_WORDS_PER_UNIT` 与词表长度推导，**词表增长时本数自动跟上**。
 *
 * ⚠️ 本 id 是 `core-100-unit-N`（N 从 1 起），且**与既有数据保持兼容**：
 * 词表 115 词 / 每本 20 ⇒ 6 本（末本 15 词），前 5 本 id 与旧版一致，
 * 只是新增 `core-100-unit-6`——已升级的用户不会看到本 id 变化。
 */
const createCoreUnits = (timestamp: string) =>
  Array.from({ length: Math.ceil(core100Words.length / CORE_WORDS_PER_UNIT) }, (_, index) => {
    const first = index * CORE_WORDS_PER_UNIT + 1;
    // 末本可能不满（115 词 ⇒ 第 6 本只有 101-115），描述按实际词数收口
    const last = Math.min((index + 1) * CORE_WORDS_PER_UNIT, core100Words.length);
    return {
      id: `core-100-unit-${index + 1}`,
      title: `核心100 - Unit ${index + 1}`,
      description: `内置核心词第 ${first}-${last} 个`,
      order: index + 1,
      color: "#f06423",
      groupId: "group-core-100",
      createdAt: timestamp,
      updatedAt: timestamp
    };
  });

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

/**
 * 合并分组：**按 id 去重**（不是按标题）。
 *
 * 2026-09-23 修（MG3b 的 FAIL-6）：调用方原本先按**标题**过滤再传进来，
 * 于是用户自建一个标题恰好叫「核心100」的分组时，内置 `group-core-100`
 * 被判定为「标题已存在」而不建立；可 `createCoreUnits` 写死了
 * `groupId: "group-core-100"` → 5 本内置词书全部挂着一个**不存在的分组 id**，
 * 界面上它们会掉出分组（或被归到用户那个自建组下）。
 *
 * 用户自建同名分组是合理的（「我也有个核心100」），不该因此挤掉内置组——
 * 两者 id 不同，本就是两个不同实体（一个内置、一个自建）。
 */
const mergeUnitGroups = (currentGroups: AppData["unitGroups"], nextGroups: AppData["unitGroups"]) => {
  const existingIds = new Set(currentGroups.map((group) => group.id));
  return [...currentGroups, ...nextGroups.filter((group) => !existingIds.has(group.id))].sort((a, b) => a.order - b.order);
};

const ensureDefaultUnits = (data: AppData): AppData => {
  const timestamp = nowIso();
  // 同上：按 id 而非标题判断
  const existingGroupIds = new Set((data.unitGroups ?? []).map((group) => group.id));
  const defaultGroups = createDefaultUnitGroups(timestamp).filter((group) => !existingGroupIds.has(group.id));
  const unitGroups = mergeUnitGroups(data.unitGroups ?? [], defaultGroups);
  /**
   * 2026-09-23（MG3b 的 FAIL-7）：**尊重删除标记**——用户主动删掉的内置书不再补回。
   * 否则「删除 → 下次启动复活」会让删除形同虚设。
   */
  const tombstoned = new Set(data.deletedBuiltinUnitIds ?? []);
  const coreUnits = createCoreUnits(timestamp).filter((unit) => !tombstoned.has(unit.id));
  const adventureGroupId = unitGroups.find((group) => group.title.trim() === "冒险积累")?.id;
  const adventureUnits = tombstoned.has("unit-adventure-accumulation")
    ? []
    : [createAdventureAccumulationUnit(timestamp, adventureGroupId)];
  /**
   * 新补入的内置本，**只在它有词可装时才补**——避免给老用户塞空词书（2026-09-24）。
   *
   * 这条是「本数由词表推导」的配套：词表 115 词 ⇒ 现在会建到 Unit 6，
   * 但**已补种过的老用户**（`seededWordVersions` 已含版本号）不会走补种分支，
   * 他们书架里没有一本叫 Unit 6 的书、也不会有词落进去。
   * 若无条件补回，老用户会凭空多出一本**空词书**「核心100 - Unit 6」，
   * 而它的描述写着「第 101-115 个」——名实不符。
   *
   * ⚠️ 判据**只针对本次扩容新增的最后一本**（`core-100-unit-${N}`，N = 本数），
   * 不能推广到全部内置本：前 5 本是既有的、必须照常建立
   * （MG3b 的 FAIL-8 明确要求「内置词书本身照常建立，只是不吸纳用户散卡」）。
   * 若对全部本都用「有卡才建」，会让「用户删光卡后内置书消失」，与既有语义冲突。
   *
   * 新用户为什么不受影响：补种在同一趟迁移里已把卡分进各本（含末本），
   * 末本有卡 ⇒ 照常建立。
   */
  const coreUnitCount = coreUnits.length;
  const lastCoreUnitId = `core-100-unit-${coreUnitCount}`;
  const unitIdsInUse = new Set(data.cards.map((card) => card.unitId).filter(Boolean));
  const keepCoreUnits = coreUnits.filter(
    (unit) => unit.id !== lastCoreUnitId || unitIdsInUse.has(unit.id)
  );
  const units = mergeUnits(data.units ?? [], [...keepCoreUnits, ...adventureUnits]).map((unit) =>
    unit.id.startsWith("core-100-unit-") && !unit.groupId ? { ...unit, groupId: "group-core-100", color: "#f06423" } : unit
  );
  /**
   * 2026-09-23 修（MG3b 的 FAIL-8：无归属卡被自动塞进内置「核心100」）。
   *
   * 这里原本把**所有** `unitId` 为空的词卡按顺序扫进 `core-100-unit-1..5`，
   * 后果：
   *  · 用户导入的散卡被打上「核心100 - Unit 1」，而该书的说明写着
   *    「内置核心词第 1-20 个」——**名实不符**，用户找不到自己的词；
   *  · 更严重的是，`deleteUnit` 删书时**故意**把卡片的 unitId 清空
   *    （`unitService.ts`：「单词已变为未分配」），这是一个**被正式支持的合法状态**：
   *    界面上有「收纳未分配词（N）」入口与「未分配词」列表。自动回填会把
   *    「用户主动删书后的未分配词」在下次启动时**静默塞回内置书**，
   *    与那条 UX 直接冲突（用户刚删完，重启又回来了）。
   *
   * 修法：**不再自动归属散卡**。新种子的内置词卡由 `seedCoreWords` 显式带上 unitId
   * （见那里的 `unitId` 字段），用户自己的散卡保持未分配，交给「收纳未分配词」入口处理。
   */
  const cards = data.cards;

  if (units === data.units && cards === data.cards && unitGroups === data.unitGroups) return data;
  return { ...data, unitGroups, units, cards };
};

export const loadData = (): AppData => {
  /**
   * R09：`localStorage` **对象本身**取不到时也不能抛。
   *
   * 此前这一行裸写在最外层：存储被策略完全禁用（某些企业策略、
   * 嵌入式 WebView、或跨源 iframe）时 `window.localStorage` 是 undefined，
   * `undefined.getItem` 抛 TypeError → `AppContext` 的 useState 初始化抛
   * → 项目没有 ErrorBoundary → **启动白屏**。
   * 与「写不下」同理：进得来界面，才有机会看到提示并导出备份自救。
   */
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (!raw) {
    const initial = applyStartupMigration(seedCoreWords(createInitialData()));
    try {
      writeRaw(initial);
    } catch {
      // R09：全新安装 + 写不下（配额/权限）时不再抛出。
      // 此前这里在 try 之外，异常直接逃出 loadData → AppContext 的 useState
      // 初始化抛 → 项目没有 ErrorBoundary → **启动白屏**，
      // 用户连能看见诊断文案的页面都进不去。
    }
    return initial;
  }

  /**
   * 只迁移一次（2026-09-22 修，P0）。
   *
   * 此前这里是 `migrateData(raw)` 之后再 `saveData(migrated)`，
   * 而 `saveData` 内部**又迁移一次**——返回给页面的是第一次的结果，
   * 落盘的是第二次的。两次结果并不相同（实测 116 项差异，例如
   * 返回值的卡片 `unitId` 还是 undefined、磁盘上已被补成 `core-100-unit-1`），
   * 于是「页面首屏」与「本次启动写入磁盘的内容」不一致，
   * 用户随便点一下就会看到界面莫名其妙变了一次。
   * 现在统一：迁移一次 → 同一份对象既返回也落盘。
   *
   * R09：另把「读/解析失败」与「写回失败」分开。
   *
   * 此前 `writeRaw(migrated)` 也在这个 try 内，它抛出的 QuotaExceededError
   * 被同一个 catch 接住，而那个 catch 的意思是「**本地数据损坏（无法解析）**」。
   * 于是一次纯粹的「写不下」被当成「数据坏了」，返回初始数据，
   * 而且 catch 分支还会把这份初始数据**原地覆盖**到磁盘上——
   * 用户 2.7MB 的真实进度被 85KB 的空白状态替换，诊断还报「一切正常」。
   *
   * 区分之后：解析失败才走重置；写回失败保留已解析出来的真实数据，
   * 只把失败信号留给 `commitData` 的提示通道
   *（写不下 ≠ 数据没了——后者才是不可逆的）。
   */
  let migrated: AppData;
  try {
    migrated = applyStartupMigration(migrateData(raw));
    // R12：干净数据马上会被写回，修复信号必须在这里捕获留档。
    // 报告是粘性的：只在发现新修复时覆盖，不因后续干净启动而清除
    //（否则 HMR/二次刷新会立刻抹掉它，用户永远看不到）。
    const repairs = summarizeStartupRepairs(raw, migrated);
    if (repairs.length > 0) recordStartupRepairs(repairs);
  } catch {
    recordStartupRepairs(["本地数据损坏（无法解析），已自动重置为初始状态；如有 JSON 备份可在设置页恢复"]);
    const initial = applyStartupMigration(seedCoreWords(createInitialData()));
    /**
     * 重置本身写不下时**不能再抛**（2026-09-22 修，P0 白屏）。
     *
     * 此前这里直接 `saveData(initial)`；配额满时它会再抛一次，
     * 而项目没有 ErrorBoundary —— 应用直接白屏，用户连界面都进不去，
     * 更没有办法导出备份自救。现在写不下也照样返回初始数据，
     * 让应用能起来，失败由 `commitData` 的提示通道暴露。
     */
    try {
      writeRaw(initial);
    } catch {
      // 静默：能用内存里的初始数据把界面撑起来，比白屏好
    }
    return initial;
  }

  /**
   * 写回是「尽力而为」：写不下就保留内存里的真实数据继续用，绝不因此重置。
   * 下一次 `commitData` 会带着明确的失败提示再试一次。
   */
  try {
    writeRaw(migrated);
  } catch {
    // 写不下不影响本次读取——数据是从磁盘读出来的真货。
  }
  return migrated;
};

/** 直接把（已归一化的）数据写进 localStorage，不再迁移一次。返回实际落盘的 JSON。 */
const writeRaw = (data: AppData): string => {
  const json = JSON.stringify(data);
  window.localStorage.setItem(STORAGE_KEY, json);
  return json;
};

/**
 * 读取磁盘上的原始 JSON 快照（不迁移、不归一化）。
 *
 * R10 多窗口修复的基础：用它比对「我上次写入的内容」与「磁盘现在的实际内容」。
 * 两者不同 ⇒ 有另一个窗口/标签在中间写过，本次写入会覆盖别人的改动。
 *
 * 返回 null 表示读不到（存储被禁用、数据被外部清除）。
 */
export const readStoredSnapshot = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/**
 * 把磁盘上的原始快照解析成可用的 AppData（走与 loadData 同一条迁移管线）。
 *
 * 解析/迁移失败返回 null——调用方据此退回「用自己内存里的数据写」，
 * 而不是把损坏内容带进内存。多窗口重放（R10）用它取「别人写的版本」。
 */
export const parseStoredSnapshot = (json: string): AppData | null => {
  try {
    return applyStartupMigration(migrateData(json));
  } catch {
    return null;
  }
};

/**
 * 保存。
 *
 * 2026-09-22 性能修正：此前这里无条件 `migrateData(data)` 再写盘，
 * 而**传给它的数据已经走过迁移**（`loadData` 返回的就是迁移产物，
 * 之后 `AppContext` 的所有不可变更新都基于它）。每次保存重新归一化
 * 20000 条记录量级的数据实测要 83ms（序列化只要 8.6ms）——
 * 而 `commitData` 每次操作都调它，用户每答一题就付一次这个成本。
 *
 * 现在按「数据是否已归一化」跳过重复迁移：
 *   - 内部路径（AppContext 的更新）→ 已归一化，直接写；
 *   - 外部入口（导入备份、重置）→ 走 `parseBackupJson` / `restoreDataFromJson`，
 *     它们内部已经迁移过，同样不需要二次迁移。
 *
 * 安全网：`shouldSkipMigration` 检查一个便宜的标记——schemaVersion 与
 * 关键数组的存在性。任何一项不对就退回完整迁移，保证「外部塞进来的裸数据」
 * 仍会被归一化，不会把非法结构直接落盘。
 */
const shouldSkipMigration = (data: AppData): boolean => {
  if (!isRecord(data)) return false;
  if (data.schemaVersion !== APP_SCHEMA_VERSION) return false;
  // 关键数组必须存在且是数组（归一化器保证它们一定存在；缺了说明是外部数据）
  return (
    Array.isArray(data.cards) &&
    Array.isArray(data.schedules) &&
    Array.isArray(data.reviews) &&
    Array.isArray(data.sentenceDetails) &&
    Array.isArray(data.wordDetails) &&
    Array.isArray(data.units) &&
    Array.isArray(data.unitGroups) &&
    Array.isArray(data.diaryEntries) &&
    isRecord(data.settings)
  );
};

/**
 * 保存。返回**实际落盘的 JSON**。
 *
 * R10：返回值用于多窗口一致性——调用方据此记住「我写进去的是什么」，
 * 下次写入前比对磁盘内容就能发现「另一个窗口在中间写过」。
 * 不能自己再 JSON.stringify 一遍：迁移路径写的可能与传入对象不同
 *（`shouldSkipMigration` 为假时会先归一化），那样基线就错了。
 */
export const saveData = (data: AppData): string => {
  if (shouldSkipMigration(data)) {
    return writeRaw(data);
  }
  return writeRaw(migrateData(data));
};

/**
 * 返回 `saveData(data)` **将要**写入的 JSON，但不落盘。
 *
 * R10 多窗口判定要用它：`otherWindowSnapshot` 需要知道「磁盘上的内容是不是
 * 我自己刚写的那份」。有些入口（`resetData` / `restoreDataFromJson`）会在
 * 调 `commitData` 之前自己先写一次盘，此时磁盘内容等于本次意图——
 * 用本函数算出意图的序列化形式，就能把它与「另一个窗口写的」区分开。
 *
 * 与 `saveData` 共用同一条序列化分支（`shouldSkipMigration`），
 * 所以两者对同一份数据给出**逐字相同**的字符串；不会有口径漂移。
 */
export const serializeForSave = (data: AppData): string =>
  shouldSkipMigration(data) ? JSON.stringify(data) : JSON.stringify(migrateData(data));

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
  /**
   * 存储成本（KB），由 `storageCostBytes` 算出——**不是** `.length/1024`。
   * R09 改名理由见 `storageCostBytes` 的注释：旧口径在 macOS 桌面端
   * 把真实占用少算一半，导致唯一的容量告警在该环境永不触发。
   */
  storageCostKb: number;
  /** 修复报告生成时间（ISO），无报告时为空串。 */
  repairedAt: string;
}

/**
 * localStorage 的计费口径（R09 跨环境实测，Playwright 真机，非 jsdom 推断）。
 *
 * 两个内核**不是同一套账单**：
 * - Chromium（Chrome / Edge / WebView2）：按**字符**计，5,242,880 字符，
 *   与内容是什么字符无关。
 * - WebKit（Safari / macOS WKWebView，即本应用的桌面运行时）：按**字节**计，
 *   且沿用其 16-bit 字符串规则——字符串里只要出现**一个** U+00FF 以上的字符
 *   （汉字、全角标点、emoji 全在此列），**整串**都按 2 字节/字符计费。
 *
 * 实测边界（每次写 100,000 字符直到 QuotaExceededError）：
 *
 * | 填充内容                        | Chromium    | WebKit      |
 * |---------------------------------|-------------|-------------|
 * | `a`（纯 ASCII）                 | 5,200,000   | 5,200,000   |
 * | `é` U+00E9（Latin-1 内）        | —           | 5,200,000   |
 * | 99,999 个 `a` + **1 个** `中`   | —           | **2,600,000** |
 * | 1% 汉字 + 99% ASCII             | —           | **2,600,000** |
 * | `中`（纯汉字）                  | 5,200,000   | **2,600,000** |
 *
 * 所以 WebKit 的真实容量是 **5,242,880 字节**；一个汉字就足以让整串翻倍。
 * 本应用的数据里必然含汉字（课程标题、中文笔记、释义），
 * 因此在 macOS 桌面端，「还能存多少」一直是按一半在算。
 *
 * 本函数返回**最坏情况成本**（两个内核里更紧的那个账单）。
 * 代价：对 Chromium 上的含中文数据高估一倍（会更早提醒）；
 * 收益：对 WebKit 精确，而那是这个应用真正跑的地方。
 * 方向是刻意选的——宁可早提醒，也不要在写不下的那一刻才第一次知道。
 */
export const storageCostBytes = (value: string): number => {
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) > 0xff) return value.length * 2;
  }
  return value.length;
};

/**
 * 存储软上限（字节）。取 5,242,880 的 ~80%：这是 WebKit 实测容量，
 * 也是两内核中更紧的那个。旧值 `LOCAL_STORAGE_SOFT_LIMIT_KB = 4096` 被
 * 当作「4096 KB = 4,194,304 字符」参与比较，但按字节计的环境里
 * 4,194,304 字符要花 8,388,608 字节——**阈值比真实容量还大**，
 * 于是「接近上限，建议导出备份」这条唯一的提前警告在桌面端从不出现。
 */
export const STORAGE_SOFT_LIMIT_BYTES = 4 * 1024 * 1024;

/**
 * 全部 localStorage 键的**总成本**（字节）。
 *
 * 2026-09-24 修（数析实测的 P0 静默故障）：
 * 此前容量核算只看主数据键（`personal-vocab-app-data-v1`），
 * 而遥测独立占空间——实测 3000 条含中文遥测 = 1.57MB，
 * 满档投影 7.84MB > WebKit 容量 4.96MB。
 *
 * 后果：遥测能单独把用户顶到写不下，而**唯一的容量告警永远不触发**
 * （它只算主数据）⇒ 用户遇到的第一次「存不下」是数据损坏而非提醒。
 *
 * 现在把全部键计入账单——这才是用户真实面对的容量压力。
 * 跳过主数据键本身：它由调用方按 raw/JSON 精确传入（避免重复计入与口径偏差）。
 */
export const totalLocalStorageCostBytes = (excludeKeys: readonly string[] = []): number => {
  if (typeof window === "undefined" || !window.localStorage) return 0;
  const skip = new Set(excludeKeys);
  let total = 0;
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key || skip.has(key)) continue;
      const value = window.localStorage.getItem(key);
      if (!value) continue;
      // 键名本身也占空间（体积小但如实计入）
      total += storageCostBytes(key) + storageCostBytes(value);
    }
  } catch {
    // 隐私模式 / 访问受限：返回已累计的部分，不阻断诊断
  }
  return total;
};

/**
 * 「除主数据键以外」的全部键成本（字节）。
 *
 * 给 `AppContext.refreshStoragePressure` 用：那条路径每次保存都跑，
 * 且手上已经有主数据键的精确 JSON，所以只需补上其余键（遥测三对键等）的成本
 * 才是用户真实面对的容量账单。为此不能把主数据键重复计入，故在这里排除它——
 * 而不是把 `STORAGE_KEY` 导出去让调用方自己拼。
 */
export const otherLocalStorageCostBytes = (): number => totalLocalStorageCostBytes([STORAGE_KEY]);
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
    const rawVersion = asNumber(raw.schemaVersion, 0);
    /**
     * 区分「升级」与「降级」（2026-09-22 修）。
     *
     * 备份版本**高于**当前版本，说明这份数据来自更新的应用。
     * 迁移管线是白名单，未知字段会被静默丢弃，而用户看到的只是一句
     * 「已自动迁移」——他会以为一切正常。这必须明确告警，
     * 否则「新版应用里导出 → 回到旧版应用导入」会悄悄丢内容。
     */
    if (rawVersion > APP_SCHEMA_VERSION) {
      items.push(
        `这份备份来自更新的版本（v${rawVersion}，当前支持 v${APP_SCHEMA_VERSION}）：` +
          `已按当前版本尽力读取，但更新版本新增的内容无法保留。建议升级应用后再导入。`
      );
    } else {
      items.push(`旧版本数据结构（v${rawVersion}）已自动迁移到 v${APP_SCHEMA_VERSION}`);
    }
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

/** 纯函数：由修复条目 + 存储成本 + 存储可用性组装诊断结果。 */
export const buildDiagnosis = (
  repaired: string[],
  storageCostKb: number,
  schemaVersion: number,
  storageIssue?: string,
  repairedAt = ""
): DataDiagnosis => {
  const issues = storageIssue ? [storageIssue] : [];
  if (storageCostKb * 1024 > STORAGE_SOFT_LIMIT_BYTES) {
    issues.push(`本地数据约 ${(storageCostKb / 1024).toFixed(1)}MB，接近存储上限，建议导出备份后清理`);
  }
  return { ok: repaired.length === 0 && issues.length === 0, repaired, issues, schemaVersion, storageCostKb, repairedAt };
};

/** 读取 localStorage（数据快照体积 + 启动修复报告）并诊断。 */
export const diagnoseStoredData = (data: AppData): DataDiagnosis => {
  if (typeof window === "undefined") {
    return buildDiagnosis([], 0, data.schemaVersion, "读不到本地存储快照，浏览器可能限制了存储访问");
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // R09：按 storageCostBytes（最坏情况账单）而不是 .length 计费。
    // 2026-09-24：再加上其他键（遥测三对键等）的成本——它们同样占用户的容量配额。
    const mainCost = storageCostBytes(raw ?? JSON.stringify(data));
    const otherCost = totalLocalStorageCostBytes([STORAGE_KEY]);
    const storageCostKb = Math.round((mainCost + otherCost) / 1024);
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
      storageCostKb,
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

/**
 * 触发一次「另存为」下载。返回是否成功把文件交给了浏览器/WebView。
 *
 * R09 三处改动，都来自跨环境验证：
 *
 * ① **延迟释放 blob URL**。原实现是 `link.click()` 之后**同步**调
 *    `URL.revokeObjectURL(url)`。`click()` 是同步派发，但「把 URL 交给下载器」
 *    在真实浏览器里是异步的（下载在另一个任务/进程里读这个 URL）。
 *    改为一个宏任务之后再释放，并保留 `removeChild` 同步执行（DOM 清理不能等）。
 *
 * ② **失败可被发现**。原实现没有 try/catch，也没有返回值：`URL.createObjectURL`
 *    缺失或被策略拒绝时异常直接抛到 React 的 onClick，而调用方**照样**显示
 *    「已导出 JSON 备份」——用户以为备份好了，其实文件根本不存在。
 *    对一个「唯一的数据出口」来说这是最坏的一种失败：静默且被谎报为成功。
 *    现在返回 boolean，调用方据此给真实反馈。
 *
 * ③ **Tauri 桌面端的既有结论（本轮核对源码后确认，无需改动）**：
 *    wry 0.55.1 的 `WebViewAttributes::default()` 里
 *    `download_started_handler: Some(Box::new(|_, _| true))`（lib.rs:830），
 *    默认**放行**下载；`tauri-runtime-wry` 只在应用注册 `on_download` 时
 *    才注入自己的处理器（lib.rs:5010），本应用 src-tauri/src/lib.rs 未注册，
 *    因此走默认值——桌面上 `<a download>` 会落到系统下载目录。
 *    （曾怀疑「Tauri 下导出静默失败」，经源码核对**不成立**，记录以免重复排查。）
 */
export const downloadTextFile = (filename: string, content: string, type = "text/plain"): boolean => {
  let url = "";
  try {
    if (typeof URL?.createObjectURL !== "function") return false;
    const blob = new Blob([content], { type });
    url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    // 部分 WebView 要求锚点在文档里才会响应 click()。
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    if (url) releaseObjectUrl(url);
    return false;
  }
  // 见 ①：给下载器一个宏任务去接管这个 URL，再释放。
  releaseObjectUrl(url);
  return true;
};

/** 延迟释放 blob URL；releaseObjectURL 本身缺失时静默跳过（不影响下载结果）。 */
const releaseObjectUrl = (url: string) => {
  const schedule = typeof window !== "undefined" && typeof window.setTimeout === "function"
    ? window.setTimeout
    : null;
  const revoke = () => {
    try {
      URL?.revokeObjectURL?.(url);
    } catch {
      // 释放失败只是泄漏一个内存 URL，不影响已交给下载器的文件。
    }
  };
  if (schedule) schedule(revoke, 0);
  else revoke();
};
