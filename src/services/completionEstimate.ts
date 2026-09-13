/**
 * 完成天数估算 · 新口径（PRD P0-2 硬依赖，数析「口径失真」修正）。
 *
 * 旧口径 `remaining / dailyNewWords` 只算新词投放天数，完全忽略 SM-2 复习尾巴。
 * 新口径用确定性模拟：
 *   1. 新词按 dailyNewWords 逐日投放（上限约束）；
 *   2. 每张卡按 MASTER_INTERVALS（1/3/7/15 天）间隔复习，完成全部间隔视为掌握；
 *   3. 每日复习量受 dailyReviewLimit 约束，超出顺延（到期优先、先进先出）；
 *   4. 返回最后一张卡掌握的日期序号。
 *
 * 典型值：115 词、10 新/日、30 复习/日 ≈ 38~42 天（与数析测算 ≈42 天一致）。
 * 确定性、无随机，可在测试中精确断言。
 */

export const MASTER_INTERVALS = [1, 3, 7, 15];

interface QueueItem {
  dueDay: number;
  /** 已完成的复习次数。 */
  stage: number;
}

export const estimateDaysToMaster = (
  totalCards: number,
  dailyNewWords: number,
  dailyReviewLimit: number,
  intervals: readonly number[] = MASTER_INTERVALS,
  maxDays = 3650
): number => {
  if (!Number.isFinite(totalCards) || totalCards <= 0) return 0;
  if (intervals.length === 0) return 1;

  const dailyNew = Math.max(1, Math.round(dailyNewWords || 10));
  const capacity = Math.max(1, Math.round(dailyReviewLimit || 30));

  let queue: QueueItem[] = [];
  let introduced = 0;
  let mastered = 0;
  let day = 0;

  while (mastered < totalCards && day < maxDays) {
    day += 1;

    // 1) 复习到期卡：到期优先，先进先出，受每日容量约束，未消化项顺延。
    let reviewSlots = capacity;
    const nextQueue: QueueItem[] = [];
    for (const item of queue) {
      if (item.dueDay <= day && reviewSlots > 0) {
        reviewSlots -= 1;
        if (item.stage + 1 >= intervals.length) {
          mastered += 1;
        } else {
          nextQueue.push({ dueDay: day + intervals[item.stage + 1], stage: item.stage + 1 });
        }
      } else {
        nextQueue.push(item);
      }
    }
    queue = nextQueue;

    // 2) 投放新词（独立于复习容量的每日上限）。
    let newSlots = dailyNew;
    while (newSlots > 0 && introduced < totalCards) {
      introduced += 1;
      newSlots -= 1;
      queue.push({ dueDay: day + intervals[0], stage: 0 });
    }
  }

  return mastered >= totalCards ? day : maxDays;
};
