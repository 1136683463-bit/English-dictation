export type CardType = "word" | "phrase" | "sentence";
export type CardStatus = "new" | "learning" | "review" | "mastered" | "suspended";
export type ReviewMode = "recognize" | "recall" | "spelling" | "cloze" | "dictation";
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
  priority: boolean;
  createdAt: string;
  updatedAt: string;
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
  /** 每天日记的题目数量，只允许 3 / 5 / 10。 */
  diaryDailyCount: number;
  aiProvider: AiProviderSettings;
  dataSync: DataSyncSettings;
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
  /** 「小美的一天」已完成课程 ID，驱动课程地图点亮。 */
  grammarLessonsDone: string[];
  /** 「我的英文日记」条目。 */
  diaryEntries: DiaryEntry[];
  schedules: Schedule[];
  dictionaryEntries: DictionaryEntry[];
  seededWordVersions: string[];
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
  | "verb_form";

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
  kind: "choose" | "arrange" | "spot";
  promptZh: string;
  /** choose 题干：空位前的部分。 */
  before?: string;
  /** choose 题干：空位后的部分。 */
  after?: string;
  /** choose 的选项。 */
  options?: string[];
  /** arrange / spot 的词块（arrange 含干扰项；spot 是含错的完整词块序列）。 */
  tokens?: string[];
  /** spot：藏了问题的那个词块（命中即通过）。 */
  wrongToken?: string;
  /** spot：点对之后给出的纠正说法。 */
  correctionZh?: string;
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
  createdAt: string;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
