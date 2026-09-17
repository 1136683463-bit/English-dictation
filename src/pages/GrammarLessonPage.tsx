import { ArrowLeft, CheckCircle2, Eraser, Flag, Search, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import AdventureScene from "../components/AdventureScene";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SpeakButton from "../components/SpeakButton";
import type { AdventureSceneId } from "../components/AdventureScene";
import type { DiffToken, LessonContrast, LessonDeepDive, LessonGuidedStep, LessonPracticeStep } from "../types";
import { appendGrammarEvent, type LessonSection } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import { compareText, diffScore } from "../services/diffService";
import {
  addLessonMistakeSentence,
  checkLessonTokens,
  createGuidedState,
  describeOutputGap,
  detectThirdPersonMiss,
  firstMismatchIndex,
  getGrammarLesson,
  judgeGuidedStep,
  markLessonDone,
  shuffleTokenOrder
} from "../services/lessonService";

type LessonStage = "pretest" | "watch" | "guided" | "recall" | "practice" | "challenge";

/** R02：课前测试题。复用引导题（choose）与正误对比（contrast 判断）做「先试后学」。 */
type PretestQuestion =
  | { kind: "choose"; prompt: string; options: string[]; answer: string; reviewSentence: string; reviewNote: string }
  | { kind: "contrast"; sentence: string; reviewSentence: string; reviewNote: string };

/**
 * 前测「拿不准」的一条记录（R02 反馈补强）：结果页要能说清
 * 「哪一题、你的判断是什么、正确是什么、为什么」——只说「有 N 处拿不准」等于让用户带着疑问进讲解。
 */
interface PretestWrongRecord {
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
            <p className="lesson-contrast-correct">
              <CheckCircle2 size={17} /> {item.correct}
            </p>
            <p className="lesson-contrast-why">{item.whyZh}</p>
            <p className="lesson-contrast-judge">
              {((picked === "first") === correctFirst)
                ? "你判断对了，眼光很准。"
                : "这次没看出没关系——现在知道差在哪了。"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/** 「为什么？」深挖卡（R2）：默认展开（用户可折叠，偏好被记住）；展开时上报事件（R01③）。 */
function LessonDeepDiveCard({ dive, onExpand }: { dive: LessonDeepDive; onExpand?: () => void }) {
  const [open, setOpen] = useState(readDeepDiveDefaultOpen);
  return (
    <div className={`lesson-deepdive${open ? " open" : ""}`}>
      <button
        type="button"
        className="lesson-deepdive-head"
        onClick={() => {
          const next = !open;
          if (next) onExpand?.();
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

  // R02 前测状态：先试后学，不判分不排名；答错的题已拍板「直接进入复习队列」
  const [pretestIndex, setPretestIndex] = useState(0);
  const [pretestPicked, setPretestPicked] = useState<string | null>(null);
  const [pretestWrongCount, setPretestWrongCount] = useState(0);
  const [pretestWrongRecords, setPretestWrongRecords] = useState<PretestWrongRecord[]>([]);
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

  // R05 完课确证：本课进了复习队列的知识点（完课小结卡「还差什么」的数据）
  const [reviewNotes, setReviewNotes] = useState<string[]>([]);

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
  const [practiceMisses, setPracticeMisses] = useState(0);
  const [practiceHint, setPracticeHint] = useState<string | null>(null);
  const [practiceDone, setPracticeDone] = useState(false);
  const [practiceOrder, setPracticeOrder] = useState<number[]>([]);
  const [dragChip, setDragChip] = useState<{ from: "bank" | "build"; index: number } | null>(null);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  /** R3 对比题分布：练段常规题做完后、产出题前，插入「再看两组对错」位点（讲解段已放 2 组，此处再放 2 组）。 */
  const [midContrastOpen, setMidContrastOpen] = useState(false);

  // ── R01 数据埋点：课程计时 + 「一次通过」标记（旁路记录，不参与判题逻辑）──
  const lessonStartRef = useRef(Date.now());
  const guidedFirstTryRef = useRef(true);
  const practiceFirstTryRef = useRef(true);
  const lessonKey = lesson?.id ?? "";
  /** R22：进课埋点去重——React 严格模式会双调用 effect，同一课只记一次。 */
  const startedLessonRef = useRef<string>("");
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
    setPretestWrongRecords([]);
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
        reviewNote: chooseStep.explain
      });
    }
    const contrast = lesson.contrast?.[0];
    if (contrast) {
      questions.push({
        kind: "contrast",
        sentence: contrast.wrong,
        reviewSentence: contrast.correct,
        reviewNote: contrast.whyZh
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
  // R08：纯零基础判定——第 1 课且尚未完成任何课。此态 pretest 导览化（不判分、纯预览）。
  const isFirstEverLesson = lesson.number === 1 && (data.grammarLessonsDone ?? []).length === 0;
  const guidedStep: LessonGuidedStep | undefined = lesson.guided[guided.index];
  const practiceStep: LessonPracticeStep | undefined = lesson.practice[practiceIndex];

  // ① 段小剧场：多句对话优先，旧数据回退到 dialogueEn 单句
  const dialogueLines = lesson.dialogue ?? [
    { who: "npc", en: lesson.dialogueEn, zh: lesson.dialogueZh }
  ];
  const currentVariant = lesson.variants?.[Math.min(variantTab, Math.max((lesson.variants.length ?? 1) - 1, 0))];

  const resetGuided = () => {
    setGuided(createGuidedState());
    setGuidedFeedback("idle");
    setGuidedMisses(0);
    setGuidedHint(null);
    setMistakeSaved(false);
  };

  /** R02：前测作答。不判分不排名；答错的题直接进入复习队列（已拍板）。 */
  const handlePretestPick = (option: string) => {
    const question = pretestQuestions[pretestIndex];
    if (!question || pretestPicked) return;
    setPretestPicked(option);
    const correct =
      question.kind === "choose"
        ? option.trim().toLowerCase() === question.answer.trim().toLowerCase()
        : option === "有问题";
    recordStepResult("pretest", question.kind, pretestIndex, correct ? 0 : 1, correct);
    if (!correct) {
      setPretestWrongCount((current) => current + 1);
      setPretestWrongRecords((records) => [
        ...records,
        question.kind === "choose"
          ? {
              order: pretestIndex + 1,
              kind: "choose",
              promptZh: question.prompt,
              userPick: option,
              correctPick: question.answer,
              whyZh: question.reviewNote
            }
          : {
              order: pretestIndex + 1,
              kind: "contrast",
              promptZh: "有人是这样说的，你觉得这句话有问题吗？",
              sentence: question.sentence,
              userPick: option,
              correctPick: "有问题",
              correctSentence: question.reviewSentence,
              whyZh: question.reviewNote
            }
      ]);
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
    setMistakeSaved(true);
    setReviewNotes((notes) => (notes.includes(note) ? notes : [...notes, note]));
  };

  /** R01②/R02：一步判题落一条结果；引导/练习错过或未通过的步骤会拉低「一次通过」标记（前测不参与）。 */
  const recordStepResult = (
    section: LessonSection,
    stepKind: string,
    stepIndex: number,
    misses: number,
    passed = true
  ) => {
    appendGrammarEvent({
      kind: "lesson_step_result",
      lessonId: lesson.id,
      section,
      stepKind,
      stepIndex,
      attempts: misses + 1,
      passed,
      ts: nowIso()
    });
    if ((!passed || misses > 0) && (section === "guided" || section === "practice")) {
      if (section === "guided") guidedFirstTryRef.current = false;
      else practiceFirstTryRef.current = false;
    }
  };

  const gotoStage = (next: LessonStage) => {
    setStage(next);
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
    window.scrollTo({ top: 0 });
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
        recordStepResult("guided", guidedStep.kind, guided.index, guidedMisses);
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
    } else {
      saveMistakeIfNeeded(practiceMisses, practiceStep.answer, lesson.oneLineRule);
      recordStepResult("practice", "arrange", practiceIndex, practiceMisses);
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
    // R4：摆满「答案词数」即判题（有干扰项时 ≠ 词块库总数）
    if (next.length === answerWordCount(step.answer)) judgeArrange(stage, next);
  };

  const arrangeRemove = (stage: "guided" | "practice") => (pos: number) => {
    const order = stage === "guided" ? guidedOrder : practiceOrder;
    const setOrder = stage === "guided" ? setGuidedOrder : setPracticeOrder;
    const next = order.filter((_, index) => index !== pos);
    setOrder(next);
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
    setOrder(next);
    if (stage === "guided") {
      setGuidedFeedback("idle");
      setGuidedHint(null);
    } else {
      setPracticeFeedback("idle");
      setPracticeHint(null);
    }
    if (next.length === answerWordCount(step.answer)) judgeArrange(stage, next);
  };

  const arrangeUndoLast = (stage: "guided" | "practice") => () => {
    const order = stage === "guided" ? guidedOrder : practiceOrder;
    const setOrder = stage === "guided" ? setGuidedOrder : setPracticeOrder;
    setOrder(order.slice(0, -1));
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
      if (passed) recordStepResult("guided", "spot", guided.index, 0);
      return;
    }
    if (!passed) setGuidedMisses((current) => current + 1);
    else {
      saveMistakeIfNeeded(guidedMisses, guidedStep.answer, guidedStep.explain);
      recordStepResult("guided", guidedStep.kind, guided.index, guidedMisses);
    }
    setGuidedFeedback(passed ? "pass" : "retry");
  };

  const guidedUndo = () => arrangeUndoLast("guided")();
  void guidedUndo;

  const guidedNext = () => {
    if (guided.index + 1 >= lesson.guided.length) {
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
    recordStepResult("practice", "arrange", practiceIndex, practiceMisses + 1, true);
    setPracticeFeedback("pass");
  };

  // ── R04/R6/R11：两档产出（半提示 → 无提示） ─────────────────
  const OUTPUT_PASS_SCORE = 90;

  /** R6：产出计划——第 1 题用本课变体句（带句型框），第 2 题核心句（无提示）；无变体的旧课回退单题。 */
  const halfPromptSentence =
    lesson?.variants?.find((variant) => variant.label === "疑问")?.en ??
    lesson?.variants?.find((variant) => variant.label === "否定")?.en ??
    null;
  const halfPromptIntentZh =
    lesson?.variants?.find((variant) => variant.label === "疑问")?.zh ??
    lesson?.variants?.find((variant) => variant.label === "否定")?.zh ??
    lesson?.intentZh ??
    "";
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
    recordStepResult("output", outputHintLevel > 0 ? "free_type_hint" : "free_type", outputStep, nextAttempts - 1, passed);
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
    recordStepResult("output", outputHintLevel > 0 ? "free_type_hint" : "free_type", outputStep, nextAttempts - 1, false);
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
    recordStepResult("recall", "free_recall", 0, nextAttempts - 1, passed);
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
    recordStepResult("recall", "free_recall", 0, recallAttempts, false);
    updateData((latest) =>
      addLessonMistakeSentence(latest, lesson, target, lesson.recall?.noteZh ?? lesson.oneLineRule)
    );
    setRecallOutcome("revealed");
    setRecallHint(null);
  };

  const practiceNext = () => {
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
      <div className="lesson-topbar">
        <button type="button" className="icon-button" onClick={() => navigate("/grammar")} aria-label="返回课程地图" title="返回课程地图">
          <ArrowLeft size={17} />
        </button>
        <div className="lesson-topbar-title">
          <strong>{lesson.episode} · {lesson.title}</strong>
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

      {/* ───────────────── ⭐ 课前试一试（Test→Teach→Test 的前测） ───────────────── */}
      {stage === "pretest" && (
        <section className="lesson-stage" aria-label="课前试一试">
          {/* R08 首课导览化：纯零基础（首课且未完成任何课）不判分、纯预览，
              避免「连题干都读不懂就被考」的无力感；其余课保留原前测逻辑。 */}
          {isFirstEverLesson && !pretestFinished ? (
            <div className="lesson-complete">
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
            <div className="lesson-complete">
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
                    {pretestWrongRecords.map((record) => (
                      <div className="lesson-summary-card" key={`${record.order}-${record.kind}`}>
                        <p className="lesson-summary-grammar">第 {record.order} 题 · {record.promptZh}</p>
                        {record.sentence && (
                          <p className="lesson-summary-rule">
                            <span className="lesson-rule-label">原句</span>
                            {record.sentence}
                          </p>
                        )}
                        <ul className="lesson-summary-points">
                          <li>
                            你的{record.kind === "choose" ? "选择" : "判断"}：{record.userPick}　·　正确
                            {record.kind === "choose" ? "选择" : "判断"}：{record.correctPick}
                          </li>
                          {record.correctSentence && <li>正确说法：{record.correctSentence}</li>}
                          <li>{record.whyZh}</li>
                        </ul>
                      </div>
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
                  <p>可以直接去练习试试身手，也可以先快速过一遍讲解。</p>
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
                      <p>先记住你的直觉——答案马上在讲解里揭晓。</p>
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
        <section className="lesson-stage" aria-label="情景讲解">
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
                  <p className="lesson-section-label">同一个说法，还能讲这些</p>
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
                  />
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
        <section className="lesson-stage" aria-label="试一试">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">第 {guided.index + 1} / {lesson.guided.length} 题</span>
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
                  {guidedStep.explain}
                  {mistakeSaved && <span className="lesson-saved-hint">（刚才错过的句子已进入复习队列）</span>}
                </p>
                <button type="button" className="primary-button" onClick={guidedNext}>
                  {guided.index + 1 >= lesson.guided.length ? "下面自己来" : "下一题"}
                </button>
              </div>
            )}
            {guidedFeedback === "retry" && (
              <div className="lesson-feedback retry" aria-live="polite">
                <p>{guidedHint ?? "很接近了。再看看提示，换一个试试。"}</p>
              </div>
            )}
          </div>

          <div className="lesson-stage-actions center">
            <button type="button" className="ghost-link" onClick={() => gotoStage("watch")}>
              回去再看一遍讲解
            </button>
          </div>
        </section>
      )}

      {/* ───────────────── ③ 忆 · 遮盖回忆（R5，六段式新增段） ───────────────── */}
      {stage === "recall" && lesson.recall && (
        <section className="lesson-stage" aria-label="凭记忆写">
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
            <button type="button" className="ghost-link" onClick={() => gotoStage("watch")}>
              回去再看一眼讲解
            </button>
          </div>
        </section>
      )}

      {/* ───────────────── ④ 练 · 自己来 ───────────────── */}
      {/* ───────────────── R3 分布位点② · 练段末尾再看两组对错 ───────────────── */}
      {stage === "practice" && midContrastOpen && !outputActive && !practiceDone && (
        <section className="lesson-stage" aria-label="再看两组对错">
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
                    onJudge={(passed) => recordStepResult("practice", "contrast", index, passed ? 0 : 1, passed)}
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

      {stage === "practice" && practiceStep && !practiceDone && !outputActive && !midContrastOpen && (
        <section className="lesson-stage" aria-label="自己来">
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
                <button type="button" className="primary-button" onClick={practiceNext}>
                  {practiceIndex + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题"}
                </button>
              </div>
            )}
            {practiceFeedback === "retry" && (
              <div className="lesson-feedback retry" aria-live="polite">
                <p>{practiceHint ?? "顺序还差一点。提示：先说「谁」，再说「怎么样 / 做什么」。"}</p>
                {practiceMisses >= 2 && (
                  <div className="lesson-stage-actions center">
                    <button type="button" className="ghost-link" onClick={revealPractice}>
                      想不起来了，照着拼一遍
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lesson-stage-actions center">
            <button type="button" className="ghost-link" onClick={() => gotoStage("watch")}>
              回去再看一遍讲解
            </button>
          </div>
        </section>
      )}

      {/* ───────────────── ⑤ 产 · 两档产出（R6/R11：半提示 → 无提示） ───────────────── */}
      {stage === "practice" && outputActive && !practiceDone && (
        <section className="lesson-stage" aria-label="说出来">
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
                    <button type="button" className="ghost-link" onClick={() => setOutputHintLevel(1)}>
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
                      <button type="button" className="ghost-link" onClick={() => setOutputHintLevel(2)}>
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
                      <button type="button" className="ghost-link" onClick={() => setOutputHintLevel(3)}>
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
                <button type="button" className="primary-button" onClick={practiceNext}>
                  {outputStep < outputPlan.length - 1 ? "下一句（这次没有提示）" : "完成这一课"}
                </button>
              </div>
            )}
          </div>

          <div className="lesson-stage-actions center">
            <button type="button" className="ghost-link" onClick={() => gotoStage("watch")}>
              回去再看一眼讲解
            </button>
          </div>
        </section>
      )}

      {/* ───────────────── 完课 · 确证仪式（R05 价值收据） ───────────────── */}
      {practiceDone && (stage === "practice" || stage === "challenge") && (
        <section className="lesson-stage" aria-label="课程完成">
          <div className="lesson-complete">
            <header className="complete-hero">
              <span className="complete-hero-badge">
                <CheckCircle2 size={26} strokeWidth={2.4} />
              </span>
              <h2>第 {lesson.number} 课完成</h2>
              <p className="complete-hero-sub">
                一课一课积累，你已经能用英语介绍自己、讲正在做的事、说明天的计划。
              </p>
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
                {lesson.summary ? (
                  <div className="receipt-card">
                    <span className="receipt-chip">{lesson.grammarLabel}</span>
                    <p className="receipt-rule">
                      <span className="lesson-rule-label">一句话</span>
                      {lesson.summary.rule}
                    </p>
                    <ul className="receipt-points">
                      {lesson.summary.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="receipt-card">
                    <span className="receipt-chip">{lesson.grammarLabel}</span>
                    <p className="receipt-rule">{lesson.oneLineRule}</p>
                  </div>
                )}
              </section>

              {/* 🗣️ 你现在能说出哪几个新句子 */}
              <section className="receipt-block">
                <h3 className="receipt-block-title">
                  <span className="receipt-block-icon speak" aria-hidden="true">
                    <Volume2 size={14} strokeWidth={2.6} />
                  </span>
                  你现在能说出这些新句子
                </h3>
                <div className="receipt-card">
                  <ul className="receipt-sentences">
                    <li>
                      <span className="receipt-sentence-text">{lesson.targetSentence}</span>
                      <SpeakButton text={lesson.targetSentence} />
                    </li>
                    {(lesson.variants ?? []).map((variant) => (
                      <li key={variant.en}>
                        <span className="receipt-sentence-text">
                          <em className="receipt-sentence-label">{variant.label}</em>
                          {variant.en}
                        </span>
                        <SpeakButton text={variant.en} />
                      </li>
                    ))}
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
                <div className="receipt-card">
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
                  <p className="receipt-queue-note">
                    上面这些句子已排进复习队列，明天会自动来见你
                    <Link to="/grammar/review" className="receipt-queue-link">
                      去复习
                    </Link>
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
              {lesson.huntCaseIds.length > 0 && stage === "practice" ? (
                <button type="button" className="primary-button" onClick={() => gotoStage("challenge")}>
                  <Sparkles size={16} /> 去挑战：找一找漏洞
                </button>
              ) : (
                <Link to="/grammar" className="primary-button">
                  下一课
                </Link>
              )}
              <Link to="/grammar" className="secondary-button">
                返回课程地图
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── ④ 破 · 侦探挑战 ───────────────── */}
      {stage === "challenge" && (
        <section className="lesson-stage" aria-label="侦探挑战">
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
            <Link to="/grammar" className="primary-button">
              学下一课
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
