import { CheckCircle2, Flame, Info, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SpeakButton from "../components/SpeakButton";
import {
  BOOST_TIER_META,
  BOOST_TIERS,
  boostArrangeAnswerLength,
  currentWeakSpotTag,
  boostProgressLabel,
  buildBoostItems,
  buildBoostSeenIndex,
  canBoostLesson,
  getLessonBoostTiersDone,
  judgeBoostItem,
  markBoostTierDone,
  suggestBoostTier,
  type BoostItem,
  type BoostTier
} from "../services/grammarBoostService";
import {
  boostContentHash,
  canUseBoostAi,
  generatedToBoostItem,
  requestBoostBatchCorrection,
  requestBoostVariantItems,
  type BoostBatchCorrectionEntry
} from "../services/grammarBoostAiService";
import { appendGrammarEvent, listGrammarEventsByKind } from "../services/grammarTelemetry";
import { computeWeakSpots } from "../services/grammarWeakSpotsService";
import { addSentence } from "../services/cardService";
import { getGrammarLesson, normalizeLessonSentence } from "../services/lessonService";
import { nowIso } from "../services/storage";

/**
 * 「趁热练」课后强化训练（2026-09-18 PRD）。
 *
 * 定位：完课后的即时可选强化层——补「关 1 完成 → 关 2 次日 20h」之间没有出口的空窗。
 * 三档零术语梯度，每档独立完成态；允许只做一档就体面退出；零门禁、零打卡、无结算分数。
 * AI 只用在档 3（批改 + 归因 + 变式题），未配置时降级为本地对照（功能不消失）。
 *
 * 埋点：grammar_boost_offered / started / step_result / abandoned / completed / ai_result / item_repeat。
 */

type BoostPhase = "select" | "running" | "done";

const readCompletedAt = (lessonId: string): string | null => {
  const events = listGrammarEventsByKind("grammar_lesson_completed").filter((event) => event.lessonId === lessonId);
  return events.length > 0 ? events[events.length - 1].completedAt : null;
};

export default function GrammarBoostPage() {
  const { lessonId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { data, updateData } = useAppData();
  const lesson = getGrammarLesson(lessonId);

  const tierParam = Number(searchParams.get("tier"));
  const fromParam = searchParams.get("from");
  const entryPoint: "settlement" | "card" | "reaudit" | "direct" =
    fromParam === "receipt" ? "settlement" : fromParam === "card" ? "card" : fromParam === "reaudit" ? "reaudit" : "direct";

  const doneTiers = useMemo(() => getLessonBoostTiersDone(data, lessonId), [data, lessonId]);
  const suggested = useMemo(() => suggestBoostTier(data, lessonId), [data, lessonId]);
  const progressLabel = useMemo(() => boostProgressLabel(data, lessonId), [data, lessonId]);

  const [phase, setPhase] = useState<BoostPhase>(() =>
    tierParam === 1 || tierParam === 2 || tierParam === 3 ? "running" : "select"
  );
  const [tier, setTier] = useState<BoostTier>(
    tierParam === 1 || tierParam === 2 || tierParam === 3 ? (tierParam as BoostTier) : suggested
  );
  const [items, setItems] = useState<BoostItem[]>([]);
  const [index, setIndex] = useState(0);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [attemptsThisItem, setAttemptsThisItem] = useState(0);
  const [outcome, setOutcome] = useState<"idle" | "pass" | "retry" | "revealed">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [textValue, setTextValue] = useState("");
  const [pickedProblem, setPickedProblem] = useState<boolean | null>(null);
  const [clozePicked, setClozePicked] = useState<string | null>(null);
  /** 改错：点中的词块下标。 */
  const [spotPicked, setSpotPicked] = useState<number | null>(null);
  /** 选择 / 变形：选中的选项。 */
  const [choicePicked, setChoicePicked] = useState<string | null>(null);
  const [builtTokens, setBuiltTokens] = useState<string[]>([]);
  const [aiCorrections, setAiCorrections] = useState<BoostBatchCorrectionEntry[]>([]);
  const [aiState, setAiState] = useState<"idle" | "loading" | "done" | "degraded">("idle");
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [selfEval, setSelfEval] = useState<"easy" | "ok" | "hard" | null>(null);
  /** 本次会话是否用过 AI（写入 completed 事件，用于 AI 使用率）。 */
  const aiUsedRef = useRef(false);
  const completedRef = useRef(false);
  /** 本档起始时刻（abandoned/completed 的耗时基准；用 ref 避免进入 effect 依赖）。 */
  const startedAtRef = useRef(Date.now());
  /** 本档用户写出的句子（档 3 收尾一次性送 AI 批改）。 */
  const productionsRef = useRef<Array<{ item: BoostItem; text: string }>>([]);
  /**
   * 这一档此前已练过几轮（复练时轮转题型顺序，避免每次都从同一道题开头）。
   * 从遥测反查「同课同档的历史完成次数」——练得越多，起点越往后轮转。
   */
  const boostRoundCounter = useRef(0);

  const provider = data.settings.aiProvider;
  const aiReady = canUseBoostAi(provider);
  /**
   * 弱点驱动的混题（R-B15）：本课之外混入的旧课点优先挑「用户最弱的罪名」相关的句子。
   * 这是把弱点档案真正接到出题上的地方——此前只算弱点、从不影响出题。
   */
  const weakSpotTag = useMemo(() => currentWeakSpotTag(data), [data]);
  /** 弱点的零术语说明（如「他 / 她 / 它做事，动词要加 s」）——给 AI 与 UI 用。 */
  const weakSpotPlain = useMemo(
    () => computeWeakSpots(data)[0]?.plain ?? null,
    [data]
  );
  /** AI 批改强度跟随用户在设置里的选择（此前硬编码 gentle，用户的「严格」设置对趁热练无效）。 */
  const correctionStyle = data.settings.diaryCorrectionStyle ?? "standard";
  const meta = BOOST_TIER_META[tier];

  // 复练轮数 = 该课该档历史完成次数（从遥测反查）。每次进入档位时刷新一次即可。
  useEffect(() => {
    if (phase !== "running") return;
    boostRoundCounter.current = listGrammarEventsByKind("grammar_boost_completed").filter(
      (event) => event.lessonId === lessonId && event.tier === tier
    ).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, lessonId, tier]);

  /**
   * 曝光/进档/放弃埋点的 ref 守卫。
   * 必须用 ref——`useState` 守卫在 StrictMode 下会被 effect 双跑穿透（每个 effect 各见一份初始 state），
   * 导致同一档记两条 started / offered。仓库内其它埋点（GrammarPathPage / GrammarRevisitPage）同此约定。
   */
  const offeredLoggedRef = useRef(false);
  const startedLoggedRef = useRef(false);
  /** 挂载期间累计已答题数（abandoned 用 ref 读，避免 effect 依赖 answered 而反复重挂）。 */
  const answeredRef = useRef(0);
  const itemsCountRef = useRef(0);

  // 曝光埋点（选择态：入口来自结算页/卡片/重审页时记一条）
  useEffect(() => {
    if (!lesson || offeredLoggedRef.current) return;
    if (phase === "select" && entryPoint !== "direct") {
      offeredLoggedRef.current = true;
      appendGrammarEvent({
        kind: "grammar_boost_offered",
        lessonId,
        entryPoint,
        recommendedTier: suggested,
        ts: nowIso()
      });
    }
  }, [lesson, phase, lessonId, entryPoint, suggested]);

  // 进档事件（每次进入某一档记一条；ref 守卫——StrictMode 双跑只记一次）
  useEffect(() => {
    if (phase !== "running" || !lesson || startedLoggedRef.current) return;
    startedLoggedRef.current = true;
    appendGrammarEvent({
      kind: "grammar_boost_started",
      lessonId,
      tier,
      questionCount: itemsCountRef.current || BOOST_TIER_META[tier].questionCount,
      entryPoint,
      ts: nowIso()
    });
  }, [phase, lesson, lessonId, tier, entryPoint]);

  // 中途离开：未完成且已答过题 → 记 abandoned（唯一能算放弃率的事件）。
  // 依赖只留 phase/tier——answered 用 ref 读，否则每次答题都会重挂清理函数、记出一条假放弃。
  useEffect(() => {
    if (phase !== "running") return;
    return () => {
      if (completedRef.current) return;
      if (answeredRef.current <= 0 && itemsCountRef.current === 0) return;
      appendGrammarEvent({
        kind: "grammar_boost_abandoned",
        lessonId,
        tier,
        answered: answeredRef.current,
        total: itemsCountRef.current || BOOST_TIER_META[tier].questionCount,
        dwellMs: Date.now() - startedAtRef.current,
        ts: nowIso()
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, tier, lessonId]);

  // 出题：进档时一次性出好（会话内稳定，不随 data 变化重排）
  useEffect(() => {
    if (phase !== "running" || !lesson || items.length > 0) return;
    const seen = buildBoostSeenIndex(data);
    // round：取「同课同档历史完成次数」——复练时轮转题型顺序，避免每次都从同一道题开头
    const round = Math.max(0, boostRoundCounter.current);
    let next = buildBoostItems(lessonId, tier, { seen, round, weakSpotTag });
    if (next.length === 0) next = buildBoostItems(lessonId, tier, { round, weakSpotTag });
    // 素材重复的先行信号：命中近 7 天已练句时记一条（出题侧就带 seen，这里只做统计）
    const seenHits = next.filter((item) => seen.has(item.sourceRef)).length;
    if (seenHits > 0) {
      appendGrammarEvent({
        kind: "grammar_boost_item_repeat",
        lessonId,
        sourceRef: next[0]?.sourceRef ?? "",
        seenCount7d: seenHits,
        ts: nowIso()
      });
    }
    itemsCountRef.current = next.length;
    setItems(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, lessonId, tier]);

  if (!lesson) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法" title="找不到这一课" />
        <EmptyState title="课程不存在" description="回到课程地图，挑一课开始吧。" />
        <div className="lesson-stage-actions">
          <Link to="/grammar" className="primary-button">返回课程地图</Link>
        </div>
      </div>
    );
  }

  // 未完成的课不给入口（避免绕开正课——强化训练是「课后」层）
  if (!canBoostLesson(data, lessonId)) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 趁热练" title={`第 ${lesson.number} 课 · 趁热练`} />
        <EmptyState
          title="先上完这一课"
          description="趁热练是学完一节课之后的加练——先把这一课走一遍，回来就能立刻练。"
        />
        <div className="lesson-stage-actions">
          <Link to={`/grammar/lesson/${lesson.id}`} className="primary-button">去上这一课</Link>
          <Link to="/grammar" className="secondary-button">返回课程地图</Link>
        </div>
      </div>
    );
  }

  const currentItem: BoostItem | undefined = items[index];

  const recordStep = (item: BoostItem, attempts: number, passed: boolean) => {
    appendGrammarEvent({
      kind: "grammar_boost_step_result",
      lessonId,
      tier,
      itemKind: item.itemKind,
      sourceRef: item.sourceRef,
      attempts,
      passed,
      ts: nowIso()
    });
  };

  const resetItemState = () => {
    setOutcome("idle");
    setFeedback(null);
    setHintLevel(0);
    setTextValue("");
    setPickedProblem(null);
    setClozePicked(null);
    setSpotPicked(null);
    setChoicePicked(null);
    setBuiltTokens([]);
    setAttemptsThisItem(0);
    setAiCorrections([]);
    setAiState("idle");
    setAiNotice(null);
  };

  /**
   * 开始某一档（档选择态点击 / 完成态「再深一点」共用）。
   * 必须同时重置 ref（started/answered/items 计数/放弃守卫）——否则第二档会沿用上一档的计数，
   * 且 started 事件会被上一档的 ref 守卫挡掉。
   */
  const startTier = (nextTier: BoostTier) => {
    setTier(nextTier);
    setItems([]);
    setIndex(0);
    setFirstTryCount(0);
    resetItemState();
    setSelfEval(null);
    startedLoggedRef.current = false;
    answeredRef.current = 0;
    itemsCountRef.current = 0;
    aiUsedRef.current = false;
    completedRef.current = false;
    productionsRef.current = [];
    startedAtRef.current = Date.now();
    setPhase("running");
  };

  const finishTier = () => {
    completedRef.current = true;
    const completedAt = readCompletedAt(lessonId);
    const hours = completedAt ? Math.max(0, (Date.now() - Date.parse(completedAt)) / 3_600_000) : null;
    appendGrammarEvent({
      kind: "grammar_boost_completed",
      lessonId,
      tier,
      total: items.length,
      firstTryCount,
      durationMs: Date.now() - startedAtRef.current,
      aiUsed: aiUsedRef.current,
      hoursSinceStage1: hours === null ? null : Math.round(hours * 10) / 10,
      ts: nowIso()
    });
    updateData((latest) => markBoostTierDone(latest, lessonId, tier));
    setPhase("done");
    // 档 3 收尾：本档写过的句子一次性送 AI 批改（不逐题、不阻塞完成态展示）。
    if (tier === 3 && aiReady) {
      void runAiCorrection(productionsRef.current);
    }
  };

  const advance = (passed: boolean) => {
    answeredRef.current += 1;
    if (passed && attemptsThisItem <= 1) setFirstTryCount((value) => value + 1);
    if (index + 1 >= items.length) {
      finishTier();
      return;
    }
    setIndex((value) => value + 1);
    resetItemState();
    window.scrollTo({ top: 0 });
  };

  /** 档 3 收尾：把错句送入 SM-2（仅档 3 的无提示产出失败句入队；幂等）。 */
  const queueFailedProduce = (item: BoostItem, userText: string) => {
    if (tier !== 3) return;
    const sentence = (userText || item.answer).trim();
    if (!sentence) return;
    updateData((latest) => {
      const duplicated = latest.cards.some(
        (card) => card.type === "sentence" && normalizeLessonSentence(card.front) === normalizeLessonSentence(sentence)
      );
      if (duplicated) return latest;
      const tag = aiCorrections.flatMap((entry) => entry.issues).find((issue) => issue.tag)?.tag;
      return addSentence(latest, {
        sentence,
        translation: item.intentZh,
        keywords: "",
        grammarNote: tag ? `[${tag}:boost] 趁热练里的产出题——这句话还没说顺。` : lesson.oneLineRule,
        sourceId: `boost:${lessonId}`,
        note: `趁热练：${lesson.episode} ${lesson.title}`,
        tags: "语法,强化"
      });
    });
  };

  /**
   * 档 3 收尾 AI 批改：整档结束**一次性**提交本档所有产出（PRD §4.6：不逐题调用）。
   * 修复前只在「看答案」时触发——正常作答（含答对）永远看不到批改，这是体验缺陷。
   */
  const runAiCorrection = async (productions: Array<{ item: BoostItem; text: string }>) => {
    if (aiState === "loading" || aiCorrections.length > 0) return;
    const entries = productions
      .filter((entry) => entry.text.trim())
      .map((entry) => ({
        intentZh: entry.item.intentZh || entry.item.promptZh,
        answerEn: entry.text.trim(),
        targetEn: entry.item.answer,
        taskKind: entry.item.kind
      }));
    if (entries.length === 0) return;
    setAiState("loading");
    setAiNotice(null);
    const anchors = items.map((entry) => entry.answer);
    const outcomeResult = await requestBoostBatchCorrection(
      provider,
      {
        lessonId,
        tier,
        grammarPoint: lesson.grammarLabel,
        contentHash: boostContentHash(lessonId, anchors),
        entries
      },
      correctionStyle
    );
    appendGrammarEvent({
      kind: "grammar_boost_ai_result",
      lessonId,
      tier,
      questionIndex: 0,
      ok: outcomeResult.ok,
      latencyMs: outcomeResult.latencyMs,
      degraded: outcomeResult.degraded,
      degradeReason: outcomeResult.degradeReason,
      ts: nowIso()
    });
    if (outcomeResult.ok && outcomeResult.entries.length > 0) {
      aiUsedRef.current = true;
      setAiCorrections(outcomeResult.entries);
      setAiState("done");
      return;
    }
    setAiState("degraded");
    setAiNotice(
      outcomeResult.degradeReason === "not_configured"
        ? "还没配置 AI——先看下面的对照（配置后可以看到错在哪一类）。"
        : "AI 这次没接上——先看下面的对照。"
    );
  };

  /**
   * 档 3 变式题补齐：本地锚点不足时生成（答案先定，AI 只措辞且过 6 条校验）。
   * 用户反馈题型重复 → 补齐数量从 1 提到 2，且锚点池扩到本课全部素材（取更多不同句子）。
   */
  const loadAiVariants = async (existing: BoostItem[]) => {
    const localCount = existing.filter((item) => item.itemKind === "derived").length;
    const missing = Math.max(0, BOOST_TIER_META[3].questionCount - existing.length);
    if (missing === 0) return;
    // 锚点池：本课所有可用句子（不再只用已出的题）——池子更大，生成题的句子才不重复
    const pool = buildBoostItems(lessonId, 3, {});
    const anchorSource = [...pool, ...existing];
    const seenAnchor = new Set<string>();
    const anchors = anchorSource
      .filter((item) => item.answer.trim() && item.intentZh.trim())
      .filter((item) => {
        const key = normalizeLessonSentence(item.answer);
        if (seenAnchor.has(key)) return false;
        seenAnchor.add(key);
        return true;
      })
      .slice(0, 8)
      .map((item) => ({ en: item.answer, zh: item.intentZh }));
    if (anchors.length === 0) return;
    const outcome = await requestBoostVariantItems(provider, {
      lessonId,
      anchors,
      grammarPoint: lesson.grammarLabel,
      // 把弱点的人话说法交给 AI，让它优先挑相关锚点出题（R-B15 的 AI 侧接线）
      weakSpotPlain: weakSpotPlain ? [weakSpotPlain] : undefined,
      count: Math.max(missing, localCount === 0 ? 2 : 1),
      contentHash: boostContentHash(lessonId, anchors.map((anchor) => anchor.en))
    });
    appendGrammarEvent({
      kind: "grammar_boost_ai_result",
      lessonId,
      tier,
      questionIndex: 1,
      ok: outcome.ok,
      latencyMs: outcome.latencyMs,
      degraded: outcome.degraded,
      degradeReason: outcome.degradeReason,
      ts: nowIso()
    });
    if (!outcome.ok || outcome.items.length === 0) return;
    const usedAnswers = new Set(existing.map((item) => normalizeLessonSentence(item.answer)));
    const additions = outcome.items
      .filter((generated) => !usedAnswers.has(normalizeLessonSentence(generated.answer)))
      .slice(0, missing)
      .map((generated, position) => generatedToBoostItem(generated, lessonId, position, lesson.oneLineRule));
    if (additions.length === 0) return;
    setItems((previous) => [...previous, ...additions].slice(0, BOOST_TIER_META[3].questionCount));
  };

  useEffect(() => {
    if (phase !== "running" || tier !== 3 || items.length === 0 || !aiReady) return;
    if (items.length >= BOOST_TIER_META[3].questionCount) return;
    void loadAiVariants(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, tier, items.length, aiReady]);

  // ── 判题分支 ──────────────────────────────────────────────

  /** 答对之后的统一收口：判题 → 记步 → 展示「为什么」。 */
  const passItem = (item: BoostItem, attempts: number) => {
    setOutcome("pass");
    setFeedback(item.answer);
  };

  const submitContrast = () => {
    if (!currentItem || pickedProblem === null || outcome === "pass") return;
    const attempts = attemptsThisItem + 1;
    setAttemptsThisItem(attempts);
    const passed = judgeBoostItem(currentItem, { pickedProblem }).passed;
    recordStep(currentItem, attempts, passed);
    if (passed) {
      passItem(currentItem, attempts);
    } else {
      setOutcome("retry");
      setFeedback(
        currentItem.contrast?.isWrong
          ? "这句里确实藏着一处问题——再找找看。"
          : "这句其实是没问题的——再想一下。"
      );
    }
  };

  /** 改错：点词块 → 点中即通过；点错给温和提示（不揭答案）。 */
  const submitSpot = (tokenIndex: number) => {
    if (!currentItem || outcome === "pass" || outcome === "revealed") return;
    setSpotPicked(tokenIndex);
    const attempts = attemptsThisItem + 1;
    setAttemptsThisItem(attempts);
    const passed = judgeBoostItem(currentItem, { tokenIndex }).passed;
    recordStep(currentItem, attempts, passed);
    if (passed) {
      passItem(currentItem, attempts);
    } else {
      setOutcome("retry");
      setFeedback("这个词看着没问题——再找找别的地方。");
    }
  };

  /** 选择 / 变形：点选项即判（选项少，不需要二次确认）。 */
  const submitChoice = (option: string) => {
    if (!currentItem || outcome === "pass" || outcome === "revealed") return;
    setChoicePicked(option);
    const attempts = attemptsThisItem + 1;
    setAttemptsThisItem(attempts);
    const passed = judgeBoostItem(currentItem, { text: option }).passed;
    recordStep(currentItem, attempts, passed);
    if (passed) {
      passItem(currentItem, attempts);
    } else {
      setOutcome("retry");
      setFeedback("还差一点——想想主语是谁，搭档要跟着变。");
    }
  };

  const submitCloze = () => {
    if (!currentItem || !clozePicked || outcome === "pass") return;
    const attempts = attemptsThisItem + 1;
    setAttemptsThisItem(attempts);
    const passed = judgeBoostItem(currentItem, { text: clozePicked }).passed;
    recordStep(currentItem, attempts, passed);
    if (passed) {
      passItem(currentItem, attempts);
    } else {
      setOutcome("retry");
      setFeedback("还差一点——再看一眼整句的意思，换个词试试。");
    }
  };

  const pickToken = (token: string) => {
    if (!currentItem || outcome === "pass") return;
    const next = [...builtTokens, token];
    setBuiltTokens(next);
    // 判题时机 = 摆满「答案词数」，不是词块库总数——带干扰项时两者不等；
    // 若等总数，用户拼对了正确答案也永远不会结算（丢词块 bug）。
    if (next.length < boostArrangeAnswerLength(currentItem)) return;
    const attempts = attemptsThisItem + 1;
    setAttemptsThisItem(attempts);
    const passed = judgeBoostItem(currentItem, { tokens: next }).passed;
    recordStep(currentItem, attempts, passed);
    if (passed) {
      setOutcome("pass");
      setFeedback(currentItem.answer);
    } else {
      setOutcome("retry");
      setFeedback("顺序还不太对——整句读一遍，再调整一下。");
    }
  };

  const submitText = () => {
    if (!currentItem || !textValue.trim() || outcome === "pass") return;
    const attempts = attemptsThisItem + 1;
    setAttemptsThisItem(attempts);
    const result = judgeBoostItem(currentItem, { text: textValue });
    recordStep(currentItem, attempts, result.passed);
    // 记下本档产出：档 3 收尾时会一次性送 AI 批改（答对也要——批改不只是纠错）。
    if (tier === 3) {
      const existing = productionsRef.current.findIndex((entry) => entry.item.id === currentItem.id);
      const record = { item: currentItem, text: textValue };
      if (existing >= 0) productionsRef.current[existing] = record;
      else productionsRef.current.push(record);
    }
    if (result.passed) {
      setOutcome("pass");
      setFeedback(currentItem.answer);
      return;
    }
    setOutcome("retry");
    const score = result.score ?? 0;
    setFeedback(
      score === 0
        ? "还没对上——要不要先要一级提示？"
        : `已经对了一部分（${score}%）。再看一眼中文意思，调整一下。`
    );
    // 档 3：产出失败即入 SM-2（仅档 3，PRD §4.9）
    if (tier === 3 && attempts >= 2) queueFailedProduce(currentItem, textValue);
  };

  const revealAnswer = () => {
    if (!currentItem || outcome === "pass") return;
    recordStep(currentItem, attemptsThisItem + 1, false);
    setAttemptsThisItem((value) => value + 1);
    setOutcome("revealed");
    if (tier === 3) {
      queueFailedProduce(currentItem, textValue);
      // 看过答案也算一次产出记录（AI 会看到用户原本写的句子）
      if (textValue.trim()) {
        const existing = productionsRef.current.findIndex((entry) => entry.item.id === currentItem.id);
        const record = { item: currentItem, text: textValue };
        if (existing >= 0) productionsRef.current[existing] = record;
        else productionsRef.current.push(record);
      }
    }
  };

  const goNextFromFeedback = () => {
    if (outcome === "pass" || outcome === "revealed") {
      advance(true);
      return;
    }
    // retry：清空重来
    setOutcome("idle");
    setFeedback(null);
    setTextValue("");
    setClozePicked(null);
    setSpotPicked(null);
    setChoicePicked(null);
    setBuiltTokens([]);
  };

  // ── 档选择态 ──────────────────────────────────────────────

  if (phase === "select") {
    return (
      <div className="page lesson-page">
        <PageHeader
          eyebrow="语法 · 趁热练"
          title={`第 ${lesson.number} 课 · ${lesson.title}`}
          description="趁热再练一遍——现在就练，比等明天更容易记住。做一档就够，不想做也可以直接走。"
          action={progressLabel ? (
            <div className="lesson-progress-pill" aria-label="趁热练进度">
              <Flame size={16} />
              <span>{progressLabel}</span>
            </div>
          ) : undefined}
        />
        <section className="lesson-stage" aria-label="选择档位">
          <div className="boost-tier-list">
            {BOOST_TIERS.map((item) => {
              const tierMeta = BOOST_TIER_META[item];
              const isDone = doneTiers.has(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`boost-tier-card${isDone ? " done" : ""}${item === suggested && !isDone ? " suggest" : ""}`}
                  onClick={() => {
                    startTier(item);
                  }}
                >
                  <span className="boost-tier-head">
                    <strong>{tierMeta.name}</strong>
                    {isDone && <span className="boost-tier-done"><CheckCircle2 size={14} /> 走过一遍</span>}
                    {!isDone && item === suggested && <span className="boost-tier-suggest">建议从这里开始</span>}
                  </span>
                  <span className="boost-tier-summary">{tierMeta.summaryZh}</span>
                  {item === 3 && (
                    <span className="boost-tier-note">
                      {aiReady
                        ? "做完这一档，AI 会把你写的几句一起看一遍：改顺的写法 + 错在哪一类"
                        : "没配置 AI 也能做——会给答案对照（配置后能看到错在哪一类）"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="lesson-stage-actions">
            <Link to="/grammar" className="ghost-link">今天先到这</Link>
          </div>
        </section>
      </div>
    );
  }

  // ── 单档完成态 ────────────────────────────────────────────

  if (phase === "done") {
    const nextTier = BOOST_TIERS.find((item) => !getLessonBoostTiersDone(data, lessonId).has(item));
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 趁热练" title={`第 ${lesson.number} 课 · ${meta.name}`} />
        <section className="lesson-stage" aria-label="本档完成">
          <div className="lesson-complete">
            <header className="complete-hero">
              <span className="complete-hero-badge">
                <CheckCircle2 size={26} strokeWidth={2.4} />
              </span>
              <h2>{tier === 1 ? "这一课的记忆稳住了" : "又稳了一层"}</h2>
              <p className="complete-hero-sub">
                「{meta.name}」走完了一遍——{firstTryCount} / {items.length} 题一次就对。今天练到这也算数。
              </p>
            </header>

            {/* 每档完成后 1 题自评（R-B16）：只记录，不再追加任何动作 */}
            <div className="boost-self-eval">
              <p className="boost-self-eval-title">这一档的感觉如何？（选一下就行）</p>
              <div className="boost-self-eval-options">
                {([
                  { key: "easy", label: "挺顺利" },
                  { key: "ok", label: "有点想" },
                  { key: "hard", label: "还不太顺" }
                ] as const).map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`boost-self-eval-btn${selfEval === option.key ? " picked" : ""}`}
                    onClick={() => {
                      setSelfEval(option.key);
                      appendGrammarEvent({
                        kind: "grammar_boost_step_result",
                        lessonId,
                        tier,
                        itemKind: "derived",
                        sourceRef: `self-eval:${option.key}`,
                        attempts: 1,
                        passed: option.key === "easy",
                        ts: nowIso()
                      });
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {aiState === "loading" && (
              <p className="boost-ai-notice" aria-live="polite">AI 正在看看你刚写的这几句……</p>
            )}
            {aiState === "degraded" && aiNotice && <p className="boost-ai-notice">{aiNotice}</p>}
            {aiCorrections.length > 0 && (
              <div className="boost-ai-card">
                <p className="boost-ai-title"><Sparkles size={14} /> AI 看了看你写的这几句</p>
                {aiCorrections.map((entry, position) => (
                  <div className="boost-ai-entry" key={position}>
                    <p className="boost-ai-line">你这句：<em>{entry.originalEn}</em></p>
                    <p className="boost-ai-line">改顺一点：<strong>{entry.corrected}</strong></p>
                    {entry.recast && <p className="boost-ai-line">也可以这样说：{entry.recast}</p>}
                    {entry.comment && <p className="boost-ai-line">{entry.comment}</p>}
                    {entry.issues.map((issue, issueIndex) => (
                      <p className="boost-ai-line" key={issueIndex}>· {issue.explanation}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <div className="lesson-stage-actions">
              {nextTier ? (
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    startTier(nextTier);
                  }}
                >
                  再深一点：{BOOST_TIER_META[nextTier].name}（{BOOST_TIER_META[nextTier].minutes} 分钟）
                </button>
              ) : (
                <Link to={`/grammar/lesson/${lesson.id}`} className="primary-button">回这一课看看</Link>
              )}
              <Link to="/grammar" className="secondary-button">今天先到这</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── 单档进行态 ────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 趁热练" title={`第 ${lesson.number} 课 · ${meta.name}`} />
        <EmptyState title="这一档暂时没有题" description="课程素材还不够出题——先回课程地图，晚点再来。" />
        <div className="lesson-stage-actions">
          <Link to="/grammar" className="primary-button">返回课程地图</Link>
        </div>
      </div>
    );
  }

  const itemLabel =
    currentItem?.kind === "contrast"
      ? "这句有问题吗"
      : currentItem?.kind === "spot"
        ? "找出用错的那个词"
        : currentItem?.kind === "cloze"
          ? "补上缺的那个词"
          : currentItem?.kind === "choose"
            ? "选哪个才对"
            : currentItem?.kind === "replace"
              ? "换个说法，动词怎么变"
              : currentItem?.kind === "rebuild" || currentItem?.kind === "arrange"
                ? "点词成句"
                : currentItem?.kind === "recall"
                  ? "看着中文写出来"
                  : currentItem?.kind === "variant"
                    ? "换个说法，自己写"
                    : currentItem?.kind === "fix"
                      ? "把错的改成对的"
                      : "不给提示，自己说";

  return (
    <div className="page lesson-page">
      <PageHeader
        eyebrow={`语法 · 趁热练 · ${meta.name}`}
        title={`第 ${lesson.number} 课 · ${lesson.title}`}
        description={meta.summaryZh}
        action={
          <div className="lesson-progress-pill" aria-label="本档进度">
            <Flame size={16} />
            <span>{index + (outcome === "idle" ? 0 : 1)} / {items.length} 题</span>
          </div>
        }
      />
      <section className="lesson-stage" aria-label="趁热练进行中">
        <div className="lesson-quiz-card">
          <div className="lesson-quiz-head">
            <span className="lesson-quiz-step">第 {index + 1} / {items.length} 题</span>
            <span className="lesson-quiz-note">{itemLabel}</span>
          </div>
          <p className="lesson-quiz-prompt">{currentItem?.promptZh}</p>
          {currentItem?.targetsWeakSpot && weakSpotPlain && (
            <p className="boost-weak-hint">
              <Lightbulb size={13} aria-hidden="true" />
              这道题冲着你之前容易错的地方来的：{weakSpotPlain}
            </p>
          )}
          {currentItem?.intentZh && <p className="lesson-quiz-prompt">这句要说的是：<strong>{currentItem.intentZh}</strong></p>}

          {/* 对比判断 */}
          {currentItem?.kind === "contrast" && currentItem.contrast && (
            <div className="lesson-contrast-block">
              <div className="lesson-contrast-line">
                <span className="lesson-contrast-sentence">{currentItem.contrast.sentence}</span>
                <SpeakButton text={currentItem.contrast.sentence} />
              </div>
              <div className="boost-choice-row">
                <button
                  type="button"
                  className={`boost-choice${pickedProblem === true ? " picked" : ""}`}
                  onClick={() => setPickedProblem(true)}
                  disabled={outcome === "pass"}
                >
                  有点问题
                </button>
                <button
                  type="button"
                  className={`boost-choice${pickedProblem === false ? " picked" : ""}`}
                  onClick={() => setPickedProblem(false)}
                  disabled={outcome === "pass"}
                >
                  没问题
                </button>
              </div>
              {outcome === "idle" && (
                <div className="lesson-stage-actions center">
                  <button type="button" className="primary-button" onClick={submitContrast} disabled={pickedProblem === null}>
                    确认
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 单空填空 */}
          {currentItem?.kind === "cloze" && (
            <div className="lesson-choose">
              <p className="lesson-choose-sentence">{currentItem.clozeText}</p>
              <div className="boost-choice-row">
                {(currentItem.clozeOptions ?? []).map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={`boost-choice${clozePicked === option ? " picked" : ""}`}
                    onClick={() => setClozePicked(option)}
                    disabled={outcome === "pass"}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {outcome === "idle" && (
                <div className="lesson-stage-actions center">
                  <button type="button" className="primary-button" onClick={submitCloze} disabled={!clozePicked}>
                    确认
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 改错：点出用错了的那个词 */}
          {currentItem?.kind === "spot" && (
            <div className="lesson-contrast-block">
              <div className="lesson-spot-row">
                {(currentItem.spotTokens ?? []).map((token, position) => (
                  <button
                    type="button"
                    className={`lesson-chip${spotPicked === position ? " picked" : ""}`}
                    key={`${token}-${position}`}
                    onClick={() => submitSpot(position)}
                    disabled={outcome === "pass" || outcome === "revealed"}
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 选择 / 变形 */}
          {(currentItem?.kind === "choose" || currentItem?.kind === "replace") && (
            <div className="lesson-choose">
              {currentItem.replaceBase && (
                <p className="lesson-choose-sentence">
                  {currentItem.replaceBase}
                  {currentItem.replaceTarget && <span className="boost-replace-target">（{currentItem.replaceTarget}）</span>}
                </p>
              )}
              {currentItem.chooseBefore != null && (
                <p className="lesson-choose-sentence">
                  {currentItem.chooseBefore} <span className="boost-blank">____</span> {currentItem.chooseAfter}
                </p>
              )}
              <div className="boost-choice-row">
                {(currentItem.options ?? []).map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={`boost-choice${choicePicked === option ? " picked" : ""}`}
                    onClick={() => submitChoice(option)}
                    disabled={outcome === "pass" || outcome === "revealed"}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 词块重建 / 点词成句 */}
          {(currentItem?.kind === "rebuild" || currentItem?.kind === "arrange") && (
            <div>
              <div className="lesson-build-area lit" aria-label="已选词块">
                {builtTokens.map((token, position) => (
                  <button
                    type="button"
                    className="lesson-chip built"
                    key={`${token}-${position}`}
                    // 点一下移除：放错词块时能只改那一处，不必整题重来（与课内点词成句一致）
                    onClick={() => {
                      if (outcome === "pass" || outcome === "revealed") return;
                      setBuiltTokens((previous) => previous.filter((_value, index) => index !== position));
                      setOutcome("idle");
                      setFeedback(null);
                    }}
                    title="点一下移除这个词块"
                  >
                    {token}
                  </button>
                ))}
              </div>
              <div className="lesson-spot-row">
                {(currentItem.tokens ?? []).map((token, position) => {
                  const usedCount = builtTokens.filter((value) => value === token).length;
                  const totalCount = (currentItem.tokens ?? []).filter((value) => value === token).length;
                  return (
                    <button
                      type="button"
                      className="lesson-chip"
                      key={`${token}-${position}`}
                      onClick={() => pickToken(token)}
                      disabled={usedCount >= totalCount || outcome === "pass" || outcome === "revealed"}
                    >
                      {token}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 中文→整句 / 无提示产出 / 变式产出 / 自己改错（都要自己写出整句） */}
          {(["recall", "produce", "variant", "fix", "free"] as const).includes(
            currentItem?.kind as "recall" | "produce" | "variant" | "fix" | "free"
          ) && (
            <div>
              {/* variant / fix：先给出「已知的样例句」，让任务边界清楚 */}
              {currentItem?.shapedFrom && (
                <div className="boost-shaped-block">
                  <span className="boost-shaped-label">{currentItem.shapedLabel}</span>
                  <p className="boost-shaped-sentence">
                    {currentItem.shapedFrom}
                    <SpeakButton text={currentItem.shapedFrom} />
                  </p>
                </div>
              )}
              {currentItem.hints && hintLevel > 0 && (
                <div className="boost-hint-box">
                  {currentItem.hints.slice(0, hintLevel).map((hint, position) => (
                    <p key={position}><Lightbulb size={13} /> {hint}</p>
                  ))}
                </div>
              )}
              <div className="answer-box">
                <input
                  className="large-textarea"
                  value={textValue}
                  onChange={(event) => setTextValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && textValue.trim()) submitText();
                  }}
                  placeholder="写下这句话（回车提交）"
                  aria-label="产出答案"
                  disabled={outcome === "pass" || outcome === "revealed"}
                />
              </div>
              {outcome === "idle" && (
                <div className="lesson-stage-actions center">
                  <button type="button" className="primary-button" onClick={submitText} disabled={!textValue.trim()}>
                    提交
                  </button>
                  {currentItem.hints && hintLevel < currentItem.hints.length && (
                    <button type="button" className="ghost-link" onClick={() => setHintLevel((value) => value + 1)}>
                      想不起来，要一级提示
                    </button>
                  )}
                  {attemptsThisItem > 0 && (
                    <button type="button" className="ghost-link" onClick={revealAnswer}>
                      看答案
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 反馈 */}
          {(outcome === "pass" || outcome === "revealed") && (
            <div className="lesson-feedback pass" aria-live="polite">
              <p>
                <CheckCircle2 size={16} />
                {outcome === "pass" ? "对了！" : "没关系，先看一眼："}
                <strong>{currentItem?.answer}</strong>
              </p>
              {/* 关键：答对也要讲「为什么」——只给答案学不到下次怎么用（用户反馈）。
                  讲解来自课程自带解释（contrast.whyZh / guided.explain / recall.noteZh / 一句话规则）。 */}
              {currentItem?.explainZh && (
                <p className="boost-why">
                  <Lightbulb size={14} aria-hidden="true" />
                  <span>{currentItem.explainZh}</span>
                </p>
              )}
              {currentItem?.kind === "spot" && currentItem.spotCorrectionZh && (
                <p className="boost-why"><Info size={14} aria-hidden="true" /><span>{currentItem.spotCorrectionZh}</span></p>
              )}
              <p className="boost-check-note">
                <Info size={13} />
                {outcome === "pass"
                  ? "这一句现在能自己说出来了——比昨天进步了一点。"
                  : "这句已经排进复习队列，后面会再见到它。"}
                {" "}
                <Link to={`/grammar/lesson/${lesson.id}`} className="ghost-link">回这一课看看</Link>
              </p>
              <div className="lesson-stage-actions center">
                <button type="button" className="primary-button" onClick={goNextFromFeedback}>
                  {index + 1 >= items.length ? "完成这一档" : "下一题"}
                </button>
                <SpeakButton text={currentItem?.answer ?? ""} />
              </div>
            </div>
          )}
          {outcome === "retry" && (
            <div className="lesson-feedback retry" aria-live="polite">
              <p>{feedback}</p>
              {/* 答错时给一句方向性提示（仍不揭答案）：用户反馈「不要只给答案」——先讲思路，再看答案。 */}
              {currentItem?.explainZh && (
                <p className="boost-why">
                  <Lightbulb size={14} aria-hidden="true" />
                  <span>{currentItem.explainZh}</span>
                </p>
              )}
              <div className="lesson-stage-actions center">
                <button type="button" className="primary-button" onClick={goNextFromFeedback}>
                  <RotateCcw size={14} /> 再试一次
                </button>
                {currentItem && !["contrast", "cloze", "spot", "choose", "replace"].includes(currentItem.kind) && (
                  <button type="button" className="ghost-link" onClick={revealAnswer}>看答案（会排进复习）</button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lesson-stage-actions center">
          <Link to="/grammar" className="ghost-link">
            先回去，晚点再来
          </Link>
        </div>
      </section>
    </div>
  );
}
