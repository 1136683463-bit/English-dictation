/**
 * 边界验证用的数据构造工具（2026-09-21）
 *
 * 复习页 / 强化页都只从 AppData 读数据，而 AppData 由 AppProvider 在挂载时
 * 从 localStorage 的 "personal-vocab-app-data-v1" 读入（loadData → migrateData）。
 * 所以测试里直接写 localStorage 造数据，比走 UI 快得多，也更容易构造极端情况。
 *
 * 关键约束（读 storage.ts 得到）：
 * - migrateData 要求至少含一个已知顶层键（knownAppDataKeys），否则抛错；
 * - seedCoreWords 在 seededWordVersions 含 "core-100-v1" 时不再补 100 张核心词卡，
 *   所以造数据时务必写上该值，否则每个用例都会多出 100 张噪音卡；
 * - normalizeSchedules 只保留 cardId 存在于 cards 里的计划；
 * - nextReviewAt 必须是合法 ISO（validIsoOrNow 会把非法值改成 now）。
 */
import type { AppData, Card, Schedule, SentenceDetails, Settings } from "../../types";
import { APP_SCHEMA_VERSION, defaultSettings, parseBackupJson } from "../../services/storage";

export const STORAGE_KEY = "personal-vocab-app-data-v1";
export const TELEMETRY_KEY = "grammar-telemetry-events-v1";

/** 可靠的“已到期”时间：固定过去时间，永远 <= now。 */
export const PAST_ISO = "2024-01-01T00:00:00.000Z";
export const CREATED_ISO = "2024-01-01T00:00:00.000Z";

/**
 * 深可选补丁：允许只给 `settings` 的一部分（如只给 aiProvider）。
 *
 * 测试常常只关心某些嵌套字段（例如「导出时会不会带出 apiKey」只需要 aiProvider），
 * 强制补全整个 Settings 是噪音。类型上放宽一层，运行期仍然交给迁移管线补默认值。
 */
type DeepPartial<T> = T extends (infer U)[]
  ? U[]
  : // Record<...> 这类索引签名不做深可选——否则每个值都被放宽成 `| undefined`，
    // 与 AppData 的声明不兼容（如 grammarLessonStagesDone）
    T extends Record<string, unknown>
    ? T
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/**
 * 把「部分设置」合并到默认设置上，并保持完整类型。
 *
 * 三个嵌套层级各自合并（顶层标量 + aiProvider + dataSync）：
 * 只传 `{ aiProvider: { apiKey } }` 时，其余设置项保留默认值。
 * 末尾统一断言成 `Settings`——运行期一定是完整的（默认值兜底），
 * 但 TS 无法从「可选属性展开」推断出来，所以这里显式收口。
 */
const buildSettings = (patch: DeepPartial<Settings> | undefined): Settings =>
  ({
    ...defaultSettings,
    ...(patch as Record<string, unknown> | undefined),
    aiProvider: { ...defaultSettings.aiProvider, ...((patch?.aiProvider ?? {}) as Record<string, unknown>) },
    dataSync: { ...defaultSettings.dataSync, ...((patch?.dataSync ?? {}) as Record<string, unknown>) }
  }) as unknown as Settings;

export const makeAppData = (patch: DeepPartial<AppData> = {}): AppData => ({
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
  languageGates: [],
  gateAttempts: [],
  runeStates: [],
  // ⚠️ `...patch` 必须在 settings 之前：否则 patch 里的部分 settings 会覆盖掉
  // buildSettings 的深合并结果（只给 aiProvider 时其余设置项会变成 undefined）。
  ...patch,
  settings: buildSettings(patch.settings)
});

/**
 * 写 AppData 到 localStorage（挂载前调用）。
 * 返回**迁移后**的数据（走 parseBackupJson，与 loadData 同一条管线），
 * 这样测试侧规划出的会话/题目与页面内看到的完全一致
 * ——注意 normalizeSchedules 会给没有 schedule 的卡自动补一条"立即到期"的计划。
 */
export const seedAppData = (patch: Partial<AppData> = {}): AppData => {
  const raw = makeAppData(patch);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
  return parseBackupJson(JSON.stringify(raw));
};

export interface SentenceCardOptions {
  id: string;
  sentence: string;
  note?: string;
  sourceId?: string;
  status?: Card["status"];
  tags?: string[];
  /** 复习计划（不传则不建计划 —— 用于测「没有 schedule 的卡不该进队列」）。 */
  schedule?: Partial<Schedule> | null;
}

export interface SentenceCardFixture {
  card: Card;
  schedule?: Schedule;
  details?: SentenceDetails;
}

export const makeSentenceCard = (options: SentenceCardOptions): SentenceCardFixture => {
  const card: Card = {
    id: options.id,
    type: "sentence",
    front: options.sentence,
    back: "",
    note: options.note ?? "",
    sourceId: options.sourceId ?? "lesson:lesson-13-now",
    tags: options.tags ?? ["语法"],
    status: options.status ?? "review",
    priority: false,
    createdAt: CREATED_ISO,
    updatedAt: CREATED_ISO
  };
  const schedule =
    options.schedule === null
      ? undefined
      : {
          cardId: options.id,
          easeFactor: 2.5,
          intervalDays: 1,
          reviewCount: 0,
          lapseCount: 0,
          nextReviewAt: PAST_ISO,
          ...options.schedule
        };
  const details: SentenceDetails = {
    cardId: options.id,
    sentence: options.sentence,
    translation: "",
    keywords: [],
    grammarNote: "",
    audioUrl: ""
  };
  return { card, schedule, details };
};

/** 把一组卡 fixture 摊平成 AppData 的三个字段。 */
export const cardsToData = (fixtures: SentenceCardFixture[]) => ({
  cards: fixtures.map((item) => item.card),
  schedules: fixtures.map((item) => item.schedule).filter((item): item is Schedule => Boolean(item)),
  sentenceDetails: fixtures.map((item) => item.details).filter((item): item is SentenceDetails => Boolean(item))
});

/**
 * 页面上的链接文案（harness 只暴露 buttons()，但页面出口大多是 <Link>）。
 * 边界验证关注「有没有清晰出口」，必须同时看按钮与链接。
 */
export const linksOf = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll("a")).map((anchor) => (anchor.textContent ?? "").trim());

/** 页面上的所有可交互元素文案（按钮 + 链接）。 */
export const exitsOf = (container: HTMLElement): string[] => [
  ...Array.from(container.querySelectorAll("button")).map((button) => (button.textContent ?? "").trim()),
  ...linksOf(container)
];

/** 页面上的所有输入框 / 文本域。 */
export const inputsOf = (container: HTMLElement): Array<HTMLInputElement | HTMLTextAreaElement> =>
  Array.from(container.querySelectorAll("input, textarea")) as Array<HTMLInputElement | HTMLTextAreaElement>;

/** 在受控输入框里写入文本（React 受控组件需要手动派发 input 事件）。 */
export const typeInto = (field: HTMLInputElement | HTMLTextAreaElement, value: string): void => {
  const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  setter?.call(field, value);
  field.dispatchEvent(new Event("input", { bubbles: true }));
};

export const readAppData = (): AppData =>
  JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as AppData;

export const readTelemetry = (): Array<Record<string, unknown>> => {
  const raw = window.localStorage.getItem(TELEMETRY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as { events?: Array<Record<string, unknown>> };
    return Array.isArray(parsed.events) ? parsed.events : [];
  } catch {
    return [];
  }
};

export const telemetryOfKind = (kind: string): Array<Record<string, unknown>> =>
  readTelemetry().filter((event) => event.kind === kind);

/** 已学完的课（趁热练的准入条件：grammarLessonsDone 含该课）。 */
export const DONE_LESSON_ID = "lesson-13-now";
