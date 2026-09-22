import type { GrammarErrorTag } from "../types";
import type { HuntVerdictKind } from "./huntService";
import { nowIso } from "./storage";

/**
 * 语法模块遥测（R01 数据基建）。
 *
 * 设计要点（见 PRD-grammar-mastery §6 R01）：
 * - 独立 localStorage 键空间，不进入 AppData / 迁移 / 导出流程，旁路记录零侵入；
 * - 只追加（append-only），上限 3000 条，超出丢弃最旧的；
 * - 环境无 localStorage（单测 / node）时退化为内存数组，接口不变。
 */

const TELEMETRY_KEY = "grammar-telemetry-events-v1";
const MAX_EVENTS = 3000;

/** 主键事件上限（导出供性能测试构造「满仓」场景，避免测试里硬编码 3000）。 */
export const MAX_TELEMETRY_EVENTS_FOR_TEST = MAX_EVENTS;
/** R16：溢出归档键——主键写满后，被挤出的旧事件挪到这里长期留存（导出复盘用）。 */
const TELEMETRY_ARCHIVE_KEY = "grammar-telemetry-archive-v1";
const ARCHIVE_MAX_EVENTS = 12000;

export type LessonSection =
  | "watch"
  | "pretest"
  | "guided"
  | "recall"
  | "practice"
  | "output"
  | "challenge";

/** 进课事件（R21）：漏斗的起点——没有它无法计算「进入 → 完课」流失。每次进入课程记一条。 */
export interface GrammarLessonStartedEvent {
  kind: "grammar_lesson_started";
  lessonId: string;
  ts: string;
}

/** F1 关 2 回访关进入事件（F4 口径）：次日回访率的核心分子。hoursSinceStage1 衡量回访时效性。 */
export interface GrammarRevisitStartedEvent {
  kind: "grammar_revisit_started";
  lessonId: string;
  /** 距关 1 完成的小时数（严格次日窗 20–28h 为有效回访）。 */
  hoursSinceStage1: number;
  ts: string;
}

/** F1 关 2 回访关完成事件（F4 口径）：G1 提取摩擦指标——一次通过率目标 50–70%。 */
export interface GrammarRevisitCompletedEvent {
  kind: "grammar_revisit_completed";
  lessonId: string;
  /** 一次提取成功题数（无提示凭记忆即对）。 */
  firstTryCount: number;
  totalCount: number;
  /** 回马枪题一次是否通过（无回马枪时为 null）。 */
  ambushFirstTry: boolean | null;
  durationMs: number;
  ts: string;
}

/** can-do 能力里程碑确证（R23）：完整感收口的记录，验收「确证仪式」被使用。 */
export interface CanDoConfirmedEvent {
  kind: "can_do_confirmed";
  milestoneId: string;
  ts: string;
}

/** 完课事件：北极星与漏斗的分子来源。 */
export interface GrammarLessonCompletedEvent {
  kind: "grammar_lesson_completed";
  lessonId: string;
  completedAt: string;
  /** 本次学习中，引导题是否全部一次通过（spot 热身题不计入）。 */
  guidedFirstTry: boolean;
  /** 本次学习中，练习题是否全部一次通过。 */
  practiceFirstTry: boolean;
  durationMs: number;
}

/** 单步判题结果：练习/引导的通过率与重试深度。 */
export interface LessonStepResultEvent {
  kind: "lesson_step_result";
  lessonId: string;
  section: LessonSection;
  stepKind: string;
  stepIndex: number;
  /** 到通过为止的判题次数（首次通过 = 1）。 */
  attempts: number;
  passed: boolean;
  /**
   * 产出句的归一化文本哈希（仅 output/recall 段填写）。
   * 北极星「周有效输出句数」按句去重需要句面标识——此前用 lessonId+stepIndex+时间戳（分钟）近似，
   * 同一句隔天重练会被重复计数。写入侧带上哈希后，去重键优先用它。
   */
  sentenceHash?: string;
  /**
   * 本题耗时（毫秒，2026-09-20 阶段三新增）。
   * 此前只有段级 section_dwell，看不到「同一段内哪一题卡了」——
   * 而「practice 单题 2.3–4.6 秒」这个关键摩擦指标正需要它。
   * 旧事件不含此字段，读侧按可选处理。
   */
  stepDwellMs?: number;
  ts: string;
}

/** 深挖折叠卡展开事件：衡量「讲透」内容被消化的程度。 */
export interface DeepDiveExpandedEvent {
  kind: "deep_dive_expanded";
  lessonId: string;
  ts: string;
}

/**
 * R-AI0 埋点补齐（2026-09-19「问一句」PRD）——「理解吸收」此前完全不可观测。
 *
 * 现状缺陷（数析盘点）：判题事件齐备（做对/做错可见），但「用户是否理解了」零信号——
 * 深挖卡只有「折叠后再展开」事件（默认展开时新用户永不触发），
 * 四处「回去再看一遍讲解」零埋点，练习「照着拼一遍」被记成假通过。
 */

/** 深挖卡曝光：进入视野即记（含默认展开态——修复旧事件在默认展开下恒为空的结构性失真）。 */
export interface DeepDiveImpressionEvent {
  kind: "deep_dive_impression";
  lessonId: string;
  /** default_open = 默认展开被动看到；user_open = 用户从折叠态手动展开（更强的主动动机）。 */
  mode: "default_open" | "user_open";
  ts: string;
}

/** 深挖卡停留：离开该卡时结算——dwell ≥20s 是「真的在读」的口径（S4 配对分母）。 */
export interface DeepDiveDwellEvent {
  kind: "deep_dive_dwell";
  lessonId: string;
  dwellMs: number;
  /** 深挖卡段落数（素材厚度，用于分层）。 */
  paragraphs: number;
  ts: string;
}

/** 「回去再看一遍讲解」点击：最直接的「没懂→回看」信号（四处入口此前零埋点）。 */
export interface LessonRereadEvent {
  kind: "lesson_reread";
  lessonId: string;
  /** 从哪个段发起回看。 */
  fromSection: LessonSection;
  /** 回到哪个段（当前全部是 watch）。 */
  toSection: LessonSection;
  ts: string;
}

/** 练习「照着拼一遍」：此前被记成 passed=true 的假通过（放弃与做对在通过率里同形）。 */
export interface PracticeRevealUsedEvent {
  kind: "practice_reveal_used";
  lessonId: string;
  stepIndex: number;
  /** 揭示前尝试过几次。 */
  attemptsBeforeReveal: number;
  ts: string;
}

// ── 「问一句」追问式讲解（2026-09-19 PRD R-AI7）────────────────────

/** 追问发起：触发率的分子入口（含预设/自由与配额状态）。 */
export interface AiExplainRequestedEvent {
  kind: "ai_explain_requested";
  lessonId: string;
  section: string;
  /** 锚点（如 watch.deepDive）。 */
  anchorRef: string;
  trigger: "preset" | "free";
  questionChars: number;
  /** 发起前已用掉几次（配额 ≤2）。 */
  quotaUsed: number;
  ts: string;
}

/** 追问结果：降级率 / 弃权率 / 校验丢弃原因 / 延迟的来源。 */
export interface AiExplainResultEvent {
  kind: "ai_explain_result";
  lessonId: string;
  section: string;
  anchorRef: string;
  /** 使用的模型（换模型决策的唯一依据；此前 explain 线无此维度）。 */
  model?: string;
  ok: boolean;
  latencyMs: number;
  degraded: boolean;
  degradeReason: "not_configured" | "timeout" | "error" | "invalid" | null;
  cached: boolean;
  /** 校验失败的具体原因（invalid 时）。 */
  validationFailure?: string;
  /** 弃权（素材不足——设计成功，不是失败）。 */
  declined?: boolean;
  outputChars?: number;
  ts: string;
}

/** 追问反馈（回答卡三按钮）——「学习者觉得有用」是本功能的核心验收口径。 */
export interface AiExplainFeedbackEvent {
  kind: "ai_explain_feedback";
  lessonId: string;
  section: string;
  anchorRef: string;
  verdict: "helpful" | "unclear" | "wrong";
  ts: string;
}

/** 产出提示阶梯：第几档提示 / 最终靠什么解决——「卡在哪一层」的唯一信号。 */
// ── 「为什么错了」答错现场错因追问（2026-09-19 PRD R-WW4）──────────────
// 独立 kind：混入 ai_explain_* 会让本地命中也被记成 AI 调用，污染 AI 延迟/降级率口径。

/** 错因追问发起（本地匹配同步完成，故 requested 与 result 常同刻）。 */
export interface PracticeWhyWrongRequestedEvent {
  kind: "practice_why_wrong_requested";
  lessonId: string;
  stepIndex: number;
  section: string;
  /** 错句指纹（hashGrammarSentence，不记原文）。 */
  sentenceHash: string;
  /** 命中来源：local_exact / local_fuzzy / ai / fallback。 */
  matchSource: string;
  /** 近似命中时的相似度。 */
  diffScoreAtMatch?: number;
  /** 发起时本步配额状态。 */
  quotaState: "available" | "exhausted";
  ts: string;
}

/** 错因追问结果：AI 层异步返回时补记（本地层与 requested 同刻）。 */
export interface PracticeWhyWrongResultEvent {
  kind: "practice_why_wrong_result";
  lessonId: string;
  stepIndex: number;
  sentenceHash: string;
  ok: boolean;
  source: string;
  /** A5b 归因层：local_exact / local_fuzzy / structural / ai / fallback。
   *  本地结构兜底对错法覆盖 100%，「AI 有没有比本地多给东西」必须能按层回答。 */
  layer?: "local_exact" | "local_fuzzy" | "structural" | "ai" | "fallback";
  /** 使用模型（AI 层）。 */
  model?: string;
  latencyMs: number;
  cached: boolean;
  declined?: boolean;
  validationFailure?: string;
  citedRef?: string;
  /** AI 归因到的罪名（可选，11 类之一）——弱点档案「同 tag 被问 ≥3 次」的分子。 */
  errorTag?: string;
  ts: string;
}

/** 错因解释反馈：「讲错了」份额 = 误匹配率的核心度量。 */
export interface PracticeWhyWrongFeedbackEvent {
  kind: "practice_why_wrong_feedback";
  lessonId: string;
  stepIndex: number;
  verdict: "helpful" | "unclear" | "wrong";
  ts: string;
}

/** C4（M3）复盘课完成：从 Top3 弱点拼出的即时提取练习。 */
export interface GrammarReplayCompletedEvent {
  kind: "grammar_replay_completed";
  itemCount: number;
  firstTryCount: number;
  tags: string[];
  durationMs: number;
  /** 按罪名拆分的表现（用于弱点闭环：一次通过=练得不错，多次才过=还需巩固）。 */
  perTag?: Array<{ tag: string; total: number; firstTry: number }>;
  ts: string;
}

export interface OutputHintStepEvent {
  kind: "output_hint_step";
  lessonId: string;
  stepIndex: number;
  /** 提示档位：1 词数+首字母 / 2 首字母序列 / 3 骨架句。 */
  level: 1 | 2 | 3;
  /** 最终怎么解决的：self 自己写出来 / hint 靠提示通过 / reveal 看答案。 */
  resolvedBy: "self" | "hint" | "reveal";
  ts: string;
}

/** 侦探找错一次裁决记录：误报率（notError 占比）与罪名命中率的来源。 */
export interface HuntVerdictEvent {
  kind: "hunt_verdict";
  caseId: string;
  tokenIndex: number;
  verdictKind: HuntVerdictKind;
  guessedTag: GrammarErrorTag | null;
  ts: string;
}

/** 日记批改问题的语法点归因：自由输出 → 错因统计的桥。 */
export interface DiaryIssueTagEvent {
  kind: "diary_issue_tag";
  entryId: string;
  issueIndex: number;
  tag: GrammarErrorTag;
  ts: string;
}

/** 语法复习卡一次结算（R03）：错误复发率与复习通过率的来源。sourceId 用于弱点归因（diary: 来源可回溯罪名）。 */
export interface GrammarReviewResultEvent {
  kind: "grammar_review_result";
  cardId: string;
  /** R09 Step2 起含 free_type（自由输出轮）。 */
  mode: "cloze" | "rebuild" | "free_type";
  attempts: number;
  passed: boolean;
  sourceId?: string;
  ts: string;
}

/** 侦探案件结算事件（R19）：破案率与单案耗时的来源——此前只有逐次 verdict，破案率无法计算。 */
export interface HuntCaseSettledEvent {
  kind: "hunt_case_settled";
  caseId: string;
  found: number;
  total: number;
  misses: number;
  stars: number;
  durationMs: number;
  /** 是否破案（找齐全部错误）。 */
  solved: boolean;
  ts: string;
}

/** 找错案件使用一次提示：衡量「卡壳点」，未来可用于内容难度校准。 */
export interface HuntHintUsedEvent {
  kind: "hunt_hint_used";
  caseId: string;
  tag: GrammarErrorTag;
  tokenIndex: number;
  ts: string;
}

/** 段级停留事件（R20）：六段预算核验（PRD §7）的来源——进入下一段时结算上一段的停留时长。 */
export interface SectionDwellEvent {
  kind: "section_dwell";
  lessonId: string;
  section: LessonSection;
  dwellMs: number;
  ts: string;
}

/** 进入语法路径页事件（R05）：核心漏斗第一环——此前「进入语法页 → 进首课」的流失完全不可测。 */
export interface GrammarPathViewedEvent {
  kind: "grammar_path_viewed";
  /** 进入时的课程完成数（分态依据：0 = 首访态，>0 = 继续态）。 */
  lessonsDone: number;
  ts: string;
}

/** 复习卡首次跃迁到 mastered（R06）：「我学会了」的正向确证——此前只有单次复习结果，没有状态跃迁。 */
export interface CardMasteredEvent {
  kind: "card_mastered";
  cardId: string;
  /** 卡片来源（lesson:xxx / hunt:xxx / diary:xxx），弱点归因用。 */
  sourceId?: string;
  /** hunt 来源卡的罪名（从 grammarNote [tag:原错词] token 解析），其他来源为 null。 */
  tag: GrammarErrorTag | null;
  ts: string;
}

/**
 * F3 回马枪题结果（2026-09-13 PRD）：关 2/关 3 头部 1–2 题弱点加权旧点变式。
 * weakSpotTag 非空 = 命中弱点档案的题；null = 无弱点时的降级（最近 3 课随机旧点）。
 */
export interface GrammarAmbushResultEvent {
  kind: "grammar_ambush_result";
  /** 宿主关卡（lessonId#stageIndex，如 lesson-13#2）。 */
  hostId: string;
  /** 被回顾的旧课（huntCase 来源课）。 */
  sourceLessonId: string;
  /** 命中的弱点罪名（降级随机时为 null）。 */
  weakSpotTag: GrammarErrorTag | null;
  /** 被抽中的植错点所在案件。 */
  caseId: string;
  passed: boolean;
  attempts: number;
  ts: string;
}

/** 关 3 重审关进入事件（W0 补齐）：此前关 3 只有完成态、没有进入事件——到达率不可算。 */
export interface GrammarReauditStartedEvent {
  kind: "grammar_reaudit_started";
  lessonId: string;
  ts: string;
}

// ── 「趁热练」课后强化训练（2026-09-18 PRD R-B7）────────────────────────
// 口径：仅可选层，全部事件带 lessonId + tier 以支撑分层漏斗与「强化 vs 非强化」配对分析。

/** 强化入口曝光：参与率的分母（按 lessonId + entryPoint 去重，防止渲染次数污染）。 */
export interface GrammarBoostOfferedEvent {
  kind: "grammar_boost_offered";
  lessonId: string;
  /** R-UX4/W2：新增 "lesson"（正课页内入口），三入口转化可归因。 */
  entryPoint: "settlement" | "card" | "reaudit" | "lesson";
  /** 建议档位（结算页推第 1 档；卡片按未完成档位推）。 */
  recommendedTier: 1 | 2 | 3;
  ts: string;
}

/** 进入某一档：参与率的分子。 */
export interface GrammarBoostStartedEvent {
  kind: "grammar_boost_started";
  lessonId: string;
  tier: 1 | 2 | 3;
  questionCount: number;
  /**
   * 入口来源。`"lesson"` = 课内入口 `?from=lesson`（2026-09-21 补：
   * 类型里早就有这个值，但页面没有对应分支，课内入口一直被记成 direct，
   * 导致 startedByEntry.lesson 结构上恒为 0、该入口的转化率无法归因）。
   */
  entryPoint: "settlement" | "card" | "reaudit" | "lesson" | "direct";
  ts: string;
}

/** 单题结果：难度落位（一次通过率）与素材重复率的原料。 */
export interface GrammarBoostStepResultEvent {
  kind: "grammar_boost_step_result";
  lessonId: string;
  tier: 1 | 2 | 3;
  itemKind: "derived" | "ai";
  /** 题目来源引用（lesson:<id>:<field>:<index>），复练换池与重复率统计用。 */
  sourceRef: string;
  /** 到通过为止的判题次数（首次通过 = 1）。 */
  attempts: number;
  passed: boolean;
  ts: string;
}

/** 单档中途退出：唯一能算放弃率的事件（现全库缺失）。 */
export interface GrammarBoostAbandonedEvent {
  kind: "grammar_boost_abandoned";
  lessonId: string;
  tier: 1 | 2 | 3;
  answered: number;
  total: number;
  dwellMs: number;
  ts: string;
}

/** 单档完成：与 grammar_revisit_completed 同构，支撑强化 vs 关 2 的配对比较。 */
export interface GrammarBoostCompletedEvent {
  kind: "grammar_boost_completed";
  lessonId: string;
  tier: 1 | 2 | 3;
  total: number;
  firstTryCount: number;
  durationMs: number;
  aiUsed: boolean;
  /** 距关 1 完成的小时数——20h 冷却窗内的强化会天然拉高关 2 表现，配对分析需排除该干扰。 */
  hoursSinceStage1: number | null;
  ts: string;
}

/** AI 批改/生成一次调用结果：降级率、延迟与缓存命中的来源。 */
export interface GrammarBoostAiResultEvent {
  kind: "grammar_boost_ai_result";
  lessonId: string;
  tier: 1 | 2 | 3;
  /** 0 = 单档收尾的批改调用；>0 = 变式题生成（第 N 题）。 */
  questionIndex: number;
  ok: boolean;
  latencyMs: number;
  degraded: boolean;
  degradeReason: "not_configured" | "timeout" | "error" | "invalid" | null;
  /**
   * 是否命中缓存（命中时 latencyMs 为 0）。
   * 此前该值已算出但没落事件——缓存命中率不可读，也就无法判断
   * "用户到底等了多少次真实请求"（延迟才是 AI 的瓶颈，不是成本）。
   */
  cached?: boolean;
  /** 调用时刻的模型名，用于按模型对比延迟/降级率。 */
  model?: string;
  ts: string;
}

/**
 * 日记批改一次调用结果（2026-09-19 补）。
 *
 * 此前日记批改零埋点：失败只写进 entry.note，成功只在有 tag 时记 diary_issue_tag。
 * 结果是「每句串行 3–8s」的实际延迟、失败率、要不要改批量策略，全都无据可依。
 */
export interface DiaryCorrectionResultEvent {
  kind: "diary_correction_result";
  entryId: string;
  ok: boolean;
  latencyMs: number;
  /** 批改指出的问题数（成功时有意义）。 */
  issueCount: number;
  /** 命中的问题里有几处带罪名归因。 */
  taggedIssueCount: number;
  /** 失败原因（成功时为 null）。 */
  errorKind: "not_configured" | "timeout" | "error" | "invalid" | null;
  /** 批改强度档位（用户设置）。 */
  style: "gentle" | "standard" | "strict";
  ts: string;
}

/** 命中近 7 天已练句：素材重复率的先行信号。 */
export interface GrammarBoostItemRepeatEvent {
  kind: "grammar_boost_item_repeat";
  lessonId: string;
  sourceRef: string;
  seenCount7d: number;
  ts: string;
}

// ── R-UX 观测补全（2026-09-19 路线图 W1-W5）────────────────────────

/** R-UX2/W3：课中途退出点——正课漏斗最大盲区（此前只能用最后一条 step_result 近似）。 */
export interface LessonExitEvent {
  kind: "lesson_exit";
  lessonId: string;
  /** 退出时所在段。 */
  section: LessonSection;
  /** 段内步序号（讲解为 watchStep；练习段为 practiceIndex 等）。 */
  stepIndex: number;
  /** 本课累计停留毫秒。 */
  dwellMs: number;
  ts: string;
}

/** W1：课小结 AI 结果——5 个 AI 落点里此前唯一零观测的一个（完课自动触发）。 */
export interface LessonSummaryAiResultEvent {
  kind: "lesson_summary_ai_result";
  lessonId: string;
  ok: boolean;
  latencyMs: number;
  cached: boolean;
  /** 失败/降级原因（成功时省略）。 */
  degradeReason?: "not_configured" | "timeout" | "error" | "invalid";
  ts: string;
}

/** W5：日记写入行为——日记模块此前完全无使用漏斗。 */
export interface DiaryWriteEvent {
  kind: "diary_write";
  /** 问题 id（题库 84 问的稳定引用）。 */
  questionId: string;
  /** 写入字符数。 */
  chars: number;
  /** 是否批改完成后的重写（R11 recast 跟进）。 */
  isRewrite: boolean;
  ts: string;
}

/** W2：句子入复习队列——「趁热练/日记 → 复习」增长链此前不可归因。 */
export interface SentenceCardEnqueuedEvent {
  kind: "sentence_card_enqueued";
  lessonId: string;
  /** 入队来源（趁热练产出 / 正课答错 / 日记批改 / 手动）。 */
  source: "boost" | "lesson_mistake" | "diary" | "manual";
  sentence: string;
  ts: string;
}

/** W4（R-UX5）：开口跟读三档自评——「说」段 TTS 跟读块的采用与自评分布。 */
export interface SayAloudEventEvent {
  kind: "say_aloud_event";
  lessonId: string;
  /** 「说」段步序（0 = 半提示步，1 = 无提示步）。 */
  step: number;
  action: "played" | "smooth" | "halting" | "replay" | "skipped";
  ts: string;
}

export type GrammarTelemetryEvent =
  | GrammarLessonStartedEvent
  | GrammarLessonCompletedEvent
  | CanDoConfirmedEvent
  | LessonStepResultEvent
  | DeepDiveExpandedEvent
  | HuntVerdictEvent
  | HuntCaseSettledEvent
  | DiaryIssueTagEvent
  | GrammarReviewResultEvent
  | HuntHintUsedEvent
  | SectionDwellEvent
  | GrammarPathViewedEvent
  | CardMasteredEvent
  | GrammarAmbushResultEvent
  | GrammarRevisitStartedEvent
  | GrammarRevisitCompletedEvent
  | GrammarReauditStartedEvent
  | GrammarBoostOfferedEvent
  | GrammarBoostStartedEvent
  | GrammarBoostStepResultEvent
  | GrammarBoostAbandonedEvent
  | GrammarBoostCompletedEvent
  | GrammarBoostAiResultEvent
  | GrammarBoostItemRepeatEvent
  | DiaryCorrectionResultEvent
  | DeepDiveImpressionEvent
  | DeepDiveDwellEvent
  | LessonRereadEvent
  | PracticeRevealUsedEvent
  | OutputHintStepEvent
  | AiExplainRequestedEvent
  | AiExplainResultEvent
  | AiExplainFeedbackEvent
  | PracticeWhyWrongRequestedEvent
  | PracticeWhyWrongResultEvent
  | PracticeWhyWrongFeedbackEvent
  | GrammarReplayCompletedEvent
  | LessonExitEvent
  | LessonSummaryAiResultEvent
  | DiaryWriteEvent
  | SentenceCardEnqueuedEvent
  | SayAloudEventEvent;

const memoryEvents: GrammarTelemetryEvent[] = [];

/**
 * 主键事件的内存缓存（2026-09-22 加，修 P1 性能）。
 *
 * 背景：`appendGrammarEvent` 曾是「读全部 → push → 写全部」——每次追加都要
 * `JSON.parse` + `JSON.stringify` 整个 3000 条 / 450KB 的数组。
 * 实测满仓时单条追加 1.5ms，而每答一题至少记一条事件，
 * 一节课下来是几百毫秒的同步阻塞（都在主线程上）。
 *
 * 缓存策略：内存里保留一份「主键当前内容」的权威副本，
 * 追加时只改内存并写回（仍需一次 stringify，但省掉 parse 与数组重建），
 * 读取时直接命中内存。
 *
 * 失效与一致性：
 *   - 任何写操作后缓存与存储同步；
 *   - 其他代码直接改 storage（测试、导入恢复、迁移）时，
 *     通过比对原始字符串判断缓存是否过期（`cachedRaw`）。
 * 判据用原始字符串而非长度/版本号，因为任何一次外部写入都会改变它。
 */
let cachedEvents: GrammarTelemetryEvent[] | null = null;
let cachedRaw: string | null = null;

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readEvents = (): GrammarTelemetryEvent[] => {
  if (!hasLocalStorage()) return memoryEvents;
  try {
    const raw = window.localStorage.getItem(TELEMETRY_KEY);
    if (!raw) {
      cachedEvents = null;
      cachedRaw = null;
      return [];
    }
    // 命中缓存：外部没有改过存储（原始字符串一致）就直接返回内存副本
    if (cachedEvents && cachedRaw === raw) return cachedEvents;
    const parsed = JSON.parse(raw) as { events?: unknown };
    const events = Array.isArray(parsed.events) ? (parsed.events as GrammarTelemetryEvent[]) : [];
    cachedEvents = events;
    cachedRaw = raw;
    return events;
  } catch {
    return [];
  }
};

const writeEvents = (events: GrammarTelemetryEvent[]) => {
  if (!hasLocalStorage()) {
    memoryEvents.length = 0;
    memoryEvents.push(...events);
    cachedEvents = memoryEvents;
    cachedRaw = null;
    return;
  }
  const raw = JSON.stringify({ version: 1, events });
  try {
    window.localStorage.setItem(TELEMETRY_KEY, raw);
    // 写成功后缓存与存储一致
    cachedEvents = events;
    cachedRaw = raw;
  } catch {
    // 存储满 / 隐私模式：遥测失败静默，绝不影响学习主流程。
    // 缓存不更新——避免「内存说有、磁盘没有」的错觉。
  }
};

/** 读取归档事件（R16）：主键溢出后长期留存的历史。 */
const readArchivedEvents = (): GrammarTelemetryEvent[] => {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(TELEMETRY_ARCHIVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events?: unknown };
    return Array.isArray(parsed.events) ? (parsed.events as GrammarTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

/** 把被挤出的旧事件追加进归档键（归档自身也有上限，滚动丢弃最旧，防止存储无限增长）。 */
const archiveEvents = (overflow: GrammarTelemetryEvent[]): void => {
  if (overflow.length === 0) return;
  if (!hasLocalStorage()) return;
  try {
    const archived = [...readArchivedEvents(), ...overflow];
    const kept = archived.length > ARCHIVE_MAX_EVENTS ? archived.slice(archived.length - ARCHIVE_MAX_EVENTS) : archived;
    window.localStorage.setItem(TELEMETRY_ARCHIVE_KEY, JSON.stringify({ version: 1, events: kept }));
  } catch {
    // 存储满 / 隐私模式：归档失败静默，不影响主流程。
  }
};

/** 追加一条遥测事件（超出主键上限时，最旧的事件移入归档键，不丢数据）。 */
export const appendGrammarEvent = (event: GrammarTelemetryEvent): void => {
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

export const listGrammarEvents = (): GrammarTelemetryEvent[] => [...readEvents()];

/** R14 周聚合：错误 tag 按自然周（周一为起点）统计——周环比的原料。
 *  referenceDate 决定「当前周」的锚点（默认真实当前时间；周报场景传与 buildLastWeekReport 相同的参考日，避免周日边界错位）。 */
export const weeklyErrorTagCounts = (weekOffset = 0, referenceDate = new Date()): Partial<Record<GrammarErrorTag, number>> => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const local = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const monday = new Date(local.getTime() - ((local.getDay() + 6) % 7) * DAY_MS + weekOffset * 7 * DAY_MS);
  const nextMonday = new Date(monday.getTime() + 7 * DAY_MS);
  const counts: Partial<Record<GrammarErrorTag, number>> = {};
  for (const event of listGrammarEvents()) {
    const rawTs = "ts" in event ? (event.ts as string) : "";
    const parsed = new Date(rawTs);
    const ts = Number.isFinite(parsed.getTime()) ? parsed.getTime() : NaN;
    if (!Number.isFinite(ts) || ts < monday.getTime() || ts >= nextMonday.getTime()) continue;
    if (event.kind === "diary_issue_tag") {
      counts[event.tag] = (counts[event.tag] ?? 0) + 1;
    } else if (event.kind === "hunt_verdict" && (event.verdictKind === "wrongTag" || event.verdictKind === "notError")) {
      // hunt 里的误判/归错罪名：guessedTag 才是玩家困惑的语法点
      if (event.guessedTag) counts[event.guessedTag] = (counts[event.guessedTag] ?? 0) + 1;
    }
  }
  return counts;
};

export const listGrammarEventsByKind = <K extends GrammarTelemetryEvent["kind"]>(
  kind: K
): Extract<GrammarTelemetryEvent, { kind: K }>[] =>
  listGrammarEvents().filter((event): event is Extract<GrammarTelemetryEvent, { kind: K }> => event.kind === kind);

export const clearGrammarTelemetry = (): void => {
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

/** R16：遥测存量统计——语法地图展示「可导出」状态，也为上限策略提供依据。 */
export interface GrammarTelemetryStats {
  activeEvents: number;
  maxEvents: number;
  archivedEvents: number;
  archiveMax: number;
  /** 当前主键是否已接近上限（≥80%），提示先导出归档。 */
  nearCapacity: boolean;
}

export const getGrammarTelemetryStats = (): GrammarTelemetryStats => {
  const activeEvents = listGrammarEvents().length;
  const archivedEvents = readArchivedEvents().length;
  return {
    activeEvents,
    maxEvents: MAX_EVENTS,
    archivedEvents,
    archiveMax: ARCHIVE_MAX_EVENTS,
    nearCapacity: activeEvents >= MAX_EVENTS * 0.8
  };
};

/** R16：导出快照（JSON 字符串）——含归档，供基线与 W4/D1 复盘使用。 */
export const buildGrammarTelemetryExport = (): string => {
  const events = listGrammarEvents();
  const archived = readArchivedEvents();
  const lastEventAt = events.length > 0 ? (events[events.length - 1] as { ts?: string }).ts ?? null : null;
  return JSON.stringify(
    {
      version: 1,
      exportedAt: nowIso(),
      stats: { ...getGrammarTelemetryStats(), lastEventAt },
      events,
      archivedEvents: archived
    },
    null,
    2
  );
};

/**
 * A5a（M1，2026-09-21）：课内追问（「问一句」）与答错追问（「为什么错了」）的汇总段。
 * 此前这些事件写得进、读不出——等于没埋：触发率/有用率/弃权率/降级率/校验丢弃分布/P90 全不可算。
 * 这是后续所有门禁的分母（RICE 排序中它是低 Reach 但不能后置的项）。
 */
export interface ExplainSummary {
  /** 「问一句」发起次数（分子：用户真的问了）。 */
  askRequested: number;
  /** 「问一句」返回数（含降级与弃权）。 */
  askResults: number;
  /** 「问一句」成功给出回答数。 */
  askOk: number;
  /** 弃权数（素材不足——设计成功，不算失败）。 */
  askDeclined: number;
  /** 降级分布：not_configured / timeout / error / invalid。 */
  askDegradeReasons: Record<string, number>;
  /** 校验丢弃分布：term / length / foreign / citation。 */
  askValidationFailures: Record<string, number>;
  /** 缓存命中数。 */
  askCached: number;
  /** 真实请求 P90 延迟（命中缓存与未配置短路不计入）。 */
  askP90LatencyMs: number;
  /** 反馈分布：helpful / unclear / wrong（「感受不到 AI 有用」的直接度量）。 */
  askFeedback: Record<string, number>;
  /** 答错追问发起次数。 */
  whyWrongRequested: number;
  /** 答错追问按**归因层**分布：local_exact / local_fuzzy / structural / ai / fallback。 */
  whyWrongByLayer: Record<string, number>;
  /** 答错追问反馈分布。 */
  whyWrongFeedback: Record<string, number>;
  /** 按模型拆分（explain 线）。 */
  byModel: Record<string, { calls: number; degraded: number }>;
  /** C4 复盘课：开启次数 / 完成次数 / 平均一次通过率 / 按罪名分布。 */
  replay: {
    completed: number;
    /** 平均一次通过率（0–1）：firstTryCount / itemCount 的平均。 */
    firstTryRate: number;
    /** 平均用时 ms。 */
    avgDurationMs: number;
    /** 按罪名：被练次数与一次通过率。 */
    byTag: Record<string, { times: number; firstTry: number; total: number }>;
  };
}

export interface GrammarTelemetrySummary {
  totalEvents: number;
  completions: number;
  /** 完课中引导题全一次通过的比例（0-1）。 */
  guidedFirstTryRate: number;
  /** 完课中练习题全一次通过的比例（0-1）。 */
  practiceFirstTryRate: number;
  expandedDeepDiveLessonIds: string[];
  huntVerdicts: { hit: number; wrongTag: number; notError: number; alreadyFound: number };
  /** 误报率：点在没问题的词上的比例（分母 = hit + wrongTag + notError）。 */
  huntFalsePositiveRate: number;
  /** R19：侦探结算汇总——破案率终于可算（此前只有 verdict，无结算）。 */
  huntSettled: { cases: number; solved: number; solveRate: number };
  /** R20：段级停留汇总——各段累计停留与样本数（均值 = totalMs / samples），对照六段预算表。 */
  sectionDwell: Partial<Record<LessonSection, { totalMs: number; samples: number }>>;
  /**
   * 2026-09-20 阶段三：正课中途退出的段分布（此前是盲区——lesson_exit 类型定义在、零写入）。
   * 用于回答「用户在哪一段放弃」：若集中在忆段说明回忆太难，集中在练段说明题目难。
   */
  lessonExitBySection: Partial<Record<LessonSection, number>>;
  /** 2026-09-20 阶段三：单题耗时（按段聚合）。均值 = totalMs / samples，用于核验「单题 2.3–4.6 秒」是否仍成立。 */
  stepDwellBySection: Partial<Record<LessonSection, { totalMs: number; samples: number }>>;
  diaryTagCounts: Partial<Record<GrammarErrorTag, number>>;
  /** R05：漏斗第一环——进入路径页 → 7 天内进课。 */
  pathFunnel: { views: number; firstVisitViews: number; pathToLessonWithin7d: number; pathToLessonRate7d: number };
  /** 「趁热练」参与率与分层漏斗（2026-09-18 PRD §3）；样本未积累时各率为 0。 */
  boost: GrammarBoostSummary;
  /** AI 调用明细（2026-09-19 补）：缓存命中率、真实请求延迟、日记批改失败与按模型拆分。 */
  ai: AiCallsSummary;
  /** 课内追问与答错追问的汇总（A5a）。 */
  explain: ExplainSummary;
}

/**
 * AI 调用可观测性汇总（2026-09-19 补）。
 *
 * 为什么重要：AI 的瓶颈是延迟而非成本（串行 3–8s/次），而此前只有
 * 「降级率」一个可读指标——缓存命中率、真实请求延迟、日记批改失败率全不可见，
 * 导致「要不要改批量策略 / 该不该换更快的模型」都无据可依。
 */
export interface AiCallsSummary {
  /** 趁热练 AI 调用总数（含缓存命中与降级）。 */
  boostCalls: number;
  /** 其中命中缓存数（命中时 latencyMs 为 0）。 */
  boostCached: number;
  /** 缓存命中率 = boostCached / boostCalls。 */
  boostCacheHitRate: number;
  /** 真实请求（未命中缓存且未因未配置而降级）的平均延迟 ms。 */
  boostAvgLatencyMs: number;
  /** 真实请求的 P90 延迟 ms（样本 <5 时等于最大值）。 */
  boostP90LatencyMs: number;
  /** 日记批改调用数。 */
  diaryCalls: number;
  /** 日记批改失败数。 */
  diaryFailures: number;
  /** 日记批改平均延迟 ms（含失败）。 */
  diaryAvgLatencyMs: number;
  /** 日记批改失败原因分布。 */
  diaryFailureKinds: Record<string, number>;
  /** 按模型拆分：模型名 → { 调用数, 降级数, 平均延迟 }。 */
  byModel: Record<string, { calls: number; degraded: number; avgLatencyMs: number }>;
}

/** 「趁热练」汇总口径：参与率 / 分层漏斗 / 放弃率 / 难度落位 / AI 使用与降级。 */
export interface GrammarBoostSummary {
  /** 曝光次数（按 lessonId+entryPoint 去重后的事件条数）。 */
  offered: number;
  /** 入口拆分：结算页 / 卡片档位条 / 重审完成页。 */
  offeredByEntry: Record<GrammarBoostOfferedEvent["entryPoint"], number>;
  started: number;
  /** 参与率 = started / offered（曝光为 0 时为 0）。 */
  startRate: number;
  /** 参与率分子按入口拆分——判断哪个入口真的带来进入。 */
  startedByEntry: Record<GrammarBoostStartedEvent["entryPoint"], number>;
  /** 各档完成数（tier → 次数）。 */
  completedByTier: Record<1 | 2 | 3, number>;
  /** 各档一次通过率（tier → 0-1；无样本为 0）。 */
  firstTryRateByTier: Record<1 | 2 | 3, number>;
  /** 档 1 完成 → 档 2 进入 / 档 2 完成 → 档 3 进入（PRD 漏斗门：≥80% / ≥50%）。 */
  funnel: { tier1ToTier2: number; tier2ToTier3: number };
  abandoned: number;
  /** 放弃率 = abandoned / started。 */
  abandonRate: number;
  /** AI 批改使用率 = 带 aiUsed 的完成 / 档 3 完成。 */
  aiUsedRate: number;
  /** AI 降级率 = degraded / ai_result（无样本为 0）。 */
  aiDegradedRate: number;
  /** 素材重复率 = item_repeat / step_result。 */
  itemRepeatRate: number;
}


/** 汇总遥测：M1 决策门指标（完成率/一次通过率/展开率/误报率）都从这里读。 */
export const summarizeGrammarTelemetry = (): GrammarTelemetrySummary => {
  const events = listGrammarEvents();
  const completions = events.filter(
    (event): event is GrammarLessonCompletedEvent => event.kind === "grammar_lesson_completed"
  );
  const guidedFirstTryCount = completions.filter((event) => event.guidedFirstTry).length;
  const practiceFirstTryCount = completions.filter((event) => event.practiceFirstTry).length;

  const expandedLessonIds = new Set(
    events
      .filter((event): event is DeepDiveExpandedEvent => event.kind === "deep_dive_expanded")
      .map((event) => event.lessonId)
  );

  const huntVerdicts = { hit: 0, wrongTag: 0, notError: 0, alreadyFound: 0 };
  for (const event of events) {
    if (event.kind === "hunt_verdict") huntVerdicts[event.verdictKind] += 1;
  }
  const judged = huntVerdicts.hit + huntVerdicts.wrongTag + huntVerdicts.notError;

  const diaryTagCounts: Partial<Record<GrammarErrorTag, number>> = {};
  for (const event of events) {
    if (event.kind === "diary_issue_tag") {
      diaryTagCounts[event.tag] = (diaryTagCounts[event.tag] ?? 0) + 1;
    }
  }

  const settled = events.filter((event): event is HuntCaseSettledEvent => event.kind === "hunt_case_settled");
  const solvedCount = settled.filter((event) => event.solved).length;

  // R05：漏斗第一环聚合——进入路径页次数、首访态（lessonsDone=0）次数、以及进入后 7 天内进首课的次数。
  const pathViews = events.filter((event): event is GrammarPathViewedEvent => event.kind === "grammar_path_viewed");
  const firstVisitViews = pathViews.filter((event) => event.lessonsDone === 0);
  const lessonStarts = events.filter(
    (event): event is GrammarLessonStartedEvent => event.kind === "grammar_lesson_started"
  );
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  let pathToLesson7d = 0;
  for (const view of pathViews) {
    const viewTs = Date.parse(view.ts);
    if (!Number.isFinite(viewTs)) continue;
    const started = lessonStarts.some((start) => {
      const startTs = Date.parse(start.ts);
      return Number.isFinite(startTs) && startTs >= viewTs && startTs - viewTs <= SEVEN_DAYS_MS;
    });
    if (started) pathToLesson7d += 1;
  }

  // R20：段级停留聚合——总停留与样本数，供六段预算核验（均值 = totalMs / samples）
  const sectionDwell: Partial<Record<LessonSection, { totalMs: number; samples: number }>> = {};
  for (const event of events) {
    if (event.kind === "section_dwell") {
      const bucket = sectionDwell[event.section] ?? { totalMs: 0, samples: 0 };
      bucket.totalMs += event.dwellMs;
      bucket.samples += 1;
      sectionDwell[event.section] = bucket;
    }
  }

  // 2026-09-20 阶段三：退出段分布 + 单题耗时聚合
  const lessonExitBySection: Partial<Record<LessonSection, number>> = {};
  const stepDwellBySection: Partial<Record<LessonSection, { totalMs: number; samples: number }>> = {};
  for (const event of events) {
    if (event.kind === "lesson_exit") {
      lessonExitBySection[event.section] = (lessonExitBySection[event.section] ?? 0) + 1;
    }
    if (event.kind === "lesson_step_result" && event.stepDwellMs) {
      const bucket = stepDwellBySection[event.section] ?? { totalMs: 0, samples: 0 };
      bucket.totalMs += event.stepDwellMs;
      bucket.samples += 1;
      stepDwellBySection[event.section] = bucket;
    }
  }

  return {
    totalEvents: events.length,
    completions: completions.length,
    guidedFirstTryRate: completions.length === 0 ? 0 : guidedFirstTryCount / completions.length,
    practiceFirstTryRate: completions.length === 0 ? 0 : practiceFirstTryCount / completions.length,
    expandedDeepDiveLessonIds: [...expandedLessonIds],
    huntVerdicts,
    huntFalsePositiveRate: judged === 0 ? 0 : huntVerdicts.notError / judged,
    huntSettled: {
      cases: settled.length,
      solved: solvedCount,
      solveRate: settled.length === 0 ? 0 : solvedCount / settled.length
    },
    sectionDwell,
    lessonExitBySection,
    stepDwellBySection,
    diaryTagCounts,
    pathFunnel: {
      views: pathViews.length,
      firstVisitViews: firstVisitViews.length,
      pathToLessonWithin7d: pathToLesson7d,
      pathToLessonRate7d: pathViews.length === 0 ? 0 : pathToLesson7d / pathViews.length
    },
    boost: summarizeBoost(events),
    ai: summarizeAiCalls(
      events,
      events.filter((event): event is GrammarBoostAiResultEvent => event.kind === "grammar_boost_ai_result")
    ),
    explain: summarizeExplain(events)
  };
};

/**
 * A5a：课内追问 + 答错追问汇总。
 * 口径与 summarizeAiCalls 一致：真实请求 = 未命中缓存、非「未配置」短路、延迟 > 0。
 */
const summarizeExplain = (events: GrammarTelemetryEvent[]): ExplainSummary => {
  const askRequested = events.filter(
    (event): event is AiExplainRequestedEvent => event.kind === "ai_explain_requested"
  );
  const askResults = events.filter(
    (event): event is AiExplainResultEvent => event.kind === "ai_explain_result"
  );
  const askFeedbacks = events.filter(
    (event): event is AiExplainFeedbackEvent => event.kind === "ai_explain_feedback"
  );
  const whyRequested = events.filter(
    (event): event is PracticeWhyWrongRequestedEvent => event.kind === "practice_why_wrong_requested"
  );
  const whyResults = events.filter(
    (event): event is PracticeWhyWrongResultEvent => event.kind === "practice_why_wrong_result"
  );
  const whyFeedbacks = events.filter(
    (event): event is PracticeWhyWrongFeedbackEvent => event.kind === "practice_why_wrong_feedback"
  );

  const countBy = <T,>(items: T[], pick: (item: T) => string | undefined): Record<string, number> => {
    const out: Record<string, number> = {};
    for (const item of items) {
      const key = pick(item) ?? "unknown";
      out[key] = (out[key] ?? 0) + 1;
    }
    return out;
  };

  const realCalls = askResults.filter(
    (event) => !event.cached && event.degradeReason !== "not_configured" && event.latencyMs > 0
  );
  const latencies = realCalls.map((event) => event.latencyMs).sort((a, b) => a - b);
  const p90 =
    latencies.length === 0
      ? 0
      : latencies.length < 5
        ? latencies[latencies.length - 1]
        : latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * 0.9))];

  const byModel: Record<string, { calls: number; degraded: number }> = {};
  for (const event of askResults) {
    const model = event.model?.trim() || "(未记录)";
    const bucket = byModel[model] ?? { calls: 0, degraded: 0 };
    bucket.calls += 1;
    if (event.degraded) bucket.degraded += 1;
    byModel[model] = bucket;
  }

  const replayCompletions = events.filter(
    (event): event is GrammarReplayCompletedEvent => event.kind === "grammar_replay_completed"
  );
  const replayByTag: Record<string, { times: number; firstTry: number; total: number }> = {};
  for (const event of replayCompletions) {
    for (const entry of event.perTag ?? []) {
      const bucket = replayByTag[entry.tag] ?? { times: 0, firstTry: 0, total: 0 };
      bucket.times += 1;
      bucket.firstTry += entry.firstTry;
      bucket.total += entry.total;
      replayByTag[entry.tag] = bucket;
    }
  }
  const replayFirstTryRate =
    replayCompletions.length === 0
      ? 0
      : replayCompletions.reduce(
          (sum, event) => sum + (event.itemCount > 0 ? event.firstTryCount / event.itemCount : 0),
          0
        ) / replayCompletions.length;

  return {
    askRequested: askRequested.length,
    askResults: askResults.length,
    askOk: askResults.filter((event) => event.ok && !event.declined).length,
    askDeclined: askResults.filter((event) => event.declined).length,
    askDegradeReasons: countBy(
      askResults.filter((event) => event.degradeReason),
      (event) => event.degradeReason ?? undefined
    ),
    askValidationFailures: countBy(
      askResults.filter((event) => event.validationFailure),
      (event) => event.validationFailure
    ),
    askCached: askResults.filter((event) => event.cached).length,
    askP90LatencyMs: p90,
    askFeedback: countBy(askFeedbacks, (event) => event.verdict),
    whyWrongRequested: whyRequested.length,
    // 归因层优先读新字段；旧事件回退到 matchSource/source（向后兼容历史数据）
    whyWrongByLayer: countBy(whyResults, (event) => event.layer ?? event.source),
    whyWrongFeedback: countBy(whyFeedbacks, (event) => event.verdict),
    byModel,
    replay: {
      completed: replayCompletions.length,
      firstTryRate: replayFirstTryRate,
      avgDurationMs:
        replayCompletions.length === 0
          ? 0
          : Math.round(
              replayCompletions.reduce((sum, event) => sum + event.durationMs, 0) / replayCompletions.length
            ),
      byTag: replayByTag
    }
  };
};

/**
 * 「趁热练」汇总（2026-09-18 PRD §3 指标口径）。
 * 关键设计：offered 已按 lessonId+entryPoint 去重（写入侧防抖），started 按 tier 归集，
 * 一次通过率按 grammar_boost_step_result.passed && attempts<=1 计算。
 */
const summarizeBoost = (events: GrammarTelemetryEvent[]): GrammarBoostSummary => {
  const offeredEvents = events.filter(
    (event): event is GrammarBoostOfferedEvent => event.kind === "grammar_boost_offered"
  );
  const startedEvents = events.filter(
    (event): event is GrammarBoostStartedEvent => event.kind === "grammar_boost_started"
  );
  const completedEvents = events.filter(
    (event): event is GrammarBoostCompletedEvent => event.kind === "grammar_boost_completed"
  );
  const stepEvents = events.filter(
    (event): event is GrammarBoostStepResultEvent =>
      event.kind === "grammar_boost_step_result" && !event.sourceRef.startsWith("self-eval:")
  );
  const aiEvents = events.filter(
    (event): event is GrammarBoostAiResultEvent => event.kind === "grammar_boost_ai_result"
  );

  const offeredByEntry: Record<GrammarBoostOfferedEvent["entryPoint"], number> = {
    settlement: 0,
    card: 0,
    reaudit: 0,
    lesson: 0
  };
  for (const event of offeredEvents) offeredByEntry[event.entryPoint] += 1;

  const startedByEntry: Record<GrammarBoostStartedEvent["entryPoint"], number> = {
    settlement: 0,
    card: 0,
    reaudit: 0,
    lesson: 0,
    direct: 0
  };
  for (const event of startedEvents) startedByEntry[event.entryPoint] += 1;

  const completedByTier: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  const firstTryByTier: Record<1 | 2 | 3, { passed: number; total: number }> = {
    1: { passed: 0, total: 0 },
    2: { passed: 0, total: 0 },
    3: { passed: 0, total: 0 }
  };
  for (const event of completedEvents) {
    completedByTier[event.tier] += 1;
    firstTryByTier[event.tier].passed += event.firstTryCount;
    firstTryByTier[event.tier].total += event.total;
  }

  const abandonedEvents = events.filter(
    (event): event is GrammarBoostAbandonedEvent => event.kind === "grammar_boost_abandoned"
  );
  const repeatEvents = events.filter(
    (event): event is GrammarBoostItemRepeatEvent => event.kind === "grammar_boost_item_repeat"
  );

  const tier3Completed = completedEvents.filter((event) => event.tier === 3);
  const tier3WithAi = tier3Completed.filter((event) => event.aiUsed).length;
  const aiDegraded = aiEvents.filter((event) => event.degraded).length;

  const rate = (numerator: number, denominator: number) => (denominator === 0 ? 0 : numerator / denominator);

  return {
    offered: offeredEvents.length,
    offeredByEntry,
    started: startedEvents.length,
    startRate: rate(startedEvents.length, offeredEvents.length),
    startedByEntry,
    completedByTier,
    firstTryRateByTier: {
      1: rate(firstTryByTier[1].passed, firstTryByTier[1].total),
      2: rate(firstTryByTier[2].passed, firstTryByTier[2].total),
      3: rate(firstTryByTier[3].passed, firstTryByTier[3].total)
    },
    funnel: {
      tier1ToTier2: rate(
        startedEvents.filter((event) => event.tier === 2).length,
        completedByTier[1]
      ),
      tier2ToTier3: rate(
        startedEvents.filter((event) => event.tier === 3).length,
        completedByTier[2]
      )
    },
    abandoned: abandonedEvents.length,
    abandonRate: rate(abandonedEvents.length, startedEvents.length),
    aiUsedRate: rate(tier3WithAi, tier3Completed.length),
    aiDegradedRate: rate(aiDegraded, aiEvents.length),
    itemRepeatRate: rate(repeatEvents.length, stepEvents.length)
  };
};

/** AI 调用汇总的实现（把可观测性从「只有降级率」补齐到缓存/延迟/模型维度）。 */
const summarizeAiCalls = (
  events: GrammarTelemetryEvent[],
  boostAiEvents: GrammarBoostAiResultEvent[]
): AiCallsSummary => {
  const cached = boostAiEvents.filter((event) => event.cached).length;
  // 真实请求 = 发出了网络调用（未命中缓存、且不是「未配置」这种本地短路）
  const realCalls = boostAiEvents.filter(
    (event) => !event.cached && event.degradeReason !== "not_configured" && event.latencyMs > 0
  );
  const latencies = realCalls.map((event) => event.latencyMs).sort((a, b) => a - b);
  const avg = latencies.length === 0 ? 0 : Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length);
  const p90 =
    latencies.length === 0
      ? 0
      : latencies.length < 5
        ? latencies[latencies.length - 1]
        : latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * 0.9))];

  const diaryEvents = events.filter(
    (event): event is DiaryCorrectionResultEvent => event.kind === "diary_correction_result"
  );
  const diaryFailures = diaryEvents.filter((event) => !event.ok);
  const diaryFailureKinds: Record<string, number> = {};
  for (const event of diaryFailures) {
    const key = event.errorKind ?? "error";
    diaryFailureKinds[key] = (diaryFailureKinds[key] ?? 0) + 1;
  }

  const byModel: Record<string, { calls: number; degraded: number; avgLatencyMs: number }> = {};
  for (const event of boostAiEvents) {
    const model = event.model?.trim() || "(未记录)";
    const bucket = byModel[model] ?? { calls: 0, degraded: 0, avgLatencyMs: 0 };
    bucket.calls += 1;
    if (event.degraded) bucket.degraded += 1;
    // 累计延迟用于算均值（命中缓存记 0，会被真实调用摊薄——这是有意的：它反映"用户实际等待"）
    bucket.avgLatencyMs += event.latencyMs;
    byModel[model] = bucket;
  }
  for (const model of Object.keys(byModel)) {
    if (byModel[model].calls > 0) byModel[model].avgLatencyMs = Math.round(byModel[model].avgLatencyMs / byModel[model].calls);
  }

  return {
    boostCalls: boostAiEvents.length,
    boostCached: cached,
    boostCacheHitRate: boostAiEvents.length === 0 ? 0 : cached / boostAiEvents.length,
    boostAvgLatencyMs: avg,
    boostP90LatencyMs: p90,
    diaryCalls: diaryEvents.length,
    diaryFailures: diaryFailures.length,
    diaryAvgLatencyMs:
      diaryEvents.length === 0
        ? 0
        : Math.round(diaryEvents.reduce((sum, event) => sum + event.latencyMs, 0) / diaryEvents.length),
    diaryFailureKinds,
    byModel
  };
};
