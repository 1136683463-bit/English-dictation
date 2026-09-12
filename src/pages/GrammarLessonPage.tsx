import { ArrowLeft, CheckCircle2, Eraser, Search, Sparkles } from "lucide-react";
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
  detectThirdPersonMiss,
  firstMismatchIndex,
  getGrammarLesson,
  judgeGuidedStep,
  markLessonDone
} from "../services/lessonService";

type LessonStage = "pretest" | "watch" | "guided" | "practice" | "challenge";

/** R02：课前测试题。复用引导题（choose）与正误对比（contrast 判断）做「先试后学」。 */
type PretestQuestion =
  | { kind: "choose"; prompt: string; options: string[]; answer: string; reviewSentence: string; reviewNote: string }
  | { kind: "contrast"; sentence: string; reviewSentence: string; reviewNote: string };

const stageTabs: Array<{ id: LessonStage; label: string; hint: string }> = [
  { id: "watch", label: "① 看", hint: "情景讲解" },
  { id: "guided", label: "② 跟", hint: "试一试" },
  { id: "practice", label: "③ 练", hint: "自己来" },
  { id: "challenge", label: "④ 破", hint: "侦探挑战" }
];

/** 第①段内部的 3 步子步进：剧场 → 搭装与对错 → 变奏。 */
const watchStepNames = ["剧场", "搭装与对错", "变奏"];

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
    onJudge?.((choice === "first") === correctFirst);
  };

  return (
    <div className="lesson-contrast-card">
      {!revealed ? (
        <>
          <p className="lesson-contrast-hint">两句话只有一句是对的——点出你认为对的那句：</p>
          <div className="lesson-option-row">
            <button type="button" className="lesson-option" onClick={() => judge("first")}>
              上句：{first}
            </button>
            <button type="button" className="lesson-option" onClick={() => judge("second")}>
              下句：{second}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="lesson-contrast-wrong">
            {markedWrongNode}
            {!mark && <span className="lesson-contrast-hole">缺了一块</span>}
            <span className="lesson-contrast-hole">← 有问题的是这句</span>
          </p>
          <div className="lesson-contrast-reveal">
            <p className="lesson-contrast-correct">
              <CheckCircle2 size={15} /> {item.correct}
            </p>
            <p className="lesson-contrast-why">{item.whyZh}</p>
            <p className="lesson-contrast-why">
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

/** 「想知道为什么？」深挖折叠卡：默认收起，选学内容，不展开完全无感。展开时上报事件（R01③）。 */
function LessonDeepDiveCard({ dive, onExpand }: { dive: LessonDeepDive; onExpand?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`lesson-deepdive${open ? " open" : ""}`}>
      <button
        type="button"
        className="lesson-deepdive-head"
        onClick={() => {
          const next = !open;
          if (next) onExpand?.();
          setOpen(next);
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
  const [pretestWrongNotes, setPretestWrongNotes] = useState<string[]>([]);
  const [pretestFinished, setPretestFinished] = useState(false);

  // R04 无提示输出状态：练习段末尾的「说出来」，隐藏中文句意提示
  const [outputActive, setOutputActive] = useState(false);
  const [outputValue, setOutputValue] = useState("");
  const [outputTokens, setOutputTokens] = useState<DiffToken[] | null>(null);
  const [outputAttempts, setOutputAttempts] = useState(0);
  const [outputOutcome, setOutputOutcome] = useState<"idle" | "pass" | "revealed">("idle");
  const [outputHint, setOutputHint] = useState<string | null>(null);

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

  // ── R01 数据埋点：课程计时 + 「一次通过」标记（旁路记录，不参与判题逻辑）──
  const lessonStartRef = useRef(Date.now());
  const guidedFirstTryRef = useRef(true);
  const practiceFirstTryRef = useRef(true);
  const lessonKey = lesson?.id ?? "";
  useEffect(() => {
    lessonStartRef.current = Date.now();
    guidedFirstTryRef.current = true;
    practiceFirstTryRef.current = true;
    setPretestIndex(0);
    setPretestPicked(null);
    setPretestWrongCount(0);
    setPretestWrongNotes([]);
    setPretestFinished(false);
    setOutputActive(false);
    setOutputValue("");
    setOutputTokens(null);
    setOutputAttempts(0);
    setOutputOutcome("idle");
    setOutputHint(null);
    setReviewNotes([]);
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
      setPretestWrongNotes((notes) => [...notes, question.reviewNote]);
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
    }
    window.scrollTo({ top: 0 });
  };

  // ── 拼装交互（引导与练习共用）：order 存词块索引；点击切换选中/取消，拖拽可换位 ──
  const judgeArrange = (stage: "guided" | "practice", order: number[]) => {
    if (stage === "guided") {
      if (!guidedStep || guidedStep.kind !== "arrange") return;
      const pickedTokens = order.map((index) => guidedStep.tokens?.[index]).filter(Boolean) as string[];
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
    const pickedTokens = order.map((index) => practiceStep.tokens?.[index]).filter(Boolean) as string[];
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
    if (!step || step.tokens?.[tokenIndex] == null) return;
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
    if (next.length === (step.tokens?.length ?? 0)) judgeArrange(stage, next);
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
    if (next.length === (step.tokens?.length ?? 0)) judgeArrange(stage, next);
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
      gotoStage("practice");
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

  // ── R04：无提示输出 ─────────────────────────────────────
  const OUTPUT_PASS_SCORE = 90;

  const submitOutput = () => {
    if (outputOutcome !== "idle" || !outputValue.trim()) return;
    const tokens = compareText(lesson.targetSentence, outputValue, false);
    const score = diffScore(tokens);
    const nextAttempts = outputAttempts + 1;
    setOutputAttempts(nextAttempts);
    setOutputTokens(tokens);
    const passed = score >= OUTPUT_PASS_SCORE;
    recordStepResult("output", "free_type", 0, nextAttempts - 1, passed);
    if (passed) {
      setOutputOutcome("pass");
      setOutputHint(null);
    } else {
      setOutputHint(
        detectThirdPersonMiss(outputValue) ?? `已经对了 ${score}%——对照下面的彩色提示，再试一次。`
      );
    }
  };

  /** 想不起来了：看答案不算错，但这句会排进复习队列（失败不阻断完课）。 */
  const revealOutput = () => {
    if (outputOutcome !== "idle") return;
    const nextAttempts = outputAttempts + 1;
    setOutputAttempts(nextAttempts);
    recordStepResult("output", "free_type", 0, nextAttempts - 1, false);
    updateData((latest) => addLessonMistakeSentence(latest, lesson, lesson.targetSentence, lesson.oneLineRule));
    setReviewNotes((notes) =>
      notes.includes(lesson.oneLineRule) ? notes : [...notes, lesson.oneLineRule]
    );
    setOutputTokens(compareText(lesson.targetSentence, lesson.targetSentence, false));
    setOutputOutcome("revealed");
    setOutputHint(null);
  };

  const practiceNext = () => {
    if (practiceIndex + 1 >= lesson.practice.length) {
      // R04：常规练习结束后先进入「无提示输出」，完成（或看答案）后再真正完课
      if (!outputActive) {
        setOutputActive(true);
        window.scrollTo({ top: 0 });
        return;
      }
      if (outputOutcome === "idle") return;
      // R01①：完课埋点（旁路，先记后置完成状态）
      appendGrammarEvent({
        kind: "grammar_lesson_completed",
        lessonId: lesson.id,
        completedAt: nowIso(),
        guidedFirstTry: guidedFirstTryRef.current,
        practiceFirstTry: practiceFirstTryRef.current,
        durationMs: Math.max(0, Date.now() - lessonStartRef.current)
      });
      lessonStartRef.current = Date.now();
      updateData((latest) => markLessonDone(latest, lesson.id));
      setPracticeDone(true);
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
    const tokens = step.tokens ?? [];
    const order = stage === "guided" ? guidedOrder : practiceOrder;
    const passed = stage === "guided" ? guidedFeedback === "pass" : practiceFeedback === "pass";
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
          {/* 多邻国式词块库：选中后原地变灰禁用，位置不消失、布局不跳 */}
          {tokens.map((token, tokenIndex) => {
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
        <div className="lesson-stage-dots" aria-label={stage === "pretest" ? "课前试一试" : `第 ${stageIndex + 1} / 4 段`}>
          {stageTabs.map((tab, index) => (
            <span key={tab.id} className={index === stageIndex ? "on" : ""} />
          ))}
        </div>
      </div>

      {/* ───────────────── ⭐ 课前试一试（Test→Teach→Test 的前测） ───────────────── */}
      {stage === "pretest" && (
        <section className="lesson-stage" aria-label="课前试一试">
          {pretestFinished || pretestQuestions.length === 0 ? (
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
                    拿不准的句子已经排进明天的复习队列。
                  </p>
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
                      <div className="lesson-option-row">
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
                      <p className="lesson-choose-sentence">
                        <span>{question.sentence}</span>
                      </p>
                      <div className="lesson-option-row">
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
                  <AdventureScene scene={lesson.scene as AdventureSceneId} />
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
                    {lesson.contrast.map((item, index) => (
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
            ) : guidedStep.kind === "choose" ? (
              <div className="lesson-choose">
                <p className="lesson-choose-sentence">
                  <span>{guidedStep.before}</span>
                  <span className="lesson-choose-blank">
                    {guided.picked[0] ?? "＿＿"}
                  </span>
                  <span>{guidedStep.after}</span>
                </p>
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

      {/* ───────────────── ③ 练 · 自己来 ───────────────── */}
      {stage === "practice" && practiceStep && !practiceDone && !outputActive && (
        <section className="lesson-stage" aria-label="自己来">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">第 {practiceIndex + 1} / {lesson.practice.length} 题</span>
              <span className="lesson-quiz-note">这次没有干扰项，全靠自己</span>
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

      {/* ───────────────── ③+ · 无提示输出（R04） ───────────────── */}
      {stage === "practice" && outputActive && !practiceDone && (
        <section className="lesson-stage" aria-label="说出来">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">最后一步 · 说出来</span>
              <span className="lesson-quiz-note">没有中文提示，全靠自己</span>
            </div>
            <p className="lesson-quiz-prompt">
              {lesson.sceneSwings?.[0]?.sceneZh ?? lesson.sceneSetupZh}——用这一课学会的说法，把这句话打出来。
            </p>

            {outputOutcome === "idle" ? (
              <>
                <div className="answer-box">
                  <textarea
                    className="large-textarea"
                    value={outputValue}
                    onChange={(event) => setOutputValue(event.target.value)}
                    placeholder="Type in English…"
                    rows={2}
                    aria-label="英文输入区"
                  />
                </div>
                <div className="lesson-stage-actions center">
                  <button type="button" className="primary-button" onClick={submitOutput} disabled={!outputValue.trim()}>
                    提交
                  </button>
                </div>
                {outputAttempts > 0 && outputHint && (
                  <div className="lesson-feedback retry" aria-live="polite">
                    <p>{outputHint}</p>
                    {outputTokens && (
                      <p className="lesson-output-diff">
                        {outputTokens.map((token, index) => (
                          <span key={index} className={`diff-token ${token.status}`}>
                            {token.token}{" "}
                          </span>
                        ))}
                      </p>
                    )}
                    <div className="lesson-stage-actions center">
                      <button type="button" className="ghost-link" onClick={revealOutput}>
                        想不起来了，看答案
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="lesson-feedback pass" aria-live="polite">
                <p>
                  <CheckCircle2 size={16} />
                  {outputOutcome === "pass" ? "完全是自己写出来的！" : "没关系，先看正确说法："}{" "}
                  <strong>{lesson.targetSentence}</strong>
                  {outputOutcome === "revealed" && (
                    <span className="lesson-saved-hint">（这句已排进明天的复习队列）</span>
                  )}
                </p>
                <button type="button" className="primary-button" onClick={practiceNext}>
                  完成这一课
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
      {stage === "practice" && practiceDone && (
        <section className="lesson-stage" aria-label="课程完成">
          <div className="lesson-complete">
            <CheckCircle2 size={28} />
            <h2>第 {lesson.number} 课完成</h2>

            {/* ✅ 掌握了什么 */}
            <p className="lesson-section-label">✅ 这一课掌握了什么</p>
            {lesson.summary ? (
              <div className="lesson-summary-card">
                <p className="lesson-summary-grammar">{lesson.grammarLabel}</p>
                <p className="lesson-summary-rule">
                  <span className="lesson-rule-label">一句话</span>
                  {lesson.summary.rule}
                </p>
                <ul className="lesson-summary-points">
                  {lesson.summary.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="lesson-summary-card">
                <p className="lesson-summary-grammar">{lesson.grammarLabel}</p>
                <p className="lesson-summary-rule">{lesson.oneLineRule}</p>
              </div>
            )}

            {/* 🗣️ 你现在能说出哪几个新句子 */}
            <p className="lesson-section-label">🗣️ 你现在能说出这些新句子</p>
            <div className="lesson-summary-card">
              <ul className="lesson-summary-points">
                <li>
                  {lesson.targetSentence}
                  <SpeakButton text={lesson.targetSentence} />
                </li>
                {(lesson.variants ?? []).map((variant) => (
                  <li key={variant.en}>
                    {variant.label}：{variant.en}
                    <SpeakButton text={variant.en} />
                  </li>
                ))}
              </ul>
            </div>

            {/* ⚠️ 还差什么 */}
            <p className="lesson-section-label">⚠️ 还差什么</p>
            <div className="lesson-summary-card">
              {reviewNotes.length > 0 ? (
                <ul className="lesson-summary-points">
                  {reviewNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              ) : (
                <p className="lesson-summary-rule">本课没有留下漏洞——真棒。</p>
              )}
              {pretestWrongCount > 0 && (
                <p className="lesson-summary-rule">
                  前测里拿不准的 {pretestWrongCount} 处，这一课已经讲过、也练过了。
                </p>
              )}
              <p className="lesson-summary-rule">
                上面这些句子已排进复习队列，明天会自动来见你——
                <Link to="/grammar/review">去复习</Link>
              </p>
            </div>

            <p className="lesson-complete-sub">
              学完 12 课，你就能用 40 多个句子介绍自己、讲昨天的事、说明天的计划。
            </p>
            <div className="lesson-stage-actions">
              {lesson.huntCaseIds.length > 0 ? (
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
