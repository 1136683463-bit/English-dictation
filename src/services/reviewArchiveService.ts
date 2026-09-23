import type { AppData, Review } from "../types";

/**
 * 复习历史的归档（2026-09-22，2026-09-23 修正配额口径）。
 *
 * ## 为什么需要
 *
 * 按「每天 20 分钟」模拟，撞到 localStorage 上限只是时间问题，
 * 而届时用户唯一的清理入口是「清空本机全部学习数据」——把所有进度一起清零。
 * `reviews` 是体积最大的单项（24 个月模型中占 **44.8%**），且**无上限增长**。
 *
 * ## 撞墙时间取决于运行环境（R11 修正，务必按环境读）
 *
 * 第 9 轮真机实测（Playwright，非 jsdom 推断）发现两个内核**不是同一套账单**：
 * Chromium 按**字符**计，WebKit 按**字节**计——且只要字符串里出现一个
 * U+00FF 以上的字符（汉字全在此列），**整串**按 2 字节/字符计费。
 *
 * 本应用的数据必然含汉字（中文释义、日记、中文标签），所以：
 *
 * | 环境 | 额度（字符） | 撞墙（每天 20 分钟） |
 * |---|---|---|
 * | Chromium / WebView2（Windows） | 5,200,000 | 约 16 个月 |
 * | **WebKit（macOS 桌面端）** | **2,600,000** | **约 8 个月** |
 *
 * **本项目当前交付的就是 macOS 桌面端**，所以要按 8 个月读，不是 16 个月。
 *
 * 历史文档里那个「约 30 个月」用的是**纯 ASCII 词卡模型**（`front: "w0"`、
 * `answer: "x"`、`note: ""`）——那种数据不触发翻倍，于是在字符口径下算出了
 * 一个只在 Chromium 上成立的数字。含中文的真实数据在 24 个月时：
 * 字符口径 5.06MB（能写进 Chromium），字节口径 **10.12MB**（写不进 WebKit）。
 *
 * ⚠️ **证据文件校正（2026-09-24 批六十八）**：上表的月份与账单口径由
 * `src/edge/verify/r13b-quota-wall-recalib.test.ts` 实测（它打印
 * 「Chromium 16→24 / WebKit 8→10」，与本注释一致）。
 * 本注释此前引的 `pf2d-quota-wall-recalib.test.ts` **已不存在**——
 * 该测试后来被改名/重组为 `r13b-*`，注释里的路径没跟着改，成了指向空文件的引用。
 * **要动保留窗口常量时，请跑 `r13b` 复核，不要照抄本注释的数字。**
 *
 * ## 归档策略：久远的日子压成「一天一条」
 *
 * 关键观察：读复习历史的消费方分两类——
 *  ① **只关心「哪天有活动」**：连胜（`computeStreakWithGrace` 遍历日期集合）、
 *     学习日历（`learningTelemetry` 的活动日集合）、里程碑。
 *     实测：把 200 天 × 30 条压成每天 1 条后，`streak` 完全一致（都是 200）。
 *  ② **需要逐条明细**：错词本（按日期分组展示每一条错题）、周报环比、弱点分析。
 *     这些只对**近期**数据有意义——一个 11 个月前的错题，用户既不会去翻，
 *     半衰期 7 天的弱点算法也早已不把它算进弱点。
 *
 * 所以按「保留窗口」切分：窗口内逐条保留明细，窗口外的日子各留一条汇总记录。
 * 汇总记录保留该日的日期与「那天有错题」这一事实（rating 取该日最差），
 * 于是连胜、学习日历、以及「那天错过什么」的日期分组都还在，
 * 只是不再有逐条明细。
 *
 * ## 这不是删除用户数据
 *
 * 汇总记录刻意保留了 `cardId`/`mode`/`rating` 的最低限度信息，
 * 让「那天练过、那天有错」这两件事在数据层仍然成立。
 * 用户可见的「已掌握 N / 共 M 句」「连胜 N 天」「复习总量」都不受影响。
 */

/**
 * 保留窗口（天）。窗口内逐条保留明细，之外按天汇总。
 *
 * 取 180 天的理由：
 *  - 错词本的实用价值集中在近期（用户翻几个月前的错题没有意义）；
 *  - 弱点算法半衰期 7 天，180 天前的权重已衰减到 2^-26；
 *  - 周报/环比只需要跨周，180 天绰绰有余；
 *  - 一年模型下可压缩掉约 51% 的复习记录。
 * 这是一个**保守**取值：宁可少压一些，也不动用户可能还想看的历史。
 *
 * R11 实测的窗口—撞墙对照（供将来调整时参考）：
 *
 * | 保留窗口 | Chromium | WebKit（桌面端） |
 * |---|---|---|
 * | 90 天 | 约 26 个月 | 约 12 个月 |
 * | 180 天（当前） | 约 24 个月 | 约 10 个月 |
 * | 365 天 | 约 19 个月 | 约 8 个月 |
 *
 * 窗口越短，越早把「用户可能还想翻的明细」压成汇总；
 * 窗口越长，桌面端越早撞墙（撞墙＝写入失败，用户看到保存失败横幅）。
 * 180 天是「不动可能还想看的历史」与「别太早撞墙」之间的折中。
 *
 * ## ⚠️ 归档的能力边界（R12 实测，务必先读）
 *
 * **归档只把墙从 8 个月推到 10 个月，之后归档多少次都没用。**
 *
 * 原因：归档只压 `reviews`，而它按天汇总，**压完恒定在 0.8~0.9MB**，与用了多久无关。
 * 增长全部来自 `cards` / `schedules` / `sentenceDetails` 这些**不可压的常驻数据**：
 *
 * | 使用时长 | 归档后总体积 | 能否写入 WebKit（约 4.96MB） |
 * |---|---|---|
 * | 8 个月 | 4.35MB | ✅ |
 * | **10 个月** | **5.03MB** | **❌ 已写不下** |
 * | 24 个月 | 9.82MB | ❌ |
 *
 * 也**没有**「摘个冗余字段就好」的捷径：12 个月归档后
 * `cards` 占 35.5%、`reviews` 30.1%、`sentenceDetails` 19.1%、`schedules` 15.2%，
 * 其中唯一的真冗余（`sentenceDetails.sentence` 与 `card.front` 完全重复）
 * 只占总体 8%，摘掉也救不了。
 *
 * **结论：真正的出路是减少常驻数据的字段体积，或改用 IndexedDB 之类的
 * 容量更大的存储。** 两者都是产品级决策（涉及数据模型与迁移），
 * 不是「清理技巧」。
 *
 * ⚠️ **证据文件校正（2026-09-24 批六十八）**：上述占比与「真冗余只占 8%」
 * 由 `src/edge/verify/r12a-detail-redundancy.test.ts` 实测（实测输出
 * `cards 35.5% / reviews 30.1% / sentenceDetails 19.1% / schedules 15.2%`、
 * 冗余占总体 **8.0%**，与本注释一致）。
 * 本注释此前引的 `pf2g-detail-redundancy.test.ts` **已不存在**——
 * 同样是被改名/重组后未回改路径。
 */
export const REVIEW_DETAIL_RETENTION_DAYS = 180;

/** 归档结果，供界面说明「清理了多少」。 */
export interface ReviewArchiveResult {
  data: AppData;
  /** 被压缩的明细条数。 */
  compactedCount: number;
  /** 压缩后剩下的汇总条数。 */
  summaryCount: number;
  /** 归档前的总条数。 */
  beforeCount: number;
  /**
   * 释放量，**单位是字符，不是字节**（历史字段名有误导，保留以兼容调用方）。
   *
   * R11 记：中文数据下 `.length` 只数 1，而 WebKit 实际按 2 字节/字符计费，
   * 所以这个数**恒定小于**真实释放的额度。界面按 KB 展示时会偏小。
   * 若要用于「还能撑多久」的判断，应先过 `storageCostBytes` 换算。
   */
  freedBytes: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** 汇总记录的 id 前缀——用来识别「这条不是明细」（也便于再次归档时跳过）。 */
export const REVIEW_SUMMARY_ID_PREFIX = "review-day-";

export const isReviewSummary = (review: Review): boolean =>
  review.id.startsWith(REVIEW_SUMMARY_ID_PREFIX);

/**
 * 把超过保留窗口的复习明细按天汇总。
 *
 * 幂等：已经是汇总的记录会被再次跳过（按 id 前缀识别），
 * 所以重复调用不会产生新的汇总记录，也不会重复计入 `compactedCount`。
 */
export const compactReviewHistory = (
  data: AppData,
  options: { retentionDays?: number; now?: Date } = {}
): ReviewArchiveResult => {
  const retentionDays = options.retentionDays ?? REVIEW_DETAIL_RETENTION_DAYS;
  const now = options.now ?? new Date();
  const cutoff = now.getTime() - retentionDays * DAY_MS;

  const beforeJson = JSON.stringify(data.reviews);
  const kept: Review[] = [];
  /** 窗口外的历史按「本地日期」分组，每组留一条汇总。 */
  const oldByDay = new Map<string, Review[]>();

  for (const review of data.reviews) {
    const at = new Date(review.reviewedAt);
    const time = at.getTime();
    // 时间戳非法的记录：当作最旧的一类，按「未知日期」汇总（不丢、也不占明细位）
    if (!Number.isFinite(time)) {
      const bucket = oldByDay.get("") ?? [];
      bucket.push(review);
      oldByDay.set("", bucket);
      continue;
    }
    if (time >= cutoff || isReviewSummary(review)) {
      // 窗口内明细 + 已有汇总，一律原样保留
      kept.push(review);
      continue;
    }
    const key = `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, "0")}-${String(at.getDate()).padStart(2, "0")}`;
    const bucket = oldByDay.get(key) ?? [];
    bucket.push(review);
    oldByDay.set(key, bucket);
  }

  let compactedCount = 0;
  let summaryCount = 0;
  for (const [dayKey, bucket] of oldByDay) {
    // 一天本来就只有一条明细时，压成汇总反而没省体积（且会丢掉那条明细本身）
    if (bucket.length <= 1) {
      kept.push(...bucket);
      continue;
    }
    compactedCount += bucket.length;
    summaryCount += 1;

    /**
     * 汇总记录：保留日期与「那天的最差表现」。
     * - `rating` 取该日最低（1 最差）→ 那天有错题的事实得以保留，
     *   于是错词本的「按日分组」与连胜计算都还能看到这一天。
     * - `cardId` / `mode` 沿用该日第一条，保证结构合法（引用的卡仍在 cards 里）。
     * - `answer` 留空：汇总不声称代表某一次具体的作答。
     */
    const worst = bucket.reduce((acc, item) => (item.rating < acc.rating ? item : acc), bucket[0]);
    const first = bucket[0];
    const dateAt = new Date(first.reviewedAt);
    const stamp = `${dateAt.getFullYear()}-${String(dateAt.getMonth() + 1).padStart(2, "0")}-${String(dateAt.getDate()).padStart(2, "0")}`;
    kept.push({
      id: `${REVIEW_SUMMARY_ID_PREFIX}${stamp}`,
      cardId: first.cardId,
      mode: first.mode,
      rating: worst.rating,
      answer: "",
      reviewedAt: first.reviewedAt
    });
  }

  // 保持原有顺序（按 reviewedAt 升序），避免下游假设被打破
  kept.sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt));

  const afterJson = JSON.stringify(kept);
  return {
    data: { ...data, reviews: kept },
    compactedCount,
    summaryCount,
    beforeCount: data.reviews.length,
    freedBytes: Math.max(0, beforeJson.length - afterJson.length)
  };
};

/** 估算把历史压到今天能释放多少体积（不修改数据，用于界面提示）。 */
export const estimateCompactableBytes = (data: AppData, options: { retentionDays?: number; now?: Date } = {}): number =>
  compactReviewHistory(data, options).freedBytes;
