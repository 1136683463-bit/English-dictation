export type CardType = "word" | "phrase" | "sentence";
export type CardStatus = "new" | "learning" | "review" | "mastered" | "suspended";
/**
 * 复习形态。`rebuild`（把词块拼回句子）2026-09-21 从 `recall` 里拆出来：
 * 此前「拼词块」与「自己写整句」共用 recall，导致语法复习的掌握判定
 * （isMasteredByOutput 按 mode === "recall" 过滤）把拼词块也算成一次输出，
 * 用户只真正独立写出过 1 次就被判「已掌握」。
 */
export type ReviewMode = "recognize" | "recall" | "spelling" | "cloze" | "dictation" | "rebuild";
export type Rating = 1 | 2 | 3 | 4;
export type MistakeGenerationType = "examples" | "story";
export type MistakeGenerationLevel = "A2" | "B1" | "B2";
export type MistakeGenerationLength = "short" | "medium" | "long";
export type MistakeGenerationWordStatus = "pending" | "improving" | "mastered" | "stubborn";

export interface Card {
  id: string;
  type: CardType;
  front: string;
  back: string;
  note: string;
  sourceId?: string;
  unitId?: string;
  tags: string[];
  status: CardStatus;
  suspendedFrom?: CardStatus;
  priority: boolean;
  /** 重点标记来源：manual=用户手动标星；system=算法因 lapseCount≥3 自动置位。缺省视为 manual（历史数据）。 */
  prioritySource?: "manual" | "system";
  createdAt: string;
  updatedAt: string;
  /** R13：进入 mastered 状态的时间（仅在状态转换瞬间写入，不随 priority/编辑等操作变化）；非 mastered 为 null。 */
  masteredAt?: string | null;
  /** P1-1：从动态错词书毕业的时间（连续全对自动移出时写入）；晚于最近一次错误即视为错词本「已掌握」标记，再次出错后失效。 */
  mistakeGraduatedAt?: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  color: string;
  groupId?: string;
  createdAt: string;
  updatedAt: string;
  /** M1 打点（P1-7）：整本词书全部单词 mastered 的时间；任何一张卡退回未掌握时清除。 */
  completedAt?: string;
  /** 速通本徽标（P0-3）：前两本未启动的词书标记为「3 天速通本」。 */
  speedRun?: boolean;
  /** P1-1 动态词书类型（#3 拍板：实体 Unit + 系统徽标）。mistakes=错词自动聚成；预留 weekly_materials 等扩展位。 */
  dynamicKind?: "mistakes";
}

export interface UnitGroup {
  id: string;
  title: string;
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordDetails {
  cardId: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  chineseDefinition: string;
  englishDefinition: string;
  collocations: string;
  synonyms: string;
  antonyms: string;
  confusedWords: string;
  audioUrl: string;
  sourceSentence: string;
}

export interface SentenceDetails {
  cardId: string;
  sentence: string;
  translation: string;
  keywords: string[];
  grammarNote: string;
  audioUrl: string;
}

export interface Material {
  id: string;
  title: string;
  type: "text" | "subtitle" | "audio" | "note";
  content: string;
  sourceUrl: string;
  tags: string[];
  createdAt: string;
}

export interface MaterialSegment {
  id: string;
  materialId: string;
  index: number;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  cardId: string;
  mode: ReviewMode;
  rating: Rating;
  answer: string;
  diffJson: string;
  reviewedAt: string;
}

export interface MistakeGenerationSettings {
  level?: MistakeGenerationLevel;
  scene?: string;
  length?: MistakeGenerationLength;
  tone?: string;
  bilingual?: boolean;
}

export interface MistakeGenerationWordSnapshot {
  cardId: string;
  word: string;
  translation: string;
  wrongAnswers: string[];
  status?: MistakeGenerationWordStatus;
}

export interface MistakeGenerationCoverage {
  usedCardIds: string[];
  missingCardIds: string[];
}

export interface MistakeGenerationStoryWordNote {
  word: string;
  sentence: string;
  meaning: string;
}

export interface MistakeGenerationStory {
  title: string;
  englishStory: string;
  chineseTranslation: string;
  usedWords: string[];
  missingWords: string[];
  wordNotes: MistakeGenerationStoryWordNote[];
}

export interface MistakeGeneration {
  id: string;
  dateKey: string;
  type: MistakeGenerationType;
  cardIds: string[];
  title: string;
  content: string;
  prompt: string;
  createdAt: string;
  settings?: MistakeGenerationSettings;
  wordSnapshots?: MistakeGenerationWordSnapshot[];
  coverage?: MistakeGenerationCoverage;
  story?: MistakeGenerationStory;
}

export interface Schedule {
  cardId: string;
  easeFactor: number;
  intervalDays: number;
  reviewCount: number;
  lapseCount: number;
  nextReviewAt: string;
  // R2：priority 康复计数（仅系统置位卡维护；旧数据无此字段 → undefined，天然向后兼容）。
  recoveryCount?: number;
}

export interface DictionaryEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  translation: string;
  collocations: string;
}

export interface Settings {
  dailyNewWords: number;
  dailyReviewLimit: number;
  dailySentences: number;
  strictPunctuation: boolean;
  speechVoice: string;
  speechLang: "en-US" | "en-GB";
  speechRate: number;
  autoSpeakInSpelling: boolean;
  lastExportedAt: string;
  /** 最近一次云同步成功（上传或恢复）的时间；与 lastExportedAt 一起作为备份提醒依据。 */
  lastSyncedAt: string;
  /** 每天日记的题目数量，只允许 3 / 5 / 10。 */
  diaryDailyCount: number;
  /** R11 日记批改强度：gentle=温柔（只夸+最多指 1 处）/ standard=标准 / strict=严格（全量指出+追问一句）。 */
  diaryCorrectionStyle?: "gentle" | "standard" | "strict";
  aiProvider: AiProviderSettings;
  dataSync: DataSyncSettings;
  /** P1-4 纯复习日临时档：等于当天 dayKey（statsService.dayKey）时生效——当日拼写队列不安排新词；跨天自动失效，无需迁移。 */
  reviewOnlyDayKey?: number;
  /** P2-1 学习范围锁定：全局智能队列只出这些词书的词；undefined/空数组 = 未锁定（全部词书）。 */
  studyScopeUnitIds?: string[];
  /** P2-2 里程碑激励：已弹过庆祝的里程碑 id 记录（milestoneService.MILESTONES 的 id），避免重复弹。 */
  reachedMilestoneIds?: string[];
}

export interface DataSyncSettings {
  enabled: boolean;
  baseUrl: string;
  token: string;
}

export interface AiProviderSettings {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  timeoutMs: number;
  fallbackToLocal: boolean;
}

export type AdventureLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type AdventureTemplate = "campus" | "city" | "travel" | "fantasy" | "custom";
export type AdventureNodeSource = "offline" | "ai";

export interface AdventureChoice {
  id: string;
  label: string;
  description: string;
  promptHint: string;
}

export interface AdventureVocabulary {
  word: string;
  translation: string;
  partOfSpeech: string;
  sentence: string;
  cardId?: string;
}

export interface AdventureNode {
  id: string;
  parentId?: string;
  chapter: number;
  title: string;
  englishText: string;
  chineseText: string;
  sentenceTranslations?: string[];
  summary: string;
  source: AdventureNodeSource;
  choices: AdventureChoice[];
  selectedChoiceId?: string;
  customAction?: string;
  vocabulary: AdventureVocabulary[];
  createdAt: string;
}

export interface Adventure {
  id: string;
  title: string;
  template: AdventureTemplate;
  /** 冒险对应的场景插画 ID（AdventureSceneId）；AI/自定义冒险在创建时记录，旧数据缺省时按关键词推断。 */
  scene?: string;
  /** 内置主题库 ID：从随机推荐创建的冒险记录它，列表里能还原该主题的专属插画。 */
  themeId?: string;
  level: AdventureLevel;
  customPrompt: string;
  createdAt: string;
  updatedAt: string;
  currentNodeId: string;
  nodes: AdventureNode[];
}

/* ── 语言之门（Language Gate，GRAMMAR_ADVENTURE_PLAN §8.2）──────────────── */

/** 误读支线：NPC 按字面理解错误句子后的温和错位反应（喜剧），按 errorTag 匹配。 */
export interface MisreadBranch {
  errorTag: GrammarErrorTag;
  /** NPC 当真理解后的反应（必须是语法正确的英语，红线 2）。 */
  npcReply: string;
  npcReplyZh: string;
  /** 小灯的一句话提示（引导玩家自己改对，不出现"错误"字样）。 */
  lampHint: string;
}

/** 语言之门：挂在 AdventureNode 上的语法挑战——写一句英文才能推进剧情。 */
export interface LanguageGate {
  id: string;
  /** 对应语法点（V1 grammarTopics 的 topicId）。 */
  topicId: string;
  /** 对应符文。 */
  runeId: string;
  /** 介入模式：补全 / 说出这句 / 自由回应。 */
  mode: "complete" | "say" | "respond";
  /** NPC 的英文台词与中文对照。 */
  npcLine: string;
  npcLineZh: string;
  /** 中文意图（门内任务指令："告诉她你从北京来，昨晚到的"）。 */
  zhIntent: string;
  /**
   * 学完能说什么（门外能力声明，PRD-learning-goal-visibility FR-3）：
   * 统一句式「说清/讲清/问清『…』」，用于地图关卡行与门内「本关学会」。
   * 与 zhIntent 分离：任务句与能力句是两种语域。
   */
  canDo: string;
  /** 期望句式（结构描述，如 "I + 过去式 + …"）。 */
  requiredPattern: string;
  sampleAnswer: string;
  /** 三档提示（由小灯说出，hint3 可给完整答案）。 */
  hints: [string, string, string];
  /**
   * 骨架拆解（settle 阶段把句子拆给初学者看）：
   * subject/verb 为句子的两段切面，subjectLabel/verbLabel 为对应的中文标注。
   * 常规句："谁 + 做什么"；there be 句型："有什么 + 在哪里"类。
   */
  skeleton: { subject: string; verb: string; subjectLabel: string; verbLabel: string };
  /** 反面例句（少了谓语/骨架塌掉的写法，settle 对比用——有对比才知道为什么对）。 */
  counterExample: string;
  /** 反例的中文点评（这句错在哪，如"两个元音撞在一起会黏住"）。 */
  counterNote: string;
  /** 宽松接受正则（同义表达）。 */
  acceptRegex?: string;
  /** 误读支线集合，按 errorTag 匹配。 */
  misreadBranches: MisreadBranch[];
}

/** 一次语言之门回答记录：驱动 NPC 记忆与弱点档案。 */
export interface GateAttempt {
  id: string;
  adventureId: string;
  nodeId: string;
  gateId: string;
  topicId: string;
  raw: string;
  verdict: "pass" | "near" | "misread";
  errorTags: GrammarErrorTag[];
  hintsUsed: number;
  attemptIndex: number;
  createdAt: string;
}

/** 语言符文：把语法点变成可收集的物件。 */
export interface GrammarRune {
  id: string;
  topicId: string;
  stage: "S0" | "S1" | "S2" | "S3" | "S4" | "S5";
  worldId: string;
  name: string;
  /** 几何符号 id（环、链、锚、镜、羽……）。 */
  glyph: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  oneLineRule: string;
  /** 三条「咒语」（例句）。 */
  spells: string[];
}

/** 符文熟练度状态：只有到 instinct 才算真正掌握。 */
export interface RuneState {
  runeId: string;
  mastery: "unseen" | "seen" | "usable" | "fluent" | "instinct";
  xp: number;
  unlockedAt?: string;
}

export interface AppData {
  schemaVersion: number;
  unitGroups: UnitGroup[];
  units: Unit[];
  cards: Card[];
  wordDetails: WordDetails[];
  sentenceDetails: SentenceDetails[];
  materials: Material[];
  materialSegments: MaterialSegment[];
  reviews: Review[];
  mistakeGenerations: MistakeGeneration[];
  adventures: Adventure[];
  huntAttempts: HuntAttempt[];
  huntResults: HuntResult[];
  /** 「小美的一天」已完成课程 ID，驱动课程地图点亮。语义 = 关 1（本课正课）完成。 */
  grammarLessonsDone: string[];
  /**
   * 三关卡粒度完成态（F1，2026-09-13 PRD）：lessonId → 已完成关卡序号数组（1=正课 / 2=次日回访 / 3=旧案重审）。
   * 与 grammarLessonsDone 双写并存：关 1 完成时两处都写；旧数据回填时此处补 [1]。旧字段保留 ≥1 版本可回滚。
   */
  grammarLessonStagesDone?: Record<string, number[]>;
  /**
   * 「趁热练」课后强化训练完成态（2026-09-18 PRD R-B1）：lessonId → 已完成档位数组（1/2/3）。
   * 语义 = 至少完成过一次该档；复练不改写此字段（完成后无限重练）。可选层，不参与解锁判定。
   */
  grammarBoostsDone?: Record<string, number[]>;
  /** 「我的英文日记」条目。 */
  diaryEntries: DiaryEntry[];
  schedules: Schedule[];
  dictionaryEntries: DictionaryEntry[];
  seededWordVersions: string[];
  /** 语言之门关卡库（内置手写 + AI 生成）。 */
  languageGates: LanguageGate[];
  /** 语言之门回答记录。 */
  gateAttempts: GateAttempt[];
  /** 符文熟练度状态。 */
  runeStates: RuneState[];
  settings: Settings;
}

export interface DiffToken {
  token: string;
  expected?: string;
  status: "match" | "missing" | "extra" | "spelling" | "substitution";
}

export interface LetterDiffToken {
  char: string;
  expected?: string;
  status: "match" | "missing" | "extra" | "substitution";
}

/** 语法错误类型标签：与「侦探找错」的罪名体系一一对应。 */
export type GrammarErrorTag =
  | "tense"
  | "sv_agreement"
  | "missing_be"
  | "article"
  | "plural"
  | "preposition"
  | "fragment"
  | "run_on"
  | "word_order"
  | "verb_form"
  | "comparison";

/** 案件里植入的一处错误。tokenIndex 指向 HuntCase.tokens 的下标。 */
export interface HuntError {
  tokenIndex: number;
  tag: GrammarErrorTag;
  original: string;
  correction: string;
  explanation: string;
}

/** 侦查案件：一段含若干错误的英文，玩家点出错误并判定罪名。 */
export interface HuntCase {
  id: string;
  number: number;
  title: string;
  scene: string;
  tokens: string[];
  errors: HuntError[];
  /** 案件里超出核心词汇门槛、必须保留的生词提示（页面展示为「生词提示」）。 */
  notes?: { word: string; zh: string }[];
  /** R15：人工校验标记——true 表示语法、罪名标注与讲解已人工核对；未被课程引用的案件须校验后方可上线。 */
  reviewed?: boolean;
}

/** 一次点选记录，用于统计误判率与高频错因。 */
export interface HuntAttempt {
  id: string;
  caseId: string;
  tokenIndex: number;
  guessedTag: GrammarErrorTag | null;
  hit: boolean;
  createdAt: string;
}

/** 一次破案结算。 */
export interface HuntResult {
  id: string;
  caseId: string;
  found: number;
  total: number;
  misses: number;
  stars: number;
  durationMs: number;
  finishedAt: string;
}

/** 讲解阶段的一个词块：text 是英文，role 是它的大白话角色。 */
export interface LessonBlock {
  text: string;
  role: string;
}

export interface LessonExample {
  en: string;
  zh: string;
}

/** 引导练习（第②段「试一试」）：几乎不会错的点选 / 拼装 / 找茬题。 */
export interface LessonGuidedStep {
  kind: "choose" | "arrange" | "spot" | "replace";
  promptZh: string;
  /** choose 题干：空位前的部分。 */
  before?: string;
  /** choose 题干：空位后的部分。 */
  after?: string;
  /** choose / replace 的选项。 */
  options?: string[];
  /** arrange / spot 的词块（arrange 含干扰项；spot 是含错的完整词块序列）。 */
  tokens?: string[];
  /** spot：藏了问题的那个词块（命中即通过）。 */
  wrongToken?: string;
  /** spot：点对之后给出的纠正说法。 */
  correctionZh?: string;
  /**
   * R9 变形/替换题（构造迁移）：换主语/时间/情态后，句中需跟着变形的那个词。
   * replaceBase = 给出的正确原句（如 "I am drawing."）；replaceTarget = 要换成的成分提示（如 "把 I 换成 She"）。
   * answer = 变形后的正确词（如 "is"），options = 候选（is/am/are）。复用 choose 判题内核。
   */
  replaceBase?: string;
  replaceTarget?: string;
  answer: string;
  explain: string;
}

/** 自由练习（第③段「自己来」）：给中文意思，点词成句。 */
export interface LessonPracticeStep {
  promptZh: string;
  tokens: string[];
  /** R4：干扰项词块（与 tokens 合并进词块库打乱展示）；缺省＝无干扰项，向后兼容。 */
  distractors?: string[];
  answer: string;
}

/** R5「忆」段：遮盖回忆型——给中文/场景、不给选项，凭记忆写出整句。 */
export interface LessonRecall {
  promptZh: string;
  /** D8：中文意图句（你要说的话）——缺了它用户不知道要回忆哪一句，必然卡关。 */
  intentZh: string;
  answer: string;
  /** 答错/看答案时给的一句人话解释（缺省回退 oneLineRule）。 */
  noteZh?: string;
}

/** 小剧场的一句台词：who 为 "me" 表示轮到小美说的那句。 */
export interface LessonDialogueLine {
  who: string;
  en: string;
  zh: string;
}

/** 正误对比：先见「有人是这样说的」，揭晓后给正确句 + 为什么。 */
export interface LessonContrast {
  wrong: string;
  /** 需要标出的问题词；null 表示整句缺了一块。 */
  wrongMark?: string | null;
  correct: string;
  whyZh: string;
  /** 双正解条（L36 that 可选件）：两句都对——选哪句都判对，揭示时两句并排展示。 */
  bothRight?: boolean;
}

/** 句式变体：肯定 / 否定 / 疑问三种口气。 */
export interface LessonVariant {
  label: string;
  en: string;
  zh: string;
  noteZh?: string;
}

/** 场景变奏：同一句型换一个生活场景。 */
export interface LessonSceneSwing {
  sceneZh: string;
  en: string;
  zh: string;
}

/** 深挖折叠卡（默认收起）：辨析、规则背后的道理。 */
export interface LessonDeepDive {
  title: string;
  paragraphs: string[];
}

/** 完课页迷你小结卡：一屏读完的「我会了」清单。 */
export interface LessonSummary {
  rule: string;
  points: string[];
}

/** 一节课：「小美的一天」连续剧的一集，四段式流程（看→跟→练→破）。 */
export interface GrammarLesson {
  id: string;
  number: number;
  title: string;
  /** 这一课学的语法点（卡片与课程页展示），如「be 动词 · I am」。 */
  grammarLabel: string;
  episode: string;
  /** 场景插画 ID（AdventureSceneId），用于图文小剧场。 */
  scene: string;
  /** 课程地图卡片封面（AI 生成的剧情插画，缺省时回退 scene SVG）。 */
  cover?: string;
  sceneSetupZh: string;
  dialogueEn: string;
  dialogueZh: string;
  intentZh: string;
  targetSentence: string;
  blocks: LessonBlock[];
  oneLineRule: string;
  examples: LessonExample[];
  guided: LessonGuidedStep[];
  practice: LessonPracticeStep[];
  /** 第④段侦探挑战关联的找错案件。 */
  huntCaseIds: string[];
  // ── 以下为深度优化增量字段（全部可选，旧数据不填自动回退旧版形态）──
  /** 多句小对话；不填则回退 dialogueEn/dialogueZh 单句。 */
  dialogue?: LessonDialogueLine[];
  /** 正误对比揭示卡。 */
  contrast?: LessonContrast[];
  /** 肯定 / 否定 / 疑问变体。 */
  variants?: LessonVariant[];
  /** 场景变奏列表。 */
  sceneSwings?: LessonSceneSwing[];
  /** 「想知道为什么？」深挖折叠卡。 */
  deepDive?: LessonDeepDive;
  /** 完课页迷你小结卡。 */
  summary?: LessonSummary;
  /** R5「忆」段（新增六段式第③段）：缺省＝该课跳过忆段，向后兼容。 */
  recall?: LessonRecall;
}

/** 日记批改指出的一处问题（语气必须温和，不出现「错误」字样）。 */
export interface DiaryIssue {
  original: string;
  correction: string;
  explanation: string;
  /** 语法点归因（R01⑤）：AI 批改顺带输出 10 类罪名之一；无 AI / 未识别时缺省。 */
  tag?: GrammarErrorTag;
}

/** R11 日记批改结果：recast = 更地道的写法（与用户原句并排展示，低成本高感知价值）。 */
export interface DiaryCorrectionResult {
  correctedEn: string;
  issues: DiaryIssue[];
  /** 更地道的重述（recast）；AI 未返回时缺省。 */
  recast?: string;
  /**
   * 一句中文追问（严格档要求，其他档位模型也可能给）。
   * prompt 从 R11 起就要求返回它，但解析层此前丢弃了这个字段——
   * 现在接住并展示：批改之后紧跟一句"再多说一句"的邀请，是 output 延展的低成本抓手。
   */
  followUp?: string;
}

/** 一条英文日记。status: pending=还没批改（离线保存），done=已批改。 */
export interface DiaryEntry {
  id: string;
  dateKey: string;
  questionId: string;
  questionZh: string;
  answerEn: string;
  correctedEn: string;
  issues: DiaryIssue[];
  status: "pending" | "done";
  note?: string;
  /** 批改给出的一句中文追问（可选）——展示为「再多说一句」的邀请。 */
  followUp?: string;
  createdAt: string;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
