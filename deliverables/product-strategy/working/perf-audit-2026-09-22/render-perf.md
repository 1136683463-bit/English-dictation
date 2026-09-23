# 渲染性能专项验证报告

**轮次**：性能验证（渲染专项） · **日期**：2026-09-22
**范围**：`/Users/liujun/Documents/英语听写`（React 18 + TS + Vite + vitest/jsdom）
**基线数据**：课程 197 课 / 28 季、侦探案件 206 个、语法季 28 个；课程页六段（前测/看/跟/忆/练/破）、guided 段 6 题

---

## 0. 关于 jsdom 绝对毫秒数的说明（必读）

本报告所有 `xx ms` 均为 **jsdom 环境**观测值，**不可外推到真实浏览器**。判据使用规则：

| 结论类型 | 是否可靠 | 理由 |
|---|---|---|
| 「同一份数据下 A 调用 B 次，C 调用 D 次」 | **可靠** | 计数与 DOM/布局无关，纯 JS 控制流 |
| 「无关字段变更 vs 相关字段变更的重算比值」 | **可靠** | 两侧同环境同数据，只差一个变量 |
| 「每张已完成课卡 +1.00 次遥测解析」的线性关系 | **可靠** | 拟合出的斜率，非绝对值 |
| 「O(案×课)」「O(n²)」的数量级判定 | **可靠** | 由源码结构直接读出，并用插桩计数验证 |
| 「某段耗时 X ms 占比 Y%」 | **相对比例可靠，绝对值不可靠** | 纯 V8 计算段（JSON.parse / 数组遍历）与浏览器同引擎；DOM 段 jsdom 显著偏慢 |
| 「挂载总耗时 170ms / 900ms」 | **不可靠，仅作纵向比较** | jsdom 的 DOM 构建、样式、布局均远慢于浏览器 |

本次测量中观察到 jsdom 的挂载耗时波动较大（同测试 170ms → 905ms），**因此报告正文不使用挂载总耗时作为任何结论的依据**，只使用「次数」「次数比」「斜率」与「同环境 A/B 对照」。

---

## 1. 重复渲染与无谓重算（最高价值项）

### 1.1 【P0 · 确认缺陷】依赖整个 `data` 的 memo，在无关字段变更时全部重算

**文件**：
- `src/AppContext.tsx:60-73`（`commitData` → `setDataState(next)`，每次都产出**新 data 引用**）
- `src/AppContext.tsx:85-124`（`useMemo` 的 deps 是 `[data, dataSyncStatus, saveError]`）
- 消费方：`src/pages/GrammarPathPage.tsx:634/636/637/639/641`、`src/pages/GrammarHuntPage.tsx:43/45`、`src/pages/ReviewPage.tsx:109/114/115/116` 等 20 处

**复现/测量方法**：`src/edge/verify/pf8-data-memo-fanout.test.tsx`（用例「对照：只改 card.note vs 改 grammarLessonsDone」）。
把 `GrammarPathPage` 挂在真实 `AppProvider` 下，分别注入两类 `updateData`：
- ① irrelevant：`cards[0].note = "perf-probe-…"`（任何统计都不读该字段）
- ② relevant：`grammarLessonsDone` 少一项（`summarizeLessonProgress` 真正关心）
在两次变更前后清零并对比服务层插桩计数。

**量级证据**（jsdom，同一份数据 200 卡 + 1200 条遥测 + 120 课完成）：

| 字段 | ① 只改 `card.note` | ② 改 `grammarLessonsDone` |
|---|---|---|
| `listGrammarEventsByKind` | 20 | 20 |
| `getLessonStageLock` | 6 | 6 |
| `summarizeLessonProgress` | 1 | 1 |
| `buildGrammarReviewSession` | 1 | 1 |
| `computeWeakSpotsReport` | 1 | 1 |
| `buildWeakSpotNarrative` | 1 | 1 |
| `findActiveIntervention` | 1 | 1 |
| `buildReplayLesson` | 1 | 1 |
| **合计** | **32** | **32** |

**比值 1.00 —— 无关字段变更与相关字段变更的重算规模完全相同。** 这是「依赖整个 data」的直接可测后果。

**依赖 `data` 但只用到其中少数字段的 memo（完整清单，按用户可感知程度排序）**：

| 文件:行 | memo 内容 | 实际只读 | 常见操作下的重算次数 |
|---|---|---|---|
| `GrammarPathPage.tsx:634` | `summarizeLessonProgress(data)` | `grammarLessonsDone` | 每次 `updateData` +1 |
| `GrammarPathPage.tsx:636` | `buildGrammarReviewSession(data, 24)` | `cards`+`schedules`+`sentenceDetails`+`tags` | 每次 `updateData` +1（全库到期扫描） |
| `GrammarPathPage.tsx:637` | `computeWeakSpotsReport(data)` | 遥测全量 + `diaryEntries`+`cards` | 每次 `updateData` +1（6 次遥测遍历） |
| `GrammarPathPage.tsx:639` | `buildWeakSpotNarrative(data)` | 同上（内部**又算一遍 report**） | 每次 `updateData` +1（重复计算，见 1.2） |
| `GrammarPathPage.tsx:641` | `findActiveIntervention(data)` | 遥测 2 种 kind | 每次 `updateData` +1 |
| `GrammarHuntPage.tsx:43` | `listHuntCasesWithLock(data)` | `grammarLessonsDone` | 每次作答 +1（**O(206×197)**，见 2.3） |
| `GrammarHuntPage.tsx:45` | `summarizeHuntProgress(data)` | `huntResults`+`huntAttempts` | 每次作答 +1（**O(206×结果数)**） |
| `ReviewPage.tsx:109` | `buildReviewQueue(data,…)` | `cards`+`schedules` | 每次评分 +1 |
| `ReviewPage.tsx:114/115/116` | `getLearningStats`/`getWeakStats`/`getWeakCardInsights` | `cards`+`schedules`+`reviews` | 每次评分各 +1（3 次全库扫） |
| `GrammarBoostPage.tsx:83/84/85` | `getLessonBoostTiersDone`/`suggestBoostTier`/`boostProgressLabel` | `grammarBoostsDone[lessonId]` | 每次 data 变各 +1 |
| `GrammarBoostPage.tsx:134/136` | `currentWeakSpotTag(data)` / `computeWeakSpots(data)[0]?.plain` | 遥测全量 | 每次 data 变各 +1（**同一渲染内弱点算 2 遍**） |
| `UnitsPage.tsx:212/214/216` | `getVocabularyGoalStats`/`buildDailyDirective`/`getDeadUnits` | 多处 | 每次 data 变各 +1 |
| `GrammarDiaryPage.tsx:76/91/92` | `summarizeDiaryProgress`×2 + `listDiaryEntries` | `diaryEntries` | 每次 data 变，**`summarizeDiaryProgress` 算 2 遍**（:76 与 :92） |
| `MistakeBookPage.tsx:325` | `getMistakeGroupsByDate(data)` | `reviews`+`mistakeGenerations` | 每次 data 变 +1 |
| `AdventurePage.tsx:121`、`AdventurePlayPage.tsx:433` | `getAdventureFavoriteWords(data)` | `cards` | 每次 data 变 +1 |

**用户可感知程度**：中高。用户在两处最常触发：
1. **语法地图页停留期间**答完题回来，或点「排进今日复习」——整页 5 个全库 memo + 20 次遥测 kind 过滤全部重算。
2. **侦探页每选一次罪名**——`listHuntCasesWithLock`（O(206×197)）与 `summarizeHuntProgress`（O(206×结果数)）各重算一次（实测见 2.3）。

**严重度：P0**（结构性；放大了本报告其余每一项问题的触发频率）。

---

### 1.2 【P0 · 确认缺陷】`buildWeakSpotNarrative` 内部重算 `computeWeakSpotsReport`——同一渲染内弱点统计算 2 遍

**文件**：`src/services/grammarWeakSpotsService.ts:134`
```ts
export const buildWeakSpotNarrative = (data, now = Date.now()): WeakSpotNarrative | null => {
  const { active } = computeWeakSpotsReport(data, now);   // ← 内部再算一遍
```
调用方 `src/pages/GrammarPathPage.tsx:637` 与 `:639` 是**两个并列的 memo，各自都依赖 `data`**：
```ts
const weakSpotsReport    = useMemo(() => computeWeakSpotsReport(data), [data]);  // :637
const weakSpotNarrative  = useMemo(() => buildWeakSpotNarrative(data), [data]);  // :639 ← 内部又算一遍
```

**复现/测量方法**：`pf8-data-memo-fanout.test.tsx`（「重复计算」用例）+ `pf1-path-recompute.test.tsx`。

**量级证据**：插桩显示一次 data 变化里 `computeWeakSpotsReport` 被调用 **2 次**（memo 一次 + narrative 内部一次）。单价（jsdom，1200 条遥测）：`computeWeakSpotsReport` 0.90ms / `buildWeakSpotNarrative` 0.90ms——后者内部那次重复计算**几乎就是它的全部成本**，且这次重复不受 memo 保护。

**用户可感知程度**：低到中（单次 ~1ms 量级），但它叠加在 1.1 的高频触发上。
**严重度：P0**（与 1.1 同源；属于「每次 data 变必算 2 遍」的确定性浪费，改动成本极低）。

---

### 1.3 【P2 · 可疑未证实】父组件传下的内联箭头回调

**文件**：全项目 **22 处**（`/tmp` 扫描脚本，模式 `<Component onXxx={() => …}`）：
`GrammarLessonPage.tsx:2646`（`<LessonDeepDiveCard onExpand={() => …}`）、`AdventurePage.tsx:619`、`LibraryPage.tsx:1326/1339/1352/1365`、`UnitsPage.tsx:2145/2155`、`StatsPage.tsx:309` 等。

**为什么只列为 P2**：全项目 **`React.memo` / `memo()` 使用数为 0**（`grep -rn "React.memo\|= memo(" src/ --include="*.tsx"` 无命中，排除 useMemo）。既然没有任何子组件被 `memo` 包裹，内联箭头**当前不会造成额外重渲染**——它只是「将来加 memo 时会失效」的隐患。**这不是现在的性能问题**，列此仅为记录。

---

## 2. 答题热路径：一次作答触发哪些计算

### 2.1 汇总表（插桩计数，jsdom；`src/edge/verify/pf2-answer-hotpath.test.tsx`）

| 页面 | 操作 | 触发的全库计算（每次次数） | 是否 O(全库) |
|---|---|---|---|
| **课程页** `/grammar/lesson/:id` | guided 答一题 | 失败/看答案时：`addLessonMistakeSentence`(1，全卡去重扫)；结束课：`markLessonDone`(1) | 部分（仅错句入队时） |
| **语法复习** `/grammar/review` | 答一张卡 | `applyReview`(1) + `summarizeGrammarMastery`(1) + `buildGrammarReviewTask`(1) | 是（mastery 全卡扫） |
| **语法复习** | 点「下一张」 | `buildGrammarReviewTask`(1) | 否 |
| **通用复习** `/review` | 提交评分 | `submitRating` → `setData`；`queue`/`getLearningStats`/`getWeakStats`/`getWeakCardInsights` 4 个 memo 全部失效重算 | 是（4 次全库扫） |
| **趁热练** `/grammar/boost/:id` | 答一题 | `getLessonBoostTiersDone`(1) + `computeWeakSpots`(0.5→即每 2 题 1 次) | 是（弱点统计全遥测扫） |
| **侦探页** `/grammar/hunt` | 选一次罪名 | `listHuntCasesWithLock`(1) + `summarizeHuntProgress`(1) + `appendHuntAttempt`(1) | **是，且 O(案×课)** |

### 2.2 复习页：**会话不重建**（正面结论，确认无缺陷）

`src/pages/GrammarReviewPage.tsx:51-53` 用 `useState` 惰性初值组会话：
```ts
const [session] = useState<GrammarReviewCard[]>(() =>
  diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails)
);
```
**测量**：连答 5 张后 `buildGrammarReviewSession` 调用 **0 次**、`buildGrammarReviewTask` 5 次（= 每张 1 次）。答一题只重算 `summarizeGrammarMastery`（:47，全卡扫，其中 `sentenceDetails.find` 是 O(卡) 线性查找）。

**结论：复习页不存在「每答一题重建整个会话」的问题**——与任务书的怀疑相反，这里是干净的。

### 2.3 【P0 · 确认缺陷】侦探页每个案件做一次全课程线性反查 → O(206 案 × 197 课)

**文件**：`src/services/huntService.ts:80` 与 `:99-110`
```ts
const findUnlockLesson = (caseId: string): GrammarLesson | undefined =>
  grammarLessons.find((lesson) => lesson.huntCaseIds.includes(caseId));   // ← 线性扫 197 课

export const listHuntCasesWithLock = (data: AppData): HuntCaseLockInfo[] => {
  ...
  return huntCases.map((caseItem) => {                    // ← 206 次
    const unlockLesson = findUnlockLesson(caseItem.id) ?? null;   // ← 每次扫 197 课
```
`findUnlockLesson` 还有 **O(课 × 该课的 huntCaseIds 长度)** 的第二层：`lesson.huntCaseIds.includes(caseId)` 本身是数组线性查找。

**同文件 `src/services/huntService.ts:427-434`** 第二个 O(案×结果)：
```ts
const solvedCaseIds = huntCases
  .filter((caseItem) => {
    const total = totalByCaseId.get(caseItem.id) ?? 0;
    return data.huntResults.some((result) => result.caseId === caseItem.id && result.found === total);  // ← 206 × 结果数
  })
```

**量级证据**（jsdom，206 案 / 197 课 / 800 huntAttempts / 300 huntResults）：
- `listHuntCasesWithLock` 0.25ms/次，`summarizeHuntProgress` 0.63ms/次（**单次绝对值小**）
- **但两者在侦探页的 memo deps 都是 `[data]`**（`GrammarHuntPage.tsx:43/45`），
  实测**每选一次罪名各重算 1 次**（`pf2-answer-hotpath.test.tsx`：连续作答 3 次 → 各 3 次）。

**用户可感知程度**：单次 ~0.9ms 在浏览器里更快（同为 V8 计算），**用户直接感知不明显**；但它是纯粹的、可一行修掉的 O(n²) 结构（预建 `caseId → lesson` 索引即可降到 O(案+课)），且随案件/课程数据增长而线性恶化。
**严重度**：**结构 P0 / 感知 P1**。诚实说明：以当前 206×197 的规模，它**还不足以单独造成掉帧**；被列为 P0 是因为它与 1.1 组合后出现在每一次作答路径上，且是唯一明确的 O(n²)。

### 2.4 【P0 · 确认缺陷】`AppLayout` 每次渲染都遍历全部复习记录，且无 memo

**文件**：`src/App.tsx:102`
```ts
const streak = computeStreak(data.reviews);   // ← 无 useMemo，每次渲染都跑
```
`computeStreak` 内部：`new Set(reviews.map(r => dayKey(new Date(r.reviewedAt))))` —— 每条记录构造一个 `Date`，再走 while 循环。

**另一处**：`src/App.tsx:235` 全局挂载 `<MilestoneCelebration />`，其 effect deps 是 `[data, updateData]`（`src/components/MilestoneCelebration.tsx:22`）：
```ts
useEffect(() => {
  const fresh = findNewlyReachedMilestones(data);   // → computeMilestoneStates → computeStreakWithGrace(data.reviews)
  ...
}, [data, updateData]);
```

**量级证据**（`pf7-applayout.test.tsx`，5000 条复习记录，jsdom）：

| 函数 | 单次耗时（jsdom） |
|---|---|
| `computeStreak` | 1.010ms |
| `computeStreakWithGrace` | 1.143ms |
| `findNewlyReachedMilestones` | 1.228ms |

**计数证据**（复刻 AppLayout 语义的宿主，`pf7-applayout-host.tsx`）：

| 事件 | LayoutProbe 渲染 | `computeStreak` 调用 | milestone effect |
|---|---|---|---|
| 挂载 | 1 | 1 | 1 |
| 点「显示答案」（纯 UI 态） | 1（+0） | 1（+0） | 1（+0） |
| **提交评分（data 变）** | **2（+1）** | **2（+1）** | **2（+1）** |

**`computeStreak` 调用数 === 渲染数**（1===1、2===2）——证明它完全无 memo 保护。

**用户可感知程度**：每一次作答（任何页面）都触发一次全复习记录遍历 + 一次全记录遍历（milestone）。5000 条记录下合计约 2.2ms/作答（jsdom）。真实用户积累到数千条记录后，这个成本随历史线性增长——**这是唯一一个「用得越久越慢」的常驻项**。
**严重度：P0**（明确无 memo + 每次渲染 + 随使用时长线性增长）。

### 2.5 【P1 → P2 · 确认缺陷（部分已缓解）】GrammarPathPage 的 `readCompletedAt` 逐张课卡重复做全量遥测「读取 + 线性过滤」

> ⚠️ **测量过程中 `src/services/grammarTelemetry.ts` 被并发改动**：有另一个 agent 在本次验证进行中给 `readEvents()` 加了字符串比对缓存（`:645-664`，`cachedEvents`/`cachedRaw`）。因此本节给出**修复前/修复后两套数字**，并修正了计数方法。

**文件**：`src/pages/GrammarPathPage.tsx:742-745`
```ts
const readCompletedAt = (lessonId: string): string | null => {
  const events = listGrammarEventsByKind("grammar_lesson_completed").filter((e) => e.lessonId === lessonId);
  return events.length > 0 ? events[events.length - 1].completedAt : null;
};
```
调用链：`renderStageChain(lesson)`（`:760`）对**每张已完成课卡**执行，内部对 3 个 stage 各调一次 `getLessonStageLock(data, lesson.id, stage, readCompletedAt)`；`getLessonStageLock` 只在 **stage===2** 时调用 `readCompletedAt`。→ **每张已完成课卡 = 1 次全量遥测读取 + 全量 `filter`。**

即使有缓存，**每次调用仍是 O(全部遥测条数)**：
`listGrammarEventsByKind`（`grammarTelemetry.ts:751-754`）→ `listGrammarEvents()`（`:**726**`）→ `return [...readEvents()]` ← **每次都展开复制整个数组**，然后 `.filter()` 再扫一遍。缓存只省掉了 `JSON.parse`，**没省掉两次 O(n) 数组操作**。

#### 修复前（无缓存，`readEvents` 直接 `JSON.parse`）

**量级证据**（`pf6c-attribution.test.tsx`，固定展开同一季、只改该季已完成课数）：

| 第 1 季内已完成课数 | 展开该季触发的遥测解析次数 |
|---|---|
| 0 | 0 |
| 3 | 3 |
| 6 | 6 |
| 9 | 9 |
| 12 | 12 |

**斜率 = 1.00 次/张已完成课卡**（4 段全部为 1.00 次/张）。

**最坏情况**（`pf6-telemetry-amplification.test.tsx`，197 课全完成 + 遥测 3000 条 / 209KB）：挂载 + 落定期间 `getItem` **85 次**，解析文本总量 **34.8MB**。

#### 修复后（有缓存）—— 复测结论

**测量方法修正**：`pf6/pf6b/pf6c` 统计的是 `localStorage.getItem` 次数 —— 缓存**校验**仍需每次 `getItem` 拿原始字符串比对，所以 `getItem` 次数**不变**，它不是正确的成本指标。新增 `pf6d-postcache-verify.test.tsx` **直接包装 `JSON.parse`**（只统计 ≥100KB 的遥测体量解析）重新测量：

| 指标 | 197 课全完成 | 零进度 |
|---|---|---|
| 遥测体积 | 209KB | 209KB |
| **真实 `JSON.parse`（遥测体量）** | **1 次**（0.2MB，0.3ms） | **1 次** |
| `getItem(遥测)` 调用 | 69 次 | 52 次 |
| 缓存命中率 | **99%** | — |
| 全部 `JSON.parse`（含小对象） | 201 次 | 33 次 |

**结论修正**：缓存把 `JSON.parse` 次数从 85 降到 **1**，**本项的主要成本已被并发修复消除**。剩余成本是每次 `getItem` 返回并比对 209KB 字符串（69 次 ≈ 14MB 字符串读取 + 比较）—— 这仍是可观的同步 IO + 比较开销，但**已不是解析开销**。

**用户可感知程度**：**低**（修复后）。原先「展开一季 = 已完成课数次全量 JSON 解析」的问题已不复存在；剩下的是 O(n) 数组复制+过滤（`listGrammarEvents()` 的 `[...readEvents()]` + `.filter()`），单价按 1500 条计为亚毫秒级。
**严重度：P2（从 P1 下调）**。附带的仍然成立的小问题：`listGrammarEvents()`（`:726`）每次调用都无条件复制整个数组，可以改为只读返回或按 kind 建索引。

### 2.6 【确认 · 修复前量级】一次挂载的历史观测（保留作为回归基线）

以下是缓存落地**之前**测得的数字，保留作为「若缓存被回退会有多严重」的基线记录：

| 指标 | 值（缓存前，jsdom） |
|---|---|
| `getItem(遥测)` | 52–85 次 |
| 真实 `JSON.parse`（遥测体量） | 52–85 次 |
| 解析文本总量 | **14.2MB**（259KB 遥测）/ **34.8MB**（3000 条 / 419KB 满容量） |
| 折合纯解析 | 25–98ms |
| 平均每张当屏课卡 | 4.3 次解析 |

消费方规模：全项目 **29 处 `listGrammarEventsByKind` 调用点**（`grep` 计数），每一处都触发一次全量读取。**建议为这 29 个调用点补一条守门测试**，确保缓存不会被无意的「绕过缓存直读」改回去。

---

## 3. 长列表渲染：实际 DOM 节点数 vs 数据条数

**测试文件**：`src/edge/verify/pf3-longlist-dom.test.tsx`

### 3.1 语法地图（197 课 / 28 季）

| 场景 | 季卡 | 课卡 | **总 DOM 节点** | `<a>` | `<button>` |
|---|---|---|---|---|---|
| 默认（只展开「下一课」所在季） | 28 | **16** | **789** | 99 | 30 |
| 逐季展开的最大值 | 28 | 16 | 789 | — | — |
| **全 28 季课卡累计** | — | **197** | — | — | — |
| 假想「28 季同开」的线性外推 | — | 197 | **≈9,715** | — | — |

**关键发现（正面）**：季卡是**单选折叠**（`GrammarPathPage.tsx:676-681` `toggleGroup` 的 `openSeasonId` 单值状态机），**任意时刻只展开 1 季**。因此：
- 默认渲染 **789 节点 / 16 张课卡**，不是 197 张课卡的约 9,700 节点。
- 这是**有效的手工虚拟化**——按季分片 + 单选展开，天然把首屏 DOM 压到 197 课的 8%。
- 每张课卡约 **49.3 节点**（含三关卡链 `.lesson-stage-node` + 3 个档位 `<Link>`）。这是 16 张课卡 → 789 节点的原因。

**用户滚到底需要渲染多少**：用户要点开季卡才看到该季课表。逐季展开一遍的**累计**课卡数是 197（全课都能看到），但**任一时刻 DOM 里只有 1 季 ≈ 最多 16 张课卡**。**不存在「197 课一次性铺满 DOM」**。

### 3.2 侦探案件列表（206 案）

| 场景 | 分组 | 案件卡 | **总 DOM 节点** |
|---|---|---|---|
| 默认（只展开「下一案」所在组） | **29** | **11** | **452** |
| 展开全部分组 | 29 | **206** | **1,650** |
| 单案打开（判题热路径） | — | — | 452 → **75 节点**（案内 3 个按钮） |

**关键发现（需注意）**：侦探页有分组折叠（`GrammarHuntPage.tsx:476-535`，默认展开规则在 `:164-176`），但**不是单选**——用户可以逐个展开所有 29 个分组，此时 **206 张案件卡全部渲染 = 1,650 节点**。

**对照**：
- 数据条数 **206 案** → 全展开 **1,650 DOM 节点**（8.0 节点/案，扁平卡片无嵌套重内容，可接受）
- 对比语法地图的 16 张课卡 = 789 节点（49.3 节点/课），侦探案件卡是轻量卡

**没有虚拟化、没有分页**（两页都无 `window` 限制渲染的代码，无 `content-visibility`）。但凭分组折叠，**默认首屏分别只有 11 案 / 16 课**，属于「用户主动展开才付成本」的可接受设计。

**用户滚到底需要渲染多少**：案件列表要滚到底必须展开全部 29 组 → **1,650 节点**。以 1,650 节点的规模，真实浏览器单次渲染通常 <16ms，**不构成掉帧风险**。列为观察项，非缺陷。

**严重度：P2**（无虚拟化，但当前数据规模下折叠机制足够；若案件数再翻倍需重估）。

---

## 4. 事件与监听器

**测试文件**：`src/edge/verify/pf4-listeners.test.tsx`（包装 `window`/`document`/`document.body` 的 `addEventListener`/`removeEventListener`，统计净活跃数与每次渲染的新增注册数）

### 4.1 【P1 · 确认缺陷】`ReviewPage` 的 keydown effect 缺少依赖数组 → 每次渲染重注册

**文件**：`src/pages/ReviewPage.tsx:136-149`
```ts
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { ... };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });          // ← 没有第二个参数！每次渲染都卸载+重装
```

**静态扫描佐证**：对 `src/pages/**` + `src/components/**` + `App.tsx` + `AppContext.tsx` 全量扫描 `useEffect(...)` 的调用尾部是否带依赖数组，**命中且仅命中 1 处**：`src/pages/ReviewPage.tsx:136`。其余所有 effect 都带依赖数组。

**计数证据**（渲染 N 次后的监听器数量）：

| 指标 | 值 |
|---|---|
| 挂载后活跃监听器 | 2（其中 `window:keydown` 净数量 **1**） |
| 8 次渲染各自新增 `addEventListener` | **1, 1, 1, 1, 1, 1, 1, 1** |
| 累计 add / remove | 10 / 8 |
| 10 次渲染后活跃（基线 1） | **1**（add=11, remove=10，差 1） |

**结论**：`add`/`remove` **配平**（每次渲染 1 add + 1 remove），**净数量恒为 1，不累积泄漏**。因此：
- **不是内存泄漏**（没有监听器堆积）
- 但**每次渲染都执行一次 remove + 一次 add**，且 effect 闭包会在每次渲染重新创建 `handleKey`
- 8 次渲染 = 8 次多余的 remove/add 配对（外加 8 次闭包分配）

**用户可感知程度**：低。单次 remove+add 是 O(1)（同一 type/capture 只挂 1 个）。但它出现在**通用复习页的每次评分路径上**（每次评分 = 至少 1 次渲染 = 1 次重注册），且每次渲染都会重建闭包、捕获当时的 `card`/`handleRatingClick`（后者又依赖 `data`）。**列为 P1 而非 P0：不泄漏、不直接掉帧，但明确是「每次渲染的无谓工作」，且掩盖了闭包陈旧值的风险面**。

### 4.2 其余页面的监听器计数（均为干净）

| 页面 | 挂载后活跃监听器 | 6 次渲染各自新增注册 | 卸载后活跃 |
|---|---|---|---|
| `GrammarPathPage` | 0 | 0,0,0,0,0,0 | 0 |
| `GrammarReviewPage` | 6（`window:keydown:true`×2、`window:pointerdown:true`×2 + 2 个 jsdom 内部） | 0,0,0,0,0,0 | 2（jsdom 内部） |
| `SpellingPage` | 1（`window:keydown`） | 0,0,0,0,0,0 | 0 |
| `UnitsPage` | 0 | 0,0,0,0,0,0 | 0 |
| `LibraryPage` | 1（`window:keydown`） | 0,0,0,0,0,0 | 0 |

**清理函数齐全性**：重复挂载/卸载 5 轮，`GrammarReviewPage` 每轮卸载后活跃监听器 **0 → 0 → 0 → 0 → 0**（无泄漏）。

**关于「卸载后剩余 2 个监听器」的澄清**：测试中观察到 `document:selectionchange` / `document:mouseover` / `document:mouseout` 三个监听器在卸载后仍然存在。**经栈追踪确认这不是产品代码**——来源是 jsdom 自身的 CSS 选择器引擎 `nwsapi`（`node_modules/nwsapi/src/nwsapi.js:1771`，由 `document.querySelector` 首次调用触发并常驻）。用一个仅渲染 `<div>hello</div>` 的空组件做基线对照，同样出现 `document:selectionchange`。**排除，不是缺陷。**

### 4.3 `useReturnFocus`（`src/components/useReturnFocus.ts:34-47`）

- 依赖数组 `[]`，正确；清理函数齐全
- 每次挂载注册 **2 个捕获阶段监听器**（`keydown` + `pointerdown`，均 `capture: true`）
- `GrammarReviewPage` 挂载后 `window:keydown:true`×2 + `window:pointerdown:true`×2 = 4 个
  （×2 是因为页面上有两个 `useReturnFocus` 调用点：`:74` 与 `:81`）
- 卸载后归零，无泄漏
- **注意**：第二个 effect（`:49-67`）**不是**事件监听，而是「焦点丢失后补偿」，依赖 `[active, dep]`，由 `lastHandledRef` 去重。**不是热路径**（只在 dep 变化时尝试一次）。

---

## 5. 首屏关键路径：同步耗时分解

**测试文件**：`src/edge/verify/pf5-startup.test.tsx`
**数据体量**：JSON 615KB / 卡 400 / 计划 400 / 复习 3000 / 日记 60 / 完成课 197

### 5.1 分解（`loadData`，`src/services/storage.ts:1215-1261`）

| 阶段 | 源码 | 耗时（jsdom） | 占比 |
|---|---|---|---|
| ① `JSON.parse`（localStorage 读入） | `:1216` `getItem` → `migrateData(json)` 内部解析 | 1.32ms | 17% |
| ② `migrateData` 全库归一化 | `:979-1140` | **3.48ms** | **44%** |
| ③ `JSON.stringify` + 写回盘 | `:1241` `writeRaw` | **3.02ms** | **39%** |
| ④ `summarizeStartupRepairs` | `:1239` | 0.01ms | ~0% |
| **`loadData` 合计** | | **7.77ms** | 100% |

**② `migrateData` 分段成本**（插桩，隔离各字段）：

| 输入 | 耗时（jsdom） |
|---|---|
| 全量（基准） | 3.49ms |
| 仅 cards（400） | 0.89ms |
| 仅 reviews（3000） | 1.14ms |
| 仅 diaryEntries（60） | 0.39ms |
| 空数据 | 0.01ms |

→ `cards` 与 `reviews` 是主要成本，与条数成正比（预期）。

### 5.2 AppProvider 挂载时的**同步副作用**（比 loadData 本身更值得关注）

**测量方法**：改 `Storage.prototype.getItem/setItem` 计数（jsdom 的 `Storage` 实例属性是 getter，直接赋值无效——必须改 prototype）。

一次「AppProvider + 语法地图」挂载（数据 631KB 主数据 + 259KB 遥测）：

| 指标 | 值 |
|---|---|
| `localStorage.getItem` 调用 | **237 次** |
| `localStorage.setItem` 调用 | **3 次** |
| 其中 `personal-vocab-app-data-v1` | **2 次，共 1,265KB** |
| 其中 `grammar-telemetry-events-v1` | 1 次，259KB |

**两个可推迟/可省的同步项**：

**① 【P1】启动时主数据被写回 1.2MB（2 次）**
- 第 1 次：`loadData` 的 `writeRaw(migrated)`（`storage.ts:1241`）——**注释说明这是 2026-09-22 的 P0 修复**（此前迁移跑两次导致内存/磁盘分叉），所以这 1 次写是**有意的正确行为**，不宜回退。
- 第 2 次：`GrammarPathPage.tsx:626-632` 的 R04 存量回填 effect → `updateData(...)` → `commitData` → `saveData`（`storage.ts:1303` 内部**又跑一遍 `migrateData` 全库**）→ 再写 634KB。
- **可推迟性**：回填是幂等空跑（`backfillLessonCoreSentences` 内 `addLessonCoreSentence` 自带去重），零进度用户也照跑一遍完整 `migrateData` + 634KB 序列化。**完全可以延后到 `requestIdleCallback` / 首次用户交互之后**。

**② 【P2 · 已缓解】遥测 blob 在一次挂载内被读取 52–85 次**
- `readEvents()`（`grammarTelemetry.ts:645-664`，**测量途中被并发 agent 加了缓存**）**原本无缓存**，每次调用都 `JSON.parse` 整个 blob
- 修复前：挂载 + 回填落定期间遥测 `getItem` **52–85 次**；259KB 遥测下合计解析 **14.2MB** 文本；419KB（主键满 3000 条）下 **34.8MB**
- **修复后复测（`pf6d-postcache-verify.test.tsx`，直接计数 `JSON.parse`）：真实解析从 85 次降到 1 次**（缓存命中率 99%）。该问题**已基本消除**
- 残留：69 次 `getItem` 各返回并比对一次 209KB 字符串（≈14MB 字符串读取+比较），以及 `listGrammarEvents()`（`:726`）每次都 `[...readEvents()]` 复制整个数组。**建议改为按 kind 建索引**，以同时消掉 29 处调用点的 O(n) 过滤

**③ 写盘路径的隐性成本（确认，但影响小于预期）**

| 操作 | 耗时（jsdom） |
|---|---|
| `saveData(data)`（迁移 + 序列化 + 写盘） | 1.86ms |
| 仅 `JSON.stringify(data)`（对照） | 1.75ms |
| **比值** | **1.1×** |

`saveData`（`storage.ts:1268-1271`）每次都对**整库**再跑一次 `migrateData`。1.1× 说明在 615KB 体量下 `migrateData` 对已归一化数据的边际成本较小（归一化函数多数走「值已合法则原样返回」的快路径）。**列为 P2：结构上冗余，当前量级下不值得单独修**。

### 5.3 【确认】`loadData` 是幂等的

连续调用两次：第一次 7.01ms，第二次 6.86ms（jsdom）→ **无递增成本**，`seededWordVersions` 守卫（`storage.ts` `seedCoreWords`）正确阻止重复播种。

---

## 6. 确认的缺陷 vs 可疑但未证实

### 确认的缺陷（有计数/斜率证据）

> **关于并发改动**：本次验证执行期间，`src/services/grammarTelemetry.ts` 被另一个 agent 加入了 `readEvents` 缓存。第 7 项因此从 P1 降为 P2（复测见 2.5/2.6）。其余各项已对**当前代码**逐行复核（见下「行号复核」）。

| # | 问题 | 文件:行 | 严重度 |
|---|---|---|---|
| 1 | 依赖整个 `data` 的 memo 在无关字段变更时全部重算（比值 1.00） | `AppContext.tsx:60-73,85-124` + 20 处消费方 | **P0** |
| 2 | `buildWeakSpotNarrative` 内部重算 `computeWeakSpotsReport`（同渲染 2 遍） | `grammarWeakSpotsService.ts:134` | **P0** |
| 3 | `computeStreak(data.reviews)` 无 memo，每次渲染全量遍历 | `App.tsx:102` | **P0** |
| 4 | `MilestoneCelebration` effect 每次 data 变全量遍历 reviews | `App.tsx:235` + `MilestoneCelebration.tsx:22` | **P0** |
| 5 | `listHuntCasesWithLock` O(206 案 × 197 课) + `summarizeHuntProgress` O(206×结果数)，每作答 1 次 | `huntService.ts:80,99-110,427-434` | **P0（结构）/ P1（感知）** |
| 6 | `readCompletedAt` 逐张已完成课卡做全量遥测读取 + 线性过滤（斜率 **1.00/课卡**） | `GrammarPathPage.tsx:742-745` | **P2**（原 P1；`JSON.parse` 部分已被并发缓存修复，O(n) 复制/过滤仍在） |
| 7 | `readEvents()` 无缓存 → 一次挂载解析 14–35MB 遥测文本 | `grammarTelemetry.ts:645-664` | ~~P1~~ → **P2（已被并发修复降至 1 次解析，保留为回归基线）** |
| 8 | `ReviewPage` keydown effect 缺依赖数组，每次渲染重注册（1 add + 1 remove/渲染，不泄漏） | `ReviewPage.tsx:136-149` | **P1** |
| 9 | 启动回填 effect 触发第二次 634KB 全库迁移+写盘，可推迟 | `GrammarPathPage.tsx:626-632` | **P1** |
| 10 | 启动时主数据写盘 2 次 / 合计 1,265KB | `storage.ts:1241` + 回填 | **P1** |

**行号复核**（对当前工作区逐行验证，均在报告写作时确认无误）：
- `App.tsx:102` → `const streak = computeStreak(data.reviews);` ✅
- `App.tsx:235` → `<MilestoneCelebration />`（:234 为 `<OnboardingGuide />`）✅
- `ReviewPage.tsx:136` 起的 effect 以 `});` 结束（无依赖数组）✅
- `grammarWeakSpotsService.ts:134` → `const { active } = computeWeakSpotsReport(data, now);` ✅
- `GrammarPathPage.tsx:742-745` → `readCompletedAt` 完整实现 ✅
- `GrammarPathPage.tsx:760` → `getLessonStageLock(data, lesson.id, stage, readCompletedAt)` ✅
- `huntService.ts:80-81` → `findUnlockLesson` 的 `grammarLessons.find(...)` ✅
- `grammarTelemetry.ts:726` → `listGrammarEvents = () => [...readEvents()]` ✅

### 可疑但未证实

| 问题 | 为何未证实 |
|---|---|
| 内联箭头回调导致子组件重渲染 | 全项目 `React.memo` 使用数为 **0**，当前**不会**造成额外渲染；仅记录为将来隐患（`pf` 扫描命中 22 处） |
| `saveData` 的重复 `migrateData` | 实测仅 **1.1×** `JSON.stringify`（615KB 体量），当前不值得单独修 |
| 侦探页 1,650 节点（206 案全展开）是否掉帧 | jsdom 无法测布局/绘制；1,650 节点在浏览器通常 <16ms，未证实为问题 |
| `GrammarDiaryPage` 的 `summarizeDiaryProgress` 同渲染算 2 遍（`:76` + `:92`） | 计数确认调用 2 次；未测单价（日记条目少，预期不显著） |
| jsdom 观测到的 `document:selectionchange/mouseover/mouseout` 残留监听器 | **已排除**：栈追踪指向 jsdom 自身 `nwsapi`，空组件基线同样出现 |

### 排查后确认「无问题」的项（正面结论）

- **复习页不重建会话**：`buildGrammarReviewSession` 挂载后调用 0 次（连答 5 张）；`useState` 惰性初值用法正确（`GrammarReviewPage.tsx:51-53`）
- **语法地图不做 197 课全量 DOM**：季卡单选折叠，任一时刻 ≤16 张课卡 / 789 节点
- **监听器无泄漏**：5 轮挂载/卸载后活跃数归零；`useReturnFocus` 依赖数组与清理函数正确
- **`loadData` 幂等**：连调两次无递增成本
- **全项目仅 1 处 effect 缺依赖数组**（`ReviewPage.tsx:136`），其余全部带数组

---

## 7. 新增测试文件与运行结果

| 文件 | 覆盖 | 用例数 |
|---|---|---|
| `src/edge/verify/pf1-path-recompute.test.tsx` | 语法地图各全库统计的调用次数、点季卡是否重算 | 4 |
| `src/edge/verify/pf2-answer-hotpath.test.tsx` | 四页答题热路径插桩计数 + 基线单价 | 9 |
| `src/edge/verify/pf3-longlist-dom.test.tsx` | 197 课 / 206 案的 DOM 节点数 vs 数据条数 | 4 |
| `src/edge/verify/pf4-listeners.test.tsx` | 监听器净数量、每次渲染新增注册数、泄漏检查 | 5 |
| `src/edge/verify/pf5-startup.test.tsx` | 启动耗时分解、`getItem`/`setItem` 计数、遥测重解析 | 6 |
| `src/edge/verify/pf6-telemetry-amplification.test.tsx` | 遥测读取放大（含主键满 3000 条最坏情况） | 4 |
| `src/edge/verify/pf6b-readcompletedat.test.tsx` | `readCompletedAt` 放大 vs 已完课数 | 2 |
| `src/edge/verify/pf6c-attribution.test.tsx` | 遥测解析来源归因（斜率隔离） | 2 |
| `src/edge/verify/pf6d-postcache-verify.test.tsx` | **直接计数 `JSON.parse`**（缓存落地后复测，修正 getItem 指标的偏差） | 2 |
| `src/edge/verify/pf7-applayout.test.tsx` + `pf7-applayout-host.tsx` | AppLayout 级 `computeStreak` 无 memo 计数 | 4 |
| `src/edge/verify/pf8-data-memo-fanout.test.tsx` | 无关 vs 相关字段变更的重算对照（决定性的比值 1.00） | 4 |

**运行结果**：
```
Test Files  11 passed (11)
     Tests  46 passed (46)
```

**类型检查**：`npx tsc --noEmit` 对这 11 个文件（含 `pf7-applayout-host.tsx`）**零报错**。

**测试纪律**：
- 全部测量通过 `vi.mock` 包装服务模块插桩计数、包装 `Storage.prototype` / `EventTarget.prototype` / `JSON.parse` 计数，**未修改任何 `src/` 下的产品代码**
- 未使用绝对阈值断言性能；断言只针对「调用次数 > 0」「调用数 === 渲染数」「5 轮后无泄漏」「斜率单调」这类**确定性、与环境无关**的性质
- 已删除探路用的临时测试文件（`pf0-probe`、`pf4b/c/d/e`）
- **测量方法的一次自我纠正**：`pf6`/`pf6b`/`pf6c` 早先以 `localStorage.getItem` 次数作为「遥测解析次数」的代理指标。缓存加入后该指标失真（缓存校验仍需 `getItem`），故新增 `pf6d` 直接包装 `JSON.parse` 复测。**报告中凡涉及解析次数处，以 `pf6d` 的 `JSON.parse` 直接计数为准。**

**注意：同目录下存在其他 agent 并发产出的 `pf*` 文件**（`pf1-telemetry-perf`、`pf2Scale`、`pf2a`–`pf2g`、`pf4-save-cost`、`pf5-write-side-coupling` 等），不属于本次交付，未纳入上表。`pf4-save-cost` 与 `pf5-write-side-coupling` 的命名与本次的 `pf4-listeners` / `pf5-startup` 相邻，阅读时请注意区分。

---

## 8. 修复优先级建议（不实现，仅排序）

1. **`App.tsx:102` 给 `computeStreak` 加 `useMemo(..., [data.reviews])`** —— 一行，消除「每次渲染 × 全历史遍历」，且随使用时长恶化。**本报告中最值得优先修的一项**（唯一随使用时长线性增长的常驻项）。
2. **`GrammarPathPage.tsx:639` 复用已有的 `weakSpotsReport`** —— 让 `buildWeakSpotNarrative` 接受已算好的 report（或把两个 memo 合并），消除同渲染重复。
3. **把 `[data]` 依赖收窄到实际字段** —— 优先 `GrammarPathPage`（5 个 memo）、`GrammarHuntPage`（2 个，含 O(n²)）、`ReviewPage`（4 个）、`UnitsPage`（3 个）。
4. **`huntService.ts:80` 预建 `caseId → lesson` 索引**（模块级 `Map`，数据是静态的）—— 把 O(206×197) 降到 O(206+197)。
5. **`ReviewPage.tsx:136` 补依赖数组** —— 一行。
6. **`GrammarPathPage.tsx:626` 的回填 effect 延后到空闲期** —— 消除启动时的第二次 634KB 迁移+写盘。
7. **`grammarTelemetry.listGrammarEvents()`（`:726`）去掉无条件数组复制，或按 kind 建索引** —— 一次性消掉 29 处调用点的 O(n) 过滤；并为 `readEvents` 缓存补一条守门测试防回退。

### 已由并发改动完成/缓解的项

- 第 7 项（`readEvents` 无缓存）—— 另一个 agent 已加 `cachedRaw` 字符串比对缓存，`JSON.parse` 从 85 次降到 **1 次**（复测见 2.5）。**建议补守门测试**，并注意残留的 `getItem` 字符串读取与 `listGrammarEvents` 数组复制（建议 7）。
