/**
 * R-UX2/R-UX3 课内断点续学（2026-09-19 优化 PRD Package A）。
 *
 * 两个场景共用一份快照：
 * - R-UX2（同会话）：练习中点「回去再看一遍讲解」→ 回到练习段时恢复进度，
 *   不再全量重置。快照放内存 ref 即可，但为了跨 StrictMode 双跑与页面刷新
 *   的一致性，统一走 localStorage 读写（同键）。
 * - R-UX3（跨会话）：跑到一半关掉浏览器 → 重进同课时问「从上次继续 / 重新开始」。
 *
 * 纪律：
 * - 只序列化「段 + 段内步 + 恢复所需的最小状态」，词块拼装序不落盘（重进该题重拼）。
 * - 快照超过 24 小时视为过期（默认重新开始）。
 * - 全部读写 try/catch 静默——存储失败只损失「续学」便利，不影响主流程。
 */

export interface LessonResumeSnapshot {
  lessonId: string;
  /** 保存时刻（过期判定用）。 */
  savedAt: string;
  /** 段标识（"pretest" | "watch" | "guided" | "recall" | "practice" | "challenge"）。 */
  stage: string;
  /** 段内步（watchStep、practiceIndex、outputStep 等统一为一个数字）。 */
  step: number;
  /** 恢复时的辅助状态：练习段第几题（-1 = 无）。 */
  practiceIndex: number;
  /** output 段第几步（-1 = 无）。 */
  outputStep: number;
  /** guided 段第几题（-1 = 无）。 */
  guidedIndex: number;
}

const RESUME_KEY = (lessonId: string): string => `grammar:resume:${lessonId}`;
/** 快照有效期：24 小时（PRD 验收标准）。 */
const RESUME_TTL_MS = 24 * 60 * 60 * 1000;

const hasStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

export interface LessonResumeState {
  stage: string;
  step: number;
  practiceIndex: number;
  outputStep: number;
  guidedIndex: number;
}

/** 写快照：任何失败静默（存储满 / 隐私模式只损失续学便利）。 */
export const saveLessonResume = (lessonId: string, state: LessonResumeState): void => {
  if (!hasStorage() || !lessonId) return;
  try {
    const snapshot: LessonResumeSnapshot = {
      lessonId,
      savedAt: new Date().toISOString(),
      stage: state.stage,
      step: state.step,
      practiceIndex: state.practiceIndex,
      outputStep: state.outputStep,
      guidedIndex: state.guidedIndex
    };
    window.localStorage.setItem(RESUME_KEY(lessonId), JSON.stringify(snapshot));
  } catch {
    // 存储失败静默
  }
};

/** 读快照：不存在 / 过期（>24h）/ 课不匹配 → null（默认重新开始）。 */
export const loadLessonResume = (lessonId: string): LessonResumeState | null => {
  if (!hasStorage() || !lessonId) return null;
  try {
    const raw = window.localStorage.getItem(RESUME_KEY(lessonId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LessonResumeSnapshot>;
    if (parsed.lessonId !== lessonId) return null;
    if (!parsed.savedAt || Number.isNaN(Date.parse(parsed.savedAt))) {
      window.localStorage.removeItem(RESUME_KEY(lessonId));
      return null;
    }
    if (Date.now() - Date.parse(parsed.savedAt) > RESUME_TTL_MS) {
      window.localStorage.removeItem(RESUME_KEY(lessonId));
      return null;
    }
    /**
     * 完整性校验（2026-09-20 修）：此前只查 lessonId/savedAt，其余字段直接透传。
     * 结构不完整的快照（如手写或旧版本残留）会让 practiceIndex 变成 undefined，
     * 页面随即出现「刚才练到 第 NaN 题」，点「继续刚才」后 practice[NaN] 为 undefined
     * → 练习卡整体不渲染，整屏只剩顶栏（无文字出口）。
     *
     * 现在：数字字段缺一不可、必须是有限数字，否则整条快照判无效并清除。
     */
    const numeric = ["step", "practiceIndex", "outputStep", "guidedIndex"] as const;
    const incomplete = numeric.some((key) => !Number.isFinite(parsed[key]));
    if (typeof parsed.stage !== "string" || incomplete) {
      window.localStorage.removeItem(RESUME_KEY(lessonId));
      return null;
    }
    return {
      stage: parsed.stage,
      step: parsed.step as number,
      practiceIndex: parsed.practiceIndex as number,
      outputStep: parsed.outputStep as number,
      guidedIndex: parsed.guidedIndex as number
    };
  } catch {
    return null;
  }
};

/** 清快照：用户选「重新开始」或完课时调用。 */
export const clearLessonResume = (lessonId: string): void => {
  if (!hasStorage() || !lessonId) return;
  try {
    window.localStorage.removeItem(RESUME_KEY(lessonId));
  } catch {
    // 静默
  }
};
