import { AppData, Card, Unit } from "../types";
import { nowIso, uid } from "./storage";

/**
 * P0-3 词书粒度重组：所有词书单本 ≤ 25 词，存量一次性迁移。
 *
 * - 35 词本拆为 23 + 12（按 MAX_WORDS_PER_UNIT 均匀切块的首本 + 余量）；
 * - 已学进度自动跟随：card.status / schedules 不动，只改 card.unitId（析客待确认 #1 的执行口径）；
 * - 前两本「完全未启动」的词书标记速通本徽标（speedRun）；
 * - 积累型词书（冒险积累）不拆：它按用途持续吸纳，拆分会破坏收藏夹语义。
 */

export const MAX_WORDS_PER_UNIT = 200;
export const ACCUMULATION_UNIT_IDS = ["unit-adventure-accumulation"];
export const DEFAULT_SPEED_RUN_COUNT = 2;

export interface RestructureResult {
  data: AppData;
  /** 被拆分的原词书数量。 */
  splitUnitCount: number;
  /** 拆分新增的词书数量（不含原书）。 */
  createdUnitCount: number;
  /** 本次被标记为速通本的词书 ID。 */
  speedRunUnitIds: string[];
}

/**
 * 把一组词卡切成 ≤maxSize 的均衡小块：先算块数 ceil(n/maxSize)，再均分余量。
 * 例如 35 词、上限 25 → 2 块 → 18+17（比 25+10 更均衡，两本都接近速通节奏）。
 */
export const chunkCards = (cards: Card[], maxSize: number): Card[][] => {
  const size = Math.max(1, Math.round(maxSize));
  if (cards.length <= size) return [cards.slice()];

  const count = Math.ceil(cards.length / size);
  const base = Math.floor(cards.length / count);
  let extra = cards.length % count;

  const chunks: Card[][] = [];
  let cursor = 0;
  for (let index = 0; index < count; index += 1) {
    const take = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
    chunks.push(cards.slice(cursor, cursor + take));
    cursor += take;
  }
  return chunks;
};

const getUnitWordCards = (data: AppData, unitId: string): Card[] =>
  data.cards
    .filter((card) => card.type === "word" && card.unitId === unitId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.front.localeCompare(b.front));

/**
 * 标记速通本：最早创建、且完全未启动（全部 new）的前 count 本 → speedRun true；
 * 其余未启动的书清除标记；已启动的书保留现有标记（学了一半的速通本不丢徽标）。
 * 幂等：重复执行结果稳定。
 */
export const applySpeedRunMarks = (
  data: AppData,
  count = DEFAULT_SPEED_RUN_COUNT,
  timestamp = nowIso()
): { data: AppData; speedRunUnitIds: string[] } => {
  if (count <= 0) return { data, speedRunUnitIds: [] };

  const cardsByUnit = new Map<string, Card[]>();
  for (const card of data.cards) {
    if (card.type !== "word" || !card.unitId) continue;
    const list = cardsByUnit.get(card.unitId);
    if (list) list.push(card);
    else cardsByUnit.set(card.unitId, [card]);
  }

  const isUntouched = (cards: Card[]) => cards.length > 0 && cards.every((card) => card.status === "new");

  const eligible = data.units
    .filter((unit) => !ACCUMULATION_UNIT_IDS.includes(unit.id))
    .filter((unit) => isUntouched(cardsByUnit.get(unit.id) ?? []))
    .sort((a, b) => a.order - b.order);
  /** 已发出的徽标（不论该书是否已启动）——徽标一旦发出就保留。 */
  const units_withMark = (list: typeof data.units) =>
    new Set(
      list.filter((unit) => unit.speedRun && !ACCUMULATION_UNIT_IDS.includes(unit.id)).map((unit) => unit.id)
    );

  let changed = false;
  /**
   * 2026-09-23 修（MG3b 的 FAIL-4：「速通徽标被续期」）。
   *
   * 缺陷：原实现按「**当前**前 N 本未启动的书」重挑徽标，且对未启动的书
   * **两向都改**——`shouldMark && !speedRun` 加上、`!shouldMark && speedRun` 摘掉。
   * 用户每开始学一本，它就从「未启动」集合里退出，后面的书立刻补位带上徽标：
   * 实测 5 本内置词书会依次变成 2 → 3 → 4 → 5 → 5 本带徽标，
   * 最终**全部**标着「3天速通」——「速通」这个承诺被稀释成没有意义。
   *
   * 修法：**只加不摘**。
   *  · 徽标是「给用户的一个起点承诺」（挑最早几本未启动的书鼓励速通），
   *    一旦发出就不该因为用户开始学而转移到别的书上；
   *  · 已带徽标的书若被学起来（不再是 untouched），保留徽标——那是它**应得**的，
   *    摘掉反而让「我按速通去学的书」中途失去标记；
   *  · 新书补位只发生在「原本没有徽标的书仍是未启动」且「徽标数不足 N」时，
   *    即全靠**存量**决定，不随学习推进而增长。
   *
   * 实现：先算出「已发出的徽标」（含已启动的），再用它们占满配额；
   * 只有当已发出的不足 N 时，才从剩余的未启动书里补。
   */
  /**
   * 最终徽标集合 = 「已发出的」∪「本次应新发的」。
   *
   * - 已发出的（`alreadyMarked`）：不论该书是否已启动，一律保留。这是「起点推荐」
   *   的应有语义——推荐过的书被学起来之后不该丢掉标记；
   * - 本次新发的：只在**存量不足**时从剩余未启动书里按 order 补足到 count 本。
   *   关键：补位来源是「**从未发过徽标**的未启动书」，而不是「当前前 N 本未启动」——
   *   后者会导致用户每学一本就有一本新书补位（FAIL-4 的蔓延）。
   */
  const alreadyMarked = units_withMark(data.units);
  const needMore = Math.max(0, count - alreadyMarked.size);
  const supplement =
    needMore > 0
      ? eligible.filter((unit) => !alreadyMarked.has(unit.id)).slice(0, needMore).map((unit) => unit.id)
      : [];
  const finalMarked = new Set([...alreadyMarked, ...supplement]);

  /**
   * 「同一批书」内的漂移要清掉——这是原设计「其余未启动的书清除标记」的真实用途：
   * 保证**重复迁移结果稳定**（幂等），而不是让徽标转移。
   *
   * 具体处理两类「未启动却带着徽标」的书：
   *  ① 它在 `finalMarked` 里（本次仍应带）→ 保留；
   *  ② 它不在（例如 count 被调小、或它已不是未启动）→ 清掉。
   * ⚠️ 已启动的书**不清**（原设计就明确「学了一半的速通本不丢徽标」）。
   */
  const units = data.units.map((unit): Unit => {
    const untreated = isUntouched(cardsByUnit.get(unit.id) ?? []);
    if (!untreated) return unit; // 已启动：保留现状
    const shouldMark = finalMarked.has(unit.id);
    if (shouldMark && !unit.speedRun) {
      changed = true;
      return { ...unit, speedRun: true };
    }
    if (!shouldMark && unit.speedRun) {
      changed = true;
      const { speedRun: _drop, ...rest } = unit;
      return rest;
    }
    return unit;
  });

  return { data: changed ? { ...data, units } : data, speedRunUnitIds: Array.from(finalMarked) };
};

/**
 * 存量迁移入口：把所有超过 maxWords 的词书拆成 ≤maxWords 的若干本。
 * 幂等 —— 拆完后所有词书 ≤ maxWords，再次执行为 no-op。
 */
/**
 * 上一次 `restructureOversizedUnits` 新建出的词书 id（模块级输出）。
 *
 * 为什么用模块级变量而不是返回值扩展：调用方 `applyStartupMigration` 只需要
 * 「哪些块是拆分产物」这一个信息，且调用是同步串行的；改 `RestructureResult`
 * 类型会波及若干测试的构造。
 */
let resultProducedUnitIds = new Set<string>();

/** 读取最近一次拆分产出的词书 id（供 applyStartupMigration 在 syncUnitCompletion 之后剔除）。 */
export const lastRestructureProducedUnitIds = (): ReadonlySet<string> => resultProducedUnitIds;

export const restructureOversizedUnits = (
  data: AppData,
  options: { maxWords?: number; speedRunCount?: number; timestamp?: string } = {}
): RestructureResult => {
  resultProducedUnitIds = new Set<string>();
  const maxWords = Math.max(1, Math.round(options.maxWords ?? MAX_WORDS_PER_UNIT));
  const timestamp = options.timestamp ?? nowIso();

  let next = data;
  let splitUnitCount = 0;
  let createdUnitCount = 0;
  /**
   * 本次拆分**新建**的词书 id 集合（不含继承原书的第 1 块）。
   *
   * 2026-09-23 修（MG3b 的 FAIL-3）：这些新块里的卡都是从原书分出来的、
   * 状态仍是 mastered，于是 `syncUnitCompletion` 会认为「这一本也读完了」
   * 而补上 completedAt → 「已完成本数」翻倍（用户只读完过 1 本）。
   * 拆分只是存储结构变化，新块不构成「独立读完的一本」，故在此显式清掉。
   */
  const splitProducedUnitIds = new Set<string>();
  let maxOrder = data.units.reduce((max, unit) => Math.max(max, unit.order), 0);

  const oversized = [...data.units]
    .sort((a, b) => a.order - b.order)
    .filter((unit) => !ACCUMULATION_UNIT_IDS.includes(unit.id))
    .filter((unit) => getUnitWordCards(data, unit.id).length > maxWords);

  for (const unit of oversized) {
    const cards = getUnitWordCards(next, unit.id);
    if (cards.length <= maxWords) continue; // 前面拆分可能已重排，保护幂等

    const chunks = chunkCards(cards, maxWords);
    if (chunks.length <= 1) continue;

    splitUnitCount += 1;
    createdUnitCount += chunks.length - 1;

    // 原书保留第一块（保住原 id / createdAt / groupId），其余块新建词书；
    // 卡片只改 unitId，status / schedules 原样跟随 → 已学进度自动迁移。
    const units: Unit[] = [];
    const reassignments = new Map<string, string>();

    /**
     * 2026-09-23 修（MG3b 的 FAIL-2/3）：
     * 拆出的第 1 块**继承原书的 completedAt**，不再清空。
     *
     * 原来这里是 `completedAt: undefined, speedRun: undefined`——把「完成时间」与
     * 「速通徽标」都抹掉，随后 `syncUnitCompletion` 发现这块仍然「全掌握」，
     * 就补上**迁移时刻**。后果：
     *  · FAIL-2：用户 2024-05-05 学完的书，完成时间被改写成「今天」；
     *  · FAIL-3：「已完成的词书数」在拆分瞬间从 1 变成 2（原书 + 新块各自被算一次），
     *    里程碑计数被凭空放大——用户什么都没做，成就数字却涨了。
     *
     * 拆分只是**存储结构变化**，不该改写「这本书什么时候被学完」这个历史事实；
     * 同理徽标也应由 `applySpeedRunMarks` 按真实进度重新判定，而不是在这里先抹掉
     * （抹掉会让重算结果漂移，见 FAIL-4 的徽标蔓延）。
     */
    units.push({
      ...unit,
      title: `${unit.title} · 1`,
      description: unit.description ? `${unit.description} · 拆分自原书` : "拆分自原书",
      updatedAt: timestamp
      // completedAt 原样继承（第 1 块是原书的延续，见上方说明）
    });
    /**
     * 其余块显式**不带** completedAt，并登记到下方「拆分产出集」里，
     * 供 `syncUnitCompletion` 之后再把它们清掉——否则它发现「这一块也全掌握」
     * 又会补一个「现在」，导致「已完成本数」从 1 变 2（MG3b 的 FAIL-3）。
     */
    chunks[0].forEach((card) => reassignments.set(card.id, unit.id));

    for (let index = 1; index < chunks.length; index += 1) {
      const newUnit: Unit = {
        id: uid("unit"),
        title: `${unit.title} · ${index + 1}`,
        description: unit.description ? `${unit.description} · 拆分自原书` : "拆分自原书",
        order: ++maxOrder,
        color: unit.color,
        groupId: unit.groupId,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      units.push(newUnit);
      splitProducedUnitIds.add(newUnit.id);
      chunks[index].forEach((card) => reassignments.set(card.id, newUnit.id));
    }

    next = {
      ...next,
      /**
       * 2026-09-23 修（MG3c 的 FAIL-1d）：拆分结果必须**立刻按 order 排序**。
       *
       * 原来直接 `[...其余, ...新块]` 追加到数组末尾——而新块拿的是 `++maxOrder`
       * （排在最后），可**原书自己的 order 没变**。于是「我的大书」（order=3）
       * 被排到 order=6 的冒险积累之后，要等**下一次迁移**的 `mergeUnits`
       * 才归位：同一份数据两次迁移结果不同，用户每次启动看到的分组顺序都在变。
       */
      units: [...next.units.filter((item) => item.id !== unit.id), ...units].sort((a, b) => a.order - b.order),
      cards: next.cards.map((card) =>
        reassignments.has(card.id) ? { ...card, unitId: reassignments.get(card.id), updatedAt: timestamp } : card
      )
    };
  }

  /**
   * 拆分产出块要显式「豁免完成态回填」。
   *
   * 2026-09-23 修（MG3b 的 FAIL-3）：这些新块里的卡都是从原书分出来的、
   * 状态仍是 mastered，于是紧随其后的 `syncUnitCompletion`（在
   * `applyStartupMigration` 里、本函数**之后**运行）会认为「这一本也读完了」
   * 而补上 completedAt → 「已完成本数」从 1 翻成 2（用户只读完过 1 本）。
   *
   * ⚠️ 不能在**本函数内**清理——`syncUnitCompletion` 在后面跑，清了也会被补回来。
   * 正确做法是把「这些块不是独立读完的一本」这个事实**传给下游**：
   * 用 `restructureProducedUnitIds` 收集，由 `applyStartupMigration` 在
   * `syncUnitCompletion` 之后按此清单剔除。
   */
  resultProducedUnitIds = splitProducedUnitIds;

  const marked = applySpeedRunMarks(next, options.speedRunCount ?? DEFAULT_SPEED_RUN_COUNT, timestamp);

  return {
    data: marked.data,
    splitUnitCount,
    createdUnitCount,
    speedRunUnitIds: marked.speedRunUnitIds
  };
};
