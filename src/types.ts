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
  /**
   * 以下三个字段（2026-09-22 标记为废弃）。
   *
   * 审计结论：**零读取方**——UI 里没有输入框、导入不支持、没有任何页面展示；
   * 唯一的引用是写入侧无条件写空串（`cardService` 的 addWord）。
   * 也就是说它们**永远为空**，占的纯粹是键名开销：
   * 单条 47 字节，一年模型（3,650 条）约 **168KB**。
   *
   * 保留为可选：将来若要做「近义词 / 反义词 / 易混词」功能可以直接启用；
   * 手工导入的备份里若有真实值也不会被丢掉（归一化只在有非空值时才保留）。
   * 新写入不再产生空串。
   */
  synonyms?: string;
  antonyms?: string;
  confusedWords?: string;
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
  /**
   * 用户这一次写下的答案。
   * **不是**可选字段：错词本把它当作「你当时写的答案」展示
   * （`mistakeBookService.ts` 的 attempts/answers），删了就丢掉真实功能。
   */
  answer: string;
  /**
   * 逐词判分结果（diff token 的 JSON）。
   *
   * 2026-09-22 标记为废弃：**全库零读取方**——只有写入点（复习页 / 拼写页把
   * 当场算出的 diff 序列化进来）与 storage 的归一化透传，没有任何消费者读它。
   * 而它占单条复习记录约 37% 的体积（实测 254B 里 94B），
   * 一年量级（约 11,000 条）就是 **近 1MB 的死重量**——
   * 在「约 14~18 个月撞 5MB 上限」的背景下，这是最该先摘掉的一块。
   *
   * 保留为可选：旧数据里可能还有值；新写入不再产生它。
   * 旧值会在下一次「清理历史」时被一并清除（见 `compactReviewHistory`）。
   */
  diffJson?: string;
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

/**
 * 考试单题作答记录（P0-1，PRD §11.1）。
 *
 * `passed` 的语义是「稳住 / 还漏」——**字段名刻意避开「正确 / 错误」**，
 * 与 UI 呈现口径一致（PRD §4.5）。`score` 仅供内部诊断与埋点，
 * 与 `passed` 满足不变量 `passed === (score >= EXAM_ZH2EN_PASS_SCORE)`。
 */
export interface ExamItemResult {
  itemId: string;
  section: 1 | 2 | 3;
  kind: "mcq" | "cloze" | "zh2en" | "read" | "write";
  /** 用户作答原文（自由输入的长文本由归一化器截断）。 */
  answer: string;
  passed: boolean;
  score: number;
  durationMs: number;
  /** 课内出处（G6 可追溯）；阅读/写作不绑课，允许为空串。 */
  sourceLessonId: string;
  answeredAt: string;
}

/**
 * 一次季末卷的作答会话（P0-1）。key = `paperId`。
 *
 * 中断续做（P0，PRD §4.7）就靠 `cursor` + `results`：每节结束即写入，
 * 退出/关应用/切路由都不丢；重进落在 `cursor` 指的题号上。
 */
export interface ExamSession {
  paperId: string;
  seasonId: string;
  variantIndex: number;
  startedAt: string;
  updatedAt: string;
  submittedAt?: string;
  /** 最后未完成的题号。`index` 为卷内该节的第几题（从 0 起）。 */
  cursor: { section: 1 | 2 | 3; index: number };
  results: ExamItemResult[];
  /** 已揭晓的节（逐节揭晓，PRD §4.8）。 */
  revealedSections: number[];
  /**
   * 写作题的作答与 AI 批改结果。
   * `degraded === true` 表示 AI 未给出批改（未配置 / 超时 / 解析失败）——
   * 此时只保留用户原文并提供重试，**不得显示任何伪造评语或分数**（G-A3）。
   */
  writing?: {
    text: string;
    corrected?: string;
    recast?: string;
    comment?: string;
    issues?: { original: string; correction: string; explanation: string; tag?: string }[];
    degraded?: boolean;
    degradeReason?: string;
  };
}

/**
 * 「我觉得这句没错」的异议记录（P0-1）。
 *
 * 只记录、不即时改判：既有架构红线是「AI 一旦沾判分，用户一辩它就翻供」
 * （`prd-grammar-ai-tutor-2026-09-19.md:285`），所以异议只落库供 M4 复核质量。
 */
export interface ExamDispute {
  id: string;
  paperId: string;
  itemId: string;
  /** 用户的主张原文（截断后存储）。 */
  claim: string;
  createdAt: string;
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
  /**
   * 季末综合卷的作答会话（P0-1）：paperId → 会话。可选，旧数据无此键。
   * 只承载「考试作答」本身；**不参与解锁、不计入掌握度、不写弱点通路**（PRD §4.10 不变量 7）。
   */
  examSessions?: Record<string, ExamSession>;
  /** 考试异议记录（只记录不改判）。数组上限由归一化器兜住。 */
  examDisputes?: ExamDispute[];
  /**
   * 已删除的**内置词书** id（删除标记 / tombstone，2026-09-23 加）。
   *
   * 为什么需要它：内置词书由 `ensureDefaultUnits` 在**每次** loadData / saveData
   * 时按「id 不存在就补」的规则维护。用户删掉一本内置书后，下次启动它就被无条件补回，
   * 书里的卡片也被重新归位——用户删了等于没删（MG3b 的 FAIL-7）。
   *
   * 语义：用户**主动删除**内置书时把 id 记在这里；seeding / ensureDefaultUnits
   * 见到已标记的 id 就不再补。只用于内置书（`core-100-unit-*` /
   * `unit-adventure-accumulation`）——用户自建书不在回填范围内，无需标记。
   *
   * 撤销删除（`restoreUnit`）时要把 id 从本表移除，否则「撤销」后重启又会消失。
   */
  deletedBuiltinUnitIds?: string[];
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

/**
 * 一处修正的**操作类型**（批五十三新增，全库 794 条已逐条标注）。
 *
 * 这个字段存在的唯一理由：在它出现之前，「这条修正到底是替换、删除还是移动」全靠
 * 消费方**猜 correction 的字面长相**——`startsWith("去掉")` 判删词、含汉字判说明、
 * 正则捞「把 X 移到 Y」判移动。实测 10 份实现各自猜（huntService / grammarReplayService /
 * grammarBoostService / 若干 rv 守门 / 临时脚本），并且已经分叉出错：移动型曾写成
 * `去掉（X 放到 Y 前面）`，被「去掉」前缀误判成删除、生成粘句病句（批五十一修数据）。
 * 现在类型由数据自带，消费方读字段，不再猜字面。
 *
 * 值的含义与**句子层可执行性**（这是最要紧的一列）：
 *
 * | 值 | 数量 | 含义 | 句子层怎么处理 |
 * |---|---|---|---|
 * | `replace` | 613 | 把该位置的词换成新词（含多词段整体替换） | 替换 |
 * | `insert` | 86 | 在该位置**补**词（`very` → `is very`） | 替换（新词已含原词） |
 * | `delete` | 61 | 删掉该位置的词 | `splice` |
 * | `move` | 18 | 词序调整（`把 white 移到 cat 前面`） | 按 `moveFromIndex` 等显式下标执行（批五十四）|
 * | `punct` | 13 | 只改标点（`day?` → `day!`） | 替换 |
 * | `orth` | 3 | 只改大小写/撇号（`Id` → `I'd`） | 替换 |
 * | `explain` | 0 | 纯位置说明，无可执行目标（历史上 1 条，批五十四改判为 move）| **保持原样** |
 *
 * ⚠️ **`move` 为什么不能靠解析中文执行**（批五十三实测，批五十四给出正解）：
 * 三种「解析 correction 文案」的实现全部失败——① 全句首个匹配：`a cat white` → `a white. cat`
 * （标点跟着词跑）；② 句内定位 + 短语锚点：`My friend has a white cat She. was excite`；
 * ③ 标点留位版：token 守恒 14/14 全过，却产出 `Eat the chicken hot noodles.`（答案本应是
 * `hot chicken noodles`）、`Both Books are good.`（大小写错）。
 *
 * **结论：移动不能解析文案，只能显式声明。** 批五十四给每条 `move` 补了
 * `moveFromIndex` / `moveToIndex` / `movePosition` 三个下标字段，18 处逐案人工裁定，
 * 由 `applyMove` 落地（连带修尾标点与句首大小写）。`correction` 从此**只给人看**，
 * 机器一行都不解析。
 *
 * ⚠️ 消费方纪律：`delete` / `move` / `explain` **必须**读这个字段判断，禁止再用
 * `startsWith("去掉")` 之类的字面判断——`hunt-umbrella-owner#5` 的 correction 就写成
 * `去掉（this book 顺序调整：…）`，字面像删除、实际是移动，正是被这个坑坑过的样本。
 */
export type HuntEditOp = "replace" | "insert" | "delete" | "move" | "punct" | "orth" | "explain";

/** 案件里植入的一处错误。tokenIndex 指向 HuntCase.tokens 的下标。 */
export interface HuntError {
  tokenIndex: number;
  tag: GrammarErrorTag;
  /**
   * 该错词在题面里的样子（供对位校验与展示）。
   *
   * ⚠️ 注意两种形态：**单词**（`move`）与**跨 token 短语**（`a dress beautiful`）。
   * 后者共 8 处——消费方不能用「单 token 相等」判断，必须按短语处理。
   */
  original: string;
  /**
   * 改法。**一个字段混着七种语义**（详见 `HuntEditOp`；2026-09-23 批五十三已把操作类型
   * 抽成下面的 `editOp` 字段，本字段保留原文供展示）：
   *
   * | 形态 | 例 | 句子层怎么处理 |
   * |---|---|---|
   * | **替换** | `moved` / `is happy` / `a lot of` | 替换该位置的词 |
   * | **补词** | `is happy`（原词 `happy`） | 整段替换该位置 |
   * | **删除** | `去掉 so` | `splice` 掉该词 |
   * | **移动** | `把 white 移到 cat 前面` | **保持原样**（机械执行实测产病句）|
   * | **标点/正字** | `day!` / `May` / `I'd` | 替换 |
   * | **纯说明** | `（rather 跟在 would 后）` | **保持原样** |
   *
   * **消费方纪律**：
   *   - 判断操作类型一律读 `editOp`，**不要猜字面**（见 `HuntEditOp` 的说明）。
   *   - 句子层修正一律走 `correctedSentenceOf`，**不要自己写正则判断**。
   *   - 错词本挑词一律走 `pickCorrectionWord`。
   */
  correction: string;
  /**
   * 这处修正的操作类型。**句子层的唯一判据**（批五十三新增）。
   * 生成期由脚本按 correction 的字面批量标注，`move` / `explain` 为人工逐条确认。
   */
  editOp: HuntEditOp;
  /**
   * 移动型的**显式目标**（只有 `editOp === "move"` 时有值；批五十四新增）。
   *
   * **为什么要有这三个字段**：`move` 的 correction 是中文说明
   * （`把 white 移到 cat 前面`），机械解析中文做移动，三种实现实测全部产出病句
   * （见 `HuntEditOp` 文档：标点跟词跑 / `a white cat She. was excite` /
   * `Eat the chicken hot noodles.`）。所以移动不能靠解析文案——把
   * 「哪个词、移到哪」直接写成机器可读的**原始下标**，彻底不碰文案。
   *
   * - `moveFromIndex`：**真正被搬动**的那个 token 的原始下标。
   *   ⚠️ 它可以**不等于** `tokenIndex`——`tokenIndex` 是「玩家该点哪」（错处的入口），
   *   `moveFromIndex` 是「机器搬哪个」。样本：`hunt-so-do-i` 用户点 `So`（下标 0），
   *   但机械上要搬 `I`（下标 1）才能从 `So I do.` 得到 `So do I.`。
   * - `moveToIndex`：锚点 token 的原始下标（**不是**移动目标位置本身）。
   * - `movePosition`：移到锚点**前面**还是**后面**。
   *
   * **落地点会连带修两件事**（通用规则，不是逐案补丁）：
   *   ① 尾标点归位——原句末的 `.`/`?` 属于**句子**不属于词，移动后归给新的句末词；
   *   ② 句首大小写——被搬到句首的词首字母大写，被挤离句首的词首字母小写。
   *
   * **结构约束**（rv11 守门）：`moveFromIndex` 与 `moveToIndex` 之间不得夹着同案
   * 其它错点的下标——否则移动会挪动尚未处理的错点位置。
   */
  moveFromIndex?: number;
  moveToIndex?: number;
  movePosition?: "before" | "after";
  /** 给用户看的一句人话解释（零术语红线适用）。 */
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
  /** 这句中文还有别的同样算对的说法（判分取最高分）。用法见 GrammarLesson.acceptAlso。 */
  acceptAlso?: string[];
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
  /**
   * **要看的地方**（题面删除线的落点）——注意它的语义是「这里有问题」，**不是「这个词错了」**。
   *
   * 2026-09-23 批五十补文档（两研究独立指出此字段口径被反复误读）：
   *
   * **语义**：三种合法形态，都是「位置指示」——
   *   ① **该换掉的词**（划的词只出现在错句里）——如 `I want a apple.` 划 `a`
   *   ② **位置锚点**（划的词两边都有，指「这个位置缺东西」）——如 `I have pen.` 划 `pen`，
   *      意思是「这里要补个 a」（`I have a pen.`），**不是说 pen 这个词错了**
   *   ③ **成对冲突里保留的那一半**——如 `between Tom to Amy` 划 `to`（讲解里给出 `and`）
   *
   * **与讲解里的 `【】` 的区别**（这对标记最容易被混用）：
   *   - `wrongMark` = **要点击/划掉的位置**（有机器消费方：判题、渲染）
   *   - `【】`（写在 `whyZh` 里）= **改正后的形式**（纯教学展示，**零机器消费方**）
   *   两者**本就该不同**（划 `to`、展示 `【and】`），**禁止做一致性校验**。
   *
   * **判据看 `bothRight`，不要看 `wrongMark` 是否为 null**：
   *   - `wrongMark` 有值：674 张（错卡，标出问题位置）
   *   - `bothRight: true` + 无值：502 张（**双正解卡**——注意它的 `wrong` 字段装的是**正确句**）
   *   - `bothRight` 省略 + 无值：52 张（整句层面有问题的错卡）
   *
   * ⚠️ 统计脚本注意：`wrongMark` 有多词形态（`"you are"` / `"Am I"` 等 65 张），
   * 按单 token 口径统计会永远匹配不上，**必须单列**。
   *
   * ⚠️ 历史上曾因「用裸 `indexOf` 定位」导致 14 张卡的删除线划进别的单词内部——
   * 定位一律走 `locateMarkedTokens`（词边界 + 正确句消歧），不要自己写 `indexOf`。
   */
  wrongMark?: string | null;
  correct: string;
  whyZh: string;
  /** 双正解条（L36 that 可选件）：两句都对——选哪句都判对，揭示时两句并排展示。 */
  bothRight?: boolean;
}

/** 句式变体：肯定 / 否定 / 疑问三种口气。 */
export interface LessonVariant {
  /**
   * 2026-09-22 批四十七收紧：原为 `string`，实测出现过枚举外的取值
   *（L75 曾是「提议（第二种）」），导致依赖 `label !== "肯定"` 或正则回读 label 的守门
   * 静默失效。收紧为联合类型后这类取值在编译期就会被拦下。
   */
  label: "肯定" | "否定" | "疑问";
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
  /**
   * 除 `targetSentence` 之外**同样算对**的说法（可选）。
   *
   * 用于「同一句中文，课内教了两种都对的说法」——此时产出类题（凭记忆写 / 自己写）
   * 只认一个基准句，会把写出另一种的学习者判错。如 L68「我给妈妈买了份礼物。」：
   * 基准句 `I bought a gift for my mom.`，而本课 sceneSwings 又教了
   * `I bought my mom a gift.`（buy sb sth 双宾），两种都对。
   *
   * **判定标准是「写出另一解是否也正确」**，看三条：
   *   1. 两种说法只在**特定语境**下分别正确，而题目本身**没给出该语境** → 填。
   *      如 L175「我也是。」：`So do I.` / `So am I.` 取决于对方那句话，
   *      而题干只有「我也是。」（本课 examples 也明说「对方说的是 am/is 时，这里也跟着换」）。
   *   2. 中文本身**不区分**英文要区分的那个点 → 填。
   *      如 L54「窗户昨天被打扫了。」：「窗户」不标单复数，`window` / `windows` 都合法，
   *      且本课的点是主动/被动，不是单复数。
   *   3. 另一种说法会**抹掉本课要教的区别**，或只是**别课的回顾** → **不填**。
   *      如 L112「这本是我的。」：本课的点就是长版 `mine` / 短版 `my` 之分，
   *      而 `This one is mine.` 在本课 examples 里被标为「第 33 课」的回顾。
   */
  acceptAlso?: string[];
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
