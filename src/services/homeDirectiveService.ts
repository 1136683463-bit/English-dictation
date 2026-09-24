import type { AppData, Adventure, AdventureNode } from "../types";
import { getCurrentAdventureNode, sortAdventuresForList } from "./adventureService";
import { listDueGrammarReviewCards } from "./grammarReviewService";
import { summarizeLessonProgress, type LessonProgressSummary } from "./lessonService";
import { getLearningStats } from "./reviewService";
import { formatRelativeTime } from "./relativeTime";

/**
 * 首页「今天做什么」的**唯一决策点**（2026-09-24 首页重规划 P1）。
 *
 * ## 为什么要单独一个服务
 *
 * 改造前，首页 Hero 的文案与主按钮来自**两个互不相干的口径**：
 * `TodayPage` 的 `primaryTask` 只看词汇三数（`dueTotal / weakWords / availableNewWords`），
 * 而 action 槽硬锁语法线（`grammarTarget`）。真实数据下（0 到期 / 0 薄弱 / 115 新词 / 0 课）
 * 必然渲染成「建议**可以推进新词**」+ 主按钮「继续第 1 课」——
 * 一句话推荐词汇、按钮开语法，**是代码与数据的必然结果，不是偶发文案问题**。
 *
 * ⇒ 修法不是改文案，是**让文案与按钮读同一个变量**：Hero 描述、主 CTA 文案、
 * 主 CTA 落点、右上角「为什么是它」说明行、三线状态行排序，五处共用本函数的返回值。
 * 结构上因此不可能再不同源（守门见 `src/edge/verify/rv15-*.test.tsx` 与 `rv20-*.test.tsx`）。
 *
 * ## 口径纪律（本仓库硬约定）
 *
 * 本服务**只做决策，不做计算**：所有数字都从既有权威服务取
 * （`getLearningStats` / `summarizeLessonProgress` / `listDueGrammarReviewCards` /
 * `sortAdventuresForList` / `getCurrentAdventureNode`）。
 * 首页曾经因为「就地数排期」与权威口径不一致而给出自相矛盾的数字（rv19 已修），
 * 这里不再犯第二次。
 */

/** 三条内容线。用于 CTA 归属、三线状态行、以及守门测试的错配检测。 */
export type HomeLine = "vocab" | "grammar" | "adventure";

export const HOME_LINE_LABEL: Record<HomeLine, string> = {
  vocab: "记忆",
  grammar: "语法阶梯",
  adventure: "冒险"
};

/**
 * 冒险「续上优先」的时效窗口。
 *
 * 析客规格定为 7 天：更久的半程故事不再算「当前中断点」，避免主推荐长期停在旧故事上。
 * 做成命名常量有明确目的——决策门 A1 的触发条件就是「三线行可见但冒险行 3 次会话 0 点击」，
 * 届时若要放宽窗口，改这一行即可，不必翻规则正文。
 *
 * ⚠️ 对当前真实数据的影响（实施期实测，必须写进结论）：
 * 最深的「海岸列车」8 章停在 2026-09-10，距复核日（09-24）14 天，**超出窗口**；
 * 唯一在窗口内的 `updatedAt`（09-16 的「城市寻信」）只有 1 个节点、未读过第 2 章。
 * ⇒ 真实数据下主 CTA 会落在词汇线（`availableNewWords = 115`）。
 * 这正是开放问题 Q1 要回答的价值判断，不是本实现的缺陷。
 */
const ADVENTURE_RESUME_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/** 一条线在首页首屏的状态摘要（「三线状态行」的一行）。 */
export interface HomeLineRow {
  line: HomeLine;
  to: string;
  /** 右侧进度位（如语法线的 `3/205`）。没进度语义的线为 undefined。 */
  value?: string;
  /** 「上次位置」短语（如「第 8 章」「12 个到期」）。**不含今日计数以外的重复仪表盘**。 */
  position: string;
  /** 下一步动作短语（如「继续阅读」）。 */
  action: string;
  /** 相对时间（如「2 天前」）。该线无时间信息时为 null。 */
  timeLabel: string | null;
  /** 最近活动时间戳，用于排序；null = 无活动记录。 */
  activityAt: number | null;
}

export interface HomeDirective {
  line: HomeLine;
  /** 主 CTA 落点。 */
  to: string;
  /** 主 CTA 文案。 */
  ctaLabel: string;
  /** Hero 描述句——与 `ctaLabel` / `to` 同源，由同一个 `line` 决定。 */
  heroDesc: string;
  /** 右上角「为什么是它」说明行。 */
  reason: string;
}

export interface HomeDirectiveInput {
  /** 页面**算一次**的共享快照（见 `buildHomeSnapshot`）。传快照而不是 `AppData`，是为了让「一次渲染只算一遍」成为签名层面的事实。 */
  snapshot: HomeSnapshot;
  /** 「先练 N 分钟」的 N。由页面按既有 `estimateMinutes` 算好传入——本服务不重复一套估算。 */
  minutes: number;
  /** 「9月24日 星期四」这类日期标签。由页面按 `Intl` 生成后传入。 */
  dateLabel: string;
}

/**
 * 首页一次渲染所需的全部派生数据——**只在这里算，每渲染一次**。
 *
 * 为什么要有这个中间物：`buildHomeDirective` 与 `buildHomeLineRows` 都需要
 * `getLearningStats` / `summarizeLessonProgress` / `listDueGrammarReviewCards` 这三样。
 * 若让两个函数各自去取，一次首页渲染就会把这三样各算两遍（`listDueGrammarReviewCards`
 * 要扫全部卡片，不便宜）。本仓库有专门的闸在盯这类重复计算
 * （`pf2e-cache-candidates` / `pf2f-page-call-counts`），所以这里做成显式快照：
 * **页面算一次、两个函数共用**，签名上就不给「各自再算一遍」留口子。
 */
export interface HomeSnapshot {
  stats: ReturnType<typeof getLearningStats>;
  lessonProgress: LessonProgressSummary;
  dueGrammarCards: number;
  adventures: Adventure[];
}

export const buildHomeSnapshot = (data: AppData, now: number = Date.now()): HomeSnapshot => ({
  stats: getLearningStats(data),
  lessonProgress: summarizeLessonProgress(data),
  dueGrammarCards: listDueGrammarReviewCards(data, new Date(now)).length,
  adventures: data.adventures
});

/** 把落点路径映射回内容线——守门测试与页面共用同一个函数，避免闸里自己写一套正则。 */
export const lineOfPath = (href: string): HomeLine | null => {
  if (href.startsWith("/grammar")) return "grammar";
  if (href.startsWith("/adventure")) return "adventure";
  const vocabPrefixes = [
    "/review",
    "/training",
    "/mistakes",
    "/words",
    "/units",
    "/sentences",
    "/spelling",
    "/library",
    "/add",
    "/today",
    "/stats",
    "/settings",
    "/welcome"
  ];
  return vocabPrefixes.some((prefix) => href.startsWith(prefix)) ? "vocab" : null;
};

const timeOf = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * 冒险的「中断点」：最近读过、且已经读进第 2 章以后的那一段。
 *
 * 两处判定说明（都与析客规格的逐字表述略有出入，理由写在代码里而不是含糊过去）：
 *
 * 1. **扫全部而不只看 `sortAdventuresForList()[0]`**。规格写的是「取排序第一条，条件 `nodes.length > 1`」，
 *    但那会让一段**刚创建、只读到第 1 章**的新故事挡住一段读到第 8 章的旧故事——
 *    而前者恰恰是「还没读」而不是「读了一半」。改为在已排序列表里取**第一条真正读进去的**。
 *    真实数据下两种写法结果相同（都因超出窗口而不命中），所以这不是为某份数据做的特调。
 *
 * 2. **`!last.selectedChoiceId` 作为「这一章还没做出选择」的判据**。写入选分支时
 *    （`adventureService.ts:476`）是「把 `selectedChoiceId` 记在**父节点**上、再追加新节点」，
 *    所以当前末节点带 `selectedChoiceId` 只会在「已选择但下一章没生成出来」时出现——
 *    那不是一个可继续的阅读点，排除掉是对的。
 *
 * 另外：`Adventure.updatedAt` 可安全用作「上次阅读」代理——全库只有 4 处写它
 * （建冒险 `:413`、生成下一章 `:476`、跳回已读节点 `:498`、在阅读器里更新某章生词 `:548`），
 * 没有改名之类的非阅读写入（产品无改名功能）。
 */
const findAdventureResumePoint = (
  adventures: Adventure[],
  now: number
): { adventure: Adventure; node: AdventureNode; at: number } | null => {
  for (const adventure of sortAdventuresForList(adventures)) {
    if (adventure.nodes.length <= 1) continue;
    const node = getCurrentAdventureNode(adventure);
    if (!node) continue;
    if (node.selectedChoiceId) continue;
    const at = timeOf(adventure.updatedAt);
    if (at === null) continue;
    if (now - at > ADVENTURE_RESUME_WINDOW_MS) continue;
    return { adventure, node, at };
  }
  return null;
};

/** 三线状态行（按最近活动倒序；无活动时间的线排在有时间的线之后，同为空时用固定序）。 */
export const buildHomeLineRows = (snapshot: HomeSnapshot, now: number = Date.now()): HomeLineRow[] => {
  const { stats, lessonProgress, dueGrammarCards, adventures } = snapshot;

  const rows: HomeLineRow[] = [];

  // ── 冒险：唯一有真实消费的一条线，也是改造前首页引用数为 0 的那条 ──
  const latestAdventure = sortAdventuresForList(adventures)[0];
  if (latestAdventure) {
    const node = getCurrentAdventureNode(latestAdventure);
    rows.push({
      line: "adventure",
      to: `/adventure/${latestAdventure.id}`,
      position: node ? `《${latestAdventure.title}》第 ${node.chapter} 章` : `《${latestAdventure.title}》`,
      action: "继续阅读",
      timeLabel: formatRelativeTime(latestAdventure.updatedAt, now),
      activityAt: timeOf(latestAdventure.updatedAt)
    });
  } else {
    rows.push({
      line: "adventure",
      to: "/adventure",
      position: "还没有冒险",
      action: "选一个主题开始",
      timeLabel: null,
      activityAt: null
    });
  }

  // ── 语法：位置用课号，进度用 done/total（rv15 的「语法阶梯」+ `/205` 锚点就落在这里） ──
  if (lessonProgress.nextLesson) {
    rows.push({
      line: "grammar",
      to: dueGrammarCards > 0 ? "/grammar/review" : `/grammar/lesson/${lessonProgress.nextLesson.id}`,
      value: `${lessonProgress.done}/${lessonProgress.total}`,
      position:
        dueGrammarCards > 0
          ? `第 ${lessonProgress.nextLesson.number} 课 · 先清 ${dueGrammarCards} 个到期语法句`
          : `第 ${lessonProgress.nextLesson.number} 课`,
      action: dueGrammarCards > 0 ? "去复习" : "继续学习",
      // 语法线本期不出时间：`grammarLessonsDone` 是 string[]，没有完课时间戳（要 schema v9，已推迟 v2）。
      timeLabel: null,
      activityAt: null
    });
  } else {
    rows.push({
      line: "grammar",
      to: "/grammar",
      value: `${lessonProgress.done}/${lessonProgress.total}`,
      position: "全部课程已学完",
      action: "去复习巩固",
      timeLabel: null,
      activityAt: null
    });
  }

  // ── 记忆（词汇）：位置给「下一步该做什么」，不给今日计数（strip 已经有四个了） ──
  const vocabPosition =
    stats.dueTotal > 0
      ? `${stats.dueTotal} 个到期待复习`
      : stats.availableNewWords > 0
        ? `${stats.availableNewWords} 个新词待学`
        : stats.newCards > 0
          ? `${stats.newCards} 张新卡待学`
          : stats.mastered > 0
            ? `已掌握 ${stats.mastered} 个`
            : "还没有卡片";
  const vocabTo = stats.dueTotal > 0 ? "/review" : stats.availableNewWords > 0 ? "/training" : "/words";
  const vocabAction = stats.dueTotal > 0 ? "去复习" : stats.availableNewWords > 0 ? "推进新词" : "看看词库";
  rows.push({
    line: "vocab",
    to: vocabTo,
    position: vocabPosition,
    action: vocabAction,
    timeLabel: stats.latestReviewAt ? formatRelativeTime(stats.latestReviewAt, now) : null,
    activityAt: timeOf(stats.latestReviewAt)
  });

  /**
   * 排序：最近活动倒序，无活动时间的排后面。
   * 同为空时用固定序 冒险 > 语法 > 记忆（与 R1 的平局规则一致，保证渲染顺序确定、可断言）。
   */
  const fixedOrder: Record<HomeLine, number> = { adventure: 0, grammar: 1, vocab: 2 };
  return rows.slice().sort((a, b) => {
    if (a.activityAt !== null && b.activityAt !== null) {
      if (b.activityAt !== a.activityAt) return b.activityAt - a.activityAt;
      return fixedOrder[a.line] - fixedOrder[b.line];
    }
    if (a.activityAt !== null) return -1;
    if (b.activityAt !== null) return 1;
    return fixedOrder[a.line] - fixedOrder[b.line];
  });
};

/**
 * 主推荐（Hero 文案 + 主 CTA + 说明行）——**唯一决策点**。
 *
 * 规则（析客 R1/R2/R3）：
 * - **R1 续上优先**：三线各产出一个「中断点」候选，取最近活动者（同分或同为空时 冒险 > 语法 > 词汇）。
 * - **R2 无中断点时的回退链**（已开始的线优先）：下一课 → 推进新词 → 语法到期。
 * - **R3 全空兜底**：先去添加内容。
 */
export const buildHomeDirective = (input: HomeDirectiveInput): HomeDirective => {
  const { snapshot, minutes, dateLabel } = input;
  const now = Date.now();
  const { stats, lessonProgress, dueGrammarCards } = snapshot;
  const suffix = `${dateLabel} · 建议先练 ${minutes} 分钟`;

  type Candidate = { line: HomeLine; at: number | null; to: string; label: string; reason: string };
  const candidates: Candidate[] = [];

  // ── R1 · 续上优先 ──
  const resume = findAdventureResumePoint(snapshot.adventures, now);
  if (resume) {
    candidates.push({
      line: "adventure",
      at: resume.at,
      to: `/adventure/${resume.adventure.id}`,
      label: `继续《${resume.adventure.title}》第 ${resume.node.chapter} 章`,
      reason: `冒险 · 第 ${resume.node.chapter} 章 · ${formatRelativeTime(resume.adventure.updatedAt, now)}读过`
    });
  }
  if (dueGrammarCards > 0) {
    candidates.push({
      line: "grammar",
      at: null,
      to: "/grammar/review",
      label: `复习 ${dueGrammarCards} 个语法句`,
      reason: `语法 · ${dueGrammarCards} 个到期语法句`
    });
  }
  if (stats.dueTotal > 0) {
    candidates.push({
      line: "vocab",
      at: timeOf(stats.latestReviewAt),
      to: "/review",
      label: `先清 ${stats.dueTotal} 个到期`,
      reason: `记忆 · ${stats.dueTotal} 个到期${stats.latestReviewAt ? ` · 上次 ${formatRelativeTime(stats.latestReviewAt, now)}` : ""}`
    });
  }

  if (candidates.length > 0) {
    const fixedOrder: Record<HomeLine, number> = { adventure: 0, grammar: 1, vocab: 2 };
    const picked = candidates.slice().sort((a, b) => {
      if (a.at !== null && b.at !== null) {
        if (b.at !== a.at) return b.at - a.at;
        return fixedOrder[a.line] - fixedOrder[b.line];
      }
      if (a.at !== null) return -1;
      if (b.at !== null) return 1;
      return fixedOrder[a.line] - fixedOrder[b.line];
    })[0];
    return { line: picked.line, to: picked.to, ctaLabel: picked.label, heroDesc: suffix, reason: picked.reason };
  }

  // ── R2 · 回退链（已开始的线优先） ──
  if (lessonProgress.done > 0 && lessonProgress.nextLesson) {
    return {
      line: "grammar",
      to: `/grammar/lesson/${lessonProgress.nextLesson.id}`,
      ctaLabel: `继续第 ${lessonProgress.nextLesson.number} 课`,
      heroDesc: suffix,
      reason: `语法 · 已学 ${lessonProgress.done}/${lessonProgress.total} 课 · 下一课「${lessonProgress.nextLesson.title}」`
    };
  }
  if (lessonProgress.done === 0 && lessonProgress.total > 0) {
    /**
     * 一课没学时推第 1 课，而不是「推进新词」。
     *
     * 这是 R2 里唯一一处**与「已开始的线优先」字面顺序不同**的判断：`availableNewWords > 0`
     * 在真实数据下恒为真（115 张卡全是 `new`），若让它排在前面，语法线就永远拿不到主推荐——
     * 而语法线恰恰是「入口已到位、一次没打开」的那条（`grammar-telemetry-events-v1` 键至今不存在）。
     * ⇒ 把「零课的语法线」当作**尚未开始的必答项**，优先于「继续堆新词」。
     * 这也是 `rv15` 既有断言「零进度时 CTA 落点是第 1 课」所要求的落点——
     * 该断言是改造前就存在的守门，本实现保持它成立而不是绕开它。
     */
    const firstLesson = lessonProgress.nextLesson;
    if (firstLesson) {
      return {
        line: "grammar",
        to: `/grammar/lesson/${firstLesson.id}`,
        ctaLabel: `从第 ${firstLesson.number} 课开始`,
        heroDesc: suffix,
        reason: `语法 · ${lessonProgress.total} 课还没开始 · 第一课「${firstLesson.title}」`
      };
    }
  }
  if (stats.availableNewWords > 0) {
    return {
      line: "vocab",
      to: "/training",
      ctaLabel: `推进 ${stats.availableNewWords} 个新词`,
      heroDesc: suffix,
      reason: `记忆 · ${stats.availableNewWords} 个新词待学`
    };
  }
  if (stats.newCards > 0) {
    return {
      line: "vocab",
      to: "/training",
      ctaLabel: `推进 ${stats.newCards} 张新卡`,
      heroDesc: suffix,
      reason: `记忆 · ${stats.newCards} 张新卡待学`
    };
  }

  // ── R3 · 全空兜底 ──
  return {
    line: "vocab",
    to: "/add",
    ctaLabel: "先去添加内容",
    heroDesc: suffix,
    reason: "还没有可练的内容 · 先导入或新建一些单词与句子"
  };
};
