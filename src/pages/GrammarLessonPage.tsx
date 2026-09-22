import { ArrowLeft, CheckCircle2, Eraser, Flag, Flame, Lightbulb, Search, Sparkles, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import AdventureScene from "../components/AdventureScene";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { useReturnFocus } from "../components/useReturnFocus";
import SpeakButton from "../components/SpeakButton";
import { findSeasonByLessonNumber, LESSON_GROUPS } from "../data/grammarSeasons";
import SpeakAloudCard from "../components/SpeakAloudCard";
import type { AdventureSceneId } from "../components/AdventureScene";
import type { DiffToken, LessonContrast, LessonDeepDive, LessonGuidedStep, LessonPracticeStep } from "../types";
import { appendGrammarEvent, type LessonSection } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import { buildGrammarReviewSession, GRAMMAR_REVIEW_SESSION_LIMIT } from "../services/grammarReviewService";
import { speakTextWithLifecycle, stopSpeaking } from "../services/speechService";

// ── R-UX8：例句连播偏好（localStorage，默认关）──────────────────────
const AUTOPLAY_PREF_KEY = "grammar-example-autoplay-v1";
const readAutoPlayPref = (): boolean => {
  try {
    const raw = window.localStorage.getItem(AUTOPLAY_PREF_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { on?: boolean };
    return parsed?.on === true;
  } catch {
    return false;
  }
};
const writeAutoPlayPref = (on: boolean) => {
  try {
    window.localStorage.setItem(AUTOPLAY_PREF_KEY, JSON.stringify({ version: 1, on }));
  } catch {
    // 静默
  }
};
import { compareText, diffScore } from "../services/diffService";
import { buildLessonSummaryFacts, requestLessonSummary } from "../services/grammarLessonSummaryService";
import {
  appendWhyWrongLog,
  buildLessonExplainContext,
  buildPresetQuestions,
  createExplainQuota,
  explainStructuralWhy,
  describeExplainSource,
  matchWhyWrong,
  resolveGuidedExplain,
  type ExplainAnswer,
  type PresetQuestion,
  type WhyWrongMatch
} from "../services/grammarExplainService";
import { requestLessonExplain } from "../services/grammarExplainAiService";
import {
  clearLessonResume,
  loadLessonResume,
  saveLessonResume,
  type LessonResumeState
} from "../services/grammarLessonResumeService";
import { BOOST_TIERS, BOOST_TIER_META, getLessonBoostTiersDone } from "../services/grammarBoostService";
import {
  addLessonMistakeSentence,
  checkLessonTokens,
  createGuidedState,
  describeOutputGap,
  detectThirdPersonMiss,
  firstMismatchIndex,
  getFollowingLesson,
  getGrammarLesson,
  guidedDisplayOrder,
  hashGrammarSentence,
  judgeGuidedStep,
  markLessonDone,
  normalizeLessonSentence,
  shuffleTokenOrder
} from "../services/lessonService";

type LessonStage = "pretest" | "watch" | "guided" | "recall" | "practice" | "challenge";

/** R02：课前测试题。复用引导题（choose）与正误对比（contrast 判断）做「先试后学」。 */
type PretestQuestion =
  | { kind: "choose"; prompt: string; options: string[]; answer: string; reviewSentence: string; reviewNote: string }
  | {
      kind: "contrast";
      sentence: string;
      reviewSentence: string;
      reviewNote: string;
      /**
       * 这句是否真有问题。false = 双正解条（两种说法都对）——
       * 此时「有问题 / 没问题」选哪个都判对，否则用户会被判错（L76 曾踩坑：
       * contrast[0] 是 bothRight，但判题写死「有问题」为正确）。
       */
      hasProblem: boolean;
    };

/**
 * 前测逐题记录（R02 反馈补强 / R25）：结果页要能说清
 * 「哪一题、你的判断是什么、正确是什么、为什么」——只说「有 N 处拿不准」等于让用户带着疑问进讲解。
 *
 * R25：不再只记答错的题。全对时也要逐题给出解析，用户才知道自己是真会还是碰巧猜中
 * （猜对与学会是两回事；只丢一句「全对」等于把这一课的落点浪费掉）。
 */
interface PretestRecord {
  order: number;
  kind: "choose" | "contrast";
  promptZh: string;
  /** contrast 题展示的原句 */
  sentence?: string;
  userPick: string;
  correctPick: string;
  /** contrast 题的正确说法（完整句子） */
  correctSentence?: string;
  whyZh: string;
  /** 本题是否答对——决定结果卡走「纠正」还是「确证」两种版式。 */
  correct: boolean;
}

/** R10 六段式段标：有 recall 数据的课显示「③ 忆」，否则回退四段（向后兼容）。 */
const getStageTabs = (hasRecall: boolean): Array<{ id: LessonStage; label: string; hint: string }> => [
  { id: "watch", label: "① 看", hint: "情景讲解" },
  { id: "guided", label: "② 跟", hint: "试一试" },
  ...(hasRecall ? [{ id: "recall" as LessonStage, label: "③ 忆", hint: "凭记忆写" }] : []),
  { id: "practice", label: hasRecall ? "④ 练" : "③ 练", hint: "自己来" },
  { id: "challenge", label: hasRecall ? "⑤ 破" : "④ 破", hint: "侦探挑战" }
];

/** 第①段内部的 3 步子步进：剧场 → 搭装与对错 → 变奏。 */
const watchStepNames = ["剧场", "搭装与对错", "变奏"];

/**
 * R04 第 2 级提示：保留开头两词 + 词数骨架，只给结构不给答案。
 * 「I am drawing a picture.」→「I am ___ ___ ___.」
 */
const outputSkeleton = (sentence: string): string => {
  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length <= 2) return `${words[0]} ___`;
  const lastWord = words[words.length - 1];
  const punctuation = /[.!?]$/.test(lastWord) ? lastWord.slice(-1) : "";
  const blanks = words.slice(2).map((_word, index, list) => (index === list.length - 1 ? `___${punctuation}` : "___"));
  return [...words.slice(0, 2), ...blanks].join(" ");
};

/**
 * R23：跨重启累计每课学习时长——修复 durationMs 被课中重启截断的问题
 * （L06 真实首轮 285.7s，旧口径只记了末段 100.5s）。完课后清零。
 * R23b：累计器持久化到 localStorage（旁路键，不进 AppData），跨应用重启也不丢。
 */
const LESSON_TIME_KEY = "grammar-lesson-time-v1";

const readPersistedLessonTime = (): Record<string, number> => {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(LESSON_TIME_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const lessonTimeAccumulator = new Map<string, number>(Object.entries(readPersistedLessonTime()));
const lessonSessionStart = new Map<string, number>();

/** 把累计器快照写入 localStorage（每次结算时调用；失败静默，绝不影响学习主流程）。 */
const persistLessonTime = () => {
  try {
    window.localStorage.setItem(LESSON_TIME_KEY, JSON.stringify(Object.fromEntries(lessonTimeAccumulator)));
  } catch {
    // 存储满 / 隐私模式：静默降级为会话内累计（R23 原行为）
  }
};

const accumulateLessonTime = (lessonId: string) => {
  const startedAt = lessonSessionStart.get(lessonId);
  if (startedAt === undefined) return;
  lessonTimeAccumulator.set(lessonId, (lessonTimeAccumulator.get(lessonId) ?? 0) + Math.max(0, Date.now() - startedAt));
  lessonSessionStart.delete(lessonId);
  persistLessonTime();
};

/** R2：深挖卡展开偏好——默认展开（试玩实证 3/3 主动展开）；用户折叠/展开后记住偏好，后续课沿用。 */
const DEEP_DIVE_PREF_KEY = "grammar-deepdive-v1";

const readDeepDiveDefaultOpen = (): boolean => {
  try {
    const raw = window.localStorage.getItem(DEEP_DIVE_PREF_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw) as { open?: boolean };
    return typeof parsed?.open === "boolean" ? parsed.open : true;
  } catch {
    return true;
  }
};

const writeDeepDiveDefaultOpen = (open: boolean) => {
  try {
    window.localStorage.setItem(DEEP_DIVE_PREF_KEY, JSON.stringify({ version: 1, open }));
  } catch {
    // 存储满 / 隐私模式：偏好写不进就每次按默认展开，不影响主流程。
  }
};

/** R4：点词成句的展示词块 = 正确词 + 干扰项（干扰项可选，向后兼容）。判题按展示下标取词。 */
const arrangeTokensOf = (step: { tokens?: string[]; distractors?: string[] } | undefined): string[] =>
  step ? [...(step.tokens ?? []), ...(step.distractors ?? [])] : [];

/** 答案的词数（去标点）——arrange 摆满该词数即触发判题（有干扰项时不等于词块库总数）。 */
const answerWordCount = (answer: string): number =>
  answer.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean).length;

/**
 * 正误对比揭示卡（R07「先判断再揭示」）：
 * 先展示错/对双句让用户判断哪句正确（Noticing 训练），再揭示答案 + 为什么；
 * 揭示后错句的问题词带描红 + 删除线，杜绝「裸错句被当示范记住」（瑞思风险③）。
 * 判断结果经 onJudge 记入遥测。
 */
function LessonContrastCard({
  item,
  index,
  onJudge
}: {
  item: LessonContrast;
  index: number;
  onJudge?: (passed: boolean) => void;
}) {
  const [picked, setPicked] = useState<"first" | "second" | null>(null);
  // 上/下句顺序确定性打散：同一课内相邻对比卡方向交替
  const correctFirst = (item.wrong.length + index) % 2 === 0;
  const first = correctFirst ? item.correct : item.wrong;
  const second = correctFirst ? item.wrong : item.correct;
  const revealed = picked !== null;
  const mark = item.wrongMark ?? null;
  /** 本次判断是否答对（双正解条两边都对，恒为通过）。 */
  const passed = item.bothRight || (picked === "first") === correctFirst;

  const markedWrongNode: ReactNode = (() => {
    if (mark && item.wrong.includes(mark)) {
      const at = item.wrong.indexOf(mark);
      return (
        <>
          {item.wrong.slice(0, at)}
          <span className="lesson-contrast-mark" style={{ textDecoration: "line-through" }}>
            {mark}
          </span>
          {item.wrong.slice(at + mark.length)}
        </>
      );
    }
    return item.wrong;
  })();

  const judge = (choice: "first" | "second") => {
    if (picked) return;
    setPicked(choice);
    // 双正解条（that 可选件）：两句都对，选哪句都判通过。
    onJudge?.(item.bothRight ? true : (choice === "first") === correctFirst);
  };

  return (
    <div className="lesson-contrast-card">
      {!revealed ? (
        <>
          <p className="lesson-contrast-hint">
            {item.bothRight
              ? "挑一句你更顺眼的——今天这组有惊喜："
              : "两句话只有一句是对的——点出你认为对的那句："}
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            <button
              type="button"
              className="lesson-option"
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "12px 16px" }}
              onClick={() => judge("first")}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--accent, #f06423)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700
                }}
              >
                A
              </span>
              <span style={{ fontSize: 17, fontWeight: 600 }}>{first}</span>
            </button>
            <button
              type="button"
              className="lesson-option"
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "12px 16px" }}
              onClick={() => judge("second")}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--accent, #f06423)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700
                }}
              >
                B
              </span>
              <span style={{ fontSize: 17, fontWeight: 600 }}>{second}</span>
            </button>
          </div>
        </>
      ) : item.bothRight ? (
        <div className="lesson-contrast-reveal">
          <p className="lesson-contrast-correct">
            <CheckCircle2 size={17} /> {item.correct}
          </p>
          <p className="lesson-contrast-correct">
            <CheckCircle2 size={17} /> {item.wrong}
          </p>
          <p className="lesson-contrast-why">{item.whyZh}</p>
          <p className="lesson-contrast-judge">两句都对——这就是今天的反转。</p>
        </div>
      ) : (
        <>
          <p className="lesson-contrast-wrong">
            {markedWrongNode}
            {!mark && <span className="lesson-contrast-hole">缺了一块</span>}
            <span className="lesson-contrast-hole">← 有问题的是这句</span>
          </p>
          <div className="lesson-contrast-reveal">
            {/* R24：判错时先给结论条，再列正确说法——此前只有一句灰色小字，
                用户扫一眼绿句会默认自己选对了。 */}
            {passed ? (
              <p className="lesson-verdict-banner is-pass">
                <CheckCircle2 size={17} aria-hidden="true" />
                你判断对了——这组你没问题
              </p>
            ) : (
              <p className="lesson-verdict-banner is-miss">
                <X size={17} aria-hidden="true" />
                你选的是「{picked === "first" ? first : second}」——这组要留意
              </p>
            )}
            <p className="lesson-contrast-correct">
              <CheckCircle2 size={17} /> {item.correct}
            </p>
            <p className="lesson-contrast-why">{item.whyZh}</p>
            <p className="lesson-contrast-judge">
              {passed ? "眼光很准，继续。" : "没看出来没关系——现在知道差在哪了。"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * 前测逐题解析卡（R24/R25）：答错时是「纠正」，答对时是「确证」——同一张卡两种配色。
 *
 * R24：错选必须一眼可辨——「你的选择」与「正确选择」若同色同重并排，用户会把自己的错选
 * 当成正确答案读过去，这一课的落点就失效了，因此两格分别用红 / 绿底。
 * R25：全对时同样逐题解析，让用户确认自己是真会而不是碰巧猜中。
 */
function PretestReviewCard({ record }: { record: PretestRecord }) {
  const choiceWord = record.kind === "choose" ? "选择" : "判断";
  return (
    <div className="lesson-summary-card" key={`${record.order}-${record.kind}`}>
      <div className="lesson-summary-card-head">
        <p className="lesson-summary-grammar">第 {record.order} 题 · {record.promptZh}</p>
        {record.correct ? (
          <span className="lesson-verdict-chip is-pass">
            <CheckCircle2 size={12} aria-hidden="true" />
            {record.kind === "choose" ? "选对了" : "判断对了"}
          </span>
        ) : (
          <span className="lesson-verdict-chip is-miss">
            <X size={12} aria-hidden="true" />
            {record.kind === "choose" ? "选错了" : "判断错了"}
          </span>
        )}
      </div>
      {record.sentence && (
        <p className="lesson-summary-rule">
          <span className="lesson-rule-label">原句</span>
          {record.sentence}
        </p>
      )}
      {record.correct ? (
        <>
          {/* 答对：只列正确项即可，不必再摆一遍用户自己选的那个词 */}
          <div className="lesson-pick-compare is-single">
            <div className="lesson-pick-cell is-correct">
              <span>你的{choiceWord}</span>
              <strong>
                <CheckCircle2 size={15} aria-hidden="true" />
                {record.userPick}
              </strong>
            </div>
          </div>
          {record.correctSentence && (
            <p className="lesson-summary-rule">
              <span className="lesson-rule-label">正确说法</span>
              {record.correctSentence}
            </p>
          )}
        </>
      ) : (
        <>
          <div className="lesson-pick-compare">
            <div className="lesson-pick-cell is-mine">
              <span>你的{choiceWord}</span>
              <strong>
                <X size={15} aria-hidden="true" />
                {record.userPick}
              </strong>
            </div>
            <div className="lesson-pick-cell is-correct">
              <span>正确{choiceWord}</span>
              <strong>
                <CheckCircle2 size={15} aria-hidden="true" />
                {record.correctPick}
              </strong>
            </div>
          </div>
          {record.correctSentence && (
            <p className="lesson-summary-rule">
              <span className="lesson-rule-label">正确说法</span>
              {record.correctSentence}
            </p>
          )}
        </>
      )}
      {/* 解析：两种状态都展示——「为什么是这个答案」才是结果页真正要给的东西 */}
      <p className="lesson-pretest-why">
        <Lightbulb size={13} aria-hidden="true" />
        {record.whyZh}
      </p>
    </div>
  );
}

/**
 * 「为什么？」深挖卡（R2）：默认展开（用户可折叠，偏好被记住）。
 *
 * R-AI0 埋点修正（2026-09-19）：旧 `deep_dive_expanded` 只在「折叠后再展开」时触发，
 * 而卡片默认展开——新用户永不产生事件（结构性失真）。现在补：
 * - `deep_dive_impression`：卡进入视野即记，mode 区分默认展开 / 用户主动展开；
 * - `deep_dive_dwell`：卡片卸载或切换课时结算停留时长（S4 配对的分母口径：≥20s = 真的在读）。
 */
function LessonDeepDiveCard({
  dive,
  onExpand,
  onImpression,
  onDwellEnd
}: {
  dive: LessonDeepDive;
  onExpand?: () => void;
  onImpression?: (mode: "default_open" | "user_open") => void;
  onDwellEnd?: (dwellMs: number) => void;
}) {
  const [open, setOpen] = useState(readDeepDiveDefaultOpen);
  const mountedAtRef = useRef(Date.now());
  const impressionLoggedRef = useRef(false);

  // 曝光：挂载时若已展开（默认展开态）记 default_open；折叠态挂载不记（用户没看到内容），
  // 之后从折叠态展开由按钮处理器记 user_open。
  useEffect(() => {
    if (impressionLoggedRef.current || !open) return;
    impressionLoggedRef.current = true;
    onImpression?.("default_open");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 停留：卸载结算（跨段跳转、换课、离开页面都覆盖）
  useEffect(() => {
    return () => {
      onDwellEnd?.(Date.now() - mountedAtRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`lesson-deepdive${open ? " open" : ""}`}>
      <button
        type="button"
        className="lesson-deepdive-head"
        onClick={() => {
          const next = !open;
          if (next) {
            onExpand?.();
            onImpression?.("user_open");
          }
          setOpen(next);
          writeDeepDiveDefaultOpen(next);
        }}
        aria-expanded={open}
      >
        想知道为什么？
        <span className="lesson-deepdive-title">{dive.title}</span>
        <span className="lesson-deepdive-caret">{open ? "收起" : "展开"}</span>
      </button>
      {open && (
        <div className="lesson-deepdive-body">
          {dive.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GrammarLessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { data, updateData } = useAppData();
  const lesson = useMemo(() => (lessonId ? getGrammarLesson(lessonId) : undefined), [lessonId]);

  const [stage, setStage] = useState<LessonStage>("pretest");
  const [watchStep, setWatchStep] = useState(0);
  const [variantTab, setVariantTab] = useState(0);
  /** R-UX8：例句连播开关（默认关；偏好记忆，变奏步逐个点喇叭太累时的出口）。 */
  const [autoPlayExamples, setAutoPlayExamples] = useState(readAutoPlayPref);

  // R02 前测状态：先试后学，不判分不排名；答错的题已拍板「直接进入复习队列」
  const [pretestIndex, setPretestIndex] = useState(0);
  const [pretestPicked, setPretestPicked] = useState<string | null>(null);
  const [pretestWrongCount, setPretestWrongCount] = useState(0);
  const [pretestRecords, setPretestRecords] = useState<PretestRecord[]>([]);
  const [pretestFinished, setPretestFinished] = useState(false);

  // R04 无提示输出状态：练习段末尾的「说出来」，隐藏中文句意提示
  const [outputActive, setOutputActive] = useState(false);
  const [outputValue, setOutputValue] = useState("");
  const [outputTokens, setOutputTokens] = useState<DiffToken[] | null>(null);
  const [outputAttempts, setOutputAttempts] = useState(0);
  const [outputOutcome, setOutputOutcome] = useState<"idle" | "pass" | "revealed">("idle");
  const [outputHint, setOutputHint] = useState<string | null>(null);
  /** 提示阶梯档位：0 = 无提示（首答），1 = 给「这句要说什么」，2 = 给开头骨架，3 = 看答案。 */
  const [outputHintLevel, setOutputHintLevel] = useState(0);
  /** R6/R11：产出两档——0 = 半提示（变体句 + 句型框），1 = 无提示（核心句）。 */
  const [outputStep, setOutputStep] = useState(0);

  // R5「忆」段状态：给中文/场景，不给选项，凭记忆写整句
  const [recallValue, setRecallValue] = useState("");
  const [recallAttempts, setRecallAttempts] = useState(0);
  const [recallOutcome, setRecallOutcome] = useState<"idle" | "pass" | "revealed">("idle");
  const [recallHint, setRecallHint] = useState<string | null>(null);

  /** 完课收据的「去复习」出口：到期卡数量（0 时改指向错题重练，避免空页面）。 */
  const receiptDueReviewCount = useMemo(
    () => buildGrammarReviewSession(data, GRAMMAR_REVIEW_SESSION_LIMIT).length,
    [data]
  );

  /**
   * G1 角标数据：本季进度（季名 + 本季第几课 / 本季总课数）。
   * 用「季」而不是总课数做刻度——158 课的总进度只有 3%，看不出进展；
   * 季内 5/12 才是真实可感的刻度（数据基线由 grammarSeasons.test.ts 守门）。
   */
  const seasonProgress = useMemo(() => {
    if (!lesson) return null;
    const season = findSeasonByLessonNumber(lesson.number);
    if (!season) return null;
    const total = season.max - season.min + 1;
    // 本季已完成课数（按 grammarLessonsDone 的 id → 课号落区间），+1 是「本课」。
    // 完课页出现时本课尚未写入完成态（写盘在 practiceDone effect 之后），所以手动补 1。
    const doneInSeason = new Set(
      (data.grammarLessonsDone ?? [])
        .map((id) => getGrammarLesson(id)?.number)
        .filter((num): num is number => typeof num === "number" && num >= season.min && num <= season.max)
    );
    const index = Math.min(total, doneInSeason.size + 1);
    return { season, index, total };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.number, data.grammarLessonsDone]);

  // R05 完课确证：本课进了复习队列的知识点（完课小结卡「还差什么」的数据）
  const [reviewNotes, setReviewNotes] = useState<string[]>([]);
  /**
   * 收据页的 AI 错因小结（可选）：一句话说清「这一课卡在哪一步」。
   * 后台加载、失败静默——不阻塞收据展示，也不改变六段时长预算。
   */
  const [aiLessonSummary, setAiLessonSummary] = useState<string | null>(null);
  const aiSummaryRequestedRef = useRef(false);
  /**
   * 「问一句」追问式讲解（R-AI4）：深挖卡内的可选追问层。
   * 形态纪律——入口默认收起（不打扰）、一问一答即收、失败静默、配额 ≤2 次/课。
   */
  const [askOpen, setAskOpen] = useState(false);
  const [askAnswer, setAskAnswer] = useState<ExplainAnswer | null>(null);
  const [askLoading, setAskLoading] = useState(false);
  const [askFreeText, setAskFreeText] = useState("");
  // 「问一句」评价的已选态：点击后高亮 + 谢谢提示（此前只埋点无 UI 反馈）
  const [askRated, setAskRated] = useState<"helpful" | "unclear" | "wrong" | null>(null);
  // A2：失败可见话术（不再静默消失）
  const [askNotice, setAskNotice] = useState<string | null>(null);
  // C3（M3）：本课已问过的问题（追问记忆）——只进 prompt 上下文，绝不进白名单
  const askedQuestionsRef = useRef<string[]>([]);
  const explainQuotaRef = useRef(createExplainQuota());
  const [quotaLeft, setQuotaLeft] = useState(2);
  const presetQuestions = useMemo<PresetQuestion[]>(
    () => (lesson ? buildPresetQuestions(lesson.id) : []),
    [lesson?.id]
  );
  const explainContext = useMemo(
    () => (lesson ? buildLessonExplainContext(lesson.id) : null),
    [lesson?.id]
  );

  /**
   * 「为什么错了」答错现场错因追问（R-WW2）：练段答错第 2 次后出现。
   * 三级解答链：本地精确 → 本地近似（≥85，换序短路）→ AI（独立配额 ≤1 次/题）→ 兜底话术。
   */
  const [whyWrongOpen, setWhyWrongOpen] = useState(false);
  const [whyWrongMatch, setWhyWrongMatch] = useState<WhyWrongMatch | null>(null);
  const [whyWrongAI, setWhyWrongAI] = useState<ExplainAnswer | null>(null);
  const [whyWrongLoading, setWhyWrongLoading] = useState(false);
  const [whyWrongFallback, setWhyWrongFallback] = useState(false);
  // 反馈按钮的已选态：点击后按钮高亮 + 出谢谢提示——之前只埋点无 UI 态，用户以为按钮坏了
  const [whyWrongRated, setWhyWrongRated] = useState<"helpful" | "unclear" | "wrong" | null>(null);
  // 打开追问时记下用户当时的错句——讲解卡顶部展示「你的句子 vs 正确说法」对照
  const [whyWrongSentence, setWhyWrongSentence] = useState("");
  const whyWrongQuotaRef = useRef(createExplainQuota());
  const whyWrongStepRef = useRef<number | null>(null);
  /** 该步已问过一次（配额消耗）则不再出现。 */
  const whyWrongAskedStepsRef = useRef<Set<number>>(new Set());
  // A4（M1，2026-09-21）：课内 AI 计数统一走 explainQuotaRef（原 aiCallsThisLessonRef 已并入）——
  // 两套独立计数器会让最坏等待达 4×10s=40s，直接击穿 PRD 自设的 +30s 门禁。
  // 现在「问一句」与「为什么错了」共用同一 ≤2 配额，最坏 2×10s=20s ≈ +3.3%。
  /** 入口渲染条件：未配置 AI 时整个「问一句」入口不渲染（静态深挖卡照常）。 */
  const aiConfigured = Boolean(
    data.settings.aiProvider.enabled &&
      data.settings.aiProvider.baseUrl.trim() &&
      data.settings.aiProvider.apiKey.trim() &&
      data.settings.aiProvider.model.trim()
  );

  // ② 跟：引导题状态
  const [guided, setGuided] = useState(createGuidedState);
  const [guidedFeedback, setGuidedFeedback] = useState<"idle" | "pass" | "retry">("idle");
  const [guidedMisses, setGuidedMisses] = useState(0);
  const [guidedHint, setGuidedHint] = useState<string | null>(null);
  const [mistakeSaved, setMistakeSaved] = useState(false);
  // 拼装：order 存词块在 tokens 里的下标（可重复出现，天然支持同词块两次使用）
  const [guidedOrder, setGuidedOrder] = useState<number[]>([]);

  // ③ 练：自由练习状态
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practicePicked, setPracticePicked] = useState<string[]>([]);
  const [practiceFeedback, setPracticeFeedback] = useState<"idle" | "pass" | "retry">("idle");

  /**
   * 判题 / 换题后把焦点交回题目卡（2026-09-21 新增，修「答完一题焦点丢到 body」）。
   * 依赖键并入段、题号与两种反馈状态：换段、换题、出反馈都会尝试一次落焦。
   */
  /**
   * 依赖键必须覆盖**所有会改变判题态**的状态（2026-09-21 补）。
   *
   * 此前只含 guided/practice 的反馈，漏了忆段与产出段——
   * 于是「忆」里提交答案后焦点仍掉到 body（effect 依赖没变、不重跑）。
   * 它们都是同一个页面里互斥的判题态，并进同一个键即可。
   */
  const stageRef = useReturnFocus<HTMLElement>(
    true,
    [
      stage,
      pretestIndex,
      pretestPicked ? 1 : 0,
      // 看段的分步（此前漏了：watch 换步会整体替换内容，被点按钮被卸载、焦点掉到 body）
      watchStep,
      pretestFinished ? 1 : 0,
      guided.index,
      practiceIndex,
      guidedFeedback,
      practiceFeedback,
      recallOutcome,
      outputOutcome,
      outputActive ? outputStep : -1
    ].join(":")
  );
  /** 完课收据页也要落焦（点「完成这一课」后被点按钮卸载）。 */

  const [practiceMisses, setPracticeMisses] = useState(0);
  const [practiceHint, setPracticeHint] = useState<string | null>(null);
  const [practiceDone, setPracticeDone] = useState(false);

  /** 完课收据页也要落焦（点「完成这一课」后被点按钮卸载）。 */
  const receiptShown = practiceDone && (stage === "practice" || stage === "challenge");
  const receiptRef = useReturnFocus<HTMLDivElement>(receiptShown, `receipt:${receiptShown}`);
  const [practiceOrder, setPracticeOrder] = useState<number[]>([]);
  const [dragChip, setDragChip] = useState<{ from: "bank" | "build"; index: number } | null>(null);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  /** 上次判题时的词块数（判题去抖：同长度不重复判；超载后变化则重判）。 */
  const lastJudgedLengthRef = useRef<number | null>(null);
  /** 上次判错是否用了干扰项（「为什么错了」首错即出的条件）。 */
  const [lastAttemptUsedDistractor, setLastAttemptUsedDistractor] = useState(false);
  /** R3 对比题分布：练段常规题做完后、产出题前，插入「再看两组对错」位点（讲解段已放 2 组，此处再放 2 组）。 */
  const [midContrastOpen, setMidContrastOpen] = useState(false);

  // ── R01 数据埋点：课程计时 + 「一次通过」标记（旁路记录，不参与判题逻辑）──
  const lessonStartRef = useRef(Date.now());
  const guidedFirstTryRef = useRef(true);
  const practiceFirstTryRef = useRef(true);
  const lessonKey = lesson?.id ?? "";
  /** R22：进课埋点去重——React 严格模式会双调用 effect，同一课只记一次。 */
  const startedLessonRef = useRef<string>("");
  /** R-B7：结算页「趁热练」曝光只记一次（stage 切换会重渲染，防抖避免污染参与率分母）。 */
  const settlementBoostOfferedRef = useRef(false);
  useEffect(() => {
    // R21：进课埋点——漏斗起点，每次进入课程记一条
    if (lessonKey && startedLessonRef.current !== lessonKey) {
      startedLessonRef.current = lessonKey;
      appendGrammarEvent({ kind: "grammar_lesson_started", lessonId: lessonKey, ts: nowIso() });
    }
    // R23：重进同一课时，先结算上一段的时长（跨重启累计，不再截断）
    if (lessonKey) {
      accumulateLessonTime(lessonKey);
      lessonSessionStart.set(lessonKey, Date.now());
    }
    lessonStartRef.current = Date.now();
    guidedFirstTryRef.current = true;
    practiceFirstTryRef.current = true;
    setPretestIndex(0);
    setPretestPicked(null);
    setPretestWrongCount(0);
    setPretestRecords([]);
    setPretestFinished(false);
    setOutputActive(false);
    setOutputValue("");
    setOutputTokens(null);
    setOutputAttempts(0);
    setOutputOutcome("idle");
    setOutputHint(null);
    setOutputHintLevel(0);
    setOutputStep(0);
    setRecallValue("");
    setRecallAttempts(0);
    setRecallOutcome("idle");
    setRecallHint(null);
    setReviewNotes([]);
    // R23：离开课程（卸载/切课）时结算本段时长，累计进该课的总时长
    return () => {
      if (lessonKey) accumulateLessonTime(lessonKey);
    };
  }, [lessonKey]);



  /**
   * 阶段三：单题耗时（stepDwellMs）。
   * 段级 section_dwell 只能看到「练段总共花了多久」，看不到「哪一题卡了」——
   * 而「practice 单题 2.3–4.6 秒」这个关键摩擦指标正需要单题粒度。
   *
   * 2026-09-21 修（P1，指标长期为零）：此前是**单槽 ref**，而 render 期会连续调用两次
   * `beginStepTiming`（guided 一次、practice 一次，见下方 :858/:860），
   * 第二次把第一次的 key 覆盖掉——于是每次判题时 `settleStepTiming(guided:…)`
   * 都因 key 不匹配返回 undefined。
   * 实测后果：**guided 段全部题型、practice 段全部题型都不带 stepDwellMs**
   * （不是只有 spot），`stepDwellBySection` 的两个桶 `samples` 恒为 0，
   * 「单题平均耗时」这个关键摩擦指标从未有过数据。
   *
   * 改为按 key 分槽记录：每个「段:课:题号」各存各的起始时刻，互不覆盖。
   * 同时清掉不再需要的单槽语义（settle 只删自己那一槽）。
   */
  const stepDwellRef = useRef<Map<string, number>>(new Map());
  const beginStepTiming = (key: string) => {
    if (!stepDwellRef.current.has(key)) stepDwellRef.current.set(key, Date.now());
  };
  const settleStepTiming = (key: string): number | undefined => {
    const at = stepDwellRef.current.get(key);
    if (!at) return undefined;
    stepDwellRef.current.delete(key);
    const ms = Date.now() - at;
    return ms >= 300 ? ms : undefined;   // <300ms 视为误触，不记
  };

  // ── R20 段级停留：进入新段（或产出/破案子态）时，结算上一段的停留时长 ──
  // 六段预算核验的来源（PRD §7：看 90–140s / 跟 50–80s / 忆 40–60s / 练 100–160s / 产 50–80s / 破 60–110s）。
  const sectionDwellRef = useRef<{ lessonId: string; section: LessonSection; at: number }>({
    lessonId: "",
    section: "pretest",
    at: 0
  });
  // 产出是 practice 段内的子态（outputActive），完课小结挂 challenge 桶（破 + 收）
  const currentSection: LessonSection =
    stage === "practice" ? (practiceDone ? "challenge" : outputActive ? "output" : "practice") : stage;
  useEffect(() => {
    const now = Date.now();
    const prev = sectionDwellRef.current;
    // 同一课内才结算（跨课切换不计入）；≥1s 才记录，滤掉严格模式双调用与快速切换的噪音
    if (prev.lessonId && prev.lessonId === lessonKey && now - prev.at >= 1000) {
      appendGrammarEvent({
        kind: "section_dwell",
        lessonId: prev.lessonId,
        section: prev.section,
        dwellMs: now - prev.at,
        ts: nowIso()
      });
    }
    sectionDwellRef.current = { lessonId: lessonKey, section: currentSection, at: now };
  }, [currentSection, lessonKey]);

  /**
   * 阶段三：正课中途退出（lesson_exit）。
   *
   * 类型定义早就在 grammarTelemetry 里，但**零写入点**——「在哪一段退出」一直是盲区
   * （ux-optimization 文档把它记为正课漏斗最大盲区）。
   * 依赖只放 lessonId：段/步序号用 ref 读，否则每次换段都会重挂清理函数、记出假退出。
   */
  const exitStateRef = useRef({
    section: "pretest" as LessonSection,
    stepIndex: 0,
    completed: false,
    sessionCompleted: false
  });
  exitStateRef.current.section = currentSection;
  exitStateRef.current.stepIndex = stage === "guided" ? guided.index : stage === "practice" ? practiceIndex : 0;
  // 完课判定：lessonsDone 含本课 = 已完课（跨会话可靠，不依赖会话内 ref）
  exitStateRef.current.completed =
    (data.grammarLessonsDone ?? []).includes(lessonKey) || exitStateRef.current.sessionCompleted;
  useEffect(() => {
    return () => {
      if (!lessonKey) return;
      if (exitStateRef.current.completed) return;   // 完课不算退出
      const dwell = lessonTimeAccumulator.get(lessonKey) ?? 0;
      appendGrammarEvent({
        kind: "lesson_exit",
        lessonId: lessonKey,
        section: exitStateRef.current.section,
        stepIndex: exitStateRef.current.stepIndex,
        dwellMs: Math.max(0, dwell),
        ts: nowIso()
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonKey]);

  // R02：课前测试题——choose 复用引导题第 1 题，contrast 复用第一组正误对比
  const pretestQuestions = useMemo<PretestQuestion[]>(() => {
    if (!lesson) return [];
    const questions: PretestQuestion[] = [];
    const chooseStep = lesson.guided.find((step) => step.kind === "choose");
    if (chooseStep && chooseStep.options && chooseStep.options.length > 0) {
      questions.push({
        kind: "choose",
        prompt: chooseStep.promptZh,
        options: chooseStep.options,
        answer: chooseStep.answer,
        reviewSentence: chooseStep.answer,
        reviewNote: resolveGuidedExplain(chooseStep, lesson)
      });
    }
    // 优先取「真有问题」的对比组做前测；只有双正解条可用时才用它（此时两边都对）。
    const contrast = lesson.contrast?.find((item) => !item.bothRight) ?? lesson.contrast?.[0];
    if (contrast) {
      questions.push({
        kind: "contrast",
        sentence: contrast.wrong,
        reviewSentence: contrast.correct,
        reviewNote: contrast.whyZh,
        hasProblem: !contrast.bothRight
      });
    }
    return questions;
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法" title="找不到这一课" />
        <EmptyState title="课程不存在" description="回到课程地图，挑一课开始吧。" />
        <div className="lesson-stage-actions">
          <Link to="/grammar" className="primary-button">
            返回课程地图
          </Link>
        </div>
      </div>
    );
  }

  const isDone = data.grammarLessonsDone.includes(lesson.id);
  /** 完课后「下一课」的直达目标（按编号的下一节；已是最后一课时为 null → 退回地图）。 */
  const followingLesson = getFollowingLesson(lesson.id);
  // R08：纯零基础判定——第 1 课且尚未完成任何课。此态 pretest 导览化（不判分、纯预览）。
  const isFirstEverLesson = lesson.number === 1 && (data.grammarLessonsDone ?? []).length === 0;
  /**
   * 阶段二：跟段题型顺序模板轮换——按 lessonId 确定性换序，避免「点开下一题前就知道题型」。
   * 顺序只影响「第几题出现哪一题」，题量、内容、判题逻辑都不变。
   */
  const guidedDisplayOrderMemo = useMemo(
    () => guidedDisplayOrder(lesson.guided, lesson.id),
    [lesson.id, lesson.guided]
  );
  const guidedStep: LessonGuidedStep | undefined =
    lesson.guided[guidedDisplayOrderMemo[guided.index] ?? guided.index];
  // 阶段三：进入新题时开始计时（同一题重复渲染不重置）
  beginStepTiming(`guided:${lesson.id}:${guided.index}`);
  const practiceStep: LessonPracticeStep | undefined = lesson.practice[practiceIndex];
  beginStepTiming(`practice:${lesson.id}:${practiceIndex}`);

  /**
   * R-AI1（升级）：practice 答对后的「为什么」——practice 无 explain 字段，
   * 四级回退，每级都找「与本句直接相关」的解释，oneLineRule 只做最后兜底：
   * ① contrast 精确：答案句 == 某对比卡的正确句 → whyZh（最贴题）
   * ② variants 同句：答案句 == 某变体句 → 该变体的 noteZh（变体自带的「怎么变」说明）
   * ③ sceneSwings 同句：答案句 == 某场景句 → 场景描述（次优，仍有语境）
   * ④ guided 同句：引导题答案 == 练习答案 → 引导题的 explain
   * ⑤ oneLineRule 兜底
   *
   * 升级原因（用户实测截图反馈）：旧链 66% 落到 oneLineRule——整课通用规则对
   * 具体句子是答非所问（L1 的 "I am tired" 配 be 课规则，用户读不出「为什么这句」）。
   * 而 variants 63.7% 就是练习句、且自带 noteZh——现成解释一直没用上。
   */
  const practiceWhy = useMemo(() => {
    if (!practiceStep) return "";
    const normalized = normalizeLessonSentence(practiceStep.answer);
    if (!normalized) return "";

    // ① contrast 精确：最贴题
    const exactContrast = (lesson.contrast ?? []).find(
      (contrast) => normalizeLessonSentence(contrast.correct) === normalized && contrast.whyZh?.trim()
    );
    if (exactContrast?.whyZh?.trim()) return exactContrast.whyZh.trim();

    // ② variants 同句：变体自带的 noteZh（「怎么变」的人话说明）
    const sameVariant = (lesson.variants ?? []).find(
      (variant) => normalizeLessonSentence(variant.en) === normalized && variant.noteZh?.trim()
    );
    if (sameVariant?.noteZh?.trim()) return sameVariant.noteZh.trim();

    // ③ sceneSwings 同句
    const sameSwing = (lesson.sceneSwings ?? []).find(
      (swing) => normalizeLessonSentence(swing.en) === normalized
    );
    if (sameSwing?.zh?.trim()) return sameSwing.zh.trim();

    // ④ guided 同答案句的 explain（引导题做过的同句解释）
    const sameGuided = (lesson.guided ?? []).find(
      (step) => step.answer && normalizeLessonSentence(step.answer) === normalized && step.explain?.trim()
    );
    if (sameGuided?.explain?.trim()) return sameGuided.explain.trim();

    // ⑤ 兜底
    return lesson.oneLineRule;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceStep?.answer, lesson.id]);

  /**
   * guided 答对讲解的展示版：数据里的 explain 若是「复述答案/过短」，展示时自动
   * 从本课素材升级（contrast.wrongMark → 句子级素材 → deepDive 借句）——
   * 用户反馈「不能只出现纯判断，要告知为什么填这个」。只升级不降级。
   */
  const guidedExplainResolved = useMemo(() => {
    if (!guidedStep) return "";
    return resolveGuidedExplain(guidedStep, lesson);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guidedStep?.answer, guidedStep?.explain, lesson.id]);

  /** R-AI1：output 答对后的「为什么」——recall 有 noteZh 最贴题，否则一句话规则。 */
  const outputWhy = useMemo(
    () => lesson.recall?.noteZh?.trim() || lesson.oneLineRule,
    [lesson.recall?.noteZh, lesson.oneLineRule]
  );

  // ① 段小剧场：多句对话优先，旧数据回退到 dialogueEn 单句
  const dialogueLines = lesson.dialogue ?? [
    { who: "npc", en: lesson.dialogueEn, zh: lesson.dialogueZh }
  ];
  const currentVariant = lesson.variants?.[Math.min(variantTab, Math.max((lesson.variants.length ?? 1) - 1, 0))];

  /** R-UX8：例句连播——串行读每句，onEnd 触发下一句；任一句失败即停（不重试）。 */
  const speakAllExamples = (sentences: string[], index = 0) => {
    if (index >= sentences.length) return;
    speakTextWithLifecycle(sentences[index], {
      lang: data.settings.speechLang,
      rate: data.settings.speechRate,
      voiceURI: data.settings.speechVoice
    }, {
      onEnd: () => speakAllExamples(sentences, index + 1),
      onError: () => {}
    });
  };

  const resetGuided = () => {
    setGuided(createGuidedState());
    setGuidedFeedback("idle");
    setGuidedMisses(0);
    setGuidedHint(null);
    setMistakeSaved(false);
    /**
     * `guidedOrder` 也要清（2026-09-21 修，P0）。
     *
     * 此前漏了这一句：答对 guided 第 1 题后「回看讲解」再回来，
     * 拼装区里还摆着刚才那句（所有词块因已选中而被禁用），
     * 而 feedback 被重置成 idle、也没有「下一题」——
     * 整题锁死，用户既改不了也没有出口。
     */
    setGuidedOrder([]);
  };

  /** R02：前测作答。不判分不排名；答错的题直接进入复习队列（已拍板）。 */
  const handlePretestPick = (option: string) => {
    const question = pretestQuestions[pretestIndex];
    if (!question || pretestPicked) return;
    setPretestPicked(option);
    const correct =
      question.kind === "choose"
        ? option.trim().toLowerCase() === question.answer.trim().toLowerCase()
        : question.hasProblem
          ? option === "有问题"
          : true; // 双正解条：两种说法都对，选哪个都算对（不能因为「没问题」被判错）
    recordStepResult("pretest", question.kind, pretestIndex, correct ? 0 : 1, correct);
    // R25：无论对错都记一条——全对时逐题解析是「确证」（你说得出为什么吗），
    // 答错时是「纠正」；两种都渲染同一张卡，只是配色与标签不同。
    setPretestRecords((records) => [
      ...records,
      question.kind === "choose"
        ? {
            order: pretestIndex + 1,
            kind: "choose",
            promptZh: question.prompt,
            userPick: option,
            correctPick: question.answer,
            whyZh: question.reviewNote,
            correct
          }
        : {
            order: pretestIndex + 1,
            kind: "contrast",
            promptZh: "有人是这样说的，你觉得这句话有问题吗？",
            sentence: question.sentence,
            userPick: option,
            correctPick: question.hasProblem ? "有问题" : "没问题",
            correctSentence: question.reviewSentence,
            whyZh: question.reviewNote,
            correct
          }
    ]);
    if (!correct) {
      setPretestWrongCount((current) => current + 1);
      setReviewNotes((notes) => (notes.includes(question.reviewNote) ? notes : [...notes, question.reviewNote]));
      updateData((latest) => addLessonMistakeSentence(latest, lesson, question.reviewSentence, question.reviewNote));
    }
  };

  const pretestNext = () => {
    if (pretestIndex + 1 >= pretestQuestions.length) {
      setPretestFinished(true);
      return;
    }
    setPretestIndex((current) => current + 1);
    setPretestPicked(null);
  };

  /** 一步里错过至少一次的句子，进入复习队列（SM-2），错句变成明天的复习任务。 */
  const saveMistakeIfNeeded = (hadMisses: number, sentence: string, note: string) => {
    if (hadMisses <= 0) return;
    updateData((latest) => addLessonMistakeSentence(latest, lesson, sentence, note));
    // W2 观测：正课答错 → 复习队列的增长链入队事件（与 boost/diary 同口径）
    appendGrammarEvent({
      kind: "sentence_card_enqueued",
      lessonId: lesson.id,
      source: "lesson_mistake",
      sentence,
      ts: nowIso()
    });
    setMistakeSaved(true);
    setReviewNotes((notes) => (notes.includes(note) ? notes : [...notes, note]));
  };

  /** R01②/R02：一步判题落一条结果；引导/练习错过或未通过的步骤会拉低「一次通过」标记（前测不参与）。 */
  const recordStepResult = (
    section: LessonSection,
    stepKind: string,
    stepIndex: number,
    misses: number,
    passed = true,
    /** 产出句原文（仅 output/recall 段传）：北极星按句去重要用它算句面哈希。 */
    producedSentence?: string,
    /** 本题耗时（阶段三）：由 settleStepTiming 结算，缺省不写。 */
    stepDwellMs?: number
  ) => {
    appendGrammarEvent({
      kind: "lesson_step_result",
      lessonId: lesson.id,
      section,
      stepKind,
      stepIndex,
      attempts: misses + 1,
      passed,
      ...(producedSentence ? { sentenceHash: hashGrammarSentence(producedSentence) } : {}),
      ...(stepDwellMs ? { stepDwellMs } : {}),
      ts: nowIso()
    });
    if ((!passed || misses > 0) && (section === "guided" || section === "practice")) {
      if (section === "guided") guidedFirstTryRef.current = false;
      else practiceFirstTryRef.current = false;
    }
  };

  /** R-AI0：回看讲解（「没懂→回看」信号）——四处入口此前零埋点。 */
  const reread = (to: LessonStage) => {
    appendGrammarEvent({
      kind: "lesson_reread",
      lessonId: lesson.id,
      fromSection: currentSection,
      toSection: to,
      ts: nowIso()
    });
    // R-UX2：回看讲解前先快照练习/产出进度——回来时能「继续刚才」，不再清零。
    // 只在离开有进度的段时写；讲解/课前段无进度可丢，不写。
    if ((stage === "practice" && (practiceIndex > 0 || practiceDone || outputActive)) || stage === "challenge") {
      saveLessonResume(lesson.id, {
        stage: "practice",
        step: practiceIndex,
        practiceIndex,
        outputStep: outputActive ? outputStep : -1,
        guidedIndex: -1
      });
      resumeSourceRef.current = "reread";
    }
    gotoStage(to);
  };

  const gotoStage = (next: LessonStage) => {
    setStage(next);
    /**
     * 进段时统一清理「跨段会撞车的残余状态」（2026-09-21 修，两处 P0 死结）。
     *
     * 下面各分支只重置自己那段的状态，但有两个**跨段共享**的状态一直没人清：
     *
     * ① `practiceOrder`（拼装区已摆的词块）：
     *    从 practice 离开再回来时，第一题上已经摆着上次的答案——
     *    词块全被禁用、没有反馈、没有出口，看起来就是「页面卡住了」。
     * ② `lastJudgedLengthRef`（判题去抖的「上次判过的块数」）：
     *    guided 首题若是 arrange（arrange 占 guided 题量 50%），
     *    其答案词数常与 practice 某题相同；带着上一段的值进来，
     *    `next.length !== lastJudged` 不成立 → **摆满也永远不判题**，
     *    既无反馈也无出口。实测 195 课里 82 课会撞到。
     *
     * 进段时一并清掉最安全：段内自己的重置逻辑不变，跨段的脏状态不再泄漏。
     */
    setPracticeOrder([]);
    lastJudgedLengthRef.current = null;
    if (next === "guided") resetGuided();
    if (next === "watch") setWatchStep(0);
    if (next === "recall") {
      // R5「忆」段：进入时重置状态
      setRecallValue("");
      setRecallAttempts(0);
      setRecallOutcome("idle");
      setRecallHint(null);
    }
    if (next === "practice") {
      /**
       * R-UX2 修复（2026-09-20）：从「回看讲解」返回练习时，恢复离开前的进度而非清零。
       *
       * 此前 reread() 会把快照写进 localStorage 并置 resumeSourceRef = "reread"，
       * 但**没有任何消费方**——这条分支永远不被读到（文案「从讲解回来」是死代码），
       * 用户在第 5 题回看讲解、回来要从第 1 题重做整个练习段。
       */
      const rereadSnapshot = resumeSourceRef.current === "reread" ? loadLessonResume(lesson.id) : null;
      if (rereadSnapshot) {
        resumeSourceRef.current = "session"; // 消费掉，避免下次普通进段又被恢复
        setPracticeIndex(Math.max(0, rereadSnapshot.practiceIndex));
        setPracticePicked([]);
        setPracticeFeedback("idle");
        setPracticeMisses(0);
        setPracticeHint(null);
        setPracticeDone(false);
        // outputStep >= 0 表示离开时正在「说出来」子段
        setOutputActive(rereadSnapshot.outputStep >= 0);
        setOutputValue("");
        setOutputTokens(null);
        setOutputAttempts(0);
        setOutputOutcome("idle");
        setOutputHint(null);
        setOutputHintLevel(0);
        setOutputStep(Math.max(0, rereadSnapshot.outputStep));
      } else {
        setPracticeIndex(0);
        setPracticePicked([]);
        setPracticeFeedback("idle");
        setPracticeMisses(0);
        setPracticeHint(null);
        setPracticeDone(false);
        setOutputActive(false);
        setOutputValue("");
        setOutputTokens(null);
        setOutputAttempts(0);
        setOutputOutcome("idle");
        setOutputHint(null);
        setOutputHintLevel(0);
        setOutputStep(0);
      }
    }
    window.scrollTo({ top: 0 });
  };

  // ── R-UX2/R-UX3：进度恢复 ─────────────────────────────────
  // resumeOffer 非空 = 弹「继续刚才 / 重新开始」二选一卡。
  // resumeSource 仅区分文案来源（回看返回 vs 跨会话重进），恢复动作相同。
  const [resumeOffer, setResumeOffer] = useState<LessonResumeState | null>(null);
  const resumeSourceRef = useRef<"reread" | "session">("session");
  const resumeLoadedRef = useRef(false);

  // R-UX3：跨会话——挂载时读一次 localStorage 快照（ref 守卫防 StrictMode 双跑重复弹卡）
  useEffect(() => {
    if (resumeLoadedRef.current || !lesson) return;
    resumeLoadedRef.current = true;
    const saved = loadLessonResume(lesson.id);
    if (saved) {
      resumeSourceRef.current = "session";
      setResumeOffer(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonKey]);

  /** 「继续刚才」：按快照恢复到 practice（含 output 子段）。 */
  const applyResume = (snapshot: LessonResumeState) => {
    setStage("practice");
    setPracticeIndex(Math.max(0, snapshot.practiceIndex));
    setPracticePicked([]);
    setPracticeFeedback("idle");
    setPracticeMisses(0);
    setPracticeHint(null);
    setPracticeDone(false);
    setOutputActive(snapshot.outputStep >= 0);
    setOutputValue("");
    setOutputTokens(null);
    setOutputAttempts(0);
    setOutputOutcome("idle");
    setOutputHint(null);
    setOutputHintLevel(0);
    setOutputStep(Math.max(0, snapshot.outputStep));
    setResumeOffer(null);
    window.scrollTo({ top: 0 });
  };

  /** 「重新开始」：清快照 + 全量重置（gotoStage 原行为）。 */
  const discardResume = () => {
    if (lesson) clearLessonResume(lesson.id);
    setResumeOffer(null);
  };

  // ── 拼装交互（引导与练习共用）：order 存词块索引；点击切换选中/取消，拖拽可换位 ──
  const judgeArrange = (stage: "guided" | "practice", order: number[]) => {
    if (stage === "guided") {
      if (!guidedStep || guidedStep.kind !== "arrange") return;
      const displayTokens = arrangeTokensOf(guidedStep);
      const pickedTokens = order.map((index) => displayTokens[index]).filter(Boolean) as string[];
      const passed = checkLessonTokens(pickedTokens, guidedStep.answer);
      if (!passed) {
        setGuidedMisses((current) => current + 1);
        setGuidedHint(mismatchHint(pickedTokens, guidedStep.answer));
        setGuidedFeedback("retry");
      } else {
        saveMistakeIfNeeded(guidedMisses, guidedStep.answer, guidedStep.explain);
        recordStepResult(
          "guided",
          guidedStep.kind,
          guided.index,
          guidedMisses,
          true,
          undefined,
          settleStepTiming(`guided:${lesson.id}:${guided.index}`)
        );
        setGuidedFeedback("pass");
      }
      return;
    }
    if (!practiceStep) return;
    const displayTokens = arrangeTokensOf(practiceStep);
    const pickedTokens = order.map((index) => displayTokens[index]).filter(Boolean) as string[];
    const passed = checkLessonTokens(pickedTokens, practiceStep.answer);
    if (!passed) {
      setPracticeMisses((current) => current + 1);
      setPracticeHint(mismatchHint(pickedTokens, practiceStep.answer));
      setPracticeFeedback("retry");
      // R-WW2 修正（用户实测）：判错时记录「本次是否用了干扰项」——
      // 拼满完整句却用了干扰项 = 一次完整、可诊断的错误尝试，
      // 是「为什么错了」最有价值的提问时刻，不必等第 2 次错。
      const distractorSet = new Set((practiceStep.distractors ?? []).map((token) => token.toLowerCase()));
      setLastAttemptUsedDistractor(pickedTokens.some((token) => distractorSet.has(token.toLowerCase().replace(/[.,!?;:]/g, ""))));
    } else {
      saveMistakeIfNeeded(practiceMisses, practiceStep.answer, lesson.oneLineRule);
      recordStepResult(
        "practice",
        "arrange",
        practiceIndex,
        practiceMisses,
        true,
        undefined,
        settleStepTiming(`practice:${lesson.id}:${practiceIndex}`)
      );
      setPracticeFeedback("pass");
    }
  };

  const arrangeAdd = (stage: "guided" | "practice") => (tokenIndex: number, at?: number) => {
    const order = stage === "guided" ? guidedOrder : practiceOrder;
    const setOrder = stage === "guided" ? setGuidedOrder : setPracticeOrder;
    const step = stage === "guided" ? guidedStep : practiceStep;
    const displayTokens = arrangeTokensOf(step);
    if (!step || displayTokens[tokenIndex] == null) return;
    if (order.includes(tokenIndex)) return;
    const next = [...order];
    if (at == null || at >= next.length) next.push(tokenIndex);
    else next.splice(Math.max(0, at), 0, tokenIndex);
    setOrder(next);
    setGuidedFeedback((f) => f); // no-op 保持钩子顺序稳定
    if (stage === "guided") {
      setGuidedFeedback("idle");
      setGuidedHint(null);
    } else {
      setPracticeFeedback("idle");
      setPracticeHint(null);
    }
    // R4：摆满「答案词数」即判题（有干扰项时 ≠ 词块库总数）。
    // Bug 修复（用户实测）：判过一次后再多摆块，next.length > 答案词数，
    // 「===」条件永不再成立 → 超载状态永远无反馈（截图 1 的「什么反馈也没有」）。
    // 改为「≥ 答案词数 且 块数与上次判题不同」：多摆/移除后到达新长度都会重新判题，
    // 用户在超载状态下也能拿到「不对」的反馈，不卡死。
    const answerLen = answerWordCount(step.answer);
    const lastJudged = lastJudgedLengthRef.current;
    if (next.length >= answerLen && next.length !== lastJudged) {
      lastJudgedLengthRef.current = next.length;
      judgeArrange(stage, next);
    }
  };

  const arrangeRemove = (stage: "guided" | "practice") => (pos: number) => {
    const order = stage === "guided" ? guidedOrder : practiceOrder;
    const setOrder = stage === "guided" ? setGuidedOrder : setPracticeOrder;
    const next = order.filter((_, index) => index !== pos);
    // 用户主动移除 = 主动修正，重置判题去抖（否则移除后再摆回同长度不判题）
    lastJudgedLengthRef.current = null;
    /**
     * 与橡皮擦同口径：**已通过的题不因移除一块而变成无反馈死结**（2026-09-21 修）。
     *
     * `arrangeUndoLast` 此前也漏了这个守卫（本轮一并修）。两条路径等价，
     * 但只修一条会让「点块移除」撤销通关、「橡皮擦」不撤销——行为不一致。
     * 已过关的题允许回头修改，通关状态保留；真想重做就摆满，摆满会重新判题。
     */
    const alreadyPassed = stage === "guided" ? guidedFeedback === "pass" : practiceFeedback === "pass";
    setOrder(next);
    if (alreadyPassed) return;
    if (stage === "guided") {
      setGuidedFeedback("idle");
      setGuidedHint(null);
    } else {
      setPracticeFeedback("idle");
      setPracticeHint(null);
    }
  };

  const arrangeMove = (stage: "guided" | "practice") => (from: number, to: number) => {
    const order = stage === "guided" ? guidedOrder : practiceOrder;
    const setOrder = stage === "guided" ? setGuidedOrder : setPracticeOrder;
    const step = stage === "guided" ? guidedStep : practiceStep;
    if (!step || from === to || from < 0 || from >= order.length) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    const adjusted = to > from ? to - 1 : to;
    next.splice(Math.max(0, Math.min(next.length, adjusted)), 0, moved);
    // 拖动 = 主动重排，判题去抖复位（与 arrangeRemove 同口径，2026-09-21 补）
    lastJudgedLengthRef.current = null;
    setOrder(next);
    if (stage === "guided") {
      setGuidedFeedback("idle");
      setGuidedHint(null);
    } else {
      setPracticeFeedback("idle");
      setPracticeHint(null);
    }
    /**
     * 判题条件与 `arrangeAdd` 同口径（2026-09-21 修）。
     *
     * 此前这里是 `=== answerWordCount(...)`，而 `arrangeAdd` 早已改成 `>=` 并留了注释：
     * `===` 在**超载**（词块数 > 答案词数）时永不再成立，导致「多摆/重排后再也拿不到反馈」。
     * 实测：practice 段 1002 道 arrange **全部**是超载题（词块数 > 答案词数），
     * 于是这些题里「拖动重排」永远不会触发判题——用户重排完只能干看着。
     */
    if (next.length >= answerWordCount(step.answer)) judgeArrange(stage, next);
  };

  const arrangeUndoLast = (stage: "guided" | "practice") => () => {
    const order = stage === "guided" ? guidedOrder : practiceOrder;
    const setOrder = stage === "guided" ? setGuidedOrder : setPracticeOrder;
    /**
     * 橡皮擦的两处修正（2026-09-21 修，P1）：
     *
     * ① 判题去抖复位：与 `arrangeRemove` 同口径。
     *    此前不重置 `lastJudgedLengthRef`，于是「橡皮擦擦掉一块 → 再摆回同长度」时
     *    `next.length === lastJudged` 成立、不再判题——用户摆出完整句子却拿不到任何反馈。
     *
     * ② **已通过的题不能因为擦一块就变成无反馈死结**：
     *    此前无条件把反馈置 `idle`。若这题已经判过「通过」，
     *    `idle` 会让「下一题」按钮消失、成功提示也被抹掉，
     *    而擦完的句子又不满判题长度、不会重新判——用户被卡在这一题上，
     *    只剩词块可点（实测：答对后按橡皮擦 → 无「下一题」、无 pass、无 retry）。
     *    现在保住「通过」态：已过关的题，擦除只是允许回头修改，不撤销通关。
     *    （真想重做就擦完再摆满——摆满会重新判题并给出新结果。）
     */
    lastJudgedLengthRef.current = null;
    const alreadyPassed = stage === "guided" ? guidedFeedback === "pass" : practiceFeedback === "pass";
    setOrder(order.slice(0, -1));
    if (alreadyPassed) return;
    if (stage === "guided") {
      setGuidedFeedback("idle");
      setGuidedHint(null);
    } else {
      setPracticeFeedback("idle");
      setPracticeHint(null);
    }
  };

  const guidedPickOption = (option: string) => {
    if (!guidedStep || guidedFeedback === "pass") return;
    const nextPicked = [option];
    setGuided((state) => ({ ...state, picked: nextPicked, checked: true }));
    const passed = judgeGuidedStep(guidedStep, nextPicked);
    if (guidedStep.kind === "spot") {
      // 找茬是热身：可以一直点直到找对，不记失误、不进复习队列；埋点记为一次通过（不影响一次通过率）
      setGuidedFeedback(passed ? "pass" : "retry");
      /**
       * `settleStepTiming` 必须与其它题型同口径传（2026-09-21 修）。
       *
       * 此前这一支漏传，于是 spot 题的 `lesson_step_result` 永远没有 stepDwellMs——
       * 而 spot 占 guided 段题量的 16.7%（194/1163 道），
       * `stepDwellBySection.guided` 的「单题平均耗时」因此是在**少了六分之一样本**上算的，
       * 且缺失并非随机（找茬题的耗时结构与选择题不同），均值会系统性偏移。
       */
      if (passed) {
        recordStepResult(
          "guided",
          "spot",
          guided.index,
          0,
          true,
          undefined,
          settleStepTiming(`guided:${lesson.id}:${guided.index}`)
        );
      }
      return;
    }
    if (!passed) setGuidedMisses((current) => current + 1);
    else {
      saveMistakeIfNeeded(guidedMisses, guidedStep.answer, guidedStep.explain);
      /**
       * choose / replace 分支同样要结算单题耗时（2026-09-21 修）。
       * 此前只有 arrange 走 `judgeArrange` 时结算，这一支漏传——
       * 于是 guided 段的 choose / replace 题（各 194 道）也不进样本。
       */
      recordStepResult(
        "guided",
        guidedStep.kind,
        guided.index,
        guidedMisses,
        true,
        undefined,
        settleStepTiming(`guided:${lesson.id}:${guided.index}`)
      );
    }
    setGuidedFeedback(passed ? "pass" : "retry");
  };

  const guidedUndo = () => arrangeUndoLast("guided")();
  void guidedUndo;

  const guidedNext = () => {
    lastJudgedLengthRef.current = null;
    if (guided.index + 1 >= guidedDisplayOrderMemo.length) {
      // R10 六段式：跟段之后进「忆」段（无 recall 数据的旧课直接进练段）
      gotoStage(lesson.recall ? "recall" : "practice");
      return;
    }
    setGuided({ index: guided.index + 1, picked: [], checked: false, passed: false });
    setGuidedFeedback("idle");
    setGuidedMisses(0);
    setGuidedHint(null);
    setMistakeSaved(false);
    setGuidedOrder([]);
  };

  // ── 自由练习交互 ─────────────────────────────────────────
  const practiceUndo = () => arrangeUndoLast("practice")();

  /** R12 阶梯提示：错 2 次后可「照着拼一遍」——不阻断流程，诚实记为非一次通过。 */
  const revealPractice = () => {
    if (!practiceStep) return;
    // R-AI0：诚实记录「用了照着拼」——此前这被记成 passed=true 的假通过，
    // 放弃与做对在通过率里同形，practice 一次通过率因此虚高。
    appendGrammarEvent({
      kind: "practice_reveal_used",
      lessonId: lesson.id,
      stepIndex: practiceIndex,
      attemptsBeforeReveal: practiceMisses,
      ts: nowIso()
    });
    const displayTokens = arrangeTokensOf(practiceStep);
    const answerWords = practiceStep.answer
      .replace(/[.,!?;:]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.toLowerCase());
    const used = new Set<number>();
    const correctOrder: number[] = [];
    for (const word of answerWords) {
      const index = displayTokens.findIndex(
        (token, position) => !used.has(position) && token.replace(/[.,!?;:]/g, "").toLowerCase() === word
      );
      if (index >= 0) {
        used.add(index);
        correctOrder.push(index);
      }
    }
    setPracticeOrder(correctOrder);
    saveMistakeIfNeeded(practiceMisses, practiceStep.answer, lesson.oneLineRule);
    recordStepResult(
      "practice",
      "arrange",
      practiceIndex,
      practiceMisses + 1,
      true,
      undefined,
      settleStepTiming(`practice:${lesson.id}:${practiceIndex}`)
    );
    setPracticeFeedback("pass");
  };

  /**
   * guided 的兜底出口（2026-09-20 加）：
   * practice 段错 1 次就有「想不起来了，照着拼一遍」，而 guided 段此前**没有任何出口**——
   * 连错 5 次仍是同一句位置提示，零基础用户可能长时间卡在同一题
   * （数据层不会死锁，但体验上等于卡死）。
   * 现在：错满 2 次后出现「看答案，照着拼」——与 practice 同等对待，且如实记录。
   */
  const revealGuided = () => {
    if (!guidedStep) return;
    appendGrammarEvent({
      kind: "practice_reveal_used",
      lessonId: lesson.id,
      stepIndex: guided.index,
      attemptsBeforeReveal: guidedMisses,
      ts: nowIso()
    });
    if (guidedStep.kind === "arrange") {
      const answerWords = guidedStep.answer
        .replace(/[.,!?;:]/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.toLowerCase());
      const displayTokens = arrangeTokensOf(guidedStep);
      const used = new Set<number>();
      const correctOrder: number[] = [];
      for (const word of answerWords) {
        const found = displayTokens.findIndex(
          (token, index) => !used.has(index) && token.replace(/[.,!?;:]/g, "").toLowerCase() === word
        );
        if (found >= 0) {
          used.add(found);
          correctOrder.push(found);
        }
      }
      setGuidedOrder(correctOrder);
    } else {
      setGuided({ ...guided, picked: [guidedStep.answer] });
    }
    recordStepResult(
      "guided",
      guidedStep.kind,
      guided.index,
      guidedMisses + 1,
      true,
      undefined,
      settleStepTiming(`guided:${lesson.id}:${guided.index}`)
    );
    setGuidedFeedback("pass");
  };

  // ── R04/R6/R11：两档产出（半提示 → 无提示） ─────────────────
  const OUTPUT_PASS_SCORE = 90;

  /**
   * R6：产出计划——第 1 题用本课变体句（带句型框），第 2 题核心句（无提示）；无变体的旧课回退单题。
   *
   * 选句纪律（2026-09-19 修正）：半提示句**不能再是练习段已练过的句子**——
   * 此前固定取「疑问」，而 practice 里通常也含疑问句，导致同一句在「练」和「产」连着出现两次
   * （实测 L13：`What are you doing?` 在练与产各出现一次），产出段的新信息被稀释。
   * 现在优先取「未被 practice 用过」的变体；全被用过时才回退到原逻辑。
   * 实测：102 课中 83 课因此换到了新句；余 19 课的变体本身就是练习句（数据属性），
   * 回退后仍为疑问优先——这类课需要内容侧补变体，不是代码问题。
   */
  const practicedSentences = new Set(
    (lesson?.practice ?? []).map((step) => (step.answer ?? "").trim().toLowerCase())
  );
  const variantCandidates = (lesson?.variants ?? []).filter(
    (variant) => variant.label !== "肯定" && variant.en.trim()
  );
  const halfPromptVariant =
    variantCandidates.find(
      (variant) => !practicedSentences.has(variant.en.trim().toLowerCase())
    ) ??
    variantCandidates.find((variant) => variant.label === "疑问") ??
    variantCandidates.find((variant) => variant.label === "否定") ??
    null;
  const halfPromptSentence = halfPromptVariant?.en ?? null;
  const halfPromptIntentZh = halfPromptVariant?.zh ?? lesson?.intentZh ?? "";
  const outputPlan = useMemo(
    () => [
      ...(halfPromptSentence ? [{ sentence: halfPromptSentence, skeleton: true }] : []),
      { sentence: lesson?.targetSentence ?? "", skeleton: false }
    ],
    [halfPromptSentence, lesson?.targetSentence]
  );
  const currentOutput = outputPlan[Math.min(outputStep, outputPlan.length - 1)];

  const advanceOutputStep = () => {
    setOutputStep((current) => Math.min(current + 1, outputPlan.length - 1));
    setOutputValue("");
    setOutputTokens(null);
    setOutputAttempts(0);
    setOutputOutcome("idle");
    setOutputHint(null);
    setOutputHintLevel(0);
  };

  const submitOutput = () => {
    if (outputOutcome !== "idle" || !outputValue.trim()) return;
    const tokens = compareText(currentOutput.sentence, outputValue, false);
    const score = diffScore(tokens);
    const nextAttempts = outputAttempts + 1;
    setOutputAttempts(nextAttempts);
    setOutputTokens(tokens);
    const passed = score >= OUTPUT_PASS_SCORE;
    // 用没用过提示分开记录：无提示通过才是 R04 真正要度量的「掌握」。
    recordStepResult(
      "output",
      outputHintLevel > 0 ? "free_type_hint" : "free_type",
      outputStep,
      nextAttempts - 1,
      passed,
      currentOutput.sentence
    );
    // R-AI0：用提示后通过的，补一条 hint_step 收口（self 路径不记——一次通过已有专门信号）
    if (passed && outputHintLevel > 0) {
      appendGrammarEvent({
        kind: "output_hint_step",
        lessonId: lesson.id,
        stepIndex: outputStep,
        level: Math.max(1, Math.min(3, outputHintLevel)) as 1 | 2 | 3,
        resolvedBy: "hint",
        ts: nowIso()
      });
    }
    if (passed) {
      if (outputStep < outputPlan.length - 1) {
        advanceOutputStep();
        return;
      }
      setOutputOutcome("pass");
      setOutputHint(null);
    } else {
      // 反馈要说清「差在哪」：先给具体差异，再兜底通用文案（只给颜色等于让用户猜）。
      const gap = describeOutputGap(outputValue, currentOutput.sentence);
      const fallback =
        score === 0
          ? "这句和核心句还没对上——要不要先要个提示？"
          : `已经对了一部分（${score}%）。下面是逐词对照：绿色对上了，红色还没。`;
      setOutputHint([detectThirdPersonMiss(outputValue) ?? fallback, gap].filter(Boolean).join(" "));
    }
  };

  /** 想不起来了：看答案不算错，但这句会排进复习队列（失败不阻断完课）。 */
  const revealOutput = () => {
    if (outputOutcome !== "idle") return;
    const nextAttempts = outputAttempts + 1;
    setOutputAttempts(nextAttempts);
    recordStepResult(
      "output",
      outputHintLevel > 0 ? "free_type_hint" : "free_type",
      outputStep,
      nextAttempts - 1,
      false,
      currentOutput.sentence
    );
    appendGrammarEvent({
      kind: "output_hint_step",
      lessonId: lesson.id,
      stepIndex: outputStep,
      level: Math.max(1, Math.min(3, outputHintLevel || 3)) as 1 | 2 | 3,
      resolvedBy: "reveal",
      ts: nowIso()
    });
    updateData((latest) =>
      addLessonMistakeSentence(latest, lesson, currentOutput.sentence, lesson.oneLineRule)
    );
    setReviewNotes((notes) =>
      notes.includes(lesson.oneLineRule) ? notes : [...notes, lesson.oneLineRule]
    );
    setOutputTokens(compareText(currentOutput.sentence, currentOutput.sentence, false));
    setOutputOutcome("revealed");
    setOutputHint(null);
  };

  // ── R5：「忆」段——遮盖回忆，凭记忆写整句 ─────────────────
  const RECALL_PASS_SCORE = 70;

  const submitRecall = () => {
    const target = lesson.recall?.answer;
    if (!target || recallOutcome !== "idle" || !recallValue.trim()) return;
    const tokens = compareText(target, recallValue, false);
    const score = diffScore(tokens);
    const nextAttempts = recallAttempts + 1;
    setRecallAttempts(nextAttempts);
    const passed = score >= RECALL_PASS_SCORE;
    recordStepResult("recall", "free_recall", 0, nextAttempts - 1, passed, target);
    if (passed) {
      setRecallOutcome("pass");
      setRecallHint(null);
    } else {
      setRecallHint(
        detectThirdPersonMiss(recallValue) ??
          describeOutputGap(recallValue, target) ??
          "这句和核心句还没对上——先对照中文意思，把结构想清楚。"
      );
    }
  };

  const revealRecall = () => {
    const target = lesson.recall?.answer;
    if (!target || recallOutcome !== "idle") return;
    recordStepResult("recall", "free_recall", 0, recallAttempts, false, target);
    updateData((latest) =>
      addLessonMistakeSentence(latest, lesson, target, lesson.recall?.noteZh ?? lesson.oneLineRule)
    );
    setRecallOutcome("revealed");
    setRecallHint(null);
  };

  /**
   * 「问一句」执行（R-AI4/R-AI6）：一次一问一答。
   * 纪律：配额用尽不发请求；未配置时入口降级为常驻提示（B1）。
   * A2（M1，2026-09-21）：失败**退还配额**并给一句可见话术——此前失败静默且扣配额，
   * 两次失败后入口永久消失而用户从未得到解释（用户反馈「按钮时有时无」的机械成因）。
   */
  const askExplain = (question: string, trigger: "preset" | "free") => {
    const trimmed = question.trim();
    if (!trimmed || !lesson || !explainContext || askLoading) return;
    if (!explainQuotaRef.current.canAsk()) return;
    const used = explainQuotaRef.current.consume();
    setQuotaLeft(explainQuotaRef.current.remaining());
    setAskLoading(true);
    setAskAnswer(null);
    setAskRated(null);
    setAskNotice(null);
    appendGrammarEvent({
      kind: "ai_explain_requested",
      lessonId: lesson.id,
      section: "watch",
      anchorRef: "watch.deepDive",
      trigger,
      questionChars: trimmed.length,
      quotaUsed: used - 1,
      ts: nowIso()
    });
    void requestLessonExplain(data.settings.aiProvider, {
      question: trimmed,
      anchorRef: "watch.deepDive",
      anchorText: `${lesson.deepDive?.title ?? ""}——${(lesson.deepDive?.paragraphs ?? [])[0] ?? ""}`,
      context: explainContext,
      // C3：带上本课此前问过的问题（≤3 条），让 AI 不重复解释同一件事
      previousQuestions: askedQuestionsRef.current.slice(-3)
    }).then((outcome) => {
      // 成功才记入记忆（失败/弃权不污染上下文）
      if (outcome.ok && outcome.answer && !outcome.answer.declined) {
        askedQuestionsRef.current = [...askedQuestionsRef.current, trimmed].slice(-3);
      }
      appendGrammarEvent({
        kind: "ai_explain_result",
        lessonId: lesson.id,
        section: "watch",
        anchorRef: "watch.deepDive",
        ok: outcome.ok,
        model: data.settings.aiProvider.model || undefined,
        latencyMs: outcome.latencyMs,
        degraded: outcome.degraded,
        degradeReason: outcome.degradeReason,
        cached: outcome.cached,
        ...(outcome.validationFailure ? { validationFailure: outcome.validationFailure } : {}),
        ...(outcome.answer?.declined ? { declined: true } : {}),
        ...(outcome.answer ? { outputChars: outcome.answer.answer.length } : {}),
        ts: nowIso()
      });
      if (outcome.ok && outcome.answer) {
        setAskAnswer(outcome.answer);
      } else {
        // 失败不消耗提问机会：退还配额并明说一句（不再静默消失）
        explainQuotaRef.current.refund();
        setQuotaLeft(explainQuotaRef.current.remaining());
        setAskNotice(
          outcome.degradeReason === "not_configured"
            ? "还没配置 AI——先看上面的讲解，配置后可以再问。"
            : "这次没接上——先看课里的讲解，等下再问也行。"
        );
      }
      setAskLoading(false);
    });
  };

  /** 回答卡三按钮反馈（有用/没讲清/讲错了）——「学习者觉得有用」是核心验收。 */
  const rateExplain = (verdict: "helpful" | "unclear" | "wrong") => {
    if (!lesson) return;
    if (askRated) return; // 已评过：每张回答卡一票（此前无守卫，重复点击污染有用率）
    setAskRated(verdict);
    appendGrammarEvent({
      kind: "ai_explain_feedback",
      lessonId: lesson.id,
      section: "watch",
      anchorRef: "watch.deepDive",
      verdict,
      ts: nowIso()
    });
  };

  /**
   * 「为什么错了」：三级解答链（R-WW1/R-WW2/R-WW3）。
   * 严格按序：L1 本地精确 → L1.5 本地近似（≥85，换序短路）→ L2 AI（独立配额 ≤1 次/题
   * + 课级保险丝 ≤2 次）→ L3 兜底话术。本地层零延迟同步；AI 层异步不阻塞任何按钮；
   * 全部失败静默落 L3（固定话术，不给任何猜测）。
   */
  const openWhyWrong = (stepIndex: number, wrongSentence: string) => {
    if (!lesson) return;
    whyWrongStepRef.current = stepIndex;
    setWhyWrongSentence(wrongSentence);
    setWhyWrongRated(null);

    const sentenceHash = hashGrammarSentence(wrongSentence);
    const localMatch = matchWhyWrong(lesson.id, wrongSentence);
    const matchSource = localMatch?.source ?? "fallback";
    // R-WW8 错句留痕：解锁「素材对真实错法的命中率」实测（此前错句不落盘，覆盖率只能猜）
    appendWhyWrongLog({ lessonId: lesson.id, stepIndex, wrongSentence, matchSource, ts: nowIso() });
    appendGrammarEvent({
      kind: "practice_why_wrong_requested",
      lessonId: lesson.id,
      stepIndex,
      section: "practice",
      sentenceHash,
      matchSource,
      ...(localMatch?.diffScoreAtMatch ? { diffScoreAtMatch: localMatch.diffScoreAtMatch } : {}),
      // A5c：上报真实配额状态（此前硬编码 available，配额护栏在数据上无法验证）
      quotaState: explainQuotaRef.current.canAsk() ? "available" : "exhausted",
      ts: nowIso()
    });

    setWhyWrongOpen(true);
    setWhyWrongAI(null);
    setWhyWrongFallback(false);

    // A3 结构解释器前置（M1）：换序错若被近似层命中，讲的是**另一个错**——
    // 实测相邻换序样本 348 命中里 138 条（39.7%）讲解完全不提「顺序」。
    // 顺序类错因本就有确定性正解（explainStructuralWhy 对换序覆盖 100%），
    // 所以 fuzzySwap 一律改走结构解释，绝不给「讲错比不讲更糟」的机会。
    const structural = explainStructuralWhy(wrongSentence, practiceStep?.answer ?? lesson.targetSentence);
    const fuzzySwap = localMatch?.source === "local_fuzzy" && structural?.kind === "swap";

    // L1/L1.5 本地命中：零延迟直接给（换序形除外，见上）
    if (localMatch && !fuzzySwap) {
      setWhyWrongMatch(localMatch);
      setWhyWrongLoading(false);
      appendGrammarEvent({
        kind: "practice_why_wrong_result",
        lessonId: lesson.id,
        stepIndex,
        sentenceHash,
        ok: true,
        source: localMatch.source,
        layer: localMatch.source === "local_exact" ? "local_exact" : "local_fuzzy",
        latencyMs: 0,
        cached: false,
        citedRef: localMatch.citedRef,
        ts: nowIso()
      });
      return;
    }

    // 换序形：结构解释已是确定性正解，不必再问 AI（也省一次课内配额）
    if (fuzzySwap) {
      setWhyWrongMatch(null);
      setWhyWrongFallback(true);
      appendGrammarEvent({
        kind: "practice_why_wrong_result",
        lessonId: lesson.id,
        stepIndex,
        sentenceHash,
        ok: true,
        source: "structural",
        layer: "structural",
        latencyMs: 0,
        cached: false,
        ts: nowIso()
      });
      return;
    }

    // 本地未命中：AI 层（已配置且课级保险丝未熔断）；否则直接 L3
    if (!aiConfigured || !explainQuotaRef.current.canAsk()) {
      setWhyWrongMatch(null);
      setWhyWrongFallback(true);
      appendGrammarEvent({
        kind: "practice_why_wrong_result",
        lessonId: lesson.id,
        stepIndex,
        sentenceHash,
        ok: true,
        source: "fallback",
        layer: "fallback",
        latencyMs: 0,
        cached: false,
        declined: true,
        ts: nowIso()
      });
      return;
    }

    setWhyWrongMatch(null);
    setWhyWrongLoading(true);
    const usedForWhyWrong = explainQuotaRef.current.consume();
    setQuotaLeft(explainQuotaRef.current.remaining());
    void requestLessonExplain(data.settings.aiProvider, {
      question: [
        `用户想说的是「${practiceStep?.promptZh ?? lesson.intentZh}」。`,
        `他拼出了「${wrongSentence}」，而正确说法是「${practiceStep?.answer ?? ""}」。`,
        "请逐词对照这两个句子，指出他这句具体哪个词放错了/多用了/漏掉了，以及那个位置为什么该用正确说法里的词。",
        "必须贴着他拼的词讲，不要复述课内通用规则。"
      ].join(""),
      anchorRef: `practice.step:${stepIndex}`,
      anchorText: lesson.oneLineRule,
      // A1（M1）：把本题正误句作为可引用素材送进白名单——否则「逐词对照」必被
      // foreign 校验打回，只剩通用复述能过检（实测答案句可引用率 27.2% 的根因）。
      context: buildLessonExplainContext(lesson.id, {
        userSentence: wrongSentence,
        correctSentence: practiceStep?.answer
      }) ?? explainContext!
    }).then((outcome) => {
      appendGrammarEvent({
        kind: "practice_why_wrong_result",
        lessonId: lesson.id,
        stepIndex,
        sentenceHash,
        ok: outcome.ok,
        source: "ai",
        layer: "ai",
        model: data.settings.aiProvider.model || undefined,
        latencyMs: outcome.latencyMs,
        cached: outcome.cached,
        declined: outcome.answer?.declined,
        ...(outcome.validationFailure ? { validationFailure: outcome.validationFailure } : {}),
        ...(outcome.answer?.citedSource ? { citedRef: outcome.answer.citedSource } : {}),
        ...(outcome.answer?.errorTag ? { errorTag: outcome.answer.errorTag } : {}),
        ts: nowIso()
      });
      if (outcome.ok && outcome.answer && !outcome.answer.declined) {
        setWhyWrongAI(outcome.answer);
      } else {
        // AI 弃权/失败/校验不过 → L3 兜底（不给任何猜测）
        setWhyWrongFallback(true);
        // A2：失败不消耗提问机会（与 askExplain 同口径）
        explainQuotaRef.current.refund();
        setQuotaLeft(explainQuotaRef.current.remaining());
      }
      setWhyWrongLoading(false);
    });
  };

  /** 错因解释反馈（误匹配率的核心度量：「讲错了」份额）。 */
  const rateWhyWrong = (verdict: "helpful" | "unclear" | "wrong") => {
    if (!lesson || whyWrongStepRef.current === null) return;
    if (whyWrongRated) return; // 已评过：防重复提交（埋点口径每卡一票）
    setWhyWrongRated(verdict);
    appendGrammarEvent({
      kind: "practice_why_wrong_feedback",
      lessonId: lesson.id,
      stepIndex: whyWrongStepRef.current,
      verdict,
      ts: nowIso()
    });
  };

  /** 收起追问层（回到静态深挖卡）。 */
  const closeAsk = () => {
    setAskOpen(false);
    setAskAnswer(null);
    setAskLoading(false);
    setAskFreeText("");
  };

  /** 收据出现后后台请求一次 AI 错因小结（只在有课程数据时）。 */
  useEffect(() => {
    if (!practiceDone || aiSummaryRequestedRef.current) return;
    aiSummaryRequestedRef.current = true;
    const facts = buildLessonSummaryFacts(data, lesson, {
      queuedSentenceCount: reviewNotes.length,
      pretestWrongCount
    });
    void requestLessonSummary(data.settings.aiProvider, facts).then((outcome) => {
      if (outcome.ok && outcome.text) setAiLessonSummary(outcome.text);
      // W1 观测：课小结 AI 结果——5 个 AI 落点里此前唯一零观测的一个（自动触发固定成本）
      appendGrammarEvent({
        kind: "lesson_summary_ai_result",
        lessonId: lesson.id,
        ok: outcome.ok,
        latencyMs: outcome.latencyMs,
        cached: outcome.cached,
        ...(outcome.degradeReason ? { degradeReason: outcome.degradeReason } : {}),
        ts: nowIso()
      });
    });
    // 只在完课那一刻请求一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceDone, lesson.id]);

  const practiceNext = () => {
    lastJudgedLengthRef.current = null;
    if (practiceIndex + 1 >= lesson.practice.length) {
      // R3 分布位点②：讲解段只放了 2 组对比，若本课对比题更多（≥3 组），
      // 练段末尾、产出题前先插入「再看两组对错」——分布到 ≥2 个位置，避免集中开头。
      const hasMidContrast = (lesson.contrast?.length ?? 0) > 2;
      if (hasMidContrast && !midContrastOpen && !outputActive) {
        setMidContrastOpen(true);
        window.scrollTo({ top: 0 });
        return;
      }
      // R04：常规练习结束后先进入「无提示输出」，完成（或看答案）后再真正完课
      if (!outputActive) {
        setOutputActive(true);
        window.scrollTo({ top: 0 });
        return;
      }
      if (outputOutcome === "idle") return;
      // R6/R11：两档产出——第 1 题完成后进入无提示题
      if (outputStep < outputPlan.length - 1) {
        advanceOutputStep();
        return;
      }
      // R01①：完课埋点（旁路，先记后置完成状态）；R23：时长 = 历史累计 + 本段（跨重启不再截断）
      const sessionStart = lessonSessionStart.get(lesson.id) ?? lessonStartRef.current;
      const totalDurationMs =
        (lessonTimeAccumulator.get(lesson.id) ?? 0) + Math.max(0, Date.now() - sessionStart);
      appendGrammarEvent({
        kind: "grammar_lesson_completed",
        lessonId: lesson.id,
        completedAt: nowIso(),
        guidedFirstTry: guidedFirstTryRef.current,
        practiceFirstTry: practiceFirstTryRef.current,
        durationMs: totalDurationMs
      });
      lessonTimeAccumulator.delete(lesson.id);
      lessonSessionStart.delete(lesson.id);
      persistLessonTime();
      lessonStartRef.current = Date.now();
      updateData((latest) => markLessonDone(latest, lesson.id));
      setPracticeDone(true);
      exitStateRef.current.sessionCompleted = true;
      // R-UX3：完课即清续学快照——这课不再需要「继续刚才」
      clearLessonResume(lesson.id);
      // R10 六段式：完课即进 ⑥ 破段（侦探挑战），小结同屏、破案后再离开
      gotoStage("challenge");
      return;
    }
    setPracticeIndex((current) => current + 1);
    setPracticePicked([]);
    setPracticeOrder([]);
    setPracticeFeedback("idle");
    setPracticeMisses(0);
    setPracticeHint(null);
    setMistakeSaved(false);
    // R-UX3：练习推进即更新跨会话快照（半路关浏览器回来能续）
    saveLessonResume(lesson.id, {
      stage: "practice",
      step: practiceIndex + 1,
      practiceIndex: practiceIndex + 1,
      outputStep: -1,
      guidedIndex: -1
    });
  };

  /** 点词成句答错时，定位第一个对不上的位置，给温和提示。 */
  const mismatchHint = (picked: string[], answer: string): string => {
    const index = firstMismatchIndex(picked, answer);
    return index === -1
      ? "还差一点点，调整一下顺序再试。"
      : `从第 ${index + 1} 个词开始有点不对。点拼装区里的词块可以移除它，换个词试试。`;
  };

  const renderArrangeArea = (stage: "guided" | "practice") => {
    const step = stage === "guided" ? guidedStep : practiceStep;
    if (!step) return null;
    // R4：展示词块 = 正确词 + 干扰项（打乱后的顺序）；点击/拖拽记录展示下标
    const tokens = arrangeTokensOf(step);
    const order = stage === "guided" ? guidedOrder : practiceOrder;
    const passed = stage === "guided" ? guidedFeedback === "pass" : practiceFeedback === "pass";
    // 词块库防作弊打乱：数据里的 tokens 常按答案顺序写，直接渲染会让「点词成句」变成顺着点一遍。
    const bankIndexes = shuffleTokenOrder(
      tokens,
      `${lesson.id}:${stage}:${stage === "guided" ? guided.index : practiceIndex}`
    );
    const add = arrangeAdd(stage);
    const remove = arrangeRemove(stage);
    const move = arrangeMove(stage);
    const undoLast = arrangeUndoLast(stage);
    const finishDrag = () => {
      setDragChip(null);
      setInsertAt(null);
    };

    return (
      <div className="lesson-arrange">
        <div
          className={`lesson-build-area${passed ? " lit" : ""}${dragChip ? " drag-over" : ""}`}
          aria-label="拼装区"
          onDragOver={(event) => {
            event.preventDefault();
            if (dragChip) setInsertAt(order.length);
          }}
          onDrop={(event) => {
            event.preventDefault();
            if (dragChip) {
              if (dragChip.from === "bank") add(dragChip.index, order.length);
              else move(dragChip.index, order.length);
            }
            finishDrag();
          }}
        >
          {order.length === 0 && <span className="lesson-build-placeholder">点下面的词块，或直接把词块拖进来</span>}
          {order.map((tokenIndex, pos) => {
            const token = tokens[tokenIndex] ?? "";
            const isDragging = dragChip?.from === "build" && dragChip.index === pos;
            return (
              <button
                type="button"
                draggable
                key={`${tokenIndex}-${pos}`}
                className={`lesson-chip built${isDragging ? " dragging" : ""}${insertAt === pos && dragChip ? " drop-before" : ""}`}
                onDragStart={(event) => {
                  setDragChip({ from: "build", index: pos });
                  event.dataTransfer.setData("text/plain", String(pos));
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={finishDrag}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (dragChip) setInsertAt(pos);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (dragChip) {
                    if (dragChip.from === "build") move(dragChip.index, pos);
                    else add(dragChip.index, pos);
                  }
                  finishDrag();
                }}
                onClick={() => remove(pos)}
                title="拖动调整位置；点一下移除"
              >
                {token}
              </button>
            );
          })}
        </div>
        <div
          className="lesson-bank"
          aria-label="词块库"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (dragChip?.from === "build") remove(dragChip.index);
            finishDrag();
          }}
        >
          {/* 多邻国式词块库：选中后原地变灰禁用，位置不消失、布局不跳；展示顺序经确定性打乱 */}
          {bankIndexes.map((tokenIndex) => {
            const token = tokens[tokenIndex] ?? "";
            const selected = order.includes(tokenIndex);
            return (
              <button
                type="button"
                key={tokenIndex}
                className={`lesson-chip${selected ? " ghost" : ""}`}
                disabled={selected}
                draggable={!selected}
                onDragStart={(event) => {
                  setDragChip({ from: "bank", index: tokenIndex });
                  event.dataTransfer.setData("text/plain", String(tokenIndex));
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={finishDrag}
                onClick={() => add(tokenIndex)}
              >
                {token}
              </button>
            );
          })}
        </div>
        <div className="lesson-arrange-tools">
          <button type="button" className="icon-button" onClick={undoLast} aria-label="移除最后一个词" title="移除最后一个词">
            <Eraser size={15} />
          </button>
          <span className="lesson-token-tools-hint">点词块选上、再点取消；拖动词块可以调整位置</span>
        </div>
      </div>
    );
  };

  // R10：段标按本课是否有「忆」段动态生成（必须在 early return 之前调用 hook）
  const hasRecallStage = Boolean(lesson?.recall);
  const stageTabs = useMemo(() => getStageTabs(hasRecallStage), [hasRecallStage]);

  const stageIndex = stageTabs.findIndex((tab) => tab.id === stage);

  return (
    <div className="page lesson-page">
      <div className="lesson-topbar lesson-topbar-sticky">
        <button type="button" className="icon-button" onClick={() => navigate("/grammar")} aria-label="返回课程地图" title="返回课程地图">
          <ArrowLeft size={17} />
        </button>
        <div className="lesson-topbar-title">
          {/*
            <h1>（2026-09-21 修）：课程正文此前零 h1——顶部标题用的是 <strong>，
            屏幕阅读器用户没有「我在哪」的锚点（其余 16 个页面都有 h1）。
            CSS 里 `.lesson-topbar-title strong` 已把它设成 display:block + 16px，
            改用 h1 后视觉不变（选择器同步为 strong, h1）。
          */}
          <h1>{lesson.episode} · {lesson.title}</h1>
          <span>
            {lesson.grammarLabel} ·{" "}
            {stage === "pretest"
              ? "课前试一试"
              : isDone
                ? "已完成，可再学一遍"
                : stageTabs[stageIndex]?.hint ?? ""}
          </span>
        </div>
        <div className="lesson-stage-dots" aria-label={stage === "pretest" ? "课前试一试" : `第 ${stageIndex + 1} / ${stageTabs.length} 段`}>
          {stageTabs.map((tab, index) => (
            <span key={tab.id} className={index === stageIndex ? "on" : ""} />
          ))}
        </div>
      </div>

      {/* R-UX4：已完课的正课页补趁热练入口——此前入口只在完课结算页与路径卡，
          学完当天回来想加练却找不到门（门禁规则不变：未完课不显示）。 */}
      {isDone && (
        <div className="lesson-boost-bar" aria-label={`第 ${lesson.number} 课趁热练档位`}>
          <span className="lesson-boost-bar-label">
            <Flame size={13} aria-hidden="true" /> 趁热练
          </span>
          {BOOST_TIERS.map((tier) => {
            const tierMeta = BOOST_TIER_META[tier];
            const tierDone = getLessonBoostTiersDone(data, lesson.id).has(tier);
            return (
              <Link
                key={tier}
                to={`/grammar/boost/${lesson.id}?tier=${tier}&from=lesson`}
                className={`lesson-boost-tier${tierDone ? " done" : ""}`}
                aria-label={`第 ${lesson.number} 课 趁热练 ${tierMeta.name}（${tierMeta.summaryZh}）`}
                onClick={() => {
                  appendGrammarEvent({
                    kind: "grammar_boost_offered",
                    lessonId: lesson.id,
                    entryPoint: "lesson",
                    recommendedTier: tier,
                    ts: nowIso()
                  });
                }}
              >
                {tierDone ? "●" : "○"} {tierMeta.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* ───────────────── ⭐ 课前试一试（Test→Teach→Test 的前测） ───────────────── */}
      {stage === "pretest" && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="课前试一试">
          {/* R08 首课导览化：纯零基础（首课且未完成任何课）不判分、纯预览，
              避免「连题干都读不懂就被考」的无力感；其余课保留原前测逻辑。 */}
          {isFirstEverLesson && !pretestFinished ? (
            <div className="lesson-complete" tabIndex={-1}>
              <Sparkles size={28} />
              <h2>先看看今天要避免的误读</h2>
              <p>下面两句是初学者最容易踩的坑。看一眼、心里有个印象就行——不考你，讲解里会揭晓。</p>
              <div className="lesson-pretest-review">
                {pretestQuestions.map((question, index) => (
                  <div className="lesson-summary-card" key={index}>
                    <p className="lesson-summary-grammar">第 {index + 1} 处 · {question.kind === "choose" ? "选对搭档" : "看出问题"}</p>
                    <p className="lesson-summary-rule">
                      {question.kind === "choose" ? question.prompt : question.sentence}
                    </p>
                  </div>
                ))}
              </div>
              <div className="lesson-stage-actions">
                <button type="button" className="primary-button" onClick={() => { setPretestFinished(true); gotoStage("watch"); }}>
                  去讲解里揭晓
                </button>
              </div>
            </div>
          ) : pretestFinished || pretestQuestions.length === 0 ? (
            <div className="lesson-complete" tabIndex={-1}>
              <Sparkles size={28} />
              {pretestQuestions.length === 0 ? (
                <>
                  <h2>开始上课</h2>
                  <div className="lesson-stage-actions">
                    <button type="button" className="primary-button" onClick={() => gotoStage("watch")}>
                      进入讲解
                    </button>
                  </div>
                </>
              ) : pretestWrongCount > 0 ? (
                <>
                  <h2>直觉不准？正好</h2>
                  <p>
                    前测里有 <strong>{pretestWrongCount}</strong> 处拿不准——这一课就是讲它们的。
                    拿不准的句子已经排进明天的复习队列。先看看是哪几处：
                  </p>
                  <div className="lesson-pretest-review">
                    {/* 有错时只展开答错的那几处：这是本课的落点，答对的题不必再占版面 */}
                    {pretestRecords
                      .filter((record) => !record.correct)
                      .map((record) => (
                        <PretestReviewCard key={`${record.order}-${record.kind}`} record={record} />
                      ))}
                  </div>
                  <div className="lesson-stage-actions">
                    <button type="button" className="primary-button" onClick={() => gotoStage("watch")}>
                      开始上课
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>全对！你已经找到感觉了</h2>
                  {/* R25：全对不等于零信息——逐题给出「为什么」，让用户自己确认是掌握了还是猜中的。
                      此前全对页只有一句结论 + 一条规则，用户没法回看每题的解析。 */}
                  <p>再看看每题为什么选它——确认一遍，接着去练身手。</p>
                  <div className="lesson-pretest-review">
                    {pretestRecords.map((record) => (
                      <PretestReviewCard key={`${record.order}-${record.kind}`} record={record} />
                    ))}
                  </div>
                  <p className="lesson-why-line">
                    <Lightbulb size={13} aria-hidden="true" /> 这一课的规矩：{lesson.oneLineRule}
                  </p>
                  <div className="lesson-stage-actions">
                    <button type="button" className="primary-button" onClick={() => gotoStage("practice")}>
                      直接去练习
                    </button>
                    <button type="button" className="secondary-button" onClick={() => gotoStage("watch")}>
                      先过一遍讲解
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            (() => {
              const question = pretestQuestions[pretestIndex];
              if (!question) return null;
              return (
                <div className="lesson-quiz-card">
                  <div className="lesson-quiz-head">
                    <span className="lesson-quiz-step">
                      课前试一试 {pretestIndex + 1} / {pretestQuestions.length}
                    </span>
                    <span className="lesson-quiz-note">不判分、不影响进度</span>
                  </div>
                  {question.kind === "choose" ? (
                    <>
                      <p className="lesson-quiz-prompt">{question.prompt}</p>
                      <div className="lesson-option-row" style={{ marginTop: 20 }}>
                        {question.options.map((option) => (
                          <button
                            type="button"
                            className="lesson-option"
                            key={option}
                            onClick={() => handlePretestPick(option)}
                            disabled={Boolean(pretestPicked)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="lesson-quiz-prompt">有人是这样说的，你觉得这句话有问题吗？</p>
                      <p className="lesson-choose-sentence" style={{ margin: "16px 0 0" }}>
                        <span>{question.sentence}</span>
                      </p>
                      <div className="lesson-option-row" style={{ marginTop: 20 }}>
                        {["没问题", "有问题"].map((option) => (
                          <button
                            type="button"
                            className="lesson-option"
                            key={option}
                            onClick={() => handlePretestPick(option)}
                            disabled={Boolean(pretestPicked)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {pretestPicked && (
                    <div className="lesson-feedback pass" aria-live="polite">
                      <p>先记住你的直觉——过完这一段就看到答案。</p>
                      <button type="button" className="primary-button" onClick={pretestNext}>
                        {pretestIndex + 1 >= pretestQuestions.length ? "看看结果" : "下一题"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </section>
      )}

      {/* ───────────────── ① 看 · 情景讲解（3 步分步） ───────────────── */}
      {stage === "watch" && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="情景讲解">
          <div className="lesson-watch-steps" aria-label={`讲解第 ${watchStep + 1} / 3 步`}>
            {watchStepNames.map((name, index) => (
              <button
                type="button"
                key={name}
                className={`lesson-watch-step${index === watchStep ? " on" : ""}`}
                onClick={() => setWatchStep(index)}
              >
                <i>{index + 1}</i> {name}
              </button>
            ))}
          </div>

          {/* 步 1 · 剧场 */}
          {watchStep === 0 && (
            <>
              <div className="lesson-hero">
                <div className="lesson-hero-art" aria-hidden="true">
                  {lesson.cover ? (
                    <img src={lesson.cover} alt="" />
                  ) : (
                    <AdventureScene scene={lesson.scene as AdventureSceneId} />
                  )}
                </div>
                <div className="lesson-hero-overlay">
                  <p className="lesson-scene-setup">{lesson.sceneSetupZh}</p>
                  {!lesson.dialogue && (
                    <>
                      <p className="lesson-scene-line">
                        <span className="lesson-scene-en">{lesson.dialogueEn}</span>
                        <SpeakButton text={lesson.dialogueEn} />
                      </p>
                      <p className="lesson-scene-zh">{lesson.dialogueZh}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="lesson-watch-body">
                {lesson.dialogue && (
                  <div className="lesson-dialogue-card">
                    {dialogueLines.map((line, index) => (
                      <div className={`lesson-dialogue-line${line.who === "me" ? " me" : ""}`} key={index}>
                        <p className="lesson-scene-line">
                          <span className="lesson-scene-en">{line.en}</span>
                          <SpeakButton text={line.en} />
                        </p>
                        <p className="lesson-scene-zh">{line.zh}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="lesson-intent">轮到你说了：<strong>{lesson.intentZh}</strong></p>
              </div>

              <div className="lesson-dock">
                <button type="button" className="primary-button" onClick={() => setWatchStep(1)}>
                  下一步：搭装与对错
                </button>
              </div>
            </>
          )}

          {/* 步 2 · 搭装与对错 */}
          {watchStep === 1 && (
            <>
              <div className="lesson-watch-body">
                <div className="lesson-build-card">
                  <p className="lesson-section-label">看这个句子是怎么搭出来的</p>
                  <div className="lesson-build-area lit" aria-label="句子搭装">
                    {lesson.blocks.map((block) => (
                      <div className="lesson-block" key={block.text}>
                        <span className="lesson-chip static">{block.text}</span>
                        <span className="lesson-block-role">{block.role}</span>
                      </div>
                    ))}
                  </div>
                  <div className="lesson-block-tools">
                    <SpeakButton text={lesson.targetSentence} />
                    <span className="lesson-token-tools-hint">听一遍完整的句子</span>
                  </div>
                </div>

                <div className="lesson-rule-card">
                  <span className="lesson-rule-label">一句话</span>
                  <p>{lesson.oneLineRule}</p>
                </div>

                {lesson.contrast && lesson.contrast.length > 0 && (
                  <div className="lesson-contrast-block">
                    <p className="lesson-section-label">有人是这样说的，你帮他看看</p>
                    {/* R3 分布位点①：讲解段只放前 2 组对比，避免一屏 6 卡造成阅读疲劳；余下分布到练段与挑战前 */}
                    {lesson.contrast.slice(0, 2).map((item, index) => (
                      <LessonContrastCard
                        key={index}
                        item={item}
                        index={index}
                        onJudge={(passed) => recordStepResult("watch", "contrast", index, passed ? 0 : 1, passed)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="lesson-dock">
                <button type="button" className="secondary-button" onClick={() => setWatchStep(0)}>
                  上一步
                </button>
                <button type="button" className="primary-button" onClick={() => setWatchStep(2)}>
                  下一步：变奏
                </button>
              </div>
            </>
          )}

          {/* 步 3 · 变奏 */}
          {watchStep === 2 && (
            <>
              <div className="lesson-watch-body">
                <div className="lesson-example-block">
                  <p className="lesson-section-label">
                    同一个说法，还能讲这些
                    {/* R-UX8：例句连播开关（默认关、偏好记忆）——回应「发音全靠手动逐个点」 */}
                    <button
                      type="button"
                      className={`lesson-autoplay-toggle${autoPlayExamples ? " on" : ""}`}
                      onClick={() => {
                        const next = !autoPlayExamples;
                        setAutoPlayExamples(next);
                        writeAutoPlayPref(next);
                        if (next) speakAllExamples(lesson.examples.map((example) => example.en));
                        else stopSpeaking();
                      }}
                      aria-pressed={autoPlayExamples}
                      title={autoPlayExamples ? "连播已开：再点一次停止" : "连播：自动依次读下面的例句"}
                    >
                      {autoPlayExamples ? "连播中 · 点停" : "连播例句"}
                    </button>
                  </p>
                  <div className="lesson-example-list">
                    {lesson.examples.map((example) => (
                      <div className="lesson-example-row" key={example.en}>
                        <div>
                          <p className="lesson-example-en">{example.en}</p>
                          <p className="lesson-example-zh">{example.zh}</p>
                        </div>
                        <SpeakButton text={example.en} />
                      </div>
                    ))}
                  </div>
                </div>

                {lesson.variants && lesson.variants.length > 0 && (
                  <div className="lesson-variant-block">
                    <p className="lesson-section-label">换三种口气说</p>
                    <div className="lesson-variant-tabs">
                      {lesson.variants.map((variant, index) => (
                        <button
                          type="button"
                          key={variant.label}
                          className={`lesson-variant-tab${index === variantTab ? " on" : ""}`}
                          onClick={() => setVariantTab(index)}
                        >
                          {variant.label}
                        </button>
                      ))}
                    </div>
                    {currentVariant && (
                      <div className="lesson-variant-body">
                        <div>
                          <p className="lesson-example-en">{currentVariant.en}</p>
                          <p className="lesson-example-zh">{currentVariant.zh}</p>
                          {currentVariant.noteZh && <p className="lesson-variant-note">{currentVariant.noteZh}</p>}
                        </div>
                        <SpeakButton text={currentVariant.en} />
                      </div>
                    )}
                  </div>
                )}

                {lesson.sceneSwings && lesson.sceneSwings.length > 0 && (
                  <div className="lesson-example-block">
                    <p className="lesson-section-label">换一个生活场景</p>
                    <div className="lesson-example-list">
                      {lesson.sceneSwings.map((swing) => (
                        <div className="lesson-example-row" key={swing.en}>
                          <div>
                            <p className="lesson-swing-scene">{swing.sceneZh}</p>
                            <p className="lesson-example-en">{swing.en}</p>
                            <p className="lesson-example-zh">{swing.zh}</p>
                          </div>
                          <SpeakButton text={swing.en} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {lesson.deepDive && (
                  <LessonDeepDiveCard
                    dive={lesson.deepDive}
                    onExpand={() => appendGrammarEvent({ kind: "deep_dive_expanded", lessonId: lesson.id, ts: nowIso() })}
                    onImpression={(mode) =>
                      appendGrammarEvent({ kind: "deep_dive_impression", lessonId: lesson.id, mode, ts: nowIso() })
                    }
                    onDwellEnd={(dwellMs) =>
                      appendGrammarEvent({
                        kind: "deep_dive_dwell",
                        lessonId: lesson.id,
                        dwellMs,
                        paragraphs: lesson.deepDive?.paragraphs.length ?? 0,
                        ts: nowIso()
                      })
                    }
                  />
                )}
                  {/* B1（M2）：未配置 AI 时入口不再整块消失——它是正课唯一把 AI 藏起来的地方。
                      改为常驻轻提示，让用户知道"有这个东西、怎么开启"，而不是以为从来没这功能。 */}
                  {!aiConfigured && (
                    <p className="lesson-ask-absent" aria-live="polite">
                      <Lightbulb size={13} aria-hidden="true" />
                      想追问这一课？在设置里填好 AI 中转站就能问（不填也能正常上课）。
                    </p>
                  )}
                  {aiConfigured && (
                    <div className="lesson-ask-block">
                      {!askOpen ? (
                        <button type="button" className="lesson-ask-entry" onClick={() => setAskOpen(true)}>
                          <Lightbulb size={14} aria-hidden="true" /> 还有想问的？问一句
                        </button>
                      ) : (
                        <div className="lesson-ask-panel">
                          {!askAnswer && !askLoading && (
                            <>
                              <p className="lesson-ask-hint">点一个想问的：</p>
                              <div className="lesson-ask-chips">
                                {presetQuestions.map((preset) => (
                                  <button
                                    type="button"
                                    className="lesson-ask-chip"
                                    key={preset.text}
                                    onClick={() => askExplain(preset.text, "preset")}
                                    disabled={!explainQuotaRef.current.canAsk()}
                                  >
                                    {preset.text}
                                  </button>
                                ))}
                              </div>
                              {explainQuotaRef.current.canAsk() && (
                                <form
                                  className="lesson-ask-free"
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    askExplain(askFreeText, "free");
                                    setAskFreeText("");
                                  }}
                                >
                                  <input
                                    value={askFreeText}
                                    onChange={(event) => setAskFreeText(event.target.value)}
                                    placeholder="或者自己打一句（最多 40 字）"
                                    maxLength={40}
                                    aria-label="自由提问"
                                  />
                                  <button type="submit" className="ghost-link" disabled={!askFreeText.trim()}>
                                    问
                                  </button>
                                </form>
                              )}
                              <button type="button" className="lesson-ask-close" onClick={closeAsk}>
                                收起
                              </button>
                            </>
                          )}
                          {askLoading && (
                            <p className="lesson-ask-loading" aria-live="polite">
                              想一想怎么讲最明白……
                            </p>
                          )}
                          {!askLoading && askNotice && (
                            <p className="lesson-ask-notice" aria-live="polite">{askNotice}</p>
                          )}
                          {askAnswer && (
                            <div className="lesson-ask-answer">
                              <p>{askAnswer.answer}</p>
                              {!askAnswer.declined && askAnswer.citedSource && (
                                <p className="lesson-ask-source">来自：{describeExplainSource(askAnswer.citedSource)}</p>
                              )}
                              <div className="lesson-ask-rating">
                                <span>这句讲得：</span>
                                {(["helpful", "unclear", "wrong"] as const).map((verdict) => (
                                  <button
                                    type="button"
                                    key={verdict}
                                    className={`lesson-ask-rate${askRated === verdict ? " rated" : ""}`}
                                    onClick={() => rateExplain(verdict)}
                                  >
                                    {verdict === "helpful" ? "有用" : verdict === "unclear" ? "没讲清" : "讲错了"}
                                  </button>
                                ))}
                                {askRated && <span className="lesson-ask-rated-note">收到，谢谢反馈</span>}
                              </div>
                              <div className="lesson-ask-actions">
                                {explainQuotaRef.current.canAsk() ? (
                                  <button type="button" className="ghost-link" onClick={() => { setAskAnswer(null); }}>
                                    再问一个（还剩 {quotaLeft} 次）
                                  </button>
                                ) : (
                                  <span className="lesson-ask-done">今天这课先问到这儿</span>
                                )}
                                <button type="button" className="lesson-ask-close" onClick={closeAsk}>
                                  收起
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </div>

              <div className="lesson-dock">
                <button type="button" className="secondary-button" onClick={() => setWatchStep(1)}>
                  上一步
                </button>
                {/* R08：前测全对（非首课）给「可快进」出口——已会的内容不必走完引导题 */}
                {!isFirstEverLesson && pretestWrongCount === 0 && pretestFinished && (
                  <button type="button" className="secondary-button" onClick={() => gotoStage("practice")}>
                    已会，直接去练习
                  </button>
                )}
                <button type="button" className="primary-button" onClick={() => gotoStage("guided")}>
                  看懂了，试一试
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* ───────────────── ② 跟 · 试一试 ───────────────── */}
      {stage === "guided" && guidedStep && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="试一试">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">第 {guided.index + 1} / {guidedDisplayOrderMemo.length} 题</span>
              <span className="lesson-quiz-note">{guidedStep.kind === "spot" ? "找出藏起来的小问题，随便点" : "几乎不会错，放心点"}</span>
            </div>
            <p className="lesson-quiz-prompt">{guidedStep.promptZh}</p>

            {guidedStep.kind === "spot" ? (
              <div className="lesson-spot" aria-label="找一找">
                <div className="lesson-spot-row">
                  {(guidedStep.tokens ?? []).map((token, index) => (
                    <button
                      type="button"
                      className="lesson-chip"
                      key={`${token}-${index}`}
                      onClick={() => guidedPickOption(token)}
                      disabled={guidedFeedback === "pass"}
                    >
                      {token}
                    </button>
                  ))}
                </div>
                {guidedFeedback === "retry" && <p className="lesson-spot-hint">这一块看起来没问题，再点点别的词块。</p>}
              </div>
            ) : guidedStep.kind === "choose" || guidedStep.kind === "replace" ? (
              <div className="lesson-choose" style={{ display: "grid", gap: 20 }}>
                {guidedStep.kind === "replace" ? (
                  /* R9 变形/替换题：展示原句 + 替换提示，选项行与 choose 共用 */
                  <p className="lesson-choose-sentence">
                    <span className="lesson-replace-base">{guidedStep.replaceBase}</span>
                    <span className="lesson-replace-arrow"> → {guidedStep.replaceTarget}：</span>
                    <span className="lesson-choose-blank">{guided.picked[0] ?? "＿＿"}</span>
                  </p>
                ) : (
                  <p className="lesson-choose-sentence">
                    <span>{guidedStep.before}</span>
                    <span className="lesson-choose-blank">
                      {guided.picked[0] ?? "＿＿"}
                    </span>
                    <span>{guidedStep.after}</span>
                  </p>
                )}
                <div className="lesson-option-row">
                  {(guidedStep.options ?? []).map((option) => (
                    <button
                      type="button"
                      className="lesson-option"
                      key={option}
                      onClick={() => guidedPickOption(option)}
                      disabled={guidedFeedback === "pass"}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              renderArrangeArea("guided")
            )}

            {guidedFeedback === "pass" && (
              <div className="lesson-feedback pass" aria-live="polite">
                <p>
                  <CheckCircle2 size={16} />
                  {guidedStep.correctionZh ? <span> {guidedStep.correctionZh} </span> : " "}
                  {guidedExplainResolved}
                  {mistakeSaved && <span className="lesson-saved-hint">（刚才错过的句子已进入复习队列）</span>}
                </p>
                <button type="button" className="primary-button" onClick={guidedNext}>
                  {guided.index + 1 >= guidedDisplayOrderMemo.length ? "下面自己来" : "下一题"}
                </button>
              </div>
            )}
            {guidedFeedback === "retry" && (
              <div className="lesson-feedback retry" aria-live="polite">
                <p>{guidedHint ?? "很接近了。再看看提示，换一个试试。"}</p>
                {/*
                  兜底出口：与 practice 段保持一致（那边错 1 次就给「照着拼一遍」）。
                  条件写成 >= 1 而不是 >= 2：实测一次错序会触发两次判题（摆满时判一次、
                  effect 重跑再判一次），用 >= 2 会变成「第 1 次错就出现」——
                  与其让阈值名不符实，不如按实际节奏定成「错一次给出口」。
                */}
                {guidedMisses >= 1 && (
                  <div className="lesson-stage-actions center">
                    <button type="button" className="ghost-link" onClick={revealGuided}>
                      想不起来了，照着拼一遍
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lesson-stage-actions center">
            <button type="button" className="ghost-link" onClick={() => reread("watch")}>
              回去再看一遍讲解
            </button>
          </div>
        </section>
      )}

      {/* ───────────────── ③ 忆 · 遮盖回忆（R5，六段式新增段） ───────────────── */}
      {stage === "recall" && lesson.recall && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="凭记忆写">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">凭记忆写出来</span>
              <span className="lesson-quiz-note">没有选项，全靠自己——写错了也没关系</span>
            </div>
            <p className="lesson-quiz-prompt">{lesson.recall.promptZh}</p>
            <p className="lesson-quiz-note" style={{ margin: "8px 0 0", lineHeight: 1.8 }}>
              这句要说的是：<strong>{lesson.recall.intentZh}</strong>
            </p>

            {recallOutcome === "idle" ? (
              <>
                <div className="answer-box">
                  <textarea
                    className="large-textarea"
                    value={recallValue}
                    onChange={(event) => setRecallValue(event.target.value)}
                    onKeyDown={(event) => {
                      // R5 忆段：回车直接提交（Shift+Enter 换行；输入法组词态的回车不触发）
                      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                        event.preventDefault();
                        if (recallValue.trim()) submitRecall();
                      }
                    }}
                    placeholder="Type in English…（回车提交）"
                    rows={2}
                    aria-label="英文输入区"
                  />
                </div>
                <div className="lesson-stage-actions center">
                  <button type="button" className="primary-button" onClick={submitRecall} disabled={!recallValue.trim()}>
                    提交
                  </button>
                </div>
                {recallAttempts > 0 && recallHint && (
                  <div className="lesson-feedback retry" aria-live="polite">
                    <p>{recallHint}</p>
                    {recallAttempts >= 2 && (
                      <div className="lesson-stage-actions center">
                        <button type="button" className="ghost-link" onClick={revealRecall}>
                          想不起来，看答案
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="lesson-feedback pass" aria-live="polite">
                <p>
                  <CheckCircle2 size={16} />
                  {recallOutcome === "pass" ? "凭记忆写出来了——这就是真的记住！" : "正确说法："}{" "}
                  <strong>{lesson.recall.answer}</strong>
                  {recallOutcome === "revealed" && (
                    <span className="lesson-saved-hint">（这句已排进明天的复习队列）</span>
                  )}
                </p>
                <p className="lesson-contrast-why">{lesson.recall.noteZh ?? lesson.oneLineRule}</p>
                <button type="button" className="primary-button" onClick={() => gotoStage("practice")}>
                  进入练习
                </button>
              </div>
            )}
          </div>

          <div className="lesson-stage-actions center">
            <button type="button" className="ghost-link" onClick={() => reread("watch")}>
              回去再看一眼讲解
            </button>
          </div>
        </section>
      )}

      {/* ───────────────── R-UX2/R-UX3：进度恢复二选一卡 ───────────────── */}
      {/* 回看讲解返回 / 跨会话重进时出现；不依赖当前段（跨会话时页面还停在课前测）。
          「继续」跳到 practice 恢复进度，「重新开始」清快照走原路径。 */}
      {resumeOffer && !practiceDone && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="继续刚才的进度">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">继续刚才的进度</span>
              <span className="lesson-quiz-note">
                {resumeSourceRef.current === "reread" ? "从讲解回来" : "上次学到这"}
              </span>
            </div>
            <p className="lesson-quiz-prompt">
              刚才练到 <strong>第 {Math.max(0, resumeOffer.practiceIndex) + 1} 题</strong>
              {resumeOffer.outputStep >= 0 ? "（含「说出来」环节）" : ""}——接着练，还是从头来？
            </p>
            <div className="lesson-stage-actions center">
              <button type="button" className="primary-button" onClick={() => applyResume(resumeOffer)}>
                继续刚才
              </button>
              <button type="button" className="ghost-link" onClick={discardResume}>
                重新开始
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── ④ 练 · 自己来 ───────────────── */}
      {/* ───────────────── R3 分布位点② · 练段末尾再看两组对错 ───────────────── */}
      {stage === "practice" && midContrastOpen && !outputActive && !practiceDone && !resumeOffer && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="再看两组对错">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">练完一轮，再帮他看看这两句</span>
              <span className="lesson-quiz-note">挑出对的那句——错的能说出哪不对就更稳了</span>
            </div>
            <div className="lesson-contrast-block">
              {(lesson.contrast ?? []).slice(2, 4).map((item, offset) => {
                const index = offset + 2;
                return (
                  <LessonContrastCard
                    key={index}
                    item={item}
                    index={index}
                    onJudge={(passed) =>
                      recordStepResult(
                        "practice",
                        "contrast",
                        index,
                        passed ? 0 : 1,
                        passed,
                        undefined,
                        settleStepTiming(`contrast:${lesson.id}:${index}`)
                      )
                    }
                  />
                );
              })}
            </div>
            <div className="lesson-stage-actions center">
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setMidContrastOpen(false);
                  setOutputActive(true);
                  window.scrollTo({ top: 0 });
                }}
              >
                最后一步：说出来
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === "practice" && practiceStep && !practiceDone && !outputActive && !midContrastOpen && !resumeOffer && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="自己来">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">第 {practiceIndex + 1} / {lesson.practice.length} 题</span>
              <span className="lesson-quiz-note">
                {practiceStep.distractors?.length
                  ? "词块库里混进了干扰项——只挑你要用的词"
                  : "这次没有干扰项，全靠自己"}
              </span>
            </div>
            <p className="lesson-quiz-prompt">{practiceStep.promptZh}</p>

            {renderArrangeArea("practice")}

            {practiceFeedback === "pass" && (
              <div className="lesson-feedback pass" aria-live="polite">
                <p>
                  <CheckCircle2 size={16} /> 就是这句！<strong>{practiceStep.answer}</strong>
                  {mistakeSaved && <span className="lesson-saved-hint">（已进入复习队列，明天会再见到它）</span>}
                </p>
                {/* R-AI1：答对也讲「为什么」——用户原话「只给答案学不到下次怎么用」。
                    practice 无 explain 字段（types LessonPracticeStep），从本课素材三级回退：
                    与答案句一致的 contrast.whyZh → 与其他句一致的 → oneLineRule。 */}
                <p className="lesson-why-line">
                  <Lightbulb size={13} aria-hidden="true" /> {practiceWhy}
                </p>
                <button type="button" className="primary-button" onClick={practiceNext}>
                  {practiceIndex + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题"}
                </button>
              </div>
            )}
            {practiceFeedback === "retry" && (
              <div className="lesson-feedback retry" aria-live="polite">
                {/* R-WW2：位置提示始终给；「问为什么 / 照着拼」阶梯错 1 次即出——
                    用户反馈：自己觉得没拼错时也要能立刻问，不该等错满 2 次 */}
                <p className={practiceMisses >= 2 || lastAttemptUsedDistractor ? "lesson-hint-minor" : undefined}>
                  {practiceHint ?? "顺序还差一点。提示：先说「谁」，再说「怎么样 / 做什么」。"}
                </p>
                {(practiceMisses >= 1 || lastAttemptUsedDistractor) && (
                  <>
                    {!whyWrongOpen && (
                      <div className="lesson-stage-actions center">
                        <button
                          type="button"
                          className="lesson-whywrong-entry"
                          onClick={() =>
                            openWhyWrong(
                              practiceIndex,
                              practiceOrder.map((tokenIndex) => arrangeTokensOf(practiceStep)[tokenIndex] ?? "").join(" ")
                            )
                          }
                        >
                          <Lightbulb size={13} aria-hidden="true" /> 为什么我拼的不对？
                        </button>
                      </div>
                    )}
                    {whyWrongOpen && whyWrongStepRef.current === practiceIndex && (
                      <div className="lesson-whywrong-panel" aria-live="polite">
                        {whyWrongLoading && <p className="lesson-ask-loading">想一想你这句错在哪一类……</p>}
                        {whyWrongMatch && (
                          <div className="lesson-whywrong-answer">
                            {whyWrongSentence && (
                              <div className="lesson-whywrong-compare">
                                <p className="lesson-whywrong-mine">你拼的：<strong>{whyWrongSentence}</strong></p>
                                <p className="lesson-whywrong-right">正确说法：<strong>{whyWrongMatch.correctSentence ?? practiceStep?.answer}</strong></p>
                              </div>
                            )}
                            <p>{whyWrongMatch.whyZh}</p>
                            <p className="lesson-ask-source">来自：这一课的辨析</p>
                            <div className="lesson-ask-rating">
                              <span>这句讲得：</span>
                              {(["helpful", "unclear", "wrong"] as const).map((verdict) => (
                                <button
                                  type="button"
                                  key={verdict}
                                  className={`lesson-ask-rate${whyWrongRated === verdict ? " rated" : ""}`}
                                  onClick={() => rateWhyWrong(verdict)}
                                >
                                  {verdict === "helpful" ? "有用" : verdict === "unclear" ? "没讲清" : "讲错了"}
                                </button>
                              ))}
                              {whyWrongRated && <span className="lesson-ask-rated-note">收到，谢谢反馈</span>}
                            </div>
                            {whyWrongMatch.correctSentence && (
                              <p className="lesson-whywrong-correct">
                                正确说法（不自动揭示，自己拼出来才算）：<strong>{whyWrongMatch.correctSentence}</strong>
                              </p>
                            )}
                            <button type="button" className="lesson-ask-close" onClick={() => { setWhyWrongOpen(false); }}>
                              收起，再试一遍
                            </button>
                          </div>
                        )}
                        {whyWrongAI && (
                          <div className="lesson-whywrong-answer">
                            {whyWrongSentence && (
                              <div className="lesson-whywrong-compare">
                                <p className="lesson-whywrong-mine">你拼的：<strong>{whyWrongSentence}</strong></p>
                                <p className="lesson-whywrong-right">正确说法：<strong>{practiceStep?.answer}</strong></p>
                              </div>
                            )}
                            <p>{whyWrongAI.answer}</p>
                            <p className="lesson-ask-source">来自：{describeExplainSource(whyWrongAI.citedSource)}</p>
                            <div className="lesson-ask-rating">
                              <span>这句讲得：</span>
                              {(["helpful", "unclear", "wrong"] as const).map((verdict) => (
                                <button
                                  type="button"
                                  key={verdict}
                                  className={`lesson-ask-rate${whyWrongRated === verdict ? " rated" : ""}`}
                                  onClick={() => rateWhyWrong(verdict)}
                                >
                                  {verdict === "helpful" ? "有用" : verdict === "unclear" ? "没讲清" : "讲错了"}
                                </button>
                              ))}
                              {whyWrongRated && <span className="lesson-ask-rated-note">收到，谢谢反馈</span>}
                            </div>
                            <button type="button" className="lesson-ask-close" onClick={() => { setWhyWrongOpen(false); }}>
                              收起，再试一遍
                            </button>
                          </div>
                        )}
                        {whyWrongFallback && (
                          <div className="lesson-whywrong-fallback">
                            {(() => {
                              // 兜底也要讲「为什么不对」：错句和答案都是已知词块，
                              // 多词/缺词/换序/用错词在本地就能确定性说出来，不让用户空手猜。
                              const wrongSentence = practiceOrder
                                .map((tokenIndex) => arrangeTokensOf(practiceStep)[tokenIndex] ?? "")
                                .join(" ");
                              const structural = explainStructuralWhy(wrongSentence, practiceStep.answer);
                              return (
                                <>
                                  {whyWrongSentence && (
                                    <div className="lesson-whywrong-compare">
                                      <p className="lesson-whywrong-mine">你拼的：<strong>{whyWrongSentence}</strong></p>
                                      <p className="lesson-whywrong-right">正确说法：<strong>{practiceStep?.answer}</strong></p>
                                    </div>
                                  )}
                                  <p>
                                    {structural
                                      ? structural.whyZh
                                      : "答案不对哦——再检查一下。"}
                                  </p>
                                  {structural && (
                                    <p className="lesson-whywrong-fallback-hint">
                                      照着这个拼：<strong>{structural.answer}</strong>
                                    </p>
                                  )}
                                  {!structural && (
                                    <p className="lesson-whywrong-fallback-hint">先照着拼一遍，明天复习会再见到它。</p>
                                  )}
                                </>
                              );
                            })()}
                            <button type="button" className="lesson-ask-close" onClick={() => { setWhyWrongOpen(false); }}>
                              收起
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="lesson-stage-actions center">
                      <button type="button" className="ghost-link" onClick={revealPractice}>
                        想不起来了，照着拼一遍
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="lesson-stage-actions center">
            <button type="button" className="ghost-link" onClick={() => reread("watch")}>
              回去再看一遍讲解
            </button>
          </div>
        </section>
      )}

      {/* ───────────────── ⑤ 产 · 两档产出（R6/R11：半提示 → 无提示） ───────────────── */}
      {stage === "practice" && outputActive && !practiceDone && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="说出来">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">
                最后一步 · 说出来（{outputStep + 1} / {outputPlan.length}）
              </span>
              <span className="lesson-quiz-note">
                {currentOutput.skeleton ? "给你句型框，把句子补完整" : "没有中文提示，全靠自己"}
              </span>
            </div>
            <p className="lesson-quiz-prompt">
              这一幕里轮到小美说话。凭记忆，按这一课的句型写出她要说的那句话——不是同学问她的那一句。
            </p>
            {currentOutput.skeleton && (
              <p className="lesson-quiz-note" style={{ margin: "8px 0 0", lineHeight: 1.8 }}>
                这句要说的是：<strong>{halfPromptIntentZh}</strong>
                <br />
                句型框：<strong>{outputSkeleton(currentOutput.sentence)}</strong>
              </p>
            )}

            {outputOutcome === "idle" ? (
              <>
                <div className="answer-box">
                  <textarea
                    className="large-textarea"
                    value={outputValue}
                    onChange={(event) => setOutputValue(event.target.value)}
                    onKeyDown={(event) => {
                      // 回车直接提交（Shift+Enter 换行；输入法组词态的回车不触发）
                      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                        event.preventDefault();
                        if (outputValue.trim()) submitOutput();
                      }
                    }}
                    placeholder="Type in English…（回车提交）"
                    rows={2}
                    aria-label="英文输入区"
                  />
                </div>
                <div className="lesson-stage-actions center">
                  <button type="button" className="primary-button" onClick={submitOutput} disabled={!outputValue.trim()}>
                    提交
                  </button>
                </div>

                {/* 提示阶梯：首答仍然无提示（保住「无提示首次通过」的度量），想不起来才逐级给台阶 */}
                {outputHintLevel === 0 && (
                  <div className="lesson-stage-actions center">
                    <button type="button" className="ghost-link" onClick={() => { setOutputHintLevel(1); appendGrammarEvent({ kind: "output_hint_step", lessonId: lesson.id, stepIndex: outputStep, level: 1 as 1 | 2 | 3, resolvedBy: "hint", ts: nowIso() }); }}>
                      想不起来？给我一点提示
                    </button>
                  </div>
                )}
                {outputHintLevel === 1 && (
                  <div className="lesson-feedback retry" aria-live="polite">
                    <p>
                      这句要说的是：{outputStep === 0 ? halfPromptIntentZh : lesson.intentZh}
                      <br />
                      按这一课的核心句写，一共 {currentOutput.sentence.split(/\s+/).filter(Boolean).length} 个词。
                    </p>
                    <div className="lesson-stage-actions center">
                      <button type="button" className="ghost-link" onClick={() => { setOutputHintLevel(2); appendGrammarEvent({ kind: "output_hint_step", lessonId: lesson.id, stepIndex: outputStep, level: 2 as 1 | 2 | 3, resolvedBy: "hint", ts: nowIso() }); }}>
                        还是想不起来，再看一点
                      </button>
                    </div>
                  </div>
                )}
                {outputHintLevel === 2 && (
                  <div className="lesson-feedback retry" aria-live="polite">
                    <p>
                      开头和词数给你：<strong>{outputSkeleton(currentOutput.sentence)}</strong>
                    </p>
                    <div className="lesson-stage-actions center">
                      <button type="button" className="ghost-link" onClick={() => { setOutputHintLevel(3); appendGrammarEvent({ kind: "output_hint_step", lessonId: lesson.id, stepIndex: outputStep, level: 3 as 1 | 2 | 3, resolvedBy: "hint", ts: nowIso() }); }}>
                        还是想不起来，直接看答案
                      </button>
                    </div>
                  </div>
                )}
                {outputHintLevel >= 3 && (
                  <div className="lesson-feedback retry" aria-live="polite">
                    <p>
                      正确答案：<strong>{currentOutput.sentence}</strong>
                    </p>
                    <div className="lesson-stage-actions center">
                      <button type="button" className="ghost-link" onClick={revealOutput}>
                        照着打一遍（会排进复习队列）
                      </button>
                    </div>
                  </div>
                )}

                {/* R-WW10：output 场景错因追问——自由文本精确匹配趋近零，AI 为主；
                    错 1 次即出（用户反馈：觉得自己没错时应该随时能问） */}
                {outputAttempts >= 1 && outputOutcome === "idle" && (
                  <div className="lesson-stage-actions center">
                    {!whyWrongOpen && !whyWrongAskedStepsRef.current.has(100 + outputStep) && (
                      <button
                        type="button"
                        className="lesson-whywrong-entry"
                        onClick={() => openWhyWrong(100 + outputStep, outputValue.trim())}
                      >
                        <Lightbulb size={13} aria-hidden="true" /> 为什么这句总写不对？
                      </button>
                    )}
                    {whyWrongOpen && whyWrongStepRef.current === 100 + outputStep && (
                      <div className="lesson-whywrong-panel" aria-live="polite">
                        {whyWrongLoading && <p className="lesson-ask-loading">想一想你这句错在哪一类……</p>}
                        {whyWrongAI && (
                          <div className="lesson-whywrong-answer">
                            {whyWrongSentence && (
                              <div className="lesson-whywrong-compare">
                                <p className="lesson-whywrong-mine">你写的：<strong>{whyWrongSentence}</strong></p>
                                <p className="lesson-whywrong-right">正确说法：<strong>{currentOutput?.sentence}</strong></p>
                              </div>
                            )}
                            <p>{whyWrongAI.answer}</p>
                            <p className="lesson-ask-source">来自：{describeExplainSource(whyWrongAI.citedSource)}</p>
                            <div className="lesson-ask-rating">
                              <span>这句讲得：</span>
                              {(["helpful", "unclear", "wrong"] as const).map((verdict) => (
                                <button
                                  type="button"
                                  key={verdict}
                                  className={`lesson-ask-rate${whyWrongRated === verdict ? " rated" : ""}`}
                                  onClick={() => rateWhyWrong(verdict)}
                                >
                                  {verdict === "helpful" ? "有用" : verdict === "unclear" ? "没讲清" : "讲错了"}
                                </button>
                              ))}
                              {whyWrongRated && <span className="lesson-ask-rated-note">收到，谢谢反馈</span>}
                            </div>
                            <button type="button" className="lesson-ask-close" onClick={() => { setWhyWrongOpen(false); }}>
                              收起
                            </button>
                          </div>
                        )}
                        {whyWrongFallback && (
                          <div className="lesson-whywrong-fallback">
                            {(() => {
                              // 兜底也讲结构错因：与 practice 同一解释器，AI 不可用不空手
                              const structural = explainStructuralWhy(outputValue.trim(), currentOutput.sentence);
                              return (
                                <>
                                  {whyWrongSentence && (
                                    <div className="lesson-whywrong-compare">
                                      <p className="lesson-whywrong-mine">你写的：<strong>{whyWrongSentence}</strong></p>
                                      <p className="lesson-whywrong-right">正确说法：<strong>{currentOutput?.sentence}</strong></p>
                                    </div>
                                  )}
                                  <p>{structural ? structural.whyZh : "这句和核心句还没对上——对照下面的差异提示再试一次。"}</p>
                                  {structural && (
                                    <p className="lesson-whywrong-fallback-hint">
                                      照着这个写：<strong>{structural.answer}</strong>
                                    </p>
                                  )}
                                </>
                              );
                            })()}
                            <button type="button" className="lesson-ask-close" onClick={() => { setWhyWrongOpen(false); }}>
                              收起
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {outputAttempts > 0 && outputHint && (
                  <div className="lesson-feedback retry" aria-live="polite">
                    <p>{outputHint}</p>
                    {outputTokens && outputTokens.some((token) => token.status === "match" || token.status === "spelling") && (
                      <p className="lesson-output-diff">
                        {outputTokens.map((token, index) => (
                          <span key={index} className={`diff-token ${token.status}`}>
                            {token.token}{" "}
                          </span>
                        ))}
                      </p>
                    )}
                    {outputHintLevel >= 1 && (
                      <div className="lesson-stage-actions center">
                        <button type="button" className="ghost-link" onClick={revealOutput}>
                          想不起来了，看答案
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="lesson-feedback pass" aria-live="polite">
                <p>
                  <CheckCircle2 size={16} />
                  {outputOutcome === "pass" ? "完全是自己写出来的！" : "没关系，先看正确说法："}{" "}
                  <strong>{currentOutput.sentence}</strong>
                  {outputOutcome === "revealed" && (
                    <span className="lesson-saved-hint">（这句已排进明天的复习队列）</span>
                  )}
                </p>
                <p className="lesson-why-line">
                  <Lightbulb size={13} aria-hidden="true" /> {outputWhy}
                </p>
                {/* R-UX5：出答案句后的可选跟读——零判分、可跳过、不阻塞（不进必经路径） */}
                <SpeakAloudCard lessonId={lesson.id} step={outputStep} sentence={currentOutput.sentence} />
                <button type="button" className="primary-button" onClick={practiceNext}>
                  {outputStep < outputPlan.length - 1 ? "下一句（这次没有提示）" : "完成这一课"}
                </button>
              </div>
            )}
          </div>

          <div className="lesson-stage-actions center">
            <button type="button" className="ghost-link" onClick={() => reread("watch")}>
              回去再看一眼讲解
            </button>
          </div>
        </section>
      )}

      {/* ───────────────── 完课 · 确证仪式（R05 价值收据） ───────────────── */}
      {practiceDone && (stage === "practice" || stage === "challenge") && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="课程完成">
          <div className="lesson-complete" ref={receiptRef} tabIndex={-1}>
            <header className="complete-hero">
              {/* G1 角标：本季进度悬在右上角，绝对定位脱离内容流——不与标题、说明争同一行 */}
              {seasonProgress && (
                <div className="hero-corner" aria-label={`${seasonProgress.season.label} 本季第 ${seasonProgress.index} / ${seasonProgress.total} 课`}>
                  <span className="hero-corner-season">{seasonProgress.season.label}</span>
                  <span className="hero-corner-dots" aria-hidden="true">
                    {Array.from({ length: seasonProgress.total }, (_, dotIndex) => (
                      <i key={dotIndex} className={dotIndex < seasonProgress.index ? "dot on" : "dot"} />
                    ))}
                  </span>
                  <span className="hero-corner-sub">本季第 {seasonProgress.index} / {seasonProgress.total} 课</span>
                </div>
              )}
              <div className="complete-hero-main">
                <span className="complete-hero-badge">
                  <CheckCircle2 size={26} strokeWidth={2.4} />
                </span>
                <div className="complete-hero-text">
                  <h2>第 {lesson.number} 课完成</h2>
                  <p className="complete-hero-sub">
                    一课一课积累，你已经能用英语介绍自己、讲正在做的事、说明天的计划。
                  </p>
                </div>
              </div>
            </header>

            <div className="complete-receipt">
              {/* ✅ 掌握了什么 */}
              <section className="receipt-block">
                <h3 className="receipt-block-title">
                  <span className="receipt-block-icon gain" aria-hidden="true">
                    <CheckCircle2 size={14} strokeWidth={2.6} />
                  </span>
                  这一课掌握了什么
                </h3>
                {/* E1 规则两行条：summary.points 原格式是「例句 —— 说明」，
                    拆成【条件胶囊 → 动作大字 → 例句】三段横向铺开，规则从「一句话」变成「看得懂的对照」。
                    数据仍是原样（零内容改动）：说明按「——」取「条件 → 动作」，没有分隔符时整句进动作位。 */}
                <div className="receipt-card gain">
                  <span className="receipt-chip">{lesson.grammarLabel}</span>
                  {lesson.summary ? (
                    <>
                      <p className="receipt-rule">
                        <span className="lesson-rule-label">一句话</span>
                        {lesson.summary.rule}
                      </p>
                      <ul className="rule-rows">
                        {lesson.summary.points.map((point) => {
                          const splitAt = point.indexOf("——");
                          const example = splitAt >= 0 ? point.slice(0, splitAt).trim() : "";
                          const note = splitAt >= 0 ? point.slice(splitAt + 2).trim() : point.trim();
                          // 「条件 → 动作」：仅当冒号后还有实义内容时才拆胶囊（如「问对方：Do 搬到句首」）。
                          // 全库实测：382/474 条说明没有冒号——那些整句进动作位，硬拆会碎成读不通的两段。
                          const colonAt = note.search(/[：:]/);
                          const hasSplit = colonAt > 0 && note.slice(colonAt + 1).trim().length >= 2;
                          const cond = hasSplit ? note.slice(0, colonAt).trim() : "";
                          const action = hasSplit ? note.slice(colonAt + 1).trim() : note;
                          return (
                            <li className="rule-row" key={point}>
                              {cond && <span className="rule-cap">{cond}</span>}
                              <span className="rule-act">{action}</span>
                              {example && <span className="rule-eg">{example}</span>}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <p className="receipt-rule">{lesson.oneLineRule}</p>
                  )}
                </div>
              </section>

              {/* 🗣️ 你现在能说出哪几个新句子 */}
              <section className="receipt-block">
                <h3 className="receipt-block-title">
                  <span className="receipt-block-icon speak" aria-hidden="true">
                    <Volume2 size={14} strokeWidth={2.6} />
                  </span>
                  你现在能说出这些新句子
                </h3>
                <div className="receipt-card speak">
                  <ul className="receipt-sentences">
                    {/* 核心句行：变体里若已有与它完全相同的句子（多是「肯定」），把那个标签并到这里，
                        不再单独重复一行——旧版会把同一句话显示两次。 */}
                    {(() => {
                      const targetNormalized = normalizeLessonSentence(lesson.targetSentence);
                      const variants = lesson.variants ?? [];
                      const labelForTarget = variants.find(
                        (variant) => normalizeLessonSentence(variant.en) === targetNormalized
                      )?.label;
                      const restVariants = variants.filter(
                        (variant) => normalizeLessonSentence(variant.en) !== targetNormalized
                      );
                      return (
                        <>
                          <li>
                            <span className="receipt-sentence-text">
                              {labelForTarget && <em className="receipt-sentence-label">{labelForTarget}</em>}
                              {lesson.targetSentence}
                            </span>
                            <SpeakButton text={lesson.targetSentence} />
                          </li>
                          {restVariants.map((variant) => (
                            <li key={variant.en}>
                              <span className="receipt-sentence-text">
                                <em className="receipt-sentence-label">{variant.label}</em>
                                {variant.en}
                              </span>
                              <SpeakButton text={variant.en} />
                            </li>
                          ))}
                        </>
                      );
                    })()}
                  </ul>
                </div>
              </section>

              {/* ⚠️ 还差什么 */}
              <section className="receipt-block">
                <h3 className="receipt-block-title">
                  <span className="receipt-block-icon gap" aria-hidden="true">
                    <Flag size={13} strokeWidth={2.6} />
                  </span>
                  还差什么
                </h3>
                <div className="receipt-card gap">
                  {reviewNotes.length > 0 ? (
                    <ul className="receipt-points">
                      {reviewNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="receipt-rule">本课没有留下漏洞——真棒。</p>
                  )}
                  {pretestWrongCount > 0 && (
                    <p className="receipt-rule">
                      前测里拿不准的 {pretestWrongCount} 处，这一课已经讲过、也练过了。
                    </p>
                  )}
                  {aiLessonSummary && (
                    <p className="receipt-ai-summary">
                      <Sparkles size={13} aria-hidden="true" />
                      {aiLessonSummary}
                    </p>
                  )}
                  <p className="receipt-queue-note">
                    上面这些句子已排进复习队列，明天会自动来见你
                    {/* 走查修复：刚上完课时队列里通常没有到期卡（次日才到期），
                        「去复习」会落到 0/0 空页面。有到期卡才给这个出口，否则指向能立刻练的重练课。 */}
                    {receiptDueReviewCount > 0 ? (
                      <Link to="/grammar/review" className="receipt-queue-link">
                        去复习 · {receiptDueReviewCount} 张
                      </Link>
                    ) : (
                      <Link to="/grammar/replay" className="receipt-queue-link">
                        练个弱点
                      </Link>
                    )}
                  </p>
                </div>
              </section>
            </div>

            {/* R3 分布位点③ · 挑战前最后一轮对错（剩余对比组，去破案前再稳一次） */}
            {(lesson.contrast?.length ?? 0) > 4 && (
              <div className="lesson-contrast-block">
                <p className="lesson-section-label">去破案之前，最后再帮他看两句</p>
                {(lesson.contrast ?? []).slice(4).map((item, offset) => {
                  const index = offset + 4;
                  return (
                    <LessonContrastCard
                      key={index}
                      item={item}
                      index={index}
                      onJudge={(passed) => recordStepResult("challenge", "contrast", index, passed ? 0 : 1, passed)}
                    />
                  );
                })}
              </div>
            )}

            <div className="lesson-stage-actions">
              {/* R-B5：「趁热练」是完课当下的唯一推荐位——此处情绪最高、且有"还差什么"的未闭合块。
                  原有「去挑战 / 下一课」降为次级（仍可达），避免 4 个平级动作互相稀释。 */}
              <Link
                to={`/grammar/boost/${lesson.id}?tier=1&from=receipt`}
                className="primary-button"
                onClick={() => {
                  if (!settlementBoostOfferedRef.current) {
                    settlementBoostOfferedRef.current = true;
                    appendGrammarEvent({
                      kind: "grammar_boost_offered",
                      lessonId: lesson.id,
                      entryPoint: "settlement",
                      recommendedTier: 1,
                      ts: nowIso()
                    });
                  }
                }}
              >
                <Flame size={16} /> 趁热再练 2 分钟
              </Link>
              {lesson.huntCaseIds.length > 0 && stage === "practice" ? (
                <button type="button" className="secondary-button" onClick={() => gotoStage("challenge")}>
                  <Sparkles size={16} /> 去挑战：找一找漏洞
                </button>
              ) : followingLesson ? (
                <Link to={`/grammar/lesson/${followingLesson.id}`} className="secondary-button">
                  下一课：第 {followingLesson.number} 课 · {followingLesson.title}
                </Link>
              ) : (
                <Link to="/grammar" className="secondary-button">
                  下一课
                </Link>
              )}
              <Link to="/grammar" className="ghost-link">
                返回课程地图
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── ④ 破 · 侦探挑战 ───────────────── */}
      {stage === "challenge" && (
        <section ref={stageRef} tabIndex={-1} className="lesson-stage" aria-label="侦探挑战">
          <p className="lesson-progress-line">这一课学会了，正好用它去帮侦探找到对应的语法漏洞。</p>
          <p className="lesson-intent">挑战不计时、不扣分，随时可以回来。</p>
          <div className="lesson-challenge-list">
            {lesson.huntCaseIds.map((caseId) => (
              <Link to={`/grammar/hunt?case=${caseId}`} className="lesson-challenge-card" key={caseId}>
                <Search size={17} />
                <div>
                  <strong>去破这一案</strong>
                  <span>找一找本课学过的语法漏洞</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="lesson-stage-actions">
            <Link
              to={followingLesson ? `/grammar/lesson/${followingLesson.id}` : "/grammar"}
              className="primary-button"
            >
              {followingLesson ? `学下一课：第 ${followingLesson.number} 课` : "学下一课"}
            </Link>
            <button type="button" className="secondary-button" onClick={() => gotoStage("watch")}>
              再学一遍这一课
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
