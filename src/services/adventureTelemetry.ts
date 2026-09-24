import { nowIso } from "./storage";

/**
 * 冒险模块遥测（R4 数据基建，PRD-adventure-ux §6 R4）。
 *
 * 复用 grammarTelemetry 的纯本地模式：
 * - 独立 localStorage 键空间，不进入 AppData / 迁移 / 导出流程，旁路记录零侵入；
 * - 只追加（append-only），主键上限 3000 条，溢出事件滚入归档键长期留存；
 * - 环境无 localStorage（单测 / node）时退化为内存数组，接口不变；
 * - 零网络请求、零第三方 SDK。
 *
 * 事件清单见数析报告 metrics-framework-adventure §3（22 个）；
 * V2 事件（gate/rune）在语言之门落地前先定义好类型，M1 直接挂点即可。
 */

const TELEMETRY_KEY = "adventure-telemetry-events-v1";
const MAX_EVENTS = 3000;
const TELEMETRY_ARCHIVE_KEY = "adventure-telemetry-archive-v1";
const ARCHIVE_MAX_EVENTS = 12000;

export type AdventureSource = "offline" | "ai" | "custom";
export type AdventureCreateStage = "request" | "parse" | "save";
export type SessionEntrySource = "continue" | "card" | "deep-link";
export type SessionEndContext = "completed" | "choice" | "gate-error" | "idle";
export type CustomActionOutcome = "adopted" | "fallback";
export type GateVerdict = "pass" | "near" | "misread";
export type TtsVoiceType = "online" | "system";

/** 创建漏斗第 1 环：进入创建流程（提交开始冒险表单）。 */
export interface AdventureCreateStartedEvent {
  kind: "adventure_create_started";
  template: string;
  level: string;
  source: AdventureSource;
  ts: string;
}

/** 路线创建成功落库：创建漏斗分子、路线基数。 */
export interface AdventureCreatedEvent {
  kind: "adventure_created";
  adventureId: string;
  template: string;
  level: string;
  source: AdventureSource;
  hasCustomPrompt: boolean;
  nodeCount: number;
  durationMs: number;
  ts: string;
}

/** 创建失败（AI 超时/解析失败/保存失败）：AI 生成失败率护栏。 */
export interface AdventureCreateFailedEvent {
  kind: "adventure_create_failed";
  stage: AdventureCreateStage;
  errorType: string;
  durationMs: number;
  ts: string;
}

/** 删除路线确认后：删除率、删除时进度（后悔信号）。 */
export interface AdventureDeletedEvent {
  kind: "adventure_deleted";
  adventureId: string;
  nodeCount: number;
  completedNodeCount: number;
  ageDays: number;
  ts: string;
}

/** 点击「随机推荐」：推荐功能使用率分母。 */
export interface RecommendationRequestedEvent {
  kind: "recommendation_requested";
  ts: string;
}

/** 推荐卡返回：推荐成功率。 */
export interface RecommendationGeneratedEvent {
  kind: "recommendation_generated";
  count: number;
  durationMs: number;
  ts: string;
}

/** 推荐生成失败：AI 生成失败率护栏。 */
export interface RecommendationFailedEvent {
  kind: "recommendation_failed";
  errorType: string;
  ts: string;
}

/** 选中推荐卡创建：推荐采纳率。 */
export interface RecommendationSelectedEvent {
  kind: "recommendation_selected";
  themeId: string;
  position: number;
  ts: string;
}

/** 点击「恢复默认」：推荐质量反向信号。 */
export interface RecommendationRestoredDefaultEvent {
  kind: "recommendation_restored_default";
  ts: string;
}

/** 进入 /adventure/:id 阅读页：WQAS、会话时长、D1/D7 回访。 */
export interface AdventureSessionStartEvent {
  kind: "session_start";
  adventureId: string;
  sessionId: string;
  entrySource: SessionEntrySource;
  /** 该路线今日是否已有会话（重玩口径的分子）。 */
  isReplay: boolean;
  ts: string;
}

/** 离开阅读页/切后台：会话时长、错误后流失。 */
export interface AdventureSessionEndEvent {
  kind: "session_end";
  adventureId: string;
  sessionId: string;
  durationMs: number;
  nodesAdvanced: number;
  gatesAttempted: number;
  endContext: SessionEndContext;
  ts: string;
}

/** 章节节点展示：主动重玩率、阅读漏斗。 */
export interface AdventureNodeViewedEvent {
  kind: "node_viewed";
  adventureId: string;
  sessionId?: string;
  nodeId: string;
  chapter: number;
  isFirstView: boolean;
  ts: string;
}

/** 节点推进确认（选完选项生成下一章）：路线完成率。 */
export interface AdventureNodeCompletedEvent {
  kind: "node_completed";
  adventureId: string;
  sessionId?: string;
  nodeId: string;
  chapter: number;
  source: "offline" | "ai";
  ts: string;
}

/** 点击剧情选项：选项 vs 自定义占比、分支偏好。 */
export interface AdventureChoiceSelectedEvent {
  kind: "choice_selected";
  adventureId: string;
  sessionId?: string;
  nodeId: string;
  choiceId: string;
  choiceIndex: number;
  isCustom: boolean;
  ts: string;
}

/**
 * 提交自定义行动：自定义使用率。
 * outcome（R3 配套字段）：adopted=被 AI 采用续章；fallback=离线回退未被采用——
 * M1「自定义行动 vs 选项占比」指标与「静默丢弃」回归监控都靠它。
 */
export interface CustomActionSubmittedEvent {
  kind: "custom_action_submitted";
  adventureId: string;
  sessionId?: string;
  nodeId: string;
  textLength: number;
  outcome: CustomActionOutcome;
  ts: string;
}

/** 生词加入冒险积累词书：收词率、学习产出。 */
export interface VocabCollectedEvent {
  kind: "vocab_collected";
  adventureId: string;
  sessionId?: string;
  nodeId: string;
  word: string;
  cardId: string;
  ts: string;
}

/** V2：语言之门出现。 */
export interface GateShownEvent {
  kind: "gate_shown";
  adventureId?: string;
  sessionId?: string;
  gateId: string;
  runeId: string;
  targetPattern: string;
  ts: string;
}

/** V2：提交答案获判定——三档分布、重试率、尝试次数、错误后流失的核心事件。 */
export interface GateSubmittedEvent {
  kind: "gate_submitted";
  adventureId?: string;
  sessionId?: string;
  gateId: string;
  verdict: GateVerdict;
  attemptIndex: number;
  errorTags: string[];
  latencyMs: number;
  hintLevel: number;
  ts: string;
}

/** V2：请求提示——提示够不够（尝试次数过高时归因）。 */
export interface GateHintUsedEvent {
  kind: "gate_hint_used";
  gateId: string;
  hintLevel: number;
  ts: string;
}

/** V2：未 pass 离开该门——挫败信号（连续未 pass 由本事件聚合）。 */
export interface GateAbandonedEvent {
  kind: "gate_abandoned";
  gateId: string;
  attempts: number;
  lastVerdict: GateVerdict;
  /** 离开时所处阶段（站台关卡页 v1 新增）：story/gate/settle 流失归因。 */
  phase?: "story" | "gate" | "settle";
  ts: string;
}

/** V2：剧情阶段展示（站台关卡页 v1，PRD FR-6）——story 阶段停留时长的分子。 */
export interface GateStoryShownEvent {
  kind: "gate_story_shown";
  adventureId?: string;
  sessionId?: string;
  gateId: string;
  ts: string;
}

/** V2：剧情阶段离开（story→gate 切换）——dwellMs 即 story 停留时长。 */
export interface GateStoryLeftEvent {
  kind: "gate_story_left";
  adventureId?: string;
  sessionId?: string;
  gateId: string;
  dwellMs: number;
  ts: string;
}

/** V2：剧情页折叠提示卡展开（PRD R10，P2）——观测 scaffold 强度（打开率高+停留骤降=提示卡在给答案）。 */
export interface StoryTipOpenedEvent {
  kind: "story_tip_opened";
  adventureId?: string;
  sessionId?: string;
  gateId: string;
  ts: string;
}

/** V2：符文解锁/升级——符文收集进度、解锁间隔。 */
export interface RuneUnlockedEvent {
  kind: "rune_unlocked";
  runeId: string;
  level: number;
  worldId: string;
  ts: string;
}

/** TTS 播放成功：发音链路健康度。 */
export interface TtsPlayedEvent {
  kind: "tts_played";
  adventureId?: string;
  nodeId?: string;
  /** 关卡页 v1：区分播放来源（gateId 维度观测 TTS 触达率）。 */
  gateId?: string;
  /** 播放时所处阶段。 */
  phase?: "story" | "gate" | "settle";
  voiceType: TtsVoiceType;
  ts: string;
}

/** TTS 播放失败：TTS 失败率护栏（已知发音链路风险）。 */
export interface TtsFailedEvent {
  kind: "tts_failed";
  adventureId?: string;
  nodeId?: string;
  voiceType: TtsVoiceType;
  ts: string;
}

/** 结算页提交主观一句话：主观反馈、填报率。 */
export interface FeedbackSubmittedEvent {
  kind: "feedback_submitted";
  adventureId?: string;
  nodeId: string;
  textLength: number;
  ts: string;
}

export type AdventureTelemetryEvent =
  | AdventureCreateStartedEvent
  | AdventureCreatedEvent
  | AdventureCreateFailedEvent
  | AdventureDeletedEvent
  | RecommendationRequestedEvent
  | RecommendationGeneratedEvent
  | RecommendationFailedEvent
  | RecommendationSelectedEvent
  | RecommendationRestoredDefaultEvent
  | AdventureSessionStartEvent
  | AdventureSessionEndEvent
  | AdventureNodeViewedEvent
  | AdventureNodeCompletedEvent
  | AdventureChoiceSelectedEvent
  | CustomActionSubmittedEvent
  | VocabCollectedEvent
  | GateShownEvent
  | GateSubmittedEvent
  | GateHintUsedEvent
  | GateAbandonedEvent
  | GateStoryShownEvent
  | GateStoryLeftEvent
  | StoryTipOpenedEvent
  | RuneUnlockedEvent
  | TtsPlayedEvent
  | TtsFailedEvent
  | FeedbackSubmittedEvent;

const memoryEvents: AdventureTelemetryEvent[] = [];

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readEvents = (): AdventureTelemetryEvent[] => {
  if (!hasLocalStorage()) return memoryEvents;
  try {
    const raw = window.localStorage.getItem(TELEMETRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events?: unknown };
    return Array.isArray(parsed.events) ? (parsed.events as AdventureTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

const writeEvents = (events: AdventureTelemetryEvent[]) => {
  if (!hasLocalStorage()) {
    memoryEvents.length = 0;
    memoryEvents.push(...events);
    return;
  }
  try {
    window.localStorage.setItem(TELEMETRY_KEY, JSON.stringify({ version: 1, events }));
  } catch {
    // 存储满 / 隐私模式：遥测失败静默，绝不影响学习主流程。
  }
};

const readArchivedEvents = (): AdventureTelemetryEvent[] => {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(TELEMETRY_ARCHIVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events?: unknown };
    return Array.isArray(parsed.events) ? (parsed.events as AdventureTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

/** 把被挤出的旧事件追加进归档键（归档自身也有上限，滚动丢弃最旧，防止存储无限增长）。 */
const archiveEvents = (overflow: AdventureTelemetryEvent[]): void => {
  if (overflow.length === 0) return;
  if (!hasLocalStorage()) return;
  try {
    const archived = [...readArchivedEvents(), ...overflow];
    const kept = archived.length > ARCHIVE_MAX_EVENTS ? archived.slice(archived.length - ARCHIVE_MAX_EVENTS) : archived;
    window.localStorage.setItem(TELEMETRY_ARCHIVE_KEY, JSON.stringify({ version: 1, events: kept }));
  } catch {
    // 归档失败静默，不影响主流程。
  }
};

let eventSeq = 0;

/** 事件公共 ID：时间戳 + 自增序号，导出复盘时还原时序用。 */
export const nextAdventureEventId = (): string => {
  eventSeq += 1;
  return `adv-${Date.now()}-${eventSeq}`;
};

/** 追加一条遥测事件（超出主键上限时，最旧的事件移入归档键，不丢数据）。 */
export const appendAdventureEvent = (event: AdventureTelemetryEvent): void => {
  const events = readEvents();
  events.push(event);
  if (events.length > MAX_EVENTS) {
    const overflow = events.slice(0, events.length - MAX_EVENTS);
    const kept = events.slice(events.length - MAX_EVENTS);
    archiveEvents(overflow);
    writeEvents(kept);
    return;
  }
  writeEvents(events);
};

export const listAdventureEvents = (): AdventureTelemetryEvent[] => [...readEvents()];

export const listAdventureEventsByKind = <K extends AdventureTelemetryEvent["kind"]>(
  kind: K
): Extract<AdventureTelemetryEvent, { kind: K }>[] =>
  listAdventureEvents().filter((event): event is Extract<AdventureTelemetryEvent, { kind: K }> => event.kind === kind);

export const clearAdventureTelemetry = (): void => {
  if (!hasLocalStorage()) {
    memoryEvents.length = 0;
    return;
  }
  try {
    window.localStorage.removeItem(TELEMETRY_KEY);
    window.localStorage.removeItem(TELEMETRY_ARCHIVE_KEY);
  } catch {
    // 忽略
  }
};

/** 遥测存量统计：为上限策略提供依据（复用 grammarTelemetry 的 stats 模式）。 */
export interface AdventureTelemetryStats {
  /** 主键存量（不含归档）。 */
  activeEvents: number;
  maxEvents: number;
  archivedEvents: number;
  archiveMax: number;
  /** 主键 + 归档合计（分析可见总量）。 */
  totalEvents: number;
  /** 当前主键是否已接近上限（≥80%），提示先导出归档。 */
  nearCapacity: boolean;
}

export const getAdventureTelemetryStats = (): AdventureTelemetryStats => {
  const activeEvents = listAdventureEvents().length;
  const archivedEvents = readArchivedEvents().length;
  return {
    activeEvents,
    maxEvents: MAX_EVENTS,
    archivedEvents,
    archiveMax: ARCHIVE_MAX_EVENTS,
    totalEvents: activeEvents + archivedEvents,
    nearCapacity: activeEvents >= MAX_EVENTS * 0.8
  };
};

/** 导出快照（JSON 字符串，含归档）——每周末人工复盘的现实做法（无后端）。 */
export const buildAdventureTelemetryExport = (): string => {
  const events = listAdventureEvents();
  const archived = readArchivedEvents();
  const lastEventAt = events.length > 0 ? events[events.length - 1].ts : null;
  return JSON.stringify(
    {
      version: 1,
      exportedAt: nowIso(),
      stats: { ...getAdventureTelemetryStats(), lastEventAt },
      events,
      archivedEvents: archived
    },
    null,
    2
  );
};
