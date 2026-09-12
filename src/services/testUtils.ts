import type { AppData, Card, MistakeGeneration, Review, Schedule, Settings, Unit, UnitGroup } from "../types";
import { APP_SCHEMA_VERSION } from "./storage";

export const TEST_NOW = "2024-01-15T12:00:00.000Z";

const defaultSettings: Settings = {
  dailyNewWords: 10,
  dailyReviewLimit: 30,
  dailySentences: 5,
  strictPunctuation: false,
  speechVoice: "",
  speechLang: "en-US",
  speechRate: 0.9,
  autoSpeakInSpelling: true,
  lastExportedAt: "",
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

type TestDataPatch = Omit<Partial<AppData>, "settings"> & {
  settings?: Partial<Settings>;
};

export const makeTestData = (patch: TestDataPatch = {}): AppData => ({
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
  dictionaryEntries: [],
  seededWordVersions: ["core-100-v1"],
  ...patch,
  settings: {
    ...defaultSettings,
    ...patch.settings
  }
});

export const createTestData = makeTestData;

export const makeCard = (patch: Partial<Card> = {}): Card => ({
  id: "card_1",
  type: "word",
  front: "approach",
  back: "方法",
  note: "",
  tags: [],
  status: "new",
  priority: false,
  createdAt: TEST_NOW,
  updatedAt: TEST_NOW,
  ...patch
});

export const makeWordCard = (id: string, front = "approach", back = "方法"): Card =>
  makeCard({ id, front, back });

export const makeUnit = (patch: Partial<Unit> = {}): Unit => ({
  id: "unit_1",
  title: "Unit 1",
  description: "",
  order: 1,
  color: "#2563eb",
  createdAt: TEST_NOW,
  updatedAt: TEST_NOW,
  ...patch
});

export const makeUnitGroup = (patch: Partial<UnitGroup> = {}): UnitGroup => ({
  id: "group_1",
  title: "核心100",
  color: "#f06423",
  order: 1,
  createdAt: TEST_NOW,
  updatedAt: TEST_NOW,
  ...patch
});

export const makeSchedule = (patch: Partial<Schedule> = {}): Schedule => ({
  cardId: "card_1",
  easeFactor: 2.5,
  intervalDays: 0,
  reviewCount: 0,
  lapseCount: 0,
  nextReviewAt: TEST_NOW,
  ...patch
});

export const makeReview = (patch: Partial<Review> = {}): Review => ({
  id: "review_1",
  cardId: "card_1",
  mode: "spelling",
  rating: 4,
  answer: "",
  diffJson: "[]",
  reviewedAt: TEST_NOW,
  ...patch
});

export const makeMistakeGeneration = (patch: Partial<MistakeGeneration> = {}): MistakeGeneration => ({
  id: "mistake_generation_1",
  dateKey: "2024-01-15",
  type: "story",
  cardIds: ["card_1"],
  title: "错词故事",
  content: "A short story with **approach**.",
  prompt: "Use the target words.",
  createdAt: TEST_NOW,
  ...patch
});
