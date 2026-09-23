/**
 * 测试用宿主：把 ReviewPage 包在完整的 AppLayout 语义里（AppProvider + MemoryRouter），
 * 模拟真实应用「data 变化 → AppLayout 重渲染 → 页面重渲染」的链路。
 *
 * 不复用 src/App.tsx 的 AppLayout（那是内部组件），而是复刻它的两个关键计算：
 *   - computeStreak(data.reviews)      ← App.tsx:102（无 memo）
 *   - <MilestoneCelebration />（全局挂载于 App.tsx:235）
 * 这样可以在测试里插桩，量化「每次 data 变化」的全局成本。
 */
import { useEffect, useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppProvider, useAppData } from "../../AppContext";
import { computeStreak } from "../../services/statsService";
import { findNewlyReachedMilestones } from "../../services/milestoneService";
import ReviewPage from "../../pages/ReviewPage";
import type { AppData } from "../../types";

/** 计数器：导出给测试读取（模块级，测试内 import 同一实例）。 */
export const counters = {
  appLayoutRenders: 0,
  computeStreakCalls: 0,
  milestoneEffectRuns: 0,
  milestoneStates: 0
};

export const resetCounters = () => {
  counters.appLayoutRenders = 0;
  counters.computeStreakCalls = 0;
  counters.milestoneEffectRuns = 0;
  counters.milestoneStates = 0;
};

/** 复刻 App.tsx 的 MilestoneCelebration：effect 依赖 [data, updateData]，每次 data 变都跑全库统计。 */
const MilestoneProbe = () => {
  const { data } = useAppData();
  useEffect(() => {
    counters.milestoneEffectRuns += 1;
    counters.milestoneStates += findNewlyReachedMilestones(data as AppData).length;
  }, [data]);
  return null;
};

/** 复刻 App.tsx 的 AppLayout 顶部两行 + 一个真实页面。 */
const LayoutProbe = () => {
  const { data } = useAppData();
  counters.appLayoutRenders += 1;
  counters.computeStreakCalls += 1;
  // App.tsx:102 —— 无 useMemo，体量在每次渲染里
  const streak = computeStreak(data.reviews);
  return (
    <>
      <span data-testid="streak">{streak}</span>
      <MilestoneProbe />
    </>
  );
};

export default function AppLayoutHost() {
  return (
    <AppProvider>
      <MemoryRouter initialEntries={["/review"]}>
        <LayoutProbe />
        <Routes>
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </MemoryRouter>
    </AppProvider>
  );
}
