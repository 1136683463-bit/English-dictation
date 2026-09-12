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

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
